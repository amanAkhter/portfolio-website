# Generics in React

> Master TypeScript generics to build reusable, type-safe React components

## 📚 Table of Contents
1. [What are Generics?](#what-are-generics)
2. [Generic Functions](#generic-functions)
3. [Generic Components](#generic-components)
4. [Generic Hooks](#generic-hooks)
5. [Generic Interfaces](#generic-interfaces)
6. [Real-World Examples](#real-world-examples)
7. [Advanced Patterns](#advanced-patterns)

---

## 🎯 What are Generics?

**Generics allow you to write reusable code that works with multiple types while maintaining type safety.**

### Without Generics (Bad)

```typescript
// Separate function for each type
function getFirstNumber(arr: number[]): number | undefined {
  return arr[0]
}

function getFirstString(arr: string[]): string | undefined {
  return arr[0]
}

function getFirstUser(arr: User[]): User | undefined {
  return arr[0]
}

// Or lose type safety
function getFirst(arr: any[]): any {
  return arr[0] // Type safety lost!
}
```

### With Generics (Good)

```typescript
// One function, multiple types, fully type-safe!
function getFirst<T>(arr: T[]): T | undefined {
  return arr[0]
}

// Usage - TypeScript infers types
const firstNumber = getFirst([1, 2, 3]) // type: number | undefined
const firstString = getFirst(['a', 'b']) // type: string | undefined
const firstUser = getFirst(users) // type: User | undefined

// Or explicitly specify type
const first = getFirst<string>(['hello'])
```

---

## 🔧 Generic Functions

### Basic Generic Function

```typescript
// Identity function - returns what you pass in
function identity<T>(value: T): T {
  return value
}

const num = identity(42) // type: number
const str = identity('hello') // type: string
const obj = identity({ name: 'John' }) // type: { name: string }
```

### Multiple Type Parameters

```typescript
function pair<T, U>(first: T, second: U): [T, U] {
  return [first, second]
}

const result = pair('age', 25) // type: [string, number]
const result2 = pair<string, boolean>('active', true)
```

### Generic Constraints

```typescript
// T must have a 'length' property
function getLength<T extends { length: number }>(item: T): number {
  return item.length
}

getLength('hello') // OK - string has length
getLength([1, 2, 3]) // OK - array has length
getLength({ length: 10 }) // OK - has length
// getLength(42) // ERROR - number doesn't have length

// T must be an object type
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key]
}

const user = { name: 'John', age: 30 }
const name = getProperty(user, 'name') // type: string
const age = getProperty(user, 'age') // type: number
// getProperty(user, 'email') // ERROR - 'email' doesn't exist
```

---

## 🎨 Generic Components

### Generic List Component

```typescript
interface ListProps<T> {
  items: T[]
  renderItem: (item: T, index: number) => React.ReactNode
  keyExtractor: (item: T) => string | number
  emptyMessage?: string
}

function List<T>({
  items,
  renderItem,
  keyExtractor,
  emptyMessage = 'No items',
}: ListProps<T>) {
  if (items.length === 0) {
    return <div className="empty">{emptyMessage}</div>
  }

  return (
    <div className="list">
      {items.map((item, index) => (
        <div key={keyExtractor(item)} className="list-item">
          {renderItem(item, index)}
        </div>
      ))}
    </div>
  )
}

// Usage with different types
interface User {
  id: string
  name: string
  email: string
}

interface Product {
  id: string
  title: string
  price: number
}

// Users
<List<User>
  items={users}
  keyExtractor={(user) => user.id}
  renderItem={(user) => (
    <div>
      <h3>{user.name}</h3>
      <p>{user.email}</p>
    </div>
  )}
/>

// Products
<List<Product>
  items={products}
  keyExtractor={(product) => product.id}
  renderItem={(product) => (
    <div>
      <h3>{product.title}</h3>
      <p>${product.price}</p>
    </div>
  )}
/>
```

### Generic Table Component

```typescript
interface Column<T> {
  key: keyof T
  label: string
  render?: (value: T[keyof T], item: T) => React.ReactNode
}

interface TableProps<T> {
  data: T[]
  columns: Column<T>[]
  onRowClick?: (item: T) => void
}

function Table<T extends { id: string | number }>({
  data,
  columns,
  onRowClick,
}: TableProps<T>) {
  return (
    <table>
      <thead>
        <tr>
          {columns.map((column) => (
            <th key={String(column.key)}>{column.label}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((item) => (
          <tr
            key={item.id}
            onClick={() => onRowClick?.(item)}
            style={{ cursor: onRowClick ? 'pointer' : 'default' }}
          >
            {columns.map((column) => (
              <td key={String(column.key)}>
                {column.render
                  ? column.render(item[column.key], item)
                  : String(item[column.key])}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

// Usage
interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'user'
  active: boolean
}

<Table<User>
  data={users}
  columns={[
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    {
      key: 'role',
      label: 'Role',
      render: (role) => <Badge variant={role === 'admin' ? 'primary' : 'secondary'}>{role}</Badge>,
    },
    {
      key: 'active',
      label: 'Status',
      render: (active) => <span className={active ? 'text-green' : 'text-red'}>{active ? 'Active' : 'Inactive'}</span>,
    },
  ]}
  onRowClick={(user) => console.log('Clicked:', user.name)}
/>
```

### Generic Form Component

```typescript
interface FormProps<T> {
  initialValues: T
  onSubmit: (values: T) => void | Promise<void>
  children: (props: {
    values: T
    handleChange: (key: keyof T, value: any) => void
    handleSubmit: (e: React.FormEvent) => void
    isSubmitting: boolean
  }) => React.ReactNode
}

function Form<T extends Record<string, any>>({
  initialValues,
  onSubmit,
  children,
}: FormProps<T>) {
  const [values, setValues] = useState<T>(initialValues)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (key: keyof T, value: any) => {
    setValues((prev) => ({ ...prev, [key]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      await onSubmit(values)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      {children({
        values,
        handleChange,
        handleSubmit,
        isSubmitting,
      })}
    </>
  )
}

// Usage
interface LoginForm {
  email: string
  password: string
}

<Form<LoginForm>
  initialValues={{ email: '', password: '' }}
  onSubmit={async (values) => {
    await api.login(values.email, values.password)
  }}
>
  {({ values, handleChange, handleSubmit, isSubmitting }) => (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={values.email}
        onChange={(e) => handleChange('email', e.target.value)}
      />
      <input
        type="password"
        value={values.password}
        onChange={(e) => handleChange('password', e.target.value)}
      />
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Logging in...' : 'Login'}
      </button>
    </form>
  )}
</Form>
```

---

## 🪝 Generic Hooks

### Generic Data Fetching Hook

```typescript
interface FetchState<T> {
  data: T | null
  loading: boolean
  error: Error | null
}

function useFetch<T>(url: string): FetchState<T> & { refetch: () => void } {
  const [state, setState] = useState<FetchState<T>>({
    data: null,
    loading: true,
    error: null,
  })

  const fetchData = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }))
    
    try {
      const response = await fetch(url)
      const data: T = await response.json()
      setState({ data, loading: false, error: null })
    } catch (error) {
      setState({
        data: null,
        loading: false,
        error: error instanceof Error ? error : new Error('Unknown error'),
      })
    }
  }, [url])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return { ...state, refetch: fetchData }
}

// Usage - Type inference!
interface User {
  id: string
  name: string
}

const UserProfile = ({ userId }: { userId: string }) => {
  const { data: user, loading, error } = useFetch<User>(`/api/users/${userId}`)
  
  // 'user' is typed as User | null
  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>
  if (!user) return <div>No user</div>
  
  return (
    <div>
      <h1>{user.name}</h1> {/* TypeScript knows 'name' exists! */}
    </div>
  )
}
```

### Generic Local Storage Hook

```typescript
function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.error(error)
      return initialValue
    }
  })

  const setValue = (value: T | ((prev: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      window.localStorage.setItem(key, JSON.stringify(valueToStore))
    } catch (error) {
      console.error(error)
    }
  }

  return [storedValue, setValue]
}

// Usage with different types
const [theme, setTheme] = useLocalStorage<'light' | 'dark'>('theme', 'light')
const [user, setUser] = useLocalStorage<User | null>('user', null)
const [settings, setSettings] = useLocalStorage<AppSettings>('settings', defaultSettings)
```

### Generic Array Hook

```typescript
function useArray<T>(initialValue: T[] = []) {
  const [array, setArray] = useState<T[]>(initialValue)

  const push = (item: T) => {
    setArray((prev) => [...prev, item])
  }

  const remove = (index: number) => {
    setArray((prev) => prev.filter((_, i) => i !== index))
  }

  const update = (index: number, item: T) => {
    setArray((prev) => prev.map((val, i) => (i === index ? item : val)))
  }

  const clear = () => {
    setArray([])
  }

  const filter = (callback: (item: T) => boolean) => {
    setArray((prev) => prev.filter(callback))
  }

  return {
    array,
    set: setArray,
    push,
    remove,
    update,
    clear,
    filter,
  }
}

// Usage
interface Todo {
  id: string
  text: string
  completed: boolean
}

const TodoList = () => {
  const { array: todos, push, remove, update } = useArray<Todo>([])

  const addTodo = (text: string) => {
    push({
      id: Date.now().toString(),
      text,
      completed: false,
    })
  }

  const toggleTodo = (index: number) => {
    const todo = todos[index]
    update(index, { ...todo, completed: !todo.completed })
  }

  return (
    <div>
      {todos.map((todo, index) => (
        <div key={todo.id}>
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={() => toggleTodo(index)}
          />
          <span>{todo.text}</span>
          <button onClick={() => remove(index)}>Delete</button>
        </div>
      ))}
    </div>
  )
}
```

---

## 📦 Generic Interfaces

### Repository Pattern with Generics

```typescript
// Generic repository interface
interface IRepository<T> {
  getAll(): Promise<T[]>
  getById(id: string): Promise<T | null>
  create(data: Omit<T, 'id'>): Promise<T>
  update(id: string, data: Partial<T>): Promise<T>
  delete(id: string): Promise<void>
}

// Implement for any type
class UserRepository implements IRepository<User> {
  async getAll(): Promise<User[]> {
    // Implementation
  }
  
  async getById(id: string): Promise<User | null> {
    // Implementation
  }
  
  // ... other methods
}

class ProductRepository implements IRepository<Product> {
  async getAll(): Promise<Product[]> {
    // Implementation
  }
  
  // ... other methods
}

// Generic service
class DataService<T extends { id: string }> {
  constructor(private repository: IRepository<T>) {}

  async findById(id: string): Promise<T> {
    const item = await this.repository.getById(id)
    if (!item) {
      throw new Error(`Item with id ${id} not found`)
    }
    return item
  }

  async searchByField<K extends keyof T>(
    field: K,
    value: T[K]
  ): Promise<T[]> {
    const all = await this.repository.getAll()
    return all.filter((item) => item[field] === value)
  }
}

// Usage
const userService = new DataService<User>(new UserRepository())
const productService = new DataService<Product>(new ProductRepository())
```

---

## 🎯 Real-World Examples

### DataProvider Component (Real from Portfolio concept)

```typescript
interface DataProviderProps<T> {
  fetchData: () => Promise<T>
  children: (props: {
    data: T | null
    loading: boolean
    error: Error | null
    refetch: () => void
  }) => React.ReactNode
}

function DataProvider<T>({ fetchData, children }: DataProviderProps<T>) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const loadData = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await fetchData()
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'))
    } finally {
      setLoading(false)
    }
  }, [fetchData])

  useEffect(() => {
    loadData()
  }, [loadData])

  return <>{children({ data, loading, error, refetch: loadData })}</>
}

// Usage
interface PortfolioData {
  projects: Project[]
  experiences: Experience[]
}

<DataProvider<PortfolioData>
  fetchData={async () => {
    const [projects, experiences] = await Promise.all([
      portfolioService.getAllProjects(),
      portfolioService.getAllExperiences(),
    ])
    return { projects, experiences }
  }}
>
  {({ data, loading, error, refetch }) => {
    if (loading) return <LoadingScreen />
    if (error) return <ErrorScreen message={error.message} onRetry={refetch} />
    if (!data) return <div>No data</div>
    
    return (
      <div>
        <Projects projects={data.projects} />
        <Experience experiences={data.experiences} />
      </div>
    )
  }}
</DataProvider>
```

---

## 🚀 Advanced Patterns

### Conditional Types with Generics

```typescript
type AsyncReturnType<T> = T extends (...args: any[]) => Promise<infer R>
  ? R
  : never

type Result = AsyncReturnType<() => Promise<User>> // Result = User

// Generic with conditional types
type WithId<T> = T extends { id: any } ? T : T & { id: string }

interface UserWithoutId {
  name: string
  email: string
}

type User = WithId<UserWithoutId> // { name: string, email: string, id: string }
```

### Mapped Types with Generics

```typescript
// Make all properties optional and nullable
type Partial<T> = {
  [P in keyof T]?: T[P] | null
}

// Make all properties readonly
type Readonly<T> = {
  readonly [P in keyof T]: T[P]
}

// Pick specific properties
type Pick<T, K extends keyof T> = {
  [P in K]: T[P]
}

// Usage
interface User {
  id: string
  name: string
  email: string
  age: number
}

type PartialUser = Partial<User>
// { id?: string | null, name?: string | null, ... }

type ReadonlyUser = Readonly<User>
// { readonly id: string, readonly name: string, ... }

type UserPreview = Pick<User, 'id' | 'name'>
// { id: string, name: string }
```

---

## ✅ Best Practices

1. **Use generics for reusable code** - DRY principle
2. **Constrain types when needed** - `T extends SomeType`
3. **Let TypeScript infer when possible** - Don't over-specify
4. **Use meaningful type parameter names** - `TData`, `TError` over `T`, `U`
5. **Keep it simple** - Don't over-engineer
6. **Document generic parameters** - JSDoc comments

---

## 🚫 Anti-Patterns

```typescript
// ❌ Too many generic parameters
function foo<T, U, V, W, X, Y>(a: T, b: U, c: V, d: W, e: X, f: Y) {
  // Hard to understand
}

// ✅ Group related parameters
interface Options<T> {
  data: T
  formatter: (item: T) => string
}

function foo<T>(options: Options<T>) {
  // Much cleaner
}

// ❌ Unnecessary generics
function getNumber<T>(value: T): T {
  return value // T is useless here
}

// ✅ Only use when needed
function getNumber(value: number): number {
  return value
}
```

---

## 🎓 Practice Exercises

1. Create a generic `Pagination` component
2. Build a generic `useAPI` hook with caching
3. Implement a generic `Select` component with search
4. Create a generic `DataGrid` with sorting and filtering
5. Build a generic form validation hook

---

**Next:** [Utility Types & Type Helpers →](./17-UTILITY-TYPES.md)
