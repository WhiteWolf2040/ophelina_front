// Home/Dueno.jsx - VERSIÓN RESPONSIVE CON DETECCIÓN DE PANTALLA
import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import "./dueno.css";
import api from '../config/api';
import { useSearchParams } from 'react-router-dom';
import { stripeService } from '../services/stripeService';
import PaymentModal from '../components/PaymentModal';
import { usePermissions } from '../hooks/usePermissions';
import PermissionGuard from '../components/PermissionGuard';

// Importar iconos de MUI
import NotificationsIcon from '@mui/icons-material/Notifications';
import AssignmentIcon from '@mui/icons-material/Assignment';
import WarningIcon from '@mui/icons-material/Warning';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import HistoryIcon from '@mui/icons-material/History';
import CloseIcon from '@mui/icons-material/Close';
import BarChartIcon from '@mui/icons-material/BarChart';
import PieChartIcon from '@mui/icons-material/PieChart';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import CelebrationIcon from '@mui/icons-material/Celebration';
import AreaChartIcon from '@mui/icons-material/AreaChart';

const Dueno = () => {
  // ============================================
  // DETECCIÓN DE TAMAÑO DE PANTALLA
  // ============================================
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Alturas de gráficas según el tamaño de pantalla
  const chartHeight = windowWidth < 480 ? 250 : windowWidth < 768 ? 300 : 380;
  const smallChartHeight = windowWidth < 480 ? 200 : windowWidth < 768 ? 250 : 300;

  // ============================================
  // HOOK DE PERMISOS
  // ============================================
  const { 
    hasPermission, 
    hasAnyPermission, 
    hasAllPermissions, 
    hasModule,
    permisos,
    modulos,
    userRole,
    loading: permissionsLoading 
  } = usePermissions();

  // ============================================
  // HOOKS DE PAGO
  // ============================================
  const [searchParams] = useSearchParams();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentSessionId, setPaymentSessionId] = useState(null);
  const [paymentPlanName, setPaymentPlanName] = useState('');
  const [paymentPlanId, setPaymentPlanId] = useState(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [isLoadingPayment, setIsLoadingPayment] = useState(false);

  // Detectar pago exitoso
  useEffect(() => {
    const storedSessionId = localStorage.getItem('stripe_session_id');
    const sessionId = searchParams.get('session_id') || storedSessionId;
    const paymentStatus = searchParams.get('payment');
    
    console.log('🔍 Parámetros de URL en /home:', { sessionId, paymentStatus });
    console.log('🔍 Session ID guardado:', storedSessionId);
    
    if (sessionId && (paymentStatus === 'success' || storedSessionId)) {
      console.log('✅ Pago detectado, session_id:', sessionId);
      
      const planId = localStorage.getItem('pending_plan_id');
      const planName = localStorage.getItem('pending_plan_name');
      
      setPaymentSessionId(sessionId);
      setPaymentPlanName(planName || 'Premium');
      setPaymentPlanId(planId);
      setShowPaymentModal(true);
      
      verificarPago(sessionId, planId);
      
      localStorage.removeItem('stripe_session_id');
      window.history.replaceState({}, document.title, '/home');
    } else {
      console.log('ℹ No hay parámetros de pago en la URL');
    }
  }, [searchParams]);

  // Función de verificación de pago
  const verificarPago = async (sessionId, planId) => {
    try {
      setIsProcessingPayment(true);
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const empresaId = user.id_empresa;
      
      console.log('🔄 Verificando pago...', { sessionId, empresaId, planId });
      
      const token = localStorage.getItem('token');
      if (!token) {
        alert('⚠️ No tienes sesión activa. Inicia sesión nuevamente.');
        window.location.href = '/login';
        return;
      }
      
      const planIdNumerico = parseInt(planId);
      const planIdFinal = isNaN(planIdNumerico) ? 3 : planIdNumerico;
      
      const response = await stripeService.verifyPayment({
        session_id: sessionId,
        empresa_id: empresaId,
        plan_id: planIdFinal
      });
      
      console.log('✅ Respuesta de verificación:', response);
      
      if (response.success) {
        console.log('🎉 Pago verificado correctamente');
        await cargarUsuarioActual();
        await cargarDashboard();
        await cargarModulosPorPlan();
        alert('✅ ¡Pago exitoso! Tu plan ha sido actualizado.');
        localStorage.removeItem('pending_plan_id');
        localStorage.removeItem('pending_plan_name');
        localStorage.removeItem('pending_plan_price');
        setShowPaymentModal(false);
      } else {
        console.error('❌ Error verificando pago:', response.message);
        alert(`Error: ${response.message || 'Error desconocido'}`);
      }
    } catch (error) {
      console.error('❌ Error al verificar pago:', error);
      if (error.response) {
        alert(`Error ${error.response.status}: ${error.response.data?.message || error.message}`);
      } else {
        alert('Error al verificar el pago. Contacta a soporte.');
      }
    } finally {
      setIsProcessingPayment(false);
    }
  };

  // Verificar suscripción
  useEffect(() => {
    const verificarSuscripcion = async () => {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const empresaId = user.id_empresa;
      
      if (!empresaId) return;
      
      try {
        const response = await stripeService.checkSubscription(empresaId);
        console.log('📊 Estado de suscripción:', response);
        
        if (!response.activo && response.dias_restantes <= 0 && !isProcessingPayment) {
          alert('⚠️ Tu suscripción ha vencido. Serás redirigido para renovar.');
          localStorage.setItem('redirect_after_payment', '/home');
          window.location.href = '/';
        }
      } catch (error) {
        console.error('❌ Error al verificar suscripción:', error);
      }
    };
    
    if (!isProcessingPayment) {
      verificarSuscripcion();
    }
  }, [isProcessingPayment]);

  // ============================================
  // ESTADOS
  // ============================================
  const [showActivos, setShowActivos] = useState(false);
  const [showVencidos, setShowVencidos] = useState(false);
  const [showProximos, setShowProximos] = useState(false);
  const [showIngresos, setShowIngresos] = useState(false);
  const [showAlertas, setShowAlertas] = useState(false);
  const [showPerfil, setShowPerfil] = useState(false);
  const [morosidad, setMorosidad] = useState([]);
  const [modulosPermitidos, setModulosPermitidos] = useState([]);
  const [planInfo, setPlanInfo] = useState({ plan_id: null, plan_nombre: '' });
  const [amortizacionesPendientes, setAmortizacionesPendientes] = useState([]);
  const [loadingAmortizaciones, setLoadingAmortizaciones] = useState(false);

  // Estados para datos de modales
  const [empenosActivos, setEmpenosActivos] = useState([]);
  const [empenosVencidos, setEmpenosVencidos] = useState([]);
  const [proximosVencer, setProximosVencer] = useState([]);
  const [ingresosRecientes, setIngresosRecientes] = useState([]);

  // Estado para precios del oro
  const [showPrecioOroModal, setShowPrecioOroModal] = useState(false);
  const [preciosQuilates, setPreciosQuilates] = useState({
    precio_24k: 0,
    precio_22k: 0,
    precio_21k: 0,
    precio_18k: 0,
    precio_14k: 0,
    precio_10k: 0,
    ultima_actualizacion: null
  });

  // DATOS DEL PERFIL
  const [datosPerfil, setDatosPerfil] = useState({
    nombre: "Cargando...",
    email: "cargando...",
    telefono: "cargando...",
    rol: "cargando...",
    fechaRegistro: "cargando...",
    sucursal: "Casa Matriz - Mérida",
    fotoPerfil: "https://ui-avatars.com/api/?name=Usuario&size=128&background=1e3a8a&color=fff&bold=true"
  });

  // Estados para datos del dashboard
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState({
    resumen: {
      empenos_activos: 0,
      empenos_vencidos: 0,
      proximos_vencer: 0,
      ingresos_recientes: 0,
      precio_oro: 850,
      total_clientes: 0,
      prendas_disponibles: 0
    },
    top_clientes: [],
    top_articulos: [],
    actividad_reciente: [],
    ingresos_mensuales: []
  });

  // Configuración de GRÁFICA DE ÁREA APILADA
  const [areaChartData, setAreaChartData] = useState({
    series: [
      { name: "Capital Prestado (Acumulado)", data: [] },
      { name: "Retorno (Pagos Acumulados)", data: [] },
      { name: "Ganancia (Acumulada)", data: [] }
    ],
    options: {
      chart: {
        type: 'area',
        height: 380,
        stacked: true,
        toolbar: {
          show: true,
          tools: {
            download: true,
            selection: false,
            zoom: false,
            zoomin: false,
            zoomout: false,
            pan: false,
            reset: false
          }
        },
        zoom: { enabled: false }
      },
      dataLabels: { enabled: false },
      stroke: {
        curve: 'smooth',
        width: 2
      },
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.7,
          opacityTo: 0.3,
          stops: [0, 90, 100]
        }
      },
      xaxis: {
        categories: [],
        title: {
          text: 'Mes',
          style: { fontSize: '11px', fontWeight: 500 }
        },
        labels: {
          rotate: -45,
          style: { fontSize: '10px' },
          hideOverlappingLabels: true
        },
        tickAmount: 5
      },
      yaxis: {
        title: {
          text: '$ (pesos acumulados)',
          style: { fontSize: '11px', fontWeight: 500 }
        },
        labels: {
          formatter: (val) => `$${(val / 1000).toFixed(0)}k`,
          style: { fontSize: '10px' }
        }
      },
      colors: ["#1e3a8a", "#10b981", "#f59e0b"],
      tooltip: {
        y: {
          formatter: function (val) {
            return new Intl.NumberFormat('es-MX', {
              style: 'currency',
              currency: 'MXN',
              minimumFractionDigits: 0
            }).format(val);
          }
        },
        shared: true,
        intersect: false
      },
      legend: {
        position: 'top',
        horizontalAlign: 'center',
        offsetY: 0,
        fontSize: '11px',
        itemMargin: { horizontal: 8, vertical: 4 }
      },
      grid: {
        borderColor: '#e5e7eb',
        strokeDashArray: 5,
        padding: { left: 5, right: 5 }
      }
    }
  });

  // Configuración de gráfica de TENDENCIA
  const [trendChartData, setTrendChartData] = useState({
    series: [{ name: "Retorno Total", data: [] }],
    options: {
      chart: { 
        type: "line", 
        height: 300,
        toolbar: { show: false }
      },
      xaxis: { categories: [], title: { text: 'Mes' } },
      yaxis: { 
        title: { text: '$ (pesos)' },
        labels: { formatter: (val) => `$${(val / 1000).toFixed(0)}k` }
      },
      colors: ["#10b981"],
      stroke: { width: 3, curve: 'smooth' },
      tooltip: { y: { formatter: (val) => `$${val.toLocaleString()}` } }
    }
  });

  const [categoriaDistribucion, setCategoriaDistribucion] = useState({
    series: [],
    options: {
      chart: { type: "donut", height: 300 },
      labels: [],
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
                formatter: function(w) {
                  return w.globals.seriesTotals.reduce((a,b) => a+b, 0) + " artículos";
                }
              }
            }
          }
        }
      }
    }
  });

  // ============================================
  // FUNCIONES DE VERIFICACIÓN DE PERMISOS
  // ============================================
  const puedeVerEvolucionAcumulada = () => {
    return hasPermission('ver_dashboard') && hasAnyPermission(['ver_reportes', 'ver_dashboard']);
  };

  const puedeVerGraficasBasicas = () => {
    return hasAnyPermission(['ver_reportes', 'ver_dashboard']);
  };

  const puedeVerAmortizaciones = () => {
    return hasPermission('ver_empenos');
  };

  const puedeVerMorosidad = () => {
    return hasAnyPermission(['ver_reportes', 'ver_empenos']);
  };

  const puedeVerTopClientes = () => {
    return hasPermission('ver_clientes');
  };

  const puedeVerArticulosMasEmpenados = () => {
    return hasAnyPermission(['ver_tienda', 'ver_empenos']);
  };

  // ============================================
  // FUNCIONES AUXILIARES
  // ============================================
  const formatearFecha = (fecha) => {
    if (!fecha) return "Fecha no disponible";
    try {
      const date = new Date(fecha);
      return date.toLocaleDateString('es-MX', { day: '2-digit', month: '2-digit', year: 'numeric' });
    } catch (e) {
      return fecha;
    }
  };

  const formatearMoneda = (monto) => {
    return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', minimumFractionDigits: 2 }).format(monto || 0);
  };

  const formatearPorcentaje = (valor) => {
    return new Intl.NumberFormat('es-MX', { style: 'percent', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format((valor || 0) / 100);
  };

  const formatFecha = (fecha) => {
    if (!fecha || fecha === '' || fecha === 'Invalid Date') return 'Sin pagos';
    try {
      if (typeof fecha === 'string' && fecha.includes('/')) {
        return fecha;
      }
      const date = new Date(fecha);
      if (isNaN(date.getTime())) return 'Sin pagos';
      return date.toLocaleDateString('es-MX');
    } catch (e) {
      return 'Sin pagos';
    }
  };

  // ============================================
  // FUNCIONES DE CARGA DE DATOS
  // ============================================
  
  const cargarUsuarioActual = async () => {
    try {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        setDatosPerfil(prev => ({
          ...prev,
          nombre: user.nombre || "Usuario",
          email: user.correo || "",
          telefono: user.telefono || "Sin teléfono",
          rol: user.rol || "Usuario",
          fechaRegistro: formatearFecha(user.fecha_registro) || "Fecha no disponible",
          fotoPerfil: user.foto_perfil || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.nombre || 'Usuario')}&size=128&background=1e3a8a&color=fff&bold=true`
        }));
      }

      const response = await api.get('/user');
      if (response.data.success) {
        const user = response.data.data.usuario;
        setDatosPerfil(prev => ({
          ...prev,
          nombre: user.nombre || "Usuario",
          email: user.correo || "",
          telefono: user.telefono || "Sin teléfono",
          rol: user.rol || "Usuario",
          fechaRegistro: formatearFecha(user.fecha_registro),
          fotoPerfil: user.foto_perfil || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.nombre || 'Usuario')}&size=128&background=1e3a8a&color=fff&bold=true`
        }));
        localStorage.setItem('user', JSON.stringify(user));
      }
    } catch (error) {
      console.error('Error cargando usuario:', error);
    }
  };

  const cargarModulosPorPlan = async () => {
    try {
      const response = await api.get('/user');
      if (response.data.success) {
        const usuario = response.data.data.usuario;
        setModulosPermitidos(usuario.modulos || []);
        setPlanInfo({
          plan_id: usuario.plan_id,
          plan_nombre: usuario.plan_nombre
        });
        console.log('📦 Módulos permitidos:', usuario.modulos);
        console.log('📊 Plan:', usuario.plan_nombre);
      }
    } catch (error) {
      console.error('Error cargando módulos:', error);
    }
  };

  const cargarMorosidad = async () => {
    try {
      const response = await api.get('/home/morosidad');
      if (response.data.success) {
        setMorosidad(response.data.data);
      } else {
        console.error('Error en respuesta:', response.data.message);
        setMorosidad([]);
      }
    } catch (error) {
      console.error('Error al cargar morosidad:', error);
      setMorosidad([]);
    }
  };

  const cargarDistribucionCategorias = async () => {
    try {
      const response = await api.get('/home/distribucion-categorias');
      if (response.data.success) {
        const data = response.data.data;
        const series = data.map(item => item.total);
        const labels = data.map(item => item.categoria);
        setCategoriaDistribucion(prev => ({ ...prev, series, options: { ...prev.options, labels } }));
      }
    } catch (error) {
      console.error('Error al cargar distribución de categorías:', error);
    }
  };

  const cargarDashboard = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.get('/home');
      
      if (response.data.success) {
        const data = response.data.data;
        setDashboardData(data);
        
        const capitalRetorno = data.capital_retorno || [];
        const capitalAcumulado = capitalRetorno.map(i => Number(i.capital)) || [];
        const retornoAcumulado = capitalRetorno.map(i => Number(i.retorno)) || [];
        const gananciaAcumulada = capitalRetorno.map(i => Number(i.ganancia)) || [];
        const meses = capitalRetorno.map(i => i.mes) || [];

        setAreaChartData({
          series: [
            { name: "Capital Prestado (Acumulado)", data: capitalAcumulado },
            { name: "Retorno (Pagos Acumulados)", data: retornoAcumulado },
            { name: "Ganancia (Acumulada)", data: gananciaAcumulada }
          ],
          options: {
            ...areaChartData.options,
            xaxis: { ...areaChartData.options.xaxis, categories: meses }
          }
        });

        setTrendChartData({
          series: [{ name: "Retorno Total", data: retornoAcumulado }],
          options: {
            ...trendChartData.options,
            xaxis: { ...trendChartData.options.xaxis, categories: meses }
          }
        });
      }
    } catch (error) {
      console.error('Error al cargar dashboard:', error);
      setError('No se pudo conectar con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  const cargarAmortizacionesPendientes = async () => {
    try {
      setLoadingAmortizaciones(true);
      const response = await api.get('/home/amortizaciones-pendientes');
      if (response.data.success) {
        setAmortizacionesPendientes(response.data.data);
      }
    } catch (error) {
      console.error('Error al cargar amortizaciones:', error);
    } finally {
      setLoadingAmortizaciones(false);
    }
  };

  const cargarPreciosQuilates = async () => {
    try {
      const response = await api.get('/precio-oro/quilates');
      if (response.data.success) {
        setPreciosQuilates(response.data.data);
      }
    } catch (error) {
      console.error('Error al cargar precios por quilate:', error);
    }
  };

  // Funciones para cargar datos específicos de modales
  const cargarActivos = async () => {
  if (!hasPermission('ver_empenos')) return;
  try {
   
    // Usar datos del dashboardData
    const activos = dashboardData?.empenos_activos_data || [];
    setEmpenosActivos(activos);
    setShowActivos(true);
  } catch (error) {
    console.error('Error al cargar activos:', error);
    alert('Error al cargar empeños activos');
  }
};

const cargarVencidos = async () => {
  if (!hasPermission('ver_empenos')) return;
  try {
    const vencidos = dashboardData?.empenos_vencidos_data || [];
    setEmpenosVencidos(vencidos);
    setShowVencidos(true);
  } catch (error) {
    console.error('Error al cargar vencidos:', error);
    alert('Error al cargar empeños vencidos');
  }
};

const cargarProximos = async () => {
  if (!hasPermission('ver_empenos')) return;
  try {
    const proximos = dashboardData?.proximos_vencer_data || [];
    setProximosVencer(proximos);
    setShowProximos(true);
  } catch (error) {
    console.error('Error al cargar próximos:', error);
    alert('Error al cargar próximos a vencer');
  }
};

const cargarIngresos = async () => {
  if (!hasPermission('ver_pagos')) return;
  try {
    const ingresos = dashboardData?.ingresos_recientes_data || [];
    setIngresosRecientes(ingresos);
    setShowIngresos(true);
  } catch (error) {
    console.error('Error al cargar ingresos:', error);
    alert('Error al cargar ingresos recientes');
  }
};

  // ============================================
  // EFECTO PRINCIPAL DE CARGA
  // ============================================
  useEffect(() => {
    cargarDashboard();
    cargarMorosidad();
    cargarDistribucionCategorias();
    cargarUsuarioActual();
    cargarPreciosQuilates();
    cargarModulosPorPlan();
    cargarAmortizacionesPendientes();
  }, []);

  // Manejadores del modal de pago
  const handlePaymentSuccess = (data) => {
    console.log('Pago exitoso:', data);
    cargarDashboard();
    cargarUsuarioActual();
    cargarModulosPorPlan();
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

  // Loading state
 if (loading || permissionsLoading) {
    return (
      <div className="dashboard">
        <div className="content">
          <div className="dueno-loader">
            <span className="dueno-loader-spinner"></span>
            <span>Cargando...</span>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="dashboard">
        <div className="content">
          <div className="error-container">
            <WarningIcon className="error-icon" />
            <h3>Error de conexión</h3>
            <p>{error}</p>
            <button onClick={cargarDashboard} className="btn-reintentar">
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ============================================
  // ✅ RENDER - SOLO CSS
  // ============================================
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
          
            <div className="header-botones">
              <button className="btn-perfil" onClick={() => setShowPerfil(true)} title="Mi Perfil">
                <img src={datosPerfil.fotoPerfil} alt="Perfil" className="perfil-foto" />
              </button>

              <button className="btn-alertas" onClick={() => setShowAlertas(true)} title="Alertas">
                <NotificationsIcon className="alerta-icon" />
                {(dashboardData.resumen?.proximos_vencer + dashboardData.resumen?.empenos_vencidos) > 0 && (
                  <span className="alerta-badge">
                    {dashboardData.resumen?.proximos_vencer + dashboardData.resumen?.empenos_vencidos}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* CARDS */}
        <div className="cards-grid">
          <PermissionGuard permission="ver_empenos">
            <div className="stat-card" onClick={cargarActivos}>
              <AssignmentIcon className="card-icon" />
              <h3>Empeños Activos</h3>
              <p className="stat-number">{dashboardData.resumen?.empenos_activos || 0}</p>
            </div>
          </PermissionGuard>

          <PermissionGuard permission="ver_empenos">
            <div className="stat-card" onClick={cargarVencidos}>
              <WarningIcon className="card-icon" />
              <h3>Empeños Vencidos</h3>
              <p className="stat-number">{dashboardData.resumen?.empenos_vencidos || 0}</p>
            </div>
          </PermissionGuard>

          <PermissionGuard permission="ver_empenos">
            <div className="stat-card" onClick={cargarProximos}>
              <AccessTimeIcon className="card-icon" />
              <h3>Próximos a Vencer</h3>
              <p className="stat-number">{dashboardData.resumen?.proximos_vencer || 0}</p>
            </div>
          </PermissionGuard>

          <PermissionGuard permission="ver_pagos">
            <div className="stat-card" onClick={cargarIngresos}>
              <AttachMoneyIcon className="card-icon" />
              <h3>Ingresos Recientes</h3>
              <p className="stat-number">${(dashboardData.resumen?.ingresos_recientes || 0).toLocaleString()}</p>
            </div>
          </PermissionGuard>

          <div className="stat-card gold-card" onClick={() => setShowPrecioOroModal(true)}>
            <MonetizationOnIcon className="card-icon" />
            <h3>Precio del Oro</h3>
            <p className="stat-number">${dashboardData.resumen?.precio_oro || 850} / gramo</p>
            {dashboardData.resumen?.ultima_actualizacion_oro && (
              <small className="update-info">
                Actualizado: {new Date(dashboardData.resumen.ultima_actualizacion_oro).toLocaleDateString('es-MX')}
              </small>
            )}
            <small className="click-hint">Haz clic para ver precios por quilate</small>
          </div>
        </div>

        {/* GRÁFICAS */}
        {puedeVerEvolucionAcumulada() && (
          <div className="chart-section">
            <h2>
              <AreaChartIcon />
              Evolución Acumulada (Capital vs Retorno vs Ganancia)
            </h2>
            <p className="chart-subtitle">
              El área muestra el crecimiento total del negocio - La diferencia entre Capital y Retorno es la ganancia acumulada
            </p>
            <div className="chart-wrapper">
              <Chart
                options={areaChartData.options}
                series={areaChartData.series}
                type="area"
                height={chartHeight}
              />
            </div>
          </div>
        )}

        {puedeVerGraficasBasicas() && (
          <div className="nuevas-graficas-grid">
            <div className="grafica-nueva-card">
              <h2>
                <TrendingUpIcon />
                Tendencia de Ingresos
              </h2>
              <Chart
                options={trendChartData.options}
                series={trendChartData.series}
                type="line"
                height={smallChartHeight}
              />
            </div>

            <div className="grafica-nueva-card">
              <h2>
                <PieChartIcon />
                Distribución por Categoría
              </h2>
              <Chart
                options={categoriaDistribucion.options}
                series={categoriaDistribucion.series}
                type="donut"
                height={smallChartHeight}
              />
            </div>
          </div>
        )}

        {/* TOP CLIENTES */}
        {puedeVerTopClientes() && (
          <div className="nueva-seccion">
            <h2>
              <EmojiEventsIcon />
              Top 5 Clientes (Mayores Ganancias)
            </h2>
            <div className="tabla-container">
              <table className="tabla-moderna">
                <thead>
                  <tr>
                    <th>Cliente</th>
                    <th>Empeños</th>
                    <th>Monto Prestado</th>
                    <th>Ganancia Generada</th>
                    <th>% Ganancia</th>
                    <th>Último Empeño</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboardData.top_clientes?.map(cliente => (
                    <tr key={cliente.id_cliente}>
                      <td><strong>{cliente.nombre}</strong></td>
                      <td>{cliente.empenos}</td>
                      <td>{formatearMoneda(cliente.monto_total)}</td>
                      <td className="profit-text">{formatearMoneda(cliente.ganancia_generada || (cliente.monto_total * 0.15))}</td>
                      <td>
                        <span className="profit-badge">
                          +{formatearPorcentaje(cliente.porcentaje_ganancia || 15)}
                        </span>
                      </td>
                      <td>{formatFecha(cliente.ultimo_empeno)}</td>
                    </tr>
                  ))}
                  {dashboardData.top_clientes?.length === 0 && (
                    <tr>
                      <td colSpan="6" className="no-data">No hay datos</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* MOROSIDAD */}
        {puedeVerMorosidad() && (
          <div className="nueva-seccion">
            <h2>
              <WarningIcon />
              Morosidad - Clientes con Mayor Pérdida
            </h2>
            <div className="tabla-container">
              <table className="tabla-moderna">
                <thead>
                  <tr>
                    <th>Cliente</th>
                    <th>Total Prestado</th>
                    <th>Deuda Vencida</th>
                    <th>Pérdida Proyectada</th>
                    <th>% Pérdida</th>
                    <th>Días en Mora</th>
                    <th>Último Pago</th>
                  </tr>
                </thead>
                <tbody>
                  {morosidad.map((item, index) => {
                    let porcentaje = item.porcentaje_perdida || ((item.deuda / (item.total_prestado || 1)) * 100);
                    if (porcentaje > 100) porcentaje = 100;
                    
                    return (
                      <tr key={index}>
                        <td><strong>{item.cliente}</strong></td>
                        <td>{formatearMoneda(item.total_prestado)}</td>
                        <td className="loss-text">{formatearMoneda(item.deuda)}</td>
                        <td className="loss-text">{formatearMoneda(item.perdida_proyectada || item.deuda)}</td>
                        <td>
                          <span className="loss-badge">
                            -{porcentaje.toFixed(2)}%
                          </span>
                        </td>
                        <td><span className="badge-danger">{item.pagos_atrasados || item.dias_mora} días</span></td>
                        <td>{item.ultimo_pago && item.ultimo_pago !== 'Invalid Date' 
                          ? formatFecha(item.ultimo_pago) 
                          : 'Sin registro'}</td>
                      </tr>
                    );
                  })}
                  {morosidad.length === 0 && (
                    <tr>
                      <td colSpan="7" className="no-data">No hay datos de morosidad</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* AMORTIZACIONES PENDIENTES */}
        {puedeVerAmortizaciones() && (
          <div className="nueva-seccion">
            <h2>
              <AssignmentIcon />
              Amortizaciones Pendientes
              <span className="seccion-badge">
                {amortizacionesPendientes.length} registros
              </span>
            </h2>
            <div className="tabla-container">
              <table className="tabla-moderna">
                <thead>
                  <tr>
                    <th>Cliente</th>
                    <th>Artículo</th>
                    <th>Folio</th>
                    <th>N° Pago</th>
                    <th>Fecha Programada</th>
                    <th>Monto Total</th>
                    <th>Pagado</th>
                    <th>Saldo Restante</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {loadingAmortizaciones ? (
                    <tr><td colSpan="9" className="loading-text">Cargando...</td></tr>
                  ) : amortizacionesPendientes.length === 0 ? (
                    <tr><td colSpan="9" className="no-data">No hay amortizaciones pendientes</td></tr>
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

        {/* ARTÍCULOS MÁS EMPEÑADOS */}
        {puedeVerArticulosMasEmpenados() && (
          <div className="nueva-seccion">
            <h2>
              <LocalOfferIcon />
              Artículos Más Empeñados
            </h2>
            <div className="tabla-container">
              <table className="tabla-moderna">
                <thead>
                  <tr>
                    <th>Artículo</th>
                    <th>Categoría</th>
                    <th>Cantidad</th>
                    <th>Monto Promedio</th>
                  </tr>
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
                    <tr>
                      <td colSpan="4" className="no-data">No hay datos</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ACTIVIDAD RECIENTE */}
        <div className="nueva-seccion">
          <h2>
            <HistoryIcon />
            Actividad Reciente
          </h2>
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
                  <div className="actividad-monto">
                    {formatearMoneda(actividad.monto)}
                  </div>
                )}
              </div>
            ))}
            {dashboardData.actividad_reciente?.length === 0 && (
              <div className="no-data">No hay actividad reciente</div>
            )}
          </div>
        </div>

        {/* ============================================ */}
        {/* MODALES */}
        {/* ============================================ */}

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
                    <div className="perfil-info-item">
                      <span className="perfil-label">Nombre completo</span>
                      <span className="perfil-valor">{datosPerfil.nombre}</span>
                    </div>
                    <div className="perfil-info-item">
                      <span className="perfil-label">Email</span>
                      <span className="perfil-valor">{datosPerfil.email}</span>
                    </div>
                    <div className="perfil-info-item">
                      <span className="perfil-label">Teléfono</span>
                      <span className="perfil-valor">{datosPerfil.telefono}</span>
                    </div>
                    <div className="perfil-info-item">
                      <span className="perfil-label">Rol</span>
                      <span className="perfil-valor">{datosPerfil.rol}</span>
                    </div>
                    <div className="perfil-info-item">
                      <span className="perfil-label">Sucursal</span>
                      <span className="perfil-valor">{datosPerfil.sucursal}</span>
                    </div>
                    <div className="perfil-info-item">
                      <span className="perfil-label">Miembro desde</span>
                      <span className="perfil-valor">{datosPerfil.fechaRegistro}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MODAL DE EMPEÑOS ACTIVOS */}
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

        {/* MODAL DE EMPEÑOS VENCIDOS */}
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

        {/* MODAL DE PRÓXIMOS A VENCER */}
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

        {/* MODAL DE INGRESOS */}
        {showIngresos && (
          <PermissionGuard permission="ver_pagos">
            <div className="modal-overlay" onClick={() => setShowIngresos(false)}>
              <div className="modal-detalle" onClick={(e) => e.stopPropagation()}>
                <button className="modal-cerrar" onClick={() => setShowIngresos(false)}><CloseIcon /></button>
                <div className="modal-header">
                  <h2><AttachMoneyIcon /> Ingresos Recientes</h2>
                  <span className="cliente-id">Total: {ingresosRecientes.length}</span>
                </div>
                <div className="modal-body">
                  <div className="tabla-container-modal">
                    <table className="tabla-modal">
                      <thead><tr><th>Concepto</th><th>Monto</th><th>Fecha</th></tr></thead>
                      <tbody>
                        {ingresosRecientes.map(item => (
                          <tr key={item.id}>
                            <td><strong>{item.concepto}</strong></td>
                            <td>{formatearMoneda(item.monto)}</td>
                            <td>{item.fecha}</td>
                          </tr>
                        ))}
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

        {/* MODAL DE PRECIOS DEL ORO */}
        {showPrecioOroModal && (
          <div className="modal-overlay" onClick={() => setShowPrecioOroModal(false)}>
            <div className="modal-detalle modal-oro" onClick={(e) => e.stopPropagation()}>
              <button className="modal-cerrar" onClick={() => setShowPrecioOroModal(false)}>
                <CloseIcon />
              </button>
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
                  <div className="quilate-card quilate-24k">
                    <div className="quilate-info"><h3>Oro 24k</h3><p>99.9% pureza</p></div>
                    <div className="quilate-precio"><span className="precio">${preciosQuilates.precio_24k?.toLocaleString()}</span><span className="unidad">/ gramo</span></div>
                  </div>
                  <div className="quilate-card quilate-22k">
                    <div className="quilate-info"><h3>Oro 22k</h3><p>91.7% pureza</p></div>
                    <div className="quilate-precio"><span className="precio">${preciosQuilates.precio_22k?.toLocaleString()}</span><span className="unidad">/ gramo</span></div>
                  </div>
                  <div className="quilate-card quilate-21k">
                    <div className="quilate-info"><h3>Oro 21k</h3><p>87.5% pureza</p></div>
                    <div className="quilate-precio"><span className="precio">${preciosQuilates.precio_21k?.toLocaleString()}</span><span className="unidad">/ gramo</span></div>
                  </div>
                  <div className="quilate-card quilate-18k">
                    <div className="quilate-info"><h3>Oro 18k</h3><p>75.0% pureza</p></div>
                    <div className="quilate-precio"><span className="precio">${preciosQuilates.precio_18k?.toLocaleString()}</span><span className="unidad">/ gramo</span></div>
                  </div>
                  <div className="quilate-card quilate-14k">
                    <div className="quilate-info"><h3>Oro 14k</h3><p>58.5% pureza</p></div>
                    <div className="quilate-precio"><span className="precio">${preciosQuilates.precio_14k?.toLocaleString()}</span><span className="unidad">/ gramo</span></div>
                  </div>
                  <div className="quilate-card quilate-10k">
                    <div className="quilate-info"><h3>Oro 10k</h3><p>41.7% pureza</p></div>
                    <div className="quilate-precio"><span className="precio">${preciosQuilates.precio_10k?.toLocaleString()}</span><span className="unidad">/ gramo</span></div>
                  </div>
                </div>
                <div className="oro-nota">
                  <small>ℹ️ Los precios son referenciales basados en el precio del oro de 24k. El precio final puede variar según la joyería y el mercado.</small>
                </div>
              </div>
              <div className="modal-acciones">
                <button className="btn-cerrar" onClick={() => setShowPrecioOroModal(false)}>Cerrar</button>
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
                <h2><NotificationsIcon /> Alertas y Notificaciones</h2>
                <span className="cliente-id">Actualizadas hoy</span>
              </div>
              <div className="modal-body">
                <div className="alertas-modal-lista">
                  <div className="alerta-modal-item warning">
                    <WarningIcon className="alerta-modal-icon" />
                    <div className="alerta-modal-contenido">
                      <h4>{dashboardData.resumen?.proximos_vencer} empeños por vencer esta semana</h4>
                      <p>Próximos a vencer: Revisa el detalle</p>
                      <small>Vencen en los próximos 7 días</small>
                    </div>
                  </div>
                  <div className="alerta-modal-item danger">
                    <ErrorIcon className="alerta-modal-icon" />
                    <div className="alerta-modal-contenido">
                      <h4>{dashboardData.resumen?.empenos_vencidos} empeños vencidos requieren atención</h4>
                      <p>Monto total vencido: {formatearMoneda(dashboardData.resumen?.perdida_total)}</p>
                      <small>Requieren acción inmediata</small>
                    </div>
                  </div>
                  <div className="alerta-modal-item info">
                    <AttachMoneyIcon className="alerta-modal-icon" />
                    <div className="alerta-modal-contenido">
                      <h4>Ingresos del mes: {formatearMoneda(dashboardData.resumen?.ingresos_mes_actual || 0)}</h4>
                      <p>Meta mensual: $100,000</p>
                      <div className="progreso-barra">
                        <div className="progreso-lleno" style={{ width: `${(dashboardData.resumen?.ingresos_mes_actual / 100000 * 100) || 0}%` }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-acciones">
                <button className="btn-cancelar" onClick={() => setShowAlertas(false)}>Cerrar</button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL DE PAGO */}
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={handleClosePaymentModal}
          sessionId={paymentSessionId}
          planName={paymentPlanName}
          planId={paymentPlanId}
          onSuccess={handlePaymentSuccess}
        />
      </div>
    </div>
  );
};

export default Dueno;