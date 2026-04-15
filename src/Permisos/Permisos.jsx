import React, { useState, useEffect } from 'react';
import {
  Close as CloseIcon,
  Search as SearchIcon,
  Add as AddIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Warning as WarningIcon,
  People as PeopleIcon,
  AttachMoney as AttachMoneyIcon,
  Inventory as InventoryIcon,
  LocalShipping as LocalShippingIcon,
  BarChart as BarChartIcon,
  Settings as SettingsIcon,
  Assignment as AssignmentIcon,
  AdminPanelSettings as AdminPanelSettingsIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Key as KeyIcon,
  Category as CategoryIcon,
  AccountBalance as AccountBalanceIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import Sidebar from "../components/Sidebar";
import permisoService from "../services/permisoService";
import './Permisos.css';

const Permisos = () => {
  // Estado para los permisos desde la BD
  const [permisos, setPermisos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Estado para categorías
  const [categorias, setCategorias] = useState([]);
  
  // Estados para modales
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [selectedPermiso, setSelectedPermiso] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('todas');
  const [filtroEstado, setFiltroEstado] = useState('todos');
  
  // Estados para paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  
  // Estado para formulario de permiso
  const [formPermiso, setFormPermiso] = useState({
    nombre: '',
    codigo: '',
    descripcion: '',
    modulo: 'general',
    estado: 'activo'
  });
  
  // Estado para selección múltiple
  const [selectedPermisos, setSelectedPermisos] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  
  // Estado para formulario masivo
  const [formBulk, setFormBulk] = useState({
    nombres: '',
    modulo: 'general',
    descripcionBase: '',
    estado: 'activo'
  });

  // Cargar datos al montar el componente
  useEffect(() => {
    cargarPermisos();
  }, []);

  const cargarPermisos = async () => {
    try {
      setLoading(true);
      const response = await permisoService.obtenerPermisos();
      setPermisos(response.data.data);
      
      // Extraer categorías únicas
      const categoriasUnicas = [...new Set(response.data.data.map(p => p.modulo))];
      setCategorias(categoriasUnicas);
    } catch (error) {
      console.error('Error cargando permisos:', error);
      setError('No se pudieron cargar los permisos');
    } finally {
      setLoading(false);
    }
  };

  // Reiniciar a página 1 cuando cambian los filtros
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filtroCategoria, filtroEstado]);

  // Estadísticas
  const stats = {
    totalPermisos: permisos.length,
    activos: permisos.filter(p => p.estado === 'activo').length,
    inactivos: permisos.filter(p => p.estado === 'inactivo').length,
    categorias: categorias.length
  };

  // Filtrar permisos
  const filteredPermisos = permisos.filter(permiso => {
    const matchesSearch = permiso.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         permiso.codigo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         permiso.descripcion?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategoria = filtroCategoria === 'todas' || permiso.modulo === filtroCategoria;
    const matchesEstado = filtroEstado === 'todos' || permiso.estado === filtroEstado;
    
    return matchesSearch && matchesCategoria && matchesEstado;
  });

  // Calcula la paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredPermisos.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredPermisos.length / itemsPerPage);

  // Función para cambiar de página
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    document.querySelector('.main-content')?.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Generar números de página con elipsis
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pageNumbers.push(i);
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) pageNumbers.push(i);
      } else {
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pageNumbers.push(i);
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      }
    }
    return pageNumbers;
  };

  // Abrir modal
  const openModal = (type, permiso = null) => {
    setModalType(type);
    setSelectedPermiso(permiso);
    if (permiso && (type === 'edit' || type === 'view')) {
      setFormPermiso({
        nombre: permiso.nombre,
        codigo: permiso.codigo,
        descripcion: permiso.descripcion,
        modulo: permiso.modulo,
        estado: permiso.estado || 'activo'
      });
    } else {
      setFormPermiso({
        nombre: '',
        codigo: '',
        descripcion: '',
        modulo: 'general',
        estado: 'activo'
      });
    }
    setShowModal(true);
  };

  // Abrir modal de creación masiva
  const openBulkModal = () => {
    setModalType('bulk');
    setFormBulk({
      nombres: '',
      modulo: 'general',
      descripcionBase: '',
      estado: 'activo'
    });
    setShowModal(true);
  };

  // Cerrar modal
  const closeModal = () => {
    setShowModal(false);
    setSelectedPermiso(null);
    setSelectedPermisos([]);
    setSelectAll(false);
  };

  // Manejar cambio en formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormPermiso(prev => ({
      ...prev,
      [name]: value
    }));

    if (name === 'nombre' && (modalType === 'new' || modalType === 'edit')) {
      const codigoGenerado = value
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '_')
        .replace(/_+/g, '_')
        .replace(/^_|_$/g, '');
      
      setFormPermiso(prev => ({
        ...prev,
        codigo: codigoGenerado
      }));
    }
  };

  // Manejar cambio en formulario masivo
  const handleBulkInputChange = (e) => {
    const { name, value } = e.target;
    setFormBulk(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Guardar permiso
  const handleSavePermiso = async () => {
    if (!formPermiso.nombre || !formPermiso.codigo || !formPermiso.descripcion) {
      alert('Por favor completa todos los campos requeridos');
      return;
    }

    try {
      if (modalType === 'new') {
        await permisoService.crearPermiso({
          nombre: formPermiso.nombre,
          codigo: formPermiso.codigo,
          descripcion: formPermiso.descripcion,
          modulo: formPermiso.modulo
        });
      } else if (modalType === 'edit' && selectedPermiso) {
        await permisoService.actualizarPermiso(selectedPermiso.id, {
          nombre: formPermiso.nombre,
          codigo: formPermiso.codigo,
          descripcion: formPermiso.descripcion,
          modulo: formPermiso.modulo
        });
      }
      await cargarPermisos(); // Recargar la lista
      closeModal();
    } catch (error) {
      console.error('Error guardando permiso:', error);
      alert(error.response?.data?.message || 'Error al guardar el permiso');
    }
  };

  // Guardar permisos masivos
  const handleSaveBulkPermisos = async () => {
    if (!formBulk.nombres) {
      alert('Por favor ingresa los nombres de los permisos');
      return;
    }

    const nombresList = formBulk.nombres.split('\n').filter(n => n.trim());
    let errores = 0;
    
    for (const nombre of nombresList) {
      const codigo = nombre
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '_')
        .replace(/_+/g, '_')
        .replace(/^_|_$/g, '');
      
      try {
        await permisoService.crearPermiso({
          nombre: nombre.trim(),
          codigo: codigo,
          descripcion: formBulk.descripcionBase || `Permiso para ${nombre.trim()}`,
          modulo: formBulk.modulo
        });
      } catch (error) {
        errores++;
        console.error(`Error creando permiso ${nombre}:`, error);
      }
    }
    
    await cargarPermisos();
    closeModal();
    
    if (errores > 0) {
      alert(`Se crearon ${nombresList.length - errores} permisos. ${errores} errores.`);
    } else {
      alert(`Se crearon ${nombresList.length} permisos exitosamente.`);
    }
  };

  // Eliminar permiso
  const handleDeletePermiso = async () => {
    try {
      await permisoService.eliminarPermiso(selectedPermiso.id);
      await cargarPermisos();
      closeModal();
    } catch (error) {
      console.error('Error eliminando permiso:', error);
      alert(error.response?.data?.message || 'Error al eliminar el permiso');
    }
  };

  // Eliminar múltiples permisos
  const handleDeleteSelected = async () => {
    if (selectedPermisos.length === 0) return;
    
    const confirmDelete = window.confirm(`¿Estás seguro de eliminar ${selectedPermisos.length} permiso(s)?`);
    if (confirmDelete) {
      let errores = 0;
      for (const id of selectedPermisos) {
        try {
          await permisoService.eliminarPermiso(id);
        } catch (error) {
          errores++;
        }
      }
      await cargarPermisos();
      setSelectedPermisos([]);
      setSelectAll(false);
      
      if (errores > 0) {
        alert(`Se eliminaron ${selectedPermisos.length - errores} permisos. ${errores} errores.`);
      }
    }
  };

  // Cambiar estado
  const toggleEstado = async (permisoId, currentEstado) => {
    try {
      const nuevoEstado = currentEstado === 'activo' ? 'inactivo' : 'activo';
      await permisoService.actualizarPermiso(permisoId, { estado: nuevoEstado });
      await cargarPermisos();
    } catch (error) {
      console.error('Error cambiando estado:', error);
      alert('Error al cambiar el estado del permiso');
    }
  };

  // Seleccionar todos
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedPermisos([]);
    } else {
      setSelectedPermisos(currentItems.map(p => p.id));
    }
    setSelectAll(!selectAll);
  };

  // Seleccionar permiso individual
  const handleSelectPermiso = (permisoId) => {
    if (selectedPermisos.includes(permisoId)) {
      setSelectedPermisos(selectedPermisos.filter(id => id !== permisoId));
      setSelectAll(false);
    } else {
      setSelectedPermisos([...selectedPermisos, permisoId]);
    }
  };

  // Obtener icono por módulo
  const getIconByModulo = (modulo) => {
    const moduloLower = modulo?.toLowerCase() || '';
    switch(moduloLower) {
      case 'usuarios': return <PeopleIcon />;
      case 'roles': return <AdminPanelSettingsIcon />;
      case 'ventas': return <AttachMoneyIcon />;
      case 'productos': return <InventoryIcon />;
      case 'inventario': return <AssignmentIcon />;
      case 'reportes': return <BarChartIcon />;
      case 'finanzas': return <AccountBalanceIcon />;
      case 'sistema': return <SettingsIcon />;
      case 'compras': return <LocalShippingIcon />;
      default: return <KeyIcon />;
    }
  };

  const getEstadoBadge = (estado) => {
    return estado === 'activo' 
      ? <span className="badge-estado activo"><CheckCircleIcon fontSize="small" /> Activo</span>
      : <span className="badge-estado inactivo"><CancelIcon fontSize="small" /> Inactivo</span>;
  };

  if (loading) {
    return (
      <div className="app-container">
        <Sidebar />
        <div className="main-content">
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Cargando permisos...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app-container">
        <Sidebar />
        <div className="main-content">
          <div className="error-container">
            <h3>Error</h3>
            <p>{error}</p>
            <button onClick={cargarPermisos} className="btn-reintentar">
              <RefreshIcon /> Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <div className="permisos-content">
          {/* Header */}
          <div className="permisos-header">
            <div>
              <h1>
                <KeyIcon /> Gestión de Permisos
              </h1>
              <div className="header-sub">
                Administra los permisos individuales del sistema
              </div>
            </div>
            <div className="header-actions">
              <button className="btn-bulk-permisos" onClick={openBulkModal}>
                <AddIcon /> Crear múltiples
              </button>
              <button className="btn-nuevo-permiso" onClick={() => openModal('new')}>
                <AddIcon /> Nuevo permiso
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="permisos-stats">
            <div className="stat-card">
              <div className="stat-icon dueño-bg">
                <KeyIcon />
              </div>
              <div className="stat-content">
                <span className="stat-label">Total Permisos</span>
                <p className="stat-number">{stats.totalPermisos}</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon admin-bg">
                <CheckCircleIcon />
              </div>
              <div className="stat-content">
                <span className="stat-label">Activos</span>
                <p className="stat-number">{stats.activos}</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon permiso-bg">
                <CancelIcon />
              </div>
              <div className="stat-content">
                <span className="stat-label">Inactivos</span>
                <p className="stat-number">{stats.inactivos}</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon ejecutivo-bg">
                <CategoryIcon />
              </div>
              <div className="stat-content">
                <span className="stat-label">Categorías</span>
                <p className="stat-number">{stats.categorias}</p>
              </div>
            </div>
          </div>

          {/* Filtros y Buscador */}
          <div className="permisos-filters">
            <div className="search-wrapper">
              <SearchIcon className="search-icon" />
              <input
                type="text"
                className="search-input"
                placeholder="Buscar permisos por nombre, código o descripción..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="filters-wrapper">
              <select
                className="filter-select"
                value={filtroCategoria}
                onChange={(e) => setFiltroCategoria(e.target.value)}
              >
                <option value="todas">Todas las categorías</option>
                {categorias.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>

              <select
                className="filter-select"
                value={filtroEstado}
                onChange={(e) => setFiltroEstado(e.target.value)}
              >
                <option value="todos">Todos los estados</option>
                <option value="activo">Activos</option>
                <option value="inactivo">Inactivos</option>
              </select>

              {selectedPermisos.length > 0 && (
                <button className="btn-delete-selected" onClick={handleDeleteSelected}>
                  <DeleteIcon /> Eliminar {selectedPermisos.length} seleccionados
                </button>
              )}
            </div>
          </div>

          {/* Tabla de Permisos */}
          <div className="permisos-table">
            <table className="table">
              <thead>
                <tr>
                  <th width="40">
                    <input
                      type="checkbox"
                      checked={selectAll}
                      onChange={handleSelectAll}
                    />
                  </th>
                  <th>Permiso</th>
                  <th>Código</th>
                  <th>Categoría</th>
                  <th>Estado</th>
                  <th className="text-center">Acciones</th>
                 </tr>
              </thead>
              <tbody>
                {currentItems.length > 0 ? (
                  currentItems.map(permiso => (
                    <tr key={permiso.id} className={selectedPermisos.includes(permiso.id) ? 'selected-row' : ''}>
                      <td>
                        <input
                          type="checkbox"
                          checked={selectedPermisos.includes(permiso.id)}
                          onChange={() => handleSelectPermiso(permiso.id)}
                        />
                      </td>
                      <td>
                        <div className="permiso-nombre-cell">
                          <span className="permiso-icon">
                            {getIconByModulo(permiso.modulo)}
                          </span>
                          <div>
                            <strong>{permiso.nombre}</strong>
                            <small className="permiso-desc">{permiso.descripcion}</small>
                          </div>
                        </div>
                      </td>
                      <td>
                        <code className="permiso-codigo">{permiso.codigo}</code>
                      </td>
                      <td>
                        <span className="badge-categoria">{permiso.modulo}</span>
                      </td>
                      <td>
                        <button 
                          className={`estado-toggle ${permiso.estado}`}
                          onClick={() => toggleEstado(permiso.id, permiso.estado)}
                          title="Click para cambiar estado"
                        >
                          {getEstadoBadge(permiso.estado)}
                        </button>
                      </td>
                      <td className="text-center">
                        <div className="acciones-cell">
                          <button
                            className="btn-accion ver"
                            onClick={() => openModal('view', permiso)}
                            title="Ver detalles"
                          >
                            <VisibilityIcon fontSize="small" />
                          </button>
                          <button
                            className="btn-accion editar"
                            onClick={() => openModal('edit', permiso)}
                            title="Editar"
                          >
                            <EditIcon fontSize="small" />
                          </button>
                          <button
                            className="btn-accion eliminar"
                            onClick={() => openModal('delete', permiso)}
                            title="Eliminar"
                          >
                            <DeleteIcon fontSize="small" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="sin-resultados">
                      <SearchIcon />
                      <p>No se encontraron permisos</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Paginación */}
            {filteredPermisos.length > 0 && (
              <div className="pagination-container">
                <div className="pagination-info">
                  Mostrando {indexOfFirstItem + 1} a {Math.min(indexOfLastItem, filteredPermisos.length)} de {filteredPermisos.length} permisos
                </div>
                <div className="pagination-controls">
                  <button 
                    className="pagination-button"
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeftIcon />
                  </button>
                  
                  <div className="pagination-pages">
                    {getPageNumbers().map((page, index) => (
                      page === '...' ? (
                        <span key={`ellipsis-${index}`} className="pagination-ellipsis">...</span>
                      ) : (
                        <button
                          key={page}
                          className={`pagination-page ${currentPage === page ? 'active' : ''}`}
                          onClick={() => paginate(page)}
                        >
                          {page}
                        </button>
                      )
                    ))}
                  </div>

                  <button 
                    className="pagination-button"
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRightIcon />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* MODAL NUEVO PERMISO */}
      {modalType === 'new' && showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-detalle" onClick={(e) => e.stopPropagation()}>
            <button className="modal-cerrar" onClick={closeModal}>
              <CloseIcon />
            </button>
            
            <div className="modal-header">
              <h2>
                <AddIcon />
                Nuevo Permiso
              </h2>
            </div>

            <div className="modal-body">
              <div className="form-grid">
                <div className="form-group full-width">
                  <label>Nombre del Permiso *</label>
                  <input
                    type="text"
                    name="nombre"
                    value={formPermiso.nombre}
                    onChange={handleInputChange}
                    placeholder="Ej: Ver Usuarios"
                    required
                  />
                </div>

                <div className="form-group full-width">
                  <label>Código del Permiso *</label>
                  <input
                    type="text"
                    name="codigo"
                    value={formPermiso.codigo}
                    onChange={handleInputChange}
                    placeholder="Ej: view_users"
                    required
                  />
                  <small className="form-help">Identificador único para el permiso</small>
                </div>

                <div className="form-group">
                  <label>Módulo / Categoría</label>
                  <select
                    name="modulo"
                    value={formPermiso.modulo}
                    onChange={handleInputChange}
                  >
                    {categorias.length > 0 ? categorias.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    )) : (
                      <>
                        <option value="general">General</option>
                        <option value="usuarios">Usuarios</option>
                        <option value="roles">Roles</option>
                      </>
                    )}
                  </select>
                </div>

                <div className="form-group">
                  <label>Estado</label>
                  <select
                    name="estado"
                    value={formPermiso.estado}
                    onChange={handleInputChange}
                  >
                    <option value="activo">Activo</option>
                    <option value="inactivo">Inactivo</option>
                  </select>
                </div>

                <div className="form-group full-width">
                  <label>Descripción *</label>
                  <textarea
                    name="descripcion"
                    value={formPermiso.descripcion}
                    onChange={handleInputChange}
                    placeholder="Describe la funcionalidad que otorga este permiso"
                    rows="3"
                  />
                </div>
              </div>
            </div>

            <div className="modal-acciones">
              <button className="btn-editar" onClick={handleSavePermiso}>
                <SaveIcon />
                Guardar
              </button>
              <button className="btn-cancelar" onClick={closeModal}>
                <CloseIcon />
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================ */}
      {/* MODAL EDITAR PERMISO */}
      {/* ============================================ */}
      {modalType === 'edit' && showModal && selectedPermiso && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-detalle" onClick={(e) => e.stopPropagation()}>
            <button className="modal-cerrar" onClick={closeModal}>
              <CloseIcon />
            </button>
            
            <div className="modal-header">
              <h2>
                <EditIcon />
                Editar Permiso: {selectedPermiso.nombre}
              </h2>
            </div>

            <div className="modal-body">
              <div className="form-grid">
                <div className="form-group full-width">
                  <label>Nombre del Permiso *</label>
                  <input
                    type="text"
                    name="nombre"
                    value={formPermiso.nombre}
                    onChange={handleInputChange}
                    placeholder="Ej: Ver Usuarios"
                    required
                  />
                </div>

                <div className="form-group full-width">
                  <label>Código del Permiso *</label>
                  <input
                    type="text"
                    name="codigo"
                    value={formPermiso.codigo}
                    onChange={handleInputChange}
                    placeholder="Ej: view_users"
                    required
                  />
                  <small className="form-help">Identificador único para el permiso</small>
                </div>

                <div className="form-group">
                  <label>Módulo / Categoría</label>
                  <select
                    name="modulo"
                    value={formPermiso.modulo}
                    onChange={handleInputChange}
                  >
                    {categorias.length > 0 ? categorias.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    )) : (
                      <>
                        <option value="general">General</option>
                        <option value="usuarios">Usuarios</option>
                        <option value="roles">Roles</option>
                      </>
                    )}
                  </select>
                </div>

                <div className="form-group">
                  <label>Estado</label>
                  <select
                    name="estado"
                    value={formPermiso.estado}
                    onChange={handleInputChange}
                  >
                    <option value="activo">Activo</option>
                    <option value="inactivo">Inactivo</option>
                  </select>
                </div>

                <div className="form-group full-width">
                  <label>Descripción *</label>
                  <textarea
                    name="descripcion"
                    value={formPermiso.descripcion}
                    onChange={handleInputChange}
                    placeholder="Describe la funcionalidad que otorga este permiso"
                    rows="3"
                  />
                </div>
              </div>
            </div>

            <div className="modal-acciones">
              <button className="btn-editar" onClick={handleSavePermiso}>
                <SaveIcon />
                Guardar Cambios
              </button>
              <button className="btn-cancelar" onClick={closeModal}>
                <CloseIcon />
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DETALLE DE PERMISO */}
      {modalType === 'view' && showModal && selectedPermiso && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-detalle" onClick={(e) => e.stopPropagation()}>
            <button className="modal-cerrar" onClick={closeModal}>
              <CloseIcon />
            </button>
            
            <div className="modal-header">
              <h2>
                {getIconByModulo(selectedPermiso.modulo)}
                {selectedPermiso.nombre}
              </h2>
              <span className={`badge-nivel ${selectedPermiso.estado === 'activo' ? 'activo' : 'inactivo'}`}>
                {selectedPermiso.estado === 'activo' ? 'Activo' : 'Inactivo'}
              </span>
            </div>

            <div className="modal-body">
              <div className="rol-detalle-grid">
                <div className="rol-info-section">
                  <h3>Información del Permiso</h3>
                  <div className="rol-info-item">
                    <span className="rol-info-label">Nombre</span>
                    <span className="rol-info-valor">{selectedPermiso.nombre}</span>
                  </div>
                  <div className="rol-info-item">
                    <span className="rol-info-label">Código</span>
                    <span className="rol-info-valor">
                      <code>{selectedPermiso.codigo}</code>
                    </span>
                  </div>
                  <div className="rol-info-item">
                    <span className="rol-info-label">Módulo / Categoría</span>
                    <span className="rol-info-valor">
                      <span className="badge-categoria">{selectedPermiso.modulo}</span>
                    </span>
                  </div>
                  <div className="rol-info-item">
                    <span className="rol-info-label">Descripción</span>
                    <span className="rol-info-valor">{selectedPermiso.descripcion || 'Sin descripción'}</span>
                  </div>
                </div>

                <div className="rol-permisos-section">
                  <h3>Detalles Adicionales</h3>
                  <div className="rol-info-item">
                    <span className="rol-info-label">Estado</span>
                    <span className="rol-info-valor">
                      {selectedPermiso.estado === 'activo' 
                        ? <span className="badge-estado activo"><CheckCircleIcon fontSize="small" /> Activo</span>
                        : <span className="badge-estado inactivo"><CancelIcon fontSize="small" /> Inactivo</span>}
                    </span>
                  </div>
                  <div className="rol-info-item">
                    <span className="rol-info-label">ID del Permiso</span>
                    <span className="rol-info-valor">#{selectedPermiso.id}</span>
                  </div>
                  <div className="rol-info-item">
                    <span className="rol-info-label">Roles que lo usan</span>
                    <span className="rol-info-valor">0 roles</span>
                  </div>
                  <div className="rol-info-item">
                    <span className="rol-info-label">Fecha de creación</span>
                    <span className="rol-info-valor">{new Date().toLocaleDateString('es-MX')}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-acciones">
              <button 
                className="btn-editar"
                onClick={() => {
                  closeModal();
                  openModal('edit', selectedPermiso);
                }}
              >
                <EditIcon />
                Editar Permiso
              </button>
              <button className="btn-cancelar" onClick={closeModal}>
                <CloseIcon />
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL ELIMINAR PERMISO */}
      {modalType === 'delete' && showModal && selectedPermiso && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-confirmar" onClick={(e) => e.stopPropagation()}>
            <div className="modal-icono warning">
              <DeleteIcon />
            </div>
            <h3>¿Eliminar Permiso?</h3>
            <p>Estás a punto de eliminar el permiso <strong>"{selectedPermiso.nombre}"</strong></p>
            <p className="advertencia">Esta acción no se puede deshacer</p>
            
            <div className="modal-botones">
              <button className="btn-cancelar" onClick={closeModal}>
                Cancelar
              </button>
              <button className="btn-confirmar-eliminar" onClick={handleDeletePermiso}>
                <DeleteIcon />
                Sí, eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL CREAR MÚLTIPLES PERMISOS (BULK) */}
      {modalType === 'bulk' && showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-detalle" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
            <button className="modal-cerrar" onClick={closeModal}>
              <CloseIcon />
            </button>
            
            <div className="modal-header">
              <h2>
                <AddIcon />
                Crear múltiples permisos
              </h2>
            </div>

            <div className="modal-body">
              <div className="form-grid">
                <div className="form-group full-width">
                  <label>Nombres de Permisos *</label>
                  <textarea
                    name="nombres"
                    value={formBulk.nombres}
                    onChange={handleBulkInputChange}
                    placeholder="Ingresa un nombre por línea&#10;Ej:&#10;Ver Informes&#10;Crear Informes&#10;Exportar Informes"
                    rows="6"
                  />
                  <small className="form-help">Cada línea será un permiso diferente</small>
                </div>

                <div className="form-group">
                  <label>Módulo / Categoría</label>
                  <select
                    name="modulo"
                    value={formBulk.modulo}
                    onChange={handleBulkInputChange}
                  >
                    {categorias.length > 0 ? categorias.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    )) : (
                      <>
                        <option value="general">General</option>
                        <option value="usuarios">Usuarios</option>
                        <option value="roles">Roles</option>
                      </>
                    )}
                  </select>
                </div>

                <div className="form-group">
                  <label>Estado por defecto</label>
                  <select
                    name="estado"
                    value={formBulk.estado}
                    onChange={handleBulkInputChange}
                  >
                    <option value="activo">Activo</option>
                    <option value="inactivo">Inactivo</option>
                  </select>
                </div>

                <div className="form-group full-width">
                  <label>Descripción Base (opcional)</label>
                  <input
                    type="text"
                    name="descripcionBase"
                    value={formBulk.descripcionBase}
                    onChange={handleBulkInputChange}
                    placeholder="Descripción que se aplicará a todos"
                  />
                </div>
              </div>
            </div>

            <div className="modal-acciones">
              <button className="btn-editar" onClick={handleSaveBulkPermisos}>
                <SaveIcon />
                Crear Permisos
              </button>
              <button className="btn-cancelar" onClick={closeModal}>
                <CloseIcon />
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Permisos;