// TiendaOnline.jsx
import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import "./TiendaOnline.css";

const TiendaOnline = () => {
  // Estados para productos
  const [productos, setProductos] = useState([
    {
      id: 1,
      nombre: "Anillo de Oro 18k",
      categoria: "Joyería",
      precio: 8500,
      descuento: 10,
      stock: 3,
      imagen: "https://via.placeholder.com/300x200?text=Anillo+Oro",
      descripcion: "Anillo de oro 18k con grabado floral, tamaño 7",
      estado: "Como nuevo",
      visible: true,
      destacado: true,
      fechaPublicacion: "2024-02-15"
    },
    {
      id: 2,
      nombre: "Smartwatch Samsung",
      categoria: "Electrónica",
      precio: 3200,
      descuento: 0,
      stock: 1,
      imagen: "https://via.placeholder.com/300x200?text=Smartwatch",
      descripcion: "Smartwatch Samsung Galaxy Watch 4, 44mm, color negro",
      estado: "Buen estado",
      visible: true,
      destacado: false,
      fechaPublicacion: "2024-02-20"
    },
    {
      id: 3,
      nombre: "Collar de Plata",
      categoria: "Joyería",
      precio: 1800,
      descuento: 15,
      stock: 2,
      imagen: "https://via.placeholder.com/300x200?text=Collar+Plata",
      descripcion: "Collar de plata ley 925 con dije de corazón",
      estado: "Nuevo",
      visible: true,
      destacado: true,
      fechaPublicacion: "2024-02-10"
    },
    {
      id: 4,
      nombre: "Taladro Inalámbrico",
      categoria: "Herramientas",
      precio: 2200,
      descuento: 0,
      stock: 1,
      imagen: "https://via.placeholder.com/300x200?text=Taladro",
      descripcion: "Taladro inalámbrico 18V con batería y cargador incluidos",
      estado: "Buen estado",
      visible: false,
      destacado: false,
      fechaPublicacion: "2024-01-05"
    }
  ]);

  // Estados para filtros y búsqueda
  const [busqueda, setBusqueda] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState("Todas");
  const [estadoFiltro, setEstadoFiltro] = useState("Todos");
  const [verSoloVisibles, setVerSoloVisibles] = useState(false);

  // Estados para modales
  const [modalProductoAbierto, setModalProductoAbierto] = useState(false);
  const [modalEditarAbierto, setModalEditarAbierto] = useState(false);
  const [modalEliminarAbierto, setModalEliminarAbierto] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [modoEdicion, setModoEdicion] = useState(false);

  // Estado para el formulario de producto
  const [formProducto, setFormProducto] = useState({
    nombre: "",
    categoria: "Joyería",
    precio: "",
    descuento: "0",
    stock: "1",
    imagen: "",
    descripcion: "",
    estado: "Buen estado",
    visible: true,
    destacado: false
  });

  // Categorías disponibles
  const categorias = ["Todas", "Joyería", "Electrónica", "Herramientas", "Relojes", "Instrumentos", "Otros"];
  const estados = ["Todos", "Nuevo", "Como nuevo", "Buen estado", "Aceptable"];

  // Productos filtrados
  const productosFiltrados = productos.filter(producto => {
    // Filtro por búsqueda
    const coincideBusqueda = producto.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
                            producto.descripcion.toLowerCase().includes(busqueda.toLowerCase()) ||
                            producto.categoria.toLowerCase().includes(busqueda.toLowerCase());
    
    // Filtro por categoría
    const coincideCategoria = categoriaFiltro === "Todas" || producto.categoria === categoriaFiltro;
    
    // Filtro por estado
    const coincideEstado = estadoFiltro === "Todos" || producto.estado === estadoFiltro;
    
    // Filtro por visibilidad
    const coincideVisibilidad = verSoloVisibles ? producto.visible : true;
    
    return coincideBusqueda && coincideCategoria && coincideEstado && coincideVisibilidad;
  });

  // Estadísticas
  const totalProductos = productos.length;
  const productosVisibles = productos.filter(p => p.visible).length;
  const productosOcultos = totalProductos - productosVisibles;
  const valorTotalInventario = productos.reduce((sum, p) => sum + (p.precio * p.stock), 0);
  const productosDestacados = productos.filter(p => p.destacado).length;

  // Abrir modal para nuevo producto
  const abrirNuevoProducto = () => {
    setModoEdicion(false);
    setFormProducto({
      nombre: "",
      categoria: "Joyería",
      precio: "",
      descuento: "0",
      stock: "1",
      imagen: "",
      descripcion: "",
      estado: "Buen estado",
      visible: true,
      destacado: false
    });
    setModalProductoAbierto(true);
  };

  // Abrir modal para editar producto
  const abrirEditarProducto = (producto) => {
    setModoEdicion(true);
    setProductoSeleccionado(producto);
    setFormProducto({
      nombre: producto.nombre,
      categoria: producto.categoria,
      precio: producto.precio,
      descuento: producto.descuento,
      stock: producto.stock,
      imagen: producto.imagen,
      descripcion: producto.descripcion,
      estado: producto.estado,
      visible: producto.visible,
      destacado: producto.destacado
    });
    setModalProductoAbierto(true);
  };

  // Abrir modal para ver detalle
  const abrirDetalleProducto = (producto) => {
    setProductoSeleccionado(producto);
    setModalEditarAbierto(true);
  };

  // Abrir modal para confirmar eliminación
  const abrirEliminarProducto = (producto) => {
    setProductoSeleccionado(producto);
    setModalEliminarAbierto(true);
  };

  // Guardar producto (nuevo o editado)
  const guardarProducto = (e) => {
    e.preventDefault();
    
    if (modoEdicion) {
      // Editar producto existente
      setProductos(productos.map(p => 
        p.id === productoSeleccionado.id 
          ? { ...formProducto, id: p.id, precio: Number(formProducto.precio), descuento: Number(formProducto.descuento), stock: Number(formProducto.stock) }
          : p
      ));
    } else {
      // Crear nuevo producto
      const nuevoProducto = {
        ...formProducto,
        id: productos.length + 1,
        precio: Number(formProducto.precio),
        descuento: Number(formProducto.descuento),
        stock: Number(formProducto.stock),
        fechaPublicacion: new Date().toISOString().split('T')[0]
      };
      setProductos([...productos, nuevoProducto]);
    }
    
    setModalProductoAbierto(false);
  };

  // Eliminar producto
  const eliminarProducto = () => {
    setProductos(productos.filter(p => p.id !== productoSeleccionado.id));
    setModalEliminarAbierto(false);
  };

  // Toggle visible (publicado/oculto)
  const toggleVisible = (id) => {
    setProductos(productos.map(p => 
      p.id === id ? { ...p, visible: !p.visible } : p
    ));
  };

  // Toggle destacado
  const toggleDestacado = (id) => {
    setProductos(productos.map(p => 
      p.id === id ? { ...p, destacado: !p.destacado } : p
    ));
  };

  // Manejar cambios en el formulario
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormProducto({
      ...formProducto,
      [name]: type === "checkbox" ? checked : value
    });
  };

  return (
    <div className="dashboard">
      <Sidebar />

      <div className="content tienda-content">
        {/* HEADER */}
        <div className="tienda-header">
          <div>
            <h1>Tienda Online</h1>
            <p className="header-sub">Gestiona los productos en venta</p>
          </div>
          <button className="btn-nuevo-producto" onClick={abrirNuevoProducto}>
            <span>➕</span> Nuevo Producto
          </button>
        </div>

        {/* ESTADÍSTICAS */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">📦</div>
            <div className="stat-info">
              <span className="stat-label">Total Productos</span>
              <span className="stat-value">{totalProductos}</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">👁️</div>
            <div className="stat-info">
              <span className="stat-label">Visibles</span>
              <span className="stat-value">{productosVisibles}</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🙈</div>
            <div className="stat-info">
              <span className="stat-label">Ocultos</span>
              <span className="stat-value">{productosOcultos}</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">💰</div>
            <div className="stat-info">
              <span className="stat-label">Valor Total</span>
              <span className="stat-value">${valorTotalInventario.toLocaleString()}</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">⭐</div>
            <div className="stat-info">
              <span className="stat-label">Destacados</span>
              <span className="stat-value">{productosDestacados}</span>
            </div>
          </div>
        </div>

        {/* FILTROS */}
        <div className="filtros-tienda">
          <div className="buscador">
            <input
              type="text"
              placeholder="Buscar productos..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="buscador-input"
            />
            <span className="buscador-icon">🔍</span>
          </div>

          <div className="filtros-selectores">
            <select
              value={categoriaFiltro}
              onChange={(e) => setCategoriaFiltro(e.target.value)}
              className="filtro-select"
            >
              {categorias.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>

            <select
              value={estadoFiltro}
              onChange={(e) => setEstadoFiltro(e.target.value)}
              className="filtro-select"
            >
              {estados.map(est => (
                <option key={est} value={est}>{est}</option>
              ))}
            </select>

            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={verSoloVisibles}
                onChange={(e) => setVerSoloVisibles(e.target.checked)}
              />
              Solo visibles
            </label>
          </div>

          {(busqueda || categoriaFiltro !== "Todas" || estadoFiltro !== "Todos" || verSoloVisibles) && (
            <button
              className="btn-limpiar-filtros"
              onClick={() => {
                setBusqueda("");
                setCategoriaFiltro("Todas");
                setEstadoFiltro("Todos");
                setVerSoloVisibles(false);
              }}
            >
              ✕ Limpiar filtros
            </button>
          )}
        </div>

        {/* PRODUCTOS GRID */}
        <div className="productos-grid">
          {productosFiltrados.length > 0 ? (
            productosFiltrados.map(producto => (
              <div key={producto.id} className={`producto-card ${!producto.visible ? 'producto-oculto' : ''}`}>
                <div className="producto-imagen">
                  <img src={producto.imagen} alt={producto.nombre} />
                  {producto.descuento > 0 && (
                    <span className="producto-descuento">-{producto.descuento}%</span>
                  )}
                  {producto.destacado && (
                    <span className="producto-destacado">⭐</span>
                  )}
                  {!producto.visible && (
                    <span className="producto-oculto-badge">OCULTO</span>
                  )}
                </div>
                
                <div className="producto-info">
                  <h3>{producto.nombre}</h3>
                  <span className="producto-categoria">{producto.categoria}</span>
                  
                  <div className="producto-precios">
                    {producto.descuento > 0 ? (
                      <>
                        <span className="precio-original">${producto.precio.toLocaleString()}</span>
                        <span className="precio-descuento">
                          ${(producto.precio * (1 - producto.descuento/100)).toLocaleString()}
                        </span>
                      </>
                    ) : (
                      <span className="precio-normal">${producto.precio.toLocaleString()}</span>
                    )}
                  </div>
                  
                  <div className="producto-detalles">
                    <span className={`estado-badge estado-${producto.estado.toLowerCase().replace(/\s+/g, '-')}`}>
                      {producto.estado}
                    </span>
                    <span className="producto-stock">Stock: {producto.stock}</span>
                  </div>
                  
                  <div className="producto-acciones">
                    <button 
                      className="btn-accion ver"
                      onClick={() => abrirDetalleProducto(producto)}
                      title="Ver detalles"
                    >
                      👁️
                    </button>
                    <button 
                      className="btn-accion editar"
                      onClick={() => abrirEditarProducto(producto)}
                      title="Editar"
                    >
                      ✏️
                    </button>
                    <button 
                      className="btn-accion toggle-visible"
                      onClick={() => toggleVisible(producto.id)}
                      title={producto.visible ? "Ocultar" : "Mostrar"}
                    >
                      {producto.visible ? "🙈" : "👁️"}
                    </button>
                    <button 
                      className="btn-accion destacar"
                      onClick={() => toggleDestacado(producto.id)}
                      title={producto.destacado ? "Quitar destacado" : "Destacar"}
                    >
                      {producto.destacado ? "⭐" : "☆"}
                    </button>
                    <button 
                      className="btn-accion eliminar"
                      onClick={() => abrirEliminarProducto(producto)}
                      title="Eliminar"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="sin-resultados">
              No se encontraron productos con esos filtros
            </div>
          )}
        </div>

        {/* MODAL PRODUCTO (Nuevo/Editar) */}
        {modalProductoAbierto && (
          <div className="modal-overlay" onClick={() => setModalProductoAbierto(false)}>
            <div className="modal-producto" onClick={(e) => e.stopPropagation()}>
              <button className="modal-cerrar" onClick={() => setModalProductoAbierto(false)}>×</button>
              
              <div className="modal-header">
                <h2>{modoEdicion ? "Editar Producto" : "Nuevo Producto"}</h2>
              </div>

              <form onSubmit={guardarProducto}>
                <div className="modal-body">
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Nombre del producto *</label>
                      <input
                        type="text"
                        name="nombre"
                        value={formProducto.nombre}
                        onChange={handleInputChange}
                        required
                        placeholder="Ej: Anillo de Oro 18k"
                      />
                    </div>

                    <div className="form-group">
                      <label>Categoría *</label>
                      <select
                        name="categoria"
                        value={formProducto.categoria}
                        onChange={handleInputChange}
                        required
                      >
                        {categorias.filter(c => c !== "Todas").map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Precio ($) *</label>
                      <input
                        type="number"
                        name="precio"
                        value={formProducto.precio}
                        onChange={handleInputChange}
                        required
                        min="0"
                        placeholder="0"
                      />
                    </div>

                    <div className="form-group">
                      <label>Descuento (%)</label>
                      <input
                        type="number"
                        name="descuento"
                        value={formProducto.descuento}
                        onChange={handleInputChange}
                        min="0"
                        max="100"
                        placeholder="0"
                      />
                    </div>

                    <div className="form-group">
                      <label>Stock *</label>
                      <input
                        type="number"
                        name="stock"
                        value={formProducto.stock}
                        onChange={handleInputChange}
                        required
                        min="0"
                        placeholder="1"
                      />
                    </div>

                    <div className="form-group">
                      <label>Estado *</label>
                      <select
                        name="estado"
                        value={formProducto.estado}
                        onChange={handleInputChange}
                        required
                      >
                        {estados.filter(e => e !== "Todos").map(est => (
                          <option key={est} value={est}>{est}</option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group full-width">
                      <label>URL de la imagen</label>
                      <input
                        type="text"
                        name="imagen"
                        value={formProducto.imagen}
                        onChange={handleInputChange}
                        placeholder="https://ejemplo.com/imagen.jpg"
                      />
                    </div>

                    <div className="form-group full-width">
                      <label>Descripción</label>
                      <textarea
                        name="descripcion"
                        value={formProducto.descripcion}
                        onChange={handleInputChange}
                        rows="3"
                        placeholder="Describe el producto, características, condición..."
                      />
                    </div>

                    <div className="form-group checkbox-group">
                      <label>
                        <input
                          type="checkbox"
                          name="visible"
                          checked={formProducto.visible}
                          onChange={handleInputChange}
                        />
                        Producto visible en tienda
                      </label>
                    </div>

                    <div className="form-group checkbox-group">
                      <label>
                        <input
                          type="checkbox"
                          name="destacado"
                          checked={formProducto.destacado}
                          onChange={handleInputChange}
                        />
                        Marcar como destacado
                      </label>
                    </div>
                  </div>
                </div>

                <div className="modal-acciones">
                  <button type="submit" className="btn-guardar">
                    {modoEdicion ? "Guardar Cambios" : "Crear Producto"}
                  </button>
                  <button type="button" className="btn-cancelar" onClick={() => setModalProductoAbierto(false)}>
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL DETALLE PRODUCTO */}
        {modalEditarAbierto && productoSeleccionado && (
          <div className="modal-overlay" onClick={() => setModalEditarAbierto(false)}>
            <div className="modal-detalle" onClick={(e) => e.stopPropagation()}>
              <button className="modal-cerrar" onClick={() => setModalEditarAbierto(false)}>×</button>
              
              <div className="modal-header">
                <h2>{productoSeleccionado.nombre}</h2>
                <span className="cliente-id">ID: #{productoSeleccionado.id}</span>
              </div>

              <div className="modal-body">
                <div className="detalle-grid">
                  <div className="detalle-imagen">
                    <img src={productoSeleccionado.imagen} alt={productoSeleccionado.nombre} />
                  </div>
                  
                  <div className="detalle-info">
                    <div className="info-item">
                      <span className="info-label">Categoría</span>
                      <span className="info-value">{productoSeleccionado.categoria}</span>
                    </div>
                    
                    <div className="info-item">
                      <span className="info-label">Precio</span>
                      <span className="info-value">
                        {productoSeleccionado.descuento > 0 ? (
                          <>
                            <span className="precio-original">${productoSeleccionado.precio.toLocaleString()}</span>
                            <span className="precio-descuento">
                              ${(productoSeleccionado.precio * (1 - productoSeleccionado.descuento/100)).toLocaleString()}
                            </span>
                            <span className="descuento-badge">-{productoSeleccionado.descuento}%</span>
                          </>
                        ) : (
                          `$${productoSeleccionado.precio.toLocaleString()}`
                        )}
                      </span>
                    </div>
                    
                    <div className="info-item">
                      <span className="info-label">Stock</span>
                      <span className="info-value">{productoSeleccionado.stock} unidades</span>
                    </div>
                    
                    <div className="info-item">
                      <span className="info-label">Estado</span>
                      <span className="info-value">
                        <span className={`estado-badge estado-${productoSeleccionado.estado.toLowerCase().replace(/\s+/g, '-')}`}>
                          {productoSeleccionado.estado}
                        </span>
                      </span>
                    </div>
                    
                    <div className="info-item full-width">
                      <span className="info-label">Descripción</span>
                      <span className="info-value">{productoSeleccionado.descripcion}</span>
                    </div>
                    
                    <div className="info-item">
                      <span className="info-label">Publicado</span>
                      <span className="info-value">
                        {productoSeleccionado.visible ? "✅ Visible" : "❌ Oculto"}
                      </span>
                    </div>
                    
                    <div className="info-item">
                      <span className="info-label">Destacado</span>
                      <span className="info-value">
                        {productoSeleccionado.destacado ? "⭐ Sí" : "☆ No"}
                      </span>
                    </div>
                    
                    <div className="info-item">
                      <span className="info-label">Fecha publicación</span>
                      <span className="info-value">{productoSeleccionado.fechaPublicacion}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="modal-acciones">
                <button 
                  className="btn-editar"
                  onClick={() => {
                    setModalEditarAbierto(false);
                    abrirEditarProducto(productoSeleccionado);
                  }}
                >
                  ✏️ Editar
                </button>
                <button 
                  className="btn-eliminar"
                  onClick={() => {
                    setModalEditarAbierto(false);
                    abrirEliminarProducto(productoSeleccionado);
                  }}
                >
                  🗑️ Eliminar
                </button>
                <button className="btn-cancelar" onClick={() => setModalEditarAbierto(false)}>
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL ELIMINAR */}
        {modalEliminarAbierto && productoSeleccionado && (
          <div className="modal-overlay" onClick={() => setModalEliminarAbierto(false)}>
            <div className="modal-confirmar" onClick={(e) => e.stopPropagation()}>
              <div className="modal-icono">⚠️</div>
              <h3>¿Eliminar producto?</h3>
              <p>Estás a punto de eliminar <strong>{productoSeleccionado.nombre}</strong></p>
              <p className="advertencia">Esta acción no se puede deshacer</p>
              
              <div className="modal-botones">
                <button 
                  className="btn-cancelar"
                  onClick={() => setModalEliminarAbierto(false)}
                >
                  Cancelar
                </button>
                <button 
                  className="btn-confirmar-eliminar"
                  onClick={eliminarProducto}
                >
                  Sí, eliminar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TiendaOnline;