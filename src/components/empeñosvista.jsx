import React from "react";
import "./empeñosvista.css";
import logo from "../assets/ophelina_logo-sinFondo.png";

export default function EmpeñosVista() {
  const empeños = [
    {
      id: 1,
      nombre: "Anillo de Oro 14k",
      descripcion: "",
      prestado: 8500,
      totalPagar: 8775,
      vencimiento: "4/2/2026",
      boton: "Pagar ahora"
    },
    {
      id: 2,
      nombre: "Collar de Plata",
      descripcion: "Collar de plata 925 con colgante de perlas naturales",
      prestado: 8500,
      totalPagar: 9775,
      vencimiento: "4/2/2026",
      boton: "Pagar ahora"
    },
    {
      id: 3,
      nombre: "Aretes de Diamante",
      descripcion: "Par de aretes con diamantes de 1 quilate cada uno.",
      prestado: 8500,
      totalPagar: 9775,
      vencimiento: "4/2/2026",
      boton: "Ver detalles"
    },
    {
      id: 4,
      nombre: "Reloj Rolex Submariner",
      descripcion: "Reloj de lujo acero inoxidable, modelo clásico con certificado de autenticidad",
      prestado: 8500,
      totalPagar: 9775,
      vencimiento: "4/2/2026",
      boton: "Pagar ahora"
    },
    {
      id: 5,
      nombre: "Pulsera de Oro 18k",
      descripcion: "Pulsera de oro de 18 quilates, diseño entrelazado",
      prestado: 8500,
      totalPagar: 9775,
      vencimiento: "4/2/2026",
      boton: "Ver detalles"
    }
  ];

  return (
    <div className="dashboard">
      {/* Navbar */}
      <header className="navbar-container">
        <div className="navbar">
          <div className="left-section">
            <img src={logo} alt="Ophelia Logo" className="logo-image" />
          </div>

          <nav className="nav-menu">
            <a href="#">Historial</a>
            <a href="#" className="active">Empeños</a>
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

      {/* Lista de empeños */}
      <section className="empeños-list">
        {empeños.map((empeño) => (
          <div key={empeño.id} className="empeño-card">
            <div className="empeño-header">
              <h2 className="empeño-nombre">{empeño.nombre}</h2>
            </div>
            
            {empeño.descripcion && (
              <p className="empeño-descripcion">{empeño.descripcion}</p>
            )}
            
            <div className="empeño-detalles">
              <div className="detalle-item">
                <span className="detalle-label">Prestado:</span>
                <span className="detalle-valor">${empeño.prestado.toLocaleString()}</span>
              </div>
              
              <div className="detalle-item">
                <span className="detalle-label">Total a pagar:</span>
                <span className="detalle-valor total">${empeño.totalPagar.toLocaleString()}</span>
              </div>
              
              <div className="detalle-item">
                <span className="detalle-label">Vencimiento:</span>
                <span className="detalle-valor">{empeño.vencimiento}</span>
              </div>
            </div>
            
            <div className="empeño-accion">
              <button className={`btn-accion ${empeño.boton === 'Ver detalles' ? 'btn-secundario' : 'btn-primario'}`}>
                {empeño.boton}
              </button>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}