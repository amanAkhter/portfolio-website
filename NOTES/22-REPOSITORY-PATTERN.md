# Repository Pattern in TypeScript

> Abstract data access logic and create maintainable, testable applications

## 📚 Table of Contents
1. [What is Repository Pattern](#what-is-repository-pattern)
2. [Basic Repository](#basic-repository)
3. [Generic Repository](#generic-repository)
4. [Firebase Implementation](#firebase-implementation)
5. [Real Portfolio Examples](#real-portfolio-examples)
6. [Testing Repositories](#testing-repositories)

---

## 🎯 What is Repository Pattern

### The Problem

```typescript
// ❌ Direct database access in components
const ProjectList = () => {
  const [projects, setProjects] = useState<Project[]>([])
  
  useEffect(() => {
    // Component knows about Firestore implementation
    const unsubscribe = onSnapshot(
      collection(db, 'projects'),
      (snapshot) => {
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        setProjects(data)
      }
    )
    
    return unsubscribe
  }, [])
  
  return <div>{/* ... */}</div>
}

// Problems:
// 1. Hard to test - requires Firebase
// 2. Hard to change database - Firestore logic everywhere
// 3. Duplicated code - same logic in multiple components
// 4. Violates separation of concerns
```

### The Solution

```typescript
// ✅ Repository pattern abstracts data access
const ProjectList = () => {
  const [projects, setProjects] = useState<Project[]>([])
  
  useEffect(() => {
    // Component doesn't know about implementation
    const unsubscribe = ProjectRepository.subscribeToAll(setProjects)
    return unsubscribe
  }, [])
  
  return <div>{/* ... */}</div>
}

// Benefits:
// 1. Easy to test - mock repository
// 2. Easy to change database - change only repository
// 3. Reusable - one implementation, many uses
// 4. Clean separation - data logic in repository, UI in components
```

---

## 📦 Basic Repository

### Entity Definition

```typescript
// Domain entity
interface Project {
  id: string
  name: string
  description: string
  technologies: string[]
  coverImage: string
  demoUrl?: string
  repoUrl?: string
  status: 'draft' | 'published'
  createdAt: Date
  updatedAt: Date
}

// Data without generated fields (for creation)
type CreateProjectData = Omit<Project, 'id' | 'createdAt' | 'updatedAt'>

// Data for updates (all optional except id)
type UpdateProjectData = Partial<CreateProjectData>
```

### Repository Interface

```typescript
// Abstract interface - doesn't care about implementation
interface IProjectRepository {
  // Read operations
  findById(id: string): Promise<Project | null>
  findAll(): Promise<Project[]>
  findByStatus(status: Project['status']): Promise<Project[]>
  
  // Write operations
  create(data: CreateProjectData): Promise<Project>
  update(id: string, data: UpdateProjectData): Promise<Project>
  delete(id: string): Promise<void>
  
  // Real-time subscriptions
  subscribeToAll(callback: (projects: Project[]) => void): () => void
  subscribeToOne(id: string, callback: (project: Project | null) => void): () => void
}
```

---

## 🔧 Generic Repository

### Generic Interface

```typescript
// Generic repository for any entity with id
interface IRepository<T extends { id: string }> {
  findById(id: string): Promise<T | null>
  findAll(): Promise<T[]>
  create(data: Omit<T, 'id'>): Promise<T>
  update(id: string, data: Partial<T>): Promise<T>
  delete(id: string): Promise<void>
}

// Usage with different entities
const projectRepo: IRepository<Project> = new FirebaseProjectRepository()
const skillRepo: IRepository<Skill> = new FirebaseSkillRepository()
const userRepo: IRepository<User> = new FirebaseUserRepository()
```

### Abstract Base Repository

```typescript
abstract class BaseRepository<T extends { id: string }> implements IRepository<T> {
  constructor(protected collectionName: string) {}
  
  abstract findById(id: string): Promise<T | null>
  abstract findAll(): Promise<T[]>
  abstract create(data: Omit<T, 'id'>): Promise<T>
  abstract update(id: string, data: Partial<T>): Promise<T>
  abstract delete(id: string): Promise<void>
  
  // Common helper methods
  protected generateId(): string {
    return Date.now().toString()
  }
  
  protected now(): Date {
    return new Date()
  }
}
```

---

## 🔥 Firebase Implementation

### Firestore Repository

```typescript
import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  onSnapshot,
  Timestamp
} from 'firebase/firestore'
import { db } from './firebase/config'

class FirebaseProjectRepository implements IProjectRepository {
  private collectionName = 'projects'
  
  private getCollectionRef() {
    return collection(db, this.collectionName)
  }
  
  private getDocRef(id: string) {
    return doc(db, this.collectionName, id)
  }
  
  // Convert Firestore Timestamp to Date
  private fromFirestore(data: any): Project {
    return {
      ...data,
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date()
    }
  }
  
  // Convert Date to Firestore Timestamp
  private toFirestore(data: any) {
    return {
      ...data,
      createdAt: data.createdAt ? Timestamp.fromDate(data.createdAt) : Timestamp.now(),
      updatedAt: Timestamp.now()
    }
  }
  
  async findById(id: string): Promise<Project | null> {
    const docRef = this.getDocRef(id)
    const docSnap = await getDoc(docRef)
    
    if (!docSnap.exists()) {
      return null
    }
    
    return this.fromFirestore({
      id: docSnap.id,
      ...docSnap.data()
    })
  }
  
  async findAll(): Promise<Project[]> {
    const querySnapshot = await getDocs(this.getCollectionRef())
    
    return querySnapshot.docs.map(doc =>
      this.fromFirestore({
        id: doc.id,
        ...doc.data()
      })
    )
  }
  
  async findByStatus(status: Project['status']): Promise<Project[]> {
    const q = query(
      this.getCollectionRef(),
      where('status', '==', status)
    )
    
    const querySnapshot = await getDocs(q)
    
    return querySnapshot.docs.map(doc =>
      this.fromFirestore({
        id: doc.id,
        ...doc.data()
      })
    )
  }
  
  async create(data: CreateProjectData): Promise<Project> {
    const docRef = await addDoc(
      this.getCollectionRef(),
      this.toFirestore(data)
    )
    
    const project = await this.findById(docRef.id)
    
    if (!project) {
      throw new Error('Failed to create project')
    }
    
    return project
  }
  
  async update(id: string, data: UpdateProjectData): Promise<Project> {
    const docRef = this.getDocRef(id)
    
    await updateDoc(docRef, this.toFirestore(data))
    
    const project = await this.findById(id)
    
    if (!project) {
      throw new Error('Project not found after update')
    }
    
    return project
  }
  
  async delete(id: string): Promise<void> {
    const docRef = this.getDocRef(id)
    await deleteDoc(docRef)
  }
  
  subscribeToAll(callback: (projects: Project[]) => void): () => void {
    const unsubscribe = onSnapshot(
      this.getCollectionRef(),
      (snapshot) => {
        const projects = snapshot.docs.map(doc =>
          this.fromFirestore({
            id: doc.id,
            ...doc.data()
          })
        )
        callback(projects)
      },
      (error) => {
        console.error('Error subscribing to projects:', error)
        callback([])
      }
    )
    
    return unsubscribe
  }
  
  subscribeToOne(
    id: string,
    callback: (project: Project | null) => void
  ): () => void {
    const unsubscribe = onSnapshot(
      this.getDocRef(id),
      (doc) => {
        if (doc.exists()) {
          callback(this.fromFirestore({
            id: doc.id,
            ...doc.data()
          }))
        } else {
          callback(null)
        }
      },
      (error) => {
        console.error('Error subscribing to project:', error)
        callback(null)
      }
    )
    
    return unsubscribe
  }
}

// Export singleton instance
export const ProjectRepository = new FirebaseProjectRepository()
```

---

## 🎯 Real Portfolio Examples

### Skills Repository

```typescript
// src/core/domain/entities/Skill.ts
export interface Skill {
  id: string
  name: string
  category: 'frontend' | 'backend' | 'tools' | 'other'
  level: number // 1-5
  icon?: string
  order: number
}

// src/infrastructure/repositories/SkillRepository.ts
class FirebaseSkillRepository {
  private collectionName = 'skills'
  
  async findAll(): Promise<Skill[]> {
    const querySnapshot = await getDocs(
      collection(db, this.collectionName)
    )
    
    return querySnapshot.docs
      .map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Skill))
      .sort((a, b) => a.order - b.order)
  }
  
  async findByCategory(category: Skill['category']): Promise<Skill[]> {
    const q = query(
      collection(db, this.collectionName),
      where('category', '==', category)
    )
    
    const querySnapshot = await getDocs(q)
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Skill))
  }
  
  async updateOrder(skills: { id: string; order: number }[]): Promise<void> {
    const batch = writeBatch(db)
    
    skills.forEach(({ id, order }) => {
      const docRef = doc(db, this.collectionName, id)
      batch.update(docRef, { order })
    })
    
    await batch.commit()
  }
}

export const SkillRepository = new FirebaseSkillRepository()
```

### Experience Repository

```typescript
// src/core/domain/entities/Experience.ts
export interface Experience {
  id: string
  company: string
  position: string
  startDate: Date
  endDate: Date | null // null = current
  description: string
  achievements: string[]
  technologies: string[]
}

// src/infrastructure/repositories/ExperienceRepository.ts
class FirebaseExperienceRepository {
  private collectionName = 'experiences'
  
  async findAll(): Promise<Experience[]> {
    const querySnapshot = await getDocs(
      query(
        collection(db, this.collectionName),
        orderBy('startDate', 'desc')
      )
    )
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      startDate: doc.data().startDate.toDate(),
      endDate: doc.data().endDate?.toDate() || null
    } as Experience))
  }
  
  async findCurrent(): Promise<Experience[]> {
    const q = query(
      collection(db, this.collectionName),
      where('endDate', '==', null)
    )
    
    const querySnapshot = await getDocs(q)
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      startDate: doc.data().startDate.toDate(),
      endDate: null
    } as Experience))
  }
}

export const ExperienceRepository = new FirebaseExperienceRepository()
```

### Auth Repository

```typescript
// src/infrastructure/repositories/AuthRepository.ts
import { 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth'
import { auth } from '../firebase/config'

interface User {
  id: string
  email: string
  role: 'admin' | 'user'
}

class FirebaseAuthRepository {
  async login(email: string, password: string): Promise<User> {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    )
    
    // Get user role from Firestore
    const userDoc = await getDoc(
      doc(db, 'users', userCredential.user.uid)
    )
    
    if (!userDoc.exists()) {
      throw new Error('User profile not found')
    }
    
    return {
      id: userCredential.user.uid,
      email: userCredential.user.email!,
      role: userDoc.data().role
    }
  }
  
  async logout(): Promise<void> {
    await signOut(auth)
  }
  
  async getCurrentUser(): Promise<User | null> {
    return new Promise((resolve) => {
      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        unsubscribe()
        
        if (!firebaseUser) {
          resolve(null)
          return
        }
        
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid))
        
        if (!userDoc.exists()) {
          resolve(null)
          return
        }
        
        resolve({
          id: firebaseUser.uid,
          email: firebaseUser.email!,
          role: userDoc.data().role
        })
      })
    })
  }
  
  onAuthStateChanged(callback: (user: User | null) => void): () => void {
    return onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        callback(null)
        return
      }
      
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid))
      
      if (!userDoc.exists()) {
        callback(null)
        return
      }
      
      callback({
        id: firebaseUser.uid,
        email: firebaseUser.email!,
        role: userDoc.data().role
      })
    })
  }
}

export const AuthRepository = new FirebaseAuthRepository()
```

---

## 🧪 Testing Repositories

### Mock Repository

```typescript
// tests/mocks/MockProjectRepository.ts
class MockProjectRepository implements IProjectRepository {
  private projects: Project[] = []
  
  async findById(id: string): Promise<Project | null> {
    return this.projects.find(p => p.id === id) || null
  }
  
  async findAll(): Promise<Project[]> {
    return [...this.projects]
  }
  
  async findByStatus(status: Project['status']): Promise<Project[]> {
    return this.projects.filter(p => p.status === status)
  }
  
  async create(data: CreateProjectData): Promise<Project> {
    const project: Project = {
      id: Date.now().toString(),
      ...data,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    this.projects.push(project)
    return project
  }
  
  async update(id: string, data: UpdateProjectData): Promise<Project> {
    const index = this.projects.findIndex(p => p.id === id)
    
    if (index === -1) {
      throw new Error('Project not found')
    }
    
    this.projects[index] = {
      ...this.projects[index],
      ...data,
      updatedAt: new Date()
    }
    
    return this.projects[index]
  }
  
  async delete(id: string): Promise<void> {
    this.projects = this.projects.filter(p => p.id !== id)
  }
  
  subscribeToAll(callback: (projects: Project[]) => void): () => void {
    callback([...this.projects])
    return () => {}
  }
  
  subscribeToOne(id: string, callback: (project: Project | null) => void): () => void {
    const project = this.projects.find(p => p.id === id) || null
    callback(project)
    return () => {}
  }
  
  // Test helpers
  setProjects(projects: Project[]) {
    this.projects = projects
  }
  
  clear() {
    this.projects = []
  }
}
```

### Testing with Mock

```typescript
import { describe, it, expect, beforeEach } from 'vitest'

describe('ProjectService', () => {
  let mockRepo: MockProjectRepository
  let service: ProjectService
  
  beforeEach(() => {
    mockRepo = new MockProjectRepository()
    service = new ProjectService(mockRepo)
  })
  
  it('should create a project', async () => {
    const data: CreateProjectData = {
      name: 'Test Project',
      description: 'Test description',
      technologies: ['React', 'TypeScript'],
      coverImage: 'https://example.com/image.jpg',
      status: 'draft'
    }
    
    const project = await service.createProject(data)
    
    expect(project.id).toBeDefined()
    expect(project.name).toBe(data.name)
    expect(project.status).toBe('draft')
  })
  
  it('should find all published projects', async () => {
    mockRepo.setProjects([
      { id: '1', status: 'published', /* ... */ },
      { id: '2', status: 'draft', /* ... */ },
      { id: '3', status: 'published', /* ... */ }
    ])
    
    const projects = await service.getPublishedProjects()
    
    expect(projects).toHaveLength(2)
    expect(projects.every(p => p.status === 'published')).toBe(true)
  })
})
```

---

## ✅ Benefits of Repository Pattern

1. **Separation of Concerns** - Data access logic separate from business logic
2. **Testability** - Easy to mock and test
3. **Maintainability** - Change database without touching business logic
4. **Reusability** - One repository, many consumers
5. **Type Safety** - TypeScript interfaces ensure consistency
6. **Flexibility** - Easy to add caching, logging, etc.

---

## 🚫 Anti-Patterns

```typescript
// ❌ Direct database access in components
const Component = () => {
  const [data, setData] = useState([])
  
  useEffect(() => {
    getDocs(collection(db, 'projects')).then(/* ... */)
  }, [])
}

// ✅ Use repository
const Component = () => {
  const [data, setData] = useState([])
  
  useEffect(() => {
    ProjectRepository.findAll().then(setData)
  }, [])
}

// ❌ Business logic in repository
class ProjectRepository {
  async create(data) {
    // ❌ Validation should be in service layer
    if (data.name.length < 3) {
      throw new Error('Name too short')
    }
    
    // ❌ Business rules should be in service layer
    if (data.technologies.length === 0) {
      throw new Error('Add at least one technology')
    }
    
    return addDoc(/* ... */)
  }
}

// ✅ Keep repository focused on data access
class ProjectRepository {
  async create(data) {
    // Just save to database
    return addDoc(/* ... */)
  }
}

class ProjectService {
  async createProject(data) {
    // Validation and business logic here
    this.validate(data)
    return this.repository.create(data)
  }
}
```

---

## 🎓 Practice Exercises

1. Create a repository for a Todo entity
2. Implement pagination in a repository
3. Add caching to a repository
4. Create a repository that works with localStorage
5. Build a repository with full-text search

---

**Next:** [Service Layer Pattern →](./23-SERVICE-LAYER.md)
