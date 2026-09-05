import { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { AtSign, CirclePlay, Menu, MoveUpRight, X } from "lucide-react";

import { Button } from "@/components/ui/button";

const navigation = [
    { label: "Inicio", href: "/" },
    { label: "Servicios", href: "/#servicios" },
    { label: "Sobre mí", href: "/#sobre-mi" },
];

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export function PublicLayout() {
<<<<<<< HEAD
    return (
        <>
            <Header />

            <main>
                <Outlet />
            </main>

            <Footer />
        </>
=======
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <div className="min-h-screen bg-[#f2f0eb] text-[#17252a]">
            <header className="site-header">
                <div className="site-header-inner">
                    <Link to="/" className="brand-link" onClick={() => setIsMenuOpen(false)}>
                        <span className="brand-mark">JF</span>
                        <span className="brand-name">
                            <span>José Fernando</span>
                            <span>Elorza</span>
                        </span>
                    </Link>

                    <button type="button" className="menu-toggle" aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"} onClick={() => setIsMenuOpen(!isMenuOpen)}>
                        {isMenuOpen ? <X /> : <Menu />}
                    </button>
                </div>

                {isMenuOpen && <nav className="mobile-nav" aria-label="Navegación móvil">
                    <div className="mobile-nav-links">
                        {navigation.map((item) => <a key={item.href} href={item.href} onClick={() => setIsMenuOpen(false)}>{item.label}</a>)}
                        <Link to="/login" onClick={() => setIsMenuOpen(false)}>Ingresar</Link>
                        <Button asChild className="w-fit rounded-full bg-[#d46a3a] text-white hover:bg-[#b9542a]"><a href="/#contacto">Agendar sesión <MoveUpRight /></a></Button>
                    </div>
                </nav>}
            </header>

            <Outlet />

            <footer className="bg-[#17252a] px-6 py-12 text-[#f6f4ef] lg:px-10">
                <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-[1.5fr_1fr_1fr]">
                    <div>
                        <p className="font-heading text-2xl font-bold text-[#f6f4ef]">José Fernando Elorza</p>
                        <p className="mt-3 max-w-sm text-sm leading-7 text-[#f6f4ef]/65">Un espacio para ordenar tus ideas, tomar decisiones y avanzar con intención.</p>
                    </div>
                    <div><p className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-[#f5b544]">Explora</p><div className="flex flex-col gap-3 text-sm text-[#f6f4ef]/75"><a href="/#servicios" className="hover:text-white">Servicios</a><a href="/#sobre-mi" className="hover:text-white">Sobre mí</a><a href="/#contacto" className="hover:text-white">Contacto</a></div></div>
                    <div><p className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-[#f5b544]">Sígueme</p><div className="flex gap-3"><a aria-label="Instagram" href="https://instagram.com" target="_blank" rel="noreferrer" className="rounded-full border border-white/20 p-2 hover:border-[#f5b544]"><AtSign size={18} /></a><a aria-label="YouTube" href="https://youtube.com" target="_blank" rel="noreferrer" className="rounded-full border border-white/20 p-2 hover:border-[#f5b544]"><CirclePlay size={18} /></a></div></div>
                </div>
                <div className="mx-auto mt-12 flex max-w-7xl flex-col gap-3 border-t border-white/10 pt-5 text-xs text-[#f6f4ef]/45 sm:flex-row sm:items-center sm:justify-between"><span>© 2026 José Fernando Elorza</span><div className="flex gap-5"><Link to="/terminos" className="hover:text-white">Términos de uso</Link><Link to="/privacidad" className="hover:text-white">Política de privacidad</Link></div></div>
            </footer>
        </div>
>>>>>>> 6ae4ec9 (Prototipo de la fase-01)
    );
}