# Clean Architecture in React

> Build maintainable, testable, and scalable React applications using Clean Architecture principles

## 📚 Table of Contents
1. [What is Clean Architecture?](#what-is-clean-architecture)
2. [Layer Overview](#layer-overview)
3. [Domain Layer (Entities)](#domain-layer-entities)
4. [Use Case Layer (Business Logic)](#use-case-layer-business-logic)
5. [Infrastructure Layer](#infrastructure-layer)
6. [Presentation Layer](#presentation-layer)
7. [Complete Example from Portfolio](#complete-example-from-portfolio)

---

## 🏛️ What is Clean Architecture?

**Clean Architecture** separates concerns into layers, with dependencies flowing inward toward business logic.

### Key Principles:
1. **Independence** - Business logic independent of frameworks
2. **Testability** - Business rules testable without UI/DB
3. **UI Independence** - UI can change without affecting business logic
4. **Database Independence** - Can swap databases easily
5. **Framework Independence** - Not tied to any framework

### Dependency Rule:
**Dependencies point inward. Inner layers know nothing about outer layers.**

```
┌──────────────────────────────────────┐
│     Presentation Layer (React UI)    │
├──────────────────────────────────────┤
│   Infrastructure Layer (Firebase)    │
├──────────────────────────────────────┤
│   Use Case Layer (Business Logic)    │
├──────────────────────────────────────┤
│   Domain Layer (Entities & Rules)    │  ← Core
└──────────────────────────────────────┘
```

---

## 📦 Layer Overview

### Directory Structure

```
src/
├── core/                    # Business Logic (Inner layers)
│   ├── domain/             # Entities & Repository interfaces
│   │   ├── entities/       # Data models
│   │   └── repositories/   # Repository interfaces (contracts)
│   └── usecases/           # Business logic & services
│       ├── services.ts     # Service implementations
│       └── index.ts        # Export services
│
├── infrastructure/          # External dependencies
│   ├── firebase/           # Firebase configuration
│   └── repositories/       # Repository implementations
│
├── presentation/           # UI Layer
│   ├── components/        # React components
│   ├── hooks/             # Custom hooks
│   ├── pages/             # Page components
│   └── store/             # State management
│
└── shared/                # Shared utilities
    ├── types/            # TypeScript types
    ├── constants/        # Constants
    └── utils/            # Helper functions
```

---

## 🎯 Domain Layer (Entities)

**The heart of your application - pure business entities with no dependencies.**

### Entities (Data Models)

**From `src/shared/types/index.ts`:**

```typescript
// Pure data structures representing business concepts
export interface User {
  uid: string
  email: string
  role: 'admin' | 'user'
  displayName?: string
}

export interface Project {
  id?: string
  coverImage: string
  name: string
  year: number
  description: string
  shortDescription: string
  technologies: string[]
  liveUrl?: string
  githubUrl?: string
  tags: ProjectTag[]
  featured?: boolean
  order: number
}

export interface Experience {
  id?: string
  currentPosition: string
  companyName: string
  description: string
  keyAchievements: string[]
  duration: string
  type: 'Remote' | 'Office' | 'Hybrid'
  location?: string
  technologies: string[]
  startDate: string
  endDate?: string
  order: number
}

export interface Skill {
  id?: string
  name: string
  percentage: number
  section: string
  sectionId?: string
  order: number
}
```

### Repository Interfaces (Contracts)

**From `src/core/domain/repositories/`:**

```typescript
// Pure interfaces - no implementation details!
// These define WHAT we can do, not HOW

export interface IProjectRepository {
  getAll(): Promise<Project[]>
  getById(id: string): Promise<Project | null>
  getFeatured(): Promise<Project[]>
  create(data: Omit<Project, 'id'>): Promise<Project>
  update(id: string, data: Partial<Project>): Promise<Project>
  delete(id: string): Promise<void>
}

export interface IExperienceRepository {
  getAll(): Promise<Experience[]>
  getById(id: string): Promise<Experience | null>
  getLatest(count: number): Promise<Experience[]>
  create(data: Omit<Experience, 'id'>): Promise<Experience>
  update(id: string, data: Partial<Experience>): Promise<Experience>
  delete(id: string): Promise<void>
}

export interface IAuthRepository {
  signIn(email: string, password: string): Promise<User>
  signOut(): Promise<void>
  getCurrentUser(): Promise<User | null>
  onAuthStateChanged(callback: (user: User | null) => void): () => void
}

export interface IUserRepository {
  getById(uid: string): Promise<User | null>
  isAdmin(uid: string): Promise<boolean>
  updateRole(uid: string, role: 'admin' | 'user'): Promise<void>
}
```

**Why interfaces?**
- ✅ Allows swapping implementations (Firebase → PostgreSQL)
- ✅ Makes testing easier (mock implementations)
- ✅ Enforces contracts
- ✅ No coupling to external libraries

---

## 💼 Use Case Layer (Business Logic)

**Business logic that orchestrates entities and repositories.**

### Service Pattern

**From `src/core/usecases/services.ts`:**

```typescript
import type {
  Project,
  Experience,
  User,
} from '../domain/entities'

import type {
  IProjectRepository,
  IExperienceRepository,
  IAuthRepository,
  IUserRepository,
} from '../domain/repositories'

// Portfolio Service - Business logic for portfolio data
export class PortfolioService {
  // Depend on interfaces, not concrete implementations!
  constructor(
    private projectRepo: IProjectRepository,
    private experienceRepo: IExperienceRepository,
    // ... other repos
  ) {}

  // Business logic methods
  async getAllProjects(): Promise<Project[]> {
    const data = await this.projectRepo.getAll()
    return data.length > 0 ? data : fallbackProjects // Fallback logic
  }

  async getFeaturedProjects(): Promise<Project[]> {
    const data = await this.projectRepo.getFeatured()
    // Business rule: Sort by year, descending
    return data.sort((a, b) => b.year - a.year)
  }

  async createProject(data: Omit<Project, 'id'>): Promise<Project> {
    // Business rule: Validate data before creating
    if (!data.name || data.name.trim() === '') {
      throw new Error('Project name is required')
    }
    
    if (data.technologies.length === 0) {
      throw new Error('At least one technology is required')
    }
    
    return await this.projectRepo.create(data)
  }

  async updateProject(id: string, updates: Partial<Project>): Promise<Project> {
    // Business rule: Check if project exists
    const existing = await this.projectRepo.getById(id)
    if (!existing) {
      throw new Error(`Project with id ${id} not found`)
    }
    
    return await this.projectRepo.update(id, updates)
  }

  async deleteProject(id: string): Promise<void> {
    const existing = await this.projectRepo.getById(id)
    if (!existing) {
      throw new Error(`Project with id ${id} not found`)
    }
    
    return await this.projectRepo.delete(id)
  }

  // Business logic: Get recent experiences
  async getRecentExperiences(count: number = 3): Promise<Experience[]> {
    const experiences = await this.experienceRepo.getAll()
    
    // Sort by start date, most recent first
    return experiences
      .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
      .slice(0, count)
  }

  // Business logic: Calculate total years of experience
  async getTotalYearsOfExperience(): Promise<number> {
    const experiences = await this.experienceRepo.getAll()
    
    const totalMonths = experiences.reduce((total, exp) => {
      const start = new Date(exp.startDate)
      const end = exp.endDate ? new Date(exp.endDate) : new Date()
      
      const months = (end.getFullYear() - start.getFullYear()) * 12 +
                     (end.getMonth() - start.getMonth())
      
      return total + months
    }, 0)
    
    return Math.round(totalMonths / 12 * 10) / 10 // Round to 1 decimal
  }
}

// Auth Service - Business logic for authentication
export class AuthService {
  constructor(
    private authRepo: IAuthRepository,
    private userRepo: IUserRepository
  ) {}

  async signIn(email: string, password: string): Promise<User> {
    // Business rule: Validate input
    if (!email || !password) {
      throw new Error('Email and password are required')
    }
    
    if (!this.isValidEmail(email)) {
      throw new Error('Invalid email format')
    }
    
    const user = await this.authRepo.signIn(email, password)
    
    // Business rule: Check if user is admin
    const isAdmin = await this.userRepo.isAdmin(user.uid)
    
    return {
      ...user,
      role: isAdmin ? 'admin' : 'user',
    }
  }

  async signOut(): Promise<void> {
    return await this.authRepo.signOut()
  }

  async getCurrentUser(): Promise<User | null> {
    return await this.authRepo.getCurrentUser()
  }

  onAuthStateChanged(callback: (user: User | null) => void): () => void {
    return this.authRepo.onAuthStateChanged(callback)
  }

  // Private helper - business rule
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }
}
```

**Key Points:**
- ✅ Depends on interfaces (repository contracts)
- ✅ Contains business logic and validation
- ✅ Independent of UI and database
- ✅ Easy to test (mock repositories)

---

## 🔧 Infrastructure Layer

**Implementation of repository interfaces - talks to external services.**

### Firebase Repository Implementation

**From `src/infrastructure/repositories/FirebaseRepositories.ts`:**

```typescript
import {
  collection,
  getDocs,
  getDoc,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
} from 'firebase/firestore'
import { db } from '../firebase/config'
import type { Project, Experience } from '../../core/domain/entities'
import type { IProjectRepository, IExperienceRepository } from '../../core/domain/repositories'

// Concrete implementation of IProjectRepository using Firebase
export class FirebaseProjectRepository implements IProjectRepository {
  private collectionName = 'projects'

  async getAll(): Promise<Project[]> {
    const q = query(
      collection(db, this.collectionName),
      orderBy('order', 'asc')
    )
    
    const querySnapshot = await getDocs(q)
    
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    } as Project))
  }

  async getById(id: string): Promise<Project | null> {
    const docRef = doc(db, this.collectionName, id)
    const docSnap = await getDoc(docRef)
    
    if (!docSnap.exists()) {
      return null
    }
    
    return {
      id: docSnap.id,
      ...docSnap.data(),
    } as Project
  }

  async getFeatured(): Promise<Project[]> {
    const q = query(
      collection(db, this.collectionName),
      where('featured', '==', true),
      orderBy('order', 'asc')
    )
    
    const querySnapshot = await getDocs(q)
    
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    } as Project))
  }

  async create(data: Omit<Project, 'id'>): Promise<Project> {
    const docRef = await addDoc(collection(db, this.collectionName), data)
    
    return {
      id: docRef.id,
      ...data,
    } as Project
  }

  async update(id: string, data: Partial<Project>): Promise<Project> {
    const docRef = doc(db, this.collectionName, id)
    await updateDoc(docRef, data as any)
    
    const updated = await this.getById(id)
    if (!updated) {
      throw new Error(`Failed to update project ${id}`)
    }
    
    return updated
  }

  async delete(id: string): Promise<void> {
    const docRef = doc(db, this.collectionName, id)
    await deleteDoc(docRef)
  }
}

// Could easily swap to PostgreSQL, MongoDB, REST API, etc.
export class PostgresProjectRepository implements IProjectRepository {
  async getAll(): Promise<Project[]> {
    // PostgreSQL implementation
    const result = await db.query('SELECT * FROM projects ORDER BY "order" ASC')
    return result.rows
  }
  
  // ... other methods
}
```

**Benefits:**
- ✅ Business logic doesn't know about Firebase
- ✅ Easy to swap implementations
- ✅ Can have multiple implementations (testing, production, etc.)

---

## 🎨 Presentation Layer

**React components consume services through hooks.**

### Custom Hook Layer

```typescript
// src/presentation/hooks/usePortfolio.ts
import { useState, useEffect } from 'react'
import { portfolioService } from '../../core/usecases' // Use case layer
import type { Project, Experience } from '../../shared/types'

export const usePortfolio = () => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [projects, setProjects] = useState<Project[]>([])
  const [experiences, setExperiences] = useState<Experience[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        
        // Call service layer - NO direct Firebase access!
        const [projectsData, experiencesData] = await Promise.all([
          portfolioService.getAllProjects(),
          portfolioService.getAllExperiences(),
        ])
        
        setProjects(projectsData)
        setExperiences(experiencesData)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch data')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return {
    projects,
    experiences,
    loading,
    error,
  }
}
```

### Component Layer

```typescript
// src/presentation/pages/PortfolioPage.tsx
import { usePortfolio } from '../hooks/usePortfolio'

const PortfolioPage = () => {
  const { projects, experiences, loading, error } = usePortfolio()
  
  if (loading) return <LoadingScreen />
  if (error) return <ErrorScreen message={error} />
  
  return (
    <div>
      <ProjectsSection projects={projects} />
      <ExperienceSection experiences={experiences} />
    </div>
  )
}
```

---

## 📋 Complete Example from Portfolio

### Full Flow: Creating a Project

```typescript
// 1. DOMAIN LAYER - Entity
interface Project {
  id?: string
  name: string
  description: string
  technologies: string[]
  featured: boolean
}

// 2. DOMAIN LAYER - Repository Interface
interface IProjectRepository {
  create(data: Omit<Project, 'id'>): Promise<Project>
}

// 3. USE CASE LAYER - Service
class PortfolioService {
  constructor(private projectRepo: IProjectRepository) {}
  
  async createProject(data: Omit<Project, 'id'>): Promise<Project> {
    // Business logic/validation
    if (!data.name) throw new Error('Name required')
    if (data.technologies.length === 0) throw new Error('Add tech')
    
    return await this.projectRepo.create(data)
  }
}

// 4. INFRASTRUCTURE LAYER - Firebase Implementation
class FirebaseProjectRepository implements IProjectRepository {
  async create(data: Omit<Project, 'id'>): Promise<Project> {
    const docRef = await addDoc(collection(db, 'projects'), data)
    return { id: docRef.id, ...data }
  }
}

// 5. DEPENDENCY INJECTION - Wire everything together
const projectRepo = new FirebaseProjectRepository()
const portfolioService = new PortfolioService(projectRepo)

// 6. PRESENTATION LAYER - React Component
const CreateProjectForm = () => {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [technologies, setTechnologies] = useState<string[]>([])
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      // Call service - clean separation!
      await portfolioService.createProject({
        name,
        description,
        technologies,
        featured: false,
      })
      
      alert('Project created!')
    } catch (error) {
      alert(error.message)
    }
  }
  
  return <form onSubmit={handleSubmit}>{/* form fields */}</form>
}
```

---

## ✅ Benefits of Clean Architecture

1. **Testability** - Test business logic without UI/DB
2. **Flexibility** - Swap Firebase for PostgreSQL easily
3. **Maintainability** - Clear separation of concerns
4. **Scalability** - Easy to add new features
5. **Team Collaboration** - Different teams work on different layers
6. **Framework Independence** - Not locked into React/Firebase

---

## 🧪 Testing Benefits

```typescript
// Mock repository for testing
class MockProjectRepository implements IProjectRepository {
  private projects: Project[] = []
  
  async create(data: Omit<Project, 'id'>): Promise<Project> {
    const project = { id: '123', ...data }
    this.projects.push(project)
    return project
  }
  
  async getAll(): Promise<Project[]> {
    return this.projects
  }
  
  // ... other methods
}

// Test service without Firebase!
describe('PortfolioService', () => {
  it('should create project with validation', async () => {
    const mockRepo = new MockProjectRepository()
    const service = new PortfolioService(mockRepo)
    
    // Test business logic
    await expect(
      service.createProject({ name: '', description: '', technologies: [] })
    ).rejects.toThrow('Name required')
    
    const project = await service.createProject({
      name: 'Test Project',
      description: 'Test',
      technologies: ['React'],
      featured: false,
    })
    
    expect(project.id).toBe('123')
    expect(project.name).toBe('Test Project')
  })
})
```

---

## 🎓 Practice Exercises

1. Create a blog system with Clean Architecture
2. Add a new repository implementation (REST API)
3. Write unit tests for your services
4. Implement caching in the infrastructure layer
5. Add a new use case (e.g., search functionality)

---

**Next:** [Repository Pattern →](./22-REPOSITORY-PATTERN.md)
