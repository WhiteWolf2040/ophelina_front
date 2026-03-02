import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import "./Empenos.css";

const NuevoEmpeno = ({ agregarEmpeno }) => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    cliente: "",
    objeto: "",
    monto: "",
    interes: "",
    vencimiento: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    agregarEmpeno(form);
    navigate("/empenos");
  };

  return (
    <div className="dashboard">
      <Sidebar />

      <div className="content">
        {/* HEADER */}
        <div className="header-container">
          <h2>Nuevo Empeño</h2>
        </div>

        {/* FORMULARIO - ESTILO CLIENTES */}
        <div className="form-card">
          <form onSubmit={handleSubmit} className="form-grid">
            {/* Cliente */}
            <div className="form-group">
              <label>Cliente *</label>
              <input
                name="cliente"
                placeholder="Ej: Juan Pérez"
                value={form.cliente}
                onChange={handleChange}
                required
              />
            </div>

            {/* Teléfono (objeto) */}
            <div className="form-group">
              <label>Objeto *</label>
              <input
                name="objeto"
                placeholder="Ej: Anillo de Oro"
                value={form.objeto}
                onChange={handleChange}
                required
              />
            </div>

            {/* Email (monto) */}
            <div className="form-group">
              <label>Monto *</label>
              <input
                name="monto"
                type="number"
                placeholder="Ej: 5000"
                value={form.monto}
                onChange={handleChange}
                required
              />
            </div>

            {/* Fecha de registro (interés) */}
            <div className="form-group">
              <label>Interés % *</label>
              <input
                name="interes"
                type="number"
                placeholder="Ej: 10"
                value={form.interes}
                onChange={handleChange}
                required
              />
            </div>

            {/* Dirección (vencimiento) - full width */}
            <div className="form-group full-width">
              <label>Fecha de Vencimiento *</label>
              <input
                name="vencimiento"
                type="date"
                value={form.vencimiento}
                onChange={handleChange}
                required
              />
            </div>

            {/* Botones */}
            <div className="form-buttons">
              <button type="submit" className="btn-gold">
                Guardar Empeño
              </button>

              <button
                type="button"
                className="btn-cancel"
                onClick={() => navigate("/empenos")}
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

export default NuevoEmpeno;