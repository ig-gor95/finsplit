# 🔧 Исправление импортов - Быстрое решение

## Проблема
В файлах шаблона импорты содержат версии пакетов, что неправильно.

## ✅ Решение

Выполните эти команды в терминале:

```bash
cd "/Users/igorlapin/IdeaProjects/finsplit/finsplit-frontend/Website Template"

# Исправить все @radix-ui импорты
find src -name "*.tsx" -type f -print0 | xargs -0 sed -i '' 's/@radix-ui\/react-\([a-z-]*\)@[0-9.]*/@radix-ui\/react-\1/g'

# Исправить class-variance-authority
find src -name "*.tsx" -type f -print0 | xargs -0 sed -i '' 's/class-variance-authority@[0-9.]*/class-variance-authority/g'

# Исправить next-themes
find src -name "*.tsx" -type f -print0 | xargs -0 sed -i '' 's/next-themes@[0-9.]*/next-themes/g'

# Проверить что всё исправлено
grep -r "@[0-9]" src/components/ui/ || echo "✅ Все импорты исправлены!"

# Запустить
npm run dev
```

## Альтернатива (Python)

Если команды выше не работают:

```bash
python3 fix_imports.py
npm run dev
```

## Что было исправлено

❌ Было:
```typescript
import * as SliderPrimitive from "@radix-ui/react-slider@1.2.3";
import { cva } from "class-variance-authority@0.7.1";
import { CheckIcon } from "lucide-react@0.487.0";
```

✅ Стало:
```typescript
import * as SliderPrimitive from "@radix-ui/react-slider";
import { cva } from "class-variance-authority";
import { CheckIcon } from "lucide-react";
```

## 🎯 После исправления

```bash
npm run dev
```

Приложение должно запуститься на http://localhost:5173 без ошибок!

