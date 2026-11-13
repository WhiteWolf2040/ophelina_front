// MisTicketDetalle.jsx - versión cliente del ticket de pago
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "../ClientesNav/Navbar";
import TicketRecibo, { parseAmount, imprimirTicket } from "./TicketRecibo";
import "../DuenoPagos/Pagos.css"; // layout: dashboard, content, btn-volver, spinner

import PrintIcon from "@mui/icons-material/Print";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
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
        setError(response.message || "No se pudo cargar el ticket");
      }
    } catch (err) {
      console.error("Error cargando ticket:", err);
      setError(err.response?.data?.message || "No se pudo cargar el detalle del ticket");
    } finally {
      setLoading(false);
    }
  };

  const getReciboData = () => {
    if (!ticket) return null;

    const p = ticket.pago || {};
    const e = ticket.empeno || {};
    const c = ticket.cliente || {};
    const emp = ticket.empresa || {};

    const capital = parseAmount(p.capital);
    const interes = parseAmount(p.interes);
    const iva = parseAmount(p.iva);

    return {
      nombreEmpresa: emp.nombre || "Ophelina",
      rfcEmpresa: emp.rfc,
      direccionEmpresa: emp.direccion,
      telefonoEmpresa: emp.telefono,

      folio: e.folio || `PAG-${ticket.id}-${new Date().getFullYear()}`,
      empenoId: e.id ?? ticket.id,
      fechaPago: p.fecha || ticket.fecha_pago,
      fechaVencimiento: e.fecha_vencimiento
        ? new Date(e.fecha_vencimiento).toLocaleDateString("es-MX")
        : "N/A",

      nombreCliente: c.nombre,
      articulo: e.prenda?.descripcion || "Artículo",
      concepto: p.tipo || "Abono",

      capital,
      interes,
      iva,
      total: parseAmount(p.monto_total) || capital + interes + iva,

      metodoPago: p.metodo || "Efectivo",
      referencia: p.referencia || "N/A",
    };
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
            <button className="btn-accion-recibo" onClick={imprimirTicket}>
              <PrintIcon />
              Imprimir Recibo
            </button>
            <button className="btn-accion-recibo" onClick={handleCopiarFolio}>
              <ContentCopyIcon />
              Copiar Folio
            </button>
          </div>
        </div>

        <TicketRecibo data={reciboData} />
      </div>
    </div>
  );
};

export default MisTicketDetalle;