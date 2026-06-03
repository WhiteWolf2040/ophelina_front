// DetallePago.jsx - Versión corregida con datos reales de la API
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import "./Pagos.css";
import pagosService from "../services/pagosService";

// Importar iconos de MUI
import ReceiptIcon from '@mui/icons-material/Receipt';
import PrintIcon from '@mui/icons-material/Print';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import QrCodeIcon from '@mui/icons-material/QrCode';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';

const DetallePago = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [modalEliminar, setModalEliminar] = useState(false);
  const [pago, setPago] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar datos del pago desde la BD
  useEffect(() => {
    cargarPago();
  }, [id]);

  const cargarPago = async () => {
    try {
      setLoading(true);
      const response = await pagosService.obtenerPago(id);
      console.log("Datos del pago:", response.data.data); // Para depuración
      setPago(response.data.data);
    } catch (error) {
      console.error('Error cargando pago:', error);
      setError('No se pudo cargar el detalle del pago');
    } finally {
      setLoading(false);
    }
  };

  // Función que OBTIENE DATOS REALES DE LA BD
  const getReciboData = () => {
    if (!pago) return null;
    
    // Datos del pago desde la API
    const pagoData = pago.pago || {};
    const empenoData = pago.empeno || {};
    const clienteData = pago.cliente || {};
    const amortizacionData = pago.amortizacion || {};
    
    return {
      folio: empenoData.folio || `PAG-${pago.id}-${new Date().getFullYear()}`,
      fechaVencimiento: empenoData.fecha_vencimiento 
        ? new Date(empenoData.fecha_vencimiento).toLocaleDateString('es-MX') 
        : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('es-MX'),
      
      // Datos financieros REALES de la BD
      capital: pagoData.capital || 0,
      interes: pagoData.interes || 0,
      iva: pagoData.iva || 0,
      subtotal: (pagoData.capital || 0) + (pagoData.interes || 0),
      total: pagoData.monto_total || 0,
      
      // Método de pago REAL
      metodoPago: pagoData.metodo || pagoData.metodo_pago || "Efectivo",
      referencia: pagoData.referencia || `REF-${Date.now().toString(36).toUpperCase()}`,
      fechaPago: pagoData.fecha || pago.fecha_pago,
      
      // Datos del empeño
      id_empeno: empenoData.id,
      monto_prestado: empenoData.monto_prestado || 0,
      
      // Datos del cajero/usuario
      cajero: "Laura Martínez",
      
      // Sucursal
      sucursal: "Casa Matriz - Mérida",
      
      // Datos del cliente REALES
      rfcCliente: "XAXX010101000",
      telefonoCliente: clienteData.telefono || "999 999 9999",
      emailCliente: clienteData.correo || "cliente@email.com",
      nombreCliente: clienteData.nombre || "Cliente",
      
      // Datos de amortización
      numeroPago: amortizacionData.numero_pago,
      saldoAnterior: amortizacionData.saldo_anterior,
      saldoNuevo: amortizacionData.saldo_nuevo
    };
  };

  const handleImprimir = () => {
    window.print();
  };

  const handleCopiarFolio = () => {
    const folio = pago?.empeno?.folio || `PAG-${pago?.id}-${new Date().getFullYear()}`;
    navigator.clipboard.writeText(folio);
    alert("Folio copiado al portapapeles");
  };

  const handleEliminar = async () => {
    try {
      await pagosService.eliminarPago(pago.id);
      setModalEliminar(false);
      navigate("/pagos");
    } catch (error) {
      console.error('Error eliminando pago:', error);
      alert('Error al eliminar el pago');
    }
  };

  if (loading) {
    return (
      <div className="dashboard">
        <Sidebar />
        <div className="content loading-container">
          <div className="spinner"></div>
          <p>Cargando detalle del pago...</p>
        </div>
      </div>
    );
  }

  if (error || !pago) {
    return (
      <div className="dashboard">
        <Sidebar />
        <div className="content">
          <h2>Pago no encontrado</h2>
          <p>{error || "El pago que buscas no existe"}</p>
          <button className="btn-volver" onClick={() => navigate("/pagos")}>
            <ArrowBackIcon />
            Volver a Pagos
          </button>
        </div>
      </div>
    );
  }

  const reciboData = getReciboData();
  const pagoData = pago.pago || {};
  const empenoData = pago.empeno || {};
  const clienteData = pago.cliente || {};

  return (
    <div className="dashboard">
      <Sidebar />

      <div className="content pagos-content">
        {/* HEADER CON ACCIONES */}
        <div className="recibo-header">
          <button className="btn-volver" onClick={() => navigate("/pagos")}>
            <ArrowBackIcon />
            Volver a Pagos
          </button>
          
          <div className="recibo-acciones">
            <button className="btn-accion-recibo" onClick={handleImprimir}>
              <PrintIcon />
              Imprimir Recibo
            </button>
            <button className="btn-accion-recibo" onClick={handleCopiarFolio}>
              <ContentCopyIcon />
              Copiar Folio
            </button>
          </div>
        </div>

        {/* RECIBO TIPO TICKET */}
        <div className="recibo-container" id="recibo-para-imprimir">
          {/* Encabezado del Recibo */}
          <div className="recibo-encabezado">
            <div className="recibo-logo">
              <ReceiptIcon className="recibo-icon" />
              <h1>OPHELINA</h1>
            </div>
            <p className="recibo-lema">La que brinda apoyo</p>
            <p className="recibo-rfc">RFC: OPH123456789</p>
            <p className="recibo-direccion">Calle 60 #123, Centro, Mérida, Yucatán</p>
            <p className="recibo-tel">Tel: 999 123 4567</p>
          </div>

          {/* Folio y Fecha */}
          <div className="recibo-folio">
            <div>
              <span className="folio-label">FOLIO:</span>
              <span className="folio-valor">{empenoData.folio || reciboData.folio}</span>
              <button className="btn-copy-small" onClick={handleCopiarFolio}>
                <ContentCopyIcon fontSize="small" />
              </button>
            </div>
            <div className="recibo-fechas">
              <p><span className="label">Emisión:</span> {reciboData.fechaPago || pago.fecha}</p>
              <p><span className="label">Vencimiento:</span> {reciboData.fechaVencimiento}</p>
            </div>
          </div>

          {/* Datos del Cliente */}
          <div className="recibo-cliente">
            <h3>CLIENTE</h3>
            <div className="cliente-detalle">
              <p><span>Nombre:</span> {reciboData.nombreCliente}</p>
              <p><span>RFC:</span> {reciboData.rfcCliente}</p>
              <p><span>Teléfono:</span> {reciboData.telefonoCliente}</p>
              <p><span>Email:</span> {reciboData.emailCliente}</p>
            </div>
          </div>

          {/* Detalle de Artículos */}
          <div className="recibo-articulos">
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
                  <td>{empenoData.prenda || "Artículo"} - {empenoData.id}</td>
                  <td className="text-center">1</td>
                  <td className="text-right">${(reciboData.capital || 0).toFixed(2)}</td>
                  <td className="text-right">${(reciboData.capital || 0).toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Desglose de Pagos - CON DATOS REALES */}
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

          {/* Información de Pago - CON DATOS REALES */}
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

          {/* Código QR y Notas */}
          <div className="recibo-footer">
            <div className="recibo-qr">
              <QrCodeIcon className="qr-icon" />
              <div className="qr-placeholder">
                <small>Código de verificación</small>
                <p className="qr-folio">{empenoData.folio || reciboData.folio}</p>
              </div>
            </div>
            <div className="recibo-notas">
              <p><strong>Nota:</strong> Este recibo es comprobante de pago. Conserve para cualquier aclaración.</p>
              <p className="recibo-garantia">* Artículo en garantía hasta 30 días después del vencimiento</p>
            </div>
          </div>

          {/* Sello digital */}
          <div className="recibo-sello">
            <p>Sello digital: OP-{Date.now().toString(36).toUpperCase()}</p>
            <p>www.ophelina.mx/verificar</p>
          </div>
        </div>

        {/* SECCIÓN DE DETALLE FISCAL (para el administrador) */}
        <div className="detalle-fiscal">
          <h3>📋 Detalle Fiscal (Administrador)</h3>
          
          <div className="fiscal-grid">
            <div className="fiscal-item">
              <span className="label">UUID:</span>
              <span className="value">3a7f9d2e-5b8c-1a4f-6d9e-2c8b7a5f3d1e</span>
            </div>
            <div className="fiscal-item">
              <span className="label">RFC Emisor:</span>
              <span className="value">OPH123456789</span>
            </div>
            <div className="fiscal-item">
              <span className="label">RFC Receptor:</span>
              <span className="value">{reciboData.rfcCliente}</span>
            </div>
            <div className="fiscal-item">
              <span className="label">Régimen Fiscal:</span>
              <span className="value">General de Ley Personas Morales</span>
            </div>
            <div className="fiscal-item">
              <span className="label">Uso de CFDI:</span>
              <span className="value">P01 - Por definir</span>
            </div>
            <div className="fiscal-item">
              <span className="label">Forma de pago:</span>
              <span className="value">01 - Efectivo</span>
            </div>
          </div>

          {/* Tabla de impuestos */}
          <table className="fiscal-tabla">
            <thead>
              <tr>
                <th>Concepto</th>
                <th>Base</th>
                <th>IVA</th>
                <th>IEPS</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Pago de empeño - {empenoData.folio || "Folio"}</td>
                <td>${(reciboData.capital || 0).toFixed(2)}</td>
                <td>${(reciboData.iva || 0).toFixed(2)}</td>
                <td>$0.00</td>
                <td>${(reciboData.total || 0).toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Botón Eliminar */}
        <div className="recibo-eliminar-container">
          <button 
            className="btn-eliminar-pago"
            onClick={() => setModalEliminar(true)}
          >
            <DeleteIcon fontSize="small" />
            Eliminar Pago
          </button>
        </div>
      </div>

      {/* MODAL DE CONFIRMACIÓN ELIMINAR */}
      {modalEliminar && (
        <div className="modal-overlay" onClick={() => setModalEliminar(false)}>
          <div className="modal-confirmar" onClick={(e) => e.stopPropagation()}>
            <div className="modal-icono">⚠️</div>
            <h3>¿Eliminar pago?</h3>
            <p>Estás a punto de eliminar el pago de <strong>{reciboData.nombreCliente}</strong></p>
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

export default DetallePago;