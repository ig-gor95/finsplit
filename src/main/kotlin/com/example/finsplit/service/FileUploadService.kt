package com.example.finsplit.service

import com.example.finsplit.domain.*
import com.example.finsplit.dto.AccountMetadata
import com.example.finsplit.domain.Money
import com.example.finsplit.dto.FileUploadResponse
import com.example.finsplit.dto.ParsedTransaction
import com.example.finsplit.parser.TransactionFileParser
import com.example.finsplit.repository.AccountBalanceRepository
import com.example.finsplit.repository.AccountRepository
import com.example.finsplit.repository.TransactionRepository
import com.example.finsplit.repository.UploadedFileRepository
import org.slf4j.LoggerFactory
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.multipart.MultipartFile
import java.math.BigDecimal
import java.security.MessageDigest
import java.time.LocalDate
import java.time.LocalDateTime
import java.util.UUID

@Service
class FileUploadService(
    private val transactionRepository: TransactionRepository,
    private val accountRepository: AccountRepository,
    private val uploadedFileRepository: UploadedFileRepository,
    private val accountBalanceRepository: AccountBalanceRepository,
    private val fileParsers: List<TransactionFileParser>
) {

    private val logger = LoggerFactory.getLogger(FileUploadService::class.java)

    @Transactional
    fun uploadAndProcessFile(file: MultipartFile, bankType: BankType): FileUploadResponse {
        val fileName = file.originalFilename ?: throw IllegalArgumentException("File name is required")
        val user = getCurrentUser()
        
        logger.info("Starting file upload for user ${user.id}: $fileName, bank: $bankType")
        
        // Find appropriate parser
        val parser = fileParsers.firstOrNull { it.canParse(bankType, fileName) }
            ?: run {
                logger.error("No parser found for bank $bankType and file format: $fileName")
                throw IllegalArgumentException("No parser available for bank $bankType with file format: $fileName")
            }

        val errors = mutableListOf<String>()
        
        // Parse file
        val parseResult = try {
            file.inputStream.use { parser.parse(it, fileName) }
        } catch (e: Exception) {
            logger.error("Failed to parse file $fileName", e)
            throw IllegalArgumentException("Failed to parse file: ${e.message}")
        }

        val parsedTransactions = parseResult.transactions
        val accountMetadata = parseResult.accountMetadata

        if (parsedTransactions.isEmpty()) {
            logger.warn("No transactions found in file: $fileName")
            throw IllegalArgumentException("No transactions found in file")
        }
        
        logger.info("Parsed ${parsedTransactions.size} transactions from $fileName")
        
        // Require account metadata
        if (accountMetadata == null) {
            logger.error("No account metadata found in file: $fileName")
            throw IllegalArgumentException("File must contain account information. No account metadata found in file.")
        }
        
        // Create or find account
        val account = findOrCreateAccount(user, accountMetadata)
        logger.info("Using account: ${account.accountNumber} - ${account.clientName}")
        
        // Create uploaded file record
        val uploadedFile = UploadedFile(
            userId = user.id,
            accountId = account.id,
            fileName = fileName,
            bankType = bankType,
            fileSize = file.size,
            totalTransactions = parsedTransactions.size,
            importedTransactions = 0,  // Will update after processing
            updatedTransactions = 0,
            skippedTransactions = 0,
            status = UploadStatus.PROCESSING
        )
        val savedFile = uploadedFileRepository.save(uploadedFile)
        logger.info("Created file record: ${savedFile.id}")

        // Process transactions
        var importedCount = 0
        var updatedCount = 0
        var skippedCount = 0

        // Generate external IDs for all parsed transactions
        val parsedWithIds = parsedTransactions.map { parsed ->
            parsed to generateExternalId(parsed, user.id)
        }

        // Check which transactions already exist
        val externalIds = parsedWithIds.map { it.second }
        val existingTransactions = transactionRepository.findByUserIdAndExternalIdIn(user.id, externalIds)
            .associateBy { it.externalId }

        parsedWithIds.forEach { (parsed, externalId) ->
            try {
                val existing = existingTransactions[externalId]
                
                if (existing != null) {
                    // Update existing transaction
                    val updated = updateTransaction(existing, parsed, fileName, account, savedFile.id)
                    transactionRepository.save(updated)
                    updatedCount++
                    logger.debug("Updated transaction: ${parsed.documentNumber}")
                } else {
                    // Create new transaction
                    val newTransaction = createTransaction(user, parsed, externalId, fileName, account, savedFile.id)
                    transactionRepository.save(newTransaction)
                    importedCount++
                    logger.debug("Created new transaction: ${parsed.documentNumber}")
                }
            } catch (e: Exception) {
                val errorMsg = "Failed to process transaction ${parsed.documentNumber}: ${e.message}"
                logger.error(errorMsg, e)
                errors.add(errorMsg)
                skippedCount++
            }
        }

        logger.info("File upload completed for $fileName: imported=$importedCount, updated=$updatedCount, skipped=$skippedCount")

        // Save closing balance if present
        logger.info("Account metadata: closingBalance=${accountMetadata.closingBalance}, statementDate=${accountMetadata.statementDate}")
        
        if (accountMetadata.closingBalance != null) {
            // Find the latest transaction date in the uploaded file
            val latestUploadedTransactionDate = parsedTransactions
                .maxOfOrNull { it.transactionDate }
            
            logger.info("Attempting to save balance: date=${accountMetadata.statementDate}, balance=${accountMetadata.closingBalance}, latest tx date=$latestUploadedTransactionDate")
            
            saveAccountBalanceIfLatest(
                user = user,
                account = account,
                balanceDate = LocalDate.now(),
                balance = accountMetadata.closingBalance,
                currency = accountMetadata.currency ?: account.currency,
                fileId = savedFile.id,
                latestTransactionDateInFile = latestUploadedTransactionDate
            )
        } else {
            logger.warn("No closing balance or statement date found in file metadata. ClosingBalance=${accountMetadata.closingBalance}, StatementDate=${accountMetadata.statementDate}")
        }

        // Update file record with final statistics
        val updatedFile = savedFile.copy(
            importedTransactions = importedCount,
            updatedTransactions = updatedCount,
            skippedTransactions = skippedCount,
            errors = if (errors.isNotEmpty()) errors.joinToString("\n") else null,
            status = if (errors.isEmpty()) UploadStatus.COMPLETED else UploadStatus.COMPLETED
        )
        uploadedFileRepository.save(updatedFile)

        return FileUploadResponse(
            fileName = fileName,
            totalTransactions = parsedTransactions.size,
            importedTransactions = importedCount,
            updatedTransactions = updatedCount,
            skippedTransactions = skippedCount,
            errors = errors,
            accountMetadata = accountMetadata
        )
    }

    private fun findOrCreateAccount(user: User, metadata: AccountMetadata): Account {
        if (metadata.accountNumber == null) {
            logger.error("Account metadata missing account number")
            throw IllegalArgumentException("Account number is required in file metadata")
        }

        val existingAccount = accountRepository.findByUserIdAndAccountNumber(user.id, metadata.accountNumber)
        
        return if (existingAccount.isPresent) {
            val account = existingAccount.get()
            
            // Update account with latest metadata
            val updated = account.copy(
                clientName = metadata.clientName ?: account.clientName,
                inn = metadata.inn ?: account.inn,
                accountName = metadata.accountName ?: account.accountName,
                currency = metadata.currency ?: account.currency,
                lastStatementDate = metadata.previousStatementDate ?: account.lastStatementDate,
                currentBalance = metadata.openingBalance ?: account.currentBalance,
                updatedAt = LocalDateTime.now()
            )
            accountRepository.save(updated)
            logger.info("Updated existing account: ${metadata.accountNumber}")
            updated
        } else {
            val newAccount = Account(
                userId = user.id,
                accountNumber = metadata.accountNumber,
                clientName = metadata.clientName,
                inn = metadata.inn,
                accountName = metadata.accountName,
                currency = metadata.currency ?: "RUB",
                lastStatementDate = metadata.previousStatementDate,
                currentBalance = metadata.openingBalance
            )
            val saved = accountRepository.save(newAccount)
            logger.info("Created new account: ${metadata.accountNumber} for client ${metadata.clientName}")
            saved
        }
    }

    private fun createTransaction(
        user: User,
        parsed: ParsedTransaction,
        externalId: String,
        fileName: String,
        account: Account,
        fileId: UUID
    ): Transaction {
        return Transaction(
            userId = user.id,
            accountId = account.id,
            fileId = fileId,
            description = parsed.paymentPurpose ?: "Bank transaction ${parsed.documentNumber ?: ""}",
            amount = Money.of(parsed.amount, parsed.currency),
            transactionDate = parsed.transactionDate,
            category = null, // Can be categorized later
            merchant = parsed.recipientName,
            transactionType = parsed.transactionType,
            status = TransactionStatus.COMPLETED,
            externalId = externalId,
            documentNumber = parsed.documentNumber,
            documentDate = parsed.documentDate,
            accountNumber = parsed.accountNumber,
            recipientName = parsed.recipientName,
            recipientInn = parsed.recipientInn,
            recipientAccount = parsed.recipientAccount,
            paymentPurpose = parsed.paymentPurpose,
            sourceFileName = fileName,
            importedAt = LocalDateTime.now()
        )
    }

    private fun updateTransaction(
        existing: Transaction,
        parsed: ParsedTransaction,
        fileName: String,
        account: Account,
        fileId: UUID
    ): Transaction {
        return existing.copy(
            accountId = account.id,
            fileId = fileId,
            description = parsed.paymentPurpose ?: existing.description,
            amount = Money.of(parsed.amount, parsed.currency),
            merchant = parsed.recipientName ?: existing.merchant,
            recipientName = parsed.recipientName,
            recipientInn = parsed.recipientInn,
            recipientAccount = parsed.recipientAccount,
            paymentPurpose = parsed.paymentPurpose,
            sourceFileName = fileName,
            importedAt = LocalDateTime.now(),
            updatedAt = LocalDateTime.now()
        )
    }

    private fun generateExternalId(parsed: ParsedTransaction, userId: UUID): String {
        // Generate a unique ID based on transaction details
        val data = "${userId}_${parsed.documentNumber}_${parsed.documentDate}_" +
                   "${parsed.amount}_${parsed.recipientAccount}"
        
        return MessageDigest.getInstance("SHA-256")
            .digest(data.toByteArray())
            .joinToString("") { "%02x".format(it) }
            .substring(0, 64)
    }

    private fun saveAccountBalanceIfLatest(
        user: User,
        account: Account,
        balanceDate: LocalDate,
        balance: BigDecimal,
        currency: String,
        fileId: UUID,
        latestTransactionDateInFile: LocalDateTime?
    ) {
        // Check if this file contains the latest transactions
        val latestTransactionInDb = transactionRepository.findLatestTransactionDateByAccountId(account.id)
        
        if (latestTransactionInDb != null && latestTransactionDateInFile != null) {
            // If there are existing transactions, only update balance if this file has newer or equal transactions
            if (latestTransactionDateInFile < latestTransactionInDb) {
                logger.warn(
                    "Skipping balance update for account ${account.accountNumber}: " +
                    "file contains older transactions (latest in file: $latestTransactionDateInFile, " +
                    "latest in DB: $latestTransactionInDb)"
                )
                return
            }
        }
        
        val existingBalance = accountBalanceRepository.findByAccountIdAndBalanceDate(account.id, balanceDate)
        
        if (existingBalance.isPresent) {
            // Update existing balance
            val updated = existingBalance.get().copy(
                balance = Money.of(balance, currency),
                fileId = fileId,
                updatedAt = LocalDateTime.now()
            )
            accountBalanceRepository.save(updated)
            logger.info("Updated balance for account ${account.accountNumber} on $balanceDate: $balance $currency")
        } else {
            // Create new balance record
            val newBalance = AccountBalance(
                userId = user.id,
                accountId = account.id,
                balanceDate = balanceDate,
                balance = Money.of(balance, currency),
                fileId = fileId
            )
            accountBalanceRepository.save(newBalance)
            logger.info("Created balance record for account ${account.accountNumber} on $balanceDate: $balance $currency")
        }
    }

    private fun getCurrentUser(): User {
        val authentication = SecurityContextHolder.getContext().authentication
        return authentication.principal as User
    }
}

