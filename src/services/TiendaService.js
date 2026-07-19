// src/services/TiendaService.js

import api from '../api/axios';

class TiendaService {
    /**
     * Obtener productos con filtros
     */
    async getProductos(filtros = {}) {
        const params = new URLSearchParams();
        
        Object.keys(filtros).forEach(key => {
            if (filtros[key] && filtros[key] !== '' && filtros[key] !== 'Todas' && filtros[key] !== 'Todos') {
                params.append(key, filtros[key]);
            }
        });
        
        const response = await api.get(`/tienda/productos?${params}`);
        return response.data;
    }

    /**
     * Obtener estadísticas de la tienda
     */
    async getEstadisticas() {
        const response = await api.get('/tienda/productos/estadisticas');
        return response.data;
    }

    /**
     * Crear un nuevo producto
     */
    async crearProducto(data) {
        const response = await api.post('/tienda/productos', data);
        return response.data;
    }

    /**
     * Actualizar un producto existente
     */
    async actualizarProducto(id, data) {
        const response = await api.put(`/tienda/productos/${id}`, data);
        return response.data;
    }

    /**
     * Cambiar visibilidad de un producto
     */
    async toggleVisibilidad(id) {
        const response = await api.patch(`/tienda/productos/${id}/visibilidad`);
        return response.data;
    }

    /**
     * Cambiar destacado de un producto
     */
    async toggleDestacado(id) {
        const response = await api.patch(`/tienda/productos/${id}/destacado`);
        return response.data;
    }

    /**
     * Eliminar un producto
     */
    async eliminarProducto(id) {
        const response = await api.delete(`/tienda/productos/${id}`);
        return response.data;
    }

    /**
     * Ejecutar publicación automática
     */
    async ejecutarPublicacionAutomatica(diasGracia = 5) {
        const response = await api.post('/tienda/publicacion-automatica', { dias_gracia: diasGracia });
        return response.data;
    }

    /**
     * Configurar días de gracia
     */
    async configurarDiasGracia(dias) {
        const response = await api.post('/tienda/configurar-dias-gracia', { dias_gracia: dias });
        return response.data;
    }
}

export default new TiendaService();