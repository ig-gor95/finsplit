import { apiClient } from './config';
import { LoginRequest, RegisterRequest, AuthResponse } from './types';

export const authApi = {
  // Вход
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
    
    // Сохраняем токен и данные пользователя
    localStorage.setItem('auth_token', response.data.token);
    localStorage.setItem('user_data', JSON.stringify({
      email: response.data.email,
      firstName: response.data.firstName,
      lastName: response.data.lastName
    }));
    
    return response.data;
  },

  // Регистрация
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/register', data);
    
    // Сохраняем токен и данные пользователя
    localStorage.setItem('auth_token', response.data.token);
    localStorage.setItem('user_data', JSON.stringify({
      email: response.data.email,
      firstName: response.data.firstName,
      lastName: response.data.lastName
    }));
    
    return response.data;
  },

  // Выход
  logout: () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
  },

  // Получить текущего пользователя
  getCurrentUser: () => {
    try {
      const userData = localStorage.getItem('user_data');
      if (!userData || userData === 'undefined') {
        return null;
      }
      return JSON.parse(userData);
    } catch (error) {
      console.error('Failed to parse user data:', error);
      return null;
    }
  },

  // Проверка авторизации
  isAuthenticated: (): boolean => {
    const token = localStorage.getItem('auth_token');
    return !!token && token !== 'undefined' && token !== 'null';
  },
};

