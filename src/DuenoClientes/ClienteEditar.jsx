// ClienteEditar.jsx - VERSIÓN CORREGIDA CON API
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import "./Clientes.css";
import clientesService from "../services/clientesService";

const ClienteEditar = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState(null);
  
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    telefono: "",
    correo: "",
    direccion: "",
    ciudad: "",
    codigo_postal: "",
    tipo_identificacion: "INE",
    numero_identificacion: ""
  });

  // ✅ CARGAR DATOS DEL CLIENTE
  useEffect(() => {
    const cargarCliente = async () => {
      try {
        setLoading(true);
        const response = await clientesService.obtenerCliente(id);
        const clienteData = response.data?.data || response.data || response;
        
        setForm({
          nombre: clienteData.nombre || "",
          apellido: clienteData.apellido || "",
          telefono: clienteData.telefono || "",
          correo: clienteData.email || clienteData.correo || "",
          direccion: clienteData.direccion || "",
          ciudad: clienteData.ciudad || "",
          codigo_postal: clienteData.codigoPostal || clienteData.codigo_postal || "",
          tipo_identificacion: clienteData.tipoIdentificacion || clienteData.tipo_identificacion || "INE",
          numero_identificacion: clienteData.numeroIdentificacion || clienteData.numero_identificacion || ""
        });
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

  // ✅ GUARDAR CAMBIOS
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setGuardando(true);
      setError(null);
      
      // Preparar datos para enviar
      const datosEnviar = {
        nombre: form.nombre,
        apellido: form.apellido,
        telefono: form.telefono,
        correo: form.correo,
        direccion: form.direccion,
        ciudad: form.ciudad,
        codigo_postal: form.codigo_postal,
        tipo_identificacion: form.tipo_identificacion,
        numero_identificacion: form.numero_identificacion
      };
      
      await clientesService.actualizarCliente(id, datosEnviar);
      navigate(`/clientes/${id}`);
    } catch (error) {
      console.error('Error guardando cliente:', error);
      setError('Error al guardar los cambios');
    } finally {
      setGuardando(false);
    }
  };

  // Estado de carga
  if (loading) {
    return (
      <div className="dashboard">
      
        <div className="content">
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Cargando cliente...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">


      <div className="content">
        <div className="top-header">
          <h2>Editar Cliente</h2>
        </div>

        {error && (
          <div style={{ padding: '12px', background: '#f8d7da', color: '#721c24', borderRadius: '6px', marginBottom: '16px' }}>
            {error}
          </div>
        )}

        <div className="table-card">
          <form onSubmit={handleSubmit} className="form-grid-editar">
            <div className="form-group">
              <label>Nombre *</label>
              <input
                value={form.nombre}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                placeholder="Nombre"
                required
              />
            </div>

            <div className="form-group">
              <label>Apellido</label>
              <input
                value={form.apellido}
                onChange={(e) => setForm({ ...form, apellido: e.target.value })}
                placeholder="Apellido"
              />
            </div>

            <div className="form-group">
              <label>Teléfono *</label>
              <input
                value={form.telefono}
                onChange={(e) => setForm({ ...form, telefono: e.target.value })}
                placeholder="Teléfono"
                required
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={form.correo}
                onChange={(e) => setForm({ ...form, correo: e.target.value })}
                placeholder="Email"
              />
            </div>

            <div className="form-group full-width">
              <label>Dirección</label>
              <input
                value={form.direccion}
                onChange={(e) => setForm({ ...form, direccion: e.target.value })}
                placeholder="Dirección"
              />
            </div>

            <div className="form-group">
              <label>Ciudad</label>
              <input
                value={form.ciudad}
                onChange={(e) => setForm({ ...form, ciudad: e.target.value })}
                placeholder="Ciudad"
              />
            </div>

            <div className="form-group">
              <label>Código Postal</label>
              <input
                value={form.codigo_postal}
                onChange={(e) => setForm({ ...form, codigo_postal: e.target.value })}
                placeholder="Código Postal"
              />
            </div>

            <div className="form-group">
              <label>Tipo de Identificación</label>
              <select
                value={form.tipo_identificacion}
                onChange={(e) => setForm({ ...form, tipo_identificacion: e.target.value })}
              >
                <option value="INE">INE</option>
                <option value="Pasaporte">Pasaporte</option>
                <option value="Cédula Profesional">Cédula Profesional</option>
                <option value="Licencia">Licencia</option>
                <option value="Otro">Otro</option>
              </select>
            </div>

            <div className="form-group">
              <label>Número de Identificación</label>
              <input
                value={form.numero_identificacion}
                onChange={(e) => setForm({ ...form, numero_identificacion: e.target.value })}
                placeholder="Número de identificación"
              />
            </div>

            <div className="form-buttons full-width">
              <button 
                type="submit" 
                className="btn-gold"
                disabled={guardando}
              >
                {guardando ? 'Guardando...' : 'Guardar Cambios'}
              </button>

              <button
                type="button"
                className="btn-cancel"
                onClick={() => navigate(-1)}
                disabled={guardando}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ClienteEditar;