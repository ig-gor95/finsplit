# Finsplit - Banking Transaction Analytics

A Spring Boot application for parsing and providing analytics of banking transactions for customers.

## Features

- **User Authentication**: JWT-based authentication system
- **User Registration & Login**: Secure user management with password encryption
- **Transaction Management**: Create and manage banking transactions
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
- `id`: Primary key
- `email`: Unique email address
- `password`: Encrypted password
- `first_name`: User's first name
- `last_name`: User's last name
- `enabled`: Account status
- `created_at`: Creation timestamp
- `updated_at`: Last update timestamp

### Transactions Table
- `id`: Primary key
- `user_id`: Foreign key to users
- `description`: Transaction description
- `amount`: Transaction amount
- `currency`: Currency code (default: USD)
- `transaction_date`: When the transaction occurred
- `category`: Transaction category
- `merchant`: Merchant name
- `transaction_type`: Type of transaction (INCOME/EXPENSE/TRANSFER)
- `status`: Transaction status
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

