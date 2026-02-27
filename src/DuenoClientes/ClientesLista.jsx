import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import "./Clientes.css";

const ClientesLista = ({ clientes }) => {
  const navigate = useNavigate();
  const [busqueda, setBusqueda] = useState("");

  const clientesFiltrados = clientes.filter((cliente) =>
    cliente.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="dashboard">
      <Sidebar />

      <div className="content">
        <div className="top-header">


          
          <h2>Clientes</h2>
      

          <h2>Clientes</h2>


          <h2>Clientes</h2>


          <button
            className="btn-gold"
            onClick={() => navigate("nuevo")}
          >
            Nuevo Registro
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
          <h3>Lista de Clientes</h3>

          <table>
            <thead>
              <tr>
                <th>Nombre Completo</th>
                <th>Teléfono</th>
                <th>Email</th>
                <th>Fecha de Registro</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {clientesFiltrados.length > 0 ? (
                clientesFiltrados.map((cliente) => (
                  <tr key={cliente.id}>
                    <td><strong>{cliente.nombre}</strong></td>
                    <td>{cliente.telefono}</td>
                    <td>{cliente.email}</td>
                    <td>{cliente.fecha}</td>
                    <td
                      className="link-detalle"
                      onClick={() => navigate(`${cliente.id}`)}
                    >
                      ver detalles
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center" }}>
                    No se encontraron clientes
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ClientesLista;