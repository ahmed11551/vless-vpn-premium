import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';

class VpnService {
  constructor(config) {
    this.apiUrl = config.apiUrl;
  }

  // Генерация VLESS ключа
  generateVlessKey() {
    const uuid = uuidv4();
    const key = crypto.randomBytes(32).toString('base64');
    
    return {
      uuid: uuid,
      key: key,
      fullKey: `${uuid}@server.com:443?encryption=none&security=tls&sni=server.com&type=ws&host=server.com&path=/vless#${key}`
    };
  }

  // Создание VPN ключа для пользователя
  async createVpnKey(userId, plan, source = 'telegram_bot') {
    try {
      const vlessData = this.generateVlessKey();
      
      const keyData = {
        userId: userId,
        plan: plan,
        key: vlessData.uuid,
        encryptionKey: vlessData.key,
        fullConfig: vlessData.fullKey,
        source: source,
        expiresAt: this.calculateExpirationDate(plan),
        isActive: true
      };

      const response = await axios.post(`${this.apiUrl}/vpn/keys`, keyData);
      
      return {
        id: response.data.id,
        key: response.data.key,
        fullConfig: response.data.fullConfig,
        plan: response.data.plan,
        expiresAt: response.data.expiresAt,
        createdAt: response.data.createdAt
      };
    } catch (error) {
      console.error('Error creating VPN key:', error);
      throw new Error('Ошибка создания VPN ключа');
    }
  }

  // Получение ключей пользователя
  async getUserKeys(userId) {
    try {
      const response = await axios.get(`${this.apiUrl}/vpn/keys/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error getting user keys:', error);
      return [];
    }
  }

  // Получение активных ключей пользователя
  async getActiveUserKeys(userId) {
    try {
      const keys = await this.getUserKeys(userId);
      return keys.filter(key => key.isActive && new Date(key.expiresAt) > new Date());
    } catch (error) {
      console.error('Error getting active user keys:', error);
      return [];
    }
  }

  // Продление ключа
  async extendKey(keyId, days) {
    try {
      const response = await axios.patch(`${this.apiUrl}/vpn/keys/${keyId}/extend`, {
        days: days
      });
      
      return response.data;
    } catch (error) {
      console.error('Error extending key:', error);
      throw new Error('Ошибка продления ключа');
    }
  }

  // Деактивация ключа
  async deactivateKey(keyId) {
    try {
      const response = await axios.patch(`${this.apiUrl}/vpn/keys/${keyId}`, {
        isActive: false
      });
      
      return response.data;
    } catch (error) {
      console.error('Error deactivating key:', error);
      throw new Error('Ошибка деактивации ключа');
    }
  }

  // Получение статистики использования ключа
  async getKeyStats(keyId) {
    try {
      const response = await axios.get(`${this.apiUrl}/vpn/keys/${keyId}/stats`);
      return response.data;
    } catch (error) {
      console.error('Error getting key stats:', error);
      return null;
    }
  }

  // Генерация конфигурационных файлов
  generateConfigFiles(vlessKey) {
    const configs = {
      // VLESS конфигурация для различных клиентов
      vless: {
        protocol: 'vless',
        uuid: vlessKey.uuid,
        encryption: 'none',
        server: 'server.com',
        port: 443,
        security: 'tls',
        sni: 'server.com',
        type: 'ws',
        host: 'server.com',
        path: '/vless',
        remark: 'VLESS VPN Premium'
      },
      
      // Конфигурация для v2rayN
      v2rayN: {
        v: '2',
        ps: 'VLESS VPN Premium',
        add: 'server.com',
        port: '443',
        id: vlessKey.uuid,
        aid: '0',
        scy: 'none',
        net: 'ws',
        type: 'none',
        host: 'server.com',
        path: '/vless',
        tls: 'tls',
        sni: 'server.com',
        alpn: '',
        fp: ''
      },
      
      // Конфигурация для Clash
      clash: {
        name: 'VLESS VPN Premium',
        type: 'vless',
        server: 'server.com',
        port: 443,
        uuid: vlessKey.uuid,
        cipher: 'none',
        network: 'ws',
        ws-opts: {
          path: '/vless',
          headers: {
            Host: 'server.com'
          }
        },
        tls: true,
        servername: 'server.com'
      }
    };

    return configs;
  }

  // Расчет даты истечения
  calculateExpirationDate(plan) {
    const planDurations = {
      basic: 30,
      premium: 30,
      pro: 30,
      trial: 7
    };

    const days = planDurations[plan] || 30;
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + days);
    
    return expirationDate;
  }

  // Проверка валидности ключа
  isValidKey(key) {
    try {
      // Проверяем формат UUID
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      return uuidRegex.test(key);
    } catch (error) {
      return false;
    }
  }

  // Форматирование конфигурации для отправки
  formatConfigForTelegram(config, clientType) {
    let formattedConfig = '';

    switch (clientType) {
      case 'vless':
        formattedConfig = `vless://${config.uuid}@${config.server}:${config.port}?encryption=${config.encryption}&security=${config.security}&sni=${config.sni}&type=${config.type}&host=${config.host}&path=${config.path}#${config.remark}`;
        break;
        
      case 'v2rayN':
        formattedConfig = `vmess://${Buffer.from(JSON.stringify(config)).toString('base64')}`;
        break;
        
      case 'clash':
        formattedConfig = `clash://${Buffer.from(JSON.stringify(config)).toString('base64')}`;
        break;
        
      default:
        formattedConfig = JSON.stringify(config, null, 2);
    }

    return formattedConfig;
  }

  // Получение инструкций по настройке
  getSetupInstructions(clientType) {
    const instructions = {
      vless: `
📱 Настройка VLESS клиента:

1. Скачайте VLESS клиент (v2rayN, Clash, etc.)
2. Добавьте новый сервер
3. Вставьте конфигурационную ссылку
4. Сохраните и подключитесь

🔗 Конфигурация:
      `,
      
      v2rayN: `
📱 Настройка v2rayN:

1. Скачайте v2rayN с GitHub
2. Откройте программу
3. Нажмите "+" → "Из буфера обмена"
4. Вставьте конфигурацию
5. Подключитесь к серверу

🔗 Конфигурация:
      `,
      
      clash: `
📱 Настройка Clash:

1. Скачайте Clash for Windows/Android
2. Откройте настройки
3. Перейдите в "Profiles"
4. Нажмите "Import" → "From URL"
5. Вставьте ссылку на конфигурацию

🔗 Конфигурация:
      `
    };

    return instructions[clientType] || instructions.vless;
  }
}

export default VpnService;
