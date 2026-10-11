// src/Home/Dueno.jsx - VERSIÓN HARDCODEADA CON MÉTRICAS NUEVAS
import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import "./dueno.css";
import api from '../config/api';
import { useSearchParams } from 'react-router-dom';
import { stripeService } from '../services/stripeService';
import PaymentModal from '../components/PaymentModal';
import { useDashboard } from '../contexts/DashboardContext';
// Al inicio de Dueno.jsx, importar:
import { calcularHealthScore } from '../utils/healthScore';
import { calcularProyeccionCobranza } from '../utils/proyeccionCobranza';


// Iconos
import AssignmentIcon from '@mui/icons-material/Assignment';
import WarningIcon from '@mui/icons-material/Warning';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import HistoryIcon from '@mui/icons-material/History';
import CloseIcon from '@mui/icons-material/Close';
import PieChartIcon from '@mui/icons-material/PieChart';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CelebrationIcon from '@mui/icons-material/Celebration';
import AreaChartIcon from '@mui/icons-material/AreaChart';
import RefreshIcon from '@mui/icons-material/Refresh';

// ✅ NUEVOS iconos
import SpeedIcon from '@mui/icons-material/Speed';
import StoreIcon from '@mui/icons-material/Store';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import EventNoteIcon from '@mui/icons-material/EventNote';
import FlagIcon from '@mui/icons-material/Flag';
import TrendingFlatIcon from '@mui/icons-material/TrendingFlat';
import ShieldIcon from '@mui/icons-material/Shield';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import CategoryIcon from '@mui/icons-material/Category';
import TimelineIcon from '@mui/icons-material/Timeline';

const Dueno = () => {
  // ============================================
  // CONTEXTO
  // ============================================
  const {
    data, cargando, error, cargar, refrescar, edadCache
  } = useDashboard();

  // ============================================
  // ESTADOS LOCALES
  // ============================================
  const [refrescandoManual, setRefrescandoManual] = useState(false);
  const [, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 60000);
    return () => clearInterval(id);
  }, []);

  const minutosDesde = edadCache !== null ? Math.floor(edadCache / 60000) : null;

  const handleRefrescarManual = async () => {
    setRefrescandoManual(true);
    try {
      await refrescar();
    } finally {
      setTimeout(() => setRefrescandoManual(false), 600);
    }
  };

  useEffect(() => { cargar(); }, [cargar]);

  // ============================================
  // ✅ NUEVO: DATOS HARDCODEADOS DE EJEMPLO
  // ============================================
  
  // Comparación vs mes anterior (para las cards)
  const deltas = {
    empenos_activos: { actual: 9, anterior: 6, cambio: 3 },
    empenos_vencidos: { actual: 33, anterior: 28, cambio: 5 },
    proximos_vencer: { actual: 3, anterior: 5, cambio: -2 },
    ingresos_recientes: { actual: 0, anterior: 12500, cambio: -12500 },
  };

  // Rentabilidad
  const rentabilidad = {
    capital: 528964,
    ganancia: 13000.21,
    perdida: 320236.33,
    rentabilidad_mensual: 2.45,
    rentabilidad_anualizada: 29.4,
    margen_neto: -57.5, // si es negativo porque la pérdida supera la ganancia
  };



  // Por sucursal
  const sucursales = [
    { nombre: "Casa Matriz - Centro", activos: 5, vencidos: 20, capital: 320000, ganancia: 8500 },
    { nombre: "Sucursal Norte", activos: 4, vencidos: 13, capital: 208964, ganancia: 4500 },
  ];

  // Cohortes de antigüedad
  const cohortes = [
    { rango: "0-30 días", cantidad: 12, monto: 45000, color: "#10b981" },
    { rango: "31-60 días", cantidad: 15, monto: 128000, color: "#f59e0b" },
    { rango: "61-90 días", cantidad: 6, monto: 85600, color: "#e67e22" },
    { rango: "+90 días", cantidad: 9, monto: 270364, color: "#dc2626" },
  ];

  // Actividad reciente mejorada (múltiples tipos)
  const actividadMejorada = [
    { tipo: "pago", descripcion: "Pago recibido de Hank Kilback", fecha: "hoy, 14:32", monto: 700 },
    { tipo: "empeno", descripcion: "Nuevo empeño: Anillo de oro 14k", fecha: "hoy, 12:15", monto: 8500, cliente: "María García" },
    { tipo: "vencido", descripcion: "Empeño vencido hoy", fecha: "hoy, 09:00", monto: 3200, cliente: "Juan Pérez" },
    { tipo: "cliente", descripcion: "Nuevo cliente registrado", fecha: "hoy, 08:45", cliente: "Ana López" },
    { tipo: "pago", descripcion: "Pago recibido de Lisa Tromp", fecha: "ayer, 16:20", monto: 1200 },
    { tipo: "empeno", descripcion: "Nuevo empeño: Reloj Rolex vintage", fecha: "ayer, 11:00", monto: 15000, cliente: "Carlos Ruiz" },
  ];

  // Análisis por categoría
  const analisisCategorias = [
    { categoria: "Joyería", cantidad: 10, ganancia_promedio: 1850, tasa_mora: 20, rentabilidad: "Alta" },
    { categoria: "Relojes", cantidad: 12, ganancia_promedio: 2200, tasa_mora: 33, rentabilidad: "Alta" },
    { categoria: "Electrónica", cantidad: 12, ganancia_promedio: 950, tasa_mora: 50, rentabilidad: "Media" },
    { categoria: "Herramientas", cantidad: 16, ganancia_promedio: 620, tasa_mora: 62, rentabilidad: "Baja" },
    { categoria: "Instrumentos", cantidad: 3, ganancia_promedio: 1400, tasa_mora: 33, rentabilidad: "Media" },
  ];

  // Health Score
  // Health Score (calculado con datos reales)
const healthScore = calcularHealthScore(data);

  // Clientes en riesgo
  const clientesEnRiesgo = [
    { nombre: "Ephraim Ledner", dias_sin_pagar: 42, deuda: 69400, alerta: "alto" },
    { nombre: "Hank Kilback", dias_sin_pagar: 38, deuda: 53506, alerta: "alto" },
    { nombre: "Lacey Spencer", dias_sin_pagar: 35, deuda: 32068, alerta: "medio" },
  ];

  // Meta del mes
  const meta = {
    objetivo: 100000,
    actual: 45000,
    dias_transcurridos: 15,
    dias_totales: 30,
    proyeccion: 90000,
  };

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
  const proyeccion = calcularProyeccionCobranza(amortizacionesPendientes);

  // ============================================
  // GRÁFICAS
  // ============================================
  const capitalRetorno = dashboardData.capital_retorno || [];
  const capitalAcumulado = capitalRetorno.map(i => Number(i.capital));
  const retornoAcumulado = capitalRetorno.map(i => Number(i.retorno));
  const gananciaAcumulada = capitalRetorno.map(i => Number(i.ganancia));
  const meses = capitalRetorno.map(i => i.mes);

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

  useEffect(() => { verificarSuscripcion(); }, []);

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
  // CONFIGURACIÓN DE GRÁFICAS
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

  // ✅ NUEVO: gráfica de cohortes (barras horizontales)
  const cohortesChartOptions = {
    chart: { type: "bar", toolbar: { show: false } },
    plotOptions: {
      bar: {
        horizontal: true,
        distributed: true,
        borderRadius: 6,
        barHeight: '70%'
      }
    },
    colors: cohortes.map(c => c.color),
    dataLabels: {
      enabled: true,
      formatter: (val) => `${val} empeños`,
      style: { fontSize: '12px', fontWeight: 600, colors: ['#fff'] }
    },
    xaxis: {
      categories: cohortes.map(c => c.rango),
      labels: { style: { fontSize: '12px' } }
    },
    legend: { show: false },
    tooltip: {
      y: {
        formatter: (val, opts) => {
          const item = cohortes[opts.dataPointIndex];
          return `${val} empeños · $${item.monto.toLocaleString()}`;
        }
      }
    },
    grid: { borderColor: '#e5e7eb', strokeDashArray: 5 }
  };

  const cohortesChartSeries = [{
    name: "Empeños",
    data: cohortes.map(c => c.cantidad)
  }];

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

  const esAdmin = () => userRole === 'Administrador' || userRole === 'Dueño' || userRole === 'Admin';
  const esGerente = () => userRole === 'Gerente' || userRole === 'gerente' || userRole === 'GERENTE';
  const puedeVerEvolucionAcumulada = () => esAdmin();
  const puedeVerGraficasBasicas = () => esAdmin() || esGerente();

  // ============================================
  // CARGA SECUNDARIA
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
    }
  };

  const cargarIngresos = async () => {
    setIngresosRecientes([
      { id: 1, concepto: "Pago de Juan Pérez", monto: 5000, fecha: "10/03/2024" },
      { id: 2, concepto: "Pago de María García", monto: 3500, fecha: "09/03/2024" }
    ]);
    setShowIngresos(true);
  };

  // ============================================
  // MODAL DE PAGO
  // ============================================
  const handlePaymentSuccess = (data) => {
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
            <button onClick={() => cargar(true)} className="btn-reintentar">Reintentar</button>
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

        {/* TOOLBAR */}
        <div className="dashboard-toolbar">
          <span className="dashboard-freshness">
            {minutosDesde === null
              ? 'Cargando...'
              : minutosDesde < 1
              ? 'Actualizado ahora mismo'
              : `Actualizado hace ${minutosDesde} min`}
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
        </div>

      {/* ✅ NUEVO: HEALTH SCORE + META DEL MES */}
<div className="hero-grid">
  {/* Health Score */}
  <div className="hero-card health-score-card">
    <div className="hero-card-header">
      <ShieldIcon />
      <span>Salud del Negocio</span>
    </div>
    <div className="health-score-content">
      <div className="health-score-circle">
        <svg viewBox="0 0 100 100" className="health-score-svg">
          <circle cx="50" cy="50" r="42" className="health-score-track" />
          <circle
            cx="50" cy="50" r="42"
            className="health-score-fill"
            strokeDasharray={`${(healthScore.total / 100) * 264} 264`}
            stroke={healthScore.color}
          />
        </svg>
        <div className="health-score-number">
          <strong style={{ color: healthScore.color }}>{healthScore.total}</strong>
          <small>/ 100</small>
        </div>
      </div>

      <div className="health-score-info">
        <span className="health-score-label" style={{ color: healthScore.color }}>
          {healthScore.nivel}
        </span>

        <div className="health-score-factores">
          {/* Cartera sana */}
          <div className="factor">
            <span title={
              healthScore.detalles
                ? `${healthScore.detalles.activos} activos de ${healthScore.detalles.activos + healthScore.detalles.vencidos} empeños`
                : 'Cargando datos...'
            }>
              Cartera sana
            </span>
            <div className="factor-bar">
              <div className="factor-fill" style={{ width: `${healthScore.factores.cartera_sana}%` }}></div>
            </div>
            <span>{healthScore.factores.cartera_sana}</span>
          </div>

          {/* Morosidad */}
          <div className="factor">
            <span title={
              healthScore.detalles
                ? `Pérdida: $${Number(healthScore.detalles.perdida_total).toLocaleString()} (${healthScore.detalles.tasa_perdida}% del capital)`
                : 'Cargando datos...'
            }>
              Morosidad
            </span>
            <div className="factor-bar">
              <div className="factor-fill warning" style={{ width: `${healthScore.factores.morosidad}%` }}></div>
            </div>
            <span>{healthScore.factores.morosidad}</span>
          </div>

          {/* Liquidez */}
          <div className="factor">
            <span title={
              healthScore.detalles
                ? `Por cobrar en 30 días: $${Number(healthScore.detalles.proximos_30d).toLocaleString()}`
                : 'Cargando datos...'
            }>
              Liquidez
            </span>
            <div className="factor-bar">
              <div className="factor-fill success" style={{ width: `${healthScore.factores.liquidez}%` }}></div>
            </div>
            <span>{healthScore.factores.liquidez}</span>
          </div>

          {/* Tendencia */}
          <div className="factor">
            <span title="Comparación de ganancia mes actual vs mes anterior">
              Tendencia
            </span>
            <div className="factor-bar">
              <div className="factor-fill" style={{ width: `${healthScore.factores.tendencia}%` }}></div>
            </div>
            <span>{healthScore.factores.tendencia}</span>
          </div>
        </div>
      </div>
    </div>
  </div>

  {/* Meta del Mes */}
  <div className="hero-card meta-card">
    <div className="hero-card-header">
      <FlagIcon />
      <span>Meta del Mes</span>
    </div>
    <div className="meta-content">
      <div className="meta-amount">
        <span className="meta-actual">${meta.actual.toLocaleString()}</span>
        <span className="meta-objetivo">de ${meta.objetivo.toLocaleString()}</span>
      </div>
      <div className="meta-progress">
        <div className="meta-progress-bar">
          <div
            className="meta-progress-fill"
            style={{ width: `${(meta.actual / meta.objetivo) * 100}%` }}
          ></div>
        </div>
        <span className="meta-progress-percent">
          {((meta.actual / meta.objetivo) * 100).toFixed(0)}%
        </span>
      </div>
      <div className="meta-info">
        <div className="meta-info-item">
          <span>Días transcurridos</span>
          <strong>{meta.dias_transcurridos} / {meta.dias_totales}</strong>
        </div>
        <div className="meta-info-item">
          <span>Proyección al cierre</span>
          <strong className={meta.proyeccion < meta.objetivo ? 'danger' : 'success'}>
            ${meta.proyeccion.toLocaleString()}
          </strong>
        </div>
      </div>
      {meta.proyeccion < meta.objetivo && (
        <div className="meta-warning">
          <TrendingDownIcon />
          <span>Vas por debajo de la meta. Necesitas ${(meta.objetivo - meta.proyeccion).toLocaleString()} más.</span>
        </div>
      )}
    </div>
  </div>
</div>

        {/* ✅ NUEVO: RENTABILIDAD (destacado) 
        <div className="rentabilidad-card">
          <div className="rentabilidad-header">
            <SpeedIcon />
            <span>Rentabilidad del Negocio</span>
          </div>
          <div className="rentabilidad-grid">
            <div className="rentabilidad-item">
              <span className="rentabilidad-label">Capital prestado</span>
              <span className="rentabilidad-valor">${rentabilidad.capital.toLocaleString()}</span>
            </div>
            <div className="rentabilidad-item">
              <span className="rentabilidad-label">Ganancia total</span>
              <span className="rentabilidad-valor success">${rentabilidad.ganancia.toLocaleString()}</span>
            </div>
            <div className="rentabilidad-item">
              <span className="rentabilidad-label">Pérdida total</span>
              <span className="rentabilidad-valor danger">-${rentabilidad.perdida.toLocaleString()}</span>
            </div>
            <div className="rentabilidad-item destacado">
              <span className="rentabilidad-label">Rentabilidad mensual</span>
              <span className="rentabilidad-valor-big">{rentabilidad.rentabilidad_mensual}%</span>
              <span className="rentabilidad-sub">≈ {rentabilidad.rentabilidad_anualizada}% anualizado</span>
            </div>
          </div>
        </div> */}

        {/* CARDS CON DELTAS */}
        <div className="cards-grid">
          <div className="stat-card" onClick={cargarActivos}>
            <AssignmentIcon className="card-icon" />
            <h3>Empeños Activos</h3>
            <p className="stat-number">{dashboardData.resumen?.empenos_activos || 0}</p>
            {deltas.empenos_activos && (
              <span className={`stat-delta ${deltas.empenos_activos.cambio >= 0 ? 'up' : 'down'}`}>
                {deltas.empenos_activos.cambio >= 0 ? <TrendingUpIcon /> : <TrendingDownIcon />}
                {deltas.empenos_activos.cambio >= 0 ? '+' : ''}{deltas.empenos_activos.cambio} vs mes ant.
              </span>
            )}
          </div>

          <div className="stat-card" onClick={cargarVencidos}>
            <WarningIcon className="card-icon" />
            <h3>Empeños Vencidos</h3>
            <p className="stat-number">{dashboardData.resumen?.empenos_vencidos || 0}</p>
            {deltas.empenos_vencidos && (
              <span className={`stat-delta ${deltas.empenos_vencidos.cambio <= 0 ? 'up' : 'down'}`}>
                {deltas.empenos_vencidos.cambio <= 0 ? <TrendingDownIcon /> : <TrendingUpIcon />}
                {deltas.empenos_vencidos.cambio >= 0 ? '+' : ''}{deltas.empenos_vencidos.cambio} vs mes ant.
              </span>
            )}
          </div>

          <div className="stat-card" onClick={cargarProximos}>
            <AccessTimeIcon className="card-icon" />
            <h3>Próximos a Vencer</h3>
            <p className="stat-number">{dashboardData.resumen?.proximos_vencer || 0}</p>
            {deltas.proximos_vencer && (
              <span className={`stat-delta ${deltas.proximos_vencer.cambio <= 0 ? 'up' : 'down'}`}>
                {deltas.proximos_vencer.cambio <= 0 ? <TrendingDownIcon /> : <TrendingUpIcon />}
                {deltas.proximos_vencer.cambio >= 0 ? '+' : ''}{deltas.proximos_vencer.cambio} vs mes ant.
              </span>
            )}
          </div>

          <div className="stat-card" onClick={cargarIngresos}>
            <AttachMoneyIcon className="card-icon" />
            <h3>Ingresos del Mes</h3>
            <p className="stat-number">
              ${(dashboardData.resumen?.ingresos_recientes || 0).toLocaleString()}
            </p>
            {(dashboardData.resumen?.ingresos_recientes === 0) && (
              <span className="stat-hint-muted">
                Sin ingresos este mes
              </span>
            )}
          </div>

          <div className="stat-card gold-card" onClick={() => setShowPrecioOroModal(true)}>
            <MonetizationOnIcon className="card-icon" />
            <h3>Precio del Oro</h3>
            <p className="stat-number">${dashboardData.resumen?.precio_oro || 850} / g</p>
          </div>
        </div>

        

        {/* ✅ NUEVO: DESGLOSE POR SUCURSAL 
        {sucursales.length > 1 && (
          <div className="nueva-seccion">
            <h2><StoreIcon /> Desglose por Sucursal</h2>
            <div className="sucursales-grid-dashboard">
              {sucursales.map((s, i) => (
                <div key={i} className="sucursal-dashboard-card">
                  <div className="sucursal-dashboard-header">
                    <StoreIcon />
                    <strong>{s.nombre}</strong>
                  </div>
                  <div className="sucursal-dashboard-stats">
                    <div className="sucursal-stat">
                      <span>Activos</span>
                      <strong className="success">{s.activos}</strong>
                    </div>
                    <div className="sucursal-stat">
                      <span>Vencidos</span>
                      <strong className="danger">{s.vencidos}</strong>
                    </div>
                    <div className="sucursal-stat">
                      <span>Capital</span>
                      <strong>${(s.capital / 1000).toFixed(0)}k</strong>
                    </div>
                    <div className="sucursal-stat">
                      <span>Ganancia</span>
                      <strong className="success">${s.ganancia.toLocaleString()}</strong>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )} */}

        {/* GRÁFICAS EXISTENTES */}
        {puedeVerEvolucionAcumulada() && (
          <div className="chart-section">
            <h2><AreaChartIcon /> Rentabilidad del negocio</h2>
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
{/* ✅ NUEVO: PROYECCIÓN DE COBRANZA */}
        <div className="proyeccion-card">
  <h2>
    <EventNoteIcon />
    Proyección de Cobranza (Próximos 30 días)
  </h2>
  <div className="proyeccion-grid">
    <div className="proyeccion-item">
      <span className="proyeccion-label">Por cobrar</span>
      <span className="proyeccion-valor success">
        ${proyeccion.por_cobrar_30d.toLocaleString()}
      </span>
    </div>
    <div className="proyeccion-item">
      <span className="proyeccion-label">Cuotas que vencen</span>
      <span className="proyeccion-valor">{proyeccion.cuotas_vencen_30d}</span>
    </div>
    <div className="proyeccion-item">
      <span className="proyeccion-label">En riesgo</span>
      <span className="proyeccion-valor warning">
        ${proyeccion.en_riesgo.toLocaleString()}
      </span>
    </div>
    <div className="proyeccion-item">
      <span className="proyeccion-label">Ya atrasado</span>
      <span className="proyeccion-valor danger">
        ${proyeccion.ya_atrasado.toLocaleString()}
      </span>
    </div>
    
  </div>
</div>

        {/* ✅ NUEVO: COHORTES DE ANTIGÜEDAD */}
        <div className="nueva-seccion">
          <h2>
            <TimelineIcon />
            Antigüedad de la Cartera
            <span className="seccion-badge">Riesgo por tiempo</span>
          </h2>
          <p className="chart-subtitle">
            Distribución de empeños según hace cuánto tiempo se otorgaron. Los de mayor antigüedad son los más riesgosos.
          </p>
          <Chart
            options={cohortesChartOptions}
            series={cohortesChartSeries}
            type="bar"
            height={220}
          />
        </div>

        {/* ✅ NUEVO: CLIENTES EN RIESGO */}
        <div className="nueva-seccion">
          <h2>
            <NotificationsActiveIcon />
            Clientes en Riesgo
            <span className="seccion-badge warning">
              {clientesEnRiesgo.length} requieren atención
            </span>
          </h2>
          <div className="clientes-riesgo-lista">
            {clientesEnRiesgo.map((c, i) => (
              <div key={i} className={`cliente-riesgo-item ${c.alerta}`}>
                <div className="cliente-riesgo-info">
                  <strong>{c.nombre}</strong>
                  <span className="cliente-riesgo-dias">
                    {c.dias_sin_pagar} días sin pagar
                  </span>
                </div>
                <div className="cliente-riesgo-deuda">
                  <span>Deuda:</span>
                  <strong>${c.deuda.toLocaleString()}</strong>
                </div>
                <button className="btn-contactar">Contactar</button>
              </div>
            ))}
          </div>
        </div>

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
                    amortizacionesPendientes.slice(0, 10).map((item) => (
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

        {/* ✅ NUEVO: ANÁLISIS POR CATEGORÍA */}
        <div className="nueva-seccion">
          <h2>
            <CategoryIcon />
            Análisis por Categoría
            <span className="seccion-badge">Rentabilidad y riesgo</span>
          </h2>
          <div className="tabla-container">
            <table className="tabla-moderna">
              <thead>
                <tr>
                  <th>Categoría</th>
                  <th>Cantidad</th>
                  <th>Ganancia Promedio</th>
                  <th>Tasa de Mora</th>
                  <th>Rentabilidad</th>
                </tr>
              </thead>
              <tbody>
                {analisisCategorias.map((cat, i) => (
                  <tr key={i}>
                    <td><strong>{cat.categoria}</strong></td>
                    <td>{cat.cantidad}</td>
                    <td className="profit-text">${cat.ganancia_promedio.toLocaleString()}</td>
                    <td>
                      <span className={cat.tasa_mora > 50 ? 'badge-danger' : cat.tasa_mora > 30 ? 'badge-warning' : 'profit-badge'}>
                        {cat.tasa_mora}%
                      </span>
                    </td>
                    <td>
                      <span className={`rentabilidad-tag ${cat.rentabilidad.toLowerCase()}`}>
                        {cat.rentabilidad}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

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

        {/* ✅ MEJORADO: ACTIVIDAD RECIENTE con múltiples tipos */}
        <div className="nueva-seccion">
          <h2><HistoryIcon /> Actividad Reciente</h2>
          <div className="actividad-lista">
            {actividadMejorada.map((actividad, index) => {
              const iconos = {
                pago: { Icon: CheckCircleIcon, clase: 'success' },
                empeno: { Icon: CelebrationIcon, clase: 'info' },
                vencido: { Icon: WarningIcon, clase: 'warning' },
                cliente: { Icon: PersonAddIcon, clase: 'primary' },
              };
              const { Icon, clase } = iconos[actividad.tipo] || iconos.pago;

              return (
                <div key={index} className="actividad-item">
                  <Icon className={`actividad-icon ${clase}`} />
                  <div className="actividad-detalle">
                    <p>
                      <strong>{actividad.descripcion}</strong>
                      {actividad.cliente && <span className="actividad-cliente"> · {actividad.cliente}</span>}
                    </p>
                    <small>{actividad.fecha}</small>
                  </div>
                  {actividad.monto && (
                    <div className="actividad-monto">{formatearMoneda(actividad.monto)}</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* MODALES (los mismos de antes) */}
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
                {[
                  { k: 24, p: 99.9 }, { k: 22, p: 91.7 }, { k: 21, p: 87.5 },
                  { k: 18, p: 75.0 }, { k: 14, p: 58.5 }, { k: 10, p: 41.7 }
                ].map(({ k, p }) => (
                  <div key={k} className="quilate-card">
                    <div className="quilate-info">
                      <h3>Oro {k}k</h3>
                      <p>{p}% pureza</p>
                    </div>
                    <div className="quilate-precio">
                      <span className="precio">${preciosQuilates[`precio_${k}k`]?.toLocaleString()}</span>
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