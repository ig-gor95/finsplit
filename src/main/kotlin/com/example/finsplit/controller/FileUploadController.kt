package com.example.finsplit.controller

import com.example.finsplit.dto.FileUploadResponse
import com.example.finsplit.service.FileUploadService
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.Parameter
import io.swagger.v3.oas.annotations.media.Content
import io.swagger.v3.oas.annotations.media.Schema
import io.swagger.v3.oas.annotations.security.SecurityRequirement
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.http.HttpStatus
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import org.springframework.web.multipart.MultipartFile

@RestController
@RequestMapping("/api/transactions")
@Tag(name = "File Upload", description = "Upload and parse banking transaction files (TXT, XLSX)")
@SecurityRequirement(name = "Bearer Authentication")
class FileUploadController(
    private val fileUploadService: FileUploadService
) {

    @PostMapping("/upload", consumes = [MediaType.MULTIPART_FORM_DATA_VALUE])
    @Operation(
        summary = "Upload bank statement file",
        description = """
            Upload and parse banking transaction files in supported formats:
            - 1C:Enterprise format (.txt files with windows-1251 encoding)
            - Excel format (.xlsx or .xls files)
            
            The system will:
            - Parse all transactions from the file
            - Create new transactions that don't exist
            - Update existing transactions based on external ID (generated from transaction details)
            - Skip transactions that fail validation
            
            Supported file formats:
            - .txt (1C:Enterprise banking format)
            - .xlsx/.xls (Excel format with banking transactions)
        """
    )
    fun uploadFile(
        @Parameter(
            description = "Bank statement file (.txt or .xlsx)",
            required = true,
            content = [Content(mediaType = MediaType.MULTIPART_FORM_DATA_VALUE)]
        )
        @RequestParam("file") file: MultipartFile
    ): ResponseEntity<FileUploadResponse> {
        
        if (file.isEmpty) {
            return ResponseEntity.badRequest()
                .body(
                    FileUploadResponse(
                        fileName = file.originalFilename ?: "unknown",
                        totalTransactions = 0,
                        importedTransactions = 0,
                        updatedTransactions = 0,
                        skippedTransactions = 0,
                        errors = listOf("File is empty")
                    )
                )
        }

        val response = fileUploadService.uploadAndProcessFile(file)
        return ResponseEntity.status(HttpStatus.OK).body(response)
    }
}

