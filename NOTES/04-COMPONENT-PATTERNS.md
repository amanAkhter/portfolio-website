# Component Patterns & Composition

> Master advanced component patterns used in production React applications

## 📚 Table of Contents
1. [Component Composition](#component-composition)
2. [Compound Components](#compound-components)
3. [Polymorphic Components](#polymorphic-components)
4. [Render Props Pattern](#render-props-pattern)
5. [Container/Presentational Pattern](#containerpresentational-pattern)
6. [Layout Components](#layout-components)
7. [Real Portfolio Examples](#real-portfolio-examples)

---

## 🎯 Component Composition

### Basic Composition

**Component composition** is building complex UIs by combining simple, reusable components.

```typescript
// ❌ Monolithic Component
const UserProfile = () => {
  return (
    <div className="profile">
      <div className="avatar">
        <img src="/avatar.jpg" />
      </div>
      <div className="info">
        <h2>John Doe</h2>
        <p>Software Engineer</p>
      </div>
      <div className="actions">
        <button>Follow</button>
        <button>Message</button>
      </div>
    </div>
  )
}

// ✅ Composed Components
const Avatar: React.FC<{ src: string; alt: string }> = ({ src, alt }) => (
  <div className="avatar">
    <img src={src} alt={alt} />
  </div>
)

const UserInfo: React.FC<{ name: string; title: string }> = ({ name, title }) => (
  <div className="info">
    <h2>{name}</h2>
    <p>{title}</p>
  </div>
)

const ProfileActions: React.FC<{ onFollow: () => void; onMessage: () => void }> = ({ 
  onFollow, 
  onMessage 
}) => (
  <div className="actions">
    <button onClick={onFollow}>Follow</button>
    <button onClick={onMessage}>Message</button>
  </div>
)

// Composed Profile
const UserProfile: React.FC<{ user: User }> = ({ user }) => (
  <div className="profile">
    <Avatar src={user.avatar} alt={user.name} />
    <UserInfo name={user.name} title={user.title} />
    <ProfileActions 
      onFollow={() => console.log('Following')}
      onMessage={() => console.log('Messaging')}
    />
  </div>
)
```

### Children as Props

```typescript
interface CardProps {
  children: React.ReactNode
  className?: string
}

const Card: React.FC<CardProps> = ({ children, className }) => (
  <div className={`card ${className}`}>
    {children}
  </div>
)

// Usage - Flexible composition
const App = () => (
  <Card className="user-card">
    <h2>Title</h2>
    <p>Content</p>
    <button>Action</button>
  </Card>
)
```

---

## 🧩 Compound Components

**Real Example from Portfolio: Card Component**

```typescript
// src/presentation/components/ui/Card.tsx
import * as React from "react"
import { cn } from "../../../shared/utils/helpers"

// Main Card component
const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg border border-tokyo-black bg-tokyo-bg shadow-lg",
      className
    )}
    {...props}
  />
))
Card.displayName = "Card"

// Compound sub-components
const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("text-2xl font-semibold leading-none tracking-tight", className)}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-tokyo-fg-dark", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
```

**Usage:**

```typescript
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card'

const ProjectCard = () => (
  <Card>
    <CardHeader>
      <CardTitle>E-commerce Platform</CardTitle>
      <CardDescription>Full-stack web application</CardDescription>
    </CardHeader>
    <CardContent>
      <p>Built with React, TypeScript, and Node.js</p>
    </CardContent>
    <CardFooter>
      <button>View Project</button>
    </CardFooter>
  </Card>
)
```

### Benefits of Compound Components:
1. ✅ Flexible composition
2. ✅ Semantic API
3. ✅ Shared state management
4. ✅ Better IntelliSense/autocomplete

---

## 🎨 Polymorphic Components

Create components that can render as different HTML elements:

```typescript
type AsProp<C extends React.ElementType> = {
  as?: C
}

type PropsToOmit<C extends React.ElementType, P> = keyof (AsProp<C> & P)

type PolymorphicComponentProp<
  C extends React.ElementType,
  Props = {}
> = React.PropsWithChildren<Props & AsProp<C>> &
  Omit<React.ComponentPropsWithoutRef<C>, PropsToOmit<C, Props>>

type PolymorphicRef<C extends React.ElementType> = 
  React.ComponentPropsWithRef<C>['ref']

type PolymorphicComponentPropWithRef<
  C extends React.ElementType,
  Props = {}
> = PolymorphicComponentProp<C, Props> & { ref?: PolymorphicRef<C> }

// Text Component - can be h1, h2, p, span, etc.
type TextProps<C extends React.ElementType> = PolymorphicComponentPropWithRef<
  C,
  {
    color?: 'primary' | 'secondary' | 'error'
    size?: 'sm' | 'md' | 'lg'
  }
>

type TextComponent = <C extends React.ElementType = 'span'>(
  props: TextProps<C>
) => React.ReactElement | null

const Text: TextComponent = React.forwardRef(
  <C extends React.ElementType = 'span'>(
    { as, color = 'primary', size = 'md', className, children, ...rest }: TextProps<C>,
    ref?: PolymorphicRef<C>
  ) => {
    const Component = as || 'span'
    
    const colorClass = {
      primary: 'text-tokyo-blue',
      secondary: 'text-tokyo-purple',
      error: 'text-tokyo-red',
    }[color]
    
    const sizeClass = {
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg',
    }[size]
    
    return (
      <Component
        ref={ref}
        className={`${colorClass} ${sizeClass} ${className}`}
        {...rest}
      >
        {children}
      </Component>
    )
  }
)

// Usage - Same component, different elements!
<Text as="h1" size="lg">Heading</Text>
<Text as="p" color="secondary">Paragraph</Text>
<Text as="span">Span text</Text>
<Text as="label" htmlFor="input">Label</Text>
```

---

## 🔄 Render Props Pattern

Share code between components using a prop whose value is a function:

```typescript
interface MousePosition {
  x: number
  y: number
}

interface MouseTrackerProps {
  render: (position: MousePosition) => React.ReactNode
}

const MouseTracker: React.FC<MouseTrackerProps> = ({ render }) => {
  const [position, setPosition] = useState<MousePosition>({ x: 0, y: 0 })
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY })
    }
    
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])
  
  return <>{render(position)}</>
}

// Usage
const App = () => (
  <MouseTracker
    render={({ x, y }) => (
      <div>
        Mouse position: {x}, {y}
      </div>
    )}
  />
)

// Alternative with children as function
interface MouseTrackerChildrenProps {
  children: (position: MousePosition) => React.ReactNode
}

const MouseTrackerAlt: React.FC<MouseTrackerChildrenProps> = ({ children }) => {
  const [position, setPosition] = useState<MousePosition>({ x: 0, y: 0 })
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY })
    }
    
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])
  
  return <>{children(position)}</>
}

// Usage
const App2 = () => (
  <MouseTrackerAlt>
    {({ x, y }) => (
      <div>Mouse at: {x}, {y}</div>
    )}
  </MouseTrackerAlt>
)
```

---

## 📦 Container/Presentational Pattern

**Separate logic from presentation**

```typescript
// ❌ Mixed concerns
const UserList = () => {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    fetch('/api/users')
      .then(res => res.json())
      .then(data => {
        setUsers(data)
        setLoading(false)
      })
  }, [])
  
  if (loading) return <div>Loading...</div>
  
  return (
    <div className="user-list">
      {users.map(user => (
        <div key={user.id} className="user-card">
          <img src={user.avatar} />
          <h3>{user.name}</h3>
          <p>{user.email}</p>
        </div>
      ))}
    </div>
  )
}

// ✅ Separated concerns

// Presentational Component (Pure, no logic)
interface UserListProps {
  users: User[]
  loading: boolean
}

const UserListView: React.FC<UserListProps> = ({ users, loading }) => {
  if (loading) return <div>Loading...</div>
  
  return (
    <div className="user-list">
      {users.map(user => (
        <UserCard key={user.id} user={user} />
      ))}
    </div>
  )
}

interface UserCardProps {
  user: User
}

const UserCard: React.FC<UserCardProps> = ({ user }) => (
  <div className="user-card">
    <img src={user.avatar} alt={user.name} />
    <h3>{user.name}</h3>
    <p>{user.email}</p>
  </div>
)

// Container Component (Logic)
const UserListContainer = () => {
  const { users, loading } = useFetch<User[]>('/api/users')
  
  return <UserListView users={users || []} loading={loading} />
}
```

---

## 🏗️ Layout Components

```typescript
// Flexible Layout Component
interface LayoutProps {
  children: React.ReactNode
  sidebar?: React.ReactNode
  header?: React.ReactNode
  footer?: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  sidebar, 
  header, 
  footer 
}) => (
  <div className="layout">
    {header && <header className="layout-header">{header}</header>}
    <div className="layout-main">
      {sidebar && <aside className="layout-sidebar">{sidebar}</aside>}
      <main className="layout-content">{children}</main>
    </div>
    {footer && <footer className="layout-footer">{footer}</footer>}
  </div>
)

// Usage
const App = () => (
  <Layout
    header={<Header />}
    sidebar={<Sidebar />}
    footer={<Footer />}
  >
    <h1>Main Content</h1>
  </Layout>
)

// Grid Layout Component
interface GridProps {
  children: React.ReactNode
  columns?: number
  gap?: string
  className?: string
}

const Grid: React.FC<GridProps> = ({ 
  children, 
  columns = 3, 
  gap = '1rem',
  className = '' 
}) => (
  <div
    className={`grid ${className}`}
    style={{
      gridTemplateColumns: `repeat(${columns}, 1fr)`,
      gap,
    }}
  >
    {children}
  </div>
)

// Usage
<Grid columns={4} gap="2rem">
  <Card>Item 1</Card>
  <Card>Item 2</Card>
  <Card>Item 3</Card>
  <Card>Item 4</Card>
</Grid>
```

---

## 🎯 Real Portfolio Examples

### 1. Modal Component (Compound Pattern)

**From `src/presentation/components/ui/Modal.tsx`:**

```typescript
interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  className?: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  className,
  size = 'md',
}) => {
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-3xl',
    xl: 'max-w-5xl',
    full: 'max-w-[90vw]',
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className={cn(
          "relative w-full bg-tokyo-bg-light border rounded-lg shadow-2xl",
          sizeClasses[size],
          className
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4"
          onClick={onClose}
        >
          <X className="h-5 w-5" />
        </Button>
        {children}
      </div>
    </div>
  )
}

// Compound components
export const ModalHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  children,
  ...props
}) => (
  <div className={cn("flex flex-col space-y-2 p-6 border-b", className)} {...props}>
    {children}
  </div>
)

export const ModalTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({
  className,
  children,
  ...props
}) => (
  <h2 className={cn("text-2xl font-semibold", className)} {...props}>
    {children}
  </h2>
)

export const ModalBody: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  children,
  ...props
}) => (
  <div className={cn("p-6 overflow-y-auto flex-1", className)} {...props}>
    {children}
  </div>
)

export const ModalFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  children,
  ...props
}) => (
  <div className={cn("flex items-center justify-end gap-2 p-6 border-t", className)} {...props}>
    {children}
  </div>
)
```

**Usage:**

```typescript
const App = () => {
  const [isOpen, setIsOpen] = useState(false)
  
  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
      
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} size="lg">
        <ModalHeader>
          <ModalTitle>Edit Project</ModalTitle>
        </ModalHeader>
        <ModalBody>
          <form>
            <Input label="Title" />
            <Textarea label="Description" />
          </form>
        </ModalBody>
        <ModalFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button>Save Changes</Button>
        </ModalFooter>
      </Modal>
    </>
  )
}
```

### 2. Button Component (Variant Pattern)

**From `src/presentation/components/ui/Button.tsx`:**

```typescript
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    const variants = {
      default: 'bg-tokyo-blue text-tokyo-bg hover:bg-tokyo-blue/90',
      destructive: 'bg-tokyo-red text-tokyo-bg hover:bg-tokyo-red/90',
      outline: 'border border-tokyo-blue text-tokyo-blue hover:bg-tokyo-blue/10',
      secondary: 'bg-tokyo-purple text-tokyo-bg hover:bg-tokyo-purple/90',
      ghost: 'hover:bg-tokyo-bg-highlight text-tokyo-fg',
      link: 'text-tokyo-blue underline-offset-4 hover:underline',
    }

    const sizes = {
      default: 'h-10 px-4 py-2',
      sm: 'h-9 rounded-md px-3',
      lg: 'h-11 rounded-md px-8',
      icon: 'h-10 w-10',
    }

    return (
      <button
        className={cn(
          'inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-all',
          variants[variant],
          sizes[size],
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
```

---

## ✅ Best Practices

1. **Keep components small and focused** - Single responsibility
2. **Use composition over inheritance** - Build complex UIs from simple parts
3. **Extract reusable patterns** - Don't repeat yourself
4. **Type everything properly** - Leverage TypeScript
5. **Use compound components for related functionality** - Better DX
6. **Separate concerns** - Container/Presentational pattern
7. **Forward refs when needed** - Enable ref access for parent components

---

## 🚫 Anti-Patterns

```typescript
// ❌ Prop drilling hell
<ComponentA data={data}>
  <ComponentB data={data}>
    <ComponentC data={data}>
      <ComponentD data={data} />
    </ComponentC>
  </ComponentB>
</ComponentA>

// ✅ Use Context or state management
const DataContext = createContext<Data | null>(null)

<DataContext.Provider value={data}>
  <ComponentA>
    <ComponentB>
      <ComponentC>
        <ComponentD />
      </ComponentC>
    </ComponentB>
  </ComponentA>
</DataContext.Provider>

// ❌ Too many props
<Button 
  color="blue" 
  size="large" 
  rounded 
  shadow 
  uppercase 
  bold
  icon="check"
  iconPosition="left"
/>

// ✅ Use variants and composition
<Button variant="primary" size="lg">
  <CheckIcon />
  Submit
</Button>
```

---

## 🎓 Practice Exercises

1. Create a `Tabs` compound component with `Tab`, `TabList`, and `TabPanel`
2. Build a polymorphic `Box` component that can render as any HTML element
3. Implement a `Form` component using the render props pattern
4. Create a reusable `DataTable` component with composition
5. Build a flexible `Layout` system for your app

---

## 📚 Additional Resources

- [React Docs: Composition vs Inheritance](https://react.dev/learn/thinking-in-react)
- [Kent C. Dodds: Advanced React Component Patterns](https://kentcdodds.com/blog/advanced-react-component-patterns)
- [Patterns.dev](https://www.patterns.dev/)

---

**Next:** [Props, Events & Type Safety →](./05-PROPS-EVENTS.md)
