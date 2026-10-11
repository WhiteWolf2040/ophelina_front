// src/contexts/DashboardContext.jsx
import React, { createContext, useContext, useState, useRef, useCallback, useEffect } from "react";
import api from "../config/api";

const DashboardContext = createContext(null);

// ============================================
// CONFIGURACIÓN
// ============================================
const CACHE_TTL_MS = 15 * 60 * 1000;          // 15 min para caché
const AUTO_REFRESH_MS = 10 * 60 * 1000;       // 10 min para auto-refresh

export const DashboardProvider = ({ children }) => {
  // ============================================
  // ESTADO DEL CACHÉ
  // ============================================
  const [data, setData] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);
  const [ultimaActualizacion, setUltimaActualizacion] = useState(null);
  const [invalidado, setInvalidado] = useState(false);

  // ============================================
  // REFS (control de concurrencia)
  // ============================================
  const requestIdRef = useRef(0);
  const enProgresoRef = useRef(false);

  // ============================================
  // HELPERS
  // ============================================
  const cacheEsValido = useCallback(() => {
    if (!data || !ultimaActualizacion) return false;
    if (invalidado) return false;
    const edad = Date.now() - ultimaActualizacion;
    return edad < CACHE_TTL_MS;
  }, [data, ultimaActualizacion, invalidado]);

  const edadCache = useCallback(() => {
    if (!ultimaActualizacion) return null;
    return Date.now() - ultimaActualizacion;
  }, [ultimaActualizacion]);

  // ============================================
  // CARGAR DATOS
  // ============================================
  const cargar = useCallback(async (forzar = false) => {
    if (enProgresoRef.current) return;
    if (!forzar && cacheEsValido()) return;

    const miPeticion = ++requestIdRef.current;
    enProgresoRef.current = true;

    try {
      setCargando(true);
      setError(null);

      const response = await api.get('/home/completo');
      if (miPeticion !== requestIdRef.current) return;

      if (response.data.success) {
        setData(response.data.data);
        setUltimaActualizacion(Date.now());
        setInvalidado(false);
      } else {
        setError('Respuesta inválida del servidor');
      }
    } catch (err) {
      if (miPeticion !== requestIdRef.current) return;
      console.error('Error al cargar dashboard:', err);
      setError('No se pudo conectar con el servidor.');
    } finally {
      if (miPeticion === requestIdRef.current) {
        setCargando(false);
        enProgresoRef.current = false;
      }
    }
  }, [cacheEsValido]);

  // ============================================
  // REFRESCAR (forzar recarga)
  // ============================================
  const refrescar = useCallback(() => {
    return cargar(true);
  }, [cargar]);

  // ============================================
  // INVALIDAR (marcar como obsoleto sin recargar)
  // ============================================
  const invalidar = useCallback(() => {
    setInvalidado(true);
  }, []);

  // ============================================
  // LIMPIAR (al logout)
  // ============================================
  const limpiar = useCallback(() => {
    setData(null);
    setUltimaActualizacion(null);
    setInvalidado(false);
    setError(null);
    requestIdRef.current++;
  }, []);

  // ============================================
  // AUTO-REFRESH cada 10 minutos
  // ============================================
  useEffect(() => {
    // Solo arranca el auto-refresh si ya hay datos cargados
    // (evita que dispare en el primer render cuando data es null)
    if (!data) return;

    const interval = setInterval(() => {
      // Solo refresca si no está ya en curso
      if (!enProgresoRef.current) {
        console.log('🔄 Auto-refresh del dashboard (10 min)');
        cargar(true); // silencioso: no bloquea el render porque data ya existe
      }
    }, AUTO_REFRESH_MS);

    return () => clearInterval(interval);
  }, [data, cargar]);

  // ============================================
  // VALUE
  // ============================================
  const value = {
    // Datos
    data,
    // Estados
    cargando,
    error,
    ultimaActualizacion,
    invalidado,
    // Helpers
    cacheEsValido: cacheEsValido(),
    edadCache: edadCache(),
    // Acciones
    cargar,
    refrescar,
    invalidar,
    limpiar
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard debe usarse dentro de DashboardProvider');
  }
  return context;
};