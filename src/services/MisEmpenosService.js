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

    // Crear sesión de pago en Stripe para abonar a un empeño
    // monto es opcional: si no se manda, el backend sugiere el saldo pendiente
    crearSesionAbono: async (idEmpeno, monto = null) => {
        const body = monto !== null ? { monto } : {};
        const response = await api.post(`/empenos/${idEmpeno}/abono`, body);
        return response.data;
    },
};

export default MisEmpenosService;