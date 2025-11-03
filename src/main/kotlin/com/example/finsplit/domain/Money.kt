package com.example.finsplit.domain

import jakarta.persistence.Column
import jakarta.persistence.Embeddable
import java.math.BigDecimal
import java.math.RoundingMode

/**
 * Money value object representing a monetary amount with currency.
 * Example: Money(amount=100.50, currency="USD")
 */
@Embeddable
data class Money(
    @Column(nullable = false)
    val currency: String,
    
    @Column(nullable = false)
    val amount: BigDecimal
) {
    companion object {
        /**
         * Creates Money from decimal amount
         */
        fun of(amount: BigDecimal, currency: String): Money {
            return Money(currency, amount.setScale(2, RoundingMode.HALF_UP))
        }
        
        /**
         * Creates Money from decimal amount string
         */
        fun of(amount: String, currency: String): Money {
            return of(BigDecimal(amount), currency)
        }
        
        /**
         * Zero amount
         */
        fun zero(currency: String = "RUB"): Money {
            return Money(currency, BigDecimal.ZERO)
        }
    }
    
    /**
     * Returns formatted string representation
     * Example: "100.50 USD"
     */
    fun toFormattedString(): String {
        return "${amount} $currency"
    }
    
    /**
     * Add two money amounts (must be same currency)
     */
    operator fun plus(other: Money): Money {
        require(this.currency == other.currency) { 
            "Cannot add money with different currencies: $currency and ${other.currency}" 
        }
        return Money(currency, amount.add(other.amount))
    }
    
    /**
     * Subtract two money amounts (must be same currency)
     */
    operator fun minus(other: Money): Money {
        require(this.currency == other.currency) { 
            "Cannot subtract money with different currencies: $currency and ${other.currency}" 
        }
        return Money(currency, amount.subtract(other.amount))
    }
    
    /**
     * Check if amount is positive
     */
    fun isPositive(): Boolean = amount > BigDecimal.ZERO
    
    /**
     * Check if amount is negative
     */
    fun isNegative(): Boolean = amount < BigDecimal.ZERO
    
    /**
     * Check if amount is zero
     */
    fun isZero(): Boolean = amount.compareTo(BigDecimal.ZERO) == 0
    
    /**
     * Get absolute value
     */
    fun abs(): Money = Money(currency, amount.abs())
}

