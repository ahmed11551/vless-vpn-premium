import axios from 'axios';
import crypto from 'crypto';

class PaymentService {
  constructor(config) {
    this.apiUrl = config.apiUrl;
    this.yookassaShopId = config.yookassaShopId;
    this.yookassaSecretKey = config.yookassaSecretKey;
  }

  // Создание платежа через YooKassa
  async createYooKassaPayment(amount, description, userId) {
    try {
      const paymentData = {
        amount: {
          value: amount.toFixed(2),
          currency: 'RUB'
        },
        confirmation: {
          type: 'redirect',
          return_url: `${process.env.WEBSITE_URL}/payment/success`
        },
        description: description,
        metadata: {
          userId: userId,
          source: 'telegram_bot'
        }
      };

      const response = await axios.post(
        'https://api.yookassa.ru/v3/payments',
        paymentData,
        {
          headers: {
            'Authorization': `Basic ${Buffer.from(`${this.yookassaShopId}:${this.yookassaSecretKey}`).toString('base64')}`,
            'Content-Type': 'application/json',
            'Idempotence-Key': crypto.randomUUID()
          }
        }
      );

      return {
        id: response.data.id,
        status: response.data.status,
        paymentUrl: response.data.confirmation.confirmation_url,
        amount: response.data.amount.value,
        currency: response.data.amount.currency
      };
    } catch (error) {
      console.error('YooKassa payment creation error:', error);
      throw new Error('Ошибка создания платежа');
    }
  }

  // Проверка статуса платежа
  async checkPaymentStatus(paymentId) {
    try {
      const response = await axios.get(
        `https://api.yookassa.ru/v3/payments/${paymentId}`,
        {
          headers: {
            'Authorization': `Basic ${Buffer.from(`${this.yookassaShopId}:${this.yookassaSecretKey}`).toString('base64')}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return {
        id: response.data.id,
        status: response.data.status,
        amount: response.data.amount.value,
        currency: response.data.amount.currency,
        metadata: response.data.metadata
      };
    } catch (error) {
      console.error('Payment status check error:', error);
      throw new Error('Ошибка проверки платежа');
    }
  }

  // Создание платежа через Stripe
  async createStripePayment(amount, description, userId) {
    try {
      const response = await axios.post(
        `${this.apiUrl}/payments/stripe`,
        {
          amount: amount * 100, // Stripe использует копейки
          currency: 'rub',
          description: description,
          userId: userId,
          source: 'telegram_bot'
        }
      );

      return response.data;
    } catch (error) {
      console.error('Stripe payment creation error:', error);
      throw new Error('Ошибка создания платежа');
    }
  }

  // Генерация QR-кода для СБП
  generateSBPQR(amount, description, paymentId) {
    const qrData = {
      version: '01',
      encoding: 'UTF-8',
      type: '00',
      account: process.env.SBP_ACCOUNT || 'your_sbp_account',
      amount: amount.toFixed(2),
      currency: '643', // RUB
      purpose: description,
      paymentId: paymentId
    };

    // В реальном проекте здесь будет генерация QR-кода
    return {
      qrData: JSON.stringify(qrData),
      qrImage: `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(JSON.stringify(qrData))}`
    };
  }

  // Генерация адреса для криптоплатежей
  generateCryptoAddress(amount, currency, userId) {
    const addresses = {
      btc: process.env.BTC_ADDRESS || '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
      eth: process.env.ETH_ADDRESS || '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
      usdt: process.env.USDT_ADDRESS || '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6'
    };

    return {
      address: addresses[currency.toLowerCase()],
      amount: amount,
      currency: currency.toUpperCase(),
      memo: `VLESS-${userId}-${Date.now()}`
    };
  }

  // Обработка webhook от платежной системы
  async handleWebhook(payload, signature) {
    try {
      // Проверка подписи webhook
      const expectedSignature = crypto
        .createHmac('sha256', this.yookassaSecretKey)
        .update(JSON.stringify(payload))
        .digest('hex');

      if (signature !== expectedSignature) {
        throw new Error('Invalid webhook signature');
      }

      const event = payload.event;
      const payment = payload.object;

      switch (event) {
        case 'payment.succeeded':
          await this.handleSuccessfulPayment(payment);
          break;
        case 'payment.canceled':
          await this.handleCanceledPayment(payment);
          break;
        default:
          console.log(`Unhandled webhook event: ${event}`);
      }

      return { success: true };
    } catch (error) {
      console.error('Webhook handling error:', error);
      throw error;
    }
  }

  // Обработка успешного платежа
  async handleSuccessfulPayment(payment) {
    try {
      const userId = payment.metadata.userId;
      const plan = payment.metadata.plan;

      // Создаем VPN ключ для пользователя
      await axios.post(`${this.apiUrl}/vpn/keys`, {
        userId: userId,
        plan: plan,
        source: 'telegram_bot',
        paymentId: payment.id
      });

      // Уведомляем пользователя
      await this.notifyUser(userId, 'payment_success', {
        paymentId: payment.id,
        amount: payment.amount.value,
        plan: plan
      });

      console.log(`Payment ${payment.id} processed successfully for user ${userId}`);
    } catch (error) {
      console.error('Error handling successful payment:', error);
    }
  }

  // Обработка отмененного платежа
  async handleCanceledPayment(payment) {
    try {
      const userId = payment.metadata.userId;

      // Уведомляем пользователя
      await this.notifyUser(userId, 'payment_canceled', {
        paymentId: payment.id,
        amount: payment.amount.value
      });

      console.log(`Payment ${payment.id} was canceled for user ${userId}`);
    } catch (error) {
      console.error('Error handling canceled payment:', error);
    }
  }

  // Уведомление пользователя
  async notifyUser(userId, type, data) {
    try {
      // Здесь будет логика отправки уведомлений пользователю
      // через Telegram API или внутренний API
      console.log(`Notifying user ${userId} about ${type}:`, data);
    } catch (error) {
      console.error('Error notifying user:', error);
    }
  }
}

export default PaymentService;
