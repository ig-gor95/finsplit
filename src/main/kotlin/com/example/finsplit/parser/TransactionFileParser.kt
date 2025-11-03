package com.example.finsplit.parser

import com.example.finsplit.dto.ParsedTransaction
import java.io.InputStream

interface TransactionFileParser {
    fun canParse(fileName: String): Boolean
    fun parse(inputStream: InputStream, fileName: String): List<ParsedTransaction>
}

