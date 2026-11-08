// InventarioLista.jsx - VERSIÓN CORREGIDA (usando campos reales + imagen vía Cloudinary)

import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./Inventario.css";
import InventoryIcon from '@mui/icons-material/Inventory';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import LockIcon from '@mui/icons-material/Lock';
import permissionService from "../services/permisoService";

const InventarioLista = () => {
  const navigate = useNavigate();

  // ✅ Estados reales
  const [prendas, setPrendas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filtros
  const [busqueda, setBusqueda] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState("");
  const [estadoFiltro, setEstadoFiltro] = useState("");

  // Modales
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modalEditarAbierto, setModalEditarAbierto] = useState(false);
  const [prendaSeleccionada, setPrendaSeleccionada] = useState(null);
  const [modalEliminar, setModalEliminar] = useState(false);
  const [guardandoEdicion, setGuardandoEdicion] = useState(false);
  const [errorEdicion, setErrorEdicion] = useState("");

  const puedeVerTienda = permissionService.hasPermission('ver_tienda');
  const puedeCrearProductos = permissionService.hasPermission('crear_productos');
  const puedeEditarProductos = permissionService.hasPermission('editar_productos');
  const puedeEliminarProductos = permissionService.hasPermission('eliminar_productos');

  // ============================================
  // REDIRIGIR SI NO TIENE PERMISO PARA VER
  // ============================================
  if (!puedeVerTienda) {
    navigate('/dashboard');
    return null;
  }

  // Estado para el formulario de edición
  const [formEditar, setFormEditar] = useState({
    descripcion: "",      // ← nombre en frontend
    tipo: "",            // ← categoria en frontend
    material: "",
    peso_gramos: "",     // ← peso en frontend
    valor_estimado: "",  // ← valor en frontend
    estado: ""
  });

  // ✅ NUEVO: estado para la imagen dentro del modal de edición
  const [imagenEditar, setImagenEditar] = useState(null); // File real (si se elige una nueva)
  const [previewImagenEditar, setPreviewImagenEditar] = useState(""); // preview (nueva o la ya existente)
  const inputImagenEditarRef = useRef(null);

  // Categorías reales (de tu tabla)
  const categorias = ["Todas", "Joyería", "Electrónica", "Relojes", "Herramientas", "Instrumentos", "Otros"];
  const estados = ["Todos", "Disponible", "En Empeño", "Vendido", "Vencido", "Apartado"];

  // ========== CARGAR PRENDAS ==========
  useEffect(() => {
    cargarPrendas();
  }, []);

  const cargarPrendas = async () => {
    setLoading(true);
    try {
        const data = await inventarioService.getPrendas();
        console.log('Prendas recibidas:', data); // ← Verificar en consola
        setPrendas(data || []);
        setError(null);
    } catch (err) {
        console.error("Error cargando prendas:", err);
        setError("Error al cargar el inventario");
    } finally {
        setLoading(false);
    }
  };

  // ========== FILTRADO ==========
  const prendasFiltradas = prendas.filter((item) => {
    const coincideBusqueda = 
      item.descripcion?.toLowerCase().includes(busqueda.toLowerCase()) ||
      item.tipo?.toLowerCase().includes(busqueda.toLowerCase()) ||
      item.material?.toLowerCase().includes(busqueda.toLowerCase()) ||
      item.codigo_barras?.toLowerCase().includes(busqueda.toLowerCase());
    
    const coincideCategoria = categoriaFiltro === "" || categoriaFiltro === "Todas" || item.tipo === categoriaFiltro;
    const coincideEstado = estadoFiltro === "" || estadoFiltro === "Todos" || item.estado === estadoFiltro;
    
    return coincideBusqueda && coincideCategoria && coincideEstado;
  });

  // ========== CRUD ==========
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

  const limpiarImagenEditar = () => {
    setImagenEditar(null);
    if (previewImagenEditar && previewImagenEditar.startsWith("blob:")) {
      URL.revokeObjectURL(previewImagenEditar);
    }
    setPreviewImagenEditar("");
    if (inputImagenEditarRef.current) {
      inputImagenEditarRef.current.value = "";
    }
  };

  const abrirModalEditar = (prenda) => {
    //  Validar permiso para editar
    if (!puedeEditarProductos) {
      alert('No tienes permiso para editar prendas');
      return;
    }

    setPrendaSeleccionada(prenda);
    setFormEditar({
      descripcion: prenda.descripcion || "",
      tipo: prenda.tipo || "",
      material: prenda.material || "",
      peso_gramos: prenda.peso_gramos || "",
      valor_estimado: prenda.valor_estimado || "",
      estado: prenda.estado || ""
    });
    setErrorEdicion("");
    setImagenEditar(null);
    // ✅ NUEVO: si la prenda ya tiene imagen, se muestra como preview inicial
    setPreviewImagenEditar(prenda.imagen_url || "");
    setModalEditarAbierto(true);
    setModalAbierto(false);
  };

  const cerrarModalEditar = () => {
    setModalEditarAbierto(false);
    setPrendaSeleccionada(null);
    limpiarImagenEditar();
  };

  // ✅ NUEVO: selección de nueva imagen dentro del modal de edición
  const handleFileChangeEditar = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const tiposPermitidos = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!tiposPermitidos.includes(file.type)) {
      alert('Solo se permiten imágenes (JPEG, PNG, GIF, WEBP)');
      e.target.value = '';
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('La imagen no debe superar los 5MB');
      e.target.value = '';
      return;
    }

    if (previewImagenEditar && previewImagenEditar.startsWith("blob:")) {
      URL.revokeObjectURL(previewImagenEditar);
    }

    setImagenEditar(file);
    setPreviewImagenEditar(URL.createObjectURL(file));
  };

  const handleEditarSubmit = async (e) => {
    e.preventDefault();
    
    //  Validar permiso para editar
    if (!puedeEditarProductos) {
      alert('No tienes permiso para editar prendas');
      return;
    }

    editarPrenda(prendaSeleccionada.id, formEditar);
    cerrarModalEditar();
  };

  const confirmarEliminar = (prenda) => {
    //  Validar permiso para eliminar
    if (!puedeEliminarProductos) {
      alert('No tienes permiso para eliminar prendas');
      return;
    }

    setPrendaSeleccionada(prenda);
    setModalEliminar(true);
    setModalAbierto(false);
    setModalEditarAbierto(false);
  };

  const handleEliminar = () => {
    //  Validar permiso para eliminar
    if (!puedeEliminarProductos) {
      alert('No tienes permiso para eliminar prendas');
      return;
    }

    eliminarPrenda(prendaSeleccionada.id);
    setModalEliminar(false);
    setPrendaSeleccionada(null);
  };

  // ========== RENDER ==========
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
            placeholder="Buscar por nombre, categoría, material o código..."
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

      {/* LOADING */}
      {loading && <div className="loading">Cargando inventario...</div>}

        {/* Vista móvil: tarjetas */}
        <div className="vista-movil">
          {inventarioFiltrado.length > 0 ? (
            inventarioFiltrado.map((item) => (
              <div key={item.id} className="inventario-tarjeta">
                <div className="tarjeta-header">
                  <strong>{item.nombre}</strong>
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
                  <div className="tarjeta-cuerpo">
                    <div className="tarjeta-fila">
                      <span className="tarjeta-label">Categoría:</span>
                      <span>{item.tipo || "Sin categoría"}</span>
                    </div>
                    <div className="tarjeta-fila">
                      <span className="tarjeta-label">Valor:</span>
                      <span className="monto">${(item.valor_estimado || 0).toLocaleString()}</span>
                    </div>
                    <div className="tarjeta-fila">
                      <span className="tarjeta-label">Estado:</span>
                      <span className={`estado-badge estado-${item.estado?.toLowerCase().replace(/\s+/g, '-') || 'disponible'}`}>
                        {item.estado || "Disponible"}
                      </span>
                    </td>
                    <td>
                      <div className="acciones-container">
                 
                        <button 
                          className="btn-accion ver"
                          onClick={() => abrirDetalle(item)}
                          title="Ver detalles"
                        >
                          <VisibilityIcon fontSize="small" />
                        </button>
                        
                     
                        {puedeEditarProductos && (
                          <button 
                            className="btn-accion editar"
                            onClick={() => abrirModalEditar(item)}
                            title="Editar prenda"
                          >
                            <EditIcon fontSize="small" />
                          </button>
                        )}
                        
                    
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
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {modalAbierto && prendaSeleccionada && (
        <div className="modal-overlay" onClick={cerrarModal}>
          <div className="modal-detalle" onClick={(e) => e.stopPropagation()}>
            <button className="modal-cerrar" onClick={cerrarModal}>×</button>
            
            <div className="modal-header">
              <h2>Detalle de Prenda</h2>
            </div>

            <div className="modal-body">
              {/* ✅ NUEVO: imagen de la prenda, si tiene */}
              {prendaSeleccionada.imagen_url && (
                <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                  <img
                    src={prendaSeleccionada.imagen_url}
                    alt={prendaSeleccionada.descripcion || 'Prenda'}
                    style={{ maxWidth: '220px', maxHeight: '220px', borderRadius: '8px', objectFit: 'cover' }}
                  />
                </div>
              )}

              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label">📦 Prenda</span>
                  <span className="info-value">{prendaSeleccionada.descripcion || "Sin nombre"}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">📋 Categoría</span>
                  <span className="info-value">{prendaSeleccionada.tipo || "Sin categoría"}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">🔧 Material</span>
                  <span className="info-value">{prendaSeleccionada.material || "No especificado"}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">⚖️ Peso</span>
                  <span className="info-value">{prendaSeleccionada.peso_gramos ? `${prendaSeleccionada.peso_gramos} g` : "No especificado"}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">💰 Valor Estimado</span>
                  <span className="info-value">${(prendaSeleccionada.valor_estimado || 0).toLocaleString()}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">📊 Estado</span>
                  <span className="info-value">
                    <span className={`estado-badge estado-${prendaSeleccionada.estado?.toLowerCase().replace(/\s+/g, '-') || 'disponible'}`}>
                      {prendaSeleccionada.estado || "Disponible"}
                    </span>
                  </span>
                </div>
                <div className="info-item full-width">
                  <span className="info-label">📝 Descripción</span>
                  <span className="info-value descripcion-texto">{prendaSeleccionada.descripcion || "Sin descripción"}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">🔢 Código</span>
                  <span className="info-value">{prendaSeleccionada.codigo_barras || "Sin código"}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">📅 Fecha Registro</span>
                  <span className="info-value">{prendaSeleccionada.fecha_registro ? new Date(prendaSeleccionada.fecha_registro).toLocaleDateString() : "N/A"}</span>
                </div>
              </div>
            </div>

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

              {/* Mostrar mensaje si no tiene permisos para modificar */}
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

  
      {modalEditarAbierto && prendaSeleccionada && puedeEditarProductos && (
        <div className="modal-overlay" onClick={cerrarModalEditar}>
          <div className="modal-editar-prenda" onClick={(e) => e.stopPropagation()}>
            <button className="modal-cerrar" onClick={cerrarModalEditar}>×</button>
            
            <div className="modal-header">
              <h2>Editar Prenda</h2>
              <span className="cliente-id">ID: #{prendaSeleccionada.id_prenda}</span>
            </div>

            <form onSubmit={handleEditarSubmit}>
              <div className="modal-body">
                {errorEdicion && (
                  <div className="error-message" style={{ marginBottom: '16px' }}>
                    {errorEdicion}
                  </div>
                )}

                <div className="form-editar-grid">
                  <div className="form-group">
                    <label>Nombre de la prenda *</label>
                    <input
                      name="descripcion"
                      value={formEditar.descripcion}
                      onChange={(e) => setFormEditar({...formEditar, descripcion: e.target.value})}
                      placeholder="Ej: Anillo de Oro 18k"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Categoría *</label>
                    <select
                      name="tipo"
                      value={formEditar.tipo}
                      onChange={(e) => setFormEditar({...formEditar, tipo: e.target.value})}
                      required
                    >
                      <option value="">Seleccionar</option>
                      {categorias.filter(c => c !== "Todas").map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Material</label>
                    <input
                      name="material"
                      value={formEditar.material}
                      onChange={(e) => setFormEditar({...formEditar, material: e.target.value})}
                      placeholder="Ej: Oro, Plata, Acero"
                    />
                  </div>

                  <div className="form-group">
                    <label>Peso (gramos)</label>
                    <input
                      name="peso_gramos"
                      type="number"
                      step="0.01"
                      value={formEditar.peso_gramos}
                      onChange={(e) => setFormEditar({...formEditar, peso_gramos: e.target.value})}
                      placeholder="Ej: 15.5"
                    />
                  </div>

                  <div className="form-group">
                    <label>Valor Estimado ($) *</label>
                    <input
                      name="valor_estimado"
                      type="number"
                      value={formEditar.valor_estimado}
                      onChange={(e) => setFormEditar({...formEditar, valor_estimado: e.target.value})}
                      placeholder="Ej: 7000"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Estado *</label>
                    <select
                      name="estado"
                      value={formEditar.estado}
                      onChange={(e) => setFormEditar({...formEditar, estado: e.target.value})}
                      required
                    >
                      <option value="">Seleccionar</option>
                      {estados.filter(e => e !== "Todos").map((est) => (
                        <option key={est} value={est}>{est}</option>
                      ))}
                    </select>
                  </div>

                  {/* ✅ NUEVO: subir/reemplazar imagen */}
                  <div className="form-group full-width">
                    <label>Imagen de la prenda</label>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/gif,image/webp"
                      onChange={handleFileChangeEditar}
                      ref={inputImagenEditarRef}
                      className="file-input"
                    />
                    <small className="file-hint">
                      Deja este campo vacío para conservar la imagen actual. Formatos: JPG, PNG, GIF, WEBP | Máx: 5MB
                    </small>

                    {previewImagenEditar && (
                      <div className="image-preview-container">
                        <img
                          src={previewImagenEditar}
                          alt="Vista previa"
                          className="image-preview"
                        />
                        {imagenEditar && (
                          <button
                            type="button"
                            onClick={limpiarImagenEditar}
                            className="btn-remove-image"
                          >
                            Cancelar cambio de imagen
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="modal-acciones-editar">
                <button type="submit" className="btn-guardar" disabled={guardandoEdicion}>
                  {guardandoEdicion ? "Guardando..." : "Guardar Cambios"}
                </button>
                <button type="button" className="btn-cancelar" onClick={cerrarModalEditar} disabled={guardandoEdicion}>
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}


      {modalEliminar && prendaSeleccionada && puedeEliminarProductos && (
        <div className="modal-overlay" onClick={() => setModalEliminar(false)}>
          <div className="modal-confirmar" onClick={(e) => e.stopPropagation()}>
            <div className="modal-icono">⚠️</div>
            <h3>¿Eliminar prenda?</h3>
            <p>Estás a punto de eliminar <strong>{prendaSeleccionada.descripcion || "esta prenda"}</strong></p>
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