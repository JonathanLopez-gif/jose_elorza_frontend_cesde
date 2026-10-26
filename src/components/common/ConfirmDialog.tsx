import type { ReactNode } from 'react'

import { Button } from '@/components/ui/button'
import {
  Modal,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from '@/components/ui/modal'
import { Spinner } from '@/components/ui/spinner'

interface ConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  children?: ReactNode
  confirmLabel?: string
  cancelLabel?: string
  destructive?: boolean
  loading?: boolean
  onConfirm: () => void
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  children,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Volver',
  destructive,
  loading,
  onConfirm,
}: ConfirmDialogProps) {
  return (
    <Modal open={open} onOpenChange={(v) => !loading && onOpenChange(v)}>
      <ModalContent className="max-h-[90vh] w-[calc(100%-2rem)] overflow-y-auto">
        <ModalHeader>
          <ModalTitle>{title}</ModalTitle>
          {description && <ModalDescription>{description}</ModalDescription>}
        </ModalHeader>
        {children && <div className="mt-4">{children}</div>}
        <ModalFooter className="mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            {cancelLabel}
          </Button>
          <Button
            variant={destructive ? 'destructive' : 'default'}
            onClick={onConfirm}
            disabled={loading}
          >
            {loading && <Spinner size="sm" className="text-current" />}
            {confirmLabel}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
