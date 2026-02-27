import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import "./Pagos.css";

const PagosLista = ({ pagos }) => {
  const navigate = useNavigate();

  const [busqueda, setBusqueda] = useState("");
  const [fechaFiltro, setFechaFiltro] = useState("");

  const pagosFiltrados = pagos.filter((pago) => {
    const coincideNombre = pago.cliente
      .toLowerCase()
      .includes(busqueda.toLowerCase());

    const coincideFecha = fechaFiltro
      ? pago.fecha === fechaFiltro
      : true;

    return coincideNombre && coincideFecha;
  });

  return (
    <div className="dashboard">
      <Sidebar />

      <div className="content">
        <div className="top-header">
          <div className="pagos-title">
            <h2>Pagos</h2>
          </div>

          <button
            className="btn-gold"
            onClick={() => navigate("/pagos/nuevo")}
          >
            Nuevo Pago
          </button>
        </div>

        {/* FILTROS */}
        <div className="filter-container">

          {/* BUSCADOR POR NOMBRE */}
          <input
            type="text"
            placeholder="Buscar por cliente..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="search-input"
          />
          

          {/* FILTRO POR FECHA */}
          <input
            type="date"
            value={fechaFiltro}
            onChange={(e) => setFechaFiltro(e.target.value)}
          />

          {(busqueda || fechaFiltro) && (
            <button
              className="btn-clear"
              onClick={() => {
                setBusqueda("");
                setFechaFiltro("");
              }}
            >
              Limpiar
            </button>
          )}

        </div>

        <div className="table-card">
          <h3>Lista de Pagos</h3>

          <table>
            <thead>
              <tr>
                <th>Cliente</th>
                <th>Artículo</th>
                <th>Monto</th>
                <th>Tipo</th>
                <th>Fecha</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {pagosFiltrados.map((pago) => (
                <tr key={pago.id}>
                  <td><strong>{pago.cliente}</strong></td>
                  <td>{pago.articulo}</td>
                  <td>${pago.monto}</td>
                  <td>{pago.tipo}</td>
                  <td>{pago.fecha}</td>
                  <td
                    className="link-detalle"
                    onClick={() => navigate(`${pago.id}`)}
                  >
                    ver detalles
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {pagosFiltrados.length === 0 && (
            <p className="no-results">
              No hay resultados con esos filtros.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PagosLista;