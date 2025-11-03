package com.example.finsplit.domain

import jakarta.persistence.*
import java.math.BigDecimal
import java.time.LocalDate
import java.time.LocalDateTime
import java.util.UUID

@Entity
@Table(name = "accounts")
data class Account(
    @Id
    @Column(columnDefinition = "UUID")
    val id: UUID = UUID.randomUUID(),

    @Column(name = "user_id", nullable = false)
    val userId: UUID,

    @Column(unique = true, nullable = false)
    val accountNumber: String,

    @Column
    val clientName: String? = null,

    @Column
    val inn: String? = null,

    @Column
    val accountName: String? = null,

    @Column(nullable = false)
    val currency: String = "RUB",

    @Column
    val lastStatementDate: LocalDate? = null,

    @Column
    val currentBalance: BigDecimal? = null,

    @Column(nullable = false, updatable = false)
    val createdAt: LocalDateTime = LocalDateTime.now(),

    @Column(nullable = false)
    val updatedAt: LocalDateTime = LocalDateTime.now()
)

