// src/services/stripeService.js
import axios from 'axios';

// URL de tu backend (Render)
const API_URL = import.meta.env.VITE_API_URL || 'https://ophelina-back-v1.onrender.com/api';

export const stripeService = {
  /**
   * Crear sesión de checkout en Stripe
   */
  createCheckoutSession: async (data) => {
    try {
      const response = await axios.post(`${API_URL}/stripe/create-checkout-session`, data);
      return response.data;
    } catch (error) {
      console.error('❌ Error en createCheckoutSession:', error);
      throw error;
    }
  },

  /**
   * Verificar pago después de que Stripe redirija
   */
  verifyPayment: async (data) => {
    try {
      const response = await axios.post(`${API_URL}/stripe/verify-payment`, data);
      return response.data;
    } catch (error) {
      console.error('❌ Error en verifyPayment:', error);
      throw error;
    }
  },

  /**
   * Activar plan free para nuevos usuarios
   */
  activateFreePlan: async (data) => {
    try {
      const response = await axios.post(`${API_URL}/stripe/activate-free-plan`, data);
      return response.data;
    } catch (error) {
      console.error('❌ Error en activateFreePlan:', error);
      throw error;
    }
  },

  /**
   * Verificar estado de suscripción de una empresa
   */
  checkSubscription: async (empresaId) => {
    try {
      const response = await axios.get(`${API_URL}/stripe/check-subscription/${empresaId}`);
      return response.data;
    } catch (error) {
      console.error('❌ Error en checkSubscription:', error);
      throw error;
    }
  }
};