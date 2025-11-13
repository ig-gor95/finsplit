import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { transactionsApi, TransactionFilters } from '../api/transactions.api';
import { toast } from 'sonner';

export const useTransactions = (
  page: number = 0, 
  size: number = 50, 
  sort?: string,
  filters?: TransactionFilters
) => {
  return useQuery({
    queryKey: ['transactions', page, size, sort, filters],
    queryFn: () => transactionsApi.getTransactions(page, size, sort, filters),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Алиас для получения сумм из транзакций
export const useTransactionSums = (page: number = 0, size: number = 50) => {
  const { data } = useTransactions(page, size);
  return {
    totalIncome: data?.totalIncome || 0,
    totalExpenses: data?.totalExpenses || 0,
    balance: data?.balance || 0,
  };
};

export const useTransactionsByDateRange = (
  startDate: string,
  endDate: string,
  page: number = 0,
  size: number = 50
) => {
  return useQuery({
    queryKey: ['transactions', 'dateRange', startDate, endDate, page, size],
    queryFn: () => transactionsApi.getTransactionsByDateRange(startDate, endDate, page, size),
    enabled: !!startDate && !!endDate,
  });
};

export const useTransactionsByCategory = (
  category: string,
  page: number = 0,
  size: number = 50
) => {
  return useQuery({
    queryKey: ['transactions', 'category', category, page, size],
    queryFn: () => transactionsApi.getTransactionsByCategory(category, page, size),
    enabled: !!category,
  });
};

export const useTransactionStatistics = () => {
  return useQuery({
    queryKey: ['transactions', 'statistics'],
    queryFn: () => transactionsApi.getStatistics(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useTransaction = (id: string) => {
  return useQuery({
    queryKey: ['transactions', id],
    queryFn: () => transactionsApi.getTransactionById(id),
    enabled: !!id,
  });
};

export const useCreateTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: transactionsApi.createTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      toast.success('Транзакция создана!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Ошибка создания транзакции');
    },
  });
};

