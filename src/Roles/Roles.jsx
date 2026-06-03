// src/Roles/Roles.jsx
import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import "./Roles.css";
import rolesService from "../services/rolService";
import Select from 'react-select';

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
import SaveIcon from '@mui/icons-material/Save';
import RefreshIcon from '@mui/icons-material/Refresh';

const Roles = () => {
  const [roles, setRoles] = useState([]);
  const [permisos, setPermisos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [modalDetalle, setModalDetalle] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);
  const [modalEliminar, setModalEliminar] = useState(false);
  const [rolSeleccionado, setRolSeleccionado] = useState(null);
  const [permisosSeleccionados, setPermisosSeleccionados] = useState([]);
  
  // Para nuevo rol
  const [showNuevoRol, setShowNuevoRol] = useState(false);
  const [nuevoRol, setNuevoRol] = useState({
    nombre: "",
    nivel: "",
    descripcion: "",
    permisos: []
  });

  const [permisosDelRol, setPermisosDelRol] = useState([]);

  // Convertir permisos a formato para React-Select
  const permisosOptions = permisos.map(permiso => ({
    value: permiso.id,
    label: `${permiso.nombre} (${permiso.modulo})`,
    modulo: permiso.modulo,
    descripcion: permiso.descripcion
  }));

  // Estilos personalizados para React-Select
  const customStyles = {
    control: (base, state) => ({
      ...base,
      borderRadius: '8px',
      borderColor: state.isFocused ? '#0d1b3e' : '#e9ecef',
      boxShadow: state.isFocused ? '0 0 0 3px rgba(13, 27, 62, 0.1)' : 'none',
      '&:hover': { borderColor: '#0d1b3e' },
      minHeight: '48px',
      backgroundColor: 'white'
    }),
    option: (base, { isFocused, isSelected }) => ({
      ...base,
      backgroundColor: isSelected ? '#0d1b3e' : isFocused ? '#f8f9fa' : 'white',
      color: isSelected ? 'white' : '#0d1b3e',
      cursor: 'pointer',
      padding: '10px 12px'
    }),
    placeholder: (base) => ({
      ...base,
      color: '#adb5bd'
    }),
    menu: (base) => ({
      ...base,
      zIndex: 9999,
      borderRadius: '8px',
      overflow: 'hidden',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
    }),
    menuList: (base) => ({
      ...base,
      maxHeight: '300px',
      padding: 0
    }),
    multiValue: (base) => ({
      ...base,
      backgroundColor: '#e9ecef',
      borderRadius: '6px'
    }),
    multiValueLabel: (base) => ({
      ...base,
      color: '#0d1b3e',
      fontWeight: 500
    }),
    multiValueRemove: (base) => ({
      ...base,
      color: '#6c757d',
      '&:hover': {
        backgroundColor: '#dc2626',
        color: 'white'
      }
    })
  };

  // Cargar datos al montar el componente
  useEffect(() => {
    console.log('rolesService:', rolesService);
    cargarRoles();
    cargarPermisos();
  }, []);

  const cargarRoles = async () => {
    try {
      setLoading(true);
      const response = await rolesService.obtenerRoles();
      setRoles(response.data.data);
    } catch (error) {
      console.error('Error cargando roles:', error);
      setError('No se pudieron cargar los roles');
    } finally {
      setLoading(false);
    }
  };

  const cargarPermisos = async () => {
    try {
      const response = await rolesService.obtenerPermisos();
      setPermisos(response.data.data);
    } catch (error) {
      console.error('Error cargando permisos:', error);
    }
  };

  const cargarPermisosDelRol = async (rolId) => {
    try {
      const response = await rolesService.obtenerRol(rolId);
      if (response.data.success) {
        setPermisosDelRol(response.data.data.permisos || []);
        const permisosIds = response.data.data.permisos?.map(p => p.id) || [];
        setPermisosSeleccionados(permisosIds);
      }
    } catch (error) {
      console.error('Error cargando permisos del rol:', error);
    }
  };

  const handleCrearRol = async (e) => {
    e.preventDefault();
    try {
      const data = {
        nombre: nuevoRol.nombre,
        nivel: parseInt(nuevoRol.nivel),
        descripcion: nuevoRol.descripcion,
        permisos: nuevoRol.permisos
      };
      await rolesService.crearRol(data);
      await cargarRoles();
      setShowNuevoRol(false);
      setNuevoRol({ nombre: "", nivel: "", descripcion: "", permisos: [] });
    } catch (error) {
      console.error('Error creando rol:', error);
      alert(error.response?.data?.message || 'Error al crear el rol');
    }
  };

  const handleEditarRol = async (e) => {
    e.preventDefault();
    try {
      const data = {
        nombre: rolSeleccionado.nombre,
        nivel: parseInt(rolSeleccionado.nivel),
        descripcion: rolSeleccionado.descripcion || "",
        permisos: permisosSeleccionados
      };
      await rolesService.actualizarRol(rolSeleccionado.id, data);
      await cargarRoles();
      setModalEditar(false);
      setRolSeleccionado(null);
      setPermisosSeleccionados([]);
    } catch (error) {
      console.error('Error actualizando rol:', error);
      alert(error.response?.data?.message || 'Error al actualizar el rol');
    }
  };

  const handleEliminar = async () => {
    try {
      await rolesService.eliminarRol(rolSeleccionado.id);
      await cargarRoles();
      setModalEliminar(false);
      setRolSeleccionado(null);
    } catch (error) {
      console.error('Error eliminando rol:', error);
      alert(error.response?.data?.message || 'Error al eliminar el rol');
    }
  };

  const handleVerDetalle = (rol) => {
    setRolSeleccionado(rol);
    setModalDetalle(true);
  };

  const handleEditar = (rol) => {
    setRolSeleccionado(rol);
    cargarPermisosDelRol(rol.id);
    setModalEditar(true);
  };

  const handleEliminarClick = (rol) => {
    setRolSeleccionado(rol);
    setModalEliminar(true);
  };

  const cerrarModalEditar = () => {
    setModalEditar(false);
    setRolSeleccionado(null);
    setPermisosSeleccionados([]);
  };

  // Filtrar roles
  const rolesFiltrados = roles.filter(rol =>
    rol.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
    rol.descripcion?.toLowerCase().includes(busqueda.toLowerCase())
  );

  // Función para obtener icono según el nivel
  const getIconoPorNivel = (nivel) => {
    const iconMap = {
      1: <AdminPanelSettingsIcon className="rol-icon dueño" />,
      2: <SupervisorAccountIcon className="rol-icon admin" />,
      3: <PersonIcon className="rol-icon ejecutivo" />,
      4: <StoreIcon className="rol-icon caja" />
    };
    return iconMap[nivel] || <PersonIcon className="rol-icon" />;
  };

  // Función para obtener el nombre del nivel
  const getNombreNivel = (nivel) => {
    const nivelMap = {
      1: "Dueño",
      2: "Administrador",
      3: "Ejecutivo",
      4: "Caja"
    };
    return nivelMap[nivel] || `Nivel ${nivel}`;
  };

  if (loading) {
    return (
      <div className="dashboard">
        <Sidebar />
        <div className="content loading-container">
          <div className="spinner"></div>
          <p>Cargando roles...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard">
        <Sidebar />
        <div className="content error-container">
          <h3>Error</h3>
          <p>{error}</p>
          <button onClick={cargarRoles} className="btn-reintentar">
            <RefreshIcon />
            Reintentar
          </button>
        </div>
      </div>
    );
  }

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
            <p className="header-sub">Gestiona y administra los roles del sistema</p>
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
                {roles.reduce((sum, r) => sum + (r.usuarios || 0), 0)}
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
                      {getNombreNivel(rol.nivel)}
                    </span>
                  </td>
                  <td>{rol.descripcion}</td>
                  <td className="text-center">{rol.usuarios || 0}</td>
                  <td className="text-center">{rol.permisos || 0}</td>
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
                        onClick={() => handleEliminarClick(rol)}
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
                  <td colSpan="6" className="sin-resultados">
                    <SearchIcon />
                    <p>No se encontraron roles</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {/* MODAL NUEVO ROL - CON SELECT CON BÚSQUEDA */}
    
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

            <form onSubmit={handleCrearRol}>
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
                      <option value="1">Dueño</option>
                      <option value="2">Administrador</option>
                      <option value="3">Ejecutivo</option>
                      <option value="4">Caja</option>
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
                    <Select
                      options={permisosOptions}
                      isMulti
                      isSearchable
                      placeholder="Buscar permisos por nombre o módulo..."
                      noOptionsMessage={() => "No se encontraron permisos"}
                      loadingMessage={() => "Cargando permisos..."}
                      styles={customStyles}
                      value={permisosOptions.filter(option => 
                        nuevoRol.permisos.includes(option.value)
                      )}
                      onChange={(selected) => {
                        const selectedIds = selected ? selected.map(opt => opt.value) : [];
                        setNuevoRol({
                          ...nuevoRol,
                          permisos: selectedIds
                        });
                      }}
                      formatOptionLabel={(option) => (
                        <div style={{ 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'center',
                          width: '100%'
                        }}>
                          <div>
                            <span style={{ fontWeight: 'bold', color: '#0d1b3e' }}>
                              {option.label.split(' (')[0]}
                            </span>
                            <div style={{ fontSize: '0.7rem', color: '#6c757d' }}>
                              {option.descripcion || `Permiso para ${option.label.split(' (')[0]}`}
                            </div>
                          </div>
                          <span style={{ 
                            fontSize: '0.7rem', 
                            backgroundColor: '#e9ecef',
                            padding: '2px 8px',
                            borderRadius: '20px',
                            color: '#0d1b3e'
                          }}>
                            {option.modulo}
                          </span>
                        </div>
                      )}
                    />
                    <small className="form-help">
                      Puedes buscar por nombre del permiso o por módulo (clientes, empeños, etc.)
                    </small>
                  </div>
                </div>
              </div>

              <div className="modal-acciones">
                <button type="submit" className="btn-guardar">
                  <SaveIcon />
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
              <span className={`badge-nivel nivel-${rolSeleccionado.nivel}`}>
                {getNombreNivel(rolSeleccionado.nivel)}
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
                    <span className="rol-info-label">Nivel:</span>
                    <span className="rol-info-valor">{rolSeleccionado.nivel}</span>
                  </div>
                  <div className="rol-info-item">
                    <span className="rol-info-label">Usuarios asignados:</span>
                    <span className="rol-info-valor">{rolSeleccionado.usuarios || 0}</span>
                  </div>
                </div>

                <div className="rol-permisos-section">
                  <h3>Permisos Asignados ({permisosDelRol.length})</h3>
                  <div className="permisos-lista">
                    {permisosDelRol.length > 0 ? (
                      permisosDelRol.map(permiso => (
                        <div key={permiso.id} className="permiso-item">
                          <CheckCircleIcon className="permiso-icon" />
                          <div className="permiso-info">
                            <strong>{permiso.nombre}</strong>
                            <span>{permiso.modulo}</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="sin-permisos">
                        <p>No hay permisos asignados a este rol</p>
                      </div>
                    )}
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
      {/* MODAL EDITAR ROL - CON SELECT CON BÚSQUEDA */}
      {modalEditar && rolSeleccionado && (
        <div className="modal-overlay" onClick={cerrarModalEditar}>
          <div className="modal-producto modal-rol-editar" onClick={(e) => e.stopPropagation()}>
            <button className="modal-cerrar" onClick={cerrarModalEditar}>
              <CloseIcon />
            </button>
            
            <div className="modal-header">
              <h2>
                <EditIcon />
                Editar Rol: {rolSeleccionado.nombre}
              </h2>
            </div>

            <form onSubmit={handleEditarRol}>
              <div className="modal-body">
                <div className="form-grid">
                  <div className="form-group">
                    <label>Nombre del Rol *</label>
                    <input
                      type="text"
                      value={rolSeleccionado.nombre}
                      onChange={(e) => setRolSeleccionado({
                        ...rolSeleccionado,
                        nombre: e.target.value
                      })}
                      placeholder="Ej: Gerente Regional"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Nivel *</label>
                    <select
                      value={rolSeleccionado.nivel}
                      onChange={(e) => setRolSeleccionado({
                        ...rolSeleccionado,
                        nivel: parseInt(e.target.value)
                      })}
                      required
                    >
                      <option value="">Seleccionar nivel</option>
                      <option value="1">Dueño</option>
                      <option value="2">Administrador</option>
                      <option value="3">Ejecutivo</option>
                      <option value="4">Caja</option>
                      <option value="5">Cliente</option>
                    </select>
                  </div>

                  <div className="form-group full-width">
                    <label>Descripción</label>
                    <textarea
                      value={rolSeleccionado.descripcion || ""}
                      onChange={(e) => setRolSeleccionado({
                        ...rolSeleccionado,
                        descripcion: e.target.value
                      })}
                      rows="3"
                      placeholder="Describe las funciones de este rol..."
                    />
                  </div>

                  <div className="form-group full-width">
                    <label>Permisos</label>
                    <Select
                      options={permisosOptions}
                      isMulti
                      isSearchable
                      placeholder="Buscar permisos por nombre o módulo..."
                      noOptionsMessage={() => "No se encontraron permisos"}
                      loadingMessage={() => "Cargando permisos..."}
                      styles={customStyles}
                      value={permisosOptions.filter(option => 
                        permisosSeleccionados.includes(option.value)
                      )}
                      onChange={(selected) => {
                        const selectedIds = selected ? selected.map(opt => opt.value) : [];
                        setPermisosSeleccionados(selectedIds);
                      }}
                      formatOptionLabel={(option) => (
                        <div style={{ 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'center',
                          width: '100%'
                        }}>
                          <div>
                            <span style={{ fontWeight: 'bold', color: '#0d1b3e' }}>
                              {option.label.split(' (')[0]}
                            </span>
                            <div style={{ fontSize: '0.7rem', color: '#6c757d' }}>
                              {option.descripcion || `Permiso para ${option.label.split(' (')[0]}`}
                            </div>
                          </div>
                          <span style={{ 
                            fontSize: '0.7rem', 
                            backgroundColor: '#e9ecef',
                            padding: '2px 8px',
                            borderRadius: '20px',
                            color: '#0d1b3e'
                          }}>
                            {option.modulo}
                          </span>
                        </div>
                      )}
                    />
                    <small className="form-help">
                      Puedes buscar por nombre del permiso o por módulo (clientes, empeños, etc.)
                    </small>
                  </div>
                </div>
              </div>

              <div className="modal-acciones">
                <button type="submit" className="btn-guardar">
                  <SaveIcon />
                  Guardar Cambios
                </button>
                <button type="button" className="btn-cancelar" onClick={cerrarModalEditar}>
                  <CloseIcon />
                  Cancelar
                </button>
              </div>
            </form>
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
              <button className="btn-confirmar-eliminar" onClick={handleEliminar}>
                <DeleteIcon />
                Sí, eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Roles;