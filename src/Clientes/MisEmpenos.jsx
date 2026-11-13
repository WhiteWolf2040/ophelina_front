import React, { useState, useEffect } from "react";
import "./MisEmpenos.css";
import Navbar from "../ClientesNav/Navbar";
import { useMisEmpenos } from "../hooks/useMisEmpenos";
import ModalTicketRecibo from "./ModalTicketRecibo"; // Asegúrate de que la ruta sea correcta

const PLACEHOLDER_IMAGE = "/placeholder.png";
const PAGE_SIZE = 10;

const FILTROS = [
  { id: "todos", label: "Todos" },
  { id: "vigente", label: "Vigentes" },
  { id: "porvencer", label: "Por vencer" },
  { id: "vencido", label: "Vencidos" },
  { id: "pagado", label: "Pagados" },
];

const formatMoney = (n) =>
  Number(n || 0).toLocaleString("es-MX", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const formatValue = (val) => {
  if (val === null || val === undefined || val === "") return "—";
  const str = String(val).trim();
  if (/[a-zA-Z$]/.test(str)) return str;
  const num = Number(str);
  return isNaN(num) ? str : `$${formatMoney(num)}`;
};

const getEstado = (e) => {
  if (e.pagadoCompleto) return { id: "pagado", texto: "Pagado" };
  if (e.estado === "VENCIDO") return { id: "vencido", texto: "Vencido" };
  if (e.proximoAVencer) return { id: "porvencer", texto: "Por vencer" };
  return { id: "vigente", texto: "Vigente" };
};

const construirPaginas = (actual, total) => {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const set = new Set([1, total, actual - 1, actual, actual + 1]);
  const orden = [...set].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);
  const out = [];
  orden.forEach((p, i) => {
    if (i > 0 && p - orden[i - 1] > 1) out.push("gap-" + p);
    out.push(p);
  });
  return out;
};

const ImagenConLoader = ({ src, alt, className }) => {
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(false);

  if (error || !src) {
    return (
      <div className={`${className} img-fallback`}>
        <span>Sin imagen</span>
      </div>
    );
  }

  return (
    <div className={`${className} img-wrapper`}>
      {cargando && <div className="img-loading-text">Cargando...</div>}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={() => setCargando(false)}
        onError={() => {
          setCargando(false);
          setError(true);
        }}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          opacity: cargando ? 0 : 1,
          transition: "opacity 0.3s ease",
        }}
      />
    </div>
  );
};

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
  const [filtroEstado, setFiltroEstado] = useState("todos");
  const [paginaActual, setPaginaActual] = useState(1);
  const [paginaIr, setPaginaIr] = useState("");
  const [popupAbierto, setPopupAbierto] = useState(null);
  const [empeñoSeleccionado, setEmpeñoSeleccionado] = useState(null);
  const [montoPago, setMontoPago] = useState("");
  const [errorPago, setErrorPago] = useState(null);
  const [tipoAccion, setTipoAccion] = useState("abono");
  const [repartoPreview, setRepartoPreview] = useState(null);
  
  // ✅ Solo un estado para manejar el modal del recibo
  const [ticketSeleccionado, setTicketSeleccionado] = useState(null);

  // ✅ useEffect limpio: solo recarga si viene de un pago exitoso
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const pagoExitoso = queryParams.get("pago");

    if (pagoExitoso === "exitoso") {
      cargarEmpenos();
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [cargarEmpenos]);

  // ✅ Función para abrir el recibo desde el historial
  const abrirTicketHistorial = (abono, empeno) => {
    setTicketSeleccionado({ empeno, abono });
  };

  const empenosFiltrados = empenos.filter((empeño) => {
    const coincideTexto = (
      (empeño.id ?? "") +
      " " +
      (empeño.nombre || "") +
      (empeño.descripcion || "") +
      (empeño.prestado || "") +
      (empeño.vencimiento || "")
    )
      .toString()
      .toLowerCase()
      .includes(busqueda.trim().toLowerCase());
    const coincideEstado =
      filtroEstado === "todos" || getEstado(empeño).id === filtroEstado;
    return coincideTexto && coincideEstado;
  });

  const conteos = empenos.reduce(
    (acc, e) => {
      acc[getEstado(e).id] += 1;
      return acc;
    },
    { vigente: 0, porvencer: 0, vencido: 0, pagado: 0 }
  );
  conteos.todos = empenos.length;

  const totalRegistros = empenosFiltrados.length;
  const totalPaginas = Math.max(1, Math.ceil(totalRegistros / PAGE_SIZE));
  const paginaSegura = Math.min(paginaActual, totalPaginas);
  const inicio = (paginaSegura - 1) * PAGE_SIZE;
  const empenosVisibles = empenosFiltrados.slice(inicio, inicio + PAGE_SIZE);
  const desde = totalRegistros === 0 ? 0 : inicio + 1;
  const hasta = Math.min(inicio + PAGE_SIZE, totalRegistros);

  const cambiarPagina = (n) => {
    const destino = Math.min(Math.max(1, n), totalPaginas);
    setPaginaActual(destino);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleIrAPagina = (e) => {
    e.preventDefault();
    const n = parseInt(paginaIr, 10);
    if (!isNaN(n)) cambiarPagina(n);
    setPaginaIr("");
  };

  const handleBusqueda = (e) => {
    setBusqueda(e.target.value);
    setPaginaActual(1);
  };

  const handleFiltro = (id) => {
    setFiltroEstado(id);
    setPaginaActual(1);
  };

  const abrirPopup = async (tipo, empeño) => {
    setEmpeñoSeleccionado(empeño);
    setPopupAbierto(tipo);
    setMontoPago("");
    setErrorPago(null);
    setTipoAccion("abono");
    setRepartoPreview(null);

    if (tipo === "pagar") {
      await cargarCotizacion(empeño.id);
    }
  };

  const cerrarPopup = () => {
    setPopupAbierto(null);
    setEmpeñoSeleccionado(null);
    setMontoPago("");
    setErrorPago(null);
    setTipoAccion("abono");
    setRepartoPreview(null);
  };

  const montoNum = parseFloat(montoPago);
  const montoValido = !isNaN(montoNum) && montoNum > 0;
  const saldoMaximo = cotizacion?.saldo_pendiente_con_mora ?? null;
  const excedeSaldo =
    montoValido && saldoMaximo !== null && montoNum > saldoMaximo;

  const calcularRepartoAbono = (monto, cotizacionData) => {
    if (!monto || !cotizacionData || monto <= 0) return null;
    const capital = Number(cotizacionData.capital) || 0;
    const interes = Number(cotizacionData.interes) || 0;
    const ivaInteres = Number(cotizacionData.iva_interes) || 0;
    const deudaTotal = capital + interes + ivaInteres;
    if (deudaTotal <= 0) return null;

    const porcentajeAbono = monto / deudaTotal;
    let capitalPagado = Math.round(capital * porcentajeAbono * 100) / 100;
    let interesPagado = Math.round(interes * porcentajeAbono * 100) / 100;
    let ivaPagado = Math.round(ivaInteres * porcentajeAbono * 100) / 100;

    const totalCalculado = capitalPagado + interesPagado + ivaPagado;
    const diferencia = monto - totalCalculado;
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

  useEffect(() => {
    if (tipoAccion !== "abono") {
      setRepartoPreview(null);
      return;
    }
    if (!montoValido || !cotizacion || excedeSaldo) {
      setRepartoPreview(null);
      return;
    }
    setRepartoPreview(calcularRepartoAbono(montoNum, cotizacion));
  }, [montoPago, cotizacion, tipoAccion, excedeSaldo]);

  const procesarPago = async () => {
    if (!empeñoSeleccionado) return;

    if (tipoAccion === "abono") {
      const montoIngresado = parseFloat(String(montoPago).replace(/[^0-9.-]+/g, ""));
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
        console.error("Error real del servidor (Backend):", err.response?.data || err);
        setErrorPago("Ocurrió un problema al procesar el pago con el servidor. Por favor, intenta más tarde.");
      }
      return;
    }

    if (tipoAccion === "refrendo") {
      try {
        setErrorPago(null);
        await iniciarAbono(empeñoSeleccionado.id, null, "refrendo");
      } catch (err) {
        console.error("Error real del servidor (Backend):", err.response?.data || err);
        setErrorPago("Ocurrió un problema al procesar el refrendo. Por favor, intenta más tarde.");
      }
    }
  };

  const handleMontoChange = (e) => {
    const valor = e.target.value;
    if (valor === "" || /^\d*\.?\d*$/.test(valor)) {
      setMontoPago(valor);
      setErrorPago(null);
    }
  };

  const cambiarPestaña = (accion) => {
    setTipoAccion(accion);
    setErrorPago(null);
  };

  return (
    <div className="me-page">
      <Navbar />
      <div className="me-dashboard">
        <section className="me-page-header">
          <h1 className="me-page-title">
            Administra y consulta tus prendas empeñadas
          </h1>

          <div className="me-search-container">
            <input
              type="text"
              placeholder="Buscar por número o nombre del artículo..."
              className="me-search-input"
              value={busqueda}
              onChange={handleBusqueda}
              aria-label="Buscar empeño"
            />
            <span className="me-search-icon">🔍</span>
          </div>

          {!loading && !error && empenos.length > 0 && (
            <div className="me-filtros" role="group" aria-label="Filtrar por estado">
              {FILTROS.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  className={`me-filtro ${filtroEstado === f.id ? "activo" : ""}`}
                  onClick={() => handleFiltro(f.id)}
                >
                  {f.label}
                  <span className="me-filtro-conteo">{conteos[f.id]}</span>
                </button>
              ))}
            </div>
          )}
        </section>

        {loading && (
          <div className="me-cargando-texto">Cargando tus empeños...</div>
        )}

        {error && !loading && (
          <div className="me-sin-resultados">
            <p>{typeof error === "string" ? error : error?.message || "Error al cargar"}</p>
            <button className="me-btn-reintentar" onClick={cargarEmpenos}>
              Reintentar
            </button>
          </div>
        )}

        {!loading && !error && (
          <section className="me-empenos-list">
            {totalRegistros > 0 ? (
              <>
                <div className="me-fichas-grid">
                  {empenosVisibles.map((empeño) => {
                    const estado = getEstado(empeño);
                    const estaVencido = estado.id === "vencido";
                    
                    return (
                      <div key={empeño.id} className="me-ficha">
                        
                        <div className="me-ficha-header">
                          <ImagenConLoader
                            src={empeño.imagen || PLACEHOLDER_IMAGE}
                            alt={empeño.nombre}
                            className="me-ficha-imagen"
                          />
                          <div className="me-ficha-titulo">
                            <span className="me-empeno-nombre">{empeño.nombre}</span>
                            <span className="me-empeno-id">Empeño #{empeño.id}</span>
                          </div>
                          <span className={`me-estado me-estado-${estado.id}`}>
                            {estado.texto}
                          </span>
                        </div>

                        <div className="me-ficha-body">
                          <div className="me-ficha-dato">
                            <span className="me-ficha-label">Saldo Pendiente</span>
                            <span className="me-ficha-valor">
                              {formatValue(empeño.saldoRestante ?? empeño.saldo_total_pendiente ?? empeño.prestado)}
                            </span>
                          </div>
                          <div className="me-ficha-dato">
                            <span className="me-ficha-label">Vencimiento</span>
                            <span className="me-ficha-valor">
                              {empeño.vencimiento || "—"}
                            </span>
                          </div>
                        </div>

                        <div className="me-ficha-acciones">
                          {!empeño.pagadoCompleto && !estaVencido ? (
                            <button
                              className="me-btn-pagar"
                              onClick={() => abrirPopup("pagar", empeño)}
                            >
                              Abonar
                            </button>
                          ) : empeño.pagadoCompleto ? (
                            <div className="me-btn-pagado">✓ Pagado</div>
                          ) : null}
                          
                          <button
                            className="me-btn-ver-detalles"
                            onClick={() => abrirPopup("detalles", empeño)}
                            style={{ flex: estaVencido ? 1 : "initial" }}
                          >
                            Ver detalles
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <nav className="me-paginacion" aria-label="Paginación de empeños">
                  <p className="me-paginacion-resumen">
                    Mostrando {desde}-{hasta} de {totalRegistros} empeños
                  </p>
                  <div className="me-paginacion-controles">
                    <button
                      type="button"
                      className="me-pag-btn"
                      onClick={() => cambiarPagina(paginaSegura - 1)}
                      disabled={paginaSegura === 1}
                    >
                      Anterior
                    </button>
                    {construirPaginas(paginaSegura, totalPaginas).map((p) =>
                      typeof p === "string" ? (
                        <span key={p} className="me-pag-gap">…</span>
                      ) : (
                        <button
                          key={p}
                          type="button"
                          className={`me-pag-num ${p === paginaSegura ? "activo" : ""}`}
                          onClick={() => cambiarPagina(p)}
                        >
                          {p}
                        </button>
                      )
                    )}
                    <button
                      type="button"
                      className="me-pag-btn"
                      onClick={() => cambiarPagina(paginaSegura + 1)}
                      disabled={paginaSegura === totalPaginas}
                    >
                      Siguiente
                    </button>
                  </div>
                </nav>
              </>
            ) : (
              <p className="me-sin-resultados">No se encontraron empeños</p>
            )}
          </section>
        )}
      </div>

      {/* ==================== POPUP DE DETALLES DEL EMPEÑO ==================== */}
      {popupAbierto === "detalles" && empeñoSeleccionado && (
        <div className="popup-overlay" onClick={cerrarPopup}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <button className="popup-close" onClick={cerrarPopup}>×</button>

            <div className="detalles-popup">
              {getEstado(empeñoSeleccionado).id === "vencido" && (
                <div className="me-alerta-vencido">
                  <strong>⚠ Artículo Vencido y en Tienda</strong>
                  <p>Este empeño ha superado su fecha límite. El artículo se ha declarado en pérdida y ha sido trasladado a nuestra tienda de recuperación. Si deseas recuperarlo, por favor contacta a atención a clientes.</p>
                </div>
              )}

              <div className="detalles-hero">
                <div className="popup-imagen-container-left">
                  <ImagenConLoader
                    src={empeñoSeleccionado.imagen || PLACEHOLDER_IMAGE}
                    alt={empeñoSeleccionado.nombre}
                    className="popup-imagen-left"
                  />
                  {empeñoSeleccionado.pagadoCompleto && (
                    <div className="popup-pagado-badge">✓ Pagado</div>
                  )}
                </div>

                <div className="detalles-hero-info">
                  <h2 className="detalle-titulo">{empeñoSeleccionado.nombre}</h2>
                  {empeñoSeleccionado.descripcion && (
                    <p className="detalle-descripcion">{empeñoSeleccionado.descripcion}</p>
                  )}
                  <div className="detalles-meta">
                    {empeñoSeleccionado.casaEmpeño && (
                      <span className="meta-chip">{empeñoSeleccionado.casaEmpeño}</span>
                    )}
                    {empeñoSeleccionado.gramos && (
                      <span className="meta-chip">{empeñoSeleccionado.gramos}</span>
                    )}
                    {empeñoSeleccionado.tasaPorcentaje != null && empeñoSeleccionado.plazoMeses != null && (
                      <span className="meta-chip">
                        {empeñoSeleccionado.tasaPorcentaje}% · {empeñoSeleccionado.plazoMeses} {empeñoSeleccionado.plazoMeses === 1 ? "mes" : "meses"}
                      </span>
                    )}
                    {empeñoSeleccionado.vencimiento && (
                      <span className="meta-chip">Vence: {empeñoSeleccionado.vencimiento}</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="detalles-seccion">
                <h4 className="detalles-seccion-titulo">Información financiera</h4>
                <div className="financiero-tabla">
                  <div className="financiero-fila">
                    <span className="financiero-label">Monto prestado</span>
                    <span className="financiero-valor">{formatValue(empeñoSeleccionado.prestado)}</span>
                  </div>
                  <div className="financiero-fila">
                    <span className="financiero-label">Intereses</span>
                    <span className="financiero-valor">{formatValue(empeñoSeleccionado.intereses)}</span>
                  </div>
                  <div className="financiero-fila">
                    <span className="financiero-label">Saldo pendiente (capital)</span>
                    <span className="financiero-valor">{formatValue(empeñoSeleccionado.saldoRestante)}</span>
                  </div>
                  <div className="financiero-fila">
                    <span className="financiero-label">Total abonado</span>
                    <span className="financiero-valor">{formatValue(empeñoSeleccionado.totalAbonado)}</span>
                  </div>
                  <div className={`financiero-fila financiero-total ${empeñoSeleccionado.pagadoCompleto ? "pagado" : ""}`}>
                    <span className="financiero-label">Total a pagar</span>
                    <span className="financiero-valor">
                      {empeñoSeleccionado.pagadoCompleto ? "Pagado ✓" : formatValue(empeñoSeleccionado.totalPagar)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="detalles-seccion">
                <h4 className="detalles-seccion-titulo">Historial de pagos</h4>
                {empeñoSeleccionado.abonos && empeñoSeleccionado.abonos.length > 0 ? (
                  <div className="historial-lista">
                    {empeñoSeleccionado.abonos.map((abono, index) => (
                      <div key={index} className="historial-item">
                        <div className="historial-main">
                          <span className="historial-monto">{formatValue(abono.monto)}</span>
                          {abono.fecha && <span className="historial-fecha">{abono.fecha}</span>}
                        </div>
                        <div className="historial-detalle">
                          <div>
                            <span className="historial-label">Intereses </span>
                            <span className="historial-intereses">{formatValue(abono.interesesPagados)}</span>
                          </div>
                          
                          {/* ✅ BOTÓN CONECTADO AL NUEVO MODAL */}
                          <button 
                            className="btn-ver-recibo"
                            onClick={() => abrirTicketHistorial(abono, empeñoSeleccionado)}
                          >
                            <span className="icon">🧾</span> Ver recibo
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="historial-vacio">Aún no hay abonos registrados.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== MODAL DE RECIBO (LARGO) ==================== */}
      {ticketSeleccionado && (
        <ModalTicketRecibo 
          empeno={ticketSeleccionado.empeno} 
          abono={ticketSeleccionado.abono} 
          onClose={() => setTicketSeleccionado(null)} 
        />
      )}
      
    </div>
  );
}