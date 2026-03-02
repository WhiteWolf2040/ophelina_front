import React from "react";
import "./MisEmpenos.css";
import logo from "../assets/O_blue.png";
import anillo_oro from "../assets/anillo_oro.jpg";    
import collar_plata from "../assets/collar_plata.jpg";    
import arete_diamante from "../assets/arete_diamante.jpg";    


export default function MisEmpenos() {
  const empeños = [
    {
      id: 1,
      nombre: "Anillo de Oro 14k",
      descripcion: "",
      prestado: "$8,500",
      totalPagar: "$9,775",
      vencimiento: "4/2/2026",
      imagen: anillo_oro
    },
    {
      id: 2,
      nombre: "Collar de Plata",
      descripcion: "Collar de plata 925 con colgante de perlas naturales",
      prestado: "$8,500",
      totalPagar: "$9,775",
      vencimiento: "4/2/2026",
      imagen: collar_plata
    },
    {
      id: 3,
      nombre: "Aretes de Diamante",
      descripcion: "Par de aretes con diamantes de 1 quilate cada uno.",
      prestado: "$8,500",
      totalPagar: "$9,775",
      vencimiento: "4/2/2026",
      imagen: arete_diamante
    }
  ];

  return (
    <div className="dashboard">
      {/* Navbar */}
      <header className="">
        <div className="navbar">
          <div className="">
            <img src={logo} alt="Ophelia Logo" className="logo-image" />
          </div>

          <nav className="nav-menu">
            <a href="#">Historial</a>
            <a href="#" className="active">Mis Empeños</a>
            <a href="#">Pagos</a>
            <a href="#">Tienda</a>
            <div className="user-avatar">👤</div>
          </nav>
        </div>
      </header>

      {/* Título principal */}
      <section className="page-header">
        <h1 className="page-title">Administra y consulta tus prendas empeñadas</h1>
        
        {/* Barra de búsqueda */}
        <div className="search-container">
          <input 
            type="text" 
            placeholder="Buscar..." 
            className="search-input"
          />
          <span className="search-icon">🔍</span>
        </div>
      </section>

      {/* Grid de empeños */}
      <section className="empeños-list">
        {empeños.map((empeño) => (
          <div key={empeño.id} className="empeño-card">
            {/* Contenedor superior con imagen y texto */}
            <div className="empeño-contenido-superior">
              {/* Imagen a la izquierda */}
              {empeño.imagen && (
                <div className="empeño-imagen-container">
                  <img 
                    src={empeño.imagen} 
                    alt={empeño.nombre}
                    className="empeño-imagen"
                  />
                </div>
              )}
              
              {/* Texto a la derecha */}
              <div className="empeño-info">
                <h2 className="empeño-nombre">{empeño.nombre}</h2>
                
                {empeño.descripcion && (
                  <p className="empeño-descripcion">{empeño.descripcion}</p>
                )}
                
                <div className="empeño-detalles">
                  <div className="detalle-item">
                    <span className="detalle-label">Prestado:</span>
                    <span className="detalle-valor">{empeño.prestado}</span>
                  </div>
                  
                  <div className="detalle-item">
                    <span className="detalle-label">Total a pagar:</span>
                    <span className="detalle-valor total">{empeño.totalPagar}</span>
                  </div>
                  
                  <div className="detalle-item">
                    <span className="detalle-label">Vencimiento:</span>
                    <span className="detalle-valor">{empeño.vencimiento}</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Botones debajo, siempre dentro del card */}
            <div className="empeño-accion">
              <button className="btn-ver-detalles">Ver detalles</button>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}