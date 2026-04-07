// src/services/rolService.js
import api from "../config/api";

const rolesService = {
  // Obtener todos los roles
  obtenerRoles: async () => {
    const response = await api.get("/roles");
    return response;
  },

  // Obtener un rol por ID
  obtenerRol: async (id) => {
    const response = await api.get(`/roles/${id}`);
    return response;
  },

  // Crear nuevo rol
  crearRol: async (data) => {
    const response = await api.post("/roles", data);
    return response;
  },

  // Actualizar rol
  actualizarRol: async (id, data) => {
    const response = await api.put(`/roles/${id}`, data);
    return response;
  },

  // Eliminar rol
  eliminarRol: async (id) => {
    const response = await api.delete(`/roles/${id}`);
    return response;
  },

  // Obtener permisos
  obtenerPermisos: async () => {
    const response = await api.get("/permisos");
    return response;
  }
};

export default rolesService;