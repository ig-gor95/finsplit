package com.example.finsplit.dto

import com.example.finsplit.domain.TransactionStatus
import com.example.finsplit.domain.TransactionType
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotNull
import jakarta.validation.constraints.Positive
import java.math.BigDecimal
import java.time.LocalDateTime
import java.util.UUID

data class CreateTransactionRequest(
    @field:NotBlank(message = "Description is required")
    val description: String,

    @field:NotNull(message = "Amount is required")
    @field:Positive(message = "Amount must be positive")
    val amount: BigDecimal,

    val currency: String = "USD",

    @field:NotNull(message = "Transaction date is required")
    val transactionDate: LocalDateTime,

    val category: String? = null,

    val merchant: String? = null,

    @field:NotNull(message = "Transaction type is required")
    val transactionType: TransactionType,

    val status: TransactionStatus = TransactionStatus.COMPLETED
)

data class TransactionResponse(
    val id: UUID,
    val description: String,
    val amount: BigDecimal,
    val currency: String,
    val transactionDate: LocalDateTime,
    val category: String?,
    val merchant: String?,
    val transactionType: TransactionType,
    val status: TransactionStatus,
    val createdAt: LocalDateTime
)

data class TransactionStatistics(
    val totalIncome: BigDecimal,
    val totalExpenses: BigDecimal,
    val balance: BigDecimal
)

