import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import "./Empenos.css";
import api from '../config/api';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import Select from 'react-select';
import CalculateIcon from '@mui/icons-material/Calculate';

import DateRangeIcon from '@mui/icons-material/DateRange';

const NuevoEmpeno = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [clientes, setClientes] = useState([]);
  const [prendas, setPrendas] = useState([]);
  
  // Estados para modales de creación
  const [isCreatingCliente, setIsCreatingCliente] = useState(false);
  const [isCreatingPrenda, setIsCreatingPrenda] = useState(false);
  
  // Estado para la prenda seleccionada (para mostrar valor)
  const [prendaSeleccionadaValor, setPrendaSeleccionadaValor] = useState(0);
  
  // Estado para el select de cliente (react-select)
  const [selectedCliente, setSelectedCliente] = useState(null);
  
  // Estado para el select de prenda (react-select)
  const [selectedPrenda, setSelectedPrenda] = useState(null);
  
  // Tasa fija de interés (5%)
  const TASA_FIJA = 5;
  const TASA_NOMBRE = "Básico";
  const TASA_PLAZO_DIAS = 15;
  
  // Estado para el cálculo de pagos
  const [simulacionPago, setSimulacionPago] = useState({
    capital: 0,
    interes: 0,
    iva: 0,
    total: 0,
    refrendo: 0,
    total_intereses: 0,
    monto_prestado: 0,
    plazo_meses: 1,
    tasa_porcentaje: TASA_FIJA,
    tasa_nombre: TASA_NOMBRE,
    fecha_vencimiento: ""
  });
  
  const [nuevoCliente, setNuevoCliente] = useState({
    nombre: "",
    apellido: "",
    telefono: "",
    correo: ""
  });
  
  const [nuevaPrenda, setNuevaPrenda] = useState({
    descripcion: "",
    tipo: "",
    material: "",
    peso_gramos: "",
    valor_estimado: ""
  });
  
  const [form, setForm] = useState({
    cliente_id: "",
    prenda_id: "",
    monto_prestado: "",
    tasa_id: 1,
    fecha_vencimiento: "",
    aval_id: "",
    plazo_meses: 1
  });

  // Opciones para react-select
  const clientesOptions = clientes.map(cliente => ({
    value: cliente.id_cliente,
    label: `${cliente.nombre} ${cliente.apellido}`,
    telefono: cliente.telefono,
    correo: cliente.correo
  }));

  const prendasOptions = prendas.map(prenda => ({
    value: prenda.id_prenda,
    label: prenda.descripcion,
    tipo: prenda.tipo,
    valor_estimado: prenda.valor_estimado
  }));

  // Estilos personalizados para react-select
  const customStyles = {
    control: (base, state) => ({
      ...base,
      borderRadius: '8px',
      borderColor: state.isFocused ? '#0d1b3e' : '#e9ecef',
      boxShadow: state.isFocused ? '0 0 0 3px rgba(13, 27, 62, 0.1)' : 'none',
      '&:hover': { borderColor: '#0d1b3e' },
      minHeight: '48px',
      backgroundColor: 'white'
    }),
    option: (base, { isFocused, isSelected }) => ({
      ...base,
      backgroundColor: isSelected ? '#0d1b3e' : isFocused ? '#f8f9fa' : 'white',
      color: isSelected ? 'white' : '#0d1b3e',
      cursor: 'pointer',
      padding: '10px 12px',
      zIndex: 9999
    }),
    placeholder: (base) => ({
      ...base,
      color: '#adb5bd'
    }),
    menu: (base) => ({
      ...base,
      zIndex: 9999,
      borderRadius: '8px',
      overflow: 'hidden',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      position: 'absolute',
      backgroundColor: 'white'
    }),
    menuList: (base) => ({
      ...base,
      maxHeight: '300px',
      padding: 0
    }),
    dropdownIndicator: (base) => ({
      ...base,
      color: '#6c757d'
    }),
    clearIndicator: (base) => ({
      ...base,
      color: '#6c757d',
      cursor: 'pointer'
    })
  };

  // Calcular simulación de pago
  const calcularSimulacion = () => {
    const monto = parseFloat(form.monto_prestado) || 0;
    const plazoMeses = parseInt(form.plazo_meses) || 1;
    
    if (monto > 0) {
      // Interés total sobre el plazo completo
      const interesTotal = monto * (TASA_FIJA / 100) * plazoMeses;
      
      // IVA sobre el interés (16%)
      const ivaInteres = interesTotal * 0.16;
      
      // Total a pagar (capital + intereses + IVA)
      const totalPagar = monto + interesTotal + ivaInteres;
      
      // Refrendo mensual (pago de intereses + IVA por mes, SIN capital)
      const refrendoMensual = (interesTotal + ivaInteres) / plazoMeses;
      
      // Fecha de vencimiento
      const fechaVencimiento = new Date();
      fechaVencimiento.setMonth(fechaVencimiento.getMonth() + plazoMeses);
      const fechaVencimientoStr = fechaVencimiento.toISOString().split('T')[0];
      
      setSimulacionPago({
        capital: monto,
        interes: interesTotal,
        iva: ivaInteres,
        total: totalPagar,
        refrendo: refrendoMensual,
        total_intereses: interesTotal + ivaInteres,
        monto_prestado: monto,
        plazo_meses: plazoMeses,
        tasa_porcentaje: TASA_FIJA,
        tasa_nombre: TASA_NOMBRE,
        fecha_vencimiento: fechaVencimientoStr
      });
      
      setForm(prev => ({ ...prev, fecha_vencimiento: fechaVencimientoStr }));
      
    } else {
      setSimulacionPago({
        capital: 0,
        interes: 0,
        iva: 0,
        total: 0,
        refrendo: 0,
        total_intereses: 0,
        monto_prestado: 0,
        plazo_meses: 1,
        tasa_porcentaje: TASA_FIJA,
        tasa_nombre: TASA_NOMBRE,
        fecha_vencimiento: ""
      });
    }
  };

  // Cargar datos
  useEffect(() => {
    cargarClientes();
    cargarPrendas();
  }, []);

  // Recalcular cuando cambie el monto o el plazo
  useEffect(() => {
    calcularSimulacion();
  }, [form.monto_prestado, form.plazo_meses]);

  const procesarRespuesta = (response) => {
    if (Array.isArray(response.data)) {
      return { success: true, data: response.data };
    }
    if (response.data && response.data.success !== undefined) {
      return response.data;
    }
    if (response.data && response.data.data !== undefined) {
      return { success: true, data: response.data.data };
    }
    return { success: false, data: [] };
  };

  const cargarClientes = async () => {
    try {
      const response = await api.get('/clientes');
      const resultado = procesarRespuesta(response);
      if (resultado.success && Array.isArray(resultado.data)) {
        setClientes(resultado.data);
      }
    } catch (error) {
      console.error('Error al cargar clientes:', error);
    }
  };

  const cargarPrendas = async () => {
    try {
      const response = await api.get('/prendas/disponibles');
      const resultado = procesarRespuesta(response);
      if (resultado.success && Array.isArray(resultado.data)) {
        setPrendas(resultado.data);
      }
    } catch (error) {
      console.error('Error al cargar prendas:', error);
    }
  };

  // Manejar selección de cliente
  const handleClienteChange = (selected) => {
    setSelectedCliente(selected);
    setForm(prev => ({ ...prev, cliente_id: selected?.value || "" }));
  };

  // Manejar selección de prenda
  const handlePrendaChange = (selected) => {
    setSelectedPrenda(selected);
    setForm(prev => ({ ...prev, prenda_id: selected?.value || "" }));
    
    if (selected) {
      const valor = selected.valor_estimado;
      setPrendaSeleccionadaValor(valor);
      const montoSugerido = Math.round(valor * 0.7);
      setForm(prev => ({ ...prev, monto_prestado: montoSugerido.toString() }));
    } else {
      setPrendaSeleccionadaValor(0);
    }
  };

  // Crear nuevo cliente
  const crearNuevoCliente = async () => {
    if (!nuevoCliente.nombre) {
      alert("Por favor ingrese el nombre del cliente");
      return;
    }

    try {
      const response = await api.post('/clientes', nuevoCliente);
      if (response.data.success) {
        const nuevoClienteData = {
          id_cliente: response.data.data.id_cliente,
          nombre: nuevoCliente.nombre,
          apellido: nuevoCliente.apellido || "",
          telefono: nuevoCliente.telefono,
          correo: nuevoCliente.correo
        };
        setClientes([...clientes, nuevoClienteData]);
        
        const newOption = {
          value: nuevoClienteData.id_cliente,
          label: `${nuevoClienteData.nombre} ${nuevoClienteData.apellido}`,
          telefono: nuevoClienteData.telefono
        };
        setSelectedCliente(newOption);
        setForm(prev => ({ ...prev, cliente_id: nuevoClienteData.id_cliente }));
        
        setIsCreatingCliente(false);
        setNuevoCliente({ nombre: "", apellido: "", telefono: "", correo: "" });
        alert("Cliente creado correctamente");
      }
    } catch (error) {
      console.error('Error al crear cliente:', error);
      alert("Error al crear el cliente: " + (error.response?.data?.message || error.message));
    }
  };

  // Crear nueva prenda
  const crearNuevaPrenda = async () => {
    if (!nuevaPrenda.descripcion || !nuevaPrenda.tipo || !nuevaPrenda.valor_estimado) {
      alert("Por favor complete los campos obligatorios: Descripción, Tipo y Valor Estimado");
      return;
    }

    try {
      const response = await api.post('/prendas', nuevaPrenda);
      if (response.data.success) {
        const nuevaPrendaData = {
          id_prenda: response.data.data.id_prenda,
          descripcion: nuevaPrenda.descripcion,
          tipo: nuevaPrenda.tipo,
          valor_estimado: nuevaPrenda.valor_estimado
        };
        setPrendas([...prendas, nuevaPrendaData]);
        
        const newOption = {
          value: nuevaPrendaData.id_prenda,
          label: nuevaPrendaData.descripcion,
          tipo: nuevaPrendaData.tipo,
          valor_estimado: nuevaPrendaData.valor_estimado
        };
        setSelectedPrenda(newOption);
        setForm(prev => ({ ...prev, prenda_id: nuevaPrendaData.id_prenda }));
        setPrendaSeleccionadaValor(nuevaPrendaData.valor_estimado);
        
        const montoSugerido = Math.round(nuevaPrendaData.valor_estimado * 0.7);
        setForm(prev => ({ ...prev, monto_prestado: montoSugerido.toString() }));
        
        setIsCreatingPrenda(false);
        setNuevaPrenda({ descripcion: "", tipo: "", material: "", peso_gramos: "", valor_estimado: "" });
        alert("Prenda creada correctamente");
      }
    } catch (error) {
      console.error('Error al crear prenda:', error);
      alert("Error al crear la prenda: " + (error.response?.data?.message || error.message));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!form.cliente_id) {
      alert("Por favor seleccione un cliente");
      return;
    }
    
    if (!form.prenda_id) {
      alert("Por favor seleccione una prenda");
      return;
    }
    
    setLoading(true);
    
    try {
      const tasaId = 1;
      
      const dataToSend = {
        cliente_id: form.cliente_id,
        prenda_id: form.prenda_id,
        monto_prestado: form.monto_prestado,
        tasa_id: tasaId,
        fecha_vencimiento: form.fecha_vencimiento,
        aval_id: form.aval_id || null
      };
      
      const response = await api.post('/empenos', dataToSend);
      if (response.data.success) {
        alert('Empeño registrado correctamente');
        navigate("/empenos");
      } else {
        alert('Error: ' + response.data.message);
      }
    } catch (error) {
      console.error('Error al guardar:', error);
      alert('Error al registrar el empeño: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  // Calcular fecha mínima
  const hoy = new Date();
  const manana = new Date(hoy);
  manana.setDate(manana.getDate() + 1);
  const fechaMinima = manana.toISOString().split('T')[0];

  const tiposPrenda = ["Joyería", "Electrónica", "Relojes", "Herramientas", "Instrumentos", "Otros"];
  const montoMaximoSugerido = Math.round(prendaSeleccionadaValor * 0.7);

  // Formatear moneda
  const formatMoney = (value) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 2
    }).format(value || 0);
  };

  // Opciones de plazo
  const opcionesPlazo = [
    { value: 1, label: "1 mes" },
    { value: 2, label: "2 meses" },
    { value: 3, label: "3 meses" },
    { value: 4, label: "4 meses" },
    { value: 5, label: "5 meses" },
    { value: 6, label: "6 meses" }
  ];

  return (
    <div className="dashboard">
     

      <div className="content">
        <div className="tienda-header">
          <div>
            <h1>Nuevo Empeño</h1>
            <p className="header-sub">Registra un nuevo préstamo con garantía</p>
          </div>
        </div>

        <div className="form-card">
          <form onSubmit={handleSubmit} className="form-grid">
            
            {/* CLIENTE */}
            <div className="form-group full-width" style={{ position: 'relative', zIndex: 1000 }}>
              <label>Cliente *</label>
              <Select
                options={clientesOptions}
                value={selectedCliente}
                onChange={handleClienteChange}
                placeholder="Buscar cliente..."
                isClearable
                isSearchable
                styles={customStyles}
                noOptionsMessage={() => "No se encontraron clientes"}
                loadingMessage={() => "Cargando..."}
                isLoading={loading}
                menuPortalTarget={document.body}
                menuPosition="fixed"
                formatOptionLabel={(option) => (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 'bold', color: '#0d1b3e' }}>{option.label}</div>
                      {option.telefono && <div style={{ fontSize: '0.7rem', color: '#6c757d' }}>{option.telefono}</div>}
                    </div>
                  </div>
                )}
              />
              <button
                type="button"
                className="btn-crear-select"
                onClick={() => setIsCreatingCliente(true)}
                style={{
                  marginTop: '8px',
                  background: 'none',
                  border: 'none',
                  color: '#f59e0b',
                  cursor: 'pointer',
                  fontSize: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <AddIcon fontSize="small" /> Crear nuevo cliente
              </button>
            </div>

            {/* PRENDA */}
            <div className="form-group full-width" style={{ position: 'relative', zIndex: 999 }}>
              <label>Prenda *</label>
              <Select
                options={prendasOptions}
                value={selectedPrenda}
                onChange={handlePrendaChange}
                placeholder="Buscar prenda..."
                isClearable
                isSearchable
                styles={customStyles}
                noOptionsMessage={() => "No se encontraron prendas"}
                loadingMessage={() => "Cargando..."}
                isLoading={loading}
                menuPortalTarget={document.body}
                menuPosition="fixed"
                formatOptionLabel={(option) => (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 'bold', color: '#0d1b3e' }}>{option.label}</div>
                      <div style={{ fontSize: '0.7rem', color: '#6c757d' }}>{option.tipo}</div>
                    </div>
                    <div style={{ 
                      fontSize: '0.85rem', 
                      fontWeight: 'bold', 
                      color: '#f59e0b',
                      backgroundColor: '#fef3c7',
                      padding: '2px 8px',
                      borderRadius: '20px'
                    }}>
                      ${option.valor_estimado?.toLocaleString()}
                    </div>
                  </div>
                )}
              />
              <button
                type="button"
                className="btn-crear-select"
                onClick={() => setIsCreatingPrenda(true)}
                style={{
                  marginTop: '8px',
                  background: 'none',
                  border: 'none',
                  color: '#f59e0b',
                  cursor: 'pointer',
                  fontSize: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <AddIcon fontSize="small" /> Crear nueva prenda
              </button>
            </div>

            {/* Valor de la prenda */}
            {prendaSeleccionadaValor > 0 && (
              <div className="form-group full-width">
                <label>Valor de la Prenda</label>
                <div className="valor-prenda-info">
                  <span className="valor-label">Valor estimado:</span>
                  <span className="valor-monto">${prendaSeleccionadaValor.toLocaleString()}</span>
                </div>
                <small className="valor-sugerencia">
                  💡 Monto máximo sugerido: ${montoMaximoSugerido.toLocaleString()} (70% del valor)
                </small>
              </div>
            )}

            {/* Monto a prestar */}
            <div className="form-group">
              <label>Monto a Prestar *</label>
              <input
                name="monto_prestado"
                type="number"
                step="0.01"
                min="100"
                max={montoMaximoSugerido || undefined}
                placeholder="Ej: 5000"
                value={form.monto_prestado}
                onChange={handleChange}
                required
              />
              {montoMaximoSugerido > 0 && (
                <small>Monto máximo: ${montoMaximoSugerido.toLocaleString()}</small>
              )}
            </div>

            {/* Tasa fija (solo información) */}
            <div className="form-group">
              <label>Tasa de Interés</label>
              <div className="tasa-fija-info">
                <span className="tasa-valor">{TASA_FIJA}% - {TASA_NOMBRE}</span>
                <span className="tasa-plazo">({TASA_PLAZO_DIAS} días)</span>
              </div>
              <small>Tasa fija aplicable a todos los empeños</small>
            </div>

            {/* Plazo en meses */}
            <div className="form-group">
              <label>Plazo (meses) *</label>
              <select
                name="plazo_meses"
                value={form.plazo_meses}
                onChange={handleChange}
                required
              >
                {opcionesPlazo.map(opcion => (
                  <option key={opcion.value} value={opcion.value}>{opcion.label}</option>
                ))}
              </select>
              <small>Selecciona el plazo de pago</small>
            </div>

            {/* TARJETA DE SIMULACIÓN DE PAGO */}
            {simulacionPago.monto_prestado > 0 && (
              <div className="recibo-simulacion full-width">
                <div className="recibo-simulacion-header">
                  <h3>Simulación de Pago</h3>
                  <CalculateIcon className="simulacion-icon" />
                </div>
                
                <div className="recibo-simulacion-body">
                  <div className="simulacion-seccion">
                    <div className="simulacion-fila">
                      <span className="simulacion-label">Monto a Prestar:</span>
                      <span className="simulacion-valor">{formatMoney(simulacionPago.monto_prestado)}</span>
                    </div>
                    <div className="simulacion-fila">
                      <span className="simulacion-label">Tasa de Interés:</span>
                      <span className="simulacion-valor">{simulacionPago.tasa_porcentaje}%</span>
                    </div>
                    <div className="simulacion-fila">
                      <span className="simulacion-label">Plazo:</span>
                      <span className="simulacion-valor">{simulacionPago.plazo_meses} mes(es)</span>
                    </div>
                  </div>

                  <div className="simulacion-divider"></div>

                  <div className="simulacion-seccion">
                    <div className="simulacion-fila">
                      <span className="simulacion-label">Interés Generado:</span>
                      <span className="simulacion-valor interes">{formatMoney(simulacionPago.interes)}</span>
                    </div>
                    <div className="simulacion-fila">
                      <span className="simulacion-label">IVA (16%):</span>
                      <span className="simulacion-valor iva">{formatMoney(simulacionPago.iva)}</span>
                    </div>
                    <div className="simulacion-fila">
                      <span className="simulacion-label">Total Intereses + IVA:</span>
                      <span className="simulacion-valor">{formatMoney(simulacionPago.total_intereses)}</span>
                    </div>
                  </div>

                  <div className="simulacion-divider"></div>

                  <div className="simulacion-seccion">
                    <div className="simulacion-fila total">
                      <span className="simulacion-label">TOTAL A PAGAR:</span>
                      <span className="simulacion-valor total">{formatMoney(simulacionPago.total)}</span>
                    </div>
                    <div className="simulacion-fila pago-mensual">
                      <span className="simulacion-label">REFRENDO MENSUAL:</span>
                      <span className="simulacion-valor pago-mensual">{formatMoney(simulacionPago.refrendo)}</span>
                    </div>
                  </div>

                  <div className="simulacion-footer">
                    <small>* El refrendo cubre únicamente intereses + IVA. El capital se paga al recuperar la prenda.</small>
                  </div>
                </div>
              </div>
            )}

            {/* Fecha de Vencimiento */}
            <div className="form-group">
              <label>
                <DateRangeIcon className="input-icon" />
                Fecha de Vencimiento *
              </label>
              <input
                name="fecha_vencimiento"
                type="date"
                min={fechaMinima}
                value={simulacionPago.fecha_vencimiento || form.fecha_vencimiento}
                onChange={handleChange}
                required
                readOnly
                style={{ backgroundColor: '#f8f8f8' }}
              />
              <small>Fecha calculada según el plazo seleccionado</small>
            </div>

            {/* Aval */}
            <div className="form-group">
              <label>Aval (opcional)</label>
              <select
                name="aval_id"
                value={form.aval_id}
                onChange={handleChange}
              >
                <option value="">Sin aval</option>
              </select>
            </div>

            {/* Botones */}
            <div className="form-buttons full-width">
              <button type="submit" className="btn-gold" disabled={loading}>
                {loading ? "Guardando..." : "Guardar Empeño"}
              </button>
              <button
                type="button"
                className="btn-cancel"
                onClick={() => navigate("/empenos")}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* MODAL CLIENTE */}
      {isCreatingCliente && (
        <div className="modal-overlay" onClick={() => setIsCreatingCliente(false)}>
          <div className="modal-crear-cliente" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Nuevo Cliente</h3>
              <button className="modal-close-btn" onClick={() => setIsCreatingCliente(false)}>
                <CloseIcon />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Nombre *</label>
                <input
                  type="text"
                  value={nuevoCliente.nombre}
                  onChange={(e) => setNuevoCliente({...nuevoCliente, nombre: e.target.value})}
                  placeholder="Ej: Juan"
                  autoFocus
                />
              </div>
              <div className="form-group">
                <label>Apellido</label>
                <input
                  type="text"
                  value={nuevoCliente.apellido}
                  onChange={(e) => setNuevoCliente({...nuevoCliente, apellido: e.target.value})}
                  placeholder="Ej: Pérez"
                />
              </div>
              <div className="form-group">
                <label>Teléfono</label>
                <input
                  type="tel"
                  value={nuevoCliente.telefono}
                  onChange={(e) => setNuevoCliente({...nuevoCliente, telefono: e.target.value})}
                  placeholder="Ej: 5551234567"
                />
              </div>
              <div className="form-group">
                <label>Correo</label>
                <input
                  type="email"
                  value={nuevoCliente.correo}
                  onChange={(e) => setNuevoCliente({...nuevoCliente, correo: e.target.value})}
                  placeholder="Ej: cliente@email.com"
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setIsCreatingCliente(false)}>Cancelar</button>
              <button className="btn-gold" onClick={crearNuevoCliente}>Crear Cliente</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL PRENDA */}
      {isCreatingPrenda && (
        <div className="modal-overlay" onClick={() => setIsCreatingPrenda(false)}>
          <div className="modal-crear-prenda" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Nueva Prenda</h3>
              <button className="modal-close-btn" onClick={() => setIsCreatingPrenda(false)}>
                <CloseIcon />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Descripción *</label>
                <input
                  type="text"
                  value={nuevaPrenda.descripcion}
                  onChange={(e) => setNuevaPrenda({...nuevaPrenda, descripcion: e.target.value})}
                  placeholder="Ej: Anillo de diamantes"
                  autoFocus
                />
              </div>
              <div className="form-group">
                <label>Tipo *</label>
                <select
                  value={nuevaPrenda.tipo}
                  onChange={(e) => setNuevaPrenda({...nuevaPrenda, tipo: e.target.value})}
                >
                  <option value="">Seleccione un tipo</option>
                  {tiposPrenda.map(tipo => (
                    <option key={tipo} value={tipo}>{tipo}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Material</label>
                <input
                  type="text"
                  value={nuevaPrenda.material}
                  onChange={(e) => setNuevaPrenda({...nuevaPrenda, material: e.target.value})}
                  placeholder="Ej: Oro 18k"
                />
              </div>
              <div className="form-group">
                <label>Peso (gramos)</label>
                <input
                  type="number"
                  step="0.01"
                  value={nuevaPrenda.peso_gramos}
                  onChange={(e) => setNuevaPrenda({...nuevaPrenda, peso_gramos: e.target.value})}
                  placeholder="Ej: 5.5"
                />
              </div>
              <div className="form-group">
                <label>Valor Estimado *</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={nuevaPrenda.valor_estimado}
                  onChange={(e) => setNuevaPrenda({...nuevaPrenda, valor_estimado: e.target.value})}
                  placeholder="Ej: 5000"
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setIsCreatingPrenda(false)}>Cancelar</button>
              <button className="btn-gold" onClick={crearNuevaPrenda}>Crear Prenda</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NuevoEmpeno;