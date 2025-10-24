import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authService = {
  async login(email: string, password: string) {
    const response = await api.post('/auth/login', { email, password });
    return response.data.data;
  },

  async register(email: string, password: string, telegramId?: string, referralCode?: string) {
    const response = await api.post('/auth/register', { 
      email, 
      password, 
      telegramId, 
      referralCode 
    });
    return response.data.data;
  },

  async getProfile() {
    const response = await api.get('/auth/profile');
    return response.data.data.user;
  },

  async linkTelegram(telegramId: string) {
    const response = await api.post('/auth/link-telegram', { telegramId });
    return response.data.data;
  }
};

export const vpnService = {
  async generateKey(serverLocation: string, plan: string) {
    const response = await api.post('/vpn/generate-key', { serverLocation, plan });
    return response.data.data;
  },

  async getUserKeys() {
    const response = await api.get('/vpn/keys');
    return response.data.data.keys;
  },

  async getKeyDetails(keyId: string) {
    const response = await api.get(`/vpn/keys/${keyId}`);
    return response.data.data;
  },

  async deactivateKey(keyId: string) {
    const response = await api.put(`/vpn/keys/${keyId}/deactivate`);
    return response.data.data;
  },

  async getServerLocations() {
    const response = await api.get('/vpn/locations');
    return response.data.data.locations;
  },

  async getConfig(key: string) {
    const response = await api.get(`/vpn/config/${key}`);
    return response.data.data.config;
  }
};

export const paymentService = {
  async getPlans() {
    const response = await api.get('/payments/plans');
    return response.data.data.plans;
  },

  async createPaymentIntent(amount: number, currency: string, plan: string) {
    const response = await api.post('/payments/create-payment-intent', {
      amount,
      currency,
      plan
    });
    return response.data.data;
  },

  async confirmPayment(paymentIntentId: string, userId: string) {
    const response = await api.post('/payments/success', {
      paymentIntentId,
      userId
    });
    return response.data.data;
  }
};

export const userService = {
  async getProfile() {
    const response = await api.get('/users/profile');
    return response.data.data.user;
  },

  async updateProfile(email?: string) {
    const response = await api.put('/users/profile', { email });
    return response.data.data.user;
  },

  async getReferralStats() {
    const response = await api.get('/users/referrals');
    return response.data.data;
  }
};

export default api;
