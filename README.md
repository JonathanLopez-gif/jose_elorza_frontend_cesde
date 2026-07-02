# Plataforma Web José Fernando Elorza - Frontend

Frontend de la plataforma web de **José Fernando Elorza**, desarrollado con **React 19**, **TypeScript**, **Vite**, **Tailwind CSS v4** y **shadcn/ui**.

El objetivo de la aplicación es ofrecer una experiencia moderna para que los usuarios puedan conocer los servicios, agendar citas, realizar pagos y acceder a contenido del negocio, mientras que los administradores disponen de un panel para gestionar la operación.

---

# Tecnologías

- React 19
- TypeScript 6
- Vite 8
- React Router DOM
- Tailwind CSS v4
- shadcn/ui
- Radix UI
- Axios
- TanStack Query (React Query)
- Lucide React
- ESLint
- Prettier

---

# Estado del proyecto

Actualmente se encuentra finalizada la **Fase 0**, correspondiente a la infraestructura y sistema de diseño.

## ✅ Fase 0 – Setup y Sistema de Diseño

### Infraestructura

- Configuración de Vite
- React + TypeScript
- React Router
- Tailwind CSS v4
- shadcn/ui
- ESLint
- Prettier

### Arquitectura

- Alias `@`
- Organización modular por características (Feature First)
- Providers globales
- Layout público
- Sistema de rutas
- Variables de entorno
- Cliente Axios
- Interceptores HTTP
- Endpoints centralizados

### Sistema de Diseño

- Design Tokens
- Sistema de colores
- Tipografía Montserrat
- Espaciado
- Border Radius
- Sombras
- Tema claro/oscuro preparado

### Componentes Base

- Button
- Input
- Card
- Badge
- Modal
- Spinner
- Toast (Sonner)

---

# Arquitectura del proyecto

```
src
│
├── api
│   ├── client.ts
│   ├── endpoints.ts
│   ├── interceptors.ts
│   └── index.ts
│
├── assets
│
├── components
│   └── ui
│
├── config
│   └── env.ts
│
├── constants
│
├── features
│
├── hooks
│
├── layouts
│
├── lib
│
├── providers
│
├── router
│
├── styles
│
├── types
│
├── App.tsx
├── index.css
└── main.tsx
```

---

# Sistema de Diseño

El proyecto implementa un sistema de diseño propio basado en Design Tokens.

## Tipografía

- Montserrat

## Border Radius

- sm
- md
- lg
- xl

## Espaciado

Escala consistente basada en Tailwind CSS.

## Componentes

Todos los componentes reutilizables se encuentran en:

```
src/components/ui
```

---

# Configuración del entorno

Crear un archivo:

```
.env.local
```

Basado en:

```
.env.example
```

Variables disponibles:

```env
VITE_APP_NAME=José Fernando Elorza

VITE_API_URL=http://localhost:3000/api

VITE_WOMPI_PUBLIC_KEY=

VITE_GLOBAL66_PUBLIC_KEY=
```

---

# Instalación

Clonar el repositorio

```bash
git clone <url>
```

Instalar dependencias

```bash
npm install
```

Ejecutar el servidor

```bash
npm run dev
```

---

# Scripts

Ejecutar proyecto

```bash
npm run dev
```

Compilar producción

```bash
npm run build
```

Vista previa

```bash
npm run preview
```

Lint

```bash
npm run lint
```

Corregir lint

```bash
npm run lint:fix
```

Formatear código

```bash
npm run format
```

Verificar formato

```bash
npm run format:check
```

---

# Cliente HTTP

Se utiliza una única instancia de Axios ubicada en:

```
src/api/client.ts
```

Características:

- Base URL configurable mediante variables de entorno.
- Timeout global.
- Headers comunes.
- Interceptores.
- Adjunta automáticamente el JWT.
- Manejo centralizado de respuestas 401.

---

# Gestión del estado del servidor

El proyecto utiliza **TanStack Query** para:

- Consultas HTTP.
- Caché.
- Revalidación automática.
- Mutaciones.

---

# Enrutamiento

El proyecto utiliza React Router con una arquitectura basada en layouts.

```
AppRouter
        │
        ▼
PublicLayout
        │
        ▼
HomePage
```

Posteriormente se incorporarán:

- AuthLayout
- DashboardLayout

---

# Próximas fases

## Fase 1

Landing Page

- Navbar
- Hero
- Servicios
- Sobre José Fernando Elorza
- Testimonios
- CTA
- Footer

---

## Fase 2

Autenticación

- Login
- Registro
- Recuperación de contraseña
- Protección de rutas

---

## Fase 3

Panel del Usuario

- Perfil
- Citas
- Historial
- Pagos

---

## Fase 4

Panel Administrativo

- Dashboard
- Gestión de servicios
- Agenda
- Clientes
- Pagos
- Estadísticas

---

# Convenciones del proyecto

- Arquitectura Feature First.
- Componentes reutilizables.
- Imports mediante alias `@`.
- Tipado estricto con TypeScript.
- Componentes UI centralizados.
- Endpoints centralizados.
- Variables de entorno tipadas.
- Código formateado con Prettier.
- Calidad de código mediante ESLint.

---

# Autor

Proyecto desarrollado como trabajo académico del programa **Desarrollo de Software** del **CESDE**.

Desarrollador:

**Jonathan López Vergara**

Cliente:

**José Fernando Elorza**