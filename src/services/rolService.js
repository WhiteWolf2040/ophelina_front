// src/services/rolService.js - VERSIÓN FUSIONADA (Docker Base + Manejo de Errores)
import api from "../config/api";

const rolesService = {
  /**
   * Obtener todos los roles
   */
  obtenerRoles: async () => {
    try {
      const response = await api.get("/roles");
      return response;
    } catch (error) {
      console.error('Error en obtenerRoles:', error);
      throw error;
    }
  },

  /**
   * Obtener un rol por ID
   */
  obtenerRol: async (id) => {
    try {
      const response = await api.get(`/roles/${id}`);
      return response;
    } catch (error) {
      console.error(`Error en obtenerRol ${id}:`, error);
      throw error;
    }
  },

  /**
   * Crear nuevo rol
   */
  crearRol: async (data) => {
    try {
      const response = await api.post("/roles", data);
      return response;
    } catch (error) {
      console.error('Error en crearRol:', error);
      throw error;
    }
  },

  /**
   * Actualizar rol
   */
  actualizarRol: async (id, data) => {
    try {
      const response = await api.put(`/roles/${id}`, data);
      return response;
    } catch (error) {
      console.error(`Error en actualizarRol ${id}:`, error);
      throw error;
    }
  },

  /**
   * Eliminar rol
   */
  eliminarRol: async (id) => {
    try {
      const response = await api.delete(`/roles/${id}`);
      return response;
    } catch (error) {
      console.error(`Error en eliminarRol ${id}:`, error);
      throw error;
    }
  },

  /**
   * Obtener permisos disponibles
   */
  obtenerPermisos: async () => {
    try {
      const response = await api.get("/permisos");
      return response;
    } catch (error) {
      console.error('Error en obtenerPermisos:', error);
      throw error;
    }
  }
};

export default rolesService;