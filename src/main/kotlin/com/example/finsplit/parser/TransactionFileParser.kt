package com.example.finsplit.parser

import com.example.finsplit.domain.BankType
import com.example.finsplit.domain.FileFormat
import com.example.finsplit.dto.AccountMetadata
import com.example.finsplit.dto.ParsedTransaction
import java.io.InputStream

data class ParseResult(
    val transactions: List<ParsedTransaction>,
    val accountMetadata: AccountMetadata? = null
)

interface TransactionFileParser {
    /**
     * Returns the bank type this parser supports
     */
    fun getSupportedBank(): BankType
    
    /**
     * Returns the file formats this parser supports
     */
    fun getSupportedFormats(): List<FileFormat>
    
    /**
     * Check if this parser can handle the given bank and file format
     */
    fun canParse(bankType: BankType, fileName: String): Boolean {
        val fileExtension = fileName.substringAfterLast('.', "").lowercase()
        val format = when (fileExtension) {
            "txt" -> FileFormat.TXT
            "xlsx" -> FileFormat.XLSX
            "xls" -> FileFormat.XLS
            else -> return false
        }
        return getSupportedBank() == bankType && getSupportedFormats().contains(format)
    }
    
    /**
     * Parse the file and return list of transactions with optional account metadata
     */
    fun parse(inputStream: InputStream, fileName: String): ParseResult
}

