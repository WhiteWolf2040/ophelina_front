import { useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import "./Clientes.css";

const ClientesLista = () => {
  const navigate = useNavigate();
  const { clientes, eliminarCliente, editarCliente } = useOutletContext();
  
  const [busqueda, setBusqueda] = useState("");
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modalEditarAbierto, setModalEditarAbierto] = useState(false);
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const [modalEliminar, setModalEliminar] = useState(false);
  
  // Estados para paginación
  const [paginaActual, setPaginaActual] = useState(1);
  const clientesPorPagina = 8;

  // Estado para el formulario de edición
  const [formEditar, setFormEditar] = useState({
    nombre: "",
    telefono: "",
    email: "",
    direccion: "",
    fecha: ""
  });

  // Filtrar clientes por búsqueda
  const clientesFiltrados = clientes.filter((cliente) =>
    cliente.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  // Calcular paginación
  const indiceUltimo = paginaActual * clientesPorPagina;
  const indicePrimero = indiceUltimo - clientesPorPagina;
  const clientesActuales = clientesFiltrados.slice(indicePrimero, indiceUltimo);
  const totalPaginas = Math.ceil(clientesFiltrados.length / clientesPorPagina);

  const abrirDetalle = (cliente) => {
    setClienteSeleccionado(cliente);
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setClienteSeleccionado(null);
  };

  const abrirModalEditar = (cliente) => {
    setClienteSeleccionado(cliente);
    setFormEditar({
      nombre: cliente.nombre,
      telefono: cliente.telefono,
      email: cliente.email,
      direccion: cliente.direccion || "",
      fecha: cliente.fecha
    });
    setModalEditarAbierto(true);
    setModalAbierto(false);
  };

  const cerrarModalEditar = () => {
    setModalEditarAbierto(false);
    setClienteSeleccionado(null);
  };

  const handleEditarSubmit = (e) => {
    e.preventDefault();
    editarCliente(clienteSeleccionado.id, formEditar);
    cerrarModalEditar();
  };

  const confirmarEliminar = (cliente) => {
    setClienteSeleccionado(cliente);
    setModalEliminar(true);
    setModalAbierto(false);
  };

  const handleEliminar = () => {
    eliminarCliente(clienteSeleccionado.id);
    setModalEliminar(false);
    setClienteSeleccionado(null);
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
   
      <div className="content">
        {/* HEADER */}
        <div className="header-container">
          <h2>Clientes</h2>
          <button className="btn-nuevo" onClick={() => navigate("nuevo")}>
            + Nuevo Registro
          </button>
        </div>

        {/* BUSCADOR */}
        <div className="buscador-container">
          <input
            className="buscador-input"
            placeholder="Buscar por nombre..."
            value={busqueda}
            onChange={(e) => {
              setBusqueda(e.target.value);
              setPaginaActual(1);
            }}
          />
        </div>

        {/* TARJETA DE TABLA */}
        <div className="tabla-card">
          <h3>Lista de Clientes ({clientesFiltrados.length})</h3>

          {/* Vista móvil: tarjetas */}
          <div className="vista-movil">
            {clientesActuales.length > 0 ? (
              clientesActuales.map((cliente) => (
                <div key={cliente.id} className="cliente-tarjeta">
                  <div className="tarjeta-header">
                    <strong>{cliente.nombre}</strong>
                    <span 
                      className="detalle-link"
                      onClick={() => abrirDetalle(cliente)}
                    >
                      Ver detalles →
                    </span>
                  </div>
                  <div className="tarjeta-cuerpo">
                    <div>📞 {cliente.telefono}</div>
                    <div>✉️ {cliente.email}</div>
                    <div>📅 {cliente.fecha}</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="sin-resultados">
                No se encontraron clientes
              </div>
            )}
          </div>

          {/* Vista desktop: tabla */}
          <div className="vista-desktop">
            <table>
              <thead>
                <tr>
                  <th>Nombre Completo</th>
                  <th>Teléfono</th>
                  <th>Email</th>
                  <th>Fecha Registro</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {clientesActuales.length > 0 ? (
                  clientesActuales.map((cliente) => (
                    <tr key={cliente.id}>
                      <td><strong>{cliente.nombre}</strong></td>
                      <td>{cliente.telefono}</td>
                      <td>{cliente.email}</td>
                      <td>{cliente.fecha}</td>
                      <td>
                        <button 
                          className="btn-accion ver"
                          onClick={() => abrirDetalle(cliente)}
                          title="Ver detalles"
                        >
                          Ver
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="sin-resultados">
                      No se encontraron clientes
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* PAGINACIÓN */}
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
                Mostrando {indicePrimero + 1} - {Math.min(indiceUltimo, clientesFiltrados.length)} de {clientesFiltrados.length} clientes
              </div>
            </div>
          )}
        </div>
      </div>

      {/* MODAL DE DETALLE DEL CLIENTE */}
      {modalAbierto && clienteSeleccionado && (
        <div className="modal-overlay" onClick={cerrarModal}>
          <div className="modal-detalle" onClick={(e) => e.stopPropagation()}>
            <button className="modal-cerrar" onClick={cerrarModal}>×</button>
            
            <div className="modal-header">
              <h2>{clienteSeleccionado.nombre}</h2>
              <span className="cliente-id">ID: #{clienteSeleccionado.id}</span>
            </div>

            <div className="modal-body">
              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label">📞 Teléfono</span>
                  <span className="info-value">{clienteSeleccionado.telefono}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">✉️ Email</span>
                  <span className="info-value">{clienteSeleccionado.email}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">📍 Dirección</span>
                  <span className="info-value">{clienteSeleccionado.direccion || "No especificada"}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">📅 Fecha Registro</span>
                  <span className="info-value">{clienteSeleccionado.fecha}</span>
                </div>
              </div>

              <div className="modal-secciones">
                <div className="seccion">
                  <h4>📦 Historial de Empeños</h4>
                  <p className="sin-datos">Sin empeños registrados</p>
                </div>

                <div className="seccion">
                  <h4>💰 Pagos Realizados</h4>
                  <p className="sin-datos">Sin pagos registrados</p>
                </div>
              </div>
            </div>

            <div className="modal-acciones">
              <button 
                className="btn-editar"
                onClick={() => abrirModalEditar(clienteSeleccionado)}
              >
                ✏️ Editar 
              </button>
              <button 
                className="btn-eliminar"
                onClick={() => confirmarEliminar(clienteSeleccionado)}
              >
                🗑️ Eliminar 
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE EDICIÓN */}
      {modalEditarAbierto && clienteSeleccionado && (
        <div className="modal-overlay" onClick={cerrarModalEditar}>
          <div className="modal-editar" onClick={(e) => e.stopPropagation()}>
            <button className="modal-cerrar" onClick={cerrarModalEditar}>×</button>
            
            <div className="modal-header">
              <h2>Editar Cliente</h2>
              <span className="cliente-id">ID: #{clienteSeleccionado.id}</span>
            </div>

            <form onSubmit={handleEditarSubmit}>
              <div className="modal-body">
                <div className="form-grid-modal">
                  <div className="form-group-modal">
                    <label>Nombre Completo *</label>
                    <input
                      type="text"
                      value={formEditar.nombre}
                      onChange={(e) => setFormEditar({...formEditar, nombre: e.target.value})}
                      required
                      placeholder="Ej: Juan Pérez"
                    />
                  </div>

                  <div className="form-group-modal">
                    <label>Teléfono *</label>
                    <input
                      type="tel"
                      value={formEditar.telefono}
                      onChange={(e) => setFormEditar({...formEditar, telefono: e.target.value})}
                      required
                      placeholder="Ej: 9992345674"
                    />
                  </div>

                  <div className="form-group-modal">
                    <label>Email *</label>
                    <input
                      type="email"
                      value={formEditar.email}
                      onChange={(e) => setFormEditar({...formEditar, email: e.target.value})}
                      required
                      placeholder="Ej: cliente@email.com"
                    />
                  </div>

                  <div className="form-group-modal">
                    <label>Fecha de Registro</label>
                    <input
                      type="text"
                      value={formEditar.fecha}
                      readOnly
                      className="campo-lectura"
                    />
                  </div>

                  <div className="form-group-modal full-width">
                    <label>Dirección</label>
                    <input
                      type="text"
                      value={formEditar.direccion}
                      onChange={(e) => setFormEditar({...formEditar, direccion: e.target.value})}
                      placeholder="Ej: Calle Principal #123"
                    />
                  </div>
                </div>
              </div>

              <div className="modal-acciones-editar">
                <button type="button" className="btn-cancelar-modal" onClick={cerrarModalEditar}>
                  Cancelar
                </button>
                <button type="submit" className="btn-guardar-modal">
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL DE CONFIRMACIÓN ELIMINAR */}
      {modalEliminar && clienteSeleccionado && (
        <div className="modal-overlay" onClick={() => setModalEliminar(false)}>
          <div className="modal-confirmar" onClick={(e) => e.stopPropagation()}>
            <div className="modal-icono">⚠️</div>
            <h3>¿Eliminar cliente?</h3>
            <p>Estás a punto de eliminar a <strong>{clienteSeleccionado.nombre}</strong></p>
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

export default ClientesLista;