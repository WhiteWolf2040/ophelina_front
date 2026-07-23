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
        const response = await api.get('/tienda/productos/estadisticas');
        return response.data;
    },

    // ✅ Crear producto — ahora recibe un FormData (puede incluir archivo de imagen)
    crearProducto: async (formData) => {
        const response = await api.post('/tienda/productos', formData, {
            headers: {
                // Se anula el 'application/json' fijo de la instancia para este request.
                // Al quedar undefined, el navegador genera el Content-Type correcto
                // (multipart/form-data; boundary=...) automáticamente al ver que el
                // body es un FormData. Si se deja 'application/json' o se fuerza
                // 'multipart/form-data' a mano SIN boundary, Laravel no puede leer el
                // archivo y responde "The imagen field must be a file".
                'Content-Type': undefined,
            },
        });
        return response.data;
    },

    // ✅ Actualizar producto — Laravel no procesa bien multipart/form-data en PUT real,
    // así que se manda como POST con el campo "_method=PUT" (method spoofing, soportado
    // nativamente por Laravel) para que el archivo sí llegue completo al backend.
    actualizarProducto: async (id, formData) => {
        formData.append('_method', 'PUT');
        const response = await api.post(`/tienda/productos/${id}`, formData, {
            headers: {
                'Content-Type': undefined,
            },
        });
        return response.data;
    },

    // Cambiar visibilidad
    toggleVisibilidad: async (id) => {
        const response = await api.patch(`/tienda/productos/${id}/visibilidad`);
        return response.data;
    },

    // Cambiar destacado
    toggleDestacado: async (id) => {
        const response = await api.patch(`/tienda/productos/${id}/destacado`);
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