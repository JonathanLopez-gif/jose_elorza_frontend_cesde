import { Toaster as Sonner } from "sonner"

function Toaster() {
  return (
    <Sonner
      richColors
      closeButton
      expand
      position="top-right"
      duration={4000}
      toastOptions={{
        classNames: {
          toast: "font-sans",
          title: "font-medium",
          description: "text-muted-foreground",
        },
      }}
    />
  )
}

Toaster.displayName = "Toaster"

export { Toaster }