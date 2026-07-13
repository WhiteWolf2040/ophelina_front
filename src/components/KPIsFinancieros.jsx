// components/KPIsFinancieros.jsx
// Tarjetas de KPIs principales — se conecta al hook useReportes

import React from "react";
import TrendingUpIcon    from "@mui/icons-material/TrendingUp";
import TrendingDownIcon  from "@mui/icons-material/TrendingDown";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import WarningAmberIcon  from "@mui/icons-material/WarningAmber";
import CheckCircleIcon   from "@mui/icons-material/CheckCircle";
import AccessTimeIcon    from "@mui/icons-material/AccessTime";
import PeopleIcon        from "@mui/icons-material/People";
import AttachMoneyIcon   from "@mui/icons-material/AttachMoney";

const Skeleton = () => (
  <div style={{
    height: 20, borderRadius: 6,
    background: "linear-gradient(90deg,#e8e8e8 25%,#f5f5f5 50%,#e8e8e8 75%)",
    backgroundSize: "200% 100%",
    animation: "shimmer 1.4s infinite",
    marginBottom: 6,
  }} />
);

// ── Tarjeta individual ────────────────────────────────────────────────────────
const KPICard = ({ icon: Icon, label, value, sub, color, loading, alert }) => (
  <div className="kpi-card" style={{ borderTop: `3px solid ${color}` }}>
    <div className="kpi-card-header">
      <Icon style={{ color, fontSize: 22 }} />
      {alert && <span className="kpi-alert-badge">{alert}</span>}
    </div>
    {loading
      ? <><Skeleton /><Skeleton /></>
      : <>
          <div className="kpi-value">{value}</div>
          <div className="kpi-label">{label}</div>
          {sub && <div className="kpi-sub">{sub}</div>}
        </>
    }
  </div>
);

// ── Componente principal ──────────────────────────────────────────────────────
const KPIsFinancieros = ({ kpis, loading, formatMXN }) => {
  const isLoading = loading?.kpis ?? false;

  // Porcentaje de cartera vencida sobre el total prestado
  const pctVencida = kpis.capital_prestado > 0
    ? ((kpis.cartera_vencida / kpis.capital_prestado) * 100).toFixed(1)
    : 0;

  const cards = [
    {
      icon:  AccountBalanceIcon,
      label: "Capital prestado",
      value: formatMXN(kpis.capital_prestado),
      sub:   `${kpis.total_activos} empeños activos`,
      color: "#1e3a8a",
    },
    {
      icon:  TrendingUpIcon,
      label: "Ingresos del mes",
      value: formatMXN(kpis.ingresos_mes),
      sub:   `Intereses cobrados: ${formatMXN(kpis.intereses_cobrados)}`,
      color: "#166534",
    },
    {
      icon:  CheckCircleIcon,
      label: "Cartera vigente",
      value: formatMXN(kpis.cartera_vigente),
      sub:   "Empeños activos al corriente",
      color: "#15803d",
    },
    {
      icon:  TrendingDownIcon,
      label: "Cartera vencida",
      value: formatMXN(kpis.cartera_vencida),
      sub:   `${pctVencida}% del capital total`,
      color: "#dc2626",
      alert: pctVencida > 20 ? "⚠ Alto" : null,
    },
    {
      icon:  AttachMoneyIcon,
      label: "Intereses pendientes",
      value: formatMXN(kpis.intereses_pendientes),
      sub:   "Por cobrar en empeños vencidos",
      color: "#b45309",
    },
    {
      icon:  AccessTimeIcon,
      label: "Vencen en 7 días",
      value: `${kpis.vencen_7_dias} contratos`,
      sub:   "Requieren atención inmediata",
      color: kpis.vencen_7_dias > 5 ? "#dc2626" : "#ca8a04",
      alert: kpis.vencen_7_dias > 0 ? kpis.vencen_7_dias : null,
    },
    {
      icon:  WarningAmberIcon,
      label: "Riesgo de pérdida",
      value: formatMXN(kpis.cartera_vencida + kpis.intereses_pendientes),
      sub:   "Cartera vencida + intereses",
      color: "#9a3412",
    },
    {
      icon:  PeopleIcon,
      label: "Clientes activos",
      value: kpis.clientes_activos,
      sub:   `Período: ${kpis.periodo?.inicio ?? "—"} / ${kpis.periodo?.fin ?? "—"}`,
      color: "#6d28d9",
    },
  ];

  return (
    <>
      <style>{`
        @keyframes shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        .kpis-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 14px;
          margin-bottom: 24px;
        }
        .kpi-card {
          background: #fff;
          border-radius: 10px;
          padding: 16px;
          box-shadow: 0 1px 4px rgba(0,0,0,0.08);
          border: 1px solid #f0f0f0;
          transition: box-shadow 0.2s;
        }
        .kpi-card:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.12); }
        .kpi-card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 10px;
        }
        .kpi-alert-badge {
          font-size: 10px;
          font-weight: 600;
          background: #fee2e2;
          color: #dc2626;
          padding: 2px 7px;
          border-radius: 20px;
        }
        .kpi-value {
          font-size: 22px;
          font-weight: 700;
          color: #111;
          line-height: 1.2;
          margin-bottom: 3px;
        }
        .kpi-label {
          font-size: 12px;
          font-weight: 500;
          color: #444;
          margin-bottom: 3px;
        }
        .kpi-sub {
          font-size: 11px;
          color: #888;
          line-height: 1.4;
        }
      `}</style>

      <div className="kpis-grid">
        {cards.map((card, i) => (
          <KPICard key={i} {...card} loading={isLoading} />
        ))}
      </div>
    </>
  );
};

export default KPIsFinancieros;
