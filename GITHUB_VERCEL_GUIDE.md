# 🚀 Инструкция по загрузке на GitHub и развертыванию на Vercel

## 📋 Шаг 1: Создание репозитория на GitHub

### 1. Перейдите на GitHub
- Откройте [github.com](https://github.com)
- Войдите в свой аккаунт

### 2. Создайте новый репозиторий
- Нажмите зеленую кнопку "New" или "+" → "New repository"
- **Repository name**: `vless-vpn-premium`
- **Description**: `Premium VLESS VPN Service with enhanced features - Complete analog of vless-vpn.org`
- **Visibility**: Public (или Private, если хотите)
- **НЕ добавляйте** README, .gitignore, license (они уже есть)
- Нажмите "Create repository"

### 3. Получите URL репозитория
После создания репозитория GitHub покажет команды. Скопируйте URL вида:
```
https://github.com/yourusername/vless-vpn-premium.git
```

## 🔗 Шаг 2: Подключение к GitHub

Выполните следующие команды в терминале (замените URL на ваш):

```bash
# Добавьте remote origin
git remote add origin https://github.com/yourusername/vless-vpn-premium.git

# Переименуйте ветку в main (если нужно)
git branch -M main

# Загрузите код на GitHub
git push -u origin main
```

## 🚀 Шаг 3: Развертывание на Vercel

### 1. Подключите GitHub к Vercel
- Откройте [vercel.com](https://vercel.com)
- Войдите через GitHub аккаунт
- Нажмите "New Project"
- Выберите репозиторий `vless-vpn-premium`
- Нажмите "Import"

### 2. Настройте проект
- **Framework Preset**: Other
- **Root Directory**: `./` (корневая папка)
- **Build Command**: `npm run vercel-build`
- **Output Directory**: `client/build`
- **Install Command**: `npm run install:all`

### 3. Настройте переменные окружения
В разделе "Environment Variables" добавьте:

```env
# Database (используйте Vercel Postgres или Supabase)
DATABASE_URL=postgresql://username:password@host:port/database

# Redis (используйте Upstash Redis)
REDIS_URL=redis://username:password@host:port

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# Telegram Bot
TELEGRAM_BOT_TOKEN=your-telegram-bot-token

# Payments
STRIPE_SECRET_KEY=sk_live_your-stripe-secret-key
STRIPE_WEBHOOK_SECRET=whsec_your-webhook-secret
YOOKASSA_SHOP_ID=your-yookassa-shop-id
YOOKASSA_SECRET_KEY=your-yookassa-secret-key

# VLESS Configuration
VLESS_SERVER_HOST=your-vless-server.com
VLESS_SERVER_PORT=443
VLESS_UUID_PREFIX=vless-premium

# Security
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Frontend (замените на ваш домен Vercel)
REACT_APP_API_URL=https://your-project.vercel.app/api
```

### 4. Разверните проект
- Нажмите "Deploy"
- Дождитесь завершения сборки
- Получите URL вашего приложения

## 🗄️ Шаг 4: Настройка базы данных

### Вариант 1: Vercel Postgres (рекомендуется)
1. В панели Vercel перейдите в "Storage"
2. Создайте новую Postgres базу данных
3. Скопируйте `DATABASE_URL` в переменные окружения

### Вариант 2: Supabase (бесплатно)
1. Создайте проект на [supabase.com](https://supabase.com)
2. Получите connection string
3. Добавьте в переменные окружения как `DATABASE_URL`

## 🔴 Шаг 5: Настройка Redis

### Upstash Redis (рекомендуется для Vercel)
1. Создайте базу данных на [upstash.com](https://upstash.com)
2. Получите `REDIS_URL`
3. Добавьте в переменные окружения

## 🤖 Шаг 6: Настройка Telegram Bot

1. Создайте бота через [@BotFather](https://t.me/BotFather)
2. Получите токен бота
3. Добавьте токен в переменные окружения как `TELEGRAM_BOT_TOKEN`

## 💳 Шаг 7: Настройка платежей

### Stripe
1. Создайте аккаунт на [stripe.com](https://stripe.com)
2. Получите API ключи
3. Добавьте в переменные окружения

### YooKassa
1. Создайте аккаунт на [yookassa.ru](https://yookassa.ru)
2. Получите API ключи
3. Добавьте в переменные окружения

## 🔄 Шаг 8: Обновление переменных и перезапуск

После добавления всех переменных окружения:
1. Перейдите в "Settings" → "Environment Variables"
2. Убедитесь, что все переменные добавлены
3. Нажмите "Redeploy" для применения изменений

## 🌐 Шаг 9: Настройка домена

### Кастомный домен
1. В настройках проекта перейдите в "Domains"
2. Добавьте ваш домен
3. Настройте DNS записи согласно инструкциям Vercel

## ✅ Готово!

После выполнения всех шагов:
- ✅ Код загружен на GitHub
- ✅ Приложение развернуто на Vercel
- ✅ База данных настроена
- ✅ Redis настроен
- ✅ Telegram бот настроен
- ✅ Платежи настроены

Ваше приложение будет доступно по адресу:
`https://your-project.vercel.app`

## 📚 Дополнительные ресурсы

- [Полная инструкция по развертыванию](VERCEL_DEPLOYMENT.md)
- [Руководство по установке](INSTALLATION.md)
- [Улучшения проекта](IMPROVEMENTS.md)

---

**Удачи с развертыванием! 🚀**
