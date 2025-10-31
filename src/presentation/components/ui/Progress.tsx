import * as React from "react"
import { cn } from "../../../shared/utils/helpers"

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number
  max?: number
  showLabel?: boolean
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value, max = 100, showLabel = false, ...props }, ref) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100)

    return (
      <div ref={ref} className={cn("w-full", className)} {...props}>
        <div className="relative h-2 w-full overflow-hidden rounded-full bg-tokyo-bg-dark">
          <div
            className="h-full bg-gradient-to-r from-tokyo-blue via-tokyo-purple to-tokyo-cyan transition-all duration-500 ease-out"
            style={{ width: `${percentage}%` }}
          />
        </div>
        {showLabel && (
          <span className="mt-1 text-xs text-tokyo-comment">{percentage}%</span>
        )}
      </div>
    )
  }
)
Progress.displayName = "Progress"

export { Progress }
