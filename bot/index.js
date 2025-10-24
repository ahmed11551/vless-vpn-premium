import { Telegraf, Markup, session } from 'telegraf';
import dotenv from 'dotenv';
import cron from 'node-cron';
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';
import moment from 'moment';
import axios from 'axios';

// Загружаем переменные окружения
dotenv.config();

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN || '');
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3001/api';

// Состояния пользователей
const userStates = new Map();

// Конфигурация бота
const BOT_CONFIG = {
  name: 'VLESS VPN Premium',
  version: '1.0.0',
  supportChat: '@vless_support',
  website: 'https://vless-vpn-premium.netlify.app',
  adminId: process.env.ADMIN_ID || '',
};

// Тарифы
const PLANS = {
  basic: {
    name: 'Базовый',
    price: 299,
    duration: 30,
    features: ['Неограниченный трафик', 'Высокая скорость', 'Поддержка всех устройств'],
    description: 'Идеально для личного использования'
  },
  premium: {
    name: 'Премиум',
    price: 599,
    duration: 30,
    features: ['Неограниченный трафик', 'Максимальная скорость', 'Приоритетная поддержка', 'Дополнительные серверы'],
    description: 'Для требовательных пользователей'
  },
  pro: {
    name: 'Профи',
    price: 999,
    duration: 30,
    features: ['Неограниченный трафик', 'Максимальная скорость', 'VIP поддержка', 'Все серверы', 'Персональный менеджер'],
    description: 'Для бизнеса и профессионалов'
  }
};

// Функции для работы с API
const api = {
  async createUser(telegramId, username, firstName, lastName) {
    try {
      const response = await axios.post(`${API_BASE_URL}/users`, {
        telegramId,
        username,
        firstName,
        lastName,
        source: 'telegram'
      });
      return response.data;
    } catch (error) {
      console.error('Error creating user:', error);
      return null;
    }
  },

  async getUser(telegramId) {
    try {
      const response = await axios.get(`${API_BASE_URL}/users/telegram/${telegramId}`);
      return response.data;
    } catch (error) {
      console.error('Error getting user:', error);
      return null;
    }
  },

  async createVpnKey(userId, plan) {
    try {
      const response = await axios.post(`${API_BASE_URL}/vpn/keys`, {
        userId,
        plan,
        source: 'telegram'
      });
      return response.data;
    } catch (error) {
      console.error('Error creating VPN key:', error);
      return null;
    }
  },

  async getUserKeys(userId) {
    try {
      const response = await axios.get(`${API_BASE_URL}/vpn/keys/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error getting user keys:', error);
      return [];
    }
  },

  async createPayment(userId, plan, amount) {
    try {
      const response = await axios.post(`${API_BASE_URL}/payments`, {
        userId,
        plan,
        amount,
        source: 'telegram'
      });
      return response.data;
    } catch (error) {
      console.error('Error creating payment:', error);
      return null;
    }
  }
};

// Утилиты
const utils = {
  generateVpnKey() {
    return uuidv4().replace(/-/g, '');
  },

  formatDate(date) {
    return moment(date).format('DD.MM.YYYY HH:mm');
  },

  formatPrice(price) {
    return `${price} ₽`;
  },

  getPlanEmoji(plan) {
    const emojis = {
      basic: '🟢',
      premium: '🟡',
      pro: '🔴'
    };
    return emojis[plan] || '⚪';
  }
};

// Middleware для сессий
bot.use(session());

// Команда /start
bot.start(async (ctx) => {
  const user = ctx.from;
  const chatId = ctx.chat.id;
  
  // Регистрируем или получаем пользователя
  let dbUser = await api.getUser(user.id);
  if (!dbUser) {
    dbUser = await api.createUser(user.id, user.username, user.first_name, user.last_name);
  }

  // Сохраняем состояние
  userStates.set(chatId, { userId: dbUser?.id, step: 'main' });

  const welcomeText = `
🚀 Добро пожаловать в ${BOT_CONFIG.name}!

Я помогу вам:
• 🔐 Получить VPN ключи
• 💳 Оплатить подписку
• 📊 Проверить статус
• 🆘 Получить поддержку

Выберите действие:
  `;

  const keyboard = Markup.inlineKeyboard([
    [Markup.button.callback('🛒 Тарифы', 'plans')],
    [Markup.button.callback('🔑 Мои ключи', 'my_keys'), Markup.button.callback('📊 Статистика', 'stats')],
    [Markup.button.callback('💳 Оплата', 'payment'), Markup.button.callback('🆘 Поддержка', 'support')],
    [Markup.button.callback('ℹ️ О боте', 'about')]
  ]);

  await ctx.reply(welcomeText, keyboard);
});

// Обработка кнопок
bot.action('plans', async (ctx) => {
  let plansText = '📋 Доступные тарифы:\n\n';
  
  Object.entries(PLANS).forEach(([key, plan]) => {
    plansText += `${utils.getPlanEmoji(key)} *${plan.name}*\n`;
    plansText += `💰 ${utils.formatPrice(plan.price)} / ${plan.duration} дней\n`;
    plansText += `📝 ${plan.description}\n\n`;
    plansText += `✨ Возможности:\n`;
    plan.features.forEach(feature => {
      plansText += `• ${feature}\n`;
    });
    plansText += '\n';
  });

  const keyboard = Markup.inlineKeyboard([
    [Markup.button.callback('🟢 Базовый', 'buy_basic')],
    [Markup.button.callback('🟡 Премиум', 'buy_premium')],
    [Markup.button.callback('🔴 Профи', 'buy_pro')],
    [Markup.button.callback('🔙 Назад', 'back_to_main')]
  ]);

  await ctx.editMessageText(plansText, { 
    parse_mode: 'Markdown',
    ...keyboard 
  });
});

bot.action('my_keys', async (ctx) => {
  const chatId = ctx.chat.id;
  const userState = userStates.get(chatId);
  
  if (!userState?.userId) {
    await ctx.answerCbQuery('❌ Пользователь не найден');
    return;
  }

  const keys = await api.getUserKeys(userState.userId);
  
  if (keys.length === 0) {
    const keyboard = Markup.inlineKeyboard([
      [Markup.button.callback('🛒 Купить тариф', 'plans')],
      [Markup.button.callback('🔙 Назад', 'back_to_main')]
    ]);
    
    await ctx.editMessageText('🔑 У вас пока нет VPN ключей.\n\nВыберите тариф для получения ключа:', keyboard);
    return;
  }

  let keysText = '🔑 Ваши VPN ключи:\n\n';
  
  keys.forEach((key, index) => {
    keysText += `*Ключ ${index + 1}:*\n`;
    keysText += `🔑 \`${key.key}\`\n`;
    keysText += `📅 Создан: ${utils.formatDate(key.createdAt)}\n`;
    keysText += `⏰ Истекает: ${utils.formatDate(key.expiresAt)}\n`;
    keysText += `📊 Статус: ${key.isActive ? '✅ Активен' : '❌ Неактивен'}\n\n`;
  });

  const keyboard = Markup.inlineKeyboard([
    [Markup.button.callback('🔄 Обновить', 'my_keys')],
    [Markup.button.callback('🔙 Назад', 'back_to_main')]
  ]);

  await ctx.editMessageText(keysText, { 
    parse_mode: 'Markdown',
    ...keyboard 
  });
});

bot.action('stats', async (ctx) => {
  const chatId = ctx.chat.id;
  const userState = userStates.get(chatId);
  
  if (!userState?.userId) {
    await ctx.answerCbQuery('❌ Пользователь не найден');
    return;
  }

  const user = await api.getUser(ctx.from.id);
  const keys = await api.getUserKeys(userState.userId);
  
  const statsText = `
📊 Ваша статистика:

👤 Пользователь: ${user?.firstName || 'Неизвестно'}
📅 Регистрация: ${user ? utils.formatDate(user.createdAt) : 'Неизвестно'}
🔑 Ключей: ${keys.length}
✅ Активных: ${keys.filter(k => k.isActive).length}
❌ Неактивных: ${keys.filter(k => !k.isActive).length}

💡 Для получения новых ключей выберите тариф!
  `;

  const keyboard = Markup.inlineKeyboard([
    [Markup.button.callback('🛒 Купить тариф', 'plans')],
    [Markup.button.callback('🔙 Назад', 'back_to_main')]
  ]);

  await ctx.editMessageText(statsText, keyboard);
});

bot.action('payment', async (ctx) => {
  const paymentText = `
💳 Способы оплаты:

• 💳 Банковская карта (Visa, MasterCard)
• 📱 СБП (Система быстрых платежей)
• 💰 Криптовалюта (Bitcoin, Ethereum)
• ⭐ Telegram Stars (скоро)

Выберите тариф для оплаты:
  `;

  const keyboard = Markup.inlineKeyboard([
    [Markup.button.callback('🟢 Базовый', 'buy_basic')],
    [Markup.button.callback('🟡 Премиум', 'buy_premium')],
    [Markup.button.callback('🔴 Профи', 'buy_pro')],
    [Markup.button.callback('🔙 Назад', 'back_to_main')]
  ]);

  await ctx.editMessageText(paymentText, keyboard);
});

bot.action('support', async (ctx) => {
  const supportText = `
🆘 Поддержка

Если у вас возникли вопросы или проблемы:

📞 Техподдержка: @vless_support
🌐 Сайт: ${BOT_CONFIG.website}
📧 Email: support@vless-vpn.org

⏰ Время работы: 24/7
⚡ Ответ в течение 15 минут

Частые вопросы:
• Как подключиться к VPN?
• Как продлить подписку?
• Проблемы с подключением?
  `;

  const keyboard = Markup.inlineKeyboard([
    [Markup.button.url('💬 Написать в поддержку', 'https://t.me/vless_support')],
    [Markup.button.url('🌐 Перейти на сайт', BOT_CONFIG.website)],
    [Markup.button.callback('🔙 Назад', 'back_to_main')]
  ]);

  await ctx.editMessageText(supportText, keyboard);
});

bot.action('about', async (ctx) => {
  const aboutText = `
ℹ️ О боте

${BOT_CONFIG.name} v${BOT_CONFIG.version}

🚀 Современный VPN сервис с поддержкой протокола VLESS
🔐 Максимальная безопасность и приватность
⚡ Высокая скорость подключения
🌍 Серверы по всему миру
📱 Поддержка всех устройств

✨ Особенности:
• Неограниченный трафик
• Высокая скорость
• Стабильное соединение
• Круглосуточная поддержка
• Простота использования

Создано командой VLESS Premium Team
  `;

  const keyboard = Markup.inlineKeyboard([
    [Markup.button.url('🌐 Сайт', BOT_CONFIG.website)],
    [Markup.button.url('💬 Поддержка', 'https://t.me/vless_support')],
    [Markup.button.callback('🔙 Назад', 'back_to_main')]
  ]);

  await ctx.editMessageText(aboutText, keyboard);
});

// Обработка покупки тарифов
bot.action(/^buy_(.+)$/, async (ctx) => {
  const planType = ctx.match[1];
  const plan = PLANS[planType];
  
  if (!plan) {
    await ctx.answerCbQuery('❌ Тариф не найден');
    return;
  }

  const chatId = ctx.chat.id;
  const userState = userStates.get(chatId);
  
  if (!userState?.userId) {
    await ctx.answerCbQuery('❌ Пользователь не найден');
    return;
  }

  const paymentText = `
🛒 Покупка тарифа "${plan.name}"

💰 Стоимость: ${utils.formatPrice(plan.price)}
📅 Длительность: ${plan.duration} дней

✨ Включено:
${plan.features.map(feature => `• ${feature}`).join('\n')}

Выберите способ оплаты:
  `;

  const keyboard = Markup.inlineKeyboard([
    [Markup.button.callback('💳 Банковская карта', `pay_card_${planType}`)],
    [Markup.button.callback('📱 СБП', `pay_sbp_${planType}`)],
    [Markup.button.callback('💰 Криптовалюта', `pay_crypto_${planType}`)],
    [Markup.button.callback('🔙 Назад', 'plans')]
  ]);

  await ctx.editMessageText(paymentText, keyboard);
});

// Обработка платежей
bot.action(/^pay_(.+)_(.+)$/, async (ctx) => {
  const paymentMethod = ctx.match[1];
  const planType = ctx.match[2];
  const plan = PLANS[planType];
  
  if (!plan) {
    await ctx.answerCbQuery('❌ Тариф не найден');
    return;
  }

  const chatId = ctx.chat.id;
  const userState = userStates.get(chatId);
  
  if (!userState?.userId) {
    await ctx.answerCbQuery('❌ Пользователь не найден');
    return;
  }

  // Создаем платеж
  const payment = await api.createPayment(userState.userId, planType, plan.price);
  
  if (!payment) {
    await ctx.answerCbQuery('❌ Ошибка создания платежа');
    return;
  }

  let paymentText = '';
  let keyboard;

  switch (paymentMethod) {
    case 'card':
      paymentText = `
💳 Оплата банковской картой

💰 Сумма: ${utils.formatPrice(plan.price)}
🆔 ID платежа: ${payment.id}

Перейдите по ссылке для оплаты:
      `;
      keyboard = Markup.inlineKeyboard([
        [Markup.button.url('💳 Оплатить', payment.paymentUrl)],
        [Markup.button.callback('✅ Я оплатил', `check_payment_${payment.id}`)],
        [Markup.button.callback('🔙 Назад', 'plans')]
      ]);
      break;
      
    case 'sbp':
      paymentText = `
📱 Оплата через СБП

💰 Сумма: ${utils.formatPrice(plan.price)}
🆔 ID платежа: ${payment.id}

QR-код для оплаты:
      `;
      keyboard = Markup.inlineKeyboard([
        [Markup.button.callback('📱 Показать QR', `show_qr_${payment.id}`)],
        [Markup.button.callback('✅ Я оплатил', `check_payment_${payment.id}`)],
        [Markup.button.callback('🔙 Назад', 'plans')]
      ]);
      break;
      
    case 'crypto':
      paymentText = `
💰 Оплата криптовалютой

💰 Сумма: ${utils.formatPrice(plan.price)}
🆔 ID платежа: ${payment.id}

Адрес для оплаты:
      `;
      keyboard = Markup.inlineKeyboard([
        [Markup.button.callback('💰 Показать адрес', `show_crypto_${payment.id}`)],
        [Markup.button.callback('✅ Я оплатил', `check_payment_${payment.id}`)],
        [Markup.button.callback('🔙 Назад', 'plans')]
      ]);
      break;
  }

  await ctx.editMessageText(paymentText, keyboard);
});

bot.action('back_to_main', async (ctx) => {
  const welcomeText = `
🚀 Главное меню

Выберите действие:
  `;

  const keyboard = Markup.inlineKeyboard([
    [Markup.button.callback('🛒 Тарифы', 'plans')],
    [Markup.button.callback('🔑 Мои ключи', 'my_keys'), Markup.button.callback('📊 Статистика', 'stats')],
    [Markup.button.callback('💳 Оплата', 'payment'), Markup.button.callback('🆘 Поддержка', 'support')],
    [Markup.button.callback('ℹ️ О боте', 'about')]
  ]);

  await ctx.editMessageText(welcomeText, keyboard);
});

// Обработка текстовых сообщений
bot.on('text', async (ctx) => {
  const text = ctx.message.text;
  const chatId = ctx.chat.id;
  const userState = userStates.get(chatId);

  // Если пользователь не зарегистрирован
  if (!userState) {
    await ctx.reply('👋 Привет! Нажмите /start для начала работы с ботом.');
    return;
  }

  // Обработка различных команд
  switch (text.toLowerCase()) {
    case 'меню':
    case 'главная':
    case 'начать':
      await ctx.reply('🔙 Возвращаемся в главное меню...');
      // Здесь можно вызвать функцию главного меню
      break;
      
    case 'помощь':
    case 'help':
      await ctx.reply('🆘 Для получения помощи нажмите кнопку "Поддержка" в главном меню или напишите @vless_support');
      break;
      
    default:
      await ctx.reply('🤔 Не понимаю команду. Используйте кнопки меню или команду /start');
  }
});

// Обработка ошибок
bot.catch((err, ctx) => {
  console.error('Bot error:', err);
  ctx.reply('❌ Произошла ошибка. Попробуйте позже или обратитесь в поддержку @vless_support');
});

// Запуск бота
bot.launch().then(() => {
  console.log(`🤖 ${BOT_CONFIG.name} bot started successfully!`);
  console.log(`📊 Bot version: ${BOT_CONFIG.version}`);
  console.log(`🌐 Website: ${BOT_CONFIG.website}`);
}).catch((error) => {
  console.error('Failed to start bot:', error);
});

// Graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

export default bot;