package com.example.finsplit.service

import com.example.finsplit.domain.User
import com.example.finsplit.dto.LoginRequest
import com.example.finsplit.dto.LoginResponse
import com.example.finsplit.dto.RegisterRequest
import com.example.finsplit.repository.UserRepository
import com.example.finsplit.security.JwtTokenProvider
import org.springframework.security.authentication.AuthenticationManager
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service
import java.util.UUID
import kotlin.uuid.Uuid

@Service
class AuthService(
    private val userRepository: UserRepository,
    private val passwordEncoder: PasswordEncoder,
    private val jwtTokenProvider: JwtTokenProvider,
    private val authenticationManager: AuthenticationManager
) {

    fun register(request: RegisterRequest): LoginResponse {
        if (userRepository.existsByEmail(request.email)) {
            throw IllegalArgumentException("Email already exists")
        }

        val user = User(
            id = UUID.randomUUID(),
            email = request.email,
            password = passwordEncoder.encode(request.password),
            firstName = request.firstName,
            lastName = request.lastName
        )

        val savedUser = userRepository.save(user)
        val token = jwtTokenProvider.generateToken(savedUser)

        return LoginResponse(
            token = token,
            email = savedUser.email,
            firstName = savedUser.firstName,
            lastName = savedUser.lastName
        )
    }

    fun login(request: LoginRequest): LoginResponse {
        authenticationManager.authenticate(
            UsernamePasswordAuthenticationToken(request.email, request.password)
        )

        val user = userRepository.findByEmail(request.email)
            .orElseThrow { IllegalArgumentException("Invalid credentials") }

        val token = jwtTokenProvider.generateToken(user)

        return LoginResponse(
            token = token,
            email = user.email,
            firstName = user.firstName,
            lastName = user.lastName
        )
    }
}

