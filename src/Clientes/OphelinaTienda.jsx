import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./OphelinaTienda.css";
import Navbar from "../ClientesNav/Navbar";
import { getProductosTienda, apartarProducto, getMisApartados } from "../config/auth";

/* ================= MODAL ================= */
const Modal = ({ isOpen, onClose, onConfirmarApartado, producto, tipo, apartando }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>

        <div className="popup-detalles-flex">
          <div className="popup-imagen-container-left">
            <img
              src={producto?.imagen}
              alt={producto?.nombre}
              className="popup-imagen-left"
            />
          </div>

          <div className="popup-info-right">
            <h3 className="detalle-titulo">{producto?.nombre}</h3>
            <p className="detalle-descripcion">{producto?.descripcion}</p>

            <div className="detalle-caracteristicas-vertical">
              <p><strong>Material: {producto?.material || "N/A"}</strong></p>
            </div>

            <div className="detalle-seccion">
              <h4>Información del Producto</h4>
              <div className="detalle-financiero">
                <div className="financiero-item">
                  <span>Precio total:</span>
                  <span>{producto?.precio}</span>
                </div>
                <div className="financiero-item">
                  <span>Anticipo para apartar (50%):</span>
                  <span>{producto?.anticipo}</span>
                </div>
                {producto?.exclusivo && (
                  <div className="financiero-item exclusivo">
                    <span>Artículo exclusivo</span>
                    <span>⭐</span>
                  </div>
                )}
              </div>
            </div>

            {tipo === "apartar" && (
              <button
                className="pago-confirmar-btn"
                onClick={onConfirmarApartado}
                disabled={apartando}
                style={{ marginTop: "20px" }}
              >
                {apartando ? "Apartando..." : "Apartar ahora (pagar 50%)"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ================= TIENDA ================= */
export default function OphelinaTienda() {
  const location = useLocation();
  const navigate = useNavigate();
  const [busqueda, setBusqueda] = useState("");
  const [categoriaActiva, setCategoriaActiva] = useState("todas");
  const [modalAbierto, setModalAbierto] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [mensajeApartado, setMensajeApartado] = useState({ mostrar: false, producto: "" });
  const [apartando, setApartando] = useState(false);

  // 🔥 Datos reales del backend
  const [productos, setProductos] = useState([]);
  const [misApartados, setMisApartados] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  const categorias = [
    { id: "todas", nombre: "Todas las piezas" },
    { id: "oro", nombre: "Oro" },
    { id: "plata", nombre: "Plata" },
    { id: "electronicos", nombre: "Electrónicos" },
    { id: "exclusivo", nombre: "Edición Limitada" },
    { id: "apartados", nombre: "Mis apartados" },
  ];

  // 🔥 Cargar productos de la tienda y mis apartados al montar
  const cargarDatos = async () => {
    setCargando(true);
    setError("");

    const [resProductos, resApartados] = await Promise.all([
      getProductosTienda(),
      getMisApartados(),
    ]);

    if (resProductos.success) {
      setProductos(resProductos.data);
    } else {
      setError(resProductos.message || "No se pudieron cargar los productos");
    }

    if (resApartados.success) {
      setMisApartados(resApartados.data);
    }

    setCargando(false);
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  // 🔥 Detectar el regreso desde Stripe Checkout (success_url / cancel_url)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const pago = params.get("pago");

    if (pago === "exitoso") {
      setCategoriaActiva("apartados");
      setMensajeApartado({ mostrar: true, producto: "tu producto" });
      setTimeout(() => setMensajeApartado({ mostrar: false, producto: "" }), 4000);

      // Limpiamos el query param de la URL para que un refresh
      // no vuelva a disparar el toast
      navigate("/tienda", { replace: true });
    } else if (pago === "cancelado") {
      setError("El pago fue cancelado, tu producto no quedó apartado.");
      navigate("/tienda", { replace: true });
    }
  }, [location.search]);

  const handleApartar = (producto) => {
    setProductoSeleccionado(producto);
    setModalAbierto(true);
  };

  const handleConfirmarApartado = async () => {
    if (!productoSeleccionado) return;

    setApartando(true);
    const result = await apartarProducto(productoSeleccionado.id);

    if (result.success && result.data?.checkout_url) {
      // 🔥 Redirige a Stripe Checkout para pagar el 50% de anticipo
      window.location.href = result.data.checkout_url;
      // No hace falta setApartando(false) aquí: la página está a punto de cambiar
    } else {
      setApartando(false);
      setError(result.message || "No se pudo iniciar el apartado");
      setModalAbierto(false);
    }
  };

  // 🔹 Fuente de datos según la pestaña activa
  const listaBase = categoriaActiva === "apartados" ? misApartados : productos;

  const productosFiltrados = listaBase.filter((producto) => {
    const matchesBusqueda =
      (producto.nombre || "").toLowerCase().includes(busqueda.toLowerCase()) ||
      (producto.descripcion || "").toLowerCase().includes(busqueda.toLowerCase()) ||
      (producto.material || "").toLowerCase().includes(busqueda.toLowerCase());

    if (categoriaActiva === "apartados" || categoriaActiva === "todas") {
      return matchesBusqueda;
    }
    if (categoriaActiva === "exclusivo") {
      return producto.exclusivo && matchesBusqueda;
    }
    return producto.categoria === categoriaActiva && matchesBusqueda;
  });

  return (
    <>
      <Navbar />
      <main className="tienda-luxury">
        <section className="hero-luxury">
          <div className="hero-overlay"></div>
          <div className="hero-content">
            <h1 className="hero-title">
              <span className="hero-white">Ophaline</span><br />
              <span className="hero-gold">la que brinda apoyo</span>
            </h1>
            <p className="hero-description">
              Artículos de calidad procedentes de casas de empeño,<br />
              revisados y certificados para ofrecerte las mejores oportunidades.
            </p>
          </div>
        </section>

        <section className="filter-section">
          <div className="filter-container">
            <div className="search-wrapper">
              <input
                type="text"
                placeholder="Buscar artículos..."
                className="search-input-luxury"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
            </div>

            <div className="categories-wrapper">
              {categorias.map((cat) => (
                <button
                  key={cat.id}
                  className={`category-btn ${categoriaActiva === cat.id ? "active" : ""}`}
                  onClick={() => setCategoriaActiva(cat.id)}
                >
                  {cat.nombre}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="products-section">
          <div className="products-header">
            <h2 className="products-title">
              {categoriaActiva === "apartados"
                ? "Mis artículos apartados"
                : categoriaActiva === "todas"
                ? "Todas las piezas disponibles"
                : categorias.find((c) => c.id === categoriaActiva)?.nombre}
            </h2>
            <span className="products-count">
              {categoriaActiva === "apartados"
                ? `${misApartados.length} artículos apartados`
                : `${productosFiltrados.length} artículos`}
            </span>
          </div>

          {cargando ? (
            <p className="no-results">Cargando artículos...</p>
          ) : error ? (
            <p className="no-results">{error}</p>
          ) : (
            <>
              <div className="products-grid-luxury">
                {productosFiltrados.map((producto) => (
                  <article
                    key={producto.id}
                    className={`product-card-luxury ${
                      categoriaActiva === "apartados" ? "producto-apartado" : ""
                    }`}
                  >
                    <div className="card-media">
                      <div className="image-wrapper">
                        <img
                          src={producto.imagen}
                          alt={producto.nombre}
                          className="product-image"
                        />
                        {producto.exclusivo && (
                          <span className="exclusive-badge">Artículo exclusivo</span>
                        )}
                        {categoriaActiva === "apartados" && (
                          <span className="apartado-badge">
                            {producto.estadoPago === "pagado" ? "APARTADO" : "PAGO PENDIENTE"}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="card-content">
                      <div className="card-header">
                        <h3 className="product-name">{producto.nombre}</h3>
                        <p className="product-description">{producto.descripcion}</p>
                      </div>

                      <div className="card-footer">
                        <span className="product-price">{producto.precio}</span>

                        <div className="product-actions">
                          {categoriaActiva === "apartados" ? (
                            producto.estadoPago !== "pagado" && (
                              <span className="btn-apartado-disable">
                                <span>Pago pendiente</span>
                              </span>
                            )
                          ) : (
                            <button
                              className="btn-apartar"
                              onClick={() => handleApartar(producto)}
                            >
                              <span>Apartar (50%)</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              {productosFiltrados.length === 0 && (
                <div className="no-results">
                  {categoriaActiva === "apartados" ? (
                    <>
                      <p>No tienes artículos apartados</p>
                      <button
                        className="btn-limpiar"
                        onClick={() => setCategoriaActiva("todas")}
                      >
                        Ver artículos disponibles
                      </button>
                    </>
                  ) : (
                    <>
                      <p>No encontramos artículos que coincidan con tu búsqueda</p>
                      <button
                        className="btn-limpiar"
                        onClick={() => {
                          setBusqueda("");
                          setCategoriaActiva("todas");
                        }}
                      >
                        Ver todos los artículos
                      </button>
                    </>
                  )}
                </div>
              )}
            </>
          )}
        </section>

        <Modal
          isOpen={modalAbierto}
          onClose={() => setModalAbierto(false)}
          onConfirmarApartado={handleConfirmarApartado}
          producto={productoSeleccionado}
          tipo="apartar"
          apartando={apartando}
        />

        {/* Toast de "¡Apartado exitoso!" al volver de Stripe */}
        {mensajeApartado.mostrar && (
          <div className="mensaje-apartado">
            <div className="mensaje-contenido">
              <span className="mensaje-icono">✓</span>
              <span>
                ¡Apartado exitoso! Has apartado: <strong>{mensajeApartado.producto}</strong>
              </span>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
