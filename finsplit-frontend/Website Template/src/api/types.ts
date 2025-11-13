// API Response Types matching Spring Boot DTOs

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface AuthResponse {
  token: string;
  email: string;
  firstName: string;
  lastName: string;
}

export interface LoginResponse extends AuthResponse {}

export interface Account {
  id: string;
  accountNumber: string;
  clientName?: string;
  inn?: string;
  accountName?: string;
  currency: string;
  lastStatementDate?: string;
  currentBalance?: number;
  latestBalanceDate?: string;  // Дата последнего баланса из account_balances
  transactionCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Transaction {
  id: string;
  accountId?: string;
  fileId?: string;
  description: string;
  amount: number;
  currency: string;
  transactionDate: string;
  category?: string;
  merchant?: string;
  transactionType: 'INCOME' | 'EXPENSE' | 'TRANSFER';
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
  recipientName?: string;
  recipientInn?: string;
  recipientAccount?: string;
  paymentPurpose?: string;
  documentNumber?: string;
  createdAt: string;
}

export interface TransactionStatistics {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  currency: string;
}

export interface UploadedFile {
  id: string;
  userId: string;
  accountId?: string;
  fileName: string;
  bankType: 'RAIFFEISEN' | 'HALYK' | 'SBERBANK' | 'KASPI' | 'OTHER';
  fileSize: number;
  totalTransactions: number;
  importedTransactions: number;
  updatedTransactions: number;
  skippedTransactions: number;
  errors?: string;
  status: 'PROCESSING' | 'COMPLETED' | 'FAILED';
  uploadedAt: string;
}

export interface FileUploadResponse {
  fileName: string;
  totalTransactions: number;
  importedTransactions: number;
  updatedTransactions: number;
  skippedTransactions: number;
  errors: string[];
  accountMetadata?: AccountMetadata;
}

export interface AccountMetadata {
  clientName?: string;
  inn?: string;
  accountName?: string;
  accountNumber?: string;
  currency?: string;
  previousStatementDate?: string;
  statementDate?: string;
  openingBalance?: number;
  closingBalance?: number;
}

export interface AccountBalance {
  id: string;
  userId: string;
  accountId: string;
  balanceDate: string;
  currency: string;
  balanceAmount: number;
  fileId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export interface TransactionPageResponse {
  content: Transaction[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  // Суммы по ВСЕМ транзакциям (не только текущей странице)
  totalIncome: number;
  totalExpenses: number;
  balance: number;
}

export interface ApiError {
  message: string;
  status: number;
  timestamp: string;
  path?: string;
}

