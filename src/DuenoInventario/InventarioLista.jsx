// InventarioLista.jsx - VERSIÓN CORREGIDA (usando campos reales)

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Inventario.css";
import InventoryIcon from '@mui/icons-material/Inventory';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

// 📌 Servicio de inventario
import inventarioService from "../services/inventarioService";

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

  // Estado para el formulario de edición (Mapeado a campos reales)
  const [formEditar, setFormEditar] = useState({
    descripcion: "",      // ← nombre en frontend
    tipo: "",            // ← categoria en frontend
    material: "",
    peso_gramos: "",     // ← peso en frontend
    valor_estimado: "",  // ← valor en frontend
    estado: ""
  });

  // Categorías reales (de tu tabla)
  const categorias = ["Todas", "Joyería", "Electrónica", "Relojes", "Herramientas", "Instrumentos", "Otros"];
  const estados = ["Todos", "Disponible", "En Empeño", "Vendido", "Vencido", "Apartado"];

  // ========== CARGAR PRENDAS ==========
  useEffect(() => {
    cargarPrendas();
  }, []);

  // Línea ~56
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
    setPrendaSeleccionada(prenda);
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setPrendaSeleccionada(null);
  };

  const abrirModalEditar = (prenda) => {
    setPrendaSeleccionada(prenda);
    setFormEditar({
      descripcion: prenda.descripcion || "",
      tipo: prenda.tipo || "",
      material: prenda.material || "",
      peso_gramos: prenda.peso_gramos || "",
      valor_estimado: prenda.valor_estimado || "",
      estado: prenda.estado || ""
    });
    setModalEditarAbierto(true);
    setModalAbierto(false);
  };

  const cerrarModalEditar = () => {
    setModalEditarAbierto(false);
    setPrendaSeleccionada(null);
  };

  const handleEditarSubmit = async (e) => {
    e.preventDefault();
    try {
      await inventarioService.actualizarPrenda(prendaSeleccionada.id_prenda, formEditar);
      await cargarPrendas();
      cerrarModalEditar();
    } catch (err) {
      console.error("Error actualizando:", err);
      alert("Error al actualizar la prenda");
    }
  };

  const confirmarEliminar = (prenda) => {
    setPrendaSeleccionada(prenda);
    setModalEliminar(true);
    setModalAbierto(false);
    setModalEditarAbierto(false);
  };

  const handleEliminar = async () => {
    try {
      await inventarioService.eliminarPrenda(prendaSeleccionada.id_prenda);
      await cargarPrendas();
      setModalEliminar(false);
      setPrendaSeleccionada(null);
    } catch (err) {
      console.error("Error eliminando:", err);
      alert("Error al eliminar la prenda");
    }
  };

  // ========== RENDER ==========
  return (
    <>
      {/* HEADER */}
      <div className="header-container">
        <div className="tienda-header">
          <h1>
            <InventoryIcon className="title-icon" />
            Inventario
            <p className="header-sub">Gestiona todas las prendas del negocio</p>
          </h1>
        </div>
        <button
          className="btn-nuevo"
          onClick={() => navigate("/inventario/nuevo")}
        >
          <AddIcon />
          Nueva Prenda
        </button>
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

      {/* ERROR */}
      {error && <div className="error-message">{error}</div>}

      {/* TABLA */}
      {!loading && !error && (
        <div className="tabla-card">
          <h3>Lista de Prendas ({prendasFiltradas.length})</h3>

          {/* Vista móvil */}
          <div className="vista-movil">
            {prendasFiltradas.length > 0 ? (
              prendasFiltradas.map((item) => (
                <div key={item.id_prenda} className="inventario-tarjeta">
                  <div className="tarjeta-header">
                    <strong>{item.descripcion || "Sin nombre"}</strong>
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
                    </div>
                    {item.material && (
                      <div className="tarjeta-fila">
                        <span className="tarjeta-label">Material:</span>
                        <span>{item.material}</span>
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

          {/* Vista desktop */}
          <div className="vista-desktop">
            <table>
              <thead>
                <tr>
                  <th>Prenda</th>
                  <th>Categoría</th>
                  <th>Material</th>
                  <th>Valor Estimado</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {prendasFiltradas.length > 0 ? (
                  prendasFiltradas.map((item) => (
                    <tr key={item.id_prenda}>
                      <td><strong>{item.descripcion || "Sin nombre"}</strong></td>
                      <td>{item.tipo || "Sin categoría"}</td>
                      <td>{item.material || "-"}</td>
                      <td>${(item.valor_estimado || 0).toLocaleString()}</td>
                      <td>
                        <span className={`estado-badge estado-${item.estado?.toLowerCase().replace(/\s+/g, '-') || 'disponible'}`}>
                          {item.estado || "Disponible"}
                        </span>
                      </td>
                      <td>
                        <button 
                          className="btn-accion ver"
                          onClick={() => abrirDetalle(item)}
                          title="Ver detalles"
                        >
                          <VisibilityIcon fontSize="small" />
                        </button>
                        <button 
                          className="btn-accion editar"
                          onClick={() => abrirModalEditar(item)}
                          title="Editar"
                        >
                          <EditIcon fontSize="small" />
                        </button>
                        <button 
                          className="btn-accion eliminar"
                          onClick={() => confirmarEliminar(item)}
                          title="Eliminar"
                        >
                          <DeleteIcon fontSize="small" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="sin-resultados">
                      No se encontraron prendas
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODALES - Igual que antes pero con campos mapeados */}
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
              <button 
                className="btn-editar"
                onClick={() => abrirModalEditar(prendaSeleccionada)}
              >
                ✏️ Editar
              </button>
              <button 
                className="btn-eliminar"
                onClick={() => confirmarEliminar(prendaSeleccionada)}
              >
                🗑️ Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL EDITAR - Con campos mapeados */}
      {modalEditarAbierto && prendaSeleccionada && (
        <div className="modal-overlay" onClick={cerrarModalEditar}>
          <div className="modal-editar-prenda" onClick={(e) => e.stopPropagation()}>
            <button className="modal-cerrar" onClick={cerrarModalEditar}>×</button>
            
            <div className="modal-header">
              <h2>Editar Prenda</h2>
              <span className="cliente-id">ID: #{prendaSeleccionada.id_prenda}</span>
            </div>

            <form onSubmit={handleEditarSubmit}>
              <div className="modal-body">
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

      {/* MODAL ELIMINAR */}
      {modalEliminar && prendaSeleccionada && (
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