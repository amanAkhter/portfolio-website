import * as React from "react"
import { cn } from "../../../shared/utils/helpers"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'destructive'
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    const variants = {
      default: 'bg-tokyo-blue/20 text-tokyo-blue border-tokyo-blue/50',
      secondary: 'bg-tokyo-purple/20 text-tokyo-purple border-tokyo-purple/50',
      outline: 'border-tokyo-comment text-tokyo-fg',
      destructive: 'bg-tokyo-red/20 text-tokyo-red border-tokyo-red/50',
    }

    return (
      <div
        ref={ref}
        className={cn(
          "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
          variants[variant],
          className
        )}
        {...props}
      />
    )
  }
)
Badge.displayName = "Badge"

export { Badge }
