// Reportes.jsx
import React, { useState, useEffect, useRef } from "react";
import Sidebar from "../components/Sidebar";
import "./Reporte.css";
import LeaderboardIcon from '@mui/icons-material/Leaderboard';

// Importar ApexCharts
import ApexCharts from "apexcharts";

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
    { nombre: "Sección 1", datos: 13, tipo: "Empeños activos" },
    { nombre: "Sección 2", datos: 20, tipo: "Empeños vencidos" },
    { nombre: "Sección 3", datos: 27, tipo: "Próximos a vencer" },
    { nombre: "Sección 4", datos: 4, tipo: "Ingresos mensuales" },
  ];

  // Función para filtrar datos por rango de fechas
  const filtrarPorFechas = (inicio, fin) => {
    const meses = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
    const [inicioYear, inicioMes] = inicio.split('-').map(Number);
    const [finYear, finMes] = fin.split('-').map(Number);
    
    // Convertir a índice para comparar (asumiendo mismo año por simplicidad)
    const inicioIdx = inicioMes - 1; // 0 = Ene
    const finIdx = finMes - 1;

    const tendenciasFiltradas = datosCompletos.tendencias.filter((item, index) => {
      return index >= inicioIdx && index <= finIdx;
    });

    const ingresosFiltrados = datosCompletos.ingresos.filter((item, index) => {
      return index >= inicioIdx && index <= finIdx;
    });

    setTendenciasDetalle(tendenciasFiltradas);
    setIngresosDetalle(ingresosFiltrados);
    setFiltroAplicado(true);

    // Actualizar la gráfica
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
        series: [{
          name: "Empeños",
          data: tendenciasDetalle.map(d => d.valor)
        }],
        chart: {
          height: 350,
          type: 'line',
          zoom: {
            enabled: false
          },
          toolbar: {
            show: true
          }
        },
        dataLabels: {
          enabled: false
        },
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
          title: {
            text: 'Cantidad'
          }
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

  const handleAplicarFiltros = () => {
    if (fechaInicio && fechaFin) {
      filtrarPorFechas(fechaInicio, fechaFin);
    } else {
      alert("Selecciona ambas fechas");
    }
  };

  const handleExportarPDF = () => {
    alert("Exportando PDF...");
  };

  return (
    <div className="dashboard">
      <Sidebar />

      <div className="content">
    
        {/* HEADER */}
        <div className="tienda-header">
          
            <h1>
              <LeaderboardIcon className="title-icon" />
              Reportes <p className="header-sub">Visualiza y exporta tu información</p>
            </h1>
           
         <button className="btn-exportar" onClick={handleExportarPDF}>
            <span>📄</span> Exportar PDF
          </button>
          
        </div>
        

        {/* FILTROS DE FECHA */}
        <div className="filtros-reportes">
          <div className="filtro-grupo">
            <label>Fecha Inicio</label>
            <div className="filtro-input-group">
              <input 
                type="month" 
                className="filtro-input" 
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
                min="2024-01"
                max="2024-12"
              />
              <span className="filtro-icon">📅</span>
            </div>
          </div>

          <div className="filtro-grupo">
            <label>Fecha Fin</label>
            <div className="filtro-input-group">
              <input 
                type="month" 
                className="filtro-input" 
                value={fechaFin}
                onChange={(e) => setFechaFin(e.target.value)}
                min="2024-01"
                max="2024-12"
              />
              <span className="filtro-icon">📅</span>
            </div>
          </div>

          <button className="btn-aplicar" onClick={handleAplicarFiltros}>
            Aplicar Filtros
          </button>

          {filtroAplicado && (
            <button className="btn-limpiar" onClick={limpiarFiltros}>
              ✕ Limpiar
            </button>
          )}
        </div>

        {/* CARDS DE REPORTES */}
        <div className="reportes-cards">
          <div className="reporte-card" onClick={() => setShowTendencias(true)}>
            <div className="card-icon">📈</div>
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
            <div className="card-icon">💰</div>
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
            <div className="card-icon">📊</div>
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
          <div ref={chartRef}></div>
          {filtroAplicado && (
            <p className="filtro-info">
              Mostrando datos de {tendenciasDetalle[0]?.mes} a {tendenciasDetalle[tendenciasDetalle.length-1]?.mes}
            </p>
          )}
        </div>
      </div>

      {/* MODAL TENDENCIAS */}
      {showTendencias && (
        <div className="modal-overlay" onClick={() => setShowTendencias(false)}>
          <div className="modal-detalle" onClick={(e) => e.stopPropagation()}>
            <button className="modal-cerrar" onClick={() => setShowTendencias(false)}>×</button>
            
            <div className="modal-header">
              <h2>Tendencias de Empeños</h2>
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
            <button className="modal-cerrar" onClick={() => setShowIngresos(false)}>×</button>
            
            <div className="modal-header">
              <h2>Comparativa de Ingresos</h2>
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
            <button className="modal-cerrar" onClick={() => setShowSecciones(false)}>×</button>
            
            <div className="modal-header">
              <h2>Exportar PDF - Secciones</h2>
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
              <button className="btn-exportar-modal" onClick={handleExportarPDF}>
                📄 Exportar PDF
              </button>
              <button className="btn-cancelar" onClick={() => setShowSecciones(false)}>
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