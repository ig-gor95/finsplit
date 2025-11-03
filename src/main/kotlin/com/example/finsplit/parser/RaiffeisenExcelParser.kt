package com.example.finsplit.parser

import com.example.finsplit.domain.BankType
import com.example.finsplit.domain.FileFormat
import com.example.finsplit.dto.AccountMetadata
import com.example.finsplit.dto.ParsedTransaction
import com.example.finsplit.parser.ParseResult
import org.apache.poi.ss.usermodel.*
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Component
import java.io.InputStream
import java.math.BigDecimal
import java.time.LocalDate

@Component
class RaiffeisenExcelParser : TransactionFileParser {

    private val logger = LoggerFactory.getLogger(RaiffeisenExcelParser::class.java)

    override fun getSupportedBank(): BankType = BankType.RAIFFEISEN

    override fun getSupportedFormats(): List<FileFormat> = listOf(FileFormat.XLSX, FileFormat.XLS)

    override fun parse(inputStream: InputStream, fileName: String): ParseResult {
        val transactions = mutableListOf<ParsedTransaction>()
        var accountMetadata: AccountMetadata? = null
        
        try {
            WorkbookFactory.create(inputStream).use { workbook ->
                val sheet = workbook.getSheetAt(0)
                val dataFormatter = DataFormatter()
                var headerRow: Row? = null
                val columnIndices = mutableMapOf<String, Int>()

                logger.debug("Starting to parse Excel file: $fileName")
                
                // Parse account metadata from first rows (before header)
                accountMetadata = parseAccountMetadata(sheet, dataFormatter)

                // Find header row and map column names to indices
                var headerRowNumStart: Int = 0
                for (row in sheet) {
                    val firstCell = row.getCell(0)
                    if (firstCell != null) {
                        val cellValue = getCellValueAsString(firstCell, dataFormatter)
                        // Check if this looks like a header row
                        if (headerRowNumStart != 0 || cellValue.contains("№ П/П", ignoreCase = true)) {
                            headerRow = row
                            // Map column names
                            for (cell in row) {
                                val columnName = getCellValueAsString(cell, dataFormatter)
                                if (columnName.isNotBlank()) {
                                    columnIndices[columnName] = cell.columnIndex
                                }
                            }
                            logger.debug("Found header row at index ${row.rowNum}, columns: ${columnIndices.keys}")
                            if (row.rowNum - headerRowNumStart == 1) break
                            headerRowNumStart = row.rowNum
                        }
                    }
                }

                if (headerRow == null) {
                    logger.warn("No header row found in Excel file: $fileName")
                    return ParseResult(emptyList(), accountMetadata)
                }

                // Process data rows
                val headerRowNum = headerRow.rowNum
                for (i in (headerRowNum + 1) until sheet.lastRowNum + 1) {
                    val row = sheet.getRow(i) ?: continue
                    
                    try {
                        val transaction = parseRow(row, columnIndices, dataFormatter)
                        if (transaction != null) {
                            transactions.add(transaction)
                        }
                    } catch (e: Exception) {
                        logger.warn("Failed to parse row ${i + 1}: ${e.message}", e)
                        // Skip rows that can't be parsed
                        continue
                    }
                }
                
                logger.info("Successfully parsed ${transactions.size} transactions from Excel file")
                if (accountMetadata != null) {
                    logger.debug("Parsed account metadata: ${accountMetadata.accountNumber}, client: ${accountMetadata.clientName}")
                }
            }
        } catch (e: Exception) {
            logger.error("Failed to parse Excel file: $fileName", e)
            throw e
        }

        return ParseResult(transactions, accountMetadata)
    }
    
    private fun parseAccountMetadata(sheet: Sheet, dataFormatter: DataFormatter): AccountMetadata? {
        return try {
            var clientName: String? = null
            var inn: String? = null
            var accountName: String? = null
            var accountNumber: String? = null
            var currency: String? = null
            var previousStatementDate: LocalDate? = null
            var openingBalance: BigDecimal? = null
            
            // Parse first 9 rows for metadata
            for (i in 0 until minOf(9, sheet.lastRowNum + 1)) {
                val row = sheet.getRow(i) ?: continue
                val firstCell = row.getCell(0)
                val secondCell = row.getCell(1)
                
                if (firstCell == null) continue
                
                val label = getCellValueAsString(firstCell, dataFormatter).lowercase()
                val value = if (secondCell != null) getCellValueAsString(secondCell, dataFormatter) else null
                
                when {
                    label.contains("клиент") || label.contains("client") -> {
                        clientName = value
                    }
                    label.contains("инн") || label.contains("inn") -> {
                        inn = value
                    }
                    label.contains("наименование счета") || label.contains("account name") -> {
                        accountName = value
                    }
                    label.contains("номер счета") || label.contains("account number") -> {
                        accountNumber = value
                    }
                    label.contains("валюта счета") || label.contains("account currency") -> {
                        currency = value?.let {
                            when {
                                it.contains("810") || it.contains("рубль", ignoreCase = true) -> "RUB"
                                it.contains("840") || it.contains("dollar", ignoreCase = true) -> "USD"
                                it.contains("978") || it.contains("euro", ignoreCase = true) -> "EUR"
                                else -> it
                            }
                        }
                    }
                    label.contains("дата предыдущей выписки") || label.contains("previous statement date") -> {
                        previousStatementDate = value?.let { parseDateString(it) }
                    }
                    label.contains("входящий остаток") || label.contains("opening balance") -> {
                        openingBalance = value?.let { parseBalanceString(it) }
                    }
                }
            }
            
            AccountMetadata(
                clientName = clientName,
                inn = inn,
                accountName = accountName,
                accountNumber = accountNumber,
                currency = currency,
                previousStatementDate = previousStatementDate,
                openingBalance = openingBalance
            )
        } catch (e: Exception) {
            logger.warn("Failed to parse account metadata: ${e.message}")
            null
        }
    }
    
    private fun parseDateString(dateStr: String): LocalDate? {
        return try {
            val cleaned = dateStr.trim()
            val patterns = listOf(
                "dd.MM.yyyy",
                "dd/MM/yyyy",
                "yyyy-MM-dd"
            )
            
            for (pattern in patterns) {
                try {
                    return LocalDate.parse(cleaned, java.time.format.DateTimeFormatter.ofPattern(pattern))
                } catch (e: Exception) {
                    continue
                }
            }
            null
        } catch (e: Exception) {
            null
        }
    }
    
    private fun parseBalanceString(balanceStr: String): BigDecimal? {
        return try {
            balanceStr.replace(" ", "")
                .replace(",", ".")
                .replace("Kp/Cr", "")
                .replace("Дт/Dr", "")
                .trim()
                .toBigDecimalOrNull()
        } catch (e: Exception) {
            null
        }
    }

    private fun parseRow(row: Row, columnIndices: Map<String, Int>, dataFormatter: DataFormatter): ParsedTransaction? {
        try {
            // Try to find relevant columns by common names
            val dateColumn = findColumn(columnIndices, "Дата документа", "Дата", "Date")
            val amountColumn = findColumn(columnIndices, "Сумма", "Amount", "Дебет", "Кредит")
            val documentNumberColumn = findColumn(columnIndices, "Номер документа", "Номер", "Number")
            
            val date = dateColumn?.let { getDateValue(row.getCell(it)) } ?: return null
            val amount = amountColumn?.let { getNumericValue(row.getCell(it)) } ?: return null
            
            if (amount == BigDecimal.ZERO) {
                return null
            }

            val documentNumber = documentNumberColumn?.let { getStringValue(row.getCell(it), dataFormatter) }
            val payerAccount = findColumn(columnIndices, "Счет плательщика", "Счет Дт")
                ?.let { getStringValue(row.getCell(it), dataFormatter) }
            val recipientAccount = findColumn(columnIndices, "Счет получателя", "Счет Кт")
                ?.let { getStringValue(row.getCell(it), dataFormatter) }
            val payerName = findColumn(columnIndices, "Плательщик", "Контрагент")
                ?.let { getStringValue(row.getCell(it), dataFormatter) }
            val recipientName = findColumn(columnIndices, "Получатель", "Контрагент получатель")
                ?.let { getStringValue(row.getCell(it), dataFormatter) }
            val purpose = findColumn(columnIndices, "Назначение платежа", "Назначение", "Purpose")
                ?.let { getStringValue(row.getCell(it), dataFormatter) }

            return ParsedTransaction(
                documentNumber = documentNumber,
                documentDate = date,
                amount = amount.abs(),
                transactionDate = date.atStartOfDay(),
                accountNumber = payerAccount ?: recipientAccount,
                payerName = payerName,
                payerInn = null,
                payerAccount = payerAccount,
                recipientName = recipientName,
                recipientInn = null,
                recipientAccount = recipientAccount,
                paymentPurpose = purpose,
                currency = "RUB"
            )
        } catch (e: Exception) {
            logger.debug("Failed to parse row: ${e.message}")
            return null
        }
    }

    private fun findColumn(columnIndices: Map<String, Int>, vararg names: String): Int? {
        for (name in names) {
            for ((key, value) in columnIndices) {
                if (key.contains(name, ignoreCase = true)) {
                    return value
                }
            }
        }
        return null
    }

    private fun getCellValueAsString(cell: Cell, dataFormatter: DataFormatter): String {
        return try {
            dataFormatter.formatCellValue(cell).trim()
        } catch (e: Exception) {
            ""
        }
    }

    private fun getStringValue(cell: Cell?, dataFormatter: DataFormatter): String? {
        if (cell == null) return null
        
        return try {
            when (cell.cellType) {
                CellType.STRING -> cell.stringCellValue.trim()
                CellType.NUMERIC -> {
                    if (DateUtil.isCellDateFormatted(cell)) {
                        dataFormatter.formatCellValue(cell)
                    } else {
                        // Format as integer if it's a whole number, otherwise as decimal
                        val numValue = cell.numericCellValue
                        if (numValue == numValue.toLong().toDouble()) {
                            numValue.toLong().toString()
                        } else {
                            numValue.toString()
                        }
                    }
                }
                CellType.BOOLEAN -> cell.booleanCellValue.toString()
                CellType.FORMULA -> {
                    try {
                        when (cell.cachedFormulaResultType) {
                            CellType.STRING -> cell.stringCellValue
                            CellType.NUMERIC -> {
                                val numValue = cell.numericCellValue
                                if (numValue == numValue.toLong().toDouble()) {
                                    numValue.toLong().toString()
                                } else {
                                    numValue.toString()
                                }
                            }
                            CellType.BOOLEAN -> cell.booleanCellValue.toString()
                            else -> dataFormatter.formatCellValue(cell)
                        }
                    } catch (e: Exception) {
                        dataFormatter.formatCellValue(cell)
                    }
                }
                CellType.BLANK -> null
                else -> dataFormatter.formatCellValue(cell)
            }?.trim()?.takeIf { it.isNotBlank() }
        } catch (e: Exception) {
            logger.warn("Failed to read cell value as string: ${e.message}")
            null
        }
    }

    private fun getNumericValue(cell: Cell?): BigDecimal? {
        if (cell == null) return null
        
        return try {
            when (cell.cellType) {
                CellType.NUMERIC -> BigDecimal.valueOf(cell.numericCellValue)
                CellType.STRING -> {
                    cell.stringCellValue.trim()
                        .replace(",", ".")
                        .replace(" ", "")
                        .replace("\\s+".toRegex(), "")
                        .toBigDecimalOrNull()
                }
                CellType.FORMULA -> {
                    try {
                        BigDecimal.valueOf(cell.numericCellValue)
                    } catch (e: Exception) {
                        null
                    }
                }
                else -> null
            }
        } catch (e: Exception) {
            logger.warn("Failed to read cell value as number: ${e.message}")
            null
        }
    }

    private fun getDateValue(cell: Cell?): LocalDate? {
        if (cell == null) return null
        
        return try {
            when (cell.cellType) {
                CellType.NUMERIC -> {
                    if (DateUtil.isCellDateFormatted(cell)) {
                        cell.localDateTimeCellValue.toLocalDate()
                    } else {
                        null
                    }
                }
                CellType.STRING -> {
                    // Try to parse string as date with multiple formats
                    val dateStr = cell.stringCellValue.trim()
                    val patterns = listOf(
                        "dd.MM.yyyy",
                        "dd/MM/yyyy",
                        "yyyy-MM-dd",
                        "dd-MM-yyyy"
                    )
                    
                    for (pattern in patterns) {
                        try {
                            return LocalDate.parse(dateStr, java.time.format.DateTimeFormatter.ofPattern(pattern))
                        } catch (e: Exception) {
                            // Try next pattern
                            continue
                        }
                    }
                    null
                }
                CellType.FORMULA -> {
                    try {
                        if (DateUtil.isCellDateFormatted(cell)) {
                            cell.localDateTimeCellValue.toLocalDate()
                        } else {
                            null
                        }
                    } catch (e: Exception) {
                        null
                    }
                }
                else -> null
            }
        } catch (e: Exception) {
            logger.warn("Failed to read cell value as date: ${e.message}")
            null
        }
    }
}

