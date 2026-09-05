import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowRight, CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { storage } from "@/lib/storage";
import { useAuthStore } from "@/store/slices/auth.store";

type AuthMode = "login" | "register" | "recover";

const copy: Record<AuthMode, { eyebrow: string; title: string; description: string; action: string }> = {
    login: { eyebrow: "Qué bueno verte", title: "Ingresa a tu espacio", description: "Consulta tus sesiones y continúa tu proceso.", action: "Ingresar" },
    register: { eyebrow: "Comienza aquí", title: "Crea tu cuenta", description: "Guarda tus citas y recibe información importante de tus sesiones.", action: "Crear cuenta" },
    recover: { eyebrow: "Recupera el acceso", title: "¿Olvidaste tu contraseña?", description: "Te enviaremos instrucciones para volver a entrar.", action: "Enviar instrucciones" },
};

export function AuthPage() {
    const location = useLocation();
    const setAccessToken = useAuthStore((state) => state.setAccessToken);
    const mode: AuthMode = location.pathname === "/registro" ? "register" : location.pathname === "/recuperar" ? "recover" : "login";
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const [message, setMessage] = useState("");
    const currentCopy = copy[mode];

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (mode === "register" && !acceptedTerms) {
            setMessage("Debes aceptar los términos de uso y la política de privacidad.");
            return;
        }
        if (mode !== "recover") {
            const demoToken = `demo-${Date.now()}`;
            storage.setToken(demoToken);
            setAccessToken(demoToken);
        }
        setMessage(mode === "recover" ? "Si el correo está registrado, recibirás instrucciones pronto." : "Listo. Tu cuenta está preparada para continuar.");
    }

    return <main className="grid min-h-[calc(100vh-77px)] lg:grid-cols-2"><section className="hidden bg-[#17252a] px-10 py-16 text-[#f6f4ef] lg:flex lg:flex-col lg:justify-between"><Link to="/" className="font-heading text-xl font-bold">José Fernando Elorza</Link><div><p className="mb-5 text-xs font-bold uppercase tracking-[0.2em] text-[#f5b544]">Un espacio para ti</p><p className="max-w-md text-5xl font-bold leading-tight text-[#f6f4ef]">La claridad también se construye acompañado.</p></div><p className="text-sm text-white/55">Sesiones online · Colombia y el mundo</p></section><section className="flex items-center justify-center px-6 py-16"><div className="w-full max-w-md"><Link to="/" className="text-sm font-semibold text-[#d46a3a] hover:underline">← Volver al inicio</Link><p className="mt-12 text-xs font-bold uppercase tracking-[0.2em] text-[#d46a3a]">{currentCopy.eyebrow}</p><h1 className="mt-3 text-4xl font-bold">{currentCopy.title}</h1><p className="mt-4 text-sm leading-7 text-[#17252a]/65">{currentCopy.description}</p><form className="mt-8 space-y-5" onSubmit={handleSubmit}>{mode === "register" && <label className="block text-sm font-semibold">Nombre completo<Input required value={name} onChange={(event) => setName(event.target.value)} className="mt-2" placeholder="Tu nombre" /></label>}<label className="block text-sm font-semibold">Correo electrónico<Input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="mt-2" placeholder="nombre@correo.com" /></label>{mode !== "recover" && <label className="block text-sm font-semibold">Contraseña<Input required minLength={6} type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="mt-2" placeholder="Mínimo 6 caracteres" /></label>}{mode === "register" && <label className="flex items-start gap-3 text-xs font-normal leading-5 text-[#17252a]/70"><input required type="checkbox" checked={acceptedTerms} onChange={(event) => setAcceptedTerms(event.target.checked)} className="mt-1 size-4 accent-[#d46a3a]" />Acepto los <Link to="/terminos" className="font-semibold text-[#d46a3a]">términos de uso</Link> y la <Link to="/privacidad" className="font-semibold text-[#d46a3a]">política de privacidad</Link>.</label>}<Button type="submit" size="lg" className="w-full rounded-full bg-[#d46a3a] text-white hover:bg-[#b9542a]">{currentCopy.action}<ArrowRight /></Button></form>{message && <p className="mt-5 flex gap-2 rounded-lg bg-[#f5b544]/20 p-4 text-sm leading-6"><CheckCircle2 className="mt-0.5 size-5 shrink-0 text-[#d46a3a]" />{message}</p>}<div className="mt-8 flex flex-wrap gap-x-4 gap-y-2 text-sm text-[#17252a]/65">{mode !== "login" && <Link to="/login" className="font-semibold text-[#d46a3a]">Ya tengo cuenta</Link>}{mode !== "register" && <Link to="/registro" className="font-semibold text-[#d46a3a]">Crear cuenta</Link>}{mode !== "recover" && <Link to="/recuperar" className="font-semibold text-[#d46a3a]">Recuperar contraseña</Link>}</div></div></section></main>;
}