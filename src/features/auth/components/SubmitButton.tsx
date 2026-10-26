import type { ReactNode } from 'react'
import { ArrowRight } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'

export function SubmitButton({ loading, children }: { loading: boolean; children: ReactNode }) {
  return (
    <Button
      type="submit"
      size="lg"
      disabled={loading}
      className="h-12 w-full rounded-full bg-[#153b65] text-sm font-bold uppercase tracking-wide text-white hover:bg-[#0f2c4c]"
    >
      {loading ? <Spinner size="sm" className="text-white" /> : null}
      {children}
      {!loading && <ArrowRight />}
    </Button>
  )
}
