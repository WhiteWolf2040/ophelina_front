// TiendaOnline.jsx - Versión con iconos MUI
import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import "./TiendaOnline.css";

// Importar iconos de MUI
import StorefrontIcon from '@mui/icons-material/Storefront';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import InventoryIcon from '@mui/icons-material/Inventory';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CategoryIcon from '@mui/icons-material/Category';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import ImageIcon from '@mui/icons-material/Image';
import DescriptionIcon from '@mui/icons-material/Description';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import WarningIcon from '@mui/icons-material/Warning';
import CloseIcon from '@mui/icons-material/Close';
import FilterListIcon from '@mui/icons-material/FilterList';
import ClearIcon from '@mui/icons-material/Clear';
import BoxIcon from '@mui/icons-material/Inventory';
import SellIcon from '@mui/icons-material/Sell';

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
    const coincideBusqueda = producto.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
                            producto.descripcion.toLowerCase().includes(busqueda.toLowerCase()) ||
                            producto.categoria.toLowerCase().includes(busqueda.toLowerCase());
    
    const coincideCategoria = categoriaFiltro === "Todas" || producto.categoria === categoriaFiltro;
    const coincideEstado = estadoFiltro === "Todos" || producto.estado === estadoFiltro;
    const coincideVisibilidad = verSoloVisibles ? producto.visible : true;
    
    return coincideBusqueda && coincideCategoria && coincideEstado && coincideVisibilidad;
  });

  // Estadísticas
  const totalProductos = productos.length;
  const productosVisibles = productos.filter(p => p.visible).length;
  const productosOcultos = totalProductos - productosVisibles;
  const valorTotalInventario = productos.reduce((sum, p) => sum + (p.precio * p.stock), 0);
  const productosDestacados = productos.filter(p => p.destacado).length;

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

  const abrirDetalleProducto = (producto) => {
    setProductoSeleccionado(producto);
    setModalEditarAbierto(true);
  };

  const abrirEliminarProducto = (producto) => {
    setProductoSeleccionado(producto);
    setModalEliminarAbierto(true);
  };

  const guardarProducto = (e) => {
    e.preventDefault();
    
    if (modoEdicion) {
      setProductos(productos.map(p => 
        p.id === productoSeleccionado.id 
          ? { ...formProducto, id: p.id, precio: Number(formProducto.precio), descuento: Number(formProducto.descuento), stock: Number(formProducto.stock) }
          : p
      ));
    } else {
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

  const eliminarProducto = () => {
    setProductos(productos.filter(p => p.id !== productoSeleccionado.id));
    setModalEliminarAbierto(false);
  };

  const toggleVisible = (id) => {
    setProductos(productos.map(p => 
      p.id === id ? { ...p, visible: !p.visible } : p
    ));
  };

  const toggleDestacado = (id) => {
    setProductos(productos.map(p => 
      p.id === id ? { ...p, destacado: !p.destacado } : p
    ));
  };

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
          
            <h1>
              <StorefrontIcon className="title-icon" />
              Tienda Online  <p className="header-sub">Gestiona los productos en venta</p>
            </h1>
           
         
          <button className="btn-nuevo-producto" onClick={abrirNuevoProducto}>
            <AddIcon />
            Nuevo Producto
          </button>
        </div>

        {/* ESTADÍSTICAS */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">
              <InventoryIcon />
            </div>
            <div className="stat-info">
              <span className="stat-label">Total Productos</span>
              <span className="stat-value">{totalProductos}</span>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">
              <VisibilityIcon />
            </div>
            <div className="stat-info">
              <span className="stat-label">Visibles</span>
              <span className="stat-value">{productosVisibles}</span>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">
              <VisibilityOffIcon />
            </div>
            <div className="stat-info">
              <span className="stat-label">Ocultos</span>
              <span className="stat-value">{productosOcultos}</span>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">
              <AttachMoneyIcon />
            </div>
            <div className="stat-info">
              <span className="stat-label">Valor Total</span>
              <span className="stat-value">${valorTotalInventario.toLocaleString()}</span>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">
              <StarIcon />
            </div>
            <div className="stat-info">
              <span className="stat-label">Destacados</span>
              <span className="stat-value">{productosDestacados}</span>
            </div>
          </div>
        </div>

        {/* FILTROS */}
        <div className="filtros-tienda">
          <div className="buscador">
            <SearchIcon className="buscador-icon" />
            <input
              type="text"
              placeholder="Buscar productos..."
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
              <VisibilityIcon fontSize="small" />
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
              <ClearIcon fontSize="small" />
              Limpiar filtros
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
                    <span className="producto-destacado">
                      <StarIcon />
                    </span>
                  )}
                  {!producto.visible && (
                    <span className="producto-oculto-badge">
                      <VisibilityOffIcon fontSize="small" />
                      OCULTO
                    </span>
                  )}
                </div>
                
                <div className="producto-info">
                  <h3>{producto.nombre}</h3>
                  <span className="producto-categoria">
                    <CategoryIcon fontSize="small" />
                    {producto.categoria}
                  </span>
                  
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
                    <span className="producto-stock">
                      <BoxIcon fontSize="small" />
                      Stock: {producto.stock}
                    </span>
                  </div>
                  
                  <div className="producto-acciones">
                    <button 
                      className="btn-accion ver"
                      onClick={() => abrirDetalleProducto(producto)}
                      title="Ver detalles"
                    >
                      <VisibilityIcon />
                    </button>
                    <button 
                      className="btn-accion editar"
                      onClick={() => abrirEditarProducto(producto)}
                      title="Editar"
                    >
                      <EditIcon />
                    </button>
                    <button 
                      className="btn-accion toggle-visible"
                      onClick={() => toggleVisible(producto.id)}
                      title={producto.visible ? "Ocultar" : "Mostrar"}
                    >
                      {producto.visible ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </button>
                    <button 
                      className="btn-accion destacar"
                      onClick={() => toggleDestacado(producto.id)}
                      title={producto.destacado ? "Quitar destacado" : "Destacar"}
                    >
                      {producto.destacado ? <StarIcon /> : <StarBorderIcon />}
                    </button>
                    <button 
                      className="btn-accion eliminar"
                      onClick={() => abrirEliminarProducto(producto)}
                      title="Eliminar"
                    >
                      <DeleteIcon />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="sin-resultados">
              <SearchIcon className="empty-icon" />
              <p>No se encontraron productos con esos filtros</p>
            </div>
          )}
        </div>

        {/* MODAL PRODUCTO (Nuevo/Editar) */}
        {modalProductoAbierto && (
          <div className="modal-overlay" onClick={() => setModalProductoAbierto(false)}>
            <div className="modal-producto" onClick={(e) => e.stopPropagation()}>
              <button className="modal-cerrar" onClick={() => setModalProductoAbierto(false)}>
                <CloseIcon />
              </button>
              
              <div className="modal-header">
                <h2>
                  {modoEdicion ? <EditIcon className="modal-icon" /> : <AddIcon className="modal-icon" />}
                  {modoEdicion ? "Editar Producto" : "Nuevo Producto"}
                </h2>
              </div>

              <form onSubmit={guardarProducto}>
                <div className="modal-body">
                  <div className="form-grid">
                    <div className="form-group">
                      <label>
                        <SellIcon fontSize="small" />
                        Nombre del producto *
                      </label>
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
                      <label>
                        <CategoryIcon fontSize="small" />
                        Categoría *
                      </label>
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
                      <label>
                        <AttachMoneyIcon fontSize="small" />
                        Precio ($) *
                      </label>
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
                      <label>
                        <LocalOfferIcon fontSize="small" />
                        Descuento (%)
                      </label>
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
                      <label>
                        <BoxIcon fontSize="small" />
                        Stock *
                      </label>
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
                      <label>
                        <ImageIcon fontSize="small" />
                        URL de la imagen
                      </label>
                      <input
                        type="text"
                        name="imagen"
                        value={formProducto.imagen}
                        onChange={handleInputChange}
                        placeholder="https://ejemplo.com/imagen.jpg"
                      />
                    </div>

                    <div className="form-group full-width">
                      <label>
                        <DescriptionIcon fontSize="small" />
                        Descripción
                      </label>
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
                        {formProducto.visible ? <VisibilityIcon /> : <VisibilityOffIcon />}
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
                        {formProducto.destacado ? <StarIcon /> : <StarBorderIcon />}
                        Marcar como destacado
                      </label>
                    </div>
                  </div>
                </div>

                <div className="modal-acciones">
                  <button type="submit" className="btn-guardar">
                    {modoEdicion ? <EditIcon /> : <AddIcon />}
                    {modoEdicion ? "Guardar Cambios" : "Crear Producto"}
                  </button>
                  <button type="button" className="btn-cancelar" onClick={() => setModalProductoAbierto(false)}>
                    <CloseIcon />
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
              <button className="modal-cerrar" onClick={() => setModalEditarAbierto(false)}>
                <CloseIcon />
              </button>
              
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
                        {productoSeleccionado.visible ? 
                          <CheckCircleIcon className="visible-icon" /> : 
                          <CancelIcon className="oculto-icon" />
                        }
                        {productoSeleccionado.visible ? " Visible" : " Oculto"}
                      </span>
                    </div>
                    
                    <div className="info-item">
                      <span className="info-label">Destacado</span>
                      <span className="info-value">
                        {productoSeleccionado.destacado ? <StarIcon /> : <StarBorderIcon />}
                        {productoSeleccionado.destacado ? " Sí" : " No"}
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
                  <EditIcon />
                  Editar
                </button>
                <button 
                  className="btn-eliminar"
                  onClick={() => {
                    setModalEditarAbierto(false);
                    abrirEliminarProducto(productoSeleccionado);
                  }}
                >
                  <DeleteIcon />
                  Eliminar
                </button>
                <button className="btn-cancelar" onClick={() => setModalEditarAbierto(false)}>
                  <CloseIcon />
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
              <div className="modal-icono">
                <WarningIcon />
              </div>
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
                  <DeleteIcon />
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