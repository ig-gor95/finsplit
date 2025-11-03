package com.example.finsplit.controller

import com.example.finsplit.dto.AccountResponse
import com.example.finsplit.service.AccountService
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
    private val accountService: AccountService
) {

    @GetMapping
    @Operation(
        summary = "Get all accounts",
        description = "Returns all bank accounts for the authenticated user"
    )
    fun getAllAccounts(): ResponseEntity<List<AccountResponse>> {
        val accounts = accountService.getAllAccounts()
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
}

