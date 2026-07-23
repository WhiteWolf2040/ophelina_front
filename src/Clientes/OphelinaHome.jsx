import React, { useState, useEffect } from "react";
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
import api from "../config/api";
import { getCurrentUser } from "../config/auth";

// Mapea el string que manda el backend al ícono real de MUI
const iconMap = {
  pago: <PaymentIcon sx={{ fontSize: 20 }} />,
  nuevo: <AddCircleOutlineIcon sx={{ fontSize: 20 }} />,
  vencido: <AccessTimeIcon sx={{ fontSize: 20 }} />,
  tienda: <InventoryIcon sx={{ fontSize: 20 }} />,
};

export default function OphelinaHome() {
  const user = getCurrentUser();
  const userName = user?.nombre || "Cliente";

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [resumen, setResumen] = useState({
    activos: "0",
    totalPendiente: "$0",
    proximoVencimiento: "Sin vencimientos",
    precioOro: "$0",
  });
  const [proximosVencer, setProximosVencer] = useState([]);
  const [deuda, setDeuda] = useState({ capital: "$0", intereses: "$0", total: "$0" });
  const [actividadReciente, setActividadReciente] = useState([]);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await api.get("/homecliente");

        if (response.data.success) {
          const { resumen, proximosVencer, deuda, actividadReciente } = response.data.data;
          setResumen(resumen);
          setProximosVencer(proximosVencer);
          setDeuda(deuda);
          setActividadReciente(actividadReciente);
        } else {
          setError(response.data.message || "No se pudo cargar el dashboard");
        }
      } catch (err) {
        setError(
          err.response?.data?.message || "Error al conectar con el servidor"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="main-content">
          <p style={{ textAlign: "center" }}>Cargando tu dashboard...</p>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="main-content">
          <p style={{ textAlign: "center", color: "red" }}>{error}</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="cliente-home-container">
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

            {proximosVencer.length === 0 ? (
              <p style={{ color: "#777" }}>No tienes empeños próximos a vencer.</p>
            ) : (
              proximosVencer.map(item => (
                <div key={item.id} className="pawn-item">
                  <div className="pawn-info">
                    <div className="pawn-title">{item.nombre}</div>
                    <div className="pawn-date">Vence el {item.fechaVencimiento}</div>
                  </div>
                  <div className="pawn-days">
                    <span className="days-badge">{item.diasRestantes}</span>
                  </div>
                </div>
              ))
            )}
          </section>

          {/* Bottom sections */}
          <div className="bottom-sections">
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

            <section className="contenido-section activity-section">
              <h3 className="section-title">
                <span className="section-icon">
                  <InventoryIcon sx={{ fontSize: 24, verticalAlign: 'middle' }} />
                </span>
                Actividad reciente
              </h3>

              <div className="activity-list">
                {actividadReciente.length === 0 ? (
                  <p style={{ color: "#777" }}>Sin actividad reciente.</p>
                ) : (
                  actividadReciente.map(item => (
                    <div key={item.id} className="activity-item">
                      <div className="activity-icon" style={{
                        color: item.tipo === 'pago' ? '#28a745' :
                               item.tipo === 'nuevo' ? '#17a2b8' :
                               item.tipo === 'vencido' ? '#dc3545' : '#ff9800'
                      }}>
                        {iconMap[item.tipo] || <InventoryIcon sx={{ fontSize: 20 }} />}
                      </div>
                      <div className="activity-content">
                        <div className="activity-title"><strong>{item.titulo}</strong></div>
                        <div className="activity-detail">{item.detalle}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>
          </div>
        </main>
      </div>
    </>
  );
}