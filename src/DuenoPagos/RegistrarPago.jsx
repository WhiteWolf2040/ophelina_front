// RegistrarPago.jsx - Versión con React-Select
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import api from "../config/api";
import "./Pagos.css";
import Select from 'react-select';

// Iconos MUI
import WarningIcon from '@mui/icons-material/Warning';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ReceiptIcon from '@mui/icons-material/Receipt';
import PaymentIcon from '@mui/icons-material/Payment';
import DateRangeIcon from '@mui/icons-material/DateRange';
import InfoIcon from '@mui/icons-material/Info';
import HistoryIcon from '@mui/icons-material/History';

const RegistrarPago = () => {
  const navigate = useNavigate();
  
  // Estados
  const [loading, setLoading] = useState(false);
  const [empenosActivos, setEmpenosActivos] = useState([]);
  const [amortizacionPendiente, setAmortizacionPendiente] = useState(null);
  const [diasAtraso, setDiasAtraso] = useState(0);
  const [interesMora, setInteresMora] = useState(0);
  const [totalPagosRealizados, setTotalPagosRealizados] = useState(0);
  const [form, setForm] = useState({
    id_empeno: "",
    metodo_pago: "",
    tipo_pago: "",
    fecha_pago: new Date().toISOString().split('T')[0],
    monto: "",
    referencia: ""
  });
  
  const metodosPago = ["efectivo", "transferencia", "tarjeta", "deposito"];
  const tiposPago = ["interes", "abono", "liquidacion", "prorroga"];
  
  // Convertir empeños a formato para react-select
  const empenosOptions = empenosActivos.map(emp => ({
    value: emp.id,
    label: `${emp.cliente} - ${emp.articulo?.substring(0, 50)}...`,
    saldo: emp.saldo_pendiente_cuota,
    saldo_total: emp.saldo_total_pendiente,
    articulo: emp.articulo,
    cliente: emp.cliente,
    pagos_realizados: emp.pagos_realizados || 0
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
  
  // Función para formatear números
  const formatNumber = (num) => {
    if (num === null || num === undefined) return "0.00";
    const number = Number(num);
    if (isNaN(number)) return "0.00";
    return number.toLocaleString('es-MX', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };
  
  // Función para obtener texto de atraso
  const getTextoAtraso = () => {
    if (!amortizacionPendiente || diasAtraso === 0) return null;
    if (diasAtraso === 1) return "1 día de atraso";
    if (diasAtraso < 30) return `${diasAtraso} días de atraso`;
    const meses = Math.floor(diasAtraso / 30);
    const dias = diasAtraso % 30;
    if (dias === 0) return `${meses} mes(es) de atraso`;
    return `${meses} mes(es) y ${dias} días de atraso`;
  };
  
  // Cargar empeños activos
const cargarEmpenosActivos = async () => {
  try {
    setLoading(true);
    const response = await api.get('/empenos/activos-con-saldo');
    
    console.log('=== RESPUESTA COMPLETA ===', response.data);
    
    if (response.data.success) {
      const empenos = response.data.data.map(emp => ({
        id: emp.id_empeno,
        cliente: emp.cliente,
        monto_prestado: emp.monto_prestado,
        saldo_total_pendiente: emp.saldo_total_pendiente,
        saldo_pendiente_cuota: emp.saldo_pendiente_cuota,
        articulo: emp.articulo,
        fecha_vencimiento: emp.fecha_vencimiento,
        pagos_realizados: emp.pagos_realizados || 0
      }));
      
      console.log('Empeños procesados:', empenos);
      console.log('Cantidad de empeños:', empenos.length);
      
      // 🔑 IMPORTANTE: Verifica que cada empeño tenga un ID válido
      empenos.forEach((emp, index) => {
        console.log(`Empeño ${index + 1}: ID=${emp.id}, Cliente=${emp.cliente}`);
      });
      
      setEmpenosActivos(empenos);
      
      // 🔑 Verifica que el estado se actualizó correctamente
      setTimeout(() => {
        console.log('Estado empenosActivos después de set:', empenosActivos);
      }, 100);
    }
  } catch (error) {
    console.error('Error al cargar empeños activos:', error);
    alert("Error al cargar los empeños activos");
  } finally {
    setLoading(false);
  }
};
  // Cargar amortización pendiente
  const cargarAmortizacionPendiente = async (idEmpeno) => {
    try {
      const response = await api.get(`/amortizacion/pendiente/${idEmpeno}`);
      console.log('=== RESPUESTA COMPLETA DEL BACKEND ===');
      console.log(response.data);
      
      if (response.data.success) {
        const data = response.data.data;
        console.log('=== DATOS DE AMORTIZACIÓN ===');
        console.log('Número de cuota:', data.numero_pago);
        console.log('Capital:', data.capital);
        console.log('Interés:', data.interes);
        console.log('IVA:', data.iva_interes);
        console.log('Monto total:', data.monto_total);
        console.log('Monto pagado:', data.monto_pagado);
        console.log('Saldo pendiente (backend):', data.saldo_pendiente);
        
        setAmortizacionPendiente(data);
        
        // Obtener el número de pagos realizados para este empeño
        try {
          const pagosResponse = await api.get(`/pagos/empeno/${idEmpeno}/count`);
          if (pagosResponse.data.success) {
            setTotalPagosRealizados(pagosResponse.data.data.total);
          }
        } catch (error) {
          console.error('Error al contar pagos:', error);
          setTotalPagosRealizados(0);
        }
      }
    } catch (error) {
      console.error('Error al cargar amortización:', error);
    }
  };
  
  // Efectos
  useEffect(() => {
    cargarEmpenosActivos();
  }, []);
  
  useEffect(() => {
    if (form.id_empeno) {
      cargarAmortizacionPendiente(form.id_empeno);
    } else {
      setAmortizacionPendiente(null);
      setDiasAtraso(0);
      setInteresMora(0);
      setTotalPagosRealizados(0);
    }
  }, [form.id_empeno]);

  useEffect(() => {
  console.log('=== empenosActivos CAMBIÓ ===');
  console.log('Nuevo valor:', empenosActivos);
  console.log('Cantidad:', empenosActivos.length);
  
  // Verificar empenosOptions
  const options = empenosActivos.map(emp => ({
    value: emp.id,
    label: `${emp.cliente} - ${emp.articulo?.substring(0, 50)}...`,
  }));
  console.log('Opciones generadas para React-Select:', options);
}, [empenosActivos]);
  
  // Obtener el valor seleccionado para react-select
  const selectedOption = empenosOptions.find(opt => opt.value === form.id_empeno);
  
  // Sugerir monto según tipo de pago, Ayuda al usuario a saber cuánto debe pagar según el tipo de pago que elija.
  const getMontoSugerido = () => {
    if (!amortizacionPendiente) return null;
    
    const capital = Number(amortizacionPendiente.capital) || 0;
    const interes = Number(amortizacionPendiente.interes) || 0;
    const iva = Number(amortizacionPendiente.iva_interes) || 0;
    const montoTotal = Number(amortizacionPendiente.monto_total) || 0;
    const mora = Number(interesMora) || 0;
    
    switch (form.tipo_pago) {
      case 'liquidacion':
        return montoTotal + mora;
      case 'interes':
        return interes + iva + mora;
      case 'prorroga':
        return interes + iva + mora;
      case 'abono':
        return Math.min(capital, 1000);
      default:
        return null;
    }
  };
  
  // Calcular texto de atraso
  const textoAtraso = getTextoAtraso();
  const montoSugerido = getMontoSugerido();
  
  // Submit del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!form.id_empeno) {
      alert("Selecciona un empeño");
      return;
    }
    
    if (!form.monto || form.monto <= 0) {
      alert("Ingresa un monto válido");
      return;
    }
    
    if (!form.metodo_pago) {
      alert("Selecciona un método de pago");
      return;
    }
    
    if (!form.tipo_pago) {
      alert("Selecciona un tipo de pago");
      return;
    }
    
    try {
      setLoading(true);
      
      const response = await api.post('/pagos', {
        id_empeno: form.id_empeno,
        monto: parseFloat(form.monto),
        fecha_pago: form.fecha_pago,
        metodo_pago: form.metodo_pago,
        tipo_pago: form.tipo_pago,
        referencia: form.referencia || null
      });
      
      if (response.data.success) {
        const saldoPendiente = response.data.data.amortizacion?.saldo_pendiente;
        if (saldoPendiente > 0) {
          alert(`✅ Pago registrado exitosamente\nSaldo pendiente de esta cuota: $${formatNumber(saldoPendiente)}`);
        } else {
          alert(`✅ Pago registrado exitosamente\n¡Cuota liquidada!`);
        }
        navigate("/pagos");
      } else {
        alert("❌ Error: " + response.data.message);
      }
      
    } catch (error) {
      console.error('Error al registrar pago:', error);
      alert("❌ Error al registrar pago: " + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="dashboard">
      <Sidebar />
      
      <div className="content">
        <div className="header-container">
          <h2>
            <PaymentIcon className="title-icon" />
            Registrar Pago
          </h2>
          <p className="header-sub">Selecciona un empeño activo y registra el pago correspondiente</p>
        </div>
        
        <div className="form-card">
          <form onSubmit={handleSubmit} className="form-grid">
            
         
             {/* Empeños con React-Select */}
            <div className="form-group full-width">
              <label>
                <ReceiptIcon className="input-icon" />
                Empeño *
              </label>
              <Select
                options={empenosOptions}
                value={selectedOption}
                onChange={(selected) => setForm({ ...form, id_empeno: selected?.value || "" })}
                placeholder="Selecciona un empeño..."
                isClearable
                isSearchable
                noOptionsMessage={() => "No se encontraron empeños"}
                isLoading={loading}
                // ELIMINAMOS temporalmente: menuPortalTarget, menuPosition, styles personalizados
                className="react-select-container"
                classNamePrefix="react-select"
              />
            </div>
            {/* Información de la Cuota */}
            {amortizacionPendiente && (
              <div className="cuota-card full-width">
                <div className="cuota-card-header">
                  <div className="cuota-title">
                    <AttachMoneyIcon className="cuota-icon" />
                    <span>Información de la Cuota {amortizacionPendiente.numero_pago}</span>
                  </div>
                  {textoAtraso && (
                    <div className="atraso-badge">
                      <WarningIcon className="atraso-icon" />
                      <span>{textoAtraso}</span>
                    </div>
                  )}
                </div>
                
                <div className="cuota-grid">
                  <div className="cuota-grid-item capital">
                    <div className="grid-item-label">CAPITAL</div>
                    <div className="grid-item-value">${formatNumber(amortizacionPendiente.capital)}</div>
                  </div>
                  <div className="cuota-grid-item interes">
                    <div className="grid-item-label">INTERÉS</div>
                    <div className="grid-item-value">${formatNumber(amortizacionPendiente.interes)}</div>
                  </div>
                  <div className="cuota-grid-item iva">
                    <div className="grid-item-label">IVA (16%)</div>
                    <div className="grid-item-value">${formatNumber(amortizacionPendiente.iva_interes)}</div>
                  </div>
                  <div className="cuota-grid-item total">
                    <div className="grid-item-label">TOTAL A PAGAR</div>
                    <div className="grid-item-value">${formatNumber(amortizacionPendiente.monto_total)}</div>
                  </div>
                </div>
                
                {interesMora > 0 && (
                  <div className="mora-row">
                    <WarningIcon className="mora-icon" />
                    <span>Interés por mora: <strong>${formatNumber(interesMora)}</strong></span>
                    <span className="mora-days">({textoAtraso})</span>
                  </div>
                )}
                
                {/* NÚMERO DE PAGOS REALIZADOS - REEMPLAZA EL SALDO PENDIENTE */}
                <div className="pagos-realizados-row">
                  <HistoryIcon className="pagos-icon" />
                  <span className="pagos-label">NÚMERO DE PAGOS REALIZADOS:</span>
                  <span className="pagos-value">{totalPagosRealizados}</span>
                </div>
              </div>
            )}
            
            {/* Método de pago */}
            <div className="form-group">
              <label>Método de pago *</label>
              <select
                value={form.metodo_pago}
                onChange={(e) => setForm({ ...form, metodo_pago: e.target.value })}
                required
                disabled={loading}
                className="form-select"
              >
                <option value="">Seleccionar método</option>
                {metodosPago.map((metodo, index) => (
                  <option key={index} value={metodo}>
                    {metodo.charAt(0).toUpperCase() + metodo.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Tipo de Pago */}
            <div className="form-group">
              <label>Tipo de Pago *</label>
              <select
                value={form.tipo_pago}
                onChange={(e) => setForm({ ...form, tipo_pago: e.target.value })}
                required
                disabled={loading}
                className="form-select"
              >
                <option value="">Seleccionar tipo</option>
                {tiposPago.map((tipo, index) => (
                  <option key={index} value={tipo}>
                    {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Fecha */}
            <div className="form-group">
              <label>
                <DateRangeIcon className="input-icon" />
                Fecha *
              </label>
              <input
                type="date"
                value={form.fecha_pago}
                onChange={(e) => setForm({ ...form, fecha_pago: e.target.value })}
                required
                disabled={loading}
                className="form-input"
              />
            </div>
            
            {/* Monto de Pago */}
            <div className="form-group">
              <label>
                <AttachMoneyIcon className="input-icon" />
                Monto de Pago *
              </label>
              <input
                type="number"
                step="0.01"
                placeholder="Ej: 1500.00"
                value={form.monto}
                onChange={(e) => setForm({ ...form, monto: e.target.value })}
                required
                disabled={loading}
                className="form-input"
              />
              {montoSugerido && (
                <div className="monto-sugerido">
                  <InfoIcon className="sugerido-icon" />
                  <span>
                    Sugerido: <strong>${formatNumber(montoSugerido)}</strong> para 
                    {form.tipo_pago === 'abono' && ' abonar a capital'}
                    {form.tipo_pago === 'liquidacion' && ' liquidar esta cuota'}
                    {form.tipo_pago === 'interes' && ' pagar intereses'}
                    {form.tipo_pago === 'prorroga' && ' solicitar prórroga'}
                  </span>
                </div>
              )}
            </div>
            
            {/* Referencia */}
            <div className="form-group full-width">
              <label>Referencia (opcional)</label>
              <input
                type="text"
                placeholder="Número de referencia, voucher, etc."
                value={form.referencia}
                onChange={(e) => setForm({ ...form, referencia: e.target.value })}
                disabled={loading}
                className="form-input"
              />
            </div>
            
            {/* Botones */}
            <div className="form-buttons full-width">
              <button 
                type="submit" 
                className="btn-gold"
                disabled={loading}
              >
                {loading ? "Procesando..." : "Guardar Pago"}
              </button>
              
              <button
                type="button"
                className="btn-cancel"
                onClick={() => navigate("/pagos")}
                disabled={loading}
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

export default RegistrarPago;