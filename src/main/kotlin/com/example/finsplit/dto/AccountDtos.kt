package com.example.finsplit.dto

import java.math.BigDecimal
import java.time.LocalDate
import java.time.LocalDateTime
import java.util.UUID

data class AccountResponse(
    val id: UUID,
    val accountNumber: String,
    val clientName: String?,
    val inn: String?,
    val accountName: String?,
    val currency: String,
    val lastStatementDate: LocalDate?,
    val currentBalance: BigDecimal?,
    val transactionCount: Int,
    val createdAt: LocalDateTime,
    val updatedAt: LocalDateTime
)

