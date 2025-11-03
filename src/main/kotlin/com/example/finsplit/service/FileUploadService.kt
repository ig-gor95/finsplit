package com.example.finsplit.service

import com.example.finsplit.domain.Transaction
import com.example.finsplit.domain.TransactionStatus
import com.example.finsplit.domain.TransactionType
import com.example.finsplit.domain.User
import com.example.finsplit.dto.FileUploadResponse
import com.example.finsplit.dto.ParsedTransaction
import com.example.finsplit.parser.TransactionFileParser
import com.example.finsplit.repository.TransactionRepository
import org.slf4j.LoggerFactory
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.multipart.MultipartFile
import java.security.MessageDigest
import java.time.LocalDateTime
import java.util.UUID

@Service
class FileUploadService(
    private val transactionRepository: TransactionRepository,
    private val fileParsers: List<TransactionFileParser>
) {

    private val logger = LoggerFactory.getLogger(FileUploadService::class.java)

    @Transactional
    fun uploadAndProcessFile(file: MultipartFile): FileUploadResponse {
        val fileName = file.originalFilename ?: throw IllegalArgumentException("File name is required")
        val user = getCurrentUser()
        
        logger.info("Starting file upload for user ${user.id}: $fileName")
        
        // Find appropriate parser
        val parser = fileParsers.firstOrNull { it.canParse(fileName) }
            ?: run {
                logger.error("Unsupported file format: $fileName")
                throw IllegalArgumentException("Unsupported file format: $fileName")
            }

        val errors = mutableListOf<String>()
        
        // Parse file
        val parsedTransactions = try {
            file.inputStream.use { parser.parse(it, fileName) }
        } catch (e: Exception) {
            logger.error("Failed to parse file $fileName", e)
            throw IllegalArgumentException("Failed to parse file: ${e.message}")
        }

        if (parsedTransactions.isEmpty()) {
            logger.warn("No transactions found in file: $fileName")
            throw IllegalArgumentException("No transactions found in file")
        }
        
        logger.info("Parsed ${parsedTransactions.size} transactions from $fileName")

        // Process transactions
        var importedCount = 0
        var updatedCount = 0
        var skippedCount = 0

        // Generate external IDs for all parsed transactions
        val parsedWithIds = parsedTransactions.map { parsed ->
            parsed to generateExternalId(parsed, user.id!!)
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
                    val updated = updateTransaction(existing, parsed, fileName)
                    transactionRepository.save(updated)
                    updatedCount++
                    logger.debug("Updated transaction: ${parsed.documentNumber}")
                } else {
                    // Create new transaction
                    val newTransaction = createTransaction(user, parsed, externalId, fileName)
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

        return FileUploadResponse(
            fileName = fileName,
            totalTransactions = parsedTransactions.size,
            importedTransactions = importedCount,
            updatedTransactions = updatedCount,
            skippedTransactions = skippedCount,
            errors = errors
        )
    }

    private fun createTransaction(
        user: User,
        parsed: ParsedTransaction,
        externalId: String,
        fileName: String
    ): Transaction {
        // Determine transaction type based on amount and accounts
        val transactionType = determineTransactionType(parsed, user)
        
        return Transaction(
            user = user,
            description = parsed.paymentPurpose ?: "Bank transaction ${parsed.documentNumber ?: ""}",
            amount = parsed.amount.abs(),
            currency = parsed.currency,
            transactionDate = parsed.transactionDate,
            category = null, // Can be categorized later
            merchant = parsed.recipientName ?: parsed.payerName,
            transactionType = transactionType,
            status = TransactionStatus.COMPLETED,
            externalId = externalId,
            documentNumber = parsed.documentNumber,
            documentDate = parsed.documentDate,
            accountNumber = parsed.accountNumber,
            payerName = parsed.payerName,
            payerInn = parsed.payerInn,
            payerAccount = parsed.payerAccount,
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
        fileName: String
    ): Transaction {
        return existing.copy(
            description = parsed.paymentPurpose ?: existing.description,
            amount = parsed.amount.abs(),
            merchant = parsed.recipientName ?: parsed.payerName ?: existing.merchant,
            payerName = parsed.payerName,
            payerInn = parsed.payerInn,
            payerAccount = parsed.payerAccount,
            recipientName = parsed.recipientName,
            recipientInn = parsed.recipientInn,
            recipientAccount = parsed.recipientAccount,
            paymentPurpose = parsed.paymentPurpose,
            sourceFileName = fileName,
            importedAt = LocalDateTime.now(),
            updatedAt = LocalDateTime.now()
        )
    }

    private fun determineTransactionType(parsed: ParsedTransaction, user: User): TransactionType {
        // Simple logic: if payer account matches user's account, it's an expense
        // Otherwise, it's income
        // This can be enhanced based on business logic
        return if (parsed.payerAccount != null && parsed.recipientAccount != null) {
            if (parsed.payerAccount == parsed.accountNumber) {
                TransactionType.EXPENSE
            } else {
                TransactionType.INCOME
            }
        } else {
            // Default to expense
            TransactionType.EXPENSE
        }
    }

    private fun generateExternalId(parsed: ParsedTransaction, userId: UUID): String {
        // Generate a unique ID based on transaction details
        val data = "${userId}_${parsed.documentNumber}_${parsed.documentDate}_" +
                   "${parsed.amount}_${parsed.payerAccount}_${parsed.recipientAccount}"
        
        return MessageDigest.getInstance("SHA-256")
            .digest(data.toByteArray())
            .joinToString("") { "%02x".format(it) }
            .substring(0, 64)
    }

    private fun getCurrentUser(): User {
        val authentication = SecurityContextHolder.getContext().authentication
        return authentication.principal as User
    }
}

