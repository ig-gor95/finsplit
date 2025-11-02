package com.example.finsplit.service

import com.example.finsplit.domain.Transaction
import com.example.finsplit.domain.TransactionType
import com.example.finsplit.domain.User
import com.example.finsplit.dto.CreateTransactionRequest
import com.example.finsplit.dto.TransactionResponse
import com.example.finsplit.dto.TransactionStatistics
import com.example.finsplit.repository.TransactionRepository
import com.example.finsplit.repository.UserRepository
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.stereotype.Service
import java.math.BigDecimal
import java.time.LocalDateTime

@Service
class TransactionService(
    private val transactionRepository: TransactionRepository,
    private val userRepository: UserRepository
) {

    fun createTransaction(request: CreateTransactionRequest): TransactionResponse {
        val user = getCurrentUser()

        val transaction = Transaction(
            user = user,
            description = request.description,
            amount = request.amount,
            currency = request.currency,
            transactionDate = request.transactionDate,
            category = request.category,
            merchant = request.merchant,
            transactionType = request.transactionType,
            status = request.status
        )

        val savedTransaction = transactionRepository.save(transaction)
        return toTransactionResponse(savedTransaction)
    }

    fun getTransactions(pageable: Pageable): Page<TransactionResponse> {
        val user = getCurrentUser()
        return transactionRepository.findByUserId(user.id!!, pageable)
            .map { toTransactionResponse(it) }
    }

    fun getTransactionsByDateRange(
        startDate: LocalDateTime,
        endDate: LocalDateTime,
        pageable: Pageable
    ): Page<TransactionResponse> {
        val user = getCurrentUser()
        return transactionRepository.findByUserIdAndTransactionDateBetween(
            user.id!!,
            startDate,
            endDate,
            pageable
        ).map { toTransactionResponse(it) }
    }

    fun getTransactionsByCategory(category: String, pageable: Pageable): Page<TransactionResponse> {
        val user = getCurrentUser()
        return transactionRepository.findByUserIdAndCategory(user.id!!, category, pageable)
            .map { toTransactionResponse(it) }
    }

    fun getStatistics(): TransactionStatistics {
        val user = getCurrentUser()
        
        val totalIncome = transactionRepository.getTotalAmountByUserAndType(user.id!!, TransactionType.INCOME) 
            ?: BigDecimal.ZERO
        val totalExpenses = transactionRepository.getTotalAmountByUserAndType(user.id!!, TransactionType.EXPENSE) 
            ?: BigDecimal.ZERO

        return TransactionStatistics(
            totalIncome = totalIncome,
            totalExpenses = totalExpenses,
            balance = totalIncome.subtract(totalExpenses)
        )
    }

    fun getTransactionById(id: Long): TransactionResponse {
        val user = getCurrentUser()
        val transaction = transactionRepository.findById(id)
            .orElseThrow { IllegalArgumentException("Transaction not found") }

        if (transaction.user.id != user.id) {
            throw IllegalAccessException("Unauthorized access to transaction")
        }

        return toTransactionResponse(transaction)
    }

    private fun getCurrentUser(): User {
        val authentication = SecurityContextHolder.getContext().authentication
        return authentication.principal as User
    }

    private fun toTransactionResponse(transaction: Transaction): TransactionResponse {
        return TransactionResponse(
            id = transaction.id!!,
            description = transaction.description,
            amount = transaction.amount,
            currency = transaction.currency,
            transactionDate = transaction.transactionDate,
            category = transaction.category,
            merchant = transaction.merchant,
            transactionType = transaction.transactionType,
            status = transaction.status,
            createdAt = transaction.createdAt
        )
    }
}

