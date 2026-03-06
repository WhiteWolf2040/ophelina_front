// ClientesLista.jsx - Versión Mejorada
import { useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import "./Clientes.css";

// Importar iconos de MUI
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import BadgeIcon from '@mui/icons-material/Badge';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import HistoryIcon from '@mui/icons-material/History';
import PaymentIcon from '@mui/icons-material/Payment';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import WarningIcon from '@mui/icons-material/Warning';
import CloseIcon from '@mui/icons-material/Close';
import PersonIcon from '@mui/icons-material/Person';
import GroupIcon from '@mui/icons-material/Group';

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

  // Estado para el formulario de edición con nuevos campos
  const [formEditar, setFormEditar] = useState({
    nombre: "",
    telefono: "",
    email: "",
    direccion: "",
    colonia: "",
    ciudad: "",
    codigoPostal: "",
    tipoIdentificacion: "INE",
    numeroIdentificacion: "",
    fecha: ""
  });

  // Filtrar clientes por búsqueda
  const clientesFiltrados = clientes.filter((cliente) =>
    cliente.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    (cliente.telefono && cliente.telefono.includes(busqueda)) ||
    (cliente.email && cliente.email.toLowerCase().includes(busqueda.toLowerCase()))
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
      nombre: cliente.nombre || "",
      telefono: cliente.telefono || "",
      email: cliente.email || "",
      direccion: cliente.direccion || "",
      colonia: cliente.colonia || "",
      ciudad: cliente.ciudad || "",
      codigoPostal: cliente.codigoPostal || "",
      tipoIdentificacion: cliente.tipoIdentificacion || "INE",
      numeroIdentificacion: cliente.numeroIdentificacion || "",
      fecha: cliente.fecha || ""
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
      
      
      <div className="content2 owner-header">
        {/* HEADER */}
        <div className="header-container ">
          <div className="tienda-header">
            <h1> <GroupIcon className="title-icon"/> Listado de clientes  
           <p className="header-sub">Gestiona y administra tus clientes</p>
           </h1>
          </div>
           
           
          <button className="btn-nuevo" onClick={() => navigate("nuevo")}>
            <AddIcon fontSize="small" />
            Nuevo Registro
          </button>
        </div>

        {/* BUSCADOR */}
        <div className="buscador-container">
          <SearchIcon className="buscador-icono" />
          <input
            className="buscador-input"
            placeholder="Buscar por nombre, teléfono o email..."
            value={busqueda}
            onChange={(e) => {
              setBusqueda(e.target.value);
              setPaginaActual(1);
            }}
          />
        </div>

        {/* TARJETA DE TABLA */}
        <div className="tabla-card">
          <h3> Total de registros: {clientesFiltrados.length}</h3>

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
                      <VisibilityIcon fontSize="small" />
                    </span>
                  </div>
                  <div className="tarjeta-cuerpo">
                    <div><PhoneIcon fontSize="small" /> {cliente.telefono}</div>
                    <div><EmailIcon fontSize="small" /> {cliente.email}</div>
                    <div><CalendarTodayIcon fontSize="small" /> {cliente.fecha}</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="sin-resultados">
                <SearchIcon className="empty-icon" />
                <p>No se encontraron clientes</p>
              </div>
            )}
          </div>

          {/* Vista desktop: tabla */}
          <div className="vista-desktop">
            <table>
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Teléfono</th>
                    <th>Email</th>
                    <th>Dirección</th>
                    <th>Identificación</th>
                    <th>Registro</th>
                  
                  </tr>
                </thead>
   <tbody>
  {clientesActuales.length > 0 ? (
    clientesActuales.map((cliente) => (
      <tr key={cliente.id}>
        <td><strong>{cliente.nombre}</strong></td>
        <td>{cliente.telefono}</td>
        <td>{cliente.email}</td>
        <td>{cliente.direccion || "No especificada"}</td>
        <td>{cliente.tipoIdentificacion || "INE"}</td>  {/* ← Esta columna faltaba */}
        <td>{cliente.fecha}</td>
        <td>
          <div className="acciones-container">
            <button 
              className="btn-accion ver"
              onClick={() => abrirDetalle(cliente)}
              title="Ver detalles"
            >
              <VisibilityIcon fontSize="small" />
            </button>
            <button 
              className="btn-accion editar"
              onClick={() => abrirModalEditar(cliente)}
              title="Editar"
            >
              <EditIcon fontSize="small" />
            </button>
            {/* Botón de eliminar comentado */}
          </div>
        </td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan="7" className="sin-resultados">
        <SearchIcon className="empty-icon" />
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
                  <ChevronLeftIcon />
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
                  <ChevronRightIcon />
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
            <button className="modal-cerrar" onClick={cerrarModal}>
              <CloseIcon />
            </button>
            
            <div className="modal-header">
              <h2>{clienteSeleccionado.nombre}</h2>
              
            </div>

            <div className="modal-body">
              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label"><PhoneIcon fontSize="small" /> Teléfono</span>
                  <span className="info-value">{clienteSeleccionado.telefono}</span>
                </div>
                <div className="info-item">
                  <span className="info-label"><EmailIcon fontSize="small" /> Email</span>
                  <span className="info-value">{clienteSeleccionado.email}</span>
                </div>
                <div className="info-item">
                  <span className="info-label"><LocationOnIcon fontSize="small" /> Dirección</span>
                  <span className="info-value">{clienteSeleccionado.direccion || "No especificada"}</span>
                </div>
                <div className="info-item">
                  <span className="info-label"><BadgeIcon fontSize="small" /> Identificación</span>
                  <span className="info-value">
                    {clienteSeleccionado.tipoIdentificacion || "INE"} 
                    {clienteSeleccionado.numeroIdentificacion ? ` - ${clienteSeleccionado.numeroIdentificacion}` : ''}
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label"><CalendarTodayIcon fontSize="small" /> Fecha Registro</span>
                  <span className="info-value">{clienteSeleccionado.fecha}</span>
                </div>
              </div>

              <div className="modal-secciones">
                <div className="seccion">
                  <h4><HistoryIcon /> Historial de Empeños</h4>
                  <p className="sin-datos">Sin empeños registrados</p>
                </div>

                <div className="seccion">
                  <h4><PaymentIcon /> Pagos Realizados</h4>
                  <p className="sin-datos">Sin pagos registrados</p>
                </div>
              </div>
            </div>

            <div className="modal-acciones">
              <button 
                className="btn-editar"
                onClick={() => abrirModalEditar(clienteSeleccionado)}
              >
                <EditIcon fontSize="small" />
                Editar
              </button>
              <button 
                className="btn-eliminar"
                onClick={() => confirmarEliminar(clienteSeleccionado)}
              >
                <DeleteIcon fontSize="small" />
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE EDICIÓN */}
      {modalEditarAbierto && clienteSeleccionado && (
        <div className="modal-overlay" onClick={cerrarModalEditar}>
          <div className="modal-editar" onClick={(e) => e.stopPropagation()}>
            <button className="modal-cerrar" onClick={cerrarModalEditar}>
              <CloseIcon />
            </button>
            
            <div className="modal-header">
              <h2>Editar Cliente</h2>
              <span className="cliente-id">ID: #{clienteSeleccionado.id}</span>
            </div>

            <form onSubmit={handleEditarSubmit}>
              <div className="modal-body">
                <div className="form-grid-modal">
                  <div className="form-group-modal full-width">
                    <label><PersonIcon fontSize="small" /> Nombre Completo *</label>
                    <input
                      type="text"
                      value={formEditar.nombre}
                      onChange={(e) => setFormEditar({...formEditar, nombre: e.target.value})}
                      required
                      placeholder="Ej: Juan Pérez"
                    />
                  </div>

                  <div className="form-group-modal">
                    <label><PhoneIcon fontSize="small" /> Teléfono *</label>
                    <input
                      type="tel"
                      value={formEditar.telefono}
                      onChange={(e) => setFormEditar({...formEditar, telefono: e.target.value})}
                      required
                      placeholder="Ej: 9992345674"
                    />
                  </div>

                  <div className="form-group-modal">
                    <label><EmailIcon fontSize="small" /> Email *</label>
                    <input
                      type="email"
                      value={formEditar.email}
                      onChange={(e) => setFormEditar({...formEditar, email: e.target.value})}
                      required
                      placeholder="Ej: cliente@email.com"
                    />
                  </div>

                  <div className="form-group-modal">
                    <label><BadgeIcon fontSize="small" /> Tipo de Identificación</label>
                    <select
                      value={formEditar.tipoIdentificacion}
                      onChange={(e) => setFormEditar({...formEditar, tipoIdentificacion: e.target.value})}
                    >
                      <option value="INE">INE</option>
                      <option value="Pasaporte">Pasaporte</option>
                      <option value="Cédula Profesional">Cédula Profesional</option>
                      <option value="Licencia de Conducir">Licencia de Conducir</option>
                      <option value="CURP">CURP</option>
                      <option value="Otro">Otro</option>
                    </select>
                  </div>

                  <div className="form-group-modal">
                    <label><AssignmentIndIcon fontSize="small" /> Número de Identificación</label>
                    <input
                      type="text"
                      value={formEditar.numeroIdentificacion}
                      onChange={(e) => setFormEditar({...formEditar, numeroIdentificacion: e.target.value})}
                      placeholder="Ej: INE12345678"
                    />
                  </div>

                  <div className="form-group-modal">
                    <label><LocationOnIcon fontSize="small" /> Dirección</label>
                    <input
                      type="text"
                      value={formEditar.direccion}
                      onChange={(e) => setFormEditar({...formEditar, direccion: e.target.value})}
                      placeholder="Calle y número"
                    />
                  </div>

                  <div className="form-group-modal">
                    <label>Colonia</label>
                    <input
                      type="text"
                      value={formEditar.colonia}
                      onChange={(e) => setFormEditar({...formEditar, colonia: e.target.value})}
                      placeholder="Ej: Centro"
                    />
                  </div>

                  <div className="form-group-modal">
                    <label>Ciudad</label>
                    <input
                      type="text"
                      value={formEditar.ciudad}
                      onChange={(e) => setFormEditar({...formEditar, ciudad: e.target.value})}
                      placeholder="Ej: Mérida"
                    />
                  </div>

                  <div className="form-group-modal">
                    <label>Código Postal</label>
                    <input
                      type="text"
                      value={formEditar.codigoPostal}
                      onChange={(e) => setFormEditar({...formEditar, codigoPostal: e.target.value})}
                      placeholder="Ej: 97000"
                    />
                  </div>

                  <div className="form-group-modal">
                    <label><CalendarTodayIcon fontSize="small" /> Fecha de Registro</label>
                    <input
                      type="text"
                      value={formEditar.fecha}
                      readOnly
                      className="campo-lectura"
                    />
                  </div>
                </div>
              </div>

              <div className="modal-acciones-editar">
                <button 
                className="btn-eliminar"
                onClick={() => confirmarEliminar(clienteSeleccionado)}
              >
                <DeleteIcon fontSize="small" />
                Eliminar
              </button>
                <button type="submit" className="btn-guardar-modal">
                  <EditIcon fontSize="small" />
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
            <div className="modal-icono">
              <WarningIcon fontSize="large" />
            </div>
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
                <DeleteIcon fontSize="small" />
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