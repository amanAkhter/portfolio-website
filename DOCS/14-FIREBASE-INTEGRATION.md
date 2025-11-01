# Firebase Integration Documentation

## 📖 Table of Contents
1. [Overview](#overview)
2. [Firebase Setup](#firebase-setup)
3. [Firestore Database](#firestore-database)
4. [Authentication](#authentication)
5. [Security Rules](#security-rules)
6. [Data Model](#data-model)
7. [Best Practices](#best-practices)

---

## Overview

The portfolio uses Firebase as its backend service, providing:
- **Firestore**: NoSQL database for portfolio data
- **Authentication**: Secure admin access
- **Hosting** (optional): Static site hosting

---

## Firebase Setup

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter project name: `portfolio-modular`
4. Disable Google Analytics (optional)
5. Click "Create project"

### 2. Enable Firestore

1. In Firebase Console, click "Firestore Database"
2. Click "Create database"
3. Select "Start in test mode" (we'll add security rules later)
4. Choose a location close to your users
5. Click "Enable"

### 3. Enable Authentication

1. Click "Authentication" in sidebar
2. Click "Get started"
3. Click "Email/Password" tab
4. Enable "Email/Password"
5. Click "Save"

### 4. Create Admin User

1. Go to Authentication → Users
2. Click "Add user"
3. Enter email and password
4. Click "Add user"

### 5. Get Configuration

1. Click gear icon → Project settings
2. Scroll to "Your apps"
3. Click web icon `</>`
4. Register your app
5. Copy the configuration object

---

## Firebase Configuration

### Environment Variables

Create `.env` file:

```env
VITE_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef123456
```

### Configuration File

**File**: `src/infrastructure/firebase/config.ts`

```typescript
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

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

export default app
```

---

## Firestore Database

### Collection Structure

```
portfolio-db/
├── home/
│   └── main                    # Single document
├── about/
│   └── main                    # Single document
├── projects/                   # Collection
│   ├── {projectId}
│   ├── {projectId}
│   └── ...
├── experiences/                # Collection
│   ├── {experienceId}
│   └── ...
├── skills/                     # Collection
│   ├── {skillId}
│   └── ...
├── skill_sections/             # Collection
│   ├── {sectionId}
│   └── ...
├── certifications/             # Collection
│   ├── {certificationId}
│   └── ...
├── education/                  # Collection
│   ├── {educationId}
│   └── ...
└── contact_submissions/        # Collection
    ├── {submissionId}
    └── ...
```

### Document Examples

**Home Document** (`home/main`):
```json
{
  "name": "John Doe",
  "title": "Full Stack Developer",
  "tagline": "Building amazing web experiences with modern technologies",
  "bio": "Passionate developer with 5+ years of experience...",
  "email": "john@example.com",
  "phone": "+1234567890",
  "location": "San Francisco, CA",
  "profileImage": "https://example.com/profile.jpg",
  "resume": "https://example.com/resume.pdf",
  "socialLinks": [
    {
      "platform": "GitHub",
      "url": "https://github.com/johndoe",
      "icon": "Github"
    },
    {
      "platform": "LinkedIn",
      "url": "https://linkedin.com/in/johndoe",
      "icon": "Linkedin"
    }
  ],
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

**Project Document**:
```json
{
  "title": "E-Commerce Platform",
  "description": "Modern shopping platform with real-time inventory",
  "longDescription": "A comprehensive e-commerce solution featuring...",
  "technologies": ["React", "Node.js", "MongoDB", "Redis", "AWS"],
  "category": "Web Development",
  "featured": true,
  "coverImage": "https://example.com/project-cover.jpg",
  "images": [
    "https://example.com/screenshot1.jpg",
    "https://example.com/screenshot2.jpg"
  ],
  "demoUrl": "https://demo.example.com",
  "githubUrl": "https://github.com/johndoe/ecommerce",
  "startDate": "2024-01-01",
  "endDate": "2024-06-01",
  "status": "completed",
  "highlights": [
    "Implemented real-time inventory sync",
    "Built custom payment gateway integration",
    "Achieved 99.9% uptime"
  ],
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-06-01T15:00:00.000Z"
}
```

**Experience Document**:
```json
{
  "company": "Tech Corp",
  "position": "Senior Full Stack Developer",
  "location": "San Francisco, CA",
  "startDate": "2023-01-01",
  "endDate": null,
  "current": true,
  "description": "Leading development of microservices architecture",
  "responsibilities": [
    "Architecting scalable solutions",
    "Conducting code reviews",
    "Mentoring junior developers",
    "Implementing CI/CD pipelines"
  ],
  "technologies": ["React", "TypeScript", "Node.js", "AWS", "Docker"],
  "achievements": [
    "Reduced deployment time by 60%",
    "Improved system performance by 40%"
  ],
  "createdAt": "2023-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

---

## Authentication

### Sign In

```typescript
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from './config'

async function login(email: string, password: string) {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    )
    return userCredential.user
  } catch (error: any) {
    switch (error.code) {
      case 'auth/invalid-email':
        throw new Error('Invalid email address')
      case 'auth/user-disabled':
        throw new Error('Account disabled')
      case 'auth/user-not-found':
      case 'auth/wrong-password':
        throw new Error('Invalid email or password')
      default:
        throw new Error('Login failed')
    }
  }
}
```

### Sign Out

```typescript
import { signOut } from 'firebase/auth'
import { auth } from './config'

async function logout() {
  try {
    await signOut(auth)
  } catch (error) {
    throw new Error('Logout failed')
  }
}
```

### Auth State Observer

```typescript
import { onAuthStateChanged, User } from 'firebase/auth'
import { auth } from './config'

function onAuthChange(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback)
}

// Usage
const unsubscribe = onAuthChange((user) => {
  if (user) {
    console.log('User logged in:', user.email)
  } else {
    console.log('User logged out')
  }
})

// Cleanup
unsubscribe()
```

---

## Security Rules

### Firestore Rules

**File**: `firestore.rules`

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Helper function to check if user is authenticated
    function isAuthenticated() {
      return request.auth != null;
    }
    
    // Helper function to check if user is admin
    function isAdmin() {
      return isAuthenticated() && 
             request.auth.token.email in [
               'admin@example.com'
             ];
    }
    
    // Home data - Read: Public, Write: Admin only
    match /home/{document=**} {
      allow read: if true;
      allow write: if isAdmin();
    }
    
    // About data - Read: Public, Write: Admin only
    match /about/{document=**} {
      allow read: if true;
      allow write: if isAdmin();
    }
    
    // Projects - Read: Public, Write: Admin only
    match /projects/{projectId} {
      allow read: if true;
      allow create, update, delete: if isAdmin();
    }
    
    // Experiences - Read: Public, Write: Admin only
    match /experiences/{experienceId} {
      allow read: if true;
      allow create, update, delete: if isAdmin();
    }
    
    // Skills - Read: Public, Write: Admin only
    match /skills/{skillId} {
      allow read: if true;
      allow create, update, delete: if isAdmin();
    }
    
    // Skill Sections - Read: Public, Write: Admin only
    match /skill_sections/{sectionId} {
      allow read: if true;
      allow create, update, delete: if isAdmin();
    }
    
    // Certifications - Read: Public, Write: Admin only
    match /certifications/{certificationId} {
      allow read: if true;
      allow create, update, delete: if isAdmin();
    }
    
    // Education - Read: Public, Write: Admin only
    match /education/{educationId} {
      allow read: if true;
      allow create, update, delete: if isAdmin();
    }
    
    // Contact Submissions - Create: Public, Read/Update/Delete: Admin only
    match /contact_submissions/{submissionId} {
      allow create: if true;
      allow read, update, delete: if isAdmin();
    }
  }
}
```

### Deploy Security Rules

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Initialize
firebase init firestore

# Deploy rules
firebase deploy --only firestore:rules
```

---

## Data Model

### Timestamps

All documents should include:
- `createdAt`: Timestamp when document was created
- `updatedAt`: Timestamp when document was last modified

```typescript
import { Timestamp } from 'firebase/firestore'

const data = {
  // ... other fields
  createdAt: Timestamp.now(),
  updatedAt: Timestamp.now()
}
```

### References vs Embedded Data

**Use References When**:
- Data is shared across multiple documents
- Data changes frequently
- Need to query independently

**Use Embedded Data When**:
- Data is specific to the document
- Data is read together
- Denormalization improves performance

**Example**: Skills in Projects
```json
{
  "title": "E-Commerce Platform",
  "technologies": ["React", "Node.js"]  // Embedded - simple strings
}
```

---

## Best Practices

### 1. Batch Operations

```typescript
import { writeBatch, doc } from 'firebase/firestore'
import { db } from './config'

async function bulkUpdate(updates: Array<{id: string; data: any}>) {
  const batch = writeBatch(db)
  
  updates.forEach(({ id, data }) => {
    const docRef = doc(db, 'projects', id)
    batch.update(docRef, data)
  })
  
  await batch.commit()
}
```

### 2. Pagination

```typescript
import { collection, query, orderBy, limit, startAfter, getDocs } from 'firebase/firestore'

async function getProjectsPage(pageSize: number, lastDoc?: any) {
  let q = query(
    collection(db, 'projects'),
    orderBy('startDate', 'desc'),
    limit(pageSize)
  )
  
  if (lastDoc) {
    q = query(q, startAfter(lastDoc))
  }
  
  const snapshot = await getDocs(q)
  return {
    docs: snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })),
    lastDoc: snapshot.docs[snapshot.docs.length - 1]
  }
}
```

### 3. Real-Time Listeners

```typescript
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore'

function subscribeToProjects(callback: (projects: Project[]) => void) {
  const q = query(
    collection(db, 'projects'),
    orderBy('startDate', 'desc')
  )
  
  return onSnapshot(q, (snapshot) => {
    const projects = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Project[]
    
    callback(projects)
  })
}

// Usage
const unsubscribe = subscribeToProjects((projects) => {
  console.log('Projects updated:', projects)
})

// Cleanup
unsubscribe()
```

### 4. Error Handling

```typescript
import { FirebaseError } from 'firebase/app'

try {
  await addDoc(collection(db, 'projects'), data)
} catch (error) {
  if (error instanceof FirebaseError) {
    switch (error.code) {
      case 'permission-denied':
        console.error('Permission denied')
        break
      case 'unavailable':
        console.error('Service unavailable')
        break
      default:
        console.error('Firebase error:', error.message)
    }
  }
}
```

---

**Next**: [15-AUTHENTICATION.md](./15-AUTHENTICATION.md) - Auth implementation details
