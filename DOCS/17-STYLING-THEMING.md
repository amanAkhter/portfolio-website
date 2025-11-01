# Styling & Theming Documentation

## 📖 Table of Contents
1. [Overview](#overview)
2. [Tokyo Night Theme](#tokyo-night-theme)
3. [Tailwind Configuration](#tailwind-configuration)
4. [Color System](#color-system)
5. [Typography](#typography)
6. [Responsive Design](#responsive-design)
7. [Best Practices](#best-practices)

---

## Overview

The portfolio uses a custom Tokyo Night color scheme with Tailwind CSS for styling. All colors, spacing, and design tokens are configured in `tailwind.config.js`.

---

## Tokyo Night Theme

### Color Palette

The Tokyo Night theme features a dark, cyberpunk-inspired color scheme:

```typescript
// Primary Colors
bg: '#1a1b26'        // Background
night: '#16161e'     // Darker background
fg: '#a9b1d6'        // Foreground text

// Accent Colors
cyan: '#7aa2f7'      // Primary accent
blue: '#2ac3de'      // Secondary accent
purple: '#bb9af7'    // Tertiary accent
magenta: '#c678dd'   // Quaternary accent

// Semantic Colors
green: '#9ece6a'     // Success
yellow: '#e0af68'    // Warning
red: '#f7768e'       // Error/Danger
orange: '#ff9e64'    // Info

// UI Colors
comment: '#565f89'   // Muted text
selection: '#33467c' // Selection background
```

---

## Tailwind Configuration

**File**: `tailwind.config.js`

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Tokyo Night color scheme
        tokyo: {
          bg: '#1a1b26',
          night: '#16161e',
          fg: '#a9b1d6',
          cyan: '#7aa2f7',
          blue: '#2ac3de',
          purple: '#bb9af7',
          magenta: '#c678dd',
          green: '#9ece6a',
          yellow: '#e0af68',
          red: '#f7768e',
          orange: '#ff9e64',
          comment: '#565f89',
          selection: '#33467c',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.5s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'spin-slow': 'spin 3s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      boxShadow: {
        'tokyo-glow': '0 0 20px rgba(122, 162, 247, 0.3)',
        'tokyo-glow-lg': '0 0 40px rgba(122, 162, 247, 0.4)',
      },
    },
  },
  plugins: [],
}
```

---

## Color System

### Usage Examples

```tsx
// Backgrounds
<div className="bg-tokyo-bg">Main background</div>
<div className="bg-tokyo-night">Card background</div>

// Text Colors
<h1 className="text-tokyo-fg">Primary text</h1>
<p className="text-tokyo-comment">Muted text</p>
<span className="text-tokyo-cyan">Accent text</span>

// Borders
<div className="border border-tokyo-comment">Card</div>
<div className="border-2 border-tokyo-cyan">Highlighted</div>

// Hover States
<button className="hover:bg-tokyo-cyan hover:text-tokyo-bg">
  Button
</button>

// Gradients
<div className="bg-gradient-to-r from-tokyo-cyan to-tokyo-purple">
  Gradient background
</div>
```

### Color Combinations

**Primary Actions**:
```tsx
<Button className="bg-tokyo-cyan text-tokyo-bg hover:bg-tokyo-blue">
  Primary Action
</Button>
```

**Secondary Actions**:
```tsx
<Button className="border-2 border-tokyo-cyan text-tokyo-cyan hover:bg-tokyo-cyan hover:text-tokyo-bg">
  Secondary Action
</Button>
```

**Success States**:
```tsx
<Alert className="bg-tokyo-green/10 border-tokyo-green text-tokyo-green">
  Success message
</Alert>
```

**Error States**:
```tsx
<Alert className="bg-tokyo-red/10 border-tokyo-red text-tokyo-red">
  Error message
</Alert>
```

---

## Typography

### Font Families

```tsx
// Sans-serif (default)
<p className="font-sans">Regular text</p>

// Monospace (code, technical)
<code className="font-mono">const example = true</code>
```

### Font Sizes

```tsx
<h1 className="text-5xl md:text-7xl">Hero Heading</h1>
<h2 className="text-4xl">Section Heading</h2>
<h3 className="text-2xl">Subsection Heading</h3>
<p className="text-base">Body text</p>
<small className="text-sm">Small text</small>
```

### Font Weights

```tsx
<h1 className="font-bold">Bold heading</h1>
<p className="font-medium">Medium weight</p>
<p className="font-normal">Normal weight</p>
```

### Line Heights

```tsx
<h1 className="leading-tight">Tight heading</h1>
<p className="leading-relaxed">Comfortable paragraph</p>
```

---

## Responsive Design

### Breakpoints

```javascript
{
  'sm': '640px',   // Mobile landscape
  'md': '768px',   // Tablet
  'lg': '1024px',  // Desktop
  'xl': '1280px',  // Large desktop
  '2xl': '1536px'  // Extra large desktop
}
```

### Responsive Examples

```tsx
// Responsive Grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {items.map(item => <Card key={item.id} />)}
</div>

// Responsive Text
<h1 className="text-4xl md:text-5xl lg:text-7xl">
  Responsive Heading
</h1>

// Responsive Padding
<div className="p-4 md:p-6 lg:p-8">
  Content
</div>

// Responsive Layout
<div className="flex flex-col md:flex-row gap-4">
  <div className="w-full md:w-1/3">Sidebar</div>
  <div className="w-full md:w-2/3">Main</div>
</div>

// Hide on Mobile
<div className="hidden md:block">Desktop only</div>

// Show on Mobile Only
<div className="block md:hidden">Mobile only</div>
```

---

## Component Styling Patterns

### Card Pattern

```tsx
<div className="
  bg-tokyo-night 
  border border-tokyo-comment 
  rounded-lg 
  shadow-xl 
  hover:border-tokyo-cyan 
  hover:shadow-tokyo-glow 
  transition-all 
  duration-300
  p-6
">
  <h3 className="text-xl font-bold text-tokyo-fg mb-2">Title</h3>
  <p className="text-tokyo-comment">Description</p>
</div>
```

### Button Pattern

```tsx
<button className="
  inline-flex 
  items-center 
  justify-center 
  gap-2
  px-6 
  py-3 
  bg-tokyo-cyan 
  text-tokyo-bg 
  font-medium 
  rounded-lg 
  shadow-lg 
  shadow-tokyo-cyan/20
  hover:bg-tokyo-blue 
  hover:shadow-tokyo-glow
  focus:outline-none 
  focus:ring-2 
  focus:ring-tokyo-cyan 
  focus:ring-offset-2 
  focus:ring-offset-tokyo-bg
  transition-all
  disabled:opacity-50 
  disabled:cursor-not-allowed
">
  Click Me
</button>
```

### Input Pattern

```tsx
<input className="
  w-full 
  px-4 
  py-2 
  bg-tokyo-bg 
  border border-tokyo-comment 
  rounded-lg
  text-tokyo-fg 
  placeholder-tokyo-comment
  focus:outline-none 
  focus:ring-2 
  focus:ring-tokyo-cyan 
  focus:border-transparent
  disabled:opacity-50 
  disabled:cursor-not-allowed
" />
```

### Badge Pattern

```tsx
<span className="
  inline-flex 
  items-center 
  justify-center 
  px-3 
  py-1 
  text-sm 
  font-medium 
  rounded-full
  bg-tokyo-cyan/10 
  text-tokyo-cyan 
  border border-tokyo-cyan/20
">
  Badge
</span>
```

---

## Animations

### CSS Animations

```tsx
// Fade in
<div className="animate-fade-in">Fades in</div>

// Slide up
<div className="animate-slide-up">Slides up</div>

// Scale in
<div className="animate-scale-in">Scales in</div>

// Spin
<div className="animate-spin">Spins</div>
<div className="animate-spin-slow">Spins slowly</div>

// Pulse
<div className="animate-pulse">Pulses</div>

// Bounce
<div className="animate-bounce">Bounces</div>
```

### Framer Motion Animations

```tsx
import { motion } from 'framer-motion'

// Fade and slide
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
>
  Content
</motion.div>

// Hover scale
<motion.div
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
>
  Interactive element
</motion.div>

// Stagger children
<motion.div
  initial="hidden"
  animate="visible"
  variants={{
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }}
>
  {items.map(item => (
    <motion.div
      key={item.id}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
      }}
    >
      {item.content}
    </motion.div>
  ))}
</motion.div>
```

---

## Best Practices

### 1. Consistent Spacing

```tsx
// Use Tailwind spacing scale
<div className="p-4">    {/* 16px */}
<div className="p-6">    {/* 24px */}
<div className="p-8">    {/* 32px */}

<div className="gap-4">  {/* 16px gap */}
<div className="gap-6">  {/* 24px gap */}

<div className="mb-4">   {/* 16px margin bottom */}
<div className="mb-8">   {/* 32px margin bottom */}
```

### 2. Color Contrast

```tsx
// ✅ GOOD: High contrast
<div className="bg-tokyo-night text-tokyo-fg">
  Readable text
</div>

// ❌ BAD: Low contrast
<div className="bg-tokyo-night text-tokyo-comment">
  Hard to read
</div>
```

### 3. Hover States

```tsx
// ✅ GOOD: Smooth transitions
<button className="
  bg-tokyo-cyan 
  hover:bg-tokyo-blue 
  transition-colors 
  duration-200
">
  Button
</button>

// ❌ BAD: No transition
<button className="bg-tokyo-cyan hover:bg-tokyo-blue">
  Button
</button>
```

### 4. Focus States

```tsx
// ✅ GOOD: Visible focus
<button className="
  focus:outline-none 
  focus:ring-2 
  focus:ring-tokyo-cyan
">
  Accessible
</button>

// ❌ BAD: No focus indicator
<button className="focus:outline-none">
  Not accessible
</button>
```

---

**Next**: [18-ANIMATIONS.md](./18-ANIMATIONS.md) - Animation implementation guide
