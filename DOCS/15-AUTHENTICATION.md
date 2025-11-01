# Authentication Documentation

## 📖 Table of Contents
1. [Overview](#overview)
2. [Firebase Authentication](#firebase-authentication)
3. [Auth Flow](#auth-flow)
4. [Login Implementation](#login-implementation)
5. [Protected Routes](#protected-routes)
6. [Auth Context](#auth-context)
7. [Security Best Practices](#security-best-practices)

---

## Overview

The portfolio uses Firebase Authentication for secure admin access. Only authenticated users can access the admin panel and manage portfolio content.

### Authentication Features
- ✅ Email/Password authentication
- ✅ Session persistence
- ✅ Protected routes
- ✅ Auto-redirect on auth state change
- ✅ Secure logout
- ✅ Error handling

---

## Firebase Authentication

### Setup

1. **Enable Authentication in Firebase Console**:
   - Go to Authentication section
   - Click "Get started"
   - Enable "Email/Password" sign-in method

2. **Create Admin User**:
   - Go to Authentication → Users
   - Click "Add user"
   - Enter email: `admin@yourdomain.com`
   - Enter password (minimum 6 characters)

### Configuration

Firebase Auth is initialized in the config file:

```typescript
// src/infrastructure/firebase/config.ts
import { getAuth } from 'firebase/auth'
import { initializeApp } from 'firebase/app'

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
```

---

## Auth Flow

### Authentication Sequence

```
1. User visits /admin
   ↓
2. ProtectedRoute checks auth state
   ↓
3. If not authenticated → redirect to /admin/login
   ↓
4. User enters credentials
   ↓
5. Firebase validates credentials
   ↓
6. If valid → set auth state, redirect to /admin
   ↓
7. User accesses admin panel
```

### State Diagram

```
┌─────────────┐
│   Visitor   │
└──────┬──────┘
       │
       ▼
┌─────────────────┐
│  Visit /admin   │
└────────┬────────┘
         │
         ▼
    ┌────────────┐
    │ Is Auth?   │
    └─┬────────┬─┘
      │ No     │ Yes
      ▼        ▼
┌──────────┐  ┌──────────┐
│  Login   │  │  Admin   │
│  Page    │  │  Panel   │
└──────────┘  └──────────┘
```

---

## Login Implementation

### AuthRepository

**File**: `src/infrastructure/repositories/AuthRepository.ts`

```typescript
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
  Auth
} from 'firebase/auth'
import { auth } from '../firebase/config'

export interface IAuthRepository {
  login(email: string, password: string): Promise<User>
  logout(): Promise<void>
  getCurrentUser(): User | null
  onAuthChange(callback: (user: User | null) => void): () => void
}

export class FirebaseAuthRepository implements IAuthRepository {
  constructor(private auth: Auth = auth) {}
  
  async login(email: string, password: string): Promise<User> {
    try {
      const userCredential = await signInWithEmailAndPassword(
        this.auth,
        email,
        password
      )
      return userCredential.user
    } catch (error: any) {
      console.error('Login error:', error)
      
      // Map Firebase errors to user-friendly messages
      switch (error.code) {
        case 'auth/invalid-email':
          throw new Error('Invalid email address format')
        case 'auth/user-disabled':
          throw new Error('This account has been disabled')
        case 'auth/user-not-found':
          throw new Error('No account found with this email')
        case 'auth/wrong-password':
          throw new Error('Incorrect password')
        case 'auth/too-many-requests':
          throw new Error('Too many failed login attempts. Please try again later')
        case 'auth/network-request-failed':
          throw new Error('Network error. Please check your connection')
        default:
          throw new Error('Login failed. Please try again')
      }
    }
  }
  
  async logout(): Promise<void> {
    try {
      await signOut(this.auth)
    } catch (error) {
      console.error('Logout error:', error)
      throw new Error('Logout failed. Please try again')
    }
  }
  
  getCurrentUser(): User | null {
    return this.auth.currentUser
  }
  
  onAuthChange(callback: (user: User | null) => void): () => void {
    return onAuthStateChanged(this.auth, callback)
  }
}
```

---

### useAuth Hook

**File**: `src/presentation/hooks/useAuth.ts`

```typescript
import { useEffect, useState } from 'react'
import { User } from 'firebase/auth'
import { FirebaseAuthRepository } from '../../infrastructure/repositories/AuthRepository'

const authRepo = new FirebaseAuthRepository()

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Subscribe to auth state changes on mount
  useEffect(() => {
    const unsubscribe = authRepo.onAuthChange((authUser) => {
      setUser(authUser)
      setLoading(false)
    })
    
    // Cleanup subscription on unmount
    return () => unsubscribe()
  }, [])
  
  // Login function
  const login = async (email: string, password: string) => {
    try {
      setLoading(true)
      setError(null)
      const user = await authRepo.login(email, password)
      setUser(user)
      return user
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }
  
  // Logout function
  const logout = async () => {
    try {
      setLoading(true)
      setError(null)
      await authRepo.logout()
      setUser(null)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Logout failed'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }
  
  return {
    user,
    loading,
    error,
    login,
    logout,
    isAuthenticated: !!user
  }
}
```

---

### Login Page

**File**: `src/presentation/pages/AdminLogin.tsx`

```typescript
import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Mail, Lock, AlertCircle } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { Input, Button, Card } from '../components/ui'

export default function AdminLogin() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, isAuthenticated, error: authError } = useAuth()
  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const from = (location.state as any)?.from?.pathname || '/admin'
      navigate(from, { replace: true })
    }
  }, [isAuthenticated, navigate, location])
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation
    if (!email || !password) {
      setError('Please enter email and password')
      return
    }
    
    try {
      setLoading(true)
      setError(null)
      await login(email, password)
      // Navigation happens in useEffect
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <div className="min-h-screen bg-tokyo-bg flex items-center justify-center px-4">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-tokyo-cyan mb-2">
            Admin Login
          </h1>
          <p className="text-tokyo-comment">
            Sign in to manage your portfolio
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Error Alert */}
          {(error || authError) && (
            <div className="bg-tokyo-red/10 border border-tokyo-red text-tokyo-red rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="flex-shrink-0 mt-0.5" size={20} />
              <p className="text-sm">{error || authError}</p>
            </div>
          )}
          
          {/* Email Input */}
          <Input
            type="email"
            label="Email"
            placeholder="admin@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon={<Mail size={18} />}
            disabled={loading}
            autoComplete="email"
            required
          />
          
          {/* Password Input */}
          <Input
            type="password"
            label="Password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            icon={<Lock size={18} />}
            disabled={loading}
            autoComplete="current-password"
            required
          />
          
          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full"
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>
        
        {/* Footer */}
        <div className="mt-6 text-center">
          <a
            href="/"
            className="text-sm text-tokyo-cyan hover:underline"
          >
            ← Back to Portfolio
          </a>
        </div>
      </Card>
    </div>
  )
}
```

---

## Protected Routes

### ProtectedRoute Component

```typescript
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { Loading } from '../components/ui'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth()
  const location = useLocation()
  
  // Show loading while checking auth state
  if (loading) {
    return (
      <div className="min-h-screen bg-tokyo-bg flex items-center justify-center">
        <Loading text="Checking authentication..." />
      </div>
    )
  }
  
  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />
  }
  
  // Render children if authenticated
  return <>{children}</>
}
```

### Route Configuration

```typescript
// src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from './presentation/components/ProtectedRoute'
import PortfolioPage from './presentation/pages/PortfolioPage'
import AdminLogin from './presentation/pages/AdminLogin'
import AdminPage from './presentation/pages/AdminPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<PortfolioPage />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        
        {/* Protected Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminPage />
            </ProtectedRoute>
          }
        />
        
        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
```

---

## Auth Context

For global auth state access across the app:

```typescript
// src/presentation/contexts/AuthContext.tsx
import { createContext, useContext, ReactNode } from 'react'
import { useAuth } from '../hooks/useAuth'
import type { User } from 'firebase/auth'

interface AuthContextType {
  user: User | null
  loading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<User>
  logout: () => Promise<void>
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const auth = useAuth()
  
  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuthContext() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuthContext must be used within AuthProvider')
  }
  return context
}
```

**Usage in App**:
```typescript
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        {/* routes */}
      </BrowserRouter>
    </AuthProvider>
  )
}
```

---

## Security Best Practices

### 1. Password Requirements

Enforce strong passwords in Firebase Console:
- Minimum 8 characters
- Include uppercase, lowercase, numbers
- Include special characters

### 2. Rate Limiting

Firebase automatically rate limits failed login attempts. After multiple failures:
- Temporary account lockout
- CAPTCHA requirement
- IP-based throttling

### 3. Session Management

```typescript
// Auto-logout after inactivity
useEffect(() => {
  let timeout: NodeJS.Timeout
  
  const resetTimeout = () => {
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      logout()
      navigate('/admin/login')
    }, 30 * 60 * 1000) // 30 minutes
  }
  
  // Reset on user activity
  const events = ['mousedown', 'keydown', 'scroll', 'touchstart']
  events.forEach(event => {
    document.addEventListener(event, resetTimeout)
  })
  
  resetTimeout()
  
  return () => {
    clearTimeout(timeout)
    events.forEach(event => {
      document.removeEventListener(event, resetTimeout)
    })
  }
}, [])
```

### 4. Secure Token Storage

Firebase handles token storage securely:
- Tokens stored in IndexedDB (not localStorage)
- Automatic token refresh
- Secure HTTP-only cookies (when configured)

### 5. HTTPS Only

Always use HTTPS in production:
```typescript
// vite.config.ts
export default defineConfig({
  server: {
    https: true // Development
  }
})
```

### 6. Environment Variables

Never commit credentials:
```env
# .env (add to .gitignore)
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
```

### 7. Firestore Security Rules

Restrict write access to authenticated users:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function isAdmin() {
      return isAuthenticated() && 
             request.auth.token.email == 'admin@example.com';
    }
    
    match /{document=**} {
      allow read: if true;
      allow write: if isAdmin();
    }
  }
}
```

---

## Testing Authentication

### Manual Testing

1. **Test Login**:
   - Valid credentials → Success
   - Invalid email → Error message
   - Invalid password → Error message
   - Empty fields → Validation error

2. **Test Protected Routes**:
   - Access /admin without login → Redirect to login
   - Login → Access /admin successfully
   - Refresh page → Stay logged in

3. **Test Logout**:
   - Click logout → Redirect to home
   - Try accessing /admin → Redirect to login

### Automated Tests

```typescript
// tests/auth.test.ts
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import AdminLogin from '../src/presentation/pages/AdminLogin'

describe('AdminLogin', () => {
  test('shows validation error for empty fields', async () => {
    render(
      <BrowserRouter>
        <AdminLogin />
      </BrowserRouter>
    )
    
    const submitButton = screen.getByText('Sign In')
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText('Please enter email and password')).toBeInTheDocument()
    })
  })
  
  test('calls login on form submit', async () => {
    const mockLogin = jest.fn()
    
    render(
      <BrowserRouter>
        <AdminLogin />
      </BrowserRouter>
    )
    
    const emailInput = screen.getByPlaceholderText('admin@example.com')
    const passwordInput = screen.getByPlaceholderText('••••••••')
    
    fireEvent.change(emailInput, { target: { value: 'admin@test.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    
    const submitButton = screen.getByText('Sign In')
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('admin@test.com', 'password123')
    })
  })
})
```

---

**Next**: [16-ADMIN-PANEL.md](./16-ADMIN-PANEL.md) - Admin components and CRUD operations
