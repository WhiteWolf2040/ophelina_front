// src/Permisos/PermisoNuevo.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import "./Permisos.css";

import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import VpnKeyIcon from '@mui/icons-material/VpnKey';

const PermisoNuevo = () => {
  const navigate = useNavigate();
  
  const [form, setForm] = useState({
    nombre: "",
    modulo: "",
    descripcion: ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Permiso guardado:", form);
    alert("Permiso creado exitosamente");
    navigate("/permisos");
  };

  return (
    <div className="dashboard">
      <Sidebar />

      <div className="content">
        <div className="permisos-header">
          <h1>
            <VpnKeyIcon className="title-icon" />
            Nuevo Permiso
          </h1>
        </div>

        <div className="form-card">
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group full-width">
                <label>Nombre del Permiso *</label>
                <input
                  type="text"
                  value={form.nombre}
                  onChange={(e) => setForm({...form, nombre: e.target.value})}
                  placeholder="Ej: Ver Dashboard"
                  required
                />
              </div>

              <div className="form-group full-width">
                <label>Módulo *</label>
                <select
                  value={form.modulo}
                  onChange={(e) => setForm({...form, modulo: e.target.value})}
                  required
                >
                  <option value="">Seleccionar módulo</option>
                  <option value="dashboard">Dashboard</option>
                  <option value="clientes">Clientes</option>
                  <option value="empenos">Empeños</option>
                  <option value="inventario">Inventario</option>
                  <option value="pagos">Pagos</option>
                  <option value="reportes">Reportes</option>
                  <option value="tienda">Tienda</option>
                  <option value="usuarios">Usuarios</option>
                  <option value="configuracion">Configuración</option>
                </select>
              </div>

              <div className="form-group full-width">
                <label>Descripción</label>
                <textarea
                  value={form.descripcion}
                  onChange={(e) => setForm({...form, descripcion: e.target.value})}
                  rows="3"
                  placeholder="Describe la función de este permiso..."
                />
              </div>
            </div>

            <div className="form-buttons">
              <button type="submit" className="btn-gold">
                <AddIcon />
                Guardar Permiso
              </button>

              <button
                type="button"
                className="btn-cancel"
                onClick={() => navigate("/permisos")}
              >
                <CloseIcon />
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PermisoNuevo;