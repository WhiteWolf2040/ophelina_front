// MisTicketDetalle.jsx - versión cliente de DetallePago.jsx
// Reusa las mismas clases CSS de Pagos.css (recibo-*) para que el ticket se
// vea IGUAL que el del admin. Diferencias respecto al original:
//   - Sin botón "Eliminar Pago" ni su modal de confirmación (acción admin-only)
//   - Nombre de la casa de empeño dinámico (data.empresa.nombre), no "OPHELINA" fijo
//   - Fetch a /mistickets/{id} en vez de /pagos/{id}
//   - Navegación de "Volver" apunta a /mistickets en vez de /pagos
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "../ClientesNav/Navbar";
import "./Pagos.css"; // mismas clases recibo-* que usa el admin

import ReceiptIcon from '@mui/icons-material/Receipt';
import PrintIcon from '@mui/icons-material/Print';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import QrCodeIcon from '@mui/icons-material/QrCode';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ticketsService from "../services/ticketsService";

const MisTicketDetalle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    cargarTicket();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const cargarTicket = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await ticketsService.obtener(id);
      if (response.success) {
        setTicket(response.data);
      } else {
        setError(response.message || 'No se pudo cargar el ticket');
      }
    } catch (err) {
      console.error('Error cargando ticket:', err);
      setError(err.response?.data?.message || 'No se pudo cargar el detalle del ticket');
    } finally {
      setLoading(false);
    }
  };

  const getReciboData = () => {
    if (!ticket) return null;

    const pagoData = ticket.pago || {};
    const empenoData = ticket.empeno || {};
    const clienteData = ticket.cliente || {};
    const empresaData = ticket.empresa || {};

    return {
      folio: empenoData.folio || `PAG-${ticket.id}-${new Date().getFullYear()}`,
      fechaVencimiento: empenoData.fecha_vencimiento
        ? new Date(empenoData.fecha_vencimiento).toLocaleDateString('es-MX')
        : 'N/A',

      capital: pagoData.capital || 0,
      interes: pagoData.interes || 0,
      iva: pagoData.iva || 0,
      subtotal: (pagoData.capital || 0) + (pagoData.interes || 0),
      total: pagoData.monto_total || 0,

      metodoPago: pagoData.metodo || "Efectivo",
      referencia: pagoData.referencia || 'N/A',
      fechaPago: pagoData.fecha || ticket.fecha_pago,

      articulo: empenoData.prenda?.descripcion || 'Artículo',

      nombreCliente: clienteData.nombre || 'Cliente',
      telefonoCliente: clienteData.telefono || 'N/A',
      emailCliente: clienteData.correo || 'N/A',

      // Dinámico, ya no está fijo a "OPHELINA"
      nombreEmpresa: empresaData.nombre || 'Ophelina',
      rfcEmpresa: empresaData.rfc,
      direccionEmpresa: empresaData.direccion,
      telefonoEmpresa: empresaData.telefono,
    };
  };

  const handleImprimir = () => {
    window.print();
  };

  const handleCopiarFolio = () => {
    const folio = ticket?.empeno?.folio || `PAG-${ticket?.id}`;
    navigator.clipboard.writeText(folio);
    alert("Folio copiado al portapapeles");
  };

  if (loading) {
    return (
      <div className="dashboard">
        <Navbar />
        <div className="content loading-container">
          <div className="spinner"></div>
          <p>Cargando tu ticket...</p>
        </div>
      </div>
    );
  }

  if (error || !ticket) {
    return (
      <div className="dashboard">
        <Navbar />
        <div className="content">
          <h2>Ticket no encontrado</h2>
          <p>{error || "El ticket que buscas no existe"}</p>
          <button className="btn-volver" onClick={() => navigate("/mistickets")}>
            <ArrowBackIcon />
            Volver a mis tickets
          </button>
        </div>
      </div>
    );
  }

  const reciboData = getReciboData();
  const empenoData = ticket.empeno || {};

  return (
    <div className="dashboard">
      <Navbar />

      <div className="content pagos-content">
        <div className="recibo-header">
          <button className="btn-volver" onClick={() => navigate("/mistickets")}>
            <ArrowBackIcon />
            Volver a mis tickets
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

        <div className="recibo-container" id="recibo-para-imprimir">
          <div className="recibo-encabezado">
            <div className="recibo-logo">
              <ReceiptIcon className="recibo-icon" />
              {/* ✅ Nombre dinámico de la casa de empeño */}
              <h1>{reciboData.nombreEmpresa.toUpperCase()}</h1>
            </div>
            {reciboData.rfcEmpresa && (
              <p className="recibo-rfc">RFC: {reciboData.rfcEmpresa}</p>
            )}
            {reciboData.direccionEmpresa && (
              <p className="recibo-direccion">{reciboData.direccionEmpresa}</p>
            )}
            {reciboData.telefonoEmpresa && (
              <p className="recibo-tel">Tel: {reciboData.telefonoEmpresa}</p>
            )}
          </div>

          <div className="recibo-folio">
            <div>
              <span className="folio-label">FOLIO:</span>
              <span className="folio-valor">{reciboData.folio}</span>
              <button className="btn-copy-small" onClick={handleCopiarFolio}>
                <ContentCopyIcon fontSize="small" />
              </button>
            </div>
            <div className="recibo-fechas">
              <p><span className="label">Emisión:</span> {reciboData.fechaPago}</p>
              <p><span className="label">Vencimiento:</span> {reciboData.fechaVencimiento}</p>
            </div>
          </div>

          <div className="recibo-cliente">
            <h3>CLIENTE</h3>
            <div className="cliente-detalle">
              <p><span>Nombre:</span> {reciboData.nombreCliente}</p>
              <p><span>Teléfono:</span> {reciboData.telefonoCliente}</p>
              <p><span>Email:</span> {reciboData.emailCliente}</p>
            </div>
          </div>

          <div className="recibo-articulos">
            <h3>DETALLE DEL EMPEÑO</h3>
            <table className="recibo-tabla">
              <thead>
                <tr>
                  <th>Descripción</th>
                  <th>Cant.</th>
                  <th>Importe</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{reciboData.articulo}</td>
                  <td className="text-center">1</td>
                  <td className="text-right">${reciboData.capital.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="recibo-desglose">
            <div className="desglose-fila">
              <span>Capital:</span>
              <span>${reciboData.capital.toFixed(2)}</span>
            </div>
            <div className="desglose-fila">
              <span>Intereses:</span>
              <span>${reciboData.interes.toFixed(2)}</span>
            </div>
            <div className="desglose-fila">
              <span>IVA (16% sobre intereses):</span>
              <span>${reciboData.iva.toFixed(2)}</span>
            </div>
            <div className="desglose-fila subtotal">
              <span>Subtotal:</span>
              <span>${reciboData.subtotal.toFixed(2)}</span>
            </div>
            <div className="desglose-fila total">
              <span>TOTAL PAGADO:</span>
              <span>${reciboData.total.toFixed(2)}</span>
            </div>
          </div>

          <div className="recibo-pago-info">
            <div className="pago-info-item">
              <span className="label">Método de pago:</span>
              <span className="valor">{reciboData.metodoPago}</span>
            </div>
            <div className="pago-info-item">
              <span className="label">Referencia:</span>
              <span className="valor valor-referencia">{reciboData.referencia}</span>
            </div>
          </div>

          <div className="recibo-footer">
            <div className="recibo-qr">
              <QrCodeIcon className="qr-icon" />
              <div className="qr-placeholder">
                <small>Código de verificación</small>
                <p className="qr-folio">{reciboData.folio}</p>
              </div>
            </div>
            <div className="recibo-notas">
              <p><strong>Nota:</strong> Este recibo es comprobante de pago. Muéstralo al recoger tu artículo.</p>
              <p className="recibo-garantia">* Artículo en garantía hasta 30 días después del vencimiento</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MisTicketDetalle;