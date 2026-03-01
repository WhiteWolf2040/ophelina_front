import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Chart from "react-apexcharts";
import "./dueno.css";

const Dueno = () => {
  const [showActivos, setShowActivos] = useState(false);
  const [showVencidos, setShowVencidos] = useState(false);
  const [showProximos, setShowProximos] = useState(false);
  const [showIngresos, setShowIngresos] = useState(false);

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

      <div className="content">
        {/* HEADER - MANTIENE TU DISEÑO */}
        <div className="owner-header">
          <h1>Hola, Dueño</h1>
        </div>

        {/* CARDS - MANTIENE TU DISEÑO */}
        <div className="stats-row">
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

        {/* ALERTAS - MANTIENE TU DISEÑO */}
        <div className="alerts-section">
          <h2>🔔 Alertas Importantes</h2>
          <div className="alerts-box">
            <div className="alert-item warning">
              <span className="alert-icon">⚠️</span>
              <span className="alert-text">{proximosVencer.length} empeños por vencer esta semana</span>
            </div>
            <div className="alert-item danger">
              <span className="alert-icon">❗</span>
              <span className="alert-text">{empenosVencidos.length} empeños vencidos requieren atención</span>
            </div>
          
          </div>
        </div>
      </div>

      {/* MODAL EMPEÑOS ACTIVOS - ESTILO CLIENTES */}
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

      {/* MODAL EMPEÑOS VENCIDOS - ESTILO CLIENTES */}
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

      {/* MODAL PRÓXIMOS A VENCER - ESTILO CLIENTES */}
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

      {/* MODAL INGRESOS RECIENTES - ESTILO CLIENTES */}
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