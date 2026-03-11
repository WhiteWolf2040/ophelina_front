// Dueño.jsx - Versión CONECTADA a Laravel
import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Chart from "react-apexcharts";
import "./dueno.css";
import api from '../config/api'; // Importamos la configuración

// Importar iconos de MUI (mantén todos tus imports)
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
import SpeedIcon from '@mui/icons-material/Speed';
import LoopIcon from '@mui/icons-material/Loop';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import CelebrationIcon from '@mui/icons-material/Celebration';

const Dueno = () => {
  // Estados para modales
  const [showActivos, setShowActivos] = useState(false);
  const [showVencidos, setShowVencidos] = useState(false);
  const [showProximos, setShowProximos] = useState(false);
  const [showIngresos, setShowIngresos] = useState(false);
  const [showAlertas, setShowAlertas] = useState(false);
  const [showPerfil, setShowPerfil] = useState(false);
  
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

  // Estados para datos de modales
  const [empenosActivos, setEmpenosActivos] = useState([]);
  const [empenosVencidos, setEmpenosVencidos] = useState([]);
  const [proximosVencer, setProximosVencer] = useState([]);
  const [ingresosRecientes, setIngresosRecientes] = useState([]);

  // Datos del perfil (podrían venir de una API también)
  const datosPerfil = {
    nombre: "Juan Carlos Rodríguez",
    email: "juan.rodriguez@ophelina.mx",
    telefono: "+52 999 123 4567",
    rol: "Dueño / Administrador",
    fechaRegistro: "15/01/2020",
    sucursal: "Casa Matriz - Mérida",
    fotoPerfil: "https://ui-avatars.com/api/?name=Juan+Rodriguez&size=128&background=1e3a8a&color=fff&bold=true"
  };

  // Configuración de gráficas
  const [chartData, setChartData] = useState({
    series: [
      { name: "Capital", data: [] },
      { name: "Intereses", data: [] }
    ],
    options: {
      chart: { type: "bar", height: 350, toolbar: { show: false } },
      plotOptions: { bar: { horizontal: false, columnWidth: "55%", borderRadius: 5 } },
      dataLabels: { enabled: false },
      xaxis: { categories: [] },
      yaxis: { 
        title: { text: "$ (pesos)" },
        labels: { formatter: (val) => `$${val.toLocaleString()}` }
      },
      colors: ["#1e3a8a", "#10b981"],
      tooltip: { y: { formatter: (val) => `$${val.toLocaleString()}` } }
    }
  });

  // Datos para gráfica de distribución (puedes obtener esto del backend después)
  const categoriaDistribucion = {
    series: [45, 25, 15, 10, 5],
    options: {
      chart: { type: "donut", height: 300 },
      labels: ["Joyería", "Electrónica", "Relojes", "Herramientas", "Otros"],
      colors: ["#1e3a8a", "#3b82f6", "#10b981", "#f59e0b", "#6b7280"],
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
                formatter: () => "145 artículos",
              },
            },
          },
        },
      },
    },
  };

  // CARGAR DATOS DEL DASHBOARD al montar el componente
  useEffect(() => {
    cargarDashboard();
  }, []);

  const cargarDashboard = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Llamar a la API de Laravel
      const response = await api.get('/dashboard');
      
      if (response.data.success) {
        const data = response.data.data;
        setDashboardData(data);
        
        // Preparar datos para gráfica de ingresos mensuales
        const meses = data.ingresos_mensuales?.map(i => i.mes) || [];
        const capital = data.ingresos_mensuales?.map(i => Number(i.capital)) || [];
        const intereses = data.ingresos_mensuales?.map(i => Number(i.intereses)) || [];
        
        setChartData(prev => ({
          series: [
            { name: "Capital", data: capital },
            { name: "Intereses", data: intereses }
          ],
          options: {
            ...prev.options,
            xaxis: { ...prev.options.xaxis, categories: meses }
          }
        }));
      }
    } catch (error) {
      console.error('Error al cargar dashboard:', error);
      setError('No se pudo conectar con el servidor. ¿Está corriendo Laravel?');
    } finally {
      setLoading(false);
    }
  };

  // Función para cargar empeños activos
  const cargarActivos = async () => {
    try {
      const response = await api.get('/dashboard/activos');
      if (response.data.success) {
        setEmpenosActivos(response.data.data);
        setShowActivos(true);
      }
    } catch (error) {
      console.error('Error al cargar activos:', error);
      alert('Error al cargar empeños activos');
    }
  };

  // Función para cargar empeños vencidos
  const cargarVencidos = async () => {
    try {
      const response = await api.get('/dashboard/vencidos');
      if (response.data.success) {
        setEmpenosVencidos(response.data.data);
        setShowVencidos(true);
      }
    } catch (error) {
      console.error('Error al cargar vencidos:', error);
      alert('Error al cargar empeños vencidos');
    }
  };

  // Función para cargar próximos a vencer
  const cargarProximos = async () => {
    try {
      const response = await api.get('/dashboard/proximos');
      if (response.data.success) {
        setProximosVencer(response.data.data);
        setShowProximos(true);
      }
    } catch (error) {
      console.error('Error al cargar próximos:', error);
      alert('Error al cargar próximos a vencer');
    }
  };

  // Función para cargar ingresos recientes (puedes crear este endpoint después)
  const cargarIngresos = async () => {
    try {
      // Por ahora usamos datos de ejemplo
      setIngresosRecientes([
        { id: 1, concepto: "Pago de Juan Pérez", monto: 5000, fecha: "10/03/2024" },
        { id: 2, concepto: "Pago de María García", monto: 3500, fecha: "09/03/2024" },
      ]);
      setShowIngresos(true);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Función para formatear fechas
  const formatFecha = (fecha) => {
    if (!fecha) return '';
    return new Date(fecha).toLocaleDateString('es-MX');
  };

  // Mostrar loading
  if (loading) {
    return (
      <div className="dashboard">
        <Sidebar />
        <div className="content" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <div>Cargando dashboard...</div>
        </div>
      </div>
    );
  }

  // Mostrar error
  if (error) {
    return (
      <div className="dashboard">
        <Sidebar />
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
      <Sidebar />

      <div className="content">
        {/* HEADER */}
        <div className="owner-header">
          <div className="header-top">
            <h1>
              Hola, Dueño
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

        {/* CARDS con datos REALES */}
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

          <div className="stat-card gold-card">
            <MonetizationOnIcon className="card-icon" />
            <h3>Precio del Oro</h3>
            <p className="stat-number">${dashboardData.resumen?.precio_oro || 850} / gramo</p>
          </div>
        </div>

        {/* GRÁFICA PRINCIPAL con datos REALES */}
        <div className="chart-section">
          <h2>
            <BarChartIcon />
            Ingresos Mensuales (Capital vs Intereses)
          </h2>
          <div className="chart-wrapper">
            <Chart
              options={chartData.options}
              series={chartData.series}
              type="bar"
              height={350}
            />
          </div>
        </div>

        {/* GRÁFICAS ADICIONALES */}
        <div className="nuevas-graficas-grid">
          <div className="grafica-nueva-card">
            <h2>
              <TrendingUpIcon />
              Tendencia de Ingresos
            </h2>
            <Chart
              options={{
                ...chartData.options,
                chart: { ...chartData.options.chart, type: "line" }
              }}
              series={chartData.series}
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

        {/* Top Clientes con datos REALES */}
        <div className="nueva-seccion">
          <h2>
            <EmojiEventsIcon />
            Top 5 Clientes
          </h2>
          <div className="tabla-container">
            <table className="tabla-moderna">
              <thead>
                <tr>
                  <th>Cliente</th>
                  <th>Empeños</th>
                  <th>Monto Total</th>
                  <th>Último Empeño</th>
                </tr>
              </thead>
              <tbody>
                {dashboardData.top_clientes?.map(cliente => (
                  <tr key={cliente.id_cliente}>
                    <td><strong>{cliente.nombre}</strong></td>
                    <td>{cliente.empenos}</td>
                    <td>${(cliente.monto_total || 0).toLocaleString()}</td>
                    <td>{formatFecha(cliente.ultimo_empeno)}</td>
                  </tr>
                ))}
                {dashboardData.top_clientes?.length === 0 && (
                  <tr>
                    <td colSpan="4" style={{ textAlign: 'center' }}>No hay datos</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Artículos más empeñados con datos REALES */}
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
                    <td>${(articulo.monto_promedio || 0).toLocaleString()}</td>
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

        {/* Actividad Reciente con datos REALES */}
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
              </div>
            ))}
            {dashboardData.actividad_reciente?.length === 0 && (
              <div style={{ textAlign: 'center', padding: 20 }}>No hay actividad reciente</div>
            )}
          </div>
        </div>
      </div>

      {/* MODALES - Modifícalos para usar datos REALES también */}

      {/* MODAL DE PERFIL (sin cambios) */}
      {showPerfil && (
        <div className="modal-overlay" onClick={() => setShowPerfil(false)}>
          <div className="modal-detalle modal-perfil" onClick={(e) => e.stopPropagation()}>
            <button className="modal-cerrar" onClick={() => setShowPerfil(false)}>
              <CloseIcon />
            </button>
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

      {/* MODAL DE EMPEÑOS ACTIVOS con datos REALES */}
      {showActivos && (
        <div className="modal-overlay" onClick={() => setShowActivos(false)}>
          <div className="modal-detalle" onClick={(e) => e.stopPropagation()}>
            <button className="modal-cerrar" onClick={() => setShowActivos(false)}>
              <CloseIcon />
            </button>
            <div className="modal-header">
              <h2><AssignmentIcon /> Empeños Activos</h2>
              <span className="cliente-id">Total: {empenosActivos.length}</span>
            </div>
            <div className="modal-body">
              <div className="tabla-container-modal">
                <table className="tabla-modal">
                  <thead>
                    <tr>
                      <th>Cliente</th>
                      <th>Artículo</th>
                      <th>Monto</th>
                      <th>Fecha</th>
                    </tr>
                  </thead>
                  <tbody>
                    {empenosActivos.map(item => (
                      <tr key={item.id_empreno}>
                        <td><strong>{item.cliente}</strong></td>
                        <td>{item.nombre}</td>
                        <td>${item.monto.toLocaleString()}</td>
                        <td>{item.fecha}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="modal-acciones">
              <button className="btn-cancelar" onClick={() => setShowActivos(false)}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE EMPEÑOS VENCIDOS con datos REALES */}
      {showVencidos && (
        <div className="modal-overlay" onClick={() => setShowVencidos(false)}>
          <div className="modal-detalle" onClick={(e) => e.stopPropagation()}>
            <button className="modal-cerrar" onClick={() => setShowVencidos(false)}>
              <CloseIcon />
            </button>
            <div className="modal-header">
              <h2><WarningIcon /> Empeños Vencidos</h2>
              <span className="cliente-id">Total: {empenosVencidos.length}</span>
            </div>
            <div className="modal-body">
              <div className="tabla-container-modal">
                <table className="tabla-modal">
                  <thead>
                    <tr>
                      <th>Cliente</th>
                      <th>Artículo</th>
                      <th>Monto</th>
                      <th>Vencido</th>
                      <th>Días</th>
                    </tr>
                  </thead>
                  <tbody>
                    {empenosVencidos.map(item => (
                      <tr key={item.id_empreno}>
                        <td><strong>{item.cliente}</strong></td>
                        <td>{item.nombre}</td>
                        <td>${item.monto.toLocaleString()}</td>
                        <td>{item.fecha}</td>
                        <td><span className="badge-danger">{item.dias} días</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="modal-acciones">
              <button className="btn-cancelar" onClick={() => setShowVencidos(false)}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE PRÓXIMOS A VENCER con datos REALES */}
      {showProximos && (
        <div className="modal-overlay" onClick={() => setShowProximos(false)}>
          <div className="modal-detalle" onClick={(e) => e.stopPropagation()}>
            <button className="modal-cerrar" onClick={() => setShowProximos(false)}>
              <CloseIcon />
            </button>
            <div className="modal-header">
              <h2><AccessTimeIcon /> Próximos a Vencer</h2>
              <span className="cliente-id">Total: {proximosVencer.length}</span>
            </div>
            <div className="modal-body">
              <div className="tabla-container-modal">
                <table className="tabla-modal">
                  <thead>
                    <tr>
                      <th>Cliente</th>
                      <th>Artículo</th>
                      <th>Monto</th>
                      <th>Vence</th>
                      <th>Días</th>
                    </tr>
                  </thead>
                  <tbody>
                    {proximosVencer.map(item => (
                      <tr key={item.id_empreno}>
                        <td><strong>{item.cliente}</strong></td>
                        <td>{item.nombre}</td>
                        <td>${item.monto.toLocaleString()}</td>
                        <td>{item.fecha}</td>
                        <td><span className="badge-warning">{item.dias} días</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="modal-acciones">
              <button className="btn-cancelar" onClick={() => setShowProximos(false)}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE ALERTAS con datos REALES */}
      {showAlertas && (
        <div className="modal-overlay" onClick={() => setShowAlertas(false)}>
          <div className="modal-detalle modal-alertas" onClick={(e) => e.stopPropagation()}>
            <button className="modal-cerrar" onClick={() => setShowAlertas(false)}>
              <CloseIcon />
            </button>
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
                    <p>Monto total vencido: ${(dashboardData.resumen?.empenos_vencidos * 5000).toLocaleString()}</p>
                    <small>Requieren acción inmediata</small>
                  </div>
                </div>

                <div className="alerta-modal-item info">
                  <AttachMoneyIcon className="alerta-modal-icon" />
                  <div className="alerta-modal-contenido">
                    <h4>Ingresos del mes: ${(dashboardData.resumen?.ingresos_mes_actual || 0).toLocaleString()}</h4>
                    <p>Meta mensual: $100,000</p>
                    <div className="progreso-barra">
                      <div className="progreso-lleno" style={{ width: `${(dashboardData.resumen?.ingresos_mes_actual / 100000 * 100) || 0}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-acciones">
              <button className="btn-cancelar" onClick={() => setShowAlertas(false)}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dueno;