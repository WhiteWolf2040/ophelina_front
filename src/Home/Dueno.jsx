// Dueño.jsx - Versión CORREGIDA con gráficas condicionales por rol
import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Chart from "react-apexcharts";
import "./dueno.css";
import api from '../config/api';
import { useSearchParams } from 'react-router-dom';
import { stripeService } from '../services/stripeService';
import PaymentModal from '../components/PaymentModal';

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
  // HOOKS DE PAGO
  // ============================================
  const [searchParams] = useSearchParams();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentSessionId, setPaymentSessionId] = useState(null);
  const [paymentPlanName, setPaymentPlanName] = useState('');
  const [paymentPlanId, setPaymentPlanId] = useState(null);

  // Detectar pago exitoso
  useEffect(() => {
    //  OBTENER PARÁMETROS DE LA URL
    const sessionId = searchParams.get('session_id');
    const paymentStatus = searchParams.get('payment');
    
    console.log(' Parámetros de URL:', { sessionId, paymentStatus });
    
    if (sessionId && paymentStatus === 'success') {
        console.log('Pago detectado, session_id:', sessionId);
      
        //  GUARDAR INFORMACIÓN DEL PAGO
        setPaymentSessionId(sessionId);
        setPaymentPlanName(localStorage.getItem('pending_plan_name') || 'Premium');
        setPaymentPlanId(localStorage.getItem('pending_plan_id'));
        setShowPaymentModal(true);
        
        //  LIMPIAR LA URL (sin perder la sesión)
        const newUrl = window.location.pathname;
        window.history.replaceState({}, document.title, newUrl);
        
        //  VERIFICAR EL PAGO CON EL BACKEND
        verificarPago(sessionId);
    } else {
        console.log('ℹ No hay parámetros de pago en la URL');
    }
}, [searchParams]);

//  FUNCIÓN PARA VERIFICAR EL PAGO
const verificarPago = async (sessionId) => {
    try {
        const response = await api.post('/verify-payment', { session_id: sessionId });
        console.log('📦 Verificación de pago:', response.data);
        
        if (response.data.success) {
            console.log('✅ Pago verificado correctamente');
            // Actualizar el dashboard
            cargarDashboard();
            // Mostrar mensaje de éxito
            alert('¡Pago exitoso! Tu plan ha sido actualizado.');
        } else {
            console.error('❌ Error verificando pago:', response.data.message);
            alert('Hubo un problema verificando el pago. Contacta a soporte.');
        }
    } catch (error) {
        console.error('❌ Error al verificar pago:', error);
    }
};

  // Verificar suscripción al cargar
  useEffect(() => {
    const verificarSuscripcion = async () => {
      const empresaId = localStorage.getItem('empresa_id');
      if (!empresaId) return;
      
      try {
        const response = await stripeService.checkSubscription(empresaId);
        if (!response.activo && response.dias_restantes <= 0) {
          alert('Tu suscripción ha vencido. Por favor, renueva.');
          window.location.href = '/planes';
        }
      } catch (error) {
        console.error('Error al verificar suscripción:', error);
      }
    };
    verificarSuscripcion();
  }, []);

  const [amortizacionesPendientes, setAmortizacionesPendientes] = useState([]);
const [loadingAmortizaciones, setLoadingAmortizaciones] = useState(false);

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
  const [distribucionCategorias, setDistribucionCategorias] = useState({
    series: [],
    labels: []
  });
  const [userRole, setUserRole] = useState('');
  const [isLoadingPayment, setIsLoadingPayment] = useState(false);
  const [modulosPermitidos, setModulosPermitidos] = useState([]);
  const [planInfo, setPlanInfo] = useState({ plan_id: null, plan_nombre: '' });

  const cargarPreciosQuilates = async () => {
    try {
      const response = await api.get('/precio-oro/quilates');
      console.log('Respuesta de la API:', response.data);
      if (response.data.success) {
        setPreciosQuilates(response.data.data);
        console.log('Precios cargados:', response.data.data);
      }
    } catch (error) {
      console.error('Error al cargar precios por quilate:', error);
    }
  };

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

  // DATOS DEL PERFIL - DESDE BD
  const [datosPerfil, setDatosPerfil] = useState({
    nombre: "Cargando...",
    email: "cargando...",
    telefono: "cargando...",
    rol: "cargando...",
    fechaRegistro: "cargando...",
    sucursal: "Casa Matriz - Mérida",
    fotoPerfil: "https://ui-avatars.com/api/?name=Usuario&size=128&background=1e3a8a&color=fff&bold=true"
  });

  // Estados para datos de modales
  const [empenosActivos, setEmpenosActivos] = useState([]);
  const [empenosVencidos, setEmpenosVencidos] = useState([]);
  const [proximosVencer, setProximosVencer] = useState([]);
  const [ingresosRecientes, setIngresosRecientes] = useState([]);

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
        setUserRole(user.rol || 'Empleado');
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
        setUserRole(user.rol || 'Empleado');
      }
    } catch (error) {
      console.error('Error cargando usuario:', error);
    }
  };

  // Funciones para verificar roles y permisos de gráficas
  const esAdmin = () => {
    return userRole === 'Administrador' || userRole === 'Dueño' || userRole === 'Admin';
  };

  const esGerente = () => {
    return userRole === 'Gerente' || userRole === 'gerente' || userRole === 'GERENTE';
  };

  // Función para verificar si puede ver la gráfica de evolución acumulada
  const puedeVerEvolucionAcumulada = () => {
    return esAdmin(); // Solo administradores
  };

  // Función para verificar si puede ver las gráficas de tendencia y donut
  const puedeVerGraficasBasicas = () => {
    return esAdmin() || esGerente(); // Administradores y Gerentes
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
        console.log('Módulos permitidos:', usuario.modulos);
        console.log('Plan:', usuario.plan_nombre);
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

  // Funciones para cargar datos específicos
  const cargarActivos = async () => {
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
    try {
      setIngresosRecientes([
        { id: 1, concepto: "Pago de Juan Pérez", monto: 5000, fecha: "10/03/2024" },
        { id: 2, concepto: "Pago de María García", monto: 3500, fecha: "09/03/2024" },
      ]);
      setShowIngresos(true);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Efecto principal de carga
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
  if (loading) {
    return (
      <div className="dashboard">
        <Sidebar modulosPermitidos={modulosPermitidos} />
        <div className="content" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <div>Cargando dashboard...</div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="dashboard">
        <Sidebar modulosPermitidos={modulosPermitidos} />
        <div className="content" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column' }}>
          <WarningIcon style={{ fontSize: 48, color: '#dc3545', marginBottom: 16 }} />
          <h3>Error de conexión</h3>
          <p>{error}</p>
          <button onClick={cargarDashboard} style={{ marginTop: 16, padding: '8px 16px', background: '#1e3a8a', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return ( 
    <div className="dashboard">
      <Sidebar modulosPermitidos={modulosPermitidos} />

      <div className="content">
        {/* HEADER */}
        <div className="owner-header">
          <div className="header-top">
            <h1>
              Hola, {datosPerfil.nombre.split(' ')[0] || 'Dueño'}
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

        {/* CARDS - Visibles para todos */}
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

          <div className="stat-card gold-card" onClick={() => setShowPrecioOroModal(true)} style={{ cursor: 'pointer' }}>
            <MonetizationOnIcon className="card-icon" />
            <h3>Precio del Oro</h3>
            <p className="stat-number">${dashboardData.resumen?.precio_oro || 850} / gramo</p>
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
        {/* GRÁFICAS - SEGÚN ROL DEL USUARIO */}
        {/* ============================================ */}
        
        {/* GRÁFICA PRINCIPAL - Solo para Administradores */}
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
                height={380}
              />
            </div>
          </div>
        )}

        {/* GRÁFICAS ADICIONALES - Para Administradores y Gerentes */}
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
                height={300}
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
                height={300}
              />
            </div>
          </div>
        )}

        {/* Top Clientes - Visible para todos */}
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
                    <td colSpan="6" style={{ textAlign: 'center' }}>No hay datos</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* SECCIÓN DE MOROSIDAD - Visible para todos */}
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
                    <td colSpan="7" style={{ textAlign: 'center' }}>No hay datos de morosidad</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ============================================ */}
{/* TABLA DE AMORTIZACIÓN - Solo para Administradores */}
{/* ============================================ */}
{puedeVerEvolucionAcumulada() && (
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
                        <tr><td colSpan="9" style={{ textAlign: 'center' }}>Cargando...</td></tr>
                    ) : amortizacionesPendientes.length === 0 ? (
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

        {/* Artículos más empeñados - Visible para todos */}
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
                    <td colSpan="4" style={{ textAlign: 'center' }}>No hay datos</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Actividad Reciente - Visible para todos */}
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
              <div style={{ textAlign: 'center', padding: 20 }}>No hay actividad reciente</div>
            )}
          </div>
        </div>
      </div>

      {/* MODALES */}
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

      {/* MODAL DE EMPEÑOS VENCIDOS */}
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

      {/* MODAL DE PRÓXIMOS A VENCER */}
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

      {/* MODAL DE PRECIOS DEL ORO POR QUILATE */}
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
        planName={paymentPlanName} planId={paymentPlanId}
        onSuccess={handlePaymentSuccess}
      />
    </div>
  );
};

export default Dueno;