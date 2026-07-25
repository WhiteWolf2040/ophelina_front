// src/services/MisEmpenosService.js
import api from '../config/api';

const MisEmpenosService = {
    // Listado de empeños del cliente autenticado
    getMisEmpenos: async () => {
        const response = await api.get('/cliente/empenos');
        return response.data;
    },

    // Resumen/estadísticas
    getResumen: async () => {
        const response = await api.get('/cliente/empenos/resumen');
        return response.data;
    },

    // Detalle de un empeño específico
    getDetalle: async (id) => {
        const response = await api.get(`/cliente/empenos/${id}`);
        return response.data;
    },

    // Crear sesión de pago en Stripe para abonar o prorrogar un empeño.
    // monto es opcional (solo aplica para tipo='abono'; si no se manda,
    // el backend sugiere el saldo pendiente). Para tipo='prorroga' el
    // backend ignora `monto` y calcula el cobro real (interés + IVA).
    // ✅ NUEVO: se agrega `tipo` al body para que el backend sepa si es
    // un abono normal o una prórroga.
    crearSesionAbono: async (idEmpeno, monto = null, tipo = 'abono') => {
        const body = { tipo };
        if (monto !== null) {
            body.monto = monto;
        }
        const response = await api.post(`/empenos/${idEmpeno}/abono`, body);
        return response.data;
    },
};

export default MisEmpenosService;