import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import "./Pagos.css";

const DetallePago = ({ pagos }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const pago = pagos.find((p) => p.id === parseInt(id));

  if (!pago) {
    return (
      <div className="dashboard">
        <Sidebar />
        <div className="content">
          <h2>Pago no encontrado</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <Sidebar />

      <div className="content">
        {/* HEADER */}
        <div className="top-header">
          <div className="pagos-title">
            <h2>{pago.cliente}</h2>
          </div>
        </div>

        {/* CARD INFO PAGO */}
        <div className="table-card detail-card">
          <h3>Información del Pago</h3>

          <div className="detail-grid">
            <div>
              <p className="label">Monto</p>
              <p className="value">${pago.monto}</p>
            </div>

            <div>
              <p className="label">Tipo de pago</p>
              <p className="value">{pago.tipo}</p>
            </div>

            <div>
              <p className="label">Metodo de pago</p>
              <p className="value">{pago.metodo || "Efectivo"}</p>
            </div>

            <div>
              <p className="label">Fecha de Pago</p>
              <p className="value">{pago.fecha}</p>
            </div>
          </div>
        </div>

        {/* CARD INFO EMPEÑO */}
        <div className="table-card detail-card">
          <h3>Información del Empeño</h3>

          <div className="detail-grid">
            <div>
              <p className="label">Prenda</p>
              <p className="value">{pago.articulo}</p>
            </div>

            <div>
              <p className="label">Monto de Empeño</p>
              <p className="value">$9000</p>
            </div>

            <div>
              <p className="label">Estado</p>
              <p className="value">Activo</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetallePago;