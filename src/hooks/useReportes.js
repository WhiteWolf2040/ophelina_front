// hooks/useReportes.js
// Hook centralizado para todos los datos de reportes, con caché.
// Uso: const { kpis, empeños, flujoCaja, clientes, inventario, loading, error, refetch } = useReportes(filtros);

import { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import { useDashboard } from "../contexts/DashboardContext";

const API = import.meta.env.VITE_API_URL ?? "http://localhost:8000/api";

const TTL = 5 * 60 * 1000; // 5 minutos

// ─── helper: construye headers con el token de Sanctum ───────────────────────
const authHeaders = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
    Accept: "application/json",
  },
});

// ─── helper: formatea número a moneda MXN ───────────────────────────────────
export const formatMXN = (n) =>
  new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(n ?? 0);

// ─── Estado inicial mientras carga ───────────────────────────────────────────
const KPI_EMPTY = {
  capital_prestado:     0,
  intereses_cobrados:   0,
  intereses_pendientes: 0,
  cartera_vigente:      0,
  cartera_vencida:      0,
  vencen_7_dias:        0,
  ingresos_mes:         0,
  total_activos:        0,
  clientes_activos:     0,
  periodo:              {},
};

// Claves de caché. Todas empiezan con "reportes" para poder
// invalidarlas juntas con invalidarCache('reportes').
const clavesReportes = (inicio, fin) => ({
  kpis:       "reportes:kpis",
  empeños:    `reportes:empenos:${inicio}:${fin}`,
  flujoCaja:  `reportes:flujo:${inicio}:${fin}`,
  clientes:   "reportes:clientes",
  inventario: "reportes:inventario",
});

// ─── Hook principal ───────────────────────────────────────────────────────────
export const useReportes = (filtros = {}) => {
  const { inicio, fin } = filtros;
  const { getCache, setCache } = useDashboard();

  // Si hay caché de una visita anterior, se arranca con ella (sin spinner)
  const k0 = clavesReportes(inicio, fin);

  const [kpis,       setKpis]       = useState(() => getCache(k0.kpis)?.data       ?? KPI_EMPTY);
  const [empeños,    setEmpeños]    = useState(() => getCache(k0.empeños)?.data    ?? null);
  const [flujoCaja,  setFlujoCaja]  = useState(() => getCache(k0.flujoCaja)?.data  ?? null);
  const [clientes,   setClientes]   = useState(() => getCache(k0.clientes)?.data   ?? null);
  const [inventario, setInventario] = useState(() => getCache(k0.inventario)?.data ?? null);

  const [loading, setLoading] = useState(() => ({
    kpis:       !getCache(k0.kpis),
    empeños:    !getCache(k0.empeños),
    flujoCaja:  !getCache(k0.flujoCaja),
    clientes:   !getCache(k0.clientes),
    inventario: !getCache(k0.inventario),
  }));
  const [error, setError] = useState(null);

  // Evita que una respuesta de un rango de fechas viejo pise al actual
  const fetchIdRef = useRef(0);

  // ── Cargar todos los datos ─────────────────────────────────────────────────
  // fetchAll()                  → usa caché; si está vencida refresca en segundo plano
  // fetchAll({ forzar: true })  → ignora la caché y recarga todo
  const fetchAll = useCallback((opciones) => {
    const forzar = opciones?.forzar === true;
    const miPeticion = ++fetchIdRef.current;
    const params = inicio && fin ? { inicio, fin } : {};
    const k = clavesReportes(inicio, fin);

    const secciones = [
      { key: "kpis",       endpoint: "kpis",       setter: setKpis,       cacheKey: k.kpis,       p: {} },
      { key: "empeños",    endpoint: "empenos",    setter: setEmpeños,    cacheKey: k.empeños,    p: params },
      { key: "flujoCaja",  endpoint: "flujo-caja", setter: setFlujoCaja,  cacheKey: k.flujoCaja,  p: params },
      { key: "clientes",   endpoint: "clientes",   setter: setClientes,   cacheKey: k.clientes,   p: {} },
      { key: "inventario", endpoint: "inventario", setter: setInventario, cacheKey: k.inventario, p: {} },
    ];

    const pedir = async ({ key, endpoint, setter, cacheKey, p }, silencioso) => {
      try {
        const { data } = await axios.get(`${API}/reportes/${endpoint}`, {
          ...authHeaders(),
          params: p,
        });
        setCache(cacheKey, data);
        if (miPeticion !== fetchIdRef.current) return;
        setter(data);
      } catch (err) {
        console.error(`[useReportes] Error en /${endpoint}:`, err);
        if (miPeticion !== fetchIdRef.current) return;
        if (!silencioso) {
          setError((prev) => ({ ...prev, [key]: err?.response?.data?.message ?? err.message }));
        }
      } finally {
        if (miPeticion === fetchIdRef.current) {
          setLoading((prev) => ({ ...prev, [key]: false }));
        }
      }
    };

    setError(null);

    secciones.forEach((seccion) => {
      const cache = forzar ? null : getCache(seccion.cacheKey);

      if (cache) {
        seccion.setter(cache.data);
        setLoading((prev) => ({ ...prev, [seccion.key]: false }));
        if (Date.now() - cache.timestamp >= TTL) {
          pedir(seccion, true); // refresco silencioso
        }
        return;
      }

      setLoading((prev) => ({ ...prev, [seccion.key]: true }));
      pedir(seccion, false);
    });
  }, [inicio, fin, getCache, setCache]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  // Botón "Actualizar": siempre ignora la caché
  // (se ignoran argumentos para que un onClick={refetch} no pase el evento)
  const refetch = useCallback(() => fetchAll({ forzar: true }), [fetchAll]);

  return {
    kpis,
    empeños,
    flujoCaja,
    clientes,
    inventario,
    loading,
    error,
    refetch,
    formatMXN,
  };
};