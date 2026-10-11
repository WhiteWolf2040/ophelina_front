import React, { useState } from "react";
import "./TerminosModal.css";

export default function TerminosModal({ onClose, onAccept }) {
  const [tabActiva, setTabActiva] = useState("terminos");

  return (
    <div className="terminos-modal-overlay" onClick={onClose}>
      <div className="terminos-modal" onClick={(e) => e.stopPropagation()}>
        <button
          className="terminos-modal-cerrar"
          onClick={onClose}
          aria-label="Cerrar"
        >
          ×
        </button>

        <h2 className="terminos-modal-titulo">Contrato de Servicio</h2>

        {/* Tabs */}
        <div className="terminos-tabs">
          <button
            className={`terminos-tab ${tabActiva === "terminos" ? "activo" : ""}`}
            onClick={() => setTabActiva("terminos")}
            type="button"
          >
            Términos y Condiciones
          </button>
          <button
            className={`terminos-tab ${tabActiva === "privacidad" ? "activo" : ""}`}
            onClick={() => setTabActiva("privacidad")}
            type="button"
          >
            Aviso de Privacidad
          </button>
        </div>

        <div className="terminos-modal-contenido">
          {tabActiva === "terminos" ? <Terminos /> : <Privacidad />}
        </div>

        <div className="terminos-modal-acciones">
          <button
            className="terminos-modal-btn-aceptar"
            onClick={onAccept}
            type="button"
          >
            Acepto los términos
          </button>
          
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   CONTENIDO: TÉRMINOS Y CONDICIONES
   ============================================================ */
function Terminos() {
  return (
    <>
      <p className="terminos-version">
        <strong>Términos y Condiciones de Uso – Ophelina</strong>
        <br />
        <small>Versión 1.0 · Julio de 2026</small>
      </p>

      <p>
        El uso de la plataforma Ophelina implica la aceptación plena y sin
        reservas de los presentes Términos y Condiciones. Si el usuario no está
        de acuerdo con alguno de ellos, deberá abstenerse de utilizar el
        servicio.
      </p>

      <h3>1. Identificación del proveedor</h3>
      <p>
        El presente servicio es proporcionado por el equipo <strong>Ophelina</strong>{" "}
        (en adelante "Ophelina", "nosotros" o "el Proveedor"), con domicilio en
        Mérida, Yucatán, México. Contacto general:{" "}
        <a href="mailto:contacto@ophaline.mx">contacto@ophaline.mx</a>. Para
        asuntos de privacidad:{" "}
        <a href="mailto:privacidad@ophaline.mx">privacidad@ophaline.mx</a>.
      </p>

      <h3>2. Definiciones</h3>
      <ul>
        <li><strong>"Servicio":</strong> la plataforma web SaaS Ophelina, accesible desde cualquier dispositivo con conexión a internet.</li>
        <li><strong>"Usuario B2B":</strong> dueño o administrador de una casa de empeño que contrata el servicio.</li>
        <li><strong>"Usuario B2C":</strong> persona que empeña artículos y accede al portal de clientes.</li>
        <li><strong>"Empleado":</strong> persona designada por el Usuario B2B para operar el sistema en una sucursal.</li>
        <li><strong>"Prenda":</strong> artículo empeñado y registrado en el sistema.</li>
        <li><strong>"Suscripción":</strong> contrato de uso del servicio con periodicidad mensual.</li>
      </ul>

      <h3>3. Objeto del servicio</h3>
      <p>
        Ophelina es una plataforma de administración diseñada para casas de
        empeño. Permite registrar clientes, gestionar prendas, calcular
        intereses, emitir recordatorios, visualizar reportes y ofrecer un portal
        de transparencia al cliente final. El servicio se ofrece bajo un modelo
        de suscripción mensual con planes Gratis, Profesional y Premium.
      </p>

      <h3>4. Registro y uso de cuenta</h3>
      <ul>
        <li>El Usuario B2B debe proporcionar información verídica al registrarse: nombre completo o razón social, correo electrónico, nombre de la casa de empeño, RFC y número de teléfono.</li>
        <li>El usuario es responsable de mantener la confidencialidad de sus credenciales de acceso.</li>
        <li>Ophelina no se hace responsable por accesos no autorizados derivados de descuido del usuario con sus contraseñas.</li>
        <li>El usuario puede añadir empleados bajo su cuenta y es responsable de las acciones de éstos dentro del sistema.</li>
      </ul>

      <h3>5. Planes, precios y pagos</h3>
      <ul>
        <li><strong>Plan Gratis:</strong> $0/mes. Incluye 1 sucursal, hasta 4 clientes nuevos al mes y máximo 40 empeños activos.</li>
        <li><strong>Plan Profesional:</strong> $999/mes. Incluye todo lo del plan Gratis, control de inventario, reportes básicos y cálculo automático de intereses.</li>
        <li><strong>Plan Premium:</strong> $1,499/mes. Incluye todo lo del plan Profesional, reportes avanzados, tienda en línea, roles y permisos, configuración multi-sucursal y prueba gratuita de 14 días.</li>
      </ul>
      <p>
        Los precios están expresados en pesos mexicanos (MXN) e incluyen IVA. El
        cobro se realiza de forma anticipada al inicio de cada período mensual.
      </p>

      <h3>6. Prueba gratuita</h3>
      <p>
        El Plan Premium incluye un período de prueba gratuita de 14 días. Al
        finalizar la prueba se realizará el cargo automático, salvo que el
        usuario cancele antes del vencimiento del período de prueba. No se
        realizarán reembolsos por fracciones del período de prueba no utilizadas.
      </p>

      <h3>7. Cancelaciones y reembolsos</h3>
      <ul>
        <li>El usuario puede cancelar su suscripción en cualquier momento mediante: (a) el panel de configuración de su cuenta, o (b) solicitud por escrito a <a href="mailto:contacto@ophaline.mx">contacto@ophaline.mx</a>. Ophelina enviará confirmación de cancelación al correo registrado en un plazo máximo de 48 horas.</li>
        <li>La cancelación será efectiva al término del período mensual ya pagado. No se realizarán reembolsos prorrateados.</li>
        <li>Ante falta de pago, Ophelina podrá suspender el acceso al servicio después de 5 días hábiles de vencimiento sin pago. Los datos se conservarán por 30 días adicionales para permitir la reactivación.</li>
        <li>Si el usuario no reactiva la cuenta en ese plazo, los datos podrán ser eliminados definitivamente, previa notificación por correo electrónico.</li>
      </ul>

      <h3>8. Uso permitido</h3>
      <ul>
        <li>Registrar y gestionar clientes y empeños reales de la casa de empeño contratante.</li>
        <li>Generar reportes internos para la toma de decisiones del negocio.</li>
        <li>Compartir acceso con empleados autorizados por el titular de la cuenta.</li>
        <li>Utilizar el portal de clientes para que los clientes finales consulten su información.</li>
      </ul>

      <h3>9. Uso prohibido</h3>
      <ul>
        <li>Registrar información falsa o de terceros sin su consentimiento.</li>
        <li>Usar el sistema para actividades ilegales, incluyendo lavado de dinero o evasión fiscal.</li>
        <li>Realizar ingeniería inversa, descompilar o intentar acceder al código fuente de la plataforma.</li>
        <li>Compartir credenciales con personas no autorizadas fuera de la organización.</li>
        <li>Intentar vulnerar la seguridad del sistema o de cuentas de otros usuarios.</li>
        <li>Usar el sistema para manejar objetos robados o de procedencia ilícita.</li>
      </ul>

      <h3>10. Propiedad intelectual</h3>
      <p>
        Todo el software, diseño, logotipo, marca, interfaz y contenido de
        Ophelina son propiedad exclusiva del equipo Ophelina y están protegidos
        por la Ley Federal del Derecho de Autor y la Ley de la Propiedad
        Industrial de México. El usuario obtiene únicamente una licencia de uso
        no exclusiva, intransferible y revocable para acceder al servicio durante
        el período de suscripción.
      </p>
      <p>
        Los datos del cliente (información de empeños, clientes y prendas) son
        propiedad del Usuario B2B. Ophelina no adquiere ningún derecho sobre el
        contenido ingresado por el usuario.
      </p>

      <h3>11. Privacidad y datos personales</h3>
      <p>
        El tratamiento de datos personales de los usuarios y de los clientes
        finales de las casas de empeño se rige por el Aviso de Privacidad de
        Ophelina, disponible en la plataforma, de conformidad con la Ley Federal
        de Protección de Datos Personales en Posesión de los Particulares
        (LFPDPPP).
      </p>

      <h3>12. Disponibilidad del servicio</h3>
      <p>
        Ophelina garantiza una disponibilidad objetivo del 99% mensual, medida
        como el porcentaje de tiempo en que la plataforma esté operativa respecto
        al tiempo total del mes, excluyendo mantenimientos programados
        notificados con al menos 24 horas de anticipación.
      </p>
      <p>
        Ophelina no se responsabiliza por interrupciones causadas por fuerza
        mayor, fallos de internet del usuario o problemas en servicios de
        terceros (hosting, CDN, pasarela de pagos).
      </p>

      <h3>13. Limitación de responsabilidad</h3>
      <p>
        Ophelina no será responsable por daños indirectos, incidentales o
        consecuentes derivados del uso o imposibilidad de uso del servicio,
        incluyendo pérdida de datos, pérdida de ingresos o daños reputacionales.
      </p>
      <p>
        La responsabilidad total de Ophelina ante el Usuario no excederá, en
        ningún caso, el monto efectivamente pagado por el Usuario durante los
        últimos 6 meses de suscripción. Lo anterior no aplica en caso de dolo o
        mala fe comprobada de Ophelina.
      </p>

      <h3>14. Suspensión y terminación</h3>
      <p>
        Ophelina puede suspender o cancelar cuentas que incumplan estos términos,
        previa notificación por correo electrónico con 5 días hábiles de
        anticipación, excepto en casos de violaciones graves de seguridad o uso
        ilícito comprobado que requieran acción inmediata.
      </p>

      <h3>15. Cambios en el servicio</h3>
      <p>
        Ophelina puede modificar funcionalidades, precios o estos términos con 30
        días de aviso previo por correo electrónico. El uso continuo del servicio
        tras ese plazo se considerará aceptación de los nuevos términos. Si el
        usuario no acepta los cambios, podrá cancelar su suscripción sin
        penalización.
      </p>

      <h3>16. Jurisdicción aplicable</h3>
      <p>
        Las presentes condiciones se rigen por las leyes de los Estados Unidos
        Mexicanos. Para cualquier controversia, las partes se someten
        expresamente a la jurisdicción de los tribunales competentes de la
        ciudad de Mérida, Yucatán, México, renunciando a cualquier otro fuero que
        pudiera corresponderles.
      </p>

      <h3>17. Relación con el cliente final (Usuario B2C)</h3>
      <p>
        El Usuario B2B es el único responsable frente a sus clientes finales de
        los términos del empeño, incluyendo plazos, intereses, condiciones de
        desempeño y disposición de prendas. Ophelina actúa únicamente como
        proveedor tecnológico y no participa en la relación comercial entre la
        casa de empeño y su cliente.
      </p>
      <p>
        El portal B2C se ofrece "tal cual" como herramienta de transparencia, sin
        que ello implique responsabilidad de Ophelina sobre el contenido
        mostrado.
      </p>

      <h3>18. Responsabilidad regulatoria del Usuario B2B</h3>
      <p>
        El Usuario B2B reconoce que la operación de una casa de empeño está
        sujeta a normativa federal y estatal aplicable (NOM-247-SE-2021,
        legislación local en materia de empeño, normativa fiscal y de protección
        al consumidor). Ophelina actúa exclusivamente como proveedor tecnológico
        y no sustituye las obligaciones legales, contables ni fiscales del
        Usuario B2B.
      </p>

      <h3>19. Naturaleza del servicio</h3>
      <p>
        Ophelina es una herramienta de gestión. No proporciona asesoría legal,
        fiscal, contable ni financiera. El Usuario B2B es el único responsable
        del cumplimiento de sus obligaciones fiscales, contables y regulatorias
        derivadas de su operación.
      </p>
    </>
  );
}

/* ============================================================
   CONTENIDO: AVISO DE PRIVACIDAD
   ============================================================ */
function Privacidad() {
  return (
    <>
      <p className="terminos-version">
        <strong>Aviso de Privacidad – Ophelina</strong>
        <br />
        <small>
          De conformidad con la Ley Federal de Protección de Datos Personales en
          Posesión de los Particulares (LFPDPPP) · Versión 1.0 · Julio de 2026
        </small>
      </p>

      <h3>1. Identidad del responsable</h3>
      <p>
        El responsable del tratamiento de sus datos personales es el equipo
        Ophelina, con domicilio en Mérida, Yucatán, México. Contacto de
        privacidad: <a href="mailto:privacidad@ophaline.mx">privacidad@ophaline.mx</a>.
      </p>

      <h3>2. Datos personales recopilados</h3>
      <ul>
        <li><strong>Usuarios B2B (dueños y administradores):</strong> nombre completo, correo electrónico, número de teléfono, nombre de la casa de empeño, RFC (para facturación).</li>
        <li><strong>Empleados:</strong> nombre completo, correo electrónico, rol dentro de la organización.</li>
        <li><strong>Clientes finales de casas de empeño:</strong> nombre completo, CURP, número de teléfono, correo electrónico, fotografía de la identificación oficial (INE) y fotografía de la prenda empeñada.</li>
        <li><strong>Datos técnicos de navegación:</strong> dirección IP, tipo de dispositivo, cookies de sesión.</li>
      </ul>
      <p>
        Ophelina no recopila datos sensibles como información de salud,
        religión, origen racial, opiniones políticas, datos biométricos ni
        información de menores de edad.
      </p>

      <h3>3. Finalidades del tratamiento</h3>
      <p><strong>Finalidades primarias</strong> (necesarias para el servicio):</p>
      <ul>
        <li>Identificar y registrar a los usuarios de la plataforma.</li>
        <li>Gestionar los empeños, prendas y pagos de la casa de empeño.</li>
        <li>Enviar notificaciones de vencimiento y recordatorios de pago.</li>
        <li>Emitir comprobantes de suscripción y gestionar la facturación.</li>
        <li>Brindar soporte técnico a los usuarios del sistema.</li>
      </ul>
      <p>
        <strong>Finalidades secundarias</strong> (opcionales; requieren
        consentimiento adicional):
      </p>
      <ul>
        <li>Enviar comunicaciones sobre nuevas funcionalidades o actualizaciones de Ophelina.</li>
        <li>Realizar análisis estadísticos agregados del uso de la plataforma para mejorar el servicio.</li>
      </ul>
      <p>
        El consentimiento para las finalidades secundarias se obtiene al marcar
        la casilla correspondiente durante el registro o podrá manifestarse
        posteriormente enviando un correo a{" "}
        <a href="mailto:privacidad@ophaline.mx">privacidad@ophaline.mx</a>. La
        negativa a otorgarlo no será motivo de negación del servicio.
      </p>

      <h3>4. Transferencias de datos</h3>
      <p>
        Ophelina puede compartir datos personales con los siguientes terceros,
        únicamente para cumplir las finalidades primarias descritas:
      </p>
      <ul>
        <li><strong>Proveedor de hospedaje en la nube</strong> (ej. AWS, Google Cloud): para almacenamiento seguro de la base de datos.</li>
        <li><strong>Procesador de pagos</strong> (ej. Stripe, Conekta): para gestionar cobros de suscripción de forma segura.</li>
        <li><strong>Servicio de envío de correos y notificaciones</strong> (ej. SendGrid, Twilio): para enviar recordatorios a clientes.</li>
      </ul>
      <p>
        Ophelina no vende, cede ni transfiere datos personales a terceros con
        fines comerciales propios.
      </p>

      <h3>5. Derechos ARCO del titular</h3>
      <p>
        Todo titular de datos personales tiene el derecho de Acceder,
        Rectificar, Cancelar u Oponerse (derechos ARCO) al tratamiento de sus
        datos. Para ejercerlos:
      </p>
      <ul>
        <li>Enviar solicitud al correo <a href="mailto:privacidad@ophaline.mx">privacidad@ophaline.mx</a> con asunto "Ejercicio de derechos ARCO".</li>
        <li>Incluir nombre completo, correo registrado, tipo de derecho que desea ejercer y documentación que acredite su identidad.</li>
      </ul>
      <p>Ophelina responderá en un plazo máximo de 20 días hábiles.</p>

      <h3>6. Conservación y eliminación de datos</h3>
      <ul>
        <li>Datos de clientes finales de casas de empeño: se conservan durante la vigencia del empeño y hasta 5 años después para cumplimiento de obligaciones legales y fiscales.</li>
        <li>Datos de usuarios B2B: se conservan mientras la suscripción esté activa y hasta 5 años después de su cancelación.</li>
        <li>Datos técnicos de navegación: se eliminan automáticamente a los 90 días.</li>
      </ul>
      <p>
        Ante solicitud de cancelación (derecho ARCO), los datos se eliminan en un
        plazo máximo de 30 días hábiles, salvo obligación legal de conservación.
      </p>

      <h3>7. Medidas de seguridad</h3>
      <p>
        Ophelina implementa medidas técnicas, administrativas y físicas para
        proteger los datos personales contra acceso no autorizado, pérdida,
        divulgación o alteración, incluyendo: cifrado de datos en tránsito
        (HTTPS/TLS), control de acceso por roles, contraseñas cifradas con
        bcrypt y respaldos automáticos en servidores seguros.
      </p>

      <h3>8. Cambios al aviso de privacidad</h3>
      <p>
        Cualquier modificación a este aviso será notificada por correo
        electrónico con al menos 15 días de anticipación. La versión actualizada
        estará disponible en la plataforma con su fecha de entrada en vigor.
      </p>
    </>
  );
}