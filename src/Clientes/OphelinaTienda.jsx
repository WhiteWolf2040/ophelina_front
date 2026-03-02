import React, { useState, memo } from "react";
import { Link, useLocation } from "react-router-dom";
import "./OphelinaTienda.css";

import logo from "../assets/O_blue.png";
import LogoInicial from "../assets/Ophelina_White.png";

import anillo_oro from "../assets/anillo_oro.jpg";
import collar_plata from "../assets/collar_plata.jpg";
import arete_diamante from "../assets/arete_diamante.jpg";

/* ================= NAVBAR GLOBAL ================= */

function Navbar() {
  const location = useLocation();

  const isActive = (path) =>
    location.pathname === path ? "me-active" : "";

  return (
    <header className="me-navbar-container">
      <div className="me-navbar">

        <div className="me-left-section">
          <img src={logo} alt="Ophelina Logo" className="me-logo-image" />
        </div>

        <nav className="me-nav-menu">
          <Link to="/homecliente" className={isActive("/homecliente")}>
            Historial
          </Link>

          <Link to="/misempenos" className={isActive("/misempenos")}>
            Mis Empeños
          </Link>

          <Link to="/pagos" className={isActive("/pagos")}>
            Pagos
          </Link>

          <Link to="/ophelina" className={isActive("/ophelina")}>
            Tienda
          </Link>

          <div className="me-user-avatar">👤</div>
        </nav>
      </div>
    </header>
  );
}

/* ================= FOOTER ================= */

const Footer = memo(() => (
  <footer className="footer">
    <div className="footer-container">

      {/* Logo */}
      <div className="footer-brand">
        <img src={LogoInicial} alt="Ophelina" width="180" />
      </div>

      {/* Links */}
      <div className="footer-links">

        <div>
          <h3>Empresa</h3>
          <ul>
            <li><a href="#">Design</a></li>
            <li><a href="#">Developers</a></li>
            <li><a href="#">Development features</a></li>
            <li><a href="#">Collaboration features</a></li>
          </ul>
        </div>

        <div>
          <h3>Soporte</h3>
          <ul>
            <li><a href="#">Contacto</a></li>
            <li><a href="#">Soporte</a></li>
          </ul>
        </div>

      </div>

    </div>
  </footer>
));

/* ================= TIENDA ================= */

export default function OphelinaTienda() {

  const [busqueda, setBusqueda] = useState("");

  const productos = [
    {
      id: 1,
      nombre: "Anillo de Oro 14k",
      precio: "$2,500",
      imagen: anillo_oro,
      descripcion: "Oro auténtico certificado"
    },
    {
      id: 2,
      nombre: "Collar de Plata",
      precio: "$2,500",
      imagen: collar_plata,
      descripcion: "Elegancia clásica"
    },
    {
      id: 3,
      nombre: "Anillo de Compromiso",
      precio: "$4,800",
      imagen: anillo_oro,
      descripcion: "Diseño exclusivo"
    },
    {
      id: 4,
      nombre: "Aretes de Diamante",
      precio: "$6,200",
      imagen: arete_diamante,
      descripcion: "Brillo premium"
    }
  ];

  const productosFiltrados = productos.filter((producto) =>
    producto.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="tienda-container">

      {/* ✅ MISMO NAVBAR */}
      <Navbar />

      {/* HERO TIENDA */}
      <section className="tienda-header">
        <h1 className="tienda-title">Ophelina</h1>
        <p className="tienda-subtitle">
          La que brinda apoyo
        </p>

        <div className="tienda-search-container">
          <input
            type="text"
            placeholder="Buscar joya..."
            className="tienda-search-input"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
      </section>

      {/* PRODUCTOS */}
      <section className="tienda-grid">
        {productosFiltrados.map((producto) => (
          <div key={producto.id} className="tienda-card">

          <div className="tienda-imagen-container">
            <img
              src={producto.imagen}
              alt={producto.nombre}
              className="tienda-imagen"
            />
          </div>
        
          <div className="tienda-info">
            <h2 className="tienda-nombre">
              {producto.nombre}
            </h2>
        
            <p className="tienda-descripcion">
              {producto.descripcion}
            </p>
        
            <div className="tienda-precio">
              {producto.precio}
            </div>
          </div>
        
          {/* ✅ BOTONES */}
          <div className="tienda-acciones">
            <button className="tienda-btn-comprar">
              Comprar
            </button>
        
            <button className="tienda-btn-detalles">
              Detalles
            </button>
          </div>
        
        </div>
        ))}
      </section>

      <Footer />
    </div>
  );
}