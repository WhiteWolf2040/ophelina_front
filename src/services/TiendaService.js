// src/services/TiendaService.js
import api from '../config/api';

const TiendaService = {
    // Obtener productos con filtros
    getProductos: async (filtros = {}) => {
        const params = new URLSearchParams();
        if (filtros.busqueda) params.append('busqueda', filtros.busqueda);
        if (filtros.categoria && filtros.categoria !== 'Todas') params.append('categoria', filtros.categoria);
        if (filtros.estado && filtros.estado !== 'Todos') params.append('estado', filtros.estado);
        if (filtros.solo_visibles) params.append('solo_visibles', 'true');
        
        const response = await api.get(`/tienda/productos?${params.toString()}`);
        return response.data;
    },

    // Obtener estadísticas
    getEstadisticas: async () => {
        const response = await api.get('/tienda/estadisticas');
        return response.data;
    },

    // Crear producto
    crearProducto: async (data) => {
        const response = await api.post('/tienda/productos', data);
        return response.data;
    },

    // Actualizar producto
    actualizarProducto: async (id, data) => {
        const response = await api.put(`/tienda/productos/${id}`, data);
        return response.data;
    },

    // Cambiar visibilidad
    toggleVisibilidad: async (id) => {
        const response = await api.post(`/tienda/productos/${id}/toggle-visible`);
        return response.data;
    },

    // Cambiar destacado
    toggleDestacado: async (id) => {
        const response = await api.post(`/tienda/productos/${id}/toggle-destacado`);
        return response.data;
    },

    // Eliminar producto
    eliminarProducto: async (id) => {
        const response = await api.delete(`/tienda/productos/${id}`);
        return response.data;
    },

    // Publicación automática
    ejecutarPublicacionAutomatica: async (diasGracia = 5) => {
        const response = await api.post('/tienda/publicacion-automatica', { dias_gracia: diasGracia });
        return response.data;
    },

    // Configurar días de gracia
    configurarDiasGracia: async (dias) => {
        const response = await api.post('/tienda/configurar-dias-gracia', { dias_gracia: dias });
        return response.data;
    }
};

export default TiendaService;