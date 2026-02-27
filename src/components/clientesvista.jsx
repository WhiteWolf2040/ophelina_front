import React, { useState } from "react";
import "./clientesvista.css";
import logo from "../assets/ophelina_logo-sinFondo.png";

export default function ClientesVista() {
  const [userName] = useState("Suemy Gamboa");
  const [resumen] = useState({
    activos: 5,
    totalPendiente: "$45,320",
    proximoVencimiento: "2 Días",
    precioOro: "$1,245",
  });
  const [proximosVencer] = useState([
    { id: 1, nombre: "Anillo de Oro 14k", fechaVencimiento: "4 de febrero de 2026", diasRestantes: 9 },
  ]);
  const [deuda] = useState({
    capital: "$38,500",
    intereses: "$6,820",
    total: "$45,320",
  });
  const [actividadReciente] = useState([
    { id: 1, tipo: "pago", titulo: "Pago realizado", detalle: "Anillo de Oro - $3,500 • Hace 2 días", icono: "💰" },
    { id: 2, tipo: "nuevo", titulo: "Nuevo empeño", detalle: "Anillo de Oro - $3,500 • Hace 2 días", icono: "✨" },
  ]);

  const getActivityClass = (tipo) => {
    return tipo === 'pago' ? 'payment' : 'new';
  };

  return (
    <div className="dashboard">
      {/* Navbar en cuadro blanco */}
      <header className="navbar-container">
        <div className="navbar">
          <div className="left-section">
            <img src={logo} alt="Ophelia Logo" className="logo-image" />
          </div>

          <nav className="nav-menu">
            <a href="#" className="active">Historial</a>
            <a href="#">Empeños</a>
            <a href="#">Pagos</a>
            <a href="#">Tienda</a>
            <div className="user-avatar" aria-label="Menú de usuario">👤</div>

          </nav>
        </div>
      </header>

      {/* Welcome section */}
      <section className="welcome-section">
        <h1 className="welcome-title">Hola, <span className="highlight">{userName}</span>!</h1>
        <p className="welcome-subtitle">Conoce el estado de tus empeños</p>
      </section>

      {/* Cards resumen */}
      <section className="cards-grid">
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
      </section>

      {/* Próximos a vencer */}
      <section className="content-section">
        <h3 className="section-title">
          <span className="section-icon">📦</span> 
          Empeños Próximos a Vencer
        </h3>
        <div className="debt-divider"></div>
        {proximosVencer.map(item => (
          <div key={item.id} className="pawn-item">
            <div className="pawn-info">
              <h4 className="pawn-title">{item.nombre}</h4>
              <p className="pawn-date">Vence el {item.fechaVencimiento}</p>
            </div>
            <div className="pawn-days">
              <span className="days-badge">{item.diasRestantes} días restantes</span>
            </div>
          </div>
        ))}
      </section>

      {/* Parte inferior */}
      <section className="bottom-sections">
        <div className="content-section">
          <h3 className="section-title">
            <span className="section-icon">📦</span> 
            Desglose de deuda
          </h3>
          <div className="debt-breakdown">
            <div className="debt-row">
              <span>Capital prestado</span>
              <span className="debt-amount">{deuda.capital}</span>
            </div>
            <div className="debt-row">
              <span>Intereses acumulados</span>
              <span className="debt-amount">{deuda.intereses}</span>
            </div>
            <div className="debt-divider"></div>
            <div className="debt-row total-row">
              <span>Total a pagar</span>
              <span className="total-amount">{deuda.total}</span>
            </div>
          </div>
        </div>

        <div className="content-section">
          <h3 className="section-title">
            <span className="section-icon">📦</span> 
            Actividad reciente
          </h3>
          <div className="debt-divider"></div>
          <div className="activity-list">
            {actividadReciente.map(item => (
              <div key={item.id} className="activity-item">
                <div className={`activity-badge ${getActivityClass(item.tipo)}`}>
                  {item.icono}
                </div>
                <div className="activity-content">
                  <p className="activity-title"><strong>{item.titulo}</strong></p>
                  <p className="activity-detail">{item.detalle}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}