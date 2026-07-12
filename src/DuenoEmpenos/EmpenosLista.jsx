// EmpenosLista.jsx - VERSIÓN FUSIONADA (Docker Base + Sistema de Permisos Local)
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import "./Empenos.css";
import DiamondIcon from '@mui/icons-material/Diamond';
import VisibilityIcon from '@mui/icons-material/Visibility';
// ✅ AGREGADO DE LOCAL: Importar iconos adicionales
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import LockIcon from '@mui/icons-material/Lock';
import api from '../config/api';
// ✅ AGREGADO DE LOCAL: Importar servicio de permisos
import permissionService from "../services/permisoService";

const EmpenosLista = () => {
  const navigate = useNavigate();
  const [empenos, setEmpenos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtroEstado, setFiltroEstado] = useState("todos");
  const [modalAbierto, setModalAbierto] = useState(false);
  const [empenoSeleccionado, setEmpenoSeleccionado] = useState(null);
  const [modalEliminar, setModalEliminar] = useState(false);
  
  // Estados para paginación
  const [paginaActual, setPaginaActual] = useState(1);
  const empenosPorPagina = 8;

  // ============================================
  // ✅ AGREGADO DE LOCAL: VERIFICAR PERMISOS
  // ============================================
  const puedeVerEmpenos = permissionService.hasPermission('ver_empenos');
  const puedeCrearEmpenos = permissionService.hasPermission('crear_empenos');
  const puedeEditarEmpenos = permissionService.hasPermission('editar_empenos');
  const puedeEliminarEmpenos = permissionService.hasPermission('eliminar_empenos');
  const puedeCancelarEmpenos = permissionService.hasPermission('cancelar_empenos');

  // ============================================
  // ✅ AGREGADO DE LOCAL: REDIRIGIR SI NO TIENE PERMISO PARA VER
  // ============================================
  useEffect(() => {
    if (!puedeVerEmpenos) {
      navigate('/dashboard');
    }
  }, [puedeVerEmpenos, navigate]);

  // Cargar empeños desde la API
  const cargarEmpenos = async () => {
    try {
      setLoading(true);
      const response = await api.get('/empenos/activos-con-saldo');
      if (response.data.success) {
        const empenosFormateados = response.data.data.map(emp => ({
          id: emp.id_empeno,
          cliente: emp.cliente,
          objeto: emp.articulo,
          monto: emp.monto_prestado.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
          interes: 12,
          fecha_inicio: emp.fecha_empeno ? new Date(emp.fecha_empeno).toLocaleDateString('es-MX') : '',
          vencimiento: emp.fecha_vencimiento ? new Date(emp.fecha_vencimiento).toLocaleDateString('es-MX') : '',
          estado: 'activo',
          saldo_pendiente: emp.saldo_total_pendiente,
          saldo_cuota: emp.saldo_pendiente_cuota,
          total_pagado: emp.total_pagado
        }));
        setEmpenos(empenosFormateados);
      }
    } catch (error) {
      console.error('Error al cargar empeños:', error);
      setError('No se pudieron cargar los empeños');
    } finally {
      setLoading(false);
    }
  };

  const cargarTodosEmpenos = async () => {
    try {
      setLoading(true);
      const response = await api.get('/empenos/activos-con-saldo');
      if (response.data.success) {
        const empenosFormateados = response.data.data.map(emp => ({
          id: emp.id_empeno,
          cliente: emp.cliente,
          objeto: emp.articulo,
          monto: emp.monto_prestado.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
          interes: 12,
          fecha_inicio: emp.fecha_empeno ? new Date(emp.fecha_empeno).toLocaleDateString('es-MX') : '',
          vencimiento: emp.fecha_vencimiento ? new Date(emp.fecha_vencimiento).toLocaleDateString('es-MX') : '',
          estado: 'activo',
          saldo_pendiente: emp.saldo_total_pendiente,
          saldo_cuota: emp.saldo_pendiente_cuota,
          total_pagado: emp.total_pagado
        }));
        setEmpenos(empenosFormateados);
      }
    } catch (error) {
      console.error('Error al cargar empeños:', error);
      setError('No se pudieron cargar los empeños');
    } finally {
      setLoading(false);
    }
  };

  // ✅ MEJORADO CON LOCAL: useEffect con verificación de permisos
  useEffect(() => {
    if (puedeVerEmpenos) {
      cargarTodosEmpenos();
    }
  }, [puedeVerEmpenos]);

  // Filtrar empeños por estado
  const empenosFiltrados = empenos.filter((e) => {
    if (filtroEstado === "todos") return true;
    if (filtroEstado === "activos") return e.estado === "activo";
    if (filtroEstado === "vencidos") return e.estado === "vencido";
    return true;
  });

  // Calcular paginación
  const indiceUltimo = paginaActual * empenosPorPagina;
  const indicePrimero = indiceUltimo - empenosPorPagina;
  const empenosActuales = empenosFiltrados.slice(indicePrimero, indiceUltimo);
  const totalPaginas = Math.ceil(empenosFiltrados.length / empenosPorPagina);

  // ✅ MEJORADO CON LOCAL: abrirDetalle con validación de permisos
  const abrirDetalle = (empeno) => {
    if (!puedeVerEmpenos) {
      alert('No tienes permiso para ver detalles de empeños');
      return;
    }
    setEmpenoSeleccionado(empeno);
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setEmpenoSeleccionado(null);
  };

  // ✅ MEJORADO CON LOCAL: confirmarEliminar con validación de permisos
  const confirmarEliminar = (empeno) => {
    if (!puedeEliminarEmpenos) {
      alert('No tienes permiso para eliminar empeños');
      return;
    }
    setEmpenoSeleccionado(empeno);
    setModalEliminar(true);
    setModalAbierto(false);
  };

  // ✅ MEJORADO CON LOCAL: handleEliminar con validación de permisos
  const handleEliminar = async () => {
    if (!puedeEliminarEmpenos) {
      alert('No tienes permiso para eliminar empeños');
      return;
    }

    try {
      console.log("Eliminar empeño:", empenoSeleccionado.id);
      setModalEliminar(false);
      setEmpenoSeleccionado(null);
      cargarTodosEmpenos();
    } catch (error) {
      console.error('Error al eliminar:', error);
      alert('Error al eliminar el empeño');
    }
  };

  // Funciones de paginación
  const cambiarPagina = (numeroPagina) => {
    setPaginaActual(numeroPagina);
  };

  const irPaginaSiguiente = () => {
    setPaginaActual(prev => Math.min(prev + 1, totalPaginas));
  };

  const irPaginaAnterior = () => {
    setPaginaActual(prev => Math.max(prev - 1, 1));
  };

  const obtenerNumerosPagina = () => {
    const numeros = [];
    const maxPaginasVisibles = 5;
    let inicio = Math.max(1, paginaActual - Math.floor(maxPaginasVisibles / 2));
    let fin = Math.min(totalPaginas, inicio + maxPaginasVisibles - 1);
    
    if (fin - inicio + 1 < maxPaginasVisibles) {
      inicio = Math.max(1, fin - maxPaginasVisibles + 1);
    }
    
    for (let i = inicio; i <= fin; i++) {
      numeros.push(i);
    }
    return numeros;
  };

  // ✅ AGREGADO DE LOCAL: Si no tiene permiso, no renderizar nada
  if (!puedeVerEmpenos) {
    return null;
  }

  // Estado de carga
  if (loading) {
    return (
      <div className="dashboard">
        <div className="content" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Cargando empeños...</p>
          </div>
        </div>
      </div>
    );
  }

  // Estado de error
  if (error) {
    return (
      <div className="dashboard">
        <div className="content">
          <div className="tienda-header">
            <h1>Listado de empeños</h1>
            <p className="header-sub">Error al cargar los datos</p>
          </div>
          <div className="tabla-card">
            <p style={{ color: 'red', textAlign: 'center', padding: '40px' }}>{error}</p>
            <button onClick={cargarTodosEmpenos} style={{ margin: '0 auto', display: 'block', padding: '8px 16px', background: '#1e3a8a', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="content">
        {/* HEADER */}
        <div className="tienda-header">
          <div>
            <h1>
              <DiamondIcon className="title-icon" />
              Listado de empeños
            </h1>
            <p className="header-sub">Gestiona y administra tus empeños</p>
          </div>
          
          {/* ✅ AGREGADO DE LOCAL: BOTÓN NUEVO EMPEÑO - SOLO CON PERMISO */}
          {puedeCrearEmpenos && (
            <button
              className="btn-nuevo"
              onClick={() => navigate("/empenos/nuevo")}
            >
              <AddIcon fontSize="small" /> Nuevo Empeño
            </button>
          )}
        </div>

        {/* FILTRO POR ESTADO */}
        <div className="filtro-container">
          <div className="filtro-botones">
            <button
              className={`filtro-btn ${filtroEstado === "todos" ? "activo" : ""}`}
              onClick={() => {
                setFiltroEstado("todos");
                setPaginaActual(1);
              }}
            >
              Todos ({empenos.length})
            </button>
            <button
              className={`filtro-btn ${filtroEstado === "activos" ? "activo" : ""}`}
              onClick={() => {
                setFiltroEstado("activos");
                setPaginaActual(1);
              }}
            >
              Activos ({empenos.filter(e => e.estado === "activo").length})
            </button>
            <button
              className={`filtro-btn ${filtroEstado === "vencidos" ? "activo" : ""}`}
              onClick={() => {
                setFiltroEstado("vencidos");
                setPaginaActual(1);
              }}
            >
              Vencidos ({empenos.filter(e => e.estado === "vencido").length})
            </button>
          </div>
          <span className="filtro-resultados">
            {empenosFiltrados.length} resultado{empenosFiltrados.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* TARJETA DE TABLA */}
        <div className="tabla-card">
          <h3>Lista de Prendas ({empenosFiltrados.length})</h3>

          {/* Vista móvil: tarjetas */}
          <div className="vista-movil">
            {empenosActuales.length > 0 ? (
              empenosActuales.map((e) => (
                <div key={e.id} className="empeno-tarjeta">
                  <div className="tarjeta-header">
                    <strong>{e.cliente}</strong>
                    <span 
                      className="detalle-link"
                      onClick={() => abrirDetalle(e)}
                    >
                      Ver detalles →
                    </span>
                  </div>
                  <div className="tarjeta-cuerpo">
                    <div className="tarjeta-fila">
                      <span className="tarjeta-label">Objeto:</span>
                      <span>{e.objeto}</span>
                    </div>
                    <div className="tarjeta-fila">
                      <span className="tarjeta-label">Monto:</span>
                      <span className="monto">${e.monto}</span>
                    </div>
                    <div className="tarjeta-fila">
                      <span className="tarjeta-label">Interés:</span>
                      <span>{e.interes}%</span>
                    </div>
                    <div className="tarjeta-fila">
                      <span className="tarjeta-label">Vence:</span>
                      <span>{e.vencimiento}</span>
                    </div>
                    <div className="tarjeta-fila">
                      <span className="tarjeta-label">Estado:</span>
                      <span
                        className={
                          e.estado === "activo"
                            ? "badge-activo"
                            : "badge-vencido"
                        }
                      >
                        {e.estado === "activo" ? "Activo" : "Vencido"}
                      </span>
                    </div>
                    {e.saldo_pendiente > 0 && (
                      <div className="tarjeta-fila">
                        <span className="tarjeta-label">Saldo pendiente:</span>
                        <span className="saldo">${e.saldo_pendiente.toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="sin-resultados">
                No se encontraron empeños {filtroEstado !== "todos" ? filtroEstado : ""}
              </div>
            )}
          </div>

          {/* Vista desktop: tabla */}
          <div className="vista-desktop">
            <table className="tabla-empenos">
              <thead>
                <tr>
                  <th>Cliente</th>
                  <th>Objeto</th>
                  <th>Monto</th>
                  <th>Interés</th>
                  <th>Vencimiento</th>
                  <th>Estado</th>
                  <th>Saldo</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {empenosActuales.length > 0 ? (
                  empenosActuales.map((e) => (
                    <tr key={e.id}>
                      <td><strong>{e.cliente}</strong></td>
                      <td>{e.objeto}</td>
                      <td>${e.monto}</td>
                      <td>{e.interes}%</td>
                      <td>{e.vencimiento}</td>
                      <td>
                        <span
                          className={
                            e.estado === "activo"
                              ? "badge-activo"
                              : "badge-vencido"
                          }
                        >
                          {e.estado === "activo" ? "Activo" : "Vencido"}
                        </span>
                       </td>
                      <td>
                        {e.saldo_pendiente > 0 ? (
                          <span className="saldo-pendiente">${e.saldo_pendiente.toLocaleString()}</span>
                        ) : (
                          <span className="saldo-pagado">Pagado</span>
                        )}
                       </td>
                      <td>
                        <div className="acciones-container">
                          {/* BOTÓN VER - SIEMPRE VISIBLE */}
                          <button 
                            className="btn-accion ver"
                            onClick={() => abrirDetalle(e)}
                            title="Ver detalles"
                          >
                            <VisibilityIcon fontSize="small" />
                          </button>
                          
                          {/* ✅ AGREGADO DE LOCAL: BOTÓN EDITAR - SOLO CON PERMISO */}
                          {puedeEditarEmpenos && (
                            <button 
                              className="btn-accion editar"
                              onClick={() => navigate(`/empenos/editar/${e.id}`)}
                              title="Editar empeño"
                            >
                              <EditIcon fontSize="small" />
                            </button>
                          )}
                          
                          {/* ✅ AGREGADO DE LOCAL: BOTÓN ELIMINAR - SOLO CON PERMISO */}
                          {puedeEliminarEmpenos && (
                            <button 
                              className="btn-accion eliminar"
                              onClick={() => confirmarEliminar(e)}
                              title="Eliminar empeño"
                            >
                              <DeleteIcon fontSize="small" />
                            </button>
                          )}
                        </div>
                       </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="sin-resultados">
                      No se encontraron empeños {filtroEstado !== "todos" ? filtroEstado : ""}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* PAGINACIÓN */}
          {totalPaginas > 1 && (
            <div className="paginacion-wrapper">
              <div className="paginacion-container">
                <button 
                  className="btn-paginacion"
                  onClick={irPaginaAnterior}
                  disabled={paginaActual === 1}
                >
                  ←
                </button>
                
                <div className="paginacion-numeros">
                  {obtenerNumerosPagina().map(numero => (
                    <button
                      key={numero}
                      className={`btn-pagina ${paginaActual === numero ? 'activo' : ''}`}
                      onClick={() => cambiarPagina(numero)}
                    >
                      {numero}
                    </button>
                  ))}
                </div>
                
                <button 
                  className="btn-paginacion"
                  onClick={irPaginaSiguiente}
                  disabled={paginaActual === totalPaginas}
                >
                  →
                </button>
              </div>
              <div className="paginacion-info">
                Mostrando {indicePrimero + 1} - {Math.min(indiceUltimo, empenosFiltrados.length)} de {empenosFiltrados.length} empeños
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ============================================ */}
      {/* MODAL DE DETALLE DEL EMPEÑO - MEJORADO CON PERMISOS */}
      {/* ============================================ */}
      {modalAbierto && empenoSeleccionado && (
        <div className="modal-overlay" onClick={cerrarModal}>
          <div className="modal-detalle" onClick={(e) => e.stopPropagation()}>
            <button className="modal-cerrar" onClick={cerrarModal}>×</button>
            
            <div className="modal-header">
              <h2>Detalle del Empeño</h2>
            </div>

            <div className="modal-body">
              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label">👤 Cliente</span>
                  <span className="info-value">{empenoSeleccionado.cliente}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">📦 Objeto</span>
                  <span className="info-value">{empenoSeleccionado.objeto}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">💰 Monto</span>
                  <span className="info-value">${empenoSeleccionado.monto}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">📊 Interés</span>
                  <span className="info-value">{empenoSeleccionado.interes}%</span>
                </div>
                <div className="info-item">
                  <span className="info-label">📅 Fecha de inicio</span>
                  <span className="info-value">{empenoSeleccionado.fecha_inicio}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">⏰ Vencimiento</span>
                  <span className="info-value">{empenoSeleccionado.vencimiento}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">💰 Saldo pendiente</span>
                  <span className="info-value saldo">${empenoSeleccionado.saldo_pendiente?.toLocaleString()}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">💵 Total pagado</span>
                  <span className="info-value">${empenoSeleccionado.total_pagado?.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* ✅ AGREGADO DE LOCAL: ACCIONES DEL MODAL CON PERMISOS */}
            <div className="modal-acciones">
              {puedeEditarEmpenos && (
                <button 
                  className="btn-editar"
                  onClick={() => {
                    setModalAbierto(false);
                    navigate(`/empenos/editar/${empenoSeleccionado.id}`);
                  }}
                >
                  <EditIcon fontSize="small" /> Editar
                </button>
              )}
              
              {puedeCancelarEmpenos && (
                <button 
                  className="btn-cancelar"
                  onClick={() => {
                    console.log("Cancelar empeño:", empenoSeleccionado.id);
                    alert('Función de cancelar empeño');
                  }}
                >
                  ⛔ Cancelar
                </button>
              )}
              
              {puedeEliminarEmpenos && (
                <button 
                  className="btn-eliminar"
                  onClick={() => confirmarEliminar(empenoSeleccionado)}
                >
                  <DeleteIcon fontSize="small" /> Eliminar
                </button>
              )}

              {/* ✅ AGREGADO DE LOCAL: Mensaje si no tiene permisos para modificar */}
              {!puedeEditarEmpenos && !puedeCancelarEmpenos && !puedeEliminarEmpenos && (
                <div className="sin-permisos-modal">
                  <LockIcon fontSize="small" /> 
                  <span>Solo visualización - No tienes permisos para modificar</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ============================================ */}
      {/* ✅ AGREGADO DE LOCAL: MODAL DE CONFIRMACIÓN ELIMINAR - SOLO SI TIENE PERMISO */}
      {/* ============================================ */}
      {modalEliminar && empenoSeleccionado && puedeEliminarEmpenos && (
        <div className="modal-overlay" onClick={() => setModalEliminar(false)}>
          <div className="modal-confirmar" onClick={(e) => e.stopPropagation()}>
            <div className="modal-icono">⚠️</div>
            <h3>¿Eliminar empeño?</h3>
            <p>Estás a punto de eliminar el empeño de <strong>{empenoSeleccionado.cliente}</strong></p>
            <p className="advertencia">Esta acción no se puede deshacer</p>
            
            <div className="modal-botones">
              <button 
                className="btn-cancelar"
                onClick={() => setModalEliminar(false)}
              >
                Cancelar
              </button>
              <button 
                className="btn-confirmar-eliminar"
                onClick={handleEliminar}
              >
                Sí, eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmpenosLista;