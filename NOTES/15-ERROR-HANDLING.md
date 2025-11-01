# Error Handling in React with TypeScript

> Learn to handle errors gracefully and create resilient applications

## 📚 Table of Contents
1. [Error Types](#error-types)
2. [Try-Catch Blocks](#try-catch-blocks)
3. [Error Boundaries](#error-boundaries)
4. [Async Error Handling](#async-error-handling)
5. [Form Validation Errors](#form-validation-errors)
6. [Global Error Handling](#global-error-handling)

---

## 🐛 Error Types

### Common Error Scenarios

```typescript
// 1. Network Errors
try {
  const response = await fetch('/api/data')
  if (!response.ok) throw new Error('Network error')
} catch (error) {
  console.error('Failed to fetch:', error)
}

// 2. Parsing Errors
try {
  const data = JSON.parse(invalidJson)
} catch (error) {
  console.error('Invalid JSON:', error)
}

// 3. Type Errors
const user: User = getUserData() // Might throw if data is invalid

// 4. Validation Errors
if (!email.includes('@')) {
  throw new Error('Invalid email')
}

// 5. Permission Errors
if (user.role !== 'admin') {
  throw new Error('Unauthorized')
}
```

### Custom Error Classes

```typescript
class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public endpoint: string
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

class ValidationError extends Error {
  constructor(
    message: string,
    public field: string,
    public value: any
  ) {
    super(message)
    this.name = 'ValidationError'
  }
}

class AuthenticationError extends Error {
  constructor(message: string = 'Authentication required') {
    super(message)
    this.name = 'AuthenticationError'
  }
}

// Usage
throw new ApiError('Failed to fetch users', 404, '/api/users')
throw new ValidationError('Invalid email', 'email', 'not-an-email')
throw new AuthenticationError()
```

---

## 🎯 Try-Catch Blocks

### Basic Try-Catch

```typescript
const fetchData = async () => {
  try {
    const response = await fetch('/api/data')
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching data:', error)
    throw error
  }
}
```

### Type-Safe Error Handling

```typescript
const parseError = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message
  }
  
  if (typeof error === 'string') {
    return error
  }
  
  return 'An unknown error occurred'
}

const fetchUser = async (id: string) => {
  try {
    const response = await fetch(`/api/users/${id}`)
    return await response.json()
  } catch (error) {
    const message = parseError(error)
    console.error(message)
    throw new Error(message)
  }
}
```

### Multiple Catch Blocks (Pattern)

```typescript
const performAction = async () => {
  try {
    await riskyOperation()
  } catch (error) {
    if (error instanceof ApiError) {
      console.error('API Error:', error.statusCode, error.message)
    } else if (error instanceof ValidationError) {
      console.error('Validation Error:', error.field, error.message)
    } else if (error instanceof AuthenticationError) {
      console.error('Auth Error:', error.message)
      // Redirect to login
    } else {
      console.error('Unknown Error:', error)
    }
  }
}
```

---

## 🛡️ Error Boundaries

### Basic Error Boundary

```typescript
import { Component, ReactNode, ErrorInfo } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      hasError: false,
      error: null
    }
  }
  
  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error
    }
  }
  
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
    
    // Log to error reporting service
    // logErrorToService(error, errorInfo)
  }
  
  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }
      
      return (
        <div className="error-container">
          <h1>Something went wrong</h1>
          <p>{this.state.error?.message}</p>
          <button onClick={() => this.setState({ hasError: false, error: null })}>
            Try Again
          </button>
        </div>
      )
    }
    
    return this.props.children
  }
}

// Usage
<ErrorBoundary>
  <App />
</ErrorBoundary>

<ErrorBoundary fallback={<div>Custom error UI</div>}>
  <RiskyComponent />
</ErrorBoundary>
```

### Advanced Error Boundary

```typescript
interface ErrorBoundaryProps {
  children: ReactNode
  onError?: (error: Error, errorInfo: ErrorInfo) => void
  fallback?: (error: Error, reset: () => void) => ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

class AdvancedErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = {
      hasError: false,
      error: null
    }
  }
  
  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error
    }
  }
  
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error:', error)
    console.error('Error Info:', errorInfo)
    
    // Call custom error handler
    this.props.onError?.(error, errorInfo)
  }
  
  resetError = () => {
    this.setState({ hasError: false, error: null })
  }
  
  render() {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.resetError)
      }
      
      return (
        <div className="error-boundary">
          <h2>Error Occurred</h2>
          <p>{this.state.error.message}</p>
          <button onClick={this.resetError}>Reset</button>
        </div>
      )
    }
    
    return this.props.children
  }
}

// Usage
<AdvancedErrorBoundary
  onError={(error, errorInfo) => {
    // Log to Sentry, LogRocket, etc.
    console.error('Logged error:', error)
  }}
  fallback={(error, reset) => (
    <div>
      <h1>Oops! {error.message}</h1>
      <button onClick={reset}>Try Again</button>
    </div>
  )}
>
  <App />
</AdvancedErrorBoundary>
```

---

## ⚡ Async Error Handling

### useAsync Hook

```typescript
interface UseAsyncState<T> {
  data: T | null
  error: Error | null
  isLoading: boolean
}

function useAsync<T>(
  asyncFunction: () => Promise<T>,
  immediate = true
) {
  const [state, setState] = useState<UseAsyncState<T>>({
    data: null,
    error: null,
    isLoading: immediate
  })
  
  const execute = useCallback(async () => {
    setState({ data: null, error: null, isLoading: true })
    
    try {
      const data = await asyncFunction()
      setState({ data, error: null, isLoading: false })
      return data
    } catch (error) {
      const errorObj = error instanceof Error ? error : new Error(String(error))
      setState({ data: null, error: errorObj, isLoading: false })
      throw errorObj
    }
  }, [asyncFunction])
  
  useEffect(() => {
    if (immediate) {
      execute()
    }
  }, [execute, immediate])
  
  return { ...state, execute }
}

// Usage
const UserProfile = ({ userId }: { userId: string }) => {
  const { data, error, isLoading } = useAsync(
    () => fetch(`/api/users/${userId}`).then(r => r.json()),
    true
  )
  
  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>
  if (!data) return <div>No data</div>
  
  return <div>{data.name}</div>
}
```

### Error Toast Notifications

```typescript
interface ToastState {
  message: string
  type: 'success' | 'error' | 'info'
  id: string
}

const useToast = () => {
  const [toasts, setToasts] = useState<ToastState[]>([])
  
  const showToast = (message: string, type: ToastState['type'] = 'info') => {
    const id = Date.now().toString()
    setToasts(prev => [...prev, { message, type, id }])
    
    // Auto dismiss after 3 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 3000)
  }
  
  const showError = (error: unknown) => {
    const message = parseError(error)
    showToast(message, 'error')
  }
  
  return { toasts, showToast, showError }
}

// Usage
const MyComponent = () => {
  const { showError } = useToast()
  
  const handleSubmit = async () => {
    try {
      await submitData()
    } catch (error) {
      showError(error)
    }
  }
  
  return <button onClick={handleSubmit}>Submit</button>
}
```

---

## 📝 Form Validation Errors

### Field-Level Errors

```typescript
interface FormErrors {
  [field: string]: string | undefined
}

const useFormValidation = <T extends Record<string, any>>(
  initialValues: T,
  validate: (values: T) => FormErrors
) => {
  const [values, setValues] = useState<T>(initialValues)
  const [errors, setErrors] = useState<FormErrors>({})
  const [touched, setTouched] = useState<Record<keyof T, boolean>>(
    {} as Record<keyof T, boolean>
  )
  
  const handleChange = (field: keyof T) => (value: any) => {
    setValues(prev => ({ ...prev, [field]: value }))
    
    // Clear error when user types
    if (errors[field as string]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }
  
  const handleBlur = (field: keyof T) => () => {
    setTouched(prev => ({ ...prev, [field]: true }))
    
    const validationErrors = validate(values)
    if (validationErrors[field as string]) {
      setErrors(prev => ({
        ...prev,
        [field]: validationErrors[field as string]
      }))
    }
  }
  
  const handleSubmit = (onSubmit: (values: T) => void) => 
    (e: React.FormEvent) => {
      e.preventDefault()
      
      const validationErrors = validate(values)
      setErrors(validationErrors)
      
      if (Object.keys(validationErrors).length === 0) {
        onSubmit(values)
      }
    }
  
  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit
  }
}

// Usage
interface LoginForm {
  email: string
  password: string
}

const LoginForm = () => {
  const form = useFormValidation<LoginForm>(
    { email: '', password: '' },
    (values) => {
      const errors: FormErrors = {}
      
      if (!values.email) {
        errors.email = 'Email is required'
      } else if (!/\S+@\S+\.\S+/.test(values.email)) {
        errors.email = 'Invalid email'
      }
      
      if (!values.password) {
        errors.password = 'Password is required'
      } else if (values.password.length < 6) {
        errors.password = 'Password must be at least 6 characters'
      }
      
      return errors
    }
  )
  
  return (
    <form onSubmit={form.handleSubmit((values) => console.log(values))}>
      <div>
        <input
          type="email"
          value={form.values.email}
          onChange={(e) => form.handleChange('email')(e.target.value)}
          onBlur={form.handleBlur('email')}
        />
        {form.touched.email && form.errors.email && (
          <span className="error">{form.errors.email}</span>
        )}
      </div>
      
      <div>
        <input
          type="password"
          value={form.values.password}
          onChange={(e) => form.handleChange('password')(e.target.value)}
          onBlur={form.handleBlur('password')}
        />
        {form.touched.password && form.errors.password && (
          <span className="error">{form.errors.password}</span>
        )}
      </div>
      
      <button type="submit">Login</button>
    </form>
  )
}
```

---

## 🌐 Global Error Handling

### Error Logger Service

```typescript
interface ErrorLog {
  message: string
  stack?: string
  timestamp: Date
  userAgent: string
  url: string
}

class ErrorLogger {
  private static instance: ErrorLogger
  private logs: ErrorLog[] = []
  
  private constructor() {
    this.setupGlobalHandlers()
  }
  
  static getInstance() {
    if (!ErrorLogger.instance) {
      ErrorLogger.instance = new ErrorLogger()
    }
    return ErrorLogger.instance
  }
  
  private setupGlobalHandlers() {
    // Catch unhandled errors
    window.addEventListener('error', (event) => {
      this.log({
        message: event.message,
        stack: event.error?.stack,
        timestamp: new Date(),
        userAgent: navigator.userAgent,
        url: window.location.href
      })
    })
    
    // Catch unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.log({
        message: event.reason?.message || 'Unhandled Promise Rejection',
        stack: event.reason?.stack,
        timestamp: new Date(),
        userAgent: navigator.userAgent,
        url: window.location.href
      })
    })
  }
  
  log(errorLog: ErrorLog) {
    this.logs.push(errorLog)
    console.error('Error logged:', errorLog)
    
    // Send to backend
    this.sendToServer(errorLog)
  }
  
  private async sendToServer(errorLog: ErrorLog) {
    try {
      await fetch('/api/errors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(errorLog)
      })
    } catch (error) {
      console.error('Failed to send error to server:', error)
    }
  }
  
  getLogs() {
    return this.logs
  }
}

// Initialize on app start
const errorLogger = ErrorLogger.getInstance()
```

### API Error Handler

```typescript
class ApiErrorHandler {
  static async handleResponse(response: Response) {
    if (!response.ok) {
      const error = await this.parseError(response)
      throw error
    }
    
    return response.json()
  }
  
  private static async parseError(response: Response): Promise<ApiError> {
    const contentType = response.headers.get('content-type')
    
    if (contentType?.includes('application/json')) {
      const errorData = await response.json()
      return new ApiError(
        errorData.message || 'Request failed',
        response.status,
        response.url
      )
    }
    
    const text = await response.text()
    return new ApiError(
      text || `HTTP ${response.status}`,
      response.status,
      response.url
    )
  }
  
  static handleError(error: unknown): never {
    if (error instanceof ApiError) {
      console.error('API Error:', error.statusCode, error.message)
      
      if (error.statusCode === 401) {
        // Redirect to login
        window.location.href = '/login'
      }
      
      if (error.statusCode === 403) {
        // Show permission denied message
      }
    }
    
    throw error
  }
}

// Usage
const fetchUsers = async () => {
  try {
    const response = await fetch('/api/users')
    return await ApiErrorHandler.handleResponse(response)
  } catch (error) {
    ApiErrorHandler.handleError(error)
  }
}
```

---

## ✅ Best Practices

1. **Always handle errors** - Don't let them silently fail
2. **Use Error Boundaries** for React component errors
3. **Create custom error types** for different scenarios
4. **Log errors** to monitoring service (Sentry, LogRocket)
5. **Show user-friendly messages** - Not technical stack traces
6. **Provide recovery options** - "Try Again" buttons
7. **Validate early** - Catch errors before they propagate
8. **Type your errors** - Use TypeScript for type safety
9. **Clean up resources** - Use finally blocks
10. **Test error scenarios** - Don't just test happy paths

---

## 🚫 Anti-Patterns

```typescript
// ❌ Swallowing errors
try {
  riskyOperation()
} catch (error) {
  // Nothing here - error is lost!
}

// ✅ At least log it
try {
  riskyOperation()
} catch (error) {
  console.error('Operation failed:', error)
  throw error // Re-throw if needed
}

// ❌ Generic error messages
throw new Error('Error occurred')

// ✅ Descriptive messages
throw new Error('Failed to fetch user data: Invalid user ID')

// ❌ Using any for errors
} catch (error: any) {
  console.log(error.message)
}

// ✅ Proper type checking
} catch (error) {
  if (error instanceof Error) {
    console.log(error.message)
  }
}
```

---

## 🎓 Practice Exercises

1. Create an ErrorBoundary with error logging
2. Build a global error notification system
3. Implement retry logic for failed API calls
4. Create a form with comprehensive validation
5. Build an error recovery mechanism

---

**Next:** [Advanced Hooks →](./11-ADVANCED-HOOKS.md)
