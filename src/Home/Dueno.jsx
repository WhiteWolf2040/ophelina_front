import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import "./dueno.css";

const Dueno= () => {
  // Estados para modales
  const [showActivos, setShowActivos] = useState(false);
  const [showVencidos, setShowVencidos] = useState(false);
  const [showProximos, setShowProximos] = useState(false);
  const [showIngresos, setShowIngresos] = useState(false);

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
            <h3>Empeños Activos</h3>
            <p>0</p>
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
        <div className="chart-section">
          {/* Aquí irá la gráfica */}
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