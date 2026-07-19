// src/hooks/useTienda.js

import { useState, useEffect, useCallback } from 'react';
import tiendaService from '../services/TiendaService';

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

  // ========== CARGAR PRODUCTOS ==========
  const cargarProductos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await tiendaService.getProductos(filtros);
      setProductos(data);
    } catch (err) {
      console.error('Error al cargar productos:', err);
      setError(
        err.response?.data?.message || err.message || 'Error al cargar productos'
      );
    } finally {
      setLoading(false);
    }
  }, [filtros]);

  // ========== CARGAR ESTADÍSTICAS ==========
  const cargarEstadisticas = useCallback(async () => {
    try {
      const data = await tiendaService.getEstadisticas();
      setEstadisticas(data);
    } catch (err) {
      console.error('Error al cargar estadísticas:', err);
    }
  }, []);

  // Recargar productos automáticamente cuando cambian los filtros
  useEffect(() => {
    cargarProductos();
  }, [cargarProductos]);

  // ========== CRUD DE PRODUCTOS ==========
  const crearProducto = async (data) => {
    return await tiendaService.crearProducto(data);
  };

  const actualizarProducto = async (id, data) => {
    return await tiendaService.actualizarProducto(id, data);
  };

  const toggleVisibilidad = async (id) => {
    return await tiendaService.toggleVisibilidad(id);
  };

  const toggleDestacado = async (id) => {
    return await tiendaService.toggleDestacado(id);
  };

  const eliminarProducto = async (id) => {
    return await tiendaService.eliminarProducto(id);
  };

  // ========== PUBLICACIÓN AUTOMÁTICA ==========
  const ejecutarPublicacionAutomatica = async (diasGracia = 5) => {
    return await tiendaService.ejecutarPublicacionAutomatica(diasGracia);
  };

  const configurarDiasGracia = async (dias) => {
    return await tiendaService.configurarDiasGracia(dias);
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