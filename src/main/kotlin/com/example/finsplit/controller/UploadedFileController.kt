package com.example.finsplit.controller

import com.example.finsplit.dto.UploadedFileResponse
import com.example.finsplit.service.UploadedFileService
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.security.SecurityRequirement
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.domain.Sort
import org.springframework.data.web.PageableDefault
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import java.util.UUID

@RestController
@RequestMapping("/api/files")
@Tag(name = "Uploaded Files", description = "Manage uploaded bank statement files")
@SecurityRequirement(name = "Bearer Authentication")
class UploadedFileController(
    private val uploadedFileService: UploadedFileService
) {

    @GetMapping
    @Operation(
        summary = "Get all uploaded files",
        description = "Returns a paginated list of all uploaded files for the authenticated user"
    )
    fun getAllUploadedFiles(
        @PageableDefault(size = 20, sort = ["uploadedAt"], direction = Sort.Direction.DESC)
        pageable: Pageable
    ): ResponseEntity<Page<UploadedFileResponse>> {
        val files = uploadedFileService.getAllUploadedFiles(pageable)
        return ResponseEntity.ok(files)
    }

    @GetMapping("/{id}")
    @Operation(
        summary = "Get uploaded file by ID",
        description = "Returns details of a specific uploaded file"
    )
    fun getUploadedFile(@PathVariable id: UUID): ResponseEntity<UploadedFileResponse> {
        val file = uploadedFileService.getUploadedFileById(id)
        return ResponseEntity.ok(file)
    }

    @GetMapping("/account/{accountId}")
    @Operation(
        summary = "Get uploaded files by account",
        description = "Returns all uploaded files for a specific account"
    )
    fun getUploadedFilesByAccount(
        @PathVariable accountId: UUID,
        @PageableDefault(size = 20, sort = ["uploadedAt"], direction = Sort.Direction.DESC)
        pageable: Pageable
    ): ResponseEntity<Page<UploadedFileResponse>> {
        val files = uploadedFileService.getUploadedFilesByAccount(accountId, pageable)
        return ResponseEntity.ok(files)
    }
}


