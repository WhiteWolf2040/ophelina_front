import { useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import "./Inventario.css";

const NuevoInventario = () => {
  const navigate = useNavigate();
  const { agregarPrenda } = useOutletContext();

  const [form, setForm] = useState({
    nombre: "",
    categoria: "",
    valor: "",
    estado: "Disponible",
    descripcion: "",
    cliente: "",
  });

  const categorias = ["Joyería", "Electrónico", "Relojes", "Herramientas", "Otros"];
  const estados = ["Disponible", "En Empeño", "Vendido", "Vencido"];

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    agregarPrenda(form);
    navigate("/inventario");
  };

  return (
    <>
      <div className="header-container">
        <h2>Nueva Prenda</h2>
      </div>

      <div className="form-card">
        <form onSubmit={handleSubmit} className="form-grid">
          <div className="form-group">
            <label>Nombre de la prenda *</label>
            <input
              name="nombre"
              placeholder="Ej: Anillo de oro 14k"
              value={form.nombre}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Categoría *</label>
            <select
              name="categoria"
              value={form.categoria}
              onChange={handleChange}
              required
            >
              <option value="">Seleccionar categoría</option>
              {categorias.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Valor estimado *</label>
            <input
              name="valor"
              type="number"
              placeholder="Ej: 7000"
              value={form.valor}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Estado *</label>
            <select
              name="estado"
              value={form.estado}
              onChange={handleChange}
              required
            >
              {estados.map((est) => (
                <option key={est} value={est}>{est}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Cliente (opcional)</label>
            <input
              name="cliente"
              placeholder="Ej: Juan Pérez"
              value={form.cliente}
              onChange={handleChange}
            />
          </div>

          <div className="form-group full-width">
            <label>Descripción</label>
            <textarea
              name="descripcion"
              placeholder="Describe la prenda, características, estado físico, etc."
              value={form.descripcion}
              onChange={handleChange}
              rows="4"
              className="textarea-input"
            />
          </div>

          <div className="form-buttons">
            <button type="submit" className="btn-gold">
              Guardar Prenda
            </button>

            <button
              type="button"
              className="btn-cancel"
              onClick={() => navigate("/inventario")}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default NuevoInventario;