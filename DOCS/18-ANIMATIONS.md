# Animations Documentation

## 📖 Table of Contents
1. [Overview](#overview)
2. [Framer Motion](#framer-motion)
3. [GSAP Animations](#gsap-animations)
4. [Particle Effects](#particle-effects)
5. [Scroll Animations](#scroll-animations)
6. [Animation Components](#animation-components)
7. [Performance](#performance)

---

## Overview

The portfolio uses multiple animation libraries and techniques to create engaging, smooth user experiences.

### Animation Stack
- **Framer Motion**: React animation library for component animations
- **GSAP**: Professional-grade animation engine
- **CSS Animations**: Tailwind CSS utilities
- **Canvas API**: Particle effects

---

## Framer Motion

### Installation & Setup

```bash
pnpm add framer-motion
```

### Basic Usage

```typescript
import { motion } from 'framer-motion'

function Component() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      Content
    </motion.div>
  )
}
```

### Fade In Animation

```typescript
export const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
}

// Usage
<motion.div {...fadeIn}>
  Content
</motion.div>
```

### Slide In Animation

```typescript
export const slideIn = (direction: 'left' | 'right' | 'up' | 'down') => {
  const directions = {
    left: { x: -100 },
    right: { x: 100 },
    up: { y: -100 },
    down: { y: 100 }
  }
  
  return {
    initial: { opacity: 0, ...directions[direction] },
    animate: { opacity: 1, x: 0, y: 0 },
    transition: { duration: 0.6 }
  }
}

// Usage
<motion.div {...slideIn('left')}>
  Content
</motion.div>
```

### Scale Animation

```typescript
export const scaleIn = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1 },
  transition: {
    duration: 0.5,
    ease: 'easeOut'
  }
}
```

### Stagger Children

```typescript
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
}

// Usage
<motion.ul variants={container} initial="hidden" animate="show">
  {items.map(item => (
    <motion.li key={item.id} variants={item}>
      {item.content}
    </motion.li>
  ))}
</motion.ul>
```

### Hover Animations

```typescript
<motion.button
  whileHover={{ 
    scale: 1.05,
    boxShadow: '0 10px 30px rgba(125, 207, 255, 0.3)'
  }}
  whileTap={{ scale: 0.95 }}
  transition={{ type: 'spring', stiffness: 300 }}
>
  Click Me
</motion.button>
```

### Advanced Animations Component

**File**: `src/presentation/components/ui/AdvancedAnimations.tsx`

```typescript
import { motion, Variants } from 'framer-motion'

// Fade in variants
export const fadeInVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut'
    }
  }
}

// Slide in from left
export const slideInLeftVariants: Variants = {
  hidden: { opacity: 0, x: -50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut'
    }
  }
}

// Slide in from right
export const slideInRightVariants: Variants = {
  hidden: { opacity: 0, x: 50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut'
    }
  }
}

// Scale up
export const scaleUpVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: 'easeOut'
    }
  }
}

// Rotate in
export const rotateInVariants: Variants = {
  hidden: { opacity: 0, rotate: -180 },
  visible: {
    opacity: 1,
    rotate: 0,
    transition: {
      duration: 0.8,
      ease: 'easeOut'
    }
  }
}

// Container with stagger
export const staggerContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
}

// Stagger item
export const staggerItemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5
    }
  }
}

// Bounce animation
export const bounceVariants: Variants = {
  hidden: { opacity: 0, y: -50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      bounce: 0.5,
      duration: 0.8
    }
  }
}

// Float animation (continuous)
export const floatVariants: Variants = {
  initial: { y: 0 },
  animate: {
    y: [-10, 10, -10],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: 'easeInOut'
    }
  }
}

// Pulse animation (continuous)
export const pulseVariants: Variants = {
  initial: { scale: 1 },
  animate: {
    scale: [1, 1.05, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut'
    }
  }
}

// Glow animation (continuous)
export const glowVariants: Variants = {
  initial: { opacity: 0.7 },
  animate: {
    opacity: [0.7, 1, 0.7],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut'
    }
  }
}

// Page transition
export const pageTransitionVariants: Variants = {
  initial: { opacity: 0, x: -20 },
  animate: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.4
    }
  },
  exit: {
    opacity: 0,
    x: 20,
    transition: {
      duration: 0.4
    }
  }
}

// Card hover
export const cardHoverVariants: Variants = {
  rest: { scale: 1 },
  hover: {
    scale: 1.02,
    boxShadow: '0 10px 40px rgba(125, 207, 255, 0.2)',
    transition: {
      duration: 0.3,
      ease: 'easeOut'
    }
  }
}

// Button press
export const buttonPressVariants: Variants = {
  rest: { scale: 1 },
  hover: { scale: 1.05 },
  pressed: { scale: 0.95 }
}
```

---

## GSAP Animations

### Installation

```bash
pnpm add gsap
```

### Basic GSAP Animation

```typescript
import { useEffect, useRef } from 'react'
import gsap from 'gsap'

function Component() {
  const elementRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    if (elementRef.current) {
      gsap.from(elementRef.current, {
        opacity: 0,
        y: 50,
        duration: 1,
        ease: 'power3.out'
      })
    }
  }, [])
  
  return <div ref={elementRef}>Content</div>
}
```

### ScrollTrigger Integration

```typescript
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

useEffect(() => {
  gsap.from('.section', {
    scrollTrigger: {
      trigger: '.section',
      start: 'top 80%',
      end: 'bottom 20%',
      scrub: 1,
      markers: false
    },
    opacity: 0,
    y: 100
  })
}, [])
```

### Timeline Animation

```typescript
useEffect(() => {
  const tl = gsap.timeline()
  
  tl.from('.hero-title', {
    opacity: 0,
    y: -50,
    duration: 0.8
  })
  .from('.hero-subtitle', {
    opacity: 0,
    y: 30,
    duration: 0.6
  }, '-=0.4') // Start 0.4s before previous ends
  .from('.hero-cta', {
    opacity: 0,
    scale: 0.8,
    duration: 0.5
  }, '-=0.3')
  
  return () => tl.kill()
}, [])
```

### Text Animation

```typescript
import { TextPlugin } from 'gsap/TextPlugin'

gsap.registerPlugin(TextPlugin)

useEffect(() => {
  gsap.to('.typed-text', {
    duration: 2,
    text: 'Hello, I am a Full Stack Developer',
    ease: 'none'
  })
}, [])
```

---

## Particle Effects

### ParticlesBackground Component

**File**: `src/presentation/components/ui/ParticlesBackground.tsx`

```typescript
import { useEffect, useRef } from 'react'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  color: string
  opacity: number
}

export default function ParticlesBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const animationRef = useRef<number>()
  
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)
    
    // Create particles
    const createParticles = () => {
      const particleCount = Math.floor((canvas.width * canvas.height) / 15000)
      particlesRef.current = []
      
      for (let i = 0; i < particleCount; i++) {
        particlesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          radius: Math.random() * 2 + 1,
          color: '#7dcfff',
          opacity: Math.random() * 0.5 + 0.3
        })
      }
    }
    createParticles()
    
    // Animation loop
    const animate = () => {
      ctx.fillStyle = 'rgba(26, 27, 38, 0.1)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      
      particlesRef.current.forEach(particle => {
        // Update position
        particle.x += particle.vx
        particle.y += particle.vy
        
        // Wrap around edges
        if (particle.x < 0) particle.x = canvas.width
        if (particle.x > canvas.width) particle.x = 0
        if (particle.y < 0) particle.y = canvas.height
        if (particle.y > canvas.height) particle.y = 0
        
        // Draw particle
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(125, 207, 255, ${particle.opacity})`
        ctx.fill()
      })
      
      // Draw connections
      particlesRef.current.forEach((p1, i) => {
        particlesRef.current.slice(i + 1).forEach(p2 => {
          const dx = p1.x - p2.x
          const dy = p1.y - p2.y
          const distance = Math.sqrt(dx * dx + dy * dy)
          
          if (distance < 150) {
            ctx.beginPath()
            ctx.moveTo(p1.x, p1.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.strokeStyle = `rgba(125, 207, 255, ${0.15 * (1 - distance / 150)})`
            ctx.lineWidth = 1
            ctx.stroke()
          }
        })
      })
      
      animationRef.current = requestAnimationFrame(animate)
    }
    animate()
    
    return () => {
      window.removeEventListener('resize', resizeCanvas)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])
  
  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  )
}
```

### SpaceParticles Component

```typescript
import { useEffect, useRef } from 'react'

export default function SpaceParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    
    const stars: Array<{
      x: number
      y: number
      radius: number
      speed: number
    }> = []
    
    // Create stars
    for (let i = 0; i < 200; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 1.5,
        speed: Math.random() * 0.5 + 0.1
      })
    }
    
    const animate = () => {
      ctx.fillStyle = 'rgba(26, 27, 38, 0.1)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      
      stars.forEach(star => {
        star.y += star.speed
        if (star.y > canvas.height) {
          star.y = 0
          star.x = Math.random() * canvas.width
        }
        
        ctx.beginPath()
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2)
        ctx.fillStyle = '#7dcfff'
        ctx.fill()
      })
      
      requestAnimationFrame(animate)
    }
    animate()
  }, [])
  
  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none opacity-30"
    />
  )
}
```

---

## Scroll Animations

### Scroll-Triggered Fade In

```typescript
import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'

function ScrollFadeIn({ children }: { children: React.ReactNode }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.6 }}
    >
      {children}
    </motion.div>
  )
}
```

### Scroll Progress Indicator

```typescript
import { motion, useScroll, useSpring } from 'framer-motion'

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })
  
  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 bg-tokyo-cyan origin-left z-50"
      style={{ scaleX }}
    />
  )
}
```

### Parallax Scrolling

```typescript
import { motion, useScroll, useTransform } from 'framer-motion'

function ParallaxSection() {
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 1000], [0, -300])
  
  return (
    <motion.div
      style={{ y }}
      className="relative"
    >
      <img src="/bg.jpg" alt="Background" />
    </motion.div>
  )
}
```

---

## Animation Components

### Animations Utility Component

**File**: `src/presentation/components/ui/Animations.tsx`

```typescript
import { motion, HTMLMotionProps } from 'framer-motion'
import { ReactNode } from 'react'

interface FadeInProps extends HTMLMotionProps<'div'> {
  children: ReactNode
  delay?: number
  duration?: number
}

export function FadeIn({ 
  children, 
  delay = 0, 
  duration = 0.5,
  ...props 
}: FadeInProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration }}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export function SlideIn({ 
  children, 
  direction = 'left',
  delay = 0,
  duration = 0.6 
}: FadeInProps & { direction?: 'left' | 'right' | 'up' | 'down' }) {
  const directions = {
    left: { x: -100 },
    right: { x: 100 },
    up: { y: -100 },
    down: { y: 100 }
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, ...directions[direction] }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ delay, duration }}
    >
      {children}
    </motion.div>
  )
}

export function ScaleIn({ 
  children, 
  delay = 0,
  duration = 0.5 
}: FadeInProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration }}
    >
      {children}
    </motion.div>
  )
}

export function StaggerChildren({ 
  children, 
  staggerDelay = 0.1 
}: { children: ReactNode; staggerDelay?: number }) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        visible: {
          transition: {
            staggerChildren: staggerDelay
          }
        }
      }}
    >
      {children}
    </motion.div>
  )
}
```

---

## Performance

### Best Practices

1. **Use `will-change` CSS property**:
```css
.animated-element {
  will-change: transform, opacity;
}
```

2. **Prefer transforms over position properties**:
```typescript
// Good
<motion.div animate={{ x: 100 }} />

// Avoid
<motion.div animate={{ left: '100px' }} />
```

3. **Use `layoutId` for shared element transitions**:
```typescript
<motion.div layoutId="shared-element">
  Content
</motion.div>
```

4. **Reduce animation complexity**:
```typescript
// Limit particle count
const particleCount = Math.min(100, width * height / 20000)
```

5. **Use `IntersectionObserver` for scroll animations**:
```typescript
const { ref, inView } = useInView({
  triggerOnce: true,
  threshold: 0.1
})
```

---

**Next**: [19-RESPONSIVE-DESIGN.md](./19-RESPONSIVE-DESIGN.md) - Responsive design patterns
