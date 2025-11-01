# Infrastructure Layer Documentation

## 📖 Table of Contents
1. [Overview](#overview)
2. [Firebase Configuration](#firebase-configuration)
3. [Repository Implementations](#repository-implementations)
4. [Data Persistence](#data-persistence)
5. [External Services](#external-services)
6. [Best Practices](#best-practices)

---

## Overview

The Infrastructure Layer handles external services, data persistence, and API integrations. It implements the repository interfaces defined in the Domain layer.

### Location
```
src/infrastructure/
├── firebase/
│   └── config.ts          # Firebase initialization
└── repositories/
    ├── AuthRepository.ts  # Authentication implementation
    └── FirebaseRepositories.ts  # All repository implementations
```

### Responsibilities
- ✅ Implement repository interfaces
- ✅ Manage Firebase connection
- ✅ Handle data persistence
- ✅ Manage external API calls
- ✅ Handle authentication

---

## Firebase Configuration

### Firebase Setup

**File**: `src/infrastructure/firebase/config.ts`

```typescript
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize services
export const db = getFirestore(app)
export const auth = getAuth(app)

// Export app for other integrations
export default app
```

### Environment Variables

Create `.env` file:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

---

## Repository Implementations

### Firebase Home Repository

```typescript
import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  Timestamp
} from 'firebase/firestore'
import { db } from '../firebase/config'
import type { IHomeRepository, HomeData } from '../../core/domain'

export class FirebaseHomeRepository implements IHomeRepository {
  private collectionName = 'home'
  private docId = 'main'
  
  async getHomeData(): Promise<HomeData> {
    try {
      const docRef = doc(db, this.collectionName, this.docId)
      const docSnap = await getDoc(docRef)
      
      if (!docSnap.exists()) {
        throw new Error('Home data not found')
      }
      
      return this.mapDocToHomeData(docSnap.data())
    } catch (error) {
      console.error('Error fetching home data:', error)
      throw error
    }
  }
  
  async updateHomeData(data: Partial<HomeData>): Promise<void> {
    try {
      const docRef = doc(db, this.collectionName, this.docId)
      
      await updateDoc(docRef, {
        ...data,
        updatedAt: Timestamp.now()
      })
    } catch (error) {
      console.error('Error updating home data:', error)
      throw error
    }
  }
  
  async createHomeData(data: HomeData): Promise<void> {
    try {
      const docRef = doc(db, this.collectionName, this.docId)
      
      await setDoc(docRef, {
        ...data,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      })
    } catch (error) {
      console.error('Error creating home data:', error)
      throw error
    }
  }
  
  private mapDocToHomeData(data: any): HomeData {
    return {
      name: data.name,
      title: data.title,
      tagline: data.tagline,
      bio: data.bio,
      email: data.email,
      phone: data.phone,
      location: data.location,
      profileImage: data.profileImage,
      resume: data.resume,
      socialLinks: data.socialLinks || []
    }
  }
}
```

---

### Firebase Project Repository

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
  orderBy,
  Timestamp
} from 'firebase/firestore'
import { db } from '../firebase/config'
import type { IProjectRepository, Project } from '../../core/domain'

export class FirebaseProjectRepository implements IProjectRepository {
  private collectionName = 'projects'
  
  async getAllProjects(): Promise<Project[]> {
    try {
      const querySnapshot = await getDocs(
        collection(db, this.collectionName)
      )
      
      return querySnapshot.docs.map(doc => 
        this.mapDocToProject(doc.id, doc.data())
      )
    } catch (error) {
      console.error('Error fetching projects:', error)
      throw error
    }
  }
  
  async getProjectById(id: string): Promise<Project> {
    try {
      const docRef = doc(db, this.collectionName, id)
      const docSnap = await getDoc(docRef)
      
      if (!docSnap.exists()) {
        throw new Error(`Project with id ${id} not found`)
      }
      
      return this.mapDocToProject(docSnap.id, docSnap.data())
    } catch (error) {
      console.error(`Error fetching project ${id}:`, error)
      throw error
    }
  }
  
  async getFeaturedProjects(): Promise<Project[]> {
    try {
      const q = query(
        collection(db, this.collectionName),
        where('featured', '==', true),
        orderBy('startDate', 'desc')
      )
      
      const querySnapshot = await getDocs(q)
      
      return querySnapshot.docs.map(doc =>
        this.mapDocToProject(doc.id, doc.data())
      )
    } catch (error) {
      console.error('Error fetching featured projects:', error)
      throw error
    }
  }
  
  async getProjectsByCategory(category: string): Promise<Project[]> {
    try {
      const q = query(
        collection(db, this.collectionName),
        where('category', '==', category)
      )
      
      const querySnapshot = await getDocs(q)
      
      return querySnapshot.docs.map(doc =>
        this.mapDocToProject(doc.id, doc.data())
      )
    } catch (error) {
      console.error(`Error fetching projects by category ${category}:`, error)
      throw error
    }
  }
  
  async getProjectsByTechnology(tech: string): Promise<Project[]> {
    try {
      const q = query(
        collection(db, this.collectionName),
        where('technologies', 'array-contains', tech)
      )
      
      const querySnapshot = await getDocs(q)
      
      return querySnapshot.docs.map(doc =>
        this.mapDocToProject(doc.id, doc.data())
      )
    } catch (error) {
      console.error(`Error fetching projects by technology ${tech}:`, error)
      throw error
    }
  }
  
  async createProject(project: Omit<Project, 'id'>): Promise<string> {
    try {
      const docRef = await addDoc(
        collection(db, this.collectionName),
        {
          ...project,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now()
        }
      )
      
      return docRef.id
    } catch (error) {
      console.error('Error creating project:', error)
      throw error
    }
  }
  
  async updateProject(id: string, updates: Partial<Project>): Promise<void> {
    try {
      const docRef = doc(db, this.collectionName, id)
      
      await updateDoc(docRef, {
        ...updates,
        updatedAt: Timestamp.now()
      })
    } catch (error) {
      console.error(`Error updating project ${id}:`, error)
      throw error
    }
  }
  
  async deleteProject(id: string): Promise<void> {
    try {
      const docRef = doc(db, this.collectionName, id)
      await deleteDoc(docRef)
    } catch (error) {
      console.error(`Error deleting project ${id}:`, error)
      throw error
    }
  }
  
  private mapDocToProject(id: string, data: any): Project {
    return {
      id,
      title: data.title,
      description: data.description,
      longDescription: data.longDescription,
      technologies: data.technologies || [],
      category: data.category,
      featured: data.featured || false,
      coverImage: data.coverImage,
      images: data.images || [],
      demoUrl: data.demoUrl,
      githubUrl: data.githubUrl,
      startDate: data.startDate,
      endDate: data.endDate,
      status: data.status || 'completed',
      highlights: data.highlights || []
    }
  }
}
```

---

### Firebase Contact Repository

```typescript
import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  query,
  where,
  orderBy,
  Timestamp
} from 'firebase/firestore'
import { db } from '../firebase/config'
import type { IContactRepository, ContactSubmission } from '../../core/domain'

export class FirebaseContactRepository implements IContactRepository {
  private collectionName = 'contact_submissions'
  
  async getAllSubmissions(): Promise<ContactSubmission[]> {
    try {
      const q = query(
        collection(db, this.collectionName),
        orderBy('timestamp', 'desc')
      )
      
      const querySnapshot = await getDocs(q)
      
      return querySnapshot.docs.map(doc =>
        this.mapDocToSubmission(doc.id, doc.data())
      )
    } catch (error) {
      console.error('Error fetching submissions:', error)
      throw error
    }
  }
  
  async getUnreadSubmissions(): Promise<ContactSubmission[]> {
    try {
      const q = query(
        collection(db, this.collectionName),
        where('read', '==', false),
        orderBy('timestamp', 'desc')
      )
      
      const querySnapshot = await getDocs(q)
      
      return querySnapshot.docs.map(doc =>
        this.mapDocToSubmission(doc.id, doc.data())
      )
    } catch (error) {
      console.error('Error fetching unread submissions:', error)
      throw error
    }
  }
  
  async createSubmission(
    submission: Omit<ContactSubmission, 'id' | 'timestamp'>
  ): Promise<string> {
    try {
      const docRef = await addDoc(
        collection(db, this.collectionName),
        {
          ...submission,
          timestamp: Timestamp.now(),
          read: false,
          replied: false
        }
      )
      
      return docRef.id
    } catch (error) {
      console.error('Error creating submission:', error)
      throw error
    }
  }
  
  async updateSubmission(
    id: string,
    updates: Partial<ContactSubmission>
  ): Promise<void> {
    try {
      const docRef = doc(db, this.collectionName, id)
      await updateDoc(docRef, updates)
    } catch (error) {
      console.error(`Error updating submission ${id}:`, error)
      throw error
    }
  }
  
  async markAsRead(id: string): Promise<void> {
    await this.updateSubmission(id, { read: true })
  }
  
  async markAsReplied(id: string): Promise<void> {
    await this.updateSubmission(id, { replied: true })
  }
  
  private mapDocToSubmission(id: string, data: any): ContactSubmission {
    return {
      id,
      name: data.name,
      email: data.email,
      subject: data.subject,
      message: data.message,
      timestamp: data.timestamp?.toDate().toISOString() || new Date().toISOString(),
      read: data.read || false,
      replied: data.replied || false,
      status: data.status || 'new'
    }
  }
}
```

---

### Authentication Repository

**File**: `src/infrastructure/repositories/AuthRepository.ts`

```typescript
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User
} from 'firebase/auth'
import { auth } from '../firebase/config'

export interface IAuthRepository {
  login(email: string, password: string): Promise<User>
  logout(): Promise<void>
  getCurrentUser(): User | null
  onAuthChange(callback: (user: User | null) => void): () => void
}

export class FirebaseAuthRepository implements IAuthRepository {
  async login(email: string, password: string): Promise<User> {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      )
      return userCredential.user
    } catch (error: any) {
      console.error('Login error:', error)
      
      // Map Firebase errors to user-friendly messages
      switch (error.code) {
        case 'auth/invalid-email':
          throw new Error('Invalid email address')
        case 'auth/user-disabled':
          throw new Error('This account has been disabled')
        case 'auth/user-not-found':
        case 'auth/wrong-password':
          throw new Error('Invalid email or password')
        case 'auth/too-many-requests':
          throw new Error('Too many failed attempts. Try again later')
        default:
          throw new Error('Login failed. Please try again')
      }
    }
  }
  
  async logout(): Promise<void> {
    try {
      await signOut(auth)
    } catch (error) {
      console.error('Logout error:', error)
      throw new Error('Logout failed')
    }
  }
  
  getCurrentUser(): User | null {
    return auth.currentUser
  }
  
  onAuthChange(callback: (user: User | null) => void): () => void {
    return onAuthStateChanged(auth, callback)
  }
}
```

---

## Data Persistence

### Firestore Collections Structure

```
portfolio-db/
├── home/                     # Single document: main
│   └── main                  # HomeData
├── about/                    # Single document: main
│   └── main                  # AboutData
├── projects/                 # Multiple documents
│   ├── {projectId}          # Project
│   ├── {projectId}          # Project
│   └── ...
├── experiences/              # Multiple documents
│   ├── {experienceId}       # Experience
│   └── ...
├── skills/                   # Multiple documents
│   ├── {skillId}            # Skill
│   └── ...
├── skill_sections/           # Multiple documents
│   ├── {sectionId}          # SkillSection
│   └── ...
├── certifications/           # Multiple documents
│   ├── {certificationId}    # Certification
│   └── ...
├── education/                # Multiple documents
│   ├── {educationId}        # Education
│   └── ...
└── contact_submissions/      # Multiple documents
    ├── {submissionId}       # ContactSubmission
    └── ...
```

### Document Examples

**Home Document** (`home/main`):
```json
{
  "name": "John Doe",
  "title": "Full Stack Developer",
  "tagline": "Building amazing web experiences",
  "bio": "Passionate developer...",
  "email": "john@example.com",
  "phone": "+1234567890",
  "location": "San Francisco, CA",
  "profileImage": "https://...",
  "resume": "https://...",
  "socialLinks": [
    {
      "platform": "GitHub",
      "url": "https://github.com/...",
      "icon": "Github"
    }
  ],
  "createdAt": Timestamp,
  "updatedAt": Timestamp
}
```

**Project Document**:
```json
{
  "title": "E-Commerce Platform",
  "description": "Modern shopping platform",
  "longDescription": "Detailed description...",
  "technologies": ["React", "Node.js", "MongoDB"],
  "category": "Web Development",
  "featured": true,
  "coverImage": "https://...",
  "images": ["https://...", "https://..."],
  "demoUrl": "https://...",
  "githubUrl": "https://github.com/...",
  "startDate": "2024-01-01",
  "endDate": "2024-06-01",
  "status": "completed",
  "highlights": [
    "Feature 1",
    "Feature 2"
  ],
  "createdAt": Timestamp,
  "updatedAt": Timestamp
}
```

---

## External Services

### Repository Factory

```typescript
// src/infrastructure/repositories/FirebaseRepositories.ts

import {
  FirebaseHomeRepository,
  FirebaseAboutRepository,
  FirebaseProjectRepository,
  FirebaseExperienceRepository,
  FirebaseSkillRepository,
  FirebaseCertificationRepository,
  FirebaseEducationRepository,
  FirebaseContactRepository
} from './implementations'

export class RepositoryFactory {
  static createHomeRepository() {
    return new FirebaseHomeRepository()
  }
  
  static createAboutRepository() {
    return new FirebaseAboutRepository()
  }
  
  static createProjectRepository() {
    return new FirebaseProjectRepository()
  }
  
  static createExperienceRepository() {
    return new FirebaseExperienceRepository()
  }
  
  static createSkillRepository() {
    return new FirebaseSkillRepository()
  }
  
  static createCertificationRepository() {
    return new FirebaseCertificationRepository()
  }
  
  static createEducationRepository() {
    return new FirebaseEducationRepository()
  }
  
  static createContactRepository() {
    return new FirebaseContactRepository()
  }
  
  // Create all repositories at once
  static createAllRepositories() {
    return {
      homeRepo: this.createHomeRepository(),
      aboutRepo: this.createAboutRepository(),
      projectRepo: this.createProjectRepository(),
      experienceRepo: this.createExperienceRepository(),
      skillRepo: this.createSkillRepository(),
      certificationRepo: this.createCertificationRepository(),
      educationRepo: this.createEducationRepository(),
      contactRepo: this.createContactRepository()
    }
  }
}

// Usage
const repositories = RepositoryFactory.createAllRepositories()
const portfolioService = new PortfolioService(
  repositories.homeRepo,
  repositories.aboutRepo,
  repositories.projectRepo,
  repositories.experienceRepo,
  repositories.skillRepo,
  repositories.certificationRepo,
  repositories.educationRepo,
  repositories.contactRepo
)
```

---

## Best Practices

### 1. Error Handling

```typescript
// ✅ GOOD: Comprehensive error handling
async getProjectById(id: string): Promise<Project> {
  try {
    const docRef = doc(db, this.collectionName, id)
    const docSnap = await getDoc(docRef)
    
    if (!docSnap.exists()) {
      throw new Error(`Project with id ${id} not found`)
    }
    
    return this.mapDocToProject(docSnap.id, docSnap.data())
  } catch (error) {
    // Log for debugging
    console.error(`Error fetching project ${id}:`, error)
    
    // Provide user-friendly error
    if (error instanceof Error && error.message.includes('not found')) {
      throw error
    }
    throw new Error('Failed to fetch project. Please try again.')
  }
}
```

### 2. Data Mapping

```typescript
// ✅ GOOD: Separate mapping logic
private mapDocToProject(id: string, data: any): Project {
  return {
    id,
    title: data.title,
    description: data.description,
    // ... map all fields with defaults
    technologies: data.technologies || [],
    featured: data.featured || false,
    status: data.status || 'completed'
  }
}

// Use in all methods
async getAllProjects(): Promise<Project[]> {
  const snapshot = await getDocs(collection(db, this.collectionName))
  return snapshot.docs.map(doc => this.mapDocToProject(doc.id, doc.data()))
}
```

### 3. Timestamps

```typescript
// ✅ GOOD: Add timestamps to all operations
async createProject(project: Omit<Project, 'id'>): Promise<string> {
  const docRef = await addDoc(collection(db, this.collectionName), {
    ...project,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  })
  return docRef.id
}

async updateProject(id: string, updates: Partial<Project>): Promise<void> {
  await updateDoc(doc(db, this.collectionName, id), {
    ...updates,
    updatedAt: Timestamp.now()
  })
}
```

### 4. Query Optimization

```typescript
// ✅ GOOD: Use composite indexes for complex queries
async getActiveFeaturedProjects(): Promise<Project[]> {
  // Requires composite index: featured (ascending), status (ascending), startDate (descending)
  const q = query(
    collection(db, this.collectionName),
    where('featured', '==', true),
    where('status', '==', 'active'),
    orderBy('startDate', 'desc'),
    limit(10)
  )
  
  const snapshot = await getDocs(q)
  return snapshot.docs.map(doc => this.mapDocToProject(doc.id, doc.data()))
}
```

---

**Next**: [08-PRESENTATION-LAYER.md](./08-PRESENTATION-LAYER.md) - React components and UI
