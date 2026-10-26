import { Link } from 'react-router-dom'
import { Clock, Video, Users, MapPin } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { APP_ROUTES } from '@/constants/routes'
import type { Service } from '@/types/service'
import { formatCurrencyCop, formatCurrencyUsd } from '@/utils/timezone'

const modalityIcon = { VIRTUAL: Video, PRESENCIAL: MapPin, HIBRIDA: Users } as const
const modalityLabel = { VIRTUAL: 'Virtual', PRESENCIAL: 'Presencial', HIBRIDA: 'Híbrida' } as const
const typeLabel = { INDIVIDUAL: 'Individual', GRUPAL: 'Grupal' } as const

export function ServiceCard({ service }: { service: Service }) {
  const Icon = modalityIcon[service.modality] ?? Video
  return (
    <Card className="flex h-full flex-col transition-shadow hover:shadow-md">
      <CardHeader className="gap-3">
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary">{typeLabel[service.type]}</Badge>
          <Badge variant="outline" className="gap-1">
            <Icon className="size-3" />
            {modalityLabel[service.modality]}
          </Badge>
        </div>
        <CardTitle className="text-xl leading-snug">{service.name}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-4">
        <p className="line-clamp-3 text-sm text-muted-foreground">{service.description}</p>
        <div className="mt-auto flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="size-4 shrink-0" />
          <span>{service.durationMinutes} min</span>
        </div>
        <div className="space-y-1">
          <p className="text-lg font-semibold">{formatCurrencyCop(service.priceCop)}</p>
          <p className="text-sm text-muted-foreground">
            {formatCurrencyUsd(service.priceUsd)} · IVA incluido
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button variant="outline" className="flex-1" asChild>
          <Link to={`${APP_ROUTES.services}/${service.id}`}>Ver detalle</Link>
        </Button>
        <Button className="flex-1" asChild>
          <Link to={`${APP_ROUTES.booking}/${service.id}`}>Agendar</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
