// TiendaOnline.jsx - Versión integrada con API y publicación automática

import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { useTienda } from "../hooks/useTienda";
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
import ClearIcon from '@mui/icons-material/Clear';
import BoxIcon from '@mui/icons-material/Inventory';
import SellIcon from '@mui/icons-material/Sell';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import SettingsIcon from '@mui/icons-material/Settings';
import RefreshIcon from '@mui/icons-material/Refresh';
import TimerIcon from '@mui/icons-material/Timer';

const TiendaOnline = () => {
  // ========== HOOK DE TIENDA ==========
  const {
    productos,
    estadisticas,
    loading,
    error,
    filtros,
    setFiltros,
    cargarProductos,
    cargarEstadisticas,
    crearProducto,
    actualizarProducto,
    toggleVisibilidad,
    toggleDestacado,
    eliminarProducto,
    ejecutarPublicacionAutomatica,
    configurarDiasGracia
  } = useTienda();

  // ========== ESTADOS LOCALES ==========
  const [busqueda, setBusqueda] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState("Todas");
  const [estadoFiltro, setEstadoFiltro] = useState("Todos");
  const [verSoloVisibles, setVerSoloVisibles] = useState(false);
  const [mostrarConfiguracion, setMostrarConfiguracion] = useState(false);
  const [diasGracia, setDiasGracia] = useState(5);
  const [publicando, setPublicando] = useState(false);

  // Estados para modales
  const [modalProductoAbierto, setModalProductoAbierto] = useState(false);
  const [modalDetalleAbierto, setModalDetalleAbierto] = useState(false);
  const [modalEliminarAbierto, setModalEliminarAbierto] = useState(false);
  const [modalPublicacionAbierto, setModalPublicacionAbierto] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [resultadoPublicacion, setResultadoPublicacion] = useState(null);

  // Estado para el formulario de producto
  const [formProducto, setFormProducto] = useState({
    id_prenda: "",
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

  // ========== EFECTOS ==========
  useEffect(() => {
    // Cargar productos al montar el componente
    cargarProductos();
    cargarEstadisticas();
  }, []);

  // Sincronizar filtros del componente con el hook
  useEffect(() => {
    setFiltros({
      busqueda,
      categoria: categoriaFiltro,
      estado: estadoFiltro,
      solo_visibles: verSoloVisibles
    });
  }, [busqueda, categoriaFiltro, estadoFiltro, verSoloVisibles]);

  // ========== MANEJADORES ==========
  const abrirNuevoProducto = () => {
    setModoEdicion(false);
    setFormProducto({
      id_prenda: "",
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
      id_prenda: producto.id_prenda || "",
      nombre: producto.nombre,
      categoria: producto.categoria,
      precio: producto.precio,
      descuento: producto.descuento || 0,
      stock: producto.stock,
      imagen: producto.imagen_principal || "",
      descripcion: producto.descripcion || "",
      estado: producto.estado,
      visible: producto.visible,
      destacado: producto.destacado
    });
    setModalProductoAbierto(true);
  };

  const abrirDetalleProducto = (producto) => {
    setProductoSeleccionado(producto);
    setModalDetalleAbierto(true);
  };

  const abrirEliminarProducto = (producto) => {
    setProductoSeleccionado(producto);
    setModalEliminarAbierto(true);
  };

  const abrirModalPublicacion = () => {
    setModalPublicacionAbierto(true);
  };

  const handleGuardarProducto = async (e) => {
    e.preventDefault();
    
    try {
      const data = {
        ...formProducto,
        precio: Number(formProducto.precio),
        descuento: Number(formProducto.descuento),
        stock: Number(formProducto.stock)
      };

      if (modoEdicion && productoSeleccionado) {
        await actualizarProducto(productoSeleccionado.id, data);
      } else {
        await crearProducto(data);
      }
      
      setModalProductoAbierto(false);
    } catch (err) {
      console.error("Error guardando producto:", err);
      alert("Error al guardar el producto: " + (err.message || "Intenta de nuevo"));
    }
  };

  const handleEliminarProducto = async () => {
    try {
      await eliminarProducto(productoSeleccionado.id);
      setModalEliminarAbierto(false);
      setProductoSeleccionado(null);
    } catch (err) {
      console.error("Error eliminando producto:", err);
      alert("Error al eliminar el producto: " + (err.message || "Intenta de nuevo"));
    }
  };

  const handleToggleVisible = async (id) => {
    try {
      await toggleVisibilidad(id);
    } catch (err) {
      console.error("Error cambiando visibilidad:", err);
      alert("Error al cambiar visibilidad: " + (err.message || "Intenta de nuevo"));
    }
  };

  const handleToggleDestacado = async (id) => {
    try {
      await toggleDestacado(id);
    } catch (err) {
      console.error("Error cambiando destacado:", err);
      alert("Error al cambiar destacado: " + (err.message || "Intenta de nuevo"));
    }
  };

  const handlePublicacionAutomatica = async () => {
    setPublicando(true);
    setResultadoPublicacion(null);
    
    try {
      const resultado = await ejecutarPublicacionAutomatica(diasGracia);
      setResultadoPublicacion(resultado);
      await cargarProductos();
      await cargarEstadisticas();
    } catch (err) {
      console.error("Error en publicación automática:", err);
      setResultadoPublicacion({
        error: true,
        message: err.message || "Error al publicar productos"
      });
    } finally {
      setPublicando(false);
    }
  };

  const handleConfigurarDiasGracia = async () => {
    try {
      await configurarDiasGracia(diasGracia);
      alert(`✅ Días de gracia configurados a ${diasGracia} días`);
      setMostrarConfiguracion(false);
    } catch (err) {
      console.error("Error configurando días de gracia:", err);
      alert("Error al configurar días de gracia: " + (err.message || "Intenta de nuevo"));
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormProducto({
      ...formProducto,
      [name]: type === "checkbox" ? checked : value
    });
  };

  // ========== RENDER ==========
  return (
    <div className="dashboard">
      <Sidebar />

      <div className="content tienda-content">
        {/* HEADER */}
        <div className="tienda-header">
          <h1>
            <StorefrontIcon className="title-icon" />
            Tienda Online
            <p className="header-sub">Gestiona los productos en venta</p>
          </h1>
          
          <div className="header-actions">
            <button 
              className="btn-publicacion-auto"
              onClick={abrirModalPublicacion}
              title="Publicación automática de productos vencidos"
            >
              <AutoAwesomeIcon />
              Publicación Automática
            </button>
            <button 
              className="btn-nuevo-producto"
              onClick={abrirNuevoProducto}
            >
              <AddIcon />
              Nuevo Producto
            </button>
          </div>
        </div>

        {/* ESTADÍSTICAS */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">
              <InventoryIcon />
            </div>
            <div className="stat-info">
              <span className="stat-label">Total Productos</span>
              <span className="stat-value">{estadisticas?.total || 0}</span>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">
              <VisibilityIcon />
            </div>
            <div className="stat-info">
              <span className="stat-label">Visibles</span>
              <span className="stat-value">{estadisticas?.visibles || 0}</span>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">
              <VisibilityOffIcon />
            </div>
            <div className="stat-info">
              <span className="stat-label">Ocultos</span>
              <span className="stat-value">{estadisticas?.ocultos || 0}</span>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">
              <AttachMoneyIcon />
            </div>
            <div className="stat-info">
              <span className="stat-label">Valor Total</span>
              <span className="stat-value">${estadisticas?.valor_total || 0}</span>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">
              <StarIcon />
            </div>
            <div className="stat-info">
              <span className="stat-label">Destacados</span>
              <span className="stat-value">{estadisticas?.destacados || 0}</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <TimerIcon />
            </div>
            <div className="stat-info">
              <span className="stat-label">Pub. Automática</span>
              <span className="stat-value">{estadisticas?.publicaciones_automaticas || 0}</span>
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

            <button 
              className="btn-refrescar"
              onClick={() => {
                cargarProductos();
                cargarEstadisticas();
              }}
              title="Refrescar lista"
            >
              <RefreshIcon fontSize="small" />
            </button>
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

        {/* LOADING */}
        {loading && (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Cargando productos...</p>
          </div>
        )}

        {/* ERROR */}
        {error && !loading && (
          <div className="error-container">
            <WarningIcon className="error-icon" />
            <p>{error}</p>
            <button onClick={() => cargarProductos()}>Reintentar</button>
          </div>
        )}

        {/* PRODUCTOS GRID */}
        {!loading && !error && (
          <div className="productos-grid">
            {productos?.data?.length > 0 ? (
              productos.data.map(producto => (
                <div key={producto.id} className={`producto-card ${!producto.visible ? 'producto-oculto' : ''}`}>
                  <div className="producto-imagen">
                    <img 
                      src={producto.imagen_principal || 'https://via.placeholder.com/300x200?text=Sin+Imagen'} 
                      alt={producto.nombre} 
                    />
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
                    {producto.publicacion_automatica && (
                      <span className="producto-auto-badge">
                        <AutoAwesomeIcon fontSize="small" />
                        AUTO
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
                      <span className={`estado-badge estado-${producto.estado?.toLowerCase().replace(/\s+/g, '-') || 'buen-estado'}`}>
                        {producto.estado || 'Buen estado'}
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
                        onClick={() => handleToggleVisible(producto.id)}
                        title={producto.visible ? "Ocultar" : "Mostrar"}
                      >
                        {producto.visible ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </button>
                      <button 
                        className="btn-accion destacar"
                        onClick={() => handleToggleDestacado(producto.id)}
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
        )}

        {/* MODAL PUBLICACIÓN AUTOMÁTICA */}
        {modalPublicacionAbierto && (
          <div className="modal-overlay" onClick={() => setModalPublicacionAbierto(false)}>
            <div className="modal-publicacion" onClick={(e) => e.stopPropagation()}>
              <button className="modal-cerrar" onClick={() => setModalPublicacionAbierto(false)}>
                <CloseIcon />
              </button>
              
              <div className="modal-header">
                <h2>
                  <AutoAwesomeIcon className="modal-icon" />
                  Publicación Automática
                </h2>
              </div>

              <div className="modal-body">
                <p className="publicacion-descripcion">
                  Esta función buscará empeños vencidos y los publicará automáticamente en la tienda online.
                </p>

                <div className="config-gracia">
                  <label>
                    <TimerIcon fontSize="small" />
                    Días de gracia después del vencimiento:
                  </label>
                  <div className="gracia-input-group">
                    <input
                      type="number"
                      value={diasGracia}
                      onChange={(e) => setDiasGracia(Number(e.target.value))}
                      min="0"
                      max="30"
                      className="gracia-input"
                    />
                    <span>días</span>
                    <button 
                      className="btn-configurar-gracia"
                      onClick={handleConfigurarDiasGracia}
                      title="Guardar configuración"
                    >
                      <SettingsIcon fontSize="small" />
                    </button>
                  </div>
                  <p className="gracia-help">
                    Los productos se publicarán después de {diasGracia} días de vencido el contrato.
                  </p>
                </div>

                {resultadoPublicacion && (
                  <div className={`resultado-publicacion ${resultadoPublicacion.error ? 'error' : 'success'}`}>
                    {resultadoPublicacion.error ? (
                      <>
                        <CancelIcon />
                        <span>{resultadoPublicacion.message}</span>
                      </>
                    ) : (
                      <>
                        <CheckCircleIcon />
                        <span>
                          {resultadoPublicacion.message || 
                           `✅ ${resultadoPublicacion.productos_creados || 0} productos publicados`}
                        </span>
                      </>
                    )}
                  </div>
                )}

                <button 
                  className="btn-ejecutar-publicacion"
                  onClick={handlePublicacionAutomatica}
                  disabled={publicando}
                >
                  {publicando ? (
                    <>
                      <span className="spinner-small"></span>
                      Publicando...
                    </>
                  ) : (
                    <>
                      <AutoAwesomeIcon />
                      Ejecutar Publicación
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL PRODUCTO (Nuevo/Editar) - Igual que antes pero con handleGuardarProducto */}
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

              <form onSubmit={handleGuardarProducto}>
                <div className="modal-body">
                  <div className="form-grid">
                    {/* Los mismos campos del formulario original */}
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

        {/* MODAL DETALLE - Igual pero con datos de API */}
        {modalDetalleAbierto && productoSeleccionado && (
          <div className="modal-overlay" onClick={() => setModalDetalleAbierto(false)}>
            <div className="modal-detalle" onClick={(e) => e.stopPropagation()}>
              <button className="modal-cerrar" onClick={() => setModalDetalleAbierto(false)}>
                <CloseIcon />
              </button>
              
              <div className="modal-header">
                <h2>{productoSeleccionado.nombre}</h2>
                <span className="cliente-id">ID: #{productoSeleccionado.id}</span>
                {productoSeleccionado.publicacion_automatica && (
                  <span className="auto-tag">
                    <AutoAwesomeIcon fontSize="small" />
                    Publicado automáticamente
                  </span>
                )}
              </div>

              <div className="modal-body">
                <div className="detalle-grid">
                  <div className="detalle-imagen">
                    <img 
                      src={productoSeleccionado.imagen_principal || 'https://via.placeholder.com/300x300?text=Sin+Imagen'} 
                      alt={productoSeleccionado.nombre} 
                    />
                    {productoSeleccionado.fecha_vencimiento_contrato && (
                      <div className="info-contrato">
                        <TimerIcon fontSize="small" />
                        Contrato vencido: {new Date(productoSeleccionado.fecha_vencimiento_contrato).toLocaleDateString()}
                      </div>
                    )}
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
                        <span className={`estado-badge estado-${productoSeleccionado.estado?.toLowerCase().replace(/\s+/g, '-') || 'buen-estado'}`}>
                          {productoSeleccionado.estado || 'Buen estado'}
                        </span>
                      </span>
                    </div>
                    
                    <div className="info-item full-width">
                      <span className="info-label">Descripción</span>
                      <span className="info-value">{productoSeleccionado.descripcion || 'Sin descripción'}</span>
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
                      <span className="info-value">
                        {new Date(productoSeleccionado.fecha_publicacion || productoSeleccionado.created_at).toLocaleDateString()}
                      </span>
                    </div>

                    {productoSeleccionado.dias_gracia && (
                      <div className="info-item">
                        <span className="info-label">Días de gracia</span>
                        <span className="info-value">{productoSeleccionado.dias_gracia} días</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="modal-acciones">
                <button 
                  className="btn-editar"
                  onClick={() => {
                    setModalDetalleAbierto(false);
                    abrirEditarProducto(productoSeleccionado);
                  }}
                >
                  <EditIcon />
                  Editar
                </button>
                <button 
                  className="btn-eliminar"
                  onClick={() => {
                    setModalDetalleAbierto(false);
                    abrirEliminarProducto(productoSeleccionado);
                  }}
                >
                  <DeleteIcon />
                  Eliminar
                </button>
                <button className="btn-cancelar" onClick={() => setModalDetalleAbierto(false)}>
                  <CloseIcon />
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL ELIMINAR - Con handleEliminarProducto */}
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
                  onClick={handleEliminarProducto}
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