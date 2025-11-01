# Data Flow Documentation

## 📖 Table of Contents
1. [Overview](#overview)
2. [Request Flow](#request-flow)
3. [State Management](#state-management)
4. [Data Fetching Patterns](#data-fetching-patterns)
5. [Update Operations](#update-operations)
6. [Real-Time Updates](#real-time-updates)
7. [Best Practices](#best-practices)

---

## Overview

This document explains how data flows through the application, from user interactions to database updates and back to the UI.

### Architecture Flow

```
User Interaction
    ↓
React Component
    ↓
Custom Hook (usePortfolio)
    ↓
PortfolioService (Use Case Layer)
    ↓
Repository Interface (Domain Layer)
    ↓
Firebase Repository (Infrastructure Layer)
    ↓
Firestore Database
    ↓
Response flows back up the chain
    ↓
Component Re-renders with new data
```

---

## Request Flow

### Read Operations

```typescript
// 1. Component initiates request
const Projects = () => {
  const { portfolioService } = usePortfolio()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    loadProjects()
  }, [])
  
  // 2. Load function calls service
  const loadProjects = async () => {
    try {
      setLoading(true)
      
      // 3. Service orchestrates business logic
      const data = await portfolioService.getAllProjects()
      
      // 4. Update component state
      setProjects(data)
    } catch (error) {
      console.error('Error loading projects:', error)
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <div>
      {loading ? (
        <Loading />
      ) : (
        projects.map(project => <ProjectCard key={project.id} project={project} />)
      )}
    </div>
  )
}
```

**Flow Breakdown**:
1. Component mounts, `useEffect` triggers
2. `loadProjects` function called
3. Set loading state to true
4. Call `portfolioService.getAllProjects()`
5. Service calls `projectRepo.getAllProjects()`
6. Repository queries Firestore
7. Firestore returns documents
8. Repository maps documents to domain entities
9. Service applies business logic (sorting, filtering)
10. Data returned to component
11. Component updates state
12. React re-renders with new data

---

### Write Operations

```typescript
// Admin component creating a new project
const ProjectManager = () => {
  const { portfolioService } = usePortfolio()
  const [formData, setFormData] = useState<Omit<Project, 'id'>>({
    title: '',
    description: '',
    // ... other fields
  })
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      // 1. Validate on client
      if (!formData.title || !formData.description) {
        throw new Error('Required fields missing')
      }
      
      // 2. Call service to create project
      const projectId = await portfolioService.createProject(formData)
      
      // 3. Service validates business rules
      // 4. Repository saves to Firestore
      // 5. New ID returned
      
      // 6. Refresh list or navigate
      console.log('Project created:', projectId)
      
      // Reset form
      setFormData(/* initial state */)
    } catch (error) {
      console.error('Error creating project:', error)
    }
  }
  
  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
    </form>
  )
}
```

**Flow Breakdown**:
1. User fills form and submits
2. Client-side validation
3. Call `portfolioService.createProject()`
4. Service validates business rules
5. Service calls `projectRepo.createProject()`
6. Repository saves to Firestore with timestamps
7. Firestore returns new document ID
8. ID bubbles back to component
9. Component resets form or navigates
10. List components can refetch to show new item

---

## State Management

### Component-Level State

```typescript
// Local state for form data
const [formData, setFormData] = useState<FormData>(initialState)

// Local state for loading
const [loading, setLoading] = useState(false)

// Local state for errors
const [error, setError] = useState<string | null>(null)

// Update handlers
const handleChange = (field: string, value: any) => {
  setFormData(prev => ({ ...prev, [field]: value }))
}
```

### Custom Hooks for Shared State

**File**: `src/presentation/hooks/usePortfolio.ts`

```typescript
import { useMemo } from 'react'
import { PortfolioService } from '../../core/usecases'
import { RepositoryFactory } from '../../infrastructure/repositories/FirebaseRepositories'

export function usePortfolio() {
  const portfolioService = useMemo(() => {
    const repos = RepositoryFactory.createAllRepositories()
    return new PortfolioService(
      repos.homeRepo,
      repos.aboutRepo,
      repos.projectRepo,
      repos.experienceRepo,
      repos.skillRepo,
      repos.certificationRepo,
      repos.educationRepo,
      repos.contactRepo
    )
  }, [])
  
  return { portfolioService }
}

// Usage in components
const { portfolioService } = usePortfolio()
```

### Authentication State

**File**: `src/presentation/hooks/useAuth.ts`

```typescript
import { useEffect, useState } from 'react'
import { User } from 'firebase/auth'
import { FirebaseAuthRepository } from '../../infrastructure/repositories/AuthRepository'

const authRepo = new FirebaseAuthRepository()

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    // Subscribe to auth state changes
    const unsubscribe = authRepo.onAuthChange((authUser) => {
      setUser(authUser)
      setLoading(false)
    })
    
    // Cleanup subscription
    return () => unsubscribe()
  }, [])
  
  const login = async (email: string, password: string) => {
    try {
      const user = await authRepo.login(email, password)
      setUser(user)
      return user
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  }
  
  const logout = async () => {
    try {
      await authRepo.logout()
      setUser(null)
    } catch (error) {
      console.error('Logout error:', error)
      throw error
    }
  }
  
  return { user, loading, login, logout }
}
```

---

## Data Fetching Patterns

### 1. Load on Mount

```typescript
const Component = () => {
  const [data, setData] = useState<Data[]>([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    loadData()
  }, []) // Empty dependency array = mount only
  
  const loadData = async () => {
    setLoading(true)
    try {
      const result = await service.getData()
      setData(result)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }
  
  return loading ? <Loading /> : <DataList data={data} />
}
```

### 2. Load with Dependencies

```typescript
const FilteredComponent = ({ category }: { category: string }) => {
  const [data, setData] = useState<Data[]>([])
  
  useEffect(() => {
    loadData()
  }, [category]) // Re-fetch when category changes
  
  const loadData = async () => {
    const result = await service.getDataByCategory(category)
    setData(result)
  }
  
  return <DataList data={data} />
}
```

### 3. Manual Refresh

```typescript
const Component = () => {
  const [data, setData] = useState<Data[]>([])
  const [refreshing, setRefreshing] = useState(false)
  
  const loadData = async () => {
    const result = await service.getData()
    setData(result)
  }
  
  const handleRefresh = async () => {
    setRefreshing(true)
    try {
      await loadData()
    } finally {
      setRefreshing(false)
    }
  }
  
  useEffect(() => {
    loadData()
  }, [])
  
  return (
    <div>
      <Button onClick={handleRefresh} disabled={refreshing}>
        Refresh
      </Button>
      <DataList data={data} />
    </div>
  )
}
```

### 4. Optimistic Updates

```typescript
const Component = () => {
  const [items, setItems] = useState<Item[]>([])
  
  const handleDelete = async (id: string) => {
    // Optimistically remove from UI
    const previousItems = [...items]
    setItems(items.filter(item => item.id !== id))
    
    try {
      // Perform actual delete
      await service.deleteItem(id)
    } catch (error) {
      // Rollback on error
      setItems(previousItems)
      console.error('Delete failed:', error)
    }
  }
  
  return (
    <ItemList 
      items={items}
      onDelete={handleDelete}
    />
  )
}
```

---

## Update Operations

### CRUD Pattern Example

```typescript
const ProjectManager = () => {
  const { portfolioService } = usePortfolio()
  const [projects, setProjects] = useState<Project[]>([])
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  
  // CREATE
  const handleCreate = async (data: Omit<Project, 'id'>) => {
    try {
      const id = await portfolioService.createProject(data)
      
      // Refetch or add to list
      const newProject = await portfolioService.getProjectById(id)
      setProjects([...projects, newProject])
    } catch (error) {
      console.error('Create failed:', error)
    }
  }
  
  // READ
  const loadProjects = async () => {
    const data = await portfolioService.getAllProjects()
    setProjects(data)
  }
  
  // UPDATE
  const handleUpdate = async (id: string, updates: Partial<Project>) => {
    try {
      await portfolioService.updateProject(id, updates)
      
      // Update local state
      setProjects(projects.map(p => 
        p.id === id ? { ...p, ...updates } : p
      ))
      
      setEditingProject(null)
    } catch (error) {
      console.error('Update failed:', error)
    }
  }
  
  // DELETE
  const handleDelete = async (id: string) => {
    try {
      await portfolioService.deleteProject(id)
      
      // Remove from local state
      setProjects(projects.filter(p => p.id !== id))
    } catch (error) {
      console.error('Delete failed:', error)
    }
  }
  
  useEffect(() => {
    loadProjects()
  }, [])
  
  return (
    <div>
      <ProjectForm onSubmit={handleCreate} />
      
      <ProjectList
        projects={projects}
        onEdit={setEditingProject}
        onDelete={handleDelete}
      />
      
      {editingProject && (
        <EditModal
          project={editingProject}
          onSave={handleUpdate}
          onClose={() => setEditingProject(null)}
        />
      )}
    </div>
  )
}
```

---

## Real-Time Updates

### Firestore Real-Time Listeners

```typescript
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore'
import { db } from '../firebase/config'

export class FirebaseProjectRepository implements IProjectRepository {
  // Real-time subscription
  subscribeToProjects(callback: (projects: Project[]) => void): () => void {
    const q = query(
      collection(db, 'projects'),
      orderBy('startDate', 'desc')
    )
    
    // Set up listener
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const projects = snapshot.docs.map(doc =>
          this.mapDocToProject(doc.id, doc.data())
        )
        callback(projects)
      },
      (error) => {
        console.error('Subscription error:', error)
      }
    )
    
    // Return cleanup function
    return unsubscribe
  }
}
```

### Using Real-Time Updates in Components

```typescript
const ProjectsLiveView = () => {
  const [projects, setProjects] = useState<Project[]>([])
  
  useEffect(() => {
    const projectRepo = new FirebaseProjectRepository()
    
    // Subscribe to real-time updates
    const unsubscribe = projectRepo.subscribeToProjects((updatedProjects) => {
      setProjects(updatedProjects)
    })
    
    // Cleanup on unmount
    return () => unsubscribe()
  }, [])
  
  return <ProjectList projects={projects} />
}
```

---

## Best Practices

### 1. Loading States

```typescript
// ✅ GOOD: Clear loading states
const Component = () => {
  const [data, setData] = useState<Data[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  useEffect(() => {
    loadData()
  }, [])
  
  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)
      const result = await service.getData()
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }
  
  if (loading) return <Loading />
  if (error) return <Error message={error} />
  return <DataList data={data} />
}
```

### 2. Error Boundaries

```typescript
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: any) {
    super(props)
    this.state = { hasError: false }
  }
  
  static getDerivedStateFromError(error: Error) {
    return { hasError: true }
  }
  
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught:', error, errorInfo)
  }
  
  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>
    }
    
    return this.props.children
  }
}

// Usage
<ErrorBoundary>
  <ProjectsSection />
</ErrorBoundary>
```

### 3. Memoization

```typescript
import { useMemo, useCallback } from 'react'

const Component = () => {
  const [data, setData] = useState<Data[]>([])
  const [filter, setFilter] = useState('')
  
  // Memoize expensive computations
  const filteredData = useMemo(() => {
    return data.filter(item =>
      item.name.toLowerCase().includes(filter.toLowerCase())
    )
  }, [data, filter])
  
  // Memoize callbacks
  const handleFilter = useCallback((value: string) => {
    setFilter(value)
  }, [])
  
  return (
    <div>
      <SearchInput onSearch={handleFilter} />
      <DataList data={filteredData} />
    </div>
  )
}
```

### 4. Debouncing

```typescript
import { useState, useEffect } from 'react'

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value)
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)
    
    return () => clearTimeout(handler)
  }, [value, delay])
  
  return debouncedValue
}

// Usage
const SearchComponent = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const debouncedSearchTerm = useDebounce(searchTerm, 500)
  
  useEffect(() => {
    if (debouncedSearchTerm) {
      // Perform search
      searchData(debouncedSearchTerm)
    }
  }, [debouncedSearchTerm])
  
  return (
    <input
      type="text"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      placeholder="Search..."
    />
  )
}
```

---

**Next**: [10-COMPONENT-LIBRARY.md](./10-COMPONENT-LIBRARY.md) - Complete UI component reference
