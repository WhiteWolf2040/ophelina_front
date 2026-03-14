import api from "../config/api";

const clientesService = {

  // Obtener todos los clientes
  obtenerClientes: async () => {
    const response = await api.get("/clientes");
    return response; // Cambiado de response.data a response
  },

  // Crear cliente
  crearCliente: async (formData) => {
    const response = await api.post("/clientes", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response; // Cambiado de response.data a response
  },

  // Actualizar cliente
  actualizarCliente: async (id, data) => {
    const response = await api.put(`/clientes/${id}`, data);
    return response; // Cambiado de response.data a response
  },

  // Eliminar cliente
  eliminarCliente: async (id) => {
    const response = await api.delete(`/clientes/${id}`);
    return response; // Cambiado de response.data a response
  },

  // Obtener cliente individual
  obtenerCliente: async (id) => {
    const response = await api.get(`/clientes/${id}`);
    return response; // Cambiado de response.data a response
  },
};

export default clientesService;