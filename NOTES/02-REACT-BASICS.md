# React Basics with TypeScript

## 📖 Table of Contents
1. [Functional Components](#functional-components)
2. [Props and PropTypes](#props-and-proptypes)
3. [Children Props](#children-props)
4. [Event Handlers](#event-handlers)
5. [Forms and Inputs](#forms-and-inputs)
6. [Conditional Rendering](#conditional-rendering)
7. [Lists and Keys](#lists-and-keys)
8. [Portfolio Examples](#portfolio-examples)

---

## Functional Components

### Basic Component

```typescript
import React from 'react'

// Simple component without props
export const Welcome: React.FC = () => {
  return <h1>Welcome to my app!</h1>
}

// Component with JSX.Element return type
export function Greeting(): JSX.Element {
  return <p>Hello, World!</p>
}

// Arrow function component
export const Header = (): JSX.Element => {
  return (
    <header>
      <h1>My App</h1>
    </header>
  )
}
```

### Component with Props

```typescript
// Define props interface
interface UserCardProps {
  name: string
  age: number
  email: string
}

// Method 1: Using React.FC
export const UserCard: React.FC<UserCardProps> = ({ name, age, email }) => {
  return (
    <div className="user-card">
      <h2>{name}</h2>
      <p>Age: {age}</p>
      <p>Email: {email}</p>
    </div>
  )
}

// Method 2: Function declaration with explicit return type
export function UserCard({ name, age, email }: UserCardProps): JSX.Element {
  return (
    <div className="user-card">
      <h2>{name}</h2>
      <p>Age: {age}</p>
      <p>Email: {email}</p>
    </div>
  )
}

// Usage:
<UserCard name="John Doe" age={30} email="john@example.com" />
```

---

## Props and PropTypes

### Optional Props

```typescript
interface ProfileProps {
  name: string           // Required
  age?: number          // Optional
  bio?: string          // Optional
  avatar?: string       // Optional
}

export const Profile: React.FC<ProfileProps> = ({ 
  name, 
  age, 
  bio = "No bio provided",  // Default value
  avatar 
}) => {
  return (
    <div>
      <h2>{name}</h2>
      {age && <p>Age: {age}</p>}
      <p>{bio}</p>
      {avatar && <img src={avatar} alt={name} />}
    </div>
  )
}

// Usage:
<Profile name="Alice" />  {/* Only required prop */}
<Profile name="Bob" age={25} bio="Software Developer" />
```

### Default Props

```typescript
interface ButtonProps {
  label: string
  variant?: 'primary' | 'secondary' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
}

export const Button: React.FC<ButtonProps> = ({ 
  label,
  variant = 'primary',
  size = 'md',
  disabled = false
}) => {
  return (
    <button 
      className={`btn btn-${variant} btn-${size}`}
      disabled={disabled}
    >
      {label}
    </button>
  )
}
```

### Extending HTML Attributes

```typescript
// Extend native button props
interface CustomButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary'
  loading?: boolean
}

export const CustomButton: React.FC<CustomButtonProps> = ({ 
  variant = 'primary',
  loading = false,
  children,
  disabled,
  ...props  // All other button props
}) => {
  return (
    <button 
      {...props}
      className={`btn btn-${variant} ${props.className || ''}`}
      disabled={disabled || loading}
    >
      {loading ? 'Loading...' : children}
    </button>
  )
}

// Can use any button attribute:
<CustomButton 
  variant="primary" 
  onClick={() => console.log('clicked')}
  type="submit"
  aria-label="Submit form"
>
  Submit
</CustomButton>
```

---

## Children Props

### Basic Children

```typescript
interface ContainerProps {
  children: React.ReactNode  // Can be anything: string, JSX, array
}

export const Container: React.FC<ContainerProps> = ({ children }) => {
  return <div className="container">{children}</div>
}

// Usage:
<Container>
  <h1>Title</h1>
  <p>Content</p>
</Container>
```

### Typed Children

```typescript
// Only accept specific component types
interface TabsProps {
  children: React.ReactElement<TabProps> | React.ReactElement<TabProps>[]
}

interface TabProps {
  label: string
  children: React.ReactNode
}

export const Tabs: React.FC<TabsProps> = ({ children }) => {
  return <div className="tabs">{children}</div>
}

export const Tab: React.FC<TabProps> = ({ label, children }) => {
  return (
    <div className="tab">
      <div className="tab-label">{label}</div>
      <div className="tab-content">{children}</div>
    </div>
  )
}

// Usage:
<Tabs>
  <Tab label="Home">Home content</Tab>
  <Tab label="Profile">Profile content</Tab>
</Tabs>
```

### Children as Function (Render Props)

```typescript
interface DataProviderProps<T> {
  data: T[]
  children: (data: T[]) => React.ReactNode
}

export function DataProvider<T>({ data, children }: DataProviderProps<T>) {
  return <>{children(data)}</>
}

// Usage:
<DataProvider data={users}>
  {(users) => (
    <ul>
      {users.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  )}
</DataProvider>
```

---

## Event Handlers

### Basic Events

```typescript
export const ClickExample: React.FC = () => {
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    console.log('Button clicked!', event.currentTarget)
  }
  
  return <button onClick={handleClick}>Click me</button>
}

// Inline handler
export const InlineExample: React.FC = () => {
  return (
    <button onClick={(e) => console.log('Clicked', e)}>
      Click me
    </button>
  )
}
```

### Form Events

```typescript
import { useState } from 'react'

export const FormExample: React.FC = () => {
  const [name, setName] = useState('')
  
  // Input change event
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value)
  }
  
  // Form submit event
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    console.log('Submitted:', name)
  }
  
  return (
    <form onSubmit={handleSubmit}>
      <input 
        type="text" 
        value={name}
        onChange={handleChange}
      />
      <button type="submit">Submit</button>
    </form>
  )
}
```

### Common Event Types

```typescript
export const EventTypes: React.FC = () => {
  // Mouse events
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {}
  const handleMouseMove = (e: React.MouseEvent) => {}
  
  // Keyboard events
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      console.log('Enter pressed')
    }
  }
  
  // Focus events
  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    console.log('Input focused')
  }
  
  // Change events
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value)
  }
  
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    console.log(e.target.value)
  }
  
  return (
    <div onClick={handleClick}>
      <input 
        onKeyPress={handleKeyPress}
        onFocus={handleFocus}
        onChange={handleInputChange}
      />
      <select onChange={handleSelectChange}>
        <option>Option 1</option>
      </select>
    </div>
  )
}
```

---

## Forms and Inputs

### Controlled Components

```typescript
import { useState } from 'react'

interface FormData {
  username: string
  email: string
  age: number
  bio: string
  country: string
  subscribe: boolean
}

export const RegistrationForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    username: '',
    email: '',
    age: 0,
    bio: '',
    country: '',
    subscribe: false
  })
  
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' 
        ? (e.target as HTMLInputElement).checked 
        : value
    }))
  }
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Form data:', formData)
  }
  
  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="username"
        value={formData.username}
        onChange={handleInputChange}
        placeholder="Username"
      />
      
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleInputChange}
        placeholder="Email"
      />
      
      <input
        type="number"
        name="age"
        value={formData.age}
        onChange={handleInputChange}
        placeholder="Age"
      />
      
      <textarea
        name="bio"
        value={formData.bio}
        onChange={handleInputChange}
        placeholder="Bio"
      />
      
      <select name="country" value={formData.country} onChange={handleInputChange}>
        <option value="">Select country</option>
        <option value="us">United States</option>
        <option value="uk">United Kingdom</option>
        <option value="ca">Canada</option>
      </select>
      
      <label>
        <input
          type="checkbox"
          name="subscribe"
          checked={formData.subscribe}
          onChange={handleInputChange}
        />
        Subscribe to newsletter
      </label>
      
      <button type="submit">Register</button>
    </form>
  )
}
```

---

## Conditional Rendering

### If/Else with Ternary

```typescript
interface MessageProps {
  isLoggedIn: boolean
  username?: string
}

export const Message: React.FC<MessageProps> = ({ isLoggedIn, username }) => {
  return (
    <div>
      {isLoggedIn ? (
        <h1>Welcome back, {username}!</h1>
      ) : (
        <h1>Please log in</h1>
      )}
    </div>
  )
}
```

### Logical AND (&&)

```typescript
interface AlertProps {
  message?: string
  type?: 'error' | 'success' | 'warning'
}

export const Alert: React.FC<AlertProps> = ({ message, type = 'error' }) => {
  return (
    <div>
      {message && (
        <div className={`alert alert-${type}`}>
          {message}
        </div>
      )}
    </div>
  )
}
```

### Early Return

```typescript
interface UserProfileProps {
  user: User | null
  loading: boolean
}

export const UserProfile: React.FC<UserProfileProps> = ({ user, loading }) => {
  if (loading) {
    return <div>Loading...</div>
  }
  
  if (!user) {
    return <div>User not found</div>
  }
  
  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </div>
  )
}
```

### Switch Statement Pattern

```typescript
type Status = 'idle' | 'loading' | 'success' | 'error'

interface StatusDisplayProps {
  status: Status
  data?: string
  error?: string
}

export const StatusDisplay: React.FC<StatusDisplayProps> = ({ 
  status, 
  data, 
  error 
}) => {
  const renderContent = () => {
    switch (status) {
      case 'idle':
        return <p>Ready to load</p>
      case 'loading':
        return <p>Loading...</p>
      case 'success':
        return <p>Data: {data}</p>
      case 'error':
        return <p>Error: {error}</p>
      default:
        return null
    }
  }
  
  return <div>{renderContent()}</div>
}
```

---

## Lists and Keys

### Rendering Lists

```typescript
interface User {
  id: number
  name: string
  email: string
}

interface UserListProps {
  users: User[]
}

export const UserList: React.FC<UserListProps> = ({ users }) => {
  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>
          {user.name} - {user.email}
        </li>
      ))}
    </ul>
  )
}
```

### List with Component

```typescript
interface TodoItem {
  id: string
  text: string
  completed: boolean
}

interface TodoItemProps {
  todo: TodoItem
  onToggle: (id: string) => void
}

const TodoListItem: React.FC<TodoItemProps> = ({ todo, onToggle }) => {
  return (
    <li 
      onClick={() => onToggle(todo.id)}
      style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}
    >
      {todo.text}
    </li>
  )
}

interface TodoListProps {
  todos: TodoItem[]
  onToggle: (id: string) => void
}

export const TodoList: React.FC<TodoListProps> = ({ todos, onToggle }) => {
  return (
    <ul>
      {todos.map(todo => (
        <TodoListItem 
          key={todo.id} 
          todo={todo} 
          onToggle={onToggle} 
        />
      ))}
    </ul>
  )
}
```

### Filtered Lists

```typescript
interface Product {
  id: number
  name: string
  category: string
  price: number
}

interface ProductListProps {
  products: Product[]
  filter: string
}

export const ProductList: React.FC<ProductListProps> = ({ products, filter }) => {
  const filteredProducts = products.filter(product => 
    filter === 'all' || product.category === filter
  )
  
  if (filteredProducts.length === 0) {
    return <p>No products found</p>
  }
  
  return (
    <ul>
      {filteredProducts.map(product => (
        <li key={product.id}>
          {product.name} - ${product.price}
        </li>
      ))}
    </ul>
  )
}
```

---

## Portfolio Examples

### Example 1: Badge Component

```typescript
// From: src/presentation/components/ui/Badge.tsx

import React from 'react'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'secondary' | 'outline' | 'destructive'
  className?: string
}

export const Badge: React.FC<BadgeProps> = ({ 
  children, 
  variant = 'default',
  className = '' 
}) => {
  const variantClasses = {
    default: 'bg-tokyo-blue text-white',
    secondary: 'bg-tokyo-purple text-white',
    outline: 'border border-tokyo-blue text-tokyo-blue',
    destructive: 'bg-tokyo-red text-white'
  }
  
  return (
    <span className={`
      inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
      ${variantClasses[variant]}
      ${className}
    `}>
      {children}
    </span>
  )
}

// Usage:
<Badge variant="default">Featured</Badge>
<Badge variant="secondary">New</Badge>
```

### Example 2: Project Card

```typescript
// From: src/presentation/components/sections/Projects.tsx

import { Project } from '../../../shared/types'

interface ProjectCardProps {
  project: Project
  onClick: () => void
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onClick }) => {
  return (
    <div 
      className="project-card cursor-pointer" 
      onClick={onClick}
    >
      <img src={project.coverImage} alt={project.title} />
      
      <h3>{project.title}</h3>
      <p>{project.description}</p>
      
      <div className="technologies">
        {project.technologies.map((tech, index) => (
          <Badge key={index} variant="secondary">
            {tech}
          </Badge>
        ))}
      </div>
      
      {project.featured && <Badge variant="default">Featured</Badge>}
    </div>
  )
}
```

### Example 3: Contact Form

```typescript
// Simplified from: src/presentation/components/sections/Contact.tsx

import { useState } from 'react'

interface ContactFormData {
  name: string
  email: string
  message: string
}

export const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    message: ''
  })
  
  const [errors, setErrors] = useState<Partial<ContactFormData>>({})
  
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Clear error when user types
    if (errors[name as keyof ContactFormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }
  
  const validate = (): boolean => {
    const newErrors: Partial<ContactFormData> = {}
    
    if (!formData.name) newErrors.name = 'Name is required'
    if (!formData.email) newErrors.email = 'Email is required'
    if (!formData.message) newErrors.message = 'Message is required'
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validate()) return
    
    // Submit logic...
    console.log('Submitting:', formData)
  }
  
  return (
    <form onSubmit={handleSubmit}>
      <div>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Your Name"
        />
        {errors.name && <span className="error">{errors.name}</span>}
      </div>
      
      <div>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Your Email"
        />
        {errors.email && <span className="error">{errors.email}</span>}
      </div>
      
      <div>
        <textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          placeholder="Your Message"
        />
        {errors.message && <span className="error">{errors.message}</span>}
      </div>
      
      <button type="submit">Send Message</button>
    </form>
  )
}
```

---

## 🎯 Practice Exercises

1. Create a reusable Card component with optional header, footer
2. Build a filterable product list with search
3. Implement a multi-step form with validation
4. Create a dynamic table component with sorting

---

**Next**: [03-REACT-HOOKS.md](./03-REACT-HOOKS.md) - Master React Hooks with TypeScript
