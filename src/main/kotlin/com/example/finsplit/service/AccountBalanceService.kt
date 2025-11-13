package com.example.finsplit.service

import com.example.finsplit.domain.AccountBalance
import com.example.finsplit.domain.User
import com.example.finsplit.dto.AccountBalanceResponse
import com.example.finsplit.repository.AccountBalanceRepository
import org.slf4j.LoggerFactory
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.stereotype.Service
import java.util.UUID

@Service
class AccountBalanceService(
    private val accountBalanceRepository: AccountBalanceRepository
) {

    private val logger = LoggerFactory.getLogger(AccountBalanceService::class.java)

    fun getBalancesByAccount(accountId: UUID, pageable: Pageable): Page<AccountBalanceResponse> {
        val user = getCurrentUser()
        return accountBalanceRepository.findByAccountIdOrderByBalanceDateDesc(accountId, pageable)
            .map { balance ->
                // Verify user owns this account
                if (balance.userId != user.id) {
                    throw IllegalAccessException("Unauthorized access to account balances")
                }
                toAccountBalanceResponse(balance)
            }
    }

    fun getLatestBalance(accountId: UUID): AccountBalanceResponse? {
        val user = getCurrentUser()
        val balance = accountBalanceRepository.findLatestByAccountId(accountId) ?: return null

        if (balance.userId != user.id) {
            logger.warn("Unauthorized access attempt to balance by user ${user.id}")
            throw IllegalAccessException("Unauthorized access to account balance")
        }

        return toAccountBalanceResponse(balance)
    }

    fun getAllBalances(pageable: Pageable): Page<AccountBalanceResponse> {
        val user = getCurrentUser()
        return accountBalanceRepository.findByUserIdOrderByBalanceDateDesc(user.id, pageable)
            .map { toAccountBalanceResponse(it) }
    }

    private fun getCurrentUser(): User {
        val authentication = SecurityContextHolder.getContext().authentication
        return authentication.principal as User
    }

    private fun toAccountBalanceResponse(balance: AccountBalance): AccountBalanceResponse {
        return AccountBalanceResponse(
            id = balance.id,
            accountId = balance.accountId,
            balanceDate = balance.balanceDate,
            balance = balance.balance.amount,
            currency = balance.balance.currency,
            fileId = balance.fileId,
            createdAt = balance.createdAt,
            updatedAt = balance.updatedAt
        )
    }
}


