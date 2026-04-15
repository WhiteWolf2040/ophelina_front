import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import "./Clientes.css";
import clientesService from "../services/clientesService";

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
import PinIcon from '@mui/icons-material/Room';

const ClientesLista = () => {
  const [clientes, setClientes] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modalEditarAbierto, setModalEditarAbierto] = useState(false);
  const [modalEliminar, setModalEliminar] = useState(false);
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);

  const [formEditar, setFormEditar] = useState({
    nombre: "",
    telefono: "",
    email: "",
    direccion: "",
    ciudad: "",
    codigoPostal: "",
    tipoIdentificacion: "INE",
    numeroIdentificacion: "",
    fecha: ""
  });

  // Paginación
  const [paginaActual, setPaginaActual] = useState(1);
  const clientesPorPagina = 8;

  const navigate = useNavigate();

  useEffect(() => {
    cargarClientes();
  }, []);

  const cargarClientes = async () => {
    try {
      const response = await clientesService.obtenerClientes();
      const data = response.data || response;

      const clientesAdaptados = data.map(cliente => ({
        ...cliente,
        email: cliente.correo,
        fecha: cliente.fecha_registro,
        tipoIdentificacion: cliente.tipo_identificacion,
        numeroIdentificacion: cliente.numero_identificacion,
        codigoPostal: cliente.codigo_postal
      }));

      setClientes(clientesAdaptados);
    } catch (error) {
      console.error("Error cargando clientes", error);
    }
  };

  const clientesFiltrados = clientes.filter((cliente) =>
    (cliente.nombre || "").toLowerCase().includes(busqueda.toLowerCase()) ||
    (cliente.telefono || "").includes(busqueda) ||
    (cliente.email || "").toLowerCase().includes(busqueda.toLowerCase())
  );

  const indiceUltimo = paginaActual * clientesPorPagina;
  const indicePrimero = indiceUltimo - clientesPorPagina;
  const clientesActuales = clientesFiltrados.slice(indicePrimero, indiceUltimo);
  const totalPaginas = Math.ceil(clientesFiltrados.length / clientesPorPagina);

  const abrirDetalle = async (cliente) => {
    try {
      if (!cliente.id_cliente) {
        console.error("ERROR: El cliente no tiene id_cliente");
        return;
      }

      const response = await clientesService.obtenerCliente(cliente.id_cliente);
      const clienteData = response?.data || response;

      if (!clienteData) {
        console.warn("No se encontró información del cliente");
        return;
      }

      setClienteSeleccionado(clienteData);
      setModalAbierto(true);
      
    } catch (error) {
      console.error("Error cargando detalles del cliente", error);
    }
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setTimeout(() => {
      setClienteSeleccionado(null);
    }, 300);
  };

  const abrirModalEditar = (cliente) => {
    const clienteParaEditar = cliente || clienteSeleccionado;
    
    setFormEditar({
      nombre: clienteParaEditar.nombre || "",
      telefono: clienteParaEditar.telefono || "",
      email: clienteParaEditar.email || clienteParaEditar.correo || "",
      direccion: clienteParaEditar.direccion || "",
      ciudad: clienteParaEditar.ciudad || "",
      codigoPostal: clienteParaEditar.codigoPostal || clienteParaEditar.codigo_postal || "",
      tipoIdentificacion: clienteParaEditar.tipoIdentificacion || clienteParaEditar.tipo_identificacion || "INE",
      numeroIdentificacion: clienteParaEditar.numeroIdentificacion || clienteParaEditar.numero_identificacion || "",
      fecha: clienteParaEditar.fecha || clienteParaEditar.fecha_registro || ""
    });
    
    setClienteSeleccionado(clienteParaEditar);
    setModalEditarAbierto(true);
  };

  const cerrarModalEditar = () => {
    setModalEditarAbierto(false);
    setClienteSeleccionado(null);
  };

  const handleEditarSubmit = async (e) => {
    e.preventDefault();
    try {
      await editarCliente(clienteSeleccionado.id_cliente, formEditar);
      cerrarModalEditar();
      // Recargar la lista para mostrar los cambios
      cargarClientes();
    } catch (error) {
      console.error("Error al guardar cambios", error);
    }
  };

  const confirmarEliminar = (cliente) => {
    setClienteSeleccionado(cliente);
    setModalEliminar(true);
  };

  const handleEliminar = async () => {
    try {
      await clientesService.eliminarCliente(clienteSeleccionado.id_cliente);
      setClientes(clientes.filter(c => c.id_cliente !== clienteSeleccionado.id_cliente));
      setModalEliminar(false);
      setModalAbierto(false);
      setClienteSeleccionado(null);
    } catch (error) {
      console.error("Error eliminando cliente", error);
    }
  };

  const cambiarPagina = (numeroPagina) => setPaginaActual(numeroPagina);
  const irPaginaSiguiente = () => setPaginaActual(prev => Math.min(prev + 1, totalPaginas));
  const irPaginaAnterior = () => setPaginaActual(prev => Math.max(prev - 1, 1));

  const obtenerNumerosPagina = () => {
    const numeros = [];
    const maxPaginasVisibles = 5;
    let inicio = Math.max(1, paginaActual - Math.floor(maxPaginasVisibles / 2));
    let fin = Math.min(totalPaginas, inicio + maxPaginasVisibles - 1);
    if (fin - inicio + 1 < maxPaginasVisibles) inicio = Math.max(1, fin - maxPaginasVisibles + 1);
    for (let i = inicio; i <= fin; i++) numeros.push(i);
    return numeros;
  };

  const editarCliente = async (id, datos) => {
    try {
      const datosEnviar = {
        nombre: datos.nombre,
        telefono: datos.telefono,
        correo: datos.email,
        direccion: datos.direccion,
        codigo_postal: datos.codigoPostal,
        ciudad: datos.ciudad,
        tipo_identificacion: datos.tipoIdentificacion,
        numero_identificacion: datos.numeroIdentificacion
      };
      await clientesService.actualizarCliente(id, datosEnviar);
    } catch (error) {
      console.error("Error editando cliente", error);
      throw error;
    }
  };

  return (
    <div className="dashboard">
      <div className="content2 owner-header">
        {/* HEADER */}
        <div className="header-container">
          <div className="tienda-header">
            <h1>
              <GroupIcon className="title-icon"/> Listado de clientes
              <p className="header-sub">Gestiona y administra tus clientes</p>
            </h1>
          </div>
          <button className="btn-nuevo" onClick={() => navigate("nuevo")}>
            <AddIcon fontSize="small" /> Nuevo Registro
          </button>
        </div>

        {/* BUSCADOR */}
        <div className="buscador-container">
          <SearchIcon className="buscador-icono" />
          <input
            className="buscador-input"
            placeholder="Buscar por nombre, teléfono o email..."
            value={busqueda}
            onChange={(e) => { setBusqueda(e.target.value); setPaginaActual(1); }}
          />
        </div>

        {/* TARJETA DE TABLA */}
        <div className="tabla-card">
          <h3> Total de registros: {clientesFiltrados.length}</h3>

          {/* Vista móvil */}
          <div className="vista-movil">
            {clientesActuales.length > 0 ? (
              clientesActuales.map((cliente) => (
                <div key={cliente.id_cliente} className="cliente-tarjeta">
                  <div className="tarjeta-header">
                    <strong>{cliente.nombre}</strong>
                    <span className="detalle-link" onClick={() => abrirDetalle(cliente)}>
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

          {/* Vista desktop */}
          <div className="vista-desktop">
            <table>
              <thead>
                <tr>
                  <th><PersonIcon className="title-icon" />Nombre </th>
                  <th><PhoneIcon fontSize="small" className="table-icon" />Teléfono</th>
                  <th><EmailIcon fontSize="small" className="table-icon" /> Email</th>
                  <th><LocationOnIcon fontSize="small" className="table-icon" /> Dirección</th>
                  <th><CalendarTodayIcon fontSize="small" className="table-icon" /> Registro</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {clientesActuales.length > 0 ? (
                  clientesActuales.map((cliente) => (
                    <tr key={cliente.id_cliente}>
                      <td><strong>{cliente.nombre}</strong></td>
                      <td>{cliente.telefono}</td>
                      <td>{cliente.email}</td>
                      <td>{cliente.direccion || "No especificada"}</td>
                      <td>{cliente.fecha}</td>
                      <td>
                        <div className="acciones-container">
                          <button className="btn-accion ver" onClick={() => abrirDetalle(cliente)}>
                            <VisibilityIcon fontSize="small" />
                          </button>
                          <button className="btn-accion editar" onClick={() => abrirModalEditar(cliente)}>
                            <EditIcon fontSize="small" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="sin-resultados">
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
                <button className="btn-paginacion" onClick={irPaginaAnterior} disabled={paginaActual === 1}>
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
                <button className="btn-paginacion" onClick={irPaginaSiguiente} disabled={paginaActual === totalPaginas}>
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

      {/* MODAL DE DETALLE */}
      {modalAbierto && clienteSeleccionado && (
        <div className="modal-overlay" onClick={cerrarModal}>
          <div className="modal-detalle" onClick={(e) => e.stopPropagation()}>
            <button className="modal-cerrar" onClick={cerrarModal}>
              <CloseIcon />
            </button>
            
            <div className="modal-header">
              <h2>{clienteSeleccionado.nombre} {clienteSeleccionado.apellido || ''}</h2>
            </div>

            <div className="modal-body">
              {/* Grid de información personal */}
              <div className="info-grid-detalle">
                <div className="info-item">
                  <span className="info-label">
                    <PhoneIcon fontSize="small" /> Teléfono
                  </span>
                  <span className="info-value">{clienteSeleccionado.telefono}</span>
                </div>
                
                <div className="info-item">
                  <span className="info-label">
                    <EmailIcon fontSize="small" /> Email
                  </span>
                  <span className="info-value">{clienteSeleccionado.email}</span>
                </div>
                
                <div className="info-item">
                  <span className="info-label">
                    <LocationOnIcon fontSize="small" /> Dirección
                  </span>
                  <span className="info-value">{clienteSeleccionado.direccion || "No especificada"}</span>
                </div>
                
                <div className="info-item">
                  <span className="info-label">
                    <LocationOnIcon fontSize="small" /> Ciudad
                  </span>
                  <span className="info-value">{clienteSeleccionado.ciudad || "No especificada"}</span>
                </div>
                
                <div className="info-item">
                  <span className="info-label">
                    <PinIcon fontSize="small" /> Código Postal
                  </span>
                  <span className="info-value">{clienteSeleccionado.codigoPostal || "No especificado"}</span>
                </div>
                
                <div className="info-item">
                  <span className="info-label">
                    <BadgeIcon fontSize="small" /> Tipo ID
                  </span>
                  <span className="info-value">{clienteSeleccionado.tipoIdentificacion || "INE"}</span>
                </div>
                
                <div className="info-item">
                  <span className="info-label">
                    <AssignmentIndIcon fontSize="small" /> Número ID
                  </span>
                  <span className="info-value">{clienteSeleccionado.numeroIdentificacion || "No especificado"}</span>
                </div>
                
                <div className="info-item">
                  <span className="info-label">
                    <CalendarTodayIcon fontSize="small" /> Fecha Registro
                  </span>
                  <span className="info-value">{clienteSeleccionado.fecha}</span>
                </div>
              </div>

              {/* Secciones de historial */}
              <div className="modal-secciones">
                {/* Historial de Empeños */}
                <div className="seccion">
                  <h4>
                    <HistoryIcon /> Historial de Empeños 
                    <span className="cliente-id">({clienteSeleccionado.empenos?.length || 0})</span>
                  </h4>
                  
                  {clienteSeleccionado.empenos && clienteSeleccionado.empenos.length > 0 ? (
                    <div className="lista-empenos">
                      {clienteSeleccionado.empenos.map((empeno) => (
                        <div key={empeno.id_empeno} className="item-empeno" style={{
                          background: 'white',
                          borderRadius: '8px',
                          padding: '12px',
                          marginBottom: '10px',
                          border: '1px solid #e0e0e0'
                        }}>
                          <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            marginBottom: '8px',
                            paddingBottom: '8px',
                            borderBottom: '1px solid #eee'
                          }}>
                            <span style={{ fontWeight: 500, color: '#666' }}>
                              {empeno.fecha_empeno}
                            </span>
                            <span style={{ fontWeight: 600, color: '#d3b372' }}>
                              ${empeno.monto}
                            </span>
                          </div>
                          
                          <div className="empeno-pagos">
                            <strong style={{ color: '#666', fontSize: '0.9rem' }}>
                              Pagos ({empeno.pagos?.length || 0}):
                            </strong>
                            {empeno.pagos && empeno.pagos.length > 0 ? (
                              <ul style={{ 
                                listStyle: 'none', 
                                padding: 0, 
                                margin: '8px 0 0 0' 
                              }}>
                                {empeno.pagos.map((pago) => (
                                  <li key={pago.id_pago} style={{
                                    padding: '4px 0',
                                    color: '#333',
                                    fontSize: '0.9rem',
                                    borderBottom: '1px dashed #eee'
                                  }}>
                                    {pago.fecha_pago}: ${pago.monto}
                                    {pago.metodo_pago && ` (${pago.metodo_pago})`}
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <p className="sin-datos" style={{ margin: '8px 0 0 0' }}>
                                Sin pagos registrados
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="sin-datos">Sin empeños registrados</p>
                  )}
                </div>

                {/* Resumen de Pagos */}
                <div className="seccion">
                  <h4>
                    <PaymentIcon /> Todos los Pagos
                    <span className="cliente-id">({clienteSeleccionado.pagos?.length || 0})</span>
                  </h4>
                  
                  {clienteSeleccionado.pagos && clienteSeleccionado.pagos.length > 0 ? (
                    <ul style={{ 
                      listStyle: 'none', 
                      padding: 0, 
                      margin: 0,
                      maxHeight: '300px',
                      overflowY: 'auto'
                    }}>
                      {clienteSeleccionado.pagos.slice(0, 10).map((pago) => (
                        <li key={pago.id_pago} style={{
                          padding: '8px',
                          borderBottom: '1px solid #eee',
                          display: 'flex',
                          justifyContent: 'space-between',
                          fontSize: '0.9rem'
                        }}>
                          <span>{pago.fecha_pago}</span>
                          <span style={{ fontWeight: 600, color: '#d3b372' }}>
                            ${pago.monto}
                          </span>
                        </li>
                      ))}
                      {clienteSeleccionado.pagos.length > 10 && (
                        <li style={{
                          padding: '8px',
                          textAlign: 'center',
                          color: '#666',
                          fontStyle: 'italic'
                        }}>
                          ... y {clienteSeleccionado.pagos.length - 10} pagos más
                        </li>
                      )}
                    </ul>
                  ) : (
                    <p className="sin-datos">Sin pagos registrados</p>
                  )}
                </div>
              </div>
            </div>

            {/* Acciones del modal */}
            <div className="modal-acciones">
              <button 
                className="btn-editar" 
                onClick={() => {
                  setModalAbierto(false);
                  abrirModalEditar(clienteSeleccionado);
                }}
              >
                <EditIcon fontSize="small" /> Editar
              </button>
              <button 
                className="btn-eliminar" 
                onClick={() => confirmarEliminar(clienteSeleccionado)}
              >
                <DeleteIcon fontSize="small" /> Eliminar
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
            </div>

            <form onSubmit={handleEditarSubmit}>
              <div className="modal-body">
                <div className="form-grid-modal">
                  <div className="form-group-modal">
                    <label>Nombre *</label>
                    <input
                      type="text"
                      value={formEditar.nombre}
                      onChange={(e) => setFormEditar({...formEditar, nombre: e.target.value})}
                      required
                    />
                  </div>

                  <div className="form-group-modal">
                    <label>Teléfono *</label>
                    <input
                      type="text"
                      value={formEditar.telefono}
                      onChange={(e) => setFormEditar({...formEditar, telefono: e.target.value})}
                      required
                    />
                  </div>

                  <div className="form-group-modal">
                    <label>Email</label>
                    <input
                      type="email"
                      value={formEditar.email}
                      onChange={(e) => setFormEditar({...formEditar, email: e.target.value})}
                    />
                  </div>

                  <div className="form-group-modal">
                    <label>Dirección</label>
                    <input
                      type="text"
                      value={formEditar.direccion}
                      onChange={(e) => setFormEditar({...formEditar, direccion: e.target.value})}
                    />
                  </div>

                  <div className="form-group-modal">
                    <label>Ciudad</label>
                    <input
                      type="text"
                      value={formEditar.ciudad}
                      onChange={(e) => setFormEditar({...formEditar, ciudad: e.target.value})}
                    />
                  </div>

                  <div className="form-group-modal">
                    <label>Código Postal</label>
                    <input
                      type="text"
                      value={formEditar.codigoPostal}
                      onChange={(e) => setFormEditar({...formEditar, codigoPostal: e.target.value})}
                    />
                  </div>

                  <div className="form-group-modal">
                    <label>Tipo de Identificación</label>
                    <input
                      type="text"
                      value={formEditar.tipoIdentificacion}
                      onChange={(e) => setFormEditar({...formEditar, tipoIdentificacion: e.target.value})}
                    />
                  </div>

                  <div className="form-group-modal">
                    <label>Número de Identificación</label>
                    <input
                      type="text"
                      value={formEditar.numeroIdentificacion}
                      onChange={(e) => setFormEditar({...formEditar, numeroIdentificacion: e.target.value})}
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

      {/* MODAL DE CONFIRMAR ELIMINACIÓN */}
      {modalEliminar && clienteSeleccionado && (
        <div className="modal-overlay" onClick={() => setModalEliminar(false)}>
          <div className="modal-confirmar" onClick={(e) => e.stopPropagation()}>
            <div className="modal-icono">
              <WarningIcon style={{ fontSize: 64, color: '#dc3545' }} />
            </div>
            <h3>¿Eliminar Cliente?</h3>
            <p>¿Estás seguro de que deseas eliminar a <strong>{clienteSeleccionado.nombre}</strong>?</p>
            <p className="advertencia">Esta acción no se puede deshacer.</p>
            
            <div className="modal-botones">
              <button className="btn-cancelar" onClick={() => setModalEliminar(false)}>
                Cancelar
              </button>
              <button className="btn-confirmar-eliminar" onClick={handleEliminar}>
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientesLista;