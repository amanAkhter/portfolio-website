# Component Library Documentation

## 📖 Table of Contents
1. [Overview](#overview)
2. [Button Component](#button-component)
3. [Card Component](#card-component)
4. [Badge Component](#badge-component)
5. [Input Components](#input-components)
6. [Modal Component](#modal-component)
7. [Loading Component](#loading-component)
8. [Animation Components](#animation-components)
9. [Component Patterns](#component-patterns)

---

## Overview

The portfolio uses a custom component library built with React, TypeScript, and Tailwind CSS. All components follow the Tokyo Night color scheme and are fully responsive.

### Location
```
src/presentation/components/ui/
├── Button.tsx
├── Card.tsx
├── Badge.tsx
├── Input.tsx
├── FormInput.tsx
├── Textarea.tsx
├── Modal.tsx
├── Loading.tsx
├── Progress.tsx
├── EmptyState.tsx
├── Animations.tsx
├── AdvancedAnimations.tsx
├── ParticlesBackground.tsx
├── SpaceParticles.tsx
├── TypingTagline.tsx
├── EasterEggs.tsx
└── index.ts
```

---

## Button Component

**File**: `src/presentation/components/ui/Button.tsx`

### Props

```typescript
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  icon?: LucideIcon
  as?: 'button' | 'a'
  href?: string
  target?: string
  rel?: string
  children: React.ReactNode
}
```

### Variants

**Primary** - Main action button
```tsx
<Button variant="primary">Save Changes</Button>
```

**Secondary** - Alternative action
```tsx
<Button variant="secondary">Cancel</Button>
```

**Outline** - Subtle action
```tsx
<Button variant="outline">Learn More</Button>
```

**Ghost** - Minimal styling
```tsx
<Button variant="ghost">Skip</Button>
```

### Sizes

```tsx
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>
```

### With Icons

```tsx
import { Download, Github, Mail } from 'lucide-react'

<Button icon={Download}>Download Resume</Button>
<Button icon={Github} variant="outline">View Code</Button>
<Button icon={Mail} size="sm">Contact</Button>
```

### As Link

```tsx
<Button 
  as="a" 
  href="https://github.com/username"
  target="_blank"
  rel="noopener noreferrer"
  icon={Github}
>
  GitHub Profile
</Button>
```

### Complete Implementation

```typescript
import React from 'react'
import { LucideIcon } from 'lucide-react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  icon?: LucideIcon
  as?: 'button' | 'a'
  href?: string
  target?: string
  rel?: string
  children: React.ReactNode
}

export default function Button({
  variant = 'primary',
  size = 'md',
  icon: Icon,
  as = 'button',
  className = '',
  children,
  ...props
}: ButtonProps) {
  const baseClasses = 'inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-tokyo-cyan focus:ring-offset-2 focus:ring-offset-tokyo-bg disabled:opacity-50 disabled:cursor-not-allowed'
  
  const variants = {
    primary: 'bg-tokyo-cyan text-tokyo-bg hover:bg-tokyo-blue shadow-lg shadow-tokyo-cyan/20',
    secondary: 'bg-tokyo-purple text-white hover:bg-tokyo-magenta shadow-lg shadow-tokyo-purple/20',
    outline: 'border-2 border-tokyo-cyan text-tokyo-cyan hover:bg-tokyo-cyan hover:text-tokyo-bg',
    ghost: 'text-tokyo-fg hover:bg-tokyo-selection'
  }
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  }
  
  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`
  
  const content = (
    <>
      {Icon && <Icon size={size === 'sm' ? 16 : size === 'lg' ? 24 : 20} />}
      {children}
    </>
  )
  
  if (as === 'a') {
    return (
      <a className={classes} {...(props as any)}>
        {content}
      </a>
    )
  }
  
  return (
    <button className={classes} {...props}>
      {content}
    </button>
  )
}
```

---

## Card Component

**File**: `src/presentation/components/ui/Card.tsx`

### Props

```typescript
interface CardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
}
```

### Basic Usage

```tsx
<Card>
  <h3>Card Title</h3>
  <p>Card content goes here</p>
</Card>
```

### With Hover Effect

```tsx
<Card hover>
  <ProjectDetails />
</Card>
```

### Implementation

```typescript
import React from 'react'

interface CardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
}

export default function Card({ 
  children, 
  className = '', 
  hover = false 
}: CardProps) {
  return (
    <div
      className={`
        bg-tokyo-night border border-tokyo-comment rounded-lg shadow-xl
        ${hover ? 'hover:border-tokyo-cyan hover:shadow-tokyo-cyan/20 transition-all duration-300' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  )
}
```

---

## Badge Component

**File**: `src/presentation/components/ui/Badge.tsx`

### Props

```typescript
interface BadgeProps {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}
```

### Variants

```tsx
<Badge variant="primary">React</Badge>
<Badge variant="secondary">TypeScript</Badge>
<Badge variant="success">Completed</Badge>
<Badge variant="warning">In Progress</Badge>
<Badge variant="danger">Deprecated</Badge>
```

### Sizes

```tsx
<Badge size="sm">Small</Badge>
<Badge size="md">Medium</Badge>
<Badge size="lg">Large</Badge>
```

### Implementation

```typescript
import React from 'react'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export default function Badge({
  children,
  variant = 'primary',
  size = 'md',
  className = ''
}: BadgeProps) {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-full'
  
  const variants = {
    primary: 'bg-tokyo-cyan/10 text-tokyo-cyan border border-tokyo-cyan/20',
    secondary: 'bg-tokyo-purple/10 text-tokyo-purple border border-tokyo-purple/20',
    success: 'bg-tokyo-green/10 text-tokyo-green border border-tokyo-green/20',
    warning: 'bg-tokyo-yellow/10 text-tokyo-yellow border border-tokyo-yellow/20',
    danger: 'bg-tokyo-red/10 text-tokyo-red border border-tokyo-red/20'
  }
  
  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base'
  }
  
  return (
    <span className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}>
      {children}
    </span>
  )
}
```

---

## Input Components

### Input

**File**: `src/presentation/components/ui/Input.tsx`

```typescript
import React from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  icon?: React.ReactNode
}

export default function Input({
  label,
  error,
  icon,
  className = '',
  ...props
}: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-tokyo-fg mb-2">
          {label}
        </label>
      )}
      
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-tokyo-comment">
            {icon}
          </div>
        )}
        
        <input
          className={`
            w-full px-4 py-2 bg-tokyo-bg border border-tokyo-comment rounded-lg
            text-tokyo-fg placeholder-tokyo-comment
            focus:outline-none focus:ring-2 focus:ring-tokyo-cyan focus:border-transparent
            disabled:opacity-50 disabled:cursor-not-allowed
            ${icon ? 'pl-10' : ''}
            ${error ? 'border-tokyo-red focus:ring-tokyo-red' : ''}
            ${className}
          `}
          {...props}
        />
      </div>
      
      {error && (
        <p className="mt-1 text-sm text-tokyo-red">{error}</p>
      )}
    </div>
  )
}
```

### Usage

```tsx
import { Mail, Lock } from 'lucide-react'

<Input
  label="Email"
  type="email"
  placeholder="john@example.com"
  icon={<Mail size={18} />}
/>

<Input
  label="Password"
  type="password"
  placeholder="••••••••"
  icon={<Lock size={18} />}
  error="Password is required"
/>
```

### Textarea

**File**: `src/presentation/components/ui/Textarea.tsx`

```typescript
import React from 'react'

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
}

export default function Textarea({
  label,
  error,
  className = '',
  ...props
}: TextareaProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-tokyo-fg mb-2">
          {label}
        </label>
      )}
      
      <textarea
        className={`
          w-full px-4 py-2 bg-tokyo-bg border border-tokyo-comment rounded-lg
          text-tokyo-fg placeholder-tokyo-comment resize-none
          focus:outline-none focus:ring-2 focus:ring-tokyo-cyan focus:border-transparent
          disabled:opacity-50 disabled:cursor-not-allowed
          ${error ? 'border-tokyo-red focus:ring-tokyo-red' : ''}
          ${className}
        `}
        {...props}
      />
      
      {error && (
        <p className="mt-1 text-sm text-tokyo-red">{error}</p>
      )}
    </div>
  )
}
```

---

## Modal Component

**File**: `src/presentation/components/ui/Modal.tsx`

### Props

```typescript
interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
}
```

### Usage

```tsx
const [isOpen, setIsOpen] = useState(false)

<Button onClick={() => setIsOpen(true)}>Open Modal</Button>

<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Edit Project"
  size="lg"
>
  <ProjectForm />
</Modal>
```

### Implementation

```typescript
import React, { useEffect } from 'react'
import { X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md'
}: ModalProps) {
  useEffect(() => {
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
  
  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl'
  }
  
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />
          
          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`
                bg-tokyo-night border border-tokyo-comment rounded-lg shadow-2xl
                w-full ${sizes[size]} max-h-[90vh] overflow-hidden
                flex flex-col
              `}
            >
              {/* Header */}
              {title && (
                <div className="flex items-center justify-between px-6 py-4 border-b border-tokyo-comment">
                  <h2 className="text-xl font-bold text-tokyo-fg">
                    {title}
                  </h2>
                  <button
                    onClick={onClose}
                    className="text-tokyo-comment hover:text-tokyo-fg transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>
              )}
              
              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6">
                {children}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
```

---

## Loading Component

**File**: `src/presentation/components/ui/Loading.tsx`

### Usage

```tsx
<Loading />
<Loading text="Loading projects..." />
<Loading size="sm" />
```

### Implementation

```typescript
import React from 'react'

interface LoadingProps {
  text?: string
  size?: 'sm' | 'md' | 'lg'
}

export default function Loading({ 
  text = 'Loading...', 
  size = 'md' 
}: LoadingProps) {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  }
  
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className={`${sizes[size]} relative`}>
        <div className="absolute inset-0 border-4 border-tokyo-comment rounded-full" />
        <div className="absolute inset-0 border-4 border-tokyo-cyan rounded-full border-t-transparent animate-spin" />
      </div>
      
      {text && (
        <p className="mt-4 text-tokyo-comment">{text}</p>
      )}
    </div>
  )
}
```

---

## Animation Components

### Typing Tagline

**File**: `src/presentation/components/ui/TypingTagline.tsx`

```typescript
import { useState, useEffect } from 'react'

interface TypingTaglineProps {
  text: string
  speed?: number
}

export default function TypingTagline({ 
  text, 
  speed = 50 
}: TypingTaglineProps) {
  const [displayedText, setDisplayedText] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)
  
  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex])
        setCurrentIndex(prev => prev + 1)
      }, speed)
      
      return () => clearTimeout(timeout)
    }
  }, [currentIndex, text, speed])
  
  return (
    <span className="text-tokyo-cyan font-mono">
      {displayedText}
      <span className="animate-pulse">|</span>
    </span>
  )
}
```

---

## Component Patterns

### Compound Components

```typescript
// Card with subcomponents
export function Card({ children, className = '' }: CardProps) {
  return (
    <div className={`bg-tokyo-night border border-tokyo-comment rounded-lg ${className}`}>
      {children}
    </div>
  )
}

Card.Header = function CardHeader({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-6 py-4 border-b border-tokyo-comment">
      {children}
    </div>
  )
}

Card.Body = function CardBody({ children }: { children: React.ReactNode }) {
  return (
    <div className="p-6">
      {children}
    </div>
  )
}

Card.Footer = function CardFooter({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-6 py-4 border-t border-tokyo-comment">
      {children}
    </div>
  )
}

// Usage
<Card>
  <Card.Header>
    <h3>Title</h3>
  </Card.Header>
  <Card.Body>
    <p>Content</p>
  </Card.Body>
  <Card.Footer>
    <Button>Action</Button>
  </Card.Footer>
</Card>
```

---

**Next**: [11-STATE-MANAGEMENT.md](./11-STATE-MANAGEMENT.md) - State patterns and hooks
