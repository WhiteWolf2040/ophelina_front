// Reportes.jsx - Versión COMPLETA y CORREGIDA
import React, { useState, useEffect, useRef } from "react";
import Sidebar from "../components/Sidebar";
import "./Reporte.css";

// Importar iconos de MUI
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import BarChartIcon from '@mui/icons-material/BarChart';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import ClearIcon from '@mui/icons-material/Clear';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import PieChartIcon from '@mui/icons-material/PieChart';
import AssessmentIcon from '@mui/icons-material/Assessment';
import CloseIcon from '@mui/icons-material/Close';
import DownloadIcon from '@mui/icons-material/Download';
import DateRangeIcon from '@mui/icons-material/DateRange';

// Importar ApexCharts y jsPDF (CORREGIDO)
import ApexCharts from "apexcharts";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const Reportes = () => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  // Estados para filtros
  const [fechaInicio, setFechaInicio] = useState("2024-01");
  const [fechaFin, setFechaFin] = useState("2024-09");
  const [filtroAplicado, setFiltroAplicado] = useState(false);

  // Estados para modales
  const [showTendencias, setShowTendencias] = useState(false);
  const [showIngresos, setShowIngresos] = useState(false);
  const [showSecciones, setShowSecciones] = useState(false);

  // Datos completos (originales)
  const datosCompletos = {
    tendencias: [
      { mes: "Ene", valor: 44, cantidad: 44 },
      { mes: "Feb", valor: 55, cantidad: 55 },
      { mes: "Mar", valor: 57, cantidad: 57 },
      { mes: "Abr", valor: 56, cantidad: 56 },
      { mes: "May", valor: 61, cantidad: 61 },
      { mes: "Jun", valor: 58, cantidad: 58 },
      { mes: "Jul", valor: 63, cantidad: 63 },
      { mes: "Ago", valor: 60, cantidad: 60 },
      { mes: "Sep", valor: 66, cantidad: 66 },
    ],
    ingresos: [
      { mes: "Ene", valor: 44000, transacciones: 32 },
      { mes: "Feb", valor: 55000, transacciones: 38 },
      { mes: "Mar", valor: 57000, transacciones: 41 },
      { mes: "Abr", valor: 56000, transacciones: 39 },
      { mes: "May", valor: 61000, transacciones: 44 },
      { mes: "Jun", valor: 58000, transacciones: 42 },
      { mes: "Jul", valor: 63000, transacciones: 46 },
      { mes: "Ago", valor: 60000, transacciones: 43 },
      { mes: "Sep", valor: 66000, transacciones: 48 },
    ]
  };

  // Datos filtrados
  const [tendenciasDetalle, setTendenciasDetalle] = useState(datosCompletos.tendencias);
  const [ingresosDetalle, setIngresosDetalle] = useState(datosCompletos.ingresos);

  const seccionesDetalle = [
    { nombre: "Empeños activos", datos: 13, tipo: "Empeños activos" },
    { nombre: "Empeños vencidos ", datos: 20, tipo: "Empeños vencidos" },
    { nombre: "Próximos a vencer", datos: 27, tipo: "Próximos a vencer" },
    { nombre: "Ingresos mensuales", datos: 4, tipo: "Ingresos mensuales" },
  ];

  // Función para filtrar datos por rango de fechas
  const filtrarPorFechas = (inicio, fin) => {
    const [inicioMes] = inicio.split('-').map(Number);
    const [finMes] = fin.split('-').map(Number);
    
    const inicioIdx = inicioMes - 1;
    const finIdx = finMes - 1;

    const tendenciasFiltradas = datosCompletos.tendencias.filter((_, index) => {
      return index >= inicioIdx && index <= finIdx;
    });

    const ingresosFiltrados = datosCompletos.ingresos.filter((_, index) => {
      return index >= inicioIdx && index <= finIdx;
    });

    setTendenciasDetalle(tendenciasFiltradas);
    setIngresosDetalle(ingresosFiltrados);
    setFiltroAplicado(true);
    actualizarGrafica(tendenciasFiltradas);
  };

  // Función para limpiar filtros
  const limpiarFiltros = () => {
    setFechaInicio("2024-01");
    setFechaFin("2024-09");
    setTendenciasDetalle(datosCompletos.tendencias);
    setIngresosDetalle(datosCompletos.ingresos);
    setFiltroAplicado(false);
    actualizarGrafica(datosCompletos.tendencias);
  };

  // Función para actualizar la gráfica
  const actualizarGrafica = (datos) => {
    if (chartInstance.current) {
      chartInstance.current.updateSeries([{
        name: "Empeños",
        data: datos.map(d => d.valor)
      }]);
    }
  };

  // Inicializar la gráfica
  useEffect(() => {
    if (chartRef.current) {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      const options = {
        chart: {
          id: 'grafica-principal',
          height: 350,
          type: 'line',
          zoom: { enabled: false },
          toolbar: { show: true }
        },
        series: [{
          name: "Empeños",
          data: tendenciasDetalle.map(d => d.valor)
        }],
        dataLabels: { enabled: false },
        stroke: {
          curve: 'straight',
          width: 3,
          colors: ['#1e3a8a']
        },
        title: {
          text: filtroAplicado ? 'Tendencias de Empeños (Filtrado)' : 'Tendencias de Empeños',
          align: 'left',
          style: {
            fontSize: '16px',
            fontWeight: 600,
            color: '#1e3a8a'
          }
        },
        grid: {
          row: {
            colors: ['#f3f3f3', 'transparent'],
            opacity: 0.5
          },
        },
        xaxis: {
          categories: tendenciasDetalle.map(d => d.mes),
        },
        yaxis: {
          title: { text: 'Cantidad' }
        },
        colors: ['#1e3a8a'],
        markers: {
          size: 5,
          colors: ['#1e3a8a'],
          strokeColors: '#fff',
          strokeWidth: 2
        }
      };

      chartInstance.current = new ApexCharts(chartRef.current, options);
      chartInstance.current.render();
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [tendenciasDetalle, filtroAplicado]);

  // Función para exportar a PDF (CORREGIDA)
  const exportarAPDF = async () => {
    try {
      // Crear nuevo PDF (horizontal para más espacio)
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      });

      // ===== PÁGINA 1: RESUMEN GENERAL =====
      
      // Título principal
      pdf.setFontSize(24);
      pdf.setTextColor(30, 58, 138);
      pdf.text('REPORTE COMPLETO DE EMPEÑOS', 15, 20);
      
      // Fecha y período
      pdf.setFontSize(11);
      pdf.setTextColor(80, 80, 80);
      pdf.text(`Generado: ${new Date().toLocaleString()}`, 15, 30);
      pdf.text(`Período: ${fechaInicio} a ${fechaFin}`, 15, 36);
      pdf.text(`Filtros aplicados: ${filtroAplicado ? 'SÍ' : 'NO'}`, 15, 42);

      // Tarjetas de resumen
      pdf.setFontSize(14);
      pdf.setTextColor(30, 58, 138);
      pdf.text('RESUMEN DE MÉTRICAS', 15, 55);

      // Crear tabla de resumen
      autoTable(pdf, {
        startY: 60,
        head: [['Métrica', 'Cantidad', 'Valor Total', 'Detalle']],
        body: [
          ['Empeños Activos', '3', '$11,300', '3 artículos'],
          ['Empeños Vencidos', '2', '$12,200', '25 días promedio'],
          ['Próximos a Vencer', '2', '$3,500', '6.5 días promedio'],
          ['Ingresos Totales', '8', '$8,950', 'Últimos 30 días'],
          ['Productos en Tienda', '4', '$15,700', '3 visibles, 1 oculto'],
        ],
        theme: 'grid',
        headStyles: { fillColor: [30, 58, 138], textColor: 255 },
        styles: { fontSize: 10 },
        columnStyles: {
          0: { cellWidth: 50 },
          1: { cellWidth: 30, halign: 'center' },
          2: { cellWidth: 40, halign: 'right' },
          3: { cellWidth: 70 }
        }
      });

      // ===== GRÁFICA PRINCIPAL =====
      pdf.setFontSize(14);
      pdf.setTextColor(30, 58, 138);
      pdf.text('GRÁFICA DE TENDENCIAS', 15, pdf.lastAutoTable.finalY + 15);

      // Capturar la gráfica como imagen
      try {
        // Esperar un momento para asegurar que la gráfica esté renderizada
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const { imgURI } = await ApexCharts.exec('grafica-principal', 'dataURI', {
          scale: 2,
          width: 800
        });
        
        if (imgURI) {
          // Calcular posición para la gráfica
          const yPos = pdf.lastAutoTable.finalY + 20;
          pdf.addImage(imgURI, 'PNG', 15, yPos, 250, 100);
        }
      } catch (error) {
        console.error("Error capturando gráfica:", error);
      }

      // ===== PÁGINA 2: TENDENCIAS DETALLADAS =====
      pdf.addPage();

      pdf.setFontSize(18);
      pdf.setTextColor(30, 58, 138);
      pdf.text('TENDENCIAS DE EMPEÑOS', 15, 20);

      // Tabla detallada de tendencias - Usar autoTable directamente
      autoTable(pdf, {
        startY: 30,
        head: [['Mes', 'Valor', 'Cantidad', 'Variación %']],
        body: tendenciasDetalle.map((item, i) => [
          item.mes,
          item.valor.toString(),
          `${item.cantidad} empeños`,
          i > 0 ? `${((item.valor - tendenciasDetalle[i-1].valor) / tendenciasDetalle[i-1].valor * 100).toFixed(1)}%` : '-'
        ]),
        theme: 'striped',
        headStyles: { fillColor: [30, 58, 138], textColor: 255 },
        styles: { fontSize: 9 }
      });

      // ===== PÁGINA 3: INGRESOS DETALLADOS =====
      pdf.addPage();

      pdf.setFontSize(18);
      pdf.setTextColor(30, 58, 138);
      pdf.text('COMPARATIVA DE INGRESOS', 15, 20);

      autoTable(pdf, {
        startY: 30,
        head: [['Mes', 'Ingresos', 'Transacciones', 'Promedio']],
        body: ingresosDetalle.map(item => [
          item.mes,
          `$${item.valor.toLocaleString()}`,
          item.transacciones.toString(),
          `$${(item.valor / item.transacciones).toFixed(0)}`
        ]),
        theme: 'striped',
        headStyles: { fillColor: [30, 58, 138], textColor: 255 },
        styles: { fontSize: 9 }
      });

      // ===== PÁGINA 4: SECCIONES PDF =====
      pdf.addPage();

      pdf.setFontSize(18);
      pdf.setTextColor(30, 58, 138);
      pdf.text('SECCIONES PARA EXPORTAR', 15, 20);

      autoTable(pdf, {
        startY: 30,
        head: [['Sección', 'Tipo', 'Cantidad de Datos']],
        body: seccionesDetalle.map(item => [
          item.nombre,
          item.tipo,
          `${item.datos} datos`
        ]),
        theme: 'striped',
        headStyles: { fillColor: [30, 58, 138], textColor: 255 },
        styles: { fontSize: 9 }
      });

      // ===== GUARDAR PDF =====
      pdf.save(`reporte_completo_${new Date().toISOString().split('T')[0]}.pdf`);
      
      alert("✅ Reporte generado exitosamente");

    } catch (error) {
      console.error("Error detallado:", error);
      alert(`❌ Error al generar el PDF: ${error.message}`);
    }
  };

  const handleAplicarFiltros = () => {
    if (fechaInicio && fechaFin) {
      filtrarPorFechas(fechaInicio, fechaFin);
    } else {
      alert("Selecciona ambas fechas");
    }
  };

  return (
    <div className="dashboard">
      <Sidebar />

      <div className="content">
    
        {/* HEADER */}
        <div className="tienda-header">
          <h1>
            <AssessmentIcon className="title-icon" />
            Reportes 
            <p className="header-sub">Visualiza y exporta tu información</p>
          </h1>
           
          <button className="btn-exportar" onClick={exportarAPDF}>
            <PictureAsPdfIcon />
            Exportar PDF
          </button>
        </div>
        

        {/* FILTROS DE FECHA */}
        <div className="filtros-reportes">
          <div className="filtro-grupo">
            <label><DateRangeIcon fontSize="small" /> Fecha Inicio</label>
            <div className="filtro-input-group">
              <input 
                type="month" 
                className="filtro-input" 
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
                min="2024-01"
                max="2024-12"
              />
              <CalendarTodayIcon className="filtro-icon" />
            </div>
          </div>

          <div className="filtro-grupo">
            <label><DateRangeIcon fontSize="small" /> Fecha Fin</label>
            <div className="filtro-input-group">
              <input 
                type="month" 
                className="filtro-input" 
                value={fechaFin}
                onChange={(e) => setFechaFin(e.target.value)}
                min="2024-01"
                max="2024-12"
              />
              <CalendarTodayIcon className="filtro-icon" />
            </div>
          </div>

          <button className="btn-aplicar" onClick={handleAplicarFiltros}>
            <FilterAltIcon />
            Aplicar Filtros
          </button>

          {filtroAplicado && (
            <button className="btn-limpiar" onClick={limpiarFiltros}>
              <ClearIcon />
              Limpiar
            </button>
          )}
        </div>

        {/* CARDS DE REPORTES */}
        <div className="reportes-cards">
          <div className="reporte-card" onClick={() => setShowTendencias(true)}>
            <ShowChartIcon className="card-icon" />
            <h3>Tendencias de Empeños</h3>
            <p className="card-value">
              {tendenciasDetalle.length} meses • 
              Total: {tendenciasDetalle.reduce((sum, item) => sum + item.cantidad, 0)}
            </p>
            <div className="mini-grafica">
              {tendenciasDetalle.map((item, i) => (
                <div 
                  key={i}
                  className="mini-barra"
                  style={{ 
                    height: `${(item.valor / 66) * 40}px`,
                    backgroundColor: i === 0 ? '#1e3a8a' : '#93c5fd'
                  }}
                ></div>
              ))}
            </div>
          </div>

          <div className="reporte-card" onClick={() => setShowIngresos(true)}>
            <AttachMoneyIcon className="card-icon" />
            <h3>Comparativa de Ingresos</h3>
            <p className="card-value">
              ${ingresosDetalle.reduce((sum, item) => sum + item.valor, 0).toLocaleString()} total
            </p>
            <div className="mini-grafica horizontal">
              {ingresosDetalle.map((item, i) => (
                <div 
                  key={i}
                  className="mini-barra-h"
                  style={{ 
                    width: `${(item.valor / 66000) * 100}%`,
                    backgroundColor: '#1e3a8a'
                  }}
                >
                  <span>{item.mes}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="reporte-card full-width" onClick={() => setShowSecciones(true)}>
            <PieChartIcon className="card-icon" />
            <h3>Exportar PDF - Secciones</h3>
            <div className="secciones-mini">
              {seccionesDetalle.map((item, i) => (
                <div key={i} className="seccion-mini-item">
                  <span>{item.nombre}</span>
                  <div className="mini-barra-contenedor">
                    <div 
                      className="mini-barra-progreso"
                      style={{ width: `${(item.datos / 27) * 100}%` }}
                    ></div>
                  </div>
                  <span className="mini-datos">{item.datos} datos</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* GRÁFICA PRINCIPAL */}
        <div className="grafica-card">
          <h2><BarChartIcon /> Análisis de Empeños</h2>
          <div ref={chartRef}></div>
          {filtroAplicado && (
            <p className="filtro-info">
              <FilterAltIcon fontSize="small" />
              Mostrando datos de {tendenciasDetalle[0]?.mes} a {tendenciasDetalle[tendenciasDetalle.length-1]?.mes}
            </p>
          )}
        </div>
      </div>

      {/* MODAL TENDENCIAS */}
      {showTendencias && (
        <div className="modal-overlay" onClick={() => setShowTendencias(false)}>
          <div className="modal-detalle" onClick={(e) => e.stopPropagation()}>
            <button className="modal-cerrar" onClick={() => setShowTendencias(false)}>
              <CloseIcon />
            </button>
            
            <div className="modal-header">
              <h2>
                <ShowChartIcon />
                Tendencias de Empeños
              </h2>
              <span className="cliente-id">
                {tendenciasDetalle.length} meses • Total: {tendenciasDetalle.reduce((sum, item) => sum + item.cantidad, 0)} empeños
              </span>
            </div>

            <div className="modal-body">
              <div className="tabla-container-modal">
                <table className="tabla-modal">
                  <thead>
                    <tr>
                      <th>Mes</th>
                      <th>Valor</th>
                      <th>Cantidad</th>
                      <th>Variación</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tendenciasDetalle.map((item, i) => (
                      <tr key={i}>
                        <td><strong>{item.mes}</strong></td>
                        <td>{item.valor}</td>
                        <td>{item.cantidad} empeños</td>
                        <td>
                          {i > 0 ? (
                            <span className={item.valor < tendenciasDetalle[i-1].valor ? "badge-danger" : "badge-success"}>
                              <TrendingUpIcon fontSize="small" />
                              {((item.valor - tendenciasDetalle[i-1].valor) / tendenciasDetalle[i-1].valor * 100).toFixed(1)}%
                            </span>
                          ) : "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="modal-acciones">
              <button className="btn-cancelar" onClick={() => setShowTendencias(false)}>
                <CloseIcon />
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL INGRESOS */}
      {showIngresos && (
        <div className="modal-overlay" onClick={() => setShowIngresos(false)}>
          <div className="modal-detalle" onClick={(e) => e.stopPropagation()}>
            <button className="modal-cerrar" onClick={() => setShowIngresos(false)}>
              <CloseIcon />
            </button>
            
            <div className="modal-header">
              <h2>
                <AttachMoneyIcon />
                Comparativa de Ingresos
              </h2>
              <span className="cliente-id">
                Total: ${ingresosDetalle.reduce((sum, item) => sum + item.valor, 0).toLocaleString()}
              </span>
            </div>

            <div className="modal-body">
              <div className="tabla-container-modal">
                <table className="tabla-modal">
                  <thead>
                    <tr>
                      <th>Mes</th>
                      <th>Ingresos</th>
                      <th>Transacciones</th>
                      <th>Promedio</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ingresosDetalle.map((item, i) => (
                      <tr key={i}>
                        <td><strong>{item.mes}</strong></td>
                        <td>${item.valor.toLocaleString()}</td>
                        <td>{item.transacciones}</td>
                        <td>${(item.valor / item.transacciones).toFixed(0)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="modal-acciones">
              <button className="btn-cancelar" onClick={() => setShowIngresos(false)}>
                <CloseIcon />
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL SECCIONES PDF */}
      {showSecciones && (
        <div className="modal-overlay" onClick={() => setShowSecciones(false)}>
          <div className="modal-detalle" onClick={(e) => e.stopPropagation()}>
            <button className="modal-cerrar" onClick={() => setShowSecciones(false)}>
              <CloseIcon />
            </button>
            
            <div className="modal-header">
              <h2>
                <PictureAsPdfIcon />
                Exportar PDF - Secciones
              </h2>
              <span className="cliente-id">Total: {seccionesDetalle.reduce((sum, item) => sum + item.datos, 0)} datos</span>
            </div>

            <div className="modal-body">
              <div className="secciones-detalle">
                {seccionesDetalle.map((item, i) => (
                  <div key={i} className="seccion-detalle-item">
                    <div className="seccion-detalle-header">
                      <span className="seccion-nombre">{item.nombre}</span>
                      <span className="seccion-tipo">{item.tipo}</span>
                    </div>
                    <div className="seccion-detalle-barra">
                      <div className="seccion-barra-contenedor">
                        <div 
                          className="seccion-barra-progreso"
                          style={{ width: `${(item.datos / 27) * 100}%` }}
                        ></div>
                      </div>
                      <span className="seccion-cantidad">{item.datos} datos</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="modal-acciones">
              <button className="btn-exportar-modal" onClick={exportarAPDF}>
                <DownloadIcon />
                Exportar PDF
              </button>
              <button className="btn-cancelar" onClick={() => setShowSecciones(false)}>
                <CloseIcon />
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reportes;