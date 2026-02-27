import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";

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
        <h2>Nuevo Empeño</h2>

        <form onSubmit={handleSubmit} className="form-card">
          <input name="cliente" placeholder="Cliente" onChange={handleChange} required />
          <input name="objeto" placeholder="Objeto" onChange={handleChange} required />
          <input name="monto" type="number" placeholder="Monto" onChange={handleChange} required />
          <input name="interes" type="number" placeholder="Interés %" onChange={handleChange} required />
          <input name="vencimiento" type="date" onChange={handleChange} required />

          <button className="btn-gold">Guardar</button>
        </form>
      </div>
    </div>
  );
};

export default NuevoEmpeno;