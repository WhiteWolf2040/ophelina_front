import React, { useState } from "react";
import "./OphelinaHome.css";
import Navbar from "../ClientesNav/Navbar";
import InventoryIcon from '@mui/icons-material/Inventory';
import PaymentIcon from '@mui/icons-material/Payment';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import BoxIcon from '@mui/icons-material/Inventory';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import DiamondIcon from '@mui/icons-material/Diamond';
import Tooltip from '@mui/material/Tooltip';

export default function OphelinaHome() {
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
    { id: 1, tipo: "pago", titulo: "Pago realizado", detalle: "Anillo de Oro - $3,500 • Hace 2 días", icono: <PaymentIcon sx={{ fontSize: 20 }} /> },
    { id: 2, tipo: "nuevo", titulo: "Nuevo empeño", detalle: "Anillo de Oro - $3,500 • Hace 2 días", icono: <AddCircleOutlineIcon sx={{ fontSize: 20 }} /> },
  ]);

  return (
    <>
      <Navbar />
      <div className="main-content">
        {/* MAIN CONTENT */}
        <main className="home-main">
          {/* Welcome section */}
          <section className="welcome-section">
            <h1 className="welcome-title">
              Hola, <span className="welcome-name">{userName}</span>
            </h1>
            <h3 className="welcome-subtitle">Conoce el estado de tus empeños</h3>
          </section>

          {/* Cards resumen - SOLO ICONOS */}
          <section className="cards-section">
            <div className="cards-grid">
              <Tooltip 
                title={
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '16px', fontWeight: 'bold' }}>Activos</div>
                    <div style={{ fontSize: '20px', color: '#e9c46a' }}>{resumen.activos}</div>
                  </div>
                } 
                placement="top" 
                arrow
              >
                <div className="stat-card">
                  <InventoryIcon sx={{ fontSize: 48, color: '#0d1b3e' }} />
                </div>
              </Tooltip>

              <Tooltip 
                title={
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '16px', fontWeight: 'bold' }}>Total pendiente</div>
                    <div style={{ fontSize: '20px', color: '#e9c46a' }}>{resumen.totalPendiente}</div>
                  </div>
                } 
                placement="top" 
                arrow
              >
                <div className="stat-card">
                  <AttachMoneyIcon sx={{ fontSize: 48, color: '#0d1b3e' }} />
                </div>
              </Tooltip>

              <Tooltip 
                title={
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '16px', fontWeight: 'bold' }}>Próximo vencimiento</div>
                    <div style={{ fontSize: '20px', color: '#e9c46a' }}>{resumen.proximoVencimiento}</div>
                  </div>
                } 
                placement="top" 
                arrow
              >
                <div className="stat-card">
                  <AccessTimeIcon sx={{ fontSize: 48, color: '#0d1b3e' }} />
                </div>
              </Tooltip>

              <Tooltip 
                title={
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '16px', fontWeight: 'bold' }}>Precio del oro (gr)</div>
                    <div style={{ fontSize: '20px', color: '#e9c46a' }}>{resumen.precioOro}</div>
                  </div>
                } 
                placement="top" 
                arrow
              >
                <div className="stat-card gold-card">
                  <DiamondIcon sx={{ fontSize: 48, color: '#ffffff' }} />
                </div>
              </Tooltip>
            </div>
          </section>

          {/* Próximos a vencer */}
          <section className="content-section">
            <h3 className="section-title">
              <span className="section-icon">
                <BoxIcon sx={{ fontSize: 24, verticalAlign: 'middle' }} />
              </span> 
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
                <span className="section-icon">
                  <InventoryIcon sx={{ fontSize: 24, verticalAlign: 'middle' }} />
                </span> 
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
                <span className="section-icon">
                  <InventoryIcon sx={{ fontSize: 24, verticalAlign: 'middle' }} />
                </span> 
                Actividad reciente
              </h3>
              
              <div className="activity-list">
                {actividadReciente.map(item => (
                  <div key={item.id} className="activity-item">
                    <div className="activity-icon">
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
    </>
  );
}