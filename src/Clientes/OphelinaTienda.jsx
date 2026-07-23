// TiendaOnline.jsx - Versión con subida de imagen como archivo real (FormData)

import React, { useState, useEffect, useRef } from "react";

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
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

// Placeholder para imágenes
const PLACEHOLDER_IMAGE = '/placeholder.png';

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
  const [guardando, setGuardando] = useState(false);

  // Estados para modales
  const [modalProductoAbierto, setModalProductoAbierto] = useState(false);
  const [modalDetalleAbierto, setModalDetalleAbierto] = useState(false);
  const [modalEliminarAbierto, setModalEliminarAbierto] = useState(false);
  const [modalPublicacionAbierto, setModalPublicacionAbierto] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [resultadoPublicacion, setResultadoPublicacion] = useState(null);

  // ✅ Referencia al input de archivo (para poder limpiarlo o abrirlo por código si se quiere)
  const inputImagenRef = useRef(null);

  // ✅ Estado para el archivo de imagen seleccionado (objeto File real)
  const [archivoImagen, setArchivoImagen] = useState(null);
  // ✅ Vista previa local de la imagen (antes de subirla)
  const [previewImagen, setPreviewImagen] = useState(null);

  // Estado para el formulario de producto (ya sin el campo "imagen" como texto)
  const [formProducto, setFormProducto] = useState({
    id_prenda: "",
    nombre: "",
    categoria: "Joyería",
    precio: "",
    descuento: "0",
    stock: "1",
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
    cargarProductos();
    cargarEstadisticas();
  }, []);

  // Sincronizar filtros
  useEffect(() => {
    setFiltros({
      busqueda,
      categoria: categoriaFiltro,
      estado: estadoFiltro,
      solo_visibles: verSoloVisibles
    });
  }, [busqueda, categoriaFiltro, estadoFiltro, verSoloVisibles]);

  // ✅ Limpiar el object URL de la vista previa cuando cambie o se cierre el modal,
  // para no acumular memoria del navegador
  useEffect(() => {
    return () => {
      if (previewImagen) {
        URL.revokeObjectURL(previewImagen);
      }
    };
  }, [previewImagen]);

  // ========== MANEJADORES ==========
  const limpiarImagenSeleccionada = () => {
    setArchivoImagen(null);
    if (previewImagen) {
      URL.revokeObjectURL(previewImagen);
    }
    setPreviewImagen(null);
    if (inputImagenRef.current) {
      inputImagenRef.current.value = "";
    }
  };

  const abrirNuevoProducto = () => {
    setModoEdicion(false);
    setProductoSeleccionado(null);
    setFormProducto({
      id_prenda: "",
      nombre: "",
      categoria: "Joyería",
      precio: "",
      descuento: "0",
      stock: "1",
      descripcion: "",
      estado: "Buen estado",
      visible: true,
      destacado: false
    });
    limpiarImagenSeleccionada();
    setModalProductoAbierto(true);
  };

  const abrirEditarProducto = (producto) => {
    setModoEdicion(true);
    setProductoSeleccionado({
      ...producto,
      id: producto.id_producto
    });
    setFormProducto({
      id_prenda: producto.id_prenda || "",
      nombre: producto.nombre || "",
      categoria: producto.categoria || "Joyería",
      precio: producto.precio || "",
      descuento: producto.descuento || 0,
      stock: producto.stock || 1,
      descripcion: producto.descripcion || "",
      estado: producto.estado_producto || producto.estado || "Buen estado",
      visible: producto.visible !== undefined ? producto.visible : true,
      destacado: producto.destacado || false
    });
    limpiarImagenSeleccionada();
    // Si el producto ya tiene imagen, se muestra como vista previa inicial
    setPreviewImagen(producto.imagen_url || producto.imagen_principal || null);
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

  // ✅ Cuando el usuario selecciona un archivo en el input type="file"
  const handleImagenSeleccionada = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validación básica en el cliente (el backend también valida)
    if (!file.type.startsWith("image/")) {
      alert("El archivo debe ser una imagen (jpg, png, etc.)");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert("La imagen no debe superar los 5MB");
      return;
    }

    if (previewImagen) {
      URL.revokeObjectURL(previewImagen);
    }

    setArchivoImagen(file);
    setPreviewImagen(URL.createObjectURL(file));
  };

  const handleGuardarProducto = async (e) => {
    e.preventDefault();
    setGuardando(true);

    try {
      // ✅ Se construye un FormData en vez de un objeto plano,
      // porque ahora sí puede llevar un archivo binario real.
      const formData = new FormData();
      formData.append("nombre", formProducto.nombre);
      formData.append("categoria", formProducto.categoria);
      formData.append("precio", Number(formProducto.precio));
      formData.append("descuento", Number(formProducto.descuento));
      formData.append("stock", Number(formProducto.stock));
      formData.append("descripcion", formProducto.descripcion || "");
      formData.append("estado", formProducto.estado);
      // Los booleanos se mandan como '1' / '0' para que Laravel los valide bien como boolean
      formData.append("visible", formProducto.visible ? "1" : "0");
      formData.append("destacado", formProducto.destacado ? "1" : "0");

      // Solo se agrega la imagen si el usuario seleccionó una nueva
      if (archivoImagen) {
        formData.append("imagen", archivoImagen);
      }

      if (modoEdicion && productoSeleccionado) {
        await actualizarProducto(productoSeleccionado.id_producto, formData);
      } else {
        await crearProducto(formData);
      }

      setModalProductoAbierto(false);
      limpiarImagenSeleccionada();
      await cargarProductos();
      await cargarEstadisticas();
    } catch (err) {
      console.error("Error guardando producto:", err);
      alert("Error al guardar el producto: " + (err.response?.data?.message || err.message || "Intenta de nuevo"));
    } finally {
      setGuardando(false);
    }
  };

  const handleEliminarProducto = async () => {
    try {
      await eliminarProducto(productoSeleccionado.id_producto);
      setModalEliminarAbierto(false);
      setProductoSeleccionado(null);
      await cargarProductos();
      await cargarEstadisticas();
    } catch (err) {
      console.error("Error eliminando producto:", err);
      alert("Error al eliminar el producto: " + (err.response?.data?.message || err.message || "Intenta de nuevo"));
    }
  };

  const handleToggleVisible = async (id) => {
    try {
      await toggleVisibilidad(id);
      await cargarProductos();
    } catch (err) {
      console.error("Error cambiando visibilidad:", err);
      alert("Error al cambiar visibilidad: " + (err.response?.data?.message || err.message || "Intenta de nuevo"));
    }
  };

  const handleToggleDestacado = async (id) => {
    try {
      await toggleDestacado(id);
      await cargarProductos();
    } catch (err) {
      console.error("Error cambiando destacado:", err);
      alert("Error al cambiar destacado: " + (err.response?.data?.message || err.message || "Intenta de nuevo"));
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
        message: err.response?.data?.message || err.message || "Error al publicar productos"
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
      alert("Error al configurar días de gracia: " + (err.response?.data?.message || err.message || "Intenta de nuevo"));
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormProducto({
      ...formProducto,
      [name]: type === "checkbox" ? checked : value
    });
  };

  // Formatear precio de forma segura
  const formatPrice = (price) => {
    if (price === null || price === undefined || isNaN(price)) return '0';
    return Number(price).toLocaleString();
  };

  // ========== RENDER ==========
  return (
    <div className="dashboard">
      <div className="content tienda-content">
        {/* HEADER */}
        <div>
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
            <div className="stat-icon"><InventoryIcon /></div>
            <div className="stat-info">
              <span className="stat-label">Total Productos</span>
              <span className="stat-value">{estadisticas?.total || 0}</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon"><VisibilityIcon /></div>
            <div className="stat-info">
              <span className="stat-label">Visibles</span>
              <span className="stat-value">{estadisticas?.visibles || 0}</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon"><VisibilityOffIcon /></div>
            <div className="stat-info">
              <span className="stat-label">Ocultos</span>
              <span className="stat-value">{estadisticas?.ocultos || 0}</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon"><AttachMoneyIcon /></div>
            <div className="stat-info">
              <span className="stat-label">Valor Total</span>
              <span className="stat-value">${estadisticas?.valor_total || 0}</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon"><StarIcon /></div>
            <div className="stat-info">
              <span className="stat-label">Destacados</span>
              <span className="stat-value">{estadisticas?.destacados || 0}</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon"><TimerIcon /></div>
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
                <div key={producto.id_producto} className={`producto-card ${!producto.visible ? 'producto-oculto' : ''}`}>
                  <div className="producto-imagen">
                    <img
                      src={producto.imagen_url || producto.imagen_principal || PLACEHOLDER_IMAGE}
                      alt={producto.nombre || 'Producto'}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = PLACEHOLDER_IMAGE;
                      }}
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
                    <h3>{producto.nombre || 'Sin nombre'}</h3>
                    <span className="producto-categoria">
                      <CategoryIcon fontSize="small" />
                      {producto.categoria || 'Sin categoría'}
                    </span>

                    <div className="producto-precios">
                      {producto.descuento > 0 ? (
                        <>
                          <span className="precio-original">${formatPrice(producto.precio)}</span>
                          <span className="precio-descuento">
                            ${formatPrice(producto.precio * (1 - producto.descuento / 100))}
                          </span>
                        </>
                      ) : (
                        <span className="precio-normal">${formatPrice(producto.precio)}</span>
                      )}
                    </div>

                    <div className="producto-detalles">
                      <span className={`estado-badge estado-${(producto.estado_producto || producto.estado || 'buen-estado').toLowerCase().replace(/\s+/g, '-')}`}>
                        {producto.estado_producto || producto.estado || 'Buen estado'}
                      </span>
                      <span className="producto-stock">
                        <BoxIcon fontSize="small" />
                        Stock: {producto.stock || 0}
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
                        onClick={() => handleToggleVisible(producto.id_producto)}
                        title={producto.visible ? "Ocultar" : "Mostrar"}
                      >
                        {producto.visible ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </button>
                      <button
                        className="btn-accion destacar"
                        onClick={() => handleToggleDestacado(producto.id_producto)}
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

              <form onSubmit={handleGuardarProducto}>
                <div className="modal-body">
                  <div className="form-grid">
                    <div className="form-group">
                      <label><SellIcon fontSize="small" />Nombre del producto *</label>
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
                      <label><CategoryIcon fontSize="small" />Categoría *</label>
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
                      <label><AttachMoneyIcon fontSize="small" />Precio ($) *</label>
                      <input
                        type="number"
                        name="precio"
                        value={formProducto.precio}
                        onChange={handleInputChange}
                        required
                        min="0"
                        step="0.01"
                        placeholder="0"
                      />
                    </div>

                    <div className="form-group">
                      <label><LocalOfferIcon fontSize="small" />Descuento (%)</label>
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
                      <label><BoxIcon fontSize="small" />Stock *</label>
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

                    {/* ✅ NUEVO: subida de archivo real en vez de input de texto con URL */}
                    <div className="form-group full-width">
                      <label><ImageIcon fontSize="small" />Imagen del producto</label>

                      <input
                        type="file"
                        accept="image/*"
                        ref={inputImagenRef}
                        onChange={handleImagenSeleccionada}
                        style={{ display: "none" }}
                        id="input-imagen-producto"
                      />

                      <label
                        htmlFor="input-imagen-producto"
                        className="btn-subir-imagen"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          cursor: "pointer",
                          border: "1px dashed #999",
                          borderRadius: "8px",
                          padding: "12px",
                          justifyContent: "center",
                          color: "#555"
                        }}
                      >
                        <CloudUploadIcon fontSize="small" />
                        {archivoImagen ? archivoImagen.name : "Seleccionar imagen desde tu equipo"}
                      </label>

                      {previewImagen && (
                        <div style={{ marginTop: "10px", textAlign: "center" }}>
                          <img
                            src={previewImagen}
                            alt="Vista previa"
                            style={{
                              maxWidth: "160px",
                              maxHeight: "160px",
                              borderRadius: "8px",
                              objectFit: "cover"
                            }}
                          />
                          <div>
                            <button
                              type="button"
                              onClick={limpiarImagenSeleccionada}
                              style={{
                                marginTop: "6px",
                                background: "none",
                                border: "none",
                                color: "#c0392b",
                                cursor: "pointer",
                                fontSize: "13px"
                              }}
                            >
                              Quitar imagen
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="form-group full-width">
                      <label><DescriptionIcon fontSize="small" />Descripción</label>
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
                  <button type="submit" className="btn-guardar" disabled={guardando}>
                    {guardando ? (
                      <span className="spinner-small"></span>
                    ) : modoEdicion ? (
                      <EditIcon />
                    ) : (
                      <AddIcon />
                    )}
                    {guardando ? "Guardando..." : modoEdicion ? "Guardar Cambios" : "Crear Producto"}
                  </button>
                  <button type="button" className="btn-cancelar" onClick={() => setModalProductoAbierto(false)} disabled={guardando}>
                    <CloseIcon />
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL DETALLE */}
        {modalDetalleAbierto && productoSeleccionado && (
          <div className="modal-overlay" onClick={() => setModalDetalleAbierto(false)}>
            <div className="modal-detalle" onClick={(e) => e.stopPropagation()}>
              <button className="modal-cerrar" onClick={() => setModalDetalleAbierto(false)}>
                <CloseIcon />
              </button>

              <div className="modal-header">
                <h2>{productoSeleccionado.nombre || 'Sin nombre'}</h2>
                <span className="cliente-id">ID: #{productoSeleccionado.id_producto}</span>
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
                      src={productoSeleccionado.imagen_url || productoSeleccionado.imagen_principal || PLACEHOLDER_IMAGE}
                      alt={productoSeleccionado.nombre || 'Producto'}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = PLACEHOLDER_IMAGE;
                      }}
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
                      <span className="info-value">{productoSeleccionado.categoria || 'Sin categoría'}</span>
                    </div>

                    <div className="info-item">
                      <span className="info-label">Precio</span>
                      <span className="info-value">
                        {productoSeleccionado.descuento > 0 ? (
                          <>
                            <span className="precio-original">${formatPrice(productoSeleccionado.precio)}</span>
                            <span className="precio-descuento">
                              ${formatPrice(productoSeleccionado.precio * (1 - productoSeleccionado.descuento / 100))}
                            </span>
                            <span className="descuento-badge">-{productoSeleccionado.descuento}%</span>
                          </>
                        ) : (
                          `$${formatPrice(productoSeleccionado.precio)}`
                        )}
                      </span>
                    </div>

                    <div className="info-item">
                      <span className="info-label">Stock</span>
                      <span className="info-value">{productoSeleccionado.stock || 0} unidades</span>
                    </div>

                    <div className="info-item">
                      <span className="info-label">Estado</span>
                      <span className="info-value">
                        <span className={`estado-badge estado-${(productoSeleccionado.estado_producto || productoSeleccionado.estado || 'buen-estado').toLowerCase().replace(/\s+/g, '-')}`}>
                          {productoSeleccionado.estado_producto || productoSeleccionado.estado || 'Buen estado'}
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
                        {productoSeleccionado.fecha_publicacion
                          ? new Date(productoSeleccionado.fecha_publicacion).toLocaleDateString()
                          : 'No publicada'}
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

        {/* MODAL ELIMINAR */}
        {modalEliminarAbierto && productoSeleccionado && (
          <div className="modal-overlay" onClick={() => setModalEliminarAbierto(false)}>
            <div className="modal-confirmar" onClick={(e) => e.stopPropagation()}>
              <div className="modal-icono">
                <WarningIcon />
              </div>
              <h3>¿Eliminar producto?</h3>
              <p>Estás a punto de eliminar <strong>{productoSeleccionado.nombre || 'este producto'}</strong></p>
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
