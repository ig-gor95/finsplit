import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { filesApi } from '../api';
import { toast } from 'sonner';

export const useUploadedFiles = (page: number = 0, size: number = 20) => {
  return useQuery({
    queryKey: ['files', page, size],
    queryFn: () => filesApi.getUploadedFiles(page, size),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useFile = (fileId: string) => {
  return useQuery({
    queryKey: ['files', fileId],
    queryFn: () => filesApi.getFileById(fileId),
    enabled: !!fileId,
  });
};

export const useFileTransactions = (fileId: string, page: number = 0, size: number = 50) => {
  return useQuery({
    queryKey: ['files', fileId, 'transactions', page, size],
    queryFn: () => filesApi.getFileTransactions(fileId, page, size),
    enabled: !!fileId,
  });
};

export const useUploadFile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ file, bankType }: { file: File; bankType: string }) =>
      filesApi.uploadFile(file, bankType),
    onSuccess: (data) => {
      // Инвалидируем все кеши для обновления данных
      queryClient.invalidateQueries({ queryKey: ['files'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      
      // Принудительно перезагружаем данные
      queryClient.refetchQueries({ queryKey: ['transactions'] });
      queryClient.refetchQueries({ queryKey: ['accounts'] });
      queryClient.refetchQueries({ queryKey: ['transactions', 'statistics'] });
      
      // Показываем детальную информацию о загрузке
      const totalProcessed = data.importedTransactions + data.updatedTransactions;
      
      toast.success(
        `✅ Файл успешно загружен!`,
        { 
          description: `Импортировано: ${data.importedTransactions} | Обновлено: ${data.updatedTransactions} | Пропущено: ${data.skippedTransactions}`,
          duration: 6000 
        }
      );
      
      // Если есть информация о счете
      if (data.accountMetadata?.accountNumber) {
        toast.info(
          `Счёт: ${data.accountMetadata.accountNumber}`,
          {
            description: `Клиент: ${data.accountMetadata.clientName || 'N/A'} | Баланс: ${data.accountMetadata.closingBalance || 'N/A'}`,
            duration: 5000
          }
        );
      }
      
      if (data.errors && data.errors.length > 0) {
        toast.warning(`⚠️ Некоторые транзакции пропущены`, {
          description: data.errors.slice(0, 3).join('; '),
          duration: 5000
        });
      }
    },
    onError: (error: any) => {
      console.error('Upload error:', error);
      toast.error(error.response?.data?.message || 'Ошибка загрузки файла', {
        description: error.response?.data?.errors?.[0] || 'Попробуйте снова',
        duration: 5000
      });
    },
  });
};

