import React, { useState, useEffect } from "react";
import "./OphelinaHome.css";
import Navbar from "../ClientesNav/Navbar";
import InventoryIcon from "@mui/icons-material/Inventory";
import PaymentIcon from "@mui/icons-material/Payment";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import Tooltip from "@mui/material/Tooltip";
import api from "../config/api";
import { getCurrentUser } from "../config/auth";

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
    vencidos: "0",
    totalPendiente: "$0",
    proximoVencimiento: "Sin vencimientos",
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
          const data = response.data.data;
          
          console.log("Datos del Dashboard:", data);

          const actividadOrdenada = [...(data.actividadReciente || [])].sort((a, b) => {
            const fechaA = new Date(a.fecha || a.timestamp || 0);
            const fechaB = new Date(b.fecha || b.timestamp || 0);
            return fechaB - fechaA;
          });

          const proximosOrdenados = [...(data.proximosVencer || [])].sort((a, b) => {
            const da = parseInt(a.diasRestantes, 10) || 0;
            const db = parseInt(b.diasRestantes, 10) || 0;
            return da - db;
          });

          setResumen({
            activos: data.resumen?.activos || "0",
            vencidos: data.resumen?.vencidos || "0", 
            totalPendiente: data.resumen?.totalPendiente || "$0",
            proximoVencimiento: data.resumen?.proximoVencimiento || "Sin vencimientos",
          });
          setProximosVencer(proximosOrdenados);
          setDeuda(data.deuda || { capital: "$0", intereses: "$0", total: "$0" });
          setActividadReciente(actividadOrdenada);
          
        } else {
          setError(response.data.message || "No se pudo cargar el dashboard");
        }
      } catch (err) {
        setError(err.response?.data?.message || "Error al conectar con el servidor");
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
        <div className="me-page">
          <div className="me-cargando-texto">Cargando tu información...</div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="me-page">
          <div className="me-sin-resultados" style={{ margin: "40px auto", maxWidth: "600px" }}>
            <p>{error}</p>
            <button className="me-btn-reintentar" onClick={() => window.location.reload()}>
              Reintentar
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="me-page">
      <Navbar />
      <div className="me-dashboard">
        
        <section className="me-page-header">
          <h1 className="me-page-title">
            Hola, <span className="me-welcome-name">{userName}</span>
          </h1>
          <p className="me-page-subtitle">Resumen de tus prendas empeñadas</p>
        </section>

        {/* TARJETAS DE RESUMEN (SOLO ICONOS CON TOOLTIP) */}
        <section className="me-stats-grid">
          
          <Tooltip 
            title={<div className="me-tooltip-content"><span className="me-tooltip-label">Empeños Activos</span><span className="me-tooltip-value">{resumen.activos}</span></div>} 
            arrow 
            placement="top"
          >
            <div className="me-ficha me-ficha-stat">
              <InventoryIcon className="me-stat-icon-only" style={{ color: "var(--me-acero)" }} />
            </div>
          </Tooltip>

          <Tooltip 
            title={<div className="me-tooltip-content"><span className="me-tooltip-label">Vencidos</span><span className="me-tooltip-value" style={{ color: "#ff6b6b" }}>{resumen.vencidos}</span></div>} 
            arrow 
            placement="top"
          >
            <div className="me-ficha me-ficha-stat">
              <WarningAmberIcon className="me-stat-icon-only" style={{ color: "#c0392b" }} />
            </div>
          </Tooltip>

          <Tooltip 
            title={<div className="me-tooltip-content"><span className="me-tooltip-label">Saldo Pendiente</span><span className="me-tooltip-value">{resumen.totalPendiente}</span></div>} 
            arrow 
            placement="top"
          >
            <div className="me-ficha me-ficha-stat">
              <AttachMoneyIcon className="me-stat-icon-only" style={{ color: "var(--me-dorado)" }} />
            </div>
          </Tooltip>

          <Tooltip 
            title={<div className="me-tooltip-content"><span className="me-tooltip-label">Próximo Vencimiento</span><span className="me-tooltip-value">{resumen.proximoVencimiento}</span></div>} 
            arrow 
            placement="top"
          >
            <div className="me-ficha me-ficha-stat">
              <AccessTimeIcon className="me-stat-icon-only" style={{ color: "var(--me-marino)" }} />
            </div>
          </Tooltip>

        </section>

        {/* PRÓXIMOS A VENCER (CAJA BLANCA) */}
        <section className="me-contenido-section">
          <h3 className="me-section-title">
            <InventoryIcon sx={{ fontSize: 24 }} /> Empeños Próximos a Vencer
          </h3>

          {proximosVencer.length === 0 ? (
            <p className="me-texto-vacio">No tienes empeños próximos a vencer.</p>
          ) : (
            <div className="me-fichas-grid" style={{ marginBottom: 0 }}>
              {proximosVencer.map((item) => (
                <div key={item.id} className="me-ficha">
                  <div className="me-ficha-header">
                    <div className="me-ficha-titulo">
                      <span className="me-empeno-nombre">{item.nombre}</span>
                      <span className="me-empeno-id">Vence: {item.fechaVencimiento}</span>
                    </div>
                    <span className={`me-estado ${parseInt(item.diasRestantes) <= 3 ? 'me-estado-vencido' : 'me-estado-porvencer'}`}>
                      {item.diasRestantes} días
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* SECCIONES INFERIORES (CAJAS BLANCAS) */}
        <div className="me-bottom-sections">
          <section className="me-contenido-section">
            <h3 className="me-section-title">
              <PaymentIcon sx={{ fontSize: 24 }} /> Desglose de Deuda
            </h3>
            <div className="me-financiero-tabla">
              <div className="me-financiero-fila">
                <span className="me-financiero-label">Capital prestado:</span>
                <span className="me-financiero-valor">{deuda.capital}</span>
              </div>
              <div className="me-financiero-fila">
                <span className="me-financiero-label">Intereses acumulados:</span>
                <span className="me-financiero-valor">{deuda.intereses}</span>
              </div>
              <div className="me-financiero-fila me-financiero-total">
                <span className="me-financiero-label">Total a pagar:</span>
                <span className="me-financiero-valor">{deuda.total}</span>
              </div>
            </div>
          </section>

          <section className="me-contenido-section">
            <h3 className="me-section-title">
              <AccessTimeIcon sx={{ fontSize: 24 }} /> Actividad Reciente
            </h3>
            <div className="me-historial-lista">
              {actividadReciente.length === 0 ? (
                <p className="me-texto-vacio">Sin actividad reciente.</p>
              ) : (
                actividadReciente.map((item) => (
                  <div key={item.id} className="me-historial-item">
                    <div
                      className="me-activity-icon"
                      style={{
                        color: item.tipo === "pago" ? "#1e6b34" : item.tipo === "nuevo" ? "#3b507d" : item.tipo === "vencido" ? "#962d22" : "#96500f",
                      }}
                    >
                      {iconMap[item.tipo] || <InventoryIcon sx={{ fontSize: 20 }} />}
                    </div>
                    <div className="me-historial-main">
                      <span className="me-historial-monto" style={{ fontSize: "14px" }}>{item.titulo}</span>
                      <span className="me-historial-fecha">{item.detalle}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>

      </div>
    </div>
  );
}