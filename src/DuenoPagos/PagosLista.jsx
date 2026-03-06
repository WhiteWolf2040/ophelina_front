import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import "./Pagos.css";
import PaymentsIcon from '@mui/icons-material/Payments';

// Importar iconos de MUI
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';



const PagosLista = ({ pagos }) => {
  const navigate = useNavigate();

  const [busqueda, setBusqueda] = useState("");
  const [fechaFiltro, setFechaFiltro] = useState("");
  const [modalAbierto, setModalAbierto] = useState(false);
  const [pagoSeleccionado, setPagoSeleccionado] = useState(null);
  const [modalEliminar, setModalEliminar] = useState(false);
  
  // Estados para paginación
  const [paginaActual, setPaginaActual] = useState(1);
  const pagosPorPagina = 8; // Puedes ajustar este número

  const pagosFiltrados = pagos.filter((pago) => {
    const coincideNombre = pago.cliente
      .toLowerCase()
      .includes(busqueda.toLowerCase());

    const coincideFecha = fechaFiltro
      ? pago.fecha === fechaFiltro
      : true;

    return coincideNombre && coincideFecha;
  });

  // Calcular paginación
  const indiceUltimo = paginaActual * pagosPorPagina;
  const indicePrimero = indiceUltimo - pagosPorPagina;
  const pagosActuales = pagosFiltrados.slice(indicePrimero, indiceUltimo);
  const totalPaginas = Math.ceil(pagosFiltrados.length / pagosPorPagina);

  const abrirDetalle = (pago) => {
    setPagoSeleccionado(pago);
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setPagoSeleccionado(null);
  };

  const confirmarEliminar = (pago) => {
    setPagoSeleccionado(pago);
    setModalEliminar(true);
    setModalAbierto(false);
  };

  const handleEliminar = () => {
    // Aquí iría la función para eliminar el pago
    console.log("Eliminar pago:", pagoSeleccionado.id);
    setModalEliminar(false);
    setPagoSeleccionado(null);
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
        <div className="header-container ">
          <div className="tienda-header">
            <h1 > <PaymentsIcon className="title-icon"/> Listado de pagos 
          <p className="header-sub">Gestiona los productos en venta</p></h1>
          </div>
          
          <button
            className="btn-nuevo"
            onClick={() => navigate("/pagos/nuevo")}
          >
            + Nuevo Pago
          </button>
        </div>

        {/* FILTROS */}
        <div className="filtros-container">
          <div className="buscador-container">
            <input
              type="text"
              placeholder="Buscar por cliente..."
              value={busqueda}
              onChange={(e) => {
                setBusqueda(e.target.value);
                setPaginaActual(1); // Resetear a primera página al buscar
              }}
              className="buscador-input"
            />
          </div>

          <div className="filtro-fecha-container">
            <input
              type="date"
              value={fechaFiltro}
              onChange={(e) => {
                setFechaFiltro(e.target.value);
                setPaginaActual(1); // Resetear a primera página al filtrar por fecha
              }}
              className="filtro-fecha"
            />
          </div>

          {(busqueda || fechaFiltro) && (
            <button
              className="btn-limpiar"
              onClick={() => {
                setBusqueda("");
                setFechaFiltro("");
                setPaginaActual(1); // Resetear a primera página al limpiar
              }}
            >
              ✕ Limpiar
            </button>
          )}
        </div>

        {/* TARJETA DE TABLA */}
        <div className="tabla-card">
          <h3>Lista de Pagos ({pagosFiltrados.length})</h3>

          {/* Vista móvil: tarjetas */}
          <div className="vista-movil">
            {pagosActuales.length > 0 ? (
              pagosActuales.map((pago) => (
                <div key={pago.id} className="pago-tarjeta">
                  <div className="tarjeta-header">
                    <strong>{pago.cliente}</strong>
                    <span 
                      className="detalle-link"
                      onClick={() => abrirDetalle(pago)}
                    >
                      Ver detalles →
                    </span>
                  </div>
                  <div className="tarjeta-cuerpo">
                    <div className="tarjeta-fila">
                      <span className="tarjeta-label">Artículo:</span>
                      <span>{pago.articulo}</span>
                    </div>
                    <div className="tarjeta-fila">
                      <span className="tarjeta-label">Monto:</span>
                      <span className="monto">${pago.monto}</span>
                    </div>
                    <div className="tarjeta-fila">
                      <span className="tarjeta-label">Tipo:</span>
                      <span className={`tipo-badge tipo-${pago.tipo.toLowerCase()}`}>
                        {pago.tipo}
                      </span>
                    </div>
                    <div className="tarjeta-fila">
                      <span className="tarjeta-label">Fecha:</span>
                      <span>{pago.fecha}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="sin-resultados">
                No hay resultados con esos filtros
              </div>
            )}
          </div>

          {/* Vista desktop: tabla */}
  {/* Vista desktop: tabla */}
<div className="vista-desktop">
  <table>
    <thead>
      <tr>
        <th>Cliente</th>
        <th>Artículo</th>
        <th>Monto</th>
        <th>Tipo</th>
        <th>Fecha</th>
        <th>Acciones</th>
      </tr>
    </thead>

    <tbody>
      {pagosActuales.length > 0 ? (
        pagosActuales.map((pago) => (
          <tr key={pago.id}>
            <td><strong>{pago.cliente}</strong></td>
            <td>{pago.articulo}</td>
            <td>${pago.monto}</td>
            <td>
              <span className={`tipo-badge tipo-${pago.tipo.toLowerCase()}`}>
                {pago.tipo}
              </span>
            </td>
            <td>{pago.fecha}</td>
            <td>
              <div className="acciones-container">
                <button 
                  className="btn-accion ver"
                  onClick={() => abrirDetalle(pago)}
                  title="Ver detalles"
                >
                  <VisibilityIcon fontSize="small" />
                </button>
                
              </div>
            </td>
          </tr>
        ))
      ) : (
        <tr>
          <td colSpan="6" className="sin-resultados">
            No hay resultados con esos filtros
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
                Mostrando {indicePrimero + 1} - {Math.min(indiceUltimo, pagosFiltrados.length)} de {pagosFiltrados.length} pagos
              </div>
            </div>
          )}
        </div>
      </div>

      {/* MODAL DE DETALLE DEL PAGO */}
      {modalAbierto && pagoSeleccionado && (
        <div className="modal-overlay" onClick={cerrarModal}>
          <div className="modal-detalle-pago" onClick={(e) => e.stopPropagation()}>
            <button className="modal-cerrar" onClick={cerrarModal}>×</button>
            
            <div className="modal-header-pago">
              <h2>Detalle del Pago</h2>
              
            </div>

            <div className="modal-body-pago">
              {/* Información del Pago */}
              <div className="info-seccion-pago">
                <h3 className="seccion-titulo-pago">
                  <span className="titulo-icono">💰</span>
                  Información del Pago
                </h3>
                
                <div className="info-grid-pago">
                  <div className="info-item-pago">
                    <span className="info-label-pago">Cliente</span>
                    <span className="info-value-pago">{pagoSeleccionado.cliente}</span>
                  </div>

                  <div className="info-item-pago">
                    <span className="info-label-pago">Monto</span>
                    <span className="info-value-pago">${pagoSeleccionado.monto}</span>
                  </div>

                  <div className="info-item-pago">
                    <span className="info-label-pago">Tipo de pago</span>
                    <span className="info-value-pago">
                      <span className={`tipo-badge-pago tipo-${pagoSeleccionado.tipo.toLowerCase()}`}>
                        {pagoSeleccionado.tipo}
                      </span>
                    </span>
                  </div>

                  <div className="info-item-pago">
                    <span className="info-label-pago">Método de pago</span>
                    <span className="info-value-pago">{pagoSeleccionado.metodo || "Efectivo"}</span>
                  </div>

                  <div className="info-item-pago">
                    <span className="info-label-pago">Fecha de Pago</span>
                    <span className="info-value-pago">{pagoSeleccionado.fecha}</span>
                  </div>
                </div>
              </div>

              {/* Información del Empeño */}
              <div className="info-seccion-pago">
                <h3 className="seccion-titulo-pago">
                  <span className="titulo-icono">📦</span>
                  Información del Empeño
                </h3>
                
                <div className="info-grid-pago">
                  <div className="info-item-pago">
                    <span className="info-label-pago">Prenda</span>
                    <span className="info-value-pago">{pagoSeleccionado.articulo}</span>
                  </div>

                  <div className="info-item-pago">
                    <span className="info-label-pago">Monto de Empeño</span>
                    <span className="info-value-pago">$9,000</span>
                  </div>

                  <div className="info-item-pago">
                    <span className="info-label-pago">Estado</span>
                    <span className="info-value-pago">
                      <span className="estado-badge activo">Activo</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Botones de acción */}
            <div className="modal-acciones-pago">
              <button 
                className="btn-eliminar-pago"
                onClick={() => confirmarEliminar(pagoSeleccionado)}
              >
                🗑️ Eliminar Pago
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE CONFIRMACIÓN ELIMINAR */}
      {modalEliminar && pagoSeleccionado && (
        <div className="modal-overlay" onClick={() => setModalEliminar(false)}>
          <div className="modal-confirmar" onClick={(e) => e.stopPropagation()}>
            <div className="modal-icono">⚠️</div>
            <h3>¿Eliminar pago?</h3>
            <p>Estás a punto de eliminar el pago de <strong>{pagoSeleccionado.cliente}</strong></p>
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

export default PagosLista;