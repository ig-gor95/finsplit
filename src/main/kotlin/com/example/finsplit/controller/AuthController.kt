package com.example.finsplit.controller

import com.example.finsplit.dto.LoginRequest
import com.example.finsplit.dto.LoginResponse
import com.example.finsplit.dto.RegisterRequest
import com.example.finsplit.service.AuthService
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.tags.Tag
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/auth")
@Tag(name = "Authentication", description = "User authentication and registration endpoints")
class AuthController(
    private val authService: AuthService
) {

    @PostMapping("/register")
    @Operation(
        summary = "Register a new user",
        description = "Creates a new user account and returns a JWT token"
    )
    fun register(@Valid @RequestBody request: RegisterRequest): ResponseEntity<LoginResponse> {
        val response = authService.register(request)
        return ResponseEntity.status(HttpStatus.CREATED).body(response)
    }

    @PostMapping("/login")
    @Operation(
        summary = "Login",
        description = "Authenticates a user and returns a JWT token"
    )
    fun login(@Valid @RequestBody request: LoginRequest): ResponseEntity<LoginResponse> {
        val response = authService.login(request)
        return ResponseEntity.ok(response)
    }
}

