// src/Roles/RolNuevo.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import "./Roles.css";

import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import SecurityIcon from '@mui/icons-material/Security';

const RolNuevo = () => {
  const navigate = useNavigate();
  
  const [form, setForm] = useState({
    nombre: "",
    nivel: "",
    descripcion: "",
    permisos: []
  });

  const [permisos] = useState([
    { id: 1, nombre: "Ver Dashboard", modulo: "dashboard" },
    { id: 2, nombre: "Gestionar Clientes", modulo: "clientes" },
    { id: 3, nombre: "Gestionar Empeños", modulo: "empenos" },
    { id: 4, nombre: "Gestionar Inventario", modulo: "inventario" },
    { id: 5, nombre: "Registrar Pagos", modulo: "pagos" },
    { id: 6, nombre: "Ver Reportes", modulo: "reportes" },
    { id: 7, nombre: "Gestionar Tienda", modulo: "tienda" },
    { id: 8, nombre: "Gestionar Usuarios", modulo: "usuarios" },
    { id: 9, nombre: "Gestionar Roles", modulo: "configuracion" }
  ]);

  const handlePermisoChange = (permisoId) => {
    setForm(prev => ({
      ...prev,
      permisos: prev.permisos.includes(permisoId)
        ? prev.permisos.filter(id => id !== permisoId)
        : [...prev.permisos, permisoId]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí iría la llamada a la API
    console.log("Rol guardado:", form);
    alert("Rol creado exitosamente");
    navigate("/roles");
  };

  return (
    <div className="dashboard">
      <Sidebar />

      <div className="content">
        <div className="roles-header">
          <h1>
            <SecurityIcon className="title-icon" />
            Nuevo Rol
          </h1>
        </div>

        <div className="form-card">
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label>Nombre del Rol *</label>
                <input
                  type="text"
                  value={form.nombre}
                  onChange={(e) => setForm({...form, nombre: e.target.value})}
                  placeholder="Ej: Gerente Regional"
                  required
                />
              </div>

              <div className="form-group">
                <label>Nivel *</label>
                <select
                  value={form.nivel}
                  onChange={(e) => setForm({...form, nivel: e.target.value})}
                  required
                >
                  <option value="">Seleccionar nivel</option>
                  <option value="1">Nivel 1 (Dueño)</option>
                  <option value="2">Nivel 2 (Administrador)</option>
                  <option value="3">Nivel 3 (Ejecutivo)</option>
                  <option value="4">Nivel 4 (Caja)</option>
                  <option value="5">Nivel 5 (Consultor)</option>
                </select>
              </div>

              <div className="form-group full-width">
                <label>Descripción</label>
                <textarea
                  value={form.descripcion}
                  onChange={(e) => setForm({...form, descripcion: e.target.value})}
                  rows="3"
                  placeholder="Describe las funciones de este rol..."
                />
              </div>

              <div className="form-group full-width">
                <label>Permisos</label>
                <div className="permisos-checkbox-grid">
                  {permisos.map(permiso => (
                    <label key={permiso.id} className="permiso-checkbox">
                      <input 
                        type="checkbox"
                        checked={form.permisos.includes(permiso.id)}
                        onChange={() => handlePermisoChange(permiso.id)}
                      />
                      <span>{permiso.nombre}</span>
                      <small>{permiso.modulo}</small>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="form-buttons">
              <button type="submit" className="btn-gold">
                <AddIcon />
                Guardar Rol
              </button>

              <button
                type="button"
                className="btn-cancel"
                onClick={() => navigate("/roles")}
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

export default RolNuevo;