import React, { useState, useEffect } from "react";
import StorefrontIcon from '@mui/icons-material/Storefront';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';
import LockIcon from '@mui/icons-material/Lock';
import SearchIcon from '@mui/icons-material/Search';
import PaymentsIcon from '@mui/icons-material/Payments';
import ApartadosAdminService from '../services/ApartadosAdminService';

const ApartadosAdmin = () => {
  const [apartados, setApartados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [codigoInputs, setCodigoInputs] = useState({});
  // SCRUM-357: monto y método de pago que el cajero confirma al entregar
  const [montoInputs, setMontoInputs] = useState({});
  const [metodoInputs, setMetodoInputs] = useState({});
  const [procesando, setProcesando] = useState(null);
  const [mensajeError, setMensajeError] = useState({});

  // SCRUM-355: búsqueda
  const [busqueda, setBusqueda] = useState("");

  const cargarApartados = async (terminoBusqueda = busqueda) => {
    try {
      setLoading(true);
      setError(null);
      const data = await ApartadosAdminService.getApartados(terminoBusqueda);
      if (data.success) {
        setApartados(data.data);
        // Precargar el input de monto con el pendiente calculado de cada uno
        const montosIniciales = {};
        data.data.forEach((a) => {
          montosIniciales[a.id_apartado] = a.monto_pendiente_numerico;
        });
        setMontoInputs((prev) => ({ ...montosIniciales, ...prev }));
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
    cargarApartados("");
  }, []);

  // Búsqueda con pequeño debounce para no disparar una petición por cada tecla
  useEffect(() => {
    const timeout = setTimeout(() => {
      cargarApartados(busqueda);
    }, 400);
    return () => clearTimeout(timeout);
  }, [busqueda]);

  const handleCodigoChange = (idApartado, valor) => {
    setCodigoInputs(prev => ({ ...prev, [idApartado]: valor.toUpperCase() }));
    setMensajeError(prev => ({ ...prev, [idApartado]: null }));
  };

  const handleMontoChange = (idApartado, valor) => {
    setMontoInputs(prev => ({ ...prev, [idApartado]: valor }));
  };

  const handleMetodoChange = (idApartado, valor) => {
    setMetodoInputs(prev => ({ ...prev, [idApartado]: valor }));
  };

  const handleConfirmarEntrega = async (idApartado) => {
    const codigo = (codigoInputs[idApartado] || "").trim();

    if (!codigo) {
      setMensajeError(prev => ({ ...prev, [idApartado]: "Ingresa el código que te dio el cliente" }));
      return;
    }

    const montoPagado = montoInputs[idApartado];
    const metodoPago = metodoInputs[idApartado] || "efectivo";

    try {
      setProcesando(idApartado);
      const result = await ApartadosAdminService.marcarEntregado(idApartado, codigo, montoPagado, metodoPago);

      if (result.success) {
        setApartados(prev => prev.map(a =>
          a.id_apartado === idApartado
            ? {
                ...a,
                entregado: true,
                fecha_entrega: result.data.fecha_entrega,
                monto_pagado_resto: result.data.monto_pagado_resto,
                metodo_pago_resto: metodoPago,
              }
            : a
        ));
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

  if (loading && apartados.length === 0) {
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

        {/* SCRUM-355: buscador */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '16px 0', maxWidth: '360px' }}>
          <SearchIcon fontSize="small" style={{ color: '#999' }} />
          <input
            type="text"
            placeholder="Buscar por producto, cliente o código..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            style={{
              flex: 1,
              padding: '8px 10px',
              borderRadius: '6px',
              border: '1px solid #ccc',
            }}
          />
        </div>

        {error && (
          <div style={{ color: 'red', textAlign: 'center', padding: '20px' }}>
            {error}
            <button onClick={() => cargarApartados(busqueda)} style={{ display: 'block', margin: '10px auto' }}>
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
                    Cliente: {a.cliente} · Apartado el {a.fecha_apartado}
                  </div>
                  {/* SCRUM-355/356: detalle con anticipo pagado y saldo pendiente */}
                  <div style={{ fontSize: '13px', marginTop: '4px' }}>
                    <span style={{ color: '#27ae60' }}>Anticipo pagado: {a.monto_anticipo}</span>
                    {" · "}
                    <span style={{ color: '#c0392b', fontWeight: 'bold' }}>Pendiente por cobrar: {a.monto_pendiente}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px' }}>
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

                  {/* SCRUM-357: monto y método de pago del saldo restante */}
                  <PaymentsIcon fontSize="small" style={{ color: '#999' }} />
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={montoInputs[a.id_apartado] ?? a.monto_pendiente_numerico}
                    onChange={(e) => handleMontoChange(a.id_apartado, e.target.value)}
                    style={{
                      padding: '8px 10px',
                      borderRadius: '6px',
                      border: '1px solid #ccc',
                      width: '110px'
                    }}
                  />
                  <select
                    value={metodoInputs[a.id_apartado] || "efectivo"}
                    onChange={(e) => handleMetodoChange(a.id_apartado, e.target.value)}
                    style={{
                      padding: '8px 10px',
                      borderRadius: '6px',
                      border: '1px solid #ccc',
                    }}
                  >
                    <option value="efectivo">Efectivo</option>
                    <option value="tarjeta">Tarjeta</option>
                    <option value="transferencia">Transferencia</option>
                  </select>

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
                  {/* SCRUM-357: mostrar cómo se cobró el saldo */}
                  {a.monto_pagado_resto && (
                    <div style={{ fontSize: '13px' }}>
                      Saldo cobrado: {a.monto_pagado_resto} ({a.metodo_pago_resto})
                    </div>
                  )}
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