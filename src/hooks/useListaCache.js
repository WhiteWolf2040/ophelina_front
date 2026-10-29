// src/hooks/useListaCache.js
// Hook reutilizable: carga una lista UNA vez y la conserva al cambiar de módulo.
//
// Uso:
//   const { data, setData, cargando, error, recargar } =
//     useListaCache('pagos', obtenerPagosFormateados);
//
// - key:     nombre único de la caché ('pagos', 'empenos', 'articulos'...)
// - fetcher: función async que devuelve el ARRAY ya formateado.
//            Defínela FUERA del componente para que no cambie en cada render.
// - options: { enabled: true, ttl: 5 * 60 * 1000 }
import { useState, useEffect, useCallback, useRef } from "react";
import { useDashboard } from "../contexts/DashboardContext";

const TTL_POR_DEFECTO = 5 * 60 * 1000; // 5 minutos

export default function useListaCache(key, fetcher, { enabled = true, ttl = TTL_POR_DEFECTO } = {}) {
  const { getCache, setCache } = useDashboard();

  const inicial = getCache(key);
  const [data, setDataState] = useState(inicial?.data ?? []);
  const [cargando, setCargando] = useState(!inicial);
  const [error, setError] = useState(null);

  // Siempre la versión más reciente de data y fetcher, sin re-crear callbacks
  const dataRef = useRef(data);
  dataRef.current = data;
  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  // Carga desde el servidor y guarda en la caché.
  // silencioso: no muestra spinner (se usa para refrescar en segundo plano)
  const recargar = useCallback(async ({ silencioso = false } = {}) => {
    if (!silencioso) {
      setCargando(true);
      setError(null);
    }
    try {
      const lista = await fetcherRef.current();
      dataRef.current = lista;
      setDataState(lista);
      setCache(key, lista);
    } catch (e) {
      console.error(`Error cargando "${key}":`, e);
      if (!silencioso) {
        setDataState([]);
        setError(e);
      }
    } finally {
      setCargando(false);
    }
  }, [key, setCache]);

  // Al montar: usa caché si existe; si está vencida, refresca en segundo plano
  useEffect(() => {
    if (!enabled) return;

    const cache = getCache(key);
    if (cache) {
      setDataState(cache.data);
      setCargando(false);
      if (Date.now() - cache.timestamp >= ttl) {
        recargar({ silencioso: true });
      }
    } else {
      recargar();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, key]);

  // Para modificar la lista localmente (ej. al eliminar) manteniendo la caché al día.
  // Acepta un array o una función: setData(prev => prev.filter(...))
  const setData = useCallback((actualizador) => {
    const nuevo = typeof actualizador === "function"
      ? actualizador(dataRef.current)
      : actualizador;
    dataRef.current = nuevo;
    setDataState(nuevo);
    setCache(key, nuevo);
  }, [key, setCache]);

  return { data, setData, cargando, error, recargar };
}