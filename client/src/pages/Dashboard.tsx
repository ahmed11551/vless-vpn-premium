import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { 
  ShieldCheckIcon, 
  KeyIcon, 
  ChartBarIcon,
  CreditCardIcon,
  UserGroupIcon,
  CogIcon
} from '@heroicons/react/24/outline';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  const stats = [
    {
      name: 'Активные ключи',
      value: '0',
      icon: KeyIcon,
      color: 'text-blue-600'
    },
    {
      name: 'Использовано трафика',
      value: '0 GB',
      icon: ChartBarIcon,
      color: 'text-green-600'
    },
    {
      name: 'Дней до истечения',
      value: '0',
      icon: ShieldCheckIcon,
      color: 'text-purple-600'
    },
    {
      name: 'Рефералов',
      value: '0',
      icon: UserGroupIcon,
      color: 'text-orange-600'
    }
  ];

  const quickActions = [
    {
      name: 'Создать ключ',
      description: 'Сгенерировать новый VPN ключ',
      icon: KeyIcon,
      href: '#',
      color: 'bg-blue-500'
    },
    {
      name: 'Пополнить баланс',
      description: 'Продлить подписку',
      icon: CreditCardIcon,
      href: '#',
      color: 'bg-green-500'
    },
    {
      name: 'Настройки',
      description: 'Управление аккаунтом',
      icon: CogIcon,
      href: '#',
      color: 'bg-gray-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900">
            Добро пожаловать, {user?.email}!
          </h1>
          <p className="mt-2 text-gray-600">
            Управляйте своими VPN ключами и подпиской
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {stats.map((stat, index) => (
            <div key={stat.name} className="card">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                  <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Быстрые действия</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quickActions.map((action, index) => (
              <motion.a
                key={action.name}
                href={action.href}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 + index * 0.1 }}
                className="card hover:shadow-lg transition-shadow cursor-pointer"
              >
                <div className="flex items-center">
                  <div className={`flex-shrink-0 w-12 h-12 ${action.color} rounded-lg flex items-center justify-center`}>
                    <action.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">{action.name}</h3>
                    <p className="text-sm text-gray-500">{action.description}</p>
                  </div>
                </div>
              </motion.a>
            ))}
          </div>
        </motion.div>

        {/* VPN Keys Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="card"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">VPN ключи</h2>
            <button className="btn-primary">
              Создать ключ
            </button>
          </div>

          <div className="text-center py-12">
            <KeyIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Нет активных ключей</h3>
            <p className="text-gray-500 mb-4">
              Создайте свой первый VPN ключ для начала использования сервиса
            </p>
            <button className="btn-primary">
              Создать первый ключ
            </button>
          </div>
        </motion.div>

        {/* Subscription Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-8"
        >
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Статус подписки</h2>
            {user?.subscriptionActive ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center">
                  <ShieldCheckIcon className="h-6 w-6 text-green-600 mr-2" />
                  <div>
                    <h3 className="text-lg font-medium text-green-900">Подписка активна</h3>
                    <p className="text-green-700">
                      Действует до: {user.subscriptionExpiresAt ? new Date(user.subscriptionExpiresAt).toLocaleDateString() : 'Не указано'}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center">
                  <ShieldCheckIcon className="h-6 w-6 text-yellow-600 mr-2" />
                  <div>
                    <h3 className="text-lg font-medium text-yellow-900">Подписка неактивна</h3>
                    <p className="text-yellow-700 mb-4">
                      Для использования VPN необходимо активировать подписку
                    </p>
                    <a href="/pricing" className="btn-primary">
                      Выбрать тариф
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
