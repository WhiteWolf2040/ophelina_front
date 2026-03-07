import React, { useState } from "react";
import "./MisEmpenos.css";
import Navbar from "../ClientesNav/Navbar";

import anillo_oro from "../assets/anillo_oro.jpg";
import collar_plata from "../assets/collar_plata.jpg";
import arete_diamante from "../assets/arete_diamante.jpg";

export default function MisEmpenos() {
  const [busqueda, setBusqueda] = useState("");
  const [popupAbierto, setPopupAbierto] = useState(null); // 'pagar', 'detalles', o null
  const [empeñoSeleccionado, setEmpeñoSeleccionado] = useState(null);
  const [empeñosPagados, setEmpeñosPagados] = useState({}); // Estado para tracking de pagos completos
  const [montoPago, setMontoPago] = useState(""); // Estado para el monto a pagar

  // Tipos de prendas
  const tiposPrenda = [
    {
      nombre: "Anillo de Oro 14k",
      imagen: anillo_oro
    },
    {
      nombre: "Collar de Plata",
      imagen: collar_plata
    },
    {
      nombre: "Aretes de Diamante",
      imagen: arete_diamante
    }
  ];

  // Generar empeños
  const generarEmpeños = () => {
    const empeños = [];

    const descripciones = [
      "Anillo de oro amarillo con diamante central",
      "Diseño clásico y elegante",
      "Con detalles artesanales",
      "Estilo moderno",
      "Pieza única",
      "Con grabados especiales"
    ];

    const preciosBase = [
      8500, 12500, 3200, 7800, 6200,
      4500, 9300, 11000, 2800, 8900,
      7500, 5200, 10500
    ];

    for (let i = 0; i < 15; i++) {
      const tipoIndex = i % 3;
      const precioBase = preciosBase[i % preciosBase.length];
      const interes = precioBase * 0.15;

      empeños.push({
        id: i + 1,
        nombre: tiposPrenda[tipoIndex].nombre,
        descripcion: descripciones[i % descripciones.length],
        prestado: `$${precioBase.toLocaleString("en-US")}`,
        prestadoNumerico: precioBase,
        totalPagar: `$${(precioBase + interes).toLocaleString("en-US")}`,
        totalPagarNumerico: precioBase + interes,
        vencimiento: `${Math.floor(Math.random() * 28) + 1}/${
          Math.floor(Math.random() * 12) + 1
        }/2026`,
        imagen: tiposPrenda[tipoIndex].imagen,
        gramos: "5.2 gramos",
        casaEmpeño: "JSK",
        intereses: `$${interes.toLocaleString("en-US")}`,
        abonos: [
          { fecha: "15/01/2026", monto: "$1,400.00" },
          { fecha: "01/01/2026", monto: "$2,000.00" }
        ]
      });
    }

    return empeños;
  };

  const empeños = generarEmpeños();

  // FILTRO DEL BUSCADOR
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

  // Función para abrir popup
  const abrirPopup = (tipo, empeño) => {
    setEmpeñoSeleccionado(empeño);
    setPopupAbierto(tipo);
    setMontoPago(""); // Resetear el monto al abrir el popup
  };

  // Función para cerrar popup
  const cerrarPopup = () => {
    setPopupAbierto(null);
    setEmpeñoSeleccionado(null);
    setMontoPago("");
  };

  // Función para procesar el pago (abono)
  const procesarPago = () => {
    if (empeñoSeleccionado) {
      // Convertir el monto ingresado a número
      const montoIngresado = parseFloat(montoPago.replace(/[^0-9.-]+/g, ""));
      
      // Verificar si el monto es válido
      if (isNaN(montoIngresado) || montoIngresado <= 0) {
        alert("Por favor ingresa un monto válido");
        return;
      }

      // Aquí puedes agregar la lógica para registrar el abono
      // Por ahora, solo simulamos que el pago se procesó
      
      alert(`¡Abono de $${montoIngresado.toLocaleString("en-US")} realizado con éxito!`);
      cerrarPopup();
      
      // NOTA: El estado "PAGADO" solo debería activarse cuando el usuario
      // haya completado todos los pagos. Como es una simulación, 
      // no activamos automáticamente el estado pagado.
    }
  };

  // Función para formatear el monto mientras el usuario escribe
  const handleMontoChange = (e) => {
    const valor = e.target.value;
    // Permitir solo números y un punto decimal
    if (valor === "" || /^\d*\.?\d*$/.test(valor)) {
      setMontoPago(valor);
    }
  };

  return (
    <>
      <Navbar />
      <div className="me-dashboard">

        {/* Header */}
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

        {/* Lista */}
        <section className="me-empenos-list">
          {empenosFiltrados.length > 0 ? (
            empenosFiltrados.map((empeño) => (
              <div key={empeño.id} className="me-empeno-card">
                <div className="me-empeno-contenido-superior">
                  <div className="me-empeno-imagen-container">
                    <img
                      src={empeño.imagen}
                      alt={empeño.nombre}
                      className="me-empeno-imagen"
                    />
                    {empeñosPagados[empeño.id] && (
                      <div className="me-empeno-pagado-badge">✓ PAGADO</div>
                    )}
                  </div>

                  <div className="me-empeno-info">
                    <h2 className="me-empeno-nombre">{empeño.nombre}</h2>

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
                        <span className={`me-detalle-valor me-total ${empeñosPagados[empeño.id] ? 'pagado' : ''}`}>
                          {empeñosPagados[empeño.id] ? "Pagado" : empeño.totalPagar}
                        </span>
                      </div>

                      <div className="me-detalle-item">
                        <span className="me-detalle-label">
                          Vencimiento:
                        </span>
                        <span className="me-detalle-valor">
                          {empeño.vencimiento}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ACCIONES CON BOTONES CONDICIONALES */}
                <div className="me-empeno-acciones">
                  {!empeñosPagados[empeño.id] ? (
                    <>
                      <button 
                        className="me-btn-pagar"
                        onClick={() => abrirPopup('pagar', empeño)}
                      >
                        Abonar
                      </button>
                      <button 
                        className="me-btn-ver-detalles"
                        onClick={() => abrirPopup('detalles', empeño)}
                      >
                        Ver detalles
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="me-btn-pagado">
                        ✓ Pagado
                      </div>
                      <button 
                        className="me-btn-ver-detalles"
                        onClick={() => abrirPopup('detalles', empeño)}
                      >
                        Ver detalles
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="me-sin-resultados">
              No se encontraron empeños
            </p>
          )}
        </section>
      </div>

      {/* POPUP DE PAGO (ABONO) */}
      {popupAbierto === 'pagar' && empeñoSeleccionado && (
        <div className="popup-overlay" onClick={cerrarPopup}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <button className="popup-close" onClick={cerrarPopup}>×</button>
            
            <div className="popup-header">
              <h2>Realizar Abono</h2>
              <h3>{empeñoSeleccionado.nombre}</h3>
            </div>

            <div className="popup-body">
              <div className="pago-detalles">
                <div className="pago-item">
                  <span className="pago-label">Total a pagar:</span>
                  <span className="pago-valor">{empeñoSeleccionado.totalPagar}</span>
                </div>
                <div className="pago-item">
                  <span className="pago-label">Vencimiento:</span>
                  <span className="pago-valor">{empeñoSeleccionado.vencimiento}</span>
                </div>
              </div>

              <div className="pago-input-group">
                <label>Monto a abonar:</label>
                <input 
                  type="text" 
                  className="pago-input"
                  placeholder="Ingresa el monto del abono"
                  value={montoPago}
                  onChange={handleMontoChange}
                />
                <small className="pago-ayuda">
                  Puedes abonar cualquier monto. El préstamo se marcará como pagado cuando completes el total.
                </small>
              </div>

              <div className="pago-metodos">
                <h4>Método de pago</h4>
                <div className="metodo-opcion">
                  <input type="radio" name="metodo" id="tarjeta" defaultChecked />
                  <label htmlFor="tarjeta">Tarjeta de crédito/débito</label>
                </div>
                <div className="metodo-opcion">
                  <input type="radio" name="metodo" id="efectivo" />
                  <label htmlFor="efectivo">Efectivo (en tienda)</label>
                </div>
                <div className="metodo-opcion">
                  <input type="radio" name="metodo" id="transferencia" />
                  <label htmlFor="transferencia">Transferencia bancaria</label>
                </div>
              </div>
            </div>

            <div className="popup-footer">
              <button className="pago-confirmar-btn" onClick={procesarPago}>
                Confirmar Abono
              </button>
            </div>
          </div>
        </div>
      )}

      {/* POPUP DE DETALLES */}
      {popupAbierto === 'detalles' && empeñoSeleccionado && (
        <div className="popup-overlay" onClick={cerrarPopup}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <button className="popup-close" onClick={cerrarPopup}>×</button>
            
            <div className="popup-detalles-flex">
              <div className="popup-imagen-container-left">
                <img 
                  src={empeñoSeleccionado.imagen} 
                  alt={empeñoSeleccionado.nombre}
                  className="popup-imagen-left"
                />
                {empeñosPagados[empeñoSeleccionado.id] && (
                  <div className="popup-pagado-badge">✓ PAGADO</div>
                )}
              </div>
                  
              <div className="popup-info-right">
                <h3 className="detalle-titulo">{empeñoSeleccionado.nombre}</h3>              
                <p className="detalle-descripcion">{empeñoSeleccionado.descripcion}</p>                
                
                <div className="detalle-caracteristicas-vertical">
                  <p><strong>{empeñoSeleccionado.gramos}</strong></p>
                  <p><strong>Casa de empeño: {empeñoSeleccionado.casaEmpeño}</strong></p>
                </div>

                <div className="detalle-seccion">
                  <h4>Información Financiera</h4>
                  <div className="detalle-financiero">
                    <div className="financiero-item">
                      <span>Monto prestado:</span>
                      <span>{empeñoSeleccionado.prestado}</span>
                    </div>
                    <div className="financiero-item">
                      <span>Intereses:</span>
                      <span>{empeñoSeleccionado.intereses}</span>
                    </div>
                    <div className={`financiero-item total ${empeñosPagados[empeñoSeleccionado.id] ? 'pagado' : ''}`}>
                      <span>Total a pagar:</span>
                      <span>{empeñosPagados[empeñoSeleccionado.id] ? "Pagado" : empeñoSeleccionado.totalPagar}</span>
                    </div>
                  </div>
                </div>

                <div className="detalle-seccion">
                  <h4>Historial de Pagos</h4>
                  {empeñoSeleccionado.abonos.map((abono, index) => (
                    <div key={index} className="historial-item">
                      <span>Abono: {abono.monto}</span>
                      <span className="historial-intereses">Intereses: $2,000.00</span>
                    </div>
                  ))}
                  {empeñosPagados[empeñoSeleccionado.id] && (
                    <div className="historial-item pagado-final">
                      <span>Pago total realizado</span>
                      <span className="historial-fecha">{new Date().toLocaleDateString()}</span>
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