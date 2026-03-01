import { useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import "./Inventario.css";

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

  const handleEditarSubmit = (e) => {
    e.preventDefault();
    editarPrenda(prendaSeleccionada.id, formEditar);
    cerrarModalEditar();
  };

  const confirmarEliminar = (prenda) => {
    setPrendaSeleccionada(prenda);
    setModalEliminar(true);
    setModalAbierto(false);
    setModalEditarAbierto(false);
  };

  const handleEliminar = () => {
    eliminarPrenda(prendaSeleccionada.id);
    setModalEliminar(false);
    setPrendaSeleccionada(null);
  };

  return (
    <>
      {/* HEADER */}
      <div className="header-container">
        <h2>Inventario</h2>
        <button
          className="btn-nuevo"
          onClick={() => navigate("/inventario/nuevo")}
        >
          + Nueva Prenda
        </button>
      </div>

      {/* FILTROS */}
      <div className="filtros-container">
        <div className="buscador-container">
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
                  <span 
                    className="detalle-link"
                    onClick={() => abrirDetalle(item)}
                  >
                    Ver detalles →
                  </span>
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
                      <button 
                        className="btn-accion ver"
                        onClick={() => abrirDetalle(item)}
                      >
                        Ver detalles
                      </button>
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

      {/* MODAL DE DETALLE */}
      {modalAbierto && prendaSeleccionada && (
        <div className="modal-overlay" onClick={cerrarModal}>
          <div className="modal-detalle" onClick={(e) => e.stopPropagation()}>
            <button className="modal-cerrar" onClick={cerrarModal}>×</button>
            
            <div className="modal-header">
              <h2>Detalle de Prenda</h2>
              <span className="cliente-id">ID: #{prendaSeleccionada.id}</span>
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

      {/* MODAL DE EDICIÓN - CON LOS CAMPOS DE LA IMAGEN */}
      {modalEditarAbierto && prendaSeleccionada && (
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

      {/* MODAL ELIMINAR */}
      {modalEliminar && prendaSeleccionada && (
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