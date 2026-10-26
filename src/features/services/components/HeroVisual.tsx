/**
 * Hero: mandala de marca (detrás) + fotografía de José Fernando Elorza (delante).
 *
 * La fotografía es `public/brand/jose-elorza.png`: la misma imagen entregada (`design-assets/foto_jose_1.png`)
 * con el fondo blanco convertido en transparencia para poder ver la mandala detrás. No tiene filtros ni retoques.
 * La mandala es el símbolo oficial (`logo-mark.svg`).
 */
const MANDALA = '/brand/logo-mark.svg'
const PHOTO = '/brand/jose-elorza.png'

export function HeroVisual() {
  return (
    <div className="hero-art">
      <img className="hero-art__mandala" src={MANDALA} alt="" aria-hidden="true" />
      <img
        className="hero-art__photo"
        src={PHOTO}
        alt="José Fernando Elorza"
        width={1254}
        height={1254}
        decoding="async"
        fetchPriority="high"
      />
      <img
        className="hero-art__mandala hero-art__mandala--front"
        src={MANDALA}
        alt=""
        aria-hidden="true"
      />
    </div>
  )
}
