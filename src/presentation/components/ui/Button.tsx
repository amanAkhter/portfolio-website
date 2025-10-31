import * as React from "react"
import { cn } from "../../../shared/utils/helpers"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    const variants = {
      default: 'bg-tokyo-blue text-tokyo-bg hover:bg-tokyo-blue/90',
      destructive: 'bg-tokyo-red text-tokyo-bg hover:bg-tokyo-red/90',
      outline: 'border border-tokyo-blue text-tokyo-blue hover:bg-tokyo-blue/10',
      secondary: 'bg-tokyo-purple text-tokyo-bg hover:bg-tokyo-purple/90',
      ghost: 'hover:bg-tokyo-bg-highlight text-tokyo-fg',
      link: 'text-tokyo-blue underline-offset-4 hover:underline',
    }

    const sizes = {
      default: 'h-10 px-4 py-2',
      sm: 'h-9 rounded-md px-3',
      lg: 'h-11 rounded-md px-8',
      icon: 'h-10 w-10',
    }

    return (
      <button
        className={cn(
          'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
          variants[variant],
          sizes[size],
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
