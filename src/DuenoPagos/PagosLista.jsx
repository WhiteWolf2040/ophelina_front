// PagosLista.jsx - VERSIÓN FUSIONADA (Docker Base + Características Local)
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
// ✅ AGREGADO DE LOCAL: Icono AddIcon
import AddIcon from '@mui/icons-material/Add';

const PagosLista = () => { 
  const navigate = useNavigate();

  // ✅ AGREGADO DE LOCAL: Verificación de permisos usando el hook usePermissions
  // Nota: Asumiendo que existe el hook usePermissions en tu proyecto Docker
  // Si no existe, puedes usar el sistema de permisos que tengas en Docker
  const [userRole, setUserRole] = useState('');
  
  // ✅ AGREGADO DE LOCAL: Función para verificar permisos basada en roles
  const puedeRegistrarPagos = () => {
    // Si tienes usePermissions, úsalo aquí
    // const { hasPermission } = usePermissions();
    // return hasPermission('registrar_pagos');
    
    // Versión simple basada en roles (ajusta según tu sistema)
    const rolesConPermiso = ['Administrador', 'Dueño', 'Gerente'];
    return rolesConPermiso.includes(userRole);
  };

  // ✅ AGREGADO DE LOCAL: Función para verificar permiso de eliminar
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

  // ✅ AGREGADO DE LOCAL: Cargar rol del usuario
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

  // Cargar pagos al montar el componente
  useEffect(() => {
    cargarPagos();
  }, []);

  const cargarPagos = async () => {
    try {
      setLoading(true);
      const response = await pagosService.obtenerPagos();
      // Asegurarse de que articulo sea un string
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
    // ✅ AGREGADO DE LOCAL: Validación de permiso para eliminar
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

  // Filtrar pagos
  const pagosFiltrados = pagos.filter((pago) => {
    const coincideNombre = pago.cliente
      ?.toLowerCase()
      .includes(busqueda.toLowerCase()) ?? false;

    const coincideFecha = fechaFiltro
      ? pago.fecha === fechaFiltro
      : true;

    return coincideNombre && coincideFecha;
  });

  // Calcular paginación
  const indiceUltimo = paginaActual * pagosPorPagina;
  const indicePrimero = indiceUltimo - pagosPorPagina;
  const pagosActuales = pagosFiltrados.slice(indicePrimero, indiceUltimo);
  const totalPaginas = Math.ceil(pagosFiltrados.length / pagosPorPagina);

  // Función para abrir detalle con datos completos desde la API
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
    // ✅ AGREGADO DE LOCAL: Validación de permiso para eliminar
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

  // Función que OBTIENE DATOS REALES - se ejecuta dentro del modal
  const getReciboData = () => {
    if (!detalleCompleto) {
      // Si no hay detalle completo, usar datos básicos del pago seleccionado
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
    
    // Datos REALES desde la API
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

  // Renderizado condicional
  if (loading) {
    return (
      <div className="dashboard">
    
        <div className="content loading-container">
          <div className="spinner"></div>
          <p>Cargando pagos...</p>
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
        <div className="header-container">
          <div className="tienda-header">
            <h1>
              <PaymentsIcon className="title-icon" /> 
              Listado de pagos 
              <p className="header-sub">Gestiona los pagos realizados</p>
            </h1>
          </div>
          
          {/* ✅ AGREGADO DE LOCAL: Botón Nuevo Pago con permiso */}
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
            <table className="tabla-pagos">
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
                        <div className="acciones-container">
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
                    <div className="recibo-encabezado">
                      <h2>OPHELINA</h2>
                      <p className="recibo-lema">La que brinda apoyo</p>
                      <p className="recibo-rfc">RFC: OPH123456789</p>
                      <p className="recibo-direccion">Calle 60 #123, Centro, Mérida, Yucatán</p>
                      <p className="recibo-tel">Tel: 999 123 4567</p>
                    </div>

                    <div className="recibo-folio-section">
                      <div className="folio-group">
                        <span className="folio-label">FOLIO:</span>
                        <span className="folio-valor">{reciboData.folio}</span>
                        <button className="btn-copy-small" onClick={handleCopiarFolio}>
                          <ContentCopyIcon fontSize="small" />
                        </button>
                      </div>
                      <div className="fechas-group">
                        <p><span className="label">Emisión:</span> {pagoSeleccionado?.fecha || reciboData.fechaPago}</p>
                        <p><span className="label">Vencimiento:</span> {reciboData.fechaVencimiento}</p>
                      </div>
                    </div>

                    <div className="recibo-cliente-section">
                      <h3>CLIENTE</h3>
                      <div className="cliente-grid">
                        <p><span>Nombre:</span> {reciboData.nombreCliente}</p>
                        <p><span>RFC:</span> {reciboData.rfcCliente}</p>
                        <p><span>Teléfono:</span> {reciboData.telefonoCliente}</p>
                        <p><span>Email:</span> {reciboData.emailCliente}</p>
                      </div>
                    </div>

                    <div className="recibo-articulo-section">
                      <h3>DETALLE DEL EMPEÑO</h3>
                      <table className="recibo-tabla">
                        <thead>
                          <tr>
                            <th>Descripción</th>
                            <th>Cant.</th>
                            <th>P.Unitario</th>
                            <th>Importe</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>{reciboData.prendaDescripcion}</td>
                            <td className="text-center">1</td>
                            <td className="text-right">${(reciboData.capital || 0).toFixed(2)}</td>
                            <td className="text-right">${(reciboData.capital || 0).toFixed(2)}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <div className="recibo-desglose">
                      <div className="desglose-fila">
                        <span>Capital:</span>
                        <span>${(reciboData.capital || 0).toFixed(2)}</span>
                      </div>
                      <div className="desglose-fila">
                        <span>Intereses:</span>
                        <span>${(reciboData.interes || 0).toFixed(2)}</span>
                      </div>
                      <div className="desglose-fila">
                        <span>IVA (16% sobre intereses):</span>
                        <span>${(reciboData.iva || 0).toFixed(2)}</span>
                      </div>
                      <div className="desglose-fila subtotal">
                        <span>Subtotal:</span>
                        <span>${(reciboData.subtotal || 0).toFixed(2)}</span>
                      </div>
                      <div className="desglose-fila total">
                        <span>TOTAL PAGADO:</span>
                        <span>${(reciboData.total || 0).toFixed(2)}</span>
                      </div>
                    </div>

                    <div className="recibo-pago-info">
                      <div className="pago-info-item">
                        <span className="label">Método de pago:</span>
                        <span className="valor">{reciboData.metodoPago}</span>
                      </div>
                      <div className="pago-info-item">
                        <span className="label">Referencia:</span>
                        <span className="valor">{reciboData.referencia}</span>
                      </div>
                      <div className="pago-info-item">
                        <span className="label">Atendió:</span>
                        <span className="valor">{reciboData.cajero}</span>
                      </div>
                      <div className="pago-info-item">
                        <span className="label">Sucursal:</span>
                        <span className="valor">{reciboData.sucursal}</span>
                      </div>
                    </div>

                    <div className="recibo-footer-modal">
                      <div className="recibo-qr">
                        <QrCodeIcon className="qr-icon" />
                        <div>
                          <small>Código de verificación</small>
                          <p className="qr-folio">{reciboData.folio}</p>
                        </div>
                      </div>
                      <div className="recibo-notas">
                        <p><strong>Nota:</strong> Este recibo es comprobante de pago.</p>
                        <p className="recibo-garantia">* Artículo en garantía hasta 30 días después del vencimiento</p>
                      </div>
                    </div>

                    <div className="recibo-sello">
                      <p>Sello digital: OP-{Date.now().toString(36).toUpperCase()}</p>
                      <p>www.ophelina.mx/verificar</p>
                    </div>
                  </div>
                );
              })()
            )}
           
            {/* ✅ AGREGADO DE LOCAL: Botón Eliminar Pago con permiso */}
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

      {/* ✅ AGREGADO DE LOCAL: MODAL DE CONFIRMACIÓN ELIMINAR con permiso */}
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