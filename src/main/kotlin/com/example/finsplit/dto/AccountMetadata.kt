package com.example.finsplit.dto

import java.math.BigDecimal
import java.time.LocalDate

data class AccountMetadata(
    val clientName: String? = null,
    val inn: String? = null,
    val accountName: String? = null,
    val accountNumber: String? = null,
    val currency: String? = null,
    val previousStatementDate: LocalDate? = null,
    val openingBalance: BigDecimal? = null
)

