import * as React from "react"
import { X } from "lucide-react"
import { cn } from "../../../shared/utils/helpers"
import { Button } from "./Button"

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  className?: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  className,
  size = 'md',
}) => {
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-3xl',
    xl: 'max-w-5xl',
    full: 'max-w-[90vw]',
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className={cn(
          "relative w-full bg-tokyo-bg-light border border-tokyo-black rounded-lg shadow-2xl max-h-[80vh] overflow-hidden flex flex-col animate-scale-in",
          sizeClasses[size],
          className
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 sm:top-4 sm:right-4 text-tokyo-fg hover:text-tokyo-red z-10 transition-all duration-300 hover:rotate-90 bg-tokyo-bg-dark/80 hover:bg-tokyo-bg-dark"
          onClick={onClose}
          aria-label="Close modal"
        >
          <X className="h-5 w-5 sm:h-6 sm:w-6" />
        </Button>
        {children}
      </div>
    </div>
  )
}

export const ModalHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  children,
  ...props
}) => (
  <div
    className={cn("flex flex-col space-y-1.5 p-4 sm:p-5 border-b border-tokyo-black", className)}
    {...props}
  >
    {children}
  </div>
)

export const ModalTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({
  className,
  children,
  ...props
}) => (
  <h2
    className={cn("text-xl sm:text-2xl font-semibold text-tokyo-fg", className)}
    {...props}
  >
    {children}
  </h2>
)

export const ModalBody: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  children,
  ...props
}) => (
  <div className={cn("p-4 sm:p-5 overflow-y-auto flex-1", className)} {...props}>
    {children}
  </div>
)

export const ModalFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  children,
  ...props
}) => (
  <div
    className={cn("flex items-center justify-end gap-2 p-4 sm:p-5 border-t border-tokyo-black", className)}
    {...props}
  >
    {children}
  </div>
)
