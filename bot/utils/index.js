import moment from 'moment';
import crypto from 'crypto';

// Утилиты для форматирования
export const formatters = {
  // Форматирование даты
  formatDate(date, format = 'DD.MM.YYYY HH:mm') {
    return moment(date).format(format);
  },

  // Форматирование цены
  formatPrice(price, currency = '₽') {
    return `${price} ${currency}`;
  },

  // Форматирование размера данных
  formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  },

  // Форматирование времени
  formatDuration(seconds) {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (days > 0) {
      return `${days}д ${hours}ч ${minutes}м`;
    } else if (hours > 0) {
      return `${hours}ч ${minutes}м`;
    } else {
      return `${minutes}м`;
    }
  }
};

// Утилиты для валидации
export const validators = {
  // Проверка Telegram ID
  isValidTelegramId(id) {
    return /^\d+$/.test(id) && parseInt(id) > 0;
  },

  // Проверка email
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  // Проверка UUID
  isValidUUID(uuid) {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  },

  // Проверка суммы платежа
  isValidAmount(amount) {
    return typeof amount === 'number' && amount > 0 && amount <= 1000000;
  }
};

// Утилиты для работы с текстом
export const textUtils = {
  // Экранирование Markdown
  escapeMarkdown(text) {
    return text.replace(/[_*[\]()~`>#+=|{}.!-]/g, '\\$&');
  },

  // Обрезка текста
  truncateText(text, maxLength = 100) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength - 3) + '...';
  },

  // Форматирование имени пользователя
  formatUserName(user) {
    if (user.first_name && user.last_name) {
      return `${user.first_name} ${user.last_name}`;
    } else if (user.first_name) {
      return user.first_name;
    } else if (user.username) {
      return `@${user.username}`;
    } else {
      return 'Пользователь';
    }
  },

  // Генерация случайного текста
  generateRandomText(length = 8) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }
};

// Утилиты для работы с временем
export const timeUtils = {
  // Получение текущего времени
  getCurrentTime() {
    return new Date();
  },

  // Добавление времени
  addTime(date, amount, unit = 'days') {
    return moment(date).add(amount, unit).toDate();
  },

  // Проверка истечения
  isExpired(date) {
    return new Date(date) < new Date();
  },

  // Получение времени до истечения
  getTimeUntilExpiry(date) {
    const now = moment();
    const expiry = moment(date);
    const diff = expiry.diff(now);
    
    if (diff <= 0) {
      return 'Истек';
    }
    
    const duration = moment.duration(diff);
    const days = Math.floor(duration.asDays());
    const hours = duration.hours();
    const minutes = duration.minutes();
    
    if (days > 0) {
      return `${days}д ${hours}ч`;
    } else if (hours > 0) {
      return `${hours}ч ${minutes}м`;
    } else {
      return `${minutes}м`;
    }
  }
};

// Утилиты для работы с кэшем
export const cacheUtils = {
  // Простой кэш в памяти
  cache: new Map(),
  
  // Установка значения
  set(key, value, ttl = 3600000) { // TTL по умолчанию 1 час
    const expiry = Date.now() + ttl;
    this.cache.set(key, { value, expiry });
  },
  
  // Получение значения
  get(key) {
    const item = this.cache.get(key);
    if (!item) return null;
    
    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }
    
    return item.value;
  },
  
  // Удаление значения
  delete(key) {
    return this.cache.delete(key);
  },
  
  // Очистка истекших значений
  cleanup() {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now > item.expiry) {
        this.cache.delete(key);
      }
    }
  }
};

// Утилиты для логирования
export const logger = {
  // Логирование с уровнем
  log(level, message, data = null) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] [${level.toUpperCase()}] ${message}`;
    
    console.log(logMessage);
    if (data) {
      console.log(JSON.stringify(data, null, 2));
    }
  },
  
  // Различные уровни логирования
  info(message, data) {
    this.log('info', message, data);
  },
  
  warn(message, data) {
    this.log('warn', message, data);
  },
  
  error(message, data) {
    this.log('error', message, data);
  },
  
  debug(message, data) {
    this.log('debug', message, data);
  }
};

// Утилиты для работы с ошибками
export const errorUtils = {
  // Обработка ошибок API
  handleApiError(error) {
    if (error.response) {
      // Сервер ответил с кодом ошибки
      return {
        message: error.response.data?.message || 'Ошибка сервера',
        status: error.response.status,
        data: error.response.data
      };
    } else if (error.request) {
      // Запрос был отправлен, но ответа не получено
      return {
        message: 'Нет ответа от сервера',
        status: 0,
        data: null
      };
    } else {
      // Ошибка при настройке запроса
      return {
        message: error.message || 'Неизвестная ошибка',
        status: -1,
        data: null
      };
    }
  },
  
  // Создание пользовательской ошибки
  createError(message, code = 'UNKNOWN_ERROR') {
    const error = new Error(message);
    error.code = code;
    return error;
  }
};

// Утилиты для работы с конфигурацией
export const configUtils = {
  // Получение переменной окружения с значением по умолчанию
  getEnv(key, defaultValue = null) {
    return process.env[key] || defaultValue;
  },
  
  // Проверка обязательных переменных окружения
  validateRequiredEnv(requiredKeys) {
    const missing = [];
    
    for (const key of requiredKeys) {
      if (!process.env[key]) {
        missing.push(key);
      }
    }
    
    if (missing.length > 0) {
      throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
    }
  }
};

// Утилиты для работы с безопасностью
export const securityUtils = {
  // Генерация случайного токена
  generateToken(length = 32) {
    return crypto.randomBytes(length).toString('hex');
  },
  
  // Хеширование пароля
  hashPassword(password, salt = null) {
    if (!salt) {
      salt = crypto.randomBytes(16).toString('hex');
    }
    
    const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512');
    return {
      hash: hash.toString('hex'),
      salt: salt
    };
  },
  
  // Проверка пароля
  verifyPassword(password, hash, salt) {
    const newHash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512');
    return newHash.toString('hex') === hash;
  },
  
  // Создание HMAC подписи
  createSignature(data, secret) {
    return crypto.createHmac('sha256', secret).update(data).digest('hex');
  },
  
  // Проверка HMAC подписи
  verifySignature(data, signature, secret) {
    const expectedSignature = this.createSignature(data, secret);
    return crypto.timingSafeEqual(
      Buffer.from(signature, 'hex'),
      Buffer.from(expectedSignature, 'hex')
    );
  }
};

export default {
  formatters,
  validators,
  textUtils,
  timeUtils,
  cacheUtils,
  logger,
  errorUtils,
  configUtils,
  securityUtils
};
