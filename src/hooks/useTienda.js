// src/hooks/useTienda.js — Versión mejorada
import { useState, useEffect, useCallback, useRef } from 'react';
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

  // ✅ Ref para evitar race conditions
  const abortRef = useRef(null);

  // ✅ Cargar productos con cancelación
  const cargarProductos = useCallback(async () => {
    // Cancelar petición anterior si existe
    if (abortRef.current) {
      abortRef.current.abort();
    }
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      setLoading(true);
      setError(null);
      const data = await TiendaService.getProductos(filtros, controller.signal);
      
      // Solo actualizar si esta petición es la vigente
      if (!controller.signal.aborted) {
        setProductos(data);
      }
    } catch (err) {
      if (err.name === 'AbortError' || err.name === 'CanceledError') return;
      console.error('Error al cargar productos:', err);
      setError(err.response?.data?.message || err.message || 'Error al cargar productos');
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false);
      }
    }
  }, [filtros]);

  const cargarEstadisticas = useCallback(async () => {
    try {
      const data = await TiendaService.getEstadisticas();
      setEstadisticas(data);
    } catch (err) {
      console.error('Error al cargar estadísticas:', err);
    }
  }, []);

  // ✅ Recargar cuando cambian filtros (evita doble fetch al montar)
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