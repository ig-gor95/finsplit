# API Integration Guide

## 🚀 Быстрый старт

### 1. Установка зависимостей

```bash
npm install
```

### 2. Настройка окружения

Скопируйте `.env.example` в `.env`:

```bash
cp .env.example .env
```

Отредактируйте `.env`:

```bash
VITE_API_BASE_URL=http://localhost:8080/api
```

### 3. Запуск приложения

Убедитесь, что Spring Boot backend запущен на `localhost:8080`, затем:

```bash
npm run dev
```

Приложение будет доступно на `http://localhost:5173`

---

## 📁 Структура API интеграции

```
src/
├── api/                    # API layer
│   ├── config.ts           # Axios configuration
│   ├── types.ts            # TypeScript types
│   ├── auth.api.ts         # Authentication API
│   ├── accounts.api.ts     # Accounts API
│   ├── transactions.api.ts # Transactions API
│   ├── files.api.ts        # Files upload API
│   └── index.ts            # Main export
├── hooks/                  # React Query hooks
│   ├── useAuth.ts
│   ├── useAccounts.ts
│   ├── useTransactions.ts
│   └── useFiles.ts
└── providers/
    └── QueryProvider.tsx   # React Query provider
```

---

## 🔧 Использование API

### Authentication

```tsx
import { useAuth } from './hooks';

function LoginForm() {
  const { login, isLoggingIn } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    login({
      email: 'user@example.com',
      password: 'password123'
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* form fields */}
      <button disabled={isLoggingIn}>Войти</button>
    </form>
  );
}
```

### Загрузка транзакций

```tsx
import { useTransactions } from './hooks';

function TransactionsList() {
  const { data, isLoading, error } = useTransactions(0, 50);

  if (isLoading) return <div>Загрузка...</div>;
  if (error) return <div>Ошибка: {error.message}</div>;

  return (
    <div>
      {data?.content.map(tx => (
        <div key={tx.id}>{tx.description}</div>
      ))}
    </div>
  );
}
```

### Загрузка файлов

```tsx
import { useUploadFile } from './hooks';

function FileUpload() {
  const { mutate: uploadFile, isPending } = useUploadFile();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadFile({
        file,
        bankType: 'RAIFFEISEN'
      });
    }
  };

  return (
    <input 
      type="file" 
      onChange={handleFileChange}
      disabled={isPending}
    />
  );
}
```

### Получение счетов

```tsx
import { useAccounts } from './hooks';

function AccountsList() {
  const { data: accounts, isLoading } = useAccounts();

  if (isLoading) return <div>Загрузка счетов...</div>;

  return (
    <div>
      {accounts?.map(account => (
        <div key={account.id}>
          {account.accountNumber} - {account.currentBalance} {account.currency}
        </div>
      ))}
    </div>
  );
}
```

---

## 🔐 JWT Authentication

Токены автоматически сохраняются в `localStorage` и добавляются к каждому запросу через axios interceptor.

### Структура токена

После успешного входа:
- `auth_token` - JWT токен
- `user_data` - данные пользователя

### Автоматический logout

При получении 401 ошибки, пользователь автоматически разлогинивается.

---

## 📊 React Query

### Кеширование

По умолчанию данные кешируются на:
- **Транзакции**: 2 минуты
- **Счета**: 5 минут
- **Статистика**: 5 минут

### Инвалидация кеша

Кеш автоматически инвалидируется после:
- Загрузки файла
- Создания транзакции
- Обновления счёта

### DevTools

В режиме разработки доступны React Query DevTools для отладки запросов.

---

## 🎯 API Endpoints

### Authentication
- `POST /api/auth/login` - Вход
- `POST /api/auth/register` - Регистрация

### Accounts
- `GET /api/accounts` - Получить все счета
- `GET /api/accounts/{id}` - Получить счёт
- `GET /api/accounts/{id}/balances` - Балансы счёта
- `GET /api/accounts/{id}/balances/latest` - Последний баланс

### Transactions
- `GET /api/transactions` - Все транзакции (пагинация)
- `GET /api/transactions/date-range` - По дате
- `GET /api/transactions/category` - По категории
- `GET /api/transactions/statistics` - Статистика
- `GET /api/transactions/{id}` - Одна транзакция
- `POST /api/transactions` - Создать

### Files
- `POST /api/files/upload` - Загрузить файл
- `GET /api/files` - Все файлы
- `GET /api/files/{id}` - Один файл
- `GET /api/files/{id}/transactions` - Транзакции из файла

---

## 🐛 Обработка ошибок

Все ошибки API автоматически показываются через `toast` уведомления.

Структура ошибки:

```typescript
interface ApiError {
  message: string;
  status: number;
  timestamp: string;
  path?: string;
}
```

---

## 🔄 Поддерживаемые банки

```typescript
type BankType = 
  | 'RAIFFEISEN' 
  | 'HALYK' 
  | 'SBERBANK' 
  | 'KASPI' 
  | 'OTHER';
```

---

## 💡 Полезные советы

1. **CORS**: Убедитесь что Spring Boot настроен для CORS с `http://localhost:5173`

2. **Vite Proxy**: Можно настроить proxy в `vite.config.ts` чтобы избежать CORS проблем

3. **TypeScript**: Все типы автоматически выводятся из API responses

4. **Mock данные**: Для разработки UI можно временно использовать mock данные из существующих компонентов

---

## 🚨 Troubleshooting

### 401 Unauthorized
- Проверьте что токен сохранён в localStorage
- Проверьте что Spring Boot Security настроен правильно

### CORS errors
- Добавьте `http://localhost:5173` в CORS configuration Spring Boot
- Или используйте Vite proxy

### Network timeout
- Проверьте что Spring Boot запущен
- Проверьте `VITE_API_BASE_URL` в `.env`

---

## 📝 TODO

- [ ] Подключить реальные данные к Dashboard
- [ ] Заменить mock данные в UploadStatements
- [ ] Интегрировать авторизацию в SignIn компонент
- [ ] Добавить обработку ошибок загрузки файлов
- [ ] Настроить автоматическое обновление транзакций

