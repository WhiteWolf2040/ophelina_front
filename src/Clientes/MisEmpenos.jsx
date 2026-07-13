import React, { useState } from "react";
import "./MisEmpenos.css";
import Navbar from "../ClientesNav/Navbar";

import anillo_oro from "../assets/anillo_oro.jpg";
import collar_plata from "../assets/collar_plata.jpg";
import arete_diamante from "../assets/arete_diamante.jpg";
import arete_oro from "../assets/arete_oro.jpg";
import anillo_compromiso from "../assets/anillo_compromiso.jpg";

export default function MisEmpenos() {
  const [busqueda, setBusqueda] = useState("");
  const [popupAbierto, setPopupAbierto] = useState(null);
  const [empeñoSeleccionado, setEmpeñoSeleccionado] = useState(null);

  // Funcion para obtener fecha actual y calcular estado
  const obtenerFechaActual = () => new Date(2026, 3, 17);
  
  const formatearFecha = (fechaStr) => {
    const [dia, mes, año] = fechaStr.split('/');
    return new Date(parseInt(año), parseInt(mes) - 1, parseInt(dia));
  };

  const estaVencido = (fechaVencimiento) => {
    const fechaActual = obtenerFechaActual();
    const fechaVen = formatearFecha(fechaVencimiento);
    return fechaVen < fechaActual;
  };

  const estaProximoAVencer = (fechaVencimiento) => {
    const fechaActual = obtenerFechaActual();
    const fechaVen = formatearFecha(fechaVencimiento);
    const diffTime = fechaVen - fechaActual;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7 && diffDays > 0;
  };

  // Funcion para determinar el estado del empeño
  const obtenerEstado = (empeño) => {
    if (empeño.pagadoCompleto) {
      return "PAGADO";
    }
    if (empeño.enTienda) {
      return "EN TIENDA";
    }
    if (estaVencido(empeño.vencimiento)) {
      return "VENCIDO";
    }
    if (estaProximoAVencer(empeño.vencimiento)) {
      return "PROXIMO A VENCER";
    }
    return "ACTIVO";
  };

  const empeños = [
    {
      id: 1,
      nombre: "Anillo de Oro 14k",
      descripcion: "Anillo de oro amarillo 14k con diamante central talla brillante",
      prestado: "$8,500.00",
      prestadoNumerico: 8500,
      totalPagar: "$9,775.00",
      totalPagarNumerico: 9775,
      vencimiento: "15/03/2026",
      imagen: anillo_oro,
      gramos: "5.2 gramos",
      casaEmpeño: "JSK",
      tasaInteres: "15%",
      intereses: "$1,275.00",
      interesesNumerico: 1275,
      pagadoCompleto: false,
      enTienda: true, // Este ya paso a venta por no liquidar
      abonos: [
        { fecha: "15/01/2026", monto: "$1,500.00", interesesPagados: "$225.00", montoNumerico: 1500 },
        { fecha: "01/02/2026", monto: "$2,000.00", interesesPagados: "$300.00", montoNumerico: 2000 },
        { fecha: "28/02/2026", monto: "$1,000.00", interesesPagados: "$150.00", montoNumerico: 1000 }
      ],
      saldoRestante: 9775 - 4500
    },
    {
      id: 2,
      nombre: "Collar de Plata",
      descripcion: "Collar de plata 925 con dije de corazon, cadena tipo rolo",
      prestado: "$12,500.00",
      prestadoNumerico: 12500,
      totalPagar: "$14,375.00",
      totalPagarNumerico: 14375,
      vencimiento: "20/04/2026",
      imagen: collar_plata,
      gramos: "12.5 gramos",
      casaEmpeño: "JSK",
      tasaInteres: "15%",
      intereses: "$1,875.00",
      interesesNumerico: 1875,
      pagadoCompleto: false,
      enTienda: false,
      abonos: [
        { fecha: "20/01/2026", monto: "$2,500.00", interesesPagados: "$375.00", montoNumerico: 2500 },
        { fecha: "05/02/2026", monto: "$3,000.00", interesesPagados: "$450.00", montoNumerico: 3000 },
        { fecha: "20/03/2026", monto: "$2,000.00", interesesPagados: "$300.00", montoNumerico: 2000 }
      ],
      saldoRestante: 14375 - 7500
    },
    {
      id: 3,
      nombre: "Aretes de Diamante",
      descripcion: "Pares de aretes en oro blanco 18k con diamantes talla princesa",
      prestado: "$3,200.00",
      prestadoNumerico: 3200,
      totalPagar: "$3,680.00",
      totalPagarNumerico: 3680,
      vencimiento: "25/05/2026",
      imagen: arete_diamante,
      gramos: "2.8 gramos",
      casaEmpeño: "JSK",
      tasaInteres: "15%",
      intereses: "$480.00",
      interesesNumerico: 480,
      pagadoCompleto: true, // Este ya esta pagado completamente
      enTienda: false,
      abonos: [
        { fecha: "25/01/2026", monto: "$1,000.00", interesesPagados: "$150.00", montoNumerico: 1000 },
        { fecha: "25/02/2026", monto: "$800.00", interesesPagados: "$120.00", montoNumerico: 800 },
        { fecha: "10/03/2026", monto: "$1,880.00", interesesPagados: "$210.00", montoNumerico: 1880 }
      ],
      saldoRestante: 0
    },
    {
      id: 4,
      nombre: "Aretes de Oro",
      descripcion: "Aretes de oro amarillo 18k estilo aro, diseño italiano",
      prestado: "$7,800.00",
      prestadoNumerico: 7800,
      totalPagar: "$8,970.00",
      totalPagarNumerico: 8970,
      vencimiento: "28/04/2026",
      imagen: arete_oro,
      gramos: "6.4 gramos",
      casaEmpeño: "JSK",
      tasaInteres: "15%",
      intereses: "$1,170.00",
      interesesNumerico: 1170,
      pagadoCompleto: false,
      enTienda: false,
      abonos: [
        { fecha: "28/01/2026", monto: "$2,000.00", interesesPagados: "$300.00", montoNumerico: 2000 },
        { fecha: "15/02/2026", monto: "$1,500.00", interesesPagados: "$225.00", montoNumerico: 1500 }
      ],
      saldoRestante: 8970 - 3500
    },
    {
      id: 5,
      nombre: "Anillo de Compromiso",
      descripcion: "Anillo de compromiso en oro blanco 14k con diamante central 0.5 quilates",
      prestado: "$10,500.00",
      prestadoNumerico: 10500,
      totalPagar: "$12,075.00",
      totalPagarNumerico: 12075,
      vencimiento: "10/06/2026",
      imagen: anillo_compromiso,
      gramos: "8.1 gramos",
      casaEmpeño: "JSK",
      tasaInteres: "15%",
      intereses: "$1,575.00",
      interesesNumerico: 1575,
      pagadoCompleto: false,
      enTienda: false,
      abonos: [
        { fecha: "10/01/2026", monto: "$3,000.00", interesesPagados: "$450.00", montoNumerico: 3000 },
        { fecha: "25/01/2026", monto: "$2,000.00", interesesPagados: "$300.00", montoNumerico: 2000 },
        { fecha: "10/02/2026", monto: "$1,500.00", interesesPagados: "$225.00", montoNumerico: 1500 }
      ],
      saldoRestante: 12075 - 6500
    }
  ];

  const empenosFiltrados = empeños.filter((empeño) =>
    (
      empeño.nombre +
      empeño.descripcion +
      empeño.prestado +
      empeño.vencimiento
    )
      .toLowerCase()
      .includes(busqueda.toLowerCase())
  );

  const abrirPopup = (tipo, empeño) => {
    setEmpeñoSeleccionado(empeño);
    setPopupAbierto(tipo);
  };

  const cerrarPopup = () => {
    setPopupAbierto(null);
    setEmpeñoSeleccionado(null);
  };

  const getSaldoRestante = (empeño) => {
    return `$${empeño.saldoRestante.toLocaleString("en-US")}`;
  };

  const getTotalAbonado = (empeño) => {
    const total = empeño.totalPagarNumerico - empeño.saldoRestante;
    return `$${total.toLocaleString("en-US")}`;
  };

  // Obtener clase CSS y mensaje según el estado
  const getEstadoConfig = (estado) => {
    switch(estado) {
      case "PAGADO":
        return { clase: "estado-pagado", mensaje: "PAGADO" };
      case "EN TIENDA":
        return { clase: "estado-tienda", mensaje: "EN TIENDA" };
      case "VENCIDO":
        return { clase: "estado-vencido", mensaje: "VENCIDO" };
      case "PROXIMO A VENCER":
        return { clase: "estado-proximo", mensaje: "PROXIMO A VENCER" };
      default:
        return { clase: "estado-activo", mensaje: "ACTIVO" };
    }
  };

  return (
    <>
      <Navbar />
      <div className="me-dashboard">

        <section className="me-page-header">
          <h1 className="me-page-title">
            Administra y consulta tus prendas empeñadas
          </h1>

          <div className="me-search-container">
            <input
              type="text"
              placeholder="Buscar empeño..."
              className="me-search-input"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
            <span className="me-search-icon">🔍</span>
          </div>
        </section>

        <section className="me-empenos-list">
          {empenosFiltrados.length > 0 ? (
            empenosFiltrados.map((empeño) => {
              const estado = obtenerEstado(empeño);
              const estadoConfig = getEstadoConfig(estado);
              const vencido = estado === "VENCIDO";
              const enTienda = estado === "EN TIENDA";
              const pagado = estado === "PAGADO";
              
              return (
              <div key={empeño.id} className={`me-empeno-card ${estadoConfig.clase}`}>
                <div className="me-empeno-contenido-superior">
                  <div className="me-empeno-imagen-container">
                    <img
                      src={empeño.imagen}
                      alt={empeño.nombre}
                      className="me-empeno-imagen"
                    />
                  </div>

                  <div className="me-empeno-info">
                    <div className="me-empeno-header">
                      <h2 className="me-empeno-nombre">{empeño.nombre}</h2>
                      <span className={`me-badge ${estadoConfig.clase}`}>
                        {estadoConfig.mensaje}
                      </span>
                    </div>

                    {empeño.descripcion && (
                      <p className="me-empeno-descripcion">
                        {empeño.descripcion}
                      </p>
                    )}

                    <div className="me-empeno-detalles">
                      <div className="me-detalle-item">
                        <span className="me-detalle-label">Prestado:</span>
                        <span className="me-detalle-valor">
                          {empeño.prestado}
                        </span>
                      </div>

                      <div className="me-detalle-item">
                        <span className="me-detalle-label">
                          Total a pagar:
                        </span>
                        <span className={`me-detalle-valor me-total ${pagado ? 'pagado' : ''}`}>
                          {pagado ? "Pagado" : empeño.totalPagar}
                        </span>
                      </div>

                      {!pagado && !enTienda && (
                        <div className="me-detalle-item">
                          <span className="me-detalle-label">
                            Saldo restante:
                          </span>
                          <span className="me-detalle-valor me-saldo">
                            {getSaldoRestante(empeño)}
                          </span>
                        </div>
                      )}

                      <div className="me-detalle-item">
                        <span className="me-detalle-label">
                          Vencimiento:
                        </span>
                        <span className={`me-detalle-valor ${vencido ? 'fecha-vencida' : ''}`}>
                          {empeño.vencimiento}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="me-empeno-acciones">
                  {enTienda && (
                    <div className="me-mensaje-tienda">
                      Esta prenda no fue liquidada a tiempo y ya se encuentra disponible en tienda fisica.
                    </div>
                  )}
                  
                  {pagado && (
                    <div className="me-mensaje-pagado">
                      Prenda liquidada completamente. Gracias por tu pago.
                    </div>
                  )}
                  
                  {vencido && !pagado && !enTienda && (
                    <div className="me-mensaje-vencido">
                      Lo sentimos, has excedido el plazo para pagar. 
                      La prenda se pasara a venta en automatico.
                    </div>
                  )}
                  
                  <button 
                    className="me-btn-ver-detalles"
                    onClick={() => abrirPopup('detalles', empeño)}
                  >
                    Ver detalles
                  </button>
                </div>
              </div>
            )})
          ) : (
            <p className="me-sin-resultados">
              No se encontraron empeños
            </p>
          )}
        </section>
      </div>

      {/* POPUP DE DETALLES */}
      {popupAbierto === 'detalles' && empeñoSeleccionado && (
        <div className="popup-overlay" onClick={cerrarPopup}>
          <div className="popup-content popup-detalles" onClick={(e) => e.stopPropagation()}>
            <button className="popup-close" onClick={cerrarPopup}>×</button>
            
            <div className="popup-detalles-flex">
              <div className="popup-imagen-container-left">
                <img 
                  src={empeñoSeleccionado.imagen} 
                  alt={empeñoSeleccionado.nombre}
                  className="popup-imagen-left"
                />
                {empeñoSeleccionado.pagadoCompleto && (
                  <div className="popup-pagado-badge">PAGADO</div>
                )}
                {empeñoSeleccionado.enTienda && (
                  <div className="popup-tienda-badge">EN TIENDA</div>
                )}
                {!empeñoSeleccionado.pagadoCompleto && !empeñoSeleccionado.enTienda && estaVencido(empeñoSeleccionado.vencimiento) && (
                  <div className="popup-vencido-badge">VENCIDO</div>
                )}
              </div>
                  
              <div className="popup-info-right">
                <h3 className="detalle-titulo">{empeñoSeleccionado.nombre}</h3>              
                <p className="detalle-descripcion">{empeñoSeleccionado.descripcion}</p>                
                
                <div className="detalle-caracteristicas-vertical">
                  <p><strong>{empeñoSeleccionado.gramos}</strong></p>
                  <p><strong>Casa de empeño: {empeñoSeleccionado.casaEmpeño}</strong></p>
                </div>

                <div className="detalle-seccion resumen-financiero">
                  <h4>Resumen Financiero</h4>
                  <div className="detalle-financiero">
                    <div className="financiero-item">
                      <span>Monto prestado:</span>
                      <span className="valor-destacado">{empeñoSeleccionado.prestado}</span>
                    </div>
                    <div className="financiero-item">
                      <span>Tasa de interes:</span>
                      <span>{empeñoSeleccionado.tasaInteres}</span>
                    </div>
                    <div className="financiero-item">
                      <span>Intereses generados:</span>
                      <span>{empeñoSeleccionado.intereses}</span>
                    </div>
                    <div className="financiero-item total">
                      <span>Total a pagar:</span>
                      <span className="valor-destacado">{empeñoSeleccionado.totalPagar}</span>
                    </div>
                    
                    {!empeñoSeleccionado.pagadoCompleto && !empeñoSeleccionado.enTienda && (
                      <>
                        <div className="financiero-item abonado">
                          <span>Total abonado:</span>
                          <span className="valor-abonado">{getTotalAbonado(empeñoSeleccionado)}</span>
                        </div>
                        <div className="financiero-item pendiente">
                          <span>Saldo pendiente:</span>
                          <span className="valor-pendiente">{getSaldoRestante(empeñoSeleccionado)}</span>
                        </div>
                      </>
                    )}
                    
                    {empeñoSeleccionado.pagadoCompleto && (
                      <div className="financiero-item pagado-completo">
                        <span>Estado:</span>
                        <span className="valor-pagado">Pagado completamente</span>
                      </div>
                    )}
                    
                    {empeñoSeleccionado.enTienda && (
                      <div className="financiero-item en-tienda">
                        <span>Estado:</span>
                        <span className="valor-tienda">En tienda fisica - No liquidado</span>
                      </div>
                    )}
                    
                    <div className="financiero-item">
                      <span>Fecha de vencimiento:</span>
                      <span className={!empeñoSeleccionado.pagadoCompleto && !empeñoSeleccionado.enTienda && estaVencido(empeñoSeleccionado.vencimiento) ? 'texto-vencido' : ''}>
                        {empeñoSeleccionado.vencimiento}
                        {!empeñoSeleccionado.pagadoCompleto && !empeñoSeleccionado.enTienda && estaVencido(empeñoSeleccionado.vencimiento) && " (VENCIDO)"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="detalle-seccion historial-pagos">
                  <h4>Historial de Pagos Realizados</h4>
                  {empeñoSeleccionado.abonos.length > 0 ? (
                    <div className="tabla-historial">
                      <div className="historial-header">
                        <span>Fecha</span>
                        <span>Monto Abonado</span>
                        <span>Intereses Cubiertos</span>
                      </div>
                      {empeñoSeleccionado.abonos.map((abono, index) => (
                        <div key={index} className="historial-item">
                          <span className="historial-fecha">{abono.fecha}</span>
                          <span className="historial-monto">{abono.monto}</span>
                          <span className="historial-intereses">{abono.interesesPagados}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="sin-pagos">No se han registrado pagos aun</p>
                  )}
                  
                  {!empeñoSeleccionado.pagadoCompleto && !empeñoSeleccionado.enTienda && (
                    <div className="historial-total">
                      <span><strong>Total de abonos realizados:</strong></span>
                      <span className="total-abonado-valor">{getTotalAbonado(empeñoSeleccionado)}</span>
                    </div>
                  )}

                  {empeñoSeleccionado.pagadoCompleto && (
                    <div className="historial-item pagado-final">
                      <span>Pago total completado</span>
                      <span className="historial-fecha">{new Date().toLocaleDateString()}</span>
                    </div>
                  )}

                  {empeñoSeleccionado.enTienda && (
                    <div className="aviso-tienda">
                      <strong>ATENCION:</strong> Esta prenda no fue liquidada en el plazo establecido y ya se encuentra disponible para su venta en nuestra tienda fisica.
                    </div>
                  )}

                  {!empeñoSeleccionado.pagadoCompleto && !empeñoSeleccionado.enTienda && estaVencido(empeñoSeleccionado.vencimiento) && (
                    <div className="aviso-vencimiento">
                      <strong>ATENCION:</strong> Este prestamo ha vencido. La prenda sera transferida a venta automatica si no se liquida el saldo pendiente.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}