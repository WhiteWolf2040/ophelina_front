import { useEffect, useState } from "react";
import api from "../config/api";

/*
  Hooks de "carga una sola vez":
  - La primera pantalla que pide los datos hace la petición.
  - Las demás reutilizan el resultado guardado (caché compartido en memoria).
  - Si dos componentes piden lo mismo a la vez, solo se hace UNA petición.
  - refrescar() / cargar(true) fuerzan una petición nueva.
*/

const caches = [];

function crearCarga(obtener) {
  const store = {
    datos: null,
    listo: false,
    cargando: false,
    error: null,
    cargadoEn: null,
    promesa: null,
  };
  const oyentes = new Set();
  const avisar = () => oyentes.forEach((fn) => fn({ ...store }));

  const cargar = (forzar = false) => {
    if (store.promesa) return store.promesa; // ya hay una petición en curso
    if (store.listo && !forzar) return Promise.resolve(store.datos); // ya está en caché

    store.cargando = true;
    store.error = null;
    avisar();

    store.promesa = obtener()
      .then((datos) => {
        store.datos = datos;
        store.listo = true;
        store.cargadoEn = Date.now();
        return datos;
      })
      .catch((err) => {
        store.error = err;
        console.error("Error al cargar datos:", err);
        return null;
      })
      .finally(() => {
        store.cargando = false;
        store.promesa = null;
        avisar();
      });

    return store.promesa;
  };

  const limpiar = () => {
    store.datos = null;
    store.listo = false;
    store.cargando = false;
    store.error = null;
    store.cargadoEn = null;
    store.promesa = null;
    avisar();
  };

  caches.push(limpiar);

  return function useCarga() {
    const [estado, setEstado] = useState({ ...store });

    useEffect(() => {
      oyentes.add(setEstado);
      setEstado({ ...store }); // por si cambió entre el render y el efecto
      return () => oyentes.delete(setEstado);
    }, []);

    return {
      datos: estado.datos,
      listo: estado.listo,
      cargando: estado.cargando,
      error: estado.error,
      cargadoEn: estado.cargadoEn,
      cargar,
      refrescar: () => cargar(true),
    };
  };
}

// Algunas respuestas vienen como { success, data: {...} } y otras directas
const desenvolver = (resp) => {
  const cuerpo = resp?.data;
  return cuerpo && typeof cuerpo === "object" && !Array.isArray(cuerpo) && cuerpo.data && typeof cuerpo.data === "object"
    ? cuerpo.data
    : cuerpo;
};

// Facturación: método de pago, facturas y planes disponibles (GET /stripe/facturacion)
export const useFacturacion = crearCarga(async () => desenvolver(await api.get("/stripe/facturacion")));

// Suscripción de respaldo: se toma de GET /user cuando el contexto no la trae
export const useSuscripcionFallback = crearCarga(async () => {
  const resp = await api.get("/user");
  return desenvolver(resp)?.usuario?.suscripcion ?? null;
});

// Llamar al cerrar sesión para que otro usuario no vea datos en caché de la empresa anterior
export const limpiarCargas = () => caches.forEach((limpiar) => limpiar());