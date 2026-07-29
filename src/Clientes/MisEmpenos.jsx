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
    cotizacion,
    cargandoCotizacion,
    errorCotizacion,
    cargarCotizacion,
  } = useMisEmpenos();

  const [busqueda, setBusqueda] = useState("");
  const [popupAbierto, setPopupAbierto] = useState(null); // 'pagar', 'detalles', o null
  const [empeñoSeleccionado, setEmpeñoSeleccionado] = useState(null);
  const [montoPago, setMontoPago] = useState("");
  const [errorPago, setErrorPago] = useState(null);

  // qué acción está eligiendo el cliente dentro del popup de pago
  const [tipoAccion, setTipoAccion] = useState("abono"); // 'abono' | 'prorroga'

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
    setTipoAccion("abono");

    // al abrir el popup de pago, se pide el desglose real
    // (capital/interés/mora/IVA) para mostrarlo antes de que el cliente pague.
    if (tipo === 'pagar') {
      cargarCotizacion(empeño.id);
    }
  };

  const cerrarPopup = () => {
    setPopupAbierto(null);
    setEmpeñoSeleccionado(null);
    setMontoPago("");
    setErrorPago(null);
    setTipoAccion("abono");
  };

  // Procesa el pago: crea la sesión de Stripe y redirige al checkout real.
  // Si tipoAccion === 'prorroga', el backend ignora el monto (cobra
  // intereses + IVA automáticamente) y extiende el vencimiento 30 días.
  const procesarPago = async () => {
    if (!empeñoSeleccionado) return;

    if (tipoAccion === "abono") {
      const montoIngresado = parseFloat(montoPago.replace(/[^0-9.-]+/g, ""));

      if (isNaN(montoIngresado) || montoIngresado <= 0) {
        setErrorPago("Por favor ingresa un monto válido");
        return;
      }

      try {
        setErrorPago(null);
        await iniciarAbono(empeñoSeleccionado.id, montoIngresado, "abono");
      } catch (err) {
        console.error("Error al iniciar el abono:", err);
        setErrorPago(
          err.response?.data?.message || err.message || "Error al iniciar el pago, intenta de nuevo"
        );
      }
      return;
    }

    // tipoAccion === 'prorroga': no se manda monto, el backend lo calcula.
    try {
      setErrorPago(null);
      await iniciarAbono(empeñoSeleccionado.id, null, "prorroga");
    } catch (err) {
      console.error("Error al iniciar la prórroga:", err);
      setErrorPago(
        err.response?.data?.message || err.message || "Error al iniciar la prórroga, intenta de nuevo"
      );
    }
  };

  const handleMontoChange = (e) => {
    const valor = e.target.value;
    if (valor === "" || /^\d*\.?\d*$/.test(valor)) {
      setMontoPago(valor);
    }
  };

  // ✅ Reparto en vivo, Opción C: IVA + interés primero (hasta donde alcance
  // el abono), el sobrante -si lo hay- reduce el capital. Mismo orden que
  // ahora aplica el backend (StripeWebhookController y PagoController).
  const calcularRepartoAbono = (monto, cotizacionData) => {
    if (!monto || !cotizacionData || monto <= 0) return null;

    let restante = monto;

    const ivaPagado = Math.min(restante, cotizacionData.iva_interes);
    restante = Math.max(0, restante - ivaPagado);

    const interesPagado = Math.min(restante, cotizacionData.interes);
    restante = Math.max(0, restante - interesPagado);

    const capitalPagado = Math.min(restante, cotizacionData.capital);

    return { ivaPagado, interesPagado, capitalPagado };
  };

  // ✅ Se calcula una sola vez por render y se reutiliza en todo el bloque
  // del input, en vez de recalcular montoNum en cada lugar donde se usa.
  const montoNum = parseFloat(montoPago);
  const montoValido = !isNaN(montoNum) && montoNum > 0;
  const repartoPreview = montoValido && cotizacion
    ? calcularRepartoAbono(montoNum, cotizacion)
    : null;

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
                        loading="lazy"
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
                          Abonar / Prorrogar
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

      {/* POPUP DE PAGO (ABONO o PRÓRROGA) */}
      {popupAbierto === 'pagar' && empeñoSeleccionado && (
        <div className="popup-overlay" onClick={cerrarPopup}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <button className="popup-close" onClick={cerrarPopup}>×</button>

            <div className="popup-header">
              <h2>Realizar pago</h2>
              <h3>{empeñoSeleccionado.nombre}</h3>
            </div>

            <div className="popup-body">

              {/* Selector Abonar vs Prorrogar */}
              <div className="pago-tabs" role="tablist">
                <button
                  type="button"
                  className={`pago-tab ${tipoAccion === "abono" ? "activo" : ""}`}
                  onClick={() => { setTipoAccion("abono"); setErrorPago(null); }}
                >
                  Abonar
                </button>
                <button
                  type="button"
                  className={`pago-tab ${tipoAccion === "prorroga" ? "activo" : ""}`}
                  onClick={() => { setTipoAccion("prorroga"); setErrorPago(null); }}
                >
                  Prorrogar 30 días
                </button>
              </div>

              {/* Desglose real de capital / interés / mora / IVA */}
              {cargandoCotizacion && (
                <p className="pago-cotizacion-cargando">Calculando lo que debes...</p>
              )}

              {errorCotizacion && !cargandoCotizacion && (
                <small className="pago-error" style={{ color: "#c0392b", display: "block", marginBottom: "12px" }}>
                  {errorCotizacion}
                </small>
              )}

              {cotizacion && !cargandoCotizacion && (
                <div className="pago-detalles pago-desglose">
                  <div className="pago-item">
                    <span className="pago-label">Capital:</span>
                    <span className="pago-valor">${cotizacion.capital.toFixed(2)}</span>
                  </div>
                  <div className="pago-item">
                    <span className="pago-label">Interés:</span>
                    <span className="pago-valor">${cotizacion.interes.toFixed(2)}</span>
                  </div>
                  {cotizacion.mora > 0 && (
                    <div className="pago-item pago-item-mora">
                      <span className="pago-label">
                        Mora ({cotizacion.dias_atraso} {cotizacion.dias_atraso === 1 ? 'día' : 'días'} de atraso):
                      </span>
                      <span className="pago-valor pago-valor-mora">${cotizacion.mora.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="pago-item">
                    <span className="pago-label">IVA (16% sobre interés):</span>
                    <span className="pago-valor">${cotizacion.iva_interes.toFixed(2)}</span>
                  </div>
                  <div className="pago-item pago-item-total">
                    <span className="pago-label">
                      {tipoAccion === "abono" ? "Saldo pendiente" : "Vencimiento actual"}:
                    </span>
                    <span className="pago-valor">
                      {tipoAccion === "abono"
                        ? `$${cotizacion.saldo_pendiente_con_mora.toFixed(2)}`
                        : cotizacion.fecha_vencimiento_actual}
                    </span>
                  </div>
                </div>
              )}

              {tipoAccion === "abono" ? (
                <div className="pago-input-group">
                  <label>Monto a abonar:</label>
                  <input
                    type="text"
                    className="pago-input"
                    placeholder="Ingresa el monto del abono"
                    value={montoPago}
                    onChange={handleMontoChange}
                  />

                  {/* ✅ Vista previa del reparto, se actualiza en vivo */}
                  {repartoPreview ? (
                    <>
                      <div className="pago-reparto-preview">
                        <p className="pago-reparto-titulo">
                          Así se aplicará tu abono de ${montoNum.toFixed(2)}:
                        </p>
                        {(repartoPreview.interesPagado > 0 || repartoPreview.ivaPagado > 0) && (
                          <div className="pago-reparto-fila">
                            <span>Interés + IVA del periodo:</span>
                            <span>${(repartoPreview.interesPagado + repartoPreview.ivaPagado).toFixed(2)}</span>
                          </div>
                        )}
                        <div className="pago-reparto-fila pago-reparto-destacado">
                          <span>Reduce tu deuda (capital):</span>
                          <span>${repartoPreview.capitalPagado.toFixed(2)}</span>
                        </div>
                        <small className="pago-reparto-nota">
                          El interés y el IVA son el costo del préstamo por el periodo ya
                          transcurrido, se cobran primero. El resto de tu abono
                          reduce directamente lo que debes.
                        </small>
                      </div>
                      <small className="pago-ayuda">
                        Tu saldo total pendiente bajará ${montoNum.toFixed(2)} pesos completos,
                        sin importar cómo se reparta arriba.
                      </small>
                    </>
                  ) : (
                    <small className="pago-ayuda">
                      Puedes abonar cualquier monto hasta el saldo restante
                      {cotizacion?.mora > 0 ? " (ya incluye la mora acumulada)" : ""}. El abono
                      reduce tu deuda pero <strong>no mueve tu fecha de vencimiento</strong>.
                      Se te redirigirá a la pasarela de pago segura para completarlo.
                    </small>
                  )}
                </div>
              ) : (
                <div className="pago-input-group">
                  <small className="pago-ayuda">
                    La prórroga cobra el interés{cotizacion?.mora > 0 ? " + la mora" : ""} de tu
                    cuota actual, más IVA
                    {cotizacion ? (
                      <> — un total de <strong>${cotizacion.monto_prorroga.toFixed(2)}</strong></>
                    ) : null}
                    —, y <strong>extiende tu fecha de vencimiento 30 días</strong>. No abona capital.
                  </small>
                </div>
              )}

              {errorPago && (
                <small className="pago-error" style={{ color: "#c0392b", display: "block", marginTop: "6px" }}>
                  {errorPago}
                </small>
              )}

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
                {redirigiendoPago
                  ? "Redirigiendo..."
                  : tipoAccion === "abono"
                    ? "Confirmar Abono"
                    : "Confirmar Prórroga"}
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
                      <span>Saldo pendiente (capital):</span>
                      <span>{empeñoSeleccionado.saldoRestante}</span>
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