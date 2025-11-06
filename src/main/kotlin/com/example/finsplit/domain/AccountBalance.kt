package com.example.finsplit.domain

import jakarta.persistence.*
import java.time.LocalDate
import java.time.LocalDateTime
import java.util.UUID

@Entity
@Table(
    name = "account_balances",
    uniqueConstraints = [
        UniqueConstraint(columnNames = ["account_id", "balance_date"])
    ]
)
data class AccountBalance(
    @Id
    @Column(columnDefinition = "UUID")
    val id: UUID = UUID.randomUUID(),

    @Column(name = "user_id", nullable = false)
    val userId: UUID,

    @Column(name = "account_id", nullable = false)
    val accountId: UUID,

    @Column(name = "balance_date", nullable = false)
    val balanceDate: LocalDate,

    @Embedded
    @AttributeOverrides(
        AttributeOverride(name = "currency", column = Column(name = "currency")),
        AttributeOverride(name = "amount", column = Column(name = "balance_amount"))
    )
    val balance: Money,

    @Column(name = "file_id")
    val fileId: UUID? = null,

    @Column(nullable = false, updatable = false)
    val createdAt: LocalDateTime = LocalDateTime.now(),

    @Column(nullable = false)
    val updatedAt: LocalDateTime = LocalDateTime.now()
)


