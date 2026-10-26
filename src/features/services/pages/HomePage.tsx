import { CalendarCheck } from 'lucide-react'
import { Link } from 'react-router-dom'

import { APP_ROUTES } from '@/constants/routes'
import {
  AboutSection,
  ContactBanner,
  FeaturesStrip,
  ProcessSection,
  ResourcesSection,
} from '@/features/home/components/HomeSections'
import '@/features/home/home-sections.css'
import { HeroVisual } from '@/features/services/components/HeroVisual'

export function HomePage() {
  return (
    <>
      <div className="landing-page">
        <section className="hero-section" aria-label="Presentación">
          <div className="hero-copy">
            <p className="eyebrow">
              TRANSFORMA TU INTERIOR.
              <br />
              INSPIRA TU CAMINO.
            </p>
            <h1>
              Tu bienestar
              <br />
              empieza por
              <br />
              <span>entenderte</span>
            </h1>
            <p className="hero-text">
              Acompaño procesos de transformación profunda a través de diferentes herramientas.
              Descubre el origen de lo que te limita y reconecta con tu poder interior.
            </p>
            <div className="hero-buttons">
              <Link to={APP_ROUTES.services} className="btn-primary">
                AGENDA TU SESIÓN
              </Link>
              <a className="outline-button" href="#sobre-mi">
                CONOCE MÁS
              </a>
            </div>
            <p className="availability">
              <CalendarCheck size={20} strokeWidth={2} aria-hidden />
              Sesiones presenciales y online
            </p>
          </div>

          <HeroVisual />
        </section>
      </div>

      <FeaturesStrip />
      <AboutSection />
      <ProcessSection />
      <ResourcesSection />
      <ContactBanner />
    </>
  )
}
