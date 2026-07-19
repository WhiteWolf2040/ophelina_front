// PagosLista.jsx - VERSIÓN CORREGIDA (CON CSS RESPONSIVE)
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import "./Pagos.css";
import PaymentsIcon from '@mui/icons-material/Payments';
import pagosService from "../services/pagosService";

// Importar iconos de MUI
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import PrintIcon from '@mui/icons-material/Print';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import QrCodeIcon from '@mui/icons-material/QrCode';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';

const PagosLista = () => { 
  const navigate = useNavigate();

  const [userRole, setUserRole] = useState('');
  
  const puedeRegistrarPagos = () => {
    const rolesConPermiso = ['Administrador', 'Dueño', 'Gerente'];
    return rolesConPermiso.includes(userRole);
  };

  const puedeEliminar = () => {
    const rolesConPermiso = ['Administrador', 'Dueño'];
    return rolesConPermiso.includes(userRole);
  };

  // Estados
  const [pagos, setPagos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [fechaFiltro, setFechaFiltro] = useState("");
  const [modalAbierto, setModalAbierto] = useState(false);
  const [pagoSeleccionado, setPagoSeleccionado] = useState(null);
  const [detalleCompleto, setDetalleCompleto] = useState(null);
  const [modalEliminar, setModalEliminar] = useState(false);
  const [loadingDetalle, setLoadingDetalle] = useState(false);
  
  // Paginación
  const [paginaActual, setPaginaActual] = useState(1);
  const pagosPorPagina = 8;

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setUserRole(user.rol || '');
      } catch (e) {
        console.error('Error al cargar usuario:', e);
      }
    }
  }, []);

  useEffect(() => {
    cargarPagos();
  }, []);

  const cargarPagos = async () => {
    try {
      setLoading(true);
      const response = await pagosService.obtenerPagos();
      const pagosFormateados = response.data.data.map(pago => ({
        ...pago,
        articulo: typeof pago.articulo === 'object' ? pago.articulo.descripcion || 'Sin artículo' : pago.articulo,
        cliente: typeof pago.cliente === 'object' ? pago.cliente.nombre || 'Cliente' : pago.cliente
      }));
      setPagos(pagosFormateados);
    } catch (error) {
      console.error('Error cargando pagos:', error);
      setError('No se pudieron cargar los pagos');
    } finally {
      setLoading(false);
    }
  };

  const handleEliminar = async () => {
    if (!puedeEliminar()) {
      alert('No tienes permiso para eliminar pagos');
      return;
    }

    try {
      await pagosService.eliminarPago(pagoSeleccionado.id);
      setPagos(pagos.filter(p => p.id !== pagoSeleccionado.id));
      setModalEliminar(false);
      setPagoSeleccionado(null);
      setDetalleCompleto(null);
    } catch (error) {
      console.error('Error eliminando pago:', error);
      alert('Error al eliminar el pago');
    }
  };

  const pagosFiltrados = pagos.filter((pago) => {
    const coincideNombre = pago.cliente
      ?.toLowerCase()
      .includes(busqueda.toLowerCase()) ?? false;

    const coincideFecha = fechaFiltro
      ? pago.fecha === fechaFiltro
      : true;

    return coincideNombre && coincideFecha;
  });

  const indiceUltimo = paginaActual * pagosPorPagina;
  const indicePrimero = indiceUltimo - pagosPorPagina;
  const pagosActuales = pagosFiltrados.slice(indicePrimero, indiceUltimo);
  const totalPaginas = Math.ceil(pagosFiltrados.length / pagosPorPagina);

  const abrirDetalle = async (pago) => {
    setPagoSeleccionado(pago);
    setModalAbierto(true);
    setLoadingDetalle(true);
    
    try {
      const response = await pagosService.obtenerPago(pago.id);
      console.log("Detalle completo del pago:", response.data.data);
      setDetalleCompleto(response.data.data);
    } catch (error) {
      console.error('Error cargando detalle del pago:', error);
      setDetalleCompleto(null);
    } finally {
      setLoadingDetalle(false);
    }
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setPagoSeleccionado(null);
    setDetalleCompleto(null);
  };

  const confirmarEliminar = (pago) => {
    if (!puedeEliminar()) {
      alert('No tienes permiso para eliminar pagos');
      return;
    }

    setPagoSeleccionado(pago);
    setModalEliminar(true);
    setModalAbierto(false);
  };

  const handleImprimir = () => {
    const contenidoTicket = document.getElementById('contenido-ticket-imprimir').innerHTML;
    
    const ventanaImpresion = window.open('', '_blank');
    
    ventanaImpresion.document.write(`
      <html>
        <head>
          <title>Ticket de Pago</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 20px;
              max-width: 400px;
              margin: 0 auto;
            }
            .recibo-encabezado { text-align: center; }
            .recibo-folio-section { margin: 15px 0; }
            .recibo-desglose { margin: 15px 0; }
            .desglose-fila { display: flex; justify-content: space-between; }
            .total { font-weight: bold; border-top: 2px solid #000; }
            .recibo-tabla { width: 100%; border-collapse: collapse; }
            .recibo-tabla th { background: #f0f0f0; }
            @media print {
              body { margin: 0; padding: 10px; }
            }
          </style>
        </head>
        <body>
          ${contenidoTicket}
        </body>
      </html>
    `);
    
    ventanaImpresion.document.close();
    ventanaImpresion.focus();
    ventanaImpresion.print();
    ventanaImpresion.close();
  };

  const handleCopiarFolio = () => {
    let folio = "";
    if (detalleCompleto?.empeno?.folio) {
      folio = detalleCompleto.empeno.folio;
    } else if (pagoSeleccionado?.folio) {
      folio = pagoSeleccionado.folio;
    } else {
      folio = `PAG-${pagoSeleccionado?.id}-${new Date().getFullYear()}`;
    }
    navigator.clipboard.writeText(folio);
    alert("Folio copiado al portapapeles");
  };

  const getReciboData = () => {
    if (!detalleCompleto) {
      if (!pagoSeleccionado) return null;
      return {
        folio: pagoSeleccionado.folio || `PAG-${pagoSeleccionado.id}-${new Date().getFullYear()}`,
        fechaVencimiento: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('es-MX'),
        capital: Number(pagoSeleccionado.capital) || 0,
        interes: Number(pagoSeleccionado.interes) || 0,
        iva: Number(pagoSeleccionado.iva) || 0,
        subtotal: (Number(pagoSeleccionado.capital) || 0) + (Number(pagoSeleccionado.interes) || 0),
        total: Number(pagoSeleccionado.monto_total) || Number(pagoSeleccionado.monto) || 0,
        metodoPago: pagoSeleccionado.metodo_pago || pagoSeleccionado.metodo || "Efectivo",
        referencia: pagoSeleccionado.referencia || `REF-${Date.now().toString(36).toUpperCase()}`,
        cajero: "Laura Martínez",
        sucursal: "Casa Matriz - Mérida",
        rfcCliente: "XAXX010101000",
        telefonoCliente: pagoSeleccionado.telefono || "999 999 9999",
        emailCliente: pagoSeleccionado.email || "cliente@email.com",
        nombreCliente: typeof pagoSeleccionado.cliente === 'object' ? pagoSeleccionado.cliente.nombre : pagoSeleccionado.cliente || "Cliente",
        prendaDescripcion: typeof pagoSeleccionado.articulo === 'object' ? pagoSeleccionado.articulo.descripcion : pagoSeleccionado.articulo || "Artículo"
      };
    }
    
    const pagoData = detalleCompleto.pago || {};
    const empenoData = detalleCompleto.empeno || {};
    const clienteData = detalleCompleto.cliente || {};
    
    return {
      folio: empenoData.folio || `PAG-${detalleCompleto.id}-${new Date().getFullYear()}`,
      fechaVencimiento: empenoData.fecha_vencimiento 
        ? new Date(empenoData.fecha_vencimiento).toLocaleDateString('es-MX') 
        : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('es-MX'),
      
      capital: Number(pagoData.capital) || 0,
      interes: Number(pagoData.interes) || 0,
      iva: Number(pagoData.iva) || 0,
      subtotal: (Number(pagoData.capital) || 0) + (Number(pagoData.interes) || 0),
      total: Number(pagoData.monto_total) || 0,
      
      metodoPago: pagoData.metodo || pagoData.metodo_pago || "Efectivo",
      referencia: pagoData.referencia || `REF-${Date.now().toString(36).toUpperCase()}`,
      fechaPago: pagoData.fecha || detalleCompleto.fecha_pago,
      
      id_empeno: empenoData.id,
      monto_prestado: empenoData.monto_prestado || 0,
      prendaDescripcion: typeof empenoData.prenda === 'object' ? empenoData.prenda.descripcion : empenoData.prenda || "Artículo",
      
      cajero: "Laura Martínez",
      sucursal: "Casa Matriz - Mérida",
      
      rfcCliente: "XAXX010101000",
      telefonoCliente: clienteData.telefono || "999 999 9999",
      emailCliente: clienteData.correo || "cliente@email.com",
      nombreCliente: clienteData.nombre || pagoSeleccionado?.cliente || "Cliente"
    };
  };

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

  // ============================================
  // ✅ RENDER - CON ESTRUCTURA CORREGIDA
  // ============================================
  
  if (loading) {
    return (
      <div className="dashboard">
        <div className="content loading-container">
          <div className="loading-spinner">Cargando pagos...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard">
        <div className="content error-container">
          <h3>Error</h3>
          <p>{error}</p>
          <button onClick={cargarPagos} className="btn-reintentar">
            Reintentar
          </button>
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
              <PaymentsIcon className="title-icon" /> 
              Listado de pagos
            </h1>
            <p className="header-sub">Gestiona los pagos realizados</p>
          </div>
          
          {puedeRegistrarPagos() && (
            <button
              className="btn-nuevo"
              onClick={() => navigate("/pagos/nuevo")}
            >
              <AddIcon fontSize="small" /> Nuevo Pago
            </button>
          )}
        </div>

        {/* FILTROS */}
        <div className="filtros-container">
          <div className="buscador-container">
            <input
              type="text"
              placeholder="Buscar por cliente..."
              value={busqueda}
              onChange={(e) => {
                setBusqueda(e.target.value);
                setPaginaActual(1);
              }}
              className="buscador-input"
            />
          </div>

          <div className="filtro-fecha-container">
            <input
              type="date"
              value={fechaFiltro}
              onChange={(e) => {
                setFechaFiltro(e.target.value);
                setPaginaActual(1);
              }}
              className="filtro-fecha"
            />
          </div>

          {(busqueda || fechaFiltro) && (
            <button
              className="btn-limpiar"
              onClick={() => {
                setBusqueda("");
                setFechaFiltro("");
                setPaginaActual(1);
              }}
            >
              ✕ Limpiar
            </button>
          )}
        </div>

        {/* TABLA */}
        <div className="tabla-card">
          <h3>Lista de Pagos ({pagosFiltrados.length})</h3>

          {/* Vista móvil */}
          <div className="vista-movil">
            {pagosActuales.length > 0 ? (
              pagosActuales.map((pago) => (
                <div key={pago.id} className="pago-tarjeta">
                  <div className="tarjeta-header">
                    <strong>{pago.cliente}</strong>
                    <span 
                      className="detalle-link"
                      onClick={() => abrirDetalle(pago)}
                    >
                      Ver detalles →
                    </span>
                  </div>
                  <div className="tarjeta-cuerpo">
                    <div className="tarjeta-fila">
                      <span className="tarjeta-label">Artículo:</span>
                      <span>{pago.articulo}</span>
                    </div>
                    <div className="tarjeta-fila">
                      <span className="tarjeta-label">Monto:</span>
                      <span className="monto">${pago.monto}</span>
                    </div>
                    <div className="tarjeta-fila">
                      <span className="tarjeta-label">Tipo:</span>
                      <span className={`tipo-badge tipo-${pago.tipo?.toLowerCase()}`}>
                        {pago.tipo}
                      </span>
                    </div>
                    <div className="tarjeta-fila">
                      <span className="tarjeta-label">Fecha:</span>
                      <span>{pago.fecha}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="sin-resultados">
                No hay resultados con esos filtros
              </div>
            )}
          </div>

          {/* Vista desktop */}
          <div className="vista-desktop">
            <div className="tabla-wrapper">
              <table className="tabla-moderna">
                <thead>
                  <tr>
                    <th>Cliente</th>
                    <th>Artículo</th>
                    <th>Monto</th>
                    <th>Tipo</th>
                    <th>Fecha</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {pagosActuales.length > 0 ? (
                    pagosActuales.map((pago) => (
                      <tr key={pago.id}>
                        <td><strong>{pago.cliente}</strong></td>
                        <td>{pago.articulo}</td>
                        <td>${pago.monto}</td>
                        <td>
                          <span className={`tipo-badge tipo-${pago.tipo?.toLowerCase()}`}>
                            {pago.tipo}
                          </span>
                        </td>
                        <td>{pago.fecha}</td>
                        <td>
                          <div className="acciones-cell">
                            <button 
                              className="btn-accion ver"
                              onClick={() => abrirDetalle(pago)}
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
                      <td colSpan="6" className="sin-resultados">
                        No hay resultados con esos filtros
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
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
                Mostrando {indicePrimero + 1} - {Math.min(indiceUltimo, pagosFiltrados.length)} de {pagosFiltrados.length} pagos
              </div>
            </div>
          )}
        </div>
      </div>

      {/* MODAL DE DETALLE DEL PAGO */}
      {modalAbierto && (
        <div className="modal-overlay" onClick={cerrarModal}>
          <div className="modal-recibo" onClick={(e) => e.stopPropagation()}>
            
            <div className="recibo-header-modal">
              <button className="recibo-cerrar" onClick={cerrarModal}>
                <CloseIcon />
              </button>
              <div className="recibo-acciones-modal">
                <button className="recibo-btn" onClick={handleImprimir}>
                  <PrintIcon fontSize="small" />
                  Imprimir
                </button>
                <button className="recibo-btn" onClick={handleCopiarFolio}>
                  <ContentCopyIcon fontSize="small" />
                  Copiar Folio
                </button>
              </div>
            </div>

            {loadingDetalle ? (
              <div className="loading-detalle">
                <div className="spinner"></div>
                <p>Cargando detalles del pago...</p>
              </div>
            ) : (
              (() => {
                const reciboData = getReciboData();
                if (!reciboData) return null;
                return (
                  <div className="recibo-contenido" id="contenido-ticket-imprimir">
                    {/* ... resto del contenido del recibo ... */}
                  </div>
                );
              })()
            )}
           
            {puedeEliminar() && (
              <div className="recibo-eliminar">
                <button 
                  className="btn-eliminar-pago"
                  onClick={() => confirmarEliminar(pagoSeleccionado)}
                >
                  <DeleteIcon fontSize="small" />
                  Eliminar Pago
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL DE CONFIRMACIÓN ELIMINAR */}
      {modalEliminar && pagoSeleccionado && puedeEliminar() && (
        <div className="modal-overlay" onClick={() => setModalEliminar(false)}>
          <div className="modal-confirmar" onClick={(e) => e.stopPropagation()}>
            <div className="modal-icono">⚠️</div>
            <h3>¿Eliminar pago?</h3>
            <p>Estás a punto de eliminar el pago de <strong>{pagoSeleccionado.cliente}</strong></p>
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

export default PagosLista;