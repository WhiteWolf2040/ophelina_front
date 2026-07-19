// src/services/inventarioService.js

import api from '../api/axios';

class InventarioService {
    // Obtener todas las prendas
    async getPrendas() {
        const response = await api.get('/prendas');
        return response.data.data; // ← Ajustar según respuesta
    }

    // Obtener una prenda
    async getPrenda(id) {
        const response = await api.get(`/prendas/${id}`);
        return response.data.data;
    }

    // Crear prenda
    async crearPrenda(data) {
        const response = await api.post('/prendas', data);
        return response.data.data;
    }

    // Actualizar prenda
    async actualizarPrenda(id, data) {
        const response = await api.put(`/prendas/${id}`, data);
        return response.data.data;
    }

    // Eliminar prenda
    async eliminarPrenda(id) {
        const response = await api.delete(`/prendas/${id}`);
        return response.data;
    }
}

export default new InventarioService();