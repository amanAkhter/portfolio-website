# Easter Eggs Documentation

## 📖 Table of Contents
1. [Overview](#overview)
2. [Konami Code](#konami-code)
3. [Secret Commands](#secret-commands)
4. [Hidden Features](#hidden-features)
5. [Implementation Guide](#implementation-guide)

---

## Overview

Easter eggs add fun, interactive elements that surprise and delight users who discover them.

### Portfolio Easter Eggs
- ✅ Konami Code activation
- ✅ Secret keyboard commands
- ✅ Hidden animations
- ✅ Special effects
- ✅ Surprise messages

---

## Konami Code

### Classic Konami Code

The famous cheat code: ↑ ↑ ↓ ↓ ← → ← → B A

**File**: `src/presentation/hooks/useEasterEggs.ts`

```typescript
import { useEffect, useState } from 'react'

export function useKonamiCode(callback: () => void) {
  const [keys, setKeys] = useState<string[]>([])
  
  const konamiCode = [
    'ArrowUp',
    'ArrowUp',
    'ArrowDown',
    'ArrowDown',
    'ArrowLeft',
    'ArrowRight',
    'ArrowLeft',
    'ArrowRight',
    'KeyB',
    'KeyA'
  ]
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      setKeys(prev => {
        const newKeys = [...prev, e.code].slice(-10) // Keep last 10 keys
        
        // Check if matches Konami Code
        if (JSON.stringify(newKeys) === JSON.stringify(konamiCode)) {
          callback()
          return [] // Reset after activation
        }
        
        return newKeys
      })
    }
    
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])
}
```

### Konami Code Effects

```typescript
// src/presentation/components/ui/EasterEggs.tsx
import { useState } from 'react'
import { useKonamiCode } from '../../hooks/useEasterEggs'
import confetti from 'canvas-confetti'

export default function EasterEggs() {
  const [konamiActivated, setKonamiActivated] = useState(false)
  
  useKonamiCode(() => {
    setKonamiActivated(true)
    
    // Confetti explosion
    confetti({
      particleCount: 200,
      spread: 70,
      origin: { y: 0.6 }
    })
    
    // Change theme colors temporarily
    document.documentElement.style.setProperty('--tokyo-cyan', '#ff00ff')
    
    // Reset after 5 seconds
    setTimeout(() => {
      setKonamiActivated(false)
      document.documentElement.style.setProperty('--tokyo-cyan', '#7dcfff')
    }, 5000)
  })
  
  if (!konamiActivated) return null
  
  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <h1 className="text-6xl font-bold text-tokyo-magenta animate-bounce">
          🎉 KONAMI CODE ACTIVATED! 🎉
        </h1>
      </div>
    </div>
  )
}
```

---

## Secret Commands

### Command System

```typescript
// src/presentation/hooks/useEasterEggs.ts
export function useSecretCommands() {
  const [command, setCommand] = useState('')
  
  const commands: Record<string, () => void> = {
    'developer': () => {
      console.log('%c👨‍💻 Developer Mode Activated!', 'color: #7dcfff; font-size: 20px; font-weight: bold;')
      console.log('%cWelcome fellow developer! 🚀', 'color: #9ece6a; font-size: 14px;')
      console.log('%cStack: React + TypeScript + Firebase', 'color: #bb9af7')
      console.log('%cFeel free to explore the code!', 'color: #7dcfff')
    },
    
    'matrix': () => {
      // Matrix rain effect
      triggerMatrixEffect()
    },
    
    'rainbow': () => {
      // Rainbow theme
      triggerRainbowTheme()
    },
    
    'particles': () => {
      // Extra particles
      triggerExtraParticles()
    },
    
    'disco': () => {
      // Disco mode
      triggerDiscoMode()
    }
  }
  
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Build command from keypresses
      if (e.key === 'Enter') {
        if (commands[command.toLowerCase()]) {
          commands[command.toLowerCase()]()
          setCommand('')
        }
      } else if (e.key === 'Escape') {
        setCommand('')
      } else if (e.key.length === 1) {
        setCommand(prev => prev + e.key)
      }
    }
    
    window.addEventListener('keypress', handleKeyPress)
    return () => window.removeEventListener('keypress', handleKeyPress)
  }, [command])
  
  return command
}
```

### Matrix Effect

```typescript
function triggerMatrixEffect() {
  const canvas = document.createElement('canvas')
  canvas.style.position = 'fixed'
  canvas.style.top = '0'
  canvas.style.left = '0'
  canvas.style.width = '100%'
  canvas.style.height = '100%'
  canvas.style.zIndex = '9999'
  canvas.style.pointerEvents = 'none'
  
  document.body.appendChild(canvas)
  
  const ctx = canvas.getContext('2d')!
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  
  const columns = Math.floor(canvas.width / 20)
  const drops: number[] = Array(columns).fill(1)
  
  const matrix = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()'.split('')
  
  let frame = 0
  const animate = () => {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    
    ctx.fillStyle = '#0F0'
    ctx.font = '15px monospace'
    
    for (let i = 0; i < drops.length; i++) {
      const text = matrix[Math.floor(Math.random() * matrix.length)]
      ctx.fillText(text, i * 20, drops[i] * 20)
      
      if (drops[i] * 20 > canvas.height && Math.random() > 0.975) {
        drops[i] = 0
      }
      drops[i]++
    }
    
    frame++
    if (frame < 300) {
      requestAnimationFrame(animate)
    } else {
      document.body.removeChild(canvas)
    }
  }
  
  animate()
}
```

### Rainbow Theme

```typescript
function triggerRainbowTheme() {
  const colors = ['#ff0000', '#ff7f00', '#ffff00', '#00ff00', '#0000ff', '#4b0082', '#9400d3']
  let index = 0
  
  const interval = setInterval(() => {
    document.documentElement.style.setProperty('--tokyo-cyan', colors[index])
    index = (index + 1) % colors.length
  }, 500)
  
  setTimeout(() => {
    clearInterval(interval)
    document.documentElement.style.setProperty('--tokyo-cyan', '#7dcfff')
  }, 10000)
}
```

---

## Hidden Features

### Click Counter Easter Egg

```typescript
export function useClickCounter(targetClicks: number, callback: () => void) {
  const [clicks, setClicks] = useState(0)
  const timeoutRef = useRef<NodeJS.Timeout>()
  
  const handleClick = () => {
    setClicks(prev => {
      const newCount = prev + 1
      
      if (newCount === targetClicks) {
        callback()
        return 0
      }
      
      return newCount
    })
    
    // Reset after 2 seconds of inactivity
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    timeoutRef.current = setTimeout(() => {
      setClicks(0)
    }, 2000)
  }
  
  return handleClick
}

// Usage: Click logo 10 times
function Logo() {
  const handleClick = useClickCounter(10, () => {
    alert('🎊 You found the secret! 🎊')
  })
  
  return (
    <img
      src="/logo.svg"
      alt="Logo"
      onClick={handleClick}
      className="cursor-pointer"
    />
  )
}
```

### Time-Based Easter Eggs

```typescript
export function useTimeBasedEasterEgg() {
  const [isSpecialTime, setIsSpecialTime] = useState(false)
  
  useEffect(() => {
    const checkTime = () => {
      const hour = new Date().getHours()
      
      // Special message at midnight
      if (hour === 0) {
        setIsSpecialTime(true)
        setTimeout(() => setIsSpecialTime(false), 60000) // Show for 1 minute
      }
    }
    
    checkTime()
    const interval = setInterval(checkTime, 60000) // Check every minute
    
    return () => clearInterval(interval)
  }, [])
  
  if (!isSpecialTime) return null
  
  return (
    <div className="fixed top-20 right-4 bg-tokyo-night p-4 rounded-lg border border-tokyo-cyan">
      <p className="text-tokyo-cyan">
        🌙 It's midnight! Time for some late-night coding? ☕
      </p>
    </div>
  )
}
```

### Secret Developer Console

```typescript
// Add to window object for console access
declare global {
  interface Window {
    portfolio: {
      version: string
      author: string
      tech: string[]
      hint: () => void
      credits: () => void
    }
  }
}

// Initialize in main.tsx
window.portfolio = {
  version: '1.0.0',
  author: 'John Doe',
  tech: ['React', 'TypeScript', 'Firebase', 'Tailwind CSS'],
  
  hint: () => {
    console.log('%c💡 Hint: Try the Konami Code!', 'color: #7dcfff; font-size: 16px;')
    console.log('%c↑ ↑ ↓ ↓ ← → ← → B A', 'color: #9ece6a; font-size: 14px;')
  },
  
  credits: () => {
    console.log('%c🎨 Portfolio Credits', 'color: #7dcfff; font-size: 20px; font-weight: bold;')
    console.log('%c─────────────────────', 'color: #565f89')
    console.log('%cDesign: Tokyo Night Theme', 'color: #bb9af7')
    console.log('%cAnimations: Framer Motion + GSAP', 'color: #bb9af7')
    console.log('%cParticles: Custom Canvas', 'color: #bb9af7')
    console.log('%cIcons: Lucide React', 'color: #bb9af7')
    console.log('%c─────────────────────', 'color: #565f89')
    console.log('%cBuilt with ❤️ and ☕', 'color: #f7768e')
  }
}

console.log('%c👋 Welcome to my portfolio!', 'color: #7dcfff; font-size: 24px; font-weight: bold;')
console.log('%cType window.portfolio.hint() for a secret', 'color: #9ece6a; font-size: 14px;')
```

---

## Implementation Guide

### Complete useEasterEggs Hook

```typescript
// src/presentation/hooks/useEasterEggs.ts
import { useEffect, useState, useRef } from 'react'

export function useEasterEggs() {
  const [konamiActivated, setKonamiActivated] = useState(false)
  const [secretCommand, setSecretCommand] = useState('')
  const keysRef = useRef<string[]>([])
  
  const konamiCode = [
    'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
    'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
    'KeyB', 'KeyA'
  ]
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check Konami Code
      keysRef.current = [...keysRef.current, e.code].slice(-10)
      
      if (JSON.stringify(keysRef.current) === JSON.stringify(konamiCode)) {
        setKonamiActivated(true)
        keysRef.current = []
        
        // Trigger confetti
        if (typeof confetti !== 'undefined') {
          confetti({
            particleCount: 200,
            spread: 70,
            origin: { y: 0.6 }
          })
        }
        
        // Reset after 5 seconds
        setTimeout(() => setKonamiActivated(false), 5000)
      }
    }
    
    const handleKeyPress = (e: KeyboardEvent) => {
      // Build secret command
      if (e.key === 'Enter') {
        handleSecretCommand(secretCommand.toLowerCase())
        setSecretCommand('')
      } else if (e.key === 'Escape') {
        setSecretCommand('')
      } else if (e.key.length === 1) {
        setSecretCommand(prev => prev + e.key)
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keypress', handleKeyPress)
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keypress', handleKeyPress)
    }
  }, [secretCommand])
  
  return {
    konamiActivated,
    secretCommand
  }
}

function handleSecretCommand(command: string) {
  const commands: Record<string, () => void> = {
    developer: () => console.log('👨‍💻 Developer mode!'),
    matrix: () => console.log('🟢 Matrix activated!'),
    rainbow: () => console.log('🌈 Rainbow mode!'),
  }
  
  if (commands[command]) {
    commands[command]()
  }
}
```

---

**Next**: [27-TROUBLESHOOTING.md](./27-TROUBLESHOOTING.md) - Troubleshooting common issues
