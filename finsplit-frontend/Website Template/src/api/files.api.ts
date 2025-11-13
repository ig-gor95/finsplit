import { apiClient, createFormDataConfig } from './config';
import { UploadedFile, FileUploadResponse, PaginatedResponse, Transaction } from './types';

export const filesApi = {
  // Загрузить банковскую выписку
  uploadFile: async (
    file: File,
    bankType: string
  ): Promise<FileUploadResponse> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('bankType', bankType);

    const response = await apiClient.post<FileUploadResponse>(
      '/transactions/upload',
      formData,
      createFormDataConfig()
    );
    return response.data;
  },

  // Получить все загруженные файлы
  getUploadedFiles: async (
    page: number = 0,
    size: number = 20
  ): Promise<PaginatedResponse<UploadedFile>> => {
    const response = await apiClient.get<PaginatedResponse<UploadedFile>>('/files', {
      params: { page, size },
    });
    return response.data;
  },

  // Получить файл по ID
  getFileById: async (id: string): Promise<UploadedFile> => {
    const response = await apiClient.get<UploadedFile>(`/files/${id}`);
    return response.data;
  },

  // Получить транзакции из файла
  getFileTransactions: async (
    fileId: string,
    page: number = 0,
    size: number = 50
  ): Promise<PaginatedResponse<Transaction>> => {
    const response = await apiClient.get<PaginatedResponse<Transaction>>(
      `/files/${fileId}/transactions`,
      {
        params: { page, size },
      }
    );
    return response.data;
  },

  // Получить статистику по файлу
  getFileStats: async (fileId: string) => {
    const response = await apiClient.get(`/files/${fileId}/stats`);
    return response.data;
  },
};

