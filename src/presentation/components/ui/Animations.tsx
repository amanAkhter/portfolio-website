import React, { useEffect, useRef, useState } from 'react'
import { motion, useInView, useScroll, useTransform } from 'motion/react'

interface FadeInProps {
  children: React.ReactNode
  delay?: number
  duration?: number
  className?: string
}

export const FadeIn: React.FC<FadeInProps> = ({ children, delay = 0, duration = 0.6, className }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

interface ScrollRevealProps {
  children: React.ReactNode
  delay?: number
  className?: string
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({ children, delay = 0, className }) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.6, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

interface ParallaxProps {
  children: React.ReactNode
  offset?: number
  className?: string
}

export const Parallax: React.FC<ParallaxProps> = ({ children, offset = 50, className }) => {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  })

  const y = useTransform(scrollYProgress, [0, 1], [0, offset])

  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
  )
}

interface StaggerChildrenProps {
  children: React.ReactNode
  staggerDelay?: number
  className?: string
}

export const StaggerChildren: React.FC<StaggerChildrenProps> = ({ 
  children, 
  staggerDelay = 0.1,
  className 
}) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
      },
    },
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={className}
    >
      {children}
    </motion.div>
  )
}

interface ScaleOnHoverProps {
  children: React.ReactNode
  scale?: number
  className?: string
}

export const ScaleOnHover: React.FC<ScaleOnHoverProps> = ({ 
  children, 
  scale = 1.05,
  className 
}) => {
  return (
    <motion.div
      whileHover={{ scale }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

interface SlideInProps {
  children: React.ReactNode
  direction?: 'left' | 'right' | 'up' | 'down'
  delay?: number
  className?: string
}

export const SlideIn: React.FC<SlideInProps> = ({ 
  children, 
  direction = 'left',
  delay = 0,
  className 
}) => {
  const directions = {
    left: { x: -100, y: 0 },
    right: { x: 100, y: 0 },
    up: { x: 0, y: -100 },
    down: { x: 0, y: 100 },
  }

  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, ...directions[direction] }}
      animate={isInView ? { opacity: 1, x: 0, y: 0 } : { opacity: 0, ...directions[direction] }}
      transition={{ duration: 0.6, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

interface TypewriterProps {
  text: string
  delay?: number
  className?: string
}

export const Typewriter: React.FC<TypewriterProps> = ({ text, delay = 0, className }) => {
  const [displayText, setDisplayText] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex])
        setCurrentIndex(prev => prev + 1)
      }, 50 + delay)

      return () => clearTimeout(timeout)
    }
  }, [currentIndex, text, delay])

  return <span className={className}>{displayText}</span>
}

interface GlowOnHoverProps {
  children: React.ReactNode
  className?: string
  glowColor?: string
}

export const GlowOnHover: React.FC<GlowOnHoverProps> = ({ 
  children, 
  className,
  glowColor = 'rgba(122, 162, 247, 0.5)'
}) => {
  return (
    <motion.div
      whileHover={{
        boxShadow: `0 0 20px ${glowColor}, 0 0 40px ${glowColor}`,
      }}
      transition={{ duration: 0.3 }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
