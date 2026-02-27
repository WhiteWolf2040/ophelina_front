import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Chart from "react-apexcharts";
import "./dueno.css";

const Dueno= () => {
  // Estados para modales
  const [showActivos, setShowActivos] = useState(false);
  const [showVencidos, setShowVencidos] = useState(false);
  const [showProximos, setShowProximos] = useState(false);
  const [showIngresos, setShowIngresos] = useState(false);

  // 2. Configuración de la gráfica (Series y Opciones)
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
        toolbar: { show: false } // Limpia la vista
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
        categories: ["Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct"],
      },
      yaxis: {
        title: { text: "$ (thousands)" },
      },
      fill: { opacity: 1 },
      tooltip: {
        y: {
          formatter: (val) => `$ ${val} thousands`,
        },
      },
      colors: ["#1e3a8a", "#10b981"], // Colores personalizados para tu dashboard
    },
  };

  return (
    <div className="owner-layout">
      
      <Sidebar />

      <div className="owner-content">
        
        {/* HEADER */}
        <div className="owner-header">
          <h1>Hola, Dueño</h1>
        </div>

        {/* CARDS */}
        <div className="stats-row">
          <div className="stat-card" onClick={() => setShowActivos(true)}>
          {  <img src="/Calendario.svg" alt="calendario" srcset="" />}
          {/* <h3>Empeños Activos</h3>
            <p>0</p> */}
          </div>

          <div className="stat-card" onClick={() => setShowVencidos(true)}>
            <h3>Empeños Vencidos</h3>
            <p>0</p>
          </div>

          <div className="stat-card" onClick={() => setShowProximos(true)}>
            <h3>Próximos a Vencer</h3>
            <p>0</p>
          </div>

          <div className="stat-card" onClick={() => setShowIngresos(true)}>
            <h3>Ingresos Recientes</h3>
            <p>$0</p>
          </div>

          <div className="stat-card gold-card">
            <h3>Precio del Oro</h3>
            <p>$0 / gramo</p>
          </div>
        </div>

        {/* SECCIÓN PARA GRÁFICA (VACÍA POR AHORA) */}
     {/* SECCIÓN PARA GRÁFICA */}
        <div className="chart-section">
          <h2>Resumen de Ingresos</h2>
          <Chart
            options={chartData.options}
            series={chartData.series}
            type="bar"
            height="100%" 
          />
        </div>

        {/* ALERTAS */}
        <div className="alerts-section">
          <h2>Alertas Importantes</h2>
          <div className="alerts-box">

            {/* Aquí pueden ir tablas o lista de alertas */}
          </div>
        </div>

      </div>

      {/* ================= MODALES ================= */}

      {showActivos && (
        <div className="modal">
          <div className="modal-content">
            <h2>Empeños Activos</h2>
            <h3>0</h3>
            {/* Aquí irá la tabla */}
            <button onClick={() => setShowActivos(false)}>Cerrar</button>
          </div>
        </div>
      )}

      {showVencidos && (
        <div className="modal">
          <div className="modal-content">
            <h2>Empeños Vencidos</h2>
            <button onClick={() => setShowVencidos(false)}>Cerrar</button>
          </div>
        </div>
      )}

      {showProximos && (
        <div className="modal">
          <div className="modal-content">
            <h2>Próximos a Vencer</h2>
            <button onClick={() => setShowProximos(false)}>Cerrar</button>
          </div>
        </div>
      )}

      {showIngresos && (
        <div className="modal">
          <div className="modal-content">
            <h2>Ingresos Recientes</h2>
            <button onClick={() => setShowIngresos(false)}>Cerrar</button>
          </div>
        </div>
      )}

    </div>
  );
};

export default Dueno;