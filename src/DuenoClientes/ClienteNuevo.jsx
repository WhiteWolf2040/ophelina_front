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
        <div className="header-container">
          <h2>Nuevo Cliente</h2>
        </div>

        <div className="form-card">
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="nombre">Nombre completo *</label>
                <input
                  id="nombre"
                  type="text"
                  placeholder="Ej: Juan Pérez"
                  value={form.nombre}
                  required
                  onChange={(e) =>
                    setForm({ ...form, nombre: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label htmlFor="telefono">Teléfono *</label>
                <input
                  id="telefono"
                  type="tel"
                  placeholder="Ej: 9992345674"
                  value={form.telefono}
                  required
                  onChange={(e) =>
                    setForm({ ...form, telefono: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email *</label>
                <input
                  id="email"
                  type="email"
                  placeholder="Ej: cliente@email.com"
                  value={form.email}
                  required
                  onChange={(e) =>
                    setForm({ ...form, email: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label htmlFor="fecha">Fecha de registro</label>
                <input
                  id="fecha"
                  type="text"
                  value={form.fecha}
                  readOnly
                  className="fecha-input"
                />
              </div>

              <div className="form-group full-width">
                <label htmlFor="direccion">Dirección *</label>
                <input
                  id="direccion"
                  type="text"
                  placeholder="Ej: Calle Principal #123"
                  value={form.direccion}
                  required
                  onChange={(e) =>
                    setForm({ ...form, direccion: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="form-buttons">
              <button type="submit" className="btn-gold">
                Guardar Cliente
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