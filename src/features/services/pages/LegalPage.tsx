import { Link } from 'react-router-dom'

import { BRAND } from '@/constants/brand'
import { APP_ROUTES } from '@/constants/routes'
import { PENALTY_PERCENT, PENALTY_WINDOW_DAYS, HOLD_MINUTES } from '@/utils/policy'

type Section = { title: string; body: string[] }

const TERMS: Section[] = [
  {
    title: '1. Aceptación',
    body: [
      'Al crear una cuenta o usar esta plataforma aceptas estos términos y la política de privacidad. Si no estás de acuerdo, por favor no uses el servicio.',
    ],
  },
  {
    title: '2. Naturaleza del servicio',
    body: [
      `${BRAND.name} ofrece acompañamiento de bienestar y desarrollo personal (biohipnosis sistémica, conversaciones conscientes, talleres y conferencias).`,
      'Estos servicios no reemplazan la atención médica, psicológica ni psiquiátrica. Si atraviesas una emergencia o un diagnóstico clínico, consulta a un profesional de la salud.',
    ],
  },
  {
    title: '3. Tu cuenta',
    body: [
      'Debes ser mayor de edad y entregar información veraz. Eres responsable de mantener la confidencialidad de tu contraseña y de la actividad realizada con tu cuenta.',
    ],
  },
  {
    title: '4. Agendamiento y pago',
    body: [
      'El pago es obligatorio para confirmar una cita. Al iniciar el pago, el horario se reserva por ' +
        HOLD_MINUTES +
        ' minutos; si no se completa, se libera automáticamente.',
      'Los precios se muestran en pesos colombianos (COP) y en dólares (USD), son independientes entre sí e incluyen el IVA del 19 %, que se desglosa en el resumen y en el comprobante de pago.',
      'Los pagos se procesan en las plataformas de Wompi (COP) o Global66 (USD). La plataforma no almacena datos de tarjetas.',
    ],
  },
  {
    title: '5. Cancelación, reagendamiento y no asistencia',
    body: [
      `Si cancelas o reagendas con menos de ${PENALTY_WINDOW_DAYS} días de anticipación se retiene el ${PENALTY_PERCENT} % del valor pagado. Con ${PENALTY_WINDOW_DAYS} días o más no hay penalización.`,
      'Si no asistes a la sesión sin cancelar, la cita queda como «No asistió» y no hay reembolso.',
      'Los reembolsos los registra el administrador de forma manual; la plataforma no devuelve dinero automáticamente.',
      'Si la cancelación o el cambio los realiza el administrador, no se aplica penalización.',
    ],
  },
  {
    title: '6. Zonas horarias',
    body: [
      'Los horarios se muestran en la zona horaria de tu perfil, junto con su equivalente en UTC. Verifica tu zona horaria antes de agendar para evitar confusiones.',
    ],
  },
  {
    title: '7. Sesiones virtuales',
    body: [
      'El enlace de la videollamada se publica en «Mis citas» cuando el administrador lo asigna. Es personal y no debe compartirse. Se prohíbe grabar las sesiones sin autorización expresa.',
    ],
  },
  {
    title: '8. Propiedad intelectual',
    body: [
      'Los contenidos, marca, logotipos y materiales de la plataforma pertenecen a ' +
        BRAND.name +
        ' y no pueden usarse sin autorización.',
    ],
  },
  {
    title: '9. Limitación de responsabilidad',
    body: [
      'La plataforma se ofrece «tal cual». No garantizamos disponibilidad ininterrumpida y no respondemos por interrupciones ajenas a nuestro control (conexión a internet, pasarelas de pago, proveedores externos).',
    ],
  },
  {
    title: '10. Cambios y ley aplicable',
    body: [
      'Podemos actualizar estos términos; te avisaremos de los cambios importantes. Se rigen por las leyes de la República de Colombia.',
    ],
  },
]

const PRIVACY: Section[] = [
  {
    title: '1. Responsable del tratamiento',
    body: [
      `${BRAND.name} es responsable del tratamiento de tus datos personales. Puedes contactarnos en ${BRAND.email}.`,
    ],
  },
  {
    title: '2. Datos que recopilamos',
    body: [
      'Datos de cuenta: nombre, correo electrónico, contraseña (almacenada cifrada), zona horaria y, opcionalmente, teléfono.',
      'Datos de uso del servicio: citas, pagos (estado, monto, pasarela y referencia) y preferencias de notificación.',
      'No almacenamos números de tarjeta ni credenciales bancarias: esos datos los procesan directamente Wompi y Global66.',
    ],
  },
  {
    title: '3. Para qué los usamos',
    body: [
      'Gestionar tu cuenta y tus citas, procesar y conciliar pagos, enviarte confirmaciones y recordatorios por correo (si los activas), generar comprobantes y cumplir obligaciones legales y contables.',
    ],
  },
  {
    title: '4. Base legal',
    body: [
      'Tratamos tus datos con tu autorización previa, expresa e informada, conforme a la Ley 1581 de 2012 y el Decreto 1377 de 2013 de Colombia. Para usuarios en la Unión Europea aplicamos los principios del Reglamento General de Protección de Datos (GDPR).',
    ],
  },
  {
    title: '5. Tus derechos',
    body: [
      'Puedes conocer, actualizar, rectificar y suprimir tus datos, revocar la autorización, solicitar prueba de ella y presentar quejas ante la Superintendencia de Industria y Comercio.',
      'Para ejercerlos escribe a ' +
        BRAND.email +
        '. Atenderemos tu solicitud dentro de los plazos legales.',
    ],
  },
  {
    title: '6. Con quién compartimos datos',
    body: [
      'Solo con proveedores necesarios para operar: pasarelas de pago (Wompi, Global66), Google Calendar para sincronizar la agenda del administrador, el servicio de envío de correos y el proveedor de alojamiento. No vendemos tus datos.',
      'Algunos proveedores pueden estar fuera de Colombia; exigimos medidas de protección adecuadas.',
    ],
  },
  {
    title: '7. Cookies',
    body: [
      'Usamos cookies necesarias para el funcionamiento (por ejemplo, mantener tu sesión) y, solo si lo aceptas en el aviso de cookies, cookies de analítica. Puedes cambiar tu decisión borrando los datos del sitio en tu navegador.',
    ],
  },
  {
    title: '8. Conservación y seguridad',
    body: [
      'Conservamos tus datos mientras tengas cuenta y durante los plazos exigidos por la ley para registros contables. Aplicamos medidas técnicas y organizativas razonables para protegerlos.',
    ],
  },
  {
    title: '9. Menores de edad',
    body: [
      'La plataforma está dirigida a personas mayores de edad. No recopilamos de forma intencional datos de menores.',
    ],
  },
  {
    title: '10. Cambios a esta política',
    body: [
      'Publicaremos aquí cualquier actualización. El uso continuado de la plataforma implica la aceptación de la política vigente.',
    ],
  },
]

const CONTENT = {
  terms: {
    title: 'Términos de uso',
    eyebrow: 'Información legal',
    sections: TERMS,
    other: { to: APP_ROUTES.privacy, label: 'Política de privacidad' },
  },
  privacy: {
    title: 'Política de privacidad',
    eyebrow: 'Protección de datos · Ley 1581 de 2012',
    sections: PRIVACY,
    other: { to: APP_ROUTES.terms, label: 'Términos de uso' },
  },
} as const

export function LegalPage({ kind }: { kind: keyof typeof CONTENT }) {
  const c = CONTENT[kind]
  return (
    <main className="mx-auto min-h-[70vh] max-w-3xl px-6 py-16 lg:px-10 lg:py-20">
      <Link to={APP_ROUTES.home} className="text-sm font-semibold text-[#153b65] hover:underline">
        ← Volver al inicio
      </Link>
      <p className="mt-10 text-xs font-bold uppercase tracking-[0.2em] text-[#3fbfb7]">
        {c.eyebrow}
      </p>
      <h1 className="mt-3 font-heading text-4xl font-bold text-[#153b65] sm:text-5xl">{c.title}</h1>
      <p className="mt-3 text-sm text-muted-foreground">Última actualización: octubre de 2026</p>

      <p
        role="note"
        className="mt-8 rounded-xl border border-amber-300/70 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-950"
      >
        Documento preliminar: el texto definitivo será revisado y aprobado por el responsable del
        negocio antes de su publicación en producción.
      </p>

      <div className="mt-10 space-y-9">
        {c.sections.map((s) => (
          <section key={s.title}>
            <h2 className="font-heading text-xl font-bold text-[#153b65]">{s.title}</h2>
            <div className="mt-3 space-y-3 text-[0.95rem] leading-7 text-[#17252a]/75">
              {s.body.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </section>
        ))}
      </div>

      <p className="mt-12 border-t pt-6 text-sm text-muted-foreground">
        Consulta también:{' '}
        <Link to={c.other.to} className="font-semibold text-[#153b65] underline">
          {c.other.label}
        </Link>
      </p>
    </main>
  )
}
