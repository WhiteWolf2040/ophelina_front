// InventarioLista.jsx - VERSIÓN FUSIONADA (Docker Base + Sistema de Permisos Local)
import { useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import "./Inventario.css";
import InventoryIcon from '@mui/icons-material/Inventory';
// Importar iconos de MUI
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
// ✅ AGREGADO DE LOCAL: Importar AddIcon y LockIcon
import AddIcon from '@mui/icons-material/Add';
import LockIcon from '@mui/icons-material/Lock';
// ✅ AGREGADO DE LOCAL: Importar servicio de permisos
import permissionService from "../services/permisoService";

const InventarioLista = () => {
  const navigate = useNavigate();
  const { inventario, eliminarPrenda, editarPrenda } = useOutletContext();
  
  const [busqueda, setBusqueda] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState("");
  const [estadoFiltro, setEstadoFiltro] = useState("");
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modalEditarAbierto, setModalEditarAbierto] = useState(false);
  const [prendaSeleccionada, setPrendaSeleccionada] = useState(null);
  const [modalEliminar, setModalEliminar] = useState(false);

  // ✅ AGREGADO DE LOCAL: VERIFICACIÓN DE PERMISOS
  const puedeVerTienda = permissionService.hasPermission('ver_tienda');
  const puedeCrearProductos = permissionService.hasPermission('crear_productos');
  const puedeEditarProductos = permissionService.hasPermission('editar_productos');
  const puedeEliminarProductos = permissionService.hasPermission('eliminar_productos');

  // ✅ AGREGADO DE LOCAL: REDIRIGIR SI NO TIENE PERMISO PARA VER
  if (!puedeVerTienda) {
    navigate('/dashboard');
    return null;
  }

  // Estado para el formulario de edición
  const [formEditar, setFormEditar] = useState({
    nombre: "",
    cliente: "",
    descripcion: "",
    categoria: "",
    peso: "",
    valor: "",
  });

  const categorias = ["Todas", "Joyería", "Electrónico", "Relojes", "Herramientas", "Otros"];
  const estados = ["Todos", "En Empeño", "Disponible", "Vendido", "Vencido"];

  const inventarioFiltrado = inventario.filter((item) => {
    const coincideBusqueda = item.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
                            item.categoria.toLowerCase().includes(busqueda.toLowerCase()) ||
                            (item.cliente && item.cliente.toLowerCase().includes(busqueda.toLowerCase()));
    
    const coincideCategoria = categoriaFiltro === "" || categoriaFiltro === "Todas" || item.categoria === categoriaFiltro;
    const coincideEstado = estadoFiltro === "" || estadoFiltro === "Todos" || item.estado === estadoFiltro;
    
    return coincideBusqueda && coincideCategoria && coincideEstado;
  });

  // ✅ MEJORADO CON LOCAL: abrirDetalle con validación de permisos
  const abrirDetalle = (prenda) => {
    if (!puedeVerTienda) {
      alert('No tienes permiso para ver detalles de prendas');
      return;
    }
    setPrendaSeleccionada(prenda);
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setPrendaSeleccionada(null);
  };

  // ✅ MEJORADO CON LOCAL: abrirModalEditar con validación de permisos
  const abrirModalEditar = (prenda) => {
    // Validar permiso para editar
    if (!puedeEditarProductos) {
      alert('No tienes permiso para editar prendas');
      return;
    }

    setPrendaSeleccionada(prenda);
    setFormEditar({
      nombre: prenda.nombre,
      cliente: prenda.cliente || "",
      descripcion: prenda.descripcion || "",
      categoria: prenda.categoria,
      peso: prenda.peso || "",
      valor: prenda.valor,
    });
    setModalEditarAbierto(true);
    setModalAbierto(false);
  };

  const cerrarModalEditar = () => {
    setModalEditarAbierto(false);
    setPrendaSeleccionada(null);
  };

  // ✅ MEJORADO CON LOCAL: handleEditarSubmit con validación de permisos
  const handleEditarSubmit = (e) => {
    e.preventDefault();
    
    // Validar permiso para editar
    if (!puedeEditarProductos) {
      alert('No tienes permiso para editar prendas');
      return;
    }

    editarPrenda(prendaSeleccionada.id, formEditar);
    cerrarModalEditar();
  };

  // ✅ MEJORADO CON LOCAL: confirmarEliminar con validación de permisos
  const confirmarEliminar = (prenda) => {
    // Validar permiso para eliminar
    if (!puedeEliminarProductos) {
      alert('No tienes permiso para eliminar prendas');
      return;
    }

    setPrendaSeleccionada(prenda);
    setModalEliminar(true);
    setModalAbierto(false);
    setModalEditarAbierto(false);
  };

  // ✅ MEJORADO CON LOCAL: handleEliminar con validación de permisos
  const handleEliminar = () => {
    // Validar permiso para eliminar
    if (!puedeEliminarProductos) {
      alert('No tienes permiso para eliminar prendas');
      return;
    }

    eliminarPrenda(prendaSeleccionada.id);
    setModalEliminar(false);
    setPrendaSeleccionada(null);
  };

  return (
    <>
      {/* HEADER */}
      <div className="header-container">
        <div className="tienda-header">
          <h1>
            <InventoryIcon className="title-icon" />
            Listado de prendas
            <p className="header-sub">Gestiona los productos en venta</p>
          </h1>
        </div>
        
        {/* ✅ AGREGADO DE LOCAL: Botón Nueva Prenda con permiso */}
        {puedeCrearProductos && (
          <button
            className="btn-nuevo"
            onClick={() => navigate("/inventario/nuevo")}
          >
            <AddIcon fontSize="small" /> Nueva Prenda
          </button>
        )}
      </div>

      {/* FILTROS */}
      <div className="filtros-container">
        <div className="buscador">
          <input
            type="text"
            placeholder="Buscar por nombre, categoría o cliente..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="buscador-input"
          />
        </div>

        <div className="filtros-selectores">
          <select
            value={categoriaFiltro}
            onChange={(e) => setCategoriaFiltro(e.target.value)}
            className="filtro-select"
          >
            <option value="">Todas las categorías</option>
            {categorias.filter(c => c !== "Todas").map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <select
            value={estadoFiltro}
            onChange={(e) => setEstadoFiltro(e.target.value)}
            className="filtro-select"
          >
            <option value="">Todos los estados</option>
            {estados.filter(e => e !== "Todos").map((est) => (
              <option key={est} value={est}>{est}</option>
            ))}
          </select>
        </div>

        {(busqueda || categoriaFiltro || estadoFiltro) && (
          <button
            className="btn-limpiar"
            onClick={() => {
              setBusqueda("");
              setCategoriaFiltro("");
              setEstadoFiltro("");
            }}
          >
            ✕ Limpiar filtros
          </button>
        )}
      </div>

      {/* TARJETA DE TABLA */}
      <div className="tabla-card">
        <h3>Lista de Prendas ({inventarioFiltrado.length})</h3>

        {/* Vista móvil: tarjetas */}
        <div className="vista-movil">
          {inventarioFiltrado.length > 0 ? (
            inventarioFiltrado.map((item) => (
              <div key={item.id} className="inventario-tarjeta">
                <div className="tarjeta-header">
                  <strong>{item.nombre}</strong>
                  {/* ✅ CORREGIDO: El onClick ahora pasa el item correctamente */}
                  <button 
                    className="btn-accion ver"
                    onClick={() => abrirDetalle(item)}
                    title="Ver detalles"
                  >
                    <VisibilityIcon fontSize="small" />
                  </button>
                </div>
                <div className="tarjeta-cuerpo">
                  <div className="tarjeta-fila">
                    <span className="tarjeta-label">Categoría:</span>
                    <span>{item.categoria}</span>
                  </div>
                  <div className="tarjeta-fila">
                    <span className="tarjeta-label">Valor:</span>
                    <span className="monto">${item.valor.toLocaleString()}</span>
                  </div>
                  <div className="tarjeta-fila">
                    <span className="tarjeta-label">Estado:</span>
                    <span className={`estado-badge estado-${item.estado.toLowerCase().replace(/\s+/g, '-')}`}>
                      {item.estado}
                    </span>
                  </div>
                  {item.cliente && (
                    <div className="tarjeta-fila">
                      <span className="tarjeta-label">Cliente:</span>
                      <span>{item.cliente}</span>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="sin-resultados">
              No se encontraron prendas con esos filtros
            </div>
          )}
        </div>

        {/* Vista desktop: tabla */}
        <div className="vista-desktop">
          <table>
            <thead>
              <tr>
                <th>Prenda</th>
                <th>Categoría</th>
                <th>Valor Estimado</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {inventarioFiltrado.length > 0 ? (
                inventarioFiltrado.map((item) => (
                  <tr key={item.id}>
                    <td><strong>{item.nombre}</strong></td>
                    <td>{item.categoria}</td>
                    <td>${item.valor.toLocaleString()}</td>
                    <td>
                      <span className={`estado-badge estado-${item.estado.toLowerCase().replace(/\s+/g, '-')}`}>
                        {item.estado}
                      </span>
                    </td>
                    <td>
                      <div className="acciones-container">
                        {/* ✅ BOTÓN VER - SIEMPRE VISIBLE */}
                        <button 
                          className="btn-accion ver"
                          onClick={() => abrirDetalle(item)}
                          title="Ver detalles"
                        >
                          <VisibilityIcon fontSize="small" />
                        </button>
                        
                        {/* ✅ AGREGADO DE LOCAL: BOTÓN EDITAR - SOLO CON PERMISO */}
                        {puedeEditarProductos && (
                          <button 
                            className="btn-accion editar"
                            onClick={() => abrirModalEditar(item)}
                            title="Editar prenda"
                          >
                            <EditIcon fontSize="small" />
                          </button>
                        )}
                        
                        {/* ✅ AGREGADO DE LOCAL: BOTÓN ELIMINAR - SOLO CON PERMISO */}
                        {puedeEliminarProductos && (
                          <button 
                            className="btn-accion eliminar"
                            onClick={() => confirmarEliminar(item)}
                            title="Eliminar prenda"
                          >
                            <DeleteIcon fontSize="small" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="sin-resultados">
                    No se encontraron prendas con esos filtros
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ============================================ */}
      {/* MODAL DE DETALLE - MEJORADO CON PERMISOS */}
      {/* ============================================ */}
      {modalAbierto && prendaSeleccionada && (
        <div className="modal-overlay" onClick={cerrarModal}>
          <div className="modal-detalle" onClick={(e) => e.stopPropagation()}>
            <button className="modal-cerrar" onClick={cerrarModal}>×</button>
            
            <div className="modal-header">
              <h2>Detalle de Prenda</h2>
            </div>

            <div className="modal-body">
              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label">📦 Prenda</span>
                  <span className="info-value">{prendaSeleccionada.nombre}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">👤 Cliente</span>
                  <span className="info-value">{prendaSeleccionada.cliente || "No asignado"}</span>
                </div>
                <div className="info-item full-width">
                  <span className="info-label">📝 Descripción</span>
                  <span className="info-value descripcion-texto">{prendaSeleccionada.descripcion || "Sin descripción"}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">📋 Categoría</span>
                  <span className="info-value">{prendaSeleccionada.categoria}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">⚖️ Peso</span>
                  <span className="info-value">{prendaSeleccionada.peso ? `${prendaSeleccionada.peso} g` : "No especificado"}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">💰 Valor</span>
                  <span className="info-value">${prendaSeleccionada.valor.toLocaleString()}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">📊 Estado</span>
                  <span className="info-value">
                    <span className={`estado-badge estado-${prendaSeleccionada.estado.toLowerCase().replace(/\s+/g, '-')}`}>
                      {prendaSeleccionada.estado}
                    </span>
                  </span>
                </div>
              </div>
            </div>

            {/* ✅ MEJORADO CON LOCAL: Acciones con permisos */}
            <div className="modal-acciones">
              {puedeEditarProductos && (
                <button 
                  className="btn-editar"
                  onClick={() => abrirModalEditar(prendaSeleccionada)}
                >
                  <EditIcon fontSize="small" /> Editar
                </button>
              )}
              
              {puedeEliminarProductos && (
                <button 
                  className="btn-eliminar"
                  onClick={() => confirmarEliminar(prendaSeleccionada)}
                >
                  <DeleteIcon fontSize="small" /> Eliminar
                </button>
              )}

              {/* ✅ AGREGADO DE LOCAL: Mensaje si no tiene permisos */}
              {!puedeEditarProductos && !puedeEliminarProductos && (
                <div className="sin-permisos-modal">
                  <LockIcon fontSize="small" /> 
                  <span>Solo visualización - No tienes permisos para modificar</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ============================================ */}
      {/* MODAL DE EDICIÓN - SOLO CON PERMISO */}
      {/* ============================================ */}
      {modalEditarAbierto && prendaSeleccionada && puedeEditarProductos && (
        <div className="modal-overlay" onClick={cerrarModalEditar}>
          <div className="modal-editar-prenda" onClick={(e) => e.stopPropagation()}>
            <button className="modal-cerrar" onClick={cerrarModalEditar}>×</button>
            
            <div className="modal-header">
              <h2>Editar Prenda</h2>
              <span className="cliente-id">ID: #{prendaSeleccionada.id}</span>
            </div>

            <form onSubmit={handleEditarSubmit}>
              <div className="modal-body">
                <div className="form-editar-grid">
                  {/* Prenda */}
                  <div className="form-group">
                    <label>Prenda</label>
                    <input
                      name="nombre"
                      value={formEditar.nombre}
                      onChange={(e) => setFormEditar({...formEditar, nombre: e.target.value})}
                      placeholder="Nombre de la prenda"
                      required
                    />
                  </div>

                  {/* Cliente */}
                  <div className="form-group">
                    <label>Cliente</label>
                    <input
                      name="cliente"
                      value={formEditar.cliente}
                      onChange={(e) => setFormEditar({...formEditar, cliente: e.target.value})}
                      placeholder="Nombre del cliente"
                    />
                  </div>

                  {/* Descripción - full width */}
                  <div className="form-group full-width">
                    <label>Descripción</label>
                    <textarea
                      name="descripcion"
                      value={formEditar.descripcion}
                      onChange={(e) => setFormEditar({...formEditar, descripcion: e.target.value})}
                      placeholder="Describe la prenda, características, estado físico..."
                      rows="3"
                      className="textarea-input"
                    />
                  </div>

                  {/* Categoría */}
                  <div className="form-group">
                    <label>Categoría</label>
                    <select
                      name="categoria"
                      value={formEditar.categoria}
                      onChange={(e) => setFormEditar({...formEditar, categoria: e.target.value})}
                      required
                    >
                      <option value="">Seleccionar</option>
                      {categorias.filter(c => c !== "Todas").map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  {/* Peso */}
                  <div className="form-group">
                    <label>Peso (gramos)</label>
                    <input
                      name="peso"
                      type="number"
                      value={formEditar.peso}
                      onChange={(e) => setFormEditar({...formEditar, peso: e.target.value})}
                      placeholder="Ej: 15.5"
                    />
                  </div>

                  {/* Valor estimado */}
                  <div className="form-group">
                    <label>Valor estimado</label>
                    <input
                      name="valor"
                      type="number"
                      value={formEditar.valor}
                      onChange={(e) => setFormEditar({...formEditar, valor: e.target.value})}
                      placeholder="Ej: 7000"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="modal-acciones-editar">
                <button type="submit" className="btn-guardar">
                  Guardar Cambios
                </button>
                <button type="button" className="btn-cancelar" onClick={cerrarModalEditar}>
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================ */}
      {/* MODAL ELIMINAR - SOLO CON PERMISO */}
      {/* ============================================ */}
      {modalEliminar && prendaSeleccionada && puedeEliminarProductos && (
        <div className="modal-overlay" onClick={() => setModalEliminar(false)}>
          <div className="modal-confirmar" onClick={(e) => e.stopPropagation()}>
            <div className="modal-icono">⚠️</div>
            <h3>¿Eliminar prenda?</h3>
            <p>Estás a punto de eliminar <strong>{prendaSeleccionada.nombre}</strong></p>
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
    </>
  );
};

export default InventarioLista;