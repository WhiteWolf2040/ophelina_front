import React, { useState } from "react"; // Importar useState
import LogoInicial from "../assets/LogoWhite.png";
import Logobb from "../assets/O_blue.png";
import StarIcon from "../assets/StarIcon.png";
import { Link } from 'react-router-dom';
import "./LandingPage.css";

const Landing = () => {
  // Estado para el carrusel de MissionVision
  const [activeSlide, setActiveSlide] = useState(0);

  // Datos para el carrusel de MissionVision
  const slides = [
    {
      title: "Misión",
      text: "Optimizar la administración de casas de empeño mediante una plataforma web SaaS que automatice procesos clave y mejore la experiencia del usuario.",
      img: "/path-to-jewelry-image.jpg"
    },
    {
      title: "Visión",
      text: "Ser la plataforma líder en México para la digitalización del sector prendario, ofreciendo seguridad y eficiencia a cada negocio.",
      img: "/path-to-vision-image.jpg"
    }
  ];

  // Datos para los pasos de MissionVision
  const steps = [
    { icon: "👤", label: "Regístrate" },
    { icon: "⚙️", label: "Configura" },
    { icon: "🏛️", label: "Comienza" },
    { icon: "📈", label: "Crece" }
  ];

  // Datos para las características principales
  const featuresData = [
    {
      title: "Pasarela de pago integrada",
      desc: "Acepta pagos en línea de forma segura con las principales opciones de México",
      icon: "💳" 
    },
    {
      title: "Recordatorios automáticos",
      desc: "Sistema inteligente de notificaciones por SMS, email y WhatsApp",
      icon: "⏰"
    },
    {
      title: "Precio del oro en tiempo real",
      desc: "Actualización automática de cotizaciones para valuaciones precisas",
      icon: "📈"
    },
    {
      title: "Tienda en linea",
      desc: "Acceso a tienda en linea para todos tus clientes, comprar o apartar.",
      icon: "🛒"
    },
    {
      title: "Escalabilidad en la nube",
      desc: "Crece sin límites con infraestructura cloud confiable y segura",
      icon: "☁️"
    },
    {
      title: "Acceso con dispositivos",
      desc: "Trabaja desde tu computadora, tablet o smartphone, en cualquier momento.",
      icon: "📱"
    }
  ];

  // Datos para funcionalidades de administradores
  const adminFeatures = [
    { icon: "⭐", title: "Gestión de inventario", desc: "Control total de artículos empeñados con fotos y valuaciones" },
    { icon: "🔔", title: "Control de préstamos", desc: "Seguimiento de montos, intereses y plazos de pago" },
    { icon: "💳", title: "Reportes y análisis", desc: "Dashboard con métricas clave y reportes personalizables" },
    { icon: "🔄", title: "Historial de clientes", desc: "Acceso completo a todo el historial de transacciones" },
    { icon: "⭐", title: "Cálculo automático", desc: "De los intereses generados por cada prenda." },
  ];

  // Datos para funcionalidades de clientes
  const clientFeatures = [
    { icon: "⭐", title: "Portal de cliente", desc: "Consulta en línea del estado de empeños y pagos" },
    { icon: "🔔", title: "Notificaciones automáticas", desc: "Recordatorios de vencimientos y actualizaciones" },
    { icon: "💳", title: "Pagos en línea", desc: "Abonos y liquidaciones con pasarela de pago integrada" },
    { icon: "🔄", title: "Historial transparente", desc: "Acceso completo a todo el historial de transacciones" },
    { icon: "⭐", title: "Tienda en línea", desc: "Aparta y compra artículos" },
  ];

  return (
    <>
      <div className="landing">
        {/* NAVBAR */}
        <header className="navbar">
          <div className="logo">
            <span className="logo-icon">
              <img className="logo-icon" src={Logobb} alt="Hero" />
            </span>
          </div>

          <nav className="nav-links">
            <a href="#nosotros">Nosotros</a>
            <a href="#suscripciones">Suscripciones</a>
            <a href="#contacto">Contacto</a>
            <Link to="/" style={{ textDecoration: 'none' }}>
      <button className="btn-login">
        Iniciar Sesión
      </button>
    </Link>
            
          </nav>
        </header>

        {/* HERO */}
        <section className="hero-section">
          <div className="hero-overlay">
            <div>
              <img className="LogoInicial" src={LogoInicial} alt="Hero" />
            </div>

            <p>
              Controla tus empeños, pagos y artículos en un solo lugar.
              Moderniza y automatiza tus procesos.
            </p>

            <div className="hero-buttons">
              <button className="btn-primary">
                <img className="StarIcon" src={StarIcon} alt="" /> Soporte en español
              </button>
              <button className="btn-primary">
                <img className="StarIcon" src={StarIcon} alt="" /> Datos seguros
              </button>
              <button className="btn-primary">
                <img className="StarIcon" src={StarIcon} alt="" /> Cumplimiento normativo
              </button>
            </div>
          </div>
        </section>
      </div>
      
      {/* SECCIÓN DE CARACTERÍSTICAS */}
      <div className="fondo">
        {/* SECCIÓN MISIÓN Y VISIÓN */}
        <div className="misionvision">
          <section className="mv-section">
            <div className="mv-header">
              <span className="subtitle">CARACTERÍSTICAS</span>
              <h2>Plataforma web todo en uno</h2>
              <p>Gestiona empeños, inventario, pagos y reportes desde una sola plataforma intuitiva.</p>
            </div>

            {/* Carrusel */}
            <div className="mv-carousel">
              <div className="mv-card">
                <div className="mv-image">
                  <img src={slides[activeSlide].img} alt={slides[activeSlide].title} />
                </div>
                <div className="mv-content">
                  <h3>{slides[activeSlide].title}</h3>
                  <p>{slides[activeSlide].text}</p>
                  <button className="btn-mv">Iniciar Sesión</button>
                </div>
              </div>
              {/* Controles del carrusel */}
              <div className="carousel-dots">
                {slides.map((_, i) => (
                  <span 
                    key={i} 
                    className={`dot ${activeSlide === i ? 'active' : ''}`}
                    onClick={() => setActiveSlide(i)}
                  ></span>
                ))}
              </div>
            </div>

            {/* Pasos / Proceso */}
            <div className="process-steps">
              <div className="steps-line"></div>
              {steps.map((step, index) => (
                <div className="step-item" key={index}>
                  <div className="step-card">
                    <span className="step-icon">{step.icon}</span>
                    <p>{step.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* FUNCIONALIDADES PARA ADMINISTRADORES Y CLIENTES */}
        <section className="func-section" id="nosotros">
          <div className="func-header">
            <span className="subtitle">CARACTERÍSTICAS</span>
            <h2>Funcionalidades completas para todos</h2>
            <p>Herramientas poderosas para administradores y una experiencia superior para clientes</p>
          </div>

          <div className="func-container">
            {/* Columna Administradores */}
            <div className="func-column">
              <h3>Para Administradores</h3>
              <div className="func-card">
                <div className="image-wrapper">
                  <img src="/path-to-admin-image.jpg" alt="Administradores" />
                </div>
                <ul className="feature-list">
                  {adminFeatures.map((f, i) => (
                    <li key={i}>
                      <span className="f-icon">{f.icon}</span>
                      <div>
                        <strong>{f.title}</strong>
                        <p>{f.desc}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="vertical-divider"></div>

            {/* Columna Clientes */}
            <div className="func-column">
              <h3>Para Clientes</h3>
              <div className="func-card">
                <div className="image-wrapper">
                  <img src="/path-to-client-image.jpg" alt="Clientes" />
                </div>
                <ul className="feature-list">
                  {clientFeatures.map((f, i) => (
                    <li key={i}>
                      <span className="f-icon">{f.icon}</span>
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

        {/* SECCIÓN DE CARACTERÍSTICAS ÚNICAS */}
        <section className="features-section">
          <div className="features-container">
            <header className="features-header">
              <span className="features-subtitle">CARACTERÍSTICAS</span>
              <h2 className="features-title">Lo que nos hace únicos</h2>
              <p className="features-description">
                Características que marcan la diferencia y potencian tu negocio
              </p>
              <button className="features-btn">Solicitar Demo</button>
            </header>

            <div className="features-grid">
              {featuresData.map((item, index) => (
                <div key={index} className="feature-card">
                  <div className="feature-icon-wrapper">
                    <span className="feature-icon">{item.icon}</span>
                  </div>
                  <div className="feature-text">
                    <h3>{item.title}</h3>
                    <p>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECCIÓN DE PLANES */}
        <div className="Planes" id="suscripciones">
          <div className="pricing-header">
            <center>
              <span className="subtitle">Inversión</span>
              <h2>Planes flexibles para cada negocio</h2>
              <p>Elige el plan que mejor se adapte a tus necesidades. Sin sorpresas, sin costos ocultos.</p>
            </center>
          </div>

          <div className="pricing-container">
            {/* Plan Básico */}
            <div className="pricing-card">
              <h3>Básico</h3>
              <div className="price">
                <span className="currency">$</span>
                <span className="amount">50</span>
                <span className="period">/ mo</span>
              </div>
              <ul>
                <li>1 usuario administrador</li>
                <li>Precio del oro en tiempo real</li>
                <li>Recordatorios automáticos</li>
                <li>Portal de cliente básico</li>
                <li>Soporte por email</li>
              </ul>
              <button className="btn-outline">Probar</button>
            </div>

            {/* Plan Profesional - DESTACADO */}
            <div className="pricing-card featured">
              <div className="badge">Más popular</div>
              <h3>Profesional</h3>
              <div className="price">
                <span className="currency">$</span>
                <span className="amount">999</span>
                <span className="period">/ mo</span>
              </div>
              <ul>
                <li>Hasta 5 usuarios</li>
                <li>Portal de cliente avanzado</li>
                <li>Cálculo de intereses automático</li>
                <li>Reportes y control de pagos</li>
                <li>Soporte prioritario</li>
              </ul>
              <button className="btn-filled">Comenzar ahora</button>
            </div>

            {/* Plan Empresarial */}
            <div className="pricing-card">
              <h3>Empresarial</h3>
              <div className="price">
                <span className="currency">$</span>
                <span className="amount">4,999</span>
                <span className="period">/ mo</span>
              </div>
              <ul>
                <li>Usuarios ilimitados</li>
                <li>Múltiples sucursales</li>
                <li>Pasarela de pago</li>
                <li>Tienda en línea</li>
                <li>Todo lo del Plan Profesional</li>
              </ul>
              <button className="btn-outline">Probar</button>
            </div>
          </div>
          
          <center>
            <p className="pricing-footer">
              Todos los planes incluyen 14 días de prueba gratuita • Sin tarjeta de crédito requerida
            </p>
          </center>
        </div>

        {/* SECCIÓN DE CONTACTO */}
        <div className="Contacto" id="contacto">
          <div className="contact-header">
            <span className="subtitle">Contáctanos</span>
            <h2>Comienza tu transformación digital hoy</h2>
            <p>Agenda una demo personalizada y descubre cómo Ophelia puede revolucionar tu casa de empeño</p>
          </div>

          <div className="contact-container">
            {/* Formulario de Contacto */}
            <div className="contact-form-card">
              <h3>Gracias por confiar en empresas Mexicanas</h3>
              <form>
                <div className="form-group">
                  <label>Nombre completo *</label>
                  <input type="text" placeholder="Value" required />
                </div>
                <div className="form-group">
                  <label>Nombre de tu casa de empeño *</label>
                  <input type="text" placeholder="Value" required />
                </div>
                <div className="form-group">
                  <label>Teléfono *</label>
                  <input type="tel" placeholder="Value" required />
                </div>
                <div className="form-group">
                  <label>Mensaje:</label>
                  <textarea placeholder="Value" rows="4"></textarea>
                </div>
                <button type="submit" className="btn-submit">Solicitar demo gratuita</button>
              </form>
            </div>

            {/* Información Lateral */}
            <div className="contact-info-column">
              <div className="info-card dark">
                <h4>Otras formas de contacto</h4>
                <div className="info-item">
                  <span className="icon">📧</span>
                  <div>
                    <strong>Email</strong>
                    <p>contacto@opheina.mx</p>
                  </div>
                </div>
                <div className="info-item">
                  <span className="icon">📞</span>
                  <div>
                    <strong>Teléfono</strong>
                    <p>+52 999 999 99 99</p>
                  </div>
                </div>
                <div className="info-item">
                  <span className="icon">📍</span>
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
      
      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-container">
          {/* Sección del Logo y Redes */}
          <div className="footer-brand">
            <div className="footer-logo">
              <img className="" src={LogoInicial} alt="Hero" />
            </div>
            <div className="footer-socials">
              <a href="#"><i className="fab fa-x-twitter"></i></a>
              <a href="#"><i className="fab fa-instagram"></i></a>
              <a href="#"><i className="fab fa-youtube"></i></a>
              <a href="#"><i className="fab fa-linkedin"></i></a>
            </div>
          </div>

          {/* Columnas de Enlaces */}
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
                <li><a href="#">Contacto</a></li>
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
          <p>Hecho con <span className="heart">❤</span> para las casas de empeño de México</p>
        </div>
      </footer>
    </>
  );
};

export default Landing;