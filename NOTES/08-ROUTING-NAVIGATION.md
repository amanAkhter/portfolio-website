# Routing & Navigation with React Router

> Master client-side routing with React Router and TypeScript

## 📚 Table of Contents
1. [Setup & Installation](#setup--installation)
2. [Basic Routing](#basic-routing)
3. [Route Parameters](#route-parameters)
4. [Navigation Methods](#navigation-methods)
5. [Protected Routes](#protected-routes)
6. [Nested Routes](#nested-routes)
7. [Real Portfolio Example](#real-portfolio-example)

---

## 🚀 Setup & Installation

```bash
pnpm add react-router-dom
pnpm add -D @types/react-router-dom
```

---

## 🗺️ Basic Routing

**From `src/App.tsx`:**

```typescript
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'

function App() {
  return (
    <Router>
      <Routes>
        {/* Basic Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        
        {/* 404 Redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}
```

### Lazy Loading Routes

```typescript
import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { LoadingScreen } from './components/ui'

// Lazy load pages for better performance
const HomePage = React.lazy(() => import('./pages/HomePage'))
const AboutPage = React.lazy(() => import('./pages/AboutPage'))
const AdminPage = React.lazy(() => import('./pages/AdminPage'))

function App() {
  return (
    <Router>
      <React.Suspense fallback={<LoadingScreen />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/admin/*" element={<AdminPage />} />
        </Routes>
      </React.Suspense>
    </Router>
  )
}
```

---

## 🎯 Route Parameters

### Dynamic Routes

```typescript
import { useParams } from 'react-router-dom'

// Define route
<Route path="/users/:userId" element={<UserProfile />} />

// Access params in component
interface UserProfileParams {
  userId: string
}

const UserProfile = () => {
  const { userId } = useParams<UserProfileParams>()
  
  return <div>User ID: {userId}</div>
}

// Multiple params
<Route path="/blog/:category/:postId" element={<BlogPost />} />

interface BlogPostParams {
  category: string
  postId: string
}

const BlogPost = () => {
  const { category, postId } = useParams<BlogPostParams>()
  
  return (
    <div>
      <p>Category: {category}</p>
      <p>Post ID: {postId}</p>
    </div>
  )
}
```

### Query Parameters

```typescript
import { useSearchParams } from 'react-router-dom'

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  
  const query = searchParams.get('q') || ''
  const page = searchParams.get('page') || '1'
  const sort = searchParams.get('sort') || 'recent'
  
  const handleSearch = (newQuery: string) => {
    setSearchParams({ q: newQuery, page: '1', sort })
  }
  
  return (
    <div>
      <input 
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
      />
      <p>Page: {page}</p>
      <p>Sort: {sort}</p>
    </div>
  )
}

// URL: /search?q=react&page=2&sort=popular
```

---

## 🧭 Navigation Methods

### Link Component

```typescript
import { Link } from 'react-router-dom'

const Navigation = () => (
  <nav>
    <Link to="/">Home</Link>
    <Link to="/about">About</Link>
    <Link to="/contact">Contact</Link>
    
    {/* With state */}
    <Link 
      to="/user/123" 
      state={{ from: 'navigation' }}
    >
      User Profile
    </Link>
    
    {/* External link */}
    <Link to="/docs" reloadDocument>
      Docs (full page reload)
    </Link>
  </nav>
)
```

### NavLink Component (Active Styling)

```typescript
import { NavLink } from 'react-router-dom'

const Navigation = () => (
  <nav>
    <NavLink
      to="/"
      className={({ isActive }) => 
        isActive ? 'nav-link active' : 'nav-link'
      }
    >
      Home
    </NavLink>
    
    <NavLink
      to="/about"
      style={({ isActive }) => ({
        color: isActive ? 'blue' : 'black',
        fontWeight: isActive ? 'bold' : 'normal',
      })}
    >
      About
    </NavLink>
  </nav>
)
```

### Programmatic Navigation

```typescript
import { useNavigate } from 'react-router-dom'

const LoginPage = () => {
  const navigate = useNavigate()
  
  const handleLogin = async (email: string, password: string) => {
    await authService.login(email, password)
    
    // Navigate to dashboard
    navigate('/dashboard')
    
    // Navigate with replace (no back button)
    navigate('/dashboard', { replace: true })
    
    // Navigate with state
    navigate('/dashboard', { 
      state: { from: 'login' } 
    })
    
    // Go back
    navigate(-1)
    
    // Go forward
    navigate(1)
  }
  
  return <LoginForm onSubmit={handleLogin} />
}
```

---

## 🔒 Protected Routes

**Real Example from Portfolio:**

```typescript
// src/App.tsx
import { Navigate } from 'react-router-dom'
import type { User } from './shared/types'

// Protected Route Component
interface ProtectedRouteProps {
  children: React.ReactNode
  user: User | null
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, user }) => {
  if (!user) {
    return <Navigate to="/admin/login" replace />
  }

  if (user.role !== 'admin') {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}

function App() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = authService.onAuthStateChanged((currentUser) => {
      setUser(currentUser)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  if (loading) {
    return <LoadingScreen />
  }

  return (
    <Router>
      <React.Suspense fallback={<LoadingScreen />}>
        <Routes>
          <Route path="/" element={<PortfolioPage />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          
          {/* Protected Route */}
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute user={user}>
                <AdminPage />
              </ProtectedRoute>
            }
          />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </React.Suspense>
    </Router>
  )
}
```

### Alternative: Custom Hook

```typescript
import { useAuth } from './hooks/useAuth'
import { Navigate, useLocation } from 'react-router-dom'

const RequireAuth: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return <LoadingScreen />
  }

  if (!isAuthenticated) {
    // Redirect to login, save the location they were trying to access
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <>{children}</>
}

// Usage
<Route
  path="/dashboard"
  element={
    <RequireAuth>
      <DashboardPage />
    </RequireAuth>
  }
/>
```

---

## 🗂️ Nested Routes

```typescript
// Parent component with Outlet
import { Outlet, Link } from 'react-router-dom'

const AdminLayout = () => (
  <div className="admin-layout">
    <aside>
      <nav>
        <Link to="/admin/dashboard">Dashboard</Link>
        <Link to="/admin/users">Users</Link>
        <Link to="/admin/settings">Settings</Link>
      </nav>
    </aside>
    
    <main>
      {/* Nested routes render here */}
      <Outlet />
    </main>
  </div>
)

// Route configuration
<Route path="/admin" element={<AdminLayout />}>
  <Route path="dashboard" element={<Dashboard />} />
  <Route path="users" element={<Users />} />
  <Route path="users/:userId" element={<UserDetail />} />
  <Route path="settings" element={<Settings />} />
  <Route index element={<Navigate to="dashboard" replace />} />
</Route>
```

### Index Routes

```typescript
<Route path="/admin" element={<AdminLayout />}>
  {/* Default route when at /admin */}
  <Route index element={<AdminDashboard />} />
  
  <Route path="users" element={<UsersList />} />
  <Route path="settings" element={<Settings />} />
</Route>
```

---

## 🎯 Real Portfolio Example

**Complete routing setup from the portfolio:**

```typescript
// src/App.tsx
import React, { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { authService } from './core/usecases'
import { LoadingScreen } from './presentation/components/ui'
import type { User } from './shared/types'

// Lazy load pages
const PortfolioPage = React.lazy(() => import('./presentation/pages/PortfolioPage'))
const AdminPage = React.lazy(() => import('./presentation/pages/AdminPage'))
const AdminLogin = React.lazy(() => import('./presentation/pages/AdminLogin'))

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode; user: User | null }> = ({ 
  children, 
  user 
}) => {
  if (!user) {
    return <Navigate to="/admin/login" replace />
  }

  if (user.role !== 'admin') {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}

function App() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Listen to auth state changes
    const unsubscribe = authService.onAuthStateChanged((currentUser) => {
      setUser(currentUser)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  if (loading) {
    return <LoadingScreen />
  }

  return (
    <Router>
      <React.Suspense fallback={<LoadingScreen />}>
        <Routes>
          {/* Main Portfolio Route */}
          <Route path="/" element={<PortfolioPage />} />

          {/* Admin Login */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Protected Admin Route */}
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute user={user}>
                <AdminPage />
              </ProtectedRoute>
            }
          />

          {/* 404 Redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </React.Suspense>
    </Router>
  )
}

export default App
```

---

## 🔧 Advanced Patterns

### Route Loaders (React Router v6.4+)

```typescript
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

const router = createBrowserRouter([
  {
    path: '/users/:userId',
    element: <UserProfile />,
    loader: async ({ params }) => {
      const user = await fetch(`/api/users/${params.userId}`)
      return user.json()
    },
  },
])

function App() {
  return <RouterProvider router={router} />
}

// In component
import { useLoaderData } from 'react-router-dom'

const UserProfile = () => {
  const user = useLoaderData() as User
  return <div>{user.name}</div>
}
```

### Error Boundaries

```typescript
import { useRouteError } from 'react-router-dom'

function ErrorBoundary() {
  const error = useRouteError() as Error
  
  return (
    <div>
      <h1>Oops!</h1>
      <p>{error.message}</p>
    </div>
  )
}

// In routes
const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorBoundary />,
    children: [
      { path: 'users', element: <Users /> },
    ],
  },
])
```

---

## ✅ Best Practices

1. **Use lazy loading** - Improve initial load time
2. **Protect sensitive routes** - Authentication checks
3. **Handle 404s** - Catch-all route
4. **Use TypeScript** - Type your params
5. **Implement loading states** - Better UX
6. **Use NavLink for navigation** - Show active state
7. **Consider route loaders** - Data fetching patterns

---

## 🚫 Anti-Patterns

```typescript
// ❌ Don't navigate in render
const Component = () => {
  const navigate = useNavigate()
  navigate('/home') // Causes infinite loop!
  return <div>Content</div>
}

// ✅ Navigate in effects or handlers
const Component = () => {
  const navigate = useNavigate()
  
  useEffect(() => {
    if (condition) {
      navigate('/home')
    }
  }, [condition])
  
  return <div>Content</div>
}

// ❌ Hard-coded redirects
window.location.href = '/home' // Causes full page reload

// ✅ Use navigate
navigate('/home')
```

---

**Next:** [Forms & Validation →](./09-FORMS-VALIDATION.md)
