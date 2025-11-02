package com.example.finsplit.repository

import com.example.finsplit.domain.Transaction
import com.example.finsplit.domain.TransactionType
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.stereotype.Repository
import java.math.BigDecimal
import java.time.LocalDateTime

@Repository
interface TransactionRepository : JpaRepository<Transaction, Long> {
    fun findByUserId(userId: Long, pageable: Pageable): Page<Transaction>
    
    fun findByUserIdAndTransactionDateBetween(
        userId: Long,
        startDate: LocalDateTime,
        endDate: LocalDateTime,
        pageable: Pageable
    ): Page<Transaction>
    
    fun findByUserIdAndCategory(userId: Long, category: String, pageable: Pageable): Page<Transaction>
    
    @Query("SELECT SUM(t.amount) FROM Transaction t WHERE t.user.id = :userId AND t.transactionType = :type")
    fun getTotalAmountByUserAndType(userId: Long, type: TransactionType): BigDecimal?
    
    @Query("SELECT t FROM Transaction t WHERE t.user.id = :userId AND t.transactionDate >= :startDate")
    fun findRecentTransactions(userId: Long, startDate: LocalDateTime): List<Transaction>
}

