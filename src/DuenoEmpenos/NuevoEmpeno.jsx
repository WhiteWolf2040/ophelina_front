import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import "./Empenos.css";
import api from '../config/api';

const NuevoEmpeno = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [clientes, setClientes] = useState([]);
  const [prendas, setPrendas] = useState([]);
  const [tasas, setTasas] = useState([]);
  
  const [form, setForm] = useState({
    cliente_id: "",
    prenda_id: "",
    monto_prestado: "",
    tasa_id: "",
    fecha_vencimiento: "",
    aval_id: ""
  });

  // Cargar datos necesarios para el formulario
  useEffect(() => {
    cargarClientes();
    cargarPrendas();
    cargarTasas();
  }, []);

  const cargarClientes = async () => {
    try {
      const response = await api.get('/clientes');
      if (response.data.success) {
        setClientes(response.data.data);
      }
    } catch (error) {
      console.error('Error al cargar clientes:', error);
    }
  };

  const cargarPrendas = async () => {
    try {
      const response = await api.get('/prendas/disponibles');
      if (response.data.success) {
        setPrendas(response.data.data);
      }
    } catch (error) {
      console.error('Error al cargar prendas:', error);
    }
  };

  const cargarTasas = async () => {
    try {
      const response = await api.get('/tasas-interes');
      if (response.data.success) {
        setTasas(response.data.data);
      }
    } catch (error) {
      console.error('Error al cargar tasas:', error);
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await api.post('/empenos', form);
      if (response.data.success) {
        alert('Empeño registrado correctamente');
        navigate("/empenos");
      } else {
        alert('Error: ' + response.data.message);
      }
    } catch (error) {
      console.error('Error al guardar:', error);
      alert('Error al registrar el empeño: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  // Calcular fecha mínima (mañana) y máxima (6 meses después)
  const hoy = new Date();
  const manana = new Date(hoy);
  manana.setDate(manana.getDate() + 1);
  const fechaMinima = manana.toISOString().split('T')[0];
  
  const fechaMaxima = new Date(hoy);
  fechaMaxima.setMonth(fechaMaxima.getMonth() + 6);
  const fechaMax = fechaMaxima.toISOString().split('T')[0];

  return (
    <div className="dashboard">
     

      <div className="content">
        {/* HEADER */}
        <div className="tienda-header">
          <div>
            <h1>Nuevo Empeño</h1>
            <p className="header-sub">Registra un nuevo préstamo con garantía</p>
          </div>
        </div>

        {/* FORMULARIO */}
        <div className="form-card">
          <form onSubmit={handleSubmit} className="form-grid">
            {/* Cliente */}
            <div className="form-group">
              <label>Cliente *</label>
              <select
                name="cliente_id"
                value={form.cliente_id}
                onChange={handleChange}
                required
              >
                <option value="">Seleccione un cliente</option>
                {clientes.map(cliente => (
                  <option key={cliente.id_cliente} value={cliente.id_cliente}>
                    {cliente.nombre} {cliente.apellido}
                  </option>
                ))}
              </select>
            </div>

            {/* Prenda */}
            <div className="form-group">
              <label>Prenda *</label>
              <select
                name="prenda_id"
                value={form.prenda_id}
                onChange={handleChange}
                required
              >
                <option value="">Seleccione una prenda</option>
                {prendas.map(prenda => (
                  <option key={prenda.id_prenda} value={prenda.id_prenda}>
                    {prenda.descripcion} - {prenda.tipo}
                  </option>
                ))}
              </select>
            </div>

            {/* Monto a prestar */}
            <div className="form-group">
              <label>Monto a Prestar *</label>
              <input
                name="monto_prestado"
                type="number"
                step="0.01"
                min="100"
                placeholder="Ej: 5000"
                value={form.monto_prestado}
                onChange={handleChange}
                required
              />
            </div>

            {/* Tasa de interés */}
            <div className="form-group">
              <label>Tasa de Interés *</label>
              <select
                name="tasa_id"
                value={form.tasa_id}
                onChange={handleChange}
                required
              >
                <option value="">Seleccione una tasa</option>
                {tasas.map(tasa => (
                  <option key={tasa.id_tasa} value={tasa.id_tasa}>
                    {tasa.nombre} - {tasa.porcentaje}% ({tasa.plazo_dias} días)
                  </option>
                ))}
              </select>
            </div>

            {/* Fecha de Vencimiento */}
            <div className="form-group">
              <label>Fecha de Vencimiento *</label>
              <input
                name="fecha_vencimiento"
                type="date"
                min={fechaMinima}
                max={fechaMax}
                value={form.fecha_vencimiento}
                onChange={handleChange}
                required
              />
              <small>El plazo máximo es de 6 meses</small>
            </div>

            {/* Aval (opcional) */}
            <div className="form-group">
              <label>Aval (opcional)</label>
              <select
                name="aval_id"
                value={form.aval_id}
                onChange={handleChange}
              >
                <option value="">Sin aval</option>
                {/* Aquí puedes cargar avales de tu BD */}
              </select>
            </div>

            {/* Botones */}
            <div className="form-buttons">
              <button type="submit" className="btn-gold" disabled={loading}>
                {loading ? "Guardando..." : "Guardar Empeño"}
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