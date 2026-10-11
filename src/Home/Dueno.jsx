// src/Home/Dueno.jsx - VERSIÓN COMPLETA CON TOOLBAR REFRESCAR
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
import RefreshIcon from '@mui/icons-material/Refresh'; // ✅ NUEVO

const Dueno = () => {
  // ============================================
  // CONTEXTO COMPARTIDO
  // ============================================
  const {
    data,
    cargando,
    error,
    cargar,
    refrescar,           // ✅ NUEVO
    edadCache,           // ✅ NUEVO
    cacheEsValido,       // ✅ NUEVO
    invalidado,          // ✅ NUEVO
    ultimaActualizacion  // ✅ NUEVO
  } = useDashboard();

  // ============================================
  // ✅ NUEVO: ESTADOS LOCALES DEL TOOLBAR
  // ============================================
  const [refrescandoManual, setRefrescandoManual] = useState(false);

  // Tick para forzar re-render cada 60s (para "hace X min")
  const [, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 60000);
    return () => clearInterval(id);
  }, []);

  // Minutos desde la última actualización
  const minutosDesde =
    edadCache !== null ? Math.floor(edadCache / 60000) : null;

  // Handler del botón refrescar
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
      ingresos_recientes: 0, precio_oro: 850,
      total_clientes: 0, prendas_disponibles: 0
    },
    top_clientes: [], top_articulos: [],
    actividad_reciente: [], capital_retorno: []
  };
  const morosidad = data?.morosidad || [];
  const distribucion = data?.distribucion || [];
  const amortizacionesPendientes = data?.amortizaciones || [];

  // ============================================
  // GRÁFICAS: construir series desde capital_retorno
  // ============================================
  const capitalRetorno = dashboardData.capital_retorno || [];
  const capitalAcumulado = capitalRetorno.map(i => Number(i.capital));
  const retornoAcumulado = capitalRetorno.map(i => Number(i.retorno));
  const gananciaAcumulada = capitalRetorno.map(i => Number(i.ganancia));
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
  }, []);

  // ============================================
  // ESTADOS
  // ============================================
  const [showActivos, setShowActivos] = useState(false);
  const [showVencidos, setShowVencidos] = useState(false);
  const [showProximos, setShowProximos] = useState(false);
  const [showIngresos, setShowIngresos] = useState(false);
  const [showPrecioOroModal, setShowPrecioOroModal] = useState(false);
  const [userRole, setUserRole] = useState('');

  const [preciosQuilates, setPreciosQuilates] = useState({
    precio_24k: 0, precio_22k: 0, precio_21k: 0,
    precio_18k: 0, precio_14k: 0, precio_10k: 0,
    ultima_actualizacion: null
  });

  const [empenosActivos, setEmpenosActivos] = useState([]);
  const [empenosVencidos, setEmpenosVencidos] = useState([]);
  const [proximosVencer, setProximosVencer] = useState([]);
  const [ingresosRecientes, setIngresosRecientes] = useState([]);

  // ============================================
  // GRÁFICAS (configuración estática)
  // ============================================
  const areaChartOptions = {
    chart: {
      type: 'area', stacked: true,
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
      gradient: { shadeIntensity: 1, opacityFrom: 0.7, opacityTo: 0.3, stops: [0, 90, 100] }
    },
    xaxis: {
      categories: meses,
      title: { text: 'Mes', style: { fontSize: '11px', fontWeight: 500 } },
      labels: { rotate: -45, style: { fontSize: '10px' }, hideOverlappingLabels: true },
      tickAmount: 5
    },
    yaxis: {
      title: { text: '$ (pesos acumulados)', style: { fontSize: '11px', fontWeight: 500 } },
      labels: { formatter: (val) => `$${(val / 1000).toFixed(0)}k`, style: { fontSize: '10px' } }
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
    { name: "Retorno (Pagos Acumulados)", data: retornoAcumulado },
    { name: "Ganancia (Acumulada)", data: gananciaAcumulada }
  ];

  const trendChartOptions = {
    chart: { type: "line", toolbar: { show: false } },
    xaxis: { categories: meses, title: { text: 'Mes' } },
    yaxis: {
      title: { text: '$ (pesos)' },
      labels: { formatter: (val) => `$${(val / 1000).toFixed(0)}k` }
    },
    colors: ["#10b981"],
    stroke: { width: 3, curve: 'smooth' },
    tooltip: { y: { formatter: (val) => `$${val.toLocaleString()}` } }
  };

  const trendChartSeries = [{ name: "Retorno Total", data: retornoAcumulado }];

  const distribucionSeries = distribucion.map(item => item.total);
  const distribucionLabels = distribucion.map(item => item.categoria);

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
  // FUNCIONES AUXILIARES
  // ============================================
  const formatearMoneda = (monto) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency', currency: 'MXN', minimumFractionDigits: 2
    }).format(monto || 0);
  };

  const formatearPorcentaje = (valor) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'percent', minimumFractionDigits: 2, maximumFractionDigits: 2
    }).format((valor || 0) / 100);
  };

  const formatFecha = (fecha) => {
    if (!fecha || fecha === '' || fecha === 'Invalid Date') return 'Sin pagos';
    try {
      if (typeof fecha === 'string' && fecha.includes('/')) return fecha;
      const date = new Date(fecha);
      if (isNaN(date.getTime())) return 'Sin pagos';
      return date.toLocaleDateString('es-MX');
    } catch (e) {
      return 'Sin pagos';
    }
  };

  // ============================================
  // ROLES
  // ============================================
  const esAdmin = () => userRole === 'Administrador' || userRole === 'Dueño' || userRole === 'Admin';
  const esGerente = () => userRole === 'Gerente' || userRole === 'gerente' || userRole === 'GERENTE';
  const puedeVerEvolucionAcumulada = () => esAdmin();
  const puedeVerGraficasBasicas = () => esAdmin() || esGerente();

  // ============================================
  // CARGA SECUNDARIA (rol + precios)
  // ============================================
  const cargarRolUsuario = async () => {
    try {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        setUserRole(user.rol || 'Empleado');
      }
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

  const cargarIngresos = async () => {
    try {
      setIngresosRecientes([
        { id: 1, concepto: "Pago de Juan Pérez", monto: 5000, fecha: "10/03/2024" },
        { id: 2, concepto: "Pago de María García", monto: 3500, fecha: "09/03/2024" }
      ]);
      setShowIngresos(true);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // ============================================
  // MODAL DE PAGO
  // ============================================
  const handlePaymentSuccess = (data) => {
    console.log('Pago exitoso:', data);
    verificarSuscripcion();
    setTimeout(() => {
      setShowPaymentModal(false);
      localStorage.removeItem('pending_plan_id');
      localStorage.removeItem('pending_plan_name');
      localStorage.removeItem('pending_plan_price');
    }, 2000);
  };

  const handleClosePaymentModal = () => {
    setShowPaymentModal(false);
    localStorage.removeItem('pending_plan_id');
    localStorage.removeItem('pending_plan_name');
    localStorage.removeItem('pending_plan_price');
  };

  // ============================================
  // LOADING
  // ============================================
  if (cargando && !data) {
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

  // ============================================
  // RENDER
  // ============================================
  return (
    <div className="dashboard">
      <div className="content">

        {/* ✅ NUEVO: TOOLBAR CON REFRESH 
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

          <div className="stat-card" onClick={cargarIngresos}>
            <AttachMoneyIcon className="card-icon" />
            <h3>Ingresos Recientes</h3>
            <p className="stat-number">${(dashboardData.resumen?.ingresos_recientes || 0).toLocaleString()}</p>
          </div>

          <div className="stat-card gold-card" onClick={() => setShowPrecioOroModal(true)}>
            <MonetizationOnIcon className="card-icon" />
            <h3>Precio del Oro</h3>
            <p className="stat-number">${dashboardData.resumen?.precio_oro || 850} / gramo</p>
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
            <h2><AreaChartIcon /> Evolución Acumulada (Capital vs Retorno vs Ganancia)</h2>
            <p className="chart-subtitle">
              El área muestra el crecimiento total del negocio - La diferencia entre Capital y Retorno es la ganancia acumulada
            </p>
            <div className="chart-wrapper">
              <Chart options={areaChartOptions} series={areaChartSeries} type="area" height={chartHeight} />
            </div>
          </div>
        )}

        {puedeVerGraficasBasicas() && (
          <div className="nuevas-graficas-grid">
            <div className="grafica-nueva-card">
              <h2><TrendingUpIcon /> Tendencia de Ingresos</h2>
              <Chart options={trendChartOptions} series={trendChartSeries} type="line" height={smallChartHeight} />
            </div>

            <div className="grafica-nueva-card">
              <h2><PieChartIcon /> Distribución por Categoría</h2>
              <Chart options={categoriaDistribucionOptions} series={distribucionSeries} type="donut" height={smallChartHeight} />
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
                    <td className="profit-text">{formatearMoneda(cliente.ganancia_generada || (cliente.monto_total * 0.15))}</td>
                    <td><span className="profit-badge">+{formatearPorcentaje(cliente.porcentaje_ganancia || 15)}</span></td>
                    <td>{formatFecha(cliente.ultimo_empeno)}</td>
                  </tr>
                ))}
                {dashboardData.top_clientes?.length === 0 && (
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
                  let porcentaje = item.porcentaje_perdida || ((item.deuda / (item.total_prestado || 1)) * 100);
                  if (porcentaje > 100) porcentaje = 100;
                  return (
                    <tr key={index}>
                      <td><strong>{item.nombre}</strong></td>
                      <td>{formatearMoneda(item.total_prestado)}</td>
                      <td className="loss-text">{formatearMoneda(item.deuda)}</td>
                      <td className="loss-text">{formatearMoneda(item.perdida_proyectada || item.deuda)}</td>
                      <td><span className="loss-badge">-{porcentaje.toFixed(2)}%</span></td>
                      <td><span className="badge-danger">{Math.floor(item.dias_mora)} días</span></td>
                      <td>{item.ultimo_pago && item.ultimo_pago !== 'Invalid Date' ? formatFecha(item.ultimo_pago) : 'Sin registro'}</td>
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
              <span className="seccion-badge">{amortizacionesPendientes.length} registros</span>
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
                        <td>{new Date(item.fecha_pago_programado).toLocaleDateString('es-MX')}</td>
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
                {dashboardData.top_articulos?.length === 0 && (
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
                {actividad.monto && (
                  <div className="actividad-monto">{formatearMoneda(actividad.monto)}</div>
                )}
              </div>
            ))}
            {dashboardData.actividad_reciente?.length === 0 && (
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
                        <td>{item.fecha}</td>
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
                        <td>{item.fecha}</td>
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
                        <td>{item.fecha}</td>
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
                <div className="quilate-card">
                  <div className="quilate-info"><h3>Oro 24k</h3><p>99.9% pureza</p></div>
                  <div className="quilate-precio"><span className="precio">${preciosQuilates.precio_24k?.toLocaleString()}</span><span className="unidad">/ gramo</span></div>
                </div>
                <div className="quilate-card">
                  <div className="quilate-info"><h3>Oro 22k</h3><p>91.7% pureza</p></div>
                  <div className="quilate-precio"><span className="precio">${preciosQuilates.precio_22k?.toLocaleString()}</span><span className="unidad">/ gramo</span></div>
                </div>
                <div className="quilate-card">
                  <div className="quilate-info"><h3>Oro 21k</h3><p>87.5% pureza</p></div>
                  <div className="quilate-precio"><span className="precio">${preciosQuilates.precio_21k?.toLocaleString()}</span><span className="unidad">/ gramo</span></div>
                </div>
                <div className="quilate-card">
                  <div className="quilate-info"><h3>Oro 18k</h3><p>75.0% pureza</p></div>
                  <div className="quilate-precio"><span className="precio">${preciosQuilates.precio_18k?.toLocaleString()}</span><span className="unidad">/ gramo</span></div>
                </div>
                <div className="quilate-card">
                  <div className="quilate-info"><h3>Oro 14k</h3><p>58.5% pureza</p></div>
                  <div className="quilate-precio"><span className="precio">${preciosQuilates.precio_14k?.toLocaleString()}</span><span className="unidad">/ gramo</span></div>
                </div>
                <div className="quilate-card">
                  <div className="quilate-info"><h3>Oro 10k</h3><p>41.7% pureza</p></div>
                  <div className="quilate-precio"><span className="precio">${preciosQuilates.precio_10k?.toLocaleString()}</span><span className="unidad">/ gramo</span></div>
                </div>
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