import { useQuery } from '@tanstack/react-query';
import { accountsApi } from '../api';

export const useAccounts = () => {
  return useQuery({
    queryKey: ['accounts'],
    queryFn: () => accountsApi.getAccounts(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useAccount = (accountId: string) => {
  return useQuery({
    queryKey: ['accounts', accountId],
    queryFn: () => accountsApi.getAccountById(accountId),
    enabled: !!accountId,
  });
};

export const useAccountBalances = (accountId: string, page: number = 0, size: number = 50) => {
  return useQuery({
    queryKey: ['accounts', accountId, 'balances', page, size],
    queryFn: () => accountsApi.getAccountBalances(accountId, page, size),
    enabled: !!accountId,
  });
};

export const useLatestBalance = (accountId: string) => {
  return useQuery({
    queryKey: ['accounts', accountId, 'latestBalance'],
    queryFn: () => accountsApi.getLatestBalance(accountId),
    enabled: !!accountId,
  });
};

