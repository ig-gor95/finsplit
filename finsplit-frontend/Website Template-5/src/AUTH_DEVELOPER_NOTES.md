# Заметки разработчика: Система авторизации v2.0

## 🏗️ Архитектура компонента

### Структура файлов

```
/components/SignIn.tsx          # Основной компонент авторизации
/utils/translations.ts          # Переводы и локализация
/utils/LanguageContext.tsx      # Контекст управления языком
/App.tsx                        # Интеграция в приложение
```

### Зависимости

```typescript
import { useState } from 'react';
import { useLanguage } from '../utils/LanguageContext';
```

---

## 📋 Props Interface

```typescript
interface SignInProps {
  onClose: () => void;      // Callback для возврата на главную
  onSignIn: () => void;     // Callback после успешной авторизации
}
```

---

## 🔄 State Management

### Local State

```typescript
const [isSignUp, setIsSignUp] = useState(false);
```
**Назначение:** Переключение между режимами входа (false) и регистрации (true)

```typescript
const [formData, setFormData] = useState({
  fullName: '',
  companyName: '',
  email: '',
  password: '',
  confirmPassword: '',
  rememberMe: false,
});
```
**Назначение:** Хранение всех данных формы

---

## 🎯 Основные функции

### handleInputChange

```typescript
const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const { name, value, type, checked } = e.target;
  setFormData(prev => ({
    ...prev,
    [name]: type === 'checkbox' ? checked : value,
  }));
};
```

**Назначение:** Универсальный обработчик для всех полей формы  
**Поддержка:** text, email, password, checkbox

### handleSubmit

```typescript
const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  
  if (isSignUp) {
    // Валидация для регистрации
    if (!formData.fullName || !formData.email || !formData.password || !formData.confirmPassword) {
      alert('Please fill in all required fields');
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    
    if (formData.password.length < 6) {
      alert('Password must be at least 6 characters');
      return;
    }
  } else {
    // Валидация для входа
    if (!formData.email || !formData.password) {
      alert('Please enter email and password');
      return;
    }
  }
  
  onSignIn();
};
```

**Назначение:** Обработка отправки формы с валидацией  
**Валидация:**
- Проверка заполнения обязательных полей
- Проверка совпадения паролей (только для регистрации)
- Проверка минимальной длины пароля (6 символов)

### handleSocialSignIn

```typescript
const handleSocialSignIn = (provider: string) => {
  console.log(`Signing in with ${provider}`);
  onSignIn();
};
```

**Назначение:** Обработка входа через социальные сети  
**Параметры:** 'Google' | 'GitHub'  
**Примечание:** В текущей версии эмулирует успешный вход

### toggleMode

```typescript
const toggleMode = () => {
  setIsSignUp(!isSignUp);
  setFormData({
    fullName: '',
    companyName: '',
    email: '',
    password: '',
    confirmPassword: '',
    rememberMe: false,
  });
};
```

**Назначение:** Переключение между входом и регистрацией  
**Поведение:** Сбрасывает все поля формы для безопасности

---

## 🌐 Локализация

### Использование переводов

```typescript
const { language, t } = useLanguage();

// Использование
<h2>{isSignUp ? t('auth.signupTitle') : t('auth.title')}</h2>
```

### Добавленные ключи

Все новые ключи находятся в секции `auth.*` файла `translations.ts`:

```typescript
'auth.signupTitle'        // Заголовок регистрации
'auth.signupSubtitle'     // Подзаголовок регистрации
'auth.fullName'           // Label "Полное имя"
'auth.companyName'        // Label "Название компании"
'auth.email'              // Label "Email"
'auth.password'           // Label "Пароль"
'auth.confirmPassword'    // Label "Подтвердите пароль"
'auth.rememberMe'         // Label "Запомнить меня"
'auth.forgotPassword'     // Ссылка "Забыли пароль?"
'auth.orContinueWith'     // "Или войти через"
'auth.haveAccount'        // "Уже есть аккаунт?"
'auth.noAccount'          // "Нет аккаунта?"
'auth.login'              // Кнопка "Login" / "Войти"
```

---

## 🎨 Стилизация

### Tailwind классы

**Основной контейнер:**
```jsx
className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50"
```

**Форма:**
```jsx
className="bg-white rounded-2xl shadow-2xl p-8 space-y-6 border border-gray-100"
```

**Input поля:**
```jsx
className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
```

**Primary кнопка:**
```jsx
className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-xl transition-all"
```

**Secondary кнопка (социальные сети):**
```jsx
className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
```

---

## 🔍 Условный рендеринг

### Режим регистрации

```typescript
{isSignUp && (
  <>
    <div>
      <label htmlFor="fullName">{t('auth.fullName')} *</label>
      <input id="fullName" name="fullName" type="text" required />
    </div>
    
    <div>
      <label htmlFor="companyName">{t('auth.companyName')}</label>
      <input id="companyName" name="companyName" type="text" />
    </div>
    
    <div>
      <label htmlFor="confirmPassword">{t('auth.confirmPassword')} *</label>
      <input id="confirmPassword" name="confirmPassword" type="password" required />
    </div>
  </>
)}
```

### Режим входа

```typescript
{!isSignUp && (
  <div className="flex items-center justify-between">
    <label>
      <input type="checkbox" name="rememberMe" />
      {t('auth.rememberMe')}
    </label>
    <button onClick={...}>
      {t('auth.forgotPassword')}
    </button>
  </div>
)}
```

---

## 🔐 Валидация

### HTML5 Валидация

```jsx
<input
  type="email"
  required={isSignUp}
  // Браузер автоматически проверяет формат email
/>
```

### Клиентская JavaScript валидация

**Проверка обязательных полей:**
```javascript
if (!formData.fullName || !formData.email || !formData.password) {
  alert(language === 'ru' ? 'Пожалуйста, заполните все обязательные поля' : 'Please fill in all required fields');
  return;
}
```

**Проверка совпадения паролей:**
```javascript
if (formData.password !== formData.confirmPassword) {
  alert(language === 'ru' ? 'Пароли не совпадают' : 'Passwords do not match');
  return;
}
```

**Проверка длины пароля:**
```javascript
if (formData.password.length < 6) {
  alert(language === 'ru' ? 'Пароль должен содержать минимум 6 символов' : 'Password must be at least 6 characters');
  return;
}
```

---

## 🔄 Lifecycle и побочные эффекты

### Сброс формы при переключении режима

```typescript
const toggleMode = () => {
  setIsSignUp(!isSignUp);
  // Важно: сбрасываем все поля
  setFormData({
    fullName: '',
    companyName: '',
    email: '',
    password: '',
    confirmPassword: '',
    rememberMe: false,
  });
};
```

**Причина:** Безопасность и чистый UX - пользователь не должен видеть данные из другого режима

---

## 🚀 Интеграция в App.tsx

```typescript
function AppContent() {
  const [currentView, setCurrentView] = useState<AppView>('home');

  if (currentView === 'signin') {
    return (
      <SignIn 
        onClose={() => setCurrentView('home')}
        onSignIn={() => setCurrentView('dashboard')}
      />
    );
  }
  
  // ... остальные view
}
```

**Навигация:**
- `onClose` → переход на 'home' (Landing Page)
- `onSignIn` → переход на 'dashboard' (Dashboard)

---

## 🧪 Примеры использования

### Успешная регистрация

```typescript
// Пользователь заполняет:
fullName: "John Doe"
companyName: "ACME Corp"
email: "john@example.com"
password: "password123"
confirmPassword: "password123"

// После submit:
handleSubmit() → validates → onSignIn() → setCurrentView('dashboard')
```

### Успешный вход

```typescript
// Пользователь заполняет:
email: "john@example.com"
password: "password123"
rememberMe: true

// После submit:
handleSubmit() → validates → onSignIn() → setCurrentView('dashboard')
```

### Вход через Google

```typescript
// Пользователь кликает кнопку Google
handleSocialSignIn('Google') → onSignIn() → setCurrentView('dashboard')
```

---

## 🐛 Известные ограничения

1. **Backend отсутствует**
   - Все данные существуют только на клиенте
   - Нет реальной аутентификации
   - Любые данные приводят к успеху (после валидации)

2. **OAuth эмулируется**
   - Google/GitHub кнопки не подключены к реальным OAuth провайдерам
   - Просто вызывают `onSignIn()`

3. **Remember Me не сохраняется**
   - Чекбокс есть, но состояние не сохраняется в localStorage/cookies
   - После перезагрузки страницы - сессия теряется

4. **Forgot Password заглушка**
   - Показывает alert вместо реальной функциональности
   - Email не отправляется

---

## 🔮 Планы на будущее

### Backend интеграция

```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  try {
    if (isSignUp) {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: formData.fullName,
          companyName: formData.companyName,
          email: formData.email,
          password: formData.password,
        }),
      });
      
      if (!response.ok) throw new Error('Registration failed');
      
      const data = await response.json();
      localStorage.setItem('token', data.token);
      onSignIn();
    } else {
      // Similar for sign in
    }
  } catch (error) {
    alert('Error: ' + error.message);
  }
};
```

### OAuth интеграция

```typescript
const handleSocialSignIn = async (provider: string) => {
  const authUrl = provider === 'Google' 
    ? `${GOOGLE_OAUTH_URL}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}`
    : `${GITHUB_OAUTH_URL}?client_id=${CLIENT_ID}`;
    
  window.location.href = authUrl;
};
```

### Email верификация

```typescript
// После успешной регистрации
<div className="text-center p-4 bg-blue-50 rounded">
  ✉️ {language === 'ru' 
    ? 'Проверьте ваш email для подтверждения аккаунта' 
    : 'Please check your email to verify your account'}
</div>
```

---

## 📚 Полезные ссылки

- **React Docs:** https://react.dev
- **TypeScript Docs:** https://www.typescriptlang.org
- **Tailwind CSS:** https://tailwindcss.com
- **Lucide Icons:** https://lucide.dev

---

## 💡 Best Practices

1. **Всегда валидируйте на клиенте И на сервере**
   - Клиентская валидация - для UX
   - Серверная валидация - для безопасности

2. **Никогда не храните пароли в открытом виде**
   - Используйте bcrypt/argon2 для хеширования
   - Минимальная длина пароля - 8 символов (у нас 6 для демо)

3. **Сбрасывайте формы при переключении режимов**
   - Предотвращает утечку данных
   - Улучшает UX

4. **Локализуйте все пользовательские сообщения**
   - Включая ошибки валидации
   - Включая системные уведомления

5. **Используйте TypeScript для безопасности типов**
   - Props интерфейсы
   - State типизация
   - Event handlers типизация

---

**Автор:** AI Assistant  
**Дата создания:** 4 ноября 2025  
**Версия:** 2.0  
**Статус документации:** Complete
