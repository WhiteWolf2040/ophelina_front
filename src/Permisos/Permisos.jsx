// src/Permisos/Permisos.jsx
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
  Business as BusinessIcon,
  Assignment as AssignmentIcon,
  AdminPanelSettings as AdminPanelSettingsIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Key as KeyIcon,
  Category as CategoryIcon,
  AccountBalance as AccountBalanceIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon
} from '@mui/icons-material';
import Sidebar from "../components/Sidebar";
import './Permisos.css';

const Permisos = () => {
  // Estado para los permisos
  const [permisos, setPermisos] = useState([
    {
      id: 1,
      nombre: 'Ver Usuarios',
      codigo: 'view_users',
      descripcion: 'Permite visualizar la lista de usuarios',
      categoria: 'Usuarios',
      estado: 'activo'
    },
    {
      id: 2,
      nombre: 'Crear Usuarios',
      codigo: 'create_users',
      descripcion: 'Permite crear nuevos usuarios en el sistema',
      categoria: 'Usuarios',
      estado: 'activo'
    },
    {
      id: 3,
      nombre: 'Editar Usuarios',
      codigo: 'edit_users',
      descripcion: 'Permite modificar información de usuarios',
      categoria: 'Usuarios',
      estado: 'activo'
    },
    {
      id: 4,
      nombre: 'Eliminar Usuarios',
      codigo: 'delete_users',
      descripcion: 'Permite eliminar usuarios del sistema',
      categoria: 'Usuarios',
      estado: 'inactivo'
    },
    {
      id: 5,
      nombre: 'Ver Roles',
      codigo: 'view_roles',
      descripcion: 'Permite visualizar la lista de roles',
      categoria: 'Roles',
      estado: 'activo'
    },
    {
      id: 6,
      nombre: 'Gestionar Roles',
      codigo: 'manage_roles',
      descripcion: 'Permite crear, editar y eliminar roles',
      categoria: 'Roles',
      estado: 'activo'
    },
    {
      id: 7,
      nombre: 'Ver Ventas',
      codigo: 'view_sales',
      descripcion: 'Permite visualizar las ventas realizadas',
      categoria: 'Ventas',
      estado: 'activo'
    },
    {
      id: 8,
      nombre: 'Crear Ventas',
      codigo: 'create_sales',
      descripcion: 'Permite realizar nuevas ventas',
      categoria: 'Ventas',
      estado: 'activo'
    },
    {
      id: 9,
      nombre: 'Anular Ventas',
      codigo: 'cancel_sales',
      descripcion: 'Permite anular ventas existentes',
      categoria: 'Ventas',
      estado: 'inactivo'
    },
    {
      id: 10,
      nombre: 'Ver Productos',
      codigo: 'view_products',
      descripcion: 'Permite visualizar el catálogo de productos',
      categoria: 'Productos',
      estado: 'activo'
    },
    {
      id: 11,
      nombre: 'Gestionar Productos',
      codigo: 'manage_products',
      descripcion: 'Permite crear, editar y eliminar productos',
      categoria: 'Productos',
      estado: 'activo'
    },
    {
      id: 12,
      nombre: 'Ver Reportes',
      codigo: 'view_reports',
      descripcion: 'Permite visualizar los reportes del sistema',
      categoria: 'Reportes',
      estado: 'activo'
    },
    {
      id: 13,
      nombre: 'Exportar Reportes',
      codigo: 'export_reports',
      descripcion: 'Permite exportar reportes a diferentes formatos',
      categoria: 'Reportes',
      estado: 'activo'
    },
    {
      id: 14,
      nombre: 'Configuración',
      codigo: 'settings',
      descripcion: 'Acceso a la configuración del sistema',
      categoria: 'Sistema',
      estado: 'activo'
    },
    {
      id: 15,
      nombre: 'Auditoría',
      codigo: 'audit',
      descripcion: 'Permite ver los logs de auditoría',
      categoria: 'Sistema',
      estado: 'activo'
    },
    {
      id: 16,
      nombre: 'Gestión de Caja',
      codigo: 'cash_management',
      descripcion: 'Permite gestionar operaciones de caja',
      categoria: 'Finanzas',
      estado: 'activo'
    },
    {
      id: 17,
      nombre: 'Proveedores',
      codigo: 'suppliers',
      descripcion: 'Gestión de proveedores',
      categoria: 'Compras',
      estado: 'activo'
    },
    {
      id: 18,
      nombre: 'Empresa',
      codigo: 'company',
      descripcion: 'Configuración de la empresa',
      categoria: 'Sistema',
      estado: 'activo'
    }
  ]);

  // Estado para categorías
  const [categorias] = useState([
    'Usuarios',
    'Roles',
    'Ventas',
    'Productos',
    'Inventario',
    'Reportes',
    'Sistema',
    'Finanzas',
    'Compras'
  ]);

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
    categoria: 'Sistema',
    estado: 'activo'
  });

  // Estado para selección múltiple
  const [selectedPermisos, setSelectedPermisos] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  // Reiniciar a página 1 cuando cambian los filtros
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filtroCategoria, filtroEstado]);

  // Estadísticas
  const stats = {
    totalPermisos: permisos.length,
    activos: permisos.filter(p => p.estado === 'activo').length,
    inactivos: permisos.filter(p => p.estado === 'inactivo').length,
    categorias: new Set(permisos.map(p => p.categoria)).size
  };

  // Filtrar permisos
  const filteredPermisos = permisos.filter(permiso => {
    const matchesSearch = permiso.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         permiso.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         permiso.descripcion.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategoria = filtroCategoria === 'todas' || permiso.categoria === filtroCategoria;
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
        categoria: permiso.categoria,
        estado: permiso.estado
      });
    } else {
      setFormPermiso({
        nombre: '',
        codigo: '',
        descripcion: '',
        categoria: 'Sistema',
        estado: 'activo'
      });
    }
    setShowModal(true);
  };

  // Abrir modal de creación masiva
  const openBulkModal = () => {
    setModalType('bulk');
    setFormPermiso({
      nombres: '',
      categoria: 'Sistema',
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

  // Guardar permiso
  const handleSavePermiso = () => {
    if (!formPermiso.nombre || !formPermiso.codigo || !formPermiso.descripcion) {
      alert('Por favor completa todos los campos requeridos');
      return;
    }

    const codigoExists = permisos.some(p => 
      p.codigo === formPermiso.codigo && 
      (!selectedPermiso || p.id !== selectedPermiso.id)
    );

    if (codigoExists) {
      alert('Ya existe un permiso con este código');
      return;
    }

    if (modalType === 'new') {
      const nuevoPermiso = {
        id: permisos.length + 1,
        ...formPermiso
      };
      setPermisos([...permisos, nuevoPermiso]);
    } else if (modalType === 'edit' && selectedPermiso) {
      const updatedPermisos = permisos.map(permiso =>
        permiso.id === selectedPermiso.id
          ? { ...permiso, ...formPermiso }
          : permiso
      );
      setPermisos(updatedPermisos);
    }
    closeModal();
  };

  // Guardar permisos masivos
  const handleSaveBulkPermisos = () => {
    if (!formPermiso.nombres) {
      alert('Por favor ingresa los nombres de los permisos');
      return;
    }

    const nombresList = formPermiso.nombres.split('\n').filter(n => n.trim());
    const nuevosPermisos = nombresList.map((nombre, index) => {
      const codigo = nombre
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '_')
        .replace(/_+/g, '_')
        .replace(/^_|_$/g, '');

      return {
        id: permisos.length + index + 1,
        nombre: nombre.trim(),
        codigo: codigo,
        descripcion: formPermiso.descripcionBase || `Permiso para ${nombre.trim()}`,
        categoria: formPermiso.categoria,
        estado: formPermiso.estado
      };
    });

    setPermisos([...permisos, ...nuevosPermisos]);
    closeModal();
  };

  // Eliminar permiso
  const handleDeletePermiso = () => {
    const updatedPermisos = permisos.filter(p => p.id !== selectedPermiso.id);
    setPermisos(updatedPermisos);
    closeModal();
  };

  // Eliminar múltiples permisos
  const handleDeleteSelected = () => {
    if (selectedPermisos.length === 0) return;
    
    const confirmDelete = window.confirm(`¿Estás seguro de eliminar ${selectedPermisos.length} permiso(s)?`);
    if (confirmDelete) {
      const updatedPermisos = permisos.filter(p => !selectedPermisos.includes(p.id));
      setPermisos(updatedPermisos);
      setSelectedPermisos([]);
      setSelectAll(false);
    }
  };

  // Cambiar estado
  const toggleEstado = (permisoId) => {
    const updatedPermisos = permisos.map(p =>
      p.id === permisoId
        ? { ...p, estado: p.estado === 'activo' ? 'inactivo' : 'activo' }
        : p
    );
    setPermisos(updatedPermisos);
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

  // Obtener icono por categoría
  const getIconByCategoria = (categoria) => {
    switch(categoria) {
      case 'Usuarios': return <PeopleIcon />;
      case 'Roles': return <AdminPanelSettingsIcon />;
      case 'Ventas': return <AttachMoneyIcon />;
      case 'Productos': return <InventoryIcon />;
      case 'Inventario': return <AssignmentIcon />;
      case 'Reportes': return <BarChartIcon />;
      case 'Finanzas': return <AccountBalanceIcon />;
      case 'Sistema': return <SettingsIcon />;
      case 'Compras': return <LocalShippingIcon />;
      default: return <KeyIcon />;
    }
  };

  const getEstadoBadge = (estado) => {
    return estado === 'activo' 
      ? <span className="badge-estado activo"><CheckCircleIcon fontSize="small" /> Activo</span>
      : <span className="badge-estado inactivo"><CancelIcon fontSize="small" /> Inactivo</span>;
  };

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
                <AddIcon /> Crear Múltiples
              </button>
              <button className="btn-nuevo-permiso" onClick={() => openModal('new')}>
                <AddIcon /> Nuevo Permiso
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="permisos-stats">
            <div className="stat-card">
              <div className="stat-icon dueño-bg">
                <KeyIcon />
              </div>
              <div>
                <h3>Total Permisos</h3>
                <p>{stats.totalPermisos}</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon admin-bg">
                <CheckCircleIcon />
              </div>
              <div>
                <h3>Activos</h3>
                <p>{stats.activos}</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon permiso-bg">
                <CancelIcon />
              </div>
              <div>
                <h3>Inactivos</h3>
                <p>{stats.inactivos}</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon ejecutivo-bg">
                <CategoryIcon />
              </div>
              <div>
                <h3>Categorías</h3>
                <p>{stats.categorias}</p>
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
                            {getIconByCategoria(permiso.categoria)}
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
                        <span className="badge-categoria">{permiso.categoria}</span>
                      </td>
                      <td>
                        <button 
                          className={`estado-toggle ${permiso.estado}`}
                          onClick={() => toggleEstado(permiso.id)}
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

      {/* Modales */}
      {showModal && (
        <div className="modal-overlay">
          <div className={`modal-container modal-permiso ${modalType === 'delete' ? 'modal-delete' : ''} ${modalType === 'bulk' ? 'modal-bulk' : ''}`}>
            <div className="modal-header">
              <h2>
                {modalType === 'new' && 'Nuevo Permiso'}
                {modalType === 'edit' && 'Editar Permiso'}
                {modalType === 'view' && 'Detalles del Permiso'}
                {modalType === 'delete' && 'Eliminar Permiso'}
                {modalType === 'bulk' && 'Crear Múltiples Permisos'}
              </h2>
              <button className="modal-close" onClick={closeModal}>
                    <CloseIcon />
                </button>
            </div>

            <div className="modal-body">
              {modalType === 'delete' ? (
                <div className="delete-confirm">
                  <WarningIcon className="delete-icon" />
                  <h3>¿Estás seguro de eliminar este permiso?</h3>
                  <p>
                    Estás a punto de eliminar el permiso <strong>"{selectedPermiso?.nombre}"</strong>
                  </p>
                  <p className="delete-warning">
                    <WarningIcon fontSize="small" />
                    Esta acción podría afectar a los roles que utilizan este permiso
                  </p>
                </div>
              ) : modalType === 'bulk' ? (
                <div className="bulk-form">
                  <div className="form-group">
                    <label>Nombres de Permisos *</label>
                    <textarea
                      name="nombres"
                      value={formPermiso.nombres || ''}
                      onChange={handleInputChange}
                      placeholder="Ingresa un nombre por línea&#10;Ej:&#10;Ver Informes&#10;Crear Informes&#10;Exportar Informes"
                      className="form-control"
                      rows="6"
                    />
                    <small className="form-help">Cada línea será un permiso diferente</small>
                  </div>

                  <div className="form-group">
                    <label>Categoría</label>
                    <select
                      name="categoria"
                      value={formPermiso.categoria}
                      onChange={handleInputChange}
                      className="form-control"
                    >
                      {categorias.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Descripción Base (opcional)</label>
                    <input
                      type="text"
                      name="descripcionBase"
                      value={formPermiso.descripcionBase || ''}
                      onChange={handleInputChange}
                      placeholder="Descripción que se aplicará a todos"
                      className="form-control"
                    />
                  </div>

                  <div className="form-group">
                    <label>Estado por defecto</label>
                    <select
                      name="estado"
                      value={formPermiso.estado}
                      onChange={handleInputChange}
                      className="form-control"
                    >
                      <option value="activo">Activo</option>
                      <option value="inactivo">Inactivo</option>
                    </select>
                  </div>
                </div>
              ) : modalType === 'view' ? (
                <div className="permiso-detalle">
                  <div className="detalle-grid">
                    <div className="detalle-item">
                      <span className="detalle-label">Nombre</span>
                      <span className="detalle-valor">{selectedPermiso?.nombre}</span>
                    </div>
                    <div className="detalle-item">
                      <span className="detalle-label">Código</span>
                      <span className="detalle-valor">
                        <code>{selectedPermiso?.codigo}</code>
                      </span>
                    </div>
                    <div className="detalle-item">
                      <span className="detalle-label">Categoría</span>
                      <span className="detalle-valor">
                        <span className="badge-categoria">{selectedPermiso?.categoria}</span>
                      </span>
                    </div>
                    <div className="detalle-item">
                      <span className="detalle-label">Estado</span>
                      <span className="detalle-valor">
                        {getEstadoBadge(selectedPermiso?.estado)}
                      </span>
                    </div>
                    <div className="detalle-item full-width">
                      <span className="detalle-label">Descripción</span>
                      <span className="detalle-valor">{selectedPermiso?.descripcion}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="permiso-form">
                  <div className="form-group">
                    <label>Nombre del Permiso *</label>
                    <input
                      type="text"
                      name="nombre"
                      value={formPermiso.nombre}
                      onChange={handleInputChange}
                      placeholder="Ej: Ver Usuarios"
                      className="form-control"
                      autoFocus
                    />
                  </div>

                  <div className="form-group">
                    <label>Código del Permiso *</label>
                    <input
                      type="text"
                      name="codigo"
                      value={formPermiso.codigo}
                      onChange={handleInputChange}
                      placeholder="Ej: view_users"
                      className="form-control"
                    />
                    <small className="form-help">Identificador único para el permiso</small>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Categoría</label>
                      <select
                        name="categoria"
                        value={formPermiso.categoria}
                        onChange={handleInputChange}
                        className="form-control"
                      >
                        {categorias.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Estado</label>
                      <select
                        name="estado"
                        value={formPermiso.estado}
                        onChange={handleInputChange}
                        className="form-control"
                      >
                        <option value="activo">Activo</option>
                        <option value="inactivo">Inactivo</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Descripción *</label>
                    <textarea
                      name="descripcion"
                      value={formPermiso.descripcion}
                      onChange={handleInputChange}
                      placeholder="Describe la funcionalidad que otorga este permiso"
                      className="form-control"
                      rows="3"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button className="btn-secondary" onClick={closeModal}>
                Cancelar
              </button>
              {modalType === 'delete' ? (
                <button className="btn-danger" onClick={handleDeletePermiso}>
                  <DeleteIcon /> Eliminar
                </button>
              ) : modalType === 'bulk' ? (
                <button className="btn-primary" onClick={handleSaveBulkPermisos}>
                  <SaveIcon /> Crear Permisos
                </button>
              ) : modalType !== 'view' && (
                <button className="btn-primary" onClick={handleSavePermiso}>
                  <SaveIcon /> Guardar
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Permisos;