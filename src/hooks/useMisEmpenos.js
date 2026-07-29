// src/hooks/useMisEmpenos.js
import { useState, useEffect, useCallback } from 'react';
import MisEmpenosService from '../services/MisEmpenosService';

export function useMisEmpenos() {
    const [empenos, setEmpenos] = useState([]);
    const [resumen, setResumen] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [redirigiendoPago, setRedirigiendoPago] = useState(false);

    // ✅ Cotización (capital/interés/mora/IVA) del empeño que se está pagando
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
                // ✅ Asegurar que todos los valores numéricos vengan como números
                const data = result.data;
                setCotizacion({
                    capital: Number(data.capital) || 0,
                    interes: Number(data.interes) || 0,
                    iva_interes: Number(data.iva_interes) || 0,
                    mora: Number(data.mora) || 0,
                    dias_atraso: Number(data.dias_atraso) || 0,
                    saldo_pendiente: Number(data.saldo_pendiente) || 0,
                    saldo_pendiente_con_mora: Number(data.saldo_pendiente_con_mora) || 0,
                    plazo_meses: Number(data.plazo_meses) || 1,
                    tasa_porcentaje: Number(data.tasa_porcentaje) || 15,
                    aplica_refrendo: data.aplica_refrendo || false,
                    monto_refrendo: Number(data.monto_refrendo) || 0,
                    refrendos_pagados: Number(data.refrendos_pagados) || 0,
                    refrendos_permitidos: Number(data.refrendos_permitidos) || 0,
                    fecha_vencimiento_actual: data.fecha_vencimiento_actual || '',
                    nueva_fecha_vencimiento: data.nueva_fecha_vencimiento || '',
                });
            } else {
                setErrorCotizacion(result.message || 'No se pudo calcular la cotización');
            }
        } catch (err) {
            console.error('Error al cargar cotización:', err);
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
            // ✅ Asegurar que los empeños tengan valores numéricos
            const empenosData = (data.data || []).map(emp => ({
                ...emp,
                prestadoNumerico: Number(emp.prestadoNumerico) || 0,
                intereses: Number(emp.intereses) || 0,
                totalPagarNumerico: Number(emp.totalPagarNumerico) || 0,
                moraNumerica: Number(emp.moraNumerica) || 0,
                saldoRestanteNumerico: Number(emp.saldoRestanteNumerico) || 0,
                plazoMeses: Number(emp.plazoMeses) || 1,
                tasaPorcentaje: Number(emp.tasaPorcentaje) || 15,
            }));
            setEmpenos(empenosData);
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

    /**
     * Inicia el pago (abono o refrendo) creando la sesión de Stripe y redirigiendo al checkout.
     * 
     * @param {number} idEmpeno - ID del empeño
     * @param {number|null} monto - Monto a abonar (solo para 'abono')
     * @param {string} tipo - 'abono' o 'refrendo'
     */
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