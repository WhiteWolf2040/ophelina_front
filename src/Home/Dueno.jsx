// src/Home/Dueno.jsx - VERSIÓN FINAL CON CORRECCIONES
import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import "./dueno.css";
import api from '../config/api';
import { useSearchParams } from 'react-router-dom';
import { stripeService } from '../services/stripeService';
import PaymentModal from '../components/PaymentModal';
import { useDashboard } from '../contexts/DashboardContext';
import { usePermissions } from '../hooks/usePermissions';
import PermissionGuard from '../components/PermissionGuard';
import { calcularHealthScore } from '../utils/healthScore';

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

import PersonAddIcon from '@mui/icons-material/PersonAdd';
import EventNoteIcon from '@mui/icons-material/EventNote';
import FlagIcon from '@mui/icons-material/Flag';
import ShieldIcon from '@mui/icons-material/Shield';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import NotificationsIcon from '@mui/icons-material/Notifications';
import CategoryIcon from '@mui/icons-material/Category';
import TimelineIcon from '@mui/icons-material/Timeline';
import ErrorIcon from '@mui/icons-material/Error';
import CreditCardIcon from '@mui/icons-material/CreditCard';

// ============================================
// PRICING COMPARISON
// ============================================
const PC_PLANS = [
  { id: "gratis", name: "Gratis", price: "$0", note: "para empezar sin riesgo" },
  { id: "profesional", name: "Profesional", price: "$999", note: "al mes" },
  { id: "premium", name: "Premium", price: "$1,499", note: "al mes", badge: "Más popular" },
];

const PC_FEATURES = [
  { name: "Sucursales", desc: "Cuántas sucursales se administran", gratis: "1", profesional: "1", premium: "Multi-sucursal" },
  { name: "Clientes nuevos al mes", desc: "Altas de clientes permitidas", gratis: "4", profesional: "Sin límite indicado", premium: "Sin límite indicado" },
  { name: "Empeños activos", desc: "Empeños abiertos al mismo tiempo", gratis: "Máx. 40", profesional: "Sin límite indicado", premium: "Sin límite indicado" },
  { name: "Control de fechas límite de pago", desc: "Vencimientos de cada empeño", gratis: true, profesional: true, premium: true },
  { name: "Control de inventario", desc: "Registro y estado de las prendas", gratis: false, profesional: true, premium: true },
  { name: "Cálculo automático de intereses", desc: "El sistema calcula lo que debe cada cliente", gratis: false, profesional: true, premium: true },
  { name: "Recordatorios automáticos", desc: "Avisos antes del vencimiento, para reducir la morosidad", gratis: false, profesional: true, premium: true },
  { name: "Reportes básicos", desc: "Ingresos por mes, clientes frecuentes y estado de empeños", gratis: false, profesional: true, premium: true },
  { name: "Reportes avanzados", desc: "Análisis más detallado del negocio", gratis: false, profesional: false, premium: true },
  { name: "Tienda en línea", desc: "Venta de prendas no recuperadas", gratis: false, profesional: false, premium: true },
  { name: "Roles y permisos", desc: "Accesos distintos para dueño, administrador y empleado", gratis: false, profesional: false, premium: true },
  { name: "Configuración de la empresa", desc: "Datos y ajustes de la casa de empeño", gratis: false, profesional: false, premium: true },
  { name: "Prueba de 14 días", desc: "Probar el plan antes de pagarlo", gratis: false, profesional: false, premium: true },
];

const PCCell = ({ value }) => {
  if (value === true) {
    return (
      <span className="pc-yes" role="img" aria-label="Incluido">
        <svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true">
          <path d="M4 10.5l4 4 8-9" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    );
  }
  if (value === false) {
    return (
      <span className="pc-no" role="img" aria-label="No incluido">
        <svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true">
          <path d="M5 10h10" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
        </svg>
      </span>
    );
  }
  return <span className="pc-text">{value}</span>;
};

const PricingComparison = ({ onSelectPlan, readOnly = false, currentPlanId = null }) => {
  const [active, setActive] = useState(currentPlanId || "premium");

  return (
    <section className="pc" data-active={active} aria-labelledby="pc-title">
      {!readOnly && (
        <>
          <h2 id="pc-title" className="pc-title">Compara los planes de Ophelina</h2>
          <p className="pc-sub">
            Cada plan incluye todo lo del anterior. Empieza gratis y sube cuando tu negocio lo pida.
          </p>
        </>
      )}

      <div className="pc-tabs" role="tablist" aria-label="Elige un plan">
        {PC_PLANS.map((p) => {
          const esActual = currentPlanId === p.id;
          return (
            <button
              key={p.id}
              role="tab"
              aria-selected={active === p.id}
              className={"pc-tab" + (active === p.id ? " is-active" : "") + (esActual ? " is-current" : "")}
              onClick={() => setActive(p.id)}
            >
              {p.name}
              {esActual && <span className="pc-tab-badge">Actual</span>}
            </button>
          );
        })}
      </div>

      <div className="pc-scroll">
        <table className="pc-table">
          <thead>
            <tr>
              <th className="pc-feature-col" scope="col"><span className="pc-sr">Funcionalidad</span></th>
              {PC_PLANS.map((p) => {
                const esActual = currentPlanId === p.id;
                return (
                  <th
                    key={p.id}
                    scope="col"
                    data-plan={p.id}
                    className={"pc-plan" + (p.badge ? " is-featured" : "") + (esActual ? " is-current" : "")}
                  >
                    {!readOnly && p.badge && <span className="pc-badge">{p.badge}</span>}
                    <span className="pc-plan-name">{p.name}</span>
                    <span className="pc-price">{p.price}</span>
                    <span className="pc-note">{p.note}</span>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {PC_FEATURES.map((f) => (
              <tr key={f.name}>
                <th scope="row" className="pc-feature-col">
                  <span className="pc-feature">{f.name}</span>
                  <span className="pc-desc">{f.desc}</span>
                </th>
                {PC_PLANS.map((p) => {
                  const esActual = currentPlanId === p.id;
                  return (
                    <td key={p.id} data-plan={p.id} className={(p.badge ? "is-featured" : "") + (esActual ? " is-current" : "")}>
                      <PCCell value={f[p.id]} />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>

          {!readOnly && (
            <tfoot>
              <tr>
                <td className="pc-feature-col" />
                {PC_PLANS.map((p) => (
                  <td key={p.id} data-plan={p.id} className={p.badge ? "is-featured" : ""}>
                    <button
                      className={"pc-cta" + (p.badge ? " is-primary" : "")}
                      onClick={() => onSelectPlan && onSelectPlan(p.id)}
                    >
                      {p.id === "gratis" ? "Empezar gratis" : p.id === "premium" ? "Probar 14 días" : "Elegir plan"}
                    </button>
                  </td>
                ))}
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </section>
  );
};

// ============================================
// Mapeo plan nombre/clave → id PricingComparison
// ============================================
const CLAVE_A_PLAN_ID = {
  gratis: "gratis",
  free: "gratis",
  basico: "gratis",
  profesional: "profesional",
  professional: "profesional",
  pro: "profesional",
  premium: "premium",
  empresarial: "premium",
  empresa: "premium",
};

const PLAN_PREMIUM = 3;

const Dueno = () => {
  // ============================================================
  // TODOS LOS HOOKS VAN AQUÍ ARRIBA, ANTES DE CUALQUIER return.
  // ============================================================
  const { data, cargando, error, cargar, refrescar, edadCache } = useDashboard();
  const { hasPermission, hasAnyPermission } = usePermissions();

  const [refrescandoManual, setRefrescandoManual] = useState(false);
  const [, setTick] = useState(0);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Plan
  const [planId, setPlanId] = useState(() => {
    try {
      return Number(JSON.parse(localStorage.getItem('user'))?.plan_id) || 1;
    } catch {
      return 1;
    }
  });
  const esPremium = planId === PLAN_PREMIUM;

  // Pago
  const [searchParams] = useSearchParams();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentSessionId, setPaymentSessionId] = useState(null);
  const [paymentPlanName, setPaymentPlanName] = useState('');
  const [paymentPlanId, setPaymentPlanId] = useState(null);

  // Suscripción + modal
  const [showSuscripcionModal, setShowSuscripcionModal] = useState(false);
  const [estadoSuscripcion, setEstadoSuscripcion] = useState(null);

  // Modales y listados
  const [showActivos, setShowActivos] = useState(false);
  const [showVencidos, setShowVencidos] = useState(false);
  const [showProximos, setShowProximos] = useState(false);
  const [showIngresos, setShowIngresos] = useState(false);
  const [showAlertas, setShowAlertas] = useState(false);
  const [showPerfil, setShowPerfil] = useState(false);
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

  const [datosPerfil, setDatosPerfil] = useState({
    nombre: "Usuario",
    email: "",
    telefono: "Sin teléfono",
    rol: "Usuario",
    fechaRegistro: "Fecha no disponible",
    sucursal: "Casa Matriz - Mérida",
    fotoPerfil: "https://ui-avatars.com/api/?name=Usuario&size=128&background=1e3a8a&color=fff&bold=true"
  });

  // ============================================================
  // FUNCIONES
  // ============================================================
  const minutosDesde = edadCache !== null && edadCache !== undefined
    ? Math.floor(edadCache / 60000)
    : null;

  const handleRefrescarManual = async () => {
    setRefrescandoManual(true);
    try {
      await refrescar();
    } finally {
      setTimeout(() => setRefrescandoManual(false), 600);
    }
  };

  const verificarSuscripcion = async () => {
    const empresaId = localStorage.getItem('empresa_id');
    if (!empresaId) return;

    try {
      const response = await stripeService.checkSubscription(empresaId);

      const dias = response.dias_restantes ?? 0;
      const activo = response.activo === true || response.plan_activo === 1;
      const vencido = !activo;
      const porVencer = activo && dias > 0 && dias <= 7;

      const planClave = CLAVE_A_PLAN_ID[
        String(response.plan_nombre || "").toLowerCase()
      ] || "gratis";

      const estado = {
        activo,
        vencido,
        porVencer,
        diasRestantes: dias,
        planId: response.plan_id,
        planClave,
        planNombre: response.plan_nombre || "Sin plan",
        stripeSubscriptionId: response.stripe_subscription_id || null,
        fechaFin: response.fecha_fin_plan || null,
      };

      setEstadoSuscripcion(estado);

      // Solo mostrar si NO se ha mostrado en esta sesión
      const claveAviso = `aviso_suscripcion_visto_${empresaId}`;
      const yaVisto = sessionStorage.getItem(claveAviso);

      if ((vencido || porVencer) && !yaVisto) {
        setShowSuscripcionModal(true);
        sessionStorage.setItem(claveAviso, '1');
      }
    } catch (err) {
      console.error('Error al verificar suscripción:', err);
    }
  };

  const abrirPortalOGestion = async () => {
    if (estadoSuscripcion?.stripeSubscriptionId) {
      try {
        const { url } = await stripeService.abrirPortal(window.location.href);
        window.location.href = url;
        return;
      } catch (e) {
        console.error('Error al abrir portal:', e);
      }
    }
    // Si no hay suscripción en Stripe → ir a configuración
    window.location.href = '/configuracion';
  };

  const cerrarSuscripcionModal = () => {
    setShowSuscripcionModal(false);
  };

  const cargarRolUsuario = async () => {
    try {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        setUserRole(user.rol || 'Empleado');
        setDatosPerfil({
          nombre: user.nombre || "Usuario",
          email: user.correo || "",
          telefono: user.telefono || "Sin teléfono",
          rol: user.rol || "Usuario",
          fechaRegistro: user.fecha_registro ? new Date(user.fecha_registro).toLocaleDateString('es-MX') : "Fecha no disponible",
          sucursal: user.sucursal || "Casa Matriz - Mérida",
          fotoPerfil: user.foto_perfil || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.nombre || 'Usuario')}&size=128&background=1e3a8a&color=fff&bold=true`
        });
      }
      const response = await api.get('/user');
      if (response.data.success) {
        const user = response.data.data.usuario;
        localStorage.setItem('user', JSON.stringify(user));
        setUserRole(user.rol || 'Empleado');
        setPlanId(Number(user.plan_id) || 1);
      }
    } catch (err) {
      console.error('Error cargando rol:', err);
    }
  };

  const cargarPreciosQuilates = async () => {
    try {
      const response = await api.get('/precio-oro/quilates');
      if (response.data.success) setPreciosQuilates(response.data.data);
    } catch (err) {
      console.error('Error al cargar precios por quilate:', err);
    }
  };

  const cargarActivos = async () => {
    if (!hasPermission('ver_empenos')) return;
    try {
      const response = await api.get('/home/activos');
      if (response.data.success) {
        setEmpenosActivos(response.data.data);
        setShowActivos(true);
      }
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const cargarVencidos = async () => {
    if (!hasPermission('ver_empenos')) return;
    try {
      const response = await api.get('/home/vencidos');
      if (response.data.success) {
        setEmpenosVencidos(response.data.data);
        setShowVencidos(true);
      }
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const cargarProximos = async () => {
    if (!hasPermission('ver_empenos')) return;
    try {
      const response = await api.get('/home/proximos');
      if (response.data.success) {
        setProximosVencer(response.data.data);
        setShowProximos(true);
      }
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const cargarIngresos = async () => {
    if (!hasPermission('ver_pagos')) return;
    try {
      const response = await api.get('/home/ingresos');
      if (response.data.success) {
        setIngresosRecientes(response.data.data);
        setShowIngresos(true);
      }
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const limpiarPendientesPago = () => {
    localStorage.removeItem('pending_plan_id');
    localStorage.removeItem('pending_plan_name');
    localStorage.removeItem('pending_plan_price');
  };

  const handlePaymentSuccess = () => {
    verificarSuscripcion();
    cargarRolUsuario();   // trae el plan nuevo
    refrescar();          // trae (o quita) los datos Premium
    setTimeout(() => {
      setShowPaymentModal(false);
      limpiarPendientesPago();
    }, 2000);
  };

  const handleClosePaymentModal = () => {
    setShowPaymentModal(false);
    limpiarPendientesPago();
  };

  // ============================================================
  // EFECTOS
  // ============================================================
  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 60000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => { cargar(); }, [cargar]);

  useEffect(() => {
    cargarRolUsuario();
    cargarPreciosQuilates();
    verificarSuscripcion();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Si el plan es Premium pero el dashboard en caché aún no trae los datos Premium, se refresca
  useEffect(() => {
    if (esPremium && data && !data.premium) refrescar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [planId]);

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

  // ============================================================
  // LOADING / ERROR (ya después de todos los hooks)
  // ============================================================
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

  // ============================================================
  // DATOS (todos vienen del backend)
  // ============================================================
  const dashboardData = data?.dashboard || {
    resumen: {}, top_clientes: [], top_articulos: [],
    actividad_reciente: [], capital_retorno: []
  };
  const resumen = dashboardData.resumen || {};
  const morosidad = data?.morosidad || [];
  const distribucion = data?.distribucion || [];
  const amortizacionesPendientes = data?.amortizaciones || [];
  const cohortes = data?.cohortes || [];
  const analisisCategorias = data?.analisis_categorias || [];
  const actividad = dashboardData.actividad_reciente || [];

  // Solo Premium
  const premium = data?.premium || {};
  const meta = premium.meta || null;
  const proyeccion = premium.proyeccion || {
    por_cobrar_30d: 0, cuotas_vencen_30d: 0, en_riesgo: 0, ya_atrasado: 0
  };
  const clientesEnRiesgo = premium.clientes_riesgo || [];

  const healthScore = calcularHealthScore(data);

  // Ingresos del mes vs mes anterior
  const ingresosMes = Number(resumen.ingresos_mes_actual ?? 0);
  const ingresosMesAnterior = Number(resumen.ingresos_mes_anterior ?? 0);
  const deltaIngresos = ingresosMesAnterior > 0
    ? ((ingresosMes - ingresosMesAnterior) / ingresosMesAnterior) * 100
    : null;

  // Meta
  const metaObjetivo = Number(meta?.objetivo ?? 0);
  const metaActual = Number(meta?.actual ?? 0);
  const metaProyeccion = Number(meta?.proyeccion ?? 0);
  const metaPct = metaObjetivo > 0 ? Math.min(100, (metaActual / metaObjetivo) * 100) : 0;

  // ============================================================
  // GRÁFICAS
  // ============================================================
  const capitalRetorno = dashboardData.capital_retorno || [];
  const capitalAcumulado = capitalRetorno.map(i => Number(i.capital));
  const retornoAcumulado = capitalRetorno.map(i => Number(i.retorno));
  const gananciaAcumulada = capitalRetorno.map(i => Number(i.ganancia));
  const retornoMensual = capitalRetorno.map(i => Number(i.retorno_mes));
  const meses = capitalRetorno.map(i => i.mes);

  const chartHeight = windowWidth < 480 ? 250 : windowWidth < 768 ? 300 : 380;
  const smallChartHeight = windowWidth < 480 ? 200 : windowWidth < 768 ? 250 : 300;

  const areaChartOptions = {
    chart: {
      type: 'area', stacked: true,
      toolbar: {
        show: true,
        tools: { download: true, selection: false, zoom: false, zoomin: false, zoomout: false, pan: false, reset: false }
      },
      zoom: { enabled: false }
    },
    dataLabels: { enabled: false },
    stroke: { curve: 'smooth', width: 2 },
    fill: { type: 'gradient', gradient: { shadeIntensity: 1, opacityFrom: 0.7, opacityTo: 0.3, stops: [0, 90, 100] } },
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
      y: { formatter: (val) => new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', minimumFractionDigits: 0 }).format(val) },
      shared: true, intersect: false
    },
    legend: {
      position: 'top', horizontalAlign: 'center', offsetY: 0,
      fontSize: '11px', itemMargin: { horizontal: 8, vertical: 4 }
    },
    grid: { borderColor: '#e5e7eb', strokeDashArray: 5, padding: { left: 5, right: 5 } }
  };

  const areaChartSeries = [
    { name: "Capital Prestado (Acumulado)", data: capitalAcumulado },
    { name: "Retorno (Pagos Acumulados)", data: retornoAcumulado },
    { name: "Ganancia (Acumulada)", data: gananciaAcumulada }
  ];

  const trendChartOptions = {
    chart: { type: "line", toolbar: { show: false } },
    xaxis: { categories: meses, title: { text: 'Mes' } },
    yaxis: { title: { text: '$ (pesos)' }, labels: { formatter: (val) => `$${(val / 1000).toFixed(0)}k` } },
    colors: ["#10b981"],
    stroke: { width: 3, curve: 'smooth' },
    tooltip: { y: { formatter: (val) => `$${Number(val).toLocaleString('es-MX')}` } }
  };

  // Ingreso de cada mes (no acumulado)
  const trendChartSeries = [{ name: "Ingresos del mes", data: retornoMensual }];

  const distribucionSeries = distribucion.map(item => Number(item.total));
  const distribucionLabels = distribucion.map(item => item.categoria || 'Sin categoría');

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
              formatter: (w) => w.globals.seriesTotals.reduce((a, b) => a + b, 0) + " empeños"
            }
          }
        }
      }
    }
  };

  const cohortesChartOptions = {
    chart: { type: "bar", toolbar: { show: false } },
    plotOptions: {
      bar: { horizontal: true, distributed: true, borderRadius: 6, barHeight: '70%' }
    },
    colors: cohortes.map(c => c.color),
    dataLabels: { enabled: true, formatter: (val) => `${val} empeños`, style: { fontSize: '12px', fontWeight: 600, colors: ['#fff'] } },
    xaxis: { categories: cohortes.map(c => c.rango), labels: { style: { fontSize: '12px' } } },
    legend: { show: false },
    tooltip: {
      y: {
        formatter: (val, opts) => {
          const item = cohortes[opts.dataPointIndex];
          return `${val} empeños · $${Number(item?.monto || 0).toLocaleString('es-MX')}`;
        }
      }
    },
    grid: { borderColor: '#e5e7eb', strokeDashArray: 5 }
  };

  const cohortesChartSeries = [{ name: "Empeños", data: cohortes.map(c => Number(c.cantidad)) }];
  const totalCohortes = cohortes.reduce((s, c) => s + Number(c.cantidad || 0), 0);

  // ============================================================
  // AUXILIARES
  // ============================================================
  const formatearMoneda = (monto) =>
    new Intl.NumberFormat('es-MX', {
      style: 'currency', currency: 'MXN', minimumFractionDigits: 2
    }).format(monto || 0);

  const formatearPorcentaje = (valor) =>
    new Intl.NumberFormat('es-MX', {
      style: 'percent', minimumFractionDigits: 2, maximumFractionDigits: 2
    }).format((valor || 0) / 100);

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

  const puedeVerEvolucionAcumulada = () =>
    hasPermission('ver_dashboard') && hasAnyPermission(['ver_reportes', 'ver_dashboard']);
  const puedeVerGraficasBasicas = () => hasAnyPermission(['ver_reportes', 'ver_dashboard']);
  const puedeVerMorosidad = () => hasAnyPermission(['ver_reportes', 'ver_empenos']);
  const puedeVerTopClientes = () => hasPermission('ver_clientes');
  const puedeVerArticulosMasEmpenados = () => hasAnyPermission(['ver_tienda', 'ver_empenos']);

  const totalAlertas = (resumen.proximos_vencer || 0) + (resumen.empenos_vencidos || 0);

  const iconosActividad = {
    pago: { Icon: CheckCircleIcon, clase: 'success' },
    empeno: { Icon: CelebrationIcon, clase: 'info' },
    vencido: { Icon: WarningIcon, clase: 'warning' },
    cliente: { Icon: PersonAddIcon, clase: 'primary' },
  };

  // ============================================================
  // RENDER
  // ============================================================
  return (
    <div className="dashboard">
      <div className="content">

        {/* HEADER */}
        <div className="owner-header">
          <div className="header-top">
            <h1>
              Hola, {datosPerfil.nombre.split(' ')[0] || 'Usuario'}
              <p className="header-sub">Conoce el estado de tu casa de empeño</p>
            </h1>
          </div>
        </div>

        {/* SALUD DEL NEGOCIO + META DEL MES (solo Premium) */}
        {esPremium && (
          <div className="hero-grid">
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
                    <div className="factor">
                      <span title={
                        healthScore.detalles
                          ? `${healthScore.detalles.activos} activos de ${healthScore.detalles.activos + healthScore.detalles.vencidos} empeños`
                          : 'Cargando datos...'
                      }>Cartera sana</span>
                      <div className="factor-bar">
                        <div className="factor-fill" style={{ width: `${healthScore.factores.cartera_sana}%` }}></div>
                      </div>
                      <span>{healthScore.factores.cartera_sana}</span>
                    </div>

                    <div className="factor">
                      <span title={
                        healthScore.detalles
                          ? `Pérdida: $${Number(healthScore.detalles.perdida_total).toLocaleString()} (${healthScore.detalles.tasa_perdida}% del capital)`
                          : 'Cargando datos...'
                      }>Morosidad</span>
                      <div className="factor-bar">
                        <div className="factor-fill warning" style={{ width: `${healthScore.factores.morosidad}%` }}></div>
                      </div>
                      <span>{healthScore.factores.morosidad}</span>
                    </div>

                    <div className="factor">
                      <span title={
                        healthScore.detalles
                          ? `Por cobrar en 30 días: $${Number(healthScore.detalles.proximos_30d).toLocaleString()}`
                          : 'Cargando datos...'
                      }>Liquidez</span>
                      <div className="factor-bar">
                        <div className="factor-fill success" style={{ width: `${healthScore.factores.liquidez}%` }}></div>
                      </div>
                      <span>{healthScore.factores.liquidez}</span>
                    </div>

                    <div className="factor">
                      <span title="Comparación de ganancia mes actual vs mes anterior">Tendencia</span>
                      <div className="factor-bar">
                        <div className="factor-fill" style={{ width: `${healthScore.factores.tendencia}%` }}></div>
                      </div>
                      <span>{healthScore.factores.tendencia}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="hero-card meta-card">
              <div className="hero-card-header">
                <FlagIcon />
                <span>Meta del Mes</span>
              </div>
              {metaObjetivo > 0 ? (
                <div className="meta-content">
                  <div className="meta-amount">
                    <span className="meta-actual">{formatearMoneda(metaActual)}</span>
                    <span className="meta-objetivo">de {formatearMoneda(metaObjetivo)}</span>
                  </div>
                  <div className="meta-progress">
                    <div className="meta-progress-bar">
                      <div className="meta-progress-fill" style={{ width: `${metaPct}%` }}></div>
                    </div>
                    <span className="meta-progress-percent">{metaPct.toFixed(0)}%</span>
                  </div>
                  <div className="meta-info">
                    <div className="meta-info-item">
                      <span>Días transcurridos</span>
                      <strong>{meta.dias_transcurridos} / {meta.dias_totales}</strong>
                    </div>
                    <div className="meta-info-item">
                      <span>Proyección al cierre</span>
                      <strong className={metaProyeccion < metaObjetivo ? 'danger' : 'success'}>
                        {formatearMoneda(metaProyeccion)}
                      </strong>
                    </div>
                  </div>
                  {metaProyeccion < metaObjetivo ? (
                    <div className="meta-warning">
                      <TrendingDownIcon />
                      <span>Vas por debajo de la meta. Faltarían {formatearMoneda(metaObjetivo - metaProyeccion)}.</span>
                    </div>
                  ) : (
                    <div className="meta-warning">
                      <TrendingUpIcon />
                      <span>Vas en camino de superar la meta del mes.</span>
                    </div>
                  )}
                  <small className="chart-subtitle">
                    La meta se calcula con tus ingresos del mes anterior.
                  </small>
                </div>
              ) : (
                <div className="meta-content">
                  <p className="chart-subtitle">
                    Aún no hay historial de ingresos para calcular una meta.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TARJETAS */}
        <div className="cards-grid">
          <PermissionGuard permission="ver_empenos">
            <div className="stat-card" onClick={cargarActivos}>
              <AssignmentIcon className="card-icon" />
              <h3>Empeños Activos</h3>
              <p className="stat-number">{resumen.empenos_activos || 0}</p>
            </div>
          </PermissionGuard>

          <PermissionGuard permission="ver_empenos">
            <div className="stat-card" onClick={cargarVencidos}>
              <WarningIcon className="card-icon" />
              <h3>Empeños Vencidos</h3>
              <p className="stat-number">{resumen.empenos_vencidos || 0}</p>
            </div>
          </PermissionGuard>

          <PermissionGuard permission="ver_empenos">
            <div className="stat-card" onClick={cargarProximos}>
              <AccessTimeIcon className="card-icon" />
              <h3>Próximos a Vencer</h3>
              <p className="stat-number">{resumen.proximos_vencer || 0}</p>
            </div>
          </PermissionGuard>

          <PermissionGuard permission="ver_pagos">
            <div className="stat-card" onClick={cargarIngresos}>
              <AttachMoneyIcon className="card-icon" />
              <h3>Ingresos del Mes</h3>
              <p className="stat-number">{formatearMoneda(ingresosMes)}</p>
              {deltaIngresos !== null ? (
                <span className={`stat-delta ${deltaIngresos >= 0 ? 'up' : 'down'}`}>
                  {deltaIngresos >= 0 ? <TrendingUpIcon /> : <TrendingDownIcon />}
                  {deltaIngresos >= 0 ? '+' : ''}{deltaIngresos.toFixed(1)}% vs mes ant.
                </span>
              ) : ingresosMes === 0 ? (
                <span className="stat-hint-muted">Sin ingresos este mes</span>
              ) : null}
            </div>
          </PermissionGuard>

          <div className="stat-card gold-card" onClick={() => setShowPrecioOroModal(true)}>
            <MonetizationOnIcon className="card-icon" />
            <h3>Precio del Oro</h3>
            <p className="stat-number">
              {resumen.precio_oro != null
                ? `$${Number(resumen.precio_oro).toLocaleString('es-MX')} / g`
                : 'No disponible'}
            </p>
          </div>
        </div>

        {/* RENTABILIDAD */}
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
              {distribucionSeries.length > 0 ? (
                <Chart options={categoriaDistribucionOptions} series={distribucionSeries} type="donut" height={smallChartHeight} />
              ) : (
                <p className="chart-subtitle" style={{ textAlign: 'center', padding: '40px 0' }}>
                  Sin empeños este año
                </p>
              )}
            </div>
          </div>
        )}

        {/* PROYECCIÓN DE COBRANZA (solo Premium) */}
        {esPremium && (
          <div className="proyeccion-card">
            <h2>
              <EventNoteIcon />
              Proyección de Cobranza (Próximos 30 días)
            </h2>
            <div className="proyeccion-grid">
              <div className="proyeccion-item">
                <span className="proyeccion-label">Por cobrar</span>
                <span className="proyeccion-valor success">{formatearMoneda(proyeccion.por_cobrar_30d)}</span>
              </div>
              <div className="proyeccion-item">
                <span className="proyeccion-label">Cuotas que vencen</span>
                <span className="proyeccion-valor">{proyeccion.cuotas_vencen_30d}</span>
              </div>
              <div className="proyeccion-item">
                <span className="proyeccion-label">En riesgo</span>
                <span className="proyeccion-valor warning">{formatearMoneda(proyeccion.en_riesgo)}</span>
              </div>
              <div className="proyeccion-item">
                <span className="proyeccion-label">Ya atrasado</span>
                <span className="proyeccion-valor danger">{formatearMoneda(proyeccion.ya_atrasado)}</span>
              </div>
            </div>
          </div>
        )}

        {/* ANTIGÜEDAD DE LA CARTERA */}
        <div className="nueva-seccion">
          <h2><TimelineIcon /> Antigüedad de la Cartera<span className="seccion-badge">Riesgo por tiempo</span></h2>
          <p className="chart-subtitle">
            Empeños vigentes y vencidos según hace cuánto tiempo se otorgaron. Los de mayor antigüedad son los más riesgosos.
          </p>
          {totalCohortes > 0 ? (
            <Chart options={cohortesChartOptions} series={cohortesChartSeries} type="bar" height={220} />
          ) : (
            <p className="chart-subtitle" style={{ textAlign: 'center', padding: '30px 0' }}>
              No hay empeños en cartera
            </p>
          )}
        </div>

        {/* CLIENTES EN RIESGO (solo Premium) */}
        {esPremium && (
          <div className="nueva-seccion">
            <h2>
              <NotificationsActiveIcon />
              Clientes en Riesgo
              <span className="seccion-badge warning">
                {clientesEnRiesgo.length} requieren atención
              </span>
            </h2>
            <div className="clientes-riesgo-lista">
              {clientesEnRiesgo.length === 0 ? (
                <p className="chart-subtitle" style={{ textAlign: 'center' }}>
                  No hay clientes con pagos atrasados
                </p>
              ) : (
                clientesEnRiesgo.map((c, i) => (
                  <div key={i} className={`cliente-riesgo-item ${c.alerta}`}>
                    <div className="cliente-riesgo-info">
                      <strong>{c.nombre}</strong>
                      <span className="cliente-riesgo-dias">{c.dias_sin_pagar} días de atraso</span>
                    </div>
                    <div className="cliente-riesgo-deuda">
                      <span>Deuda:</span>
                      <strong>{formatearMoneda(c.deuda)}</strong>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* TOP CLIENTES */}
        {puedeVerTopClientes() && (
          <div className="nueva-seccion">
            <h2><EmojiEventsIcon /> Top 5 Clientes (Mayores Ganancias)</h2>
            <div className="tabla-container">
              <table className="tabla-moderna">
                <thead>
                  <tr><th>Cliente</th><th>Empeños</th><th>Monto Prestado</th><th>Ganancia Generada</th><th>% Ganancia</th><th>Último Empeño</th></tr>
                </thead>
                <tbody>
                  {dashboardData.top_clientes?.map(cliente => (
                    <tr key={cliente.id_cliente}>
                      <td><strong>{cliente.nombre}</strong></td>
                      <td>{cliente.empenos}</td>
                      <td>{formatearMoneda(cliente.monto_total)}</td>
                      <td className="profit-text">{formatearMoneda(cliente.ganancia_generada)}</td>
                      <td><span className="profit-badge">+{formatearPorcentaje(cliente.porcentaje_ganancia)}</span></td>
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
        )}

        {/* MOROSIDAD */}
        {puedeVerMorosidad() && (
          <div className="nueva-seccion">
            <h2><WarningIcon /> Morosidad - Clientes con Mayor Pérdida</h2>
            <div className="tabla-container">
              <table className="tabla-moderna">
                <thead>
                  <tr><th>Cliente</th><th>Total Prestado</th><th>Deuda Vencida</th><th>Pérdida Proyectada</th><th>% Pérdida</th><th>Días en Mora</th><th>Último Pago</th></tr>
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
        )}

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
                  <tr><th>Cliente</th><th>Artículo</th><th>Folio</th><th>N° Pago</th><th>Fecha Programada</th><th>Monto Total</th><th>Pagado</th><th>Saldo Restante</th><th>Estado</th></tr>
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

        {/* ANÁLISIS POR CATEGORÍA */}
        <div className="nueva-seccion">
          <h2><CategoryIcon /> Análisis por Categoría<span className="seccion-badge">Rentabilidad y riesgo</span></h2>
          <div className="tabla-container">
            <table className="tabla-moderna">
              <thead>
                <tr><th>Categoría</th><th>Cantidad</th><th>Ganancia Promedio</th><th>Tasa de Mora</th><th>Rentabilidad</th></tr>
              </thead>
              <tbody>
                {analisisCategorias.length === 0 ? (
                  <tr><td colSpan="5" style={{ textAlign: 'center' }}>No hay datos</td></tr>
                ) : (
                  analisisCategorias.map((cat, i) => (
                    <tr key={i}>
                      <td><strong>{cat.categoria}</strong></td>
                      <td>{cat.cantidad}</td>
                      <td className="profit-text">{formatearMoneda(cat.ganancia_promedio)}</td>
                      <td>
                        <span className={cat.tasa_mora > 50 ? 'badge-danger' : cat.tasa_mora > 30 ? 'badge-warning' : 'profit-badge'}>
                          {cat.tasa_mora}%
                        </span>
                      </td>
                      <td>
                        <span className={`rentabilidad-tag ${String(cat.rentabilidad).toLowerCase()}`}>
                          {cat.rentabilidad}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ARTÍCULOS MÁS EMPEÑADOS */}
        {puedeVerArticulosMasEmpenados() && (
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
        )}

        {/* ACTIVIDAD RECIENTE */}
        <div className="nueva-seccion">
          <h2><HistoryIcon /> Actividad Reciente</h2>
          <div className="actividad-lista">
            {actividad.length === 0 ? (
              <p className="chart-subtitle" style={{ textAlign: 'center' }}>Sin actividad reciente</p>
            ) : (
              actividad.map((item, index) => {
                const { Icon, clase } = iconosActividad[item.tipo] || iconosActividad.pago;
                return (
                  <div key={index} className="actividad-item">
                    <Icon className={`actividad-icon ${clase}`} />
                    <div className="actividad-detalle">
                      <p>
                        <strong>{item.descripcion}</strong>
                        {item.cliente && <span className="actividad-cliente"> · {item.cliente}</span>}
                      </p>
                      <small>{item.fecha}</small>
                    </div>
                    {item.monto ? (
                      <div className="actividad-monto">{formatearMoneda(item.monto)}</div>
                    ) : null}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* MODAL DE SUSCRIPCIÓN / PLANES */}
      {showSuscripcionModal && estadoSuscripcion && (
        <div className="modal-suscripcion-overlay" onClick={cerrarSuscripcionModal}>
          <div className="modal-suscripcion" onClick={(e) => e.stopPropagation()}>
            <button className="modal-cerrar" onClick={cerrarSuscripcionModal}>
              <CloseIcon />
            </button>

            <div className="modal-header">
              <h2>
                <CreditCardIcon style={{ color: "#f0d89d" }} /> Mejorar mi plan
              </h2>
              <span className="cliente-id">
                Plan actual: <strong>{estadoSuscripcion.planNombre}</strong>
                {estadoSuscripcion.diasRestantes > 0 &&
                  ` · ${estadoSuscripcion.diasRestantes} días restantes`}
              </span>
            </div>

            <div className="modal-body">
              <div className={"suscripcion-banner " + (estadoSuscripcion.vencido ? "danger" : "warning")}>
                {estadoSuscripcion.vencido
                  ? "Tu suscripción venció. Renueva ahora para no perder acceso a tus empeños, inventario y reportes."
                  : "Tu plan vence pronto. Renueva ahora o cambia de plan para no interrumpir tu servicio."}
              </div>

              <PricingComparison readOnly currentPlanId={estadoSuscripcion.planClave} />
            </div>

            <div className="modal-acciones">
              <button className="btn-actualizar" onClick={abrirPortalOGestion}>
                {estadoSuscripcion.stripeSubscriptionId ? "Gestionar suscripción" : "Configurar plan"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE PERFIL */}
      {showPerfil && (
        <div className="modal-overlay" onClick={() => setShowPerfil(false)}>
          <div className="modal-detalle modal-perfil" onClick={(e) => e.stopPropagation()}>
            <button className="modal-cerrar" onClick={() => setShowPerfil(false)}><CloseIcon /></button>
            <div className="modal-header perfil-header">
              <h2>Mi Perfil</h2>
              <span className="cliente-id">Información personal</span>
            </div>
            <div className="modal-body">
              <div className="perfil-container">
                <div className="perfil-avatar">
                  <img src={datosPerfil.fotoPerfil} alt={datosPerfil.nombre} />
                </div>
                <div className="perfil-info-grid">
                  <div className="perfil-info-item"><span className="perfil-label">Nombre completo</span><span className="perfil-valor">{datosPerfil.nombre}</span></div>
                  <div className="perfil-info-item"><span className="perfil-label">Email</span><span className="perfil-valor">{datosPerfil.email}</span></div>
                  <div className="perfil-info-item"><span className="perfil-label">Teléfono</span><span className="perfil-valor">{datosPerfil.telefono}</span></div>
                  <div className="perfil-info-item"><span className="perfil-label">Rol</span><span className="perfil-valor">{datosPerfil.rol}</span></div>
                  <div className="perfil-info-item"><span className="perfil-label">Sucursal</span><span className="perfil-valor">{datosPerfil.sucursal}</span></div>
                  <div className="perfil-info-item"><span className="perfil-label">Miembro desde</span><span className="perfil-valor">{datosPerfil.fechaRegistro}</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE ALERTAS */}
      {showAlertas && (
        <div className="modal-overlay" onClick={() => setShowAlertas(false)}>
          <div className="modal-detalle modal-alertas" onClick={(e) => e.stopPropagation()}>
            <button className="modal-cerrar" onClick={() => setShowAlertas(false)}><CloseIcon /></button>
            <div className="modal-header">
              <h2><NotificationsIcon />Notificaciones</h2>
            </div>
            <div className="modal-body">
              <div className="alertas-modal-lista">
                <div className="alerta-modal-item warning">
                  <WarningIcon className="alerta-modal-icon" />
                  <div className="alerta-modal-contenido">
                    <h4>{resumen.proximos_vencer || 0} empeños por vencer esta semana</h4>
                    <p>Próximos a vencer: Revisa el detalle</p>
                    <small>Vencen en los próximos 7 días</small>
                  </div>
                </div>
                <div className="alerta-modal-item danger">
                  <ErrorIcon className="alerta-modal-icon" />
                  <div className="alerta-modal-contenido">
                    <h4>{resumen.empenos_vencidos || 0} empeños vencidos requieren atención</h4>
                    <small>Requieren acción inmediata</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ACTIVOS */}
      {showActivos && (
        <PermissionGuard permission="ver_empenos">
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
        </PermissionGuard>
      )}

      {/* MODAL: VENCIDOS */}
      {showVencidos && (
        <PermissionGuard permission="ver_empenos">
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
        </PermissionGuard>
      )}

      {/* MODAL: PRÓXIMOS */}
      {showProximos && (
        <PermissionGuard permission="ver_empenos">
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
        </PermissionGuard>
      )}

      {/* MODAL: INGRESOS DEL MES */}
      {showIngresos && (
        <PermissionGuard permission="ver_pagos">
          <div className="modal-overlay" onClick={() => setShowIngresos(false)}>
            <div className="modal-detalle" onClick={(e) => e.stopPropagation()}>
              <button className="modal-cerrar" onClick={() => setShowIngresos(false)}><CloseIcon /></button>
              <div className="modal-header">
                <h2><AttachMoneyIcon /> Ingresos del Mes</h2>
                <span className="cliente-id">Total: {ingresosRecientes.length}</span>
              </div>
              <div className="modal-body">
                <div className="tabla-container-modal">
                  <table className="tabla-modal">
                    <thead><tr><th>Concepto</th><th>Tipo</th><th>Monto</th><th>Fecha</th></tr></thead>
                    <tbody>
                      {ingresosRecientes.length === 0 ? (
                        <tr><td colSpan="4" style={{ textAlign: 'center' }}>Sin ingresos este mes</td></tr>
                      ) : (
                        ingresosRecientes.map((item, i) => (
                          <tr key={i}>
                            <td><strong>{item.concepto}</strong></td>
                            <td>{item.tipo}</td>
                            <td>{formatearMoneda(item.monto)}</td>
                            <td>{item.fecha}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="modal-acciones">
                <button className="btn-cancelar" onClick={() => setShowIngresos(false)}>Cerrar</button>
              </div>
            </div>
          </div>
        </PermissionGuard>
      )}

      {/* MODAL: PRECIOS DEL ORO */}
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