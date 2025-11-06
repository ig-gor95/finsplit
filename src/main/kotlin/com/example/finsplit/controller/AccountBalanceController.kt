package com.example.finsplit.controller

import com.example.finsplit.dto.AccountBalanceResponse
import com.example.finsplit.service.AccountBalanceService
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
@RequestMapping("/api/balances")
@Tag(name = "Account Balances", description = "Account balance history endpoints")
@SecurityRequirement(name = "Bearer Authentication")
class AccountBalanceController(
    private val accountBalanceService: AccountBalanceService
) {

    @GetMapping
    @Operation(
        summary = "Get all balance records",
        description = "Returns paginated balance history for all accounts of the authenticated user"
    )
    fun getAllBalances(
        @PageableDefault(size = 20, sort = ["balanceDate"], direction = Sort.Direction.DESC)
        pageable: Pageable
    ): ResponseEntity<Page<AccountBalanceResponse>> {
        val balances = accountBalanceService.getAllBalances(pageable)
        return ResponseEntity.ok(balances)
    }

    @GetMapping("/account/{accountId}")
    @Operation(
        summary = "Get balance history for account",
        description = "Returns paginated balance history for a specific account"
    )
    fun getBalancesByAccount(
        @PathVariable accountId: UUID,
        @PageableDefault(size = 20, sort = ["balanceDate"], direction = Sort.Direction.DESC)
        pageable: Pageable
    ): ResponseEntity<Page<AccountBalanceResponse>> {
        val balances = accountBalanceService.getBalancesByAccount(accountId, pageable)
        return ResponseEntity.ok(balances)
    }

    @GetMapping("/account/{accountId}/latest")
    @Operation(
        summary = "Get latest balance for account",
        description = "Returns the most recent balance record for a specific account"
    )
    fun getLatestBalance(@PathVariable accountId: UUID): ResponseEntity<AccountBalanceResponse> {
        val balance = accountBalanceService.getLatestBalance(accountId)
            ?: return ResponseEntity.notFound().build()
        return ResponseEntity.ok(balance)
    }
}


