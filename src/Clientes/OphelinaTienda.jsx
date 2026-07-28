// OphelinaTienda.js - Versión con publicación automática DESACTIVADA (solo consola)

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

  const [productos, setProductos] = useState([]);
  const [misApartados, setMisApartados] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

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
  // 🔥 PUBLICACIÓN AUTOMÁTICA - SOLO CONSOLA (NO PUBLICADA)
  // ================================================================
  const ejecutarPublicacionAuto = async () => {
    setPublicacionAuto({ ejecutando: true, resultado: null, empenosVencidos: [] });

    console.log("=== PUBLICACIÓN AUTOMÁTICA (SOLO CONSOLA - NO PUBLICADA) ===");
    console.log("📋 Buscando empeños vencidos con periodo de gracia cumplido...");
    
    // 🔥 DATOS SIMULADOS - ESTO DEBERÍA VENIR DEL BACKEND
    const empenosSimulados = [
      { 
        id: 101, 
        folio: "EMP-001", 
        descripcion: "Anillo de oro 14k con diamante", 
        valor: 4500, 
        vencido_desde: "2026-07-15",
        tipo: "Oro",
        estado: "Vencido"
      },
      { 
        id: 102, 
        folio: "EMP-002", 
        descripcion: "Cadena de plata esterlina", 
        valor: 2800, 
        vencido_desde: "2026-07-20",
        tipo: "Plata",
        estado: "Vencido"
      },
      { 
        id: 103, 
        folio: "EMP-003", 
        descripcion: "Reloj de pulsera automático", 
        valor: 12000, 
        vencido_desde: "2026-07-25",
        tipo: "Electrónicos",
        estado: "Vencido"
      },
      { 
        id: 104, 
        folio: "EMP-004", 
        descripcion: "Pulsera de oro blanco", 
        valor: 6800, 
        vencido_desde: "2026-07-28",
        tipo: "Oro",
        estado: "Vencido"
      },
    ];

    console.log(`🔍 Encontrados ${empenosSimulados.length} empeños elegibles:`);
    console.table(empenosSimulados.map(e => ({
      Folio: e.folio,
      Descripción: e.descripcion,
      Valor: `$${e.valor}`,
      'Vencido desde': e.vencido_desde,
      Estado: e.estado
    })));

    console.log("📋 Lista completa de empeños vencidos (NO PUBLICADOS):");
    empenosSimulados.forEach((e, i) => {
      console.log(`  ${i+1}. 📄 Folio: ${e.folio} | ${e.descripcion} | $${e.valor} | Vencido: ${e.vencido_desde}`);
    });

    console.log("⏸️ PUBLICACIÓN DESACTIVADA - Solo visualización en consola");
    console.log("📌 Si quisieras publicar, se crearían estos productos:");
    
    const productosSimulados = empenosSimulados.map(e => ({
      nombre: e.descripcion,
      precio: e.valor,
      categoria: e.tipo,
      estado: "Buen estado",
      folio_original: e.folio
    }));

    console.table(productosSimulados);
    console.log("=== FIN PUBLICACIÓN SIMULADA (NO PUBLICADA) ===");

    // Simular delay para dar tiempo a ver la consola
    await new Promise(resolve => setTimeout(resolve, 1500));

    setPublicacionAuto({
      ejecutando: false,
      resultado: {
        success: true,
        message: `${empenosSimulados.length} empeño(s) encontrado(s) - SOLO CONSOLA (NO PUBLICADO)`,
        solo_consola: true
      },
      empenosVencidos: empenosSimulados
    });
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
        {/* SECCIÓN DE PUBLICACIÓN AUTOMÁTICA - SOLO CONSOLA */}
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

            {/* Modal de resultados - SOLO VISUALIZACIÓN */}
            {publicacionAuto.resultado && (
              <div className="resultado-modal">
                <div className={`resultado-header ${publicacionAuto.resultado.success ? 'exito' : 'error'}`}>
                  <span className="resultado-icono">
                    {publicacionAuto.resultado.success ? '📋' : '❌'}
                  </span>
                  <span className="resultado-mensaje">
                    {publicacionAuto.resultado.message}
                  </span>
                </div>

                <div className="resultado-aviso" style={{ 
                  padding: '12px 20px', 
                  background: '#fff3e0', 
                  borderBottom: '1px solid #ffcc80',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}>
                  <span style={{ fontSize: '20px' }}>🔍</span>
                  <span style={{ color: '#e65100', fontWeight: '500' }}>
                    SOLO CONSOLA - Los empeños NO fueron publicados
                  </span>
                </div>

                {publicacionAuto.empenosVencidos.length > 0 && (
                  <div className="resultado-detalle">
                    <h4>📋 Empeños encontrados (NO PUBLICADOS):</h4>
                    <div className="empenos-lista">
                      {publicacionAuto.empenosVencidos.map((empeno, idx) => (
                        <div key={idx} className="empeno-item">
                          <span className="empeno-folio">{empeno.folio}</span>
                          <span className="empeno-descripcion">{empeno.descripcion}</span>
                          <span className="empeno-valor">${empeno.valor}</span>
                          <span className="empeno-estado" style={{ background: '#fff3e0', color: '#e65100' }}>
                            ⏸️ No publicado
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="resultado-consola" style={{
                  padding: '16px 20px',
                  background: '#1e1e1e',
                  color: '#d4d4d4',
                  fontFamily: 'monospace',
                  fontSize: '13px',
                  borderBottom: '1px solid #333'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ color: '#6a9955' }}>📟 Consola:</span>
                    <span style={{ color: '#888', fontSize: '11px' }}>
                      Revisa la consola del navegador para ver el listado completo
                    </span>
                  </div>
                  <div style={{ color: '#569cd6' }}>
                    &gt; publicacionAutomatica() ejecutada - {publicacionAuto.empenosVencidos.length} empeño(s) encontrado(s)
                  </div>
                  <div style={{ color: '#ce9178', marginTop: '4px' }}>
                    &gt; Publicación DESACTIVADA - Solo visualización
                  </div>
                </div>

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