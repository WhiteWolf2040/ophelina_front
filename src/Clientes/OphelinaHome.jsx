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
  
  // Datos REALES que coinciden con MisEmpenos
  const [resumen] = useState({
    activos: "3",
    totalPendiente: "$11,045",
    proximoVencimiento: "3 Días",
    precioOro: "$1,245",
  });
  
  const [proximosVencer] = useState([
    { id: 2, nombre: "Collar de Plata", fechaVencimiento: "20 de abril de 2026", diasRestantes: "3 días restantes" },
    { id: 4, nombre: "Aretes de Oro", fechaVencimiento: "28 de abril de 2026", diasRestantes: "11 días restantes" },
  ]);
  
  const [deuda] = useState({
    capital: "$38,500",
    intereses: "$5,775",
    total: "$44,275",
  });
  
  const [actividadReciente] = useState([
    { id: 1, tipo: "pago", titulo: "Pago realizado", detalle: "Aretes de Diamante - $1,880 • 10 de marzo de 2026", icono: <PaymentIcon sx={{ fontSize: 20 }} /> },
    { id: 2, tipo: "pago", titulo: "Pago realizado", detalle: "Collar de Plata - $2,000 • 20 de marzo de 2026", icono: <PaymentIcon sx={{ fontSize: 20 }} /> },
    { id: 3, tipo: "nuevo", titulo: "Nuevo empeño", detalle: "Anillo de Compromiso - $10,500 • 10 de enero de 2026", icono: <AddCircleOutlineIcon sx={{ fontSize: 20 }} /> },
    { id: 4, tipo: "vencido", titulo: "Préstamo vencido", detalle: "Anillo de Oro 14k - Vencido el 15 de marzo de 2026", icono: <AccessTimeIcon sx={{ fontSize: 20 }} /> },
    { id: 5, tipo: "tienda", titulo: "Prenda en tienda", detalle: "Anillo de Oro 14k - Transferido a venta el 1 de abril de 2026", icono: <InventoryIcon sx={{ fontSize: 20 }} /> },
  ]);

  return (
    <>
      <Navbar />
      <div className="main-content">
        <main className="home-main">
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
              <Tooltip 
                title={
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '16px', fontWeight: 'bold' }}>Empeños Activos</div>
                    <div style={{ fontSize: '20px', color: '#e9c46a' }}>{resumen.activos}</div>
                    <div style={{ fontSize: '12px', marginTop: '5px' }}>Préstamos en curso</div>
                  </div>
                } 
                placement="top" 
                arrow
              >
                <div className="stat-card">
                  <InventoryIcon sx={{ fontSize: 48, color: '#0d1b3e' }} />
                  <div className="stat-number">{resumen.activos}</div>
                </div>
              </Tooltip>

              <Tooltip 
                title={
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '16px', fontWeight: 'bold' }}>Saldo Pendiente</div>
                    <div style={{ fontSize: '20px', color: '#e9c46a' }}>{resumen.totalPendiente}</div>
                    <div style={{ fontSize: '12px', marginTop: '5px' }}>Total por liquidar</div>
                  </div>
                } 
                placement="top" 
                arrow
              >
                <div className="stat-card">
                  <AttachMoneyIcon sx={{ fontSize: 48, color: '#0d1b3e' }} />
                  <div className="stat-number">{resumen.totalPendiente}</div>
                </div>
              </Tooltip>

              <Tooltip 
                title={
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '16px', fontWeight: 'bold' }}>Próximo vencimiento</div>
                    <div style={{ fontSize: '20px', color: '#e9c46a' }}>{resumen.proximoVencimiento}</div>
                    <div style={{ fontSize: '12px', marginTop: '5px' }}>Collar de Plata</div>
                  </div>
                } 
                placement="top" 
                arrow
              >
                <div className="stat-card">
                  <AccessTimeIcon sx={{ fontSize: 48, color: '#0d1b3e' }} />
                  <div className="stat-number">{resumen.proximoVencimiento}</div>
                </div>
              </Tooltip>

              <Tooltip 
                title={
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '16px', fontWeight: 'bold' }}>Precio del oro (gr)</div>
                    <div style={{ fontSize: '20px', color: '#e9c46a' }}>{resumen.precioOro}</div>
                    <div style={{ fontSize: '12px', marginTop: '5px' }}>Precio de referencia</div>
                  </div>
                } 
                placement="top" 
                arrow
              >
                <div className="stat-card gold-card">
                  <DiamondIcon sx={{ fontSize: 48, color: '#ffffff' }} />
                  <div className="stat-number" style={{ color: 'white' }}>{resumen.precioOro}</div>
                </div>
              </Tooltip>
            </div>
          </section>

          {/* Próximos a vencer */}
          <section className="contenido-section">
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
            <section className="contenido-section debt-section">
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
                  <span>Intereses acumulados (15%):</span>
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
            <section className="contenido-section activity-section">
              <h3 className="section-title">
                <span className="section-icon">
                  <InventoryIcon sx={{ fontSize: 24, verticalAlign: 'middle' }} />
                </span> 
                Actividad reciente
              </h3>
              
              <div className="activity-list">
                {actividadReciente.map(item => (
                  <div key={item.id} className="activity-item">
                    <div className="activity-icon" style={{ 
                      color: item.tipo === 'pago' ? '#28a745' : 
                             item.tipo === 'nuevo' ? '#17a2b8' : 
                             item.tipo === 'vencido' ? '#dc3545' : '#ff9800'
                    }}>
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