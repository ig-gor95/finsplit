import { apiClient } from './config';
import { Account, AccountBalance, AccountDetails, PaginatedResponse } from './types';

export const accountsApi = {
  // Получить все счета пользователя
  getAccounts: async (): Promise<Account[]> => {
    const response = await apiClient.get<Account[]>('/accounts');
    return response.data;
  },

  // Получить счёт по ID
  getAccountById: async (id: string): Promise<Account> => {
    const response = await apiClient.get<Account>(`/accounts/${id}`);
    return response.data;
  },

  // Получить балансы счёта
  getAccountBalances: async (
    accountId: string,
    page: number = 0,
    size: number = 50
  ): Promise<PaginatedResponse<AccountBalance>> => {
    const response = await apiClient.get<PaginatedResponse<AccountBalance>>(
      `/accounts/${accountId}/balances`,
      {
        params: { page, size },
      }
    );
    return response.data;
  },

  // Получить последний баланс счёта
  getLatestBalance: async (accountId: string): Promise<AccountBalance | null> => {
    const response = await apiClient.get<AccountBalance>(`/accounts/${accountId}/balances/latest`);
    return response.data;
  },

  // Получить детальную аналитику по счёту
  getAccountDetails: async (accountId: string): Promise<AccountDetails> => {
    const response = await apiClient.get<AccountDetails>(`/accounts/${accountId}/details`);
    return response.data;
  },
};

