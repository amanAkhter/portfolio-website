# Context API & Props Drilling

> Learn to manage global state and avoid prop drilling with React Context

## 📚 Table of Contents
1. [Props Drilling Problem](#props-drilling-problem)
2. [Context API Basics](#context-api-basics)
3. [TypeScript with Context](#typescript-with-context)
4. [Custom Context Hooks](#custom-context-hooks)
5. [Multiple Contexts](#multiple-contexts)
6. [Context Best Practices](#context-best-practices)

---

## 😓 Props Drilling Problem

### The Problem

```typescript
// Level 0 - App
const App = () => {
  const [user, setUser] = useState<User | null>(null)
  
  return <Dashboard user={user} setUser={setUser} />
}

// Level 1 - Dashboard (doesn't use user, just passes it down)
const Dashboard = ({ user, setUser }) => {
  return <Sidebar user={user} setUser={setUser} />
}

// Level 2 - Sidebar (doesn't use user, just passes it down)
const Sidebar = ({ user, setUser }) => {
  return <UserMenu user={user} setUser={setUser} />
}

// Level 3 - Finally uses it!
const UserMenu = ({ user, setUser }) => {
  return <div>{user?.name}</div>
}

// This is props drilling - passing props through components that don't use them
```

---

## 🎯 Context API Basics

### Creating a Context

```typescript
import { createContext } from 'react'

interface User {
  id: string
  name: string
  email: string
}

// Create context with default value
const UserContext = createContext<User | null>(null)
```

### Providing Context

```typescript
const App = () => {
  const [user, setUser] = useState<User | null>(null)
  
  return (
    <UserContext.Provider value={user}>
      <Dashboard />
    </UserContext.Provider>
  )
}

// Now Dashboard doesn't need user prop!
const Dashboard = () => {
  return <Sidebar />
}

// Sidebar doesn't need it either!
const Sidebar = () => {
  return <UserMenu />
}
```

### Consuming Context

```typescript
import { useContext } from 'react'

const UserMenu = () => {
  const user = useContext(UserContext)
  
  if (!user) {
    return <div>Not logged in</div>
  }
  
  return <div>Welcome, {user.name}!</div>
}
```

---

## 📘 TypeScript with Context

### Type-Safe Context

```typescript
interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

// Create context with undefined default
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  
  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const user = await authService.login(email, password)
      setUser(user)
    } finally {
      setIsLoading(false)
    }
  }
  
  const logout = async () => {
    await authService.logout()
    setUser(null)
  }
  
  const value: AuthContextType = {
    user,
    isLoading,
    login,
    logout
  }
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// Usage in App
const App = () => {
  return (
    <AuthProvider>
      <Dashboard />
    </AuthProvider>
  )
}
```

---

## 🎣 Custom Context Hooks

### Custom useAuth Hook

```typescript
// Custom hook with type safety
export const useAuth = () => {
  const context = useContext(AuthContext)
  
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  
  return context
}

// Now consuming is clean and type-safe
const UserProfile = () => {
  const { user, logout } = useAuth()
  
  return (
    <div>
      <h1>{user?.name}</h1>
      <button onClick={logout}>Logout</button>
    </div>
  )
}
```

### Generic Context Hook

```typescript
function createContextHook<T>(
  context: React.Context<T | undefined>,
  errorMessage: string
) {
  return () => {
    const value = useContext(context)
    
    if (value === undefined) {
      throw new Error(errorMessage)
    }
    
    return value
  }
}

// Usage
const useTheme = createContextHook(
  ThemeContext,
  'useTheme must be used within ThemeProvider'
)

const useSettings = createContextHook(
  SettingsContext,
  'useSettings must be used within SettingsProvider'
)
```

---

## 🎨 Real-World Example: Theme Context

```typescript
type Theme = 'light' | 'dark' | 'tokyo-night'

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const [theme, setTheme] = useState<Theme>(() => {
    // Load from localStorage
    const saved = localStorage.getItem('theme')
    return (saved as Theme) || 'dark'
  })
  
  useEffect(() => {
    // Save to localStorage
    localStorage.setItem('theme', theme)
    
    // Apply to document
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])
  
  const toggleTheme = () => {
    setTheme(prev => {
      if (prev === 'light') return 'dark'
      if (prev === 'dark') return 'tokyo-night'
      return 'light'
    })
  }
  
  const value: ThemeContextType = {
    theme,
    setTheme,
    toggleTheme
  }
  
  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  
  return context
}

// Usage
const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme()
  
  return (
    <button onClick={toggleTheme}>
      Current: {theme}
    </button>
  )
}
```

---

## 🔄 Multiple Contexts

### Composing Providers

```typescript
const App = () => {
  return (
    <AuthProvider>
      <ThemeProvider>
        <SettingsProvider>
          <Dashboard />
        </SettingsProvider>
      </ThemeProvider>
    </AuthProvider>
  )
}

// Create a composed provider
const AppProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <AuthProvider>
      <ThemeProvider>
        <SettingsProvider>
          {children}
        </SettingsProvider>
      </ThemeProvider>
    </AuthProvider>
  )
}

// Clean usage
const App = () => {
  return (
    <AppProviders>
      <Dashboard />
    </AppProviders>
  )
}
```

### Using Multiple Contexts

```typescript
const UserDashboard = () => {
  const { user } = useAuth()
  const { theme } = useTheme()
  const { settings } = useSettings()
  
  return (
    <div className={`dashboard theme-${theme}`}>
      <h1>Welcome, {user?.name}!</h1>
      <p>Language: {settings.language}</p>
    </div>
  )
}
```

---

## 🎯 Real Portfolio Example: Auth Context

```typescript
// src/presentation/hooks/useAuth.ts
import { create } from 'zustand'
import { AuthRepository } from '@/infrastructure/repositories/AuthRepository'

interface User {
  id: string
  email: string
  role: 'admin' | 'user'
}

interface AuthState {
  user: User | null
  isLoading: boolean
  error: string | null
}

interface AuthActions {
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  checkAuth: () => Promise<void>
}

type AuthStore = AuthState & AuthActions

// Using Zustand instead of Context for auth
// But could be implemented with Context too!
export const useAuth = create<AuthStore>((set) => ({
  user: null,
  isLoading: true,
  error: null,
  
  login: async (email, password) => {
    set({ isLoading: true, error: null })
    
    try {
      const user = await AuthRepository.login(email, password)
      set({ user, isLoading: false })
    } catch (error) {
      set({ 
        error: 'Invalid credentials', 
        isLoading: false 
      })
      throw error
    }
  },
  
  logout: async () => {
    await AuthRepository.logout()
    set({ user: null })
  },
  
  checkAuth: async () => {
    set({ isLoading: true })
    
    try {
      const user = await AuthRepository.getCurrentUser()
      set({ user, isLoading: false })
    } catch (error) {
      set({ user: null, isLoading: false })
    }
  }
}))

// Same pattern with Context API
interface AuthContextType {
  user: User | null
  isLoading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  useEffect(() => {
    // Check auth on mount
    const checkAuth = async () => {
      try {
        const user = await AuthRepository.getCurrentUser()
        setUser(user)
      } catch (err) {
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }
    
    checkAuth()
  }, [])
  
  const login = async (email: string, password: string) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const user = await AuthRepository.login(email, password)
      setUser(user)
    } catch (err) {
      setError('Invalid credentials')
      throw err
    } finally {
      setIsLoading(false)
    }
  }
  
  const logout = async () => {
    await AuthRepository.logout()
    setUser(null)
  }
  
  const value: AuthContextType = {
    user,
    isLoading,
    error,
    login,
    logout
  }
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuthContext = () => {
  const context = useContext(AuthContext)
  
  if (!context) {
    throw new Error('useAuthContext must be used within AuthProvider')
  }
  
  return context
}
```

---

## 📋 Context vs Zustand vs Props

### When to Use Context

```typescript
// ✅ Good for:
// - Theme/UI preferences
// - i18n (internationalization)
// - Authentication state
// - Feature flags
// - Rarely changing global state

// ❌ Not ideal for:
// - Frequently updating state
// - Complex state logic
// - State that causes many re-renders
```

### When to Use Zustand/Redux

```typescript
// ✅ Good for:
// - Complex state management
// - Frequently updating state
// - State with complex update logic
// - State that needs middleware
// - State that needs persistence

// Example: Portfolio data (updates frequently)
const usePortfolioStore = create<PortfolioStore>((set) => ({
  projects: [],
  skills: [],
  experiences: [],
  
  addProject: (project) => 
    set((state) => ({ 
      projects: [...state.projects, project] 
    })),
    
  updateProject: (id, updates) =>
    set((state) => ({
      projects: state.projects.map(p =>
        p.id === id ? { ...p, ...updates } : p
      )
    }))
}))
```

### When to Use Props

```typescript
// ✅ Good for:
// - Component-specific data
// - Data that changes frequently
// - Callbacks and handlers
// - Component configuration

interface ButtonProps {
  label: string
  onClick: () => void
  variant: 'primary' | 'secondary'
}

// Props are perfect here!
const Button: React.FC<ButtonProps> = ({ label, onClick, variant }) => {
  return (
    <button onClick={onClick} className={`btn-${variant}`}>
      {label}
    </button>
  )
}
```

---

## ✅ Context Best Practices

### 1. Split Contexts by Domain

```typescript
// ❌ One massive context
interface AppContextType {
  user: User
  theme: Theme
  settings: Settings
  projects: Project[]
  // ... 20 more fields
}

// ✅ Separate contexts
const UserContext = createContext<User>()
const ThemeContext = createContext<Theme>()
const SettingsContext = createContext<Settings>()
```

### 2. Optimize Re-renders

```typescript
// ❌ Single context causes all consumers to re-render
interface AppContextType {
  user: User
  updateUser: (user: User) => void
  theme: Theme
  updateTheme: (theme: Theme) => void
}

// When theme changes, components using only user also re-render!

// ✅ Split into separate contexts
const UserContext = createContext<UserContextType>()
const ThemeContext = createContext<ThemeContextType>()

// Now changing theme doesn't affect user consumers
```

### 3. Memoize Context Values

```typescript
const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const [theme, setTheme] = useState<Theme>('dark')
  
  // ❌ New object on every render
  const value = {
    theme,
    setTheme
  }
  
  // ✅ Memoized value
  const value = useMemo(() => ({
    theme,
    setTheme
  }), [theme])
  
  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}
```

### 4. Provide Default Values

```typescript
// ❌ No default value
const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

// ✅ Sensible default
const defaultTheme: ThemeContextType = {
  theme: 'light',
  setTheme: () => {
    console.warn('ThemeProvider not found')
  }
}

const ThemeContext = createContext<ThemeContextType>(defaultTheme)
```

---

## 🚫 Anti-Patterns

```typescript
// ❌ Putting everything in context
const GlobalContext = createContext({
  user: null,
  theme: 'dark',
  language: 'en',
  projects: [],
  skills: [],
  // ... 50 more fields
})

// ✅ Use multiple contexts or state management library

// ❌ Not memoizing context value
<ThemeContext.Provider value={{ theme, setTheme }}>

// ✅ Memoize to prevent unnecessary re-renders
const value = useMemo(() => ({ theme, setTheme }), [theme])
<ThemeContext.Provider value={value}>

// ❌ Context for frequently changing state
const CountContext = createContext(0)
// Every count change re-renders ALL consumers!

// ✅ Use local state or Zustand for frequent updates
const [count, setCount] = useState(0)
```

---

## 🎓 Practice Exercises

1. Create a NotificationContext that manages toast notifications
2. Build a ModalContext that controls modal state globally
3. Create a SettingsContext with multiple configuration options
4. Implement a CartContext for an e-commerce app
5. Build a i18nContext for multi-language support

---

## 📚 Summary

**Context API is best for:**
- Rarely changing global state
- Theme/UI preferences
- Authentication
- i18n/Localization

**Use Zustand/Redux for:**
- Complex state logic
- Frequently updating state
- State with side effects

**Use Props for:**
- Component-specific data
- Callbacks
- Configuration

---

**Next:** [Error Handling →](./15-ERROR-HANDLING.md)
