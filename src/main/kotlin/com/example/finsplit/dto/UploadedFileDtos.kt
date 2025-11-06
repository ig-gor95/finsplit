package com.example.finsplit.dto

import com.example.finsplit.domain.BankType
import com.example.finsplit.domain.UploadStatus
import java.time.LocalDateTime
import java.util.UUID

data class UploadedFileResponse(
    val id: UUID,
    val accountId: UUID?,
    val fileName: String,
    val bankType: BankType,
    val fileSize: Long,
    val totalTransactions: Int,
    val importedTransactions: Int,
    val updatedTransactions: Int,
    val skippedTransactions: Int,
    val errors: List<String>,
    val status: UploadStatus,
    val uploadedAt: LocalDateTime
)


