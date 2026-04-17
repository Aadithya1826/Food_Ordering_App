import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  login: async (email, password, role = undefined) => {
    const response = await api.post('/api/v1/auth/login', { email, password, role });
    if (response.data.access_token) {
      localStorage.setItem('access_token', response.data.access_token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  signup: async (name, email, password, role = null, restaurantId = null) => {
    try {
      const response = await api.post('/api/v1/auth/signup', { name, email, password, role, restaurant_id: restaurantId });
      return response.data;
    } catch (error) {
      // If signup endpoint doesn't exist, throw error to user
      throw error;
    }
  },

  logout: async () => {
    try {
      await api.post('/api/v1/auth/logout');
    } finally {
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
    }
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  getToken: () => localStorage.getItem('access_token'),

  isAuthenticated: () => {
    return !!localStorage.getItem('access_token');
  },
};

export const restaurantService = {
  getPublicRestaurants: async () => {
    const response = await api.get('/api/v1/public/restaurants');
    return response.data;
  },

  getAdminRestaurants: async () => {
    const response = await api.get('/api/v1/restaurants');
    return response.data;
  },

  createRestaurant: async (restaurantData) => {
    const response = await api.post('/api/v1/restaurants', restaurantData);
    return response.data;
  },
};

export const tableService = {
  getTables: async (params = {}) => {
    const response = await api.get('/api/v1/tables', { params });
    return response.data;
  },
};

export const menuService = {
  getItems: async (params = {}) => {
    const response = await api.get('/api/v1/menu/items', { params });
    return response.data;
  },

  getCategories: async (params = {}) => {
    const response = await api.get('/api/v1/menu/categories', { params });
    return response.data;
  },
};

export const orderService = {
  getLiveOrders: async (params = {}) => {
    const response = await api.get('/api/v1/orders/live', { params });
    return response.data;
  },

  updateOrderStatus: async (orderId, status) => {
    const response = await api.patch(`/api/v1/orders/${orderId}/status`, { status });
    return response.data;
  },
};

export const inventoryService = {
  getInventory: async (params = {}) => {
    const response = await api.get('/api/v1/inventory', { params });
    return response.data;
  },

  updateInventory: async (inventoryId, quantity) => {
    const response = await api.patch(`/api/v1/inventory/${inventoryId}`, { quantity });
    return response.data;
  },
};

export default api;
