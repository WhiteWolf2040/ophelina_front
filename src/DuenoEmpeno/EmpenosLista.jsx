import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import "./Empenos.css";

const EmpenosLista = ({ empenos }) => {
  const navigate = useNavigate();
  const [busqueda, setBusqueda] = useState("");

  const hoy = new Date();

  const calcularEstado = (fecha) => {
    const fechaVencimiento = new Date(fecha);
    return fechaVencimiento < hoy ? "Vencido" : "Activo";
  };

  const empenosFiltrados = empenos.filter((e) =>
    e.cliente.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="dashboard">
      <Sidebar />

      <div className="content">
        <div className="top-header">
          <div className="pagos-title">
            <h2>Empeños</h2>
          </div>

          <button
            className="btn-gold"
            onClick={() => navigate("/empenos/nuevo")}
          >
            Nuevo Empeño
          </button>
        </div>

        <div className="search-container">
          <input
            className="search-input"
            placeholder="Buscar..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
          <span className="search-icon">🔍</span>
        </div>

        <div className="table-card">
          <h3>Lista de Prendas</h3>

          <table>
            <thead>
              <tr>
                <th>Cliente</th>
                <th>Objeto</th>
                <th>Monto</th>
                <th>Interés</th>
                <th>Vencimiento</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {empenosFiltrados.map((e) => {
                const estado = calcularEstado(e.vencimiento);

                return (
                  <tr key={e.id}>
                    <td><strong>{e.cliente}</strong></td>
                    <td>{e.objeto}</td>
                    <td>${e.monto}</td>
                    <td>{e.interes}%</td>
                    <td>{e.vencimiento}</td>

                    <td>
                      <span
                        className={
                          estado === "Activo"
                            ? "badge-activo"
                            : "badge-vencido"
                        }
                      >
                        {estado}
                      </span>
                    </td>

                    <td
                      className="link-detalle"
                      onClick={() => navigate(`${e.id}`)}
                    >
                      ver detalles
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EmpenosLista;