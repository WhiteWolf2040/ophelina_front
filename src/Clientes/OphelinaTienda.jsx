import React, { useState, memo } from "react";
import { Link, useLocation } from "react-router-dom";
import "./OphelinaTienda.css";
import Navbar from "../ClientesNav/Navbar";

import logo from "../assets/O_blue.png";
import LogoInicial from "../assets/Ophelina_White.png";

import anillo_oro from "../assets/anillo_oro.jpg";
import collar_plata from "../assets/collar_plata.jpg";
import arete_diamante from "../assets/arete_diamante.jpg";


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
    <>
      <Navbar />
      <div className="tienda-container">
        {/* HERO TIENDA */}
        <section className="">
          <div className="tienda-search-container">
            <input
              type="text"
              placeholder="Buscar..."
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
            
              {/* BOTONES */}
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
    </>
  );
}