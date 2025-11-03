package com.example.finsplit.domain

import jakarta.persistence.*
import java.math.BigDecimal
import java.time.LocalDate
import java.time.LocalDateTime
import java.util.UUID

@Entity
@Table(name = "transactions")
data class Transaction(
    @Id
    @Column(columnDefinition = "UUID")
    val id: UUID = UUID.randomUUID(),

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    val user: User,

    @Column(nullable = false)
    val description: String,

    @Column(nullable = false)
    val amount: BigDecimal,

    @Column(nullable = false)
    val currency: String = "USD",

    @Column(nullable = false)
    val transactionDate: LocalDateTime,

    @Column
    val category: String? = null,

    @Column
    val merchant: String? = null,

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    val transactionType: TransactionType,

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    val status: TransactionStatus = TransactionStatus.PENDING,

    // Fields for imported bank transactions
    @Column(unique = true)
    val externalId: String? = null,

    @Column
    val documentNumber: String? = null,

    @Column
    val documentDate: LocalDate? = null,

    @Column
    val accountNumber: String? = null,

    @Column
    val payerName: String? = null,

    @Column
    val payerInn: String? = null,

    @Column
    val payerAccount: String? = null,

    @Column
    val recipientName: String? = null,

    @Column
    val recipientInn: String? = null,

    @Column
    val recipientAccount: String? = null,

    @Column(columnDefinition = "TEXT")
    val paymentPurpose: String? = null,

    @Column
    val sourceFileName: String? = null,

    @Column
    val importedAt: LocalDateTime? = null,

    @Column(nullable = false, updatable = false)
    val createdAt: LocalDateTime = LocalDateTime.now(),

    @Column(nullable = false)
    val updatedAt: LocalDateTime = LocalDateTime.now()
)

enum class TransactionType {
    INCOME,
    EXPENSE,
    TRANSFER
}

enum class TransactionStatus {
    PENDING,
    COMPLETED,
    FAILED,
    CANCELLED
}

