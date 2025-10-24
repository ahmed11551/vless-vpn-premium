const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
const moment = require('moment');
require('dotenv').config();

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3001/api';

class VlessVpnBot {
  constructor() {
    this.bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });
    this.setupHandlers();
  }

  setupHandlers() {
    // Start command
    this.bot.onText(/\/start/, (msg) => {
      this.handleStart(msg);
    });

    // Help command
    this.bot.onText(/\/help/, (msg) => {
      this.handleHelp(msg);
    });

    // Get trial key
    this.bot.onText(/\/trial/, (msg) => {
      this.handleTrialKey(msg);
    });

    // Get pricing
    this.bot.onText(/\/pricing/, (msg) => {
      this.handlePricing(msg);
    });

    // Support
    this.bot.onText(/\/support/, (msg) => {
      this.handleSupport(msg);
    });

    // Callback queries
    this.bot.on('callback_query', (callbackQuery) => {
      this.handleCallbackQuery(callbackQuery);
    });

    // Error handling
    this.bot.on('error', (error) => {
      console.error('Bot error:', error);
    });
  }

  async handleStart(msg) {
    const chatId = msg.chat.id;
    const firstName = msg.from.first_name;

    const welcomeMessage = `
🚀 Добро пожаловать в VLESS VPN Premium, ${firstName}!

🔐 Получите быстрый и безопасный VPN доступ к интернету без ограничений.

📱 Выберите действие:
`;

    const keyboard = {
      reply_markup: {
        inline_keyboard: [
          [
            { text: '🆓 Получить пробный ключ', callback_data: 'trial_key' },
            { text: '💰 Тарифы', callback_data: 'pricing' }
          ],
          [
            { text: '📖 Инструкция', callback_data: 'instructions' },
            { text: '🆘 Поддержка', callback_data: 'support' }
          ],
          [
            { text: '👥 Реферальная программа', callback_data: 'referral' }
          ]
        ]
      }
    };

    this.bot.sendMessage(chatId, welcomeMessage, keyboard);
  }

  async handleTrialKey(msg) {
    const chatId = msg.chat.id;
    
    const categoryMessage = `
🆓 Выберите категорию для пробного ключа:

Каждый пробный ключ действует 24 часа и дает полный доступ к сервису.
`;

    const keyboard = {
      reply_markup: {
        inline_keyboard: [
          [
            { text: '📱 Instagram', callback_data: 'trial_instagram' },
            { text: '🎥 YouTube', callback_data: 'trial_youtube' }
          ],
          [
            { text: '💬 ChatGPT', callback_data: 'trial_chatgpt' },
            { text: '🎨 Canva', callback_data: 'trial_canva' }
          ],
          [
            { text: '📞 Zoom', callback_data: 'trial_zoom' },
            { text: '🎮 Discord', callback_data: 'trial_discord' }
          ],
          [
            { text: '📱 TikTok', callback_data: 'trial_tiktok' },
            { text: '🌐 Общий доступ', callback_data: 'trial_general' }
          ],
          [
            { text: '🔙 Назад', callback_data: 'back_to_main' }
          ]
        ]
      }
    };

    this.bot.sendMessage(chatId, categoryMessage, keyboard);
  }

  async handlePricing(msg) {
    const chatId = msg.chat.id;

    try {
      const response = await axios.get(`${API_BASE_URL}/payments/plans`);
      const plans = response.data.data.plans;

      let pricingMessage = `💰 Тарифы VLESS VPN Premium:\n\n`;

      plans.forEach(plan => {
        const durationText = plan.duration === 1 ? 'месяц' : 
                            plan.duration === 2 ? 'месяца' : 'месяца';
        
        pricingMessage += `🔥 ${plan.name} - ${plan.price} ₽/${durationText}\n`;
        plan.features.forEach(feature => {
          pricingMessage += `✅ ${feature}\n`;
        });
        pricingMessage += `\n`;
      });

      pricingMessage += `💳 Способы оплаты:\n`;
      pricingMessage += `• Банковские карты РФ\n`;
      pricingMessage += `• СБП\n`;
      pricingMessage += `• Криптовалюта\n`;
      pricingMessage += `• Telegram Stars\n`;

      const keyboard = {
        reply_markup: {
          inline_keyboard: [
            [
              { text: '💳 Купить Premium', callback_data: 'buy_premium' },
              { text: '💳 Купить Pro', callback_data: 'buy_pro' }
            ],
            [
              { text: '🔙 Назад', callback_data: 'back_to_main' }
            ]
          ]
        }
      };

      this.bot.sendMessage(chatId, pricingMessage, keyboard);
    } catch (error) {
      console.error('Error getting pricing:', error);
      this.bot.sendMessage(chatId, '❌ Ошибка получения тарифов. Попробуйте позже.');
    }
  }

  async handleSupport(msg) {
    const chatId = msg.chat.id;

    const supportMessage = `
🆘 Техническая поддержка VLESS VPN Premium

📞 Способы связи:
• Telegram: @vless_support
• Email: support@vless-vpn.org
• Время работы: 24/7

🔧 Частые проблемы:

❓ VPN не подключается?
• Проверьте интернет-соединение
• Перезапустите приложение
• Попробуйте другой сервер

❓ Ключ не работает?
• Проверьте срок действия
• Убедитесь в правильности ключа
• Обратитесь в поддержку

❓ Медленная скорость?
• Попробуйте сервер ближе к вам
• Проверьте нагрузку на сервер
• Перезапустите соединение
`;

    const keyboard = {
      reply_markup: {
        inline_keyboard: [
          [
            { text: '📞 Связаться с поддержкой', url: 'https://t.me/vless_support' }
          ],
          [
            { text: '🔙 Назад', callback_data: 'back_to_main' }
          ]
        ]
      }
    };

    this.bot.sendMessage(chatId, supportMessage, keyboard);
  }

  async handleCallbackQuery(callbackQuery) {
    const chatId = callbackQuery.message.chat.id;
    const data = callbackQuery.data;

    try {
      switch (data) {
        case 'trial_key':
          await this.handleTrialKey({ chat: { id: chatId } });
          break;

        case 'pricing':
          await this.handlePricing({ chat: { id: chatId } });
          break;

        case 'support':
          await this.handleSupport({ chat: { id: chatId } });
          break;

        case 'instructions':
          await this.handleInstructions(chatId);
          break;

        case 'referral':
          await this.handleReferral(chatId);
          break;

        case 'back_to_main':
          await this.handleStart({ chat: { id: chatId }, from: { first_name: 'Пользователь' } });
          break;

        default:
          if (data.startsWith('trial_')) {
            await this.generateTrialKey(chatId, data);
          } else if (data.startsWith('buy_')) {
            await this.handlePurchase(chatId, data);
          }
          break;
      }

      // Answer callback query
      this.bot.answerCallbackQuery(callbackQuery.id);
    } catch (error) {
      console.error('Callback query error:', error);
      this.bot.answerCallbackQuery(callbackQuery.id, { text: 'Произошла ошибка. Попробуйте позже.' });
    }
  }

  async generateTrialKey(chatId, category) {
    try {
      // Generate trial key logic
      const keyId = require('uuid').v4();
      const key = `vless-trial-${keyId}`;
      
      const categoryNames = {
        'trial_instagram': 'Instagram',
        'trial_youtube': 'YouTube',
        'trial_chatgpt': 'ChatGPT',
        'trial_canva': 'Canva',
        'trial_zoom': 'Zoom',
        'trial_discord': 'Discord',
        'trial_tiktok': 'TikTok',
        'trial_general': 'Общий доступ'
      };

      const categoryName = categoryNames[category] || 'Общий доступ';

      const keyMessage = `
🎉 Пробный ключ для ${categoryName} готов!

🔑 Ваш ключ: \`${key}\`

⏰ Срок действия: 24 часа
🌍 Доступные сервера: Все
📊 Трафик: Безлимитный

📱 Как подключиться:
1. Скачайте приложение VLESS
2. Добавьте ключ в приложение
3. Выберите сервер
4. Нажмите "Подключить"

💡 Совет: Для лучшей скорости выберите сервер ближе к вам!
`;

      const keyboard = {
        reply_markup: {
          inline_keyboard: [
            [
              { text: '📱 Скачать приложение', url: 'https://github.com/v2ray/v2ray-core/releases' }
            ],
            [
              { text: '📖 Подробная инструкция', callback_data: 'instructions' }
            ],
            [
              { text: '🔙 Главное меню', callback_data: 'back_to_main' }
            ]
          ]
        }
      };

      this.bot.sendMessage(chatId, keyMessage, { 
        ...keyboard,
        parse_mode: 'Markdown'
      });

    } catch (error) {
      console.error('Error generating trial key:', error);
      this.bot.sendMessage(chatId, '❌ Ошибка генерации ключа. Попробуйте позже.');
    }
  }

  async handleInstructions(chatId) {
    const instructionsMessage = `
📖 Инструкция по подключению VLESS VPN

📱 Для Android:
1. Скачайте приложение "v2rayNG" из Google Play
2. Откройте приложение и нажмите "+"
3. Выберите "Сканировать QR-код" или "Ввести вручную"
4. Вставьте ваш ключ VLESS
5. Нажмите "Подключить"

💻 Для Windows:
1. Скачайте "v2rayN" с GitHub
2. Запустите программу
3. Нажмите "Сервер" → "Добавить сервер"
4. Вставьте ваш ключ VLESS
5. Нажмите "Подключить"

🍎 Для iOS:
1. Скачайте "Shadowrocket" из App Store
2. Откройте приложение
3. Нажмите "+" → "Тип: VLESS"
4. Вставьте ваш ключ VLESS
5. Нажмите "Подключить"

🔧 Настройки:
• Шифрование: none
• Сеть: WebSocket
• TLS: включен
• SNI: ваш домен сервера

❓ Проблемы?
Обратитесь в поддержку: @vless_support
`;

    const keyboard = {
      reply_markup: {
        inline_keyboard: [
          [
            { text: '📱 Скачать приложения', url: 'https://github.com/v2ray/v2ray-core/releases' }
          ],
          [
            { text: '🔙 Назад', callback_data: 'back_to_main' }
          ]
        ]
      }
    };

    this.bot.sendMessage(chatId, instructionsMessage, keyboard);
  }

  async handleReferral(chatId) {
    const referralMessage = `
👥 Реферальная программа VLESS VPN Premium

💰 Зарабатывайте на приглашениях!

🎯 Как это работает:
• Приглашайте друзей по вашей ссылке
• За каждого друга получаете 7 дней VPN бесплатно
• За каждый платеж друга получаете 20% от суммы
• Деньги можно выводить на карту или тратить на VPN

📊 Примеры заработка:
• 10 приглашений = 70 дней VPN бесплатно
• Друг купил Premium (450₽) = вы получаете 90₽
• Друг купил Pro (590₽) = вы получаете 118₽

🔗 Ваша реферальная ссылка:
https://t.me/vless_vpn_shop_bot?start=ref_${chatId}

📈 Статистика:
• Приглашено: 0 человек
• Заработано: 0₽
• Бесплатных дней: 0

💡 Совет: Делитесь ссылкой в социальных сетях и мессенджерах!
`;

    const keyboard = {
      reply_markup: {
        inline_keyboard: [
          [
            { text: '📤 Поделиться ссылкой', url: `https://t.me/share/url?url=https://t.me/vless_vpn_shop_bot?start=ref_${chatId}&text=🚀%20Попробуй%20VLESS%20VPN%20Premium!` }
          ],
          [
            { text: '🔙 Назад', callback_data: 'back_to_main' }
          ]
        ]
      }
    };

    this.bot.sendMessage(chatId, referralMessage, keyboard);
  }

  async handlePurchase(chatId, plan) {
    const planNames = {
      'buy_premium': 'Premium (2 месяца)',
      'buy_pro': 'Pro (3 месяца)'
    };

    const planPrices = {
      'buy_premium': 450,
      'buy_pro': 590
    };

    const planName = planNames[plan];
    const price = planPrices[plan];

    const purchaseMessage = `
💳 Покупка тарифа "${planName}"

💰 Стоимость: ${price} ₽

💳 Способы оплаты:
• Банковские карты РФ
• СБП (Система быстрых платежей)
• Криптовалюта (Bitcoin, Ethereum)
• Telegram Stars

🔄 После оплаты:
• Ключ будет отправлен автоматически
• Подписка активируется на ${planName.includes('2') ? '2' : '3'} месяца
• Доступ ко всем серверам
• Техническая поддержка 24/7

📞 Нужна помощь с оплатой?
Обратитесь в поддержку: @vless_support
`;

    const keyboard = {
      reply_markup: {
        inline_keyboard: [
          [
            { text: '💳 Оплатить картой', callback_data: `pay_card_${plan}` },
            { text: '📱 Оплатить СБП', callback_data: `pay_sbp_${plan}` }
          ],
          [
            { text: '₿ Оплатить криптовалютой', callback_data: `pay_crypto_${plan}` },
            { text: '⭐ Telegram Stars', callback_data: `pay_stars_${plan}` }
          ],
          [
            { text: '🔙 Назад к тарифам', callback_data: 'pricing' }
          ]
        ]
      }
    };

    this.bot.sendMessage(chatId, purchaseMessage, keyboard);
  }

  async handleHelp(msg) {
    const chatId = msg.chat.id;

    const helpMessage = `
🆘 Помощь по использованию бота

📋 Основные команды:
/start - Главное меню
/trial - Получить пробный ключ
/pricing - Посмотреть тарифы
/support - Техническая поддержка
/help - Эта справка

🔧 Частые вопросы:

❓ Как получить пробный ключ?
• Нажмите /trial или кнопку "Получить пробный ключ"
• Выберите категорию использования
• Получите ключ на 24 часа

❓ Как купить подписку?
• Нажмите /pricing или кнопку "Тарифы"
• Выберите подходящий план
• Оплатите любым удобным способом

❓ VPN не работает?
• Проверьте правильность ключа
• Убедитесь в активной подписке
• Попробуйте другой сервер
• Обратитесь в поддержку

📞 Поддержка: @vless_support
🌐 Сайт: https://vless-vpn.org
`;

    this.bot.sendMessage(chatId, helpMessage);
  }
}

// Start the bot
const bot = new VlessVpnBot();

console.log('🤖 VLESS VPN Premium Bot started successfully!');

module.exports = VlessVpnBot;
