// src/hooks/useTienda.js

import { useState, useEffect, useCallback } from 'react';
import TiendaService from '../services/TiendaService';

export const useTienda = () => {
    const [productos, setProductos] = useState({ data: [], current_page: 1, total: 0 });
    const [estadisticas, setEstadisticas] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [filtros, setFiltros] = useState({
        busqueda: '',
        categoria: 'Todas',
        estado: 'Todos',
        solo_visibles: false,
        page: 1,
        per_page: 20
    });

    const cargarProductos = useCallback(async () => {
        setLoading(true);
        setError(null);
        
        try {
            const data = await TiendaService.getProductos(filtros);
            setProductos(data);
        } catch (err) {
            console.error('Error cargando productos:', err);
            setError(err.response?.data?.message || 'Error al cargar los productos');
            setProductos({ data: [], current_page: 1, total: 0 });
        } finally {
            setLoading(false);
        }
    }, [filtros]);

    const cargarEstadisticas = useCallback(async () => {
        try {
            const data = await TiendaService.getEstadisticas();
            setEstadisticas(data);
        } catch (err) {
            console.error('Error cargando estadísticas:', err);
        }
    }, []);

    const crearProducto = async (data) => {
        setLoading(true);
        try {
            const nuevo = await TiendaService.crearProducto(data);
            await cargarProductos();
            await cargarEstadisticas();
            return nuevo;
        } catch (err) {
            console.error('Error creando producto:', err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const actualizarProducto = async (id, data) => {
        setLoading(true);
        try {
            const actualizado = await TiendaService.actualizarProducto(id, data);
            await cargarProductos();
            await cargarEstadisticas();
            return actualizado;
        } catch (err) {
            console.error('Error actualizando producto:', err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const toggleVisibilidad = async (id) => {
        try {
            const result = await TiendaService.toggleVisibilidad(id);
            await cargarProductos();
            await cargarEstadisticas();
            return result;
        } catch (err) {
            console.error('Error cambiando visibilidad:', err);
            throw err;
        }
    };

    const toggleDestacado = async (id) => {
        try {
            const result = await TiendaService.toggleDestacado(id);
            await cargarProductos();
            await cargarEstadisticas();
            return result;
        } catch (err) {
            console.error('Error cambiando destacado:', err);
            throw err;
        }
    };

    const eliminarProducto = async (id) => {
        setLoading(true);
        try {
            await TiendaService.eliminarProducto(id);
            await cargarProductos();
            await cargarEstadisticas();
        } catch (err) {
            console.error('Error eliminando producto:', err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const ejecutarPublicacionAutomatica = async (diasGracia = 5) => {
        try {
            const result = await TiendaService.ejecutarPublicacionAutomatica(diasGracia);
            await cargarProductos();
            await cargarEstadisticas();
            return result;
        } catch (err) {
            console.error('Error en publicación automática:', err);
            throw err;
        }
    };

    const configurarDiasGracia = async (dias) => {
        try {
            const result = await TiendaService.configurarDiasGracia(dias);
            return result;
        } catch (err) {
            console.error('Error configurando días de gracia:', err);
            throw err;
        }
    };

    // Cargar productos al cambiar filtros
    useEffect(() => {
        cargarProductos();
    }, [cargarProductos]);

    // Cargar estadísticas al montar
    useEffect(() => {
        cargarEstadisticas();
    }, []);

    return {
        // Datos
        productos,
        estadisticas,
        loading,
        error,
        filtros,
        
        // Setters
        setFiltros,
        
        // Acciones
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
};