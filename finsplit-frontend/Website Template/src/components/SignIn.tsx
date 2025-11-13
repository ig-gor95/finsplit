import { useState } from 'react';
import { useLanguage } from '../utils/LanguageContext';
import { useAuth } from '../hooks';
import { toast } from 'sonner';

interface SignInProps {
  onClose: () => void;
  onSignIn: () => void;
}

export function SignIn({ onClose, onSignIn }: SignInProps) {
  const { language, t } = useLanguage();
  const { login, register, isLoggingIn, isRegistering } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    companyName: '',
    email: '',
    password: '',
    confirmPassword: '',
    rememberMe: false,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Валидация для регистрации
    if (isSignUp) {
      if (!formData.firstName || !formData.lastName || !formData.email || !formData.password || !formData.confirmPassword) {
        toast.error(language === 'ru' ? 'Пожалуйста, заполните все обязательные поля' : 'Please fill in all required fields');
        return;
      }
      
      if (formData.password !== formData.confirmPassword) {
        toast.error(language === 'ru' ? 'Пароли не совпадают' : 'Passwords do not match');
        return;
      }
      
      if (formData.password.length < 6) {
        toast.error(language === 'ru' ? 'Пароль должен содержать минимум 6 символов' : 'Password must be at least 6 characters');
        return;
      }

      // Регистрация через API
      register({
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
      }, {
        onSuccess: () => {
          onSignIn(); // Переходим в dashboard после успешной регистрации
        },
      });
    } else {
      // Валидация для входа
      if (!formData.email || !formData.password) {
        toast.error(language === 'ru' ? 'Пожалуйста, введите email и пароль' : 'Please enter email and password');
        return;
      }

      // Вход через API
      login({
        email: formData.email,
        password: formData.password,
      }, {
        onSuccess: () => {
          onSignIn(); // Переходим в dashboard после успешного входа
        },
      });
    }
  };

  const handleSocialSignIn = (provider: string) => {
    // Эмуляция входа через соцсеть
    onSignIn();
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    // Сброс формы при переключении режима
    setFormData({
      firstName: '',
      lastName: '',
      companyName: '',
      email: '',
      password: '',
      confirmPassword: '',
      rememberMe: false,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl p-8 space-y-6 border border-gray-100">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
            <h2 className="text-black">
              {isSignUp ? t('auth.signupTitle') : t('auth.title')}
            </h2>
            <p className="text-gray-600">
              {isSignUp ? t('auth.signupSubtitle') : t('auth.subtitle')}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Signup Fields */}
            {isSignUp && (
              <>
                <div>
                  <label htmlFor="firstName" className="block text-sm mb-2 text-gray-700">
                    {language === 'ru' ? 'Имя' : 'First Name'} *
                  </label>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder={language === 'ru' ? 'Иван' : 'John'}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                    required={isSignUp}
                  />
                </div>

                <div>
                  <label htmlFor="lastName" className="block text-sm mb-2 text-gray-700">
                    {language === 'ru' ? 'Фамилия' : 'Last Name'} *
                  </label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder={language === 'ru' ? 'Иванов' : 'Doe'}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                    required={isSignUp}
                  />
                </div>

                <div>
                  <label htmlFor="companyName" className="block text-sm mb-2 text-gray-700">
                    {t('auth.companyName')} {language === 'ru' ? '(опционально)' : '(optional)'}
                  </label>
                  <input
                    id="companyName"
                    name="companyName"
                    type="text"
                    value={formData.companyName}
                    onChange={handleInputChange}
                    placeholder={language === 'ru' ? 'ООО "Моя Компания"' : 'My Company LLC'}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                  />
                </div>
              </>
            )}

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm mb-2 text-gray-700">
                {t('auth.email')} *
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="name@example.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm mb-2 text-gray-700">
                {t('auth.password')} *
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="••••••••"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                required
              />
            </div>

            {/* Confirm Password (only for signup) */}
            {isSignUp && (
              <div>
                <label htmlFor="confirmPassword" className="block text-sm mb-2 text-gray-700">
                  {t('auth.confirmPassword')} *
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                  required={isSignUp}
                />
              </div>
            )}

            {/* Remember Me & Forgot Password (only for signin) */}
            {!isSignUp && (
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleInputChange}
                    className="w-4 h-4 border-gray-300 rounded focus:ring-2 focus:ring-blue-600 cursor-pointer"
                  />
                  {t('auth.rememberMe')}
                </label>
                <button
                  type="button"
                  onClick={() => alert(language === 'ru' ? 'Функция восстановления пароля будет доступна в следующей версии' : 'Password recovery feature coming soon')}
                  className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
                >
                  {t('auth.forgotPassword')}
                </button>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoggingIn || isRegistering}
              className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {(isLoggingIn || isRegistering) ? (
                language === 'ru' ? 'Загрузка...' : 'Loading...'
              ) : (
                isSignUp ? t('auth.signup') : t('auth.signin')
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">
                {t('auth.orContinueWith')}
              </span>
            </div>
          </div>

          {/* Social Sign In */}
          <div className="grid grid-cols-2 gap-4">
            <button 
              type="button"
              onClick={() => handleSocialSignIn('Google')}
              className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Google
            </button>
            <button 
              type="button"
              onClick={() => handleSocialSignIn('GitHub')}
              className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              GitHub
            </button>
          </div>

          {/* Toggle Sign In/Sign Up */}
          <div className="text-center text-sm text-gray-600">
            {isSignUp ? t('auth.haveAccount') : t('auth.noAccount')}{' '}
            <button 
              type="button"
              onClick={toggleMode} 
              className="text-blue-600 hover:text-blue-700 hover:underline"
            >
              {isSignUp ? t('auth.login') : t('auth.signup')}
            </button>
          </div>

          {/* Back Button */}
          <button
            type="button"
            onClick={onClose}
            className="w-full px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            {t('auth.backToHome')}
          </button>
        </div>
      </div>
    </div>
  );
}