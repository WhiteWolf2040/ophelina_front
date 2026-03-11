import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";

const DetalleEmpeno = ({ empenos }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const empeno = empenos.find((e) => e.id === parseInt(id));

  if (!empeno) return <h2>No encontrado</h2>;

  return (
    <div className="dashboard">
      <Sidebar />

      <div className="content">
        <div className="pagos-title">
          
          <h2>{empeno.cliente}</h2>
        </div>

        <div className="table-card detail-card">
          <h3>Información del Empeño</h3>

          <div className="detail-grid">
            <div>
              <p className="label">Objeto</p>
              <p className="value">{empeno.objeto}</p>
            </div>

            <div>
              <p className="label">Monto</p>
              <p className="value">${empeno.monto}</p>
            </div>

            <div>
              <p className="label">Interés</p>
              <p className="value">{empeno.interes}%</p>
            </div>

            <div>
              <p className="label">Vencimiento</p>
              <p className="value">{empeno.vencimiento}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetalleEmpeno;