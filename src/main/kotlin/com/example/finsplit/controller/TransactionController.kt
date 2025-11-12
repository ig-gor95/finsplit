package com.example.finsplit.controller

import com.example.finsplit.dto.CreateTransactionRequest
import com.example.finsplit.dto.TransactionResponse
import com.example.finsplit.dto.TransactionStatistics
import com.example.finsplit.service.TransactionService
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.security.SecurityRequirement
import io.swagger.v3.oas.annotations.tags.Tag
import jakarta.validation.Valid
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.domain.Sort
import org.springframework.data.web.PageableDefault
import org.springframework.format.annotation.DateTimeFormat
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import java.time.LocalDateTime
import java.util.UUID

@RestController
@RequestMapping("/api/transactions")
@Tag(name = "Transactions", description = "Banking transaction management and analytics endpoints")
@SecurityRequirement(name = "Bearer Authentication")
class TransactionController(
    private val transactionService: TransactionService
) {

    @PostMapping
    @Operation(
        summary = "Create a new transaction",
        description = "Creates a new banking transaction for the authenticated user"
    )
    fun createTransaction(@Valid @RequestBody request: CreateTransactionRequest): ResponseEntity<TransactionResponse> {
        val response = transactionService.createTransaction(request)
        return ResponseEntity.status(HttpStatus.CREATED).body(response)
    }

    @GetMapping
    @Operation(
        summary = "Get all transactions with statistics",
        description = "Returns a paginated list of all transactions with total income/expenses sums"
    )
    fun getTransactions(
        @PageableDefault(size = 20, sort = ["transactionDate"], direction = Sort.Direction.DESC)
        pageable: Pageable
    ): ResponseEntity<com.example.finsplit.dto.TransactionPageResponse> {
        val transactions = transactionService.getTransactionsWithStats(pageable)
        return ResponseEntity.ok(transactions)
    }

    @GetMapping("/{id}")
    @Operation(
        summary = "Get transaction by ID",
        description = "Returns a specific transaction by its ID"
    )
    fun getTransaction(@PathVariable id: UUID): ResponseEntity<TransactionResponse> {
        val transaction = transactionService.getTransactionById(id)
        return ResponseEntity.ok(transaction)
    }

    @GetMapping("/filter/date-range")
    @Operation(
        summary = "Filter transactions by date range",
        description = "Returns transactions within a specified date range"
    )
    fun getTransactionsByDateRange(
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) startDate: LocalDateTime,
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) endDate: LocalDateTime,
        @PageableDefault(size = 20, sort = ["transactionDate"], direction = Sort.Direction.DESC)
        pageable: Pageable
    ): ResponseEntity<Page<TransactionResponse>> {
        val transactions = transactionService.getTransactionsByDateRange(startDate, endDate, pageable)
        return ResponseEntity.ok(transactions)
    }

    @GetMapping("/filter/category")
    @Operation(
        summary = "Filter transactions by category",
        description = "Returns transactions for a specific category"
    )
    fun getTransactionsByCategory(
        @RequestParam category: String,
        @PageableDefault(size = 20, sort = ["transactionDate"], direction = Sort.Direction.DESC)
        pageable: Pageable
    ): ResponseEntity<Page<TransactionResponse>> {
        val transactions = transactionService.getTransactionsByCategory(category, pageable)
        return ResponseEntity.ok(transactions)
    }

    @GetMapping("/statistics")
    @Operation(
        summary = "Get transaction statistics",
        description = "Returns aggregated statistics including total income, expenses, and balance"
    )
    fun getStatistics(): ResponseEntity<TransactionStatistics> {
        val statistics = transactionService.getStatistics()
        return ResponseEntity.ok(statistics)
    }
}

