import { ArrowRight, CalendarCheck, ChevronRight, Heart, Leaf, Play, Target, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

const services = [
    ["ICONO 1.png", "Ansiedad y Estrés"], ["ICONO 2.png", "Autoestima y Confianza"], ["ICONO 3.png", "Patrones Repetitivos"],
    ["ICONO 4.png", "Relaciones y Vínculos"], ["ICONO 5.png", "Duelo y Pérdidas"], ["ICONO 6.png", "Propósito y Sentido de Vida"],
];
const process: [LucideIcon, string, string][] = [[Users, "1. Escucha", "Comprendemos tu historia y lo que hoy te trae aquí."], [Target, "2. Identificación", "Exploramos el origen real de tus bloqueos."], [Heart, "3. Transformación", "Accedemos a la raíz y liberamos lo que ya no necesitas."], [Leaf, "4. Integración", "Te acompaño a sostener tu cambio en el tiempo."]];

export function HomePage() {
    return (
        <main className="landing-page">
            <section className="hero-section">
                <div className="hero-copy">
                    <p className="eyebrow">TRANSFORMA TU INTERIOR.<br />INSPIRA TU CAMINO.</p>
                    <h1>Tu bienestar<br />empieza por<br /><span>entenderte</span></h1>
                    <p className="hero-text">Acompaño procesos de transformación profunda a través de diferentes herramientas. Descubre el origen de lo que te limita y reconecta con tu poder interior.</p>
                    <div className="hero-buttons">
                        <Button asChild><a href="#contacto">AGENDA TU SESIÓN</a></Button>
                        <a className="outline-button" href="#sobre-mi">CONOCE MÁS</a>
                    </div>
                    <p className="availability"><CalendarCheck size={22} /> Sesiones presenciales y online</p>
                </div>
            </section>

            <section className="services-cta">
                <a href="#servicios" className="wide-button">VER TODOS LOS SERVICIOS</a>
            </section>

            <section className="trust-strip">
                <div><Users /><strong>+ 8 Años</strong><span>Acompañando<br />procesos</span></div>
                <div><img src="/brand/ICONO 3.png" alt="" /><span>Enfoque<br /><strong>Sistémico</strong><br />e integrativo</span></div>
                <div><Heart /><span><strong>Transformación</strong><br />desde la raíz<br />no desde el síntoma</span></div>
                <div><img src="/brand/ICONO 4.png" alt="" /><span>Sesiones<br /><strong>Presenciales</strong><br />y Online</span></div>
            </section>

            <section id="sobre-mi" className="about-section">
                <div className="about-copy">
                    <p className="eyebrow">SOBRE MÍ</p>
                    <h2>José Elorza</h2>
                    <h3>Coach &amp; Terapeuta Holístico</h3>
                    <p>Mi propósito es ayudarte a liberar aquello que limita desde la raíz, para que puedas vivir con más claridad, bienestar y propósito.</p>
                    <p>A través de diferentes herramientas terapéuticas, acompaño a personas a descubrir el origen de sus bloqueos emocionales, creencias y patrones repetitivos.</p>
                    <Button asChild><a href="#contacto">CONOCE MÁS SOBRE MÍ</a></Button>
                </div>
            </section>

            <section id="servicios" className="services-section">
                <p className="eyebrow">¿EN QUÉ PUEDO AYUDARTE?</p>
                <h2>Áreas de Acompañamiento</h2>
                <div className="service-grid">{services.map(([icon, title]) => <article key={title}><img src={`/brand/${icon}`} alt="" /><h3>{title}</h3></article>)}</div>
                <a className="wide-button" href="#contacto">VER TODOS LOS SERVICIOS</a>
            </section>

            <section id="proceso" className="process-section">
                <p className="eyebrow">¿CÓMO TRABAJO?</p>
                <h2>Un proceso profundo y transformador</h2>
                <div className="process-grid">{process.map(([Icon, title, text]) => { const ProcessIcon = Icon; return <article key={title}><div className="process-icon"><ProcessIcon /></div><h3>{title}</h3><p>{text}</p></article>; })}</div>
                <Button asChild><a href="#contacto">AGENDA TUS SERVICIOS</a></Button>
            </section>

            <section id="recursos" className="resources-section">
                <p className="eyebrow">RECURSOS GRATUITOS</p>
                <h2>Contenido para tu bienestar</h2>
                <div className="resource-grid"><article><div className="resource-icon"><img src="/brand/Icono P.I. 1.png" alt="" /></div><h3>Meditaciones<br />Guiadas</h3><p>Recursos para calmar tu mente y elevar tu energía.</p><a href="#contacto">ESCUCHAR AHORA <ChevronRight /></a></article><article><div className="resource-icon"><img src="/brand/Icono P.I. 2.png" alt="" /></div><h3>Artículos<br />y Reflexiones</h3><p>Lecturas que inspiran a mirar hacia adentro.</p><a href="#contacto">LEER AHORA <ChevronRight /></a></article><article><div className="resource-icon"><img src="/brand/Icono P.I. 3.png" alt="" /></div><h3>Podcast</h3><p>Contenido para comprender y transformar tu vida.</p><a href="#contacto">VER AHORA <Play /></a></article></div>
            </section>

            <section id="contacto" className="contact-section">
                <div className="contact-copy">
                    <p className="eyebrow">CONTACTO</p>
                    <h2>Da el primer paso hacia tu transformación</h2>
                    <p>Aquí estoy para acompañarte en tu proceso.</p>
                    <Button asChild><a href="mailto:josefernandoelorza@gmail.com">AGENDA TU SESIÓN <ArrowRight /></a></Button>
                </div>
            </section>
        </main>
    );
}

