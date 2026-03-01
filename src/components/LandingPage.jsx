import React, { useState, useEffect, useCallback, memo } from "react";
import LogoInicial from "../assets/LogoWhite.png";
import Logobb from "../assets/O_blue.png";
import gold from "../assets/gold.jpg";
import client from "../assets/client.jpg";
import admin from "../assets/admin.jpg";
import ahorros from "../assets/ahorros.jpg";
import StarIcon from "../assets/StarIcon.png";
import { Link } from 'react-router-dom';
import "./LandingPage.css";

// Datos centralizados
const slides = [
  {
    title: "Misión",
    text: "Optimizar la administración de casas de empeño mediante una plataforma web SaaS que automatice procesos clave y mejore la experiencia del usuario.",
    img: ahorros  // Reemplazar con import real
  },
  {
    title: "Visión",
    text: "Ser la plataforma líder en México para la digitalización del sector prendario, ofreciendo seguridad y eficiencia a cada negocio.",
    img: gold // Reemplazar con import real
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
    name: "Básico",
    price: 50,
    features: ["1 usuario administrador", "Precio del oro en tiempo real", "Recordatorios automáticos", "Portal de cliente básico", "Soporte por email"],
    buttonText: "Probar",
    featured: false
  },
  {
    name: "Profesional",
    price: 999,
    features: ["Hasta 5 usuarios", "Portal de cliente avanzado", "Cálculo de intereses automático", "Reportes y control de pagos", "Soporte prioritario"],
    buttonText: "Comenzar ahora",
    featured: true,
    badge: "Más popular"
  },
  {
    name: "Empresarial",
    price: 4999,
    features: ["Usuarios ilimitados", "Múltiples sucursales", "Pasarela de pago", "Tienda en línea", "Todo lo del Plan Profesional"],
    buttonText: "Probar",
    featured: false
  }
];

// Componentes memoizados
const Navbar = memo(() => (
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
      <Link to="/login" style={{ textDecoration: 'none' }}>
        <button className="btn-login" aria-label="Iniciar sesión">Iniciar Sesión</button>
      </Link>
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

const PricingCard = memo(({ plan }) => (
  <div className={`pricing-card ${plan.featured ? 'featured' : ''}`}>
    {plan.badge && <div className="badge">{plan.badge}</div>}
    <h3>{plan.name}</h3>
    <div className="price">
      <span className="currency">$</span>
      <span className="amount">{plan.price.toLocaleString()}</span>
      <span className="period">/ mo</span>
    </div>
    <ul>
      {plan.features.map((feature, i) => (
        <li key={i}>{feature}</li>
      ))}
    </ul>
   

       <a href="#contacto" className={plan.featured ? 'btn-filled' : 'btn-outline'} >
       <center>
         {plan.buttonText}
       </center>
       </a>
          
   
  </div>
));

// Componente principal
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
    
    // Simular envío
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Formulario enviado:', formData);
      setFormData({ nombre: '', negocio: '', telefono: '', mensaje: '' });
      alert('¡Gracias por contactarnos! Te responderemos pronto.');
    } catch (error) {
      alert('Error al enviar el formulario. Intenta de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="landing">
        <Navbar />
        
        <section className="hero-section" aria-label="Hero">
          <div className="hero-overlay">
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
              <span className="subtitle">CARACTERÍSTICAS</span>
              <h2 id="mv-title">Plataforma web todo en uno</h2>
              <p>Gestiona empeños, inventario, pagos y reportes desde una sola plataforma intuitiva.</p>
            </div>

            {/* Carrusel */}
            <div 
              className="mv-carousel" 
              role="region" 
              aria-label="Carrusel de Misión y Visión"
            >
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
                   <Link to="/loging" style={{ textDecoration: 'none' }}>
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

            {/* Pasos */}
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
            <span className="subtitle">Funcionalidad</span>
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
              <span className="subtitle">CARACTERÍSTICAS</span>
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
              <span className="subtitle">Inversión</span>
              <h2>Planes flexibles para cada negocio</h2>
              <p>Elige el plan que mejor se adapte a tus necesidades. Sin sorpresas, sin costos ocultos.</p>
            </center>
          </div>

          <div className="pricing-container">
            {plans.map((plan, index) => (
              <PricingCard key={index} plan={plan} />
            ))}
          </div>
          
          <center>
            <p className="pricing-footer">
              Todos los planes incluyen 14 días de prueba gratuita • Sin tarjeta de crédito requerida
            </p>
          </center>
        </div>

        {/* CONTACTO */}
        <div className="Contacto" id="contacto">
          <div className="contact-header">
            <span className="subtitle">Contáctanos</span>
            <h2>Comienza tu transformación digital hoy</h2>
            <p>Agenda una demo personalizada y descubre cómo Ophelia puede revolucionar tu casa de empeño</p>
          </div>

          <div className="contact-container">
            <div className="contact-form-card">
              <h3>Gracias por confiar en empresas Mexicanas</h3>
              <form onSubmit={handleSubmit} noValidate>
                <div className="form-group">
                  <label htmlFor="nombre">Nombre completo *</label>
                  <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    placeholder="Ingresa tu nombre"
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
                    rows="4"
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
                <div className="info-item">
                  <span className="icon" aria-hidden="true">📧</span>
                  <div>
                    <strong>Email</strong>
                    <p>contacto@opheina.mx</p>
                  </div>
                </div>
                <div className="info-item">
                  <span className="icon" aria-hidden="true">📞</span>
                  <div>
                    <strong>Teléfono</strong>
                    <p>+52 999 999 99 99</p>
                  </div>
                </div>
                <div className="info-item">
                  <span className="icon" aria-hidden="true">📍</span>
                  <div>
                    <strong>Oficinas</strong>
                    <p>Mérida, Yucatan, México</p>
                  </div>
                </div>
                <hr />
                <div className="info-schedule">
                  <strong>Horario de atención</strong>
                  <p>Lunes a Viernes: 9:00 - 18:00</p>
                  <p>Sábado: 9:00 - 14:00</p>
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
    </>
  );
};

export default Landing;