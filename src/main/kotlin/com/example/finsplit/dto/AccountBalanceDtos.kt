package com.example.finsplit.dto

import java.math.BigDecimal
import java.time.LocalDate
import java.time.LocalDateTime
import java.util.UUID

data class AccountBalanceResponse(
    val id: UUID,
    val accountId: UUID,
    val balanceDate: LocalDate,
    val balance: BigDecimal,
    val currency: String,
    val fileId: UUID?,
    val createdAt: LocalDateTime,
    val updatedAt: LocalDateTime
)


