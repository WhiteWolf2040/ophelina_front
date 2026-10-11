    // src/utils/healthScore.js

/**
 * Calcula el Health Score del negocio (0-100)
 * @param {Object} data - Datos completos de /home/completo
 * @returns {Object} { total, nivel, color, factores }
 */
export const calcularHealthScore = (data) => {
  if (!data?.dashboard?.resumen) {
    return {
      total: 0,
      nivel: 'Sin datos',
      color: '#9ca3af',
      factores: { cartera_sana: 0, morosidad: 0, liquidez: 0, tendencia: 0 }, detalles: {
        activos: 0,
        vencidos: 0,
        capital_total: 0,
        perdida_total: 0,
        proximos_30d: 0,
        tasa_perdida: '0.0' }
    };
  }

  const resumen = data.dashboard.resumen;

  // ============================================
  // FACTOR 1: CARTERA SANA (30 puntos)
  // ============================================
  const activos = resumen.empenos_activos || 0;
  const vencidos = resumen.empenos_vencidos || 0;
  const total = activos + vencidos;

  const ratioCartera = total > 0 ? (activos / total) : 0;
  const scoreCartera = Math.round(ratioCartera * 100);

  // ============================================
  // FACTOR 2: MOROSIDAD (25 puntos)
  // ============================================
  const perdida = resumen.perdida_total || 0;
  // capital prestado = suma de capital de capital_retorno
  const capitalRetorno = data.dashboard.capital_retorno || [];
  const capitalTotal = capitalRetorno.length > 0
    ? capitalRetorno[capitalRetorno.length - 1].capital
    : 0;

  const tasaPerdida = capitalTotal > 0 ? (perdida / capitalTotal) : 0;

  let scoreMorosidad;
  if (tasaPerdida === 0)        scoreMorosidad = 100;
  else if (tasaPerdida < 0.10)  scoreMorosidad = 80;
  else if (tasaPerdida < 0.25)  scoreMorosidad = 60;
  else if (tasaPerdida < 0.50)  scoreMorosidad = 40;
  else if (tasaPerdida < 0.75)  scoreMorosidad = 20;
  else                          scoreMorosidad = 0;

  // ============================================
  // FACTOR 3: LIQUIDEZ (25 puntos)
  // ============================================
  const amortizaciones = data.amortizaciones || [];
  const hoy = new Date();
  const en30dias = new Date();
  en30dias.setDate(hoy.getDate() + 30);

  const proximos30d = amortizaciones
    .filter(a => {
      const fecha = new Date(a.fecha_pago_programado);
      return fecha >= hoy && fecha <= en30dias;
    })
    .reduce((sum, a) => sum + parseFloat(a.saldo_restante || 0), 0);

  const ratioLiquidez = capitalTotal > 0 ? (proximos30d / capitalTotal) : 0;

  let scoreLiquidez;
  if (ratioLiquidez > 0.40)       scoreLiquidez = 100;
  else if (ratioLiquidez > 0.25)  scoreLiquidez = 80;
  else if (ratioLiquidez > 0.15)  scoreLiquidez = 60;
  else if (ratioLiquidez > 0.08)  scoreLiquidez = 40;
  else if (ratioLiquidez > 0.03)  scoreLiquidez = 20;
  else                            scoreLiquidez = 0;

  // ============================================
  // FACTOR 4: TENDENCIA (20 puntos)
  // ============================================
  const meses = capitalRetorno.slice(-3); // últimos 3 meses
  let scoreTendencia = 60; // estable por defecto

  if (meses.length >= 2) {
    const gananciaActual = meses[meses.length - 1].ganancia || 0;
    const gananciaAnterior = meses[meses.length - 2].ganancia || 0;

    if (gananciaAnterior > 0) {
      const ratio = gananciaActual / gananciaAnterior;
      if (ratio > 1.10)       scoreTendencia = 100;
      else if (ratio > 1.00)  scoreTendencia = 80;
      else if (ratio > 0.90)  scoreTendencia = 60;
      else if (ratio > 0.75)  scoreTendencia = 40;
      else if (ratio > 0.50)  scoreTendencia = 20;
      else                    scoreTendencia = 0;
    }
  }

  // ============================================
  // SCORE TOTAL (ponderado)
  // ============================================
  const totalScore = Math.round(
    (scoreCartera * 0.30) +
    (scoreMorosidad * 0.25) +
    (scoreLiquidez * 0.25) +
    (scoreTendencia * 0.20)
  );

  // ============================================
  // NIVEL Y COLOR
  // ============================================
  let nivel, color;
  if (totalScore >= 80)      { nivel = 'Excelente';   color = '#10b981'; }
  else if (totalScore >= 60) { nivel = 'Bueno';       color = '#22c55e'; }
  else if (totalScore >= 40) { nivel = 'Regular';     color = '#f59e0b'; }
  else if (totalScore >= 20) { nivel = 'En riesgo';   color = '#f97316'; }
  else                       { nivel = 'Crítico';     color = '#dc2626'; }

  return {
    total: totalScore,
    nivel,
    color,
    factores: {
      cartera_sana: scoreCartera,
      morosidad: scoreMorosidad,
      liquidez: scoreLiquidez,
      tendencia: scoreTendencia
    },
    detalles: {
      activos,
      vencidos,
      capital_total: capitalTotal,
      perdida_total: perdida,
      proximos_30d: proximos30d,
      tasa_perdida: (tasaPerdida * 100).toFixed(1)
    }
  };
};