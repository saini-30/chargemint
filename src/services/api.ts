import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Configure axios defaults
axios.defaults.baseURL = API_URL;

// Add a request interceptor to include the token
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await axios.post('/auth/login', { email, password });
    return response.data;
  },

  adminLogin: async (email: string, password: string) => {
    const response = await axios.post('/auth/admin/login', { email, password });
    return response.data;
  },

  register: async (userData: {
    name: string;
    email: string;
    password: string;
    phone: string;
    referralCode?: string;
  }) => {
    const response = await axios.post('/auth/register', userData);
    return response.data;
  },

  verifyToken: async () => {
    const response = await axios.get('/auth/verify');
    return response.data;
  }
};

export const userAPI = {
  getDashboard: async () => {
    const response = await axios.get('/user/dashboard');
    return response.data;
  },

  activateROI: async () => {
    const response = await axios.post('/user/activate');
    return response.data;
  },

  requestWithdrawal: async (amount: number) => {
    const response = await axios.post('/user/withdraw', { amount });
    return response.data;
  },

  getTransactions: async () => {
    const response = await axios.get('/user/transactions');
    return response.data;
  }
};

export const paymentAPI = {
  createOrder: async (amount: number) => {
    const response = await axios.post('/payment/create-order', { amount });
    return response.data;
  },

  verifyPayment: async (paymentData: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
    amount: number;
  }) => {
    const response = await axios.post('/payment/verify', paymentData);
    return response.data;
  }
};

export const adminAPI = {
  getDashboardStats: async () => {
    const response = await axios.get('/admin/dashboard');
    return response.data;
  },

  getAllUsers: async () => {
    const response = await axios.get('/admin/users');
    return response.data;
  },

  updateUserStatus: async (userId: string, isActive: boolean) => {
    const response = await axios.patch(`/admin/users/${userId}/status`, { isActive });
    return response.data;
  },
  processWithdrawal: async (withdrawalId: string, status: 'approved' | 'rejected', userId: string) => {
    const response = await axios.patch(`/admin/withdrawals/${withdrawalId}`, { status, userId });
    return response.data;
  }
};
