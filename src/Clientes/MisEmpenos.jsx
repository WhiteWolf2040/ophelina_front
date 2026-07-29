import React, { useState } from "react";
import "./MisEmpenos.css";
import Navbar from "../ClientesNav/Navbar";
import { useMisEmpenos } from "../hooks/useMisEmpenos";

const PLACEHOLDER_IMAGE = "/placeholder.png";

// ✅ Formateo consistente con separador de miles
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

  const montoNum = parseFloat(montoPago);
  const montoValido = !isNaN(montoNum) && montoNum > 0;
  const saldoMaximo = cotizacion?.saldo_pendiente_con_mora ?? null;
  const excedeSaldo = montoValido && saldoMaximo !== null && montoNum > saldoMaximo;

  // ✅ FUNCIÓN CORREGIDA - Calcula el reparto del abono
  const calcularRepartoAbono = (monto, cotizacionData) => {
    if (!monto || !cotizacionData || monto <= 0) return null;

    const capital = cotizacionData.capital || 0;
    const interes = cotizacionData.interes || 0;
    const ivaInteres = cotizacionData.iva_interes || 0;
    const deudaTotal = capital + interes + ivaInteres;

    if (deudaTotal <= 0) return null;

    // ✅ Calcular el porcentaje que representa el abono sobre la deuda total
    const porcentajeAbono = monto / deudaTotal;

    // ✅ Aplicar el mismo porcentaje a cada componente
    let capitalPagado = capital * porcentajeAbono;
    let interesPagado = interes * porcentajeAbono;
    let ivaPagado = ivaInteres * porcentajeAbono;

    // ✅ Redondear a 2 decimales
    capitalPagado = Math.round(capitalPagado * 100) / 100;
    interesPagado = Math.round(interesPagado * 100) / 100;
    ivaPagado = Math.round(ivaPagado * 100) / 100;

    // ✅ Ajustar por redondeo para que la suma sea exacta
    let totalCalculado = capitalPagado + interesPagado + ivaPagado;
    let diferencia = monto - totalCalculado;
    
    // ✅ Aplicar la diferencia al capital
    if (Math.abs(diferencia) > 0.001) {
      capitalPagado = Math.round((capitalPagado + diferencia) * 100) / 100;
    }

    return {
      capitalPagado,
      interesPagado,
      ivaPagado,
      interesMasIva: Math.round((interesPagado + ivaPagado) * 100) / 100,
    };
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
  };

  const handleMontoChange = (e) => {
    const valor = e.target.value;
    if (valor === "" || /^\d*\.?\d*$/.test(valor)) {
      setMontoPago(valor);
      setErrorPago(null);
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
                          Abonar / Refrendar
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

      {/* POPUP DE PAGO (ABONO o REFRENDO) */}
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

                {cotizacion?.aplica_refrendo && (
                  <button
                    type="button"
                    className={`pago-tab ${tipoAccion === "refrendo" ? "activo" : ""}`}
                    onClick={() => { setTipoAccion("refrendo"); setErrorPago(null); }}
                  >
                    Refrendo ({cotizacion?.plazo_meses || 1} meses)
                  </button>
                )}
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
                  {/*  MOSTRAR NUEVA FECHA PARA REFRENDO */}
                  {tipoAccion === "refrendo" && cotizacion.nueva_fecha_vencimiento && (
                    <div className="pago-item pago-item-destacado" style={{ 
                      borderTop: '2px solid #27ae60', 
                      paddingTop: '12px', 
                      marginTop: '8px'
                    }}>
                      <span className="pago-label" style={{ color: '#27ae60', fontWeight: 'bold' }}>
                        ✅ Nueva fecha de vencimiento:
                      </span>
                      <span className="pago-valor" style={{ color: '#27ae60', fontWeight: 'bold' }}>
                        {cotizacion.nueva_fecha_vencimiento}
                      </span>
                    </div>
                  )}
                </div>
              )}

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
                        {(repartoPreview.interesMasIva > 0) && (
                          <div className="pago-reparto-fila">
                            <span>Interés + IVA del periodo:</span>
                            <span>${formatMoney(repartoPreview.interesMasIva)}</span>
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
              ) : (
                // REFRENDO
                <div className="pago-input-group">
                  <small className="pago-ayuda" style={{ fontSize: '0.9rem', lineHeight: '1.6' }}>
                    <strong>¿Qué es el refrendo?</strong><br />
                    El refrendo paga los intereses del periodo completo 
                    <strong> ({cotizacion?.plazo_meses || 1} meses)</strong> y 
                    <strong style={{ color: '#27ae60' }}> extiende tu fecha de vencimiento 
                    por {cotizacion?.plazo_meses || 1} meses más</strong>.
                    <br /><br />
                    {cotizacion ? (
                      <>
                        <span style={{ fontSize: '1.1rem' }}>
                          Total a pagar: <strong>${formatMoney(cotizacion.monto_refrendo)}</strong>
                        </span>
                        <br />
                        <span style={{ fontSize: '0.85rem', color: '#666' }}>
                          (Interés: ${formatMoney(cotizacion.monto_refrendo / 1.16)} + IVA: ${formatMoney(cotizacion.monto_refrendo - (cotizacion.monto_refrendo / 1.16))})
                        </span>
                        {cotizacion.mora > 0 && (
                          <span style={{ display: 'block', color: '#e74c3c', marginTop: '4px' }}>
                            ⚠ Incluye mora: ${formatMoney(cotizacion.mora)}
                          </span>
                        )}
                      </>
                    ) : null}
                    <br />
                    <span style={{ color: '#27ae60', fontWeight: 'bold', display: 'block', marginTop: '8px' }}>
                      ✅ Nueva fecha de vencimiento: {cotizacion?.nueva_fecha_vencimiento || 'Calculando...'}
                    </span>
                    <br />
                    <span style={{ fontSize: '0.85rem', color: '#666' }}>
                      <strong>Importante:</strong> El refrendo <strong>no abona capital</strong>, solo paga intereses 
                      y extiende el plazo. El capital se paga al recuperar la prenda.
                    </span>
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
                    : `Confirmar Refrendo (${cotizacion?.plazo_meses || 1} meses)`}
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