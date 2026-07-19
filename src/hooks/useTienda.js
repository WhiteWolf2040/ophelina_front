// src/hooks/useTienda.js
import { useState, useEffect, useCallback } from 'react';
import TiendaService from '../services/TiendaService';

export function useTienda() {
    const [productos, setProductos] = useState({ data: [], total: 0 });
    const [estadisticas, setEstadisticas] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filtros, setFiltros] = useState({
        busqueda: '',
        categoria: 'Todas',
        estado: 'Todos',
        solo_visibles: false
    });

    // Cargar productos
    const cargarProductos = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await TiendaService.getProductos(filtros);
            setProductos(data);
        } catch (err) {
            console.error('Error al cargar productos:', err);
            setError(err.response?.data?.message || err.message || 'Error al cargar productos');
        } finally {
            setLoading(false);
        }
    }, [filtros]);

    // Cargar estadísticas
    const cargarEstadisticas = useCallback(async () => {
        try {
            const data = await TiendaService.getEstadisticas();
            setEstadisticas(data);
        } catch (err) {
            console.error('Error al cargar estadísticas:', err);
        }
    }, []);

    // Recargar cuando cambian filtros
    useEffect(() => {
        cargarProductos();
    }, [cargarProductos]);

    // CRUD
    const crearProducto = async (data) => {
        const result = await TiendaService.crearProducto(data);
        await cargarProductos();
        await cargarEstadisticas();
        return result;
    };

    const actualizarProducto = async (id, data) => {
        const result = await TiendaService.actualizarProducto(id, data);
        await cargarProductos();
        await cargarEstadisticas();
        return result;
    };

    const toggleVisibilidad = async (id) => {
        const result = await TiendaService.toggleVisibilidad(id);
        await cargarProductos();
        return result;
    };

    const toggleDestacado = async (id) => {
        const result = await TiendaService.toggleDestacado(id);
        await cargarProductos();
        return result;
    };

    const eliminarProducto = async (id) => {
        const result = await TiendaService.eliminarProducto(id);
        await cargarProductos();
        await cargarEstadisticas();
        return result;
    };

    // Publicación automática
    const ejecutarPublicacionAutomatica = async (diasGracia = 5) => {
        const result = await TiendaService.ejecutarPublicacionAutomatica(diasGracia);
        await cargarProductos();
        await cargarEstadisticas();
        return result;
    };

    const configurarDiasGracia = async (dias) => {
        return await TiendaService.configurarDiasGracia(dias);
    };

    return {
        productos,
        estadisticas,
        loading,
        error,
        filtros,
        setFiltros,
        cargarProductos,
        cargarEstadisticas,
        crearProducto,
        actualizarProducto,
        toggleVisibilidad,
        toggleDestacado,
        eliminarProducto,
        ejecutarPublicacionAutomatica,
        configurarDiasGracia
    };
}