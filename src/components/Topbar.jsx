// components/Topbar.jsx
import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import "./Topbar.css";
import { useDashboard } from "../contexts/DashboardContext";

// Iconos
import NotificationsIcon from '@mui/icons-material/Notifications';
import WarningIcon from '@mui/icons-material/Warning';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CloseIcon from '@mui/icons-material/Close';
import ErrorIcon from '@mui/icons-material/Error';
import RefreshIcon from '@mui/icons-material/Refresh';   // ✅ Nuevo: para el modal de alertas

const Topbar = () => {
  // ============================================
  // CONTEXTO
  // ============================================
  const {
    data,
    cargando,
    refrescar,
    edadCache,
    cacheEsValido
  } = useDashboard();

  const location = useLocation();

  // Estados de UI
  const [showPerfil, setShowPerfil] = useState(false);
  const [showAlertas, setShowAlertas] = useState(false);
  const [refrescandoAlertas, setRefrescandoAlertas] = useState(false);

  // ============================================
  // DATOS DEL USUARIO
  // ============================================
  const [datosPerfil] = useState(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        return {
          nombre: user.nombre || "Usuario",
          email: user.correo || "",
          telefono: user.telefono || "Sin teléfono",
          rol: user.rol || "Usuario",
          fechaRegistro: user.fecha_registro
            ? new Date(user.fecha_registro).toLocaleDateString('es-MX', {
                day: '2-digit', month: '2-digit', year: 'numeric'
              })
            : "Fecha no disponible",
          sucursal: "Casa Matriz - Mérida",
          fotoPerfil: user.foto_perfil ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(user.nombre || 'Usuario')}&size=128&background=1e3a8a&color=fff&bold=true`
        };
      } catch (e) {
        console.error('Error parseando user:', e);
      }
    }
    return {
      nombre: "Usuario",
      email: "",
      telefono: "",
      rol: "",
      fechaRegistro: "",
      sucursal: "Casa Matriz - Mérida",
      fotoPerfil: "https://ui-avatars.com/api/?name=Usuario&size=128&background=1e3a8a&color=fff&bold=true"
    };
  });

  // ============================================
  // CONTADORES
  // ============================================
  const resumen = data?.dashboard?.resumen || {};
  const contadores = {
    vencidos: resumen.empenos_vencidos || 0,
    proximos: resumen.proximos_vencer || 0,
    perdida_total: resumen.perdida_total || 0,
    ingresos_mes: resumen.ingresos_mes_actual || 0
  };

  // ============================================
  // SUBTÍTULOS POR RUTA
  // ============================================
  const subtitulosPorRuta = {
    '/home': 'Estado general de tu casa de empeño',
    '/clientes': 'Gestiona tus clientes',
    '/clientes/nuevo': 'Registra un nuevo cliente',
    '/pagos': 'Registra y consulta pagos',
    '/pagos/nuevo': 'Registrar un nuevo pago',
    '/empenos': 'Administra tus empeños',
    '/empenos/nuevo': 'Registrar un nuevo empeño',
    '/inventario': 'Tu inventario de prendas',
    '/inventario/nuevo': 'Registrar artículo en inventario',
    '/tienda': 'Tu tienda en línea',
    '/tienda/apartados': 'Apartados de clientes',
    '/reportes': 'Reportes y estadísticas',
    '/roles': 'Roles y permisos del sistema',
    '/roles/nuevo': 'Crear un nuevo rol',
    '/permisos': 'Permisos de usuarios',
    '/permisos/nuevo': 'Crear un nuevo permiso',
    '/configuracion': 'Configura tu casa de empeño'
  };

  const getSubtitulo = () => {
    const path = location.pathname;
    if (subtitulosPorRuta[path]) return subtitulosPorRuta[path];
    const match = Object.keys(subtitulosPorRuta).find(key =>
      path.startsWith(key)
    );
    return match ? subtitulosPorRuta[match] : 'Bienvenido a Ophelina';
  };

  // ============================================
  // REFRESCAR DESDE EL MODAL DE ALERTAS
  // ============================================
  const handleRefrescarAlertas = async () => {
    setRefrescandoAlertas(true);
    try {
      await refrescar();
    } finally {
      setTimeout(() => setRefrescandoAlertas(false), 600);
    }
  };

  const totalAlertas = contadores.vencidos + contadores.proximos;

  return (
    <>
      <header className="topbar">
        <div className="topbar-left">
          <h1 className="topbar-saludo">
             {getSubtitulo()}
           
          </h1>
           <span className="topbar-subtitulo">Bienvenido, {datosPerfil.nombre.split(' ')[0] || 'Usuario'}</span>
        </div>

        <div className="topbar-actions">
          {/* ✅ Ya NO hay botón de refrescar aquí */}

          <button
            className="topbar-btn-alertas"
            onClick={() => setShowAlertas(true)}
            title="Alertas"
          >
            <NotificationsIcon />
            {totalAlertas > 0 && (
              <span className="topbar-badge">{totalAlertas}</span>
            )}
          </button>

          <button
            className="topbar-btn-perfil"
            onClick={() => setShowPerfil(true)}
            title="Mi Perfil"
          >
            <img src={datosPerfil.fotoPerfil} alt="Perfil" />
          </button>
        </div>
      </header>

      {/* MODAL DE PERFIL (igual que antes) */}
      {showPerfil && (
        <div className="topbar-modal-overlay" onClick={() => setShowPerfil(false)}>
          <div className="topbar-modal" onClick={(e) => e.stopPropagation()}>
            <button className="topbar-modal-cerrar" onClick={() => setShowPerfil(false)}>
              <CloseIcon />
            </button>
            <div className="topbar-modal-header">
              <h2>Mi Perfil</h2>
              <span className="topbar-modal-badge">Información personal</span>
            </div>
            <div className="topbar-modal-body">
              <div className="topbar-perfil-avatar">
                <img src={datosPerfil.fotoPerfil} alt={datosPerfil.nombre} />
              </div>
              <div className="topbar-perfil-grid">
                <div className="topbar-perfil-item">
                  <span className="topbar-perfil-label">Nombre completo</span>
                  <span className="topbar-perfil-valor">{datosPerfil.nombre}</span>
                </div>
                <div className="topbar-perfil-item">
                  <span className="topbar-perfil-label">Email</span>
                  <span className="topbar-perfil-valor">{datosPerfil.email}</span>
                </div>
                <div className="topbar-perfil-item">
                  <span className="topbar-perfil-label">Teléfono</span>
                  <span className="topbar-perfil-valor">{datosPerfil.telefono}</span>
                </div>
                <div className="topbar-perfil-item">
                  <span className="topbar-perfil-label">Rol</span>
                  <span className="topbar-perfil-valor">{datosPerfil.rol}</span>
                </div>
                <div className="topbar-perfil-item">
                  <span className="topbar-perfil-label">Sucursal</span>
                  <span className="topbar-perfil-valor">{datosPerfil.sucursal}</span>
                </div>
                <div className="topbar-perfil-item">
                  <span className="topbar-perfil-label">Miembro desde</span>
                  <span className="topbar-perfil-valor">{datosPerfil.fechaRegistro}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE ALERTAS (con botón de refrescar dentro) */}
      {showAlertas && (
        <div className="topbar-modal-overlay" onClick={() => setShowAlertas(false)}>
          <div className="topbar-modal topbar-modal-alertas" onClick={(e) => e.stopPropagation()}>
            <button className="topbar-modal-cerrar" onClick={() => setShowAlertas(false)}>
              <CloseIcon />
            </button>
            
          <button
                className={`topbar-btn-refresh ${refrescandoAlertas ? 'girando' : ''}`}
                onClick={handleRefrescarAlertas}
                disabled={cargando || refrescandoAlertas}
                title="Actualizar alertas"
              >
                <RefreshIcon />
              </button>
            
            <div className="topbar-modal-header">
              <h2><NotificationsIcon /> Alertas y Notificaciones</h2>
              <span className="topbar-modal-badge">Actualizadas hoy</span>
            </div>
            <div className="topbar-modal-body">
              <div className="topbar-alertas-lista">
                <div className="topbar-alerta-item warning">
                  <WarningIcon className="topbar-alerta-icon" />
                  <div className="topbar-alerta-contenido">
                    <h4>{contadores.proximos} empeños por vencer esta semana</h4>
                    <p>Próximos a vencer: Revisa el detalle</p>
                    <small>Vencen en los próximos 7 días</small>
                  </div>
                </div>

                <div className="topbar-alerta-item danger">
                  <ErrorIcon className="topbar-alerta-icon" />
                  <div className="topbar-alerta-contenido">
                    <h4>{contadores.vencidos} empeños vencidos requieren atención</h4>
                    <p>Monto total vencido: ${contadores.perdida_total?.toLocaleString() || 0}</p>
                    <small>Requieren acción inmediata</small>
                  </div>
                </div>

                <div className="topbar-alerta-item info">
                  <AttachMoneyIcon className="topbar-alerta-icon" />
                  <div className="topbar-alerta-contenido">
                    <h4>Ingresos del mes: ${contadores.ingresos_mes?.toLocaleString() || 0}</h4>
                    <p>Meta mensual: $100,000</p>
                    <div className="topbar-progreso-barra">
                      <div
                        className="topbar-progreso-lleno"
                        style={{ width: `${Math.min((contadores.ingresos_mes / 100000 * 100) || 0, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
           
          </div>
        </div>
      )}
    </>
  );
};

export default Topbar;