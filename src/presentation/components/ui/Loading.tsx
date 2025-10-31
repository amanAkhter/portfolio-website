import React from 'react'
import { cn } from '../../../shared/utils/helpers'

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export const Spinner: React.FC<SpinnerProps> = ({ size = 'md', className }) => {
  const sizes = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  }

  return (
    <div
      className={cn(
        'animate-spin rounded-full border-tokyo-blue border-t-transparent',
        sizes[size],
        className
      )}
    />
  )
}

export const LoadingScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-tokyo-bg z-50">
      <div className="text-center">
        <Spinner size="lg" className="mx-auto mb-4" />
        <p className="text-tokyo-fg-dark">Loading...</p>
      </div>
    </div>
  )
}
