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
    title: "Misión",
    text: "Optimizar la administración de casas de empeño mediante una plataforma web SaaS que automatice procesos clave y mejore la experiencia del usuario.",
    img: ahorros
  },
  {
    title: "Visión",
    text: "Ser la plataforma líder en México para la digitalización del sector prendario, ofreciendo seguridad y eficiencia a cada negocio.",
    img: gold
  }
];

const steps = [
  { icon: "👤", label: "Regístrate" },
  { icon: "⚙️", label: "Configura" },
  { icon: "🏛️", label: "Comienza" },
  { icon: "📈", label: "Crece" }
];

const featuresData = [
  { title: "Pasarela de pago integrada", desc: "Acepta pagos en línea de forma segura con las principales opciones de México", icon: "💳" },
  { title: "Recordatorios automáticos", desc: "Sistema inteligente de notificaciones por SMS, email y WhatsApp", icon: "⏰" },
  { title: "Precio del oro en tiempo real", desc: "Actualización automática de cotizaciones para valuaciones precisas", icon: "📈" },
  { title: "Tienda en linea", desc: "Acceso a tienda en linea para todos tus clientes, comprar o apartar.", icon: "🛒" },
  { title: "Escalabilidad en la nube", desc: "Crece sin límites con infraestructura cloud confiable y segura", icon: "☁️" },
  { title: "Acceso con dispositivos", desc: "Trabaja desde tu computadora, tablet o smartphone, en cualquier momento.", icon: "📱" }
];

const adminFeatures = [
  { icon: "⭐", title: "Gestión de inventario", desc: "Control total de artículos empeñados con fotos y valuaciones" },
  { icon: "🔔", title: "Control de préstamos", desc: "Seguimiento de montos, intereses y plazos de pago" },
  { icon: "💳", title: "Reportes y análisis", desc: "Dashboard con métricas clave y reportes personalizables" },
  { icon: "🔄", title: "Historial de clientes", desc: "Acceso completo a todo el historial de transacciones" },
  { icon: "⭐", title: "Cálculo automático", desc: "De los intereses generados por cada prenda." }
];

const clientFeatures = [
  { icon: "⭐", title: "Portal de cliente", desc: "Consulta en línea del estado de empeños y pagos" },
  { icon: "🔔", title: "Notificaciones automáticas", desc: "Recordatorios de vencimientos y actualizaciones" },
  { icon: "💳", title: "Pagos en línea", desc: "Abonos y liquidaciones con pasarela de pago integrada" },
  { icon: "🔄", title: "Historial transparente", desc: "Acceso completo a todo el historial de transacciones" },
  { icon: "⭐", title: "Tienda en línea", desc: "Aparta y compra artículos" }
];

const plans = [
  {
    id: 'free',
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
    id: 'profesional',
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
    id: 'premium',
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
    featured: false
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
              📊 Dashboard
            </button>
          </Link>
          <button className="btn-logout" onClick={onLogout} aria-label="Cerrar sesión">
            👤 {userNombre?.split(' ')[0] || 'Usuario'} | Salir
          </button>
        </div>
      ) : (
        <Link to="/login" style={{ textDecoration: 'none' }}>
          <button className="btn-login" aria-label="Iniciar sesión">Iniciar Sesión</button>
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
      <p>© 2026 Ophelina. Todos los derechos reservados.</p>
      <p>Hecho con <span className="heart" aria-hidden="true">❤</span> para las casas de empeño de México</p>
    </div>
  </footer>
));

const FeatureCard = memo(({ icon, title, desc }) => (
  <div className="feature-card">
    <div className="feature-icon-wrapper">
      <span className="feature-icon" aria-hidden="true">{icon}</span>
    </div>
    <div className="feature-text">
      <h3>{title}</h3>
      <p>{desc}</p>
    </div>
  </div>
));

const PricingCard = memo(({ plan, onPaymentStart, onPaymentEnd }) => {
  const stripePromise = loadStripe('pk_test_51R7ma3QLK8Ukfs4sBg4baWVuYz4UpN7v5x6GxCfAs4GGXuLTdrRiiqdtjAy9wPCBqT6nybXwlw7240h3Egpcz4RQ00VNfIVDSn');

  const handleSubscribe = async () => {
    if (plan.id === 'free') {
      await handleFreePlan();
    } else {
      await handlePaidPlan();
    }
  };

  const handleFreePlan = async () => {
    const email = prompt('Ingresa tu correo electrónico:');
    if (!email) return;
    
    const negocioNombre = prompt('Nombre de tu casa de empeño:');
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
        alert('¡Plan Free activado por 30 días!');
        window.location.href = '/dashboard';
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al activar el plan. Intenta de nuevo.');
    }
  };

  const handlePaidPlan = async () => {
    let email = localStorage.getItem('user_email');
    if (!email) {
      email = prompt('Correo electrónico para la factura:');
      if (!email) return;
      localStorage.setItem('user_email', email);
    }
    
    let empresaId = localStorage.getItem('empresa_id');
    if (!empresaId) {
      empresaId = 'nueva';
    }
    
    localStorage.setItem('pending_plan_id', plan.id);
    localStorage.setItem('pending_plan_name', plan.name);

    if (onPaymentStart) onPaymentStart();
    
    try {
      const response = await stripeService.createCheckoutSession({
        plan_id: plan.id,
        plan_name: plan.name,
        price: plan.priceInCents,
        empresa_id: empresaId,
        customer_email: email,
      });
      
      window.location.href = response.url;
      
    } catch (error) {
      console.error('Error:', error);
      alert('Error al iniciar el pago: ' + error.message);
      if (onPaymentEnd) onPaymentEnd();
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
  
  // Estados de autenticación
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userNombre, setUserNombre] = useState('');
  
  // Estados para el modal de pago
  const [searchParams] = useSearchParams();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentSessionId, setPaymentSessionId] = useState(null);
  const [paymentPlanName, setPaymentPlanName] = useState('');
  const [paymentProcessed, setPaymentProcessed] = useState(false);
  
  // Estado para el modal de carga
  const [isLoadingPayment, setIsLoadingPayment] = useState(false);

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

  // Verificar sesión al cargar la página
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

  // Funciones para el modal de carga
  const handlePaymentStart = () => {
    setIsLoadingPayment(true);
  };

  const handlePaymentEnd = () => {
    setIsLoadingPayment(false);
  };

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
      const response = await fetch('http://localhost:8000/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
      
      const result = await response.json();
      
      if (result.success) {
        alert('¡Mensaje enviado correctamente! Te contactaremos pronto.');
        setFormData({ nombre: '', negocio: '', telefono: '', mensaje: '' });
      } else {
        alert('Error: ' + result.error);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error de conexión. Revisa que el backend PHP esté corriendo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Función para cerrar sesión
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('empresa_id');
    localStorage.removeItem('user_email');
    setIsLoggedIn(false);
    setUserNombre('');
    window.location.href = '/';
  };

  // Manejar éxito del pago
  const handlePaymentSuccess = (data) => {
    console.log('✅ Pago verificado y suscripción activada:', data);
    setTimeout(() => {
      window.location.href = '/dashboard';
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
              Controla tus empeños, pagos y artículos en un solo lugar.
              Moderniza y automatiza tus procesos.
            </p>
            <div className="hero-buttons">
              <button className="btn-primary">
                <img className="StarIcon" src={StarIcon} alt="" aria-hidden="true" /> Soporte en español
              </button>
              <button className="btn-primary">
                <img className="StarIcon" src={StarIcon} alt="" aria-hidden="true" /> Datos seguros
              </button>
              <button className="btn-primary">
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
              <span className="subtitle2">NOSOTROS</span>
              <h2 id="mv-title">Plataforma web todo en uno</h2>
              <p>Gestiona empeños, inventario, pagos y reportes desde una sola plataforma intuitiva.</p>
            </div>

            <div className="mv-carousel" role="region" aria-label="Carrusel de Misión y Visión">
              <div className="mv-card">
                <div className="mv-image">
                  <img 
                    src={slides[activeSlide].img}
                    alt={slides[activeSlide].title}
                    loading="lazy"
                    width="500"
                    height="400"
                  />
                </div>
                <div className="mv-content">
                  <h3>{slides[activeSlide].title}</h3>
                  <p>{slides[activeSlide].text}</p>
                  <Link to="/login" style={{ textDecoration: 'none' }}>
                    <button className="btn-mv">Iniciar Sesión</button>
                  </Link>
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
                  <div className="step-card">
                    <span className="step-icon" aria-hidden="true">{step.icon}</span>
                    <p>{step.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* FUNCIONALIDADES */}
        <section className="func-section" id="nosotros" aria-labelledby="func-title">
          <div className="func-header">
            <span className="subtitle2">Funcionalidad</span>
            <h2 id="func-title">Funcionalidades completas para todos</h2>
            <p>Herramientas poderosas para administradores y una experiencia superior para clientes</p>
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
                      <span className="f-icon" aria-hidden="true">{f.icon}</span>
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
                      <span className="f-icon" aria-hidden="true">{f.icon}</span>
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
              />
            ))}
          </div>
        </div>

        {/* CONTACTO */}
        <div className="Contacto" id="contacto">
          <div className="contact-header">
            <span className="subtitle2">CONTÁCTANOS</span>
            <h2>Comienza tu transformación digital hoy</h2>
            <p>Agenda una demo personalizada y descubre cómo Ophelia puede revolucionar tu casa de empeño</p>
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
                    <strong> <span className="icon" aria-hidden="true">📧</span> Email</strong>
                    <p>contacto@ophelina.mx</p>
                  </div>
                </div>
                <div className="info-item2">
                  <div>
                    <strong><span className="icon" aria-hidden="true">📞</span> Teléfono</strong>
                    <p>+52 999 999 99 99</p>
                  </div>
                </div>
                <div className="info-item2">
                  <div>
                    <strong><span className="icon" aria-hidden="true">📍</span> Oficinas</strong>
                    <p>Mérida, Yucatan, México</p>
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