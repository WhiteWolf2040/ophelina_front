import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import "./Clientes.css";

const ClienteEditar = ({ clientes, actualizarCliente }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const cliente = clientes.find((c) => c.id === parseInt(id));

  const [form, setForm] = useState(cliente);

  if (!cliente) {
    return (
      <div className="dashboard">
        <Sidebar />
        <div className="content">
          <h2>Cliente no encontrado</h2>
        </div>
      </div>
    );
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    actualizarCliente(form);
    navigate(`/clientes/${cliente.id}`);
  };

  return (
    <div className="dashboard">
      <Sidebar />

      <div className="content">
        <div className="top-header">
          <h2>Editar Cliente</h2>
        </div>

        <div className="table-card">
          <form onSubmit={handleSubmit} className="form-grid">
            <input
              value={form.nombre}
              onChange={(e) =>
                setForm({ ...form, nombre: e.target.value })
              }
              required
            />

            <input
              value={form.telefono}
              onChange={(e) =>
                setForm({ ...form, telefono: e.target.value })
              }
              required
            />

            <input
              type="email"
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
              required
            />

            <input
              className="full-width"
              value={form.direccion}
              onChange={(e) =>
                setForm({ ...form, direccion: e.target.value })
              }
              required
            />

            <div className="form-buttons">
              <button type="submit" className="btn-gold">
                Guardar Cambios
              </button>

              <button
                type="button"
                className="btn-cancel"
                onClick={() => navigate(-1)}
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

export default ClienteEditar;