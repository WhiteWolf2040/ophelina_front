import api from '../config/api';

const ApartadosAdminService = {
    // SCRUM-355: ahora acepta un término de búsqueda opcional
    getApartados: async (buscar = "") => {
        const response = await api.get('/tienda/apartados-admin', {
            params: buscar ? { buscar } : {},
        });
        return response.data;
    },

    // SCRUM-357: ahora también manda el monto pagado y el método de pago
    marcarEntregado: async (idApartado, codigoEntrega, montoPagado, metodoPago) => {
        const response = await api.post(`/tienda/apartados-admin/${idApartado}/entregar`, {
            codigo_entrega: codigoEntrega,
            monto_pagado: montoPagado,
            metodo_pago: metodoPago,
        });
        return response.data;
    },
};

export default ApartadosAdminService;