package com.example.finsplit.service

import com.example.finsplit.domain.Money
import com.example.finsplit.domain.Transaction
import com.example.finsplit.domain.TransactionType
import com.example.finsplit.domain.User
import com.example.finsplit.dto.CreateTransactionRequest
import com.example.finsplit.dto.TransactionResponse
import com.example.finsplit.dto.TransactionStatistics
import com.example.finsplit.repository.TransactionRepository
import com.example.finsplit.repository.UserRepository
import org.slf4j.LoggerFactory
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.stereotype.Service
import java.math.BigDecimal
import java.time.LocalDateTime
import java.util.UUID

@Service
class TransactionService(
    private val transactionRepository: TransactionRepository,
    private val userRepository: UserRepository
) {

    private val logger = LoggerFactory.getLogger(TransactionService::class.java)

    fun createTransaction(request: CreateTransactionRequest): TransactionResponse {
        val user = getCurrentUser()

        val transaction = Transaction(
            userId = user.id,
            description = request.description,
            amount = Money.of(request.amount, request.currency),
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
        return transactionRepository.findByUserId(user.id, pageable)
            .map { toTransactionResponse(it) }
    }
    
    fun getTransactionsWithStats(
        accountId: UUID? = null,
        transactionType: String? = null,
        status: String? = null,
        currency: String? = null,
        pageable: Pageable
    ): com.example.finsplit.dto.TransactionPageResponse {
        val user = getCurrentUser()
        
        // Получаем отфильтрованные транзакции
        val page = transactionRepository.findByUserIdWithFilters(
            userId = user.id,
            accountId = accountId,
            transactionType = transactionType,
            status = status,
            currency = currency,
            pageable = pageable
        )
        
        // Вычисляем общие суммы по ВСЕМ транзакциям пользователя (не только текущей странице)
        val stats = getStatistics()
        
        return com.example.finsplit.dto.TransactionPageResponse(
            content = page.content.map { toTransactionResponse(it) },
            totalElements = page.totalElements,
            totalPages = page.totalPages,
            currentPage = page.number,
            pageSize = page.size,
            totalIncome = stats.totalIncome,
            totalExpenses = stats.totalExpenses,
            balance = stats.balance
        )
    }

    fun getTransactionsByDateRange(
        startDate: LocalDateTime,
        endDate: LocalDateTime,
        pageable: Pageable
    ): Page<TransactionResponse> {
        val user = getCurrentUser()
        return transactionRepository.findByUserIdAndTransactionDateBetween(
            user.id,
            startDate,
            endDate,
            pageable
        ).map { toTransactionResponse(it) }
    }

    fun getTransactionsByCategory(category: String, pageable: Pageable): Page<TransactionResponse> {
        val user = getCurrentUser()
        return transactionRepository.findByUserIdAndCategory(user.id, category, pageable)
            .map { toTransactionResponse(it) }
    }

    fun getStatistics(): TransactionStatistics {
        val user = getCurrentUser()
        
        // Получаем все транзакции пользователя
        val allTransactions = transactionRepository.findAll()
            .filter { it.userId == user.id }
        
        // Вычисляем суммы
        val totalIncome = allTransactions
            .filter { it.transactionType == TransactionType.INCOME }
            .sumOf { it.amount.amount }
        
        val totalExpenses = allTransactions
            .filter { it.transactionType == TransactionType.EXPENSE }
            .sumOf { it.amount.amount }

        return TransactionStatistics(
            totalIncome = totalIncome,
            totalExpenses = totalExpenses,
            balance = totalIncome.subtract(totalExpenses),
            currency = "RUB" // TODO: Support multiple currencies
        )
    }

    fun getTransactionById(id: UUID): TransactionResponse {
        val user = getCurrentUser()
        val transaction = transactionRepository.findById(id)
            .orElseThrow { 
                logger.warn("Transaction not found: $id")
                IllegalArgumentException("Transaction not found") 
            }

        if (transaction.userId != user.id) {
            logger.warn("Unauthorized access attempt to transaction $id by user ${user.id}")
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
            id = transaction.id,
            accountId = transaction.accountId,
            fileId = transaction.fileId,
            description = transaction.description,
            amount = transaction.amount.amount,
            currency = transaction.amount.currency,
            transactionDate = transaction.transactionDate,
            category = transaction.category,
            merchant = transaction.merchant,
            transactionType = transaction.transactionType,
            status = transaction.status,
            recipientName = transaction.recipientName,
            recipientInn = transaction.recipientInn,
            recipientAccount = transaction.recipientAccount,
            paymentPurpose = transaction.paymentPurpose,
            documentNumber = transaction.documentNumber,
            createdAt = transaction.createdAt
        )
    }
}

