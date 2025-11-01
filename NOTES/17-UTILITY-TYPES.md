# TypeScript Utility Types

> Master built-in utility types and create your own type transformations

## 📚 Table of Contents
1. [Basic Utility Types](#basic-utility-types)
2. [Advanced Utility Types](#advanced-utility-types)
3. [Custom Utility Types](#custom-utility-types)
4. [Real-World Applications](#real-world-applications)
5. [Type Manipulation](#type-manipulation)

---

## 🔧 Basic Utility Types

### Partial<T> - Make All Properties Optional

```typescript
interface User {
  id: string
  name: string
  email: string
  age: number
}

// All properties become optional
type PartialUser = Partial<User>
// { id?: string; name?: string; email?: string; age?: number }

// Use case: Update functions
const updateUser = (id: string, updates: Partial<User>) => {
  // Only pass the fields you want to update
}

updateUser('123', { name: 'John' }) // ✅ Valid
updateUser('123', { name: 'John', age: 30 }) // ✅ Valid
```

### Required<T> - Make All Properties Required

```typescript
interface Config {
  apiUrl?: string
  timeout?: number
  retries?: number
}

// All properties become required
type RequiredConfig = Required<Config>
// { apiUrl: string; timeout: number; retries: number }

const validateConfig = (config: Required<Config>) => {
  // All fields guaranteed to exist
  console.log(config.apiUrl.toUpperCase()) // ✅ Safe
}
```

### Readonly<T> - Make All Properties Read-Only

```typescript
interface Point {
  x: number
  y: number
}

const origin: Readonly<Point> = { x: 0, y: 0 }

origin.x = 10 // ❌ Error: Cannot assign to 'x' because it is a read-only property

// Use case: Immutable data
const processPoint = (point: Readonly<Point>) => {
  // point.x = 10 // ❌ Cannot modify
  return { x: point.x + 1, y: point.y + 1 } // ✅ Return new object
}
```

### Record<K, T> - Create Object Type with Specific Keys

```typescript
// Create object with string keys and User values
type UsersById = Record<string, User>

const users: UsersById = {
  'user1': { id: 'user1', name: 'Alice', email: 'alice@example.com', age: 25 },
  'user2': { id: 'user2', name: 'Bob', email: 'bob@example.com', age: 30 }
}

// With literal keys
type Status = 'idle' | 'loading' | 'success' | 'error'
type StatusMessages = Record<Status, string>

const messages: StatusMessages = {
  idle: 'Ready to start',
  loading: 'Please wait...',
  success: 'Operation completed!',
  error: 'Something went wrong'
}
```

### Pick<T, K> - Select Specific Properties

```typescript
interface User {
  id: string
  name: string
  email: string
  password: string
  age: number
}

// Only pick specific fields
type UserPreview = Pick<User, 'id' | 'name' | 'email'>
// { id: string; name: string; email: string }

// Use case: API responses (exclude sensitive data)
const getUserPreview = (user: User): UserPreview => {
  return {
    id: user.id,
    name: user.name,
    email: user.email
  }
}
```

### Omit<T, K> - Exclude Specific Properties

```typescript
// Exclude password from User type
type PublicUser = Omit<User, 'password'>
// { id: string; name: string; email: string; age: number }

// Multiple fields
type UserBasics = Omit<User, 'password' | 'email'>
// { id: string; name: string; age: number }

// Use case: Form data (exclude auto-generated fields)
type UserFormData = Omit<User, 'id'>

const createUser = (data: UserFormData) => {
  const id = generateId()
  return { id, ...data }
}
```

---

## 🚀 Advanced Utility Types

### Exclude<T, U> - Exclude Types from Union

```typescript
type Status = 'idle' | 'loading' | 'success' | 'error'

// Exclude specific types
type NonErrorStatus = Exclude<Status, 'error'>
// 'idle' | 'loading' | 'success'

type NonLoadingStatus = Exclude<Status, 'loading' | 'error'>
// 'idle' | 'success'

// Use case: Filter out specific event types
type MouseEvent = 'click' | 'mousedown' | 'mouseup' | 'mousemove'
type ClickEvents = Exclude<MouseEvent, 'mousemove'>
```

### Extract<T, U> - Extract Types from Union

```typescript
type Event = 
  | { type: 'click'; x: number; y: number }
  | { type: 'keypress'; key: string }
  | { type: 'focus' }
  | { type: 'blur' }

// Extract only mouse-related events
type MouseOnlyEvent = Extract<Event, { type: 'click' }>
// { type: 'click'; x: number; y: number }

// Extract events with payload
type EventWithData = Extract<Event, { key: any } | { x: any }>
```

### NonNullable<T> - Remove null and undefined

```typescript
type MaybeString = string | null | undefined

type DefiniteString = NonNullable<MaybeString>
// string

// Use case: Filter function results
const filterNullable = <T>(array: (T | null | undefined)[]): NonNullable<T>[] => {
  return array.filter((item): item is NonNullable<T> => item != null)
}

const values = [1, null, 2, undefined, 3]
const filtered = filterNullable(values) // number[]
```

### ReturnType<T> - Get Function Return Type

```typescript
const getUser = () => {
  return {
    id: '123',
    name: 'Alice',
    email: 'alice@example.com'
  }
}

// Extract return type automatically
type User = ReturnType<typeof getUser>
// { id: string; name: string; email: string }

// Use case: Don't repeat yourself
const processUser = (user: ReturnType<typeof getUser>) => {
  console.log(user.name)
}
```

### Parameters<T> - Get Function Parameter Types

```typescript
const createProject = (
  name: string,
  description: string,
  technologies: string[]
) => {
  return { name, description, technologies }
}

// Extract parameter types as tuple
type ProjectParams = Parameters<typeof createProject>
// [string, string, string[]]

// Use as spread parameters
const createMultipleProjects = (...params: ProjectParams[]) => {
  return params.map(p => createProject(...p))
}
```

### Awaited<T> - Unwrap Promise Type

```typescript
type PromiseUser = Promise<User>

type UnwrappedUser = Awaited<PromiseUser>
// User

// Use case: Async function return types
const fetchUser = async (): Promise<User> => {
  const response = await fetch('/api/user')
  return response.json()
}

type FetchedUser = Awaited<ReturnType<typeof fetchUser>>
// User
```

---

## 🛠️ Custom Utility Types

### DeepPartial - Recursively Optional

```typescript
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object
    ? DeepPartial<T[P]>
    : T[P]
}

interface Project {
  id: string
  name: string
  details: {
    description: string
    tech: string[]
  }
}

// All nested properties are optional
type PartialProject = DeepPartial<Project>
// {
//   id?: string
//   name?: string
//   details?: {
//     description?: string
//     tech?: string[]
//   }
// }

const updateProject = (id: string, updates: DeepPartial<Project>) => {
  // Can update any nested property
}

updateProject('123', {
  details: { description: 'New description' }
})
```

### DeepReadonly - Recursively Immutable

```typescript
type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object
    ? DeepReadonly<T[P]>
    : T[P]
}

interface Config {
  api: {
    url: string
    timeout: number
  }
  features: string[]
}

const config: DeepReadonly<Config> = {
  api: { url: 'https://api.example.com', timeout: 5000 },
  features: ['auth', 'search']
}

config.api.url = 'new-url' // ❌ Error: read-only
config.features.push('newFeature') // ❌ Error: read-only
```

### Nullable - Add null to Type

```typescript
type Nullable<T> = T | null

interface User {
  id: string
  name: string
  avatar: Nullable<string> // string | null
}

const user: User = {
  id: '123',
  name: 'Alice',
  avatar: null // ✅ Valid
}
```

### Mutable - Remove Readonly

```typescript
type Mutable<T> = {
  -readonly [P in keyof T]: T[P]
}

interface ReadonlyUser {
  readonly id: string
  readonly name: string
}

type EditableUser = Mutable<ReadonlyUser>
// { id: string; name: string }

const user: EditableUser = { id: '123', name: 'Alice' }
user.name = 'Bob' // ✅ Valid
```

### PickByType - Pick Properties by Value Type

```typescript
type PickByType<T, U> = {
  [P in keyof T as T[P] extends U ? P : never]: T[P]
}

interface User {
  id: string
  name: string
  age: number
  isActive: boolean
  createdAt: Date
}

// Pick only string properties
type StringProps = PickByType<User, string>
// { id: string; name: string }

// Pick only number properties
type NumberProps = PickByType<User, number>
// { age: number }
```

### OmitByType - Omit Properties by Value Type

```typescript
type OmitByType<T, U> = {
  [P in keyof T as T[P] extends U ? never : P]: T[P]
}

// Omit all string properties
type NonStringProps = OmitByType<User, string>
// { age: number; isActive: boolean; createdAt: Date }
```

---

## 🎯 Real-World Applications

### API Response Types

```typescript
// Backend response with metadata
interface ApiResponse<T> {
  data: T
  status: number
  message: string
}

// Extract just the data
type ExtractData<T> = T extends ApiResponse<infer U> ? U : never

type UserResponse = ApiResponse<User>
type UserData = ExtractData<UserResponse> // User

// Generic fetch function
const fetchApi = async <T>(url: string): Promise<ApiResponse<T>> => {
  const response = await fetch(url)
  return response.json()
}

const users = await fetchApi<User[]>('/api/users')
// users: ApiResponse<User[]>
```

### Form State Types

```typescript
interface FormState<T> {
  values: T
  errors: Partial<Record<keyof T, string>>
  touched: Partial<Record<keyof T, boolean>>
  isSubmitting: boolean
}

interface LoginForm {
  email: string
  password: string
}

const formState: FormState<LoginForm> = {
  values: { email: '', password: '' },
  errors: {},
  touched: {},
  isSubmitting: false
}

// Helper to create initial state
type InitialFormState<T> = Pick<FormState<T>, 'values'> & {
  errors?: FormState<T>['errors']
  touched?: FormState<T>['touched']
}
```

### Event Handler Types

```typescript
// Generic event handler type
type EventHandler<T = void> = (event: T) => void

interface ButtonProps {
  onClick: EventHandler<React.MouseEvent<HTMLButtonElement>>
  onDoubleClick?: EventHandler<React.MouseEvent<HTMLButtonElement>>
}

// Form event handlers
type ChangeHandler = EventHandler<React.ChangeEvent<HTMLInputElement>>
type SubmitHandler = EventHandler<React.FormEvent<HTMLFormElement>>

const handleChange: ChangeHandler = (e) => {
  console.log(e.target.value)
}

const handleSubmit: SubmitHandler = (e) => {
  e.preventDefault()
}
```

### Repository Pattern Types

```typescript
// Generic repository interface
interface Repository<T> {
  findById(id: string): Promise<T | null>
  findAll(): Promise<T[]>
  create(data: Omit<T, 'id'>): Promise<T>
  update(id: string, data: Partial<T>): Promise<T>
  delete(id: string): Promise<void>
}

// Extract create data type (without id)
type CreateData<T> = T extends { id: any }
  ? Omit<T, 'id'>
  : T

// Extract update data type (partial)
type UpdateData<T> = Partial<T>

// Usage
class UserRepository implements Repository<User> {
  async create(data: CreateData<User>) {
    // data doesn't have 'id'
    const id = generateId()
    return { id, ...data }
  }
  
  async update(id: string, data: UpdateData<User>) {
    // data is Partial<User>
    return { id, ...data }
  }
  
  // ... other methods
}
```

### Zustand Store Types

```typescript
// Real example from portfolio
interface PortfolioState {
  projects: Project[]
  skills: Skill[]
  experiences: Experience[]
  isLoading: boolean
  error: string | null
}

interface PortfolioActions {
  fetchProjects: () => Promise<void>
  addProject: (project: Omit<Project, 'id'>) => Promise<void>
  updateProject: (id: string, data: Partial<Project>) => Promise<void>
  deleteProject: (id: string) => Promise<void>
}

type PortfolioStore = PortfolioState & PortfolioActions

// Extract only state (no actions)
type StateOnly = Omit<PortfolioStore, keyof PortfolioActions>

// Extract only actions
type ActionsOnly = Pick<PortfolioStore, keyof PortfolioActions>
```

---

## 🔀 Type Manipulation

### Mapped Types

```typescript
// Make all properties strings
type Stringify<T> = {
  [P in keyof T]: string
}

interface User {
  id: number
  name: string
  age: number
}

type StringUser = Stringify<User>
// { id: string; name: string; age: string }

// Add prefix to all keys
type Prefixed<T, P extends string> = {
  [K in keyof T as `${P}${string & K}`]: T[K]
}

type PrefixedUser = Prefixed<User, 'user_'>
// { user_id: number; user_name: string; user_age: number }
```

### Conditional Types

```typescript
// If T is string, return string[], else return T
type ArrayIfString<T> = T extends string ? string[] : T

type A = ArrayIfString<string> // string[]
type B = ArrayIfString<number> // number

// Nested conditional
type TypeName<T> =
  T extends string ? 'string' :
  T extends number ? 'number' :
  T extends boolean ? 'boolean' :
  T extends undefined ? 'undefined' :
  T extends Function ? 'function' :
  'object'

type T1 = TypeName<string> // 'string'
type T2 = TypeName<42> // 'number'
```

### Template Literal Types

```typescript
// Create union of event names
type EventName = `on${Capitalize<'click' | 'focus' | 'blur'>}`
// 'onClick' | 'onFocus' | 'onBlur'

// Create prop types from events
type EventHandlers = {
  [K in EventName]: () => void
}
// {
//   onClick: () => void
//   onFocus: () => void
//   onBlur: () => void
// }

// Create getter/setter names
type GetterSetter<T extends string> = 
  | `get${Capitalize<T>}`
  | `set${Capitalize<T>}`

type UserGetterSetter = GetterSetter<'name' | 'age'>
// 'getName' | 'setName' | 'getAge' | 'setAge'
```

### Infer Keyword

```typescript
// Extract array element type
type ArrayElement<T> = T extends (infer U)[] ? U : never

type Numbers = ArrayElement<number[]> // number
type Strings = ArrayElement<string[]> // string

// Extract Promise resolved type
type PromiseValue<T> = T extends Promise<infer U> ? U : never

type Value = PromiseValue<Promise<string>> // string

// Extract function return type (manual ReturnType)
type GetReturnType<T> = T extends (...args: any[]) => infer R ? R : never

const getValue = () => ({ id: 1, name: 'test' })
type Return = GetReturnType<typeof getValue>
// { id: number; name: string }
```

---

## 💡 Practical Patterns

### Type-Safe Object Keys

```typescript
// Get all keys as union type
type Keys<T> = keyof T

interface User {
  id: string
  name: string
  email: string
}

type UserKeys = Keys<User> // 'id' | 'name' | 'email'

// Type-safe Object.keys
const getTypedKeys = <T extends object>(obj: T): (keyof T)[] => {
  return Object.keys(obj) as (keyof T)[]
}

const user: User = { id: '1', name: 'Alice', email: 'alice@example.com' }
const keys = getTypedKeys(user) // ('id' | 'name' | 'email')[]
```

### Type-Safe Pick Function

```typescript
const pick = <T, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> => {
  const result = {} as Pick<T, K>
  
  keys.forEach(key => {
    result[key] = obj[key]
  })
  
  return result
}

const user = { id: '1', name: 'Alice', email: 'alice@example.com', age: 25 }
const picked = pick(user, ['id', 'name'])
// { id: string; name: string }
```

### Type-Safe Omit Function

```typescript
const omit = <T, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> => {
  const result = { ...obj }
  
  keys.forEach(key => {
    delete result[key]
  })
  
  return result
}

const user = { id: '1', name: 'Alice', password: 'secret', age: 25 }
const safe = omit(user, ['password'])
// { id: string; name: string; age: number }
```

---

## ✅ Best Practices

1. **Use built-in utility types** before creating custom ones
2. **Combine utility types** for complex transformations
3. **Name custom types clearly** (e.g., `DeepPartial` not just `Deep`)
4. **Document complex types** with comments
5. **Keep types DRY** - reuse and compose types
6. **Use `infer` carefully** - it can be hard to understand
7. **Prefer `unknown` over `any`** in generic constraints
8. **Test your utility types** with type assertions

---

## 🚫 Anti-Patterns

```typescript
// ❌ Not using utility types
interface UpdateUser {
  id?: string
  name?: string
  email?: string
  age?: number
}

// ✅ Use Partial
type UpdateUser = Partial<User>

// ❌ Manually excluding properties
type PublicUser = {
  id: string
  name: string
  email: string
}

// ✅ Use Omit
type PublicUser = Omit<User, 'password'>

// ❌ Any in utility types
type Values<T> = T[keyof T]
const getValue = (obj: any, key: string) => obj[key]

// ✅ Generic constraints
const getValue = <T, K extends keyof T>(obj: T, key: K): T[K] => obj[key]
```

---

## 🎓 Practice Exercises

1. Create a `DeepRequired` type that makes all nested properties required
2. Build a `FunctionKeys<T>` type that extracts only function property names
3. Create a `PromisifyAll<T>` type that wraps all methods in Promises
4. Build a `StrictOmit<T, K>` that errors if K is not in T
5. Create a `Flatten<T>` type that flattens nested objects

---

**Next:** [Advanced Types & Patterns →](./18-ADVANCED-TYPES.md)
