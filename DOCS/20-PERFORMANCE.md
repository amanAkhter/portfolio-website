# Performance Optimization Documentation

## 📖 Table of Contents
1. [Overview](#overview)
2. [Code Splitting](#code-splitting)
3. [Lazy Loading](#lazy-loading)
4. [Bundle Analysis](#bundle-analysis)
5. [Image Optimization](#image-optimization)
6. [Caching Strategies](#caching-strategies)
7. [Performance Monitoring](#performance-monitoring)

---

## Overview

Performance optimization ensures fast load times, smooth interactions, and excellent user experience.

### Performance Targets
- ✅ First Contentful Paint (FCP) < 1.8s
- ✅ Largest Contentful Paint (LCP) < 2.5s
- ✅ Time to Interactive (TTI) < 3.8s
- ✅ Cumulative Layout Shift (CLS) < 0.1
- ✅ First Input Delay (FID) < 100ms

---

## Code Splitting

### Route-Based Splitting

```typescript
import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import Loading from './components/ui/Loading'

// Lazy load pages
const PortfolioPage = lazy(() => import('./pages/PortfolioPage'))
const AdminLogin = lazy(() => import('./pages/AdminLogin'))
const AdminPage = lazy(() => import('./pages/AdminPage'))

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/" element={<PortfolioPage />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </Suspense>
  )
}

export default App
```

### Component-Based Splitting

```typescript
import { lazy, Suspense } from 'react'

// Heavy components loaded on demand
const ProjectModal = lazy(() => import('./components/ProjectModal'))
const CertificationModal = lazy(() => import('./components/CertificationModal'))
const ContactForm = lazy(() => import('./components/ContactForm'))

export default function Projects() {
  const [showModal, setShowModal] = useState(false)
  
  return (
    <>
      <button onClick={() => setShowModal(true)}>
        View Details
      </button>
      
      {showModal && (
        <Suspense fallback={<Loading />}>
          <ProjectModal onClose={() => setShowModal(false)} />
        </Suspense>
      )}
    </>
  )
}
```

### Dynamic Imports

```typescript
// Load library only when needed
async function processData() {
  const { default: heavyLibrary } = await import('heavy-library')
  return heavyLibrary.process(data)
}

// Load animation library on interaction
const loadAnimations = async () => {
  const { gsap } = await import('gsap')
  gsap.to('.element', { opacity: 1 })
}
```

---

## Lazy Loading

### Images

```typescript
export default function LazyImage({ 
  src, 
  alt, 
  ...props 
}: React.ImgHTMLAttributes<HTMLImageElement>) {
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      {...props}
    />
  )
}
```

### Intersection Observer for Custom Lazy Loading

```typescript
import { useEffect, useRef, useState } from 'react'

export function useLazyLoad() {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )
    
    if (ref.current) {
      observer.observe(ref.current)
    }
    
    return () => observer.disconnect()
  }, [])
  
  return { ref, isVisible }
}

// Usage
function LazySection() {
  const { ref, isVisible } = useLazyLoad()
  
  return (
    <div ref={ref}>
      {isVisible ? (
        <ExpensiveComponent />
      ) : (
        <div className="h-64 bg-tokyo-selection animate-pulse" />
      )}
    </div>
  )
}
```

---

## Bundle Analysis

### Vite Bundle Analyzer

```bash
pnpm add -D rollup-plugin-visualizer
```

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig({
  plugins: [
    visualizer({
      open: true,
      gzipSize: true,
      brotliSize: true
    })
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['react', 'react-dom', 'react-router-dom'],
          'firebase': ['firebase/app', 'firebase/firestore', 'firebase/auth'],
          'animations': ['framer-motion', 'gsap']
        }
      }
    }
  }
})
```

### Analyzing Bundle

```bash
# Build and analyze
pnpm build

# Opens stats.html in browser showing:
# - Bundle size breakdown
# - Largest modules
# - Duplicate dependencies
```

---

## Image Optimization

### WebP Format

```typescript
export default function OptimizedImage({ 
  src, 
  alt 
}: { src: string; alt: string }) {
  return (
    <picture>
      <source srcSet={`${src}.webp`} type="image/webp" />
      <source srcSet={`${src}.jpg`} type="image/jpeg" />
      <img
        src={`${src}.jpg`}
        alt={alt}
        loading="lazy"
        decoding="async"
      />
    </picture>
  )
}
```

### Responsive Images

```typescript
export default function ResponsiveImage() {
  return (
    <img
      src="/image-1280.jpg"
      srcSet="
        /image-320.jpg 320w,
        /image-640.jpg 640w,
        /image-1280.jpg 1280w,
        /image-2560.jpg 2560w
      "
      sizes="
        (max-width: 640px) 100vw,
        (max-width: 1024px) 50vw,
        33vw
      "
      alt="Description"
      loading="lazy"
    />
  )
}
```

### Image Compression

```bash
# Install sharp for image optimization
pnpm add -D sharp

# Create optimization script
node scripts/optimize-images.js
```

```javascript
// scripts/optimize-images.js
import sharp from 'sharp'
import { readdirSync, existsSync, mkdirSync } from 'fs'
import { join } from 'path'

const inputDir = './public/images'
const outputDir = './public/images/optimized'

if (!existsSync(outputDir)) {
  mkdirSync(outputDir, { recursive: true })
}

const files = readdirSync(inputDir)

for (const file of files) {
  const inputPath = join(inputDir, file)
  const outputPath = join(outputDir, file)
  
  // Convert to WebP with quality 80
  await sharp(inputPath)
    .webp({ quality: 80 })
    .toFile(outputPath.replace(/\.(jpg|png)$/, '.webp'))
  
  // Also create optimized JPEG/PNG
  await sharp(inputPath)
    .jpeg({ quality: 85, progressive: true })
    .toFile(outputPath)
  
  console.log(`Optimized: ${file}`)
}
```

---

## Caching Strategies

### Service Worker Setup

```typescript
// vite.config.ts
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webp}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/firestore\.googleapis\.com\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'firebase-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 // 24 hours
              }
            }
          },
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
              }
            }
          }
        ]
      }
    })
  ]
})
```

### Firebase Persistence

```typescript
// src/infrastructure/firebase/config.ts
import { initializeFirestore, persistentLocalCache } from 'firebase/firestore'

const db = initializeFirestore(app, {
  localCache: persistentLocalCache()
})
```

### React Query Caching

```typescript
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      refetchOnWindowFocus: false,
      retry: 1
    }
  }
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      {/* app */}
    </QueryClientProvider>
  )
}
```

---

## React Optimization

### Memoization

```typescript
import { memo, useMemo, useCallback } from 'react'

// Memoize component
const ProjectCard = memo(({ project }: { project: Project }) => {
  return <div>{project.title}</div>
})

// Memoize expensive calculation
function Component({ items }: { items: Item[] }) {
  const sortedItems = useMemo(() => {
    return items.sort((a, b) => a.priority - b.priority)
  }, [items])
  
  return <div>{sortedItems.map(renderItem)}</div>
}

// Memoize callback
function Parent() {
  const handleClick = useCallback(() => {
    console.log('clicked')
  }, [])
  
  return <Child onClick={handleClick} />
}
```

### Virtual Scrolling

```typescript
import { FixedSizeList } from 'react-window'

function VirtualList({ items }: { items: any[] }) {
  const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => (
    <div style={style}>
      {items[index].name}
    </div>
  )
  
  return (
    <FixedSizeList
      height={600}
      itemCount={items.length}
      itemSize={80}
      width="100%"
    >
      {Row}
    </FixedSizeList>
  )
}
```

---

## Performance Monitoring

### Web Vitals

```typescript
import { onCLS, onFID, onFCP, onLCP, onTTFB } from 'web-vitals'

function sendToAnalytics(metric: any) {
  console.log(metric)
  // Send to analytics service
}

onCLS(sendToAnalytics)
onFID(sendToAnalytics)
onFCP(sendToAnalytics)
onLCP(sendToAnalytics)
onTTFB(sendToAnalytics)
```

### Performance Observer

```typescript
useEffect(() => {
  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      console.log(`${entry.name}: ${entry.duration}ms`)
    }
  })
  
  observer.observe({ 
    entryTypes: ['measure', 'navigation', 'resource'] 
  })
  
  return () => observer.disconnect()
}, [])
```

### Custom Performance Markers

```typescript
// Mark start of operation
performance.mark('data-fetch-start')

// Perform operation
await fetchData()

// Mark end
performance.mark('data-fetch-end')

// Measure duration
performance.measure(
  'data-fetch',
  'data-fetch-start',
  'data-fetch-end'
)

// Get measurement
const measure = performance.getEntriesByName('data-fetch')[0]
console.log(`Fetch took ${measure.duration}ms`)
```

---

## Lighthouse Optimization

### Checklist

- [ ] Minimize main thread work
- [ ] Reduce JavaScript execution time
- [ ] Avoid enormous network payloads
- [ ] Serve static assets with efficient cache policy
- [ ] Avoid multiple page redirects
- [ ] Preconnect to required origins
- [ ] Preload key requests
- [ ] Use HTTP/2
- [ ] Efficiently encode images
- [ ] Enable text compression
- [ ] Minify CSS/JS

### Running Lighthouse

```bash
# Install Lighthouse CLI
npm install -g lighthouse

# Run audit
lighthouse https://yoursite.com --view

# CI integration
lighthouse https://yoursite.com --output=json --output-path=./report.json
```

---

**Next**: [21-TESTING.md](./21-TESTING.md) - Testing strategies
