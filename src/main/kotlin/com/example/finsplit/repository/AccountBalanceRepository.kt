package com.example.finsplit.repository

import com.example.finsplit.domain.AccountBalance
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.stereotype.Repository
import java.time.LocalDate
import java.util.*

@Repository
interface AccountBalanceRepository : JpaRepository<AccountBalance, UUID> {
    fun findByAccountIdAndBalanceDate(accountId: UUID, balanceDate: LocalDate): Optional<AccountBalance>
    
    fun findByAccountIdOrderByBalanceDateDesc(accountId: UUID, pageable: Pageable): Page<AccountBalance>
    
    fun findByUserIdOrderByBalanceDateDesc(userId: UUID, pageable: Pageable): Page<AccountBalance>
    
    @Query("SELECT ab FROM AccountBalance ab WHERE ab.accountId = :accountId ORDER BY ab.balanceDate DESC LIMIT 1")
    fun findLatestByAccountId(accountId: UUID): Optional<AccountBalance>
}


