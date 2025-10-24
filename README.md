# 🚀 VLESS VPN Premium

> **Полный аналог сайта [vless-vpn.org](https://vless-vpn.org/) с улучшенным функционалом и современными технологиями**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18+-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue.svg)](https://www.typescriptlang.org/)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue.svg)](https://www.docker.com/)

## ✨ Особенности

### 🎨 Современный дизайн
- **Адаптивный интерфейс** - Работает на всех устройствах
- **Плавные анимации** - Современные переходы с Framer Motion
- **Темная тема** - Поддержка темной темы (в разработке)
- **PWA поддержка** - Установка как приложение

### 🔒 Максимальная безопасность
- **JWT аутентификация** - Современная система авторизации
- **Rate limiting** - Защита от DDoS атак
- **Валидация данных** - Проверка всех входных данных
- **Хеширование паролей** - bcrypt с настраиваемыми раундами

### 💳 Гибкая оплата
- **Банковские карты РФ** - Visa, MasterCard, МИР
- **СБП** - Система быстрых платежей
- **Криптовалюта** - Bitcoin, Ethereum
- **Telegram Stars** - Встроенные платежи Telegram

### 🤖 Telegram бот
- **Полнофункциональный бот** - Замена оригинального @vless_vpn_shop_bot
- **Интерактивные меню** - Удобная навигация
- **Автоматическая выдача ключей** - Мгновенная генерация
- **Техническая поддержка** - Встроенная поддержка клиентов

### 📊 Детальная аналитика
- **Статистика использования** - Графики и метрики
- **Мониторинг производительности** - Отслеживание метрик
- **Финансовая отчетность** - Анализ доходов
- **Пользовательская аналитика** - Поведение пользователей

## 🛠️ Технологический стек

### Backend
- **Node.js 18+** - JavaScript runtime
- **Express.js** - Web framework
- **PostgreSQL** - Реляционная база данных
- **Redis** - Кэширование и сессии
- **JWT** - Аутентификация
- **Stripe + YooKassa** - Платежные системы
- **Winston** - Логирование

### Frontend
- **React 18** - UI библиотека
- **TypeScript** - Типизированный JavaScript
- **Tailwind CSS** - Utility-first CSS
- **Framer Motion** - Анимации
- **React Query** - Управление состоянием
- **React Router** - Роутинг

### DevOps
- **Docker** - Контейнеризация
- **Docker Compose** - Оркестрация
- **Nginx** - Reverse proxy
- **SSL/TLS** - Шифрование
- **GitHub Actions** - CI/CD

## 🚀 Быстрый старт

### Автоматическая установка

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

### Ручная установка

1. **Клонируйте репозиторий**
   ```bash
   git clone https://github.com/vless-vpn/premium.git
   cd premium
   ```

2. **Установите зависимости**
   ```bash
   npm run install:all
   ```

3. **Настройте переменные окружения**
   ```bash
   # Backend
   cp server/env.example server/.env
   
   # Frontend
   echo "REACT_APP_API_URL=http://localhost:3001/api" > client/.env
   
   # Bot
   cp bot/.env.example bot/.env
   ```

4. **Запустите с Docker**
   ```bash
   docker-compose up --build -d
   ```

5. **Откройте приложение**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001
   - Telegram Bot: Настройте токен в bot/.env

## 📁 Структура проекта

```
vless-vpn-premium/
├── 📁 client/                 # React frontend
│   ├── src/
│   │   ├── components/        # React компоненты
│   │   ├── pages/            # Страницы приложения
│   │   ├── hooks/            # Custom hooks
│   │   ├── services/         # API сервисы
│   │   └── utils/            # Утилиты
│   └── public/               # Статические файлы
├── 📁 server/                # Node.js backend
│   ├── config/               # Конфигурация БД и Redis
│   ├── controllers/          # Контроллеры API
│   ├── middleware/           # Middleware функции
│   ├── models/              # Модели данных
│   ├── routes/              # API маршруты
│   ├── services/            # Бизнес логика
│   ├── migrations/          # Миграции БД
│   └── utils/               # Утилиты
├── 📁 bot/                   # Telegram bot
│   └── index.js             # Основной файл бота
├── 📁 docker/               # Docker конфигурации
│   └── nginx.conf           # Nginx конфигурация
├── 📁 docs/                 # Документация
├── docker-compose.yml       # Docker Compose
├── setup.sh                # Скрипт установки (Linux/macOS)
├── setup.bat               # Скрипт установки (Windows)
└── README.md               # Этот файл
```

## 🔧 Конфигурация

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

## 📊 API Endpoints

### Аутентификация
- `POST /api/auth/register` - Регистрация пользователя
- `POST /api/auth/login` - Вход в систему
- `GET /api/auth/profile` - Получение профиля
- `POST /api/auth/link-telegram` - Привязка Telegram

### VPN
- `POST /api/vpn/generate-key` - Создание VPN ключа
- `GET /api/vpn/keys` - Список ключей пользователя
- `GET /api/vpn/keys/:id` - Детали ключа
- `PUT /api/vpn/keys/:id/deactivate` - Деактивация ключа
- `GET /api/vpn/locations` - Доступные серверы
- `GET /api/vpn/config/:key` - Конфигурация для клиента

### Платежи
- `GET /api/payments/plans` - Тарифные планы
- `POST /api/payments/create-payment-intent` - Создание платежа
- `POST /api/payments/success` - Подтверждение платежа
- `POST /api/payments/webhook` - Webhook для Stripe

### Админка
- `GET /api/admin/stats` - Статистика системы
- `GET /api/admin/users` - Список пользователей
- `GET /api/admin/vpn-keys` - Список VPN ключей
- `PUT /api/admin/users/:id/subscription` - Обновление подписки

## 🤖 Telegram Bot

### Команды
- `/start` - Главное меню
- `/trial` - Получить пробный ключ
- `/pricing` - Посмотреть тарифы
- `/support` - Техническая поддержка
- `/help` - Справка

### Функции
- **Выдача пробных ключей** - 24 часа бесплатного доступа
- **Покупка подписок** - Интеграция с платежными системами
- **Техническая поддержка** - Встроенная поддержка клиентов
- **Реферальная программа** - Заработок на приглашениях
- **Уведомления** - Статус подписки и платежей

## 💳 Платежная система

### Поддерживаемые способы
- **Банковские карты РФ** - Visa, MasterCard, МИР
- **СБП** - Система быстрых платежей
- **Криптовалюта** - Bitcoin, Ethereum
- **Telegram Stars** - Встроенные платежи Telegram

### Интеграции
- **Stripe** - Международные платежи
- **YooKassa** - Российские платежи
- **Crypto** - Криптовалютные платежи
- **Telegram Stars** - Платежи через Telegram

## 🔒 Безопасность

### Защита
- **JWT аутентификация** - Современная система авторизации
- **Rate limiting** - Защита от DDoS атак
- **CORS настройки** - Правильная настройка CORS
- **Helmet** - Защитные HTTP заголовки
- **Валидация данных** - Проверка всех входных данных
- **Хеширование паролей** - bcrypt с настраиваемыми раундами

### Мониторинг
- **Логирование** - Структурированные логи с Winston
- **Health checks** - Проверка состояния сервисов
- **Метрики** - Отслеживание производительности
- **Алерты** - Уведомления о проблемах

## 📈 Мониторинг и аналитика

### Метрики
- **Пользователи** - Количество и активность
- **Подписки** - Активные и новые
- **Трафик** - Использование по дням/месяцам
- **Платежи** - Конверсия и доходы
- **Производительность** - Время ответа API

### Дашборды
- **Пользовательский** - Статистика использования
- **Админский** - Общие метрики системы
- **Финансовый** - Анализ доходов
- **Технический** - Производительность сервисов

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
- **Горизонтальное масштабирование** - Несколько инстансов API
- **Load balancer** - Nginx для распределения нагрузки
- **Кластеризация Redis** - Высокая доступность кэша
- **Репликация PostgreSQL** - Резервное копирование БД

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

## 📚 Документация

- [📖 Полное руководство по установке](INSTALLATION.md)
- [✨ Улучшения по сравнению с оригиналом](IMPROVEMENTS.md)
- [🔧 API Documentation](docs/api.md)
- [🗄️ Database Schema](docs/database.md)
- [🚀 Deployment Guide](docs/deployment.md)
- [🔒 Security Guide](docs/security.md)

## 🆚 Сравнение с оригиналом

| Функция | Оригинал | VLESS Premium |
|---------|----------|---------------|
| **Дизайн** | Простой HTML/CSS | Современный React + Tailwind |
| **Адаптивность** | Базовая | Полностью адаптивный |
| **Анимации** | Нет | Плавные анимации |
| **Аутентификация** | Простая | JWT + безопасность |
| **Платежи** | Ограниченные | Множество способов |
| **Telegram Bot** | Базовый | Полнофункциональный |
| **База данных** | Простая | PostgreSQL + миграции |
| **API** | Минимальный | RESTful API |
| **Безопасность** | Базовая | Продвинутая |
| **Мониторинг** | Отсутствует | Полный мониторинг |
| **Развертывание** | Ручное | Docker автоматизация |

## 🤝 Поддержка

- **Telegram**: [@vless_support](https://t.me/vless_support)
- **Email**: support@vless-vpn.org
- **GitHub Issues**: [Issues](https://github.com/vless-vpn/premium/issues)
- **Документация**: [Wiki](https://github.com/vless-vpn/premium/wiki)

## 📄 Лицензия

Этот проект лицензирован под MIT License - см. [LICENSE](LICENSE) для деталей.

## 🤝 Вклад в проект

Мы приветствуем вклад в развитие проекта! См. [CONTRIBUTING.md](CONTRIBUTING.md) для деталей.

## 🙏 Благодарности

- [vless-vpn.org](https://vless-vpn.org/) - Оригинальный сайт
- [Telegram Bot API](https://core.telegram.org/bots/api) - Telegram Bot API
- [Stripe](https://stripe.com/) - Платежная система
- [YooKassa](https://yookassa.ru/) - Российская платежная система

---

**VLESS VPN Premium** - Современный, быстрый и безопасный VPN сервис с поддержкой протокола VLESS.

⭐ **Поставьте звезду, если проект вам понравился!**
