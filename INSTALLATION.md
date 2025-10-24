# VLESS VPN Premium - Полное руководство по установке

## 🚀 Быстрый старт

### Требования
- Docker и Docker Compose
- Node.js 18+ (для разработки)
- PostgreSQL 15+ (для разработки)
- Redis 7+ (для разработки)

### Установка

#### Windows
```bash
# Запустите setup.bat
setup.bat
```

#### Linux/macOS
```bash
# Сделайте скрипт исполняемым
chmod +x setup.sh

# Запустите установку
./setup.sh
```

#### Ручная установка
```bash
# 1. Клонируйте репозиторий
git clone https://github.com/vless-vpn/premium.git
cd premium

# 2. Установите зависимости
npm run install:all

# 3. Настройте переменные окружения
cp server/env.example server/.env
cp client/.env.example client/.env
cp bot/.env.example bot/.env

# 4. Запустите с Docker
docker-compose up --build -d
```

## ⚙️ Конфигурация

### Backend (.env)
```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=vless_vpn
DB_USER=postgres
DB_PASSWORD=password

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d

# Telegram Bot
TELEGRAM_BOT_TOKEN=your-telegram-bot-token

# Payments
STRIPE_SECRET_KEY=sk_test_your-stripe-key
YOOKASSA_SHOP_ID=your-yookassa-shop-id
YOOKASSA_SECRET_KEY=your-yookassa-secret-key
```

### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:3001/api
```

### Bot (.env)
```env
TELEGRAM_BOT_TOKEN=your-telegram-bot-token
API_BASE_URL=http://localhost:3001/api
```

## 🏗️ Архитектура

### Backend (Node.js + Express)
- **Аутентификация**: JWT токены
- **База данных**: PostgreSQL с Knex.js
- **Кэширование**: Redis
- **Платежи**: Stripe + YooKassa
- **Логирование**: Winston
- **Безопасность**: Helmet, Rate Limiting

### Frontend (React + TypeScript)
- **UI**: Tailwind CSS + Headless UI
- **Анимации**: Framer Motion
- **Состояние**: React Query
- **Роутинг**: React Router
- **Формы**: React Hook Form

### Telegram Bot (Node.js)
- **Библиотека**: node-telegram-bot-api
- **Функции**: Выдача ключей, поддержка, платежи
- **Интеграция**: Полная интеграция с API

## 📊 База данных

### Таблицы
- `users` - Пользователи
- `vpn_keys` - VPN ключи
- `payments` - Платежи
- `vpn_usage` - Статистика использования

### Миграции
```bash
# Запуск миграций
cd server
npm run migrate

# Запуск сидов
npm run seed
```

## 🔧 API Endpoints

### Аутентификация
- `POST /api/auth/register` - Регистрация
- `POST /api/auth/login` - Вход
- `GET /api/auth/profile` - Профиль пользователя
- `POST /api/auth/link-telegram` - Привязка Telegram

### VPN
- `POST /api/vpn/generate-key` - Создание ключа
- `GET /api/vpn/keys` - Список ключей
- `GET /api/vpn/keys/:id` - Детали ключа
- `PUT /api/vpn/keys/:id/deactivate` - Деактивация ключа
- `GET /api/vpn/locations` - Серверы
- `GET /api/vpn/config/:key` - Конфигурация

### Платежи
- `GET /api/payments/plans` - Тарифы
- `POST /api/payments/create-payment-intent` - Создание платежа
- `POST /api/payments/success` - Подтверждение платежа
- `POST /api/payments/webhook` - Webhook Stripe

### Админка
- `GET /api/admin/stats` - Статистика
- `GET /api/admin/users` - Пользователи
- `GET /api/admin/vpn-keys` - VPN ключи
- `PUT /api/admin/users/:id/subscription` - Обновление подписки

## 🤖 Telegram Bot

### Команды
- `/start` - Главное меню
- `/trial` - Пробный ключ
- `/pricing` - Тарифы
- `/support` - Поддержка
- `/help` - Помощь

### Функции
- Выдача пробных ключей
- Покупка подписок
- Техническая поддержка
- Реферальная программа
- Уведомления

## 💳 Платежная система

### Поддерживаемые способы
- Банковские карты РФ
- СБП (Система быстрых платежей)
- Криптовалюта (Bitcoin, Ethereum)
- Telegram Stars

### Интеграции
- **Stripe** - Международные карты
- **YooKassa** - Российские карты и СБП
- **Crypto** - Bitcoin, Ethereum
- **Telegram Stars** - Встроенные платежи

## 🔒 Безопасность

### Защита
- JWT аутентификация
- Rate limiting
- CORS настройки
- Helmet security headers
- Валидация входных данных
- Хеширование паролей (bcrypt)

### Мониторинг
- Логирование всех операций
- Отслеживание подозрительной активности
- Уведомления о нарушениях
- Автоматическая блокировка

## 📈 Мониторинг и аналитика

### Метрики
- Количество пользователей
- Активные подписки
- Использование трафика
- Конверсия платежей
- Производительность серверов

### Логи
- Все API запросы
- Ошибки и исключения
- Платежные операции
- Действия пользователей

## 🚀 Развертывание

### Production
```bash
# 1. Настройте переменные окружения
# 2. Получите SSL сертификаты
# 3. Настройте домен
# 4. Запустите с Docker

docker-compose -f docker-compose.prod.yml up -d
```

### Масштабирование
- Горизонтальное масштабирование API
- Load balancer (Nginx)
- Кластеризация Redis
- Репликация PostgreSQL

## 🔧 Разработка

### Локальная разработка
```bash
# Backend
cd server
npm install
npm run dev

# Frontend
cd client
npm install
npm start

# Bot
cd bot
npm install
npm run dev
```

### Тестирование
```bash
# Backend тесты
cd server
npm test

# Frontend тесты
cd client
npm test
```

## 📚 Дополнительные ресурсы

### Документация
- [API Documentation](docs/api.md)
- [Database Schema](docs/database.md)
- [Deployment Guide](docs/deployment.md)
- [Security Guide](docs/security.md)

### Поддержка
- Telegram: @vless_support
- Email: support@vless-vpn.org
- GitHub Issues: [Issues](https://github.com/vless-vpn/premium/issues)

## 📄 Лицензия

MIT License - см. [LICENSE](LICENSE) для деталей.

## 🤝 Вклад в проект

Мы приветствуем вклад в развитие проекта! См. [CONTRIBUTING.md](CONTRIBUTING.md) для деталей.

---

**VLESS VPN Premium** - Современный, быстрый и безопасный VPN сервис с поддержкой протокола VLESS.
