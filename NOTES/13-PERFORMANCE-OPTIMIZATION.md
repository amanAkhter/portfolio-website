# Performance Optimization in React

> Learn to build fast, efficient React applications with TypeScript

## 📚 Table of Contents
1. [Performance Fundamentals](#performance-fundamentals)
2. [Memoization](#memoization)
3. [Code Splitting](#code-splitting)
4. [Virtual Lists](#virtual-lists)
5. [Image Optimization](#image-optimization)
6. [Bundle Analysis](#bundle-analysis)
7. [Real Portfolio Examples](#real-portfolio-examples)

---

## ⚡ Performance Fundamentals

### What Causes Re-renders?

```typescript
// Component re-renders when:
// 1. State changes
// 2. Props change
// 3. Parent re-renders
// 4. Context value changes

const Parent = () => {
  const [count, setCount] = useState(0)
  
  return (
    <div>
      <button onClick={() => setCount(count + 1)}>Count: {count}</button>
      
      {/* Child re-renders every time Parent re-renders! */}
      <ExpensiveChild />
    </div>
  )
}
```

### Measuring Performance

```typescript
import { Profiler, ProfilerOnRenderCallback } from 'react'

const onRender: ProfilerOnRenderCallback = (
  id,
  phase,
  actualDuration,
  baseDuration,
  startTime,
  commitTime
) => {
  console.log(`${id} took ${actualDuration}ms to render`)
}

<Profiler id="MyComponent" onRender={onRender}>
  <MyComponent />
</Profiler>
```

---

## 🧠 Memoization

### React.memo - Prevent Unnecessary Re-renders

```typescript
interface UserCardProps {
  user: User
  onClick: (id: string) => void
}

// ❌ Re-renders every time parent re-renders
const UserCard: React.FC<UserCardProps> = ({ user, onClick }) => {
  console.log('UserCard rendered')
  return (
    <div onClick={() => onClick(user.id)}>
      <h3>{user.name}</h3>
      <p>{user.email}</p>
    </div>
  )
}

// ✅ Only re-renders when props actually change
const UserCard = React.memo<UserCardProps>(({ user, onClick }) => {
  console.log('UserCard rendered')
  return (
    <div onClick={() => onClick(user.id)}>
      <h3>{user.name}</h3>
      <p>{user.email}</p>
    </div>
  )
})

// ✅ Custom comparison function
const UserCard = React.memo<UserCardProps>(
  ({ user, onClick }) => {
    return (
      <div onClick={() => onClick(user.id)}>
        <h3>{user.name}</h3>
      </div>
    )
  },
  (prevProps, nextProps) => {
    // Return true if props are equal (skip re-render)
    return prevProps.user.id === nextProps.user.id &&
           prevProps.user.name === nextProps.user.name
  }
)
```

### useMemo - Memoize Expensive Calculations

```typescript
import { useMemo } from 'react'

const ExpensiveComponent = ({ items }: { items: Item[] }) => {
  // ❌ Recalculates every render
  const sortedItems = items
    .sort((a, b) => b.price - a.price)
    .slice(0, 10)
  
  // ✅ Only recalculates when items change
  const sortedItems = useMemo(() => {
    console.log('Sorting items...')
    return items
      .sort((a, b) => b.price - a.price)
      .slice(0, 10)
  }, [items])
  
  return (
    <div>
      {sortedItems.map(item => (
        <ItemCard key={item.id} item={item} />
      ))}
    </div>
  )
}

// Real example: Filter and sort
const ProductList = ({ products, searchTerm, sortBy }: Props) => {
  const filteredAndSorted = useMemo(() => {
    let filtered = products.filter(p => 
      p.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    
    if (sortBy === 'price') {
      filtered = filtered.sort((a, b) => a.price - b.price)
    } else if (sortBy === 'name') {
      filtered = filtered.sort((a, b) => a.name.localeCompare(b.name))
    }
    
    return filtered
  }, [products, searchTerm, sortBy])
  
  return (
    <div>
      {filteredAndSorted.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
```

### useCallback - Memoize Functions

```typescript
import { useCallback } from 'react'

const Parent = () => {
  const [count, setCount] = useState(0)
  const [items, setItems] = useState<Item[]>([])
  
  // ❌ New function created on every render
  const handleClick = (id: string) => {
    console.log('Clicked:', id)
  }
  
  // ✅ Same function reference unless dependencies change
  const handleClick = useCallback((id: string) => {
    console.log('Clicked:', id)
  }, []) // Empty deps = never changes
  
  // With dependencies
  const handleAdd = useCallback((item: Item) => {
    setItems(prev => [...prev, item])
  }, []) // setItems is stable, no need to include
  
  return (
    <div>
      <button onClick={() => setCount(count + 1)}>Count: {count}</button>
      
      {/* Child won't re-render when count changes */}
      <MemoizedChild onClick={handleClick} />
    </div>
  )
}

const MemoizedChild = React.memo<{ onClick: (id: string) => void }>(
  ({ onClick }) => {
    console.log('Child rendered')
    return <button onClick={() => onClick('123')}>Click Me</button>
  }
)
```

---

## 📦 Code Splitting

### React.lazy and Suspense

**Real Example from Portfolio:**

```typescript
// src/App.tsx
import React from 'react'
import { LoadingScreen } from './presentation/components/ui'

// ❌ All pages loaded immediately
import PortfolioPage from './presentation/pages/PortfolioPage'
import AdminPage from './presentation/pages/AdminPage'
import AdminLogin from './presentation/pages/AdminLogin'

// ✅ Pages loaded on demand
const PortfolioPage = React.lazy(() => import('./presentation/pages/PortfolioPage'))
const AdminPage = React.lazy(() => import('./presentation/pages/AdminPage'))
const AdminLogin = React.lazy(() => import('./presentation/pages/AdminLogin'))

function App() {
  return (
    <Router>
      <React.Suspense fallback={<LoadingScreen />}>
        <Routes>
          <Route path="/" element={<PortfolioPage />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/*" element={<AdminPage />} />
        </Routes>
      </React.Suspense>
    </Router>
  )
}
```

### Dynamic Imports

```typescript
// Load component based on condition
const DynamicComponent = () => {
  const [Component, setComponent] = useState<React.ComponentType | null>(null)
  
  useEffect(() => {
    if (condition) {
      import('./HeavyComponent').then(module => {
        setComponent(() => module.default)
      })
    }
  }, [condition])
  
  if (!Component) return <div>Loading...</div>
  
  return <Component />
}

// Load library on demand
const handleExport = async () => {
  const XLSX = await import('xlsx')
  // Use XLSX only when needed
  const wb = XLSX.utils.book_new()
  // ...
}
```

---

## 📜 Virtual Lists

For long lists, only render visible items:

```typescript
// Using react-window
import { FixedSizeList } from 'react-window'

interface RowProps {
  index: number
  style: React.CSSProperties
  data: User[]
}

const Row: React.FC<RowProps> = ({ index, style, data }) => {
  const user = data[index]
  
  return (
    <div style={style}>
      <h3>{user.name}</h3>
      <p>{user.email}</p>
    </div>
  )
}

const VirtualUserList = ({ users }: { users: User[] }) => {
  return (
    <FixedSizeList
      height={600}
      itemCount={users.length}
      itemSize={80}
      width="100%"
      itemData={users}
    >
      {Row}
    </FixedSizeList>
  )
}

// Before: Renders 10,000 items → Slow!
// After: Renders only ~10 visible items → Fast!
```

---

## 🖼️ Image Optimization

### Lazy Loading Images

```typescript
const LazyImage: React.FC<{
  src: string
  alt: string
  className?: string
}> = ({ src, alt, className }) => {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isInView, setIsInView] = useState(false)
  const imgRef = useRef<HTMLImageElement>(null)
  
  useEffect(() => {
    if (!imgRef.current) return
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.disconnect()
        }
      },
      { rootMargin: '100px' }
    )
    
    observer.observe(imgRef.current)
    
    return () => observer.disconnect()
  }, [])
  
  return (
    <div ref={imgRef} className={className}>
      {!isLoaded && <div className="skeleton" />}
      
      {isInView && (
        <img
          src={src}
          alt={alt}
          onLoad={() => setIsLoaded(true)}
          style={{ display: isLoaded ? 'block' : 'none' }}
        />
      )}
    </div>
  )
}

// Or use native lazy loading
<img src={src} alt={alt} loading="lazy" />
```

### Progressive Image Loading

```typescript
const ProgressiveImage: React.FC<{
  src: string
  placeholder: string
  alt: string
}> = ({ src, placeholder, alt }) => {
  const [currentSrc, setCurrentSrc] = useState(placeholder)
  const [isLoading, setIsLoading] = useState(true)
  
  useEffect(() => {
    const img = new Image()
    img.src = src
    
    img.onload = () => {
      setCurrentSrc(src)
      setIsLoading(false)
    }
  }, [src])
  
  return (
    <img
      src={currentSrc}
      alt={alt}
      style={{
        filter: isLoading ? 'blur(10px)' : 'none',
        transition: 'filter 0.3s',
      }}
    />
  )
}
```

---

## 📊 Bundle Analysis

### Analyze Your Bundle

```bash
# Install analyzer
pnpm add -D vite-plugin-bundle-visualizer

# Add to vite.config.ts
import { visualizer } from 'vite-plugin-bundle-visualizer'

export default defineConfig({
  plugins: [
    react(),
    visualizer({
      open: true,
      gzipSize: true,
      brotliSize: true,
    }),
  ],
})

# Build and analyze
pnpm run build
```

### Tree Shaking

```typescript
// ❌ Imports entire library
import _ from 'lodash'
const result = _.debounce(fn, 300)

// ✅ Only imports what you need
import debounce from 'lodash/debounce'
const result = debounce(fn, 300)

// ❌ Imports entire icon library
import * as Icons from 'lucide-react'
const Icon = Icons['Check']

// ✅ Direct import
import { Check } from 'lucide-react'
```

---

## 🎯 Real Portfolio Examples

### Optimized Project List

```typescript
interface ProjectCardProps {
  project: Project
  onEdit: (id: string) => void
}

// Memoized card component
const ProjectCard = React.memo<ProjectCardProps>(
  ({ project, onEdit }) => {
    return (
      <Card>
        <img src={project.coverImage} alt={project.name} loading="lazy" />
        <h3>{project.name}</h3>
        <p>{project.shortDescription}</p>
        <button onClick={() => onEdit(project.id)}>Edit</button>
      </Card>
    )
  },
  (prev, next) => {
    // Only re-render if project data actually changed
    return prev.project.id === next.project.id &&
           prev.project.name === next.project.name &&
           prev.project.coverImage === next.project.coverImage
  }
)

const ProjectList = ({ projects }: { projects: Project[] }) => {
  const [searchTerm, setSearchTerm] = useState('')
  
  // Memoize expensive filtering
  const filteredProjects = useMemo(() => {
    return projects.filter(p =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [projects, searchTerm])
  
  // Memoize callback
  const handleEdit = useCallback((id: string) => {
    console.log('Edit project:', id)
  }, [])
  
  return (
    <div>
      <input
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search projects..."
      />
      
      <div className="project-grid">
        {filteredProjects.map(project => (
          <ProjectCard
            key={project.id}
            project={project}
            onEdit={handleEdit}
          />
        ))}
      </div>
    </div>
  )
}
```

### Optimized Modal

```typescript
// Only render modal content when open
const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    }
    
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])
  
  // Don't render anything if closed
  if (!isOpen) return null
  
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  )
}
```

---

## ✅ Performance Checklist

### General
- [ ] Use React.memo for expensive components
- [ ] Implement useMemo for expensive calculations
- [ ] Use useCallback for memoized callbacks
- [ ] Avoid inline object/array creation in props
- [ ] Use proper keys in lists

### Code Splitting
- [ ] Lazy load routes
- [ ] Lazy load heavy components
- [ ] Dynamic imports for large libraries
- [ ] Analyze bundle size

### Images
- [ ] Use lazy loading
- [ ] Optimize image sizes
- [ ] Use modern formats (WebP, AVIF)
- [ ] Progressive loading for large images

### Lists
- [ ] Virtual scrolling for long lists
- [ ] Pagination for large datasets
- [ ] Debounce search inputs

### Network
- [ ] Cache API responses
- [ ] Implement request deduplication
- [ ] Use SWR or React Query
- [ ] Optimize API payload size

---

## 🚫 Anti-Patterns

```typescript
// ❌ Inline object creation (new reference every render)
<Component style={{ margin: 10 }} />

// ✅ Define outside or use memo
const style = { margin: 10 }
<Component style={style} />

// ❌ Inline arrow function
<button onClick={() => handleClick()}>Click</button>

// ✅ Use useCallback or pass direct reference
<button onClick={handleClick}>Click</button>

// ❌ Unnecessary state
const [fullName, setFullName] = useState('')
useEffect(() => {
  setFullName(`${firstName} ${lastName}`)
}, [firstName, lastName])

// ✅ Derived value (no state needed)
const fullName = `${firstName} ${lastName}`

// ❌ Large dependency array
useEffect(() => {
  // ...
}, [a, b, c, d, e, f, g, h, i, j]) // Too many deps!

// ✅ Break into smaller effects
useEffect(() => { /* logic for a, b */ }, [a, b])
useEffect(() => { /* logic for c, d */ }, [c, d])
```

---

## 🎓 Practice Exercises

1. Optimize a list of 10,000 items with virtual scrolling
2. Implement lazy loading for images
3. Analyze and reduce your bundle size by 50%
4. Create a memoized data table with sorting and filtering
5. Build a search with debouncing and caching

---

## 📚 Tools & Resources

- **React DevTools Profiler** - Measure component performance
- **Lighthouse** - Audit web app performance
- **Bundle Analyzer** - Visualize bundle size
- **React Query** - Smart data fetching & caching
- **react-window** - Virtual list rendering

---

**Next:** [Testing with TypeScript →](./41-UNIT-TESTING.md)
