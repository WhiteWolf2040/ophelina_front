import React, { useState, useEffect } from "react";
import "./MisEmpenos.css";
import Navbar from "../ClientesNav/Navbar";
import { getMisEmpenos } from "../config/auth";

export default function MisEmpenos() {
  const [busqueda, setBusqueda] = useState("");
  const [popupAbierto, setPopupAbierto] = useState(null);
  const [empeñoSeleccionado, setEmpeñoSeleccionado] = useState(null);

  // 🔥 Estados para los datos reales del backend
  const [empeños, setEmpeños] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  // 🔥 Cargar los empeños del cliente logueado al montar el componente
  useEffect(() => {
    const cargarEmpenos = async () => {
      setCargando(true);
      setError("");

      const result = await getMisEmpenos();

      if (result.success) {
        setEmpeños(result.data);
      } else {
        setError(result.message || "No se pudieron cargar tus empeños");
      }

      setCargando(false);
    };

    cargarEmpenos();
  }, []);

  const empenosFiltrados = empeños.filter((empeño) =>
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
  };

  const cerrarPopup = () => {
    setPopupAbierto(null);
    setEmpeñoSeleccionado(null);
  };

  const getSaldoRestante = (empeño) => {
    return `$${Number(empeño.saldoRestante || 0).toLocaleString("en-US")}`;
  };

  const getTotalAbonado = (empeño) => {
    const total =
      (empeño.totalPagarNumerico || 0) - (empeño.saldoRestante || 0);
    return `$${total.toLocaleString("en-US")}`;
  };

  // 🔹 El estado ya viene calculado por el backend (empeño.estado), no se recalcula aquí
  const getEstadoConfig = (estado) => {
    switch (estado) {
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
          {cargando ? (
            <p className="me-sin-resultados">Cargando tus empeños...</p>
          ) : error ? (
            <p className="me-sin-resultados">{error}</p>
          ) : empenosFiltrados.length > 0 ? (
            empenosFiltrados.map((empeño) => {
              const estado = empeño.estado;
              const estadoConfig = getEstadoConfig(estado);
              const vencido = estado === "VENCIDO";
              const enTienda = estado === "EN TIENDA";
              const pagado = estado === "PAGADO";

              return (
                <div
                  key={empeño.id}
                  className={`me-empeno-card ${estadoConfig.clase}`}
                >
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
                          <span
                            className={`me-detalle-valor me-total ${
                              pagado ? "pagado" : ""
                            }`}
                          >
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
                          <span
                            className={`me-detalle-valor ${
                              vencido ? "fecha-vencida" : ""
                            }`}
                          >
                            {empeño.vencimiento}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="me-empeno-acciones">
                    {enTienda && (
                      <div className="me-mensaje-tienda">
                        Esta prenda no fue liquidada a tiempo y ya se
                        encuentra disponible en tienda fisica.
                      </div>
                    )}

                    {pagado && (
                      <div className="me-mensaje-pagado">
                        Prenda liquidada completamente. Gracias por tu pago.
                      </div>
                    )}

                    {vencido && !pagado && !enTienda && (
                      <div className="me-mensaje-vencido">
                        Lo sentimos, has excedido el plazo para pagar. La
                        prenda se pasara a venta en automatico.
                      </div>
                    )}

                    <button
                      className="me-btn-ver-detalles"
                      onClick={() => abrirPopup("detalles", empeño)}
                    >
                      Ver detalles
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="me-sin-resultados">No se encontraron empeños</p>
          )}
        </section>
      </div>

      {/* POPUP DE DETALLES */}
      {popupAbierto === "detalles" && empeñoSeleccionado && (
        <div className="popup-overlay" onClick={cerrarPopup}>
          <div
            className="popup-content popup-detalles"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="popup-close" onClick={cerrarPopup}>
              ×
            </button>

            <div className="popup-detalles-flex">
              <div className="popup-imagen-container-left">
                <img
                  src={empeñoSeleccionado.imagen}
                  alt={empeñoSeleccionado.nombre}
                  className="popup-imagen-left"
                />
                {empeñoSeleccionado.estado === "PAGADO" && (
                  <div className="popup-pagado-badge">PAGADO</div>
                )}
                {empeñoSeleccionado.estado === "EN TIENDA" && (
                  <div className="popup-tienda-badge">EN TIENDA</div>
                )}
                {empeñoSeleccionado.estado === "VENCIDO" && (
                  <div className="popup-vencido-badge">VENCIDO</div>
                )}
              </div>

              <div className="popup-info-right">
                <h3 className="detalle-titulo">{empeñoSeleccionado.nombre}</h3>
                <p className="detalle-descripcion">
                  {empeñoSeleccionado.descripcion}
                </p>

                <div className="detalle-caracteristicas-vertical">
                  <p>
                    <strong>{empeñoSeleccionado.gramos}</strong>
                  </p>
                  <p>
                    <strong>
                      Casa de empeño: {empeñoSeleccionado.casaEmpeño}
                    </strong>
                  </p>
                </div>

                <div className="detalle-seccion resumen-financiero">
                  <h4>Resumen Financiero</h4>
                  <div className="detalle-financiero">
                    <div className="financiero-item">
                      <span>Monto prestado:</span>
                      <span className="valor-destacado">
                        {empeñoSeleccionado.prestado}
                      </span>
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
                      <span className="valor-destacado">
                        {empeñoSeleccionado.totalPagar}
                      </span>
                    </div>

                    {empeñoSeleccionado.estado !== "PAGADO" &&
                      empeñoSeleccionado.estado !== "EN TIENDA" && (
                        <>
                          <div className="financiero-item abonado">
                            <span>Total abonado:</span>
                            <span className="valor-abonado">
                              {getTotalAbonado(empeñoSeleccionado)}
                            </span>
                          </div>
                          <div className="financiero-item pendiente">
                            <span>Saldo pendiente:</span>
                            <span className="valor-pendiente">
                              {getSaldoRestante(empeñoSeleccionado)}
                            </span>
                          </div>
                        </>
                      )}

                    {empeñoSeleccionado.estado === "PAGADO" && (
                      <div className="financiero-item pagado-completo">
                        <span>Estado:</span>
                        <span className="valor-pagado">
                          Pagado completamente
                        </span>
                      </div>
                    )}

                    {empeñoSeleccionado.estado === "EN TIENDA" && (
                      <div className="financiero-item en-tienda">
                        <span>Estado:</span>
                        <span className="valor-tienda">
                          En tienda fisica - No liquidado
                        </span>
                      </div>
                    )}

                    <div className="financiero-item">
                      <span>Fecha de vencimiento:</span>
                      <span
                        className={
                          empeñoSeleccionado.estado === "VENCIDO"
                            ? "texto-vencido"
                            : ""
                        }
                      >
                        {empeñoSeleccionado.vencimiento}
                        {empeñoSeleccionado.estado === "VENCIDO" &&
                          " (VENCIDO)"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="detalle-seccion historial-pagos">
                  <h4>Historial de Pagos Realizados</h4>
                  {empeñoSeleccionado.abonos &&
                  empeñoSeleccionado.abonos.length > 0 ? (
                    <div className="tabla-historial">
                      <div className="historial-header">
                        <span>Fecha</span>
                        <span>Monto Abonado</span>
                        <span>Intereses Cubiertos</span>
                      </div>
                      {empeñoSeleccionado.abonos.map((abono, index) => (
                        <div key={index} className="historial-item">
                          <span className="historial-fecha">
                            {abono.fecha}
                          </span>
                          <span className="historial-monto">
                            {abono.monto}
                          </span>
                          <span className="historial-intereses">
                            {abono.interesesPagados}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="sin-pagos">No se han registrado pagos aun</p>
                  )}

                  {empeñoSeleccionado.estado !== "PAGADO" &&
                    empeñoSeleccionado.estado !== "EN TIENDA" && (
                      <div className="historial-total">
                        <span>
                          <strong>Total de abonos realizados:</strong>
                        </span>
                        <span className="total-abonado-valor">
                          {getTotalAbonado(empeñoSeleccionado)}
                        </span>
                      </div>
                    )}

                  {empeñoSeleccionado.estado === "PAGADO" && (
                    <div className="historial-item pagado-final">
                      <span>Pago total completado</span>
                      <span className="historial-fecha">
                        {new Date().toLocaleDateString()}
                      </span>
                    </div>
                  )}

                  {empeñoSeleccionado.estado === "EN TIENDA" && (
                    <div className="aviso-tienda">
                      <strong>ATENCION:</strong> Esta prenda no fue liquidada
                      en el plazo establecido y ya se encuentra disponible
                      para su venta en nuestra tienda fisica.
                    </div>
                  )}

                  {empeñoSeleccionado.estado === "VENCIDO" && (
                    <div className="aviso-vencimiento">
                      <strong>ATENCION:</strong> Este prestamo ha vencido. La
                      prenda sera transferida a venta automatica si no se
                      liquida el saldo pendiente.
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
