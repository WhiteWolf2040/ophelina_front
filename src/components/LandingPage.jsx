import React, { useState, useEffect, useCallback, memo } from "react";
import LogoInicial from "../assets/LogoWhite.png";
import Logobb from "../assets/O_blue.png";
import gold from "../assets/gold.jpg";
import client from "../assets/client.jpg";
import admin from "../assets/admin.jpg";
import ahorros from "../assets/ahorros.jpg";
import StarIcon from "../assets/StarIcon.png";
import { Link, useSearchParams } from 'react-router-dom';
import "./LandingPage.css";
import { loadStripe } from '@stripe/stripe-js';
import { stripeService } from '../services/stripeService';
import PaymentModal from '../components/PaymentModal';
import AppModal from '../components/AppModal';

// ============================================
// ICONOS SVG EN LÍNEA (data URI)
// ============================================
const svgIcon = (path, color = "%23000000") =>
  `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color}">${path}</svg>`;

const IconUser = svgIcon('<path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10zm0 2c-5 0-9 2.5-9 5v1h18v-1c0-2.5-4-5-9-5z"/>');
const IconGear = svgIcon('<path d="M19.14 12.94a7.07 7.07 0 0 0 0-1.88l2.03-1.58a.5.5 0 0 0 .12-.64l-1.92-3.32a.5.5 0 0 0-.61-.22l-2.39.96a7.03 7.03 0 0 0-1.63-.94l-.36-2.54a.5.5 0 0 0-.5-.42h-3.84a.5.5 0 0 0-.5.42l-.36 2.54c-.58.24-1.12.55-1.63.94l-2.39-.96a.5.5 0 0 0-.61.22L2.71 8.84a.5.5 0 0 0 .12.64l2.03 1.58a7.07 7.07 0 0 0 0 1.88l-2.03 1.58a.5.5 0 0 0-.12.64l1.92 3.32c.13.22.39.31.61.22l2.39-.96c.5.39 1.05.7 1.63.94l.36 2.54c.04.24.25.42.5.42h3.84c.25 0 .46-.18.5-.42l.36-2.54c.58-.24 1.12-.55 1.63-.94l2.39.96c.22.09.48 0 .61-.22l1.92-3.32a.5.5 0 0 0-.12-.64l-2.03-1.58zM12 15.5A3.5 3.5 0 1 1 12 8.5a3.5 3.5 0 0 1 0 7z"/>');
const IconBank = svgIcon('<path d="M12 2 2 8v2h20V8L12 2zm0 4a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zM4 12v8H2v2h20v-2h-2v-8h-2v8h-4v-8h-2v8H8v-8H4z"/>');
const IconChart = svgIcon('<path d="M3 3h2v18H3V3zm4 10h2v8H7v-8zm4-6h2v14h-2V7zm4 3h2v11h-2V10zm4-5h2v16h-2V5z"/>');
const IconCreditCard = svgIcon('<path d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/>');
const IconClock = svgIcon('<path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z"/>');
const IconCart = svgIcon('<path d="M7 18a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm10 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM7.16 14h9.68c.75 0 1.41-.41 1.75-1.03l3.58-6.49A1 1 0 0 0 21.28 5H6.21l-.94-2H1v2h3l3.6 7.59-1.35 2.44A2 2 0 0 0 8 18h12v-2H8.42l.74-1.34z"/>');
const IconCloud = svgIcon('<path d="M19.35 10.04A7.49 7.49 0 0 0 12 4a7.48 7.48 0 0 0-6.64 4.04A5.994 5.994 0 0 0 6 20h13a5 5 0 0 0 .35-9.96z"/>');
const IconPhone = svgIcon('<path d="M17 1H7a2 2 0 0 0-2 2v18a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2zm0 18H7V5h10v14zM12 21a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/>');
const IconStar = svgIcon('<path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>', "%23FFC107");
const IconBell = svgIcon('<path d="M12 22a2.5 2.5 0 0 0 2.45-2h-4.9A2.5 2.5 0 0 0 12 22zm7-5v-5a7 7 0 0 0-5.5-6.83V4a1.5 1.5 0 0 0-3 0v1.17A7 7 0 0 0 5 12v5l-2 2v1h18v-1l-2-2z"/>');
const IconRefresh = svgIcon('<path d="M17.65 6.35A8 8 0 1 0 19.73 14h-2.08A6 6 0 1 1 12 6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>');
const IconDashboard = svgIcon('<path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>', "%23FFFFFF");
const IconLogout = svgIcon('<path d="M10 17l1.41-1.41L8.83 13H20v-2H8.83l2.58-2.59L10 7l-5 5 5 5zM4 5h8V3H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h8v-2H4V5z"/>', "%23FFFFFF");
const IconEmail = svgIcon('<path d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z"/>', "%23FFFFFF");
const IconPhoneContact = svgIcon('<path d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.02-.24c1.12.37 2.33.57 3.57.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.24.2 2.45.57 3.57a1 1 0 0 1-.24 1.02l-2.21 2.2z"/>', "%23FFFFFF");
const IconPin = svgIcon('<path d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z"/>', "%23FFFFFF");

// ============================================
// MODAL DE CARGA
// ============================================
const LoadingModal = ({ isOpen }) => {
  if (!isOpen) return null;

  return (
    <div className="loading-modal-overlay">
      <div className="loading-modal-container">
        <div className="loading-spinner"></div>
        <h3>Procesando tu solicitud...</h3>
        <p>Estamos preparando tu pago, por favor espera un momento.</p>
      </div>
    </div>
  );
};

// ============================================
// DATOS CENTRALIZADOS
// ============================================
const slides = [
  {
    title: "¿Tu casa de empeño todavía hace esto manualmente?",
    subtitle: "EL PROBLEMA",
    theme: "problem",
    items: [
      "Llevar el control de empeños en diferentes archivos",
      "Dar seguimiento manual a fechas de vencimiento",
      "Recordar a cada cliente cuándo debe realizar un pago",
      "Tener dificultades para controlar el inventario",
      "Crear reportes manualmente",
      "Recibir constantemente preguntas sobre el estado de un empeño"
    ],
    cta: null,
    img: ahorros
  },
  {
    title: "¿Que problemas resuelve Ophaline?",
    subtitle: "LA SOLUCIÓN",
    theme: "solution",
    items: [
      "Inventario y préstamos centralizados en un solo lugar",
      "Recordatorios automáticos por SMS, email y WhatsApp",
      "Portal de cliente para consultar estado de empeños",
      "Reportes y análisis con un clic",
      "Cálculo automático de intereses y fechas",
      "Tienda en línea para recuperar valor de prendas vencidas"
    ],
    cta: "Probar gratis",
    img: gold
  }
];

const steps = [
  {
    icon: IconUser,
    label: "Registra tu casa",
    frontSubtitle: "Paso 1",
    backTitle: "Registra tu casa de empeño",
    backText: "Configura sucursales, usuarios y parámetros a tu medida."
  },
  {
    icon: IconCreditCard,
    label: "Registra empeños",
    frontSubtitle: "Paso 2",
    backTitle: "Registra tus empeños",
    backText: "Administra clientes, prendas, valuaciones, préstamos, intereses y fechas."
  },
  {
    icon: IconBell,
    label: "Automatiza el seguimiento",
    frontSubtitle: "Paso 3",
    backTitle: "Automatiza el seguimiento",
    backText: "Envía recordatorios automáticos de vencimiento y pagos a tus clientes."
  },
  {
    icon: IconUser,
    label: "Incluye a tus clientes",
    frontSubtitle: "Paso 4",
    backTitle: "Dale acceso a tus clientes",
    backText: "Tus clientes consultan sus empeños, pagos y fechas desde su portal."
  },
  {
    icon: IconCart,
    label: "Vende más",
    frontSubtitle: "Paso 5",
    backTitle: "Haz crecer tu negocio",
    backText: "Publica artículos disponibles en tu tienda en línea y genera ingresos extra."
  }
];

const featuresData = [
  { title: "Pasarela de pago integrada", desc: "Acepta pagos en línea de forma segura con las principales opciones de México", icon: IconCreditCard },
  { title: "Recordatorios automáticos", desc: "Sistema inteligente de notificaciones por SMS, email y WhatsApp", icon: IconClock },
  { title: "Precio del oro en tiempo real", desc: "Actualización automática de cotizaciones para valuaciones precisas", icon: IconChart },
  { title: "Tienda en linea", desc: "Acceso a tienda en linea para todos tus clientes, comprar o apartar.", icon: IconCart },
  { title: "Escalabilidad en la nube", desc: "Crece sin límites con infraestructura cloud confiable y segura", icon: IconCloud },
  { title: "Acceso con dispositivos", desc: "Trabaja desde tu computadora, tablet o smartphone, en cualquier momento.", icon: IconPhone }
];

const adminFeatures = [
  { icon: IconStar, title: "Gestión de inventario", desc: "Control total de artículos empeñados con fotos y valuaciones" },
  { icon: IconBell, title: "Control de préstamos", desc: "Seguimiento de montos, intereses y plazos de pago" },
  { icon: IconCreditCard, title: "Reportes y análisis", desc: "Dashboard con métricas clave y reportes personalizables" },
  { icon: IconRefresh, title: "Historial de clientes", desc: "Acceso completo a todo el historial de transacciones" },
  { icon: IconStar, title: "Cálculo automático", desc: "De los intereses generados por cada prenda." }
];

const clientFeatures = [
  { icon: IconStar, title: "Portal de cliente", desc: "Consulta en línea del estado de empeños y pagos" },
  { icon: IconBell, title: "Notificaciones automáticas", desc: "Recordatorios de vencimientos y actualizaciones" },
  { icon: IconCreditCard, title: "Pagos en línea", desc: "Abonos y liquidaciones con pasarela de pago integrada" },
  { icon: IconRefresh, title: "Historial transparente", desc: "Acceso completo a todo el historial de transacciones" },
  { icon: IconStar, title: "Tienda en línea", desc: "Aparta y compra artículos" }
];

// ============================================
// PLANES
// ============================================
const plans = [
  {
    id: 1,
    idKey: 'free',
    name: "Gratis",
    price: 0,
    priceInCents: 0,
    features: [
      "Solo 1 sucursal",
      "5 clientes nuevos al mes",
      "Máximo 50 empeños activos",
      "Control de fechas límite de pago"
    ],
    buttonText: "Probar 30 días gratis",
    featured: false,
    badge: null
  },
  {
    id: 2,
    idKey: 'profesional',
    name: "Profesional",
    price: 999,
    priceInCents: 99900,
    features: [
      "Todo lo del plan Gratis",
      "Evita pérdidas con control de inventario",
      "Reportes básicos",
      "Reduce morosidad con recordatorios automáticos",
      "Cálculo automático de intereses"
    ],
    buttonText: "Suscribirme",
    featured: true,
    badge: "Más popular"
  },
  {
    id: 3,
    idKey: 'premium',
    name: "Empresarial",
    price: 1499,
    priceInCents: 149900,
    features: [
      "Todo lo incluido en Profesional",
      "Reportes avanzados",
      "Tienda en línea",
      "Roles y permisos de usuarios",
      "Configuración de la empresa",
      "Multi-sucursal (hasta 5)"
    ],
    buttonText: "Suscribirme",
    featured: false,
    badge: null
  }
];

// ============================================
// COMPONENTES MEMOIZADOS
// ============================================
const Navbar = memo(({ isLoggedIn, userNombre, onLogout }) => (
  <header className="navbar">
    <div className="logo">
      <span className="logo-icon">
        <img className="logo-icon" src={Logobb} alt="Hero" loading="lazy" />
      </span>
    </div>
    <nav className="nav-links" aria-label="Navegación principal">
      <a href="#nosotros">Nosotros</a>
      <a href="#suscripciones">Suscripciones</a>
      <a href="#contacto">Contacto</a>

      {isLoggedIn ? (
        <div className="user-menu">
          <Link to="/home" style={{ textDecoration: 'none' }}>
            <button className="btn-dashboard" aria-label="Ir al dashboard">
              <img src={IconDashboard} alt="" aria-hidden="true" style={{ width: 16, height: 16, marginRight: 6, verticalAlign: 'middle' }} /> Dashboard
            </button>
          </Link>
          <button className="btn-logout" onClick={onLogout} aria-label="Cerrar sesión">
            <img src={IconLogout} alt="" aria-hidden="true" style={{ width: 16, height: 16, marginRight: 6, verticalAlign: 'middle' }} /> {userNombre?.split(' ')[0] || 'Usuario'} | Salir
          </button>
        </div>
      ) : (
        <Link to="/login" style={{ textDecoration: 'none' }}>
          <button className="btn-loginn" aria-label="Iniciar sesión">Iniciar Sesión</button>
        </Link>
      )}
    </nav>
  </header>
));

const Footer = memo(() => (
  <footer className="footer">
    <div className="footer-container">
      <div className="footer-brand">
        <div className="footer-logo">
          <img src={LogoInicial} alt="Ophelia" loading="lazy" width="180" height="auto" />
        </div>
        <div className="footer-socials">
          <a href="#" aria-label="Twitter"><i className="fab fa-x-twitter"></i></a>
          <a href="#" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
          <a href="#" aria-label="YouTube"><i className="fab fa-youtube"></i></a>
          <a href="#" aria-label="LinkedIn"><i className="fab fa-linkedin"></i></a>
        </div>
      </div>
      <div className="footer-links">
        <div className="footer-column">
          <h3>Producto</h3>
          <ul>
            <li><a href="#">UI design</a></li>
            <li><a href="#">UX design</a></li>
            <li><a href="#">Diagramming</a></li>
            <li><a href="#">Team collaboration</a></li>
          </ul>
        </div>
        <div className="footer-column">
          <h3>Empresa</h3>
          <ul>
            <li><a href="#">Design</a></li>
            <li><a href="#">Developers</a></li>
            <li><a href="#">Development features</a></li>
            <li><a href="#">Support</a></li>
            <li><a href="#">Collaboration features</a></li>
            <li><a href="#contacto">Contacto</a></li>
          </ul>
        </div>
        <div className="footer-column">
          <h3>Legal</h3>
          <ul>
            <li><a href="#">Aviso de privacidad</a></li>
            <li><a href="#">Términos y condiciones</a></li>
            <li><a href="#">Política de cookies</a></li>
            <li><a href="#">SLA</a></li>
          </ul>
        </div>
      </div>
    </div>
    <div className="footer-bottom">
      <p>© 2026 Ophaline. Todos los derechos reservados.</p>
      <p>Hecho con <span className="heart" aria-hidden="true">❤</span> para las casas de empeño de México</p>
    </div>
  </footer>
));

const FeatureCard = memo(({ icon, title, desc }) => (
  <div className="feature-card">
    <div className="feature-icon-wrapper">
      <img className="feature-icon" src={icon} alt="" aria-hidden="true" style={{ width: 32, height: 32 }} />
    </div>
    <div className="feature-text">
      <h3>{title}</h3>
      <p>{desc}</p>
    </div>
  </div>
));

// ============================================
// PRICING CARD
// ============================================
const PricingCard = memo(({ plan, onPaymentStart, onPaymentEnd, openModal, closeModal }) => {
  const stripePromise = loadStripe('pk_test_51R7ma3QLK8Ukfs4sBg4baWVuYz4UpN7v5x6GxCfAs4GGXuLTdrRiiqdtjAy9wPCBqT6nybXwlw7240h3Egpcz4RQ00VNfIVDSn');

  const handleSubscribe = () => {
    if (plan.id === 1 || plan.idKey === 'free') {
      handleFreePlan();
    } else {
      handlePaidPlan();
    }
  };

  // ---------- PLAN GRATIS ----------
  const handleFreePlan = () => {
    openModal({
      type: 'prompt',
      title: 'Activa tu plan Gratis',
      message: 'Ingresa tu correo electrónico para comenzar.',
      inputLabel: 'Correo electrónico',
      inputType: 'email',
      inputPlaceholder: 'tucorreo@ejemplo.com',
      inputValue: '',
      confirmText: 'Continuar',
      showCancel: true,
      onInputChange: (val) => openModal._setInput?.(val),
      onCancel: closeModal,
      onConfirm: async () => {
        const email = openModal._getInput?.()?.trim();
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          openModal({
            type: 'error',
            title: 'Correo inválido',
            message: 'Por favor ingresa un correo electrónico válido.',
            onConfirm: () => handleFreePlan(),
          });
          return;
        }
        openModal({
          type: 'prompt',
          title: 'Nombre de tu casa de empeño',
          message: '¿Cómo se llama tu negocio?',
          inputLabel: 'Nombre del negocio',
          inputValue: '',
          confirmText: 'Activar plan',
          showCancel: true,
          onCancel: closeModal,
          onConfirm: async () => {
            const negocioNombre = openModal._getInput?.()?.trim();
            if (!negocioNombre) return;
            try {
              const response = await stripeService.activateFreePlan({
                email: email,
                negocio_nombre: negocioNombre,
                telefono: ''
              });
              if (response.success) {
                localStorage.setItem('empresa_id', response.empresaId);
                localStorage.setItem('user_email', email);
                openModal({
                  type: 'success',
                  title: '¡Plan Gratis activado!',
                  message: 'Tienes 30 días para probar Ophaline sin costo.',
                  confirmText: 'Ir al dashboard',
                  onConfirm: () => {
                    closeModal();
                    window.location.href = '/dashboard';
                  },
                });
              }
            } catch (error) {
              console.error('Error:', error);
              openModal({
                type: 'error',
                title: 'No pudimos activar el plan',
                message: 'Intenta de nuevo en unos momentos.',
                onConfirm: closeModal,
              });
            }
          },
        });
      },
    });
  };

  // ---------- PLANES DE PAGO ----------
  const handlePaidPlan = () => {
    let email = localStorage.getItem('user_email');
    const empresaId = localStorage.getItem('empresa_id') || 'nueva';

    const numericPlanId = plan.id;
    console.log('📝 Plan seleccionado:', plan.name, 'ID:', numericPlanId);

    localStorage.setItem('pending_plan_id', numericPlanId);
    localStorage.setItem('pending_plan_name', plan.name);
    localStorage.setItem('pending_plan_price', plan.price);

    const proceed = async (finalEmail) => {
      if (onPaymentStart) onPaymentStart();
      try {
        const response = await stripeService.createCheckoutSession({
          plan_id: numericPlanId,
          plan_name: plan.name,
          price: plan.priceInCents,
          empresa_id: empresaId,
          customer_email: finalEmail,
        });
        window.location.href = response.url;
      } catch (error) {
        console.error('Error:', error);
        openModal({
          type: 'error',
          title: 'Error al iniciar el pago',
          message: error.message || 'Intenta de nuevo.',
          onConfirm: () => {
            closeModal();
            if (onPaymentEnd) onPaymentEnd();
          },
        });
      }
    };

    if (!email) {
      openModal({
        type: 'prompt',
        title: 'Correo para tu factura',
        message: 'Lo usaremos para enviarte el comprobante de tu suscripción.',
        inputLabel: 'Correo electrónico',
        inputType: 'email',
        inputPlaceholder: 'tucorreo@ejemplo.com',
        inputValue: '',
        confirmText: 'Continuar al pago',
        showCancel: true,
        onCancel: closeModal,
        onConfirm: async () => {
          const val = openModal._getInput?.()?.trim();
          if (!val || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
            openModal({
              type: 'error',
              title: 'Correo inválido',
              message: 'Verifica el formato del correo.',
              onConfirm: () => handlePaidPlan(),
            });
            return;
          }
          localStorage.setItem('user_email', val);
          closeModal();
          await proceed(val);
        },
      });
    } else {
      proceed(email);
    }
  };

  return (
    <div className={`pricing-card ${plan.featured ? 'featured' : ''}`}>
      {plan.badge && <div className="badge2">{plan.badge}</div>}
      <h3>{plan.name}</h3>
      <div className="price">
        {plan.price === 0 ? (
          <span className="amount">Gratis</span>
        ) : (
          <>
            <span className="currency">$</span>
            <span className="amount">{plan.price.toLocaleString()}</span>
            <span className="period">/ mes</span>
          </>
        )}
      </div>
      <ul>
        {plan.features.map((feature, i) => (
          <li key={i}>{feature}</li>
        ))}
      </ul>

      <button
        onClick={handleSubscribe}
        className={plan.featured ? 'btn-filled' : 'btn-outline'}
        style={{ width: '100%', cursor: 'pointer' }}
      >
        <center>{plan.buttonText}</center>
      </button>
    </div>
  );
});

// ============================================
// COMPONENTE PRINCIPAL LANDING
// ============================================
const Landing = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [formData, setFormData] = useState({
    nombre: '',
    negocio: '',
    telefono: '',
    mensaje: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userNombre, setUserNombre] = useState('');

  const [searchParams] = useSearchParams();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentSessionId, setPaymentSessionId] = useState(null);
  const [paymentPlanName, setPaymentPlanName] = useState('');
  const [paymentProcessed, setPaymentProcessed] = useState(false);

  const [isLoadingPayment, setIsLoadingPayment] = useState(false);

  // ---------- MODAL GENÉRICO ----------
  const [modal, setModal] = useState({
    isOpen: false,
    type: 'info',
    title: '',
    message: '',
    confirmText: 'Aceptar',
    cancelText: 'Cancelar',
    showCancel: false,
    inputLabel: '',
    inputType: 'text',
    inputPlaceholder: '',
    inputValue: '',
    onConfirm: null,
    onCancel: null,
    onInputChange: null,
  });

  const closeModal = () => setModal((m) => ({ ...m, isOpen: false }));

  // openModal acepta config y expone helpers _getInput/_setInput para el prompt
  const openModal = (config) => {
    setModal((prev) => {
      const next = { ...prev, ...config, isOpen: true };
      // helpers internos para leer/escribir el input del prompt
      next._getInput = () => next.inputValue;
      next._setInput = (val) => setModal((m) => ({ ...m, inputValue: val }));
      return next;
    });
  };

  // Auto-play del carrusel
  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  // Navegación con teclado
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        setActiveSlide((prev) => (prev - 1 + slides.length) % slides.length);
        setIsAutoPlaying(false);
      } else if (e.key === 'ArrowRight') {
        setActiveSlide((prev) => (prev + 1) % slides.length);
        setIsAutoPlaying(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Verificar sesión
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      const userStr = localStorage.getItem('user');
      if (token && userStr) {
        try {
          const user = JSON.parse(userStr);
          setIsLoggedIn(true);
          setUserNombre(user.nombre || user.name || 'Usuario');
        } catch (e) {
          console.error('Error al parsear usuario:', e);
        }
      }
    };
    checkAuth();
  }, []);

  // DETECTAR PAGO EXITOSO
  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    const paymentStatus = searchParams.get('payment');
    if (sessionId && paymentStatus === 'success' && !paymentProcessed) {
      console.log('✅ Pago detectado, abriendo modal...');
      setPaymentProcessed(true);
      setPaymentSessionId(sessionId);
      setPaymentPlanName(localStorage.getItem('pending_plan_name') || 'Premium');
      setShowPaymentModal(true);
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [searchParams, paymentProcessed]);

  const handlePaymentStart = () => setIsLoadingPayment(true);
  const handlePaymentEnd = () => setIsLoadingPayment(false);

  const handleSlideChange = useCallback((index) => {
    setActiveSlide(index);
    setIsAutoPlaying(false);
  }, []);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.nombre.trim()) newErrors.nombre = 'Nombre completo requerido';
    if (!formData.negocio.trim()) newErrors.negocio = 'Nombre del negocio requerido';
    if (!formData.telefono.trim()) {
      newErrors.telefono = 'Teléfono requerido';
    } else if (!/^\d{10,}$/.test(formData.telefono.replace(/\D/g, ''))) {
      newErrors.telefono = 'Teléfono inválido (mínimo 10 dígitos)';
    }
    return newErrors;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'https://ophelina-back-v1.onrender.com/api';
      const response = await fetch(`${API_URL}/send-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (result.success) {
        setFormData({ nombre: '', negocio: '', telefono: '', mensaje: '' });
        openModal({
          type: 'success',
          title: '¡Mensaje enviado!',
          message: 'Te contactaremos pronto para agendar tu demo.',
          onConfirm: closeModal,
        });
      } else {
        openModal({
          type: 'error',
          title: 'No pudimos enviar tu mensaje',
          message: result.error || 'Intenta de nuevo en unos minutos.',
          onConfirm: closeModal,
        });
      }
    } catch (error) {
      console.error('Error:', error);
      openModal({
        type: 'error',
        title: 'Error de conexión',
        message: 'Revisa tu internet e intenta de nuevo.',
        onConfirm: closeModal,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('empresa_id');
    localStorage.removeItem('user_email');
    setIsLoggedIn(false);
    setUserNombre('');
    window.location.href = '/';
  };

  const handlePaymentSuccess = (data) => {
    console.log('✅ Pago verificado y suscripción activada:', data);
    setTimeout(() => {
      window.location.href = '/home';
    }, 2000);
  };

  const handleClosePaymentModal = () => {
    setShowPaymentModal(false);
    setPaymentProcessed(false);
    localStorage.removeItem('pending_plan_id');
    localStorage.removeItem('pending_plan_name');
    localStorage.removeItem('pending_plan_price');
  };

  return (
    <>
      <div className="landing">
        <Navbar
          isLoggedIn={isLoggedIn}
          userNombre={userNombre}
          onLogout={handleLogout}
        />

        <section className="hero-section" aria-label="Hero">
          <div className="heroo-overlay">
            <div>
              <img
                className="LogoInicial"
                src={LogoInicial}
                alt="Ophelia Logo"
                width="600"
                height="auto"
                loading="eager"
              />
            </div>
            <p>
              Gestiona empeños, inventario, pagos y reportes desde una sola plataforma intuitiva.
            </p>
            <div className="hero-buttons">
              <button className="btn-primari">
                <img className="StarIcon" src={StarIcon} alt="" aria-hidden="true" /> Soporte en español
              </button>
              <button className="btn-primari">
                <img className="StarIcon" src={StarIcon} alt="" aria-hidden="true" /> Datos seguros
              </button>
              <button className="btn-primari">
                <img className="StarIcon" src={StarIcon} alt="" aria-hidden="true" /> Cumplimiento normativo
              </button>
            </div>
          </div>
        </section>
      </div>

      <div className="fondo">
        {/* MISIÓN Y VISIÓN */}
        <div className="misionvision">
          <section className="mv-section" aria-labelledby="mv-title">
            <div className="mv-header">
              <span className="subtitle2">ANTES VS DESPUÉS</span>
              <h2 id="mv-title">¿Cómo funciona?</h2>
              <p>De procesos manuales y archivos dispersos a una sola plataforma que centraliza todo.</p>
            </div>

            <div className="mv-carousel" role="region" aria-label="Antes vs Con Ophelia">
              <div className={`mv-card mv-card-${slides[activeSlide].theme}`}>
                <div className="mv-image">
                  <img
                    src={slides[activeSlide].img}
                    alt={slides[activeSlide].title}
                    loading="lazy"
                    width="500"
                    height="400"
                  />
                  <span className={`mv-badge mv-badge-${slides[activeSlide].theme}`}>
                    {slides[activeSlide].subtitle}
                  </span>
                </div>

                <div className="mv-content">
                  <h3>{slides[activeSlide].title}</h3>
                  <ul className="mv-list">
                    {slides[activeSlide].items.map((item, i) => (
                      <li key={i} className={`mv-list-item mv-list-item-${slides[activeSlide].theme}`}>
                        <span className="mv-list-icon" aria-hidden="true">
                          {slides[activeSlide].theme === "problem" ? "✕" : "✓"}
                        </span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>

                  {slides[activeSlide].cta && (
                    <Link to="/login" style={{ textDecoration: 'none' }}>
                      <button className="btn-mv">{slides[activeSlide].cta}</button>
                    </Link>
                  )}
                </div>
              </div>

              <div className="carousel-dots" role="tablist" aria-label="Controles del carrusel">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    className={`dot ${activeSlide === i ? 'active' : ''}`}
                    onClick={() => handleSlideChange(i)}
                    role="tab"
                    aria-selected={activeSlide === i}
                    aria-label={`Ir a diapositiva ${i + 1}: ${slides[i].title}`}
                  />
                ))}
              </div>
            </div>

            <div className="process-steps">
              <div className="steps-line" aria-hidden="true"></div>
              {steps.map((step, index) => (
                <div className="step-item" key={index}>
                  <div className="flip-card" tabIndex={0}>
                    <div className="flip-card-inner">
                      <div className="flip-card-front">
                        <span className="flip-step-number">{index + 1}</span>
                        <img
                          className="step-icon"
                          src={step.icon}
                          alt=""
                          aria-hidden="true"
                        />
                        <p className="flip-step-label">{step.label}</p>
                        <span className="flip-hint">Ver más</span>
                      </div>
                      <div className="flip-card-back">
                        <h4>{step.backTitle}</h4>
                        <p>{step.backText}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* FUNCIONALIDADES */}
        <section className="func-section" id="nosotros" aria-labelledby="func-title">
          <div className="mv-header">
            <span className="subtitle2">NOSOTROS</span>
            <h2 id="func-title">Plataforma web todo en uno</h2>
            <p>Para tu negocio: más control y menos tareas manuales.
              Para tus clientes: consulta, pagos y seguimiento desde su propio portal.</p>
          </div>

          <div className="func-container">
            <div className="func-column">
              <h3>Para Administradores</h3>
              <div className="func-card">
                <div className="image-wrapper">
                  <img
                    src={admin}
                    alt="Administradores usando la plataforma"
                    loading="lazy"
                    width="500"
                    height="250"
                  />
                </div>
                <ul className="feature-list">
                  {adminFeatures.map((f, i) => (
                    <li key={i}>
                      <img className="f-icon" src={f.icon} alt="" aria-hidden="true" style={{ width: 20, height: 20 }} />
                      <div>
                        <strong>{f.title}</strong>
                        <p>{f.desc}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="vertical-divider" aria-hidden="true"></div>

            <div className="func-column">
              <h3>Para Clientes</h3>
              <div className="func-card">
                <div className="image-wrapper">
                  <img
                    src={client}
                    alt="Clientes usando el portal"
                    loading="lazy"
                    width="500"
                    height="250"
                  />
                </div>
                <ul className="feature-list">
                  {clientFeatures.map((f, i) => (
                    <li key={i}>
                      <img className="f-icon" src={f.icon} alt="" aria-hidden="true" style={{ width: 20, height: 20 }} />
                      <div>
                        <strong>{f.title}</strong>
                        <p>{f.desc}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* CARACTERÍSTICAS ÚNICAS */}
        <section className="features-section" aria-labelledby="unique-title">
          <div className="features-container">
            <header className="features-header">
              <span className="subtitle2">CARACTERÍSTICAS</span>
              <h2 id="unique-title" className="features-title">Lo que nos hace únicos</h2>
              <p className="features-description">
                Características que marcan la diferencia y potencian tu negocio
              </p>
              <a href="#contacto"><button className="features-btn">Solicitar Demo</button></a>
            </header>

            <div className="features-grid">
              {featuresData.map((item, index) => (
                <FeatureCard key={index} {...item} />
              ))}
            </div>
          </div>
        </section>

        {/* PLANES */}
        <div className="Planes" id="suscripciones">
          <div className="pricing-header">
            <center>
              <span className="subtitle2">Inversión</span>
              <h2>Planes flexibles para cada negocio</h2>
              <p>Elige el plan que mejor se adapte a tus necesidades. Sin sorpresas, sin costos ocultos.</p>
            </center>
          </div>

          <div className="pricing-container">
            {plans.map((plan, index) => (
              <PricingCard
                key={index}
                plan={plan}
                onPaymentStart={handlePaymentStart}
                onPaymentEnd={handlePaymentEnd}
                openModal={openModal}
                closeModal={closeModal}
              />
            ))}
          </div>
        </div>

        {/* CONTACTO */}
        <div className="Contacto" id="contacto">
          <div className="contact-header">
            <span className="subtitle2">CONTÁCTANOS</span>
            <h2>Comienza tu transformación digital hoy</h2>
            <p>Agenda una demo personalizada y descubre cómo Ophaline puede revolucionar tu casa de empeño</p>
          </div>

          <div className="contact-container">
            <div className="contact-form-card">
              <h3>Formulario</h3>
              <form onSubmit={handleSubmit} noValidate>
                <div className="form-group">
                  <label htmlFor="nombre">Nombre completo *</label>
                  <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    placeholder="Ingresa tu nombre completo"
                    required
                    aria-invalid={!!errors.nombre}
                    aria-describedby={errors.nombre ? "nombre-error" : undefined}
                  />
                  {errors.nombre && <span id="nombre-error" className="error-message">{errors.nombre}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="negocio">Nombre de tu casa de empeño *</label>
                  <input
                    type="text"
                    id="negocio"
                    name="negocio"
                    value={formData.negocio}
                    onChange={handleInputChange}
                    placeholder="Nombre del negocio"
                    required
                    aria-invalid={!!errors.negocio}
                  />
                  {errors.negocio && <span className="error-message">{errors.negocio}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="telefono">Teléfono *</label>
                  <input
                    type="tel"
                    id="telefono"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleInputChange}
                    placeholder="10 dígitos"
                    required
                    aria-invalid={!!errors.telefono}
                  />
                  {errors.telefono && <span className="error-message">{errors.telefono}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="mensaje">Mensaje:</label>
                  <textarea
                    id="mensaje"
                    name="mensaje"
                    value={formData.mensaje}
                    onChange={handleInputChange}
                    placeholder="Cuéntanos más sobre tu negocio"
                    rows="2"
                  />
                </div>

                <button
                  type="submit"
                  className="btn-submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Enviando...' : 'Solicitar demo gratuita'}
                </button>
              </form>
            </div>

            <div className="contact-info-column">
              <div className="info-card dark">
                <h4>Otras formas de contacto</h4>
                <div className="info-item2">
                  <div>
                    <strong> <img className="icon" src={IconEmail} alt="" aria-hidden="true" /> Email</strong>
                    <p>contacto@ophaline.mx</p>
                  </div>
                </div>
                <div className="info-item2">
                  <div>
                    <strong><img className="icon" src={IconPhoneContact} alt="" aria-hidden="true" /> Teléfono</strong>
                    <p>+52 999 999 99 99</p>
                  </div>
                </div>
                <div className="info-item2">
                  <div>
                    <strong><img className="icon" src={IconPin} alt="" aria-hidden="true" /> Oficinas</strong>
                    <p>Mérida, Yucatán, México</p>
                  </div>
                </div>

                <div className="info-schedule">
                  <strong>Horario de atención</strong>
                  <p>Lunes a Viernes: 9:00 - 18:00 <br /> Sábado: 9:00 - 14:00</p>
                </div>
              </div>

              <div className="info-card blue">
                <h4>¿Qué incluye la demo?</h4>
                <ul>
                  <li>Recorrido completo por la plataforma</li>
                  <li>Análisis personalizado de tus necesidades</li>
                  <li>Demostración de funcionalidades clave</li>
                  <li>Sesión de preguntas y respuestas</li>
                  <li>Propuesta de implementación a medida</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="map-container">
            <iframe
              title="Ubicación de Ophaline"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d119468.70462467618!2d-89.67155106367189!3d20.967370199999997!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8f5671b7d5a8f5b5%3A0x8f5a9c8f5b5b5b5b!2sM%C3%A9rida%2C%20Yuc.!5e0!3m2!1ses!2smx!4v1234567890"
              width="100%"
              height="450"
              style={{ border: 0, borderRadius: '15px' }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>

      <Footer />

      {/* Modal de verificación de pago */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={handleClosePaymentModal}
        sessionId={paymentSessionId}
        planName={paymentPlanName}
        onSuccess={handlePaymentSuccess}
      />

      {/* Modal de carga */}
      <LoadingModal isOpen={isLoadingPayment} />

      {/* Modal genérico (reemplaza alert/prompt) */}
      <AppModal
        isOpen={modal.isOpen}
        type={modal.type}
        title={modal.title}
        message={modal.message}
        confirmText={modal.confirmText}
        cancelText={modal.cancelText}
        showCancel={modal.showCancel}
        inputLabel={modal.inputLabel}
        inputType={modal.inputType}
        inputPlaceholder={modal.inputPlaceholder}
        inputValue={modal.inputValue}
        onInputChange={(val) => setModal((m) => ({ ...m, inputValue: val }))}
        onConfirm={modal.onConfirm}
        onCancel={modal.onCancel || closeModal}
      />

      {/* Botón de WhatsApp */}
      <a
        href="https://wa.me/529992434806?text=Hola%21%20Vengo%20de%20la%20pagina%20web%20y%20me%20gustar%C3%ADa%20recibir%20m%C3%A1s%20informaci%C3%B3n"
        className="whatsapp-float"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contactar por WhatsApp"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="white">
          <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 13.2 5.7 23.5 9.1 31.6 11.6 13.3 4.2 25.4 3.6 34.9 2.2 10.7-1.6 32.8-13.4 37.4-26.3 4.6-12.9 4.6-24 3.2-26.3-1.3-2.3-4.8-3.7-10.3-6.5z"/>
        </svg>
      </a>
    </>
  );
};

export default Landing;