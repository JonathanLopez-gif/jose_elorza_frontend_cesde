import { Link } from "react-router-dom";

type LegalPageProps = { title: string };

export function LegalPage({ title }: LegalPageProps) {
    return <main className="mx-auto min-h-[70vh] max-w-3xl px-6 py-20 lg:px-10"><Link to="/" className="text-sm font-semibold text-[#d46a3a] hover:underline">← Volver al inicio</Link><p className="mt-12 text-xs font-bold uppercase tracking-[0.2em] text-[#d46a3a]">Información legal</p><h1 className="mt-4 text-5xl font-bold">{title}</h1><div className="mt-10 space-y-6 text-sm leading-8 text-[#17252a]/70"><p>Esta página contiene la información legal de la plataforma web de José Fernando Elorza.</p><h2 className="text-2xl font-bold text-[#17252a]">Alcance</h2><p>El contenido definitivo de este documento será revisado y aprobado por el responsable del negocio antes de la publicación en producción.</p><h2 className="text-2xl font-bold text-[#17252a]">Contacto</h2><p>Para preguntas relacionadas con esta información, escribe a hola@joseelorza.com.</p></div></main>;
}