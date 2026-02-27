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
  const tiposPago = ["Interes", "Liquidacion"];

  const [form, setForm] = useState({
    empenoId: "",
    metodo: "",
    tipo: "",
    fecha: "",
    monto: "",
  });
  
const handleSubmit = (e) => {
  e.preventDefault();

  const nuevoPago = {
    cliente: empenosActivos.find(e => e.id == form.empenoId)?.cliente,
    articulo: "Empeño",
    monto: form.monto,
    tipo: form.tipo,
    fecha: form.fecha,
  };

  agregarPago(nuevoPago);

  navigate("/pagos");
};

  return (
    <div className="dashboard">
      <Sidebar />

      <div className="content">
        <div className="top-header">
          <div className="pagos-title">
            
            <h2>Registrar Pago</h2>
          </div>
        </div>

        <div className="table-card">
          <h3>Información del Pago</h3>

          <form onSubmit={handleSubmit} className="form-grid">

            {/* EMPEÑOS */}
            <div>
              <label>Empeños</label>
              <select
                value={form.empenoId}
                onChange={(e) =>
                  setForm({ ...form, empenoId: e.target.value })
                }
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

            {/* METODO */}
            <div>
              <label>Método de pago</label>
              <select
                value={form.metodo}
                onChange={(e) =>
                  setForm({ ...form, metodo: e.target.value })
                }
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

            {/* TIPO */}
            <div>
              <label>Tipo de Pago</label>
              <select
                value={form.tipo}
                onChange={(e) =>
                  setForm({ ...form, tipo: e.target.value })
                }
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

            {/* FECHA */}
            <div>
              <label>Fecha</label>
              <input
                type="date"
                value={form.fecha}
                onChange={(e) =>
                  setForm({ ...form, fecha: e.target.value })
                }
                required
              />
            </div>

            {/* MONTO */}
            <div className="full-width">
              <label>Monto de Pago</label>
              <input
                type="number"
                placeholder="Ingrese monto"
                value={form.monto}
                onChange={(e) =>
                  setForm({ ...form, monto: e.target.value })
                }
                required
              />
            </div>

            {/* BOTONES */}
            <div className="form-buttons">
              <button type="submit" className="btn-gold">
                Guardar
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