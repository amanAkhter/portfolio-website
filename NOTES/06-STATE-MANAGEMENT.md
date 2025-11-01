# State Management with Zustand

> Learn modern state management using Zustand - the lightweight, simple, and powerful state management library

## 📚 Table of Contents
1. [Why Zustand?](#why-zustand)
2. [Basic Store Setup](#basic-store-setup)
3. [Store with TypeScript](#store-with-typescript)
4. [Actions & Mutations](#actions--mutations)
5. [Derived State & Selectors](#derived-state--selectors)
6. [Async Operations](#async-operations)
7. [Multiple Stores](#multiple-stores)
8. [Real Portfolio Examples](#real-portfolio-examples)

---

## 🤔 Why Zustand?

**Comparison with other solutions:**

| Feature | Zustand | Redux | Context API |
|---------|---------|-------|-------------|
| Boilerplate | Minimal | High | Medium |
| Bundle Size | ~1KB | ~18KB | Built-in |
| Learning Curve | Easy | Steep | Easy |
| TypeScript | Excellent | Good | Good |
| DevTools | Yes | Yes | No |
| Performance | Excellent | Excellent | Good |

**When to use Zustand:**
- ✅ Need global state without complexity
- ✅ Want to avoid prop drilling
- ✅ Need TypeScript support
- ✅ Want simple async operations
- ✅ Need fine-grained updates

---

## 🏗️ Basic Store Setup

### Installation

```bash
pnpm add zustand
```

### Simple Counter Store

```typescript
import { create } from 'zustand'

// Define store interface
interface CounterStore {
  count: number
  increment: () => void
  decrement: () => void
  reset: () => void
}

// Create store
export const useCounterStore = create<CounterStore>((set) => ({
  // Initial state
  count: 0,
  
  // Actions
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
  reset: () => set({ count: 0 }),
}))

// Usage in component
const Counter = () => {
  const { count, increment, decrement, reset } = useCounterStore()
  
  return (
    <div>
      <h1>Count: {count}</h1>
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
      <button onClick={reset}>Reset</button>
    </div>
  )
}
```

### Selective Subscriptions (Performance)

```typescript
// ❌ Re-renders on ANY store change
const Component = () => {
  const store = useCounterStore()
  return <div>{store.count}</div>
}

// ✅ Only re-renders when count changes
const Component = () => {
  const count = useCounterStore((state) => state.count)
  return <div>{count}</div>
}

// ✅ Only re-renders when either value changes
const Component = () => {
  const { count, increment } = useCounterStore((state) => ({
    count: state.count,
    increment: state.increment,
  }))
  
  return (
    <div>
      <p>{count}</p>
      <button onClick={increment}>+</button>
    </div>
  )
}
```

---

## 📘 Store with TypeScript

### Comprehensive Type-Safe Store

```typescript
import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

// Types
interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'user'
}

interface AuthError {
  message: string
  code: string
}

// Store State
interface AuthState {
  // State
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: AuthError | null
  
  // Actions
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  setUser: (user: User | null) => void
  setError: (error: AuthError | null) => void
  clearError: () => void
}

// Create Store
export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
        
        // Actions
        login: async (email, password) => {
          set({ isLoading: true, error: null })
          
          try {
            const response = await fetch('/api/auth/login', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email, password }),
            })
            
            if (!response.ok) {
              throw new Error('Login failed')
            }
            
            const user: User = await response.json()
            
            set({
              user,
              isAuthenticated: true,
              isLoading: false,
            })
          } catch (error) {
            set({
              error: {
                message: error instanceof Error ? error.message : 'Unknown error',
                code: 'AUTH_ERROR',
              },
              isLoading: false,
            })
          }
        },
        
        logout: async () => {
          set({ isLoading: true })
          
          try {
            await fetch('/api/auth/logout', { method: 'POST' })
            
            set({
              user: null,
              isAuthenticated: false,
              isLoading: false,
              error: null,
            })
          } catch (error) {
            set({ isLoading: false })
          }
        },
        
        setUser: (user) => set({ user, isAuthenticated: !!user }),
        setError: (error) => set({ error }),
        clearError: () => set({ error: null }),
      }),
      {
        name: 'auth-storage', // localStorage key
        partialize: (state) => ({ 
          user: state.user,
          isAuthenticated: state.isAuthenticated,
        }), // Only persist these fields
      }
    )
  )
)
```

---

## 🎬 Actions & Mutations

### Simple Actions

```typescript
interface TodoStore {
  todos: Todo[]
  addTodo: (text: string) => void
  removeTodo: (id: string) => void
  toggleTodo: (id: string) => void
  updateTodo: (id: string, updates: Partial<Todo>) => void
}

export const useTodoStore = create<TodoStore>((set) => ({
  todos: [],
  
  addTodo: (text) =>
    set((state) => ({
      todos: [
        ...state.todos,
        {
          id: Date.now().toString(),
          text,
          completed: false,
          createdAt: new Date(),
        },
      ],
    })),
  
  removeTodo: (id) =>
    set((state) => ({
      todos: state.todos.filter((todo) => todo.id !== id),
    })),
  
  toggleTodo: (id) =>
    set((state) => ({
      todos: state.todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      ),
    })),
  
  updateTodo: (id, updates) =>
    set((state) => ({
      todos: state.todos.map((todo) =>
        todo.id === id ? { ...todo, ...updates } : todo
      ),
    })),
}))
```

### Complex Actions with get()

```typescript
interface CartStore {
  items: CartItem[]
  total: number
  
  addItem: (product: Product) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  calculateTotal: () => void
  checkout: () => Promise<void>
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  total: 0,
  
  addItem: (product) => {
    const { items } = get()
    const existingItem = items.find((item) => item.productId === product.id)
    
    if (existingItem) {
      set({
        items: items.map((item) =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ),
      })
    } else {
      set({
        items: [
          ...items,
          {
            productId: product.id,
            name: product.name,
            price: product.price,
            quantity: 1,
          },
        ],
      })
    }
    
    get().calculateTotal()
  },
  
  removeItem: (productId) => {
    set((state) => ({
      items: state.items.filter((item) => item.productId !== productId),
    }))
    
    get().calculateTotal()
  },
  
  updateQuantity: (productId, quantity) => {
    if (quantity <= 0) {
      get().removeItem(productId)
      return
    }
    
    set((state) => ({
      items: state.items.map((item) =>
        item.productId === productId ? { ...item, quantity } : item
      ),
    }))
    
    get().calculateTotal()
  },
  
  calculateTotal: () => {
    const { items } = get()
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    set({ total })
  },
  
  checkout: async () => {
    const { items, total } = get()
    
    try {
      await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items, total }),
      })
      
      set({ items: [], total: 0 })
    } catch (error) {
      console.error('Checkout failed:', error)
    }
  },
}))
```

---

## 🎯 Derived State & Selectors

```typescript
interface TodoStore {
  todos: Todo[]
  filter: 'all' | 'active' | 'completed'
  
  // Getters (computed values)
  get filteredTodos(): Todo[]
  get activeTodoCount(): number
  get completedTodoCount(): number
  
  // Actions
  setFilter: (filter: 'all' | 'active' | 'completed') => void
}

export const useTodoStore = create<TodoStore>((set, get) => ({
  todos: [],
  filter: 'all',
  
  // Computed values
  get filteredTodos() {
    const { todos, filter } = get()
    
    switch (filter) {
      case 'active':
        return todos.filter((todo) => !todo.completed)
      case 'completed':
        return todos.filter((todo) => todo.completed)
      default:
        return todos
    }
  },
  
  get activeTodoCount() {
    return get().todos.filter((todo) => !todo.completed).length
  },
  
  get completedTodoCount() {
    return get().todos.filter((todo) => todo.completed).length
  },
  
  setFilter: (filter) => set({ filter }),
}))

// Usage
const TodoList = () => {
  const filteredTodos = useTodoStore((state) => state.filteredTodos)
  const activeCount = useTodoStore((state) => state.activeTodoCount)
  
  return (
    <div>
      <p>Active: {activeCount}</p>
      {filteredTodos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </div>
  )
}
```

---

## ⚡ Async Operations

```typescript
interface DataStore {
  data: User[]
  isLoading: boolean
  error: string | null
  
  fetchData: () => Promise<void>
  createData: (user: Omit<User, 'id'>) => Promise<void>
  updateData: (id: string, updates: Partial<User>) => Promise<void>
  deleteData: (id: string) => Promise<void>
}

export const useDataStore = create<DataStore>((set, get) => ({
  data: [],
  isLoading: false,
  error: null,
  
  fetchData: async () => {
    set({ isLoading: true, error: null })
    
    try {
      const response = await fetch('/api/users')
      const data = await response.json()
      
      set({ data, isLoading: false })
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch',
        isLoading: false,
      })
    }
  },
  
  createData: async (user) => {
    set({ isLoading: true, error: null })
    
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
      })
      
      const newUser = await response.json()
      
      set((state) => ({
        data: [...state.data, newUser],
        isLoading: false,
      }))
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to create',
        isLoading: false,
      })
    }
  },
  
  updateData: async (id, updates) => {
    set({ isLoading: true, error: null })
    
    try {
      const response = await fetch(`/api/users/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      })
      
      const updatedUser = await response.json()
      
      set((state) => ({
        data: state.data.map((user) => (user.id === id ? updatedUser : user)),
        isLoading: false,
      }))
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to update',
        isLoading: false,
      })
    }
  },
  
  deleteData: async (id) => {
    set({ isLoading: true, error: null })
    
    try {
      await fetch(`/api/users/${id}`, { method: 'DELETE' })
      
      set((state) => ({
        data: state.data.filter((user) => user.id !== id),
        isLoading: false,
      }))
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to delete',
        isLoading: false,
      })
    }
  },
}))
```

---

## 🏪 Multiple Stores

### Separate Concerns

```typescript
// auth-store.ts
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  login: async (email, password) => { /* ... */ },
  logout: async () => { /* ... */ },
}))

// theme-store.ts
export const useThemeStore = create<ThemeState>((set) => ({
  theme: 'light',
  toggleTheme: () => set((state) => ({
    theme: state.theme === 'light' ? 'dark' : 'light',
  })),
}))

// cart-store.ts
export const useCartStore = create<CartState>((set) => ({
  items: [],
  addItem: (item) => { /* ... */ },
  removeItem: (id) => { /* ... */ },
}))

// Usage - Multiple stores in one component
const Header = () => {
  const user = useAuthStore((state) => state.user)
  const theme = useThemeStore((state) => state.theme)
  const itemCount = useCartStore((state) => state.items.length)
  
  return (
    <header className={theme}>
      <p>Welcome, {user?.name}</p>
      <p>Cart: {itemCount} items</p>
    </header>
  )
}
```

---

## 🎯 Real Portfolio Examples

### Portfolio Store

**From `src/presentation/store/portfolioStore.ts`:**

```typescript
import { create } from 'zustand'
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

interface PortfolioState {
  // State
  homeData: HomeData | null
  aboutData: AboutData | null
  experiences: Experience[]
  projects: Project[]
  skills: Skill[]
  skillSections: SkillSection[]
  certifications: Certification[]
  educations: Education[]
  contactInfo: ContactInfo | null
  
  // Actions
  setHomeData: (data: HomeData | null) => void
  setAboutData: (data: AboutData | null) => void
  setExperiences: (data: Experience[]) => void
  setProjects: (data: Project[]) => void
  setSkills: (data: Skill[]) => void
  setSkillSections: (data: SkillSection[]) => void
  setCertifications: (data: Certification[]) => void
  setEducations: (data: Education[]) => void
  setContactInfo: (data: ContactInfo | null) => void
}

export const usePortfolioStore = create<PortfolioState>((set) => ({
  // Initial state
  homeData: null,
  aboutData: null,
  experiences: [],
  projects: [],
  skills: [],
  skillSections: [],
  certifications: [],
  educations: [],
  contactInfo: null,
  
  // Actions - simple setters
  setHomeData: (homeData) => set({ homeData }),
  setAboutData: (aboutData) => set({ aboutData }),
  setExperiences: (experiences) => set({ experiences }),
  setProjects: (projects) => set({ projects }),
  setSkills: (skills) => set({ skills }),
  setSkillSections: (skillSections) => set({ skillSections }),
  setCertifications: (certifications) => set({ certifications }),
  setEducations: (educations) => set({ educations }),
  setContactInfo: (contactInfo) => set({ contactInfo }),
}))
```

**Usage in Component:**

```typescript
import { usePortfolioStore } from '../store/portfolioStore'
import { portfolioService } from '../../core/usecases'

const ProjectsSection = () => {
  const projects = usePortfolioStore((state) => state.projects)
  const setProjects = usePortfolioStore((state) => state.setProjects)
  
  useEffect(() => {
    const fetchProjects = async () => {
      const data = await portfolioService.getAllProjects()
      setProjects(data)
    }
    
    fetchProjects()
  }, [setProjects])
  
  return (
    <div>
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  )
}
```

### Auth Store

**From `src/presentation/store/authStore.ts`:**

```typescript
import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import type { User } from '../../shared/types'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  
  setUser: (user: User | null) => void
  clearAuth: () => void
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        isAuthenticated: false,
        
        setUser: (user) => set({
          user,
          isAuthenticated: !!user,
        }),
        
        clearAuth: () => set({
          user: null,
          isAuthenticated: false,
        }),
      }),
      {
        name: 'auth-storage',
      }
    )
  )
)
```

---

## 🔥 Advanced Patterns

### Immer Middleware (Immutable Updates Made Easy)

```typescript
import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

interface TodoStore {
  todos: Todo[]
  addTodo: (text: string) => void
  toggleTodo: (id: string) => void
}

export const useTodoStore = create<TodoStore>()(
  immer((set) => ({
    todos: [],
    
    // With immer, you can mutate state directly!
    addTodo: (text) =>
      set((state) => {
        state.todos.push({
          id: Date.now().toString(),
          text,
          completed: false,
        })
      }),
    
    toggleTodo: (id) =>
      set((state) => {
        const todo = state.todos.find((t) => t.id === id)
        if (todo) {
          todo.completed = !todo.completed
        }
      }),
  }))
)
```

### Subscriptions (Listen to Changes)

```typescript
// Subscribe to store changes
const unsubscribe = useCartStore.subscribe(
  (state) => state.items,
  (items, prevItems) => {
    console.log('Cart items changed:', items)
    // Save to localStorage, analytics, etc.
  }
)

// Cleanup
useEffect(() => {
  return () => unsubscribe()
}, [])
```

---

## ✅ Best Practices

1. **Keep stores focused** - One store per domain
2. **Use TypeScript** - Full type safety
3. **Selective subscriptions** - Only subscribe to what you need
4. **Immutable updates** - Or use Immer middleware
5. **Handle loading & errors** - Always track async state
6. **Use persist middleware** - For data that should survive refreshes
7. **DevTools in development** - Easier debugging

---

## 🚫 Anti-Patterns

```typescript
// ❌ Storing derived state
interface BadStore {
  todos: Todo[]
  completedTodos: Todo[] // Derived - should be computed!
  activeTodos: Todo[] // Derived - should be computed!
}

// ✅ Compute derived state
interface GoodStore {
  todos: Todo[]
  get completedTodos(): Todo[] {
    return this.todos.filter(t => t.completed)
  }
}

// ❌ Mutating state directly
set((state) => {
  state.count++ // NO! Doesn't trigger re-render
  return state
})

// ✅ Return new state
set((state) => ({
  count: state.count + 1
}))

// ❌ Subscribe to entire store
const store = useStore() // Re-renders on ANY change

// ✅ Subscribe to specific values
const count = useStore((state) => state.count)
```

---

## 🎓 Practice Exercises

1. Create a user management store with CRUD operations
2. Build a shopping cart store with persistence
3. Implement a notification store with auto-dismiss
4. Create a form store with validation
5. Build a settings store with nested updates

---

**Next:** [Custom Hooks Mastery →](./07-CUSTOM-HOOKS.md)
