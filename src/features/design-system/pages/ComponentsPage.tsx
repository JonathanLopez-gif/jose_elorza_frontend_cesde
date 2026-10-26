import { useState } from 'react'
import type { ReactNode } from 'react'
import { Calendar, Inbox, Plus, Save } from 'lucide-react'
import { toast } from 'sonner'

import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { Pagination } from '@/components/common/Pagination'
import { EmptyState, ErrorState, LoadingBlock } from '@/components/common/States'
import { AppointmentStatusBadge, PaymentStatusBadge } from '@/components/common/StatusBadge'
import { Stepper } from '@/components/common/Stepper'
import { Container } from '@/components/layout/Container'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Field } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import {
  Modal,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from '@/components/ui/modal'
import { Select } from '@/components/ui/select'
import { Spinner } from '@/components/ui/spinner'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { SlotPicker } from '@/features/booking/components/SlotPicker'
import { SocialPlatformIcon } from '@/features/social/components/SocialPlatformIcon'
import { es } from '@/i18n/es'
import type { AppointmentStatus, TimeSlot } from '@/types/appointment'
import type { PaymentStatus } from '@/types/payment'
import type { SocialPlatform } from '@/types/social'

const COLORS = [
  { name: 'Azul marca', value: '#153b65', note: 'Botones principales, títulos' },
  { name: 'Turquesa', value: '#3fbfb7', note: 'Acentos, estados positivos' },
  { name: 'Naranja', value: 'var(--orange)', note: 'Eyebrows, llamados a la acción' },
  { name: 'Azul navy', value: 'var(--navy)', note: 'Textos de la landing' },
  { name: 'Papel', value: 'var(--paper)', note: 'Fondo de secciones' },
  { name: 'Texto', value: 'var(--text)', note: 'Texto de párrafos' },
]
const THEME_TOKENS = [
  { name: 'primary', className: 'bg-primary' },
  { name: 'secondary', className: 'bg-secondary' },
  { name: 'muted', className: 'bg-muted' },
  { name: 'accent', className: 'bg-accent' },
  { name: 'destructive', className: 'bg-destructive' },
  { name: 'border', className: 'bg-border' },
]
const TYPE_SCALE = [
  { label: 'Título 1 · text-4xl bold', className: 'font-heading text-4xl font-bold' },
  { label: 'Título 2 · text-3xl bold', className: 'font-heading text-3xl font-bold' },
  { label: 'Título 3 · text-xl semibold', className: 'font-heading text-xl font-semibold' },
  { label: 'Cuerpo · text-base', className: 'text-base' },
  { label: 'Secundario · text-sm muted', className: 'text-sm text-muted-foreground' },
  {
    label: 'Eyebrow · text-xs uppercase',
    className: 'text-xs font-bold uppercase tracking-[0.2em] text-primary',
  },
]
const SPACING = [1, 2, 3, 4, 6, 8, 12, 16]
const RADII = ['sm', 'md', 'lg', 'xl', '2xl', 'full'] as const
const BUTTON_VARIANTS = ['default', 'secondary', 'outline', 'ghost', 'destructive', 'link'] as const
const BUTTON_SIZES = ['xs', 'sm', 'default', 'lg'] as const
const BADGE_VARIANTS = [
  'default',
  'secondary',
  'outline',
  'success',
  'warning',
  'info',
  'destructive',
] as const

const DEMO_SLOTS: TimeSlot[] = [9, 10, 11, 14, 15, 16, 17, 18].map((h, i) => ({
  startUtc: `2026-11-10T${String(h + 5).padStart(2, '0')}:00:00.000Z`,
  endUtc: `2026-11-10T${String(h + 6).padStart(2, '0')}:00:00.000Z`,
  available: ![1, 4, 5].includes(i),
}))

function Section({
  id,
  title,
  description,
  children,
}: {
  id: string
  title: string
  description?: string
  children: ReactNode
}) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className="scroll-mt-24 border-t py-10 first:border-t-0"
    >
      <h2 id={`${id}-title`} className="font-heading text-2xl font-bold text-[#153b65]">
        {title}
      </h2>
      {description && <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{description}</p>}
      <div className="mt-6">{children}</div>
    </section>
  )
}

function Code({ children }: { children: ReactNode }) {
  return <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">{children}</code>
}

const SECTIONS = [
  ['colores', 'Colores'],
  ['tipografia', 'Tipografía'],
  ['espaciado', 'Espaciado y radios'],
  ['botones', 'Botones'],
  ['formularios', 'Formularios'],
  ['tarjetas', 'Tarjetas y badges'],
  ['feedback', 'Spinner, toast y modal'],
  ['estados', 'Estados'],
  ['navegacion', 'Navegación'],
  ['dominio', 'Componentes de dominio'],
] as const

/** Página de referencia del sistema de diseño: muestra cada componente base con sus variantes. */
export function ComponentsPage() {
  const [modalOpen, setModalOpen] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [switchOn, setSwitchOn] = useState(true)
  const [page, setPage] = useState(1)
  const [slot, setSlot] = useState<string | null>(null)

  return (
    <div className="bg-background py-12">
      <Container>
        <header className="max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
            Sistema de diseño
          </p>
          <h1 className="mt-2 font-heading text-3xl font-bold tracking-tight text-[#153b65] sm:text-4xl">
            Referencia de componentes
          </h1>
          <p className="mt-3 text-muted-foreground">
            Componentes base de la plataforma con sus variantes. Los de interfaz viven en{' '}
            <Code>src/components/ui</Code>, los compartidos en <Code>src/components/common</Code> y
            los tokens en <Code>src/styles/foundations</Code>.
          </p>
        </header>

        <nav
          aria-label="Secciones"
          className="sticky top-[calc(env(safe-area-inset-top,0px)+4.5rem)] z-10 mt-8 -mx-1 overflow-x-auto bg-background/95 py-3 backdrop-blur"
        >
          <ul className="flex gap-2 px-1">
            {SECTIONS.map(([id, label]) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  className="block whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-semibold text-[#153b65] hover:bg-muted"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <Section
          id="colores"
          title="Colores"
          description="Paleta de marca de José Fernando Elorza y tokens de tema (shadcn/ui)."
        >
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {COLORS.map((c) => (
              <div key={c.name} className="flex items-center gap-3 rounded-xl border p-3">
                <span
                  className="size-12 shrink-0 rounded-lg border"
                  style={{ background: c.value }}
                />
                <div className="min-w-0">
                  <p className="font-semibold">{c.name}</p>
                  <p className="font-mono text-xs text-muted-foreground">{c.value}</p>
                  <p className="text-xs text-muted-foreground">{c.note}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap gap-4">
            {THEME_TOKENS.map((t) => (
              <div key={t.name} className="text-center">
                <span className={`block size-14 rounded-lg border ${t.className}`} />
                <span className="mt-1 block font-mono text-xs text-muted-foreground">{t.name}</span>
              </div>
            ))}
          </div>
        </Section>

        <Section
          id="tipografia"
          title="Tipografía"
          description="Montserrat Variable para títulos y cuerpo."
        >
          <div className="space-y-4">
            {TYPE_SCALE.map((t) => (
              <div
                key={t.label}
                className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-6"
              >
                <span className="w-56 shrink-0 font-mono text-xs text-muted-foreground">
                  {t.label}
                </span>
                <span className={t.className}>Transforma tu interior</span>
              </div>
            ))}
          </div>
        </Section>

        <Section
          id="espaciado"
          title="Espaciado y radios"
          description="Escala de 4 px (tokens --space-*) y radios --radius-*."
        >
          <div className="space-y-2">
            {SPACING.map((s) => (
              <div key={s} className="flex items-center gap-4">
                <span className="w-20 font-mono text-xs text-muted-foreground">--space-{s}</span>
                <span className="h-3 rounded bg-[#3fbfb7]" style={{ width: `var(--space-${s})` }} />
              </div>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap gap-4">
            {RADII.map((r) => (
              <div key={r} className="text-center">
                <span
                  className="block size-14 border-2 border-[#153b65] bg-[#153b65]/10"
                  style={{ borderRadius: `var(--radius-${r})` }}
                />
                <span className="mt-1 block font-mono text-xs text-muted-foreground">{r}</span>
              </div>
            ))}
          </div>
        </Section>

        <Section
          id="botones"
          title="Botones"
          description={'<Button variant="…" size="…" />. Usa asChild para envolver un <Link>.'}
        >
          <div className="space-y-4">
            {BUTTON_VARIANTS.map((v) => (
              <div key={v} className="flex flex-wrap items-center gap-3">
                <span className="w-24 font-mono text-xs text-muted-foreground">{v}</span>
                {BUTTON_SIZES.map((s) => (
                  <Button key={s} variant={v} size={s}>
                    Botón {s}
                  </Button>
                ))}
              </div>
            ))}
            <div className="flex flex-wrap items-center gap-3 border-t pt-4">
              <span className="w-24 font-mono text-xs text-muted-foreground">estados</span>
              <Button className="bg-[#153b65] text-white hover:bg-[#0f2c4c]">
                <Plus /> Con ícono
              </Button>
              <Button disabled>Deshabilitado</Button>
              <Button disabled className="bg-[#153b65] text-white">
                <Spinner size="sm" className="text-white" /> Guardando…
              </Button>
              <Button size="icon" variant="outline" aria-label="Guardar">
                <Save />
              </Button>
            </div>
          </div>
        </Section>

        <Section
          id="formularios"
          title="Formularios"
          description="<Field> agrega etiqueta, ayuda y error accesibles (aria-invalid / role=alert)."
        >
          <div className="grid max-w-3xl gap-5 sm:grid-cols-2">
            <Field label="Nombre" htmlFor="ds-name" hint="Texto de ayuda opcional.">
              <Input id="ds-name" placeholder="Tu nombre" />
            </Field>
            <Field label="Correo" htmlFor="ds-email" error="Ingresa un correo válido">
              <Input id="ds-email" type="email" defaultValue="correo@" aria-invalid />
            </Field>
            <Field label="Modalidad" htmlFor="ds-select">
              <Select id="ds-select" defaultValue="VIRTUAL">
                {Object.entries(es.modality).map(([k, v]) => (
                  <option key={k} value={k}>
                    {v}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Deshabilitado" htmlFor="ds-disabled">
              <Input id="ds-disabled" disabled value="No editable" readOnly />
            </Field>
            <Field label="Mensaje" htmlFor="ds-text" className="sm:col-span-2">
              <Textarea id="ds-text" rows={3} placeholder="Escribe aquí…" />
            </Field>
            <div className="flex items-center gap-3">
              <Switch
                id="ds-switch"
                checked={switchOn}
                onCheckedChange={setSwitchOn}
                aria-label="Notificaciones por correo"
              />
              <label htmlFor="ds-switch" className="text-sm">
                Notificaciones por correo ({switchOn ? 'activas' : 'inactivas'})
              </label>
            </div>
            <label className="flex items-start gap-3 text-sm text-muted-foreground">
              <input type="checkbox" className="mt-0.5 size-4 accent-[#153b65]" defaultChecked />
              Acepto los términos de uso
            </label>
          </div>
        </Section>

        <Section id="tarjetas" title="Tarjetas y badges">
          <div className="grid gap-6 lg:grid-cols-[22rem_1fr]">
            <Card>
              <CardHeader>
                <CardTitle>Biohipnosis Sistémica</CardTitle>
                <CardDescription>Card · CardHeader · CardContent · CardFooter</CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Contenido de la tarjeta con texto descriptivo.
              </CardContent>
              <CardFooter>
                <Button size="sm" className="bg-[#153b65] text-white hover:bg-[#0f2c4c]">
                  Agendar
                </Button>
              </CardFooter>
            </Card>
            <div className="space-y-5">
              <div className="flex flex-wrap gap-2">
                {BADGE_VARIANTS.map((v) => (
                  <Badge key={v} variant={v}>
                    {v}
                  </Badge>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                {(Object.keys(es.appointmentStatus) as AppointmentStatus[]).map((s) => (
                  <AppointmentStatusBadge key={s} status={s} />
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                {(Object.keys(es.paymentStatus) as PaymentStatus[]).map((s) => (
                  <PaymentStatusBadge key={s} status={s} />
                ))}
              </div>
            </div>
          </div>
        </Section>

        <Section
          id="feedback"
          title="Spinner, toast y modal"
          description="Toasts con sonner (toast.success / error / info). Modal sobre Radix Dialog."
        >
          <div className="flex flex-wrap items-center gap-6">
            {(['sm', 'md', 'lg', 'xl'] as const).map((s) => (
              <span
                key={s}
                className="flex items-center gap-2 font-mono text-xs text-muted-foreground"
              >
                <Spinner size={s} /> {s}
              </span>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button variant="outline" onClick={() => toast.success('Cita confirmada.')}>
              Toast éxito
            </Button>
            <Button variant="outline" onClick={() => toast.error('No se pudo guardar.')}>
              Toast error
            </Button>
            <Button variant="outline" onClick={() => toast.info('Te llevamos a la pasarela…')}>
              Toast info
            </Button>
            <Button onClick={() => setModalOpen(true)}>Abrir modal</Button>
            <Button variant="destructive" onClick={() => setConfirmOpen(true)}>
              Diálogo de confirmación
            </Button>
          </div>
          <Modal open={modalOpen} onOpenChange={setModalOpen}>
            <ModalContent className="w-[calc(100%-2rem)] max-w-md">
              <ModalHeader>
                <ModalTitle>Título del modal</ModalTitle>
                <ModalDescription>Descripción breve de lo que hace este diálogo.</ModalDescription>
              </ModalHeader>
              <p className="mt-4 text-sm text-muted-foreground">
                Contenido. Se cierra con Esc, clic fuera o el botón.
              </p>
              <ModalFooter className="mt-6">
                <Button variant="outline" onClick={() => setModalOpen(false)}>
                  Cerrar
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
          <ConfirmDialog
            open={confirmOpen}
            onOpenChange={setConfirmOpen}
            title="¿Cancelar la cita?"
            description="Esta acción no se puede deshacer."
            confirmLabel="Sí, cancelar"
            destructive
            onConfirm={() => {
              setConfirmOpen(false)
              toast.success('Confirmado (demo).')
            }}
          />
        </Section>

        <Section
          id="estados"
          title="Estados"
          description="Pantallas de carga, vacío y error reutilizables."
        >
          <div className="grid gap-4 lg:grid-cols-3">
            <div className="rounded-xl border">
              <LoadingBlock label="Cargando citas…" />
            </div>
            <EmptyState
              icon={Inbox}
              title="Aún no tienes citas"
              description="Cuando agendes, aparecerán aquí."
            />
            <ErrorState
              message="Revisa tu conexión."
              onRetry={() => toast.info('Reintentando (demo)')}
            />
          </div>
        </Section>

        <Section
          id="navegacion"
          title="Navegación"
          description="Stepper del flujo de agendamiento y paginación de tablas."
        >
          <div className="space-y-6">
            <Stepper steps={['Fecha y hora', 'Resumen', 'Pago']} current={1} />
            <Pagination page={page} pageSize={10} total={47} onPageChange={setPage} />
          </div>
        </Section>

        <Section
          id="dominio"
          title="Componentes de dominio"
          description="Selector de horarios (ocupados bloqueados) e íconos de redes."
        >
          <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
            <div>
              <p className="mb-3 flex items-center gap-2 text-sm font-semibold">
                <Calendar className="size-4" /> SlotPicker
              </p>
              <SlotPicker
                slots={DEMO_SLOTS}
                isLoading={false}
                isError={false}
                selectedStartUtc={slot}
                onSelect={(s) => setSlot(s.startUtc)}
              />
            </div>
            <div>
              <p className="mb-3 text-sm font-semibold">SocialPlatformIcon</p>
              <div className="flex flex-wrap gap-3">
                {(Object.keys(es.socialPlatform) as SocialPlatform[]).map((p) => (
                  <span
                    key={p}
                    className="flex flex-col items-center gap-1 text-xs text-muted-foreground"
                  >
                    <span className="flex size-11 items-center justify-center rounded-xl bg-[#153b65] text-white">
                      <SocialPlatformIcon platform={p} className="size-5" />
                    </span>
                    {es.socialPlatform[p]}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Section>
      </Container>
    </div>
  )
}
