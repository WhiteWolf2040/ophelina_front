// src/services/MisEmpenosService.js
import api from '../config/api';

const MisEmpenosService = {
    // Listado de empeños del cliente autenticado
    getMisEmpenos: async () => {
        try {
            const response = await api.get('/mis-empenos');
            return response.data;
        } catch (error) {
            console.error('Error en getMisEmpenos:', error);
            throw error;
        }
    },

    // Resumen/estadísticas
    getResumen: async () => {
        try {
            const response = await api.get('/mis-empenos/resumen');
            return response.data;
        } catch (error) {
            console.error('Error en getResumen:', error);
            throw error;
        }
    },

    // Detalle de un empeño específico
    getDetalle: async (id) => {
        try {
            const response = await api.get(`/mis-empenos/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error en getDetalle:', error);
            throw error;
        }
    },

    // ✅ Obtener cotización para un empeño específico (capital, interés, IVA, mora, refrendo)
    obtenerCotizacion: async (idEmpeno) => {
        try {
            const response = await api.get(`/abonos/${idEmpeno}/cotizacion`);
            return response.data;
        } catch (error) {
            console.error('Error en obtenerCotizacion:', error);
            throw error;
        }
    },

    // ✅ Crear sesión de pago en Stripe para abonar o refrendar un empeño
    // tipo: 'abono' (monto libre) o 'refrendo' (monto fijo = interés + IVA del periodo completo)
    crearSesionAbono: async (idEmpeno, monto = null, tipo = 'abono') => {
        try {
            const body = { tipo };
            // Solo enviar monto si es abono y se proporcionó
            if (tipo === 'abono' && monto !== null && monto !== undefined) {
                body.monto = monto;
            }
            const response = await api.post(`/abonos/${idEmpeno}/sesion-pago`, body);
            return response.data;
        } catch (error) {
            console.error('Error en crearSesionAbono:', error);
            throw error;
        }
    },
};

export default MisEmpenosService;