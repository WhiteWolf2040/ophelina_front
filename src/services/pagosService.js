// frontend/src/services/pagosService.js
import api from "../config/api";

const pagosService = {
  // Obtener todos los pagos
  obtenerPagos: async () => {
    const response = await api.get("/pagos");
    return response;
  },

  // Obtener un pago por ID
  obtenerPago: async (id) => {
    const response = await api.get(`/pagos/${id}`);
    return response;
  },

  // Crear nuevo pago
  crearPago: async (data) => {
    const response = await api.post("/pagos", data);
    return response;
  },

  // Eliminar pago
  eliminarPago: async (id) => {
    const response = await api.delete(`/pagos/${id}`);
    return response;
  },

  // Obtener pagos por cliente
  pagosPorCliente: async (idCliente) => {
    const response = await api.get(`/pagos/cliente/${idCliente}`);
    return response;
  }
};

export default pagosService;