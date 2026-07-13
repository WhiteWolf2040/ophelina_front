// hooks/useReportes.js
// Hook centralizado para todos los datos de reportes
// Uso: const { kpis, empeños, flujoCaja, clientes, inventario, loading, error, refetch } = useReportes(filtros);

import { useState, useEffect, useCallback } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API_URL ?? "http://localhost:8000/api";

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

// ─── Hook principal ───────────────────────────────────────────────────────────
export const useReportes = (filtros = {}) => {
  const { inicio, fin } = filtros;

  const [kpis,       setKpis]       = useState(KPI_EMPTY);
  const [empeños,    setEmpeños]    = useState(null);
  const [flujoCaja,  setFlujoCaja]  = useState(null);
  const [clientes,   setClientes]   = useState(null);
  const [inventario, setInventario] = useState(null);

  const [loading, setLoading] = useState({
    kpis: true, empeños: true, flujoCaja: true, clientes: true, inventario: true,
  });
  const [error, setError] = useState(null);

  // ── Fetch individual con manejo de error ──────────────────────────────────
  const fetchOne = useCallback(async (endpoint, setter, key, params = {}) => {
    try {
      const { data } = await axios.get(`${API}/reportes/${endpoint}`, {
        ...authHeaders(),
        params,
      });
      setter(data);
    } catch (err) {
      console.error(`[useReportes] Error en /${endpoint}:`, err);
      setError((prev) => ({ ...prev, [key]: err?.response?.data?.message ?? err.message }));
    } finally {
      setLoading((prev) => ({ ...prev, [key]: false }));
    }
  }, []);

  // ── Cargar todos los datos ─────────────────────────────────────────────────
  const fetchAll = useCallback(() => {
    setLoading({ kpis: true, empeños: true, flujoCaja: true, clientes: true, inventario: true });
    setError(null);

    const params = inicio && fin ? { inicio, fin } : {};

    fetchOne("kpis",       setKpis,       "kpis");
    fetchOne("empenos",    setEmpeños,    "empeños",    params);
    fetchOne("flujo-caja", setFlujoCaja,  "flujoCaja",  params);
    fetchOne("clientes",   setClientes,   "clientes");
    fetchOne("inventario", setInventario, "inventario");
  }, [inicio, fin, fetchOne]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  return {
    kpis,
    empeños,
    flujoCaja,
    clientes,
    inventario,
    loading,
    error,
    refetch: fetchAll,
    formatMXN,
  };
};
