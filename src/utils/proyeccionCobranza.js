// src/utils/proyeccionCobranza.js

/**
 * Calcula la proyección de cobranza a 30 días
 * @param {Array} amortizaciones - Array de amortizaciones pendientes
 * @returns {Object} { por_cobrar_30d, cuotas_vencen_30d, en_riesgo, ya_atrasado }
 */
export const calcularProyeccionCobranza = (amortizaciones = []) => {
  // Valores por defecto
  const resultado = {
    por_cobrar_30d: 0,
    cuotas_vencen_30d: 0,
    en_riesgo: 0,
    ya_atrasado: 0,
    por_cobrar_60d: 0,      // bonus: 60 días
    por_cobrar_90d: 0       // bonus: 90 días
  };

  if (!amortizaciones || amortizaciones.length === 0) {
    return resultado;
  }

  // ============================================
  // FECHAS
  // ============================================
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  const en30d = new Date(hoy);
  en30d.setDate(hoy.getDate() + 30);

  const en60d = new Date(hoy);
  en60d.setDate(hoy.getDate() + 60);

  const en90d = new Date(hoy);
  en90d.setDate(hoy.getDate() + 90);

  // ============================================
  // RECORRER AMORTIZACIONES
  // ============================================
  amortizaciones.forEach(a => {
    const fechaPago = new Date(a.fecha_pago_programado);
    fechaPago.setHours(0, 0, 0, 0);

    const saldo = parseFloat(a.saldo_restante || 0);
    const diasAtraso = Number(a.dias_atraso || 0);

    // 1. POR COBRAR EN 30 DÍAS (fechas futuras dentro de 30 días)
    if (fechaPago >= hoy && fechaPago <= en30d) {
      resultado.por_cobrar_30d += saldo;
      resultado.cuotas_vencen_30d += 1;
    }

    // 2. POR COBRAR EN 60 DÍAS
    if (fechaPago >= hoy && fechaPago <= en60d) {
      resultado.por_cobrar_60d += saldo;
    }

    // 3. POR COBRAR EN 90 DÍAS
    if (fechaPago >= hoy && fechaPago <= en90d) {
      resultado.por_cobrar_90d += saldo;
    }

    // 4. EN RIESGO (atrasadas pero recuperables: 1-60 días)
    if (diasAtraso > 0 && diasAtraso <= 60) {
      resultado.en_riesgo += saldo;
    }

    // 5. YA ATRASADO (más de 60 días sin pagar)
    if (diasAtraso > 60) {
      resultado.ya_atrasado += saldo;
    }
  });

  // Redondear a 2 decimales
  Object.keys(resultado).forEach(key => {
    if (typeof resultado[key] === 'number') {
      resultado[key] = Math.round(resultado[key] * 100) / 100;
    }
  });

  
  return resultado;
};