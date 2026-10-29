// src/hooks/useTienda.js
// Productos y estadísticas de la tienda, con caché por combinación de filtros.
import { useState, useEffect, useCallback, useRef } from 'react';
import TiendaService from '../services/TiendaService';
import { useDashboard } from '../contexts/DashboardContext';

const TTL = 5 * 60 * 1000; // 5 minutos

const FILTROS_INICIALES = {
    busqueda: '',
    categoria: 'Todas',
    estado: 'Todos',
    solo_visibles: false
};

const claveProductos = (f) => `tienda:productos:${JSON.stringify(f)}`;
const CLAVE_STATS = 'tienda:stats';

export function useTienda() {
    const { getCache, setCache, invalidarCache } = useDashboard();

    // Si ya hay caché de la visita anterior, arrancamos con ella y sin spinner
    const [productos, setProductos] = useState(
        () => getCache(claveProductos(FILTROS_INICIALES))?.data ?? { data: [], total: 0 }
    );
    const [estadisticas, setEstadisticas] = useState(
        () => getCache(CLAVE_STATS)?.data ?? null
    );
    const [loading, setLoading] = useState(
        () => !getCache(claveProductos(FILTROS_INICIALES))
    );
    const [error, setError] = useState(null);
    const [filtros, setFiltrosState] = useState(FILTROS_INICIALES);

    // Evita que una respuesta lenta pise a una más reciente
    const requestIdRef = useRef(0);

    // Solo cambia el estado si los filtros realmente son distintos
    // (evita una segunda carga idéntica cuando el componente sincroniza filtros al montar)
    const setFiltros = useCallback((nuevos) => {
        setFiltrosState((prev) => {
            const siguiente = typeof nuevos === 'function' ? nuevos(prev) : nuevos;
            return JSON.stringify(prev) === JSON.stringify(siguiente) ? prev : siguiente;
        });
    }, []);

    // Cargar productos.
    // cargarProductos()                      → con spinner (carga forzada)
    // cargarProductos({ silencioso: true })  → sin spinner (refresco en segundo plano)
    const cargarProductos = useCallback(async (opciones) => {
        const silencioso = opciones?.silencioso === true;
        const miPeticion = ++requestIdRef.current;

        try {
            if (!silencioso) setLoading(true);
            setError(null);

            const data = await TiendaService.getProductos(filtros);
            setCache(claveProductos(filtros), data);

            if (miPeticion !== requestIdRef.current) return;
            setProductos(data);
        } catch (err) {
            if (miPeticion !== requestIdRef.current) return;
            console.error('Error al cargar productos:', err);
            // En refresco silencioso conservamos lo que ya se ve en pantalla
            if (!silencioso) {
                setError(err.response?.data?.message || err.message || 'Error al cargar productos');
            }
        } finally {
            if (miPeticion === requestIdRef.current) setLoading(false);
        }
    }, [filtros, setCache]);

    // Cargar estadísticas (sin spinner: se muestra la caché mientras llega lo nuevo)
    const cargarEstadisticas = useCallback(async () => {
        try {
            const data = await TiendaService.getEstadisticas();
            setEstadisticas(data);
            setCache(CLAVE_STATS, data);
        } catch (err) {
            console.error('Error al cargar estadísticas:', err);
        }
    }, [setCache]);

    // Al montar y cuando cambian los filtros: usa caché si existe;
    // si está vencida, muestra lo que hay y refresca en segundo plano
    useEffect(() => {
        const cache = getCache(claveProductos(filtros));
        if (cache) {
            requestIdRef.current++; // ignora respuestas pendientes de otros filtros
            setProductos(cache.data);
            setLoading(false);
            setError(null);
            if (Date.now() - cache.timestamp >= TTL) {
                cargarProductos({ silencioso: true });
            }
        } else {
            cargarProductos();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cargarProductos]);

    // Tras cualquier cambio: invalida las demás variantes de filtros y refresca la actual
    const refrescarTras = async ({ estadisticas: conStats = true, reportes = false } = {}) => {
        invalidarCache('tienda:productos');
        if (reportes) invalidarCache('reportes');
        await cargarProductos({ silencioso: true });
        if (conStats) await cargarEstadisticas();
    };

    // CRUD
    const crearProducto = async (data) => {
        const result = await TiendaService.crearProducto(data);
        await refrescarTras({ reportes: true });
        return result;
    };

    const actualizarProducto = async (id, data) => {
        const result = await TiendaService.actualizarProducto(id, data);
        await refrescarTras({ reportes: true });
        return result;
    };

    const toggleVisibilidad = async (id) => {
        const result = await TiendaService.toggleVisibilidad(id);
        await refrescarTras(); // también actualiza los contadores de visibles/ocultos
        return result;
    };

    const toggleDestacado = async (id) => {
        const result = await TiendaService.toggleDestacado(id);
        await refrescarTras(); // también actualiza el contador de destacados
        return result;
    };

    const eliminarProducto = async (id) => {
        const result = await TiendaService.eliminarProducto(id);
        await refrescarTras({ reportes: true });
        return result;
    };

    // Publicación automática
    const ejecutarPublicacionAutomatica = async (diasGracia = 5) => {
        const result = await TiendaService.ejecutarPublicacionAutomatica(diasGracia);
        await refrescarTras({ reportes: true });
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