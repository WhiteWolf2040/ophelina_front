import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import "./Pagos.css";

const RegistrarPago = ({ agregarPago }) => {
  const navigate = useNavigate();

  // Simulación de empeños activos
  const empenosActivos = [
    { id: 1, cliente: "Adalay Arrizmendi", monto: 7000 },
    { id: 2, cliente: "Melisa Castillo", monto: 5000 },
  ];

  const metodosPago = ["Efectivo", "Transferencia", "Tarjeta"];
  const tiposPago = ["Interés", "Liquidación", "Abono"];

  const [form, setForm] = useState({
    empenoId: "",
    metodo: "",
    tipo: "",
    fecha: "",
    monto: "",
  });
  
  const handleSubmit = (e) => {
    e.preventDefault();

    const empenoSeleccionado = empenosActivos.find(e => e.id == form.empenoId);
    
    const nuevoPago = {
      id: Date.now(),
      cliente: empenoSeleccionado?.cliente || "Cliente",
      articulo: "Empeño",
      monto: form.monto,
      tipo: form.tipo,
      metodo: form.metodo,
      fecha: form.fecha,
    };

    agregarPago(nuevoPago);
    navigate("/pagos");
  };

  return (
    <div className="dashboard">
      <Sidebar />

      <div className="content">
        {/* HEADER */}
        <div className="header-container">
          <h2>Registrar Pago</h2>
        </div>

        {/* FORMULARIO - ESTILO CLIENTES */}
        <div className="form-card">
          <form onSubmit={handleSubmit} className="form-grid">
            
            {/* Empeños */}
            <div className="form-group">
              <label>Empeño *</label>
              <select
                value={form.empenoId}
                onChange={(e) => setForm({ ...form, empenoId: e.target.value })}
                required
              >
                <option value="">Seleccionar empeño</option>
                {empenosActivos.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.cliente} - ${emp.monto}
                  </option>
                ))}
              </select>
            </div>

            {/* Método de pago */}
            <div className="form-group">
              <label>Método de pago *</label>
              <select
                value={form.metodo}
                onChange={(e) => setForm({ ...form, metodo: e.target.value })}
                required
              >
                <option value="">Seleccionar método</option>
                {metodosPago.map((metodo, index) => (
                  <option key={index} value={metodo}>
                    {metodo}
                  </option>
                ))}
              </select>
            </div>

            {/* Tipo de Pago */}
            <div className="form-group">
              <label>Tipo de Pago *</label>
              <select
                value={form.tipo}
                onChange={(e) => setForm({ ...form, tipo: e.target.value })}
                required
              >
                <option value="">Seleccionar tipo</option>
                {tiposPago.map((tipo, index) => (
                  <option key={index} value={tipo}>
                    {tipo}
                  </option>
                ))}
              </select>
            </div>

            {/* Fecha */}
            <div className="form-group">
              <label>Fecha *</label>
              <input
                type="date"
                value={form.fecha}
                onChange={(e) => setForm({ ...form, fecha: e.target.value })}
                required
              />
            </div>

            {/* Monto de Pago - full width */}
            <div className="form-group full-width">
              <label>Monto de Pago *</label>
              <input
                type="number"
                placeholder="Ej: 1500"
                value={form.monto}
                onChange={(e) => setForm({ ...form, monto: e.target.value })}
                required
              />
            </div>

            {/* Botones */}
            <div className="form-buttons">
              <button type="submit" className="btn-gold">
                Guardar Pago
              </button>

              <button
                type="button"
                className="btn-cancel"
                onClick={() => navigate("/pagos")}
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

export default RegistrarPago;