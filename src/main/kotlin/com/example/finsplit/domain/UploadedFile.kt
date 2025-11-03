package com.example.finsplit.domain

import jakarta.persistence.*
import java.time.LocalDateTime
import java.util.UUID

@Entity
@Table(name = "uploaded_files")
data class UploadedFile(
    @Id
    @Column(columnDefinition = "UUID")
    val id: UUID = UUID.randomUUID(),

    @Column(name = "user_id", nullable = false)
    val userId: UUID,

    @Column(name = "account_id")
    val accountId: UUID? = null,

    @Column(nullable = false)
    val fileName: String,

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    val bankType: BankType,

    @Column(nullable = false)
    val fileSize: Long,

    @Column(nullable = false)
    val totalTransactions: Int,

    @Column(nullable = false)
    val importedTransactions: Int,

    @Column(nullable = false)
    val updatedTransactions: Int,

    @Column(nullable = false)
    val skippedTransactions: Int,

    @Column(columnDefinition = "TEXT")
    val errors: String? = null,

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    val status: UploadStatus = UploadStatus.COMPLETED,

    @Column(nullable = false, updatable = false)
    val uploadedAt: LocalDateTime = LocalDateTime.now()
)

enum class UploadStatus {
    PROCESSING,
    COMPLETED,
    FAILED
}

