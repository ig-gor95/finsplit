# Finsplit - Banking Transaction Analytics

A Spring Boot application for parsing and providing analytics of banking transactions for customers.

## Features

- **User Authentication**: JWT-based authentication system
- **User Registration & Login**: Secure user management with password encryption
- **Transaction Management**: Create and manage banking transactions
- **File Upload & Parsing**: 
  - Upload bank statement files from multiple banks
  - Bank-specific parsers (Raiffeisen, 1C:Enterprise)
  - Support for Excel (.xlsx, .xls) and text (.txt) formats
  - Automatic transaction deduplication
  - Update existing transactions from new files
  - Easy to add new bank parsers (see [ADDING_NEW_BANK_PARSER.md](ADDING_NEW_BANK_PARSER.md))
- **Transaction Analytics**: 
  - Filter transactions by date range
  - Filter transactions by category
  - View transaction statistics (income, expenses, balance)
- **PostgreSQL Database**: Persistent data storage
- **Liquibase Migrations**: Database version control
- **API Documentation**: Interactive Swagger/OpenAPI documentation

## Tech Stack

- **Backend**: Spring Boot 3.2.0
- **Language**: Kotlin 2.2.0
- **Database**: PostgreSQL
- **Security**: Spring Security + JWT
- **ORM**: Spring Data JPA / Hibernate
- **Migration**: Liquibase
- **File Parsing**: Apache POI 5.2.5 for Excel files
- **API Documentation**: SpringDoc OpenAPI 2.3.0
- **Build Tool**: Maven

## Prerequisites

- Java 17 or higher
- PostgreSQL 12 or higher
- Maven 3.6 or higher

## Getting Started

### 1. Database Setup

Create a PostgreSQL database:

```sql
CREATE DATABASE finsplit;
CREATE USER postgres WITH PASSWORD 'postgres';
GRANT ALL PRIVILEGES ON DATABASE finsplit TO postgres;
```

### 2. Configuration

Update the database connection in `src/main/resources/application.yml`:

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/finsplit
    username: postgres
    password: postgres
```

For production, set the JWT secret as an environment variable:

```bash
export JWT_SECRET=your-secret-key-at-least-256-bits-long
```

### 3. Build and Run

```bash
# Build the project
mvn clean install

# Run the application
mvn spring-boot:run
```

The application will start on `http://localhost:8080`

## API Documentation

Once the application is running, you can access the interactive API documentation:

- **Swagger UI**: http://localhost:8080/swagger-ui.html
- **OpenAPI JSON**: http://localhost:8080/v3/api-docs

The Swagger UI provides an interactive interface where you can:
- View all available endpoints
- Test API calls directly from the browser
- See request/response schemas
- Authenticate with JWT tokens

### Using Swagger UI with Authentication

1. Register or login to get a JWT token
2. Click the "Authorize" button in Swagger UI
3. Enter your token in the format: `Bearer <your-token>`
4. Now you can test all authenticated endpoints

## API Endpoints

### Authentication

#### Register a new user
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

Response:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe"
}
```

### Transactions

All transaction endpoints require authentication. Include the JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

#### Create a transaction
```http
POST /api/transactions
Content-Type: application/json
Authorization: Bearer <token>

{
  "description": "Grocery shopping",
  "amount": 125.50,
  "currency": "USD",
  "transactionDate": "2025-11-02T10:30:00",
  "category": "Groceries",
  "merchant": "Whole Foods",
  "transactionType": "EXPENSE",
  "status": "COMPLETED"
}
```

#### Get all transactions (paginated)
```http
GET /api/transactions?page=0&size=20&sort=transactionDate,desc
Authorization: Bearer <token>
```

#### Get transaction by ID
```http
GET /api/transactions/{id}
Authorization: Bearer <token>
```

#### Filter by date range
```http
GET /api/transactions/filter/date-range?startDate=2025-01-01T00:00:00&endDate=2025-12-31T23:59:59
Authorization: Bearer <token>
```

#### Filter by category
```http
GET /api/transactions/filter/category?category=Groceries
Authorization: Bearer <token>
```

#### Get statistics
```http
GET /api/transactions/statistics
Authorization: Bearer <token>
```

Response:
```json
{
  "totalIncome": 5000.00,
  "totalExpenses": 2500.00,
  "balance": 2500.00
}
```

#### Upload bank statement file
```http
POST /api/transactions/upload
Authorization: Bearer <token>
Content-Type: multipart/form-data

file: [your bank statement file]
bankType: RAIFFEISEN (or ONE_C_FORMAT)
```

**Supported banks and formats:**

| Bank Type | File Formats | Description |
|-----------|-------------|-------------|
| `RAIFFEISEN` | .xlsx, .xls, .txt | Raiffeisen Bank statements (Excel or 1C format) |
| `ONE_C_FORMAT` | .txt | Generic 1C:Enterprise format (windows-1251) |

**Example with cURL:**
```bash
curl -X POST http://localhost:8080/api/transactions/upload \
  -H "Authorization: Bearer <token>" \
  -F "file=@statement.xlsx" \
  -F "bankType=RAIFFEISEN"
```

Response:
```json
{
  "fileName": "statement.xlsx",
  "totalTransactions": 50,
  "importedTransactions": 45,
  "updatedTransactions": 5,
  "skippedTransactions": 0,
  "errors": []
}
```

The system will:
- Use bank-specific parser for the file
- Parse all transactions from the file
- Create new transactions that don't exist
- Update existing transactions (matched by external ID)
- Skip invalid transactions and report errors

#### Get supported banks
```http
GET /api/transactions/supported-banks
Authorization: Bearer <token>
```

Returns list of all supported bank types.

### Accounts

All account endpoints require authentication.

#### Get all accounts
```http
GET /api/accounts
Authorization: Bearer <token>
```

Returns list of all bank accounts for the authenticated user.

Response:
```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "accountNumber": "40702810607000072502",
    "clientName": "ООО \"ШТУРМАН\"",
    "inn": "2460117837",
    "accountName": "расчетный счет",
    "currency": "RUB",
    "lastStatementDate": "2025-07-09",
    "currentBalance": 3917.63,
    "transactionCount": 45,
    "createdAt": "2025-11-03T12:00:00",
    "updatedAt": "2025-11-03T14:30:00"
  }
]
```

#### Get account by ID
```http
GET /api/accounts/{id}
Authorization: Bearer <token>
```

### Account Balances

All balance endpoints require authentication.

#### Get all balance records
```http
GET /api/balances
Authorization: Bearer <token>
```

Returns paginated balance history for all accounts.

#### Get balance history for specific account
```http
GET /api/balances/account/{accountId}
Authorization: Bearer <token>
```

Response:
```json
{
  "content": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "accountId": "660e8400-e29b-41d4-a716-446655440001",
      "balanceDate": "2025-11-03",
      "balance": 13277.87,
      "currency": "RUB",
      "fileId": "770e8400-e29b-41d4-a716-446655440002",
      "createdAt": "2025-11-03T14:30:00",
      "updatedAt": "2025-11-03T14:30:00"
    }
  ]
}
```

#### Get latest balance for account
```http
GET /api/balances/account/{accountId}/latest
Authorization: Bearer <token>
```

Returns the most recent balance record.

### Uploaded Files

#### Get all uploaded files
```http
GET /api/files
Authorization: Bearer <token>
```

#### Get uploaded file by ID
```http
GET /api/files/{id}
Authorization: Bearer <token>
```

#### Get files by account
```http
GET /api/files/account/{accountId}
Authorization: Bearer <token>
```

### Health Check
```http
GET /api/health
```

## Transaction Types

- `INCOME`: Money received
- `EXPENSE`: Money spent
- `TRANSFER`: Money transferred between accounts

## Transaction Statuses

- `PENDING`: Transaction is pending
- `COMPLETED`: Transaction is completed
- `FAILED`: Transaction failed
- `CANCELLED`: Transaction was cancelled

## Database Schema

### Users Table
- `id`: Primary key (UUID)
- `email`: Unique email address
- `password`: Encrypted password
- `first_name`: User's first name
- `last_name`: User's last name
- `enabled`: Account status
- `created_at`: Creation timestamp
- `updated_at`: Last update timestamp

### Accounts Table
- `id`: Primary key (UUID)
- `user_id`: Foreign key to users (UUID)
- `account_number`: Unique bank account number
- `client_name`: Client/company name
- `inn`: Tax identification number (ИНН)
- `account_name`: Account type/name
- `currency`: Currency code (RUB, USD, EUR, etc.)
- `last_statement_date`: Date of last imported statement
- `current_balance`: Current account balance
- `created_at`: Creation timestamp
- `updated_at`: Last update timestamp

### Transactions Table
- `id`: Primary key (UUID)
- `user_id`: Foreign key to users (UUID)
- `account_id`: Foreign key to accounts (UUID, optional)
- `description`: Transaction description
- `amount`: Transaction amount
- `currency`: Currency code (default: USD)
- `transaction_date`: When the transaction occurred
- `category`: Transaction category
- `merchant`: Merchant name
- `transaction_type`: Type of transaction (INCOME/EXPENSE/TRANSFER)
- `status`: Transaction status
- `external_id`: Unique identifier from bank file (for deduplication)
- `document_number`: Document/payment number
- `document_date`: Document date
- `account_number`: Bank account number
- `payer_name`: Name of the payer
- `payer_inn`: Payer's tax ID
- `payer_account`: Payer's bank account
- `recipient_name`: Name of the recipient
- `recipient_inn`: Recipient's tax ID
- `recipient_account`: Recipient's bank account
- `payment_purpose`: Payment description/purpose
- `source_file_name`: Original uploaded file name
- `imported_at`: When the transaction was imported
- `created_at`: Creation timestamp
- `updated_at`: Last update timestamp

## Development

### Running Tests
```bash
mvn test
```

### Building for Production
```bash
mvn clean package -DskipTests
java -jar target/split-finance-1.0-SNAPSHOT.jar
```

## Security Notes

- Change the default JWT secret in production
- Use environment variables for sensitive configuration
- The default JWT token expires in 24 hours
- Passwords are encrypted using BCrypt
- CSRF protection is disabled for stateless JWT authentication
- All endpoints except `/api/auth/**` and `/api/health` require authentication

## License

MIT License

