import React, { useState } from "react";
import "./MisEmpenos.css";
import Navbar from "../ClientesNav/Navbar";
import { useMisEmpenos } from "../hooks/useMisEmpenos";

const PLACEHOLDER_IMAGE = "/placeholder.png";

export default function MisEmpenos() {
  const {
    empenos,
    loading,
    error,
    redirigiendoPago,
    cargarEmpenos,
    iniciarAbono,
  } = useMisEmpenos();

  const [busqueda, setBusqueda] = useState("");
  const [popupAbierto, setPopupAbierto] = useState(null); // 'pagar', 'detalles', o null
  const [empeñoSeleccionado, setEmpeñoSeleccionado] = useState(null);
  const [montoPago, setMontoPago] = useState("");
  const [errorPago, setErrorPago] = useState(null);

  // FILTRO DEL BUSCADOR (ya sobre datos reales)
  const empenosFiltrados = empenos.filter((empeño) =>
    (
      (empeño.nombre || "") +
      (empeño.descripcion || "") +
      (empeño.prestado || "") +
      (empeño.vencimiento || "")
    )
      .toLowerCase()
      .includes(busqueda.toLowerCase())
  );

  const abrirPopup = (tipo, empeño) => {
    setEmpeñoSeleccionado(empeño);
    setPopupAbierto(tipo);
    setMontoPago("");
    setErrorPago(null);
  };

  const cerrarPopup = () => {
    setPopupAbierto(null);
    setEmpeñoSeleccionado(null);
    setMontoPago("");
    setErrorPago(null);
  };

  // Procesa el abono: crea la sesión de Stripe y redirige al checkout real
  const procesarPago = async () => {
    if (!empeñoSeleccionado) return;

    const montoIngresado = parseFloat(montoPago.replace(/[^0-9.-]+/g, ""));

    if (isNaN(montoIngresado) || montoIngresado <= 0) {
      setErrorPago("Por favor ingresa un monto válido");
      return;
    }

    try {
      setErrorPago(null);
      // Redirige a Stripe Checkout; al volver, el webhook ya habrá
      // registrado el abono si el pago se completó.
      await iniciarAbono(empeñoSeleccionado.id, montoIngresado);
    } catch (err) {
      console.error("Error al iniciar el abono:", err);
      setErrorPago(
        err.response?.data?.message || err.message || "Error al iniciar el pago, intenta de nuevo"
      );
    }
  };

  const handleMontoChange = (e) => {
    const valor = e.target.value;
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

        {/* LOADING */}
        {loading && (
          <p className="me-sin-resultados">Cargando tus empeños...</p>
        )}

        {/* ERROR */}
        {error && !loading && (
          <div className="me-sin-resultados">
            <p>{error}</p>
            <button onClick={cargarEmpenos}>Reintentar</button>
          </div>
        )}

        {/* Lista */}
        {!loading && !error && (
          <section className="me-empenos-list">
            {empenosFiltrados.length > 0 ? (
              empenosFiltrados.map((empeño) => (
                <div key={empeño.id} className="me-empeno-card">
                  <div className="me-empeno-contenido-superior">
                    <div className="me-empeno-imagen-container">
                      <img
                        src={empeño.imagen || PLACEHOLDER_IMAGE}
                        alt={empeño.nombre}
                        className="me-empeno-imagen"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = PLACEHOLDER_IMAGE;
                        }}
                      />
                      {empeño.pagadoCompleto && (
                        <div className="me-empeno-pagado-badge">✓ PAGADO</div>
                      )}
                      {!empeño.pagadoCompleto && empeño.estado === 'VENCIDO' && (
                        <div className="me-empeno-vencido-badge">⚠ VENCIDO</div>
                      )}
                      {!empeño.pagadoCompleto && empeño.estado !== 'VENCIDO' && empeño.proximoAVencer && (
                        <div className="me-empeno-porvencer-badge">⏳ POR VENCER</div>
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
                          <span className={`me-detalle-valor me-total ${empeño.pagadoCompleto ? 'pagado' : ''}`}>
                            {empeño.pagadoCompleto ? "Pagado" : empeño.totalPagar}
                          </span>
                        </div>

                        <div className="me-detalle-item">
                          <span className="me-detalle-label">
                            Vencimiento:
                          </span>
                          <span className="me-detalle-valor">
                            {empeño.vencimiento || "N/A"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* ACCIONES CON BOTONES CONDICIONALES */}
                  <div className="me-empeno-acciones">
                    {!empeño.pagadoCompleto ? (
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
        )}
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
                  <span className="pago-label">Saldo restante:</span>
                  <span className="pago-valor">{empeñoSeleccionado.saldoRestante}</span>
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
                  Puedes abonar cualquier monto hasta el saldo restante. Se te
                  redirigirá a la pasarela de pago segura para completar el abono.
                </small>
                {errorPago && (
                  <small className="pago-error" style={{ color: "#c0392b", display: "block", marginTop: "6px" }}>
                    {errorPago}
                  </small>
                )}
              </div>

              <div className="pago-metodos">
                <h4>Método de pago</h4>
                <div className="metodo-opcion">
                  <input type="radio" name="metodo" id="tarjeta" defaultChecked />
                  <label htmlFor="tarjeta">Tarjeta de crédito/débito</label>
                </div>
              </div>
            </div>

            <div className="popup-footer">
              <button
                className="pago-confirmar-btn"
                onClick={procesarPago}
                disabled={redirigiendoPago}
              >
                {redirigiendoPago ? "Redirigiendo..." : "Confirmar Abono"}
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
                  src={empeñoSeleccionado.imagen || PLACEHOLDER_IMAGE}
                  alt={empeñoSeleccionado.nombre}
                  className="popup-imagen-left"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = PLACEHOLDER_IMAGE;
                  }}
                />
                {empeñoSeleccionado.pagadoCompleto && (
                  <div className="popup-pagado-badge">✓ PAGADO</div>
                )}
              </div>

              <div className="popup-info-right">
                <h3 className="detalle-titulo">{empeñoSeleccionado.nombre}</h3>
                <p className="detalle-descripcion">{empeñoSeleccionado.descripcion}</p>

                <div className="detalle-caracteristicas-vertical">
                  {empeñoSeleccionado.gramos && (
                    <p><strong>{empeñoSeleccionado.gramos}</strong></p>
                  )}
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
                    <div className="financiero-item">
                      <span>Total abonado:</span>
                      <span>{empeñoSeleccionado.totalAbonado}</span>
                    </div>
                    <div className={`financiero-item total ${empeñoSeleccionado.pagadoCompleto ? 'pagado' : ''}`}>
                      <span>Total a pagar:</span>
                      <span>{empeñoSeleccionado.pagadoCompleto ? "Pagado" : empeñoSeleccionado.totalPagar}</span>
                    </div>
                  </div>
                </div>

                <div className="detalle-seccion">
                  <h4>Historial de Pagos</h4>
                  {empeñoSeleccionado.abonos && empeñoSeleccionado.abonos.length > 0 ? (
                    empeñoSeleccionado.abonos.map((abono, index) => (
                      <div key={index} className="historial-item">
                        <span>Abono: {abono.monto}</span>
                        <span className="historial-intereses">
                          Intereses: {abono.interesesPagados}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p>Aún no hay abonos registrados.</p>
                  )}
                  {empeñoSeleccionado.pagadoCompleto && (
                    <div className="historial-item pagado-final">
                      <span>Pago total realizado</span>
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