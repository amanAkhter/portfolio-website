# Responsive Design Documentation

## 📖 Table of Contents
1. [Overview](#overview)
2. [Mobile-First Approach](#mobile-first-approach)
3. [Breakpoint System](#breakpoint-system)
4. [Responsive Components](#responsive-components)
5. [Grid Layouts](#grid-layouts)
6. [Touch Interactions](#touch-interactions)
7. [Testing](#testing)

---

## Overview

The portfolio follows a mobile-first responsive design approach using Tailwind CSS breakpoints and responsive utilities.

### Key Principles
- ✅ Mobile-first design
- ✅ Fluid typography
- ✅ Flexible grids
- ✅ Touch-friendly interactions
- ✅ Optimized images
- ✅ Responsive navigation

---

## Mobile-First Approach

### Design Philosophy

Start with mobile styles, then enhance for larger screens:

```typescript
// Base styles for mobile
<div className="px-4 py-8 text-base">
  {/* Mobile-first content */}
</div>

// Enhanced for tablets and desktop
<div className="px-4 md:px-8 lg:px-12 py-8 md:py-12 lg:py-16 text-base md:text-lg">
  {/* Content scales up */}
</div>
```

### Why Mobile-First?

1. **Performance**: Smaller initial payload
2. **Progressive Enhancement**: Add features as space allows
3. **Focus**: Forces prioritization of essential content
4. **Accessibility**: Touch-friendly by default

---

## Breakpoint System

### Tailwind Breakpoints

```typescript
// tailwind.config.js
export default {
  theme: {
    screens: {
      'sm': '640px',   // Small tablets
      'md': '768px',   // Tablets
      'lg': '1024px',  // Laptops
      'xl': '1280px',  // Desktops
      '2xl': '1536px'  // Large desktops
    }
  }
}
```

### Usage Examples

```typescript
// Responsive padding
<div className="px-4 sm:px-6 md:px-8 lg:px-12">

// Responsive text size
<h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl">

// Responsive grid columns
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">

// Responsive display
<div className="hidden md:block">
  Desktop only content
</div>

// Responsive flex direction
<div className="flex flex-col md:flex-row">
```

### Container Sizes

```typescript
<div className="container mx-auto px-4">
  {/* Responsive container with horizontal padding */}
</div>

// Custom max-width
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
  {/* Centered content with breakpoint-aware padding */}
</div>
```

---

## Responsive Components

### Navigation

```typescript
// Mobile: Hamburger menu
// Desktop: Horizontal navigation

export default function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  
  return (
    <nav className="fixed top-0 w-full z-50 bg-tokyo-night/95 backdrop-blur">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="text-xl font-bold text-tokyo-cyan">
            Portfolio
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#home" className="text-tokyo-fg hover:text-tokyo-cyan">
              Home
            </a>
            <a href="#about" className="text-tokyo-fg hover:text-tokyo-cyan">
              About
            </a>
            <a href="#projects" className="text-tokyo-fg hover:text-tokyo-cyan">
              Projects
            </a>
          </div>
          
          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-tokyo-fg"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
        
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-2">
            <a
              href="#home"
              className="block px-4 py-2 text-tokyo-fg hover:bg-tokyo-selection"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </a>
            <a
              href="#about"
              className="block px-4 py-2 text-tokyo-fg hover:bg-tokyo-selection"
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </a>
          </div>
        )}
      </div>
    </nav>
  )
}
```

### Card Component

```typescript
export default function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="
      bg-tokyo-night 
      border border-tokyo-comment 
      rounded-lg
      p-4 sm:p-6 md:p-8
      shadow-lg
      hover:shadow-tokyo-cyan/20
      transition-all
    ">
      {children}
    </div>
  )
}
```

### Hero Section

```typescript
export default function Hero() {
  return (
    <section className="
      min-h-screen 
      flex items-center 
      px-4 sm:px-6 lg:px-8
      py-20 md:py-0
    ">
      <div className="container mx-auto">
        <div className="max-w-4xl">
          {/* Title */}
          <h1 className="
            text-4xl sm:text-5xl md:text-6xl lg:text-7xl 
            font-bold 
            text-tokyo-cyan 
            mb-4 sm:mb-6
          ">
            Full Stack Developer
          </h1>
          
          {/* Subtitle */}
          <p className="
            text-base sm:text-lg md:text-xl 
            text-tokyo-comment 
            mb-6 sm:mb-8
          ">
            Building modern web applications
          </p>
          
          {/* CTA Buttons */}
          <div className="
            flex 
            flex-col sm:flex-row 
            gap-4
          ">
            <Button size="lg" className="w-full sm:w-auto">
              View Projects
            </Button>
            <Button size="lg" variant="outline" className="w-full sm:w-auto">
              Contact Me
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
```

---

## Grid Layouts

### Project Grid

```typescript
export default function Projects() {
  return (
    <div className="
      grid 
      grid-cols-1           /* Mobile: 1 column */
      sm:grid-cols-2        /* Small tablets: 2 columns */
      lg:grid-cols-3        /* Desktop: 3 columns */
      gap-4 sm:gap-6 lg:gap-8
    ">
      {projects.map(project => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  )
}
```

### Skill Grid

```typescript
export default function Skills() {
  return (
    <div className="
      grid 
      grid-cols-2           /* Mobile: 2 columns */
      sm:grid-cols-3        /* Small tablets: 3 columns */
      md:grid-cols-4        /* Tablets: 4 columns */
      lg:grid-cols-5        /* Desktop: 5 columns */
      xl:grid-cols-6        /* Large desktop: 6 columns */
      gap-3 sm:gap-4 md:gap-6
    ">
      {skills.map(skill => (
        <SkillCard key={skill.id} skill={skill} />
      ))}
    </div>
  )
}
```

### Two-Column Layout

```typescript
export default function About() {
  return (
    <div className="
      grid 
      grid-cols-1 
      md:grid-cols-2 
      gap-8 md:gap-12
    ">
      {/* Text Column */}
      <div className="space-y-4">
        <h2 className="text-3xl font-bold">About Me</h2>
        <p className="text-tokyo-comment">...</p>
      </div>
      
      {/* Image Column */}
      <div className="
        order-first md:order-last  /* Image first on mobile, last on desktop */
      ">
        <img src="/profile.jpg" alt="Profile" className="rounded-lg" />
      </div>
    </div>
  )
}
```

---

## Touch Interactions

### Touch-Friendly Buttons

```typescript
export default function Button({ children }: { children: React.ReactNode }) {
  return (
    <button className="
      px-6 py-3          /* Minimum 44px height for touch targets */
      text-base sm:text-lg
      rounded-lg
      bg-tokyo-cyan
      text-tokyo-bg
      
      /* Touch feedback */
      active:scale-95
      transition-transform
      
      /* Prevent text selection on double-tap */
      select-none
    ">
      {children}
    </button>
  )
}
```

### Swipeable Cards

```typescript
import { motion } from 'framer-motion'

export default function SwipeableCard() {
  return (
    <motion.div
      drag="x"
      dragConstraints={{ left: -100, right: 100 }}
      dragElastic={0.2}
      onDragEnd={(e, info) => {
        if (info.offset.x > 100) {
          // Swiped right
        } else if (info.offset.x < -100) {
          // Swiped left
        }
      }}
      className="bg-tokyo-night p-6 rounded-lg cursor-grab active:cursor-grabbing"
    >
      Card Content
    </motion.div>
  )
}
```

### Mobile Menu Drawer

```typescript
import { motion, AnimatePresence } from 'framer-motion'

export default function MobileMenu({ isOpen, onClose }: Props) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={onClose}
          />
          
          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30 }}
            className="
              fixed 
              top-0 right-0 
              w-64 sm:w-80 
              h-full 
              bg-tokyo-night 
              z-50 
              p-6
              overflow-y-auto
            "
          >
            {/* Menu content */}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
```

---

## Typography

### Responsive Font Sizes

```typescript
// Headings
<h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold">
<h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold">
<h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold">
<h4 className="text-lg sm:text-xl md:text-2xl font-semibold">

// Body text
<p className="text-sm sm:text-base md:text-lg">

// Small text
<span className="text-xs sm:text-sm">
```

### Line Height & Spacing

```typescript
<p className="
  text-base md:text-lg
  leading-relaxed md:leading-loose
  mb-4 md:mb-6
">
  Paragraph with responsive line height and spacing
</p>
```

---

## Images

### Responsive Images

```typescript
<img
  src="/image.jpg"
  srcSet="
    /image-320.jpg 320w,
    /image-640.jpg 640w,
    /image-1280.jpg 1280w
  "
  sizes="
    (max-width: 640px) 100vw,
    (max-width: 1024px) 50vw,
    33vw
  "
  alt="Description"
  className="w-full h-auto rounded-lg"
/>
```

### Background Images

```typescript
<div className="
  bg-cover bg-center
  h-64 sm:h-80 md:h-96
  bg-[url('/mobile-bg.jpg')]
  sm:bg-[url('/tablet-bg.jpg')]
  lg:bg-[url('/desktop-bg.jpg')]
">
  Content
</div>
```

---

## Testing

### Responsive Testing Checklist

- [ ] Mobile (320px - 640px)
- [ ] Tablet Portrait (640px - 768px)
- [ ] Tablet Landscape (768px - 1024px)
- [ ] Laptop (1024px - 1280px)
- [ ] Desktop (1280px+)

### Test on Real Devices

```typescript
// Use Chrome DevTools Device Mode
// Test on actual devices:
// - iPhone SE (375px)
// - iPhone 12/13 (390px)
// - iPad (768px)
// - iPad Pro (1024px)
// - Desktop (1920px)
```

### Responsive Utilities Hook

```typescript
import { useState, useEffect } from 'react'

export function useBreakpoint() {
  const [breakpoint, setBreakpoint] = useState<'mobile' | 'tablet' | 'desktop'>('mobile')
  
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth
      if (width < 768) {
        setBreakpoint('mobile')
      } else if (width < 1024) {
        setBreakpoint('tablet')
      } else {
        setBreakpoint('desktop')
      }
    }
    
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])
  
  return breakpoint
}

// Usage
function Component() {
  const breakpoint = useBreakpoint()
  
  return (
    <div>
      {breakpoint === 'mobile' && <MobileView />}
      {breakpoint === 'tablet' && <TabletView />}
      {breakpoint === 'desktop' && <DesktopView />}
    </div>
  )
}
```

---

**Next**: [20-PERFORMANCE.md](./20-PERFORMANCE.md) - Performance optimization guide
