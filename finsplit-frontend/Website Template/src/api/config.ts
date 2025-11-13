import axios from 'axios';

// API base URL - можно изменить через environment variables
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

// Создаём axios instance с базовой конфигурацией
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds
});

// Request interceptor для добавления JWT токена
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor для обработки ошибок
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // 401 Unauthorized или 403 Forbidden - токен недействителен
    if (error.response?.status === 401 || error.response?.status === 403) {
      console.warn('Token expired or invalid, redirecting to login...');
      
      // Удаляем токен и данные пользователя
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
      
      // Показываем уведомление
      import('sonner').then(({ toast }) => {
        toast.error('Сессия истекла. Пожалуйста, войдите снова.');
      });
      
      // Перенаправляем на главную страницу через небольшую задержку
      setTimeout(() => {
        window.location.href = '/';
      }, 500);
    }
    
    return Promise.reject(error);
  }
);

// Helper для загрузки файлов
export const createFormDataConfig = () => ({
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

