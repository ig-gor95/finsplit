package com.example.finsplit.parser

import com.example.finsplit.dto.ParsedTransaction
import org.apache.poi.ss.usermodel.CellType
import org.apache.poi.ss.usermodel.DateUtil
import org.apache.poi.ss.usermodel.Row
import org.apache.poi.ss.usermodel.WorkbookFactory
import org.springframework.stereotype.Component
import java.io.InputStream
import java.math.BigDecimal
import java.time.LocalDate
import java.time.ZoneId

@Component
class ExcelFormatParser : TransactionFileParser {

    override fun canParse(fileName: String): Boolean {
        return fileName.endsWith(".xlsx", ignoreCase = true) || 
               fileName.endsWith(".xls", ignoreCase = true)
    }

    override fun parse(inputStream: InputStream, fileName: String): List<ParsedTransaction> {
        val transactions = mutableListOf<ParsedTransaction>()
        
        WorkbookFactory.create(inputStream).use { workbook ->
            val sheet = workbook.getSheetAt(0)
            var headerRow: Row? = null
            val columnIndices = mutableMapOf<String, Int>()

            // Find header row and map column names to indices
            for (row in sheet) {
                val firstCell = row.getCell(0)
                if (firstCell != null && firstCell.cellType == CellType.STRING) {
                    val cellValue = firstCell.stringCellValue.trim()
                    // Check if this looks like a header row
                    if (cellValue.contains("Дата", ignoreCase = true) || 
                        cellValue.contains("Номер", ignoreCase = true)) {
                        headerRow = row
                        // Map column names
                        for (cell in row) {
                            val columnName = cell.stringCellValue.trim()
                            columnIndices[columnName] = cell.columnIndex
                        }
                        break
                    }
                }
            }

            if (headerRow == null) {
                return emptyList()
            }

            // Process data rows
            val headerRowNum = headerRow.rowNum
            for (i in (headerRowNum + 1) until sheet.lastRowNum + 1) {
                val row = sheet.getRow(i) ?: continue
                
                try {
                    val transaction = parseRow(row, columnIndices)
                    if (transaction != null) {
                        transactions.add(transaction)
                    }
                } catch (e: Exception) {
                    // Skip rows that can't be parsed
                    continue
                }
            }
        }

        return transactions
    }

    private fun parseRow(row: Row, columnIndices: Map<String, Int>): ParsedTransaction? {
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

            val documentNumber = documentNumberColumn?.let { getStringValue(row.getCell(it)) }
            val payerAccount = findColumn(columnIndices, "Счет плательщика", "Счет Дт")
                ?.let { getStringValue(row.getCell(it)) }
            val recipientAccount = findColumn(columnIndices, "Счет получателя", "Счет Кт")
                ?.let { getStringValue(row.getCell(it)) }
            val payerName = findColumn(columnIndices, "Плательщик", "Контрагент")
                ?.let { getStringValue(row.getCell(it)) }
            val recipientName = findColumn(columnIndices, "Получатель", "Контрагент получатель")
                ?.let { getStringValue(row.getCell(it)) }
            val purpose = findColumn(columnIndices, "Назначение платежа", "Назначение", "Purpose")
                ?.let { getStringValue(row.getCell(it)) }

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

    private fun getStringValue(cell: org.apache.poi.ss.usermodel.Cell?): String? {
        return when (cell?.cellType) {
            CellType.STRING -> cell.stringCellValue.trim()
            CellType.NUMERIC -> cell.numericCellValue.toString()
            else -> null
        }
    }

    private fun getNumericValue(cell: org.apache.poi.ss.usermodel.Cell?): BigDecimal? {
        return when (cell?.cellType) {
            CellType.NUMERIC -> BigDecimal.valueOf(cell.numericCellValue)
            CellType.STRING -> cell.stringCellValue.trim()
                .replace(",", ".")
                .replace(" ", "")
                .toBigDecimalOrNull()
            else -> null
        }
    }

    private fun getDateValue(cell: org.apache.poi.ss.usermodel.Cell?): LocalDate? {
        return when (cell?.cellType) {
            CellType.NUMERIC -> {
                if (DateUtil.isCellDateFormatted(cell)) {
                    cell.localDateTimeCellValue.toLocalDate()
                } else {
                    null
                }
            }
            CellType.STRING -> {
                // Try to parse string as date
                try {
                    val dateStr = cell.stringCellValue.trim()
                    LocalDate.parse(dateStr, java.time.format.DateTimeFormatter.ofPattern("dd.MM.yyyy"))
                } catch (e: Exception) {
                    null
                }
            }
            else -> null
        }
    }
}

