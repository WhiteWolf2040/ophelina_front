// OphelinaTienda.js - Versión con publicación automática comentada y modal mejorado

import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./OphelinaTienda.css";
import Navbar from "../ClientesNav/Navbar";
import { getProductosTienda, apartarProducto, getMisApartados } from "../config/auth";

/* ================= MODAL MEJORADO ================= */
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

            {/* Características mejoradas */}
            <div className="detalle-caracteristicas-vertical">
              <p><strong>Material:</strong> {producto?.material || "N/A"}</p>
              <p><strong>Categoría:</strong> {producto?.categoria || "General"}</p>
              <p><strong>Estado:</strong> {producto?.estado || "Disponible"}</p>
            </div>

            <div className="detalle-seccion">
              <h4>Información del Producto</h4>
              <div className="detalle-financiero">
                <div className="financiero-item">
                  <span>Precio total:</span>
                  <span>
                    {producto?.descuento > 0 && (
                      <span style={{ textDecoration: "line-through", marginRight: "8px", color: "#999" }}>
                        {producto?.precioOriginal}
                      </span>
                    )}
                    {producto?.precio}
                  </span>
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

  // 🔥 Estado para la publicación automática (simulada)
  const [publicacionAuto, setPublicacionAuto] = useState({
    ejecutando: false,
    resultado: null,
    empenosVencidos: []
  });

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

  // 🔥 Detectar el regreso desde Stripe Checkout
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const pago = params.get("pago");

    if (pago === "exitoso") {
      setCategoriaActiva("apartados");
      setMensajeApartado({ mostrar: true, producto: "tu producto" });
      setTimeout(() => setMensajeApartado({ mostrar: false, producto: "" }), 4000);
      navigate("/ophelina", { replace: true });
    } else if (pago === "cancelado") {
      setError("El pago fue cancelado, tu producto no quedó apartado.");
      navigate("/ophelina", { replace: true });
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
      window.location.href = result.data.checkout_url;
    } else {
      setApartando(false);
      setError(result.message || "No se pudo iniciar el apartado");
      setModalAbierto(false);
    }
  };

  // ================================================================
  // 🔥 PUBLICACIÓN AUTOMÁTICA - SIMULADA (SOLO CONSOLA)
  // La funcionalidad real está comentada, solo muestra en consola
  // ================================================================
  const ejecutarPublicacionAuto = async () => {
    setPublicacionAuto({ ejecutando: true, resultado: null, empenosVencidos: [] });

    // --- SIMULACIÓN: Mostrar en consola los empeños que se publicarían ---
    console.log("=== PUBLICACIÓN AUTOMÁTICA (SIMULADA) ===");
    console.log("📋 Buscando empeños vencidos con periodo de gracia cumplido...");
    
    // Simular empeños vencidos (esto normalmente vendría del backend)
    const empenosSimulados = [
      { id: 101, folio: "EMP-001", descripcion: "Anillo de oro 14k", valor: 4500, vencido_desde: "2026-07-15" },
      { id: 102, folio: "EMP-002", descripcion: "Cadena de plata", valor: 2800, vencido_desde: "2026-07-20" },
      { id: 103, folio: "EMP-003", descripcion: "Reloj de pulsera", valor: 12000, vencido_desde: "2026-07-25" },
    ];

    console.log(`🔍 Encontrados ${empenosSimulados.length} empeños elegibles:`);
    empenosSimulados.forEach((e, i) => {
      console.log(`  ${i+1}. Folio: ${e.folio} | ${e.descripcion} | $${e.valor} | Vencido: ${e.vencido_desde}`);
    });

    // Simular el proceso de publicación
    console.log("📤 Publicando productos en la tienda...");
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simular delay

    const productosPublicados = empenosSimulados.map(e => ({
      id: `PUB-${e.id}`,
      nombre: e.descripcion,
      precio: e.valor,
      categoria: "Joyas",
      estado: "Buen estado",
      publicacion_automatica: true,
      fecha_publicacion: new Date().toISOString().split('T')[0]
    }));

    console.log(`✅ ${productosPublicados.length} producto(s) publicado(s) automáticamente:`);
    productosPublicados.forEach((p, i) => {
      console.log(`  ${i+1}. ${p.nombre} - $${p.precio} - ${p.estado}`);
    });
    console.log("=== FIN PUBLICACIÓN SIMULADA ===");

    // Actualizar estado para mostrar en el modal
    setPublicacionAuto({
      ejecutando: false,
      resultado: {
        success: true,
        message: `${productosPublicados.length} producto(s) publicado(s) automáticamente`,
        productos: productosPublicados
      },
      empenosVencidos: empenosSimulados
    });
  };

  // ================================================================
  // FUNCIÓN REAL COMENTADA (para restaurar después)
  // ================================================================
  /*
  const ejecutarPublicacionAuto = async () => {
    setPublicacionAuto({ ejecutando: true, resultado: null, empenosVencidos: [] });
    
    try {
      const response = await fetch('/api/tienda/publicacion-automatica', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dias_gracia: 0 })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setPublicacionAuto({
          ejecutando: false,
          resultado: data,
          empenosVencidos: data.empenos || []
        });
        // Recargar productos
        await cargarDatos();
      } else {
        setPublicacionAuto({
          ejecutando: false,
          resultado: { success: false, message: data.message },
          empenosVencidos: []
        });
      }
    } catch (error) {
      setPublicacionAuto({
        ejecutando: false,
        resultado: { success: false, message: error.message },
        empenosVencidos: []
      });
    }
  };
  */

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
                        {producto.descuento > 0 ? (
                            <div className="product-price-wrapper">
                              <span className="product-price-original">{producto.precioOriginal}</span>
                              <span className="product-price">{producto.precio}</span>
                            </div>
                          ) : (
                            <span className="product-price">{producto.precio}</span>
                          )}

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

        {/* ============================================================ */}
        {/* SECCIÓN DE PUBLICACIÓN AUTOMÁTICA - MODAL MEJORADO */}
        {/* ============================================================ */}
        <section className="publicacion-auto-section">
          <div className="publicacion-auto-container">
            <div className="publicacion-auto-header">
              <h3 className="publicacion-auto-title">
                <span className="icon-auto">⚡</span>
                Publicación Automática
              </h3>
              <p className="publicacion-auto-desc">
                Esta función buscará empeños vencidos y los publicará automáticamente en la tienda online.
              </p>
            </div>

            <div className="publicacion-auto-config">
              <div className="config-item">
                <span className="config-label">Días de gracia después del vencimiento:</span>
                <span className="config-value">0 días</span>
              </div>
              <p className="config-nota">
                Los productos se publicarán después de 0 días de vencido el contrato.
              </p>
            </div>

            <button
              className={`btn-publicacion-auto ${publicacionAuto.ejecutando ? 'btn-ejecutando' : ''}`}
              onClick={ejecutarPublicacionAuto}
              disabled={publicacionAuto.ejecutando}
            >
              {publicacionAuto.ejecutando ? (
                <>
                  <span className="spinner"></span>
                  Ejecutando...
                </>
              ) : (
                'Ejecutar Publicación'
              )}
            </button>

            {/* Modal de resultados mejorado */}
            {publicacionAuto.resultado && (
              <div className="resultado-modal">
                <div className={`resultado-header ${publicacionAuto.resultado.success ? 'exito' : 'error'}`}>
                  <span className="resultado-icono">
                    {publicacionAuto.resultado.success ? '✅' : '❌'}
                  </span>
                  <span className="resultado-mensaje">
                    {publicacionAuto.resultado.message}
                  </span>
                </div>

                {publicacionAuto.empenosVencidos.length > 0 && (
                  <div className="resultado-detalle">
                    <h4>📋 Empeños encontrados para publicar:</h4>
                    <div className="empenos-lista">
                      {publicacionAuto.empenosVencidos.map((empeno, idx) => (
                        <div key={idx} className="empeno-item">
                          <span className="empeno-folio">{empeno.folio}</span>
                          <span className="empeno-descripcion">{empeno.descripcion}</span>
                          <span className="empeno-valor">${empeno.valor}</span>
                          <span className="empeno-estado">📤 Publicado</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {publicacionAuto.resultado.productos && (
                  <div className="resultado-productos">
                    <h4>🛒 Productos creados en tienda:</h4>
                    <div className="productos-creados-lista">
                      {publicacionAuto.resultado.productos.map((p, idx) => (
                        <div key={idx} className="producto-creado-item">
                          <span className="producto-nombre">{p.nombre}</span>
                          <span className="producto-precio">${p.precio}</span>
                          <span className="producto-categoria">{p.categoria}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <button
                  className="btn-cerrar-resultado"
                  onClick={() => setPublicacionAuto({ ejecutando: false, resultado: null, empenosVencidos: [] })}
                >
                  Cerrar
                </button>
              </div>
            )}
          </div>
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