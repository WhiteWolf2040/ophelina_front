import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import api from "../config/api";
import "./Configuraciones.css";
import { useFacturacion, useSuscripcionFallback } from "../hooks/useCargaUnaVez";

// Iconos
import BusinessIcon from '@mui/icons-material/Business';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import BadgeIcon from '@mui/icons-material/Badge';
import PercentIcon from '@mui/icons-material/Percent';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import StoreIcon from '@mui/icons-material/Store';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import SettingsIcon from '@mui/icons-material/Settings';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';

// ✅ NUEVOS iconos para secciones adicionales
import TuneIcon from '@mui/icons-material/Tune';
import ScheduleIcon from '@mui/icons-material/Schedule';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import DiamondIcon from '@mui/icons-material/Diamond';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import CategoryIcon from '@mui/icons-material/Category';
import SecurityIcon from '@mui/icons-material/Security';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import PublicIcon from '@mui/icons-material/Public';
import CloseIcon from '@mui/icons-material/Close';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import RefreshIcon from '@mui/icons-material/Refresh';

// Secciones editables de configuración: campos que edita cada una y endpoint al que se envían
const SECCIONES = {
  plazos: { url: "operacion", campos: ["plazo_base_dias", "dias_gracia", "aviso_vencimiento_dias", "frecuencia_amortizacion"] },
  mora: { url: "operacion", campos: ["interes_moratorio", "recargo_fijo_dia", "castigo_venta_pct"] },
  avaluo: { url: "operacion", campos: ["max_pct_avaluo", "monto_min_operacion", "monto_max_operacion"] },
  fiscal: { url: "fiscal", campos: ["regimen_fiscal", "email_facturacion"] },
  notificaciones: {
    url: "notificaciones",
    campos: [
      "notif_email_activo", "notif_email_dias",
      "notif_whatsapp_activo", "notif_whatsapp_dias",
      "notif_dueno_activo", "notif_dueno_hora",
      "notif_recordatorio_pago_activo", "notif_recordatorio_pago_dias",
      "notif_stock_bajo_activo"
    ]
  },
  portal: { url: "portal", campos: ["portal_activo", "portal_mensaje", "portal_campos"] }
};

const FRECUENCIAS = { semanal: "Semanal", quincenal: "Quincenal", mensual: "Mensual" };

const CAMPOS_PORTAL = { prenda: "Prenda", monto: "Monto", vencimiento: "Vencimiento", saldo: "Saldo" };

const REGIMENES = [
  "601 - General de Ley Personas Morales",
  "603 - Personas Morales con Fines no Lucrativos",
  "605 - Sueldos y Salarios e Ingresos Asimilados a Salarios",
  "612 - Personas Físicas con Actividades Empresariales y Profesionales",
  "621 - Incorporación Fiscal",
  "626 - Régimen Simplificado de Confianza"
];

const Configuraciones = () => {
  const {
    empresa,
    usuarios,
    interes,
    suscripcion: suscripcionContext,
    actualizarEmpresa,
    actualizarInteres,
    setModalUsuarioAbierto,
    setUsuarioEditando,
    abrirModalEliminar
  } = useOutletContext();

  const [editandoEmpresa, setEditandoEmpresa] = useState(false);
  const [editandoInteres, setEditandoInteres] = useState(false);
  const [empresaForm, setEmpresaForm] = useState(empresa);
  const [interesForm, setInteresForm] = useState(interes);

  // ✅ CAMBIO: estado de guardado y error para el bloque de intereses
  const [guardandoInteres, setGuardandoInteres] = useState(false);
  const [errorInteres, setErrorInteres] = useState("");

  // ✅ Estado de tab activo
  const [tabActiva, setTabActiva] = useState("general");

  // ===== SUCURSALES (datos reales del back: /sucursales) =====
  const [sucursales, setSucursales] = useState([]);
  const [modalSucursal, setModalSucursal] = useState(false);
  const [sucursalForm, setSucursalForm] = useState(null);
  const [errorSucursal, setErrorSucursal] = useState("");
  const [guardandoSucursal, setGuardandoSucursal] = useState(false);

  const cargarSucursales = async () => {
    try {
      const { data } = await api.get("/sucursales");
      setSucursales(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("No se pudieron cargar las sucursales", e);
    }
  };

  useEffect(() => {
    cargarSucursales();
  }, []);

  const abrirSucursal = (s = null) => {
    setErrorSucursal("");
    setSucursalForm(
      s
        ? { ...s }
        : { nombre: "", encargado: "", telefono: "", direccion: "", activa: true }
    );
    setModalSucursal(true);
  };

  const cerrarSucursal = () => {
    if (guardandoSucursal) return;
    setModalSucursal(false);
  };

  const guardarSucursal = async (e) => {
    e.preventDefault();
    setErrorSucursal("");
    setGuardandoSucursal(true);
    try {
      if (sucursalForm.id_sucursal) {
        await api.put(`/sucursales/${sucursalForm.id_sucursal}`, sucursalForm);
      } else {
        await api.post("/sucursales", sucursalForm);
      }
      setModalSucursal(false);
      cargarSucursales();
    } catch (err) {
      setErrorSucursal(err.response?.data?.message || "No se pudo guardar la sucursal.");
    } finally {
      setGuardandoSucursal(false);
    }
  };

  const eliminarSucursal = async (s) => {
    if (!window.confirm(`¿Eliminar "${s.nombre}"?`)) return;
    try {
      await api.delete(`/sucursales/${s.id_sucursal}`);
      cargarSucursales();
    } catch (err) {
      alert(err.response?.data?.error || "No se pudo eliminar.");
    }
  };

  // ===== CONFIGURACIÓN (datos reales del back: /configuracion) =====
  const [cfg, setCfg] = useState(null);
  const [cargandoCfg, setCargandoCfg] = useState(true);
  const [seccionEditando, setSeccionEditando] = useState(null);
  const [cfgForm, setCfgForm] = useState({});
  const [guardandoCfg, setGuardandoCfg] = useState(false);
  const [errorGuardarCfg, setErrorGuardarCfg] = useState("");

  const [modalCategoria, setModalCategoria] = useState(false);
  const [categoriaForm, setCategoriaForm] = useState(null);
  const [errorCategoria, setErrorCategoria] = useState("");
  const [guardandoCategoria, setGuardandoCategoria] = useState(false);

  const cargarConfiguracion = async () => {
    setCargandoCfg(true);
    try {
      const { data } = await api.get("/configuracion");
      setCfg(data);
    } catch (e) {
      console.error("No se pudo cargar la configuración", e);
    } finally {
      setCargandoCfg(false);
    }
  };

  useEffect(() => {
    cargarConfiguracion();
  }, []);

  const mensajeError = (err, porDefecto) => {
    const errs = err.response?.data?.errors;
    if (errs) return Object.values(errs).flat().join(" ");
    return err.response?.data?.message || porDefecto;
  };

  const setF = (campo, valor) => setCfgForm((f) => ({ ...f, [campo]: valor }));

  const editarSeccion = (key) => {
    if (!cfg) return;
    const base = {};
    SECCIONES[key].campos.forEach((campo) => {
      base[campo] = cfg.config[campo];
    });
    if (base.notif_dueno_hora) base.notif_dueno_hora = String(base.notif_dueno_hora).slice(0, 5);
    if ("portal_campos" in base) base.portal_campos = Array.isArray(base.portal_campos) ? [...base.portal_campos] : [];
    setErrorGuardarCfg("");
    setCfgForm(base);
    setSeccionEditando(key);
  };

  const cancelarSeccion = () => {
    if (guardandoCfg) return;
    setSeccionEditando(null);
    setErrorGuardarCfg("");
  };

  const guardarSeccion = async (e) => {
    e.preventDefault();
    setErrorGuardarCfg("");
    setGuardandoCfg(true);
    try {
      const { data } = await api.put(`/configuracion/${SECCIONES[seccionEditando].url}`, cfgForm);
      setCfg((prev) => ({ ...prev, config: data }));
      setSeccionEditando(null);
    } catch (err) {
      setErrorGuardarCfg(mensajeError(err, "No se pudo guardar la configuración."));
    } finally {
      setGuardandoCfg(false);
    }
  };

  const abrirCategoria = (cat = null) => {
    setErrorCategoria("");
    setCategoriaForm(cat ? { ...cat } : { nombre: "", avaluo_pct: 50, activa: true });
    setModalCategoria(true);
  };

  const cerrarCategoria = () => {
    if (guardandoCategoria) return;
    setModalCategoria(false);
  };

  const guardarCategoria = async (e) => {
    e.preventDefault();
    setErrorCategoria("");
    setGuardandoCategoria(true);
    try {
      if (categoriaForm.id_categoria) {
        await api.put(`/configuracion/categorias/${categoriaForm.id_categoria}`, categoriaForm);
      } else {
        await api.post("/configuracion/categorias", categoriaForm);
      }
      setModalCategoria(false);
      cargarConfiguracion();
    } catch (err) {
      setErrorCategoria(mensajeError(err, "No se pudo guardar la categoría."));
    } finally {
      setGuardandoCategoria(false);
    }
  };

  const eliminarCategoria = async (cat) => {
    if (!window.confirm(`¿Eliminar la categoría "${cat.nombre}"?`)) return;
    try {
      await api.delete(`/configuracion/categorias/${cat.id_categoria}`);
      cargarConfiguracion();
    } catch (err) {
      alert(mensajeError(err, "No se pudo eliminar la categoría."));
    }
  };

  // Atajos de lectura
  const c = cfg?.config || {};
  const categorias = cfg?.categorias || [];
  const stats = cfg?.notificaciones_stats || {};

  // Piezas reutilizables de JSX (se llaman como funciones, no como componentes)
  const sinCfg = (
    <div className="plan-vacio">
      {cargandoCfg ? (
        <p>Cargando configuración...</p>
      ) : (
        <>
          <p>No se pudo cargar la configuración.</p>
          <button className="btn-cancel" type="button" onClick={cargarConfiguracion}>
            Reintentar
          </button>
        </>
      )}
    </div>
  );

  const cabecera = (Icono, titulo, key) => (
    <div className="section-header">
      <h3>
        <Icono className="section-icon" />
        {titulo}
      </h3>
      {seccionEditando !== key && (
        <button className="btn-editar-small" type="button" onClick={() => editarSeccion(key)}>
          <EditIcon fontSize="small" />
          Editar
        </button>
      )}
    </div>
  );

  const botonesForm = () => (
    <>
      {errorGuardarCfg && <p className="plan-error">{errorGuardarCfg}</p>}
      <div className="form-buttons">
        <button type="submit" className="btn-gold" disabled={guardandoCfg}>
          <SaveIcon fontSize="small" />
          {guardandoCfg ? "Guardando..." : "Guardar Cambios"}
        </button>
        <button type="button" className="btn-cancel" onClick={cancelarSeccion} disabled={guardandoCfg}>
          <CancelIcon fontSize="small" />
          Cancelar
        </button>
      </div>
    </>
  );

  const itemInfo = (Icono, etiqueta, valor, completo = false) => (
    <div className={`info-item ${completo ? "full-width" : ""}`}>
      <span className="info-label"><Icono fontSize="small" /> {etiqueta}:</span>
      <span className="info-value">{valor}</span>
    </div>
  );

  const inputNum = (campo, etiqueta, Icono, extra = {}) => (
    <div className="form-group">
      <label><Icono fontSize="small" /> {etiqueta}</label>
      <input
        type="number"
        required
        value={cfgForm[campo] ?? ""}
        onChange={(e) => setF(campo, e.target.value)}
        {...extra}
      />
    </div>
  );

  const filaNotif = (Icono, etiqueta, campoActivo, extra) => (
    <div className="form-group full-width">
      <label><Icono fontSize="small" /> {etiqueta}</label>
      <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
        <label style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <input
            type="checkbox"
            style={{ width: "auto" }}
            checked={!!cfgForm[campoActivo]}
            onChange={(e) => setF(campoActivo, e.target.checked)}
          />
          Activo
        </label>
        {extra}
      </div>
    </div>
  );

  const textoNotif = (activo, detalle) => (activo ? (detalle ? `Activo · ${detalle}` : "Activo") : "Inactivo");
  const textoDias = (n, sufijo) => `${n} ${Number(n) === 1 ? "día" : "días"} ${sufijo}`;

  // ===== SUSCRIPCIÓN Y FACTURACIÓN: se cargan una sola vez (caché compartido) =====
  const {
    datos: suscripcionLocal,
    cargando: cargandoSusc,
    cargar: cargarSuscripcion,
    refrescar: refrescarSuscripcion,
  } = useSuscripcionFallback();
  const suscripcion = suscripcionContext || suscripcionLocal;

  const {
    datos: facturacion,
    listo: facturacionLista,
    cargando: cargandoFact,
    error: errorFact,
    cargadoEn: facturacionCargadaEn,
    cargar: cargarFacturacion,
    refrescar: refrescarFacturacion,
  } = useFacturacion();

  useEffect(() => {
    if (tabActiva !== "plan") return;
    if (!suscripcionContext) cargarSuscripcion();
    cargarFacturacion();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabActiva]);

  const minutosDesdeCarga = facturacionCargadaEn
    ? Math.floor((Date.now() - facturacionCargadaEn) / 60000)
    : null;

  const refrescarPlan = () => {
    refrescarFacturacion();
    if (!suscripcionContext) refrescarSuscripcion();
  };

  // ===== MODALES =====
  const [modalHistorial, setModalHistorial] = useState(false);
  const [modalPlanes, setModalPlanes] = useState(false);
  const [procesandoPlan, setProcesandoPlan] = useState(null);
  const [errorPlan, setErrorPlan] = useState("");

  const elegirPlan = async (planId) => {
    setProcesandoPlan(planId);
    setErrorPlan("");
    try {
      const { data } = await api.post("/stripe/cambiar-plan", { plan_id: planId });
      if (!data?.url) throw new Error("Sin URL");
      window.location.href = data.url;
    } catch (error) {
      setErrorPlan(error.response?.data?.error || "No se pudo iniciar el cambio de plan. Intenta de nuevo.");
      setProcesandoPlan(null);
    }
  };

  // Estados para paginación de usuarios
  const [paginaActual, setPaginaActual] = useState(1);
  const usuariosPorPagina = 6;

  const indiceUltimo = paginaActual * usuariosPorPagina;
  const indicePrimero = indiceUltimo - usuariosPorPagina;
  const usuariosActuales = usuarios.slice(indicePrimero, indiceUltimo);
  const totalPaginas = Math.ceil(usuarios.length / usuariosPorPagina);

  const handleEmpresaSubmit = (e) => {
    e.preventDefault();
    actualizarEmpresa(empresaForm);
    setEditandoEmpresa(false);
  };

  // ✅ CAMBIO CLAVE: guardar la tasa en /configuracion/intereses (tabla tasas_interes),
  // notificar a NuevoEmpeno y reflejar el cambio en la UI de Configuraciones.
  const handleInteresSubmit = async (e) => {
    e.preventDefault();
    setErrorInteres("");
    setGuardandoInteres(true);

    try {
      const porcentaje = parseFloat(interesForm.porcentaje);

      if (Number.isNaN(porcentaje) || porcentaje < 0 || porcentaje > 100) {
        throw new Error("El porcentaje debe ser un número entre 0 y 100.");
      }

      // 1) Persistir en la tabla real que consulta NuevoEmpeno
      await api.put("/configuracion/intereses", { porcentaje });

      // 2) Reflejar en el estado compartido (para que esta pantalla muestre el nuevo %)
      if (typeof actualizarInteres === "function") {
        try { await Promise.resolve(actualizarInteres(interesForm)); } catch (_) { /* no-op */ }
      }

      // 3) Avisar a NuevoEmpeno en la misma pestaña
      window.dispatchEvent(new Event("tasa:actualizada"));

      // 4) Avisar a otras pestañas abiertas (si las hay)
      if (typeof BroadcastChannel !== "undefined") {
        const bc = new BroadcastChannel("tasa");
        bc.postMessage({ tipo: "actualizada" });
        bc.close();
      }

      setEditandoInteres(false);
    } catch (err) {
      console.error("No se pudo actualizar la tasa", err);
      setErrorInteres(err.response?.data?.message || err.message || "No se pudo guardar la tasa de interés.");
    } finally {
      setGuardandoInteres(false);
    }
  };

  const cambiarPagina = (numeroPagina) => setPaginaActual(numeroPagina);
  const irPaginaSiguiente = () => setPaginaActual(prev => Math.min(prev + 1, totalPaginas));
  const irPaginaAnterior = () => setPaginaActual(prev => Math.max(prev - 1, 1));

  const obtenerNumerosPagina = () => {
    const numeros = [];
    const maxPaginasVisibles = 5;
    let inicio = Math.max(1, paginaActual - Math.floor(maxPaginasVisibles / 2));
    let fin = Math.min(totalPaginas, inicio + maxPaginasVisibles - 1);

    if (fin - inicio + 1 < maxPaginasVisibles) {
      inicio = Math.max(1, fin - maxPaginasVisibles + 1);
    }

    for (let i = inicio; i <= fin; i++) numeros.push(i);
    return numeros;
  };

  // ============================================
  // ✅ SUSCRIPCIÓN: helpers para el tab "Plan"
  // ============================================
  const formatearFecha = (fecha) => {
    if (!fecha) return "—";
    const [anio, mes, dia] = fecha.split("-").map(Number);
    return new Date(anio, mes - 1, dia).toLocaleDateString("es-MX", {
      day: "numeric",
      month: "long",
      year: "numeric"
    });
  };

  const textoEstado = () => {
    if (!suscripcion) {
      return cargandoSusc ? "Cargando..." : "No se pudo obtener la suscripción";
    }
    const d = suscripcion.dias_restantes;
    switch (suscripcion.estado) {
      case "activa":
        return d === null || d === undefined ? "Activo" : `Activo · ${d} días restantes`;
      case "por_vencer":
        return d === 0
          ? "Por vencer · vence hoy"
          : `Por vencer · ${d} ${d === 1 ? "día restante" : "días restantes"}`;
      case "en_gracia":
        return "Pago pendiente · tu acceso sigue activo unos días más";
      case "vencida":
        return d < 0
          ? `Vencida · hace ${Math.abs(d)} ${Math.abs(d) === 1 ? "día" : "días"}`
          : "Suscripción cancelada o inactiva";
      default:
        return "Sin plan activo";
    }
  };

  const colorEstado = {
    activa: "#2e7d32",
    por_vencer: "#ed9c00",
    en_gracia: "#ed9c00",
    vencida: "#d32f2f",
    sin_plan: "#9e9e9e"
  }[suscripcion?.estado] || "#9e9e9e";

  const formatearFechaISO = (iso) =>
    iso ? new Date(iso).toLocaleDateString("es-MX", { day: "numeric", month: "short", year: "numeric" }) : "—";

  const formatearMoneda = (monto, moneda = "MXN") =>
    new Intl.NumberFormat("es-MX", { style: "currency", currency: moneda }).format(monto || 0);

  const MARCAS = { visa: "Visa", mastercard: "Mastercard", amex: "American Express" };

  const esGratis = Number(suscripcion?.precio_mensual || 0) === 0;
  const facturas = facturacion?.facturas || [];
  const ultimaFactura = facturas.find((f) => f.estado === "paid") || facturas[0];
  const planesDisponibles = facturacion?.planes || [];

  const textoMetodoPago = () => {
    if (errorFact) return "No se pudo cargar";
    if (!facturacionLista) return "Cargando...";
    if (esGratis || !facturacion?.tiene_stripe) return "No requerido (plan gratuito)";
    const mp = facturacion?.metodo_pago;
    if (!mp) return "Sin método de pago registrado";
    const marca = MARCAS[mp.marca] || mp.marca;
    return `${marca} •••• ${mp.ultimos4} · vence ${String(mp.exp_mes).padStart(2, "0")}/${String(mp.exp_anio).slice(-2)}`;
  };

  const textoUltimaFactura = () => {
    if (errorFact) return "No se pudo cargar";
    if (!facturacionLista) return "Cargando...";
    if (!ultimaFactura) return "Aún no hay facturas";
    return `${ultimaFactura.numero || "Factura"} · ${formatearMoneda(ultimaFactura.monto, ultimaFactura.moneda)}`;
  };

  const avisoEstado = {
    por_vencer: "Tu plan está por vencer. Se renovará automáticamente con tu tarjeta.",
    en_gracia: "No pudimos confirmar tu pago. Conservas el acceso unos días más; revisa tu método de pago.",
    vencida: "Tu plan no está activo. Elige un plan para recuperar el acceso.",
  }[suscripcion?.estado];


  return (
    <div className="configuraciones-container">
      <h2 className="page-title">
        <SettingsIcon className="title-icon" />
        Configuraciones
      </h2>

      {/* ✅ TABS DE NAVEGACIÓN */}
      <div className="config-tabs">
        <button
          className={`config-tab ${tabActiva === "general" ? "activo" : ""}`}
          onClick={() => setTabActiva("general")}
        >
          <BusinessIcon fontSize="small" />
          General
        </button>
        <button
          className={`config-tab ${tabActiva === "operacion" ? "activo" : ""}`}
          onClick={() => setTabActiva("operacion")}
        >
          <TuneIcon fontSize="small" />
          Operación
        </button>
        <button
          className={`config-tab ${tabActiva === "fiscal" ? "activo" : ""}`}
          onClick={() => setTabActiva("fiscal")}
        >
          <ReceiptLongIcon fontSize="small" />
          Fiscal
        </button>
        <button
          className={`config-tab ${tabActiva === "notificaciones" ? "activo" : ""}`}
          onClick={() => setTabActiva("notificaciones")}
        >
          <NotificationsActiveIcon fontSize="small" />
          Notificaciones
        </button>
        <button
          className={`config-tab ${tabActiva === "plan" ? "activo" : ""}`}
          onClick={() => setTabActiva("plan")}
        >
          <CreditCardIcon fontSize="small" />
          Plan
        </button>
        <button
          className={`config-tab ${tabActiva === "avanzado" ? "activo" : ""}`}
          onClick={() => setTabActiva("avanzado")}
        >
          <SecurityIcon fontSize="small" />
          Avanzado
        </button>
      </div>

      {/* ============================================ */}
      {/* TAB: GENERAL (empresa + sucursales) */}
      {/* ============================================ */}
      {tabActiva === "general" && (
        <>
          {/* SECCIÓN EMPRESA (existente) */}
          <div className="config-section">
            <div className="section-header">
              <h3>
                <BusinessIcon className="section-icon" />
                Información de la Empresa
              </h3>
              {!editandoEmpresa && (
                <button className="btn-editar-small" onClick={() => setEditandoEmpresa(true)}>
                  <EditIcon fontSize="small" />
                  Editar
                </button>
              )}
            </div>

            {editandoEmpresa ? (
              <form onSubmit={handleEmpresaSubmit} className="empresa-form">
                <div className="form-grid">
                  <div className="form-group">
                    <label><BusinessIcon fontSize="small" /> Nombre de la Empresa</label>
                    <input
                      value={empresaForm.nombre}
                      onChange={(e) => setEmpresaForm({...empresaForm, nombre: e.target.value})}
                      required
                      placeholder="Ej: Ophelina S.A. de C.V."
                    />
                  </div>
                  <div className="form-group">
                    <label><BadgeIcon fontSize="small" /> RFC</label>
                    <input
                      value={empresaForm.rfc}
                      onChange={(e) => setEmpresaForm({...empresaForm, rfc: e.target.value})}
                      required
                      placeholder="Ej: OPH123456789"
                    />
                  </div>
                  <div className="form-group">
                    <label><PhoneIcon fontSize="small" /> Teléfono</label>
                    <input
                      value={empresaForm.telefono}
                      onChange={(e) => setEmpresaForm({...empresaForm, telefono: e.target.value})}
                      required
                      placeholder="Ej: 999 123 4567"
                    />
                  </div>
                  <div className="form-group">
                    <label><EmailIcon fontSize="small" /> Email</label>
                    <input
                      type="email"
                      value={empresaForm.email}
                      onChange={(e) => setEmpresaForm({...empresaForm, email: e.target.value})}
                      required
                      placeholder="Ej: contacto@ophelina.mx"
                    />
                  </div>
                  <div className="form-group full-width">
                    <label><LocationOnIcon fontSize="small" /> Dirección</label>
                    <input
                      value={empresaForm.direccion}
                      onChange={(e) => setEmpresaForm({...empresaForm, direccion: e.target.value})}
                      required
                      placeholder="Ej: Calle 60 #123, Centro, Mérida"
                    />
                  </div>
                </div>
                <div className="form-buttons">
                  <button type="submit" className="btn-gold">
                    <SaveIcon fontSize="small" />
                    Guardar Cambios
                  </button>
                  <button type="button" className="btn-cancel" onClick={() => setEditandoEmpresa(false)}>
                    <CancelIcon fontSize="small" />
                    Cancelar
                  </button>
                </div>
              </form>
            ) : (
              <div className="empresa-info">
                <div className="info-grid">
                  <div className="info-item">
                    <span className="info-label"><BusinessIcon fontSize="small" /> Nombre:</span>
                    <span className="info-value">{empresa.nombre}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label"><BadgeIcon fontSize="small" /> RFC:</span>
                    <span className="info-value">{empresa.rfc}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label"><PhoneIcon fontSize="small" /> Teléfono:</span>
                    <span className="info-value">{empresa.telefono}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label"><EmailIcon fontSize="small" /> Email:</span>
                    <span className="info-value">{empresa.email}</span>
                  </div>
                  <div className="info-item full-width">
                    <span className="info-label"><LocationOnIcon fontSize="small" /> Dirección:</span>
                    <span className="info-value">{empresa.direccion}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ✅ SECCIÓN SUCURSALES (conectada al back) */}
          <div className="config-section">
            <div className="section-header">
              <h3>
                <StoreIcon className="section-icon" />
                Sucursales ({sucursales.length})
              </h3>
              <button className="btn-nuevo" type="button" onClick={() => abrirSucursal()}>
                <AddIcon fontSize="small" />
                Agregar Sucursal
              </button>
            </div>

            <div className="sucursales-lista">
              {sucursales.length > 0 ? (
                sucursales.map(sucursal => (
                  <div key={sucursal.id_sucursal} className="sucursal-card">
                    <div className="sucursal-header">
                      <StoreIcon className="sucursal-icon" />
                      <div className="sucursal-nombre">
                        <strong>
                          {sucursal.nombre}
                          {sucursal.es_matriz ? " (Matriz)" : ""}
                        </strong>
                        {sucursal.encargado && (
                          <span className="sucursal-encargado">
                            <PersonIcon /> {sucursal.encargado}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="sucursal-detalles">
                      {sucursal.telefono && (
                        <div className="sucursal-detalle">
                          <PhoneIcon className="detalle-icon" />
                          <span>{sucursal.telefono}</span>
                        </div>
                      )}
                      {sucursal.direccion && (
                        <div className="sucursal-detalle">
                          <LocationOnIcon className="detalle-icon" />
                          <span>{sucursal.direccion}</span>
                        </div>
                      )}
                    </div>
                    <div className="sucursal-acciones">
                      <button
                        className="btn-icono"
                        type="button"
                        title="Editar"
                        onClick={() => abrirSucursal(sucursal)}
                      >
                        <EditIcon fontSize="small" />
                      </button>
                      {!sucursal.es_matriz && (
                        <button
                          className="btn-icono"
                          type="button"
                          title="Eliminar"
                          onClick={() => eliminarSucursal(sucursal)}
                        >
                          <DeleteIcon fontSize="small" />
                        </button>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="sin-resultados">
                  <StoreIcon className="empty-icon" />
                  <p>Aún no hay sucursales registradas</p>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* ============================================ */}
      {/* TAB: OPERACIÓN (intereses, plazos, mora, avalúo, categorías) */}
      {/* ============================================ */}
      {tabActiva === "operacion" && (
        <>
          {/* SECCIÓN INTERESES (✅ CAMBIO: ahora persiste en /configuracion/intereses) */}
          <div className="config-section">
            <div className="section-header">
              <h3>
                <PercentIcon className="section-icon" />
                Configuración de Intereses
              </h3>
              {!editandoInteres && (
                <button className="btn-editar-small" onClick={() => { setErrorInteres(""); setEditandoInteres(true); }}>
                  <EditIcon fontSize="small" />
                  Editar
                </button>
              )}
            </div>

            {editandoInteres ? (
              <form onSubmit={handleInteresSubmit} className="interes-form">
                <div className="form-grid">
                  <div className="form-group">
                    <label><PercentIcon fontSize="small" /> Porcentaje de Interés (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="100"
                      value={interesForm.porcentaje}
                      onChange={(e) => setInteresForm({...interesForm, porcentaje: e.target.value})}
                      required
                      placeholder="Ej: 12.5"
                    />
                  </div>
                  <div className="form-group">
                    <label><AttachMoneyIcon fontSize="small" /> Monto Mínimo ($)</label>
                    <input
                      type="number"
                      value={interesForm.minimo}
                      onChange={(e) => setInteresForm({...interesForm, minimo: e.target.value})}
                      required
                      placeholder="Ej: 1000"
                    />
                  </div>
                  <div className="form-group">
                    <label><AttachMoneyIcon fontSize="small" /> Monto Máximo ($)</label>
                    <input
                      type="number"
                      value={interesForm.maximo}
                      onChange={(e) => setInteresForm({...interesForm, maximo: e.target.value})}
                      required
                      placeholder="Ej: 50000"
                    />
                  </div>
                </div>

                {/* ✅ CAMBIO: mostrar error de guardado si lo hay */}
                {errorInteres && (
                  <p className="plan-error" style={{ marginTop: 8 }}>{errorInteres}</p>
                )}

                <div className="form-buttons">
                  <button type="submit" className="btn-gold" disabled={guardandoInteres}>
                    <SaveIcon fontSize="small" />
                    {guardandoInteres ? "Guardando..." : "Guardar Cambios"}
                  </button>
                  <button
                    type="button"
                    className="btn-cancel"
                    onClick={() => { setEditandoInteres(false); setErrorInteres(""); }}
                    disabled={guardandoInteres}
                  >
                    <CancelIcon fontSize="small" />
                    Cancelar
                  </button>
                </div>
              </form>
            ) : (
              <div className="interes-info">
                <div className="info-grid">
                  <div className="info-item">
                    <span className="info-label"><PercentIcon fontSize="small" /> Interés actual:</span>
                    <span className="info-value">{interes.porcentaje}%</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label"><AttachMoneyIcon fontSize="small" /> Monto mínimo:</span>
                    <span className="info-value">${Number(interes.minimo || 0).toLocaleString()}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label"><AttachMoneyIcon fontSize="small" /> Monto máximo:</span>
                    <span className="info-value">${Number(interes.maximo || 0).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {!cfg ? sinCfg : (
            <>
              {/* PLAZOS Y VENCIMIENTOS */}
              <div className="config-section">
                {cabecera(ScheduleIcon, "Plazos y Vencimientos", "plazos")}
                {seccionEditando === "plazos" ? (
                  <form onSubmit={guardarSeccion} className="interes-form">
                    <div className="form-grid">
                      {inputNum("plazo_base_dias", "Plazo base del empeño (días)", ScheduleIcon, { min: 1, max: 730, step: 1 })}
                      {inputNum("dias_gracia", "Días de gracia", ScheduleIcon, { min: 0, max: 365, step: 1 })}
                      {inputNum("aviso_vencimiento_dias", "Aviso de vencimiento (días antes)", WarningAmberIcon, { min: 0, max: 90, step: 1 })}
                      <div className="form-group">
                        <label><ScheduleIcon fontSize="small" /> Frecuencia de amortización</label>
                        <select
                          value={cfgForm.frecuencia_amortizacion || "mensual"}
                          onChange={(e) => setF("frecuencia_amortizacion", e.target.value)}
                        >
                          {Object.entries(FRECUENCIAS).map(([valor, texto]) => (
                            <option key={valor} value={valor}>{texto}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    {botonesForm()}
                  </form>
                ) : (
                  <div className="info-grid">
                    {itemInfo(ScheduleIcon, "Plazo base del empeño", `${c.plazo_base_dias} días`)}
                    {itemInfo(ScheduleIcon, "Días de gracia", `${c.dias_gracia} días`)}
                    {itemInfo(WarningAmberIcon, "Aviso de vencimiento", `${c.aviso_vencimiento_dias} días antes`)}
                    {itemInfo(ScheduleIcon, "Frecuencia de amortización", FRECUENCIAS[c.frecuencia_amortizacion] || c.frecuencia_amortizacion)}
                  </div>
                )}
              </div>

              {/* MORA Y RECARGOS */}
              <div className="config-section">
                {cabecera(WarningAmberIcon, "Mora y Recargos", "mora")}
                {seccionEditando === "mora" ? (
                  <form onSubmit={guardarSeccion} className="interes-form">
                    <div className="form-grid">
                      {inputNum("interes_moratorio", "Interés moratorio adicional (%)", PercentIcon, { min: 0, max: 100, step: 0.01 })}
                      {inputNum("recargo_fijo_dia", "Recargo fijo por día ($)", AttachMoneyIcon, { min: 0, step: 0.01 })}
                      {inputNum("castigo_venta_pct", "% castigo (al vender)", PercentIcon, { min: 0, max: 100, step: 0.01 })}
                    </div>
                    {botonesForm()}
                  </form>
                ) : (
                  <div className="info-grid">
                    {itemInfo(PercentIcon, "Interés moratorio", `${c.interes_moratorio}% adicional`)}
                    {itemInfo(AttachMoneyIcon, "Recargo fijo por día", formatearMoneda(c.recargo_fijo_dia))}
                    {itemInfo(PercentIcon, "% castigo (al vender)", `${c.castigo_venta_pct}%`)}
                  </div>
                )}
              </div>

              {/* AVALÚO Y PRÉSTAMO */}
              <div className="config-section">
                {cabecera(DiamondIcon, "Avalúo y Préstamo", "avaluo")}
                {seccionEditando === "avaluo" ? (
                  <form onSubmit={guardarSeccion} className="interes-form">
                    <div className="form-grid">
                      {inputNum("max_pct_avaluo", "% máximo sobre avalúo", PercentIcon, { min: 1, max: 100, step: 0.01 })}
                      {inputNum("monto_min_operacion", "Mínimo por operación ($)", AttachMoneyIcon, { min: 0, step: 0.01 })}
                      {inputNum("monto_max_operacion", "Máximo por operación ($)", AttachMoneyIcon, { min: 0, step: 0.01 })}
                    </div>
                    {botonesForm()}
                  </form>
                ) : (
                  <div className="info-grid">
                    {itemInfo(PercentIcon, "% máximo sobre avalúo", `${c.max_pct_avaluo}%`)}
                    {itemInfo(AttachMoneyIcon, "Mínimo por operación", formatearMoneda(c.monto_min_operacion))}
                    {itemInfo(AttachMoneyIcon, "Máximo por operación", formatearMoneda(c.monto_max_operacion))}
                  </div>
                )}
              </div>

              {/* CATEGORÍAS DE PRENDAS */}
              <div className="config-section">
                <div className="section-header">
                  <h3>
                    <CategoryIcon className="section-icon" />
                    Categorías de Prendas ({categorias.length})
                  </h3>
                  <button className="btn-nuevo" type="button" onClick={() => abrirCategoria()}>
                    <AddIcon fontSize="small" />
                    Agregar Categoría
                  </button>
                </div>
                <div className="categorias-lista">
                  {categorias.length > 0 ? (
                    categorias.map((cat) => (
                      <div key={cat.id_categoria} className="categoria-item">
                        <div className="categoria-info">
                          <CategoryIcon className="categoria-icon" />
                          <div>
                            <strong>{cat.nombre}{cat.activa ? "" : " (inactiva)"}</strong>
                            <span className="categoria-avaluo">Avalúo: {cat.avaluo_pct}%</span>
                          </div>
                        </div>
                        <div className="categoria-acciones">
                          <button className="btn-icono" type="button" title="Editar" onClick={() => abrirCategoria(cat)}>
                            <EditIcon fontSize="small" />
                          </button>
                          <button className="btn-icono" type="button" title="Eliminar" onClick={() => eliminarCategoria(cat)}>
                            <DeleteIcon fontSize="small" />
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="sin-resultados">
                      <CategoryIcon className="empty-icon" />
                      <p>Aún no hay categorías registradas</p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </>
      )}

      {/* ============================================ */}
      {/* TAB: FISCAL (datos fiscales) */}
      {/* ============================================ */}
      {tabActiva === "fiscal" && (
        !cfg ? sinCfg : (
          <div className="config-section">
            {cabecera(ReceiptLongIcon, "Datos Fiscales y Facturación", "fiscal")}
            {seccionEditando === "fiscal" ? (
              <form onSubmit={guardarSeccion} className="empresa-form">
                <div className="form-grid">
                  <div className="form-group full-width">
                    <label><BadgeIcon fontSize="small" /> Régimen fiscal (SAT)</label>
                    <select
                      value={cfgForm.regimen_fiscal || ""}
                      onChange={(e) => setF("regimen_fiscal", e.target.value)}
                    >
                      <option value="">Sin definir</option>
                      {(cfgForm.regimen_fiscal && !REGIMENES.includes(cfgForm.regimen_fiscal)
                        ? [cfgForm.regimen_fiscal, ...REGIMENES]
                        : REGIMENES
                      ).map((r) => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group full-width">
                    <label><EmailIcon fontSize="small" /> Email para facturas</label>
                    <input
                      type="email"
                      value={cfgForm.email_facturacion || ""}
                      onChange={(e) => setF("email_facturacion", e.target.value)}
                      placeholder="Ej: facturacion@tuempresa.mx"
                    />
                  </div>
                </div>
                <p className="plan-modal-nota">
                  El RFC, la razón social y el domicilio fiscal se toman de "Información de la Empresa" (pestaña General).
                </p>
                {botonesForm()}
              </form>
            ) : (
              <div className="info-grid">
                {itemInfo(BadgeIcon, "Régimen fiscal (SAT)", c.regimen_fiscal || "Sin definir")}
                {itemInfo(BadgeIcon, "RFC", cfg.fiscal?.rfc || "—")}
                {itemInfo(BusinessIcon, "Razón social", cfg.fiscal?.razon_social || "—")}
                {itemInfo(
                  LocationOnIcon,
                  "Domicilio fiscal",
                  [cfg.fiscal?.domicilio, cfg.fiscal?.codigo_postal && `C.P. ${cfg.fiscal.codigo_postal}`]
                    .filter(Boolean)
                    .join(", ") || "—",
                  true
                )}
                {itemInfo(EmailIcon, "Email para facturas", c.email_facturacion || "Sin definir")}
              </div>
            )}
          </div>
        )
      )}

      {/* ============================================ */}
      {/* TAB: NOTIFICACIONES */}
      {/* ============================================ */}
      {tabActiva === "notificaciones" && (
        !cfg ? sinCfg : (
          <>
            <div className="config-section">
              {cabecera(NotificationsActiveIcon, "Notificaciones y Recordatorios", "notificaciones")}
              {seccionEditando === "notificaciones" ? (
                <form onSubmit={guardarSeccion} className="empresa-form">
                  <div className="form-grid">
                    {filaNotif(EmailIcon, "Email al cliente", "notif_email_activo", (
                      <>
                        <input
                          type="number" min="0" max="90" required style={{ width: 90 }}
                          value={cfgForm.notif_email_dias ?? ""}
                          onChange={(e) => setF("notif_email_dias", e.target.value)}
                        />
                        <span>días antes del vencimiento</span>
                      </>
                    ))}
                    {filaNotif(PhoneIcon, "WhatsApp al cliente", "notif_whatsapp_activo", (
                      <>
                        <input
                          type="number" min="0" max="90" required style={{ width: 90 }}
                          value={cfgForm.notif_whatsapp_dias ?? ""}
                          onChange={(e) => setF("notif_whatsapp_dias", e.target.value)}
                        />
                        <span>días antes del vencimiento</span>
                      </>
                    ))}
                    {filaNotif(NotificationsActiveIcon, "Aviso al dueño (vencidos)", "notif_dueno_activo", (
                      <>
                        <span>Todos los días a las</span>
                        <input
                          type="time" required style={{ width: 130 }}
                          value={cfgForm.notif_dueno_hora ?? ""}
                          onChange={(e) => setF("notif_dueno_hora", e.target.value)}
                        />
                      </>
                    ))}
                    {filaNotif(EmailIcon, "Recordatorio de pago", "notif_recordatorio_pago_activo", (
                      <>
                        <input
                          type="number" min="0" max="30" required style={{ width: 90 }}
                          value={cfgForm.notif_recordatorio_pago_dias ?? ""}
                          onChange={(e) => setF("notif_recordatorio_pago_dias", e.target.value)}
                        />
                        <span>días antes del pago</span>
                      </>
                    ))}
                    {filaNotif(NotificationsActiveIcon, "Alerta de stock bajo", "notif_stock_bajo_activo", null)}
                  </div>
                  {botonesForm()}
                </form>
              ) : (
                <div className="info-grid">
                  {itemInfo(EmailIcon, "Email al cliente", textoNotif(c.notif_email_activo, `${textoDias(c.notif_email_dias, "antes del vencimiento")}`))}
                  {itemInfo(PhoneIcon, "WhatsApp al cliente", textoNotif(c.notif_whatsapp_activo, `${textoDias(c.notif_whatsapp_dias, "antes del vencimiento")}`))}
                  {itemInfo(NotificationsActiveIcon, "Aviso al dueño (vencidos)", textoNotif(c.notif_dueno_activo, `Diario ${String(c.notif_dueno_hora || "").slice(0, 5)}`))}
                  {itemInfo(EmailIcon, "Recordatorio de pago", textoNotif(c.notif_recordatorio_pago_activo, textoDias(c.notif_recordatorio_pago_dias, "antes")))}
                  {itemInfo(NotificationsActiveIcon, "Alerta de stock bajo", textoNotif(c.notif_stock_bajo_activo, ""))}
                </div>
              )}
            </div>

            {/* ACTIVIDAD REAL DE AVISOS (viene de empeno y clientes) */}
            <div className="config-section">
              <div className="section-header">
                <h3>
                  <PhoneIcon className="section-icon" />
                  Actividad de avisos por WhatsApp
                </h3>
              </div>
              <div className="info-grid">
                {itemInfo(PersonIcon, "Clientes que aceptan WhatsApp", stats.clientes_whatsapp ?? 0)}
                {itemInfo(PhoneIcon, "Avisos enviados", stats.avisos_whatsapp_enviados ?? 0)}
                {itemInfo(ScheduleIcon, "Último aviso", formatearFechaISO(stats.ultimo_aviso_whatsapp))}
              </div>
            </div>
          </>
        )
      )}

      {/* ============================================ */}
      {/* TAB: PLAN Y SUSCRIPCIÓN (datos reales del back) */}
      {/* ============================================ */}
      {tabActiva === "plan" && (
        <div className="config-section">
          <div className="section-header">
            <h3>
              <CreditCardIcon className="section-icon" />
              Plan y Suscripción
            </h3>

            
          </div>
          
          <div className="plan-actual-card">
            <div className="plan-badge">PREMIUM</div>
            <h4>Plan Premium (Empresarial)</h4>
            <p className="plan-precio">$1,499 <span>/ mes</span></p>
            <p className="plan-fecha">Próximo cobro: 15 de mayo de 2026</p>
            <p className="plan-estado"><strong>Estado:</strong> Activo · 32 días restantes</p>
          </div>
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label"><CreditCardIcon fontSize="small" /> Método de pago:</span>
              <span className="info-value">Visa •••• 4242</span>
            </div>
            <div className="info-item">
              <span className="info-label"><ReceiptLongIcon fontSize="small" /> Última factura:</span>
              <span className="info-value">F-2026-0089 · $1,499.00</span>
            </div>
          </div>
          <div className="form-buttons">
            <button className="btn-gold" type="button">
              Cambiar de plan
            </button>
            <button className="btn-cancel" type="button">
              Historial de pagos

            </button>
          </div>

          {!suscripcion ? (
            <div className="plan-vacio">
              {cargandoSusc ? (
                <p>Cargando suscripción...</p>
              ) : (
                <>
                  <p>No se pudo obtener la suscripción.</p>
                  <button className="btn-cancel" type="button" onClick={() => cargarSuscripcion(true)}>
                    Reintentar
                  </button>
                </>
              )}
            </div>
          ) : (
            <>
              {avisoEstado && (
                <div className={`plan-aviso plan-aviso-${suscripcion.estado}`}>{avisoEstado}</div>
              )}

              <div className="plan-actual-card">
                <div className="plan-badge">
                  {(suscripcion.plan_nombre || "—").toUpperCase()}
                </div>
                <h4>Plan {suscripcion.plan_nombre || "—"}</h4>
                <p className="plan-precio">
                  {esGratis ? "Gratis" : (
                    <>
                      ${Number(suscripcion.precio_mensual).toLocaleString("es-MX")} <span>/ mes</span>
                    </>
                  )}
                </p>
                <p className="plan-fecha">Vigente desde: {formatearFecha(suscripcion.fecha_inicio)}</p>
                <p className="plan-fecha">Vence el: {formatearFecha(suscripcion.fecha_fin)}</p>
                <p className="plan-estado">
                  <strong>Estado:</strong>{" "}
                  <span style={{ color: colorEstado, fontWeight: 600 }}>{textoEstado()}</span>
                </p>
              </div>

              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label"><CreditCardIcon fontSize="small" /> Método de pago:</span>
                  <span className="info-value">{textoMetodoPago()}</span>
                </div>
                <div className="info-item">
                  <span className="info-label"><ReceiptLongIcon fontSize="small" /> Última factura:</span>
                  <span className="info-value">
                    {textoUltimaFactura()}
                    {ultimaFactura?.url && (
                      <>
                        {" "}
                        <a href={ultimaFactura.url} target="_blank" rel="noopener noreferrer" className="link-recibo">
                          Ver recibo <OpenInNewIcon style={{ fontSize: 14 }} />
                        </a>
                      </>
                    )}
                  </span>
                </div>
              </div>

              {errorFact && (
                <div className="plan-vacio">
                  <button className="btn-cancel" type="button" onClick={() => cargarFacturacion(true)}>
                    Reintentar datos de facturación
                  </button>
                </div>
              )}

              <div className="form-buttons">
                <button
                  className="btn-gold"
                  type="button"
                  onClick={() => { setErrorPlan(""); setModalPlanes(true); }}
                >
                  {esGratis ? "Mejorar plan" : "Cambiar de plan"}
                </button>
                <button className="btn-cancel" type="button" onClick={() => setModalHistorial(true)}>
                  Historial de pagos
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* ============================================ */}
      {/* TAB: AVANZADO (seguridad + portal cliente) */}
      {/* ============================================ */}
      {tabActiva === "avanzado" && (
        !cfg ? sinCfg : (
          <>
            {/* SEGURIDAD */}
            <div className="config-section">
              <div className="section-header">
                <h3>
                  <SecurityIcon className="section-icon" />
                  Seguridad y Acceso
                </h3>
              </div>
              <div className="info-grid">
                {itemInfo(
                  SecurityIcon,
                  "Última sesión",
                  cfg.seguridad?.ultimo_acceso
                    ? new Date(cfg.seguridad.ultimo_acceso).toLocaleString("es-MX", { dateStyle: "medium", timeStyle: "short" })
                    : "—"
                )}
              </div>
              <div className="form-buttons">
                <button className="btn-cancel" type="button">
                  Cambiar contraseña
                </button>
              </div>
            </div>

            {/* PORTAL DEL CLIENTE */}
            <div className="config-section">
              {cabecera(PublicIcon, "Portal del Cliente (B2C)", "portal")}
              {seccionEditando === "portal" ? (
                <form onSubmit={guardarSeccion} className="empresa-form">
                  <div className="form-grid">
                    <div className="form-group full-width">
                      <label style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <input
                          type="checkbox"
                          style={{ width: "auto" }}
                          checked={!!cfgForm.portal_activo}
                          onChange={(e) => setF("portal_activo", e.target.checked)}
                        />
                        Portal activo
                      </label>
                    </div>
                    <div className="form-group full-width">
                      <label><PublicIcon fontSize="small" /> Mensaje de bienvenida</label>
                      <textarea
                        rows={3}
                        maxLength={500}
                        value={cfgForm.portal_mensaje || ""}
                        onChange={(e) => setF("portal_mensaje", e.target.value)}
                        placeholder="Ej: Bienvenido, aquí puedes consultar tus empeños."
                      />
                    </div>
                    <div className="form-group full-width">
                      <label><PublicIcon fontSize="small" /> Campos visibles</label>
                      <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                        {Object.entries(CAMPOS_PORTAL).map(([valor, texto]) => (
                          <label key={valor} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <input
                              type="checkbox"
                              style={{ width: "auto" }}
                              checked={(cfgForm.portal_campos || []).includes(valor)}
                              onChange={(e) =>
                                setF(
                                  "portal_campos",
                                  e.target.checked
                                    ? [...(cfgForm.portal_campos || []), valor]
                                    : (cfgForm.portal_campos || []).filter((v) => v !== valor)
                                )
                              }
                            />
                            {texto}
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                  {botonesForm()}
                </form>
              ) : (
                <div className="info-grid">
                  {itemInfo(PublicIcon, "Portal activo", c.portal_activo ? "Sí" : "No")}
                  {itemInfo(PublicIcon, "Mensaje de bienvenida", c.portal_mensaje || "Sin mensaje")}
                  {itemInfo(
                    PublicIcon,
                    "Campos visibles",
                    (c.portal_campos || []).map((v) => CAMPOS_PORTAL[v] || v).join(", ") || "Ninguno"
                  )}
                </div>
              )}
            </div>
          </>
        )
      )}

      {/* ============================================ */}
      {/* SECCIÓN EMPLEADOS — siempre visible */}
      {/* ============================================ */}
      <div className="config-section">
        <div className="section-header">
          <h3>
            <PersonIcon className="section-icon" />
            Empleados ({usuarios.length})
          </h3>
          <button className="btn-nuevo" onClick={() => setModalUsuarioAbierto(true)}>
            <AddIcon fontSize="small" />
            Agregar Usuario
          </button>
        </div>

        <div className="usuarios-lista">
          {usuariosActuales.length > 0 ? (
            usuariosActuales.map(usuario => (
              <div key={usuario.id} className="usuario-card">
                <div className="usuario-info">
                  <div className="usuario-nombre">
                    <AssignmentIndIcon className="usuario-icon" />
                    <strong>{usuario.nombre} {usuario.apellido}</strong>
                    <span className="usuario-rol">{usuario.rol}</span>
                  </div>
                  <div className="usuario-email">
                    <EmailIcon fontSize="small" className="email-icon" />
                    {usuario.email}
                  </div>
                </div>
                <div className="usuario-acciones">
                  <button
                    className="btn-icono"
                    onClick={() => {
                      setUsuarioEditando(usuario);
                      setModalUsuarioAbierto(true);
                    }}
                    title="Editar"
                  >
                    <EditIcon fontSize="small" />
                  </button>
                  <button
                    className="btn-icono"
                    onClick={() => abrirModalEliminar(usuario)}
                    title="Eliminar"
                  >
                    <DeleteIcon fontSize="small" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="sin-resultados">
              <PersonIcon className="empty-icon" />
              <p>No hay usuarios registrados</p>
            </div>
          )}
        </div>

        {/* PAGINACIÓN */}
        {totalPaginas > 1 && (
          <div className="paginacion-wrapper">
            <div className="paginacion-container">
              <button
                className="btn-paginacion"
                onClick={irPaginaAnterior}
                disabled={paginaActual === 1}
              >
                <ChevronLeftIcon />
              </button>

              <div className="paginacion-numeros">
                {obtenerNumerosPagina().map(numero => (
                  <button
                    key={numero}
                    className={`btn-pagina ${paginaActual === numero ? 'activo' : ''}`}
                    onClick={() => cambiarPagina(numero)}
                  >
                    {numero}
                  </button>
                ))}
              </div>

              <button
                className="btn-paginacion"
                onClick={irPaginaSiguiente}
                disabled={paginaActual === totalPaginas}
              >
                <ChevronRightIcon />
              </button>
            </div>
            <div className="paginacion-info">
              Mostrando {indicePrimero + 1} - {Math.min(indiceUltimo, usuarios.length)} de {usuarios.length} usuarios
            </div>
          </div>
        )}
      </div>

      {/* MODAL: SUCURSAL (nueva / editar) */}
      {modalSucursal && sucursalForm && (
        <div className="plan-modal-overlay" onClick={cerrarSucursal}>
          <div className="plan-modal" onClick={(e) => e.stopPropagation()}>
            <div className="plan-modal-header">
              <h3>
                <StoreIcon className="section-icon" />{" "}
                {sucursalForm.id_sucursal ? "Editar sucursal" : "Nueva sucursal"}
              </h3>
              <button
                className="btn-icono"
                type="button"
                onClick={cerrarSucursal}
                disabled={guardandoSucursal}
              >
                <CloseIcon fontSize="small" />
              </button>
            </div>

            <form onSubmit={guardarSucursal} className="empresa-form">
              <div className="form-grid">
                <div className="form-group">
                  <label><StoreIcon fontSize="small" /> Nombre</label>
                  <input
                    required
                    value={sucursalForm.nombre}
                    onChange={(e) => setSucursalForm({ ...sucursalForm, nombre: e.target.value })}
                    placeholder="Ej: Sucursal Norte"
                  />
                </div>
                <div className="form-group">
                  <label><PersonIcon fontSize="small" /> Encargado</label>
                  <input
                    value={sucursalForm.encargado || ""}
                    onChange={(e) => setSucursalForm({ ...sucursalForm, encargado: e.target.value })}
                    placeholder="Ej: María García"
                  />
                </div>
                <div className="form-group">
                  <label><PhoneIcon fontSize="small" /> Teléfono</label>
                  <input
                    value={sucursalForm.telefono || ""}
                    onChange={(e) => setSucursalForm({ ...sucursalForm, telefono: e.target.value })}
                    placeholder="Ej: 999 123 4567"
                  />
                </div>
                <div className="form-group full-width">
                  <label><LocationOnIcon fontSize="small" /> Dirección</label>
                  <input
                    value={sucursalForm.direccion || ""}
                    onChange={(e) => setSucursalForm({ ...sucursalForm, direccion: e.target.value })}
                    placeholder="Ej: Calle 21 #456, García Ginerés, Mérida"
                  />
                </div>
              </div>

              {errorSucursal && <p className="plan-error">{errorSucursal}</p>}

              <div className="form-buttons">
                <button type="submit" className="btn-gold" disabled={guardandoSucursal}>
                  <SaveIcon fontSize="small" />
                  {guardandoSucursal ? "Guardando..." : "Guardar"}
                </button>
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={cerrarSucursal}
                  disabled={guardandoSucursal}
                >
                  <CancelIcon fontSize="small" />
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CATEGORÍA DE PRENDA (nueva / editar) */}
      {modalCategoria && categoriaForm && (
        <div className="plan-modal-overlay" onClick={cerrarCategoria}>
          <div className="plan-modal" onClick={(e) => e.stopPropagation()}>
            <div className="plan-modal-header">
              <h3>
                <CategoryIcon className="section-icon" />{" "}
                {categoriaForm.id_categoria ? "Editar categoría" : "Nueva categoría"}
              </h3>
              <button className="btn-icono" type="button" onClick={cerrarCategoria} disabled={guardandoCategoria}>
                <CloseIcon fontSize="small" />
              </button>
            </div>

            <form onSubmit={guardarCategoria} className="empresa-form">
              <div className="form-grid">
                <div className="form-group">
                  <label><CategoryIcon fontSize="small" /> Nombre</label>
                  <input
                    required
                    value={categoriaForm.nombre}
                    onChange={(e) => setCategoriaForm({ ...categoriaForm, nombre: e.target.value })}
                    placeholder="Ej: Anillos de oro"
                  />
                </div>
                <div className="form-group">
                  <label><PercentIcon fontSize="small" /> Avalúo (%)</label>
                  <input
                    type="number" required min="0" max="100" step="0.01"
                    value={categoriaForm.avaluo_pct}
                    onChange={(e) => setCategoriaForm({ ...categoriaForm, avaluo_pct: e.target.value })}
                  />
                </div>
                <div className="form-group full-width">
                  <label style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <input
                      type="checkbox"
                      style={{ width: "auto" }}
                      checked={!!categoriaForm.activa}
                      onChange={(e) => setCategoriaForm({ ...categoriaForm, activa: e.target.checked })}
                    />
                    Categoría activa
                  </label>
                </div>
              </div>

              {errorCategoria && <p className="plan-error">{errorCategoria}</p>}

              <div className="form-buttons">
                <button type="submit" className="btn-gold" disabled={guardandoCategoria}>
                  <SaveIcon fontSize="small" />
                  {guardandoCategoria ? "Guardando..." : "Guardar"}
                </button>
                <button type="button" className="btn-cancel" onClick={cerrarCategoria} disabled={guardandoCategoria}>
                  <CancelIcon fontSize="small" />
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: HISTORIAL DE PAGOS */}
      {modalHistorial && (
        <div className="plan-modal-overlay" onClick={() => setModalHistorial(false)}>
          <div className="plan-modal" onClick={(e) => e.stopPropagation()}>
            <div className="plan-modal-header">
              <h3><ReceiptLongIcon className="section-icon" /> Historial de pagos</h3>
              <button className="btn-icono" type="button" onClick={() => setModalHistorial(false)}>
                <CloseIcon fontSize="small" />
              </button>
            </div>

            {errorFact ? (
              <p className="plan-vacio">No se pudo cargar el historial.</p>
            ) : !facturacionLista ? (
              <p className="plan-vacio">Cargando...</p>
            ) : facturas.length === 0 ? (
              <p className="plan-vacio">Aún no hay pagos registrados.</p>
            ) : (
              <div className="tabla-facturas-wrapper">
                <table className="tabla-facturas">
                  <thead>
                    <tr>
                      <th>Fecha</th>
                      <th>Factura</th>
                      <th>Monto</th>
                      <th>Estado</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {facturas.map((f) => (
                      <tr key={f.id}>
                        <td>{formatearFechaISO(f.fecha)}</td>
                        <td>{f.numero || "—"}</td>
                        <td>{formatearMoneda(f.monto, f.moneda)}</td>
                        <td>
                          <span className={`chip-factura chip-${f.estado}`}>
                            {{ paid: "Pagada", open: "Pendiente", uncollectible: "Incobrable", void: "Anulada" }[f.estado] || f.estado}
                          </span>
                        </td>
                        <td>
                          {f.url && (
                            <a href={f.url} target="_blank" rel="noopener noreferrer" className="link-recibo">
                              Ver
                            </a>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL: CAMBIAR DE PLAN */}
      {modalPlanes && (
        <div
          className="plan-modal-overlay"
          onClick={() => !procesandoPlan && setModalPlanes(false)}
        >
          <div className="plan-modal" onClick={(e) => e.stopPropagation()}>
            <div className="plan-modal-header">
              <div className="plan-modal-titulo">
                <div className="plan-modal-icon-wrapper">
                  <CreditCardIcon className="section-icon" />
                </div>
                <h3>Elige tu plan</h3>
              </div>
              <button
                className="btn-cerrar-modal"
                type="button"
                aria-label="Cerrar modal"
                onClick={() => setModalPlanes(false)}
                disabled={!!procesandoPlan}
              >
                <CloseIcon fontSize="small" />
              </button>
            </div>

            <div className="plan-modal-nota">
              <p>
                Pagarás de forma segura en <strong>Stripe</strong>. El nuevo plan se cobra completo hoy e inicia un nuevo mes de servicio. Tu plan anterior se cancelará automáticamente sin reembolso por el tiempo restante.
              </p>
            </div>

            {planesDisponibles.length === 0 ? (
              <div className="plan-vacio">
                <p>No hay planes disponibles por ahora.</p>
              </div>
            ) : (
              <div className="planes-opciones">
                {planesDisponibles.map((p) => {
                  const esActual =
                    p.id_plan === suscripcion?.plan_id &&
                    facturacion?.tiene_stripe &&
                    suscripcion?.estado !== "vencida";

                  return (
                    <div
                      key={p.id_plan}
                      className={`plan-opcion ${esActual ? "actual" : ""}`}
                    >
                      <div className="plan-opcion-header">
                        <span className="plan-nombre">{p.nombre}</span>
                        {esActual && <span className="plan-badge-actual">Actual</span>}
                      </div>

                      <div className="plan-opcion-precio">
                        <span className="precio-monto">
                          ${Number(p.precio_mensual).toLocaleString("es-MX")}
                        </span>
                        <span className="precio-periodo">/ mes</span>
                      </div>

                      <button
                        className={`btn-plan ${esActual ? "btn-plan-actual" : "btn-gold"}`}
                        type="button"
                        disabled={esActual || !!procesandoPlan}
                        onClick={() => elegirPlan(p.id_plan)}
                      >
                        {esActual
                          ? "Plan actual"
                          : procesandoPlan === p.id_plan
                          ? "Redirigiendo..."
                          : "Elegir plan"}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            {errorPlan && <div className="plan-error">{errorPlan}</div>}
          </div>
        </div>
      )}
    </div>
  );
};

export default Configuraciones;