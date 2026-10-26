import { Toaster as Sonner } from 'sonner'

function Toaster() {
  return (
    <Sonner
      richColors
      closeButton
      expand
      position="top-right"
      offset={{ top: 88, right: 16 }}
      mobileOffset={{ top: 76, right: 12, left: 12 }}
      duration={4000}
      toastOptions={{
        classNames: {
          toast: 'font-sans',
          title: 'font-medium',
          description: 'text-muted-foreground',
        },
      }}
    />
  )
}

Toaster.displayName = 'Toaster'

export { Toaster }
