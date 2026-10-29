// src/Home/Dueno.jsx - VERSIÓN CORREGIDA
import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import "./dueno.css";
import api from '../config/api';
import { useSearchParams } from 'react-router-dom';
import { stripeService } from '../services/stripeService';
import PaymentModal from '../components/PaymentModal';
import { useDashboard } from '../contexts/DashboardContext';

// Iconos
import AssignmentIcon from '@mui/icons-material/Assignment';
import WarningIcon from '@mui/icons-material/Warning';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import HistoryIcon from '@mui/icons-material/History';
import CloseIcon from '@mui/icons-material/Close';
import PieChartIcon from '@mui/icons-material/PieChart';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CelebrationIcon from '@mui/icons-material/Celebration';
import AreaChartIcon from '@mui/icons-material/AreaChart';
// import RefreshIcon from '@mui/icons-material/Refresh'; // Solo si activas el toolbar

// ============================================
// HELPERS (fuera del componente: no se recrean en cada render)
// ============================================
const parseFecha = (fecha) => {
  if (!fecha) return null;
  // "YYYY-MM-DD" se interpreta como UTC y en México se ve un día antes.
  // Agregar la hora fuerza interpretación en hora local.
  if (typeof fecha === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
    return new Date(fecha + 'T00:00:00');
  }
  const d = new Date(fecha);
  return isNaN(d.getTime()) ? null : d;
};

const formatFecha = (fecha) => {
  if (!fecha || fecha === 'Invalid Date') return 'Sin pagos';
  // Si ya viene como dd/mm/yyyy desde el backend, se respeta
  if (typeof fecha === 'string' && fecha.includes('/')) return fecha;
  const d = parseFecha(fecha);
  return d ? d.toLocaleDateString('es-MX') : 'Sin pagos';
};

const formatearMoneda = (monto) =>
  new Intl.NumberFormat('es-MX', {
    style: 'currency', currency: 'MXN', minimumFractionDigits: 2
  }).format(Number(monto) || 0);

const formatearPorcentaje = (valor) =>
  new Intl.NumberFormat('es-MX', {
    style: 'percent', minimumFractionDigits: 2, maximumFractionDigits: 2
  }).format((Number(valor) || 0) / 100);

// Eje Y: evita "$0k" cuando el valor es menor a 1,000
const formatEjeY = (val) =>
  Math.abs(val) >= 1000 ? `$${(val / 1000).toFixed(0)}k` : `$${Math.round(val)}`;

const leerRolInicial = () => {
  try {
    const userStr = localStorage.getItem('user');
    if (userStr) return JSON.parse(userStr).rol || 'Empleado';
  } catch (e) { /* ignorar */ }
  return '';
};

const Dueno = () => {
  // ============================================
  // CONTEXTO COMPARTIDO
  // ============================================
  const {
    data,
    cargando,
    error,
    cargar,
    refrescar,
    edadCache,
    invalidado
  } = useDashboard();

  // ============================================
  // TOOLBAR DE REFRESCAR (opcional, ver bloque comentado en el render)
  // ============================================
  const [refrescandoManual, setRefrescandoManual] = useState(false);

  const [, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 60000);
    return () => clearInterval(id);
  }, []);

  const minutosDesde =
    edadCache !== null && edadCache !== undefined ? Math.floor(edadCache / 60000) : null;

  const handleRefrescarManual = async () => {
    setRefrescandoManual(true);
    try {
      await refrescar();
    } finally {
      setTimeout(() => setRefrescandoManual(false), 600);
    }
  };

  // ============================================
  // CARGA INICIAL (solo si el caché no es válido)
  // ============================================
  useEffect(() => {
    cargar();
  }, [cargar]);

  // ============================================
  // EXTRAER DATOS DEL CONTEXTO
  // ============================================
  const dashboardData = data?.dashboard || {
    resumen: {
      empenos_activos: 0, empenos_vencidos: 0, proximos_vencer: 0,
      ingresos_recientes: 0, precio_oro: null,
      total_clientes: 0, prendas_disponibles: 0
    },
    top_clientes: [], top_articulos: [],
    actividad_reciente: [], capital_retorno: []
  };
  const morosidad = data?.morosidad || [];
  const distribucion = data?.distribucion || [];
  const amortizacionesPendientes = data?.amortizaciones || [];

  // ============================================
  // GRÁFICAS: series desde capital_retorno
  // ============================================
  const capitalRetorno = dashboardData.capital_retorno || [];
  const capitalAcumulado = capitalRetorno.map(i => Number(i.capital) || 0);
  const retornoAcumulado = capitalRetorno.map(i => Number(i.retorno) || 0);
  const gananciaAcumulada = capitalRetorno.map(i => Number(i.ganancia) || 0);
  // Ingreso de cada mes (no acumulado) para la gráfica de tendencia
  const retornoMensual = capitalRetorno.map(i => Number(i.retorno_mes) || 0);
  const meses = capitalRetorno.map(i => i.mes);

  // ============================================
  // DETECCIÓN DE PANTALLA
  // ============================================
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const chartHeight = windowWidth < 480 ? 250 : windowWidth < 768 ? 300 : 380;
  const smallChartHeight = windowWidth < 480 ? 200 : windowWidth < 768 ? 250 : 300;

  // ============================================
  // HOOKS DE PAGO
  // ============================================
  const [searchParams] = useSearchParams();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentSessionId, setPaymentSessionId] = useState(null);
  const [paymentPlanName, setPaymentPlanName] = useState('');
  const [paymentPlanId, setPaymentPlanId] = useState(null);

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    const paymentStatus = searchParams.get('payment');
    if (sessionId && paymentStatus === 'success') {
      setPaymentSessionId(sessionId);
      setPaymentPlanName(localStorage.getItem('pending_plan_name') || 'Premium');
      setPaymentPlanId(localStorage.getItem('pending_plan_id'));
      setShowPaymentModal(true);
      window.history.replaceState({}, document.title, '/home');
    }
  }, [searchParams]);

  // ============================================
  // SUSCRIPCIÓN
  // ============================================
  const verificarSuscripcion = async () => {
    const empresaId = localStorage.getItem('empresa_id');
    if (!empresaId) return;
    try {
      const response = await stripeService.checkSubscription(empresaId);
      if (response.fecha_fin_plan === null && response.plan_activo === 1) return;
      if (response.activo) return;
      alert('Tu suscripción ha vencido. Por favor, renueva.');
      window.location.href = '/planes';
    } catch (error) {
      console.error('Error al verificar suscripción:', error);
    }
  };

  useEffect(() => {
    verificarSuscripcion();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ============================================
  // ESTADOS
  // ============================================
  const [showActivos, setShowActivos] = useState(false);
  const [showVencidos, setShowVencidos] = useState(false);
  const [showProximos, setShowProximos] = useState(false);
  const [showPrecioOroModal, setShowPrecioOroModal] = useState(false);
  // Se inicializa desde localStorage para que las gráficas de admin no aparezcan con retraso
  const [userRole, setUserRole] = useState(leerRolInicial);

  const [preciosQuilates, setPreciosQuilates] = useState({
    precio_24k: 0, precio_22k: 0, precio_21k: 0,
    precio_18k: 0, precio_14k: 0, precio_10k: 0,
    ultima_actualizacion: null
  });

  const [empenosActivos, setEmpenosActivos] = useState([]);
  const [empenosVencidos, setEmpenosVencidos] = useState([]);
  const [proximosVencer, setProximosVencer] = useState([]);

  // ============================================
  // GRÁFICAS (configuración)
  // ============================================
  const areaChartOptions = {
    chart: {
      type: 'area',
      stacked: false, // las series ya son acumuladas: apilarlas suma valores sin sentido
      toolbar: {
        show: true,
        tools: {
          download: true, selection: false, zoom: false,
          zoomin: false, zoomout: false, pan: false, reset: false
        }
      },
      zoom: { enabled: false }
    },
    dataLabels: { enabled: false },
    stroke: { curve: 'smooth', width: 2 },
    fill: {
      type: 'gradient',
      gradient: { shadeIntensity: 1, opacityFrom: 0.5, opacityTo: 0.1, stops: [0, 90, 100] }
    },
    xaxis: {
      categories: meses,
      title: { text: 'Mes', style: { fontSize: '11px', fontWeight: 500 } },
      labels: { rotate: -45, style: { fontSize: '10px' }, hideOverlappingLabels: true }
    },
    yaxis: {
      title: { text: '$ (pesos acumulados)', style: { fontSize: '11px', fontWeight: 500 } },
      labels: { formatter: formatEjeY, style: { fontSize: '10px' } }
    },
    colors: ["#1e3a8a", "#10b981", "#f59e0b"],
    tooltip: {
      y: {
        formatter: (val) => new Intl.NumberFormat('es-MX', {
          style: 'currency', currency: 'MXN', minimumFractionDigits: 0
        }).format(val)
      },
      shared: true, intersect: false
    },
    legend: {
      position: 'top', horizontalAlign: 'center', offsetY: 0,
      fontSize: '11px', itemMargin: { horizontal: 8, vertical: 4 }
    },
    grid: {
      borderColor: '#e5e7eb', strokeDashArray: 5,
      padding: { left: 5, right: 5 }
    }
  };

  const areaChartSeries = [
    { name: "Capital Prestado (Acumulado)", data: capitalAcumulado },
    { name: "Pagos Recibidos (Acumulado)", data: retornoAcumulado },
    { name: "Intereses Cobrados (Acumulado)", data: gananciaAcumulada }
  ];

  const trendChartOptions = {
    chart: { type: "line", toolbar: { show: false } },
    xaxis: { categories: meses, title: { text: 'Mes' } },
    yaxis: {
      title: { text: '$ (pesos por mes)' },
      labels: { formatter: formatEjeY }
    },
    colors: ["#10b981"],
    stroke: { width: 3, curve: 'smooth' },
    markers: { size: 4 },
    tooltip: {
      y: { formatter: (val) => formatearMoneda(val) }
    }
  };

  const trendChartSeries = [{ name: "Ingresos del mes", data: retornoMensual }];

  const distribucionSeries = distribucion.map(item => Number(item.total) || 0);
  const distribucionLabels = distribucion.map(item => item.categoria);
  const hayDistribucion = distribucionSeries.some(v => v > 0);

  const categoriaDistribucionOptions = {
    chart: { type: "donut" },
    labels: distribucionLabels,
    colors: ["#1e3a8a", "#3b82f6", "#10b981", "#f59e0b", "#6b7280", "#6366f1"],
    legend: { position: "bottom" },
    plotOptions: {
      pie: {
        donut: {
          size: "65%",
          labels: {
            show: true,
            total: {
              show: true,
              label: "Total",
              formatter: (w) => w.globals.seriesTotals.reduce((a, b) => a + b, 0) + " artículos"
            }
          }
        }
      }
    }
  };

  // ============================================
  // ROLES
  // ============================================
  const esAdmin = () => ['Administrador', 'Dueño', 'Admin'].includes(userRole);
  const esGerente = () => ['Gerente', 'gerente', 'GERENTE'].includes(userRole);
  const puedeVerEvolucionAcumulada = () => esAdmin();
  const puedeVerGraficasBasicas = () => esAdmin() || esGerente();

  // ============================================
  // CARGA SECUNDARIA (rol + precios)
  // ============================================
  const cargarRolUsuario = async () => {
    try {
      const response = await api.get('/user');
      if (response.data.success) {
        const user = response.data.data.usuario;
        localStorage.setItem('user', JSON.stringify(user));
        setUserRole(user.rol || 'Empleado');
      }
    } catch (error) {
      console.error('Error cargando rol:', error);
    }
  };

  const cargarPreciosQuilates = async () => {
    try {
      const response = await api.get('/precio-oro/quilates');
      if (response.data.success) setPreciosQuilates(response.data.data);
    } catch (error) {
      console.error('Error al cargar precios por quilate:', error);
    }
  };

  useEffect(() => {
    cargarRolUsuario();
    cargarPreciosQuilates();
  }, []);

  // ============================================
  // CARGAS DE MODALES
  // ============================================
  const cargarActivos = async () => {
    try {
      const response = await api.get('/home/activos');
      if (response.data.success) {
        setEmpenosActivos(response.data.data);
        setShowActivos(true);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al cargar empeños activos');
    }
  };

  const cargarVencidos = async () => {
    try {
      const response = await api.get('/home/vencidos');
      if (response.data.success) {
        setEmpenosVencidos(response.data.data);
        setShowVencidos(true);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al cargar empeños vencidos');
    }
  };

  const cargarProximos = async () => {
    try {
      const response = await api.get('/home/proximos');
      if (response.data.success) {
        setProximosVencer(response.data.data);
        setShowProximos(true);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al cargar próximos a vencer');
    }
  };

  // ============================================
  // MODAL DE PAGO
  // ============================================
  const limpiarPlanPendiente = () => {
    localStorage.removeItem('pending_plan_id');
    localStorage.removeItem('pending_plan_name');
    localStorage.removeItem('pending_plan_price');
  };

  const handlePaymentSuccess = (data) => {
    console.log('Pago exitoso:', data);
    verificarSuscripcion();
    setTimeout(() => {
      setShowPaymentModal(false);
      limpiarPlanPendiente();
    }, 2000);
  };

  const handleClosePaymentModal = () => {
    setShowPaymentModal(false);
    limpiarPlanPendiente();
  };

  // ============================================
  // LOADING / ERROR
  // ============================================
  // `cargando` empieza en false, así que en el primer render (antes de que corra
  // el useEffect) se pintaba el dashboard vacío con ceros. Mientras no haya datos
  // ni error, se muestra "Cargando...".
  if (!data && !error) {
    return (
      <div className="dashboard">
        <div className="content">
          <div className="loading-container">
            <span className="spinner"></span>
            <span>Cargando...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="dashboard">
        <div className="content">
          <div className="error-container">
            <WarningIcon className="error-icon" />
            <h3>Error de conexión</h3>
            <p>{error}</p>
            <button onClick={() => cargar(true)} className="btn-reintentar">
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  const precioOro = dashboardData.resumen?.precio_oro;

  // ============================================
  // RENDER
  // ============================================
  return (
    <div className="dashboard">
      <div className="content">

        {/* TOOLBAR CON REFRESH (descomenta junto con el import de RefreshIcon)
        <div className="dashboard-toolbar">
          <span className="dashboard-freshness">
            {minutosDesde === null
              ? 'Cargando...'
              : minutosDesde < 1
              ? 'Actualizado ahora mismo'
              : `Actualizado hace ${minutosDesde} min`}
            {invalidado && ' ⚠️'}
          </span>

          <button
            type="button"
            className={`dashboard-btn-refresh ${refrescandoManual ? 'girando' : ''}`}
            onClick={handleRefrescarManual}
            disabled={cargando || refrescandoManual}
            title="Actualizar datos del dashboard"
          >
            <RefreshIcon />
          </button>
        </div> */}

        {/* CARDS */}
        <div className="cards-grid">
          <div className="stat-card" onClick={cargarActivos}>
            <AssignmentIcon className="card-icon" />
            <h3>Empeños Activos</h3>
            <p className="stat-number">{dashboardData.resumen?.empenos_activos || 0}</p>
          </div>

          <div className="stat-card" onClick={cargarVencidos}>
            <WarningIcon className="card-icon" />
            <h3>Empeños Vencidos</h3>
            <p className="stat-number">{dashboardData.resumen?.empenos_vencidos || 0}</p>
          </div>

          <div className="stat-card" onClick={cargarProximos}>
            <AccessTimeIcon className="card-icon" />
            <h3>Próximos a Vencer</h3>
            <p className="stat-number">{dashboardData.resumen?.proximos_vencer || 0}</p>
          </div>

          {/* Sin onClick: el modal de ingresos no existía y usaba datos falsos */}
          <div className="stat-card">
            <AttachMoneyIcon className="card-icon" />
            <h3>Ingresos Recientes</h3>
            <p className="stat-number">{formatearMoneda(dashboardData.resumen?.ingresos_recientes)}</p>
            <small style={{ fontSize: '10px', color: '#666', display: 'block', marginTop: '5px' }}>
              Últimos 15 días
            </small>
          </div>

          <div className="stat-card gold-card" onClick={() => setShowPrecioOroModal(true)}>
            <MonetizationOnIcon className="card-icon" />
            <h3>Precio del Oro</h3>
            <p className="stat-number">
              {precioOro != null ? `$${Number(precioOro).toLocaleString('es-MX')} / gramo` : 'No disponible'}
            </p>
            {dashboardData.resumen?.ultima_actualizacion_oro && (
              <small style={{ fontSize: '10px', color: '#666', display: 'block', marginTop: '5px' }}>
                Actualizado: {new Date(dashboardData.resumen.ultima_actualizacion_oro).toLocaleDateString('es-MX')}
              </small>
            )}
          </div>
        </div>

        {/* GRÁFICAS */}
        {puedeVerEvolucionAcumulada() && (
          <div className="chart-section">
            <h2><AreaChartIcon /> Evolución Acumulada del Año (Capital, Pagos e Intereses)</h2>
            <p className="chart-subtitle">
              Capital prestado vs pagos recibidos vs intereses cobrados, acumulados mes a mes
            </p>
            <div className="chart-wrapper">
              {capitalRetorno.length > 0 ? (
                <Chart options={areaChartOptions} series={areaChartSeries} type="area" height={chartHeight} />
              ) : (
                <div style={{ textAlign: 'center', padding: 40 }}>Sin datos en lo que va del año</div>
              )}
            </div>
          </div>
        )}

        {puedeVerGraficasBasicas() && (
          <div className="nuevas-graficas-grid">
            <div className="grafica-nueva-card">
              <h2><TrendingUpIcon /> Tendencia de Ingresos (por mes)</h2>
              {capitalRetorno.length > 0 ? (
                <Chart options={trendChartOptions} series={trendChartSeries} type="line" height={smallChartHeight} />
              ) : (
                <div style={{ textAlign: 'center', padding: 40 }}>Sin datos</div>
              )}
            </div>

            <div className="grafica-nueva-card">
              <h2><PieChartIcon /> Distribución por Categoría</h2>
              {hayDistribucion ? (
                <Chart options={categoriaDistribucionOptions} series={distribucionSeries} type="donut" height={smallChartHeight} />
              ) : (
                <div style={{ textAlign: 'center', padding: 40 }}>Sin empeños este año</div>
              )}
            </div>
          </div>
        )}

        {/* TOP CLIENTES */}
        <div className="nueva-seccion">
          <h2><EmojiEventsIcon /> Top 5 Clientes (Mayores Ganancias)</h2>
          <div className="tabla-container">
            <table className="tabla-moderna">
              <thead>
                <tr>
                  <th>Cliente</th><th>Empeños</th><th>Monto Prestado</th>
                  <th>Ganancia Generada</th><th>% Ganancia</th><th>Último Empeño</th>
                </tr>
              </thead>
              <tbody>
                {dashboardData.top_clientes?.map(cliente => (
                  <tr key={cliente.id_cliente}>
                    <td><strong>{cliente.nombre}</strong></td>
                    <td>{cliente.empenos}</td>
                    <td>{formatearMoneda(cliente.monto_total)}</td>
                    {/* ?? en lugar de ||: un 0 real no debe reemplazarse por un valor inventado */}
                    <td className="profit-text">{formatearMoneda(cliente.ganancia_generada ?? 0)}</td>
                    <td><span className="profit-badge">+{formatearPorcentaje(cliente.porcentaje_ganancia ?? 0)}</span></td>
                    <td>{formatFecha(cliente.ultimo_empeno)}</td>
                  </tr>
                ))}
                {(!dashboardData.top_clientes || dashboardData.top_clientes.length === 0) && (
                  <tr><td colSpan="6" style={{ textAlign: 'center' }}>No hay datos</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* MOROSIDAD */}
        <div className="nueva-seccion">
          <h2><WarningIcon /> Morosidad - Clientes con Mayor Pérdida</h2>
          <div className="tabla-container">
            <table className="tabla-moderna">
              <thead>
                <tr>
                  <th>Cliente</th><th>Total Prestado</th><th>Deuda Vencida</th>
                  <th>Pérdida Proyectada</th><th>% Pérdida</th><th>Días en Mora</th><th>Último Pago</th>
                </tr>
              </thead>
              <tbody>
                {morosidad.map((item, index) => {
                  let porcentaje = item.porcentaje_perdida ?? ((item.deuda / (item.total_prestado || 1)) * 100);
                  if (porcentaje > 100) porcentaje = 100;
                  return (
                    <tr key={index}>
                      <td><strong>{item.nombre}</strong></td>
                      <td>{formatearMoneda(item.total_prestado)}</td>
                      <td className="loss-text">{formatearMoneda(item.deuda)}</td>
                      <td className="loss-text">{formatearMoneda(item.perdida_proyectada ?? item.deuda)}</td>
                      <td><span className="loss-badge">-{Number(porcentaje).toFixed(2)}%</span></td>
                      <td><span className="badge-danger">{Math.floor(item.dias_mora || 0)} días</span></td>
                      <td>{item.ultimo_pago ? formatFecha(item.ultimo_pago) : 'Sin registro'}</td>
                    </tr>
                  );
                })}
                {morosidad.length === 0 && (
                  <tr><td colSpan="7" style={{ textAlign: 'center' }}>No hay datos de morosidad</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* AMORTIZACIONES */}
        {puedeVerEvolucionAcumulada() && (
          <div className="nueva-seccion">
            <h2>
              <AssignmentIcon /> Amortizaciones Pendientes
              <span className="seccion-badge">Mostrando las {amortizacionesPendientes.length} más antiguas</span>
            </h2>
            <div className="tabla-container">
              <table className="tabla-moderna">
                <thead>
                  <tr>
                    <th>Cliente</th><th>Artículo</th><th>Folio</th><th>N° Pago</th>
                    <th>Fecha Programada</th><th>Monto Total</th><th>Pagado</th>
                    <th>Saldo Restante</th><th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {amortizacionesPendientes.length === 0 ? (
                    <tr><td colSpan="9" style={{ textAlign: 'center' }}>No hay amortizaciones pendientes</td></tr>
                  ) : (
                    amortizacionesPendientes.map((item) => (
                      <tr key={item.id_amortizacion} className={item.dias_atraso > 0 ? 'fila-atrasada' : ''}>
                        <td><strong>{item.cliente_nombre}</strong></td>
                        <td>{item.articulo}</td>
                        <td><span className="folio-badge">{item.folio}</span></td>
                        <td>{item.numero_pago}</td>
                        <td>{formatFecha(item.fecha_pago_programado)}</td>
                        <td className="monto">{formatearMoneda(item.monto_total)}</td>
                        <td className="monto-pagado">{formatearMoneda(item.monto_pagado || 0)}</td>
                        <td className="monto-restante">{formatearMoneda(item.saldo_restante)}</td>
                        <td>
                          {item.dias_atraso > 0 ? (
                            <span className="badge-danger">{item.dias_atraso} días atrasado</span>
                          ) : (
                            <span className="badge-warning">Pendiente</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ARTÍCULOS */}
        <div className="nueva-seccion">
          <h2><LocalOfferIcon /> Artículos Más Empeñados</h2>
          <div className="tabla-container">
            <table className="tabla-moderna">
              <thead>
                <tr><th>Artículo</th><th>Categoría</th><th>Cantidad</th><th>Monto Promedio</th></tr>
              </thead>
              <tbody>
                {dashboardData.top_articulos?.map((articulo, index) => (
                  <tr key={index}>
                    <td><strong>{articulo.nombre}</strong></td>
                    <td>{articulo.categoria}</td>
                    <td>{articulo.cantidad}</td>
                    <td>{formatearMoneda(articulo.monto_promedio)}</td>
                  </tr>
                ))}
                {(!dashboardData.top_articulos || dashboardData.top_articulos.length === 0) && (
                  <tr><td colSpan="4" style={{ textAlign: 'center' }}>No hay datos</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ACTIVIDAD RECIENTE */}
        <div className="nueva-seccion">
          <h2><HistoryIcon /> Actividad Reciente</h2>
          <div className="actividad-lista">
            {dashboardData.actividad_reciente?.map((actividad, index) => (
              <div key={index} className="actividad-item">
                {actividad.tipo === 'pago' ? (
                  <CheckCircleIcon className="actividad-icon success" />
                ) : (
                  <CelebrationIcon className="actividad-icon info" />
                )}
                <div className="actividad-detalle">
                  <p><strong>{actividad.descripcion}</strong></p>
                  <small>{formatFecha(actividad.fecha)}</small>
                </div>
                {actividad.monto != null && (
                  <div className="actividad-monto">{formatearMoneda(actividad.monto)}</div>
                )}
              </div>
            ))}
            {(!dashboardData.actividad_reciente || dashboardData.actividad_reciente.length === 0) && (
              <div style={{ textAlign: 'center', padding: 20 }}>No hay actividad reciente</div>
            )}
          </div>
        </div>
      </div>

      {/* MODALES */}

      {showActivos && (
        <div className="modal-overlay" onClick={() => setShowActivos(false)}>
          <div className="modal-detalle" onClick={(e) => e.stopPropagation()}>
            <button className="modal-cerrar" onClick={() => setShowActivos(false)}><CloseIcon /></button>
            <div className="modal-header">
              <h2><AssignmentIcon /> Empeños Activos</h2>
              <span className="cliente-id">Total: {empenosActivos.length}</span>
            </div>
            <div className="modal-body">
              <div className="tabla-container-modal">
                <table className="tabla-modal">
                  <thead><tr><th>Cliente</th><th>Artículo</th><th>Monto</th><th>Fecha</th></tr></thead>
                  <tbody>
                    {empenosActivos.map(item => (
                      <tr key={item.id_empeno}>
                        <td><strong>{item.cliente}</strong></td>
                        <td>{item.nombre}</td>
                        <td>{formatearMoneda(item.monto)}</td>
                        <td>{formatFecha(item.fecha)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="modal-acciones">
              <button className="btn-cancelar" onClick={() => setShowActivos(false)}>Cerrar</button>
            </div>
          </div>
        </div>
      )}

      {showVencidos && (
        <div className="modal-overlay" onClick={() => setShowVencidos(false)}>
          <div className="modal-detalle" onClick={(e) => e.stopPropagation()}>
            <button className="modal-cerrar" onClick={() => setShowVencidos(false)}><CloseIcon /></button>
            <div className="modal-header">
              <h2><WarningIcon /> Empeños Vencidos</h2>
              <span className="cliente-id">Total: {empenosVencidos.length}</span>
            </div>
            <div className="modal-body">
              <div className="tabla-container-modal">
                <table className="tabla-modal">
                  <thead><tr><th>Cliente</th><th>Artículo</th><th>Monto</th><th>Vencido</th><th>Días</th></tr></thead>
                  <tbody>
                    {empenosVencidos.map(item => (
                      <tr key={item.id_empeno}>
                        <td><strong>{item.cliente}</strong></td>
                        <td>{item.nombre}</td>
                        <td>{formatearMoneda(item.monto)}</td>
                        <td>{formatFecha(item.fecha)}</td>
                        <td><span className="badge-danger">{item.dias} días</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="modal-acciones">
              <button className="btn-cancelar" onClick={() => setShowVencidos(false)}>Cerrar</button>
            </div>
          </div>
        </div>
      )}

      {showProximos && (
        <div className="modal-overlay" onClick={() => setShowProximos(false)}>
          <div className="modal-detalle" onClick={(e) => e.stopPropagation()}>
            <button className="modal-cerrar" onClick={() => setShowProximos(false)}><CloseIcon /></button>
            <div className="modal-header">
              <h2><AccessTimeIcon /> Próximos a Vencer</h2>
              <span className="cliente-id">Total: {proximosVencer.length}</span>
            </div>
            <div className="modal-body">
              <div className="tabla-container-modal">
                <table className="tabla-modal">
                  <thead><tr><th>Cliente</th><th>Artículo</th><th>Monto</th><th>Vence</th><th>Días</th></tr></thead>
                  <tbody>
                    {proximosVencer.map(item => (
                      <tr key={item.id_empeno}>
                        <td><strong>{item.cliente}</strong></td>
                        <td>{item.nombre}</td>
                        <td>{formatearMoneda(item.monto)}</td>
                        <td>{formatFecha(item.fecha)}</td>
                        <td><span className="badge-warning">{item.dias} días</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="modal-acciones">
              <button className="btn-cancelar" onClick={() => setShowProximos(false)}>Cerrar</button>
            </div>
          </div>
        </div>
      )}

      {showPrecioOroModal && (
        <div className="modal-overlay" onClick={() => setShowPrecioOroModal(false)}>
          <div className="modal-detalle modal-oro" onClick={(e) => e.stopPropagation()}>
            <button className="modal-cerrar" onClick={() => setShowPrecioOroModal(false)}><CloseIcon /></button>
            <div className="modal-header oro-header">
              <h2><MonetizationOnIcon /> Precios del Oro por Quilate</h2>
              {preciosQuilates.ultima_actualizacion && (
                <span className="cliente-id">
                  Actualizado: {new Date(preciosQuilates.ultima_actualizacion).toLocaleString('es-MX')}
                </span>
              )}
            </div>
            <div className="modal-body">
              <div className="quilates-grid">
                {[
                  { k: '24k', pureza: '99.9%', precio: preciosQuilates.precio_24k },
                  { k: '22k', pureza: '91.7%', precio: preciosQuilates.precio_22k },
                  { k: '21k', pureza: '87.5%', precio: preciosQuilates.precio_21k },
                  { k: '18k', pureza: '75.0%', precio: preciosQuilates.precio_18k },
                  { k: '14k', pureza: '58.5%', precio: preciosQuilates.precio_14k },
                  { k: '10k', pureza: '41.7%', precio: preciosQuilates.precio_10k }
                ].map(q => (
                  <div className="quilate-card" key={q.k}>
                    <div className="quilate-info"><h3>Oro {q.k}</h3><p>{q.pureza} pureza</p></div>
                    <div className="quilate-precio">
                      <span className="precio">${Number(q.precio || 0).toLocaleString('es-MX')}</span>
                      <span className="unidad">/ gramo</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="oro-nota">
                <small>ℹ️ Los precios son referenciales basados en el precio del oro de 24k.</small>
              </div>
            </div>
            <div className="modal-acciones">
              <button className="btn-cerrar" onClick={() => setShowPrecioOroModal(false)}>Cerrar</button>
            </div>
          </div>
        </div>
      )}

      <PaymentModal
        isOpen={showPaymentModal}
        onClose={handleClosePaymentModal}
        sessionId={paymentSessionId}
        planName={paymentPlanName}
        planId={paymentPlanId}
        onSuccess={handlePaymentSuccess}
      />
    </div>
  );
};

export default Dueno;