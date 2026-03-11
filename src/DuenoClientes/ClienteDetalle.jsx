import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import "./Clientes.css";
import React, { useState } from "react";

// Importar iconos de MUI
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import BadgeIcon from '@mui/icons-material/Badge';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import HistoryIcon from '@mui/icons-material/History';
import PaymentIcon from '@mui/icons-material/Payment';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import WarningIcon from '@mui/icons-material/Warning';
import CloseIcon from '@mui/icons-material/Close';

const ClienteDetalle = ({ clientes, eliminarCliente }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const cliente = clientes.find((c) => c.id === parseInt(id));
  const [mostrarModal, setMostrarModal] = useState(false);

  if (!cliente) {
    return (
      <div className="dashboard">
        <Sidebar />
        <div className="content">
          <h2>Cliente no encontrado</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <Sidebar />

      <div className="content">
        <div className="detalle-header">
          <h2>{cliente.nombre}</h2>
          <button
            className="btn-editar-cliente"
            onClick={() => navigate(`/clientes/editar/${cliente.id}`)}
          >
            <EditIcon />
            Editar
          </button>
        </div>

        {/* Tarjeta de Datos Personales con todos los campos */}
        <div className="detalle-card">
          <h3>
            <BadgeIcon />
            Datos Personales
          </h3>
          
          <div className="detalle-grid">
            <div className="detalle-item">
              <PhoneIcon className="detalle-icon" />
              <div className="detalle-info">
                <span className="detalle-label">Teléfono</span>
                <span className="detalle-valor">{cliente.telefono}</span>
              </div>
            </div>

            <div className="detalle-item">
              <EmailIcon className="detalle-icon" />
              <div className="detalle-info">
                <span className="detalle-label">Email</span>
                <span className="detalle-valor">{cliente.email}</span>
              </div>
            </div>

            <div className="detalle-item">
              <LocationOnIcon className="detalle-icon" />
              <div className="detalle-info">
                <span className="detalle-label">Dirección</span>
                <span className="detalle-valor">{cliente.direccion}</span>
              </div>
            </div>

            <div className="detalle-item">
              <LocationOnIcon className="detalle-icon" />
              <div className="detalle-info">
                <span className="detalle-label">Colonia</span>
                <span className="detalle-valor">{cliente.colonia || "No especificada"}</span>
              </div>
            </div>

            <div className="detalle-item">
              <LocationOnIcon className="detalle-icon" />
              <div className="detalle-info">
                <span className="detalle-label">Ciudad</span>
                <span className="detalle-valor">{cliente.ciudad || "No especificada"}</span>
              </div>
            </div>

            <div className="detalle-item">
              <LocationOnIcon className="detalle-icon" />
              <div className="detalle-info">
                <span className="detalle-label">Código Postal</span>
                <span className="detalle-valor">{cliente.codigoPostal || "No especificado"}</span>
              </div>
            </div>

            <div className="detalle-item">
              <BadgeIcon className="detalle-icon" />
              <div className="detalle-info">
                <span className="detalle-label">Tipo de Identificación</span>
                <span className="detalle-valor">{cliente.tipoIdentificacion || "INE"}</span>
              </div>
            </div>

            <div className="detalle-item">
              <AssignmentIndIcon className="detalle-icon" />
              <div className="detalle-info">
                <span className="detalle-label">Número de Identificación</span>
                <span className="detalle-valor">{cliente.numeroIdentificacion || "No especificado"}</span>
              </div>
            </div>

            <div className="detalle-item">
              <CalendarTodayIcon className="detalle-icon" />
              <div className="detalle-info">
                <span className="detalle-label">Fecha de Registro</span>
                <span className="detalle-valor">{cliente.fecha}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Historial de Empeños */}
        <div className="detalle-card">
          <h3>
            <HistoryIcon />
            Historial de Empeños
          </h3>
          <div className="sin-registros">
            <p>No hay empeños registrados para este cliente</p>
          </div>
        </div>

        {/* Pagos Realizados */}
        <div className="detalle-card">
          <h3>
            <PaymentIcon />
            Pagos Realizados
          </h3>
          <div className="sin-registros">
            <p>No hay pagos registrados para este cliente</p>
          </div>
        </div>

        {/* Botón Eliminar */}
        <div className="detalle-acciones">
          <button
            className="btn-eliminar-cliente"
            onClick={() => setMostrarModal(true)}
          >
            <DeleteIcon />
            Eliminar Cliente
          </button>
        </div>
      </div>

      {/* Modal de Confirmación */}
      {mostrarModal && (
        <div className="modal-overlay" onClick={() => setMostrarModal(false)}>
          <div className="modal-confirmar" onClick={(e) => e.stopPropagation()}>
            <div className="modal-icono">
              <WarningIcon />
            </div>
            <h3>Confirmar Eliminación</h3>
            <p>¿Estás seguro de que deseas eliminar a <strong>{cliente.nombre}</strong>?</p>
            <p className="advertencia">Esta acción no se puede deshacer</p>

            <div className="modal-botones">
              <button
                className="btn-cancelar-modal"
                onClick={() => setMostrarModal(false)}
              >
                <CloseIcon />
                Cancelar
              </button>

              <button
                className="btn-confirmar-eliminar"
                onClick={() => {
                  eliminarCliente(cliente.id);
                  navigate("/clientes");
                }}
              >
                <DeleteIcon />
                Sí, eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClienteDetalle;