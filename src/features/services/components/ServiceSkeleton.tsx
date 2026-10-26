import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'

export function ServiceSkeleton() {
  return (
    <Card className="flex h-full flex-col">
      <CardHeader className="gap-3">
        <div className="flex gap-2">
          <div className="h-5 w-20 animate-pulse rounded-full bg-muted" />
          <div className="h-5 w-16 animate-pulse rounded-full bg-muted" />
        </div>
        <div className="h-6 w-3/4 animate-pulse rounded bg-muted" />
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-4">
        <div className="space-y-2">
          <div className="h-4 w-full animate-pulse rounded bg-muted" />
          <div className="h-4 w-5/6 animate-pulse rounded bg-muted" />
        </div>
        <div className="mt-auto h-4 w-24 animate-pulse rounded bg-muted" />
        <div className="h-6 w-32 animate-pulse rounded bg-muted" />
      </CardContent>
      <CardFooter className="gap-2">
        <div className="h-9 flex-1 animate-pulse rounded-md bg-muted" />
        <div className="h-9 flex-1 animate-pulse rounded-md bg-muted" />
      </CardFooter>
    </Card>
  )
}
