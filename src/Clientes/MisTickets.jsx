// MisTickets.jsx - historial de tickets (pagos) del cliente
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../ClientesNav/Navbar";
import "./MisTickets.css";
import ticketsService from "../services/ticketsService";

export default function MisTickets() {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    cargarTickets();
  }, []);

  const cargarTickets = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await ticketsService.listar();
      if (response.success) {
        setTickets(response.data || []);
      } else {
        setError(response.message || 'No se pudieron cargar tus tickets');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'No se pudieron cargar tus tickets');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="mt-dashboard">
        <section className="mt-page-header">
          <h1 className="mt-page-title">Mis tickets (historial de pagos)</h1>
          <p className="mt-page-subtitle">
            Muestra cualquiera de estos tickets al recoger tu artículo, como comprobante de pago.
          </p>
        </section>

        {loading && <p className="mt-sin-resultados">Cargando tus tickets...</p>}

        {error && !loading && (
          <div className="mt-sin-resultados">
            <p>{error}</p>
            <button onClick={cargarTickets}>Reintentar</button>
          </div>
        )}

        {!loading && !error && (
          <section className="mt-ticket-list">
            {tickets.length > 0 ? (
              tickets.map((ticket) => (
                <button
                  key={ticket.id}
                  className="mt-ticket-card"
                  onClick={() => navigate(`/mistickets/${ticket.id}`)}
                >
                  <div className="mt-ticket-info">
                    <span className="mt-ticket-folio">{ticket.folio_empeno}</span>
                    <span className="mt-ticket-articulo">{ticket.articulo}</span>
                    <span className="mt-ticket-casa">{ticket.casaEmpeño}</span>
                  </div>
                  <div className="mt-ticket-meta">
                    <span className="mt-ticket-tipo">{ticket.tipo}</span>
                    <span className="mt-ticket-fecha">{ticket.fecha}</span>
                    <span className="mt-ticket-monto">{ticket.monto}</span>
                  </div>
                </button>
              ))
            ) : (
              <p className="mt-sin-resultados">Aún no tienes pagos registrados.</p>
            )}
          </section>
        )}
      </div>
    </>
  );
}