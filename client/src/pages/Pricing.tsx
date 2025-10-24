import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircleIcon } from '@heroicons/react/24/outline';

const Pricing: React.FC = () => {
  const plans = [
    {
      id: 'basic',
      name: 'Basic',
      price: 300,
      currency: 'RUB',
      duration: 1,
      features: [
        '1 VPN ключ',
        'Доступ к базовым серверам',
        'Техническая поддержка',
        'Безлимитный трафик'
      ],
      popular: false
    },
    {
      id: 'premium',
      name: 'Premium',
      price: 450,
      currency: 'RUB',
      duration: 2,
      features: [
        '3 VPN ключа',
        'Доступ ко всем серверам',
        'Приоритетная поддержка',
        'Безлимитный трафик',
        'Статистика использования'
      ],
      popular: true
    },
    {
      id: 'pro',
      name: 'Pro',
      price: 590,
      currency: 'RUB',
      duration: 3,
      features: [
        '5 VPN ключей',
        'Доступ ко всем серверам',
        'VIP поддержка',
        'Безлимитный трафик',
        'Детальная аналитика',
        'Приоритетное подключение'
      ],
      popular: false
    }
  ];

  const paymentMethods = [
    { name: 'Банковские карты РФ', icon: '💳' },
    { name: 'СБП', icon: '📱' },
    { name: 'Криптовалюта', icon: '₿' },
    { name: 'Telegram Stars', icon: '⭐' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Тарифы VLESS VPN Premium
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Выберите подходящий план для ваших потребностей. Все тарифы включают 
            безлимитный трафик и техническую поддержку.
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className={`card relative ${plan.popular ? 'border-2 border-blue-500 shadow-lg' : ''}`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Популярный
                  </span>
                </div>
              )}
              
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <div className="text-4xl font-bold text-blue-600 mb-2">
                  {plan.price}₽
                  <span className="text-lg text-gray-500">/{plan.duration} мес</span>
                </div>
                <p className="text-gray-600">
                  {plan.price / plan.duration}₽ в месяц
                </p>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center">
                    <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <button className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                plan.popular 
                  ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
              }`}>
                Выбрать план
              </button>
            </motion.div>
          ))}
        </div>

        {/* Payment Methods */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="card mb-16"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Способы оплаты
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {paymentMethods.map((method, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl mb-2">{method.icon}</div>
                <p className="text-gray-700 font-medium">{method.name}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="card"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Часто задаваемые вопросы
          </h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Можно ли отменить подписку?
              </h3>
              <p className="text-gray-600">
                Да, вы можете отменить подписку в любое время. Подписка будет действовать 
                до конца оплаченного периода.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Работает ли VPN на всех устройствах?
              </h3>
              <p className="text-gray-600">
                Да, VLESS VPN работает на всех популярных платформах: Windows, macOS, 
                Linux, Android, iOS и других.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Есть ли пробный период?
              </h3>
              <p className="text-gray-600">
                Да, вы можете получить пробный ключ на 24 часа через нашего Telegram бота 
                или зарегистрировавшись на сайте.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Как быстро активируется подписка?
              </h3>
              <p className="text-gray-600">
                Подписка активируется автоматически после успешной оплаты. Обычно это 
                занимает несколько минут.
              </p>
            </div>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center mt-16"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Готовы начать?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Присоединяйтесь к тысячам пользователей VLESS VPN Premium
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="https://t.me/vless_vpn_shop_bot" 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn-primary text-lg px-8 py-3"
            >
              Получить пробный ключ
            </a>
            <button className="btn-secondary text-lg px-8 py-3">
              Зарегистрироваться
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Pricing;
