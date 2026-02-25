import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import "./Clientes.css";

const ClienteNuevo = ({ agregarCliente }) => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nombre: "",
    telefono: "",
    email: "",
    direccion: "",
    fecha: new Date().toLocaleDateString(),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    agregarCliente(form);
    navigate("/clientes");
  };

  return (
    <div className="dashboard">
      <Sidebar />

      <div className="content">
        <div className="top-header">
          <h2>Nuevo Cliente</h2>
        </div>

        <div className="table-card">
          <form onSubmit={handleSubmit} className="form-grid">
            <input
              placeholder="Nombre completo"
              required
              onChange={(e) =>
                setForm({ ...form, nombre: e.target.value })
              }
            />

            <input
              placeholder="Teléfono"
              required
              onChange={(e) =>
                setForm({ ...form, telefono: e.target.value })
              }
            />

            <input
              type="email"
              placeholder="Email"
              required
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
            />

            <input
              className="full-width"
              placeholder="Dirección"
              required
              onChange={(e) =>
                setForm({ ...form, direccion: e.target.value })
              }
            />

            <div className="form-buttons">
              <button type="submit" className="btn-gold">
                Guardar
              </button>

              <button
                type="button"
                className="btn-cancel"
                onClick={() => navigate("/clientes")}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ClienteNuevo;