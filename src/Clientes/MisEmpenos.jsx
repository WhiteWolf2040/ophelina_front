import React, { useState } from "react";
import "./MisEmpenos.css";
import Navbar from "../ClientesNav/Navbar";
import { useMisEmpenos } from "../hooks/useMisEmpenos";

const PLACEHOLDER_IMAGE = "/placeholder.png";

// ✅ Formateo consistente con separador de miles, para que números grandes
// nunca se vean truncados o ambiguos (ej: $5,000,000.00, no "$5.00")
const formatMoney = (n) =>
  Number(n || 0).toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

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
  const [popupAbierto, setPopupAbierto] = useState(null);
  const [empeñoSeleccionado, setEmpeñoSeleccionado] = useState(null);
  const [montoPago, setMontoPago] = useState("");
  const [errorPago, setErrorPago] = useState(null);
  const [tipoAccion, setTipoAccion] = useState("abono");

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

  // ✅ Cálculo derivado una sola vez por render, reutilizado en todo el JSX.
  const montoNum = parseFloat(montoPago);
  const montoValido = !isNaN(montoNum) && montoNum > 0;
  const saldoMaximo = cotizacion?.saldo_pendiente_con_mora ?? null;
  const excedeSaldo = montoValido && saldoMaximo !== null && montoNum > saldoMaximo;

  const calcularRepartoAbono = (monto, cotizacionData) => {
    if (!monto || !cotizacionData || monto <= 0) return null;

    const deudaTotal = (cotizacionData.capital || 0) + (cotizacionData.interes || 0) + (cotizacionData.iva_interes || 0);
    if (deudaTotal <= 0) return null;

    const capitalPagado = Math.round(monto * (cotizacionData.capital / deudaTotal) * 100) / 100;
    const ivaPagado = Math.round(monto * (cotizacionData.iva_interes / deudaTotal) * 100) / 100;
    const interesPagado = Math.round((monto - capitalPagado - ivaPagado) * 100) / 100;

    return { ivaPagado, interesPagado, capitalPagado };
  };

  const repartoPreview = tipoAccion === "abono" && montoValido && cotizacion && !excedeSaldo
    ? calcularRepartoAbono(montoNum, cotizacion)
    : null;

  const procesarPago = async () => {
    if (!empeñoSeleccionado) return;

    if (tipoAccion === "abono") {
      const montoIngresado = parseFloat(montoPago.replace(/[^0-9.-]+/g, ""));

      if (isNaN(montoIngresado) || montoIngresado <= 0) {
        setErrorPago("Por favor ingresa un monto válido");
        return;
      }

      // ✅ Validación cliente-side, antes de golpear el backend.
      // (El backend igual lo valida en AbonoController::crearSesionPago,
      // esto solo evita el viaje redondo innecesario y da feedback inmediato)
      if (saldoMaximo !== null && montoIngresado > saldoMaximo) {
        setErrorPago(`El monto no puede exceder tu saldo pendiente de $${formatMoney(saldoMaximo)}`);
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

    if (tipoAccion === "refrendo") {
      try {
        setErrorPago(null);
        await iniciarAbono(empeñoSeleccionado.id, null, "refrendo");
      } catch (err) {
        console.error("Error al iniciar el refrendo:", err);
        setErrorPago(
          err.response?.data?.message || err.message || "Error al iniciar el refrendo, intenta de nuevo"
        );
      }
      return;
    }

    // prórroga
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
      setErrorPago(null); // limpia error previo mientras el usuario corrige
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

        {loading && (
          <p className="me-sin-resultados">Cargando tus empeños...</p>
        )}

        {error && !loading && (
          <div className="me-sin-resultados">
            <p>{error}</p>
            <button onClick={cargarEmpenos}>Reintentar</button>
          </div>
        )}

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
                          <span className="me-detalle-label">Total a pagar:</span>
                          <span className={`me-detalle-valor me-total ${empeño.pagadoCompleto ? 'pagado' : ''}`}>
                            {empeño.pagadoCompleto ? "Pagado" : empeño.totalPagar}
                          </span>
                        </div>

                        <div className="me-detalle-item">
                          <span className="me-detalle-label">Vencimiento:</span>
                          <span className="me-detalle-valor">
                            {empeño.vencimiento || "N/A"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

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
                        <div className="me-btn-pagado">✓ Pagado</div>
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
              <p className="me-sin-resultados">No se encontraron empeños</p>
            )}
          </section>
        )}
      </div>

      {/* POPUP DE PAGO (ABONO, REFRENDO o PRÓRROGA) */}
      {popupAbierto === 'pagar' && empeñoSeleccionado && (
        <div className="popup-overlay" onClick={cerrarPopup}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <button className="popup-close" onClick={cerrarPopup}>×</button>

            <div className="popup-header">
              <h2>Realizar pago</h2>
              <h3>{empeñoSeleccionado.nombre}</h3>
            </div>

            <div className="popup-body">
              <div className="pago-tabs" role="tablist">
                <button
                  type="button"
                  className={`pago-tab ${tipoAccion === "abono" ? "activo" : ""}`}
                  onClick={() => { setTipoAccion("abono"); setErrorPago(null); }}
                >
                  Abonar
                </button>

                {/* ✅ Solo se muestra si el empeño admite refrendo (plazo > 1 mes y no vencido) */}
                {cotizacion?.aplica_refrendo && (
                  <button
                    type="button"
                    className={`pago-tab ${tipoAccion === "refrendo" ? "activo" : ""}`}
                    onClick={() => { setTipoAccion("refrendo"); setErrorPago(null); }}
                  >
                    Refrendo mensual
                  </button>
                )}

                <button
                  type="button"
                  className={`pago-tab ${tipoAccion === "prorroga" ? "activo" : ""}`}
                  onClick={() => { setTipoAccion("prorroga"); setErrorPago(null); }}
                >
                  Prorrogar 30 días
                </button>
              </div>

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
                    <span className="pago-valor">${formatMoney(cotizacion.capital)}</span>
                  </div>
                  <div className="pago-item">
                    <span className="pago-label">Interés:</span>
                    <span className="pago-valor">${formatMoney(cotizacion.interes)}</span>
                  </div>
                  {cotizacion.mora > 0 && (
                    <div className="pago-item pago-item-mora">
                      <span className="pago-label">
                        Mora ({cotizacion.dias_atraso} {cotizacion.dias_atraso === 1 ? 'día' : 'días'} de atraso):
                      </span>
                      <span className="pago-valor pago-valor-mora">${formatMoney(cotizacion.mora)}</span>
                    </div>
                  )}
                  <div className="pago-item">
                    <span className="pago-label">IVA (16% sobre interés):</span>
                    <span className="pago-valor">${formatMoney(cotizacion.iva_interes)}</span>
                  </div>
                  <div className="pago-item pago-item-total">
                    <span className="pago-label">
                      {tipoAccion === "abono" ? "Saldo pendiente" : "Vencimiento actual"}:
                    </span>
                    <span className="pago-valor">
                      {tipoAccion === "abono"
                        ? `$${formatMoney(cotizacion.saldo_pendiente_con_mora)}`
                        : cotizacion.fecha_vencimiento_actual}
                    </span>
                  </div>
                </div>
              )}

              {/* ✅ 3 vías reales, ya no anidado dentro del bloque de abono */}
              {tipoAccion === "abono" ? (
                <div className="pago-input-group">
                  <label>Monto a abonar:</label>
                  <input
                    type="text"
                    inputMode="decimal"
                    className={`pago-input ${excedeSaldo ? 'pago-input-error' : ''}`}
                    placeholder="Ingresa el monto del abono"
                    value={montoPago}
                    onChange={handleMontoChange}
                  />

                  {/* ✅ Aviso inmediato si el monto excede el saldo real */}
                  {excedeSaldo && (
                    <small className="pago-error" style={{ color: "#c0392b", display: "block", marginTop: "6px" }}>
                      El monto máximo que puedes abonar es ${formatMoney(saldoMaximo)} (tu saldo pendiente).
                    </small>
                  )}

                  {repartoPreview ? (
                    <>
                      <div className="pago-reparto-preview">
                        <p className="pago-reparto-titulo">
                          Así se aplicará tu abono de ${formatMoney(montoNum)}:
                        </p>
                        {(repartoPreview.interesPagado > 0 || repartoPreview.ivaPagado > 0) && (
                          <div className="pago-reparto-fila">
                            <span>Interés + IVA del periodo:</span>
                            <span>${formatMoney(repartoPreview.interesPagado + repartoPreview.ivaPagado)}</span>
                          </div>
                        )}
                        <div className="pago-reparto-fila pago-reparto-destacado">
                          <span>Reduce tu deuda (capital):</span>
                          <span>${formatMoney(repartoPreview.capitalPagado)}</span>
                        </div>
                        <small className="pago-reparto-nota">
                          Tu abono se reparte proporcionalmente entre capital e
                          interés + IVA, según cuánto representa cada uno de tu
                          deuda total — así siempre bajas tu capital, sin importar
                          el monto que abones.
                        </small>
                      </div>
                      <small className="pago-ayuda">
                        Tu saldo total pendiente bajará ${formatMoney(montoNum)} pesos completos,
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
              ) : tipoAccion === "refrendo" ? (
                <div className="pago-input-group">
                  <small className="pago-ayuda">
                    El refrendo cubre el interés{cotizacion?.mora > 0 ? " + la mora" : ""} de
                    este mes, más IVA
                    {cotizacion ? (
                      <> — un total de <strong>${formatMoney(cotizacion.monto_refrendo)}</strong></>
                    ) : null}
                    —, y <strong>mantiene vivo tu préstamo sin mover tu fecha de vencimiento</strong>.
                    No abona capital.
                  </small>
                </div>
              ) : (
                <div className="pago-input-group">
                  <small className="pago-ayuda">
                    La prórroga cobra el interés{cotizacion?.mora > 0 ? " + la mora" : ""} de tu
                    cuota actual, más IVA
                    {cotizacion ? (
                      <> — un total de <strong>${formatMoney(cotizacion.monto_prorroga)}</strong></>
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
                disabled={redirigiendoPago || (tipoAccion === "abono" && excedeSaldo)}
              >
                {redirigiendoPago
                  ? "Redirigiendo..."
                  : tipoAccion === "abono"
                    ? "Confirmar Abono"
                    : tipoAccion === "refrendo"
                      ? "Confirmar Refrendo"
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
                      <span>
                        Intereses ({empeñoSeleccionado.tasaPorcentaje ?? '—'}% a {empeñoSeleccionado.plazoMeses}{' '}
                        {empeñoSeleccionado.plazoMeses === 1 ? 'mes' : 'meses'}):
                      </span>
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