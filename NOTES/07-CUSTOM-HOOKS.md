# Custom Hooks Mastery

> Learn to build reusable, powerful custom hooks for any scenario

## 📚 Table of Contents
1. [What are Custom Hooks?](#what-are-custom-hooks)
2. [Basic Custom Hooks](#basic-custom-hooks)
3. [Data Fetching Hooks](#data-fetching-hooks)
4. [Form Handling Hooks](#form-handling-hooks)
5. [UI Interaction Hooks](#ui-interaction-hooks)
6. [Advanced Patterns](#advanced-patterns)
7. [Real Portfolio Examples](#real-portfolio-examples)

---

## 🤔 What are Custom Hooks?

**Custom hooks let you extract component logic into reusable functions.**

### Rules of Hooks
1. ✅ Only call hooks at the top level
2. ✅ Only call hooks from React functions
3. ✅ Hook names must start with `use`
4. ✅ Hooks can call other hooks

```typescript
// ❌ Conditional hook calls
if (condition) {
  useState(0) // NO!
}

// ✅ Hooks at top level
const [count, setCount] = useState(0)
if (condition) {
  setCount(1) // OK!
}
```

---

## 🏗️ Basic Custom Hooks

### useToggle - Boolean state management

```typescript
import { useState, useCallback } from 'react'

export function useToggle(initialValue: boolean = false) {
  const [value, setValue] = useState(initialValue)
  
  const toggle = useCallback(() => {
    setValue((v) => !v)
  }, [])
  
  const setTrue = useCallback(() => {
    setValue(true)
  }, [])
  
  const setFalse = useCallback(() => {
    setValue(false)
  }, [])
  
  return {
    value,
    toggle,
    setTrue,
    setFalse,
    setValue,
  }
}

// Usage
const Modal = () => {
  const { value: isOpen, toggle, setTrue, setFalse } = useToggle()
  
  return (
    <>
      <button onClick={setTrue}>Open Modal</button>
      {isOpen && (
        <div className="modal">
          <button onClick={setFalse}>Close</button>
          <button onClick={toggle}>Toggle</button>
        </div>
      )}
    </>
  )
}
```

### useLocalStorage - Persistent state

```typescript
import { useState, useEffect } from 'react'

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void] {
  // Get from localStorage or use initial value
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error)
      return initialValue
    }
  })
  
  // Return a wrapped version of useState's setter that persists to localStorage
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Allow value to be a function
      const valueToStore = value instanceof Function ? value(storedValue) : value
      
      setStoredValue(valueToStore)
      window.localStorage.setItem(key, JSON.stringify(valueToStore))
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error)
    }
  }
  
  return [storedValue, setValue]
}

// Usage
const App = () => {
  const [theme, setTheme] = useLocalStorage<'light' | 'dark'>('theme', 'light')
  const [user, setUser] = useLocalStorage('user', null)
  
  return (
    <div className={theme}>
      <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
        Toggle Theme
      </button>
    </div>
  )
}
```

### useDebounce - Delay value updates

```typescript
import { useState, useEffect } from 'react'

export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)
    
    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])
  
  return debouncedValue
}

// Usage
const SearchComponent = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const debouncedSearchTerm = useDebounce(searchTerm, 500)
  
  useEffect(() => {
    if (debouncedSearchTerm) {
      // API call only after user stops typing for 500ms
      fetch(`/api/search?q=${debouncedSearchTerm}`)
        .then(res => res.json())
        .then(data => console.log(data))
    }
  }, [debouncedSearchTerm])
  
  return (
    <input
      type="text"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      placeholder="Search..."
    />
  )
}
```

---

## 🌐 Data Fetching Hooks

### useFetch - Generic data fetching

```typescript
import { useState, useEffect } from 'react'

interface FetchState<T> {
  data: T | null
  loading: boolean
  error: Error | null
}

export function useFetch<T>(url: string): FetchState<T> {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  
  useEffect(() => {
    let isMounted = true
    
    const fetchData = async () => {
      setLoading(true)
      setError(null)
      
      try {
        const response = await fetch(url)
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const result: T = await response.json()
        
        if (isMounted) {
          setData(result)
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error('Unknown error'))
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }
    
    fetchData()
    
    return () => {
      isMounted = false
    }
  }, [url])
  
  return { data, loading, error }
}

// Usage
interface User {
  id: number
  name: string
  email: string
}

const UserProfile = ({ userId }: { userId: number }) => {
  const { data: user, loading, error } = useFetch<User>(`/api/users/${userId}`)
  
  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>
  if (!user) return <div>No user found</div>
  
  return (
    <div>
      <h2>{user.name}</h2>
      <p>{user.email}</p>
    </div>
  )
}
```

### useAsync - Advanced async operations

```typescript
import { useState, useEffect, useCallback } from 'react'

interface AsyncState<T> {
  status: 'idle' | 'pending' | 'success' | 'error'
  data: T | null
  error: Error | null
}

export function useAsync<T>(
  asyncFunction: () => Promise<T>,
  immediate: boolean = true
) {
  const [state, setState] = useState<AsyncState<T>>({
    status: 'idle',
    data: null,
    error: null,
  })
  
  const execute = useCallback(async () => {
    setState({ status: 'pending', data: null, error: null })
    
    try {
      const data = await asyncFunction()
      setState({ status: 'success', data, error: null })
      return data
    } catch (error) {
      setState({
        status: 'error',
        data: null,
        error: error instanceof Error ? error : new Error('Unknown error'),
      })
      throw error
    }
  }, [asyncFunction])
  
  useEffect(() => {
    if (immediate) {
      execute()
    }
  }, [execute, immediate])
  
  return {
    ...state,
    execute,
    isIdle: state.status === 'idle',
    isPending: state.status === 'pending',
    isSuccess: state.status === 'success',
    isError: state.status === 'error',
  }
}

// Usage
const UserData = () => {
  const getUsers = useCallback(
    () => fetch('/api/users').then(res => res.json()),
    []
  )
  
  const { data, isLoading, isError, error, execute } = useAsync(getUsers, false)
  
  return (
    <div>
      <button onClick={execute} disabled={isLoading}>
        {isLoading ? 'Loading...' : 'Load Users'}
      </button>
      
      {isError && <div>Error: {error?.message}</div>}
      {data && <div>{JSON.stringify(data)}</div>}
    </div>
  )
}
```

---

## 📝 Form Handling Hooks

### useForm - Complete form management

```typescript
import { useState, useCallback } from 'react'

interface FormOptions<T> {
  initialValues: T
  onSubmit: (values: T) => void | Promise<void>
  validate?: (values: T) => Partial<Record<keyof T, string>>
}

export function useForm<T extends Record<string, any>>({
  initialValues,
  onSubmit,
  validate,
}: FormOptions<T>) {
  const [values, setValues] = useState<T>(initialValues)
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({})
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const handleChange = useCallback((name: keyof T, value: any) => {
    setValues((prev) => ({ ...prev, [name]: value }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }, [errors])
  
  const handleBlur = useCallback((name: keyof T) => {
    setTouched((prev) => ({ ...prev, [name]: true }))
    
    // Validate on blur
    if (validate) {
      const validationErrors = validate(values)
      if (validationErrors[name]) {
        setErrors((prev) => ({ ...prev, [name]: validationErrors[name] }))
      }
    }
  }, [validate, values])
  
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate all fields
    if (validate) {
      const validationErrors = validate(values)
      setErrors(validationErrors)
      
      if (Object.keys(validationErrors).length > 0) {
        return
      }
    }
    
    setIsSubmitting(true)
    try {
      await onSubmit(values)
    } catch (error) {
      console.error('Form submission error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }, [onSubmit, validate, values])
  
  const reset = useCallback(() => {
    setValues(initialValues)
    setErrors({})
    setTouched({})
    setIsSubmitting(false)
  }, [initialValues])
  
  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    reset,
  }
}

// Usage
interface LoginForm {
  email: string
  password: string
}

const LoginComponent = () => {
  const {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
  } = useForm<LoginForm>({
    initialValues: {
      email: '',
      password: '',
    },
    validate: (values) => {
      const errors: Partial<Record<keyof LoginForm, string>> = {}
      
      if (!values.email) {
        errors.email = 'Email is required'
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
        errors.email = 'Invalid email format'
      }
      
      if (!values.password) {
        errors.password = 'Password is required'
      } else if (values.password.length < 6) {
        errors.password = 'Password must be at least 6 characters'
      }
      
      return errors
    },
    onSubmit: async (values) => {
      await fetch('/api/login', {
        method: 'POST',
        body: JSON.stringify(values),
      })
    },
  })
  
  return (
    <form onSubmit={handleSubmit}>
      <div>
        <input
          type="email"
          value={values.email}
          onChange={(e) => handleChange('email', e.target.value)}
          onBlur={() => handleBlur('email')}
        />
        {touched.email && errors.email && (
          <span className="error">{errors.email}</span>
        )}
      </div>
      
      <div>
        <input
          type="password"
          value={values.password}
          onChange={(e) => handleChange('password', e.target.value)}
          onBlur={() => handleBlur('password')}
        />
        {touched.password && errors.password && (
          <span className="error">{errors.password}</span>
        )}
      </div>
      
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Logging in...' : 'Login'}
      </button>
    </form>
  )
}
```

---

## 🎨 UI Interaction Hooks

### useClickOutside - Detect clicks outside element

```typescript
import { useEffect, RefObject } from 'react'

export function useClickOutside<T extends HTMLElement>(
  ref: RefObject<T>,
  handler: (event: MouseEvent | TouchEvent) => void
) {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      const el = ref.current
      
      // Do nothing if clicking ref's element or its descendants
      if (!el || el.contains(event.target as Node)) {
        return
      }
      
      handler(event)
    }
    
    document.addEventListener('mousedown', listener)
    document.addEventListener('touchstart', listener)
    
    return () => {
      document.removeEventListener('mousedown', listener)
      document.removeEventListener('touchstart', listener)
    }
  }, [ref, handler])
}

// Usage
const Dropdown = () => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  
  useClickOutside(dropdownRef, () => setIsOpen(false))
  
  return (
    <div ref={dropdownRef}>
      <button onClick={() => setIsOpen(!isOpen)}>
        Toggle Dropdown
      </button>
      
      {isOpen && (
        <div className="dropdown-menu">
          <button>Option 1</button>
          <button>Option 2</button>
        </div>
      )}
    </div>
  )
}
```

### useWindowSize - Track window dimensions

```typescript
import { useState, useEffect } from 'react'

interface WindowSize {
  width: number
  height: number
}

export function useWindowSize(): WindowSize {
  const [windowSize, setWindowSize] = useState<WindowSize>({
    width: window.innerWidth,
    height: window.innerHeight,
  })
  
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }
    
    window.addEventListener('resize', handleResize)
    
    // Call handler right away so state gets updated with initial window size
    handleResize()
    
    return () => window.removeEventListener('resize', handleResize)
  }, [])
  
  return windowSize
}

// Usage
const ResponsiveComponent = () => {
  const { width } = useWindowSize()
  
  return (
    <div>
      {width < 768 ? (
        <MobileView />
      ) : width < 1024 ? (
        <TabletView />
      ) : (
        <DesktopView />
      )}
    </div>
  )
}
```

---

## 🎯 Real Portfolio Examples

### useAuth Hook

**From `src/presentation/hooks/useAuth.ts`:**

```typescript
import { useState, useEffect } from 'react'
import { authService } from '../../core/usecases'
import type { User } from '../../shared/types'

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const unsubscribe = authService.onAuthStateChanged((currentUser) => {
      setUser(currentUser)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      setError(null)
      const user = await authService.signIn(email, password)
      return user
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to sign in'
      setError(errorMessage)
      throw err
    }
  }

  const signOut = async () => {
    try {
      setError(null)
      await authService.signOut()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to sign out'
      setError(errorMessage)
      throw err
    }
  }

  return {
    user,
    loading,
    error,
    signIn,
    signOut,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
  }
}
```

**Usage:**

```typescript
const LoginPage = () => {
  const { signIn, loading, error, isAuthenticated } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await signIn(email, password)
  }
  
  if (isAuthenticated) {
    return <Navigate to="/admin" />
  }
  
  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="error">{error}</div>}
      <input value={email} onChange={(e) => setEmail(e.target.value)} />
      <input value={password} onChange={(e) => setPassword(e.target.value)} />
      <button type="submit" disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  )
}
```

### usePortfolio Hook

**From `src/presentation/hooks/usePortfolio.ts`:**

```typescript
import { useState, useEffect } from 'react'
import { portfolioService } from '../../core/usecases'
import type {
  HomeData,
  AboutData,
  Experience,
  Project,
  Skill,
  SkillSection,
  Certification,
  Education,
  ContactInfo,
} from '../../shared/types'

export const usePortfolio = () => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const [homeData, setHomeData] = useState<HomeData | null>(null)
  const [aboutData, setAboutData] = useState<AboutData | null>(null)
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [skills, setSkills] = useState<Skill[]>([])
  const [skillSections, setSkillSections] = useState<SkillSection[]>([])
  const [certifications, setCertifications] = useState<Certification[]>([])
  const [educations, setEducations] = useState<Education[]>([])
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null)

  const fetchAllData = async () => {
    try {
      setLoading(true)
      setError(null)

      const [
        home,
        about,
        exp,
        proj,
        sk,
        skSec,
        cert,
        edu,
        contact,
      ] = await Promise.all([
        portfolioService.getHomeData(),
        portfolioService.getAboutData(),
        portfolioService.getAllExperiences(),
        portfolioService.getAllProjects(),
        portfolioService.getAllSkills(),
        portfolioService.getAllSkillSections(),
        portfolioService.getAllCertifications(),
        portfolioService.getAllEducations(),
        portfolioService.getContactInfo(),
      ])

      setHomeData(home)
      setAboutData(about)
      setExperiences(exp)
      setProjects(proj)
      setSkills(sk)
      setSkillSections(skSec)
      setCertifications(cert)
      setEducations(edu)
      setContactInfo(contact)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch portfolio data'
      setError(errorMessage)
      console.error('Error fetching portfolio data:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAllData()
  }, [])

  return {
    loading,
    error,
    homeData,
    aboutData,
    experiences,
    projects,
    skills,
    skillSections,
    certifications,
    educations,
    contactInfo,
    refetch: fetchAllData,
  }
}
```

**Usage:**

```typescript
const PortfolioPage = () => {
  const {
    loading,
    error,
    homeData,
    projects,
    experiences,
    refetch,
  } = usePortfolio()
  
  if (loading) return <LoadingScreen />
  if (error) return <ErrorScreen message={error} onRetry={refetch} />
  
  return (
    <div>
      <HomeSection data={homeData} />
      <ProjectsSection projects={projects} />
      <ExperienceSection experiences={experiences} />
    </div>
  )
}
```

---

## ✅ Best Practices

1. **Name hooks with `use` prefix** - React convention
2. **Return objects for multiple values** - Better API
3. **Use TypeScript generics** - Maximum reusability
4. **Handle cleanup** - Return cleanup function from useEffect
5. **Memoize callbacks** - Use useCallback for functions
6. **Document your hooks** - JSDoc comments
7. **Test your hooks** - Use @testing-library/react-hooks

---

## 🚫 Anti-Patterns

```typescript
// ❌ Conditional hooks
if (condition) {
  const [state, setState] = useState() // NO!
}

// ✅ Hooks at top level
const [state, setState] = useState()
if (condition) {
  setState(newValue) // OK!
}

// ❌ Not cleaning up effects
useEffect(() => {
  const interval = setInterval(() => {
    console.log('tick')
  }, 1000)
  // Missing cleanup!
}, [])

// ✅ Clean up effects
useEffect(() => {
  const interval = setInterval(() => {
    console.log('tick')
  }, 1000)
  
  return () => clearInterval(interval) // Cleanup!
}, [])
```

---

## 🎓 Practice Exercises

1. Create `useIntersectionObserver` for lazy loading
2. Build `useMediaQuery` for responsive design
3. Implement `useTimeout` and `useInterval`
4. Create `useAsync` for data fetching
5. Build `usePrevious` to track previous values

---

**Next:** [Routing & Navigation →](./08-ROUTING-NAVIGATION.md)
