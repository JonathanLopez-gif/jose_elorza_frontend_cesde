import { Link } from 'react-router-dom'

import grassBackground from '@/assets/brand/fondo-recursos.jpg'
import { SOCIAL_LINKS } from '@/constants/brand'
import { APP_ROUTES } from '@/constants/routes'

const MANDALA = '/brand/logo-mark.svg'
const MANDALA_DARK = '/brand/logo-mark-oscuro.svg'
const HERO_CUTOUT = '/brand/jose-elorza.png'

/**
 * Fotografías de cada sección: recortes con fondo transparente en `src/assets/brand/`. Se usan automáticamente
 * si existen; mientras no estén se usa la fotografía del hero.
 *  - jose-recursos.(png|webp)   → "Recursos" (entregada: foto_3.png sin el fondo blanco).
 *  - jose-sobre-mi.(png|webp)   → "Sobre mí" (entregada: foto_jose_2.png, ya con transparencia).
 *  - fondo-sobre-mi.(jpg|png|webp) → fondo opcional del círculo de "Sobre mí" (por defecto, el pasto de Recursos).
 */
const aboutAssets = import.meta.glob<string>('/src/assets/brand/jose-sobre-mi.{png,webp}', {
  eager: true,
  query: '?url',
  import: 'default',
})
const resourcesAssets = import.meta.glob<string>('/src/assets/brand/jose-recursos.{png,webp}', {
  eager: true,
  query: '?url',
  import: 'default',
})
const aboutBgAssets = import.meta.glob<string>('/src/assets/brand/fondo-sobre-mi.{jpg,png,webp}', {
  eager: true,
  query: '?url',
  import: 'default',
})
const ABOUT_BG = Object.values(aboutBgAssets)[0] ?? grassBackground
const ABOUT_PHOTO = Object.values(aboutAssets)[0] ?? HERO_CUTOUT
const RESOURCES_PHOTO = Object.values(resourcesAssets)[0] ?? HERO_CUTOUT

/* ───────────────────────── Franja de beneficios ───────────────────────── */
const FEATURES = [
  {
    icon: 'ICONO 1.png',
    text: (
      <>
        <strong>+ 8 Años</strong>
        <br />
        Acompañando
        <br />
        procesos
      </>
    ),
  },
  {
    icon: 'ICONO 2.png',
    text: (
      <>
        Enfoque
        <br />
        <strong>Sistémico</strong>
        <br />e integrativo
      </>
    ),
  },
  {
    icon: 'ICONO 3.png',
    text: (
      <>
        <strong>Transformación</strong>
        <br />
        desde la raíz
        <br />
        no desde el síntoma
      </>
    ),
  },
  {
    icon: 'ICONO 4.png',
    text: (
      <>
        Sesiones
        <br />
        <strong>Presenciales</strong>
        <br />y Online
      </>
    ),
  },
]

export function FeaturesStrip() {
  return (
    <section className="hs-wrap features" aria-label="Características del acompañamiento">
      {FEATURES.map(({ icon, text }) => (
        <div className="features__item" key={icon}>
          <div className="features__icon">
            <img src={`/brand/${icon}`} alt="" />
          </div>
          <p>{text}</p>
        </div>
      ))}
    </section>
  )
}

/* ───────────────────────── Sobre mí + Áreas ───────────────────────── */
const AREAS = [
  {
    icon: 'ICONO 2.png',
    label: (
      <>
        Ansiedad
        <br />y Estrés
      </>
    ),
  },
  {
    icon: 'ICONO 3.png',
    label: (
      <>
        Autoestima
        <br />y Confianza
      </>
    ),
  },
  {
    icon: 'ICONO 5.png',
    label: (
      <>
        Patrones
        <br />
        Repetitivos
      </>
    ),
  },
  {
    icon: 'ICONO 1.png',
    label: (
      <>
        Relaciones
        <br />y Vínculos
      </>
    ),
  },
  {
    icon: 'ICONO 6.png',
    label: (
      <>
        Duelo y<br />
        Pérdidas
      </>
    ),
  },
  {
    icon: 'Icono P.I 4.png',
    label: (
      <>
        Propósito
        <br />y Sentido
        <br />
        de Vida
      </>
    ),
  },
]

export function AboutSection() {
  return (
    <>
      <section id="sobre-mi" className="hs-wrap about" aria-labelledby="about-title">
        <div className="about__visual">
          <img className="about__mandala" src={MANDALA} alt="" aria-hidden="true" />
          <img className="about__circle" src={ABOUT_BG} alt="" aria-hidden="true" />
          <img className="about__photo" src={ABOUT_PHOTO} alt="José Fernando Elorza" />
        </div>

        <div className="about__copy">
          <p className="hs-eyebrow hs-eyebrow--left">Sobre Mí</p>
          <h2 id="about-title" className="about__name">
            José Elorza
          </h2>
          <p className="about__role">Coach &amp; Terapeuta Holístico</p>
          <p>
            Mi propósito es ayudarte a liberar aquello que limita desde la raíz, para que puedas
            vivir con más claridad, bienestar y propósito.
          </p>
          <p>
            A través de diferentes herramientas terapéuticas, acompaño a personas a descubrir el
            origen de sus bloqueos emocionales, creencias y patrones repetitivos.
          </p>
          <a href="#proceso" className="hs-pill">
            CONOCE MÁS SOBRE MÍ
          </a>
        </div>
      </section>

      <section id="servicios-destacados" className="hs-wrap areas" aria-labelledby="areas-title">
        <p className="hs-eyebrow">¿En qué puedo ayudarte?</p>
        <h2 id="areas-title" className="areas__title">
          Áreas de Acompañamiento
        </h2>
        <ul className="areas__list">
          {AREAS.map(({ icon, label }) => (
            <li key={icon}>
              <img src={`/brand/${icon}`} alt="" />
              <span>{label}</span>
            </li>
          ))}
        </ul>
        <Link to={APP_ROUTES.services} className="hs-pill hs-pill--small areas__more">
          VER TODOS LOS SERVICIOS
        </Link>
      </section>
    </>
  )
}

/* ───────────────────────── Cómo trabajo ───────────────────────── */
const STEPS = [
  {
    icon: 'Icono P.I. 1.png',
    title: '1. Escucha',
    text: (
      <>
        Comprendemos tu historia
        <br />y lo que hoy te trae aquí.
      </>
    ),
  },
  {
    icon: 'Icono P.I. 2.png',
    title: '2. Identificación',
    text: (
      <>
        Exploramos el origen real
        <br />
        de tus bloqueos.
      </>
    ),
  },
  {
    icon: 'Icono P.I. 3.png',
    title: '3. Transformación',
    text: (
      <>
        A través de diferentes herramientas
        <br />
        terapéuticas accedemos a la raíz
        <br />y liberamos.
      </>
    ),
  },
  {
    icon: 'Icono P.I 4.png',
    title: '4. Integración',
    text: (
      <>
        Te acompaño a integrar
        <br />y sostener tu cambio
        <br />
        en el tiempo.
      </>
    ),
  },
]

export function ProcessSection() {
  return (
    <>
      <section id="proceso" className="hs-section process" aria-labelledby="process-title">
        <p className="hs-eyebrow">¿Cómo Trabajo?</p>
        <h2 id="process-title" className="hs-title">
          Un proceso profundo y transformador
        </h2>
        <ol className="process__steps">
          {STEPS.map(({ icon, title, text }) => (
            <li key={title}>
              <div className="process__circle">
                <img src={`/brand/${icon}`} alt="" />
              </div>
              <h3>{title}</h3>
              <p>{text}</p>
            </li>
          ))}
        </ol>
        <Link to={APP_ROUTES.services} className="hs-pill process__cta">
          AGENDA TUS SERVICIOS
        </Link>
      </section>

      <section className="hs-wrap quote" aria-label="Cita">
        <span className="quote__mark" aria-hidden="true">
          “
        </span>
        <blockquote>
          <p>
            Quien mira hacia afuera, sueña.
            <br />
            Quien mira hacia adentro, despierta.
          </p>
          <footer>- Carl Jung.</footer>
        </blockquote>
      </section>
    </>
  )
}

/* ───────────────────────── Recursos ───────────────────────── */
const RESOURCES = [
  {
    icon: 'ICONO 7.png',
    title: (
      <>
        Meditaciones
        <br />
        Guiadas
      </>
    ),
    text: (
      <>
        Recursos para calmar tu mente
        <br />y elevar tu energía.
      </>
    ),
    cta: 'ESCUCHAR AHORA',
    href: '#contacto',
  },
  {
    icon: 'ICONO 8.png',
    title: (
      <>
        Artículos
        <br />y Reflexiones
      </>
    ),
    text: (
      <>
        Lecturas que inspiran
        <br />a mirar hacia adentro.
      </>
    ),
    cta: 'LEER AHORA',
    href: '#contacto',
  },
  {
    icon: 'ICONO 9.png',
    title: <>Podcast</>,
    text: (
      <>
        Contenido para comprender
        <br />y transformar tu vida.
      </>
    ),
    cta: 'VER AHORA',
    href: SOCIAL_LINKS.youtube,
  },
]

export function ResourcesSection() {
  return (
    <section id="recursos" className="hs-section resources" aria-labelledby="resources-title">
      <p className="hs-eyebrow">Recursos Gratuitos</p>
      <h2 id="resources-title" className="hs-title">
        Contenido para tu bienestar
      </h2>

      <div className="resources__band">
        <div className="resources__visual" aria-hidden="true">
          <img className="resources__bg" src={grassBackground} alt="" />
          <img className="resources__mandala" src={MANDALA} alt="" />
          <img className="resources__photo" src={RESOURCES_PHOTO} alt="" />
        </div>

        <ul className="resources__list">
          {RESOURCES.map(({ icon, title, text, cta, href }) => (
            <li key={icon}>
              <div className="resources__icon">
                <img src={`/brand/${icon}`} alt="" />
              </div>
              <h3>{title}</h3>
              <p>{text}</p>
              <a
                href={href}
                className="resources__link"
                {...(href.startsWith('http') ? { target: '_blank', rel: 'noreferrer' } : {})}
              >
                {cta}
                <svg viewBox="0 0 38 14" aria-hidden="true">
                  <path
                    d="M1 7h35M30 1l7 6-7 6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

/* ───────────────────────── Contacto ───────────────────────── */
export function ContactBanner() {
  return (
    <section id="contacto" className="hs-section contact" aria-labelledby="contact-title">
      <p className="hs-eyebrow">Contacto</p>
      <div className="hs-wrap contact__banner">
        <img className="contact__mandala" src={MANDALA_DARK} alt="" aria-hidden="true" />
        <div className="contact__copy">
          <h2 id="contact-title">Da el primer paso hacia tu transformación</h2>
          <p>Aquí estoy para acompañarte en tu proceso.</p>
          <Link to={APP_ROUTES.services} className="contact__cta">
            AGENDA TU SESIÓN
          </Link>
        </div>
        <img className="contact__ghost" src={MANDALA_DARK} alt="" aria-hidden="true" />
      </div>
    </section>
  )
}
