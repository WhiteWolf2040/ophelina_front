// ClienteDetalle.jsx - VERSIÓN CORREGIDA CON API
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import "./Clientes.css";
import React, { useState, useEffect } from "react";
import clientesService from "../services/clientesService";

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
import LockIcon from '@mui/icons-material/Lock';

const ClienteDetalle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [cliente, setCliente] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [eliminando, setEliminando] = useState(false);

  // ✅ CARGAR DATOS DEL CLIENTE DESDE LA API
  useEffect(() => {
    const cargarCliente = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await clientesService.obtenerCliente(id);
        
        console.log('📦 Datos del cliente desde API:', response.data);
        
        // Extraer los datos correctamente
        const clienteData = response.data?.data || response.data || response;
        setCliente(clienteData);
      } catch (error) {
        console.error('Error cargando cliente:', error);
        setError('No se pudo cargar el cliente');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      cargarCliente();
    }
  }, [id]);

  // ✅ FUNCIÓN PARA ELIMINAR
  const handleEliminar = async () => {
    try {
      setEliminando(true);
      await clientesService.eliminarCliente(id);
      navigate("/clientes");
    } catch (error) {
      console.error('Error eliminando cliente:', error);
      alert('Error al eliminar el cliente');
    } finally {
      setEliminando(false);
      setMostrarModal(false);
    }
  };

  // Estado de carga
  if (loading) {
    return (
      <div className="dashboard">
        <Sidebar />
        <div className="content">
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Cargando cliente...</p>
          </div>
        </div>
      </div>
    );
  }

  // Estado de error
  if (error || !cliente) {
    return (
      <div className="dashboard">
        <Sidebar />
        <div className="content">
          <h2>Cliente no encontrado</h2>
          <p style={{ color: '#dc3545' }}>{error || 'El cliente no existe'}</p>
          <button 
            onClick={() => navigate('/clientes')}
            style={{ marginTop: 16, padding: '8px 16px', background: '#1e3a8a', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' }}
          >
            Volver a la lista
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <Sidebar />

      <div className="content">
        {/* HEADER */}
        <div className="detalle-header">
          <h2>{cliente.nombre} {cliente.apellido || ''}</h2>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              className="btn-editar-cliente"
              onClick={() => navigate(`/clientes/editar/${id}`)}
            >
              <EditIcon />
              Editar
            </button>
          </div>
        </div>

        {/* ============================================ */}
        {/* TARJETA DE DATOS PERSONALES */}
        {/* ============================================ */}
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
                <span className="detalle-valor">{cliente.telefono || 'No especificado'}</span>
              </div>
            </div>

            <div className="detalle-item">
              <EmailIcon className="detalle-icon" />
              <div className="detalle-info">
                <span className="detalle-label">Email</span>
                <span className="detalle-valor">{cliente.email || cliente.correo || 'No especificado'}</span>
              </div>
            </div>

            <div className="detalle-item">
              <LocationOnIcon className="detalle-icon" />
              <div className="detalle-info">
                <span className="detalle-label">Dirección</span>
                <span className="detalle-valor">{cliente.direccion || 'No especificada'}</span>
              </div>
            </div>

            <div className="detalle-item">
              <LocationOnIcon className="detalle-icon" />
              <div className="detalle-info">
                <span className="detalle-label">Ciudad</span>
                <span className="detalle-valor">{cliente.ciudad || 'No especificada'}</span>
              </div>
            </div>

            <div className="detalle-item">
              <LocationOnIcon className="detalle-icon" />
              <div className="detalle-info">
                <span className="detalle-label">Código Postal</span>
                <span className="detalle-valor">{cliente.codigoPostal || cliente.codigo_postal || 'No especificado'}</span>
              </div>
            </div>

            <div className="detalle-item">
              <BadgeIcon className="detalle-icon" />
              <div className="detalle-info">
                <span className="detalle-label">Tipo de Identificación</span>
                <span className="detalle-valor">{cliente.tipoIdentificacion || cliente.tipo_identificacion || 'INE'}</span>
              </div>
            </div>

            <div className="detalle-item">
              <AssignmentIndIcon className="detalle-icon" />
              <div className="detalle-info">
                <span className="detalle-label">Número de Identificación</span>
                <span className="detalle-valor">{cliente.numeroIdentificacion || cliente.numero_identificacion || 'No especificado'}</span>
              </div>
            </div>

            <div className="detalle-item">
              <CalendarTodayIcon className="detalle-icon" />
              <div className="detalle-info">
                <span className="detalle-label">Fecha de Registro</span>
                <span className="detalle-valor">{cliente.fecha || cliente.fecha_registro || 'No especificada'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* ============================================ */}
        {/* HISTORIAL DE EMPEÑOS */}
        {/* ============================================ */}
        <div className="detalle-card">
          <h3>
            <HistoryIcon />
            Historial de Empeños ({cliente.empenos?.length || 0})
          </h3>
          
          {cliente.empenos && cliente.empenos.length > 0 ? (
            <div className="lista-empenos">
              {cliente.empenos.map((empeno) => (
                <div key={empeno.id_empeno} className="item-empeno">
                  <div className="empeno-header">
                    <span className="empeno-fecha">{empeno.fecha_empeno}</span>
                    <span className="empeno-monto">${empeno.monto?.toLocaleString()}</span>
                  </div>
                  <div className="empeno-detalle">
                    <span>Estado: <strong>{empeno.estado}</strong></span>
                    <span>Pagos: {empeno.pagos?.length || 0}</span>
                  </div>
                  {empeno.pagos && empeno.pagos.length > 0 && (
                    <div className="empeno-pagos">
                      {empeno.pagos.map((pago) => (
                        <div key={pago.id_pago} className="pago-item">
                          <span>{pago.fecha_pago}</span>
                          <span>${pago.monto?.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="sin-registros">
              <p>No hay empeños registrados para este cliente</p>
            </div>
          )}
        </div>

        {/* ============================================ */}
        {/* PAGOS REALIZADOS */}
        {/* ============================================ */}
        <div className="detalle-card">
          <h3>
            <PaymentIcon />
            Pagos Realizados ({cliente.pagos?.length || 0})
          </h3>
          
          {cliente.pagos && cliente.pagos.length > 0 ? (
            <div className="lista-pagos">
              {cliente.pagos.map((pago) => (
                <div key={pago.id_pago} className="pago-item-detalle">
                  <span>{pago.fecha_pago}</span>
                  <span className="pago-monto">${pago.monto?.toLocaleString()}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="sin-registros">
              <p>No hay pagos registrados para este cliente</p>
            </div>
          )}
        </div>

        {/* ============================================ */}
        {/* BOTÓN ELIMINAR */}
        {/* ============================================ */}
        <div className="detalle-acciones">
          <button
            className="btn-eliminar-cliente"
            onClick={() => setMostrarModal(true)}
            disabled={eliminando}
          >
            <DeleteIcon />
            {eliminando ? 'Eliminando...' : 'Eliminar Cliente'}
          </button>
        </div>
      </div>

      {/* ============================================ */}
      {/* MODAL DE CONFIRMACIÓN */}
      {/* ============================================ */}
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
                onClick={handleEliminar}
                disabled={eliminando}
              >
                <DeleteIcon />
                {eliminando ? 'Eliminando...' : 'Sí, eliminar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClienteDetalle;