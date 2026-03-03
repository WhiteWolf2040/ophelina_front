import React, { useState } from "react";
import "./MisEmpenos.css";
import Navbar from "../ClientesNav/Navbar";

import anillo_oro from "../assets/anillo_oro.jpg";
import collar_plata from "../assets/collar_plata.jpg";
import arete_diamante from "../assets/arete_diamante.jpg";

export default function MisEmpenos() {
  const [busqueda, setBusqueda] = useState("");

  // Tipos de prendas
  const tiposPrenda = [
    {
      nombre: "Anillo de Oro 14k",
      imagen: anillo_oro
    },
    {
      nombre: "Collar de Plata",
      imagen: collar_plata
    },
    {
      nombre: "Aretes de Diamante",
      imagen: arete_diamante
    }
  ];

  // Generar empeños
  const generarEmpeños = () => {
    const empeños = [];

    const descripciones = [
      "",
      "Diseño clásico y elegante",
      "Con detalles artesanales",
      "Estilo moderno",
      "Pieza única",
      "Con grabados especiales"
    ];

    const preciosBase = [
      8500, 12500, 3200, 7800, 6200,
      4500, 9300, 11000, 2800, 8900,
      7500, 5200, 10500
    ];

    for (let i = 0; i < 15; i++) {
      const tipoIndex = i % 3;
      const precioBase = preciosBase[i % preciosBase.length];
      const interes = precioBase * 0.15;

      empeños.push({
        id: i + 1,
        nombre: tiposPrenda[tipoIndex].nombre,
        descripcion: descripciones[i % descripciones.length],
        prestado: `$${precioBase.toLocaleString("en-US")}`,
        totalPagar: `$${(precioBase + interes).toLocaleString("en-US")}`,
        vencimiento: `${Math.floor(Math.random() * 28) + 1}/${
          Math.floor(Math.random() * 12) + 1
        }/2026`,
        imagen: tiposPrenda[tipoIndex].imagen
      });
    }

    return empeños;
  };

  const empeños = generarEmpeños();

  // ✅ FILTRO DEL BUSCADOR
  const empenosFiltrados = empeños.filter((empeño) =>
    (
      empeño.nombre +
      empeño.descripcion +
      empeño.prestado +
      empeño.vencimiento
    )
      .toLowerCase()
      .includes(busqueda.toLowerCase())
  );

  return (
    <>
      <Navbar />
      <div className="me-dashboard">

        {/* Header */}
        <section className="me-page-header">
          <h1 className="me-page-title">
            Administra y consulta tus prendas empeñadas
          </h1>

          <div className="me-search-container">
            <input
              type="text"
              placeholder="Buscar empeño..."
              className="me-search-input"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
            <span className="me-search-icon">🔍</span>
          </div>
        </section>

        {/* Lista */}
        <section className="me-empenos-list">
          {empenosFiltrados.length > 0 ? (
            empenosFiltrados.map((empeño) => (
              <div key={empeño.id} className="me-empeno-card">
                <div className="me-empeno-contenido-superior">
                  <div className="me-empeno-imagen-container">
                    <img
                      src={empeño.imagen}
                      alt={empeño.nombre}
                      className="me-empeno-imagen"
                    />
                  </div>

                  <div className="me-empeno-info">
                    <h2 className="me-empeno-nombre">{empeño.nombre}</h2>

                    {empeño.descripcion && (
                      <p className="me-empeno-descripcion">
                        {empeño.descripcion}
                      </p>
                    )}

                    <div className="me-empeno-detalles">
                      <div className="me-detalle-item">
                        <span className="me-detalle-label">Prestado:</span>
                        <span className="me-detalle-valor">
                          {empeño.prestado}
                        </span>
                      </div>

                      <div className="me-detalle-item">
                        <span className="me-detalle-label">
                          Total a pagar:
                        </span>
                        <span className="me-detalle-valor me-total">
                          {empeño.totalPagar}
                        </span>
                      </div>

                      <div className="me-detalle-item">
                        <span className="me-detalle-label">
                          Vencimiento:
                        </span>
                        <span className="me-detalle-valor">
                          {empeño.vencimiento}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="me-empeno-accion">
                  <button className="me-btn-ver-detalles">
                    Ver detalles
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="me-sin-resultados">
              No se encontraron empeños
            </p>
          )}
        </section>
      </div>
    </>
  );
}