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
  // ESTADO DEL CACHÉ DEL DASHBOARD
  // ============================================
  const [data, setData] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);
  const [ultimaActualizacion, setUltimaActualizacion] = useState(null);
  const [invalidado, setInvalidado] = useState(false);

  // ============================================
  // CACHÉ DE CLIENTES (usada por ClientesLista)
  // ============================================
  const [clientesCache, setClientesCache] = useState({ data: null, timestamp: 0 });

  // ============================================
  // CACHÉ GENÉRICA PARA CUALQUIER LISTA (usada por useListaCache)
  // Se guarda en un ref: no provoca re-renders al escribir.
  // Formato: { pagos: { data: [...], timestamp: 123 }, empenos: {...} }
  // ============================================
  const listasCacheRef = useRef({});

  const getCache = useCallback((key) => listasCacheRef.current[key] || null, []);

  const setCache = useCallback((key, lista) => {
    listasCacheRef.current[key] = { data: lista, timestamp: Date.now() };
  }, []);

  // Invalida una lista y todas sus variantes por filtros:
  //   invalidarCache('reportes') borra 'reportes', 'reportes:kpis',
  //   'reportes:empenos:2026-10-01:2026-10-27', etc.
  // Sin argumento borra todas las cachés.
  const invalidarCache = useCallback((key) => {
    if (!key) {
      listasCacheRef.current = {};
      return;
    }
    Object.keys(listasCacheRef.current).forEach((k) => {
      if (k === key || k.startsWith(`${key}:`)) {
        delete listasCacheRef.current[k];
      }
    });
  }, []);

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

    // El backend cachea la respuesta 90s por empresa. Si el refresco es manual
    // o los datos fueron invalidados (por ejemplo, se registró un pago), hay que
    // pedirle que ignore ese caché; si no, devolvería los datos viejos.
    const saltarCacheServidor = forzar || invalidado;

    try {
      setCargando(true);
      setError(null);

      const response = await api.get('/home/completo', {
        params: saltarCacheServidor ? { refresh: 1 } : undefined
      });
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
  }, [cacheEsValido, invalidado]);

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
    setClientesCache({ data: null, timestamp: 0 }); // limpia también la caché de clientes
    listasCacheRef.current = {};                    // limpia la caché genérica (pagos, etc.)
    requestIdRef.current++;                         // descarta cualquier respuesta en vuelo

    // Si había una petición en curso, su "finally" ya no se ejecuta como vigente
    // (el id cambió), así que estos dos valores se quedarían atascados:
    // enProgresoRef en true bloquearía todas las cargas futuras y el dashboard
    // se quedaría cargando para siempre después de volver a iniciar sesión.
    enProgresoRef.current = false;
    setCargando(false);
  }, []);

  // ============================================
  // AUTO-REFRESH cada 10 minutos
  // ============================================
  useEffect(() => {
    // Solo arranca el auto-refresh si ya hay datos cargados
    if (!data) return;

    const interval = setInterval(() => {
      // No gastar peticiones si la pestaña está en segundo plano
      if (document.hidden) return;
      if (!enProgresoRef.current) {
        console.log('🔄 Auto-refresh del dashboard (10 min)');
        cargar(true);
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
    limpiar,
    // Caché de clientes
    clientesCache,
    setClientesCache,
    // Caché genérica de listas
    getCache,
    setCache,
    invalidarCache
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