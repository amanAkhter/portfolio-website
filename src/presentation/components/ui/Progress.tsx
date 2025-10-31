import * as React from "react"
import { motion, useInView } from "motion/react"
import { cn } from "../../../shared/utils/helpers"

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number
  max?: number
  showLabel?: boolean
  animated?: boolean
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value, max = 100, showLabel = false, animated = true, ...props }, ref) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100)
    const progressRef = React.useRef(null)
    const isInView = useInView(progressRef, { once: true, amount: 0.3 })

    return (
      <div ref={ref} className={cn("w-full", className)} {...props}>
        <div ref={progressRef} className="relative h-2 w-full overflow-hidden rounded-full bg-tokyo-bg-dark">
          <motion.div
            className="h-full bg-gradient-to-r from-tokyo-blue via-tokyo-purple to-tokyo-cyan relative overflow-hidden"
            initial={{ width: 0 }}
            animate={animated && isInView ? { width: `${percentage}%` } : { width: `${percentage}%` }}
            transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
          >
            {/* Shimmer effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              initial={{ x: "-100%" }}
              animate={{ x: "200%" }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "linear",
                delay: 1.7
              }}
            />
          </motion.div>
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
