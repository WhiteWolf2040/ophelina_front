// src/hooks/useMisEmpenos.js
import { useState, useEffect, useCallback } from 'react';
import MisEmpenosService from '../services/MisEmpenosService';

export function useMisEmpenos() {
    const [empenos, setEmpenos] = useState([]);
    const [resumen, setResumen] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [redirigiendoPago, setRedirigiendoPago] = useState(false);

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

    // Inicia el abono: crea la sesión de Stripe y redirige al checkout
    const iniciarAbono = async (idEmpeno, monto) => {
        setRedirigiendoPago(true);
        try {
            const result = await MisEmpenosService.crearSesionAbono(idEmpeno, monto);
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
    };
}