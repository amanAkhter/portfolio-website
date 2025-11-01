# Folder Structure Documentation

## 📂 Complete Directory Structure

```
portfolio-modular/
├── 📁 public/                    # Static assets served directly
│   ├── vite.svg                 # Vite logo
│   └── [other static files]     # Images, fonts, etc.
│
├── 📁 src/                       # Source code
│   ├── 📄 main.tsx              # Application entry point
│   ├── 📄 App.tsx               # Root component with routing
│   ├── 📄 App.css               # Global styles
│   ├── 📄 index.css             # Tailwind directives
│   │
│   ├── 📁 assets/               # Project assets (imported in code)
│   │   └── [images, icons, etc.]
│   │
│   ├── 📁 core/                 # Clean Architecture Core
│   │   ├── 📁 domain/          # Business entities & interfaces
│   │   │   ├── 📁 entities/   # Domain models
│   │   │   │   └── index.ts   # Entity exports
│   │   │   └── 📁 repositories/ # Repository interfaces
│   │   │       └── index.ts   # Repository contracts
│   │   │
│   │   └── 📁 usecases/        # Business logic
│   │       ├── index.ts       # Use case exports
│   │       └── services.ts    # PortfolioService implementation
│   │
│   ├── 📁 infrastructure/       # External services & implementations
│   │   ├── 📁 firebase/       # Firebase configuration
│   │   │   └── config.ts     # Firebase initialization
│   │   │
│   │   └── 📁 repositories/    # Repository implementations
│   │       ├── AuthRepository.ts           # Auth operations
│   │       └── FirebaseRepositories.ts     # Firestore CRUD
│   │
│   ├── 📁 presentation/         # UI Layer
│   │   ├── 📁 components/     # React components
│   │   │   ├── 📁 admin/     # Admin panel components
│   │   │   │   ├── AboutManager.tsx
│   │   │   │   ├── CertificationManager.tsx
│   │   │   │   ├── ContactManager.tsx
│   │   │   │   ├── ContactSubmissionsManager.tsx
│   │   │   │   ├── EducationManager.tsx
│   │   │   │   ├── ExperienceManager.tsx
│   │   │   │   ├── HomeManager.tsx
│   │   │   │   ├── ProjectManager.tsx
│   │   │   │   ├── SkillManager.tsx
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── 📁 sections/   # Portfolio sections
│   │   │   │   ├── About.tsx
│   │   │   │   ├── Certifications.tsx
│   │   │   │   ├── Contact.tsx
│   │   │   │   ├── Education.tsx
│   │   │   │   ├── Experience.tsx
│   │   │   │   ├── Home.tsx
│   │   │   │   ├── Projects.tsx
│   │   │   │   ├── Skills.tsx
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   └── 📁 ui/         # Reusable UI components
│   │   │       ├── AdvancedAnimations.tsx
│   │   │       ├── Animations.tsx
│   │   │       ├── Badge.tsx
│   │   │       ├── Button.tsx
│   │   │       ├── Card.tsx
│   │   │       ├── EasterEggs.tsx
│   │   │       ├── EmptyState.tsx
│   │   │       ├── FormInput.tsx
│   │   │       ├── Input.tsx
│   │   │       ├── Loading.tsx
│   │   │       ├── Modal.tsx
│   │   │       ├── ParticlesBackground.tsx
│   │   │       ├── Progress.tsx
│   │   │       ├── SpaceParticles.tsx
│   │   │       ├── Textarea.tsx
│   │   │       ├── TypingTagline.tsx
│   │   │       └── index.ts
│   │   │
│   │   ├── 📁 hooks/          # Custom React hooks
│   │   │   ├── index.ts
│   │   │   ├── useAuth.ts
│   │   │   ├── useEasterEggs.ts
│   │   │   └── usePortfolio.ts
│   │   │
│   │   ├── 📁 pages/          # Page components
│   │   │   ├── AdminLogin.tsx      # Admin authentication
│   │   │   ├── AdminPage.tsx       # Admin dashboard
│   │   │   └── PortfolioPage.tsx   # Main portfolio
│   │   │
│   │   └── 📁 store/          # State management
│   │       ├── authStore.ts        # Auth state (Zustand)
│   │       ├── portfolioStore.ts   # Portfolio state
│   │       └── index.ts
│   │
│   └── 📁 shared/              # Shared utilities
│       ├── 📁 constants/      # Application constants
│       │   └── configuration.ts
│       ├── 📁 types/          # TypeScript types
│       │   └── index.ts
│       └── 📁 utils/          # Helper functions
│           └── helpers.ts
│
├── 📁 DOCS/                     # Documentation (YOU ARE HERE!)
│   ├── 00-INDEX.md
│   ├── 01-PROJECT-OVERVIEW.md
│   ├── 02-INSTALLATION-SETUP.md
│   ├── 03-FOLDER-STRUCTURE.md
│   └── [other documentation files]
│
├── 📁 NOTES/                    # Learning resources
│   └── [React + TypeScript notes]
│
├── 📄 .gitignore               # Git ignore rules
├── 📄 eslint.config.js         # ESLint configuration
├── 📄 index.html               # HTML entry point
├── 📄 package.json             # Project dependencies
├── 📄 pnpm-lock.yaml          # Package lock file
├── 📄 postcss.config.js       # PostCSS configuration
├── 📄 tailwind.config.js      # TailwindCSS configuration
├── 📄 tsconfig.json           # TypeScript configuration
├── 📄 tsconfig.app.json       # App-specific TS config
├── 📄 tsconfig.node.json      # Node-specific TS config
├── 📄 vite.config.ts          # Vite build configuration
└── 📄 README.md               # Project README
```

---

## 📋 Detailed Directory Breakdown

### `/public` - Static Assets
**Purpose**: Files served directly by the web server without processing.

```
public/
├── vite.svg        # Framework logo
├── favicon.ico     # Browser favicon (if added)
└── robots.txt      # SEO robots file (if added)
```

**Characteristics**:
- Files are copied as-is to build output
- Accessible via root URL (e.g., `/vite.svg`)
- Not processed by Vite
- Use for: favicons, robots.txt, static images

---

### `/src` - Source Code Root

#### `main.tsx` - Application Entry
**Purpose**: Bootstraps the React application

```typescript
// Key responsibilities:
- Imports React and ReactDOM
- Imports root App component
- Imports global styles
- Renders App to DOM
- Wraps with StrictMode
```

**Example**:
```typescript
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

#### `App.tsx` - Root Component
**Purpose**: Application router and layout

```typescript
// Key responsibilities:
- Sets up React Router
- Defines all routes
- Lazy loads page components
- Provides app-wide error boundaries
```

#### `index.css` - Global Styles
**Purpose**: Tailwind directives and global CSS

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Custom global styles */
```

---

### `/src/core` - Domain Layer (Clean Architecture)

#### `/core/domain/entities/`
**Purpose**: Core business entities and types

```typescript
// Exports domain models
export type { 
  User, 
  Portfolio, 
  Project, 
  Experience 
}
```

**Characteristics**:
- Pure business logic
- No external dependencies
- Framework-agnostic
- Reusable across projects

#### `/core/domain/repositories/`
**Purpose**: Repository interface definitions

```typescript
// Defines contracts for data access
export interface IPortfolioRepository {
  getAll(): Promise<Portfolio[]>
  getById(id: string): Promise<Portfolio>
  create(data: Portfolio): Promise<void>
  update(id: string, data: Portfolio): Promise<void>
  delete(id: string): Promise<void>
}
```

**Characteristics**:
- Abstracts data access
- Technology-agnostic
- Used by use cases
- Implemented in infrastructure

#### `/core/usecases/`
**Purpose**: Business logic and orchestration

**Key Files**:
- `services.ts`: PortfolioService implementation
- `index.ts`: Exports use cases

```typescript
// PortfolioService coordinates business logic
export class PortfolioService {
  constructor(private repository: IPortfolioRepository) {}
  
  async getAllProjects() {
    return await this.repository.getProjects()
  }
}
```

**Characteristics**:
- Implements business rules
- Coordinates repositories
- Independent of UI
- Testable in isolation

---

### `/src/infrastructure` - Infrastructure Layer

#### `/infrastructure/firebase/`
**Purpose**: Firebase SDK configuration

**Files**:
- `config.ts`: Firebase initialization

```typescript
// Initializes Firebase services
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

const firebaseConfig = { /* ... */ }
const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
export const auth = getAuth(app)
```

#### `/infrastructure/repositories/`
**Purpose**: Concrete repository implementations

**Files**:
- `AuthRepository.ts`: Authentication operations
- `FirebaseRepositories.ts`: Firestore CRUD operations

```typescript
// Implements repository interfaces using Firebase
export class FirebasePortfolioRepository implements IPortfolioRepository {
  async getAll() {
    const snapshot = await getDocs(collection(db, 'portfolios'))
    return snapshot.docs.map(doc => doc.data())
  }
}
```

**Characteristics**:
- Implements domain interfaces
- Uses Firebase SDK
- Handles data transformation
- Error handling

---

### `/src/presentation` - Presentation Layer

#### `/presentation/components/admin/`
**Purpose**: Admin panel CRUD components

**Components** (9 managers):
1. `HomeManager.tsx` - Manage home section
2. `AboutManager.tsx` - Manage about section
3. `ExperienceManager.tsx` - Manage experiences
4. `ProjectManager.tsx` - Manage projects
5. `SkillManager.tsx` - Manage skills
6. `CertificationManager.tsx` - Manage certifications
7. `EducationManager.tsx` - Manage education
8. `ContactManager.tsx` - Manage contact settings
9. `ContactSubmissionsManager.tsx` - View submissions

**Common Pattern**:
```typescript
export const HomeManager: React.FC = () => {
  const [data, setData] = useState<HomeData>()
  const [isEditing, setIsEditing] = useState(false)
  
  // CRUD operations
  const handleCreate = async (data) => { /* ... */ }
  const handleUpdate = async (id, data) => { /* ... */ }
  const handleDelete = async (id) => { /* ... */ }
  
  return (
    <div>
      {/* Form UI */}
      {/* Data table */}
    </div>
  )
}
```

#### `/presentation/components/sections/`
**Purpose**: Portfolio section components

**Components** (8 sections):
1. `Home.tsx` - Hero section
2. `About.tsx` - About section
3. `Experience.tsx` - Work experience
4. `Projects.tsx` - Project showcase
5. `Skills.tsx` - Technical skills
6. `Certifications.tsx` - Certificates & awards
7. `Education.tsx` - Educational background
8. `Contact.tsx` - Contact form

**Common Pattern**:
```typescript
export const Projects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([])
  const [showFeatured, setShowFeatured] = useState(true)
  
  useEffect(() => {
    // Fetch data
  }, [])
  
  return (
    <section id="projects">
      {/* Section content */}
    </section>
  )
}
```

#### `/presentation/components/ui/`
**Purpose**: Reusable UI components

**Categories**:

**1. Basic Components**:
- `Button.tsx` - Button variants
- `Card.tsx` - Card container
- `Badge.tsx` - Badges & tags
- `Input.tsx` - Text input
- `Textarea.tsx` - Text area
- `FormInput.tsx` - Form input wrapper

**2. Feedback Components**:
- `Loading.tsx` - Loading spinner
- `EmptyState.tsx` - Empty state UI
- `Modal.tsx` - Modal dialog

**3. Animation Components**:
- `Animations.tsx` - Basic animations
- `AdvancedAnimations.tsx` - Complex animations
- `TypingTagline.tsx` - Typing effect

**4. Effect Components**:
- `ParticlesBackground.tsx` - Particle system
- `SpaceParticles.tsx` - Space effect
- `EasterEggs.tsx` - Easter egg manager

**5. Progress Components**:
- `Progress.tsx` - Progress bar

#### `/presentation/hooks/`
**Purpose**: Custom React hooks

**Hooks**:
1. `useAuth.ts` - Authentication hook
   ```typescript
   export const useAuth = () => {
     const { user, login, logout } = useAuthStore()
     return { user, login, logout, isAuthenticated: !!user }
   }
   ```

2. `usePortfolio.ts` - Portfolio data hook
   ```typescript
   export const usePortfolio = () => {
     const [data, setData] = useState()
     // Fetch and manage portfolio data
     return { data, loading, error }
   }
   ```

3. `useEasterEggs.ts` - Easter egg hook
   ```typescript
   export const useEasterEggs = () => {
     const [unlocked, setUnlocked] = useState([])
     // Track and manage easter eggs
     return { unlocked, unlock }
   }
   ```

#### `/presentation/pages/`
**Purpose**: Page-level components

**Pages**:
1. `PortfolioPage.tsx` - Main portfolio (public)
2. `AdminLogin.tsx` - Admin authentication
3. `AdminPage.tsx` - Admin dashboard

**Routing**:
```typescript
// In App.tsx
<Routes>
  <Route path="/" element={<PortfolioPage />} />
  <Route path="/admin/login" element={<AdminLogin />} />
  <Route path="/admin" element={<AdminPage />} />
</Routes>
```

#### `/presentation/store/`
**Purpose**: Client-side state management (Zustand)

**Stores**:
1. `authStore.ts` - Authentication state
   ```typescript
   export const useAuthStore = create<AuthState>((set) => ({
     user: null,
     login: (user) => set({ user }),
     logout: () => set({ user: null }),
   }))
   ```

2. `portfolioStore.ts` - Portfolio cache state
   ```typescript
   export const usePortfolioStore = create<PortfolioState>((set) => ({
     projects: [],
     setProjects: (projects) => set({ projects }),
   }))
   ```

---

### `/src/shared` - Shared Utilities

#### `/shared/constants/`
**Purpose**: Application-wide constants

```typescript
// configuration.ts
export const APP_CONFIG = {
  title: 'Portfolio',
  itemsPerPage: 9,
  animationDuration: 300,
}

export const ROUTES = {
  home: '/',
  admin: '/admin',
  login: '/admin/login',
}
```

#### `/shared/types/`
**Purpose**: TypeScript type definitions

```typescript
// index.ts
export interface Project {
  id: string
  title: string
  description: string
  technologies: string[]
  featured: boolean
}

export interface Experience {
  id: string
  company: string
  position: string
  startDate: string
  endDate?: string
  description: string
}

// ... all domain types
```

#### `/shared/utils/`
**Purpose**: Helper functions

```typescript
// helpers.ts
export const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString()
}

export const truncate = (str: string, length: number) => {
  return str.length > length 
    ? str.substring(0, length) + '...' 
    : str
}
```

---

## 🗂️ File Organization Principles

### 1. **Separation of Concerns**
Each directory has a single, well-defined purpose.

### 2. **Colocation**
Related files are grouped together (e.g., all admin components in `/admin`).

### 3. **Clean Architecture Layers**
```
Domain ← Use Cases ← Infrastructure ← Presentation
```

### 4. **Index Files**
Each directory exports its public API through `index.ts`:
```typescript
// components/ui/index.ts
export { Button } from './Button'
export { Card } from './Card'
export { Badge } from './Badge'
```

### 5. **Naming Conventions**
- **Components**: PascalCase (e.g., `HomeManager.tsx`)
- **Hooks**: camelCase with 'use' prefix (e.g., `useAuth.ts`)
- **Utils**: camelCase (e.g., `helpers.ts`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `APP_CONFIG`)

---

## 📊 Directory Statistics

```
Total Directories: 15
Total Files: 60+
Lines of Code: 5000+

By Layer:
- Presentation: 70%
- Infrastructure: 15%
- Core/Domain: 10%
- Shared: 5%
```

---

## 🔍 How to Navigate

### Finding a Component
1. **Admin component?** → `/presentation/components/admin/`
2. **Section component?** → `/presentation/components/sections/`
3. **UI component?** → `/presentation/components/ui/`

### Finding Business Logic
1. Check `/core/usecases/services.ts`
2. Check repository interfaces in `/core/domain/repositories/`

### Finding Data Access
1. Check `/infrastructure/repositories/`

### Finding Types
1. Check `/shared/types/index.ts`

---

**Next**: [04-CLEAN-ARCHITECTURE.md](./04-CLEAN-ARCHITECTURE.md) - Deep dive into architecture
