# Routing Documentation

## 📖 Table of Contents
1. [Overview](#overview)
2. [Route Configuration](#route-configuration)
3. [Navigation](#navigation)
4. [Protected Routes](#protected-routes)
5. [Route Parameters](#route-parameters)
6. [Best Practices](#best-practices)

---

## Overview

The portfolio uses React Router v6 for client-side routing and React Scroll for smooth section navigation on the main portfolio page.

### Dependencies

```json
{
  "react-router-dom": "^6.x",
  "react-scroll": "^1.9.0"
}
```

---

## Route Configuration

### Main Router Setup

**File**: `src/App.tsx`

```typescript
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './presentation/hooks'
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
        
        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
```

---

## Navigation

### Programmatic Navigation

```typescript
import { useNavigate } from 'react-router-dom'

const LoginPage = () => {
  const navigate = useNavigate()
  const { login } = useAuth()
  
  const handleLogin = async (email: string, password: string) => {
    try {
      await login(email, password)
      navigate('/admin') // Navigate after successful login
    } catch (error) {
      console.error('Login failed:', error)
    }
  }
  
  return (
    <form onSubmit={handleLogin}>
      {/* form fields */}
    </form>
  )
}
```

### Link Navigation

```typescript
import { Link } from 'react-router-dom'

const Navigation = () => {
  return (
    <nav>
      <Link to="/" className="nav-link">Home</Link>
      <Link to="/admin" className="nav-link">Admin</Link>
      <Link to="/admin/login" className="nav-link">Login</Link>
    </nav>
  )
}
```

### Smooth Scroll Navigation

**Portfolio page uses React Scroll for smooth section navigation**:

```typescript
import { Link } from 'react-scroll'

const Navigation = () => {
  return (
    <nav>
      <Link
        to="home"
        spy={true}
        smooth={true}
        duration={500}
        offset={-80}
        activeClass="text-tokyo-cyan"
        className="nav-link cursor-pointer"
      >
        Home
      </Link>
      
      <Link
        to="about"
        spy={true}
        smooth={true}
        duration={500}
        offset={-80}
        activeClass="text-tokyo-cyan"
        className="nav-link cursor-pointer"
      >
        About
      </Link>
      
      <Link
        to="projects"
        spy={true}
        smooth={true}
        duration={500}
        offset={-80}
        activeClass="text-tokyo-cyan"
        className="nav-link cursor-pointer"
      >
        Projects
      </Link>
    </nav>
  )
}
```

---

## Protected Routes

### ProtectedRoute Component

```typescript
import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { Loading } from '../components/ui'

interface ProtectedRouteProps {
  children: React.ReactNode
}

function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth()
  
  if (loading) {
    return <Loading text="Checking authentication..." />
  }
  
  if (!user) {
    return <Navigate to="/admin/login" replace />
  }
  
  return <>{children}</>
}

export default ProtectedRoute
```

### Usage

```typescript
<Route
  path="/admin"
  element={
    <ProtectedRoute>
      <AdminPage />
    </ProtectedRoute>
  }
/>
```

---

## Route Parameters

### Dynamic Routes (if needed)

```typescript
// Route definition
<Route path="/projects/:id" element={<ProjectDetail />} />

// Component
import { useParams } from 'react-router-dom'

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>()
  const [project, setProject] = useState<Project | null>(null)
  
  useEffect(() => {
    loadProject(id!)
  }, [id])
  
  const loadProject = async (projectId: string) => {
    const data = await portfolioService.getProjectById(projectId)
    setProject(data)
  }
  
  return (
    <div>
      {project && (
        <>
          <h1>{project.title}</h1>
          <p>{project.description}</p>
        </>
      )}
    </div>
  )
}
```

### Query Parameters

```typescript
import { useSearchParams } from 'react-router-dom'

const ProjectsList = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  
  const category = searchParams.get('category') || 'all'
  const search = searchParams.get('search') || ''
  
  const handleFilterChange = (newCategory: string) => {
    setSearchParams({ category: newCategory, search })
  }
  
  return (
    <div>
      <select value={category} onChange={(e) => handleFilterChange(e.target.value)}>
        <option value="all">All</option>
        <option value="web">Web</option>
        <option value="mobile">Mobile</option>
      </select>
    </div>
  )
}
```

---

## Best Practices

### 1. Redirect After Login

```typescript
const AdminLogin = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, isAuthenticated } = useAuth()
  
  // Redirect to intended page or admin dashboard
  const from = (location.state as any)?.from?.pathname || '/admin'
  
  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true })
    }
  }, [isAuthenticated, navigate, from])
  
  return <LoginForm onLogin={login} />
}
```

### 2. 404 Page

```typescript
const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-tokyo-cyan mb-4">404</h1>
        <p className="text-tokyo-comment mb-8">Page not found</p>
        <Link to="/" className="text-tokyo-blue hover:underline">
          Go Home
        </Link>
      </div>
    </div>
  )
}

// In routes
<Route path="*" element={<NotFound />} />
```

### 3. Layout Routes

```typescript
const AdminLayout = () => {
  return (
    <div className="min-h-screen bg-tokyo-bg">
      <AdminHeader />
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

// In routes
<Route path="/admin" element={<AdminLayout />}>
  <Route index element={<AdminDashboard />} />
  <Route path="projects" element={<ProjectManager />} />
  <Route path="skills" element={<SkillManager />} />
</Route>
```

---

**Next**: [13-API-SERVICES.md](./13-API-SERVICES.md) - Service layer details
