import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import "./OphelinaTienda.css";
import Navbar from "../ClientesNav/Navbar";

import anillo_oro from "../assets/anillo_oro.jpg";
import collar_plata from "../assets/collar_plata.jpg";
import arete_diamante from "../assets/arete_diamante.jpg";
import xbox from "../assets/xbox.jpg";

/* ================= MODAL ================= */
const Modal = ({ isOpen, onClose, onConfirmarApartado, producto, tipo }) => {
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
              <p><strong>Material: {producto?.material || "Oro 14k / Plata 950"}</strong></p>
              <p><strong>Excedente: 2024</strong></p>
            </div>

            <div className="detalle-seccion">
              <h4>Información del Producto</h4>
              <div className="detalle-financiero">
                <div className="financiero-item">
                  <span>Precio:</span>
                  <span>{producto?.precio} MX</span>
                </div>
                {producto?.exclusivo && (
                  <div className="financiero-item exclusivo">
                    <span>Artículo exclusivo</span>
                    <span>⭐</span>
                  </div>
                )}
              </div>
            </div>

            {tipo === 'apartar' && (
              <button 
                className="pago-confirmar-btn" 
                onClick={onConfirmarApartado}
                style={{ marginTop: '20px' }}
              >
                Apartar ahora
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
  const [busqueda, setBusqueda] = useState("");
  const [categoriaActiva, setCategoriaActiva] = useState("todas");
  const [modalAbierto, setModalAbierto] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [mensajeApartado, setMensajeApartado] = useState({ mostrar: false, producto: '' });
  
  // Estado para productos apartados
  const [productosApartados, setProductosApartados] = useState([]);

  const productos = [
    {
      id: 1,
      nombre: "Anillo de Oro 14k",
      precio: "$2,500",
      imagen: anillo_oro,
      descripcion: "Oro amarillo · Perfecto estado",
      categoria: "oro",
      material: "Oro 14k",
      exclusivo: false
    },
    {
      id: 2,
      nombre: "Collar de Plata",
      precio: "$2,500",
      imagen: collar_plata,
      descripcion: "Elegancia clásica · Perfecto estado",
      categoria: "plata",
      material: "Plata 950",
      exclusivo: false
    },
    {
      id: 3,
      nombre: "Anillo de Compromiso",
      precio: "$4,800",
      imagen: anillo_oro,
      descripcion: "Diseño exclusivo · Con certificado",
      categoria: "oro",
      material: "Oro 14k",
      exclusivo: true
    },
    {
      id: 4,
      nombre: "Aretes de Diamante",
      precio: "$6,200",
      imagen: arete_diamante,
      descripcion: "Brillo premium · Garantía incluída",
      categoria: "oro",
      material: "Oro 14k con diamantes",
      exclusivo: true
    },
    {
      id: 5,
      nombre: "Xbox Series X",
      precio: "$10,500",
      imagen: xbox,
      descripcion: "Consola nueva · Última generación",
      categoria: "electronicos",
      material: "Plástico y componentes electrónicos",
      exclusivo: false
    }
  ];

  const categorias = [
    { id: "todas", nombre: "Todas las piezas" },
    { id: "oro", nombre: "Oro" },
    { id: "plata", nombre: "Plata" },
    { id: "electronicos", nombre: "Electrónicos" },
    { id: "exclusivo", nombre: "Edición Limitada" },
    { id: "apartados", nombre: "Mis apartados" }
  ];

  const handleApartar = (producto) => {
    setProductoSeleccionado(producto);
    setModalAbierto(true);
  };

  const handleConfirmarApartado = () => {
    // Agregar el producto a la lista de apartados
    setProductosApartados([...productosApartados, productoSeleccionado.id]);
    
    // Mostrar mensaje de confirmación
    setMensajeApartado({ mostrar: true, producto: productoSeleccionado.nombre });
    setModalAbierto(false);
    
    // Ocultar mensaje después de 3 segundos
    setTimeout(() => {
      setMensajeApartado({ mostrar: false, producto: '' });
    }, 3000);
  };

  const productosFiltrados = productos.filter((producto) => {
    const matchesBusqueda = producto.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
                           producto.descripcion.toLowerCase().includes(busqueda.toLowerCase()) ||
                           (producto.material && producto.material.toLowerCase().includes(busqueda.toLowerCase()));
    
    if (categoriaActiva === "apartados") {
      // Mostrar solo productos apartados
      return productosApartados.includes(producto.id) && matchesBusqueda;
    }
    
    if (categoriaActiva === "todas") return matchesBusqueda;
    if (categoriaActiva === "exclusivo") return producto.exclusivo && matchesBusqueda;
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
              <span className="hero-white">Ophelina</span><br />
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
                  className={`category-btn ${categoriaActiva === cat.id ? 'active' : ''}`}
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
                  : categorias.find(c => c.id === categoriaActiva)?.nombre}
            </h2>
            <span className="products-count">
              {categoriaActiva === "apartados" 
                ? `${productosApartados.length} artículos apartados` 
                : `${productosFiltrados.length} artículos`}
            </span>
          </div>

          <div className="products-grid-luxury">
            {productosFiltrados.map((producto) => {
              const estaApartado = productosApartados.includes(producto.id);
              
              return (
                <article key={producto.id} className={`product-card-luxury ${estaApartado ? 'producto-apartado' : ''}`}>
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
                      {estaApartado && (
                        <span className="apartado-badge">APARTADO</span>
                      )}
                    </div>
                  </div>

                  <div className="card-content">
                    <div className="card-header">
                      <h3 className="product-name">{producto.nombre}</h3>
                      <p className="product-description">{producto.descripcion}</p>
                    </div>

                    <div className="card-footer">
                      <span className="product-price">{producto.precio} MX</span>
                      
                      <div className="product-actions">
                        {estaApartado ? (
                          <span className="btn-apartado-disable">
                            <span>Apartado ✓</span>
                          </span>
                        ) : (
                          <button 
                            className="btn-apartar"
                            onClick={() => handleApartar(producto)}
                          >
                            <span>Apartar</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
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
        </section>

        <Modal 
          isOpen={modalAbierto}
          onClose={() => setModalAbierto(false)}
          onConfirmarApartado={handleConfirmarApartado}
          producto={productoSeleccionado}
          tipo="apartar"
        />

        {/* Mensaje de confirmación de apartado */}
        {mensajeApartado.mostrar && (
          <div className="mensaje-apartado">
            <div className="mensaje-contenido">
              <span className="mensaje-icono">📌</span>
              <p>¡Apartado! Has apartado: <strong>{mensajeApartado.producto}</strong></p>
            </div>
          </div>
        )}
      </main>
    </>
  );
}