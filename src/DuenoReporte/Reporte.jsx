// Reportes.jsx — Versión completa con datos reales
// Reemplaza el archivo anterior completo

import React, { useState, useRef, useEffect } from "react";

import KPIsFinancieros   from "../components/KPIsFinancieros";
import { useReportes }   from "../hooks/useReportes";
import ApexCharts        from "apexcharts";
import jsPDF             from "jspdf";
import autoTable         from "jspdf-autotable";
import * as XLSX         from "xlsx";

// Iconos MUI
import AssessmentIcon    from "@mui/icons-material/Assessment";
import PictureAsPdfIcon  from "@mui/icons-material/PictureAsPdf";
import FilterAltIcon     from "@mui/icons-material/FilterAlt";
import ClearIcon         from "@mui/icons-material/Clear";
import DateRangeIcon     from "@mui/icons-material/DateRange";
import TableChartIcon    from "@mui/icons-material/TableChart";
import ShowChartIcon     from "@mui/icons-material/ShowChart";
import PeopleIcon        from "@mui/icons-material/People";
import InventoryIcon     from "@mui/icons-material/Inventory";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import RefreshIcon       from "@mui/icons-material/Refresh";
import CloseIcon         from "@mui/icons-material/Close";
import "./Reporte.css";

// ─── Tabs del módulo ──────────────────────────────────────────────────────────
const TABS = [
  { id: "financiero",  label: "Financiero",   icon: AccountBalanceIcon },
  { id: "empenos",     label: "Empeños",       icon: ShowChartIcon },
  { id: "flujo",       label: "Flujo de caja", icon: TableChartIcon },
  { id: "clientes",    label: "Clientes",      icon: PeopleIcon },
  { id: "inventario",  label: "Inventario",    icon: InventoryIcon },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const hoy        = new Date();
const isoHoy     = hoy.toISOString().slice(0, 7);           // YYYY-MM
const isoInicio  = new Date(hoy.getFullYear(), hoy.getMonth(), 1)
                     .toISOString().slice(0, 10);            // primer día del mes
const isoFin     = hoy.toISOString().slice(0, 10);          // hoy

// ══════════════════════════════════════════════════════════════════════════════
const Reportes = () => {
  // ── Estado de filtros ─────────────────────────────────────────────────────
  const [inicio, setInicio]           = useState(isoInicio);
  const [fin,    setFin]              = useState(isoFin);
  const [filtros, setFiltros]         = useState({ inicio: isoInicio, fin: isoFin });
  const [activeTab, setActiveTab]     = useState("financiero");

  // ── Hook de datos ─────────────────────────────────────────────────────────
  const { kpis, empeños, flujoCaja, clientes, inventario, loading, error, refetch, formatMXN } =
    useReportes(filtros);

  // ── Gráfica ───────────────────────────────────────────────────────────────
  const chartRef      = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (!chartRef.current || !empeños?.tendencia_mensual?.length) return;

    const datos = empeños.tendencia_mensual;

    if (chartInstance.current) chartInstance.current.destroy();

    chartInstance.current = new ApexCharts(chartRef.current, {
      chart: { id: "grafica-empenos", height: 280, type: "area", toolbar: { show: false } },
      series: [
        { name: "Empeños", data: datos.map(d => d.cantidad) },
        { name: "Monto ($)",  data: datos.map(d => Math.round(d.monto_total / 1000)) },
      ],
      xaxis: { categories: datos.map(d => d.mes) },
      yaxis: [
        { title: { text: "Cantidad" } },
        { opposite: true, title: { text: "Miles MXN" } },
      ],
      stroke:    { curve: "smooth", width: 2 },
      fill:      { type: "gradient", gradient: { opacityFrom: 0.4, opacityTo: 0 } },
      colors:    ["#1e3a8a", "#16a34a"],
      dataLabels: { enabled: false },
      tooltip:   { shared: true, intersect: false },
      legend:    { position: "top" },
    });

    chartInstance.current.render();

    return () => { if (chartInstance.current) chartInstance.current.destroy(); };
  }, [empeños]);

  // ── Aplicar filtros ───────────────────────────────────────────────────────
  const aplicarFiltros = () => {
    if (!inicio || !fin) return alert("Selecciona ambas fechas");
    setFiltros({ inicio, fin });
  };

  const limpiarFiltros = () => {
    setInicio(isoInicio);
    setFin(isoFin);
    setFiltros({ inicio: isoInicio, fin: isoFin });
  };

  // ── Exportar PDF ──────────────────────────────────────────────────────────
  const exportarPDF = async () => {
    const pdf = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });

    // Página 1 — KPIs
    pdf.setFontSize(20); pdf.setTextColor(30, 58, 138);
    pdf.text("REPORTE OPHELINA", 15, 18);
    pdf.setFontSize(10); pdf.setTextColor(80, 80, 80);
    pdf.text(`Período: ${filtros.inicio}  →  ${filtros.fin}`, 15, 26);
    pdf.text(`Generado: ${new Date().toLocaleString("es-MX")}`, 15, 32);

    autoTable(pdf, {
      startY: 40,
      head: [["KPI", "Valor"]],
      body: [
        ["Capital prestado",      formatMXN(kpis.capital_prestado)],
        ["Cartera vigente",       formatMXN(kpis.cartera_vigente)],
        ["Cartera vencida",       formatMXN(kpis.cartera_vencida)],
        ["Intereses cobrados",    formatMXN(kpis.intereses_cobrados)],
        ["Intereses pendientes",  formatMXN(kpis.intereses_pendientes)],
        ["Ingresos del mes",      formatMXN(kpis.ingresos_mes)],
        ["Empeños activos",       kpis.total_activos],
        ["Contratos vencen 7d",   kpis.vencen_7_dias],
        ["Clientes activos",      kpis.clientes_activos],
      ],
      headStyles:  { fillColor: [30, 58, 138], textColor: 255 },
      theme:       "striped",
    });

    // Página 2 — Tendencia de empeños
    if (empeños?.tendencia_mensual?.length) {
      pdf.addPage();
      pdf.setFontSize(16); pdf.setTextColor(30, 58, 138);
      pdf.text("TENDENCIA DE EMPEÑOS", 15, 18);

      autoTable(pdf, {
        startY: 26,
        head: [["Mes", "Cantidad", "Monto total", "Promedio"]],
        body: empeños.tendencia_mensual.map(d => [
          d.mes,
          d.cantidad,
          formatMXN(d.monto_total),
          formatMXN(d.monto_total / (d.cantidad || 1)),
        ]),
        headStyles: { fillColor: [30, 58, 138], textColor: 255 },
      });
    }

    // Página 3 — Flujo de caja
    if (flujoCaja?.resumen_diario?.length) {
      pdf.addPage();
      pdf.setFontSize(16); pdf.setTextColor(30, 58, 138);
      pdf.text("FLUJO DE CAJA", 15, 18);

      autoTable(pdf, {
        startY: 26,
        head: [["Fecha", "Entradas", "Salidas", "Balance"]],
        body: flujoCaja.resumen_diario.map(d => [
          d.fecha,
          formatMXN(d.entradas),
          formatMXN(d.salidas),
          formatMXN(d.balance),
        ]),
        headStyles: { fillColor: [30, 58, 138], textColor: 255 },
      });

      // Totales al final
      const y = pdf.lastAutoTable.finalY + 8;
      pdf.setFontSize(11); pdf.setTextColor(30, 58, 138);
      pdf.text(`Total entradas: ${formatMXN(flujoCaja.totales.entradas)}`, 15, y);
      pdf.text(`Total salidas:  ${formatMXN(flujoCaja.totales.salidas)}`, 15, y + 6);
      pdf.text(`Balance neto:   ${formatMXN(flujoCaja.totales.balance)}`, 15, y + 12);
    }

    pdf.save(`ophelina_reporte_${isoFin}.pdf`);
  };

  // ── Exportar Excel ────────────────────────────────────────────────────────
  const exportarExcel = () => {
    const wb = XLSX.utils.book_new();

    // Hoja 1: KPIs
    XLSX.utils.book_append_sheet(wb,
      XLSX.utils.json_to_sheet([
        { KPI: "Capital prestado",     Valor: kpis.capital_prestado },
        { KPI: "Cartera vigente",      Valor: kpis.cartera_vigente },
        { KPI: "Cartera vencida",      Valor: kpis.cartera_vencida },
        { KPI: "Intereses cobrados",   Valor: kpis.intereses_cobrados },
        { KPI: "Intereses pendientes", Valor: kpis.intereses_pendientes },
        { KPI: "Ingresos del mes",     Valor: kpis.ingresos_mes },
        { KPI: "Empeños activos",      Valor: kpis.total_activos },
        { KPI: "Clientes activos",     Valor: kpis.clientes_activos },
      ]),
      "KPIs"
    );

    // Hoja 2: Tendencia de empeños
    if (empeños?.tendencia_mensual?.length) {
      XLSX.utils.book_append_sheet(wb,
        XLSX.utils.json_to_sheet(empeños.tendencia_mensual),
        "Tendencia Empeños"
      );
    }

    // Hoja 3: Flujo de caja
    if (flujoCaja?.movimientos?.length) {
      XLSX.utils.book_append_sheet(wb,
        XLSX.utils.json_to_sheet(flujoCaja.movimientos),
        "Flujo de Caja"
      );
    }

    // Hoja 4: Clientes con atraso
    if (clientes?.con_atraso?.length) {
      XLSX.utils.book_append_sheet(wb,
        XLSX.utils.json_to_sheet(clientes.con_atraso),
        "Clientes Atraso"
      );
    }

    // Hoja 5: Inventario más empeñado
    if (inventario?.mas_empenados?.length) {
      XLSX.utils.book_append_sheet(wb,
        XLSX.utils.json_to_sheet(inventario.mas_empenados),
        "Inventario"
      );
    }

    XLSX.writeFile(wb, `ophelina_reporte_${isoFin}.xlsx`);
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="dashboard">


      <div className="content">

        {/* HEADER */}
        <div className="tienda-header">
          <h1>
            <AssessmentIcon className="title-icon" />
            Reportes
            <p className="header-sub">
              {filtros.inicio} → {filtros.fin}
            </p>
          </h1>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn-exportar" onClick={refetch} title="Actualizar datos">
              <RefreshIcon /> Actualizar
            </button>
            <button className="btn-exportar" onClick={exportarExcel}>
              <TableChartIcon /> Excel
            </button>
            <button className="btn-exportar" onClick={exportarPDF}>
              <PictureAsPdfIcon /> PDF
            </button>
          </div>
        </div>

        {/* ERROR */}
        {error && (
          <div style={{ background:"#fee2e2", border:"1px solid #fca5a5", borderRadius:8, padding:"10px 16px", marginBottom:16, fontSize:13, color:"#991b1b" }}>
            Error al cargar datos: {JSON.stringify(error)}
          </div>
        )}

        {/* FILTROS */}
        <div className="filtros-reportes">
          <div className="filtro-grupo">
            <label><DateRangeIcon fontSize="small" /> Inicio</label>
            <input type="date" className="filtro-input" value={inicio}
              onChange={e => setInicio(e.target.value)} />
          </div>
          <div className="filtro-grupo">
            <label><DateRangeIcon fontSize="small" /> Fin</label>
            <input type="date" className="filtro-input" value={fin}
              onChange={e => setFin(e.target.value)} />
          </div>
          <button className="btn-aplicar" onClick={aplicarFiltros}>
            <FilterAltIcon /> Aplicar
          </button>
          <button className="btn-limpiar" onClick={limpiarFiltros}>
            <ClearIcon /> Limpiar
          </button>
        </div>

        {/* KPIs — siempre visibles */}
        <KPIsFinancieros kpis={kpis} loading={loading} formatMXN={formatMXN} />

        {/* TABS */}
        <div style={{ display:"flex", gap:4, marginBottom:20, borderBottom:"2px solid #e5e7eb" }}>
          {TABS.map(t => (
            <button key={t.id}
              onClick={() => setActiveTab(t.id)}
              style={{
                display:"flex", alignItems:"center", gap:6,
                padding:"8px 16px", border:"none", background:"none",
                cursor:"pointer", fontSize:13, fontWeight:500,
                color: activeTab === t.id ? "#1e3a8a" : "#6b7280",
                borderBottom: activeTab === t.id ? "2px solid #1e3a8a" : "2px solid transparent",
                marginBottom:-2, transition:"all 0.15s",
              }}
            >
              <t.icon fontSize="small" />
              {t.label}
            </button>
          ))}
        </div>

        {/* ── TAB: FINANCIERO ── */}
        {activeTab === "financiero" && (
          <div className="grafica-card">
            <h2><ShowChartIcon /> Tendencia mensual de empeños</h2>
            {loading.empeños
              ? <div style={{ height:280, display:"flex", alignItems:"center", justifyContent:"center", color:"#888" }}>Cargando gráfica...</div>
              : <div ref={chartRef} />
            }
          </div>
        )}

        {/* ── TAB: EMPEÑOS ── */}
        {activeTab === "empenos" && empeños && (
          <div className="reportes-cards">
            {[
              ["Activos",    empeños.por_estado.activos,    "#16a34a"],
              ["Vencidos",   empeños.por_estado.vencidos,   "#dc2626"],
              ["Rescatados", empeños.por_estado.rescatados, "#2563eb"],
              ["Vendidos",   empeños.por_estado.vendidos,   "#7c3aed"],
            ].map(([label, datos, color]) => (
              <div key={label} className="reporte-card" style={{ borderTop:`3px solid ${color}` }}>
                <h3>{label}</h3>
                <p className="card-value">{datos?.total ?? 0} empeños</p>
                <p style={{ fontSize:13, color:"#555" }}>{formatMXN(datos?.monto ?? 0)}</p>
              </div>
            ))}
            <div className="reporte-card" style={{ borderTop:"3px solid #ca8a04" }}>
              <h3>Refrendados</h3>
              <p className="card-value">{empeños.por_estado.refrendados}</p>
              <p style={{ fontSize:13, color:"#555" }}>Con al menos 1 renovación</p>
            </div>
            <div className="reporte-card" style={{ borderTop:"3px solid #0891b2" }}>
              <h3>Tiempo promedio de recuperación</h3>
              <p className="card-value">{empeños.tiempo_promedio_recuperacion} días</p>
              <p style={{ fontSize:13, color:"#555" }}>Desde préstamo hasta rescate</p>
            </div>
          </div>
        )}

        {/* ── TAB: FLUJO DE CAJA ── */}
        {activeTab === "flujo" && flujoCaja && (
          <>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:14, marginBottom:20 }}>
              {[
                ["Total entradas", flujoCaja.totales.entradas, "#16a34a"],
                ["Total salidas",  flujoCaja.totales.salidas,  "#dc2626"],
                ["Balance neto",   flujoCaja.totales.balance,  flujoCaja.totales.balance >= 0 ? "#2563eb" : "#dc2626"],
              ].map(([label, val, color]) => (
                <div key={label} className="kpi-card" style={{ borderTop:`3px solid ${color}` }}>
                  <div style={{ fontSize:11, color:"#888", marginBottom:4 }}>{label}</div>
                  <div style={{ fontSize:22, fontWeight:700, color }}>{formatMXN(val)}</div>
                </div>
              ))}
            </div>

            <div className="grafica-card" style={{ padding:0, overflow:"hidden" }}>
              <div style={{ padding:"12px 16px", borderBottom:"1px solid #f0f0f0" }}>
                <strong>Movimientos del período</strong>
              </div>
              <div style={{ overflowX:"auto" }}>
                <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
                  <thead>
                    <tr style={{ background:"#f9fafb" }}>
                      {["Fecha","Concepto","Tipo","Monto"].map(h => (
                        <th key={h} style={{ padding:"8px 16px", textAlign:"left", fontWeight:500, color:"#6b7280", borderBottom:"1px solid #e5e7eb" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {flujoCaja.movimientos?.slice(0, 50).map((m, i) => (
                      <tr key={i} style={{ borderBottom:"1px solid #f0f0f0" }}>
                        <td style={{ padding:"8px 16px", color:"#888" }}>{m.fecha}</td>
                        <td style={{ padding:"8px 16px" }}>{m.concepto}</td>
                        <td style={{ padding:"8px 16px" }}>
                          <span style={{
                            fontSize:11, padding:"2px 8px", borderRadius:4, fontWeight:500,
                            background: m.tipo === "entrada" ? "#dcfce7" : "#fee2e2",
                            color:      m.tipo === "entrada" ? "#166534" : "#991b1b",
                          }}>
                            {m.tipo}
                          </span>
                        </td>
                        <td style={{ padding:"8px 16px", fontWeight:600, color: m.tipo === "entrada" ? "#166534" : "#dc2626" }}>
                          {m.tipo === "salida" ? "− " : "+ "}{formatMXN(m.monto)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* ── TAB: CLIENTES ── */}
        {activeTab === "clientes" && clientes && (
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>

            <div className="grafica-card" style={{ padding:0, overflow:"hidden" }}>
              <div style={{ padding:"12px 16px", borderBottom:"1px solid #f0f0f0", display:"flex", justifyContent:"space-between" }}>
                <strong>⚠ Con atraso ({clientes.totales.con_atraso})</strong>
                <span style={{ fontSize:11, color:"#888" }}>{clientes.nuevos_mes} nuevos este mes</span>
              </div>
              <table style={{ width:"100%", borderCollapse:"collapse", fontSize:12 }}>
                <thead>
                  <tr style={{ background:"#fef2f2" }}>
                    {["Cliente","Vencidos","Monto riesgo","Días atraso"].map(h => (
                      <th key={h} style={{ padding:"7px 12px", textAlign:"left", color:"#991b1b", fontWeight:500 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {clientes.con_atraso?.map((c, i) => (
                    <tr key={i} style={{ borderBottom:"1px solid #fef2f2" }}>
                     <td style={{ padding:"7px 12px" }}>{c.nombre} {c.apellido || ''}</td>
                      <td style={{ padding:"7px 12px", textAlign:"center" }}>{c.empenos_vencidos}</td>
                      <td style={{ padding:"7px 12px" }}>{formatMXN(c.monto_en_riesgo)}</td>
                      <td style={{ padding:"7px 12px", color:"#dc2626", fontWeight:600 }}>{c.dias_max_atraso}d</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="grafica-card" style={{ padding:0, overflow:"hidden" }}>
              <div style={{ padding:"12px 16px", borderBottom:"1px solid #f0f0f0" }}>
                <strong>⭐ Frecuentes ({clientes.totales.frecuentes})</strong>
              </div>
              <table style={{ width:"100%", borderCollapse:"collapse", fontSize:12 }}>
                <thead>
                  <tr style={{ background:"#eff6ff" }}>
                    {["Cliente","Empeños","Total prestado","Último"].map(h => (
                      <th key={h} style={{ padding:"7px 12px", textAlign:"left", color:"#1e40af", fontWeight:500 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {clientes.frecuentes?.map((c, i) => (
                    <tr key={i} style={{ borderBottom:"1px solid #eff6ff" }}>
                      <td style={{ padding:"7px 12px" }}>{c.nombre} {c.apellido || ''}</td>
                      <td style={{ padding:"7px 12px", textAlign:"center" }}>{c.total_empenos}</td>
                      <td style={{ padding:"7px 12px" }}>{formatMXN(c.monto_total)}</td>
                      <td style={{ padding:"7px 12px", color:"#888" }}>{c.ultimo_empeno}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── TAB: INVENTARIO ── */}
        {activeTab === "inventario" && inventario && (
          <>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14, marginBottom:20 }}>
              {[
                ["En garantía",      `${inventario.en_garantia?.cantidad ?? 0} prendas`,    "#1e3a8a"],
                ["Valor avalúo",     formatMXN(inventario.en_garantia?.valor_avaluo),        "#6d28d9"],
                ["En tienda",        `${inventario.en_tienda?.cantidad ?? 0} productos`,     "#16a34a"],
                ["Valor inventario", formatMXN(inventario.valor_total),                      "#0891b2"],
              ].map(([label, val, color]) => (
                <div key={label} className="kpi-card" style={{ borderTop:`3px solid ${color}` }}>
                  <div style={{ fontSize:11, color:"#888", marginBottom:4 }}>{label}</div>
                  <div style={{ fontSize:18, fontWeight:700, color }}>{val}</div>
                </div>
              ))}
            </div>

            <div className="grafica-card" style={{ padding:0, overflow:"hidden" }}>
              <div style={{ padding:"12px 16px", borderBottom:"1px solid #f0f0f0" }}>
                <strong>Artículos más empeñados</strong>
              </div>
              <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
                <thead>
                  <tr style={{ background:"#f9fafb" }}>
                    {["Tipo","Material","Veces empeñado","Monto promedio"].map(h => (
                      <th key={h} style={{ padding:"8px 16px", textAlign:"left", fontWeight:500, color:"#6b7280", borderBottom:"1px solid #e5e7eb" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {inventario.mas_empenados?.map((a, i) => (
                    <tr key={i} style={{ borderBottom:"1px solid #f0f0f0" }}>
                      <td style={{ padding:"8px 16px", fontWeight:500 }}>{a.tipo}</td>
                      <td style={{ padding:"8px 16px", color:"#888" }}>{a.material}</td>
                      <td style={{ padding:"8px 16px", textAlign:"center" }}>{a.veces_empenado}</td>
                      <td style={{ padding:"8px 16px" }}>{formatMXN(a.monto_promedio)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

      </div>
    </div>
  );
};

export default Reportes;
