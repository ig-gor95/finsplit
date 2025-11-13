package com.example.finsplit.controller

import com.example.finsplit.dto.AccountDetailsResponse
import com.example.finsplit.dto.AccountResponse
import com.example.finsplit.service.AccountService
import com.example.finsplit.usecase.account.GetAccountDetailsUseCase
import com.example.finsplit.usecase.account.GetAccountsWithBalancesUseCase
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.security.SecurityRequirement
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import java.util.UUID

@RestController
@RequestMapping("/api/accounts")
@Tag(name = "Accounts", description = "Bank account management endpoints")
@SecurityRequirement(name = "Bearer Authentication")
class AccountController(
    private val getAccountsWithBalancesUseCase: GetAccountsWithBalancesUseCase,
    private val getAccountDetailsUseCase: GetAccountDetailsUseCase,
    private val accountService: AccountService // Temporary for getAccountById
) {

    @GetMapping
    @Operation(
        summary = "Get all accounts with balances",
        description = "Returns all bank accounts for the authenticated user with current balances from account_balances table"
    )
    fun getAllAccounts(): ResponseEntity<List<AccountResponse>> {
        val accounts = getAccountsWithBalancesUseCase.execute()
        return ResponseEntity.ok(accounts)
    }

    @GetMapping("/{id}")
    @Operation(
        summary = "Get account by ID",
        description = "Returns a specific bank account by its ID"
    )
    fun getAccount(@PathVariable id: UUID): ResponseEntity<AccountResponse> {
        val account = accountService.getAccountById(id)
        return ResponseEntity.ok(account)
    }

    @GetMapping("/{id}/details")
    @Operation(
        summary = "Get detailed account analytics",
        description = "Returns current balance, 30-day balance dynamics and recent transactions for the account"
    )
    fun getAccountDetails(@PathVariable id: UUID): ResponseEntity<AccountDetailsResponse> {
        val details = getAccountDetailsUseCase.execute(id)
        return ResponseEntity.ok(details)
    }
}


