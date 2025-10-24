# 🚀 Развертывание на Vercel

## 📋 Подготовка

### 1. Создайте репозиторий на GitHub
```bash
# Добавьте все файлы
git add .

# Сделайте первый коммит
git commit -m "Initial commit: VLESS VPN Premium"

# Добавьте remote origin (замените на ваш репозиторий)
git remote add origin https://github.com/yourusername/vless-vpn-premium.git

# Загрузите на GitHub
git push -u origin main
```

### 2. Настройте базу данных
Для production рекомендуется использовать:
- **Vercel Postgres** (встроенная база данных Vercel)
- **Supabase** (бесплатный PostgreSQL)
- **PlanetScale** (MySQL)
- **Neon** (PostgreSQL)

### 3. Настройте Redis
- **Upstash Redis** (рекомендуется для Vercel)
- **Redis Cloud**
- **AWS ElastiCache**

## 🔧 Настройка Vercel

### 1. Подключите репозиторий
1. Зайдите на [vercel.com](https://vercel.com)
2. Нажмите "New Project"
3. Выберите ваш GitHub репозиторий
4. Нажмите "Import"

### 2. Настройте переменные окружения
В настройках проекта добавьте следующие переменные:

```env
# Database
DATABASE_URL=postgresql://username:password@host:port/database

# Redis
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

# Frontend
REACT_APP_API_URL=https://your-domain.vercel.app/api
```

### 3. Настройте Build Settings
- **Framework Preset**: Other
- **Build Command**: `npm run vercel-build`
- **Output Directory**: `client/build`
- **Install Command**: `npm run install:all`

## 🗄️ Настройка базы данных

### Вариант 1: Vercel Postgres
1. В панели Vercel перейдите в "Storage"
2. Создайте новую Postgres базу данных
3. Скопируйте `DATABASE_URL` в переменные окружения

### Вариант 2: Supabase
1. Создайте проект на [supabase.com](https://supabase.com)
2. Получите connection string
3. Добавьте в переменные окружения как `DATABASE_URL`

### Вариант 3: Neon
1. Создайте проект на [neon.tech](https://neon.tech)
2. Получите connection string
3. Добавьте в переменные окружения как `DATABASE_URL`

## 🔴 Настройка Redis

### Вариант 1: Upstash Redis
1. Создайте базу данных на [upstash.com](https://upstash.com)
2. Получите `REDIS_URL`
3. Добавьте в переменные окружения

### Вариант 2: Redis Cloud
1. Создайте базу данных на [redis.com](https://redis.com)
2. Получите connection string
3. Добавьте в переменные окружения как `REDIS_URL`

## 🤖 Настройка Telegram Bot

1. Создайте бота через [@BotFather](https://t.me/BotFather)
2. Получите токен бота
3. Добавьте токен в переменные окружения как `TELEGRAM_BOT_TOKEN`
4. Настройте webhook (опционально)

## 💳 Настройка платежей

### Stripe
1. Создайте аккаунт на [stripe.com](https://stripe.com)
2. Получите API ключи
3. Добавьте в переменные окружения:
   - `STRIPE_SECRET_KEY`
   - `STRIPE_WEBHOOK_SECRET`

### YooKassa
1. Создайте аккаунт на [yookassa.ru](https://yookassa.ru)
2. Получите API ключи
3. Добавьте в переменные окружения:
   - `YOOKASSA_SHOP_ID`
   - `YOOKASSA_SECRET_KEY`

## 🚀 Развертывание

### 1. Автоматическое развертывание
После настройки всех переменных окружения:
1. Нажмите "Deploy" в панели Vercel
2. Дождитесь завершения сборки
3. Получите URL вашего приложения

### 2. Обновление переменных окружения
После добавления переменных окружения:
1. Перейдите в "Settings" → "Environment Variables"
2. Добавьте все необходимые переменные
3. Нажмите "Redeploy" для применения изменений

## 🔧 Настройка домена

### 1. Кастомный домен
1. В настройках проекта перейдите в "Domains"
2. Добавьте ваш домен
3. Настройте DNS записи согласно инструкциям Vercel

### 2. SSL сертификат
Vercel автоматически предоставляет SSL сертификаты для всех доменов.

## 📊 Мониторинг

### 1. Логи
- Перейдите в "Functions" → выберите функцию
- Просматривайте логи в реальном времени

### 2. Аналитика
- Используйте встроенную аналитику Vercel
- Подключите Google Analytics (опционально)

## 🔄 Обновления

### 1. Автоматические обновления
При push в main ветку Vercel автоматически развернет обновления.

### 2. Ручные обновления
1. Внесите изменения в код
2. Сделайте commit и push
3. Vercel автоматически развернет обновления

## 🛠️ Troubleshooting

### Проблемы с базой данных
- Проверьте правильность `DATABASE_URL`
- Убедитесь, что база данных доступна из интернета
- Проверьте миграции

### Проблемы с Redis
- Проверьте правильность `REDIS_URL`
- Убедитесь, что Redis доступен из интернета

### Проблемы с Telegram Bot
- Проверьте правильность токена
- Убедитесь, что бот активен

### Проблемы с платежами
- Проверьте API ключи
- Убедитесь, что используете правильные ключи (test/live)

## 📚 Полезные ссылки

- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres)
- [Upstash Redis](https://upstash.com/docs)
- [Stripe Documentation](https://stripe.com/docs)
- [YooKassa Documentation](https://yookassa.ru/docs)

---

После выполнения всех шагов ваше приложение будет доступно по адресу `https://your-project.vercel.app` 🎉
