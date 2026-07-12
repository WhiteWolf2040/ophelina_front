// src/services/stripeService.js
import api from '../config/api';

export const stripeService = {
  createCheckoutSession: async (data) => {
    const response = await api.post('/stripe/create-checkout-session', data);
    return response.data;
  },

  verifyPayment: async (data) => {
    const response = await api.post('/stripe/verify-payment', data);
    return response.data;
  },

  activateFreePlan: async (data) => {
    const response = await api.post('/stripe/activate-free-plan', data);
    return response.data;
  },

  checkSubscription: async (empresaId) => {
    const response = await api.get(`/stripe/check-subscription/${empresaId}`);
    return response.data;
  }
};