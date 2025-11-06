package com.example.finsplit.service

import com.example.finsplit.domain.UploadedFile
import com.example.finsplit.domain.User
import com.example.finsplit.dto.UploadedFileResponse
import com.example.finsplit.repository.UploadedFileRepository
import org.slf4j.LoggerFactory
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.stereotype.Service
import java.util.UUID

@Service
class UploadedFileService(
    private val uploadedFileRepository: UploadedFileRepository
) {

    private val logger = LoggerFactory.getLogger(UploadedFileService::class.java)

    fun getAllUploadedFiles(pageable: Pageable): Page<UploadedFileResponse> {
        val user = getCurrentUser()
        return uploadedFileRepository.findByUserId(user.id, pageable)
            .map { toUploadedFileResponse(it) }
    }

    fun getUploadedFileById(id: UUID): UploadedFileResponse {
        val user = getCurrentUser()
        val file = uploadedFileRepository.findById(id)
            .orElseThrow {
                logger.warn("Uploaded file not found: $id")
                IllegalArgumentException("Uploaded file not found")
            }

        if (file.userId != user.id) {
            logger.warn("Unauthorized access attempt to file $id by user ${user.id}")
            throw IllegalAccessException("Unauthorized access to file")
        }

        return toUploadedFileResponse(file)
    }

    fun getUploadedFilesByAccount(accountId: UUID, pageable: Pageable): Page<UploadedFileResponse> {
        val user = getCurrentUser()
        return uploadedFileRepository.findByUserIdAndAccountId(user.id, accountId, pageable)
            .map { toUploadedFileResponse(it) }
    }

    private fun getCurrentUser(): User {
        val authentication = SecurityContextHolder.getContext().authentication
        return authentication.principal as User
    }

    private fun toUploadedFileResponse(file: UploadedFile): UploadedFileResponse {
        return UploadedFileResponse(
            id = file.id,
            accountId = file.accountId,
            fileName = file.fileName,
            bankType = file.bankType,
            fileSize = file.fileSize,
            totalTransactions = file.totalTransactions,
            importedTransactions = file.importedTransactions,
            updatedTransactions = file.updatedTransactions,
            skippedTransactions = file.skippedTransactions,
            errors = file.errors?.split("\n")?.filter { it.isNotBlank() } ?: emptyList(),
            status = file.status,
            uploadedAt = file.uploadedAt
        )
    }
}


