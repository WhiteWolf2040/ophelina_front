// EmpenosLista.jsx - VERSIÓN CORREGIDA + IMAGEN
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import "./Empenos.css";
import DiamondIcon from '@mui/icons-material/Diamond';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import api from '../config/api';
import AgregarImagenPrenda from '../components/AgregarImagenPrenda'; // ← NUEVO (ajusta la ruta si tu carpeta es distinta)

const EmpenosLista = () => {
  const navigate = useNavigate();
  const [empenos, setEmpenos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtroEstado, setFiltroEstado] = useState("todos");
  const [modalAbierto, setModalAbierto] = useState(false);
  const [empenoSeleccionado, setEmpenoSeleccionado] = useState(null);
  const [modalEditar, setModalEditar] = useState(false);
  const [editando, setEditando] = useState(false);

  // Estados para edición
  const [nombreCliente, setNombreCliente] = useState("");
  const [material, setMaterial] = useState("");

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
          id_prenda: emp.id_prenda,        // ← NUEVO
          imagen: emp.imagen_url || null,  // ← NUEVO
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
          cliente_id: emp.id_cliente || null,
          material: emp.material || 'No especificado'
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

  // ← NUEVO: actualiza la imagen de una fila sin recargar todo el listado
  const actualizarImagenLocal = (idEmpeno, nuevaUrl) => {
    setEmpenos(prev => prev.map(e => e.id === idEmpeno ? { ...e, imagen: nuevaUrl } : e));
  };

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

  // Abrir modal de edición
  const abrirEditar = (empeno) => {
    setEmpenoSeleccionado(empeno);
    setNombreCliente(empeno.cliente);
    setMaterial(empeno.material || '');
    setModalEditar(true);
  };

  const cerrarModalEditar = () => {
    setModalEditar(false);
    setEmpenoSeleccionado(null);
    setNombreCliente("");
    setMaterial("");
    setEditando(false);
  };

  // Guardar cambios (solo nombre y material)
  const guardarCambios = async () => {
    if (!nombreCliente.trim() || !empenoSeleccionado) return;

    try {
      setEditando(true);

      const empenosActualizados = empenos.map(emp => {
        if (emp.id === empenoSeleccionado.id) {
          return {
            ...emp,
            cliente: nombreCliente,
            material: material
          };
        }
        return emp;
      });

      setEmpenos(empenosActualizados);

      setEmpenoSeleccionado({
        ...empenoSeleccionado,
        cliente: nombreCliente,
        material: material
      });

      cerrarModalEditar();

    } catch (error) {
      console.error('Error al actualizar:', error);
      alert('Error al actualizar los datos');
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
        <div className="header-container">
          <div>
            <h1>
              <DiamondIcon className="title-icon" />
              Listado de empeños
            </h1>
            <p className="header-sub">Gestiona y administra tus empeños</p>
          </div>

          <button
            className="btn-nuevo"
            onClick={() => navigate("/empenos/nuevo")}
          >
            <AddIcon fontSize="small" /> Nuevo Empeño
          </button>
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
                      <span className="tarjeta-label">Imagen:</span>
                      <AgregarImagenPrenda
                        idPrenda={e.id_prenda}
                        imagenActual={e.imagen}
                        onImagenActualizada={(url) => actualizarImagenLocal(e.id, url)}
                      />
                    </div>
                    <div className="tarjeta-fila">
                      <span className="tarjeta-label">Objeto:</span>
                      <span>{e.objeto}</span>
                    </div>
                    <div className="tarjeta-fila">
                      <span className="tarjeta-label">Material:</span>
                      <span>{e.material}</span>
                    </div>
                    <div className="tarjeta-fila">
                      <span className="tarjeta-label">Monto:</span>
                      <span className="monto">${e.monto}</span>
                    </div>
                    <div className="tarjeta-fila">
                      <span className="tarjeta-label">Interés:</span>
                      <span>${e.interes?.toLocaleString()}</span>
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
                  <th>Imagen</th>
                  <th>Cliente</th>
                  <th>Objeto</th>
                  <th>Material</th>
                  <th>Monto</th>
                  <th>Interés (MXN)</th>
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
                      <td>
                        <AgregarImagenPrenda
                          idPrenda={e.id_prenda}
                          imagenActual={e.imagen}
                          onImagenActualizada={(url) => actualizarImagenLocal(e.id, url)}
                        />
                      </td>
                      <td><strong>{e.cliente}</strong></td>
                      <td>{e.objeto}</td>
                      <td>{e.material}</td>
                      <td>${e.monto}</td>
                      <td>${e.interes?.toLocaleString()}</td>
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
                          <button
                            className="btn-accion ver"
                            onClick={() => abrirDetalle(e)}
                            title="Ver detalles"
                          >
                            <VisibilityIcon fontSize="small" />
                          </button>

                          <button
                            className="btn-accion editar"
                            onClick={() => abrirEditar(e)}
                            title="Editar nombre y material"
                          >
                            <EditIcon fontSize="small" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="10" className="sin-resultados">
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

      {/* MODAL DE DETALLE DEL EMPEÑO */}
      {modalAbierto && empenoSeleccionado && (
        <div className="modal-overlay" onClick={cerrarModal}>
          <div className="modal-detalle" onClick={(e) => e.stopPropagation()}>
            <button className="modal-cerrar" onClick={cerrarModal}>×</button>

            <div className="modal-header">
              <h2>Detalle del Empeño</h2>
            </div>

            <div className="modal-body">
              {empenoSeleccionado.imagen && (
                <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                  <img
                    src={empenoSeleccionado.imagen}
                    alt={empenoSeleccionado.objeto}
                    style={{ maxWidth: '160px', maxHeight: '160px', borderRadius: '8px', objectFit: 'cover' }}
                  />
                </div>
              )}
              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label">👤 Cliente</span>
                  <span className="info-value">{empenoSeleccionado.cliente}</span>
                </div>
                <div className="info-item">
                  <span className="info-label"> Objeto</span>
                  <span className="info-value">{empenoSeleccionado.objeto}</span>
                </div>
                <div className="info-item">
                  <span className="info-label"> Material</span>
                  <span className="info-value">{empenoSeleccionado.material}</span>
                </div>
                <div className="info-item">
                  <span className="info-label"> Monto</span>
                  <span className="info-value">${empenoSeleccionado.monto}</span>
                </div>
                <div className="info-item">
                  <span className="info-label"> Interés</span>
                  <span className="info-value">${empenoSeleccionado.interes?.toLocaleString()}</span>
                </div>
                <div className="info-item">
                  <span className="info-label"> Fecha de inicio</span>
                  <span className="info-value">{empenoSeleccionado.fecha_inicio}</span>
                </div>
                <div className="info-item">
                  <span className="info-label"> Vencimiento</span>
                  <span className="info-value">{empenoSeleccionado.vencimiento}</span>
                </div>
                <div className="info-item">
                  <span className="info-label"> Saldo pendiente</span>
                  <span className="info-value saldo">${empenoSeleccionado.saldo_pendiente?.toLocaleString()}</span>
                </div>
                <div className="info-item">
                  <span className="info-label"> Total pagado</span>
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

      {/* MODAL DE EDICIÓN - SOLO NOMBRE Y MATERIAL */}
      {modalEditar && empenoSeleccionado && (
        <div className="modal-overlay" onClick={cerrarModalEditar}>
          <div className="modal-editar" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-editar">
              <h3>Editar datos del empeño</h3>
              <button className="btn-cerrar-editar" onClick={cerrarModalEditar}>
                <CloseIcon fontSize="small" />
              </button>
            </div>

            <div className="modal-body-editar">
              <p className="info-editar">
                Editando empeño: <strong>{empenoSeleccionado.objeto}</strong>
              </p>

              <div className="campo-editar">
                <label htmlFor="nombreCliente">Nombre del cliente</label>
                <input
                  id="nombreCliente"
                  type="text"
                  value={nombreCliente}
                  onChange={(e) => setNombreCliente(e.target.value)}
                  placeholder="Ingresa el nombre del cliente"
                  className="input-editar"
                  disabled={editando}
                />
              </div>

              <div className="campo-editar">
                <label htmlFor="material">Material</label>
                <input
                  id="material"
                  type="text"
                  value={material}
                  onChange={(e) => setMaterial(e.target.value)}
                  placeholder="Ingresa el material"
                  className="input-editar"
                  disabled={editando}
                />
              </div>
            </div>

            <div className="modal-acciones-editar">
              <button
                className="btn-cancelar-editar"
                onClick={cerrarModalEditar}
                disabled={editando}
              >
                Cancelar
              </button>
              <button
                className="btn-guardar-editar"
                onClick={guardarCambios}
                disabled={editando || !nombreCliente.trim()}
              >
                {editando ? 'Guardando...' : 'Guardar cambios'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmpenosLista;