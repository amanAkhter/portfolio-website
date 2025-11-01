# TypeScript Fundamentals

## 📖 Table of Contents
1. [Basic Types](#basic-types)
2. [Interfaces vs Types](#interfaces-vs-types)
3. [Functions](#functions)
4. [Generics](#generics)
5. [Union and Intersection Types](#union-and-intersection-types)
6. [Type Guards](#type-guards)
7. [Utility Types](#utility-types)
8. [Portfolio Examples](#portfolio-examples)

---

## Basic Types

### Primitive Types

```typescript
// String
let name: string = "John Doe"
const greeting: string = `Hello, ${name}`

// Number
let age: number = 25
let price: number = 99.99
let hex: number = 0xf00d

// Boolean
let isActive: boolean = true
let hasAccess: boolean = false

// Null and Undefined
let nothing: null = null
let notDefined: undefined = undefined

// Any (avoid when possible!)
let anything: any = "can be anything"
anything = 42
anything = true

// Unknown (safer than any)
let uncertain: unknown = "unknown value"
// Must check type before using
if (typeof uncertain === "string") {
  console.log(uncertain.toUpperCase())
}

// Void (for functions that return nothing)
function logMessage(message: string): void {
  console.log(message)
  // No return statement
}

// Never (for functions that never return)
function throwError(message: string): never {
  throw new Error(message)
}
```

### Arrays and Tuples

```typescript
// Array of strings
let names: string[] = ["Alice", "Bob", "Charlie"]
let names2: Array<string> = ["Alice", "Bob", "Charlie"]

// Array of numbers
let numbers: number[] = [1, 2, 3, 4, 5]

// Array of objects
interface User {
  id: number
  name: string
}
let users: User[] = [
  { id: 1, name: "Alice" },
  { id: 2, name: "Bob" }
]

// Tuple (fixed-length array with specific types)
let person: [string, number] = ["John", 25]
let coordinate: [number, number] = [10, 20]

// Tuple with optional elements
let point: [number, number, number?] = [10, 20]
```

### Object Types

```typescript
// Object type
let user: {
  name: string
  age: number
  email?: string // Optional property
} = {
  name: "John",
  age: 25
}

// Readonly properties
let readonlyUser: {
  readonly id: number
  name: string
} = {
  id: 1,
  name: "John"
}
// readonlyUser.id = 2 // Error!

// Index signatures
interface StringMap {
  [key: string]: string
}

let config: StringMap = {
  apiUrl: "https://api.example.com",
  appName: "My App"
}
```

---

## Interfaces vs Types

### Interfaces

```typescript
// Basic interface
interface Person {
  name: string
  age: number
}

// Interface with optional properties
interface Employee {
  id: number
  name: string
  email?: string // Optional
  readonly department: string // Readonly
}

// Interface with methods
interface Calculator {
  add(a: number, b: number): number
  subtract(a: number, b: number): number
}

// Extending interfaces
interface Manager extends Employee {
  teamSize: number
  subordinates: Employee[]
}

// Multiple inheritance
interface Animal {
  name: string
}

interface Flyable {
  fly(): void
}

interface Bird extends Animal, Flyable {
  wingspan: number
}
```

### Type Aliases

```typescript
// Basic type alias
type ID = string | number

// Object type
type Point = {
  x: number
  y: number
}

// Function type
type MathOperation = (a: number, b: number) => number

// Union type
type Status = "pending" | "approved" | "rejected"

// Intersection type
type Employee = {
  id: number
  name: string
}

type Manager = Employee & {
  department: string
  teamSize: number
}
```

### When to Use Which?

```typescript
// ✅ Use Interface for object shapes (prefer for React components)
interface ButtonProps {
  label: string
  onClick: () => void
}

// ✅ Use Type for unions, intersections, or primitives
type Theme = "light" | "dark"
type ID = string | number

// ✅ Interfaces can be extended
interface BaseProps {
  id: string
}

interface ExtendedProps extends BaseProps {
  name: string
}

// ✅ Types can use complex type operations
type Readonly<T> = {
  readonly [P in keyof T]: T[P]
}
```

---

## Functions

### Function Types

```typescript
// Function declaration
function add(a: number, b: number): number {
  return a + b
}

// Function expression
const multiply = function(a: number, b: number): number {
  return a * b
}

// Arrow function
const divide = (a: number, b: number): number => {
  return a / b
}

// Concise arrow function
const square = (n: number): number => n * n

// Function type
type BinaryOperation = (a: number, b: number) => number

const subtract: BinaryOperation = (a, b) => a - b
```

### Optional and Default Parameters

```typescript
// Optional parameters
function greet(name: string, title?: string): string {
  if (title) {
    return `Hello, ${title} ${name}`
  }
  return `Hello, ${name}`
}

greet("John") // OK
greet("John", "Dr.") // OK

// Default parameters
function createUser(name: string, age: number = 18): { name: string; age: number } {
  return { name, age }
}

createUser("Alice") // age defaults to 18
createUser("Bob", 25) // age is 25
```

### Rest Parameters

```typescript
function sum(...numbers: number[]): number {
  return numbers.reduce((total, n) => total + n, 0)
}

sum(1, 2, 3) // 6
sum(1, 2, 3, 4, 5) // 15
```

### Function Overloads

```typescript
// Overload signatures
function getValue(id: number): string
function getValue(name: string): number
// Implementation signature
function getValue(idOrName: number | string): string | number {
  if (typeof idOrName === "number") {
    return `ID-${idOrName}`
  }
  return idOrName.length
}

getValue(123) // Returns string
getValue("John") // Returns number
```

---

## Generics

### Basic Generics

```typescript
// Generic function
function identity<T>(arg: T): T {
  return arg
}

let output1 = identity<string>("hello") // output1 is string
let output2 = identity<number>(42) // output2 is number
let output3 = identity("hello") // Type inference

// Generic array function
function getFirstElement<T>(arr: T[]): T | undefined {
  return arr[0]
}

const firstNum = getFirstElement([1, 2, 3]) // number | undefined
const firstName = getFirstElement(["a", "b"]) // string | undefined
```

### Generic Interfaces

```typescript
interface Box<T> {
  value: T
}

const stringBox: Box<string> = { value: "hello" }
const numberBox: Box<number> = { value: 42 }

// Generic interface with multiple type parameters
interface Pair<K, V> {
  key: K
  value: V
}

const pair: Pair<string, number> = {
  key: "age",
  value: 25
}
```

### Generic Classes

```typescript
class DataStore<T> {
  private data: T[] = []
  
  add(item: T): void {
    this.data.push(item)
  }
  
  get(index: number): T | undefined {
    return this.data[index]
  }
  
  getAll(): T[] {
    return [...this.data]
  }
}

const stringStore = new DataStore<string>()
stringStore.add("hello")
stringStore.add("world")

const numberStore = new DataStore<number>()
numberStore.add(1)
numberStore.add(2)
```

### Generic Constraints

```typescript
// Constrain generic to have specific properties
interface HasLength {
  length: number
}

function logLength<T extends HasLength>(arg: T): void {
  console.log(arg.length)
}

logLength("hello") // OK - strings have length
logLength([1, 2, 3]) // OK - arrays have length
// logLength(123) // Error - numbers don't have length

// Multiple constraints
interface HasName {
  name: string
}

interface HasAge {
  age: number
}

function printPerson<T extends HasName & HasAge>(person: T): void {
  console.log(`${person.name} is ${person.age} years old`)
}
```

---

## Union and Intersection Types

### Union Types

```typescript
// Basic union
type StringOrNumber = string | number

let value: StringOrNumber
value = "hello" // OK
value = 42 // OK
// value = true // Error

// Union with literal types
type Status = "pending" | "approved" | "rejected"

let orderStatus: Status = "pending" // OK
// orderStatus = "cancelled" // Error

// Function with union parameter
function formatValue(value: string | number): string {
  if (typeof value === "string") {
    return value.toUpperCase()
  }
  return value.toFixed(2)
}

// Union of object types
type Success = {
  success: true
  data: string
}

type Error = {
  success: false
  error: string
}

type Result = Success | Error

function handleResult(result: Result): void {
  if (result.success) {
    console.log(result.data) // TypeScript knows it's Success
  } else {
    console.log(result.error) // TypeScript knows it's Error
  }
}
```

### Intersection Types

```typescript
// Combine multiple types
type Person = {
  name: string
  age: number
}

type Employee = {
  employeeId: number
  department: string
}

type EmployeePerson = Person & Employee

const employee: EmployeePerson = {
  name: "John",
  age: 30,
  employeeId: 12345,
  department: "IT"
}

// Mixin pattern
type Timestamped = {
  createdAt: Date
  updatedAt: Date
}

type User = {
  id: number
  name: string
}

type TimestampedUser = User & Timestamped
```

---

## Type Guards

### typeof Guards

```typescript
function processValue(value: string | number): string {
  if (typeof value === "string") {
    return value.toUpperCase() // TypeScript knows it's string
  }
  return value.toFixed(2) // TypeScript knows it's number
}
```

### instanceof Guards

```typescript
class Dog {
  bark(): void {
    console.log("Woof!")
  }
}

class Cat {
  meow(): void {
    console.log("Meow!")
  }
}

function makeSound(animal: Dog | Cat): void {
  if (animal instanceof Dog) {
    animal.bark() // TypeScript knows it's Dog
  } else {
    animal.meow() // TypeScript knows it's Cat
  }
}
```

### Custom Type Guards

```typescript
interface Bird {
  fly(): void
  layEggs(): void
}

interface Fish {
  swim(): void
  layEggs(): void
}

// Type predicate
function isFish(pet: Bird | Fish): pet is Fish {
  return (pet as Fish).swim !== undefined
}

function movePet(pet: Bird | Fish): void {
  if (isFish(pet)) {
    pet.swim() // TypeScript knows it's Fish
  } else {
    pet.fly() // TypeScript knows it's Bird
  }
}
```

---

## Utility Types

### Partial<T>

```typescript
interface User {
  id: number
  name: string
  email: string
  age: number
}

// Makes all properties optional
type PartialUser = Partial<User>
// Same as:
// {
//   id?: number
//   name?: string
//   email?: string
//   age?: number
// }

function updateUser(id: number, updates: Partial<User>): void {
  // Can update any subset of properties
}

updateUser(1, { name: "John" }) // OK
updateUser(1, { email: "john@example.com", age: 30 }) // OK
```

### Required<T>

```typescript
interface PartialUser {
  id?: number
  name?: string
  email?: string
}

// Makes all properties required
type CompleteUser = Required<PartialUser>
// Same as:
// {
//   id: number
//   name: string
//   email: string
// }
```

### Readonly<T>

```typescript
interface MutableUser {
  id: number
  name: string
}

// Makes all properties readonly
type ImmutableUser = Readonly<MutableUser>

const user: ImmutableUser = { id: 1, name: "John" }
// user.name = "Jane" // Error!
```

### Pick<T, K>

```typescript
interface User {
  id: number
  name: string
  email: string
  age: number
  password: string
}

// Pick specific properties
type UserPreview = Pick<User, "id" | "name" | "email">
// Same as:
// {
//   id: number
//   name: string
//   email: string
// }
```

### Omit<T, K>

```typescript
interface User {
  id: number
  name: string
  email: string
  password: string
}

// Omit specific properties
type SafeUser = Omit<User, "password">
// Same as:
// {
//   id: number
//   name: string
//   email: string
// }
```

### Record<K, T>

```typescript
// Create an object type with specific keys and value types
type Role = "admin" | "user" | "guest"

type Permissions = Record<Role, string[]>
// Same as:
// {
//   admin: string[]
//   user: string[]
//   guest: string[]
// }

const permissions: Permissions = {
  admin: ["read", "write", "delete"],
  user: ["read", "write"],
  guest: ["read"]
}
```

---

## Portfolio Examples

### Example 1: Entity Types

```typescript
// From: src/shared/types/index.ts

export interface Project {
  id: string
  title: string
  description: string
  longDescription?: string
  technologies: string[]
  category: string
  featured: boolean
  coverImage: string
  images?: string[]
  githubUrl?: string
  liveUrl?: string
  startDate: string
  endDate?: string
}

export interface Experience {
  id: string
  company: string
  position: string
  location: string
  startDate: string
  endDate?: string
  current: boolean
  description: string
  responsibilities: string[]
  technologies: string[]
}
```

### Example 2: Repository Interface

```typescript
// From: src/core/domain/repositories/index.ts

export interface IPortfolioRepository {
  // Home
  getHomeData(): Promise<HomeData>
  updateHomeData(data: Partial<HomeData>): Promise<void>
  
  // Projects
  getAllProjects(): Promise<Project[]>
  getProjectById(id: string): Promise<Project>
  createProject(project: Omit<Project, 'id'>): Promise<string>
  updateProject(id: string, project: Partial<Project>): Promise<void>
  deleteProject(id: string): Promise<void>
}
```

### Example 3: Generic Hook

```typescript
// Custom hook with generics (similar to usePortfolio)

import { useState, useEffect } from 'react'

interface FetchState<T> {
  data: T | null
  loading: boolean
  error: string | null
}

export function useFetchData<T>(
  fetchFn: () => Promise<T>
): FetchState<T> {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const result = await fetchFn()
        setData(result)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [])
  
  return { data, loading, error }
}

// Usage:
const { data, loading, error } = useFetchData<Project[]>(
  () => portfolioService.getAllProjects()
)
```

---

## 🎯 Practice Exercises

1. Create types for a blog post system (Post, Author, Comment)
2. Implement a generic Stack<T> class with push, pop, and peek methods
3. Create type guards for discriminated unions
4. Use utility types to create different views of a User type

---

**Next**: [02-REACT-BASICS.md](./02-REACT-BASICS.md) - React components with TypeScript
