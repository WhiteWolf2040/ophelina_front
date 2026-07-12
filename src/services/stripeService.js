// src/services/stripeService.js
import api from '../config/api';  // ← IMPORTAR LA INSTANCIA CON INTERCEPTOR

// URL de tu backend (Render) - YA NO ES NECESARIA porque api ya tiene la baseURL
// const API_URL = import.meta.env.VITE_API_URL || 'https://ophelina-back-v1.onrender.com/api';

export const stripeService = {
  /**
   * Crear sesión de checkout en Stripe (PÚBLICO - no requiere token)
   */
  createCheckoutSession: async (data) => {
    try {
      // ✅ Usar api en lugar de axios
      const response = await api.post('/stripe/create-checkout-session', data);
      return response.data;
    } catch (error) {
      console.error('❌ Error en createCheckoutSession:', error);
      throw error;
    }
  },

  /**
   * Verificar pago después de que Stripe redirija (REQUIERE TOKEN)
   */
  verifyPayment: async (data) => {
    try {
        // ✅ VERIFICAR QUE EL TOKEN EXISTA
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No hay token de autenticación');
        }
        
        const response = await api.post('/stripe/verify-payment', data);
        console.log('📥 Respuesta del backend:', response.data);
        return response.data;
    } catch (error) {
        console.error('❌ Error en verifyPayment:', error);
        if (error.response) {
            throw new Error(error.response.data?.message || 'Error en el servidor');
        }
        throw error;
    }
},

  /**
   * Activar plan free para nuevos usuarios (PÚBLICO - no requiere token)
   */
  activateFreePlan: async (data) => {
    try {
      const response = await api.post('/stripe/activate-free-plan', data);
      return response.data;
    } catch (error) {
      console.error('❌ Error en activateFreePlan:', error);
      throw error;
    }
  },

  /**
   * Verificar estado de suscripción de una empresa (REQUIERE TOKEN)
   */
  checkSubscription: async (empresaId) => {
    try {
      // ✅ Usar api en lugar de axios (ENVÍA EL TOKEN AUTOMÁTICAMENTE)
      const response = await api.get(`/stripe/check-subscription/${empresaId}`);
      return response.data;
    } catch (error) {
      console.error('❌ Error en checkSubscription:', error);
      throw error;
    }
  }
};