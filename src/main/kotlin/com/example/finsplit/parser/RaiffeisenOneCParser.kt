package com.example.finsplit.parser

import com.example.finsplit.domain.BankType
import com.example.finsplit.domain.FileFormat
import com.example.finsplit.domain.TransactionType
import com.example.finsplit.dto.AccountMetadata
import com.example.finsplit.dto.ParsedTransaction
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Component
import java.io.BufferedReader
import java.io.InputStream
import java.io.InputStreamReader
import java.math.BigDecimal
import java.nio.charset.Charset
import java.time.LocalDate
import java.time.format.DateTimeFormatter

@Component
class RaiffeisenOneCParser : TransactionFileParser {

    private val logger = LoggerFactory.getLogger(RaiffeisenOneCParser::class.java)

    companion object {
        private val DATE_FORMATTER = DateTimeFormatter.ofPattern("dd.MM.yyyy")
        private const val SECTION_END = "КонецДокумента"
    }

    override fun getSupportedBank(): BankType = BankType.RAIFFEISEN

    override fun getSupportedFormats(): List<FileFormat> = listOf(FileFormat.TXT)

    override fun parse(inputStream: InputStream, fileName: String): ParseResult {
        val transactions = mutableListOf<ParsedTransaction>()
        var accountMetadata: AccountMetadata? = null
        val reader = BufferedReader(InputStreamReader(inputStream, Charset.forName("windows-1251")))
        
        var currentTransaction = mutableMapOf<String, String>()
        var inTransactionSection = false
        var inAccountSection = false
        var inHeaderSection = true
        val headerData = mutableMapOf<String, String>()
        var lastClosingBalance: BigDecimal? = null

        reader.useLines { lines ->
            lines.forEach { line ->
                val trimmedLine = line.trim()

                when {
                    // Start of account balance section
                    trimmedLine == "СекцияРасчСчет" -> {
                        inAccountSection = true
                        inHeaderSection = false
                    }
                    // End of account balance section
                    trimmedLine == "КонецРасчСчет" -> {
                        inAccountSection = false
                    }
                    // Parse header information (before any sections)
                    inHeaderSection && trimmedLine.contains("=") -> {
                        val parts = trimmedLine.split("=", limit = 2)
                        if (parts.size == 2) {
                            headerData[parts[0].trim()] = parts[1].trim()
                        }
                    }
                    // Capture closing balance from account sections
                    inAccountSection && trimmedLine.startsWith("КонечныйОстаток=") -> {
                        val balanceStr = trimmedLine.substringAfter("=").trim()
                        lastClosingBalance = balanceStr.toBigDecimalOrNull()
                    }
                    // Start of document section
                    trimmedLine.startsWith("СекцияДокумент=") -> {
                        inTransactionSection = true
                        currentTransaction = mutableMapOf()
                        val docType = trimmedLine.substringAfter("=").trim()
                        currentTransaction["ВидДокумента"] = docType
                        logger.debug("Starting document section: $docType")
                    }
                    // End of document section
                    trimmedLine == SECTION_END && inTransactionSection -> {
                        val docType = currentTransaction["ВидДокумента"]
                        if (docType != null && docType.contains("Платежн", ignoreCase = true)) {
                            parseTransaction(currentTransaction)?.let { 
                                transactions.add(it)
                                logger.debug("Parsed transaction #${currentTransaction["Номер"]}")
                            }
                        }
                        inTransactionSection = false
                    }
                    // Parse transaction fields
                    inTransactionSection && trimmedLine.contains("=") -> {
                        val parts = trimmedLine.split("=", limit = 2)
                        if (parts.size == 2) {
                            currentTransaction[parts[0].trim()] = parts[1].trim()
                        }
                    }
                }
            }
        }
        
        // Parse account metadata from header
        accountMetadata = parseAccountMetadataFromHeader(headerData, lastClosingBalance)
        
        logger.info("Parsed ${transactions.size} transactions from 1C Raiffeisen file")
        if (accountMetadata != null) {
            logger.debug("Account metadata: ${accountMetadata.accountNumber}, period: ${accountMetadata.previousStatementDate} - ${accountMetadata.statementDate}, closing balance: ${accountMetadata.closingBalance}")
        }

        return ParseResult(transactions, accountMetadata)
    }

    private fun parseAccountMetadataFromHeader(
        headerData: Map<String, String>,
        closingBalance: BigDecimal?
    ): AccountMetadata? {
        return try {
            val accountNumber = headerData["РасчСчет"]
            val startDate = headerData["ДатаНачала"]?.let { 
                try { LocalDate.parse(it, DATE_FORMATTER) } catch (e: Exception) { null }
            }
            val endDate = headerData["ДатаКонца"]?.let { 
                try { LocalDate.parse(it, DATE_FORMATTER) } catch (e: Exception) { null }
            }
            // Opening balance might be in first СекцияРасчСчет, not in header
            val openingBalance = headerData["НачальныйОстаток"]?.toBigDecimalOrNull()

            if (accountNumber == null) {
                logger.warn("No account number found in 1C file header")
                return null
            }

            AccountMetadata(
                clientName = null,  // Not in 1C header
                inn = null,         // Not in 1C header
                accountName = null,
                accountNumber = accountNumber,
                currency = "RUB",
                previousStatementDate = startDate,
                statementDate = endDate,
                openingBalance = openingBalance,
                closingBalance = closingBalance  // Last closing balance from account sections
            )
        } catch (e: Exception) {
            logger.warn("Failed to parse account metadata from 1C header: ${e.message}")
            null
        }
    }

    private fun parseTransaction(data: Map<String, String>): ParsedTransaction? {
        return try {
            val documentNumber = data["Номер"]
            val amount = data["Сумма"]?.toBigDecimalOrNull() ?: return null
            val dateStr = data["Дата"] ?: return null
            val date = LocalDate.parse(dateStr, DATE_FORMATTER)

            // Extract recipient name and INN
            val recipientNameRaw = data["Получатель"]
            val (recipientName, recipientInn) = extractNameAndInn(recipientNameRaw)

            ParsedTransaction(
                documentNumber = documentNumber,
                documentDate = date,
                amount = amount,
                transactionDate = date.atStartOfDay(),
                accountNumber = data["ПолучательСчет"],
                recipientName = recipientName,
                recipientInn = recipientInn,
                recipientAccount = data["ПолучательСчет"],
                paymentPurpose = data["НазначениеПлатежа"],
                currency = "RUB",
                transactionType = TransactionType.EXPENSE
            )
        } catch (e: Exception) {
            logger.debug("Failed to parse 1C transaction: ${e.message}")
            null
        }
    }

    /**
     * Extracts company name and INN from combined string
     * Example: "ООО "ОЛИМП", ИНН: 2462074498" -> ("ООО "ОЛИМП"", "2462074498")
     */
    private fun extractNameAndInn(rawValue: String?): Pair<String?, String?> {
        if (rawValue == null) return Pair(null, null)
        
        return try {
            val innRegex = """[,\s]+ИНН[:\s]+(\d+)""".toRegex(RegexOption.IGNORE_CASE)
            val innMatch = innRegex.find(rawValue)
            
            if (innMatch != null) {
                val inn = innMatch.groupValues[1]
                val name = rawValue.substring(0, innMatch.range.first).trim()
                Pair(name, inn)
            } else {
                Pair(rawValue.trim(), null)
            }
        } catch (e: Exception) {
            logger.debug("Failed to extract INN from: $rawValue")
            Pair(rawValue.trim(), null)
        }
    }
}

