import { useState, useEffect, useCallback } from "react";
import api from "../config/api";

const tokenActual = () => localStorage.getItem("token");

// Crea un caché que carga una vez y lo comparte entre montajes del componente
const crearCacheUnaVez = (traerDatos) => {
  let cache = null;      // { datos, token, cargadoEn }
  let enVuelo = null;    // petición en curso (evita llamadas dobles)
  const suscriptores = new Set();

  const notificar = () => suscriptores.forEach((fn) => fn());
  const vigente = () => cache !== null && cache.token === tokenActual();

  const cargarGlobal = async (forzar = false) => {
    if (vigente() && !forzar) return;
    if (!enVuelo) {
      const tokenInicio = tokenActual();
      enVuelo = traerDatos()
        .then((datos) => {
          cache = { datos, token: tokenInicio, cargadoEn: Date.now() };
        })
        .finally(() => {
          enVuelo = null;
        });
    }
    await enVuelo;
    notificar();
  };

  const invalidar = () => {
    cache = null;
    notificar();
  };

  const useCache = () => {
    const [, setVersion] = useState(0);
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState(false);

    useEffect(() => {
      const fn = () => setVersion((v) => v + 1);
      suscriptores.add(fn);
      return () => {
        suscriptores.delete(fn);
      };
    }, []);

    const cargar = useCallback(async (forzar = false) => {
      if (vigente() && forzar !== true) return;
      setCargando(true);
      setError(false);
      try {
        await cargarGlobal(forzar === true);
      } catch (e) {
        console.error("Error cargando datos", e);
        setError(true);
      } finally {
        setCargando(false);
      }
    }, []);

    const listo = vigente();

    return {
      datos: listo ? cache.datos : null,
      listo,
      cargando,
      error,
      cargadoEn: listo ? cache.cargadoEn : null,
      cargar,
      refrescar: () => cargar(true),
    };
  };

  return { useCache, invalidar };
};

// Método de pago, facturas y planes (tab Plan)
const facturacion = crearCacheUnaVez(async () => {
  const { data } = await api.get("/stripe/facturacion");
  return data?.data || {};
});
export const useFacturacion = facturacion.useCache;
export const invalidarFacturacion = facturacion.invalidar;

// Suscripción, solo si el layout no la entrega por contexto
const suscripcion = crearCacheUnaVez(async () => {
  const { data } = await api.get("/user");
  return data?.data?.usuario?.suscripcion || null;
});
export const useSuscripcionFallback = suscripcion.useCache;