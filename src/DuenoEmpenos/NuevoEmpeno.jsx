import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import "./Empenos.css";
import api from '../config/api';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import Select from 'react-select';
import DateRangeIcon from '@mui/icons-material/DateRange';
import ImageIcon from '@mui/icons-material/Image';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';

// ✅ Configuración de Cloudinary
const CLOUDINARY_CLOUD_NAME = "mbeup6wz";
const CLOUDINARY_UPLOAD_PRESET = "ophelina_productos";

// ✅ Función para subir imagen a Cloudinary
const subirImagenACloudinary = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
  formData.append("folder", "empenos");

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
    { method: "POST", body: formData }
  );

  if (!response.ok) {
    throw new Error("Error al subir la imagen a Cloudinary");
  }

  const data = await response.json();
  return data.secure_url;
};

//  NUEVO: Modal de mensaje (éxito / error) — reemplaza los alert() nativos.
// Se usa para TODOS los mensajes del formulario: validaciones, errores de
// red, y la confirmación final de "Empeño registrado".
const ModalMensaje = ({ visible, tipo, titulo, texto, textoBoton, onCerrar }) => {
  if (!visible) return null;

  const esExito = tipo === "success";

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(13, 27, 62, 0.55)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 10000,
        padding: "16px"
      }}
      onClick={onCerrar}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "white",
          borderRadius: "16px",
          padding: "32px 28px",
          maxWidth: "380px",
          width: "100%",
          textAlign: "center",
          boxShadow: "0 20px 50px rgba(0,0,0,0.25)",
          animation: "modalMensajeAparecer 0.18s ease-out"
        }}
      >
        <div
          style={{
            width: "64px",
            height: "64px",
            borderRadius: "50%",
            backgroundColor: esExito ? "#e8f8ee" : "#fdecea",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 16px"
          }}
        >
          {esExito ? (
            <CheckCircleIcon style={{ fontSize: "36px", color: "#27ae60" }} />
          ) : (
            <ErrorIcon style={{ fontSize: "36px", color: "#e74c3c" }} />
          )}
        </div>

        <h3 style={{ margin: "0 0 8px", color: "#0d1b3e", fontSize: "1.15rem" }}>
          {titulo}
        </h3>
        <p style={{ margin: "0 0 24px", color: "#555", fontSize: "0.92rem", lineHeight: 1.5 }}>
          {texto}
        </p>

        <button
          type="button"
          onClick={onCerrar}
          style={{
            background: esExito ? "#0d1b3e" : "#e74c3c",
            color: "white",
            border: "none",
            borderRadius: "10px",
            padding: "12px 28px",
            fontSize: "0.95rem",
            fontWeight: 600,
            cursor: "pointer",
            width: "100%"
          }}
        >
          {textoBoton || (esExito ? "Entendido" : "Cerrar")}
        </button>
      </div>

      <style>{`
        @keyframes modalMensajeAparecer {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
};

const NuevoEmpeno = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [clientes, setClientes] = useState([]);
  const [prendas, setPrendas] = useState([]);

  // Estados para modales de creación
  const [isCreatingPrenda, setIsCreatingPrenda] = useState(false);

  // Estado para la prenda seleccionada (para mostrar valor)
  const [prendaSeleccionadaValor, setPrendaSeleccionadaValor] = useState(0);

  // Estado para el select de cliente (react-select)
  const [selectedCliente, setSelectedCliente] = useState(null);

  // Estado para el select de prenda (react-select)
  const [selectedPrenda, setSelectedPrenda] = useState(null);

  // ✅ Estados para imagen
  const [imagenPrenda, setImagenPrenda] = useState(null);
  const [previewImagen, setPreviewImagen] = useState("");
  const [subiendoImagen, setSubiendoImagen] = useState(false);
  const inputImagenRef = useRef(null);

  // ✅ NUEVO: estado del modal de mensaje (éxito/error) que reemplaza los alert().
  // onAceptar es opcional: si se define, se ejecuta al cerrar el modal
  // (por ejemplo, navegar a /empenos tras registrar el empeño).
  const [modalMensaje, setModalMensaje] = useState({
    visible: false,
    tipo: "success",
    titulo: "",
    texto: "",
    textoBoton: "",
    onAceptar: null
  });

  const mostrarExito = (titulo, texto, onAceptar = null, textoBoton = null) => {
    setModalMensaje({ visible: true, tipo: "success", titulo, texto, textoBoton, onAceptar });
  };

  const mostrarError = (titulo, texto) => {
    setModalMensaje({ visible: true, tipo: "error", titulo, texto, textoBoton: null, onAceptar: null });
  };

  const cerrarModalMensaje = () => {
    const { onAceptar } = modalMensaje;
    setModalMensaje((prev) => ({ ...prev, visible: false }));
    if (onAceptar) onAceptar();
  };

  // Tasa real, cargada desde /tasas-interes. Este objeto es la ÚNICA fuente
  // de verdad para %, tanto en la simulación en pantalla como en lo que se
  // envía al backend al guardar (ver handleSubmit).
  const [tasaActual, setTasaActual] = useState({ id_tasa: 1, porcentaje: 15 }); // fallback mientras carga

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
    tasa_porcentaje: 15, // se sincroniza con tasaActual.porcentaje en cuanto carga
    fecha_vencimiento: ""
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

  // ✅ Manejar selección de imagen
  const handleImagenChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tipo
    const tiposPermitidos = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!tiposPermitidos.includes(file.type)) {
      mostrarError("Formato no permitido", "Solo se permiten imágenes JPEG, PNG, GIF o WEBP.");
      e.target.value = '';
      return;
    }

    // Validar tamaño (5MB)
    if (file.size > 5 * 1024 * 1024) {
      mostrarError("Imagen muy pesada", "La imagen no debe superar los 5MB.");
      e.target.value = '';
      return;
    }

    // Limpiar preview anterior
    if (previewImagen && previewImagen.startsWith("blob:")) {
      URL.revokeObjectURL(previewImagen);
    }

    setImagenPrenda(file);
    setPreviewImagen(URL.createObjectURL(file));
  };

  // ✅ Quitar imagen
  const quitarImagen = () => {
    if (previewImagen && previewImagen.startsWith("blob:")) {
      URL.revokeObjectURL(previewImagen);
    }
    setImagenPrenda(null);
    setPreviewImagen("");
    if (inputImagenRef.current) {
      inputImagenRef.current.value = "";
    }
  };

  // Calcular simulación de pago
  const calcularSimulacion = () => {
    const monto = parseFloat(form.monto_prestado) || 0;
    const plazoMeses = parseInt(form.plazo_meses) || 1;

    if (monto > 0) {
      const interesTotal = monto * (tasaActual.porcentaje / 100) * plazoMeses;
      const ivaInteres = interesTotal * 0.16;
      const totalPagar = monto + interesTotal + ivaInteres;
      const refrendoMensual = (interesTotal + ivaInteres) / plazoMeses;

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
        tasa_porcentaje: tasaActual.porcentaje,
        fecha_vencimiento: fechaVencimientoStr
      });

      setForm(prev => ({ ...prev, fecha_vencimiento: fechaVencimientoStr }));
    } else {
      setSimulacionPago({
        capital: 0, interes: 0, iva: 0, total: 0, refrendo: 0,
        total_intereses: 0, monto_prestado: 0, plazo_meses: 1,
        tasa_porcentaje: tasaActual.porcentaje, fecha_vencimiento: ""
      });
    }
  };

  // Único useEffect que recalcula la simulación. Se dispara con monto, plazo
  // Y tasaActual — si no incluyéramos tasaActual aquí, la simulación mostrada
  // se quedaría con el valor fallback (15%) hasta que el usuario tocara el
  // monto o el plazo después de que la tasa real ya hubiera cargado.
  useEffect(() => {
    calcularSimulacion();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.monto_prestado, form.plazo_meses, tasaActual]);

  const cargarTasaActual = async () => {
    try {
      const response = await api.get('/tasas-interes');
      const resultado = procesarRespuesta(response);
      if (resultado.success && Array.isArray(resultado.data) && resultado.data.length > 0) {
        // Toma la primera tasa activa como la tasa por defecto del sistema
        setTasaActual({
          id_tasa: resultado.data[0].id_tasa,
          porcentaje: parseFloat(resultado.data[0].porcentaje),
        });
      }
    } catch (error) {
      console.error('Error al cargar tasa de interés, usando valor por defecto:', error);
    }
  };

  // Cargar datos
  useEffect(() => {
    cargarClientes();
    cargarPrendas();
    cargarTasaActual();
  }, []);

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

  // Crear nueva prenda
  const crearNuevaPrenda = async () => {
    if (!nuevaPrenda.descripcion || !nuevaPrenda.tipo || !nuevaPrenda.valor_estimado) {
      mostrarError(
        "Faltan datos",
        "Por favor completa los campos obligatorios: Descripción, Tipo y Valor Estimado."
      );
      return;
    }

    try {
      let imagenUrl = null;

      // ✅ Si hay imagen, subirla primero a Cloudinary
      if (imagenPrenda) {
        try {
          setSubiendoImagen(true);
          imagenUrl = await subirImagenACloudinary(imagenPrenda);
        } catch (error) {
          mostrarError("Error al subir la imagen", error.message);
          return;
        } finally {
          setSubiendoImagen(false);
        }
      }

      // ✅ Incluir imagen_url en los datos
      const datosPrenda = {
        ...nuevaPrenda,
        imagen_url: imagenUrl
      };

      const response = await api.post('/prendas', datosPrenda);
      if (response.data.success) {
        const nuevaPrendaData = {
          id_prenda: response.data.data.id_prenda,
          descripcion: nuevaPrenda.descripcion,
          tipo: nuevaPrenda.tipo,
          valor_estimado: nuevaPrenda.valor_estimado,
          imagen_url: imagenUrl
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

        // ✅ Limpiar imagen
        quitarImagen();
        setIsCreatingPrenda(false);
        setNuevaPrenda({ descripcion: "", tipo: "", material: "", peso_gramos: "", valor_estimado: "" });

        mostrarExito(
          "Prenda creada",
          `La prenda se registró correctamente${imagenUrl ? " con su imagen" : ""}.`
        );
      }
    } catch (error) {
      console.error('Error al crear prenda:', error);
      mostrarError(
        "No se pudo crear la prenda",
        error.response?.data?.message || error.message
      );
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
      mostrarError("Falta el cliente", "Por favor selecciona un cliente para continuar.");
      return;
    }

    if (!form.prenda_id) {
      mostrarError("Falta la prenda", "Por favor selecciona una prenda para continuar.");
      return;
    }

    setLoading(true);

    try {
      const dataToSend = {
        cliente_id: form.cliente_id,
        prenda_id: form.prenda_id,
        monto_prestado: form.monto_prestado,
        tasa_id: tasaActual.id_tasa,
        fecha_vencimiento: form.fecha_vencimiento,
        aval_id: form.aval_id || null,
        plazo_meses: form.plazo_meses
      };

      const response = await api.post('/empenos', dataToSend);
      if (response.data.success) {
        // ✅ Modal de éxito en vez de alert(). Al darle "Ver mis empeños"
        // (onAceptar) es cuando navega — así el usuario alcanza a leer
        // el mensaje con calma, en vez de un alert() bloqueante seguido
        // de un redirect inmediato.
        mostrarExito(
          "¡Empeño registrado!",
          "El empeño se guardó correctamente y ya está disponible en tu lista.",
          () => navigate("/empenos"),
          "Ver mis empeños"
        );
      } else {
        mostrarError("No se pudo registrar", response.data.message);
      }
    } catch (error) {
      console.error('Error al guardar:', error);
      mostrarError(
        "No se pudo registrar el empeño",
        error.response?.data?.message || error.message
      );
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

            {/* Tasa real (solo información) */}
            <div className="form-group">
              <label>Tasa de Interés</label>
              <div className="tasa-fija-info">
                <span className="tasa-valor">{tasaActual.porcentaje}% </span>
              </div>
              <small>Tasa aplicable a este empeño</small>
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

            {/* TARJETA DE SIMULACIÓN - ESTILO TICKET */}
            {simulacionPago.monto_prestado > 0 && (
              <div className="ticket-preview full-width">
                <div className="ticket-preview-header">
                  <h2>OPHALINE</h2>
                  <p className="ticket-lema">La que brinda apoyo</p>
                  <p className="ticket-rfc">RFC: OPH123456789</p>
                  <p className="ticket-direccion">Calle 60 #123, Centro, Mérida, Yucatán</p>
                  <p className="ticket-tel">Tel: 999 123 4567</p>
                </div>

                <div className="ticket-preview-body">
                  {/* Folio y fechas */}
                  <div className="ticket-folio-section">
                    <div className="folio-group">
                      <span className="folio-label">FOLIO:</span>
                      <span className="folio-valor">PREVIEW-{Date.now().toString(36).toUpperCase()}</span>
                    </div>
                    <div className="fechas-group">
                      <p><span className="label">Emisión</span> {new Date().toLocaleDateString('es-MX')}</p>
                      <p><span className="label">Vencimiento</span> {simulacionPago.fecha_vencimiento ? new Date(simulacionPago.fecha_vencimiento).toLocaleDateString('es-MX') : '--/--/----'}</p>
                    </div>
                  </div>

                  {/* Cliente */}
                  <div className="ticket-cliente-section">
                    <h3>CLIENTE</h3>
                    <div className="cliente-grid">
                      <p><span>Nombre</span> {selectedCliente?.label || 'Por seleccionar'}</p>
                      <p><span>RFC</span> XXXX010101000</p>
                      <p><span>Teléfono</span> {selectedCliente?.telefono || '--- --- ----'}</p>
                      <p><span>Email</span> {selectedCliente?.correo || 'cliente@email.com'}</p>
                    </div>
                  </div>

                  {/* Detalle del empeño */}
                  <div className="ticket-articulo-section">
                    <h3>DETALLE DEL EMPEÑO</h3>
                    <table className="ticket-tabla">
                      <thead>
                        <tr>
                          <th>Descripción</th>
                          <th className="text-center">Cant.</th>
                          <th className="text-right">P.Unitario</th>
                          <th className="text-right">Importe</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>{selectedPrenda?.label || 'Artículo pendiente'}</td>
                          <td className="text-center">1</td>
                          <td className="text-right">{formatMoney(simulacionPago.monto_prestado)}</td>
                          <td className="text-right">{formatMoney(simulacionPago.monto_prestado)}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Desglose */}
                  <div className="ticket-desglose">
                    <div className="desglose-fila">
                      <span>Capital:</span>
                      <span>{formatMoney(simulacionPago.monto_prestado)}</span>
                    </div>
                    <div className="desglose-fila">
                      <span>Intereses:</span>
                      <span>{formatMoney(simulacionPago.interes)}</span>
                    </div>
                    <div className="desglose-fila">
                      <span>IVA (16% sobre intereses):</span>
                      <span>{formatMoney(simulacionPago.iva)}</span>
                    </div>
                    <div className="desglose-fila total">
                      <span>TOTAL A PAGAR:</span>
                      <span>{formatMoney(simulacionPago.total)}</span>
                    </div>
                  </div>

                  {/* Información de pago */}
                  <div className="ticket-pago-info">
                    <div className="pago-info-item">
                      <span className="label">Método de pago sugerido:</span>
                      <span className="valor">Efectivo / Transferencia</span>
                    </div>
                    <div className="pago-info-item">
                      <span className="label">Refrendo mensual:</span>
                      <span className="valor">{formatMoney(simulacionPago.refrendo)}</span>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="ticket-footer-preview">
                    <div className="ticket-notas">
                      <p><strong>Nota:</strong> Este es un preview del ticket que se generará al registrar el empeño.</p>
                      <p className="ticket-garantia">* Artículo en garantía hasta 30 días después del vencimiento</p>
                      <p className="ticket-refrendo">* El refrendo mensual cubre únicamente intereses + IVA. El capital se paga al recuperar la prenda.</p>
                    </div>
                  </div>

                  {/* Sello */}
                  <div className="ticket-sello">
                    <p>Sello digital: PREVIEW-{Date.now().toString(36).toUpperCase()}</p>
                    <p>www.ophelina.mx/verificar</p>
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

      {/* MODAL PRENDA - CON IMAGEN */}
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

              {/* ✅ CAMPO PARA SUBIR IMAGEN */}
              <div className="form-group">
                <label>Imagen de la prenda</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/gif,image/webp"
                    onChange={handleImagenChange}
                    ref={inputImagenRef}
                    style={{ flex: 1 }}
                  />
                  {previewImagen && (
                    <button
                      type="button"
                      onClick={quitarImagen}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#dc3545',
                        cursor: 'pointer',
                        padding: '4px'
                      }}
                      title="Quitar imagen"
                    >
                      <DeleteIcon />
                    </button>
                  )}
                </div>
                <small style={{ color: '#6c757d', fontSize: '11px' }}>
                  Formatos: JPG, PNG, GIF, WEBP | Máx: 5MB
                </small>

                {/* Preview de la imagen */}
                {previewImagen && (
                  <div style={{ marginTop: '10px', position: 'relative' }}>
                    <img
                      src={previewImagen}
                      alt="Preview de la prenda"
                      style={{
                        maxWidth: '100%',
                        maxHeight: '200px',
                        borderRadius: '8px',
                        objectFit: 'cover',
                        border: '1px solid #e9ecef'
                      }}
                    />
                  </div>
                )}

                {/* Indicador de subida */}
                {subiendoImagen && (
                  <div style={{ marginTop: '8px', color: '#f59e0b', fontSize: '13px' }}>
                    ⏳ Subiendo imagen...
                  </div>
                )}
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setIsCreatingPrenda(false)}>Cancelar</button>
              <button className="btn-gold" onClick={crearNuevaPrenda} disabled={subiendoImagen}>
                {subiendoImagen ? "Subiendo imagen..." : "Crear Prenda"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/*  NUEVO: Modal de mensaje (éxito/error) — reemplaza todos los alert() */}
      <ModalMensaje
        visible={modalMensaje.visible}
        tipo={modalMensaje.tipo}
        titulo={modalMensaje.titulo}
        texto={modalMensaje.texto}
        textoBoton={modalMensaje.textoBoton}
        onCerrar={cerrarModalMensaje}
      />
    </div>
  );
};

export default NuevoEmpeno;