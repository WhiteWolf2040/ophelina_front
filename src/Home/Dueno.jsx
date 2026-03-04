// Dueno.jsx - Versión con cards en línea y botón de alertas
import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Chart from "react-apexcharts";
import "./dueno.css";

const Dueno = () => {
  const [showActivos, setShowActivos] = useState(false);
  const [showVencidos, setShowVencidos] = useState(false);
  const [showProximos, setShowProximos] = useState(false);
  const [showIngresos, setShowIngresos] = useState(false);
  const [showAlertas, setShowAlertas] = useState(false); // Nuevo estado para alertas
  const [showPerfil, setShowPerfil] = useState(false); // Nuevo estado para perfil
  
  // NUEVO: Estado para el selector de período
  const [periodo, setPeriodo] = useState("mensual");

  // Datos de ejemplo para los modales
  const empenosActivos = [
    { id: 1, nombre: "Anillo de Oro", monto: 5000, fecha: "10/02/2024", cliente: "Juan Pérez" },
    { id: 2, nombre: "Collar de Plata", monto: 3500, fecha: "15/02/2024", cliente: "María García" },
    { id: 3, nombre: "Pulsera", monto: 2800, fecha: "20/02/2024", cliente: "Carlos López" },
  ];

  const empenosVencidos = [
    { id: 1, nombre: "Reloj", monto: 8000, fecha: "01/01/2024", cliente: "Ana Martínez", dias: 15 },
    { id: 2, nombre: "Cadena", monto: 4200, fecha: "05/01/2024", cliente: "Roberto Sánchez", dias: 10 },
  ];

  const proximosVencer = [
    { id: 1, nombre: "Dije", monto: 2000, fecha: "30/03/2024", cliente: "Laura Torres", dias: 5 },
    { id: 2, nombre: "Aretes", monto: 1500, fecha: "02/04/2024", cliente: "Miguel Ángel", dias: 8 },
  ];

  const ingresosRecientes = [
    { id: 1, concepto: "Pago Anillo - Juan Pérez", monto: 5000, fecha: "25/02/2024" },
    { id: 2, concepto: "Pago Collar - María García", monto: 3500, fecha: "24/02/2024" },
    { id: 3, concepto: "Intereses - Carlos López", monto: 450, fecha: "23/02/2024" },
  ];

    // Datos del dueño para perfil
  const datosPerfil = {
    nombre: "Juan Carlos Rodríguez",
    email: "juan.rodriguez@ophelina.mx",
    telefono: "+52 999 123 4567",
    rol: "Dueño / Administrador",
    fechaRegistro: "15/01/2020",
    sucursal: "Casa Matriz - Mérida",
    fotoPerfil: "https://ui-avatars.com/api/?name=Juan+Rodriguez&size=128&background=1e3a8a&color=fff&bold=true"
  };

  // Datos para TOP CLIENTES
  const topClientes = [
    { id: 1, nombre: "Juan Pérez", empenos: 5, montoTotal: 18500, ultimoEmpeno: "15/02/2024" },
    { id: 2, nombre: "María García", empenos: 4, montoTotal: 14200, ultimoEmpeno: "20/02/2024" },
    { id: 3, nombre: "Carlos López", empenos: 3, montoTotal: 9800, ultimoEmpeno: "10/02/2024" },
    { id: 4, nombre: "Ana Martínez", empenos: 2, montoTotal: 8000, ultimoEmpeno: "01/02/2024" },
    { id: 5, nombre: "Roberto Sánchez", empenos: 2, montoTotal: 6200, ultimoEmpeno: "05/02/2024" },
  ];

  // Datos para ARTÍCULOS MÁS EMPEÑADOS
  const topArticulos = [
    { id: 1, nombre: "Anillos de Oro", cantidad: 12, montoPromedio: 4800, categoria: "Joyería" },
    { id: 2, nombre: "Collares de Plata", cantidad: 8, montoPromedio: 3200, categoria: "Joyería" },
    { id: 3, nombre: "Relojes", cantidad: 6, montoPromedio: 5500, categoria: "Relojes" },
    { id: 4, nombre: "Pulseras", cantidad: 5, montoPromedio: 2100, categoria: "Joyería" },
    { id: 5, nombre: "Teléfonos", cantidad: 4, montoPromedio: 3800, categoria: "Electrónica" },
  ];

  // Datos para INGRESOS POR MES (otra gráfica)
  const ingresosMensuales = {
    series: [
      {
        name: "Capital",
        data: [45000, 52000, 48000, 61000, 58000, 63000],
      },
      {
        name: "Intereses",
        data: [8500, 9200, 10100, 11800, 13500, 14200],
      },
    ],
    options: {
      chart: {
        type: "line",
        height: 300,
        toolbar: { show: false },
      },
      stroke: {
        curve: "smooth",
        width: 3,
      },
      colors: ["#1e3a8a", "#10b981"],
      xaxis: {
        categories: ["Sep", "Oct", "Nov", "Dic", "Ene", "Feb"],
      },
      yaxis: {
        labels: {
          formatter: (val) => `$${val.toLocaleString()}`,
        },
      },
      tooltip: {
        y: {
          formatter: (val) => `$${val.toLocaleString()}`,
        },
      },
    },
  };

  // Datos para DISTRIBUCIÓN POR CATEGORÍA
  const categoriaDistribucion = {
    series: [45, 25, 15, 10, 5],
    options: {
      chart: {
        type: "donut",
        height: 300,
      },
      labels: ["Joyería", "Electrónica", "Relojes", "Herramientas", "Otros"],
      colors: ["#1e3a8a", "#3b82f6", "#10b981", "#f59e0b", "#6b7280"],
      legend: {
        position: "bottom",
      },
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

  const chartData = {
    series: [
      {
        name: "Empeños",
        data: [44, 55, 57, 56, 61, 58, 63, 60, 66],
      },
      {
        name: "Ingresos",
        data: [76, 85, 101, 98, 87, 105, 91, 114, 94],
      },
    ],
    options: {
      chart: {
        type: "bar",
        height: 350,
        toolbar: { show: false },
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "55%",
          borderRadius: 5,
        },
      },
      dataLabels: { enabled: false },
      stroke: {
        show: true,
        width: 2,
        colors: ["transparent"],
      },
      xaxis: {
        categories: ["Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct"],
      },
      yaxis: {
        title: { text: "$ (miles)" },
      },
      fill: { opacity: 1 },
      tooltip: {
        y: {
          formatter: (val) => `$ ${val} mil`,
        },
      },
      colors: ["#1e3a8a", "#10b981"],
    },
  };

  return (
    <div className="dashboard">
      <Sidebar />

      <div className="content" >
        {/* HEADER - con botón de alertas en lugar de selector de período */}
        {/* HEADER - con botón de alertas y perfil */}
        <div className="owner-header">
          <div className="header-top ">
            <h1>Hola, Dueño  <p className="header-sub">Conoce el estado de tu casa de empeño</p></h1>
           
            <div className="header-botones">
              {/* BOTÓN DE PERFIL */}
              <button className="btn-perfil" onClick={() => setShowPerfil(true)}>
                <img 
                  src={datosPerfil.fotoPerfil} 
                  alt="Perfil" 
                  className="perfil-foto"
                />
                <span className="perfil-nombre">Mi Perfil</span>
              </button>

              {/* BOTÓN DE ALERTAS */}
              <button className="btn-alertas" onClick={() => setShowAlertas(true)}>
                <span className="alerta-icon">🔔</span>
                Alertas
                {proximosVencer.length + empenosVencidos.length > 0 && (
                  <span className="alerta-badge">
                    {proximosVencer.length + empenosVencidos.length}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* CARDS - ahora en una sola fila con grid responsivo de 2 en 2 en móvil */}
        <div className="cards-grid">
          <div className="stat-card" onClick={() => setShowActivos(true)}>
            <h3>Empeños Activos</h3>
            <p className="stat-number">{empenosActivos.length}</p>
          </div>

          <div className="stat-card" onClick={() => setShowVencidos(true)}>
            <h3>Empeños Vencidos</h3>
            <p className="stat-number">{empenosVencidos.length}</p>
          </div>

          <div className="stat-card" onClick={() => setShowProximos(true)}>
            <h3>Próximos a Vencer</h3>
            <p className="stat-number">{proximosVencer.length}</p>
          </div>

          <div className="stat-card" onClick={() => setShowIngresos(true)}>
            <h3>Ingresos Recientes</h3>
            <p className="stat-number">${ingresosRecientes.reduce((sum, i) => sum + i.monto, 0).toLocaleString()}</p>
          </div>

          <div className="stat-card gold-card">
            <h3>Precio del Oro</h3>
            <p className="stat-number">$850 / gramo</p>
          </div>
        </div>

        {/* GRÁFICA - MANTIENE TU DISEÑO */}
        <div className="chart-section">
          <h2>📊 Resumen de Ingresos</h2>
          <div className="chart-wrapper">
            <Chart
              options={chartData.options}
              series={chartData.series}
              type="bar"
              height="100%"
            />
          </div>
        </div>

        {/* NUEVAS SECCIONES AGREGADAS ABAJO */}

        {/* Gráficas adicionales en grid */}
        <div className="nuevas-graficas-grid">
          {/* Gráfica de línea: Ingresos Mensuales */}
          <div className="grafica-nueva-card">
            <h2>📈 Ingresos Mensuales (Capital vs Intereses)</h2>
            <Chart
              options={ingresosMensuales.options}
              series={ingresosMensuales.series}
              type="line"
              height={300}
            />
          </div>

          {/* Gráfica de dona: Distribución por Categoría */}
          <div className="grafica-nueva-card">
            <h2>🥧 Distribución por Categoría</h2>
            <Chart
              options={categoriaDistribucion.options}
              series={categoriaDistribucion.series}
              type="donut"
              height={300}
            />
          </div>
        </div>

        {/* Top Clientes */}
        <div className="nueva-seccion">
          <h2>🏆 Top 5 Clientes</h2>
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
                {topClientes.map(cliente => (
                  <tr key={cliente.id}>
                    <td><strong>{cliente.nombre}</strong></td>
                    <td>{cliente.empenos}</td>
                    <td>${cliente.montoTotal.toLocaleString()}</td>
                    <td>{cliente.ultimoEmpeno}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Artículos más empeñados */}
        <div className="nueva-seccion">
          <h2>🔝 Artículos Más Empeñados</h2>
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
                {topArticulos.map(articulo => (
                  <tr key={articulo.id}>
                    <td><strong>{articulo.nombre}</strong></td>
                    <td>{articulo.categoria}</td>
                    <td>{articulo.cantidad}</td>
                    <td>${articulo.montoPromedio.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Cards de métricas rápidas */}
        <div className="metricas-rapidas">
          <div className="metrica-card">
            <span className="metrica-icon">📊</span>
            <div className="metrica-info">
              <h4>Tasa de Interés Promedio</h4>
              <p className="metrica-valor">12.5%</p>
              <span className="metrica-tendencia positiva">+0.5% vs mes anterior</span>
            </div>
          </div>

          <div className="metrica-card">
            <span className="metrica-icon">⏱️</span>
            <div className="metrica-info">
              <h4>Tiempo Promedio de Pago</h4>
              <p className="metrica-valor">18 días</p>
              <span className="metrica-tendencia negativa">-2 días vs mes anterior</span>
            </div>
          </div>

          <div className="metrica-card">
            <span className="metrica-icon">🔄</span>
            <div className="metrica-info">
              <h4>Tasa de Retorno</h4>
              <p className="metrica-valor">68%</p>
              <span className="metrica-tendencia positiva">+5% vs mes anterior</span>
            </div>
          </div>

          <div className="metrica-card">
            <span className="metrica-icon">💰</span>
            <div className="metrica-info">
              <h4>Valor Promedio por Empeño</h4>
              <p className="metrica-valor">$4,200</p>
              <span className="metrica-tendencia positiva">+$350 vs mes anterior</span>
            </div>
          </div>
        </div>

        {/* Actividad Reciente */}
        <div className="nueva-seccion">
          <h2>📋 Actividad Reciente</h2>
          <div className="actividad-lista">
            <div className="actividad-item">
              <span className="actividad-icon">✅</span>
              <div className="actividad-detalle">
                <p><strong>Juan Pérez</strong> pagó su empeño <span className="actividad-monto">$5,000</span></p>
                <small>Hace 2 horas</small>
              </div>
            </div>
            <div className="actividad-item">
              <span className="actividad-icon">🆕</span>
              <div className="actividad-detalle">
                <p><strong>María García</strong> empeñó <strong>Collar de Plata</strong> por <span className="actividad-monto">$3,500</span></p>
                <small>Hace 5 horas</small>
              </div>
            </div>
            <div className="actividad-item">
              <span className="actividad-icon">⚠️</span>
              <div className="actividad-detalle">
                <p><strong>Carlos López</strong> tiene un empeño por vencer mañana</p>
                <small>Hace 1 día</small>
              </div>
            </div>
            <div className="actividad-item">
              <span className="actividad-icon">💰</span>
              <div className="actividad-detalle">
                <p>Intereses generados hoy: <span className="actividad-monto">$1,250</span></p>
                <small>Hace 3 horas</small>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL DE PERFIL */}
      {showPerfil && (
        <div className="modal-overlay" onClick={() => setShowPerfil(false)}>
          <div className="modal-detalle modal-perfil" onClick={(e) => e.stopPropagation()}>
            <button className="modal-cerrar" onClick={() => setShowPerfil(false)}>×</button>
            
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

      {/* MODAL DE ALERTAS */}
      {showAlertas && (
        <div className="modal-overlay" onClick={() => setShowAlertas(false)}>
          <div className="modal-detalle modal-alertas" onClick={(e) => e.stopPropagation()}>
            <button className="modal-cerrar" onClick={() => setShowAlertas(false)}>×</button>
            
            <div className="modal-header">
              <h2>🔔 Alertas y Notificaciones</h2>
              <span className="cliente-id">Actualizadas hoy</span>
            </div>

            <div className="modal-body">
              <div className="alertas-modal-lista">
                <div className="alerta-modal-item warning">
                  <span className="alerta-modal-icon">⚠️</span>
                  <div className="alerta-modal-contenido">
                    <h4>{proximosVencer.length} empeños por vencer esta semana</h4>
                    <p>Próximos a vencer: {proximosVencer.map(p => p.nombre).join(', ')}</p>
                    <small>Vencen entre el {proximosVencer[0]?.fecha} y {proximosVencer[proximosVencer.length-1]?.fecha}</small>
                  </div>
                </div>

                <div className="alerta-modal-item danger">
                  <span className="alerta-modal-icon">❗</span>
                  <div className="alerta-modal-contenido">
                    <h4>{empenosVencidos.length} empeños vencidos requieren atención</h4>
                    <p>Monto total vencido: ${empenosVencidos.reduce((sum, i) => sum + i.monto, 0).toLocaleString()}</p>
                    <small>Vencidos hace {Math.max(...empenosVencidos.map(e => e.dias))} días</small>
                  </div>
                </div>

                <div className="alerta-modal-item success">
                  <span className="alerta-modal-icon">📈</span>
                  <div className="alerta-modal-contenido">
                    <h4>Meta mensual: 78% completada</h4>
                    <p>Faltan $25,000 para alcanzar la meta</p>
                    <div className="progreso-barra">
                      <div className="progreso-lleno" style={{ width: '78%' }}></div>
                    </div>
                  </div>
                </div>

                <div className="alerta-modal-item info">
                  <span className="alerta-modal-icon">💰</span>
                  <div className="alerta-modal-contenido">
                    <h4>Ingresos del día: $1,250</h4>
                    <p>Intereses generados hoy: $450</p>
                    <small>3 transacciones completadas</small>
                  </div>
                </div>

                <div className="alerta-modal-item warning">
                  <span className="alerta-modal-icon">🏅</span>
                  <div className="alerta-modal-contenido">
                    <h4>Precio del Oro: +2.5% hoy</h4>
                    <p>Precio actual: $850/gramo</p>
                    <small>Impacto positivo en valor de inventario</small>
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

      {/* MODALES EXISTENTES */}
      {showActivos && (
        <div className="modal-overlay" onClick={() => setShowActivos(false)}>
          <div className="modal-detalle" onClick={(e) => e.stopPropagation()}>
            <button className="modal-cerrar" onClick={() => setShowActivos(false)}>×</button>
            
            <div className="modal-header">
              <h2>Empeños Activos</h2>
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
                      <tr key={item.id}>
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

      {showVencidos && (
        <div className="modal-overlay" onClick={() => setShowVencidos(false)}>
          <div className="modal-detalle" onClick={(e) => e.stopPropagation()}>
            <button className="modal-cerrar" onClick={() => setShowVencidos(false)}>×</button>
            
            <div className="modal-header">
              <h2>Empeños Vencidos</h2>
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
                      <tr key={item.id}>
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

      {showProximos && (
        <div className="modal-overlay" onClick={() => setShowProximos(false)}>
          <div className="modal-detalle" onClick={(e) => e.stopPropagation()}>
            <button className="modal-cerrar" onClick={() => setShowProximos(false)}>×</button>
            
            <div className="modal-header">
              <h2>Próximos a Vencer</h2>
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
                      <tr key={item.id}>
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

      {showIngresos && (
        <div className="modal-overlay" onClick={() => setShowIngresos(false)}>
          <div className="modal-detalle" onClick={(e) => e.stopPropagation()}>
            <button className="modal-cerrar" onClick={() => setShowIngresos(false)}>×</button>
            
            <div className="modal-header">
              <h2>Ingresos Recientes</h2>
              <span className="cliente-id">
                Total: ${ingresosRecientes.reduce((sum, i) => sum + i.monto, 0).toLocaleString()}
              </span>
            </div>

            <div className="modal-body">
              <div className="tabla-container-modal">
                <table className="tabla-modal">
                  <thead>
                    <tr>
                      <th>Concepto</th>
                      <th>Monto</th>
                      <th>Fecha</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ingresosRecientes.map(item => (
                      <tr key={item.id}>
                        <td><strong>{item.concepto}</strong></td>
                        <td>${item.monto.toLocaleString()}</td>
                        <td>{item.fecha}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="modal-acciones">
              <button className="btn-cancelar" onClick={() => setShowIngresos(false)}>
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