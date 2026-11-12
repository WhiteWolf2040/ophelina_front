// src/DuenoTienda/TiendaOnline.jsx — VERSIÓN FUSIONADA (Productos + Apartados)
import React, { useState, useEffect, useRef, useMemo } from "react";
import { useTienda } from "../hooks/useTienda";
import AppModal from "../components/AppModal";
import ProductoModal from "./ProductoModal";
import ApartadosAdminService from "../services/ApartadosAdminService";
import "./TiendaOnline.css";

// Iconos
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
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import WarningIcon from '@mui/icons-material/Warning';
import CloseIcon from '@mui/icons-material/Close';
import ClearIcon from '@mui/icons-material/Clear';
import BoxIcon from '@mui/icons-material/Inventory';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import SettingsIcon from '@mui/icons-material/Settings';
import RefreshIcon from '@mui/icons-material/Refresh';
import TimerIcon from '@mui/icons-material/Timer';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import PendingIcon from '@mui/icons-material/Pending';
import LockIcon from '@mui/icons-material/Lock';
import PaymentsIcon from '@mui/icons-material/Payments';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';

const PLACEHOLDER_IMAGE = '/placeholder.png';
const CLOUDINARY_CLOUD_NAME = "mbeup6wz";
const CLOUDINARY_UPLOAD_PRESET = "ophelina_productos";

const TiendaOnline = () => {
  // ========== HOOK DE TIENDA ==========
  const {
    productos,
    estadisticas,
    loading,
    error,
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

  // ========== TAB ACTIVA ==========
  const [tabActiva, setTabActiva] = useState("productos"); // "productos" | "apartados"

  // ========== ESTADOS DE PRODUCTOS ==========
  const [busqueda, setBusqueda] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState("Todas");
  const [estadoFiltro, setEstadoFiltro] = useState("Todos");
  const [verSoloVisibles, setVerSoloVisibles] = useState(false);
  const [paginaActual, setPaginaActual] = useState(1);
  const productosPorPagina = 8;
  const [guardando, setGuardando] = useState(false);
  const [publicando, setPublicando] = useState(false);
  const [diasGracia, setDiasGracia] = useState(5);
  const [resultadoPublicacion, setResultadoPublicacion] = useState(null);

  const [modalProductoAbierto, setModalProductoAbierto] = useState(false);
  const [modalDetalleAbierto, setModalDetalleAbierto] = useState(false);
  const [modalEliminarAbierto, setModalEliminarAbierto] = useState(false);
  const [modalPublicacionAbierto, setModalPublicacionAbierto] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [modoEdicion, setModoEdicion] = useState(false);

  // ========== ESTADOS DE APARTADOS ==========
  const [apartados, setApartados] = useState([]);
  const [loadingApartados, setLoadingApartados] = useState(false);
  const [errorApartados, setErrorApartados] = useState(null);
  const [codigoInputs, setCodigoInputs] = useState({});
  const [montoInputs, setMontoInputs] = useState({});
  const [metodoInputs, setMetodoInputs] = useState({});
  const [procesando, setProcesando] = useState(null);
  const [mensajeErrorApartado, setMensajeErrorApartado] = useState({});
  const [busquedaApartados, setBusquedaApartados] = useState("");
  const [apartadosCargados, setApartadosCargados] = useState(false);

  // ========== AppModal ==========
  const [modal, setModal] = useState({
    isOpen: false, type: "info", title: "", message: "",
    onConfirm: null, onCancel: null, showCancel: false,
    confirmText: "Aceptar", cancelText: "Cancelar"
  });

  const mostrarModal = (config) => {
    setModal({
      isOpen: true,
      type: "info",
      confirmText: "Aceptar",
      cancelText: "Cancelar",
      onConfirm: () => setModal(prev => ({ ...prev, isOpen: false })),
      onCancel: () => setModal(prev => ({ ...prev, isOpen: false })),
      ...config
    });
  };

  const cerrarModal = () => setModal(prev => ({ ...prev, isOpen: false }));

  const categorias = ["Todas", "Joyería", "Electrónica", "Herramientas", "Relojes", "Instrumentos", "Otros"];
  const estados = ["Todos", "Nuevo", "Como nuevo", "Buen estado", "Aceptable"];

  // ========== CARGA DE APARTADOS (solo la 1ra vez al entrar a la tab) ==========
  useEffect(() => {
    if (tabActiva === "apartados" && !apartadosCargados) {
      cargarApartados("");
      setApartadosCargados(true);
    }
  }, [tabActiva, apartadosCargados]);

  const cargarApartados = async (terminoBusqueda = "") => {
    try {
      setLoadingApartados(true);
      setErrorApartados(null);
      const data = await ApartadosAdminService.getApartados(terminoBusqueda);
      if (data.success) {
        setApartados(data.data);
        const montosIniciales = {};
        data.data.forEach((a) => {
          montosIniciales[a.id_apartado] = a.monto_pendiente_numerico;
        });
        setMontoInputs(prev => ({ ...montosIniciales, ...prev }));
      } else {
        setErrorApartados(data.message || "No se pudieron cargar los apartados");
      }
    } catch (err) {
      setErrorApartados(err.response?.data?.message || "Error al conectar con el servidor");
    } finally {
      setLoadingApartados(false);
    }
  };

  // Debounce de búsqueda en apartados
  useEffect(() => {
    if (tabActiva !== "apartados") return;
    const timeout = setTimeout(() => {
      cargarApartados(busquedaApartados);
    }, 400);
    return () => clearTimeout(timeout);
  }, [busquedaApartados, tabActiva]);

  // ========== FILTRADO LOCAL DE PRODUCTOS ==========
  const todosLosProductos = productos?.data || [];

  const productosFiltrados = useMemo(() => {
    return todosLosProductos.filter(p => {
      const matchBusqueda = !busqueda.trim() ||
        (p.nombre || '').toLowerCase().includes(busqueda.toLowerCase()) ||
        (p.categoria || '').toLowerCase().includes(busqueda.toLowerCase());
      const matchCategoria = categoriaFiltro === "Todas" || p.categoria === categoriaFiltro;
      const matchEstado = estadoFiltro === "Todos" || (p.estado_producto || p.estado) === estadoFiltro;
      const matchVisible = !verSoloVisibles || p.visible === true;
      return matchBusqueda && matchCategoria && matchEstado && matchVisible;
    });
  }, [todosLosProductos, busqueda, categoriaFiltro, estadoFiltro, verSoloVisibles]);

  const totalPaginas = Math.ceil(productosFiltrados.length / productosPorPagina);
  const indiceUltimo = paginaActual * productosPorPagina;
  const indicePrimero = indiceUltimo - productosPorPagina;
  const productosActuales = productosFiltrados.slice(indicePrimero, indiceUltimo);

  useEffect(() => {
    setPaginaActual(1);
  }, [busqueda, categoriaFiltro, estadoFiltro, verSoloVisibles]);

  const cambiarPagina = (n) => setPaginaActual(n);
  const irPaginaSiguiente = () => setPaginaActual(p => Math.min(p + 1, totalPaginas));
  const irPaginaAnterior = () => setPaginaActual(p => Math.max(p - 1, 1));

  const obtenerNumerosPagina = () => {
    const numeros = [];
    const maxVisibles = 5;
    let inicio = Math.max(1, paginaActual - Math.floor(maxVisibles / 2));
    let fin = Math.min(totalPaginas, inicio + maxVisibles - 1);
    if (fin - inicio + 1 < maxVisibles) inicio = Math.max(1, fin - maxVisibles + 1);
    for (let i = inicio; i <= fin; i++) numeros.push(i);
    return numeros;
  };

  // ========== SUBIR IMAGEN ==========
  const subirImagenACloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
    formData.append("folder", "productos");

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      { method: "POST", body: formData }
    );

    if (!response.ok) throw new Error("Error al subir la imagen");
    const data = await response.json();
    return data.secure_url;
  };

  // ========== MANEJADORES DE PRODUCTOS ==========
  const abrirNuevoProducto = () => {
    setModoEdicion(false);
    setProductoSeleccionado(null);
    setModalProductoAbierto(true);
  };

  const abrirEditarProducto = (producto) => {
    setModoEdicion(true);
    setProductoSeleccionado(producto);
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

  const abrirModalPublicacion = () => setModalPublicacionAbierto(true);

  const handleGuardarProducto = async ({ form, archivoImagen, modoEdicion: esEdicion, producto }) => {
    setGuardando(true);
    try {
      let imagenUrl = null;
      if (archivoImagen) {
        imagenUrl = await subirImagenACloudinary(archivoImagen);
      }

      const formData = new FormData();
      formData.append("nombre", form.nombre);
      formData.append("categoria", form.categoria);
      formData.append("precio", Number(form.precio));
      formData.append("descuento", Number(form.descuento));
      formData.append("stock", Number(form.stock));
      formData.append("descripcion", form.descripcion || "");
      formData.append("estado", form.estado);
      formData.append("visible", form.visible ? "1" : "0");
      formData.append("destacado", form.destacado ? "1" : "0");
      if (imagenUrl) formData.append("imagen_url", imagenUrl);

      if (esEdicion && producto) {
        await actualizarProducto(producto.id_producto, formData);
      } else {
        await crearProducto(formData);
      }

      setModalProductoAbierto(false);
      mostrarModal({
        type: "success",
        title: esEdicion ? "Producto actualizado" : "Producto creado",
        message: `El producto "${form.nombre}" se ${esEdicion ? "actualizó" : "creó"} correctamente.`
      });
    } catch (err) {
      console.error("Error guardando producto:", err);
      mostrarModal({
        type: "error",
        title: "Error al guardar",
        message: err.response?.data?.message || err.message || "No se pudo guardar el producto."
      });
    } finally {
      setGuardando(false);
    }
  };

  const handleEliminarProducto = async () => {
    try {
      await eliminarProducto(productoSeleccionado.id_producto);
      setModalEliminarAbierto(false);
      const nombreEliminado = productoSeleccionado.nombre;
      setProductoSeleccionado(null);
      mostrarModal({
        type: "success",
        title: "Producto eliminado",
        message: `"${nombreEliminado || "El producto"}" fue eliminado correctamente.`
      });
    } catch (err) {
      mostrarModal({
        type: "error",
        title: "Error al eliminar",
        message: err.response?.data?.message || err.message || "No se pudo eliminar el producto."
      });
    }
  };

  const handleToggleVisible = async (id) => {
    try { await toggleVisibilidad(id); }
    catch (err) {
      mostrarModal({ type: "error", title: "Error", message: "No se pudo cambiar la visibilidad." });
    }
  };

  const handleToggleDestacado = async (id) => {
    try { await toggleDestacado(id); }
    catch (err) {
      mostrarModal({ type: "error", title: "Error", message: "No se pudo cambiar el estado destacado." });
    }
  };

  const handlePublicacionAutomatica = async () => {
    setPublicando(true);
    setResultadoPublicacion(null);
    try {
      const resultado = await ejecutarPublicacionAutomatica(diasGracia);
      setResultadoPublicacion(resultado);
    } catch (err) {
      setResultadoPublicacion({
        error: true,
        message: err.response?.data?.message || err.message || "Error al publicar"
      });
    } finally {
      setPublicando(false);
    }
  };

  const handleConfigurarDiasGracia = async () => {
    try {
      await configurarDiasGracia(diasGracia);
      mostrarModal({
        type: "success",
        title: "Configuración guardada",
        message: `Los días de gracia se configuraron a ${diasGracia} días.`
      });
    } catch (err) {
      mostrarModal({
        type: "error",
        title: "Error al configurar",
        message: err.response?.data?.message || err.message || "No se pudo guardar la configuración."
      });
    }
  };

  // ========== MANEJADORES DE APARTADOS ==========
  const handleCodigoChange = (id, valor) => {
    setCodigoInputs(prev => ({ ...prev, [id]: valor.toUpperCase() }));
    setMensajeErrorApartado(prev => ({ ...prev, [id]: null }));
  };

  const handleMontoChange = (id, valor) => {
    setMontoInputs(prev => ({ ...prev, [id]: valor }));
  };

  const handleMetodoChange = (id, valor) => {
    setMetodoInputs(prev => ({ ...prev, [id]: valor }));
  };

  const handleConfirmarEntrega = async (idApartado) => {
    const codigo = (codigoInputs[idApartado] || "").trim();
    if (!codigo) {
      setMensajeErrorApartado(prev => ({ ...prev, [idApartado]: "Ingresa el código del cliente" }));
      return;
    }

    const montoPagado = montoInputs[idApartado];
    const metodoPago = metodoInputs[idApartado] || "efectivo";

    try {
      setProcesando(idApartado);
      const result = await ApartadosAdminService.marcarEntregado(idApartado, codigo, montoPagado, metodoPago);

      if (result.success) {
        setApartados(prev => prev.map(a =>
          a.id_apartado === idApartado
            ? {
                ...a,
                entregado: true,
                fecha_entrega: result.data.fecha_entrega,
                monto_pagado_resto: result.data.monto_pagado_resto,
                metodo_pago_resto: metodoPago,
              }
            : a
        ));
        setCodigoInputs(prev => ({ ...prev, [idApartado]: "" }));
        mostrarModal({
          type: "success",
          title: "Entrega confirmada",
          message: "Se entregó el producto correctamente."
        });
      } else {
        setMensajeErrorApartado(prev => ({ ...prev, [idApartado]: result.message }));
      }
    } catch (err) {
      setMensajeErrorApartado(prev => ({
        ...prev,
        [idApartado]: err.response?.data?.message || "Error al confirmar la entrega"
      }));
    } finally {
      setProcesando(null);
    }
  };

  const pendientes = apartados.filter(a => !a.entregado);
  const entregados = apartados.filter(a => a.entregado);

  const formatPrice = (price) => {
    if (price === null || price === undefined || isNaN(price)) return '0';
    return Number(price).toLocaleString();
  };

  // ========== RENDER ==========
  return (
    <div className="dashboard">
      
      <div className="content">
        <div className="tienda-toolbar">
  {/* Tabs (izquierda) */}
  <div className="tienda-tabs">
    <button
      className={`tienda-tab ${tabActiva === "productos" ? "activo" : ""}`}
      onClick={() => setTabActiva("productos")}
    >
      <StorefrontIcon fontSize="small" />
      Productos
    </button>

    <button
      className={`tienda-tab ${tabActiva === "apartados" ? "activo" : ""}`}
      onClick={() => setTabActiva("apartados")}
    >
      <ShoppingBagIcon fontSize="small" />
      Apartados
      {pendientes.length > 0 && (
        <span className="tienda-tab-badge">{pendientes.length}</span>
      )}
    </button>
  </div>

  {/* Botones de acción (derecha) — solo en tab Productos */}
  {tabActiva === "productos" && (
    <div className="tienda-toolbar-actions">
      
      <button className="btn-nuevo" onClick={abrirNuevoProducto}>
        <AddIcon fontSize="small" />
        Nuevo Producto
      </button>
    </div>
  )}
</div>

        

       

        {/* ============================================ */}
        {/* TAB: PRODUCTOS */}
        {/* ============================================ */}
        {tabActiva === "productos" && (
          <>
            {/* ESTADÍSTICAS */}
            <div className="cards-grid">
              <div className="stat-card">
                <InventoryIcon className="card-icon" />
                <h3>Total Productos</h3>
                <p className="stat-number">{estadisticas?.total || 0}</p>
              </div>
              <div className="stat-card">
                <VisibilityIcon className="card-icon" />
                <h3>Visibles</h3>
                <p className="stat-number">{estadisticas?.visibles || 0}</p>
              </div>
              <div className="stat-card">
                <VisibilityOffIcon className="card-icon" />
                <h3>Ocultos</h3>
                <p className="stat-number">{estadisticas?.ocultos || 0}</p>
              </div>
              <div className="stat-card">
                <AttachMoneyIcon className="card-icon" />
                <h3>Valor Total</h3>
                <p className="stat-number">${estadisticas?.valor_total || 0}</p>
              </div>
              <div className="stat-card">
                <StarIcon className="card-icon" />
                <h3>Destacados</h3>
                <p className="stat-number">{estadisticas?.destacados || 0}</p>
              </div>
              
            </div>

            {/* FILTROS */}
            <div className="nueva-seccion">
              <h2><SearchIcon /> Filtros y búsqueda</h2>
              <div className="filtros-tienda">
                
                <div className="buscador">
                  
                  <input 
                    type="text"
                    placeholder="Buscar productos..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    className="buscador-input"
                  />
                </div>
                <div className="filtros-selectores">
                  <select value={categoriaFiltro} onChange={(e) => setCategoriaFiltro(e.target.value)} className="filtro-select">
                    {categorias.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                  <select value={estadoFiltro} onChange={(e) => setEstadoFiltro(e.target.value)} className="filtro-select">
                    {estados.map(est => <option key={est} value={est}>{est}</option>)}
                  </select>
                  <label className="checkbox-label">
                    <input type="checkbox" checked={verSoloVisibles} onChange={(e) => setVerSoloVisibles(e.target.checked)} />
                    <VisibilityIcon fontSize="small" />
                    Solo visibles
                  </label>
                  <button className="btn-refrescar" onClick={() => { cargarProductos(); cargarEstadisticas(); }} title="Refrescar lista">
                    <RefreshIcon fontSize="small" />
                  </button>
                </div>
                {(busqueda || categoriaFiltro !== "Todas" || estadoFiltro !== "Todos" || verSoloVisibles) && (
                  <button className="btn-limpiar-filtros" onClick={() => {
                    setBusqueda(""); setCategoriaFiltro("Todas"); setEstadoFiltro("Todos"); setVerSoloVisibles(false);
                  }}>
                    <ClearIcon fontSize="small" /> Limpiar filtros
                  </button>
                )}
              </div>
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

            {/* GRID */}
            {!loading && !error && (
              <div className="nueva-seccion">
                <h2>
                  <StorefrontIcon /> Productos en tienda
                  <span className="seccion-badge">{productosFiltrados.length} productos</span>
                </h2>
                <div className="productos-grid">
                  {productosActuales.length > 0 ? (
                    productosActuales.map(producto => (
                      <div key={producto.id_producto} className={`producto-card ${!producto.visible ? 'producto-oculto' : ''}`}>
                        <div className="producto-imagen">
                          <img
                            src={producto.imagen_url || producto.imagen_principal || PLACEHOLDER_IMAGE}
                            alt={producto.nombre || 'Producto'}
                            onError={(e) => { e.target.onerror = null; e.target.src = PLACEHOLDER_IMAGE; }}
                          />
                          {producto.descuento > 0 && (
                            <span className="producto-descuento">-{producto.descuento}%</span>
                          )}
                          {producto.destacado && <span className="producto-destacado"><StarIcon /></span>}
                          {!producto.visible && (
                            <span className="producto-oculto-badge">
                              <VisibilityOffIcon fontSize="small" /> OCULTO
                            </span>
                          )}
                        </div>
                        <div className="producto-info">
                          <h3>{producto.nombre || 'Sin nombre'}</h3>
                          <span className="producto-categoria">
                            <CategoryIcon fontSize="small" /> {producto.categoria || 'Sin categoría'}
                          </span>
                          <div className="producto-precios">
                            {producto.descuento > 0 ? (
                              <>
                                <span className="precio-original">${formatPrice(producto.precio)}</span>
                                <span className="precio-descuento">${formatPrice(producto.precio * (1 - producto.descuento / 100))}</span>
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
                              <BoxIcon fontSize="small" /> Stock: {producto.stock || 0}
                            </span>
                          </div>
                          <div className="producto-acciones">
                            <button className="btn-icono btn-ver" onClick={() => abrirDetalleProducto(producto)} title="Ver detalles">
                              <VisibilityIcon fontSize="small" />
                            </button>
                            <button className="btn-icono btn-editar" onClick={() => abrirEditarProducto(producto)} title="Editar">
                              <EditIcon fontSize="small" />
                            </button>
                            <button className="btn-icono btn-visible" onClick={() => handleToggleVisible(producto.id_producto)}>
                              {producto.visible ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                            </button>
                            <button className="btn-icono btn-destacar" onClick={() => handleToggleDestacado(producto.id_producto)}>
                              {producto.destacado ? <StarIcon fontSize="small" /> : <StarBorderIcon fontSize="small" />}
                            </button>
                            <button className="btn-icono btn-eliminar" onClick={() => abrirEliminarProducto(producto)} title="Eliminar">
                              <DeleteIcon fontSize="small" />
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

                {totalPaginas > 1 && (
                  <div className="paginacion-wrapper">
                    <div className="paginacion-container">
                      <button className="btn-paginacion" onClick={irPaginaAnterior} disabled={paginaActual === 1}>
                        <ChevronLeftIcon />
                      </button>
                      <div className="paginacion-numeros">
                        {obtenerNumerosPagina().map(n => (
                          <button key={n} className={`btn-pagina ${paginaActual === n ? 'activo' : ''}`} onClick={() => cambiarPagina(n)}>
                            {n}
                          </button>
                        ))}
                      </div>
                      <button className="btn-paginacion" onClick={irPaginaSiguiente} disabled={paginaActual === totalPaginas}>
                        <ChevronRightIcon />
                      </button>
                    </div>
                    <div className="paginacion-info">
                      Mostrando {indicePrimero + 1} - {Math.min(indiceUltimo, productosFiltrados.length)} de {productosFiltrados.length} productos
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {/* ============================================ */}
        {/* TAB: APARTADOS */}
        {/* ============================================ */}
        {tabActiva === "apartados" && (
          <>
            {/* BUSCADOR */}
            <div className="nueva-seccion">
              <h2><SearchIcon /> Buscar apartados</h2>
              <div className="buscador-container">
                <SearchIcon className="buscador-icono" />
                <input
                  className="buscador-input"
                  type="text"
                  placeholder="Buscar por producto, cliente o código..."
                  value={busquedaApartados}
                  onChange={(e) => setBusquedaApartados(e.target.value)}
                />
              </div>
            </div>

            {loadingApartados && apartados.length === 0 && (
              <div className="loading-container">
                <div className="spinner"></div>
                <p>Cargando apartados...</p>
              </div>
            )}

            {errorApartados && (
              <div className="error-container">
                <WarningIcon className="error-icon" />
                <p>{errorApartados}</p>
                <button onClick={() => cargarApartados(busquedaApartados)}>Reintentar</button>
              </div>
            )}

            {/* PENDIENTES */}
            <div className="nueva-seccion">
              <h2>
                <PendingIcon /> Pendientes de entregar
                <span className="seccion-badge">{pendientes.length}</span>
              </h2>

              {pendientes.length === 0 ? (
                <div className="sin-resultados">
                  <PendingIcon className="empty-icon" />
                  <p>No hay apartados pendientes de entrega</p>
                </div>
              ) : (
                <div className="apartados-lista">
                  {pendientes.map((a) => (
                    <div key={a.id_apartado} className="apartado-card">
                      <div className="apartado-info">
                        <strong className="apartado-producto">{a.producto}</strong>
                        <span className="apartado-meta">
                          Cliente: {a.cliente} · Apartado el {a.fecha_apartado}
                        </span>
                        <div className="apartado-montos">
                          <span className="monto-anticipo">Anticipo: {a.monto_anticipo}</span>
                          <span className="monto-pendiente">Pendiente: {a.monto_pendiente}</span>
                        </div>
                      </div>

                      <div className="apartado-controles">
                        <div className="apartado-campo">
                          <LockIcon className="apartado-campo-icon" />
                          <input
                            type="text"
                            placeholder="Código"
                            value={codigoInputs[a.id_apartado] || ""}
                            onChange={(e) => handleCodigoChange(a.id_apartado, e.target.value)}
                            maxLength={10}
                            className="apartado-input codigo"
                          />
                        </div>
                        <div className="apartado-campo">
                          <PaymentsIcon className="apartado-campo-icon" />
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={montoInputs[a.id_apartado] ?? a.monto_pendiente_numerico}
                            onChange={(e) => handleMontoChange(a.id_apartado, e.target.value)}
                            className="apartado-input monto"
                          />
                        </div>
                        <select
                          value={metodoInputs[a.id_apartado] || "efectivo"}
                          onChange={(e) => handleMetodoChange(a.id_apartado, e.target.value)}
                          className="apartado-input metodo"
                        >
                          <option value="efectivo">Efectivo</option>
                          <option value="tarjeta">Tarjeta</option>
                          <option value="transferencia">Transferencia</option>
                        </select>
                        <button
                          className="btn-gold"
                          onClick={() => handleConfirmarEntrega(a.id_apartado)}
                          disabled={procesando === a.id_apartado}
                        >
                          {procesando === a.id_apartado ? (
                            <><span className="spinner-small"></span> Verificando...</>
                          ) : (
                            <><CheckCircleIcon fontSize="small" /> Confirmar entrega</>
                          )}
                        </button>
                      </div>

                      {mensajeErrorApartado[a.id_apartado] && (
                        <div className="apartado-error">
                          {mensajeErrorApartado[a.id_apartado]}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ENTREGADOS */}
            <div className="nueva-seccion">
              <h2>
                <CheckCircleIcon /> Ya entregados
                <span className="seccion-badge">{entregados.length}</span>
              </h2>
              {entregados.length === 0 ? (
                <div className="sin-resultados">
                  <CheckCircleIcon className="empty-icon" />
                  <p>Todavía no hay entregas confirmadas</p>
                </div>
              ) : (
                <div className="apartados-lista">
                  {entregados.map((a) => (
                    <div key={a.id_apartado} className="apartado-card entregado">
                      <div className="apartado-info">
                        <strong className="apartado-producto">{a.producto}</strong>
                        <span className="apartado-meta">Cliente: {a.cliente}</span>
                        {a.monto_pagado_resto && (
                          <span className="apartado-meta">
                            Saldo cobrado: {a.monto_pagado_resto} ({a.metodo_pago_resto})
                          </span>
                        )}
                      </div>
                      <div className="apartado-entregado">
                        <CheckCircleIcon />
                        <div>
                          <strong>Entregado</strong>
                          <small>{a.fecha_entrega}</small>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {/* MODAL PUBLICACIÓN AUTOMÁTICA */}
        {modalPublicacionAbierto && (
          <div className="modal-overlay" onClick={() => setModalPublicacionAbierto(false)}>
            <div className="modal-publicacion" onClick={(e) => e.stopPropagation()}>
              <button className="modal-cerrar" onClick={() => setModalPublicacionAbierto(false)}>
                <CloseIcon />
              </button>
              <div className="modal-header">
                <h2><AutoAwesomeIcon className="modal-icon" /> Publicación Automática</h2>
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
                    <button className="btn-configurar-gracia" onClick={handleConfigurarDiasGracia} title="Guardar configuración">
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
                      <><CancelIcon /><span>{resultadoPublicacion.message}</span></>
                    ) : (
                      <><CheckCircleIcon /><span>{resultadoPublicacion.message || `✅ ${resultadoPublicacion.productos_creados || 0} productos publicados`}</span></>
                    )}
                  </div>
                )}

                <button className="btn-ejecutar-publicacion" onClick={handlePublicacionAutomatica} disabled={publicando}>
                  {publicando ? (
                    <><span className="spinner-small"></span>Publicando...</>
                  ) : (
                    <><AutoAwesomeIcon />Ejecutar Publicación</>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ProductoModal (solo aplica cuando tab = productos) */}
        <ProductoModal
          isOpen={modalProductoAbierto}
          onClose={() => setModalProductoAbierto(false)}
          onSave={handleGuardarProducto}
          producto={modoEdicion ? productoSeleccionado : null}
          guardando={guardando}
          onError={(err) => mostrarModal({ type: "error", ...err })}
        />

        {/* MODAL DETALLE PRODUCTO (solo cuando tab = productos) */}
        {modalDetalleAbierto && productoSeleccionado && (
          <div className="modal-overlay" onClick={() => setModalDetalleAbierto(false)}>
            <div className="modal-detalle" onClick={(e) => e.stopPropagation()}>
              <button className="modal-cerrar" onClick={() => setModalDetalleAbierto(false)}>
                <CloseIcon />
              </button>
              <div className="modal-header">
                <h2>{productoSeleccionado.nombre || 'Sin nombre'}</h2>
                <span className="cliente-id">ID: #{productoSeleccionado.id_producto}</span>
              </div>
              <div className="modal-body">
                <div className="detalle-grid">
                  <div className="detalle-imagen">
                    <img src={productoSeleccionado.imagen_url || productoSeleccionado.imagen_principal || PLACEHOLDER_IMAGE} alt={productoSeleccionado.nombre} />
                  </div>
                  <div className="detalle-info">
                    <div className="info-item">
                      <span className="info-label">Categoría</span>
                      <span className="info-value">{productoSeleccionado.categoria}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Precio</span>
                      <span className="info-value">${formatPrice(productoSeleccionado.precio)}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Stock</span>
                      <span className="info-value">{productoSeleccionado.stock || 0} unidades</span>
                    </div>
                    <div className="info-item full-width">
                      <span className="info-label">Descripción</span>
                      <span className="info-value">{productoSeleccionado.descripcion || 'Sin descripción'}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-acciones">
                <button className="btn-gold" onClick={() => { setModalDetalleAbierto(false); abrirEditarProducto(productoSeleccionado); }}>
                  <EditIcon /> Editar
                </button>
                <button className="btn-cancelar" onClick={() => { setModalDetalleAbierto(false); abrirEliminarProducto(productoSeleccionado); }}>
                  <DeleteIcon /> Eliminar
                </button>
                <button className="btn-cancelar" onClick={() => setModalDetalleAbierto(false)}>
                  <CloseIcon /> Cerrar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL ELIMINAR PRODUCTO */}
        {modalEliminarAbierto && productoSeleccionado && (
          <div className="modal-overlay" onClick={() => setModalEliminarAbierto(false)}>
            <div className="modal-confirmar" onClick={(e) => e.stopPropagation()}>
              <div className="modal-icono"><WarningIcon /></div>
              <h3>¿Eliminar producto?</h3>
              <p>Estás a punto de eliminar <strong>{productoSeleccionado.nombre || 'este producto'}</strong></p>
              <p className="advertencia">Esta acción no se puede deshacer</p>
              <div className="modal-botones">
                <button className="btn-cancelar" onClick={() => setModalEliminarAbierto(false)}>Cancelar</button>
                <button className="btn-confirmar-eliminar" onClick={handleEliminarProducto}>
                  <DeleteIcon /> Sí, eliminar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* AppModal global */}
        <AppModal
          isOpen={modal.isOpen}
          type={modal.type}
          title={modal.title}
          message={modal.message}
          confirmText={modal.confirmText}
          cancelText={modal.cancelText}
          showCancel={modal.showCancel}
          onConfirm={modal.onConfirm || cerrarModal}
          onCancel={modal.onCancel || cerrarModal}
        />
      </div>
    </div>
  );
};

export default TiendaOnline;