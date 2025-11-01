# Clean Architecture Deep Dive

## 📖 Table of Contents
1. [What is Clean Architecture?](#what-is-clean-architecture)
2. [Core Principles](#core-principles)
3. [Layer Overview](#layer-overview)
4. [Dependency Rule](#dependency-rule)
5. [Implementation in Portfolio](#implementation-in-portfolio)
6. [Benefits](#benefits)
7. [Code Examples](#code-examples)

---

## What is Clean Architecture?

Clean Architecture is a software design philosophy by Robert C. Martin (Uncle Bob) that separates concerns into layers, making the system:

- **Independent of Frameworks**: The architecture doesn't depend on libraries
- **Testable**: Business logic can be tested without UI, database, etc.
- **Independent of UI**: UI can change without changing business rules
- **Independent of Database**: Can swap database technologies
- **Independent of External Services**: Business rules don't know about the outside world

### The Layers (from inside out):

```
┌─────────────────────────────────────────┐
│         🎨 Presentation Layer           │
│    (Components, Pages, UI, Hooks)       │
├─────────────────────────────────────────┤
│      🔧 Infrastructure Layer            │
│    (Firebase, APIs, Repositories)       │
├─────────────────────────────────────────┤
│         💼 Use Cases Layer              │
│       (Business Logic, Services)        │
├─────────────────────────────────────────┤
│          🏛️ Domain Layer                │
│     (Entities, Interfaces, Types)       │
└─────────────────────────────────────────┘
```

---

## Core Principles

### 1. **Separation of Concerns**
Each layer has a single, well-defined responsibility.

### 2. **Dependency Inversion**
High-level modules should not depend on low-level modules. Both should depend on abstractions.

### 3. **Single Responsibility**
A class/module should have only one reason to change.

### 4. **Open/Closed Principle**
Open for extension, closed for modification.

### 5. **Interface Segregation**
Clients shouldn't depend on interfaces they don't use.

---

## Layer Overview

### 🏛️ Domain Layer (Core)

**Location**: `/src/core/domain/`

**Purpose**: Contains business entities and rules

**Contains**:
- **Entities**: Business objects (Project, Experience, User)
- **Repository Interfaces**: Contracts for data access
- **Value Objects**: Immutable objects representing values
- **Domain Events**: Business events

**Rules**:
- ✅ No dependencies on other layers
- ✅ Pure TypeScript/JavaScript
- ✅ Framework-agnostic
- ❌ No import from infrastructure
- ❌ No import from presentation
- ❌ No external library dependencies (except types)

**Example**:
```typescript
// ✅ Good: Pure domain entity
export interface Project {
  id: string
  title: string
  description: string
  technologies: string[]
}

// ✅ Good: Repository interface (abstraction)
export interface IProjectRepository {
  getAll(): Promise<Project[]>
  getById(id: string): Promise<Project>
}
```

---

### 💼 Use Cases Layer

**Location**: `/src/core/usecases/`

**Purpose**: Orchestrates business logic and data flow

**Contains**:
- Business rules and workflows
- Services that coordinate repositories
- Application-specific operations
- Data transformations

**Rules**:
- ✅ Can depend on Domain layer
- ✅ Implements business logic
- ✅ Coordinates repositories
- ❌ No UI dependencies
- ❌ No direct database access
- ❌ No framework dependencies

**Example**:
```typescript
// ✅ Good: Use case service
export class PortfolioService {
  constructor(private repository: IPortfolioRepository) {}
  
  async getFeaturedProjects(): Promise<Project[]> {
    const allProjects = await this.repository.getAllProjects()
    return allProjects.filter(p => p.featured)
  }
  
  async getProjectsByTechnology(tech: string): Promise<Project[]> {
    const allProjects = await this.repository.getAllProjects()
    return allProjects.filter(p => 
      p.technologies.includes(tech)
    )
  }
}
```

---

### 🔧 Infrastructure Layer

**Location**: `/src/infrastructure/`

**Purpose**: Implements external dependencies and data access

**Contains**:
- Repository implementations
- Database access (Firebase, PostgreSQL, etc.)
- External API clients
- File system operations
- Third-party service integrations

**Rules**:
- ✅ Implements domain interfaces
- ✅ Can depend on Domain layer
- ✅ Can use external libraries
- ✅ Handles technical details
- ❌ Business logic should not live here
- ❌ No UI dependencies

**Example**:
```typescript
// ✅ Good: Repository implementation
import { db } from './firebase/config'
import { collection, getDocs } from 'firebase/firestore'

export class FirebaseProjectRepository implements IProjectRepository {
  async getAll(): Promise<Project[]> {
    const snapshot = await getDocs(collection(db, 'projects'))
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Project))
  }
  
  async getById(id: string): Promise<Project> {
    const docRef = doc(db, 'projects', id)
    const snapshot = await getDoc(docRef)
    
    if (!snapshot.exists()) {
      throw new Error('Project not found')
    }
    
    return { id: snapshot.id, ...snapshot.data() } as Project
  }
}
```

---

### 🎨 Presentation Layer

**Location**: `/src/presentation/`

**Purpose**: User interface and user interaction

**Contains**:
- React components
- Pages and routing
- UI state management
- Custom hooks
- Styling and themes

**Rules**:
- ✅ Can depend on Use Cases layer
- ✅ Can use UI libraries (React, Vue, etc.)
- ✅ Handles user interaction
- ✅ Manages UI state
- ❌ No direct database access
- ❌ No business logic (delegate to use cases)

**Example**:
```typescript
// ✅ Good: Presentation component
import { portfolioService } from '../../../core/usecases'

export const ProjectsList: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([])
  
  useEffect(() => {
    const fetchProjects = async () => {
      // Uses use case layer
      const data = await portfolioService.getAllProjects()
      setProjects(data)
    }
    fetchProjects()
  }, [])
  
  return (
    <div>
      {projects.map(project => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  )
}
```

---

## Dependency Rule

**The Golden Rule**: Dependencies can only point **inward**.

```
Presentation → Use Cases → Domain
     ↓              ↓
Infrastructure → Domain
```

### What This Means:

1. **Domain** depends on nothing
2. **Use Cases** depend on Domain only
3. **Infrastructure** implements Domain interfaces
4. **Presentation** uses Use Cases

### Example Violations:

```typescript
// ❌ BAD: Domain depends on Infrastructure
// src/core/domain/entities/User.ts
import { db } from '../../../infrastructure/firebase/config'

export class User {
  save() {
    db.collection('users').add(this) // WRONG!
  }
}

// ✅ GOOD: Domain is pure
// src/core/domain/entities/User.ts
export interface User {
  id: string
  name: string
  email: string
}

// ✅ GOOD: Repository interface in Domain
export interface IUserRepository {
  save(user: User): Promise<void>
}

// ✅ GOOD: Implementation in Infrastructure
// src/infrastructure/repositories/UserRepository.ts
export class FirebaseUserRepository implements IUserRepository {
  async save(user: User): Promise<void> {
    await db.collection('users').add(user)
  }
}
```

---

## Implementation in Portfolio

### Directory Structure

```
src/
├── core/                           # Inner layers
│   ├── domain/                    # 🏛️ Domain Layer
│   │   ├── entities/
│   │   │   └── index.ts          # Business entities
│   │   └── repositories/
│   │       └── index.ts          # Repository interfaces
│   │
│   └── usecases/                  # 💼 Use Cases Layer
│       ├── services.ts           # Business logic
│       └── index.ts
│
├── infrastructure/                 # 🔧 Infrastructure Layer
│   ├── firebase/
│   │   └── config.ts
│   └── repositories/
│       ├── AuthRepository.ts
│       └── FirebaseRepositories.ts
│
└── presentation/                   # 🎨 Presentation Layer
    ├── components/
    │   ├── sections/
    │   ├── admin/
    │   └── ui/
    ├── pages/
    ├── hooks/
    └── store/
```

### Data Flow Example

```
User clicks "View Projects" button
         ↓
[ProjectsList Component] (Presentation)
         ↓
   calls portfolioService.getAllProjects()
         ↓
[PortfolioService] (Use Case)
         ↓
   calls repository.getAllProjects()
         ↓
[FirebaseProjectRepository] (Infrastructure)
         ↓
   queries Firestore
         ↓
   returns Project[] (Domain entities)
         ↓
   back through layers to Component
         ↓
Component renders data
```

### Complete Example Flow

#### 1. Domain Layer

```typescript
// src/core/domain/entities/index.ts
export interface Project {
  id: string
  title: string
  description: string
  technologies: string[]
  featured: boolean
}

// src/core/domain/repositories/index.ts
export interface IProjectRepository {
  getAllProjects(): Promise<Project[]>
  getFeaturedProjects(): Promise<Project[]>
  getProjectById(id: string): Promise<Project>
  createProject(project: Omit<Project, 'id'>): Promise<string>
  updateProject(id: string, project: Partial<Project>): Promise<void>
  deleteProject(id: string): Promise<void>
}
```

#### 2. Use Cases Layer

```typescript
// src/core/usecases/services.ts
import type { IProjectRepository, Project } from '../domain'

export class PortfolioService {
  constructor(private projectRepository: IProjectRepository) {}
  
  // Business logic: Get featured projects
  async getFeaturedProjects(): Promise<Project[]> {
    return await this.projectRepository.getFeaturedProjects()
  }
  
  // Business logic: Get projects by technology
  async getProjectsByTech(technology: string): Promise<Project[]> {
    const allProjects = await this.projectRepository.getAllProjects()
    return allProjects.filter(p => 
      p.technologies.includes(technology)
    )
  }
  
  // Business logic: Validate and create project
  async createProject(project: Omit<Project, 'id'>): Promise<string> {
    // Validation logic
    if (!project.title || project.title.length < 3) {
      throw new Error('Title must be at least 3 characters')
    }
    
    if (project.technologies.length === 0) {
      throw new Error('At least one technology is required')
    }
    
    return await this.projectRepository.createProject(project)
  }
}
```

#### 3. Infrastructure Layer

```typescript
// src/infrastructure/repositories/FirebaseRepositories.ts
import { db } from '../firebase/config'
import { 
  collection, 
  getDocs, 
  doc, 
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where
} from 'firebase/firestore'
import type { IProjectRepository, Project } from '../../core/domain'

export class FirebaseProjectRepository implements IProjectRepository {
  private collectionName = 'projects'
  
  async getAllProjects(): Promise<Project[]> {
    const snapshot = await getDocs(collection(db, this.collectionName))
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Project))
  }
  
  async getFeaturedProjects(): Promise<Project[]> {
    const q = query(
      collection(db, this.collectionName),
      where('featured', '==', true)
    )
    const snapshot = await getDocs(q)
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Project))
  }
  
  async getProjectById(id: string): Promise<Project> {
    const docRef = doc(db, this.collectionName, id)
    const snapshot = await getDoc(docRef)
    
    if (!snapshot.exists()) {
      throw new Error(`Project with id ${id} not found`)
    }
    
    return { id: snapshot.id, ...snapshot.data() } as Project
  }
  
  async createProject(project: Omit<Project, 'id'>): Promise<string> {
    const docRef = await addDoc(
      collection(db, this.collectionName),
      project
    )
    return docRef.id
  }
  
  async updateProject(id: string, project: Partial<Project>): Promise<void> {
    const docRef = doc(db, this.collectionName, id)
    await updateDoc(docRef, project)
  }
  
  async deleteProject(id: string): Promise<void> {
    const docRef = doc(db, this.collectionName, id)
    await deleteDoc(docRef)
  }
}

// Create singleton instance
export const projectRepository = new FirebaseProjectRepository()
```

#### 4. Service Initialization

```typescript
// src/core/usecases/index.ts
import { PortfolioService } from './services'
import { 
  projectRepository,
  experienceRepository,
  // ... other repositories
} from '../../infrastructure/repositories/FirebaseRepositories'

// Create service instance with injected dependencies
export const portfolioService = new PortfolioService(
  projectRepository,
  experienceRepository,
  // ... other repositories
)
```

#### 5. Presentation Layer

```typescript
// src/presentation/components/sections/Projects.tsx
import { useState, useEffect } from 'react'
import { portfolioService } from '../../../core/usecases'
import type { Project } from '../../../shared/types'

export const Projects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [showFeatured, setShowFeatured] = useState(true)
  
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true)
        
        // Call use case layer
        const data = showFeatured
          ? await portfolioService.getFeaturedProjects()
          : await portfolioService.getAllProjects()
          
        setProjects(data)
      } catch (error) {
        console.error('Error fetching projects:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchProjects()
  }, [showFeatured])
  
  if (loading) return <LoadingSpinner />
  
  return (
    <section>
      <h2>Projects</h2>
      
      <button onClick={() => setShowFeatured(!showFeatured)}>
        {showFeatured ? 'Show All' : 'Show Featured'}
      </button>
      
      <div className="projects-grid">
        {projects.map(project => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </section>
  )
}
```

---

## Benefits

### 1. **Testability**
```typescript
// Easy to test business logic in isolation
describe('PortfolioService', () => {
  it('should filter projects by technology', async () => {
    // Mock repository
    const mockRepo: IProjectRepository = {
      getAllProjects: async () => [
        { id: '1', title: 'Project 1', technologies: ['React'] },
        { id: '2', title: 'Project 2', technologies: ['Vue'] },
      ]
    }
    
    const service = new PortfolioService(mockRepo)
    const result = await service.getProjectsByTech('React')
    
    expect(result).toHaveLength(1)
    expect(result[0].title).toBe('Project 1')
  })
})
```

### 2. **Flexibility**
```typescript
// Easy to swap implementations
const portfolioService = new PortfolioService(
  // Can use Firebase
  new FirebaseProjectRepository()
  
  // Or PostgreSQL
  // new PostgresProjectRepository()
  
  // Or REST API
  // new RestApiProjectRepository()
  
  // Or Mock for testing
  // new MockProjectRepository()
)
```

### 3. **Maintainability**
- Clear separation makes code easier to understand
- Changes in one layer don't affect others
- Easy to locate bugs

### 4. **Scalability**
- Add new features without modifying existing code
- Easy to add new data sources
- Simple to add new UI frameworks

---

## Common Patterns

### Dependency Injection

```typescript
// Constructor injection
class PortfolioService {
  constructor(
    private projectRepo: IProjectRepository,
    private experienceRepo: IExperienceRepository
  ) {}
}

// Usage
const service = new PortfolioService(
  new FirebaseProjectRepository(),
  new FirebaseExperienceRepository()
)
```

### Repository Pattern

```typescript
// Abstract data access
interface IRepository<T> {
  getAll(): Promise<T[]>
  getById(id: string): Promise<T>
  create(item: Omit<T, 'id'>): Promise<string>
  update(id: string, item: Partial<T>): Promise<void>
  delete(id: string): Promise<void>
}

class GenericFirebaseRepository<T> implements IRepository<T> {
  constructor(private collectionName: string) {}
  
  async getAll(): Promise<T[]> {
    // Implementation
  }
  
  // ... other methods
}
```

---

## 🎯 Key Takeaways

1. ✅ **Domain** is the heart - pure business logic
2. ✅ **Use Cases** orchestrate - coordinate repositories
3. ✅ **Infrastructure** implements - handle technical details
4. ✅ **Presentation** displays - user interface only
5. ✅ **Dependencies flow inward** - outer layers depend on inner
6. ✅ **Test in isolation** - mock dependencies easily
7. ✅ **Swap implementations** - flexible and maintainable

---

**Next**: [05-DOMAIN-LAYER.md](./05-DOMAIN-LAYER.md) - Deep dive into domain entities
