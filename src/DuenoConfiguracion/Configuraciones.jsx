import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import api from "../config/api";
import "./Configuraciones.css";

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

  // ✅ Estado de tab activo
  const [tabActiva, setTabActiva] = useState("general");

  // ✅ Suscripción: usa la del layout si existe; si no, la pide directo a /user
  const [suscripcion, setSuscripcion] = useState(suscripcionContext || null);
  const [cargandoSusc, setCargandoSusc] = useState(false);

  useEffect(() => {
    if (tabActiva !== "plan" || suscripcion) return;

    let cancelado = false;
    const cargarSuscripcion = async () => {
      setCargandoSusc(true);
      try {
        const response = await api.get("/user");
        console.log("📦 /user respuesta:", response.data);
        const susc = response.data?.data?.usuario?.suscripcion;
        if (!cancelado && susc) setSuscripcion(susc);
      } catch (error) {
        console.error("Error cargando suscripción", error);
      } finally {
        if (!cancelado) setCargandoSusc(false);
      }
    };
    cargarSuscripcion();

    return () => { cancelado = true; };
  }, [tabActiva, suscripcion]);

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

  const handleInteresSubmit = (e) => {
    e.preventDefault();
    actualizarInteres(interesForm);
    setEditandoInteres(false);
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
    // fecha viene como "2026-10-21"; se separa para evitar desfase de zona horaria
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
        return `Activo · ${d} días restantes`;
      case "por_vencer":
        return d === 0
          ? "Por vencer · vence hoy"
          : `Por vencer · ${d} ${d === 1 ? "día restante" : "días restantes"}`;
      case "vencida":
        return `Vencida · hace ${Math.abs(d)} ${Math.abs(d) === 1 ? "día" : "días"}`;
      default:
        return "Sin plan activo";
    }
  };

  const colorEstado = {
    activa: "#2e7d32",
    por_vencer: "#ed9c00",
    vencida: "#d32f2f",
    sin_plan: "#9e9e9e"
  }[suscripcion?.estado] || "#9e9e9e";

  // ✅ Datos hardcodeados para las nuevas secciones (solo maqueta)
  const sucursalesHardcoded = [
    {
      id: 1,
      nombre: "Casa Matriz - Centro",
      encargado: "Juan Pérez",
      telefono: "999 123 4567",
      direccion: "Calle 60 #123, Centro, Mérida, Yuc.",
      activa: true
    },
    {
      id: 2,
      nombre: "Sucursal Norte",
      encargado: "María García",
      telefono: "999 987 6543",
      direccion: "Calle 21 #456, García Ginerés, Mérida, Yuc.",
      activa: true
    }
  ];

  const categoriasHardcoded = [
    { id: 1, nombre: "Anillos de oro", avaluo: 65, activa: true },
    { id: 2, nombre: "Cadenas y pulseras", avaluo: 60, activa: true },
    { id: 3, nombre: "Relojes", avaluo: 45, activa: true },
    { id: 4, nombre: "Electrónicos", avaluo: 40, activa: true },
    { id: 5, nombre: "Celulares", avaluo: 50, activa: true }
  ];

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

          {/* ✅ NUEVO: SECCIÓN SUCURSALES */}
          <div className="config-section">
            <div className="section-header">
              <h3>
                <StoreIcon className="section-icon" />
                Sucursales ({sucursalesHardcoded.length})
              </h3>
              <button className="btn-nuevo" type="button">
                <AddIcon fontSize="small" />
                Agregar Sucursal
              </button>
            </div>

            <div className="sucursales-lista">
              {sucursalesHardcoded.map(sucursal => (
                <div key={sucursal.id} className="sucursal-card">
                  <div className="sucursal-header">
                    <StoreIcon className="sucursal-icon" />
                    <div className="sucursal-nombre">
                      <strong>{sucursal.nombre}</strong>
                      <span className="sucursal-encargado">
                        <PersonIcon /> {sucursal.encargado}
                      </span>
                    </div>
                  </div>
                  <div className="sucursal-detalles">
                    <div className="sucursal-detalle">
                      <PhoneIcon className="detalle-icon" />
                      <span>{sucursal.telefono}</span>
                    </div>
                    <div className="sucursal-detalle">
                      <LocationOnIcon className="detalle-icon" />
                      <span>{sucursal.direccion}</span>
                    </div>
                  </div>
                  <div className="sucursal-acciones">
                    <button className="btn-icono" type="button" title="Editar">
                      <EditIcon fontSize="small" />
                    </button>
                    <button className="btn-icono" type="button" title="Eliminar">
                      <DeleteIcon fontSize="small" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* ============================================ */}
      {/* TAB: OPERACIÓN (plazos, mora, avalúo, categorías, interés) */}
      {/* ============================================ */}
      {tabActiva === "operacion" && (
        <>
          {/* SECCIÓN INTERESES (existente) */}
          <div className="config-section">
            <div className="section-header">
              <h3>
                <PercentIcon className="section-icon" />
                Configuración de Intereses
              </h3>
              {!editandoInteres && (
                <button className="btn-editar-small" onClick={() => setEditandoInteres(true)}>
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
                <div className="form-buttons">
                  <button type="submit" className="btn-gold">
                    <SaveIcon fontSize="small" />
                    Guardar Cambios
                  </button>
                  <button type="button" className="btn-cancel" onClick={() => setEditandoInteres(false)}>
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
                    <span className="info-value">${interes.minimo.toLocaleString()}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label"><AttachMoneyIcon fontSize="small" /> Monto máximo:</span>
                    <span className="info-value">${interes.maximo.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ✅ NUEVO: PLAZOS Y VENCIMIENTOS */}
          <div className="config-section">
            <div className="section-header">
              <h3>
                <ScheduleIcon className="section-icon" />
                Plazos y Vencimientos
              </h3>
              <button className="btn-editar-small" type="button">
                <EditIcon fontSize="small" />
                Editar
              </button>
            </div>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label"><ScheduleIcon fontSize="small" /> Plazo base del empeño:</span>
                <span className="info-value">60 días</span>
              </div>
              <div className="info-item">
                <span className="info-label"><ScheduleIcon fontSize="small" /> Días de gracia:</span>
                <span className="info-value">10 días</span>
              </div>
              <div className="info-item">
                <span className="info-label"><WarningAmberIcon fontSize="small" /> Aviso de vencimiento:</span>
                <span className="info-value">7 días antes</span>
              </div>
              <div className="info-item">
                <span className="info-label"><ScheduleIcon fontSize="small" /> Frecuencia de amortización:</span>
                <span className="info-value">Mensual</span>
              </div>
            </div>
          </div>

          {/* ✅ NUEVO: MORA Y RECARGOS */}
          <div className="config-section">
            <div className="section-header">
              <h3>
                <WarningAmberIcon className="section-icon" />
                Mora y Recargos
              </h3>
              <button className="btn-editar-small" type="button">
                <EditIcon fontSize="small" />
                Editar
              </button>
            </div>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label"><PercentIcon fontSize="small" /> Interés moratorio:</span>
                <span className="info-value">5% adicional</span>
              </div>
              <div className="info-item">
                <span className="info-label"><AttachMoneyIcon fontSize="small" /> Recargo fijo por día:</span>
                <span className="info-value">$20.00</span>
              </div>
              <div className="info-item">
                <span className="info-label"><PercentIcon fontSize="small" /> % castigo (al vender):</span>
                <span className="info-value">20%</span>
              </div>
            </div>
          </div>

          {/* ✅ NUEVO: AVALÚO Y PRÉSTAMO */}
          <div className="config-section">
            <div className="section-header">
              <h3>
                <DiamondIcon className="section-icon" />
                Avalúo y Préstamo
              </h3>
              <button className="btn-editar-small" type="button">
                <EditIcon fontSize="small" />
                Editar
              </button>
            </div>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label"><PercentIcon fontSize="small" /> % máximo sobre avalúo:</span>
                <span className="info-value">60%</span>
              </div>
              <div className="info-item">
                <span className="info-label"><AttachMoneyIcon fontSize="small" /> Mínimo por operación:</span>
                <span className="info-value">$500</span>
              </div>
              <div className="info-item">
                <span className="info-label"><AttachMoneyIcon fontSize="small" /> Máximo por operación:</span>
                <span className="info-value">$50,000</span>
              </div>
            </div>
          </div>

          {/* ✅ NUEVO: CATEGORÍAS DE PRENDAS */}
          <div className="config-section">
            <div className="section-header">
              <h3>
                <CategoryIcon className="section-icon" />
                Categorías de Prendas ({categoriasHardcoded.length})
              </h3>
              <button className="btn-nuevo" type="button">
                <AddIcon fontSize="small" />
                Agregar Categoría
              </button>
            </div>
            <div className="categorias-lista">
              {categoriasHardcoded.map(cat => (
                <div key={cat.id} className="categoria-item">
                  <div className="categoria-info">
                    <CategoryIcon className="categoria-icon" />
                    <div>
                      <strong>{cat.nombre}</strong>
                      <span className="categoria-avaluo">Avalúo: {cat.avaluo}%</span>
                    </div>
                  </div>
                  <div className="categoria-acciones">
                    <button className="btn-icono" type="button" title="Editar">
                      <EditIcon fontSize="small" />
                    </button>
                    <button className="btn-icono" type="button" title="Eliminar">
                      <DeleteIcon fontSize="small" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* ============================================ */}
      {/* TAB: FISCAL (datos fiscales) */}
      {/* ============================================ */}
      {tabActiva === "fiscal" && (
        <div className="config-section">
          <div className="section-header">
            <h3>
              <ReceiptLongIcon className="section-icon" />
              Datos Fiscales y Facturación
            </h3>
            <button className="btn-editar-small" type="button">
              <EditIcon fontSize="small" />
              Editar
            </button>
          </div>
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label"><BadgeIcon fontSize="small" /> Régimen fiscal (SAT):</span>
              <span className="info-value">601 - General de Ley Personas Morales</span>
            </div>
            <div className="info-item">
              <span className="info-label"><BusinessIcon fontSize="small" /> Razón social:</span>
              <span className="info-value">Ophelina S.A. de C.V.</span>
            </div>
            <div className="info-item full-width">
              <span className="info-label"><LocationOnIcon fontSize="small" /> Domicilio fiscal:</span>
              <span className="info-value">Calle 60 #123, Centro, Mérida, Yuc., C.P. 97000</span>
            </div>
            <div className="info-item">
              <span className="info-label"><EmailIcon fontSize="small" /> Email para facturas:</span>
              <span className="info-value">facturacion@ophelina.mx</span>
            </div>
            <div className="info-item">
              <span className="info-label"><ReceiptLongIcon fontSize="small" /> Último CFDI:</span>
              <span className="info-value">A-2026-00123 (15/03/2026)</span>
            </div>
          </div>
        </div>
      )}

      {/* ============================================ */}
      {/* TAB: NOTIFICACIONES */}
      {/* ============================================ */}
      {tabActiva === "notificaciones" && (
        <div className="config-section">
          <div className="section-header">
            <h3>
              <NotificationsActiveIcon className="section-icon" />
              Notificaciones y Recordatorios
            </h3>
            <button className="btn-editar-small" type="button">
              <EditIcon fontSize="small" />
              Editar
            </button>
          </div>
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label"><EmailIcon fontSize="small" /> Email al cliente:</span>
              <span className="info-value">Activo · 7 días antes del vencimiento</span>
            </div>
            <div className="info-item">
              <span className="info-label"><PhoneIcon fontSize="small" /> WhatsApp al cliente:</span>
              <span className="info-value">Activo · 3 días antes del vencimiento</span>
            </div>
            <div className="info-item">
              <span className="info-label"><NotificationsActiveIcon fontSize="small" /> Aviso al dueño (vencidos):</span>
              <span className="info-value">Activo · Diario 9:00 AM</span>
            </div>
            <div className="info-item">
              <span className="info-label"><EmailIcon fontSize="small" /> Recordatorio de pago:</span>
              <span className="info-value">Activo · 1 día antes</span>
            </div>
            <div className="info-item">
              <span className="info-label"><NotificationsActiveIcon fontSize="small" /> Alerta de stock bajo:</span>
              <span className="info-value">Inactivo</span>
            </div>
          </div>
        </div>
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
            <div className="plan-badge">
              {(suscripcion?.plan_nombre || "—").toUpperCase()}
            </div>
            <h4>Plan {suscripcion?.plan_nombre || "—"}</h4>
            <p className="plan-precio">
              ${Number(suscripcion?.precio_mensual || 0).toLocaleString("es-MX")} <span>/ mes</span>
            </p>
            <p className="plan-fecha">
              Vigente desde: {formatearFecha(suscripcion?.fecha_inicio)}
            </p>
            <p className="plan-fecha">
              Vence el: {formatearFecha(suscripcion?.fecha_fin)}
            </p>
            <p className="plan-estado">
              <strong>Estado:</strong>{" "}
              <span style={{ color: colorEstado, fontWeight: 600 }}>{textoEstado()}</span>
            </p>
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
        </div>
      )}

      {/* ============================================ */}
      {/* TAB: AVANZADO (seguridad + portal cliente) */}
      {/* ============================================ */}
      {tabActiva === "avanzado" && (
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
              <div className="info-item">
                <span className="info-label"><SecurityIcon fontSize="small" /> Autenticación 2FA:</span>
                <span className="info-value">Desactivada</span>
              </div>
              <div className="info-item">
                <span className="info-label"><SecurityIcon fontSize="small" /> Última sesión:</span>
                <span className="info-value">Hoy 09:14 AM · Mérida, Yuc.</span>
              </div>
              <div className="info-item">
                <span className="info-label"><SecurityIcon fontSize="small" /> Registro de actividad:</span>
                <span className="info-value">Activo (últimos 30 días)</span>
              </div>
            </div>
            <div className="form-buttons">
              <button className="btn-cancel" type="button">
                Cambiar contraseña
              </button>
            </div>
          </div>

          {/* PORTAL DEL CLIENTE */}
          <div className="config-section">
            <div className="section-header">
              <h3>
                <PublicIcon className="section-icon" />
                Portal del Cliente (B2C)
              </h3>
            </div>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label"><PublicIcon fontSize="small" /> Portal activo:</span>
                <span className="info-value">Sí</span>
              </div>
              <div className="info-item">
                <span className="info-label"><PublicIcon fontSize="small" /> Mensaje de bienvenida:</span>
                <span className="info-value">Personalizado</span>
              </div>
              <div className="info-item">
                <span className="info-label"><PublicIcon fontSize="small" /> Campos visibles:</span>
                <span className="info-value">Prenda, monto, vencimiento, saldo</span>
              </div>
            </div>
          </div>
        </>
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
    </div>
  );
};

export default Configuraciones;