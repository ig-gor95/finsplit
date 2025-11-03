package com.example.finsplit.service

import com.example.finsplit.domain.Account
import com.example.finsplit.domain.Money
import com.example.finsplit.domain.User
import com.example.finsplit.dto.AccountResponse
import com.example.finsplit.repository.AccountRepository
import org.slf4j.LoggerFactory
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.stereotype.Service
import java.util.UUID

@Service
class AccountService(
    private val accountRepository: AccountRepository
) {

    private val logger = LoggerFactory.getLogger(AccountService::class.java)

    fun getAllAccounts(): List<AccountResponse> {
        val user = getCurrentUser()
        val accounts = accountRepository.findByUserId(user.id)
        return accounts.map { toAccountResponse(it) }
    }

    fun getAccountById(id: UUID): AccountResponse {
        val user = getCurrentUser()
        val account = accountRepository.findById(id)
            .orElseThrow {
                logger.warn("Account not found: $id")
                IllegalArgumentException("Account not found")
            }

        if (account.userId != user.id) {
            logger.warn("Unauthorized access attempt to account $id by user ${user.id}")
            throw IllegalAccessException("Unauthorized access to account")
        }

        return toAccountResponse(account)
    }

    private fun getCurrentUser(): User {
        val authentication = SecurityContextHolder.getContext().authentication
        return authentication.principal as User
    }

    private fun toAccountResponse(account: Account): AccountResponse {
        val transactionCount = accountRepository.countTransactionsByAccountId(account.id)
        
        return AccountResponse(
            id = account.id,
            accountNumber = account.accountNumber,
            clientName = account.clientName,
            inn = account.inn,
            accountName = account.accountName,
            currency = account.currency,
            lastStatementDate = account.lastStatementDate,
            currentBalance = account.currentBalance,
            transactionCount = transactionCount.toInt(),
            createdAt = account.createdAt,
            updatedAt = account.updatedAt
        )
    }
}

