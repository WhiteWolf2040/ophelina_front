// src/Roles/Roles.jsx
import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import "./Roles.css";

// Iconos MUI
import SecurityIcon from '@mui/icons-material/Security';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';

import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import PersonIcon from '@mui/icons-material/Person';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import StoreIcon from '@mui/icons-material/Store';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';


const Roles = () => {
  const [roles, setRoles] = useState([
    {
      id: 1,
      nombre: "Dueño",
      nivel: 1,
      descripcion: "Acceso total al sistema",
      usuarios: 1,
      permisos: 15,
      fechaCreacion: "15/01/2020",
      icono: <AdminPanelSettingsIcon />
    },
    {
      id: 2,
      nombre: "Administrador",
      nivel: 2,
      descripcion: "Gestión completa operativa",
      usuarios: 2,
      permisos: 12,
      fechaCreacion: "20/01/2020",
      icono: <SupervisorAccountIcon />
    },
    {
      id: 3,
      nombre: "Ejecutivo",
      nivel: 3,
      descripcion: "Gestión de clientes y empeños",
      usuarios: 5,
      permisos: 8,
      fechaCreacion: "01/02/2020",
      icono: <PersonIcon />
    },
    {
      id: 4,
      nombre: "Caja",
      nivel: 4,
      descripcion: "Solo ventas y pagos",
      usuarios: 3,
      permisos: 5,
      fechaCreacion: "10/02/2020",
      icono: <StoreIcon />
    }
  ]);

  const [permisos, setPermisos] = useState([
    { id: 1, nombre: "Ver Dashboard", modulo: "dashboard", descripcion: "Acceso al panel principal" },
    { id: 2, nombre: "Gestionar Clientes", modulo: "clientes", descripcion: "CRUD de clientes" },
    { id: 3, nombre: "Gestionar Empeños", modulo: "empenos", descripcion: "CRUD de empeños" },
    { id: 4, nombre: "Gestionar Inventario", modulo: "inventario", descripcion: "CRUD de prendas" },
    { id: 5, nombre: "Registrar Pagos", modulo: "pagos", descripcion: "Registrar pagos" },
    { id: 6, nombre: "Ver Reportes", modulo: "reportes", descripcion: "Acceso a reportes" },
    { id: 7, nombre: "Gestionar Tienda", modulo: "tienda", descripcion: "Administrar tienda online" },
    { id: 8, nombre: "Gestionar Usuarios", modulo: "usuarios", descripcion: "CRUD de usuarios" },
    { id: 9, nombre: "Gestionar Roles", modulo: "configuracion", descripcion: "Administrar roles y permisos" }
  ]);

  const [busqueda, setBusqueda] = useState("");
  const [modalDetalle, setModalDetalle] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);
  const [modalEliminar, setModalEliminar] = useState(false);
  const [rolSeleccionado, setRolSeleccionado] = useState(null);
  const [permisosSeleccionados, setPermisosSeleccionados] = useState({});

  // Para nuevo rol
  const [showNuevoRol, setShowNuevoRol] = useState(false);
  const [nuevoRol, setNuevoRol] = useState({
    nombre: "",
    nivel: "",
    descripcion: "",
    permisos: []
  });

  // Filtrar roles
  const rolesFiltrados = roles.filter(rol =>
    rol.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    rol.descripcion.toLowerCase().includes(busqueda.toLowerCase())
  );

  const handleVerDetalle = (rol) => {
    setRolSeleccionado(rol);
    setModalDetalle(true);
  };

  const handleEditar = (rol) => {
    setRolSeleccionado(rol);
    setModalEditar(true);
  };

  const handleEliminar = (rol) => {
    setRolSeleccionado(rol);
    setModalEliminar(true);
  };

  const confirmarEliminar = () => {
    setRoles(roles.filter(r => r.id !== rolSeleccionado.id));
    setModalEliminar(false);
  };

  const getIconoPorNivel = (nivel) => {
    switch(nivel) {
      case 1: return <AdminPanelSettingsIcon className="rol-icon dueño" />;
      case 2: return <SupervisorAccountIcon className="rol-icon admin" />;
      case 3: return <PersonIcon className="rol-icon ejecutivo" />;
      default: return <StoreIcon className="rol-icon caja" />;
    }
  };

  return (
    <div className="dashboard">
      <Sidebar />

      <div className="content roles-content">
        {/* HEADER */}
        <div className="roles-header">
            <div>
            <h1>
              <SecurityIcon className="title-icon" />
                Gestión de Roles
            </h1>
            <p className="header-sub">Gestiona y administra tus roles</p>
          </div>
        

          <button className="btn-nuevo-rol" onClick={() => setShowNuevoRol(true)}>
            <AddIcon />
            Nuevo Rol
          </button>
        </div>

        {/* ESTADÍSTICAS */}
        <div className="stats-grid roles-stats">
          <div className="stat-card">
            <div className="stat-icon dueño-bg">
              <AdminPanelSettingsIcon />
            </div>
            <div className="stat-info">
              <span className="stat-label">Roles</span>
              <span className="stat-value">{roles.length}</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon admin-bg">
              <SupervisorAccountIcon />
            </div>
            <div className="stat-info">
              <span className="stat-label">Usuarios</span>
              <span className="stat-value">
                {roles.reduce((sum, r) => sum + r.usuarios, 0)}
              </span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon permiso-bg">
              <SecurityIcon />
            </div>
            <div className="stat-info">
              <span className="stat-label">Permisos</span>
              <span className="stat-value">{permisos.length}</span>
            </div>
          </div>
        </div>

        {/* BUSCADOR */}
        <div className="buscador-roles">
          <div className="search-wrapper">   
            <input
              type="text"
              placeholder="Buscar roles..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        {/* TABLA DE ROLES */}
        <div className="tabla-container roles-table">
          <table className="tabla-moderna">
            <thead>
              <tr>
                <th>Rol</th>
                <th>Nivel</th>
                <th>Descripción</th>
                <th>Usuarios</th>
                <th>Permisos</th>
                <th>Fecha Creación</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {rolesFiltrados.map(rol => (
                <tr key={rol.id}>
                  <td>
                    <div className="rol-nombre-cell">
                      {getIconoPorNivel(rol.nivel)}
                      <strong>{rol.nombre}</strong>
                    </div>
                  </td>
                  <td>
                    <span className={`badge-nivel nivel-${rol.nivel}`}>
                      Nivel {rol.nivel}
                    </span>
                  </td>
                  <td>{rol.descripcion}</td>
                  <td className="text-center">{rol.usuarios}</td>
                  <td className="text-center">{rol.permisos}</td>
                  <td>{rol.fechaCreacion}</td>
                  <td>
                    <div className="acciones-cell">
                      <button 
                        className="btn-accion ver"
                        onClick={() => handleVerDetalle(rol)}
                        title="Ver detalles"
                      >
                        <VisibilityIcon />
                      </button>
                      <button 
                        className="btn-accion editar"
                        onClick={() => handleEditar(rol)}
                        title="Editar"
                      >
                        <EditIcon />
                      </button>
                      <button 
                        className="btn-accion eliminar"
                        onClick={() => handleEliminar(rol)}
                        title="Eliminar"
                      >
                        <DeleteIcon />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {rolesFiltrados.length === 0 && (
                <tr>
                  <td colSpan="7" className="sin-resultados">
                    <SearchIcon />
                    <p>No se encontraron roles</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL DETALLE DE ROL */}
      {modalDetalle && rolSeleccionado && (
        <div className="modal-overlay" onClick={() => setModalDetalle(false)}>
          <div className="modal-detalle modal-rol" onClick={(e) => e.stopPropagation()}>
            <button className="modal-cerrar" onClick={() => setModalDetalle(false)}>
              <CloseIcon />
            </button>
            
            <div className="modal-header">
              <h2>
                {getIconoPorNivel(rolSeleccionado.nivel)}
                {rolSeleccionado.nombre}
              </h2>
              <span className="badge-nivel nivel-{rolSeleccionado.nivel}">
                Nivel {rolSeleccionado.nivel}
              </span>
            </div>

            <div className="modal-body">
              <div className="rol-detalle-grid">
                <div className="rol-info-section">
                  <h3>Información del Rol</h3>
                  <div className="rol-info-item">
                    <span className="rol-info-label">Descripción:</span>
                    <span className="rol-info-valor">{rolSeleccionado.descripcion}</span>
                  </div>
                  <div className="rol-info-item">
                    <span className="rol-info-label">Usuarios asignados:</span>
                    <span className="rol-info-valor">{rolSeleccionado.usuarios}</span>
                  </div>
                  <div className="rol-info-item">
                    <span className="rol-info-label">Fecha creación:</span>
                    <span className="rol-info-valor">{rolSeleccionado.fechaCreacion}</span>
                  </div>
                </div>

                <div className="rol-permisos-section">
                  <h3>Permisos Asignados ({rolSeleccionado.permisos})</h3>
                  <div className="permisos-lista">
                    {permisos.map(permiso => (
                      <div key={permiso.id} className="permiso-item">
                        <CheckCircleIcon className="permiso-icon" />
                        <div className="permiso-info">
                          <strong>{permiso.nombre}</strong>
                          <span>{permiso.modulo}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-acciones">
              <button 
                className="btn-editar"
                onClick={() => {
                  setModalDetalle(false);
                  handleEditar(rolSeleccionado);
                }}
              >
                <EditIcon />
                Editar Rol
              </button>
              <button className="btn-cancelar" onClick={() => setModalDetalle(false)}>
                <CloseIcon />
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL ELIMINAR ROL */}
      {modalEliminar && rolSeleccionado && (
        <div className="modal-overlay" onClick={() => setModalEliminar(false)}>
          <div className="modal-confirmar" onClick={(e) => e.stopPropagation()}>
            <div className="modal-icono warning">
              <DeleteIcon />
            </div>
            <h3>¿Eliminar Rol?</h3>
            <p>Estás a punto de eliminar el rol <strong>{rolSeleccionado.nombre}</strong></p>
            <p className="advertencia">Esta acción no se puede deshacer</p>
            
            <div className="modal-botones">
              <button className="btn-cancelar" onClick={() => setModalEliminar(false)}>
                Cancelar
              </button>
              <button className="btn-confirmar-eliminar" onClick={confirmarEliminar}>
                <DeleteIcon />
                Sí, eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL NUEVO ROL (se abre en página aparte o modal) - Opción modal */}
      {showNuevoRol && (
        <div className="modal-overlay" onClick={() => setShowNuevoRol(false)}>
          <div className="modal-producto modal-rol-nuevo" onClick={(e) => e.stopPropagation()}>
            <button className="modal-cerrar" onClick={() => setShowNuevoRol(false)}>
              <CloseIcon />
            </button>
            
            <div className="modal-header">
              <h2>
                <AddIcon />
                Nuevo Rol
              </h2>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              alert("Rol guardado");
              setShowNuevoRol(false);
            }}>
              <div className="modal-body">
                <div className="form-grid">
                  <div className="form-group">
                    <label>Nombre del Rol *</label>
                    <input
                      type="text"
                      value={nuevoRol.nombre}
                      onChange={(e) => setNuevoRol({...nuevoRol, nombre: e.target.value})}
                      placeholder="Ej: Gerente Regional"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Nivel *</label>
                    <select
                      value={nuevoRol.nivel}
                      onChange={(e) => setNuevoRol({...nuevoRol, nivel: e.target.value})}
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
                      value={nuevoRol.descripcion}
                      onChange={(e) => setNuevoRol({...nuevoRol, descripcion: e.target.value})}
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
                            value={permiso.id}
                          />
                          <span>{permiso.nombre}</span>
                          <small>{permiso.modulo}</small>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="modal-acciones">
                <button type="submit" className="btn-guardar">
                  <AddIcon />
                  Crear Rol
                </button>
                <button type="button" className="btn-cancelar" onClick={() => setShowNuevoRol(false)}>
                  <CloseIcon />
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Roles;