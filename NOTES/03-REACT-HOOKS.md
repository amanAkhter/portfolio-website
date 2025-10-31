# React Hooks with TypeScript

## 📖 Table of Contents
1. [useState](#usestate)
2. [useEffect](#useeffect)
3. [useContext](#usecontext)
4. [useRef](#useref)
5. [useCallback](#usecallback)
6. [useMemo](#usememo)
7. [useReducer](#usereducer)
8. [Custom Hooks](#custom-hooks)
9. [Portfolio Examples](#portfolio-examples)

---

## useState

### Basic Usage

```typescript
import { useState } from 'react'

// Simple state with type inference
export const Counter: React.FC = () => {
  // TypeScript infers count is number
  const [count, setCount] = useState(0)
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <button onClick={() => setCount(prev => prev - 1)}>Decrement</button>
    </div>
  )
}

// Explicit type annotation
const [name, setName] = useState<string>('')
const [age, setAge] = useState<number>(0)
const [isActive, setActive] = useState<boolean>(false)
```

### With Objects

```typescript
interface User {
  id: number
  name: string
  email: string
}

export const UserProfile: React.FC = () => {
  // State with object type
  const [user, setUser] = useState<User>({
    id: 1,
    name: '',
    email: ''
  })
  
  // Update specific properties
  const updateName = (newName: string) => {
    setUser(prev => ({ ...prev, name: newName }))
  }
  
  const updateEmail = (newEmail: string) => {
    setUser(prev => ({ ...prev, email: newEmail }))
  }
  
  return (
    <div>
      <input 
        value={user.name}
        onChange={(e) => updateName(e.target.value)}
      />
      <input 
        value={user.email}
        onChange={(e) => updateEmail(e.target.value)}
      />
    </div>
  )
}
```

### With Nullable Types

```typescript
interface Product {
  id: string
  name: string
  price: number
}

export const ProductDetail: React.FC = () => {
  // State can be null
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  
  useEffect(() => {
    fetch('/api/product/1')
      .then(res => res.json())
      .then(data => {
        setProduct(data)
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }, [])
  
  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>
  if (!product) return <div>Product not found</div>
  
  return (
    <div>
      <h1>{product.name}</h1>
      <p>${product.price}</p>
    </div>
  )
}
```

### With Arrays

```typescript
interface Todo {
  id: string
  text: string
  completed: boolean
}

export const TodoList: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([])
  const [inputText, setInputText] = useState<string>('')
  
  const addTodo = () => {
    const newTodo: Todo = {
      id: Date.now().toString(),
      text: inputText,
      completed: false
    }
    setTodos(prev => [...prev, newTodo])
    setInputText('')
  }
  
  const toggleTodo = (id: string) => {
    setTodos(prev => 
      prev.map(todo => 
        todo.id === id 
          ? { ...todo, completed: !todo.completed }
          : todo
      )
    )
  }
  
  const deleteTodo = (id: string) => {
    setTodos(prev => prev.filter(todo => todo.id !== id))
  }
  
  return (
    <div>
      <input 
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
      />
      <button onClick={addTodo}>Add</button>
      
      <ul>
        {todos.map(todo => (
          <li key={todo.id}>
            <input 
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo.id)}
            />
            <span style={{ 
              textDecoration: todo.completed ? 'line-through' : 'none' 
            }}>
              {todo.text}
            </span>
            <button onClick={() => deleteTodo(todo.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  )
}
```

---

## useEffect

### Basic Usage

```typescript
import { useState, useEffect } from 'react'

export const DataFetcher: React.FC = () => {
  const [data, setData] = useState<string>('')
  
  // Runs after every render
  useEffect(() => {
    console.log('Component rendered')
  })
  
  // Runs once on mount
  useEffect(() => {
    console.log('Component mounted')
    fetchData()
  }, []) // Empty dependency array
  
  // Runs when data changes
  useEffect(() => {
    console.log('Data changed:', data)
  }, [data]) // Dependency array with data
  
  return <div>{data}</div>
}
```

### With Cleanup

```typescript
export const Timer: React.FC = () => {
  const [seconds, setSeconds] = useState(0)
  
  useEffect(() => {
    // Setup
    const interval = setInterval(() => {
      setSeconds(prev => prev + 1)
    }, 1000)
    
    // Cleanup function
    return () => {
      clearInterval(interval)
    }
  }, []) // Empty deps = cleanup on unmount
  
  return <div>Seconds: {seconds}</div>
}
```

### Data Fetching Pattern

```typescript
interface User {
  id: number
  name: string
  email: string
}

export const UserFetcher: React.FC<{ userId: number }> = ({ userId }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  useEffect(() => {
    let isCancelled = false
    
    const fetchUser = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const response = await fetch(`/api/users/${userId}`)
        const data: User = await response.json()
        
        if (!isCancelled) {
          setUser(data)
        }
      } catch (err) {
        if (!isCancelled) {
          setError(err instanceof Error ? err.message : 'Unknown error')
        }
      } finally {
        if (!isCancelled) {
          setLoading(false)
        }
      }
    }
    
    fetchUser()
    
    // Cleanup to prevent state updates after unmount
    return () => {
      isCancelled = true
    }
  }, [userId]) // Re-fetch when userId changes
  
  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>
  if (!user) return <div>User not found</div>
  
  return (
    <div>
      <h2>{user.name}</h2>
      <p>{user.email}</p>
    </div>
  )
}
```

---

## useContext

### Creating Context

```typescript
import { createContext, useContext, useState, ReactNode } from 'react'

// Define context type
interface ThemeContextType {
  theme: 'light' | 'dark'
  toggleTheme: () => void
}

// Create context with default value
const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

// Provider component
interface ThemeProviderProps {
  children: ReactNode
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  
  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light')
  }
  
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

// Custom hook to use context
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext)
  
  if (context === undefined) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  
  return context
}
```

### Using Context

```typescript
// In your App
function App() {
  return (
    <ThemeProvider>
      <Header />
      <Main />
      <Footer />
    </ThemeProvider>
  )
}

// In any component
const Header: React.FC = () => {
  const { theme, toggleTheme } = useTheme()
  
  return (
    <header className={theme}>
      <button onClick={toggleTheme}>
        Switch to {theme === 'light' ? 'dark' : 'light'} mode
      </button>
    </header>
  )
}
```

### Authentication Context Example

```typescript
interface User {
  id: string
  name: string
  email: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  
  const login = async (email: string, password: string) => {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
    const userData: User = await response.json()
    setUser(userData)
  }
  
  const logout = async () => {
    await fetch('/api/logout', { method: 'POST' })
    setUser(null)
  }
  
  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      isAuthenticated: !!user
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
```

---

## useRef

### DOM References

```typescript
import { useRef, useEffect } from 'react'

export const FocusInput: React.FC = () => {
  // Ref for input element
  const inputRef = useRef<HTMLInputElement>(null)
  
  useEffect(() => {
    // Focus input on mount
    inputRef.current?.focus()
  }, [])
  
  const handleButtonClick = () => {
    // Access input value
    console.log(inputRef.current?.value)
    
    // Clear input
    if (inputRef.current) {
      inputRef.current.value = ''
    }
  }
  
  return (
    <div>
      <input ref={inputRef} type="text" />
      <button onClick={handleButtonClick}>Log & Clear</button>
    </div>
  )
}
```

### Storing Mutable Values

```typescript
export const Timer: React.FC = () => {
  const [seconds, setSeconds] = useState(0)
  const intervalRef = useRef<number | null>(null)
  
  const startTimer = () => {
    if (intervalRef.current !== null) return
    
    intervalRef.current = window.setInterval(() => {
      setSeconds(prev => prev + 1)
    }, 1000)
  }
  
  const stopTimer = () => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }
  
  const resetTimer = () => {
    stopTimer()
    setSeconds(0)
  }
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])
  
  return (
    <div>
      <div>Seconds: {seconds}</div>
      <button onClick={startTimer}>Start</button>
      <button onClick={stopTimer}>Stop</button>
      <button onClick={resetTimer}>Reset</button>
    </div>
  )
}
```

### Previous Value Pattern

```typescript
export const ValueComparison: React.FC = () => {
  const [count, setCount] = useState(0)
  const prevCountRef = useRef<number>()
  
  useEffect(() => {
    prevCountRef.current = count
  }, [count])
  
  const prevCount = prevCountRef.current
  
  return (
    <div>
      <p>Current: {count}</p>
      <p>Previous: {prevCount}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  )
}
```

---

## useCallback

### Basic Usage

```typescript
import { useState, useCallback } from 'react'

interface ChildProps {
  onClick: () => void
}

const Child: React.FC<ChildProps> = ({ onClick }) => {
  console.log('Child rendered')
  return <button onClick={onClick}>Click me</button>
}

export const Parent: React.FC = () => {
  const [count, setCount] = useState(0)
  const [text, setText] = useState('')
  
  // Without useCallback - new function on every render
  const handleClick = () => {
    setCount(prev => prev + 1)
  }
  
  // With useCallback - same function reference
  const handleClickMemoized = useCallback(() => {
    setCount(prev => prev + 1)
  }, []) // Empty deps = function never changes
  
  return (
    <div>
      <Child onClick={handleClickMemoized} />
      <input value={text} onChange={(e) => setText(e.target.value)} />
      <p>Count: {count}</p>
    </div>
  )
}
```

### With Dependencies

```typescript
export const SearchComponent: React.FC = () => {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<string[]>([])
  
  // Function recreated only when query changes
  const search = useCallback(async () => {
    if (!query) {
      setResults([])
      return
    }
    
    const response = await fetch(`/api/search?q=${query}`)
    const data = await response.json()
    setResults(data)
  }, [query]) // Depends on query
  
  return (
    <div>
      <input 
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button onClick={search}>Search</button>
      <ul>
        {results.map(result => (
          <li key={result}>{result}</li>
        ))}
      </ul>
    </div>
  )
}
```

---

## useMemo

### Basic Usage

```typescript
import { useState, useMemo } from 'react'

export const ExpensiveCalculation: React.FC = () => {
  const [count, setCount] = useState(0)
  const [text, setText] = useState('')
  
  // Expensive calculation - only runs when count changes
  const expensiveValue = useMemo(() => {
    console.log('Calculating...')
    let result = 0
    for (let i = 0; i < 1000000000; i++) {
      result += count
    }
    return result
  }, [count]) // Only recalculates when count changes
  
  return (
    <div>
      <input 
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <p>Result: {expensiveValue}</p>
    </div>
  )
}
```

### Memoizing Objects/Arrays

```typescript
interface User {
  id: number
  name: string
}

export const UserList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([])
  const [filter, setFilter] = useState('')
  
  // Filtered list only recalculated when users or filter changes
  const filteredUsers = useMemo(() => {
    console.log('Filtering users...')
    return users.filter(user => 
      user.name.toLowerCase().includes(filter.toLowerCase())
    )
  }, [users, filter])
  
  // Sorted list only recalculated when filteredUsers changes
  const sortedUsers = useMemo(() => {
    console.log('Sorting users...')
    return [...filteredUsers].sort((a, b) => 
      a.name.localeCompare(b.name)
    )
  }, [filteredUsers])
  
  return (
    <div>
      <input 
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        placeholder="Filter users..."
      />
      <ul>
        {sortedUsers.map(user => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </div>
  )
}
```

---

## useReducer

### Basic Usage

```typescript
import { useReducer } from 'react'

// Define state type
interface CounterState {
  count: number
}

// Define action types
type CounterAction =
  | { type: 'INCREMENT' }
  | { type: 'DECREMENT' }
  | { type: 'RESET' }
  | { type: 'SET'; payload: number }

// Reducer function
const counterReducer = (state: CounterState, action: CounterAction): CounterState => {
  switch (action.type) {
    case 'INCREMENT':
      return { count: state.count + 1 }
    case 'DECREMENT':
      return { count: state.count - 1 }
    case 'RESET':
      return { count: 0 }
    case 'SET':
      return { count: action.payload }
    default:
      return state
  }
}

export const Counter: React.FC = () => {
  const [state, dispatch] = useReducer(counterReducer, { count: 0 })
  
  return (
    <div>
      <p>Count: {state.count}</p>
      <button onClick={() => dispatch({ type: 'INCREMENT' })}>+</button>
      <button onClick={() => dispatch({ type: 'DECREMENT' })}>-</button>
      <button onClick={() => dispatch({ type: 'RESET' })}>Reset</button>
      <button onClick={() => dispatch({ type: 'SET', payload: 10 })}>Set to 10</button>
    </div>
  )
}
```

### Complex State Management

```typescript
interface Todo {
  id: string
  text: string
  completed: boolean
}

interface TodoState {
  todos: Todo[]
  filter: 'all' | 'active' | 'completed'
}

type TodoAction =
  | { type: 'ADD_TODO'; payload: string }
  | { type: 'TOGGLE_TODO'; payload: string }
  | { type: 'DELETE_TODO'; payload: string }
  | { type: 'SET_FILTER'; payload: 'all' | 'active' | 'completed' }

const todoReducer = (state: TodoState, action: TodoAction): TodoState => {
  switch (action.type) {
    case 'ADD_TODO':
      return {
        ...state,
        todos: [
          ...state.todos,
          {
            id: Date.now().toString(),
            text: action.payload,
            completed: false
          }
        ]
      }
    
    case 'TOGGLE_TODO':
      return {
        ...state,
        todos: state.todos.map(todo =>
          todo.id === action.payload
            ? { ...todo, completed: !todo.completed }
            : todo
        )
      }
    
    case 'DELETE_TODO':
      return {
        ...state,
        todos: state.todos.filter(todo => todo.id !== action.payload)
      }
    
    case 'SET_FILTER':
      return {
        ...state,
        filter: action.payload
      }
    
    default:
      return state
  }
}

export const TodoApp: React.FC = () => {
  const [state, dispatch] = useReducer(todoReducer, {
    todos: [],
    filter: 'all'
  })
  
  const [inputText, setInputText] = useState('')
  
  const filteredTodos = state.todos.filter(todo => {
    if (state.filter === 'active') return !todo.completed
    if (state.filter === 'completed') return todo.completed
    return true
  })
  
  return (
    <div>
      <input 
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
      />
      <button onClick={() => {
        if (inputText.trim()) {
          dispatch({ type: 'ADD_TODO', payload: inputText })
          setInputText('')
        }
      }}>
        Add
      </button>
      
      <div>
        <button onClick={() => dispatch({ type: 'SET_FILTER', payload: 'all' })}>
          All
        </button>
        <button onClick={() => dispatch({ type: 'SET_FILTER', payload: 'active' })}>
          Active
        </button>
        <button onClick={() => dispatch({ type: 'SET_FILTER', payload: 'completed' })}>
          Completed
        </button>
      </div>
      
      <ul>
        {filteredTodos.map(todo => (
          <li key={todo.id}>
            <input 
              type="checkbox"
              checked={todo.completed}
              onChange={() => dispatch({ type: 'TOGGLE_TODO', payload: todo.id })}
            />
            {todo.text}
            <button onClick={() => dispatch({ type: 'DELETE_TODO', payload: todo.id })}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
```

---

## Custom Hooks

### useFetch Hook

```typescript
import { useState, useEffect } from 'react'

interface UseFetchResult<T> {
  data: T | null
  loading: boolean
  error: string | null
  refetch: () => void
}

export function useFetch<T>(url: string): UseFetchResult<T> {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refetchIndex, setRefetchIndex] = useState(0)
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const response = await fetch(url)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const result: T = await response.json()
        setData(result)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [url, refetchIndex])
  
  const refetch = () => setRefetchIndex(prev => prev + 1)
  
  return { data, loading, error, refetch }
}

// Usage
interface User {
  id: number
  name: string
}

const MyComponent = () => {
  const { data, loading, error, refetch } = useFetch<User[]>('/api/users')
  
  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>
  
  return (
    <div>
      <button onClick={refetch}>Refresh</button>
      {data?.map(user => (
        <div key={user.id}>{user.name}</div>
      ))}
    </div>
  )
}
```

### useLocalStorage Hook

```typescript
import { useState, useEffect } from 'react'

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T) => void] {
  // Get from local storage or use initial value
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.error(error)
      return initialValue
    }
  })
  
  // Save to local storage whenever value changes
  const setValue = (value: T) => {
    try {
      setStoredValue(value)
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error(error)
    }
  }
  
  return [storedValue, setValue]
}

// Usage
const MyComponent = () => {
  const [name, setName] = useLocalStorage<string>('username', '')
  const [settings, setSettings] = useLocalStorage({
    theme: 'light',
    notifications: true
  })
  
  return (
    <div>
      <input 
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
    </div>
  )
}
```

---

## Portfolio Examples

### Example 1: useAuth Hook

```typescript
// From: src/presentation/hooks/useAuth.ts
import { useAuthStore } from '../store/authStore'

export const useAuth = () => {
  const { user, login, logout, loading } = useAuthStore()
  
  return {
    user,
    login,
    logout,
    loading,
    isAuthenticated: !!user
  }
}

// Usage in component
const AdminPage = () => {
  const { user, isAuthenticated, logout } = useAuth()
  
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" />
  }
  
  return (
    <div>
      <p>Welcome, {user?.email}</p>
      <button onClick={logout}>Logout</button>
    </div>
  )
}
```

### Example 2: usePortfolio Hook

```typescript
// From: src/presentation/hooks/usePortfolio.ts
import { useState, useEffect } from 'react'
import { portfolioService } from '../../core/usecases'
import type { Project } from '../../shared/types'

export const usePortfolio = () => {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const data = await portfolioService.getAllProjects()
        setProjects(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [])
  
  return { projects, loading, error }
}

// Usage
const ProjectsList = () => {
  const { projects, loading, error } = usePortfolio()
  
  if (loading) return <LoadingSpinner />
  if (error) return <ErrorMessage message={error} />
  
  return (
    <div>
      {projects.map(project => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  )
}
```

---

## 🎯 Best Practices

1. **Always provide types** for hook parameters and return values
2. **Use ESLint plugin** for hooks rules
3. **Memoize callbacks** passed to child components
4. **Clean up effects** that create subscriptions
5. **Extract complex logic** into custom hooks
6. **Use useCallback/useMemo** judiciously (not always needed)
7. **Keep hooks at top level** (never inside conditions/loops)

---

**Next**: [04-COMPONENT-PATTERNS.md](./04-COMPONENT-PATTERNS.md) - Advanced component patterns
