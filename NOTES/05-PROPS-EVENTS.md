# Props, Events & Type Safety

> Master type-safe props, event handling, and component communication in React+TypeScript

## 📚 Table of Contents
1. [Props Typing](#props-typing)
2. [Children Props](#children-props)
3. [Event Handling](#event-handling)
4. [Extending HTML Attributes](#extending-html-attributes)
5. [Optional vs Required Props](#optional-vs-required-props)
6. [Prop Spreading & Rest Props](#prop-spreading--rest-props)
7. [Real Portfolio Examples](#real-portfolio-examples)

---

## 🎯 Props Typing

### Basic Props

```typescript
// ❌ No types (JavaScript way)
function Greeting({ name, age }) {
  return <div>Hello {name}, you are {age} years old</div>
}

// ✅ TypeScript with interface
interface GreetingProps {
  name: string
  age: number
}

function Greeting({ name, age }: GreetingProps) {
  return <div>Hello {name}, you are {age} years old</div>
}

// ✅ TypeScript with type
type GreetingProps2 = {
  name: string
  age: number
}

const Greeting2: React.FC<GreetingProps2> = ({ name, age }) => {
  return <div>Hello {name}, you are {age} years old</div>
}
```

### Complex Props

```typescript
interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'user' | 'guest' // Union types
}

interface UserCardProps {
  user: User
  onEdit: (userId: string) => void
  onDelete: (userId: string) => Promise<void>
  isEditable?: boolean // Optional
  className?: string
}

const UserCard: React.FC<UserCardProps> = ({
  user,
  onEdit,
  onDelete,
  isEditable = true, // Default value
  className = '',
}) => {
  const handleDelete = async () => {
    await onDelete(user.id)
  }

  return (
    <div className={`user-card ${className}`}>
      <h3>{user.name}</h3>
      <p>{user.email}</p>
      <span className="badge">{user.role}</span>
      
      {isEditable && (
        <div className="actions">
          <button onClick={() => onEdit(user.id)}>Edit</button>
          <button onClick={handleDelete}>Delete</button>
        </div>
      )}
    </div>
  )
}

// Usage
<UserCard
  user={userData}
  onEdit={(id) => console.log('Edit', id)}
  onDelete={async (id) => {
    await api.deleteUser(id)
  }}
  isEditable={true}
  className="highlighted"
/>
```

---

## 👶 Children Props

### React.ReactNode (Most Common)

```typescript
interface CardProps {
  children: React.ReactNode // Can be anything renderable
  title?: string
}

const Card: React.FC<CardProps> = ({ children, title }) => (
  <div className="card">
    {title && <h2>{title}</h2>}
    <div className="card-content">{children}</div>
  </div>
)

// Usage - Very flexible
<Card title="Welcome">
  <p>This is a paragraph</p>
  <button>Click me</button>
  {user && <UserInfo user={user} />}
  {items.map(item => <Item key={item.id} {...item} />)}
</Card>
```

### Typed Children

```typescript
// Only accept specific components
interface TabsProps {
  children: React.ReactElement<TabProps> | React.ReactElement<TabProps>[]
}

const Tabs: React.FC<TabsProps> = ({ children }) => {
  return <div className="tabs">{children}</div>
}

// Only Tab components allowed
<Tabs>
  <Tab label="First">Content 1</Tab>
  <Tab label="Second">Content 2</Tab>
</Tabs>

// Children as function (render props)
interface DataProviderProps<T> {
  children: (data: T) => React.ReactNode
  data: T
}

function DataProvider<T>({ children, data }: DataProviderProps<T>) {
  return <>{children(data)}</>
}

// Usage
<DataProvider data={userData}>
  {(user) => (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </div>
  )}
</DataProvider>
```

### No Children

```typescript
// Explicitly no children
interface IconProps {
  name: string
  size?: number
}

const Icon: React.FC<IconProps> = ({ name, size = 24 }) => (
  <svg width={size} height={size}>
    <use href={`#icon-${name}`} />
  </svg>
)

// Usage - self-closing
<Icon name="check" size={32} />
```

---

## 🎮 Event Handling

### Mouse Events

```typescript
interface ButtonProps {
  children: React.ReactNode
  onClick?: React.MouseEventHandler<HTMLButtonElement>
  onDoubleClick?: React.MouseEventHandler<HTMLButtonElement>
  onMouseEnter?: React.MouseEventHandler<HTMLButtonElement>
  onMouseLeave?: React.MouseEventHandler<HTMLButtonElement>
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  onDoubleClick,
  onMouseEnter,
  onMouseLeave,
}) => {
  // Type inference works!
  const handleClick: React.MouseEventHandler<HTMLButtonElement> = (event) => {
    console.log('Clicked at:', event.clientX, event.clientY)
    onClick?.(event) // Optional chaining for optional props
  }

  return (
    <button
      onClick={handleClick}
      onDoubleClick={onDoubleClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {children}
    </button>
  )
}

// Usage
<Button
  onClick={(e) => {
    e.preventDefault()
    console.log('Button clicked')
  }}
  onMouseEnter={(e) => console.log('Mouse entered')}
>
  Click Me
</Button>
```

### Form Events

```typescript
interface InputProps {
  value: string
  onChange: (value: string) => void
  onBlur?: React.FocusEventHandler<HTMLInputElement>
  onFocus?: React.FocusEventHandler<HTMLInputElement>
  placeholder?: string
  type?: string
}

const Input: React.FC<InputProps> = ({
  value,
  onChange,
  onBlur,
  onFocus,
  placeholder = '',
  type = 'text',
}) => {
  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    onChange(event.target.value) // Extract value for parent
  }

  return (
    <input
      type={type}
      value={value}
      onChange={handleChange}
      onBlur={onBlur}
      onFocus={onFocus}
      placeholder={placeholder}
    />
  )
}

// Usage
const [email, setEmail] = useState('')

<Input
  value={email}
  onChange={setEmail} // Clean API
  onBlur={(e) => console.log('Input lost focus')}
  placeholder="Enter email"
  type="email"
/>
```

### Form Submission

```typescript
interface LoginFormProps {
  onSubmit: (email: string, password: string) => Promise<void>
}

const LoginForm: React.FC<LoginFormProps> = ({ onSubmit }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault() // Prevent page reload
    
    setLoading(true)
    try {
      await onSubmit(email, password)
    } catch (error) {
      console.error('Login failed:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  )
}
```

### Keyboard Events

```typescript
interface SearchInputProps {
  onSearch: (query: string) => void
  onEscape?: () => void
}

const SearchInput: React.FC<SearchInputProps> = ({ onSearch, onEscape }) => {
  const [query, setQuery] = useState('')

  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (event) => {
    if (event.key === 'Enter') {
      onSearch(query)
    } else if (event.key === 'Escape') {
      setQuery('')
      onEscape?.()
    }
  }

  return (
    <input
      type="text"
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      onKeyDown={handleKeyDown}
      placeholder="Search... (Press Enter)"
    />
  )
}
```

---

## 🔗 Extending HTML Attributes

### Extending Button

**Real Example from Portfolio:**

```typescript
// src/presentation/components/ui/Button.tsx
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
          'inline-flex items-center justify-center gap-2 rounded-md transition-all',
          variants[variant],
          sizes[size],
          className
        )}
        ref={ref}
        {...props} // All button props like onClick, disabled, type, etc.
      />
    )
  }
)
Button.displayName = "Button"

// Usage - All HTML button props work!
<Button
  variant="outline"
  size="lg"
  onClick={() => console.log('clicked')}
  disabled={loading}
  type="submit"
  aria-label="Submit form"
  className="custom-class"
>
  Submit
</Button>
```

### Extending Input

```typescript
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className, ...props }, ref) => {
    return (
      <div className="input-wrapper">
        {label && <label>{label}</label>}
        
        <input
          ref={ref}
          className={cn(
            'input',
            error && 'input-error',
            className
          )}
          {...props} // type, placeholder, onChange, value, etc.
        />
        
        {error && <span className="error-text">{error}</span>}
        {helperText && <span className="helper-text">{helperText}</span>}
      </div>
    )
  }
)

// Usage - All input props work!
<Input
  label="Email"
  type="email"
  placeholder="Enter your email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  required
  autoComplete="email"
  error={errors.email}
  helperText="We'll never share your email"
/>
```

### Extending Div

```typescript
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'elevated' | 'outlined' | 'filled'
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ variant = 'elevated', className, children, ...props }, ref) => {
    const variants = {
      elevated: 'shadow-lg',
      outlined: 'border-2',
      filled: 'bg-gray-100',
    }

    return (
      <div
        ref={ref}
        className={cn('card', variants[variant], className)}
        {...props} // onClick, onMouseEnter, style, etc.
      >
        {children}
      </div>
    )
  }
)

// Usage
<Card
  variant="outlined"
  onClick={() => console.log('Card clicked')}
  onMouseEnter={() => console.log('Mouse entered')}
  style={{ maxWidth: '500px' }}
  data-testid="project-card"
>
  <h3>Card Title</h3>
  <p>Card content</p>
</Card>
```

---

## ❓ Optional vs Required Props

```typescript
// Required props (no ?)
interface RequiredProps {
  name: string // Must provide
  age: number // Must provide
}

// Optional props (with ?)
interface OptionalProps {
  name?: string // Optional
  age?: number // Optional
}

// Mixed
interface UserCardProps {
  // Required
  userId: string
  userName: string
  
  // Optional with default
  showAvatar?: boolean
  avatarSize?: 'sm' | 'md' | 'lg'
  
  // Optional callbacks
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
}

const UserCard: React.FC<UserCardProps> = ({
  userId,
  userName,
  showAvatar = true, // Default value
  avatarSize = 'md',
  onEdit,
  onDelete,
}) => {
  return (
    <div>
      <h3>{userName}</h3>
      {showAvatar && <Avatar size={avatarSize} />}
      
      {/* Optional chaining for optional functions */}
      <button onClick={() => onEdit?.(userId)}>Edit</button>
      <button onClick={() => onDelete?.(userId)}>Delete</button>
    </div>
  )
}

// Usage
<UserCard userId="1" userName="John" /> // OK - only required props
<UserCard userId="1" userName="John" showAvatar={false} /> // OK
<UserCard userName="John" /> // ERROR - missing userId
```

---

## 📦 Prop Spreading & Rest Props

```typescript
// Collecting remaining props
interface ButtonProps {
  variant: 'primary' | 'secondary'
  size: 'sm' | 'lg'
}

const Button: React.FC<
  ButtonProps & React.ButtonHTMLAttributes<HTMLButtonElement>
> = ({ variant, size, children, ...restProps }) => {
  // restProps contains all other button props: onClick, disabled, type, etc.
  
  return (
    <button
      className={`btn btn-${variant} btn-${size}`}
      {...restProps}
    >
      {children}
    </button>
  )
}

// Spreading props to child
interface CardProps {
  title: string
  children: React.ReactNode
  cardProps?: React.HTMLAttributes<HTMLDivElement>
  headerProps?: React.HTMLAttributes<HTMLDivElement>
}

const Card: React.FC<CardProps> = ({
  title,
  children,
  cardProps,
  headerProps,
}) => {
  return (
    <div className="card" {...cardProps}>
      <div className="card-header" {...headerProps}>
        <h2>{title}</h2>
      </div>
      <div className="card-body">{children}</div>
    </div>
  )
}

// Usage
<Card
  title="User Profile"
  cardProps={{
    onClick: () => console.log('Card clicked'),
    'data-testid': 'user-card',
  }}
  headerProps={{
    style: { backgroundColor: 'blue' },
  }}
>
  Content here
</Card>
```

---

## 🎯 Real Portfolio Examples

### 1. Input Component with Full Type Safety

```typescript
// src/presentation/components/ui/Input.tsx
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  icon?: React.ReactNode
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, className, ...props }, ref) => {
    return (
      <div className="input-group">
        {label && (
          <label className="input-label">
            {label}
            {props.required && <span className="text-red-500">*</span>}
          </label>
        )}
        
        <div className="input-wrapper">
          {icon && <span className="input-icon">{icon}</span>}
          
          <input
            ref={ref}
            className={cn(
              'input-field',
              error && 'input-error',
              icon && 'input-with-icon',
              className
            )}
            {...props}
          />
        </div>
        
        {error && <span className="input-error-text">{error}</span>}
      </div>
    )
  }
)
Input.displayName = 'Input'

// Usage
import { Mail, Lock } from 'lucide-react'

<Input
  label="Email"
  type="email"
  placeholder="john@example.com"
  icon={<Mail />}
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  error={errors.email}
  required
  autoComplete="email"
/>

<Input
  label="Password"
  type="password"
  icon={<Lock />}
  value={password}
  onChange={(e) => setPassword(e.target.value)}
  error={errors.password}
  required
/>
```

### 2. Animation Wrapper Component

```typescript
// From portfolio - Animations wrapper
import { motion, MotionProps } from 'framer-motion'

interface FadeInProps extends MotionProps {
  children: React.ReactNode
  delay?: number
  duration?: number
  className?: string
}

export const FadeIn: React.FC<FadeInProps> = ({
  children,
  delay = 0,
  duration = 0.5,
  className,
  ...motionProps
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration }}
      className={className}
      {...motionProps} // All Framer Motion props
    >
      {children}
    </motion.div>
  )
}

// Usage
<FadeIn delay={0.2} duration={0.8} whileHover={{ scale: 1.05 }}>
  <Card>Content</Card>
</FadeIn>
```

### 3. Icon Component from Portfolio

```typescript
import { Download, Mail, Github, Linkedin } from 'lucide-react'

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Download,
  Mail,
  Github,
  Linkedin,
}

interface SocialLinkProps {
  platform: string
  url: string
  icon?: string
}

const SocialLink: React.FC<SocialLinkProps> = ({ platform, url, icon }) => {
  const Icon = iconMap[icon || 'Github'] || Github
  
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="social-link"
    >
      <Icon className="h-6 w-6" />
      <span>{platform}</span>
    </a>
  )
}
```

---

## ✅ Best Practices

1. **Always type your props** - Use interfaces or types
2. **Extend HTML attributes when wrapping elements** - Better DX
3. **Use optional chaining for optional callbacks** - `onClick?.()`
4. **Provide default values for optional props** - Cleaner code
5. **Extract value in event handlers** - Cleaner parent API
6. **Use proper event types** - `React.MouseEventHandler`, etc.
7. **Forward refs when necessary** - Enable parent ref access

---

## 🚫 Anti-Patterns

```typescript
// ❌ Any types
interface BadProps {
  data: any // NO!
  onClick: any // NO!
}

// ✅ Proper types
interface GoodProps {
  data: User
  onClick: (id: string) => void
}

// ❌ Too many props
<Component
  prop1="value1"
  prop2="value2"
  prop3="value3"
  prop4="value4"
  prop5="value5"
  // ... 20 more props
/>

// ✅ Group related props
interface ButtonStyle {
  variant: string
  size: string
  color: string
}

<Component
  data={userData}
  style={buttonStyle}
  handlers={eventHandlers}
/>

// ❌ Props drilling
<Parent>
  <Child data={data} />
    <GrandChild data={data} />
      <GreatGrandChild data={data} />
</Parent>

// ✅ Context or composition
<DataProvider data={data}>
  <Parent>
    <Child />
      <GrandChild />
        <GreatGrandChild /> {/* Can access via context */}
  </Parent>
</DataProvider>
```

---

## 🎓 Practice Exercises

1. Create a type-safe `Select` component extending HTML select
2. Build a `FileInput` component with proper event typing
3. Implement a `Form` component with typed submission handler
4. Create a `DataTable` with typed row click handlers
5. Build an `IconButton` that extends Button props

---

**Next:** [State Management with Zustand →](./06-STATE-MANAGEMENT.md)
