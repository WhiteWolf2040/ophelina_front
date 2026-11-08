// services/rolService.js
import api from '../config/api';

const rolesService = {
    obtenerRoles: async () => {
        try {
            const response = await api.get('/roles');
            return response;
        } catch (error) {
            console.error('Error en obtenerRoles:', error);
            throw error;
        }
    },

    obtenerRol: async (id) => {
        try {
            const response = await api.get(`/roles/${id}`);
            return response;
        } catch (error) {
            console.error('Error en obtenerRol:', error);
            throw error;
        }
    },

    crearRol: async (data) => {
        try {
            const response = await api.post('/roles', data);
            return response;
        } catch (error) {
            console.error('Error en crearRol:', error);
            throw error;
        }
    },

    actualizarRol: async (id, data) => {
        try {
            const response = await api.put(`/roles/${id}`, data);
            return response;
        } catch (error) {
            console.error('Error en actualizarRol:', error);
            throw error;
        }
    },

    eliminarRol: async (id) => {
        try {
            const response = await api.delete(`/roles/${id}`);
            return response;
        } catch (error) {
            console.error('Error en eliminarRol:', error);
            throw error;
        }
    },

    obtenerPermisos: async () => {
        try {
            const response = await api.get('/permisos');
            return response;
        } catch (error) {
            console.error('Error en obtenerPermisos:', error);
            throw error;
        }
    }
};

export default rolesService;