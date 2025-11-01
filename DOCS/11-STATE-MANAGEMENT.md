# State Management Documentation

## 📖 Table of Contents
1. [Overview](#overview)
2. [Custom Hooks](#custom-hooks)
3. [Context API](#context-api)
4. [Local Component State](#local-component-state)
5. [Form State Management](#form-state-management)
6. [State Patterns](#state-patterns)
7. [Best Practices](#best-practices)

---

## Overview

The portfolio uses React hooks and custom hooks for state management. No external state management library (Redux, MobX, etc.) is required.

### State Management Strategy

- **Local State**: Component-specific data using `useState`
- **Custom Hooks**: Shared business logic and service access
- **Context API**: Global state like authentication
- **Service Layer**: Business logic and data fetching

---

## Custom Hooks

### usePortfolio Hook

**File**: `src/presentation/hooks/usePortfolio.ts`

Provides access to the PortfolioService singleton.

```typescript
import { useMemo } from 'react'
import { PortfolioService } from '../../core/usecases'
import { RepositoryFactory } from '../../infrastructure/repositories/FirebaseRepositories'

export function usePortfolio() {
  const portfolioService = useMemo(() => {
    const repos = RepositoryFactory.createAllRepositories()
    
    return new PortfolioService(
      repos.homeRepo,
      repos.aboutRepo,
      repos.projectRepo,
      repos.experienceRepo,
      repos.skillRepo,
      repos.certificationRepo,
      repos.educationRepo,
      repos.contactRepo
    )
  }, [])
  
  return { portfolioService }
}
```

**Usage**:
```typescript
const ProjectsList = () => {
  const { portfolioService } = usePortfolio()
  const [projects, setProjects] = useState<Project[]>([])
  
  useEffect(() => {
    portfolioService.getAllProjects()
      .then(setProjects)
      .catch(console.error)
  }, [portfolioService])
  
  return <div>{/* render projects */}</div>
}
```

---

### useAuth Hook

**File**: `src/presentation/hooks/useAuth.ts`

Manages authentication state and operations.

```typescript
import { useEffect, useState } from 'react'
import { User } from 'firebase/auth'
import { FirebaseAuthRepository } from '../../infrastructure/repositories/AuthRepository'

const authRepo = new FirebaseAuthRepository()

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Subscribe to auth state changes
  useEffect(() => {
    const unsubscribe = authRepo.onAuthChange((authUser) => {
      setUser(authUser)
      setLoading(false)
    })
    
    return () => unsubscribe()
  }, [])
  
  // Login function
  const login = async (email: string, password: string) => {
    try {
      setLoading(true)
      setError(null)
      const user = await authRepo.login(email, password)
      setUser(user)
      return user
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }
  
  // Logout function
  const logout = async () => {
    try {
      setLoading(true)
      await authRepo.logout()
      setUser(null)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Logout failed'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }
  
  return {
    user,
    loading,
    error,
    login,
    logout,
    isAuthenticated: !!user
  }
}
```

**Usage**:
```typescript
const LoginPage = () => {
  const { login, loading, error, isAuthenticated } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await login(email, password)
      // Redirect to admin page
    } catch (err) {
      // Error already set in hook
    }
  }
  
  if (isAuthenticated) {
    return <Navigate to="/admin" />
  }
  
  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="error">{error}</div>}
      <Input value={email} onChange={(e) => setEmail(e.target.value)} />
      <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <Button type="submit" disabled={loading}>Login</Button>
    </form>
  )
}
```

---

### useEasterEggs Hook

**File**: `src/presentation/hooks/useEasterEggs.ts`

Manages hidden easter egg features.

```typescript
import { useState, useEffect } from 'react'

interface EasterEggs {
  konami: boolean
  darkMode: boolean
  matrixMode: boolean
}

export function useEasterEggs() {
  const [easterEggs, setEasterEggs] = useState<EasterEggs>({
    konami: false,
    darkMode: false,
    matrixMode: false
  })
  
  useEffect(() => {
    const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a']
    let konamiIndex = 0
    
    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === konamiCode[konamiIndex]) {
        konamiIndex++
        if (konamiIndex === konamiCode.length) {
          setEasterEggs(prev => ({ ...prev, konami: true }))
          konamiIndex = 0
          
          // Reset after 5 seconds
          setTimeout(() => {
            setEasterEggs(prev => ({ ...prev, konami: false }))
          }, 5000)
        }
      } else {
        konamiIndex = 0
      }
    }
    
    window.addEventListener('keydown', handleKeydown)
    return () => window.removeEventListener('keydown', handleKeydown)
  }, [])
  
  const toggleEasterEgg = (key: keyof EasterEggs) => {
    setEasterEggs(prev => ({ ...prev, [key]: !prev[key] }))
  }
  
  return { easterEggs, toggleEasterEgg }
}
```

---

### Custom Data Fetching Hook

```typescript
import { useState, useEffect } from 'react'

interface UseDataResult<T> {
  data: T | null
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function useData<T>(
  fetchFn: () => Promise<T>,
  dependencies: any[] = []
): UseDataResult<T> {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      const result = await fetchFn()
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
    fetchData()
  }, dependencies)
  
  return {
    data,
    loading,
    error,
    refetch: fetchData
  }
}

// Usage
const ProjectsList = () => {
  const { portfolioService } = usePortfolio()
  const { data: projects, loading, error, refetch } = useData(
    () => portfolioService.getAllProjects(),
    []
  )
  
  if (loading) return <Loading />
  if (error) return <Error message={error} />
  
  return (
    <div>
      <Button onClick={refetch}>Refresh</Button>
      {projects?.map(project => <ProjectCard key={project.id} project={project} />)}
    </div>
  )
}
```

---

## Context API

### Auth Context

Create a context for authentication state that can be accessed anywhere in the app.

```typescript
// src/presentation/contexts/AuthContext.tsx
import { createContext, useContext, ReactNode } from 'react'
import { useAuth } from '../hooks/useAuth'
import type { User } from 'firebase/auth'

interface AuthContextType {
  user: User | null
  loading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<User>
  logout: () => Promise<void>
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const auth = useAuth()
  
  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuthContext() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuthContext must be used within AuthProvider')
  }
  return context
}

// Usage in App.tsx
function App() {
  return (
    <AuthProvider>
      <Router>
        {/* routes */}
      </Router>
    </AuthProvider>
  )
}

// Usage in components
function AdminPage() {
  const { user, logout } = useAuthContext()
  
  return (
    <div>
      <p>Welcome, {user?.email}</p>
      <Button onClick={logout}>Logout</Button>
    </div>
  )
}
```

---

## Local Component State

### Simple State

```typescript
const Component = () => {
  const [count, setCount] = useState(0)
  
  return (
    <div>
      <p>Count: {count}</p>
      <Button onClick={() => setCount(count + 1)}>Increment</Button>
    </div>
  )
}
```

### Object State

```typescript
interface FormData {
  name: string
  email: string
  message: string
}

const ContactForm = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    message: ''
  })
  
  const handleChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }
  
  return (
    <form>
      <Input
        value={formData.name}
        onChange={(e) => handleChange('name', e.target.value)}
      />
      <Input
        value={formData.email}
        onChange={(e) => handleChange('email', e.target.value)}
      />
      <Textarea
        value={formData.message}
        onChange={(e) => handleChange('message', e.target.value)}
      />
    </form>
  )
}
```

### Array State

```typescript
const TodoList = () => {
  const [todos, setTodos] = useState<string[]>([])
  
  const addTodo = (todo: string) => {
    setTodos(prev => [...prev, todo])
  }
  
  const removeTodo = (index: number) => {
    setTodos(prev => prev.filter((_, i) => i !== index))
  }
  
  const updateTodo = (index: number, newValue: string) => {
    setTodos(prev => prev.map((todo, i) => i === index ? newValue : todo))
  }
  
  return (
    <div>
      {todos.map((todo, index) => (
        <div key={index}>
          <span>{todo}</span>
          <Button onClick={() => removeTodo(index)}>Delete</Button>
        </div>
      ))}
    </div>
  )
}
```

---

## Form State Management

### Controlled Components

```typescript
const ProjectForm = () => {
  const [project, setProject] = useState<Partial<Project>>({
    title: '',
    description: '',
    technologies: [],
    featured: false
  })
  
  const [errors, setErrors] = useState<Record<string, string>>({})
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate
    const newErrors: Record<string, string> = {}
    if (!project.title) newErrors.title = 'Title is required'
    if (!project.description) newErrors.description = 'Description is required'
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    
    // Submit
    try {
      await portfolioService.createProject(project as Omit<Project, 'id'>)
      // Reset form
      setProject({})
      setErrors({})
    } catch (error) {
      console.error('Error creating project:', error)
    }
  }
  
  return (
    <form onSubmit={handleSubmit}>
      <Input
        label="Title"
        value={project.title || ''}
        onChange={(e) => setProject({ ...project, title: e.target.value })}
        error={errors.title}
      />
      
      <Textarea
        label="Description"
        value={project.description || ''}
        onChange={(e) => setProject({ ...project, description: e.target.value })}
        error={errors.description}
      />
      
      <label>
        <input
          type="checkbox"
          checked={project.featured || false}
          onChange={(e) => setProject({ ...project, featured: e.target.checked })}
        />
        Featured
      </label>
      
      <Button type="submit">Create Project</Button>
    </form>
  )
}
```

### Form with Validation Hook

```typescript
interface ValidationRules<T> {
  [key: string]: (value: any, data: T) => string | null
}

function useForm<T extends Record<string, any>>(
  initialData: T,
  validationRules: ValidationRules<T>
) {
  const [data, setData] = useState<T>(initialData)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  
  const handleChange = (field: keyof T, value: any) => {
    setData(prev => ({ ...prev, [field]: value }))
    
    // Validate on change if field was touched
    if (touched[field as string]) {
      validateField(field as string, value)
    }
  }
  
  const handleBlur = (field: keyof T) => {
    setTouched(prev => ({ ...prev, [field as string]: true }))
    validateField(field as string, data[field])
  }
  
  const validateField = (field: string, value: any) => {
    const rule = validationRules[field]
    if (rule) {
      const error = rule(value, data)
      setErrors(prev => ({ ...prev, [field]: error || '' }))
      return !error
    }
    return true
  }
  
  const validateAll = () => {
    const newErrors: Record<string, string> = {}
    let isValid = true
    
    Object.keys(validationRules).forEach(field => {
      const error = validationRules[field](data[field], data)
      if (error) {
        newErrors[field] = error
        isValid = false
      }
    })
    
    setErrors(newErrors)
    return isValid
  }
  
  const reset = () => {
    setData(initialData)
    setErrors({})
    setTouched({})
  }
  
  return {
    data,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateAll,
    reset
  }
}

// Usage
const ProjectForm = () => {
  const { data, errors, handleChange, handleBlur, validateAll, reset } = useForm(
    {
      title: '',
      description: '',
      technologies: [] as string[]
    },
    {
      title: (value) => !value ? 'Title is required' : value.length < 3 ? 'Title too short' : null,
      description: (value) => !value ? 'Description is required' : null,
      technologies: (value) => value.length === 0 ? 'At least one technology required' : null
    }
  )
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (validateAll()) {
      // Submit form
      await portfolioService.createProject(data)
      reset()
    }
  }
  
  return (
    <form onSubmit={handleSubmit}>
      <Input
        value={data.title}
        onChange={(e) => handleChange('title', e.target.value)}
        onBlur={() => handleBlur('title')}
        error={errors.title}
      />
      {/* Other fields */}
    </form>
  )
}
```

---

## State Patterns

### Derived State

```typescript
const ProjectsList = () => {
  const [projects, setProjects] = useState<Project[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  
  // Derived state - computed from other state
  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
      const matchesSearch = project.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
      
      const matchesCategory = selectedCategory === 'all' || 
        project.category === selectedCategory
      
      return matchesSearch && matchesCategory
    })
  }, [projects, searchTerm, selectedCategory])
  
  const projectCount = filteredProjects.length
  const featuredCount = filteredProjects.filter(p => p.featured).length
  
  return (
    <div>
      <p>{projectCount} projects ({featuredCount} featured)</p>
      {/* render filtered projects */}
    </div>
  )
}
```

### State Reducer Pattern

```typescript
type Action =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_DATA'; payload: Project[] }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'FILTER_BY_CATEGORY'; payload: string }
  | { type: 'SEARCH'; payload: string }

interface State {
  data: Project[]
  filteredData: Project[]
  loading: boolean
  error: string | null
  filters: {
    category: string
    searchTerm: string
  }
}

function projectsReducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload }
    
    case 'SET_DATA':
      return {
        ...state,
        data: action.payload,
        filteredData: applyFilters(action.payload, state.filters),
        loading: false
      }
    
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false }
    
    case 'FILTER_BY_CATEGORY':
      const newFilters = { ...state.filters, category: action.payload }
      return {
        ...state,
        filters: newFilters,
        filteredData: applyFilters(state.data, newFilters)
      }
    
    case 'SEARCH':
      const searchFilters = { ...state.filters, searchTerm: action.payload }
      return {
        ...state,
        filters: searchFilters,
        filteredData: applyFilters(state.data, searchFilters)
      }
    
    default:
      return state
  }
}

function applyFilters(data: Project[], filters: State['filters']) {
  return data.filter(project => {
    const matchesCategory = filters.category === 'all' || 
      project.category === filters.category
    
    const matchesSearch = project.title
      .toLowerCase()
      .includes(filters.searchTerm.toLowerCase())
    
    return matchesCategory && matchesSearch
  })
}

// Usage
const ProjectsList = () => {
  const [state, dispatch] = useReducer(projectsReducer, {
    data: [],
    filteredData: [],
    loading: true,
    error: null,
    filters: { category: 'all', searchTerm: '' }
  })
  
  useEffect(() => {
    loadProjects()
  }, [])
  
  const loadProjects = async () => {
    dispatch({ type: 'SET_LOADING', payload: true })
    try {
      const projects = await portfolioService.getAllProjects()
      dispatch({ type: 'SET_DATA', payload: projects })
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load projects' })
    }
  }
  
  return (
    <div>
      <input
        onChange={(e) => dispatch({ type: 'SEARCH', payload: e.target.value })}
      />
      <select
        onChange={(e) => dispatch({ type: 'FILTER_BY_CATEGORY', payload: e.target.value })}
      >
        <option value="all">All</option>
        {/* categories */}
      </select>
      {state.filteredData.map(project => <ProjectCard key={project.id} project={project} />)}
    </div>
  )
}
```

---

## Best Practices

### 1. Keep State Minimal

```typescript
// ❌ BAD: Storing derived state
const [projects, setProjects] = useState<Project[]>([])
const [projectCount, setProjectCount] = useState(0)
const [featuredCount, setFeaturedCount] = useState(0)

useEffect(() => {
  setProjectCount(projects.length)
  setFeaturedCount(projects.filter(p => p.featured).length)
}, [projects])

// ✅ GOOD: Compute derived values
const [projects, setProjects] = useState<Project[]>([])
const projectCount = projects.length
const featuredCount = projects.filter(p => p.featured).length
```

### 2. Use Functional Updates

```typescript
// ❌ BAD: Using previous state value
setCount(count + 1)

// ✅ GOOD: Using functional update
setCount(prev => prev + 1)
```

### 3. Avoid Unnecessary Re-renders

```typescript
// Use memo for expensive computations
const sortedProjects = useMemo(() => {
  return projects.sort((a, b) => 
    new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
  )
}, [projects])

// Use callback for event handlers
const handleDelete = useCallback((id: string) => {
  setProjects(prev => prev.filter(p => p.id !== id))
}, [])
```

---

**Next**: [12-ROUTING.md](./12-ROUTING.md) - Navigation and routing patterns
