package com.example.finsplit.dto

import com.example.finsplit.domain.TransactionType
import java.math.BigDecimal
import java.time.LocalDate
import java.time.LocalDateTime

data class ParsedTransaction(
    val documentNumber: String?,
    val documentDate: LocalDate?,
    val amount: BigDecimal,
    val transactionDate: LocalDateTime,
    val accountNumber: String?,
    val recipientName: String?,
    val recipientInn: String?,
    val recipientAccount: String?,
    val paymentPurpose: String?,
    val currency: String = "RUB",
    val transactionType: TransactionType = TransactionType.EXPENSE
)

data class FileUploadResponse(
    val fileName: String,
    val totalTransactions: Int,
    val importedTransactions: Int,
    val updatedTransactions: Int,
    val skippedTransactions: Int,
    val errors: List<String> = emptyList(),
    val accountMetadata: AccountMetadata? = null
)

