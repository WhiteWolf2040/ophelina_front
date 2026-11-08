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
        <div className="oh-page">
          <div className="oh-cargando-texto">Cargando tu información...</div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="oh-page">
          <div className="oh-sin-resultados" style={{ margin: "40px auto", maxWidth: "600px" }}>
            <p>{error}</p>
            <button className="oh-btn-reintentar" onClick={() => window.location.reload()}>
              Reintentar
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="oh-page">
      <Navbar />
      <div className="oh-dashboard">

        <section className="oh-page-header">
          <h1 className="oh-page-title">
            Hola, <span className="oh-welcome-name">{userName}</span>
          </h1>
          <p className="oh-page-subtitle">Resumen de tus prendas empeñadas</p>
        </section>

        {/* TARJETAS DE RESUMEN (SOLO ICONOS CON TOOLTIP) */}
        <section className="oh-stats-grid">

          <Tooltip
            title={<div className="oh-tooltip-content"><span className="oh-tooltip-label">Empeños Activos</span><span className="oh-tooltip-value">{resumen.activos}</span></div>}
            arrow
            placement="top"
          >
            <div className="oh-ficha oh-ficha-stat">
              <InventoryIcon className="oh-stat-icon-only" style={{ color: "var(--oh-acero)" }} />
            </div>
          </Tooltip>

          <Tooltip
            title={<div className="oh-tooltip-content"><span className="oh-tooltip-label">Vencidos</span><span className="oh-tooltip-value" style={{ color: "#ff6b6b" }}>{resumen.vencidos}</span></div>}
            arrow
            placement="top"
          >
            <div className="oh-ficha oh-ficha-stat">
              <WarningAmberIcon className="oh-stat-icon-only" style={{ color: "#c0392b" }} />
            </div>
          </Tooltip>

          <Tooltip
            title={<div className="oh-tooltip-content"><span className="oh-tooltip-label">Saldo Pendiente</span><span className="oh-tooltip-value">{resumen.totalPendiente}</span></div>}
            arrow
            placement="top"
          >
            <div className="oh-ficha oh-ficha-stat">
              <AttachMoneyIcon className="oh-stat-icon-only" style={{ color: "var(--oh-dorado)" }} />
            </div>
          </Tooltip>

          <Tooltip
            title={<div className="oh-tooltip-content"><span className="oh-tooltip-label">Próximo Vencimiento</span><span className="oh-tooltip-value">{resumen.proximoVencimiento}</span></div>}
            arrow
            placement="top"
          >
            <div className="oh-ficha oh-ficha-stat">
              <AccessTimeIcon className="oh-stat-icon-only" style={{ color: "var(--oh-marino)" }} />
            </div>
          </Tooltip>

        </section>

        {/* PRÓXIMOS A VENCER (CAJA BLANCA) */}
        <section className="oh-contenido-section">
          <h3 className="oh-section-title">
            <InventoryIcon sx={{ fontSize: 24 }} /> Empeños Próximos a Vencer
          </h3>

          {proximosVencer.length === 0 ? (
            <p className="oh-texto-vacio">No tienes empeños próximos a vencer.</p>
          ) : (
            <div className="oh-fichas-grid" style={{ marginBottom: 0 }}>
              {proximosVencer.map((item) => (
                <div key={item.id} className="oh-ficha">
                  <div className="oh-ficha-header">
                    <div className="oh-ficha-titulo">
                      <span className="oh-empeno-nombre">{item.nombre}</span>
                      <span className="oh-empeno-id">Vence: {item.fechaVencimiento}</span>
                    </div>
                    <span className={`oh-estado ${parseInt(item.diasRestantes) <= 3 ? 'oh-estado-vencido' : 'oh-estado-porvencer'}`}>
                      {item.diasRestantes} días
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* SECCIONES INFERIORES (CAJAS BLANCAS) */}
        <div className="oh-bottom-sections">
          <section className="oh-contenido-section">
            <h3 className="oh-section-title">
              <PaymentIcon sx={{ fontSize: 24 }} /> Desglose de Deuda
            </h3>
            <div className="oh-financiero-tabla">
              <div className="oh-financiero-fila">
                <span className="oh-financiero-label">Capital prestado:</span>
                <span className="oh-financiero-valor">{deuda.capital}</span>
              </div>
              <div className="oh-financiero-fila">
                <span className="oh-financiero-label">Intereses acumulados:</span>
                <span className="oh-financiero-valor">{deuda.intereses}</span>
              </div>
              <div className="oh-financiero-fila oh-financiero-total">
                <span className="oh-financiero-label">Total a pagar:</span>
                <span className="oh-financiero-valor">{deuda.total}</span>
              </div>
            </div>
          </section>

          <section className="oh-contenido-section">
            <h3 className="oh-section-title">
              <AccessTimeIcon sx={{ fontSize: 24 }} /> Actividad Reciente
            </h3>
            <div className="oh-historial-lista">
              {actividadReciente.length === 0 ? (
                <p className="oh-texto-vacio">Sin actividad reciente.</p>
              ) : (
                actividadReciente.map((item) => (
                  <div key={item.id} className="oh-historial-item">
                    <div
                      className="oh-activity-icon"
                      style={{
                        color: item.tipo === "pago" ? "#1e6b34" : item.tipo === "nuevo" ? "#3b507d" : item.tipo === "vencido" ? "#962d22" : "#96500f",
                      }}
                    >
                      {iconMap[item.tipo] || <InventoryIcon sx={{ fontSize: 20 }} />}
                    </div>
                    <div className="oh-historial-main">
                      <span className="oh-historial-monto" style={{ fontSize: "14px" }}>{item.titulo}</span>
                      <span className="oh-historial-fecha">{item.detalle}</span>
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