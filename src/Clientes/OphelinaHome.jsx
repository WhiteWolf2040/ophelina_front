import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom"; // Importa Link y useLocation
import "./OphelinaHome.css";
import logo from "../assets/O_blue.png";

export default function OphelinaHome() {
  const location = useLocation(); // Para saber en qué ruta estamos
  const [userName] = useState("Suemy Gamboa");
  const [resumen] = useState({
    activos: "5",
    totalPendiente: "$45,320",
    proximoVencimiento: "2 Días", 
    precioOro: "$1,245",
  });
  const [proximosVencer] = useState([
    { id: 1, nombre: "Anillo de Oro 14k", fechaVencimiento: "4 de febrero de 2026", diasRestantes: "9 días restantes" },
  ]);
  const [deuda] = useState({
    capital: "$38,500",
    intereses: "$6,820",
    total: "$38,500",
  });
  const [actividadReciente] = useState([
    { id: 1, tipo: "pago", titulo: "Pago realizado", detalle: "Anillo de Oro - $3,500 • Hace 2 días", icono: "💰" },
    { id: 2, tipo: "nuevo", titulo: "Nuevo empeño", detalle: "Anillo de Oro - $3,500 • Hace 2 días", icono: "✨" },
  ]);

  const getActivityClass = (tipo) => {
    return tipo === 'pago' ? 'payment' : 'new';
  };

  // Función para determinar si un link está activo
  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
  <div className="main-content" style={{ backgroundColor: '#F5F0E9' }}>
      {/* Navbar */}
      <header className="navbar">
        <div className="log-container">
          <img src={logo} alt="Ophelia Logo" className="log-image" />
        </div>

        <nav className="nav-menu">
          <Link to="/homecliente" className={isActive('/homecliente')}>Historial</Link>
          <Link to="/misempenos" className={isActive('/misempenos')}>Mis Empeños</Link>
          <Link to="/pagos" className={isActive('/pagos')}>Pagos</Link>
          <Link to="/ophelina" className={isActive('/ophelina')}>Tienda</Link>
          <div className="user-avatar" aria-label="Menú de usuario">👤</div>
        </nav>
      </header>

      {/* MAIN CONTENT - CONTENEDOR VERTICAL */}
      <main className="">
        {/* Welcome section */}
        <section className="welcome-section">
          <h1 className="welcome-title">
            Hola, <span className="welcome-name">{userName}</span>
          </h1>
          <h3 className="welcome-subtitle">Conoce el estado de tus empeños</h3>
        </section>

        {/* Cards resumen */}
        <section className="cards-section">
          <div className="cards-grid">
            <div className="stat-card">
              <div className="stat-number">{resumen.activos}</div>
              <div className="stat-label">Activos</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{resumen.totalPendiente}</div>
              <div className="stat-label">Total pendiente</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{resumen.proximoVencimiento}</div>
              <div className="stat-label">Próximo vencimiento</div>
            </div>
            <div className="stat-card gold-card">
              <div className="stat-number">{resumen.precioOro}</div>
              <div className="stat-label">Precio del oro (gr)</div>
            </div>
          </div>
        </section>

        {/* Próximos a vencer */}
        <section className="content-section">
          <h3 className="section-title">
            <span className="section-icon">📦</span> 
            Empeños Próximos a Vencer:
          </h3>
          
          {proximosVencer.map(item => (
            <div key={item.id} className="pawn-item">
              <div className="pawn-info">
                <div className="pawn-title">{item.nombre}</div>
                <div className="pawn-date">Vence el {item.fechaVencimiento}</div>
              </div>
              <div className="pawn-days">
                <span className="days-badge">{item.diasRestantes}</span>
              </div>
            </div>
          ))}
        </section>

        {/* Bottom sections - Grid de 2 columnas */}
        <div className="bottom-sections">
          {/* Desglose de deuda */}
          <section className="content-section debt-section">
            <h3 className="section-title">
              <span className="section-icon">📦</span> 
              Desglose de deuda
            </h3>
            
            <div className="debt-breakdown">
              <div className="debt-row">
                <span>Capital prestado:</span>
                <span className="debt-amount">{deuda.capital}</span>
              </div>
              <div className="debt-row">
                <span>Intereses acumulados:</span>
                <span className="debt-amount">{deuda.intereses}</span>
              </div>
              <div className="debt-divider"></div>
              <div className="debt-row total-row">
                <span>Total a pagar:</span>
                <span className="total-amount">{deuda.total}</span>
              </div>
            </div>
          </section>

          {/* Actividad reciente */}
          <section className="content-section activity-section">
            <h3 className="section-title">
              <span className="section-icon">📦</span> 
              Actividad reciente
            </h3>
            
            <div className="activity-list">
              {actividadReciente.map(item => (
                <div key={item.id} className="activity-item">
                  <div className={`activity-badge ${getActivityClass(item.tipo)}`}>
                    {item.icono}
                  </div>
                  <div className="activity-content">
                    <div className="activity-title"><strong>{item.titulo}</strong></div>
                    <div className="activity-detail">{item.detalle}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}