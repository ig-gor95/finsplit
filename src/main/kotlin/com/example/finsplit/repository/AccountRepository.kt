package com.example.finsplit.repository

import com.example.finsplit.domain.Account
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.stereotype.Repository
import java.util.*

@Repository
interface AccountRepository : JpaRepository<Account, UUID> {
    fun findByAccountNumber(accountNumber: String): Optional<Account>
    fun findByUserIdAndAccountNumber(userId: UUID, accountNumber: String): Optional<Account>
    fun findByUserId(userId: UUID): List<Account>
    
    @Query("SELECT COUNT(t) FROM Transaction t WHERE t.accountId = :accountId")
    fun countTransactionsByAccountId(accountId: UUID): Long
}

