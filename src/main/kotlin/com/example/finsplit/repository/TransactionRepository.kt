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
import java.util.UUID

@Repository
interface TransactionRepository : JpaRepository<Transaction, UUID> {
    fun findByUserId(userId: UUID, pageable: Pageable): Page<Transaction>
    
    fun findByUserIdAndTransactionDateBetween(
        userId: UUID,
        startDate: LocalDateTime,
        endDate: LocalDateTime,
        pageable: Pageable
    ): Page<Transaction>
    
    fun findByUserIdAndCategory(userId: UUID, category: String, pageable: Pageable): Page<Transaction>
    
    @Query("SELECT SUM(t.amount) FROM Transaction t WHERE t.userId = :userId AND t.transactionType = :type")
    fun getTotalAmountByUserAndType(userId: UUID, type: TransactionType): BigDecimal?
    
    @Query("SELECT t FROM Transaction t WHERE t.userId = :userId AND t.transactionDate >= :startDate")
    fun findRecentTransactions(userId: UUID, startDate: LocalDateTime): List<Transaction>
    
    fun findByExternalId(externalId: String): Transaction?
    
    fun findByUserIdAndExternalIdIn(userId: UUID, externalIds: List<String>): List<Transaction>
    
    fun findByFileId(fileId: UUID, pageable: Pageable): Page<Transaction>
    
    fun countByFileId(fileId: UUID): Long
    
    @Query("SELECT MAX(t.transactionDate) FROM Transaction t WHERE t.accountId = :accountId")
    fun findLatestTransactionDateByAccountId(accountId: UUID): LocalDateTime?
}

