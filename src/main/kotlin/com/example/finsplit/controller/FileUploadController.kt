package com.example.finsplit.controller

import com.example.finsplit.domain.BankType
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
@Tag(name = "File Upload", description = "Upload and parse banking transaction files from different banks")
@SecurityRequirement(name = "Bearer Authentication")
class FileUploadController(
    private val fileUploadService: FileUploadService
) {

    @PostMapping("/upload", consumes = [MediaType.MULTIPART_FORM_DATA_VALUE])
    @Operation(
        summary = "Upload bank statement file",
        description = """
            Upload and parse banking transaction files from various banks.
            
            Supported banks and formats:
            - RAIFFEISEN: Excel (.xlsx, .xls) or 1C text format (.txt with windows-1251 encoding)
            - ONE_C_FORMAT: Generic 1C:Enterprise format (.txt files with windows-1251 encoding)
            
            The system will:
            - Parse all transactions from the file using bank-specific parser
            - Create new transactions that don't exist
            - Update existing transactions based on external ID (generated from transaction details)
            - Skip transactions that fail validation
            
            Required parameters:
            - file: The bank statement file
            - bankType: The bank that generated the file (RAIFFEISEN, ONE_C_FORMAT)
        """
    )
    fun uploadFile(
        @Parameter(
            description = "Bank statement file (.txt, .xlsx, or .xls)",
            required = true,
            content = [Content(mediaType = MediaType.MULTIPART_FORM_DATA_VALUE)]
        )
        @RequestParam("file") file: MultipartFile,
        
        @Parameter(
            description = "Bank type that generated this file",
            required = true,
            schema = Schema(implementation = BankType::class)
        )
        @RequestParam("bankType") bankType: BankType
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

        val response = fileUploadService.uploadAndProcessFile(file, bankType)
        return ResponseEntity.status(HttpStatus.OK).body(response)
    }
    
    @GetMapping("/supported-banks")
    @Operation(
        summary = "Get list of supported banks",
        description = "Returns a list of all supported bank types and their file formats"
    )
    fun getSupportedBanks(): ResponseEntity<List<BankType>> {
        return ResponseEntity.ok(BankType.values().filter { it != BankType.UNKNOWN }.toList())
    }
}

