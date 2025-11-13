# 🐛 Debug Guide - Белая страница после Login

## Шаги для диагностики:

### 1. Откройте DevTools
- Нажмите **F12** (или Cmd+Option+I на Mac)
- Перейдите на вкладку **Console**

### 2. Попробуйте войти
- Нажмите кнопку Login
- **Смотрите в Console** - там должны появиться ошибки

### 3. Что искать в Console:

#### ❌ Если видите ошибку типа:
```
Failed to resolve import "@tanstack/react-query"
```
**Решение:**
```bash
cd "/Users/igorlapin/IdeaProjects/finsplit/finsplit-frontend/Website Template"
npm install @tanstack/react-query @tanstack/react-query-devtools
npm run dev
```

#### ❌ Если видите:
```
Cannot read property 'map' of undefined
```
**Решение:** Это нормально, данных пока нет. Dashboard должен показать пустое состояние.

#### ❌ Если видите:
```
Network Error / CORS error
```
**Решение:** Backend не запущен или CORS не настроен.
```bash
# Запустите backend
cd /Users/igorlapin/IdeaProjects/finsplit
mvn spring-boot:run
```

### 4. Проверьте Network tab

- Перейдите на вкладку **Network**
- Попробуйте войти
- Должны увидеть запросы:
  - `POST /api/auth/login` (или `POST http://localhost:8080/api/auth/login`)
  - `GET /api/accounts`
  - `GET /api/transactions`

### 5. Проверьте что Backend запущен

```bash
curl http://localhost:8080/api/health
```

Должно вернуть: `{"status":"UP"}`

---

## 🔍 Быстрая проверка

### В Console выполните:

```javascript
// Проверка localStorage
console.log('Token:', localStorage.getItem('auth_token'));
console.log('User:', localStorage.getItem('user_data'));

// Проверка что API доступен
fetch('http://localhost:8080/api/health')
  .then(r => r.json())
  .then(console.log)
  .catch(console.error);
```

---

## 📝 Отправьте мне:

1. **Скриншот Console** (вкладка Console в DevTools)
2. **Скриншот Network** (все запросы после login)
3. **Текст ошибки** если есть

Это поможет быстро найти проблему! 🚀

