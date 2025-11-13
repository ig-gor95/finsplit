import { apiClient } from './config';
import { Transaction, TransactionStatistics, TransactionPageResponse } from './types';

export interface TransactionFilters {
  accountId?: string;
  transactionType?: string;
  status?: string;
  currency?: string;
}

export const transactionsApi = {
  // Получить все транзакции (с пагинацией и суммами)
  getTransactions: async (
    page: number = 0,
    size: number = 50,
    sort: string = 'transactionDate,desc',
    filters?: TransactionFilters
  ): Promise<TransactionPageResponse> => {
    const params: any = { page, size, sort };
    
    // Добавляем фильтры если они заданы
    if (filters?.accountId && filters.accountId !== 'all') {
      params.accountId = filters.accountId;
    }
    if (filters?.transactionType && filters.transactionType !== 'all') {
      params.transactionType = filters.transactionType;
    }
    if (filters?.status && filters.status !== 'all') {
      params.status = filters.status;
    }
    if (filters?.currency && filters.currency !== 'all') {
      params.currency = filters.currency;
    }
    
    const response = await apiClient.get<TransactionPageResponse>('/transactions', {
      params,
    });
    return response.data;
  },

  // Получить транзакции по диапазону дат
  getTransactionsByDateRange: async (
    startDate: string,
    endDate: string,
    page: number = 0,
    size: number = 50
  ): Promise<PaginatedResponse<Transaction>> => {
    const response = await apiClient.get<PaginatedResponse<Transaction>>('/transactions/date-range', {
      params: { startDate, endDate, page, size },
    });
    return response.data;
  },

  // Получить транзакции по категории
  getTransactionsByCategory: async (
    category: string,
    page: number = 0,
    size: number = 50
  ): Promise<PaginatedResponse<Transaction>> => {
    const response = await apiClient.get<PaginatedResponse<Transaction>>('/transactions/category', {
      params: { category, page, size },
    });
    return response.data;
  },

  // Получить статистику
  getStatistics: async (): Promise<TransactionStatistics> => {
    const response = await apiClient.get<TransactionStatistics>('/transactions/statistics');
    return response.data;
  },

  // Получить транзакцию по ID
  getTransactionById: async (id: string): Promise<Transaction> => {
    const response = await apiClient.get<Transaction>(`/transactions/${id}`);
    return response.data;
  },

  // Создать транзакцию
  createTransaction: async (data: Partial<Transaction>): Promise<Transaction> => {
    const response = await apiClient.post<Transaction>('/transactions', data);
    return response.data;
  },
};

