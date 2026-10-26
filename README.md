# José Elorza — Frontend

Plataforma web de José Fernando Elorza (biohipnoterapeuta sistémico). React 19 + TypeScript + Vite + Tailwind v4 + shadcn/ui.

## Alcance

Fases 0, 1, 2, 3 y 5 del `PLAN_FRONTEND.md` + "Mi cuenta". **Fuera de alcance:** Fase 4 (redes sociales), Fase 6 (QA/a11y/despliegue/tests) y Fase 7 (WhatsApp). El backend se desarrollará después: todo corre sobre **MSW** (mocks).

## Ejecutar

```bash
npm install
npm run dev      # mocks activos por defecto (VITE_ENABLE_MOCKS=true)
npm run build
```

Variables en `.env.example`.

## Cuentas de demostración

- Usuario: `usuario@correo.com` / `Usuario123!`
- Admin: `admin@joseelorza.com` / `Admin123!`
- Restablecer datos mock: `window.__resetMockDb()` en la consola.

## Rutas

Públicas: `/`, `/servicios`, `/servicios/:id`, `/terminos`, `/privacidad`, `/login`, `/registro`, `/olvide-contrasena`, `/restablecer-contrasena`.
Usuario: `/reservar`, `/pagar/:id`, `/pago/resultado`, `/mi-cuenta/{citas,pagos,perfil}`.
Admin: `/admin`, `/admin/{usuarios,servicios,agenda,pagos,reportes,google-calendar}`.
El simulador de pasarela (`/pago/simulador`) solo existe en desarrollo.

## Reglas de negocio implementadas

- Precios con IVA 19 % incluido (desglose base/IVA/total); WOMPI→COP, GLOBAL66→USD.
- Pago obligatorio para confirmar; reserva temporal de 15 min.
- Cancelar/reagendar con menos de 7 días: penalización 10 % del valor pagado (el admin no genera penalización). NO_SHOW sin reembolso. Reembolsos manuales (admin marca REFUNDED).
- Horas guardadas en UTC y mostradas en la zona horaria del usuario.

## Notas para el futuro backend

- Respuesta: `{ success, message, code?, data }`. Endpoints en `src/api/endpoints.ts`.
- `POST /auth/refresh` devuelve 200 con `data: null` si no hay sesión.
- Disponibilidad: `GET /appointments/availability?serviceId&date&timezone`. Conflictos 409: `SLOT_UNAVAILABLE`, `HOLD_EXPIRED`.
- Token de acceso solo en memoria; refresh por cookie httpOnly.

## Pendientes de contenido

URLs de Facebook/Spotify/YouTube, aprobación del texto legal (preliminar) y texto de "Coaching/Constelaciones".
