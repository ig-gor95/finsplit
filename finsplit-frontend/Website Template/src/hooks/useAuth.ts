import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authApi } from '../api';
import { LoginRequest, RegisterRequest } from '../api/types';
import { toast } from 'sonner';

export const useAuth = () => {
  const queryClient = useQueryClient();

  const loginMutation = useMutation({
    mutationFn: (credentials: LoginRequest) => authApi.login(credentials),
    onSuccess: (data) => {
      queryClient.setQueryData(['currentUser'], { email: data.email, firstName: data.firstName, lastName: data.lastName });
      toast.success('Успешный вход!');
    },
    onError: (error: any) => {
      console.error('Login error:', error);
      toast.error(error.response?.data?.message || 'Ошибка входа');
    },
  });

  const registerMutation = useMutation({
    mutationFn: (data: RegisterRequest) => authApi.register(data),
    onSuccess: (data) => {
      queryClient.setQueryData(['currentUser'], { email: data.email, firstName: data.firstName, lastName: data.lastName });
      toast.success('Регистрация успешна!');
    },
    onError: (error: any) => {
      console.error('Register error:', error);
      toast.error(error.response?.data?.message || 'Ошибка регистрации');
    },
  });

  const logout = () => {
    authApi.logout();
    queryClient.clear();
    window.location.href = '/';
  };

  const currentUser = authApi.getCurrentUser();
  const isAuthenticated = authApi.isAuthenticated();

  return {
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    logout,
    currentUser,
    isAuthenticated,
    isLoggingIn: loginMutation.isPending,
    isRegistering: registerMutation.isPending,
  };
};

