package com.example.finsplit.service

import com.example.finsplit.domain.User
import com.example.finsplit.dto.LoginRequest
import com.example.finsplit.dto.LoginResponse
import com.example.finsplit.dto.RegisterRequest
import com.example.finsplit.repository.UserRepository
import com.example.finsplit.security.JwtTokenProvider
import org.slf4j.LoggerFactory
import org.springframework.security.authentication.AuthenticationManager
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service
import java.util.UUID

@Service
class AuthService(
    private val userRepository: UserRepository,
    private val passwordEncoder: PasswordEncoder,
    private val jwtTokenProvider: JwtTokenProvider,
    private val authenticationManager: AuthenticationManager
) {

    private val logger = LoggerFactory.getLogger(AuthService::class.java)

    fun register(request: RegisterRequest): LoginResponse {
        logger.info("Registration attempt for email: ${request.email}")
        
        if (userRepository.existsByEmail(request.email)) {
            logger.warn("Registration failed: Email already exists - ${request.email}")
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

        logger.info("User registered successfully: ${savedUser.email} (ID: ${savedUser.id})")

        return LoginResponse(
            token = token,
            email = savedUser.email,
            firstName = savedUser.firstName,
            lastName = savedUser.lastName
        )
    }

    fun login(request: LoginRequest): LoginResponse {
        logger.info("Login attempt for email: ${request.email}")
        
        try {
            authenticationManager.authenticate(
                UsernamePasswordAuthenticationToken(request.email, request.password)
            )
        } catch (e: Exception) {
            logger.warn("Login failed for email: ${request.email}")
            throw e
        }

        val user = userRepository.findByEmail(request.email)
            ?: throw IllegalArgumentException("Invalid credentials")

        val token = jwtTokenProvider.generateToken(user)

        logger.info("User logged in successfully: ${user.email}")

        return LoginResponse(
            token = token,
            email = user.email,
            firstName = user.firstName,
            lastName = user.lastName
        )
    }
}

