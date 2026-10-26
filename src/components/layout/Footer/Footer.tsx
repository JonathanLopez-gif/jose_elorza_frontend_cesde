import { Link } from 'react-router-dom'
import { Mail, Phone } from 'lucide-react'

import { InstagramIcon } from '@/components/icons/SocialIcons'
import { BRAND, SOCIAL_LINKS } from '@/constants/brand'
import { NAVIGATION } from '@/constants/navigation'
import { APP_ROUTES } from '@/constants/routes'
import { SocialPlatformIcon } from '@/features/social/components/SocialPlatformIcon'
import { useSocialLinks } from '@/features/social/hooks/useSocialLinks'
import type { SocialPlatform } from '@/types/social'

import './footer.css'

/** Servicios del catálogo (enlazan a su detalle). */
const SERVICES = [
  { id: 'svc-biohipnosis', label: 'Biohipnosis Sistémica' },
  { id: 'svc-sesion-individual', label: 'Sesión individual de acompañamiento' },
]

/** Respaldo si la API de redes no responde. */
const FALLBACK_SOCIALS: { key: string; label: string; platform: SocialPlatform; href: string }[] = [
  { key: 'facebook', label: 'Facebook', platform: 'FACEBOOK', href: SOCIAL_LINKS.facebook },
  { key: 'spotify', label: 'Spotify', platform: 'SPOTIFY', href: SOCIAL_LINKS.spotify },
  { key: 'whatsapp', label: 'WhatsApp', platform: 'WHATSAPP', href: SOCIAL_LINKS.whatsapp },
  { key: 'youtube', label: 'YouTube', platform: 'YOUTUBE', href: SOCIAL_LINKS.youtube },
]

export function Footer() {
  const year = new Date().getFullYear()
  const { data: links } = useSocialLinks()
  const socials = links?.length
    ? links.map((l) => ({ key: l.id, label: l.name, platform: l.platform, href: l.url }))
    : FALLBACK_SOCIALS

  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div className="site-footer__brand">
          <p className="site-footer__name">José Elorza</p>
          <p className="site-footer__role">Coach &amp; Terapeuta Holístico</p>
        </div>

        <nav aria-labelledby="footer-nav">
          <h2 id="footer-nav">Navegación</h2>
          <ul>
            {NAVIGATION.map((item) => (
              <li key={item.label}>
                {item.href.includes('#') ? (
                  <a href={item.href}>{item.label}</a>
                ) : (
                  <Link to={item.href}>{item.label}</Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-labelledby="footer-services">
          <h2 id="footer-services">Servicios</h2>
          <ul>
            {SERVICES.map(({ id, label }) => (
              <li key={id}>
                <Link to={APP_ROUTES.serviceDetail(id)}>{label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="site-footer__contact">
          <h2>Contacto</h2>
          <ul>
            <li>
              <a href={BRAND.phoneHref}>
                <Phone aria-hidden="true" />
                {BRAND.phone}
              </a>
            </li>
            <li>
              <a href={`mailto:${BRAND.email}`}>
                <Mail aria-hidden="true" />
                {BRAND.email}
              </a>
            </li>
            <li>
              <a href={BRAND.instagramUrl} target="_blank" rel="noreferrer">
                <InstagramIcon />
                {BRAND.instagramHandle}
              </a>
            </li>
          </ul>
          <div className="site-footer__social">
            {socials.map(({ key, label, platform, href }) =>
              href ? (
                <a key={key} href={href} target="_blank" rel="noreferrer" aria-label={label}>
                  <SocialPlatformIcon platform={platform} />
                </a>
              ) : (
                <span key={key} aria-hidden="true">
                  <SocialPlatformIcon platform={platform} />
                </span>
              )
            )}
          </div>
        </div>
      </div>

      <div className="site-footer__bottom">
        <p className="site-footer__copy">
          © {year} José Elorza - Biohipnoterapeuta Sistémico - {BRAND.copyright}
        </p>
        <ul className="site-footer__legal">
          <li>
            <Link to={APP_ROUTES.privacy}>Política de Privacidad</Link>
          </li>
          <li>
            <Link to={APP_ROUTES.terms}>Términos y Condiciones</Link>
          </li>
        </ul>
      </div>
    </footer>
  )
}
