import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ShieldCheckIcon, 
  BoltIcon, 
  GlobeAltIcon, 
  DevicePhoneMobileIcon,
  CheckCircleIcon,
  StarIcon
} from '@heroicons/react/24/outline';

const Home: React.FC = () => {
  const features = [
    {
      icon: ShieldCheckIcon,
      title: 'Максимальная безопасность',
      description: 'Современное шифрование и защита ваших данных'
    },
    {
      icon: BoltIcon,
      title: 'Быстрая работа',
      description: 'Оптимизированные серверы по всему миру'
    },
    {
      icon: GlobeAltIcon,
      title: 'Глобальный доступ',
      description: 'Доступ к контенту из любой точки мира'
    },
    {
      icon: DevicePhoneMobileIcon,
      title: 'Кроссплатформенность',
      description: 'Работает на всех устройствах и платформах'
    }
  ];

  const locations = [
    { name: 'Нидерланды', flag: '🇳🇱', city: 'Амстердам' },
    { name: 'Германия', flag: '🇩🇪', city: 'Франкфурт' },
    { name: 'Франция', flag: '🇫🇷', city: 'Париж' },
    { name: 'США', flag: '🇺🇸', city: 'Нью-Йорк' },
    { name: 'Россия', flag: '🇷🇺', city: 'Москва' },
    { name: 'Казахстан', flag: '🇰🇿', city: 'Алматы' }
  ];

  const testimonials = [
    {
      name: 'Алексей М.',
      text: 'Отличный VPN! Быстро работает, стабильное соединение. Рекомендую!',
      rating: 5
    },
    {
      name: 'Мария К.',
      text: 'Пользуюсь уже полгода. Никаких проблем, отличная поддержка.',
      rating: 5
    },
    {
      name: 'Дмитрий С.',
      text: 'Лучший VPN из всех, что пробовал. Цена соответствует качеству.',
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="gradient-bg text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              VLESS VPN Premium
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Быстрый, защищенный VPN для любых задач
            </p>
            <p className="text-lg mb-12 text-blue-200 max-w-3xl mx-auto">
              Получите доступ к интернету без ограничений. Работает на всех устройствах, 
              поддерживает все популярные платформы и сервисы.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register" className="btn-primary bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-3">
                Начать бесплатно
              </Link>
              <a 
                href="https://t.me/vless_vpn_shop_bot" 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn-secondary bg-blue-500 hover:bg-blue-600 text-white text-lg px-8 py-3"
              >
                Telegram бот
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Почему выбирают нас?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Мы предоставляем лучший VPN сервис с современными технологиями и отличной поддержкой
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="card text-center hover:shadow-lg transition-shadow"
              >
                <feature.icon className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Простые и доступные тарифы
            </h2>
            <p className="text-xl text-gray-600">
              Выберите подходящий план для ваших потребностей
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="card"
            >
              <h3 className="text-2xl font-bold mb-2">Basic</h3>
              <div className="text-4xl font-bold text-blue-600 mb-4">300₽<span className="text-lg text-gray-500">/мес</span></div>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center">
                  <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                  1 VPN ключ
                </li>
                <li className="flex items-center">
                  <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                  Базовые серверы
                </li>
                <li className="flex items-center">
                  <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                  Техподдержка
                </li>
                <li className="flex items-center">
                  <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                  Безлимитный трафик
                </li>
              </ul>
              <Link to="/pricing" className="btn-secondary w-full text-center">
                Выбрать план
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="card border-2 border-blue-500 relative"
            >
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                  Популярный
                </span>
              </div>
              <h3 className="text-2xl font-bold mb-2">Premium</h3>
              <div className="text-4xl font-bold text-blue-600 mb-4">450₽<span className="text-lg text-gray-500">/2 мес</span></div>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center">
                  <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                  3 VPN ключа
                </li>
                <li className="flex items-center">
                  <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                  Все серверы
                </li>
                <li className="flex items-center">
                  <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                  Приоритетная поддержка
                </li>
                <li className="flex items-center">
                  <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                  Статистика использования
                </li>
              </ul>
              <Link to="/pricing" className="btn-primary w-full text-center">
                Выбрать план
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="card"
            >
              <h3 className="text-2xl font-bold mb-2">Pro</h3>
              <div className="text-4xl font-bold text-blue-600 mb-4">590₽<span className="text-lg text-gray-500">/3 мес</span></div>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center">
                  <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                  5 VPN ключей
                </li>
                <li className="flex items-center">
                  <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                  Все серверы
                </li>
                <li className="flex items-center">
                  <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                  VIP поддержка
                </li>
                <li className="flex items-center">
                  <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                  Детальная аналитика
                </li>
              </ul>
              <Link to="/pricing" className="btn-secondary w-full text-center">
                Выбрать план
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Server Locations */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Доступные локации
            </h2>
            <p className="text-xl text-gray-600">
              Серверы по всему миру для максимальной скорости
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {locations.map((location, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="card text-center hover:shadow-lg transition-shadow"
              >
                <div className="text-3xl mb-2">{location.flag}</div>
                <h3 className="font-semibold">{location.name}</h3>
                <p className="text-sm text-gray-600">{location.city}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Отзывы наших клиентов
            </h2>
            <p className="text-xl text-gray-600">
              Более 10,000 довольных пользователей по всему миру
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="card"
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <StarIcon key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">"{testimonial.text}"</p>
                <p className="font-semibold">{testimonial.name}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 gradient-bg text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Готовы начать?
            </h2>
            <p className="text-xl mb-8 text-blue-100">
              Присоединяйтесь к тысячам пользователей, которые уже наслаждаются свободой интернета
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register" className="btn-primary bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-3">
                Начать бесплатно
              </Link>
              <a 
                href="https://t.me/vless_vpn_shop_bot" 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn-secondary bg-blue-500 hover:bg-blue-600 text-white text-lg px-8 py-3"
              >
                Получить пробный ключ
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
