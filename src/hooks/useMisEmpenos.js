// src/hooks/useMisEmpenos.js
import { useState, useEffect, useCallback } from 'react';
import MisEmpenosService from '../services/MisEmpenosService';

export function useMisEmpenos() {
    const [empenos, setEmpenos] = useState([]);
    const [resumen, setResumen] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [redirigiendoPago, setRedirigiendoPago] = useState(false);

    // ✅ NUEVO: cotización (capital/interés/mora/IVA) del empeño que se está pagando
    const [cotizacion, setCotizacion] = useState(null);
    const [cargandoCotizacion, setCargandoCotizacion] = useState(false);
    const [errorCotizacion, setErrorCotizacion] = useState(null);

    const cargarCotizacion = useCallback(async (idEmpeno) => {
        setCargandoCotizacion(true);
        setErrorCotizacion(null);
        setCotizacion(null);
        try {
            const result = await MisEmpenosService.obtenerCotizacion(idEmpeno);
            if (result.success) {
                setCotizacion(result.data);
            } else {
                setErrorCotizacion(result.message || 'No se pudo calcular la cotización');
            }
        } catch (err) {
            setErrorCotizacion(err.response?.data?.message || err.message || 'No se pudo calcular la cotización');
        } finally {
            setCargandoCotizacion(false);
        }
    }, []);

    const cargarEmpenos = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await MisEmpenosService.getMisEmpenos();
            setEmpenos(data.data || []);
        } catch (err) {
            console.error('Error al cargar empeños:', err);
            setError(err.response?.data?.message || err.message || 'Error al cargar tus empeños');
        } finally {
            setLoading(false);
        }
    }, []);

    const cargarResumen = useCallback(async () => {
        try {
            const data = await MisEmpenosService.getResumen();
            setResumen(data);
        } catch (err) {
            console.error('Error al cargar resumen:', err);
        }
    }, []);

    useEffect(() => {
        cargarEmpenos();
        cargarResumen();
    }, [cargarEmpenos, cargarResumen]);

    // Inicia el abono O la prórroga: crea la sesión de Stripe y redirige al checkout.
    // ✅ NUEVO parámetro `tipo`: 'abono' (default, monto libre elegido por el
    // cliente) o 'prorroga' (monto fijo = intereses + IVA, extiende el
    // vencimiento 30 días). Para 'prorroga' el monto se ignora: lo calcula
    // y lo regresa el backend (ver AbonoController::crearSesionPago).
    const iniciarAbono = async (idEmpeno, monto, tipo = 'abono') => {
        setRedirigiendoPago(true);
        try {
            const result = await MisEmpenosService.crearSesionAbono(idEmpeno, monto, tipo);
            if (result.success && result.data?.checkout_url) {
                window.location.href = result.data.checkout_url;
            } else {
                throw new Error(result.message || 'No se pudo iniciar el pago');
            }
        } catch (err) {
            setRedirigiendoPago(false);
            throw err;
        }
    };

    return {
        empenos,
        resumen,
        loading,
        error,
        redirigiendoPago,
        cargarEmpenos,
        cargarResumen,
        iniciarAbono,
        cotizacion,
        cargandoCotizacion,
        errorCotizacion,
        cargarCotizacion,
    };
}