import api from '../config/api';

const ApartadosAdminService = {
    getApartados: async () => {
        const response = await api.get('/tienda/apartados-admin');
        return response.data;
    },

    marcarEntregado: async (idApartado, codigoEntrega) => {
        const response = await api.post(`/tienda/apartados-admin/${idApartado}/entregar`, {
            codigo_entrega: codigoEntrega,
        });
        return response.data;
    },
};

export default ApartadosAdminService;