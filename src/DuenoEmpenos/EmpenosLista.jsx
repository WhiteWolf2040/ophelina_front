// EmpenosLista.jsx - VERSIÓN MODIFICADA (Solo Ver + Editar Nombre en Modal)
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import "./Empenos.css";
import DiamondIcon from '@mui/icons-material/Diamond';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import api from '../config/api';

const EmpenosLista = () => {
  const navigate = useNavigate();
  const [empenos, setEmpenos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtroEstado, setFiltroEstado] = useState("todos");
  const [modalAbierto, setModalAbierto] = useState(false);
  const [empenoSeleccionado, setEmpenoSeleccionado] = useState(null);
  const [modalEditarNombre, setModalEditarNombre] = useState(false);
  const [nuevoNombre, setNuevoNombre] = useState("");
  const [editando, setEditando] = useState(false);
  
  // Estados para paginación
  const [paginaActual, setPaginaActual] = useState(1);
  const empenosPorPagina = 8;

  // Cargar todos los empeños
  const cargarTodosEmpenos = async () => {
    try {
      setLoading(true);
      const response = await api.get('/empenos/todos');
      if (response.data.success) {
        const empenosFormateados = response.data.data.map(emp => ({
          id: emp.id_empeno,
          cliente: emp.cliente || 'Cliente no disponible',
          objeto: emp.articulo || 'Sin artículo',
          monto: emp.monto_prestado ? emp.monto_prestado.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00',
          interes: emp.intereses || 0,
          fecha_inicio: emp.fecha_empeno ? new Date(emp.fecha_empeno).toLocaleDateString('es-MX') : '',
          vencimiento: emp.fecha_vencimiento ? new Date(emp.fecha_vencimiento).toLocaleDateString('es-MX') : '',
          estado: emp.estado || 'activo',
          saldo_pendiente: emp.saldo_total_pendiente || 0,
          saldo_cuota: emp.saldo_pendiente_cuota || 0,
          total_pagado: emp.total_pagado || 0,
          dias_vencidos: emp.dias_vencidos || 0,
          cliente_id: emp.id_cliente || null
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

  useEffect(() => {
    cargarTodosEmpenos();
  }, []);

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

  // Abrir modal de detalles
  const abrirDetalle = (empeno) => {
    setEmpenoSeleccionado(empeno);
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setEmpenoSeleccionado(null);
  };

  // Abrir modal para editar nombre
  const abrirEditarNombre = (empeno) => {
    setEmpenoSeleccionado(empeno);
    setNuevoNombre(empeno.cliente);
    setModalEditarNombre(true);
    setModalAbierto(false);
  };

  const cerrarModalEditarNombre = () => {
    setModalEditarNombre(false);
    setEmpenoSeleccionado(null);
    setNuevoNombre("");
    setEditando(false);
  };

  // Guardar nuevo nombre del cliente
  const guardarNombreCliente = async () => {
    if (!nuevoNombre.trim() || !empenoSeleccionado) return;
    
    try {
      setEditando(true);
      
      // Aquí iría la llamada a la API para actualizar el nombre del cliente
      // Como no tienes endpoint específico, simulamos la actualización
      // En tu caso real, deberías tener un endpoint como:
      // await api.put(`/clientes/${empenoSeleccionado.cliente_id}`, { nombre: nuevoNombre });
      
      // Simulación - actualizar localmente
      const empenosActualizados = empenos.map(emp => {
        if (emp.id === empenoSeleccionado.id) {
          return { ...emp, cliente: nuevoNombre };
        }
        return emp;
      });
      
      setEmpenos(empenosActualizados);
      
      // Actualizar el empeno seleccionado
      setEmpenoSeleccionado({
        ...empenoSeleccionado,
        cliente: nuevoNombre
      });
      
      // Cerrar modal de edición y abrir modal de detalles actualizado
      cerrarModalEditarNombre();
      setModalAbierto(true);
      
    } catch (error) {
      console.error('Error al actualizar nombre:', error);
      alert('Error al actualizar el nombre del cliente');
    } finally {
      setEditando(false);
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
          <div className="">
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
        <div className="">
          <div>
            <h1>
              <DiamondIcon className="title-icon" />
              Listado de empeños
            </h1>
            <p className="header-sub">Gestiona y administra tus empeños</p>
          </div>
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
                          {/* SOLO BOTÓN VER (OJO) */}
                          <button 
                            className="btn-accion ver"
                            onClick={() => abrirDetalle(e)}
                            title="Ver detalles"
                          >
                            <VisibilityIcon fontSize="small" />
                          </button>
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
      {/* MODAL DE DETALLE DEL EMPEÑO CON EDICIÓN DE NOMBRE */}
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
                  <div className="info-value-cliente">
                    <span className="info-value">{empenoSeleccionado.cliente}</span>
                    <button 
                      className="btn-editar-nombre"
                      onClick={() => abrirEditarNombre(empenoSeleccionado)}
                      title="Editar nombre del cliente"
                    >
                      <EditIcon fontSize="small" />
                    </button>
                  </div>
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

            <div className="modal-acciones">
              <button 
                className="btn-cerrar-modal"
                onClick={cerrarModal}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================ */}
      {/* MODAL PARA EDITAR NOMBRE DEL CLIENTE */}
      {/* ============================================ */}
      {modalEditarNombre && empenoSeleccionado && (
        <div className="modal-overlay" onClick={cerrarModalEditarNombre}>
          <div className="modal-editar-nombre" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-editar">
              <h3>Editar nombre del cliente</h3>
              <button className="btn-cerrar-editar" onClick={cerrarModalEditarNombre}>
                <CloseIcon fontSize="small" />
              </button>
            </div>
            
            <div className="modal-body-editar">
              <p>Empeño: <strong>{empenoSeleccionado.objeto}</strong></p>
              <div className="campo-editar">
                <label htmlFor="nombreCliente">Nombre del cliente</label>
                <input
                  id="nombreCliente"
                  type="text"
                  value={nuevoNombre}
                  onChange={(e) => setNuevoNombre(e.target.value)}
                  placeholder="Ingresa el nuevo nombre"
                  className="input-editar-nombre"
                  disabled={editando}
                />
              </div>
            </div>
            
            <div className="modal-acciones-editar">
              <button 
                className="btn-cancelar-editar"
                onClick={cerrarModalEditarNombre}
                disabled={editando}
              >
                Cancelar
              </button>
              <button 
                className="btn-guardar-editar"
                onClick={guardarNombreCliente}
                disabled={editando || !nuevoNombre.trim()}
              >
                {editando ? 'Guardando...' : 'Guardar nombre'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmpenosLista;