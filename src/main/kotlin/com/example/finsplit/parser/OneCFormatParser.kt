package com.example.finsplit.parser

import com.example.finsplit.domain.BankType
import com.example.finsplit.domain.FileFormat
import com.example.finsplit.domain.TransactionType
import com.example.finsplit.dto.ParsedTransaction
import org.springframework.stereotype.Component
import java.io.BufferedReader
import java.io.InputStream
import java.io.InputStreamReader
import java.math.BigDecimal
import java.nio.charset.Charset
import java.time.LocalDate
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter

@Component
class OneCFormatParser : TransactionFileParser {

    companion object {
        private val DATE_FORMATTER = DateTimeFormatter.ofPattern("dd.MM.yyyy")
        private const val SECTION_START = "СекцияДокумент"
        private const val SECTION_END = "КонецДокумента"
        private const val TRANSACTION_TYPE = "ПлатежноеПоручение"
    }

    override fun getSupportedBank(): BankType = BankType.ONE_C_FORMAT

    override fun getSupportedFormats(): List<FileFormat> = listOf(FileFormat.TXT)

    override fun parse(inputStream: InputStream, fileName: String): ParseResult {
        val transactions = mutableListOf<ParsedTransaction>()
        val reader = BufferedReader(InputStreamReader(inputStream, Charset.forName("windows-1251")))
        
        var currentTransaction = mutableMapOf<String, String>()
        var inTransactionSection = false

        reader.useLines { lines ->
            lines.forEach { line ->
                val trimmedLine = line.trim()

                when {
                    trimmedLine == SECTION_START -> {
                        inTransactionSection = true
                        currentTransaction = mutableMapOf()
                    }
                    trimmedLine == SECTION_END && inTransactionSection -> {
                        // Only process if it's a payment document
                        if (currentTransaction["ВидДокумента"] == TRANSACTION_TYPE) {
                            parseTransaction(currentTransaction)?.let { transactions.add(it) }
                        }
                        inTransactionSection = false
                    }
                    inTransactionSection && trimmedLine.contains("=") -> {
                        val parts = trimmedLine.split("=", limit = 2)
                        if (parts.size == 2) {
                            currentTransaction[parts[0].trim()] = parts[1].trim()
                        }
                    }
                }
            }
        }

        return ParseResult(transactions, null)
    }

    private fun parseTransaction(data: Map<String, String>): ParsedTransaction? {
        return try {
            val documentNumber = data["Номер"]
            val amount = data["Сумма"]?.toBigDecimalOrNull() ?: return null
            val dateStr = data["Дата"] ?: return null
            val date = LocalDate.parse(dateStr, DATE_FORMATTER)

            ParsedTransaction(
                documentNumber = documentNumber,
                documentDate = date,
                amount = amount,
                transactionDate = date.atStartOfDay(),
                accountNumber = data["ПолучательСчет"],
                recipientName = data["Получатель"],
                recipientInn = data["ПолучательИНН"],
                recipientAccount = data["ПолучательСчет"],
                paymentPurpose = data["НазначениеПлатежа"],
                currency = "RUB",
                transactionType = TransactionType.EXPENSE  // Default for 1C format, can be enhanced later
            )
        } catch (e: Exception) {
            null
        }
    }
}

