import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import "./Empenos.css";

const EmpenosLista = ({ empenos }) => {
  const navigate = useNavigate();
  const [filtroEstado, setFiltroEstado] = useState("todos"); // 'todos', 'activos', 'vencidos'
  const [modalAbierto, setModalAbierto] = useState(false);
  const [empenoSeleccionado, setEmpenoSeleccionado] = useState(null);
  const [modalEliminar, setModalEliminar] = useState(false);
  
  // Estados para paginación
  const [paginaActual, setPaginaActual] = useState(1);
  const empenosPorPagina = 8; // Puedes ajustar este número

  const hoy = new Date();

  const calcularEstado = (fecha) => {
    const fechaVencimiento = new Date(fecha);
    return fechaVencimiento < hoy ? "Vencido" : "Activo";
  };

  // Filtrar empeños por estado
  const empenosFiltrados = empenos.filter((e) => {
    const estado = calcularEstado(e.vencimiento);
    if (filtroEstado === "todos") return true;
    if (filtroEstado === "activos") return estado === "Activo";
    if (filtroEstado === "vencidos") return estado === "Vencido";
    return true;
  });

  // Calcular paginación
  const indiceUltimo = paginaActual * empenosPorPagina;
  const indicePrimero = indiceUltimo - empenosPorPagina;
  const empenosActuales = empenosFiltrados.slice(indicePrimero, indiceUltimo);
  const totalPaginas = Math.ceil(empenosFiltrados.length / empenosPorPagina);

  const abrirDetalle = (empeno) => {
    setEmpenoSeleccionado(empeno);
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setEmpenoSeleccionado(null);
  };

  const confirmarEliminar = (empeno) => {
    setEmpenoSeleccionado(empeno);
    setModalEliminar(true);
    setModalAbierto(false);
  };

  const handleEliminar = () => {
    // Aquí iría la función para eliminar el empeño
    console.log("Eliminar empeño:", empenoSeleccionado.id);
    setModalEliminar(false);
    setEmpenoSeleccionado(null);
  };

  // Funciones de paginación
  const cambiarPagina = (numeroPagina) => {
    setPaginaActual(numeroPagina);
  };

  const irPaginaSiguiente = () => {
    setPaginaActual(prev => Math.min(prev + 1, totalPaginas));
  };

  const irPaginaAnterior = () => {
    setPaginaActual(prev => Math.max(prev - 1, 1));
  };

  // Generar números de página
  const obtenerNumerosPagina = () => {
    const numeros = [];
    const maxPaginasVisibles = 5;
    let inicio = Math.max(1, paginaActual - Math.floor(maxPaginasVisibles / 2));
    let fin = Math.min(totalPaginas, inicio + maxPaginasVisibles - 1);
    
    if (fin - inicio + 1 < maxPaginasVisibles) {
      inicio = Math.max(1, fin - maxPaginasVisibles + 1);
    }
    
    for (let i = inicio; i <= fin; i++) {
      numeros.push(i);
    }
    return numeros;
  };

  return (
    <div className="dashboard">
      <Sidebar />

      <div className="content">
        {/* HEADER */}
        <div className="header-container">
          <h2>Empeños</h2>
          <button
            className="btn-nuevo"
            onClick={() => navigate("/empenos/nuevo")}
          >
            + Nuevo Empeño
          </button>
        </div>

        {/* FILTRO POR ESTADO */}
        <div className="filtro-container">
          <div className="filtro-botones">
            <button
              className={`filtro-btn ${filtroEstado === "todos" ? "activo" : ""}`}
              onClick={() => {
                setFiltroEstado("todos");
                setPaginaActual(1); // Resetear a primera página al filtrar
              }}
            >
              Todos
            </button>
            <button
              className={`filtro-btn ${filtroEstado === "activos" ? "activo" : ""}`}
              onClick={() => {
                setFiltroEstado("activos");
                setPaginaActual(1); // Resetear a primera página al filtrar
              }}
            >
              Activos
            </button>
            <button
              className={`filtro-btn ${filtroEstado === "vencidos" ? "activo" : ""}`}
              onClick={() => {
                setFiltroEstado("vencidos");
                setPaginaActual(1); // Resetear a primera página al filtrar
              }}
            >
              Vencidos
            </button>
          </div>
          <span className="filtro-resultados">
            {empenosFiltrados.length} resultado{empenosFiltrados.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* TARJETA DE TABLA */}
        <div className="tabla-card">
          <h3>Lista de Prendas ({empenosFiltrados.length})</h3>

          {/* Vista móvil: tarjetas */}
          <div className="vista-movil">
            {empenosActuales.length > 0 ? (
              empenosActuales.map((e) => {
                const estado = calcularEstado(e.vencimiento);
                return (
                  <div key={e.id} className="empeno-tarjeta">
                    <div className="tarjeta-header">
                      <strong>{e.cliente}</strong>
                      <span 
                        className="detalle-link"
                        onClick={() => abrirDetalle(e)}
                      >
                        Ver detalles →
                      </span>
                    </div>
                    <div className="tarjeta-cuerpo">
                      <div className="tarjeta-fila">
                        <span className="tarjeta-label">Objeto:</span>
                        <span>{e.objeto}</span>
                      </div>
                      <div className="tarjeta-fila">
                        <span className="tarjeta-label">Monto:</span>
                        <span className="monto">${e.monto}</span>
                      </div>
                      <div className="tarjeta-fila">
                        <span className="tarjeta-label">Interés:</span>
                        <span>{e.interes}%</span>
                      </div>
                      <div className="tarjeta-fila">
                        <span className="tarjeta-label">Vence:</span>
                        <span>{e.vencimiento}</span>
                      </div>
                      <div className="tarjeta-fila">
                        <span className="tarjeta-label">Estado:</span>
                        <span
                          className={
                            estado === "Activo"
                              ? "badge-activo"
                              : "badge-vencido"
                          }
                        >
                          {estado}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="sin-resultados">
                No se encontraron empeños {filtroEstado !== "todos" ? filtroEstado : ""}
              </div>
            )}
          </div>

          {/* Vista desktop: tabla */}
          <div className="vista-desktop">
            <table>
              <thead>
                <tr>
                  <th>Cliente</th>
                  <th>Objeto</th>
                  <th>Monto</th>
                  <th>Interés</th>
                  <th>Vencimiento</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>

              <tbody>
                {empenosActuales.length > 0 ? (
                  empenosActuales.map((e) => {
                    const estado = calcularEstado(e.vencimiento);

                    return (
                      <tr key={e.id}>
                        <td><strong>{e.cliente}</strong></td>
                        <td>{e.objeto}</td>
                        <td>${e.monto}</td>
                        <td>{e.interes}%</td>
                        <td>{e.vencimiento}</td>

                        <td>
                          <span
                            className={
                              estado === "Activo"
                                ? "badge-activo"
                                : "badge-vencido"
                            }
                          >
                            {estado}
                          </span>
                        </td>

                        <td>
                          <button 
                            className="btn-accion ver"
                            onClick={() => abrirDetalle(e)}
                          >
                            Ver
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="7" className="sin-resultados">
                      No se encontraron empeños {filtroEstado !== "todos" ? filtroEstado : ""}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* PAGINACIÓN - SOLO SE MUESTRA SI HAY MÁS DE UNA PÁGINA */}
          {totalPaginas > 1 && (
            <div className="paginacion-wrapper">
              <div className="paginacion-container">
                <button 
                  className="btn-paginacion"
                  onClick={irPaginaAnterior}
                  disabled={paginaActual === 1}
                >
                  ←
                </button>
                
                <div className="paginacion-numeros">
                  {obtenerNumerosPagina().map(numero => (
                    <button
                      key={numero}
                      className={`btn-pagina ${paginaActual === numero ? 'activo' : ''}`}
                      onClick={() => cambiarPagina(numero)}
                    >
                      {numero}
                    </button>
                  ))}
                </div>
                
                <button 
                  className="btn-paginacion"
                  onClick={irPaginaSiguiente}
                  disabled={paginaActual === totalPaginas}
                >
                  →
                </button>
              </div>
              <div className="paginacion-info">
                Mostrando {indicePrimero + 1} - {Math.min(indiceUltimo, empenosFiltrados.length)} de {empenosFiltrados.length} empeños
              </div>
            </div>
          )}
        </div>
      </div>

      {/* MODAL DE DETALLE DEL EMPEÑO */}
      {modalAbierto && empenoSeleccionado && (
        <div className="modal-overlay" onClick={cerrarModal}>
          <div className="modal-detalle" onClick={(e) => e.stopPropagation()}>
            <button className="modal-cerrar" onClick={cerrarModal}>×</button>
            
            <div className="modal-header">
              <h2>Detalle del Empeño</h2>
              <span className="cliente-id">ID: #{empenoSeleccionado.id}</span>
            </div>

            <div className="modal-body">
              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label">👤 Cliente</span>
                  <span className="info-value">{empenoSeleccionado.cliente}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">📦 Objeto</span>
                  <span className="info-value">{empenoSeleccionado.objeto}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">💰 Monto</span>
                  <span className="info-value">${empenoSeleccionado.monto}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">📊 Interés</span>
                  <span className="info-value">{empenoSeleccionado.interes}%</span>
                </div>
                <div className="info-item">
                  <span className="info-label">📅 Fecha de inicio</span>
                  <span className="info-value">{empenoSeleccionado.fechaInicio || "10/02/2024"}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">⏰ Vencimiento</span>
                  <span className="info-value">{empenoSeleccionado.vencimiento}</span>
                </div>
              </div>

              <div className="modal-secciones">
                <div className="seccion">
                  <h4>📝 Estado Actual</h4>
                  <p className="sin-datos">
                    <span
                      className={
                        calcularEstado(empenoSeleccionado.vencimiento) === "Activo"
                          ? "badge-activo"
                          : "badge-vencido"
                      }
                      style={{ display: "inline-block", padding: "8px 20px" }}
                    >
                      {calcularEstado(empenoSeleccionado.vencimiento)}
                    </span>
                  </p>
                </div>

                <div className="seccion">
                  <h4>💰 Pagos Realizados</h4>
                  <p className="sin-datos">Sin pagos registrados</p>
                </div>
              </div>
            </div>

            <div className="modal-acciones">
              <button 
                className="btn-eliminar"
                onClick={() => confirmarEliminar(empenoSeleccionado)}
              >
                🗑️ Eliminar 
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE CONFIRMACIÓN ELIMINAR */}
      {modalEliminar && empenoSeleccionado && (
        <div className="modal-overlay" onClick={() => setModalEliminar(false)}>
          <div className="modal-confirmar" onClick={(e) => e.stopPropagation()}>
            <div className="modal-icono">⚠️</div>
            <h3>¿Eliminar empeño?</h3>
            <p>Estás a punto de eliminar el empeño de <strong>{empenoSeleccionado.cliente}</strong></p>
            <p className="advertencia">Esta acción no se puede deshacer</p>
            
            <div className="modal-botones">
              <button 
                className="btn-cancelar"
                onClick={() => setModalEliminar(false)}
              >
                Cancelar
              </button>
              <button 
                className="btn-confirmar-eliminar"
                onClick={handleEliminar}
              >
                Sí, eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmpenosLista;