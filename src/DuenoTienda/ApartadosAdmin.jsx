import React, { useState, useEffect } from "react";
import StorefrontIcon from '@mui/icons-material/Storefront';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';
import LockIcon from '@mui/icons-material/Lock';
import ApartadosAdminService from '../services/ApartadosAdminService';

const ApartadosAdmin = () => {
  const [apartados, setApartados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [codigoInputs, setCodigoInputs] = useState({}); // { id_apartado: "texto tecleado" }
  const [procesando, setProcesando] = useState(null);
  const [mensajeError, setMensajeError] = useState({}); // { id_apartado: "mensaje" }

  const cargarApartados = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await ApartadosAdminService.getApartados();
      if (data.success) {
        setApartados(data.data);
      } else {
        setError(data.message || "No se pudieron cargar los apartados");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Error al conectar con el servidor");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarApartados();
  }, []);

  const handleCodigoChange = (idApartado, valor) => {
    setCodigoInputs(prev => ({ ...prev, [idApartado]: valor.toUpperCase() }));
    setMensajeError(prev => ({ ...prev, [idApartado]: null }));
  };

  const handleConfirmarEntrega = async (idApartado) => {
    const codigo = (codigoInputs[idApartado] || "").trim();

    if (!codigo) {
      setMensajeError(prev => ({ ...prev, [idApartado]: "Ingresa el código que te dio el cliente" }));
      return;
    }

    try {
      setProcesando(idApartado);
      const result = await ApartadosAdminService.marcarEntregado(idApartado, codigo);

      if (result.success) {
        await cargarApartados();
        setCodigoInputs(prev => ({ ...prev, [idApartado]: "" }));
      } else {
        setMensajeError(prev => ({ ...prev, [idApartado]: result.message }));
      }
    } catch (err) {
      setMensajeError(prev => ({
        ...prev,
        [idApartado]: err.response?.data?.message || "Error al confirmar la entrega"
      }));
    } finally {
      setProcesando(null);
    }
  };

  const pendientes = apartados.filter(a => !a.entregado);
  const entregados = apartados.filter(a => a.entregado);

  if (loading) {
    return (
      <div className="dashboard">
        <div className="content" style={{ textAlign: 'center', paddingTop: '60px' }}>
          <p>Cargando apartados...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="content">
        <div>
          <h1>
            <StorefrontIcon className="title-icon" />
            Apartados de la tienda
          </h1>
          <p className="header-sub">
            Confirma la entrega con el código que el cliente muestra en su app
          </p>
        </div>

        {error && (
          <div style={{ color: 'red', textAlign: 'center', padding: '20px' }}>
            {error}
            <button onClick={cargarApartados} style={{ display: 'block', margin: '10px auto' }}>
              Reintentar
            </button>
          </div>
        )}

        {/* PENDIENTES DE ENTREGAR */}
        <div className="tabla-card" style={{ marginTop: '20px' }}>
          <h3>
            <PendingIcon fontSize="small" style={{ verticalAlign: 'middle', marginRight: '6px', color: '#f59e0b' }} />
            Pendientes de entregar ({pendientes.length})
          </h3>

          {pendientes.length === 0 ? (
            <p style={{ padding: '20px', color: '#999' }}>No hay apartados pendientes de entrega.</p>
          ) : (
            pendientes.map((a) => (
              <div
                key={a.id_apartado}
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '14px',
                  borderBottom: '1px solid #eee'
                }}
              >
                <div style={{ flex: '1 1 220px' }}>
                  <strong>{a.producto}</strong>
                  <div style={{ fontSize: '13px', color: '#666' }}>
                    Cliente: {a.cliente} · Anticipo: {a.monto_anticipo} · Apartado el {a.fecha_apartado}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <LockIcon fontSize="small" style={{ color: '#999' }} />
                  <input
                    type="text"
                    placeholder="Código del cliente"
                    value={codigoInputs[a.id_apartado] || ""}
                    onChange={(e) => handleCodigoChange(a.id_apartado, e.target.value)}
                    maxLength={10}
                    style={{
                      textTransform: 'uppercase',
                      letterSpacing: '2px',
                      padding: '8px 10px',
                      borderRadius: '6px',
                      border: '1px solid #ccc',
                      width: '150px'
                    }}
                  />
                  <button
                    className="btn-gold"
                    onClick={() => handleConfirmarEntrega(a.id_apartado)}
                    disabled={procesando === a.id_apartado}
                  >
                    {procesando === a.id_apartado ? "Verificando..." : "Confirmar entrega"}
                  </button>
                </div>

                {mensajeError[a.id_apartado] && (
                  <div style={{ width: '100%', color: '#c0392b', fontSize: '13px' }}>
                    {mensajeError[a.id_apartado]}
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* YA ENTREGADOS */}
        <div className="tabla-card" style={{ marginTop: '20px' }}>
          <h3>
            <CheckCircleIcon fontSize="small" style={{ verticalAlign: 'middle', marginRight: '6px', color: '#27ae60' }} />
            Ya entregados ({entregados.length})
          </h3>

          {entregados.length === 0 ? (
            <p style={{ padding: '20px', color: '#999' }}>Todavía no hay entregas confirmadas.</p>
          ) : (
            entregados.map((a) => (
              <div
                key={a.id_apartado}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '14px',
                  borderBottom: '1px solid #eee',
                  color: '#666'
                }}
              >
                <div>
                  <strong>{a.producto}</strong>
                  <div style={{ fontSize: '13px' }}>Cliente: {a.cliente}</div>
                </div>
                <div style={{ fontSize: '13px', textAlign: 'right' }}>
                  <span style={{ color: '#27ae60', fontWeight: 'bold' }}>✓ Entregado</span>
                  <div>{a.fecha_entrega}</div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ApartadosAdmin;