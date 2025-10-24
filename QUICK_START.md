# 🚀 Быстрый старт: GitHub + Vercel

## 📋 Что нужно сделать:

### 1. Создать репозиторий на GitHub
- Перейдите на [github.com](https://github.com)
- Нажмите "New repository"
- Название: `vless-vpn-premium`
- Создайте репозиторий

### 2. Загрузить код на GitHub
```bash
# Добавьте remote (замените URL на ваш)
git remote add origin https://github.com/yourusername/vless-vpn-premium.git

# Загрузите код
git push -u origin main
```

### 3. Развернуть на Vercel
- Откройте [vercel.com](https://vercel.com)
- Войдите через GitHub
- Нажмите "New Project"
- Выберите репозиторий `vless-vpn-premium`
- Нажмите "Import"

### 4. Настроить переменные окружения
В Vercel добавьте переменные:
```env
DATABASE_URL=postgresql://...
REDIS_URL=redis://...
JWT_SECRET=your-secret-key
TELEGRAM_BOT_TOKEN=your-bot-token
REACT_APP_API_URL=https://your-project.vercel.app/api
```

### 5. Настроить базы данных
- **PostgreSQL**: Используйте Vercel Postgres или Supabase
- **Redis**: Используйте Upstash Redis

### 6. Развернуть
- Нажмите "Deploy"
- Дождитесь завершения
- Получите URL приложения

## 🎯 Результат:
- ✅ Сайт: `https://your-project.vercel.app`
- ✅ API: `https://your-project.vercel.app/api`
- ✅ Telegram бот: Настроен

## 📚 Подробные инструкции:
- [Полная инструкция](GITHUB_VERCEL_GUIDE.md)
- [Развертывание на Vercel](VERCEL_DEPLOYMENT.md)
- [Установка локально](INSTALLATION.md)

---

**Готово! Ваш VLESS VPN Premium запущен! 🎉**
