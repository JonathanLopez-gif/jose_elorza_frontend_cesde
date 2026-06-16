# Plataforma Web José Fernando Elorza - Frontend

Frontend de la plataforma web de José Fernando Elorza, desarrollado con React, TypeScript y Vite. La aplicación permite a los usuarios descubrir servicios, agendar citas, realizar pagos y acceder a contenido del negocio, mientras que los administradores pueden gestionar la operación completa desde un panel dedicado.

---

## 🚀 Características Principales

### Usuarios

* Landing page pública y responsiva.
* Registro e inicio de sesión.
* Recuperación de contraseña.
* Catálogo de servicios.
* Agendamiento de citas con disponibilidad en tiempo real.
* Soporte para múltiples zonas horarias.
* Integración con pasarelas de pago.
* Gestión de perfil.
* Historial de citas y pagos.
* Acceso a redes sociales y canales del negocio.

### Administradores

* Dashboard con métricas e indicadores.
* Gestión de usuarios.
* Gestión de servicios.
* Gestión de agenda y citas.
* Gestión de pagos.
* Gestión de redes sociales.
* Exportación de reportes.
* Configuración de integración con Google Calendar.

---

# 🛠️ Stack Tecnológico

| Tecnología                        | Uso                             |
| --------------------------------- | ------------------------------- |
| React 18                          | Framework UI                    |
| Vite                              | Bundler y entorno de desarrollo |
| TypeScript                        | Tipado estático                 |
| Tailwind CSS                      | Estilos                         |
| shadcn/ui + Radix UI              | Componentes UI                  |
| React Router v6                   | Navegación                      |
| Zustand                           | Estado global                   |
| Axios                             | Cliente HTTP                    |
| TanStack Query                    | Gestión de datos remotos        |
| React Hook Form                   | Formularios                     |
| Zod                               | Validaciones                    |
| Day.js                            | Manejo de fechas                |
| react-big-calendar / FullCalendar | Calendario                      |
| Vitest                            | Testing                         |
| React Testing Library             | Testing de componentes          |
| ESLint                            | Linting                         |
| Prettier                          | Formateo                        |

---

# 📁 Estructura del Proyecto

```text
src/
├── api/
│   ├── auth/
│   ├── appointments/
│   ├── payments/
│   └── services/
│
├── assets/
│   ├── images/
│   ├── icons/
│   └── fonts/
│
├── components/
│   ├── common/
│   ├── forms/
│   ├── layout/
│   └── ui/
│
├── features/
│   ├── auth/
│   ├── booking/
│   ├── services/
│   ├── social/
│   ├── account/
│   └── admin/
│
├── hooks/
├── layouts/
├── router/
├── store/
├── types/
├── utils/
├── constants/
├── providers/
└── main.tsx
```

---

# 🌐 Rutas Principales

## Públicas

| Ruta               | Descripción                |
| ------------------ | -------------------------- |
| `/`                | Landing Page               |
| `/login`           | Inicio de sesión           |
| `/register`        | Registro                   |
| `/forgot-password` | Recuperar contraseña       |
| `/servicios`       | Catálogo de servicios      |
| `/redes-sociales`  | Redes sociales del negocio |

## Protegidas

| Ruta                  | Descripción           |
| --------------------- | --------------------- |
| `/mi-cuenta`          | Perfil de usuario     |
| `/agendar/:serviceId` | Flujo de agendamiento |
| `/mis-citas`          | Historial de citas    |
| `/mis-pagos`          | Historial de pagos    |

## Administración

| Ruta                    | Descripción          |
| ----------------------- | -------------------- |
| `/admin`                | Dashboard            |
| `/admin/usuarios`       | Gestión de usuarios  |
| `/admin/servicios`      | Gestión de servicios |
| `/admin/agenda`         | Gestión de agenda    |
| `/admin/pagos`          | Gestión de pagos     |
| `/admin/redes-sociales` | Gestión de canales   |
| `/admin/reportes`       | Reportes             |

---

# ⚙️ Instalación

## Requisitos

* Node.js >= 20
* npm >= 10

## Clonar repositorio

```bash
git clone <repository-url>
cd frontend
```

## Instalar dependencias

```bash
npm install
```

## Variables de entorno

Crear archivo `.env.local`

```env
VITE_API_URL=http://localhost:3000/api
VITE_APP_NAME=Jose Fernando Elorza
VITE_WOMPI_PUBLIC_KEY=
VITE_GLOBAL66_PUBLIC_KEY=
```

---

# ▶️ Scripts Disponibles

### Desarrollo

```bash
npm run dev
```

### Build Producción

```bash
npm run build
```

### Vista previa del build

```bash
npm run preview
```

### Lint

```bash
npm run lint
```

### Formateo

```bash
npm run format
```

### Tests

```bash
npm run test
```

### Cobertura

```bash
npm run test:coverage
```

---

# 🔐 Autenticación

La aplicación utiliza:

* JWT Access Token.
* Refresh Token mediante cookies httpOnly.
* Guards de rutas protegidas.
* Control de acceso basado en roles.
* Renovación automática de sesión.

---

# 📅 Gestión de Zonas Horarias

Todas las citas se visualizan en la zona horaria del usuario.

Características:

* Detección automática de zona horaria.
* Conversión UTC ↔ Zona Local.
* Visualización simultánea de ambas referencias.
* Persistencia de preferencia en el perfil.

---

# 💳 Flujo de Pagos

1. Selección de fecha y hora.
2. Resumen de cita.
3. Selección de pasarela.
4. Redirección a checkout externo.
5. Confirmación automática del pago.
6. Confirmación de cita.

Pasarelas previstas:

* Wompi
* Global66

---

# 🧪 Testing

Se implementarán pruebas para:

* Componentes críticos.
* Formularios.
* Guards de autenticación.
* Flujo de agendamiento.
* Flujo de pago.
* Integraciones principales.

Tecnologías:

* Vitest
* React Testing Library

---

# ♿ Accesibilidad

Objetivos mínimos:

* Cumplimiento WCAG AA.
* Navegación mediante teclado.
* ARIA labels.
* Contraste adecuado.
* Gestión correcta del foco.

---

# 🌍 Internacionalización

La aplicación será preparada para soportar múltiples idiomas mediante arquitectura compatible con i18n.

Idioma inicial:

* Español

Idiomas futuros:

* Inglés

---

# 📈 Objetivos de Calidad

* Lighthouse Performance ≥ 80
* Lighthouse Accessibility ≥ 80
* Sin errores de consola en producción
* Diseño Mobile First
* Tiempo de carga optimizado
* Lazy Loading de rutas

---

# 📌 Roadmap

## Fase 0

* Setup inicial.
* Sistema de diseño.

## Fase 1

* Landing.
* Autenticación.

## Fase 2

* Servicios.
* Agendamiento.

## Fase 3

* Pagos.

## Fase 4

* Redes sociales.

## Fase 5

* Panel administrativo.

## Fase 6

* QA y despliegue.

## Fase 7 (Futura)

* Integración WhatsApp Cloud API.

---

# 👥 Roles

## USER

* Consultar servicios.
* Agendar citas.
* Realizar pagos.
* Gestionar perfil.
* Consultar historial.

## ADMIN

* Gestionar usuarios.
* Gestionar servicios.
* Gestionar agenda.
* Gestionar pagos.
* Gestionar redes sociales.
* Exportar reportes.
* Configurar Google Calendar.

---

# 📄 Licencia

Proyecto privado desarrollado para José Fernando Elorza.

Todos los derechos reservados.