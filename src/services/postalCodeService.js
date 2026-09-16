// src/services/postalCodeService.js
import axios from 'axios';

/**
 * Busca un código postal con la API de Postali.
 * Regresa: { ciudad, estado, colonias: [{ colonia_id, colonia }], codigo_postal }
 * o null si no se encontró.
 */
export const buscarCodigoPostal = async (cp) => {
  try {
    const response = await axios.get(`https://postali.app/api/v1/mx/cp/${cp}`);
    const data = response.data;

    const asentamientos = data.asentamientos || [];

    if (asentamientos.length === 0) {
      return null;
    }

    const colonias = asentamientos.map((a, index) => ({
      colonia_id: index,
      colonia: a.nombre
    }));

    return {
      ciudad: data.municipio || '',
      estado: data.estado || '',
      colonias,
      codigo_postal: data.cp || cp
    };
  } catch (error) {
    console.error('Error en API Postali:', error);
    return null;
  }
};