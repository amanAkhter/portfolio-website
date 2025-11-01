# Animations with Framer Motion

> Create smooth, professional animations in React with TypeScript

## 📚 Table of Contents
1. [Getting Started](#getting-started)
2. [Basic Animations](#basic-animations)
3. [Animation Variants](#animation-variants)
4. [Gestures & Interactions](#gestures--interactions)
5. [Layout Animations](#layout-animations)
6. [Real Portfolio Examples](#real-portfolio-examples)

---

## 🚀 Getting Started

### Installation

```bash
pnpm add framer-motion
```

### Basic Import

```typescript
import { motion } from 'framer-motion'

// Turn any element into an animated element
<motion.div>Animated content</motion.div>
<motion.button>Animated button</motion.button>
<motion.img src="..." />
```

---

## 🎨 Basic Animations

### Fade In

```typescript
const FadeIn: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.div>
  )
}

// Usage
<FadeIn>
  <h1>This fades in!</h1>
</FadeIn>
```

### Slide In

```typescript
interface SlideInProps {
  children: React.ReactNode
  direction?: 'left' | 'right' | 'up' | 'down'
  delay?: number
}

const SlideIn: React.FC<SlideInProps> = ({ 
  children, 
  direction = 'left',
  delay = 0 
}) => {
  const directions = {
    left: { x: -100 },
    right: { x: 100 },
    up: { y: -100 },
    down: { y: 100 }
  }
  
  return (
    <motion.div
      initial={{ ...directions[direction], opacity: 0 }}
      animate={{ x: 0, y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay }}
    >
      {children}
    </motion.div>
  )
}

// Usage
<SlideIn direction="right" delay={0.2}>
  <p>Slides in from the right</p>
</SlideIn>
```

### Scale Animation

```typescript
const ScaleIn: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
    >
      {children}
    </motion.div>
  )
}
```

### Combined Animations

```typescript
const FadeSlideScale: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <motion.div
      initial={{ 
        opacity: 0, 
        x: -50, 
        scale: 0.9 
      }}
      animate={{ 
        opacity: 1, 
        x: 0, 
        scale: 1 
      }}
      transition={{ 
        duration: 0.6,
        ease: 'easeOut'
      }}
    >
      {children}
    </motion.div>
  )
}
```

---

## 🎭 Animation Variants

### Basic Variants

```typescript
const variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

const AnimatedComponent = () => {
  return (
    <motion.div
      variants={variants}
      initial="hidden"
      animate="visible"
      transition={{ duration: 0.5 }}
    >
      Content
    </motion.div>
  )
}
```

### Staggered Children

```typescript
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1 // Delay between each child
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

const StaggeredList: React.FC<{ items: string[] }> = ({ items }) => {
  return (
    <motion.ul
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {items.map((item, index) => (
        <motion.li
          key={index}
          variants={itemVariants}
        >
          {item}
        </motion.li>
      ))}
    </motion.ul>
  )
}

// Each item animates one after another!
```

### Hover & Tap Variants

```typescript
const buttonVariants = {
  rest: { scale: 1 },
  hover: { scale: 1.05 },
  tap: { scale: 0.95 }
}

const AnimatedButton: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <motion.button
      variants={buttonVariants}
      initial="rest"
      whileHover="hover"
      whileTap="tap"
      transition={{ type: 'spring', stiffness: 400, damping: 10 }}
    >
      {children}
    </motion.button>
  )
}
```

---

## 👆 Gestures & Interactions

### Hover Effects

```typescript
const HoverCard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <motion.div
      whileHover={{
        scale: 1.05,
        boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
        transition: { duration: 0.2 }
      }}
    >
      {children}
    </motion.div>
  )
}
```

### Click Effects

```typescript
const ClickableCard: React.FC<{
  children: React.ReactNode
  onClick: () => void
}> = ({ children, onClick }) => {
  return (
    <motion.div
      onClick={onClick}
      whileTap={{ scale: 0.95 }}
      whileHover={{ scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 400 }}
    >
      {children}
    </motion.div>
  )
}
```

### Drag

```typescript
const DraggableBox = () => {
  return (
    <motion.div
      drag
      dragConstraints={{ left: -100, right: 100, top: -100, bottom: 100 }}
      dragElastic={0.2}
      whileDrag={{ scale: 1.1, cursor: 'grabbing' }}
    >
      Drag me!
    </motion.div>
  )
}

// Lock to one axis
<motion.div drag="x"> Horizontal only </motion.div>
<motion.div drag="y"> Vertical only </motion.div>
```

---

## 📐 Layout Animations

### Animate Layout Changes

```typescript
const ExpandableCard: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false)
  
  return (
    <motion.div
      layout // Automatically animates layout changes!
      onClick={() => setIsExpanded(!isExpanded)}
      style={{
        padding: '20px',
        borderRadius: '10px',
        background: '#333'
      }}
    >
      <motion.h2 layout>Title</motion.h2>
      
      {isExpanded && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          This is the expanded content that appears smoothly!
        </motion.p>
      )}
    </motion.div>
  )
}
```

### Shared Layout Animations

```typescript
const ImageGallery: React.FC = () => {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  
  return (
    <>
      {items.map(item => (
        <motion.div
          key={item.id}
          layoutId={item.id} // Shared layout ID
          onClick={() => setSelectedId(item.id)}
        >
          <img src={item.image} alt={item.title} />
        </motion.div>
      ))}
      
      {selectedId && (
        <motion.div
          layoutId={selectedId} // Same layout ID
          onClick={() => setSelectedId(null)}
        >
          <img src={items.find(i => i.id === selectedId)?.image} alt="" />
        </motion.div>
      )}
    </>
  )
}
```

---

## 🎯 Real Portfolio Examples

### FadeIn Component (from Portfolio)

```typescript
// src/presentation/components/ui/FadeIn.tsx
import { motion, Variants } from 'framer-motion'

interface FadeInProps {
  children: React.ReactNode
  delay?: number
  duration?: number
  className?: string
}

const fadeInVariants: Variants = {
  hidden: { 
    opacity: 0, 
    y: 20 
  },
  visible: { 
    opacity: 1, 
    y: 0 
  }
}

export const FadeIn: React.FC<FadeInProps> = ({
  children,
  delay = 0,
  duration = 0.5,
  className
}) => {
  return (
    <motion.div
      variants={fadeInVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration, delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Usage in portfolio sections
<FadeIn delay={0.2}>
  <h2>About Me</h2>
</FadeIn>

<FadeIn delay={0.4}>
  <p>I'm a full-stack developer...</p>
</FadeIn>
```

### SlideIn Component (from Portfolio)

```typescript
// src/presentation/components/ui/SlideIn.tsx
import { motion, Variants } from 'framer-motion'

interface SlideInProps {
  children: React.ReactNode
  direction?: 'left' | 'right' | 'up' | 'down'
  delay?: number
  duration?: number
  className?: string
}

const getSlideVariants = (direction: SlideInProps['direction']): Variants => {
  const directions = {
    left: { x: -100, opacity: 0 },
    right: { x: 100, opacity: 0 },
    up: { y: -100, opacity: 0 },
    down: { y: 100, opacity: 0 }
  }
  
  return {
    hidden: directions[direction || 'left'],
    visible: { 
      x: 0, 
      y: 0, 
      opacity: 1 
    }
  }
}

export const SlideIn: React.FC<SlideInProps> = ({
  children,
  direction = 'left',
  delay = 0,
  duration = 0.5,
  className
}) => {
  return (
    <motion.div
      variants={getSlideVariants(direction)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      transition={{ duration, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
```

### Project Card with Hover Animation

```typescript
// src/presentation/components/sections/Projects.tsx
interface ProjectCardProps {
  project: Project
  onClick: () => void
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onClick }) => {
  return (
    <motion.div
      className="project-card"
      onClick={onClick}
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      whileHover={{ 
        y: -10,
        boxShadow: '0 20px 40px rgba(0, 255, 255, 0.3)',
        transition: { duration: 0.2 }
      }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.3 }}
    >
      <div className="project-image">
        <img src={project.coverImage} alt={project.name} />
      </div>
      
      <motion.div 
        className="project-content"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
      >
        <h3>{project.name}</h3>
        <p>{project.shortDescription}</p>
        
        <div className="tech-stack">
          {project.technologies.map((tech, i) => (
            <motion.span
              key={tech}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              {tech}
            </motion.span>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}
```

### Animated Hero Section

```typescript
// src/presentation/components/sections/Home.tsx
const Home: React.FC = () => {
  return (
    <section className="home-section">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <h1 className="hero-title">
          <motion.span
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            Hi, I'm
          </motion.span>
          
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="gradient-text"
          >
            Your Name
          </motion.span>
        </h1>
        
        <motion.p
          className="hero-subtitle"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          Full Stack Developer
        </motion.p>
        
        <motion.div
          className="cta-buttons"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            View Projects
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Contact Me
          </motion.button>
        </motion.div>
      </motion.div>
    </section>
  )
}
```

### Staggered Skills List

```typescript
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3
    }
  }
}

const itemVariants: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: {
      type: 'spring',
      stiffness: 100
    }
  }
}

const SkillsList: React.FC<{ skills: Skill[] }> = ({ skills }) => {
  return (
    <motion.div
      className="skills-grid"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      {skills.map((skill) => (
        <motion.div
          key={skill.id}
          className="skill-card"
          variants={itemVariants}
          whileHover={{ 
            scale: 1.05,
            boxShadow: '0 10px 30px rgba(0, 255, 255, 0.2)'
          }}
        >
          <img src={skill.icon} alt={skill.name} />
          <h3>{skill.name}</h3>
          
          <motion.div 
            className="skill-level"
            initial={{ width: 0 }}
            whileInView={{ width: `${skill.level}%` }}
            transition={{ delay: 0.5, duration: 1, ease: 'easeOut' }}
          />
        </motion.div>
      ))}
    </motion.div>
  )
}
```

### Page Transition

```typescript
// src/App.tsx
import { AnimatePresence, motion } from 'framer-motion'
import { useLocation } from 'react-router-dom'

const pageVariants: Variants = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 }
}

function App() {
  const location = useLocation()
  
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: 0.3 }}
      >
        <Routes location={location}>
          <Route path="/" element={<PortfolioPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  )
}
```

---

## 🎬 Animation Helpers

### Custom Easing

```typescript
// Predefined easing
transition={{ ease: 'easeIn' }}
transition={{ ease: 'easeOut' }}
transition={{ ease: 'easeInOut' }}
transition={{ ease: 'linear' }}

// Custom cubic bezier
transition={{ ease: [0.6, 0.01, -0.05, 0.95] }}

// Spring physics
transition={{ 
  type: 'spring',
  stiffness: 100,
  damping: 10
}}
```

### useAnimation Hook

```typescript
import { useAnimation } from 'framer-motion'

const AnimatedComponent = () => {
  const controls = useAnimation()
  
  const handleClick = async () => {
    await controls.start({ scale: 1.5 })
    await controls.start({ scale: 1 })
  }
  
  return (
    <motion.div
      animate={controls}
      onClick={handleClick}
    >
      Click to animate
    </motion.div>
  )
}
```

### useInView Hook

```typescript
import { useInView } from 'framer-motion'
import { useRef } from 'react'

const ScrollTriggeredAnimation = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })
  
  return (
    <motion.div
      ref={ref}
      style={{
        opacity: isInView ? 1 : 0,
        transform: isInView ? 'translateY(0)' : 'translateY(50px)',
        transition: 'all 0.5s'
      }}
    >
      Animates when scrolled into view
    </motion.div>
  )
}
```

---

## ⚡ Performance Tips

1. **Use `transform` and `opacity`** - GPU accelerated
2. **Avoid animating `width`, `height`, `top`, `left`** - causes reflow
3. **Use `will-change` sparingly** - only when needed
4. **Disable animations on mount** with `initial={false}`
5. **Use `AnimatePresence`** for exit animations
6. **Reduce motion for accessibility**:

```typescript
import { useReducedMotion } from 'framer-motion'

const Component = () => {
  const shouldReduceMotion = useReducedMotion()
  
  return (
    <motion.div
      animate={{ 
        x: shouldReduceMotion ? 0 : 100 
      }}
    />
  )
}
```

---

## ✅ Best Practices

1. **Keep animations subtle** - don't overdo it
2. **Use consistent timing** across the app
3. **Animate on interaction** for feedback
4. **Use `once: true`** for scroll animations
5. **Test on mobile devices** - performance matters
6. **Provide fallbacks** for reduced motion
7. **Animate layout changes** with `layout` prop
8. **Use variants** for complex animations

---

## 🚫 Anti-Patterns

```typescript
// ❌ Animating non-GPU properties
<motion.div animate={{ width: '100%' }} />

// ✅ Use transform instead
<motion.div animate={{ scaleX: 1 }} />

// ❌ Too many animations
<motion.div animate={{ x: 100, y: 100, scale: 1.5, rotate: 45, ... }} />

// ✅ Keep it simple
<motion.div animate={{ x: 100, opacity: 1 }} />

// ❌ No reduced motion support
<motion.div animate={{ x: 100 }} />

// ✅ Respect user preferences
const shouldAnimate = !useReducedMotion()
<motion.div animate={shouldAnimate ? { x: 100 } : {}} />
```

---

## 🎓 Practice Exercises

1. Create a loading spinner with rotation animation
2. Build an animated modal that slides up from bottom
3. Create a card flip animation on hover
4. Build a staggered list with fade-in effect
5. Create a page transition animation system

---

**Next:** [Testing Animations →](./41-UNIT-TESTING.md)
