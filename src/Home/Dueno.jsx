// Home/Dueno.jsx - VERSIÓN COMPLETA Y FUNCIONAL
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
      const response = await api.get('/home/activos');
      if (response.data.success) {
        setEmpenosActivos(response.data.data);
        setShowActivos(true);
      }
    } catch (error) {
      console.error('Error al cargar activos:', error);
      alert('Error al cargar empeños activos');
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
    } catch (error) {
      console.error('Error al cargar vencidos:', error);
      alert('Error al cargar empeños vencidos');
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
    } catch (error) {
      console.error('Error al cargar próximos:', error);
      alert('Error al cargar próximos a vencer');
    }
  };

  const cargarIngresos = async () => {
    if (!hasPermission('ver_pagos')) return;
    try {
      const response = await api.get('/home/ingresos-recientes');
      if (response.data.success) {
        setIngresosRecientes(response.data.data);
        setShowIngresos(true);
      }
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
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        width: '100%',
        backgroundColor: '#F5F0E9'
      }}>
        <div style={{
          background: 'white',
          padding: '40px',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h2>Cargando dashboard...</h2>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        width: '100%',
        flexDirection: 'column',
        backgroundColor: '#F5F0E9'
      }}>
        <WarningIcon style={{ fontSize: 48, color: '#dc3545', marginBottom: 16 }} />
        <h3>Error de conexión</h3>
        <p>{error}</p>
        <button 
          onClick={cargarDashboard} 
          style={{ 
            marginTop: 16, 
            padding: '10px 24px', 
            background: '#1e3a8a', 
            color: 'white', 
            border: 'none', 
            borderRadius: 8, 
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          Reintentar
        </button>
      </div>
    );
  }

  // ============================================
  // ✅ RENDER - CON ESTILOS INLINE FORZADOS
  // ============================================
  return ( 
    <div style={{ 
      width: '100%',
      minHeight: '100vh',
      padding: '30px 40px',
      backgroundColor: '#F5F0E9',
      boxSizing: 'border-box'
    }}>
      {/* 🔥 BANNER DE CONFIRMACIÓN */}
      <div style={{
        background: 'linear-gradient(135deg, #10b981, #059669)',
        color: 'white',
        padding: '16px 24px',
        borderRadius: '12px',
        marginBottom: '24px',
        fontSize: '16px',
        fontWeight: '600',
        textAlign: 'center',
        boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
      }}>
        ✅ Dashboard cargado correctamente
      </div>

      {/* HEADER */}
      <div className="owner-header" style={{ marginBottom: '24px' }}>
        <div className="header-top" style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          padding: '0 30px',
          marginBottom: '25px'
        }}>
          <h1 style={{ 
            margin: 0, 
            fontSize: '28px', 
            color: '#1e3a8a'
          }}>
            Hola, {datosPerfil.nombre?.split(' ')[0] || 'Usuario'}
            <p className="header-sub" style={{ 
              fontSize: '14px', 
              color: '#6b7280', 
              margin: '4px 0 0 0',
              fontWeight: '400'
            }}>
              Conoce el estado de tu casa de empeño
            </p>
          </h1>
        
          <div className="header-botones" style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <button 
              className="btn-perfil" 
              onClick={() => setShowPerfil(true)} 
              title="Mi Perfil"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'white',
                border: '2px solid #1e3a8a',
                borderRadius: '50px',
                padding: '5px',
                cursor: 'pointer',
                width: '46px',
                height: '46px',
                transition: 'all 0.3s'
              }}
            >
              <img 
                src={datosPerfil.fotoPerfil} 
                alt="Perfil" 
                className="perfil-foto" 
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '2px solid #1e3a8a'
                }} 
              />
            </button>

            <button 
              className="btn-alertas" 
              onClick={() => setShowAlertas(true)} 
              title="Alertas"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'white',
                border: '2px solid #1e3a8a',
                color: '#1e3a8a',
                width: '46px',
                height: '46px',
                borderRadius: '50px',
                cursor: 'pointer',
                position: 'relative',
                transition: 'all 0.3s'
              }}
            >
              <NotificationsIcon className="alerta-icon" />
              {(dashboardData.resumen?.proximos_vencer + dashboardData.resumen?.empenos_vencidos) > 0 && (
                <span className="alerta-badge" style={{
                  position: 'absolute',
                  top: '-5px',
                  right: '-5px',
                  background: '#dc2626',
                  color: 'white',
                  borderRadius: '20px',
                  padding: '2px 6px',
                  fontSize: '11px',
                  fontWeight: '600',
                  minWidth: '18px',
                  height: '18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {dashboardData.resumen?.proximos_vencer + dashboardData.resumen?.empenos_vencidos}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* CARDS */}
      <div className="cards-grid" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(5, 1fr)',
        gap: '20px',
        marginBottom: '24px'
      }}>
        <PermissionGuard permission="ver_empenos">
          <div 
            className="stat-card" 
            onClick={cargarActivos} 
            style={{
              cursor: 'pointer',
              background: 'white',
              padding: '20px',
              borderRadius: '15px',
              boxShadow: '0px 5px 20px rgba(0,0,0,0.1)',
              transition: '0.3s',
              color: '#1e3a8a',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center'
            }}
          >
            <AssignmentIcon className="card-icon" style={{
              fontSize: '32px',
              color: '#1e3a8a',
              marginBottom: '10px',
              background: '#f0f4ff',
              padding: '8px',
              borderRadius: '12px',
              width: '48px',
              height: '48px'
            }} />
            <h3 style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#666' }}>Empeños Activos</h3>
            <p className="stat-number" style={{ margin: 0, fontSize: '24px', fontWeight: 700, color: '#1e3a8a' }}>
              {dashboardData.resumen?.empenos_activos || 0}
            </p>
          </div>
        </PermissionGuard>

        <PermissionGuard permission="ver_empenos">
          <div 
            className="stat-card" 
            onClick={cargarVencidos} 
            style={{
              cursor: 'pointer',
              background: 'white',
              padding: '20px',
              borderRadius: '15px',
              boxShadow: '0px 5px 20px rgba(0,0,0,0.1)',
              transition: '0.3s',
              color: '#1e3a8a',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center'
            }}
          >
            <WarningIcon className="card-icon" style={{
              fontSize: '32px',
              color: '#1e3a8a',
              marginBottom: '10px',
              background: '#f0f4ff',
              padding: '8px',
              borderRadius: '12px',
              width: '48px',
              height: '48px'
            }} />
            <h3 style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#666' }}>Empeños Vencidos</h3>
            <p className="stat-number" style={{ margin: 0, fontSize: '24px', fontWeight: 700, color: '#1e3a8a' }}>
              {dashboardData.resumen?.empenos_vencidos || 0}
            </p>
          </div>
        </PermissionGuard>

        <PermissionGuard permission="ver_empenos">
          <div 
            className="stat-card" 
            onClick={cargarProximos} 
            style={{
              cursor: 'pointer',
              background: 'white',
              padding: '20px',
              borderRadius: '15px',
              boxShadow: '0px 5px 20px rgba(0,0,0,0.1)',
              transition: '0.3s',
              color: '#1e3a8a',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center'
            }}
          >
            <AccessTimeIcon className="card-icon" style={{
              fontSize: '32px',
              color: '#1e3a8a',
              marginBottom: '10px',
              background: '#f0f4ff',
              padding: '8px',
              borderRadius: '12px',
              width: '48px',
              height: '48px'
            }} />
            <h3 style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#666' }}>Próximos a Vencer</h3>
            <p className="stat-number" style={{ margin: 0, fontSize: '24px', fontWeight: 700, color: '#1e3a8a' }}>
              {dashboardData.resumen?.proximos_vencer || 0}
            </p>
          </div>
        </PermissionGuard>

        <PermissionGuard permission="ver_pagos">
          <div 
            className="stat-card" 
            onClick={cargarIngresos} 
            style={{
              cursor: 'pointer',
              background: 'white',
              padding: '20px',
              borderRadius: '15px',
              boxShadow: '0px 5px 20px rgba(0,0,0,0.1)',
              transition: '0.3s',
              color: '#1e3a8a',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center'
            }}
          >
            <AttachMoneyIcon className="card-icon" style={{
              fontSize: '32px',
              color: '#1e3a8a',
              marginBottom: '10px',
              background: '#f0f4ff',
              padding: '8px',
              borderRadius: '12px',
              width: '48px',
              height: '48px'
            }} />
            <h3 style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#666' }}>Ingresos Recientes</h3>
            <p className="stat-number" style={{ margin: 0, fontSize: '24px', fontWeight: 700, color: '#1e3a8a' }}>
              ${(dashboardData.resumen?.ingresos_recientes || 0).toLocaleString()}
            </p>
          </div>
        </PermissionGuard>

        {/* Card de Precio del Oro */}
        <div 
          className="stat-card gold-card" 
          onClick={() => setShowPrecioOroModal(true)} 
          style={{
            cursor: 'pointer',
            background: 'linear-gradient(135deg, #fef3c7, #fde68a)',
            padding: '20px',
            borderRadius: '15px',
            boxShadow: '0px 5px 20px rgba(0,0,0,0.1)',
            transition: '0.3s',
            color: '#1e3a8a',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center'
          }}
        >
          <MonetizationOnIcon className="card-icon" style={{
            fontSize: '32px',
            color: '#1e3a8a',
            marginBottom: '10px',
            background: 'rgba(30, 58, 138, 0.1)',
            padding: '8px',
            borderRadius: '12px',
            width: '48px',
            height: '48px'
          }} />
          <h3 style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#1e3a8a' }}>Precio del Oro</h3>
          <p className="stat-number" style={{ margin: 0, fontSize: '24px', fontWeight: 700, color: '#1e3a8a' }}>
            ${dashboardData.resumen?.precio_oro || 850} / gramo
          </p>
          {dashboardData.resumen?.ultima_actualizacion_oro && (
            <small style={{ fontSize: '10px', color: '#666', display: 'block', marginTop: '5px' }}>
              Actualizado: {new Date(dashboardData.resumen.ultima_actualizacion_oro).toLocaleDateString('es-MX')}
            </small>
          )}
          <small style={{ fontSize: '9px', color: '#000000', display: 'block', marginTop: '3px' }}>
            Haz clic para ver precios por quilate
          </small>
        </div>
      </div>

      {/* ============================================ */}
      {/* GRÁFICAS - CON PERMISOS */}
      {/* ============================================ */}
      {puedeVerEvolucionAcumulada() && (
        <div className="chart-section" style={{
          background: 'white',
          borderRadius: '15px',
          padding: '20px',
          marginBottom: '30px',
          boxShadow: '0px 5px 20px rgba(0,0,0,0.1)',
          color: 'black'
        }}>
          <h2 style={{ color: '#1e3a8a', fontSize: '1.2rem', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AreaChartIcon />
            Evolución Acumulada (Capital vs Retorno vs Ganancia)
          </h2>
          <p className="chart-subtitle" style={{ fontSize: '13px', color: '#6b7280', marginTop: '-8px', marginBottom: '20px', textAlign: 'center' }}>
            El área muestra el crecimiento total del negocio - La diferencia entre Capital y Retorno es la ganancia acumulada
          </p>
          <div className="chart-wrapper" style={{ height: '320px', width: '100%' }}>
            <Chart
              options={areaChartData.options}
              series={areaChartData.series}
              type="area"
              height={380}
            />
          </div>
        </div>
      )}

      {puedeVerGraficasBasicas() && (
        <div className="nuevas-graficas-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '20px',
          marginBottom: '30px'
        }}>
          <div className="grafica-nueva-card" style={{
            background: 'white',
            borderRadius: '15px',
            padding: '20px',
            boxShadow: '0px 5px 20px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{ color: '#1e3a8a', fontSize: '1.1rem', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <TrendingUpIcon />
              Tendencia de Ingresos
            </h2>
            <Chart
              options={trendChartData.options}
              series={trendChartData.series}
              type="line"
              height={300}
            />
          </div>

          <div className="grafica-nueva-card" style={{
            background: 'white',
            borderRadius: '15px',
            padding: '20px',
            boxShadow: '0px 5px 20px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{ color: '#1e3a8a', fontSize: '1.1rem', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <PieChartIcon />
              Distribución por Categoría
            </h2>
            <Chart
              options={categoriaDistribucion.options}
              series={categoriaDistribucion.series}
              type="donut"
              height={300}
            />
          </div>
        </div>
      )}

      {/* ============================================ */}
      {/* TOP CLIENTES */}
      {/* ============================================ */}
      {puedeVerTopClientes() && (
        <div className="nueva-seccion" style={{
          background: 'white',
          borderRadius: '15px',
          padding: '20px',
          marginBottom: '30px',
          boxShadow: '0px 5px 20px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ color: '#1e3a8a', fontSize: '1.2rem', margin: '0 0 20px 0', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '2px solid #f0f0f0', paddingBottom: '10px' }}>
            <EmojiEventsIcon />
            Top 5 Clientes (Mayores Ganancias)
          </h2>
          <div className="tabla-container" style={{ overflowX: 'auto' }}>
            <table className="tabla-moderna" style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ textAlign: 'left', padding: '12px 15px', backgroundColor: '#f8f9fa', color: '#1e3a8a', fontWeight: 600, fontSize: '14px', borderBottom: '2px solid #d3b372' }}>Cliente</th>
                  <th style={{ textAlign: 'left', padding: '12px 15px', backgroundColor: '#f8f9fa', color: '#1e3a8a', fontWeight: 600, fontSize: '14px', borderBottom: '2px solid #d3b372' }}>Empeños</th>
                  <th style={{ textAlign: 'left', padding: '12px 15px', backgroundColor: '#f8f9fa', color: '#1e3a8a', fontWeight: 600, fontSize: '14px', borderBottom: '2px solid #d3b372' }}>Monto Prestado</th>
                  <th style={{ textAlign: 'left', padding: '12px 15px', backgroundColor: '#f8f9fa', color: '#1e3a8a', fontWeight: 600, fontSize: '14px', borderBottom: '2px solid #d3b372' }}>Ganancia Generada</th>
                  <th style={{ textAlign: 'left', padding: '12px 15px', backgroundColor: '#f8f9fa', color: '#1e3a8a', fontWeight: 600, fontSize: '14px', borderBottom: '2px solid #d3b372' }}>% Ganancia</th>
                  <th style={{ textAlign: 'left', padding: '12px 15px', backgroundColor: '#f8f9fa', color: '#1e3a8a', fontWeight: 600, fontSize: '14px', borderBottom: '2px solid #d3b372' }}>Último Empeño</th>
                </tr>
              </thead>
              <tbody>
                {dashboardData.top_clientes?.map(cliente => (
                  <tr key={cliente.id_cliente}>
                    <td style={{ padding: '10px 15px', borderBottom: '1px solid #eee', color: '#333' }}><strong>{cliente.nombre}</strong></td>
                    <td style={{ padding: '10px 15px', borderBottom: '1px solid #eee', color: '#333' }}>{cliente.empenos}</td>
                    <td style={{ padding: '10px 15px', borderBottom: '1px solid #eee', color: '#333' }}>{formatearMoneda(cliente.monto_total)}</td>
                    <td style={{ padding: '10px 15px', borderBottom: '1px solid #eee', color: '#10b981', fontWeight: 600 }}>{formatearMoneda(cliente.ganancia_generada || (cliente.monto_total * 0.15))}</td>
                    <td style={{ padding: '10px 15px', borderBottom: '1px solid #eee', color: '#333' }}>
                      <span style={{ background: '#d1fae5', color: '#065f46', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 600 }}>
                        +{formatearPorcentaje(cliente.porcentaje_ganancia || 15)}
                      </span>
                    </td>
                    <td style={{ padding: '10px 15px', borderBottom: '1px solid #eee', color: '#333' }}>{formatFecha(cliente.ultimo_empeno)}</td>
                  </tr>
                ))}
                {dashboardData.top_clientes?.length === 0 && (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '10px 15px' }}>No hay datos</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ============================================ */}
      {/* MOROSIDAD */}
      {/* ============================================ */}
      {puedeVerMorosidad() && (
        <div className="nueva-seccion" style={{
          background: 'white',
          borderRadius: '15px',
          padding: '20px',
          marginBottom: '30px',
          boxShadow: '0px 5px 20px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ color: '#1e3a8a', fontSize: '1.2rem', margin: '0 0 20px 0', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '2px solid #f0f0f0', paddingBottom: '10px' }}>
            <WarningIcon />
            Morosidad - Clientes con Mayor Pérdida
          </h2>
          <div className="tabla-container" style={{ overflowX: 'auto' }}>
            <table className="tabla-moderna" style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ textAlign: 'left', padding: '12px 15px', backgroundColor: '#f8f9fa', color: '#1e3a8a', fontWeight: 600, fontSize: '14px', borderBottom: '2px solid #d3b372' }}>Cliente</th>
                  <th style={{ textAlign: 'left', padding: '12px 15px', backgroundColor: '#f8f9fa', color: '#1e3a8a', fontWeight: 600, fontSize: '14px', borderBottom: '2px solid #d3b372' }}>Total Prestado</th>
                  <th style={{ textAlign: 'left', padding: '12px 15px', backgroundColor: '#f8f9fa', color: '#1e3a8a', fontWeight: 600, fontSize: '14px', borderBottom: '2px solid #d3b372' }}>Deuda Vencida</th>
                  <th style={{ textAlign: 'left', padding: '12px 15px', backgroundColor: '#f8f9fa', color: '#1e3a8a', fontWeight: 600, fontSize: '14px', borderBottom: '2px solid #d3b372' }}>Pérdida Proyectada</th>
                  <th style={{ textAlign: 'left', padding: '12px 15px', backgroundColor: '#f8f9fa', color: '#1e3a8a', fontWeight: 600, fontSize: '14px', borderBottom: '2px solid #d3b372' }}>% Pérdida</th>
                  <th style={{ textAlign: 'left', padding: '12px 15px', backgroundColor: '#f8f9fa', color: '#1e3a8a', fontWeight: 600, fontSize: '14px', borderBottom: '2px solid #d3b372' }}>Días en Mora</th>
                  <th style={{ textAlign: 'left', padding: '12px 15px', backgroundColor: '#f8f9fa', color: '#1e3a8a', fontWeight: 600, fontSize: '14px', borderBottom: '2px solid #d3b372' }}>Último Pago</th>
                </tr>
              </thead>
              <tbody>
                {morosidad.map((item, index) => {
                  let porcentaje = item.porcentaje_perdida || ((item.deuda / (item.total_prestado || 1)) * 100);
                  if (porcentaje > 100) porcentaje = 100;
                  
                  return (
                    <tr key={index}>
                      <td style={{ padding: '10px 15px', borderBottom: '1px solid #eee', color: '#333' }}><strong>{item.cliente}</strong></td>
                      <td style={{ padding: '10px 15px', borderBottom: '1px solid #eee', color: '#333' }}>{formatearMoneda(item.total_prestado)}</td>
                      <td style={{ padding: '10px 15px', borderBottom: '1px solid #eee', color: '#dc2626', fontWeight: 600 }}>{formatearMoneda(item.deuda)}</td>
                      <td style={{ padding: '10px 15px', borderBottom: '1px solid #eee', color: '#dc2626', fontWeight: 600 }}>{formatearMoneda(item.perdida_proyectada || item.deuda)}</td>
                      <td style={{ padding: '10px 15px', borderBottom: '1px solid #eee', color: '#333' }}>
                        <span style={{ background: '#fee2e2', color: '#991b1b', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 600 }}>
                          -{porcentaje.toFixed(2)}%
                        </span>
                      </td>
                      <td style={{ padding: '10px 15px', borderBottom: '1px solid #eee', color: '#333' }}><span style={{ background: '#fee2e2', color: '#dc2626', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 600 }}>{item.pagos_atrasados || item.dias_mora} días</span></td>
                      <td style={{ padding: '10px 15px', borderBottom: '1px solid #eee', color: '#333' }}>{item.ultimo_pago && item.ultimo_pago !== 'Invalid Date' 
                        ? formatFecha(item.ultimo_pago) 
                        : 'Sin registro'}</td>
                    </tr>
                  );
                })}
                {morosidad.length === 0 && (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '10px 15px' }}>No hay datos de morosidad</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ============================================ */}
      {/* AMORTIZACIONES PENDIENTES */}
      {/* ============================================ */}
      {puedeVerAmortizaciones() && (
        <div className="nueva-seccion" style={{
          background: 'white',
          borderRadius: '15px',
          padding: '20px',
          marginBottom: '30px',
          boxShadow: '0px 5px 20px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ color: '#1e3a8a', fontSize: '1.2rem', margin: '0 0 20px 0', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '2px solid #f0f0f0', paddingBottom: '10px' }}>
            <AssignmentIcon />
            Amortizaciones Pendientes
            <span className="seccion-badge" style={{ background: '#e9ecef', color: '#1e3a8a', fontSize: '12px', padding: '2px 12px', borderRadius: '20px', marginLeft: '8px' }}>
              {amortizacionesPendientes.length} registros
            </span>
          </h2>
          <div className="tabla-container" style={{ overflowX: 'auto' }}>
            <table className="tabla-moderna" style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ textAlign: 'left', padding: '12px 15px', backgroundColor: '#f8f9fa', color: '#1e3a8a', fontWeight: 600, fontSize: '14px', borderBottom: '2px solid #d3b372' }}>Cliente</th>
                  <th style={{ textAlign: 'left', padding: '12px 15px', backgroundColor: '#f8f9fa', color: '#1e3a8a', fontWeight: 600, fontSize: '14px', borderBottom: '2px solid #d3b372' }}>Artículo</th>
                  <th style={{ textAlign: 'left', padding: '12px 15px', backgroundColor: '#f8f9fa', color: '#1e3a8a', fontWeight: 600, fontSize: '14px', borderBottom: '2px solid #d3b372' }}>Folio</th>
                  <th style={{ textAlign: 'left', padding: '12px 15px', backgroundColor: '#f8f9fa', color: '#1e3a8a', fontWeight: 600, fontSize: '14px', borderBottom: '2px solid #d3b372' }}>N° Pago</th>
                  <th style={{ textAlign: 'left', padding: '12px 15px', backgroundColor: '#f8f9fa', color: '#1e3a8a', fontWeight: 600, fontSize: '14px', borderBottom: '2px solid #d3b372' }}>Fecha Programada</th>
                  <th style={{ textAlign: 'left', padding: '12px 15px', backgroundColor: '#f8f9fa', color: '#1e3a8a', fontWeight: 600, fontSize: '14px', borderBottom: '2px solid #d3b372' }}>Monto Total</th>
                  <th style={{ textAlign: 'left', padding: '12px 15px', backgroundColor: '#f8f9fa', color: '#1e3a8a', fontWeight: 600, fontSize: '14px', borderBottom: '2px solid #d3b372' }}>Pagado</th>
                  <th style={{ textAlign: 'left', padding: '12px 15px', backgroundColor: '#f8f9fa', color: '#1e3a8a', fontWeight: 600, fontSize: '14px', borderBottom: '2px solid #d3b372' }}>Saldo Restante</th>
                  <th style={{ textAlign: 'left', padding: '12px 15px', backgroundColor: '#f8f9fa', color: '#1e3a8a', fontWeight: 600, fontSize: '14px', borderBottom: '2px solid #d3b372' }}>Estado</th>
                </tr>
              </thead>
              <tbody>
                {loadingAmortizaciones ? (
                  <tr><td colSpan="9" style={{ textAlign: 'center', padding: '10px 15px' }}>Cargando...</td></tr>
                ) : amortizacionesPendientes.length === 0 ? (
                  <tr><td colSpan="9" style={{ textAlign: 'center', padding: '10px 15px' }}>No hay amortizaciones pendientes</td></tr>
                ) : (
                  amortizacionesPendientes.map((item) => (
                    <tr key={item.id_amortizacion} style={item.dias_atraso > 0 ? { backgroundColor: '#fef2f2' } : {}}>
                      <td style={{ padding: '10px 15px', borderBottom: '1px solid #eee', color: '#333' }}><strong>{item.cliente_nombre}</strong></td>
                      <td style={{ padding: '10px 15px', borderBottom: '1px solid #eee', color: '#333' }}>{item.articulo}</td>
                      <td style={{ padding: '10px 15px', borderBottom: '1px solid #eee', color: '#333' }}><span style={{ background: '#e9ecef', padding: '4px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: 600 }}>{item.folio}</span></td>
                      <td style={{ padding: '10px 15px', borderBottom: '1px solid #eee', color: '#333' }}>{item.numero_pago}</td>
                      <td style={{ padding: '10px 15px', borderBottom: '1px solid #eee', color: '#333' }}>{new Date(item.fecha_pago_programado).toLocaleDateString('es-MX')}</td>
                      <td style={{ padding: '10px 15px', borderBottom: '1px solid #eee', color: '#1e3a8a', fontWeight: 600 }}>{formatearMoneda(item.monto_total)}</td>
                      <td style={{ padding: '10px 15px', borderBottom: '1px solid #eee', color: '#10b981', fontWeight: 600 }}>{formatearMoneda(item.monto_pagado || 0)}</td>
                      <td style={{ padding: '10px 15px', borderBottom: '1px solid #eee', color: '#dc2626', fontWeight: 600 }}>{formatearMoneda(item.saldo_restante)}</td>
                      <td style={{ padding: '10px 15px', borderBottom: '1px solid #eee', color: '#333' }}>
                        {item.dias_atraso > 0 ? (
                          <span style={{ background: '#fee2e2', color: '#dc2626', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 600 }}>{item.dias_atraso} días atrasado</span>
                        ) : (
                          <span style={{ background: '#fef3c7', color: '#d97706', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 600 }}>Pendiente</span>
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

      {/* ============================================ */}
      {/* ARTÍCULOS MÁS EMPEÑADOS */}
      {/* ============================================ */}
      {puedeVerArticulosMasEmpenados() && (
        <div className="nueva-seccion" style={{
          background: 'white',
          borderRadius: '15px',
          padding: '20px',
          marginBottom: '30px',
          boxShadow: '0px 5px 20px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ color: '#1e3a8a', fontSize: '1.2rem', margin: '0 0 20px 0', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '2px solid #f0f0f0', paddingBottom: '10px' }}>
            <LocalOfferIcon />
            Artículos Más Empeñados
          </h2>
          <div className="tabla-container" style={{ overflowX: 'auto' }}>
            <table className="tabla-moderna" style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ textAlign: 'left', padding: '12px 15px', backgroundColor: '#f8f9fa', color: '#1e3a8a', fontWeight: 600, fontSize: '14px', borderBottom: '2px solid #d3b372' }}>Artículo</th>
                  <th style={{ textAlign: 'left', padding: '12px 15px', backgroundColor: '#f8f9fa', color: '#1e3a8a', fontWeight: 600, fontSize: '14px', borderBottom: '2px solid #d3b372' }}>Categoría</th>
                  <th style={{ textAlign: 'left', padding: '12px 15px', backgroundColor: '#f8f9fa', color: '#1e3a8a', fontWeight: 600, fontSize: '14px', borderBottom: '2px solid #d3b372' }}>Cantidad</th>
                  <th style={{ textAlign: 'left', padding: '12px 15px', backgroundColor: '#f8f9fa', color: '#1e3a8a', fontWeight: 600, fontSize: '14px', borderBottom: '2px solid #d3b372' }}>Monto Promedio</th>
                </tr>
              </thead>
              <tbody>
                {dashboardData.top_articulos?.map((articulo, index) => (
                  <tr key={index}>
                    <td style={{ padding: '10px 15px', borderBottom: '1px solid #eee', color: '#333' }}><strong>{articulo.nombre}</strong></td>
                    <td style={{ padding: '10px 15px', borderBottom: '1px solid #eee', color: '#333' }}>{articulo.categoria}</td>
                    <td style={{ padding: '10px 15px', borderBottom: '1px solid #eee', color: '#333' }}>{articulo.cantidad}</td>
                    <td style={{ padding: '10px 15px', borderBottom: '1px solid #eee', color: '#333' }}>{formatearMoneda(articulo.monto_promedio)}</td>
                  </tr>
                ))}
                {dashboardData.top_articulos?.length === 0 && (
                  <tr>
                    <td colSpan="4" style={{ textAlign: 'center', padding: '10px 15px' }}>No hay datos</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ============================================ */}
      {/* ACTIVIDAD RECIENTE */}
      {/* ============================================ */}
      <div className="nueva-seccion" style={{
        background: 'white',
        borderRadius: '15px',
        padding: '20px',
        marginBottom: '30px',
        boxShadow: '0px 5px 20px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ color: '#1e3a8a', fontSize: '1.2rem', margin: '0 0 20px 0', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '2px solid #f0f0f0', paddingBottom: '10px' }}>
          <HistoryIcon />
          Actividad Reciente
        </h2>
        <div className="actividad-lista" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {dashboardData.actividad_reciente?.map((actividad, index) => (
            <div key={index} className="actividad-item" style={{
              display: 'flex',
              alignItems: 'center',
              gap: '15px',
              padding: '12px',
              background: '#f8f9fa',
              borderRadius: '10px',
              transition: '0.3s'
            }}>
              {actividad.tipo === 'pago' ? (
                <CheckCircleIcon className="actividad-icon success" style={{ fontSize: '20px', color: '#10b981' }} />
              ) : (
                <CelebrationIcon className="actividad-icon info" style={{ fontSize: '20px', color: '#3b82f6' }} />
              )}
              <div className="actividad-detalle" style={{ flex: 1 }}>
                <p style={{ margin: '0 0 3px 0', color: '#333', fontSize: '14px' }}><strong>{actividad.descripcion}</strong></p>
                <small style={{ color: '#999', fontSize: '11px' }}>{formatFecha(actividad.fecha)}</small>
              </div>
              {actividad.monto && (
                <div className="actividad-monto" style={{ color: '#1e3a8a', fontWeight: 600 }}>
                  {formatearMoneda(actividad.monto)}
                </div>
              )}
            </div>
          ))}
          {dashboardData.actividad_reciente?.length === 0 && (
            <div style={{ textAlign: 'center', padding: 20 }}>No hay actividad reciente</div>
          )}
        </div>
      </div>

      {/* ============================================ */}
      {/* MODALES */}
      {/* ============================================ */}

      {/* MODAL DE PERFIL */}
      {showPerfil && (
        <div className="modal-overlay" onClick={() => setShowPerfil(false)} style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2000,
          backdropFilter: 'blur(5px)'
        }}>
          <div className="modal-detalle modal-perfil" onClick={(e) => e.stopPropagation()} style={{
            background: 'white',
            borderRadius: '15px',
            width: '500px',
            maxWidth: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            boxShadow: '0 30px 60px rgba(0,0,0,0.3)',
            position: 'relative'
          }}>
            <button className="modal-cerrar" onClick={() => setShowPerfil(false)} style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#999',
              zIndex: 10
            }}>
              <CloseIcon />
            </button>
            <div className="modal-header perfil-header" style={{
              background: 'linear-gradient(135deg, #1e3a8a 0%, #2a4a9e 100%)',
              color: 'white',
              padding: '40px 30px 30px',
              borderRadius: '15px 15px 0 0',
              textAlign: 'center'
            }}>
              <h2 style={{ margin: 0, fontSize: '25px', fontWeight: 600 }}>Mi Perfil</h2>
              <span className="cliente-id" style={{
                display: 'inline-block',
                background: 'rgba(255,255,255,0.2)',
                padding: '6px 15px',
                borderRadius: '20px',
                fontSize: '14px',
                fontWeight: 500,
                marginTop: '8px'
              }}>Información personal</span>
            </div>
            <div className="modal-body" style={{ padding: '30px' }}>
              <div className="perfil-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '30px' }}>
                <div className="perfil-avatar" style={{
                  width: '120px',
                  height: '120px',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  border: '4px solid #1e3a8a',
                  boxShadow: '0 5px 15px rgba(0,0,0,0.2)'
                }}>
                  <img src={datosPerfil.fotoPerfil} alt={datosPerfil.nombre} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div className="perfil-info-grid" style={{
                  width: '100%',
                  display: 'grid',
                  gridTemplateColumns: '1fr',
                  gap: '15px',
                  background: '#f8f9fa',
                  padding: '20px',
                  borderRadius: '15px'
                }}>
                  <div className="perfil-info-item" style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '5px',
                    padding: '10px',
                    background: 'white',
                    borderRadius: '10px'
                  }}>
                    <span className="perfil-label" style={{ color: '#666', fontSize: '12px', fontWeight: 500, textTransform: 'uppercase' }}>Nombre completo</span>
                    <span className="perfil-valor" style={{ color: '#1e3a8a', fontSize: '16px', fontWeight: 600 }}>{datosPerfil.nombre}</span>
                  </div>
                  <div className="perfil-info-item" style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '5px',
                    padding: '10px',
                    background: 'white',
                    borderRadius: '10px'
                  }}>
                    <span className="perfil-label" style={{ color: '#666', fontSize: '12px', fontWeight: 500, textTransform: 'uppercase' }}>Email</span>
                    <span className="perfil-valor" style={{ color: '#1e3a8a', fontSize: '16px', fontWeight: 600 }}>{datosPerfil.email}</span>
                  </div>
                  <div className="perfil-info-item" style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '5px',
                    padding: '10px',
                    background: 'white',
                    borderRadius: '10px'
                  }}>
                    <span className="perfil-label" style={{ color: '#666', fontSize: '12px', fontWeight: 500, textTransform: 'uppercase' }}>Teléfono</span>
                    <span className="perfil-valor" style={{ color: '#1e3a8a', fontSize: '16px', fontWeight: 600 }}>{datosPerfil.telefono}</span>
                  </div>
                  <div className="perfil-info-item" style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '5px',
                    padding: '10px',
                    background: 'white',
                    borderRadius: '10px'
                  }}>
                    <span className="perfil-label" style={{ color: '#666', fontSize: '12px', fontWeight: 500, textTransform: 'uppercase' }}>Rol</span>
                    <span className="perfil-valor" style={{ color: '#1e3a8a', fontSize: '16px', fontWeight: 600 }}>{datosPerfil.rol}</span>
                  </div>
                  <div className="perfil-info-item" style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '5px',
                    padding: '10px',
                    background: 'white',
                    borderRadius: '10px'
                  }}>
                    <span className="perfil-label" style={{ color: '#666', fontSize: '12px', fontWeight: 500, textTransform: 'uppercase' }}>Sucursal</span>
                    <span className="perfil-valor" style={{ color: '#1e3a8a', fontSize: '16px', fontWeight: 600 }}>{datosPerfil.sucursal}</span>
                  </div>
                  <div className="perfil-info-item" style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '5px',
                    padding: '10px',
                    background: 'white',
                    borderRadius: '10px'
                  }}>
                    <span className="perfil-label" style={{ color: '#666', fontSize: '12px', fontWeight: 500, textTransform: 'uppercase' }}>Miembro desde</span>
                    <span className="perfil-valor" style={{ color: '#1e3a8a', fontSize: '16px', fontWeight: 600 }}>{datosPerfil.fechaRegistro}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-acciones" style={{ display: 'flex', gap: '15px', padding: '20px 30px 30px', borderTop: '1px solid #eee' }}>
              <button className="btn-cancelar" onClick={() => setShowPerfil(false)} style={{
                flex: 1,
                padding: '14px 20px',
                border: 'none',
                borderRadius: '12px',
                fontWeight: 600,
                fontSize: '15px',
                cursor: 'pointer',
                transition: 'all 0.3s',
                backgroundColor: '#e5e7eb',
                color: '#333'
              }}>Cerrar</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE EMPEÑOS ACTIVOS */}
      {showActivos && (
        <PermissionGuard permission="ver_empenos">
          <div className="modal-overlay" onClick={() => setShowActivos(false)} style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2000,
            backdropFilter: 'blur(5px)'
          }}>
            <div className="modal-detalle" onClick={(e) => e.stopPropagation()} style={{
              background: 'white',
              borderRadius: '15px',
              width: '700px',
              maxWidth: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 30px 60px rgba(0,0,0,0.3)',
              position: 'relative'
            }}>
              <button className="modal-cerrar" onClick={() => setShowActivos(false)} style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#999',
                zIndex: 10
              }}>
                <CloseIcon />
              </button>
              <div className="modal-header" style={{
                background: 'linear-gradient(135deg, #1e3a8a 0%, #2a4a9e 100%)',
                color: 'white',
                padding: '40px 30px 30px',
                borderRadius: '15px 15px 0 0'
              }}>
                <h2 style={{ margin: 0, fontSize: '25px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <AssignmentIcon /> Empeños Activos
                </h2>
                <span className="cliente-id" style={{
                  display: 'inline-block',
                  background: 'rgba(255,255,255,0.2)',
                  padding: '6px 15px',
                  borderRadius: '20px',
                  fontSize: '14px',
                  fontWeight: 500,
                  marginTop: '8px'
                }}>Total: {empenosActivos.length}</span>
              </div>
              <div className="modal-body" style={{ padding: '30px' }}>
                <div className="tabla-container-modal" style={{ overflowX: 'auto' }}>
                  <table className="tabla-modal" style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr>
                        <th style={{ textAlign: 'left', padding: '15px 10px', backgroundColor: '#f8f9fa', color: '#1e3a8a', fontWeight: 600, fontSize: '14px', borderBottom: '2px solid #d3b372' }}>Cliente</th>
                        <th style={{ textAlign: 'left', padding: '15px 10px', backgroundColor: '#f8f9fa', color: '#1e3a8a', fontWeight: 600, fontSize: '14px', borderBottom: '2px solid #d3b372' }}>Artículo</th>
                        <th style={{ textAlign: 'left', padding: '15px 10px', backgroundColor: '#f8f9fa', color: '#1e3a8a', fontWeight: 600, fontSize: '14px', borderBottom: '2px solid #d3b372' }}>Monto</th>
                        <th style={{ textAlign: 'left', padding: '15px 10px', backgroundColor: '#f8f9fa', color: '#1e3a8a', fontWeight: 600, fontSize: '14px', borderBottom: '2px solid #d3b372' }}>Fecha</th>
                      </tr>
                    </thead>
                    <tbody>
                      {empenosActivos.map(item => (
                        <tr key={item.id_empeno}>
                          <td style={{ padding: '12px 10px', borderBottom: '1px solid #eee', color: '#333' }}><strong>{item.cliente}</strong></td>
                          <td style={{ padding: '12px 10px', borderBottom: '1px solid #eee', color: '#333' }}>{item.nombre}</td>
                          <td style={{ padding: '12px 10px', borderBottom: '1px solid #eee', color: '#333' }}>{formatearMoneda(item.monto)}</td>
                          <td style={{ padding: '12px 10px', borderBottom: '1px solid #eee', color: '#333' }}>{item.fecha}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="modal-acciones" style={{ display: 'flex', gap: '15px', padding: '20px 30px 30px', borderTop: '1px solid #eee' }}>
                <button className="btn-cancelar" onClick={() => setShowActivos(false)} style={{
                  flex: 1,
                  padding: '14px 20px',
                  border: 'none',
                  borderRadius: '12px',
                  fontWeight: 600,
                  fontSize: '15px',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  backgroundColor: '#e5e7eb',
                  color: '#333'
                }}>Cerrar</button>
              </div>
            </div>
          </div>
        </PermissionGuard>
      )}

      {/* MODAL DE EMPEÑOS VENCIDOS */}
      {showVencidos && (
        <PermissionGuard permission="ver_empenos">
          <div className="modal-overlay" onClick={() => setShowVencidos(false)} style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2000,
            backdropFilter: 'blur(5px)'
          }}>
            <div className="modal-detalle" onClick={(e) => e.stopPropagation()} style={{
              background: 'white',
              borderRadius: '15px',
              width: '700px',
              maxWidth: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 30px 60px rgba(0,0,0,0.3)',
              position: 'relative'
            }}>
              <button className="modal-cerrar" onClick={() => setShowVencidos(false)} style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#999',
                zIndex: 10
              }}>
                <CloseIcon />
              </button>
              <div className="modal-header" style={{
                background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
                color: 'white',
                padding: '40px 30px 30px',
                borderRadius: '15px 15px 0 0'
              }}>
                <h2 style={{ margin: 0, fontSize: '25px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <WarningIcon /> Empeños Vencidos
                </h2>
                <span className="cliente-id" style={{
                  display: 'inline-block',
                  background: 'rgba(255,255,255,0.2)',
                  padding: '6px 15px',
                  borderRadius: '20px',
                  fontSize: '14px',
                  fontWeight: 500,
                  marginTop: '8px'
                }}>Total: {empenosVencidos.length}</span>
              </div>
              <div className="modal-body" style={{ padding: '30px' }}>
                <div className="tabla-container-modal" style={{ overflowX: 'auto' }}>
                  <table className="tabla-modal" style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr>
                        <th style={{ textAlign: 'left', padding: '15px 10px', backgroundColor: '#f8f9fa', color: '#1e3a8a', fontWeight: 600, fontSize: '14px', borderBottom: '2px solid #d3b372' }}>Cliente</th>
                        <th style={{ textAlign: 'left', padding: '15px 10px', backgroundColor: '#f8f9fa', color: '#1e3a8a', fontWeight: 600, fontSize: '14px', borderBottom: '2px solid #d3b372' }}>Artículo</th>
                        <th style={{ textAlign: 'left', padding: '15px 10px', backgroundColor: '#f8f9fa', color: '#1e3a8a', fontWeight: 600, fontSize: '14px', borderBottom: '2px solid #d3b372' }}>Monto</th>
                        <th style={{ textAlign: 'left', padding: '15px 10px', backgroundColor: '#f8f9fa', color: '#1e3a8a', fontWeight: 600, fontSize: '14px', borderBottom: '2px solid #d3b372' }}>Vencido</th>
                        <th style={{ textAlign: 'left', padding: '15px 10px', backgroundColor: '#f8f9fa', color: '#1e3a8a', fontWeight: 600, fontSize: '14px', borderBottom: '2px solid #d3b372' }}>Días</th>
                      </tr>
                    </thead>
                    <tbody>
                      {empenosVencidos.map(item => (
                        <tr key={item.id_empeno}>
                          <td style={{ padding: '12px 10px', borderBottom: '1px solid #eee', color: '#333' }}><strong>{item.cliente}</strong></td>
                          <td style={{ padding: '12px 10px', borderBottom: '1px solid #eee', color: '#333' }}>{item.nombre}</td>
                          <td style={{ padding: '12px 10px', borderBottom: '1px solid #eee', color: '#333' }}>{formatearMoneda(item.monto)}</td>
                          <td style={{ padding: '12px 10px', borderBottom: '1px solid #eee', color: '#333' }}>{item.fecha}</td>
                          <td style={{ padding: '12px 10px', borderBottom: '1px solid #eee', color: '#333' }}><span style={{ background: '#fee2e2', color: '#dc2626', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 600 }}>{item.dias} días</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="modal-acciones" style={{ display: 'flex', gap: '15px', padding: '20px 30px 30px', borderTop: '1px solid #eee' }}>
                <button className="btn-cancelar" onClick={() => setShowVencidos(false)} style={{
                  flex: 1,
                  padding: '14px 20px',
                  border: 'none',
                  borderRadius: '12px',
                  fontWeight: 600,
                  fontSize: '15px',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  backgroundColor: '#e5e7eb',
                  color: '#333'
                }}>Cerrar</button>
              </div>
            </div>
          </div>
        </PermissionGuard>
      )}

      {/* MODAL DE PRÓXIMOS A VENCER */}
      {showProximos && (
        <PermissionGuard permission="ver_empenos">
          <div className="modal-overlay" onClick={() => setShowProximos(false)} style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2000,
            backdropFilter: 'blur(5px)'
          }}>
            <div className="modal-detalle" onClick={(e) => e.stopPropagation()} style={{
              background: 'white',
              borderRadius: '15px',
              width: '700px',
              maxWidth: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 30px 60px rgba(0,0,0,0.3)',
              position: 'relative'
            }}>
              <button className="modal-cerrar" onClick={() => setShowProximos(false)} style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#999',
                zIndex: 10
              }}>
                <CloseIcon />
              </button>
              <div className="modal-header" style={{
                background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                color: 'white',
                padding: '40px 30px 30px',
                borderRadius: '15px 15px 0 0'
              }}>
                <h2 style={{ margin: 0, fontSize: '25px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <AccessTimeIcon /> Próximos a Vencer
                </h2>
                <span className="cliente-id" style={{
                  display: 'inline-block',
                  background: 'rgba(255,255,255,0.2)',
                  padding: '6px 15px',
                  borderRadius: '20px',
                  fontSize: '14px',
                  fontWeight: 500,
                  marginTop: '8px'
                }}>Total: {proximosVencer.length}</span>
              </div>
              <div className="modal-body" style={{ padding: '30px' }}>
                <div className="tabla-container-modal" style={{ overflowX: 'auto' }}>
                  <table className="tabla-modal" style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr>
                        <th style={{ textAlign: 'left', padding: '15px 10px', backgroundColor: '#f8f9fa', color: '#1e3a8a', fontWeight: 600, fontSize: '14px', borderBottom: '2px solid #d3b372' }}>Cliente</th>
                        <th style={{ textAlign: 'left', padding: '15px 10px', backgroundColor: '#f8f9fa', color: '#1e3a8a', fontWeight: 600, fontSize: '14px', borderBottom: '2px solid #d3b372' }}>Artículo</th>
                        <th style={{ textAlign: 'left', padding: '15px 10px', backgroundColor: '#f8f9fa', color: '#1e3a8a', fontWeight: 600, fontSize: '14px', borderBottom: '2px solid #d3b372' }}>Monto</th>
                        <th style={{ textAlign: 'left', padding: '15px 10px', backgroundColor: '#f8f9fa', color: '#1e3a8a', fontWeight: 600, fontSize: '14px', borderBottom: '2px solid #d3b372' }}>Vence</th>
                        <th style={{ textAlign: 'left', padding: '15px 10px', backgroundColor: '#f8f9fa', color: '#1e3a8a', fontWeight: 600, fontSize: '14px', borderBottom: '2px solid #d3b372' }}>Días</th>
                      </tr>
                    </thead>
                    <tbody>
                      {proximosVencer.map(item => (
                        <tr key={item.id_empeno}>
                          <td style={{ padding: '12px 10px', borderBottom: '1px solid #eee', color: '#333' }}><strong>{item.cliente}</strong></td>
                          <td style={{ padding: '12px 10px', borderBottom: '1px solid #eee', color: '#333' }}>{item.nombre}</td>
                          <td style={{ padding: '12px 10px', borderBottom: '1px solid #eee', color: '#333' }}>{formatearMoneda(item.monto)}</td>
                          <td style={{ padding: '12px 10px', borderBottom: '1px solid #eee', color: '#333' }}>{item.fecha}</td>
                          <td style={{ padding: '12px 10px', borderBottom: '1px solid #eee', color: '#333' }}><span style={{ background: '#fef3c7', color: '#d97706', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 600 }}>{item.dias} días</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="modal-acciones" style={{ display: 'flex', gap: '15px', padding: '20px 30px 30px', borderTop: '1px solid #eee' }}>
                <button className="btn-cancelar" onClick={() => setShowProximos(false)} style={{
                  flex: 1,
                  padding: '14px 20px',
                  border: 'none',
                  borderRadius: '12px',
                  fontWeight: 600,
                  fontSize: '15px',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  backgroundColor: '#e5e7eb',
                  color: '#333'
                }}>Cerrar</button>
              </div>
            </div>
          </div>
        </PermissionGuard>
      )}

      {/* MODAL DE INGRESOS */}
      {showIngresos && (
        <PermissionGuard permission="ver_pagos">
          <div className="modal-overlay" onClick={() => setShowIngresos(false)} style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2000,
            backdropFilter: 'blur(5px)'
          }}>
            <div className="modal-detalle" onClick={(e) => e.stopPropagation()} style={{
              background: 'white',
              borderRadius: '15px',
              width: '700px',
              maxWidth: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 30px 60px rgba(0,0,0,0.3)',
              position: 'relative'
            }}>
              <button className="modal-cerrar" onClick={() => setShowIngresos(false)} style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#999',
                zIndex: 10
              }}>
                <CloseIcon />
              </button>
              <div className="modal-header" style={{
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: 'white',
                padding: '40px 30px 30px',
                borderRadius: '15px 15px 0 0'
              }}>
                <h2 style={{ margin: 0, fontSize: '25px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <AttachMoneyIcon /> Ingresos Recientes
                </h2>
                <span className="cliente-id" style={{
                  display: 'inline-block',
                  background: 'rgba(255,255,255,0.2)',
                  padding: '6px 15px',
                  borderRadius: '20px',
                  fontSize: '14px',
                  fontWeight: 500,
                  marginTop: '8px'
                }}>Total: {ingresosRecientes.length}</span>
              </div>
              <div className="modal-body" style={{ padding: '30px' }}>
                <div className="tabla-container-modal" style={{ overflowX: 'auto' }}>
                  <table className="tabla-modal" style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr>
                        <th style={{ textAlign: 'left', padding: '15px 10px', backgroundColor: '#f8f9fa', color: '#1e3a8a', fontWeight: 600, fontSize: '14px', borderBottom: '2px solid #d3b372' }}>Concepto</th>
                        <th style={{ textAlign: 'left', padding: '15px 10px', backgroundColor: '#f8f9fa', color: '#1e3a8a', fontWeight: 600, fontSize: '14px', borderBottom: '2px solid #d3b372' }}>Monto</th>
                        <th style={{ textAlign: 'left', padding: '15px 10px', backgroundColor: '#f8f9fa', color: '#1e3a8a', fontWeight: 600, fontSize: '14px', borderBottom: '2px solid #d3b372' }}>Fecha</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ingresosRecientes.map(item => (
                        <tr key={item.id}>
                          <td style={{ padding: '12px 10px', borderBottom: '1px solid #eee', color: '#333' }}><strong>{item.concepto}</strong></td>
                          <td style={{ padding: '12px 10px', borderBottom: '1px solid #eee', color: '#333' }}>{formatearMoneda(item.monto)}</td>
                          <td style={{ padding: '12px 10px', borderBottom: '1px solid #eee', color: '#333' }}>{item.fecha}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="modal-acciones" style={{ display: 'flex', gap: '15px', padding: '20px 30px 30px', borderTop: '1px solid #eee' }}>
                <button className="btn-cancelar" onClick={() => setShowIngresos(false)} style={{
                  flex: 1,
                  padding: '14px 20px',
                  border: 'none',
                  borderRadius: '12px',
                  fontWeight: 600,
                  fontSize: '15px',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  backgroundColor: '#e5e7eb',
                  color: '#333'
                }}>Cerrar</button>
              </div>
            </div>
          </div>
        </PermissionGuard>
      )}

      {/* MODAL DE PRECIOS DEL ORO */}
      {showPrecioOroModal && (
        <div className="modal-overlay" onClick={() => setShowPrecioOroModal(false)} style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2000,
          backdropFilter: 'blur(5px)'
        }}>
          <div className="modal-detalle modal-oro" onClick={(e) => e.stopPropagation()} style={{
            background: 'white',
            borderRadius: '20px',
            width: '650px',
            maxWidth: '90%',
            maxHeight: '90vh',
            overflowY: 'auto',
            boxShadow: '0 30px 60px rgba(0,0,0,0.3)',
            position: 'relative'
          }}>
            <button className="modal-cerrar" onClick={() => setShowPrecioOroModal(false)} style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#999',
              zIndex: 10
            }}>
              <CloseIcon />
            </button>
            <div className="modal-header oro-header" style={{
              background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
              color: '#1f2937',
              padding: '40px 30px 30px',
              borderRadius: '20px 20px 0 0'
            }}>
              <h2 style={{ margin: 0, fontSize: '25px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '10px' }}>
                <MonetizationOnIcon /> Precios del Oro por Quilate
              </h2>
              {preciosQuilates.ultima_actualizacion && (
                <span className="cliente-id" style={{
                  display: 'inline-block',
                  background: 'rgba(0,0,0,0.1)',
                  padding: '6px 15px',
                  borderRadius: '20px',
                  fontSize: '14px',
                  fontWeight: 500,
                  marginTop: '8px'
                }}>
                  Actualizado: {new Date(preciosQuilates.ultima_actualizacion).toLocaleString('es-MX')}
                </span>
              )}
            </div>
            <div className="modal-body" style={{ padding: '20px' }}>
              <div className="quilates-grid" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '16px',
                padding: '0'
              }}>
                <div className="quilate-card quilate-24k" style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '16px 20px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #ffd700 0%, #f0b90b 100%)'
                }}>
                  <div className="quilate-info">
                    <h3 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 4px 0' }}>Oro 24k</h3>
                    <p style={{ fontSize: '11px', opacity: 0.8, margin: 0 }}>99.9% pureza</p>
                  </div>
                  <div className="quilate-precio" style={{ textAlign: 'right' }}>
                    <span className="precio" style={{ fontSize: '20px', fontWeight: 800, display: 'block', lineHeight: 1.2 }}>${preciosQuilates.precio_24k?.toLocaleString()}</span>
                    <span className="unidad" style={{ fontSize: '10px', opacity: 0.8 }}>/ gramo</span>
                  </div>
                </div>
                <div className="quilate-card quilate-22k" style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '16px 20px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #f5cb5c 0%, #e6b422 100%)'
                }}>
                  <div className="quilate-info">
                    <h3 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 4px 0' }}>Oro 22k</h3>
                    <p style={{ fontSize: '11px', opacity: 0.8, margin: 0 }}>91.7% pureza</p>
                  </div>
                  <div className="quilate-precio" style={{ textAlign: 'right' }}>
                    <span className="precio" style={{ fontSize: '20px', fontWeight: 800, display: 'block', lineHeight: 1.2 }}>${preciosQuilates.precio_22k?.toLocaleString()}</span>
                    <span className="unidad" style={{ fontSize: '10px', opacity: 0.8 }}>/ gramo</span>
                  </div>
                </div>
                <div className="quilate-card quilate-21k" style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '16px 20px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #e8c86b 0%, #d4a017 100%)'
                }}>
                  <div className="quilate-info">
                    <h3 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 4px 0' }}>Oro 21k</h3>
                    <p style={{ fontSize: '11px', opacity: 0.8, margin: 0 }}>87.5% pureza</p>
                  </div>
                  <div className="quilate-precio" style={{ textAlign: 'right' }}>
                    <span className="precio" style={{ fontSize: '20px', fontWeight: 800, display: 'block', lineHeight: 1.2 }}>${preciosQuilates.precio_21k?.toLocaleString()}</span>
                    <span className="unidad" style={{ fontSize: '10px', opacity: 0.8 }}>/ gramo</span>
                  </div>
                </div>
                <div className="quilate-card quilate-18k" style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '16px 20px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #d9b48b 0%, #c89d6e 100%)'
                }}>
                  <div className="quilate-info">
                    <h3 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 4px 0' }}>Oro 18k</h3>
                    <p style={{ fontSize: '11px', opacity: 0.8, margin: 0 }}>75.0% pureza</p>
                  </div>
                  <div className="quilate-precio" style={{ textAlign: 'right' }}>
                    <span className="precio" style={{ fontSize: '20px', fontWeight: 800, display: 'block', lineHeight: 1.2 }}>${preciosQuilates.precio_18k?.toLocaleString()}</span>
                    <span className="unidad" style={{ fontSize: '10px', opacity: 0.8 }}>/ gramo</span>
                  </div>
                </div>
                <div className="quilate-card quilate-14k" style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '16px 20px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #c0a080 0%, #b08d5e 100%)'
                }}>
                  <div className="quilate-info">
                    <h3 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 4px 0' }}>Oro 14k</h3>
                    <p style={{ fontSize: '11px', opacity: 0.8, margin: 0 }}>58.5% pureza</p>
                  </div>
                  <div className="quilate-precio" style={{ textAlign: 'right' }}>
                    <span className="precio" style={{ fontSize: '20px', fontWeight: 800, display: 'block', lineHeight: 1.2 }}>${preciosQuilates.precio_14k?.toLocaleString()}</span>
                    <span className="unidad" style={{ fontSize: '10px', opacity: 0.8 }}>/ gramo</span>
                  </div>
                </div>
                <div className="quilate-card quilate-10k" style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '16px 20px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #b8a07c 0%, #a88d60 100%)'
                }}>
                  <div className="quilate-info">
                    <h3 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 4px 0' }}>Oro 10k</h3>
                    <p style={{ fontSize: '11px', opacity: 0.8, margin: 0 }}>41.7% pureza</p>
                  </div>
                  <div className="quilate-precio" style={{ textAlign: 'right' }}>
                    <span className="precio" style={{ fontSize: '20px', fontWeight: 800, display: 'block', lineHeight: 1.2 }}>${preciosQuilates.precio_10k?.toLocaleString()}</span>
                    <span className="unidad" style={{ fontSize: '10px', opacity: 0.8 }}>/ gramo</span>
                  </div>
                </div>
              </div>
              <div className="oro-nota" style={{
                padding: '16px 20px',
                background: '#f9fafb',
                borderTop: '1px solid #e5e7eb',
                textAlign: 'center',
                fontSize: '12px',
                color: '#6b7280',
                marginTop: '16px',
                borderRadius: '12px'
              }}>
                <small>ℹ️ Los precios son referenciales basados en el precio del oro de 24k. El precio final puede variar según la joyería y el mercado.</small>
              </div>
            </div>
            <div className="modal-acciones" style={{ display: 'flex', gap: '15px', padding: '20px 30px 30px', borderTop: '1px solid #eee' }}>
              <button className="btn-cerrar" onClick={() => setShowPrecioOroModal(false)} style={{
                flex: 1,
                padding: '14px 20px',
                border: 'none',
                borderRadius: '12px',
                fontWeight: 600,
                fontSize: '15px',
                cursor: 'pointer',
                transition: 'all 0.3s',
                background: '#1e3a8a',
                color: 'white'
              }}>Cerrar</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE ALERTAS */}
      {showAlertas && (
        <div className="modal-overlay" onClick={() => setShowAlertas(false)} style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2000,
          backdropFilter: 'blur(5px)'
        }}>
          <div className="modal-detalle modal-alertas" onClick={(e) => e.stopPropagation()} style={{
            background: 'white',
            borderRadius: '15px',
            width: '600px',
            maxWidth: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            boxShadow: '0 30px 60px rgba(0,0,0,0.3)',
            position: 'relative'
          }}>
            <button className="modal-cerrar" onClick={() => setShowAlertas(false)} style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#999',
              zIndex: 10
            }}>
              <CloseIcon />
            </button>
            <div className="modal-header" style={{
              background: 'linear-gradient(135deg, #1e3a8a 0%, #2a4a9e 100%)',
              color: 'white',
              padding: '40px 30px 30px',
              borderRadius: '15px 15px 0 0'
            }}>
              <h2 style={{ margin: 0, fontSize: '25px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '10px' }}>
                <NotificationsIcon /> Alertas y Notificaciones
              </h2>
              <span className="cliente-id" style={{
                display: 'inline-block',
                background: 'rgba(255,255,255,0.2)',
                padding: '6px 15px',
                borderRadius: '20px',
                fontSize: '14px',
                fontWeight: 500,
                marginTop: '8px'
              }}>Actualizadas hoy</span>
            </div>
            <div className="modal-body" style={{ padding: '30px' }}>
              <div className="alertas-modal-lista" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div className="alerta-modal-item warning" style={{
                  display: 'flex',
                  gap: '15px',
                  padding: '15px',
                  borderRadius: '12px',
                  borderLeft: '4px solid #f59e0b',
                  background: '#fef9e7'
                }}>
                  <WarningIcon className="alerta-modal-icon" style={{ fontSize: '24px', color: '#f59e0b' }} />
                  <div className="alerta-modal-contenido" style={{ flex: 1 }}>
                    <h4 style={{ margin: '0 0 5px 0', color: '#1e3a8a', fontSize: '16px' }}>{dashboardData.resumen?.proximos_vencer} empeños por vencer esta semana</h4>
                    <p style={{ margin: '0 0 5px 0', color: '#333', fontSize: '14px' }}>Próximos a vencer: Revisa el detalle</p>
                    <small style={{ color: '#666', fontSize: '12px' }}>Vencen en los próximos 7 días</small>
                  </div>
                </div>
                <div className="alerta-modal-item danger" style={{
                  display: 'flex',
                  gap: '15px',
                  padding: '15px',
                  borderRadius: '12px',
                  borderLeft: '4px solid #dc2626',
                  background: '#fee'
                }}>
                  <ErrorIcon className="alerta-modal-icon" style={{ fontSize: '24px', color: '#dc2626' }} />
                  <div className="alerta-modal-contenido" style={{ flex: 1 }}>
                    <h4 style={{ margin: '0 0 5px 0', color: '#1e3a8a', fontSize: '16px' }}>{dashboardData.resumen?.empenos_vencidos} empeños vencidos requieren atención</h4>
                    <p style={{ margin: '0 0 5px 0', color: '#333', fontSize: '14px' }}>Monto total vencido: {formatearMoneda(dashboardData.resumen?.perdida_total)}</p>
                    <small style={{ color: '#666', fontSize: '12px' }}>Requieren acción inmediata</small>
                  </div>
                </div>
                <div className="alerta-modal-item info" style={{
                  display: 'flex',
                  gap: '15px',
                  padding: '15px',
                  borderRadius: '12px',
                  borderLeft: '4px solid #3b82f6',
                  background: '#eff6ff'
                }}>
                  <AttachMoneyIcon className="alerta-modal-icon" style={{ fontSize: '24px', color: '#3b82f6' }} />
                  <div className="alerta-modal-contenido" style={{ flex: 1 }}>
                    <h4 style={{ margin: '0 0 5px 0', color: '#1e3a8a', fontSize: '16px' }}>Ingresos del mes: {formatearMoneda(dashboardData.resumen?.ingresos_mes_actual || 0)}</h4>
                    <p style={{ margin: '0 0 5px 0', color: '#333', fontSize: '14px' }}>Meta mensual: $100,000</p>
                    <div className="progreso-barra" style={{ width: '100%', height: '6px', background: '#e2e8f0', borderRadius: '3px', marginTop: '8px', overflow: 'hidden' }}>
                      <div className="progreso-lleno" style={{ height: '100%', background: '#10b981', borderRadius: '3px', width: `${(dashboardData.resumen?.ingresos_mes_actual / 100000 * 100) || 0}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-acciones" style={{ display: 'flex', gap: '15px', padding: '20px 30px 30px', borderTop: '1px solid #eee' }}>
              <button className="btn-cancelar" onClick={() => setShowAlertas(false)} style={{
                flex: 1,
                padding: '14px 20px',
                border: 'none',
                borderRadius: '12px',
                fontWeight: 600,
                fontSize: '15px',
                cursor: 'pointer',
                transition: 'all 0.3s',
                backgroundColor: '#e5e7eb',
                color: '#333'
              }}>Cerrar</button>
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
  );
};

export default Dueno;