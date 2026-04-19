import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

// Add a request interceptor to include the JWT token
api.interceptors.request.use(
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

// Add a response interceptor to handle token expiration/unauthorized
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (!window.location.pathname.includes('/login')) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const getCustomers = () => api.get('/customers');
export const createCustomer = (data) => api.post('/customers', data);
export const updateCustomer = (id, data) => api.put(`/customers/${id}`, data);

export const getOrders = () => api.get('/orders');
export const getOrder = (id) => api.get(`/orders/${id}`);
export const createOrder = (data) => api.post('/orders', data);
export const updateOrder = (id, data) => api.put(`/orders/${id}`, data);
export const createOrderItem = (orderId, data) => api.post(`/orders/${orderId}/items`, data);

export const getServices = () => api.get('/services');
export const createService = (data) => api.post('/services', data);
export const updateService = (id, data) => api.put(`/services/${id}`, data);
export const deleteService = (id) => api.delete(`/services/${id}`);

export const getCampaigns = () => api.get('/campaigns/campaigns');
export const createCampaign = (data) => api.post('/campaigns/campaigns', data);
export const updateCampaign = (id, data) => api.put(`/campaigns/campaigns/${id}`, data);
export const deleteCampaign = (id) => api.delete(`/campaigns/campaigns/${id}`);
export const getActiveCampaigns = () => api.get('/campaigns/campaigns/active');

export const getCoupons = () => api.get('/campaigns/coupons');
export const createCoupon = (data) => api.post('/campaigns/coupons', data);
export const updateCoupon = (id, data) => api.put(`/campaigns/coupons/${id}`, data);
export const deleteCoupon = (id) => api.delete(`/campaigns/coupons/${id}`);
export const verifyCoupon = (code) => api.post('/campaigns/coupons/verify', { code });

// AUTH & LOGS & USERS
export const login = (data) => api.post('/auth/login', data);
export const getUsers = () => api.get('/auth/users');
export const createUser = (data) => api.post('/auth/users', data);
export const updateUser = (id, data) => api.put(`/auth/users/${id}`, data);
export const deleteUser = (id) => api.delete(`/auth/users/${id}`);
export const updateProfile = (data) => api.put('/auth/profile', data);
export const changePassword = (data) => api.put('/auth/change-password', data);
export const getLogs = () => api.get('/logs/activity');

export default api;
