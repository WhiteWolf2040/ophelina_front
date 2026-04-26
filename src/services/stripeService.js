// src/services/stripeService.js
import axios from 'axios';

// Hardcodea la URL de tu backend
const API_URL = 'http://127.0.0.1:8000/api';

export const stripeService = {
  createCheckoutSession: async (data) => {
    const response = await axios.post(`${API_URL}/create-checkout-session`, data);
    return response.data;
  },

  verifyPayment: async (data) => {
    const response = await axios.post(`${API_URL}/verify-payment`, data);
    return response.data;
  },

  activateFreePlan: async (data) => {
    const response = await axios.post(`${API_URL}/activate-free-plan`, data);
    return response.data;
  },

  checkSubscription: async (empresaId) => {
    const response = await axios.get(`${API_URL}/check-subscription/${empresaId}`);
    return response.data;
  }
};