# API Services Documentation

## 📖 Table of Contents
1. [Overview](#overview)
2. [PortfolioService Methods](#portfolioservice-methods)
3. [Service Initialization](#service-initialization)
4. [Error Handling](#error-handling)
5. [Usage Examples](#usage-examples)
6. [Best Practices](#best-practices)

---

## Overview

The PortfolioService is the main service class that provides all business logic and data operations for the portfolio application.

### Service Location
```
src/core/usecases/
├── services.ts    # PortfolioService implementation
└── index.ts       # Exports
```

---

## PortfolioService Methods

### Home Data

```typescript
// Get home data
async getHomeData(): Promise<HomeData>

// Update home data
async updateHomeData(data: Partial<HomeData>): Promise<void>
```

**Example**:
```typescript
const homeData = await portfolioService.getHomeData()
await portfolioService.updateHomeData({ 
  title: 'Senior Full Stack Developer' 
})
```

---

### About Data

```typescript
// Get about data
async getAboutData(): Promise<AboutData>

// Update about data
async updateAboutData(data: Partial<AboutData>): Promise<void>

// Get about data with computed stats
async getAboutDataWithStats(): Promise<AboutData>
```

**Example**:
```typescript
const aboutData = await portfolioService.getAboutData()
const aboutWithStats = await portfolioService.getAboutDataWithStats()
```

---

### Projects

```typescript
// Get all projects
async getAllProjects(): Promise<Project[]>

// Get featured projects
async getFeaturedProjects(): Promise<Project[]>

// Get projects by category
async getProjectsByCategory(category: string): Promise<Project[]>

// Get projects by technology
async getProjectsByTechnology(tech: string): Promise<Project[]>

// Search projects
async searchProjects(query: string): Promise<Project[]>

// Get project by ID
async getProjectById(id: string): Promise<Project>

// Create project
async createProject(project: Omit<Project, 'id'>): Promise<string>

// Update project
async updateProject(id: string, updates: Partial<Project>): Promise<void>

// Delete project
async deleteProject(id: string): Promise<void>
```

**Examples**:
```typescript
// Get all projects
const projects = await portfolioService.getAllProjects()

// Get featured only
const featured = await portfolioService.getFeaturedProjects()

// Filter by category
const webProjects = await portfolioService.getProjectsByCategory('Web Development')

// Search
const results = await portfolioService.searchProjects('React')

// Create new project
const projectId = await portfolioService.createProject({
  title: 'E-Commerce Platform',
  description: 'Modern shopping platform',
  longDescription: 'Detailed description...',
  technologies: ['React', 'Node.js', 'MongoDB'],
  category: 'Web Development',
  featured: true,
  coverImage: 'https://...',
  images: [],
  demoUrl: 'https://...',
  githubUrl: 'https://github.com/...',
  startDate: '2024-01-01',
  status: 'completed',
  highlights: ['Feature 1', 'Feature 2']
})

// Update project
await portfolioService.updateProject(projectId, {
  featured: false,
  status: 'archived'
})

// Delete project
await portfolioService.deleteProject(projectId)
```

---

### Experience

```typescript
// Get all experiences
async getAllExperiences(): Promise<Experience[]>

// Get current experience
async getCurrentExperience(): Promise<Experience | null>

// Get experience by ID
async getExperienceById(id: string): Promise<Experience>

// Create experience
async createExperience(exp: Omit<Experience, 'id'>): Promise<string>

// Update experience
async updateExperience(id: string, updates: Partial<Experience>): Promise<void>

// Delete experience
async deleteExperience(id: string): Promise<void>

// Get total years of experience
async getTotalYearsOfExperience(): Promise<number>

// Get experience timeline
async getExperienceTimeline(): Promise<TimelineItem[]>
```

**Examples**:
```typescript
// Get all experiences
const experiences = await portfolioService.getAllExperiences()

// Get current job
const currentJob = await portfolioService.getCurrentExperience()

// Create new experience
const expId = await portfolioService.createExperience({
  company: 'Tech Corp',
  position: 'Senior Developer',
  location: 'San Francisco, CA',
  startDate: '2023-01-01',
  current: true,
  description: 'Leading development team...',
  responsibilities: [
    'Architecting solutions',
    'Code reviews',
    'Mentoring juniors'
  ],
  technologies: ['React', 'TypeScript', 'AWS']
})

// Calculate total years
const years = await portfolioService.getTotalYearsOfExperience()
console.log(`${years} years of experience`)
```

---

### Skills

```typescript
// Get all skills grouped by section
async getGroupedSkills(): Promise<SkillGroup[]>

// Get skills by proficiency level
async getSkillsByProficiency(minLevel: number): Promise<Skill[]>

// Get expert skills (proficiency 4-5)
async getExpertSkills(): Promise<Skill[]>

// Get skill by ID
async getSkillById(id: string): Promise<Skill>

// Create skill and add to section
async createSkill(skill: Omit<Skill, 'id'>, sectionId: string): Promise<string>

// Update skill
async updateSkill(id: string, updates: Partial<Skill>): Promise<void>

// Update skill proficiency
async updateSkillProficiency(id: string, proficiency: number): Promise<void>

// Delete skill
async deleteSkill(id: string): Promise<void>

// Skill Section methods
async getAllSkillSections(): Promise<SkillSection[]>
async createSkillSection(section: Omit<SkillSection, 'id'>): Promise<string>
async updateSkillSection(id: string, updates: Partial<SkillSection>): Promise<void>
async deleteSkillSection(id: string): Promise<void>
```

**Examples**:
```typescript
// Get grouped skills
const skillGroups = await portfolioService.getGroupedSkills()

// Get expert level skills
const expertSkills = await portfolioService.getExpertSkills()

// Create new skill
const skillId = await portfolioService.createSkill(
  {
    name: 'TypeScript',
    category: 'Frontend',
    proficiency: 5,
    icon: 'SiTypescript'
  },
  'frontend-section-id'
)

// Update proficiency
await portfolioService.updateSkillProficiency(skillId, 4)
```

---

### Certifications

```typescript
// Get all certifications
async getAllCertifications(): Promise<Certification[]>

// Get featured certifications
async getFeaturedCertifications(): Promise<Certification[]>

// Get certification by ID
async getCertificationById(id: string): Promise<Certification>

// Create certification
async createCertification(cert: Omit<Certification, 'id'>): Promise<string>

// Update certification
async updateCertification(id: string, updates: Partial<Certification>): Promise<void>

// Delete certification
async deleteCertification(id: string): Promise<void>

// Get certifications grouped by organization
async getCertificationsByOrganization(): Promise<CertificationGroup[]>
```

**Examples**:
```typescript
// Get all certifications
const certs = await portfolioService.getAllCertifications()

// Create new certification
const certId = await portfolioService.createCertification({
  name: 'AWS Solutions Architect',
  issuingOrganization: 'Amazon Web Services',
  issueDate: '2024-01-15',
  expiryDate: '2027-01-15',
  credentialId: 'AWS-XXXXX',
  credentialUrl: 'https://...',
  skills: ['AWS', 'Cloud Architecture', 'DevOps'],
  year: '2024',
  featured: true
})

// Group by organization
const grouped = await portfolioService.getCertificationsByOrganization()
```

---

### Education

```typescript
// Get all education
async getAllEducation(): Promise<Education[]>

// Get education by ID
async getEducationById(id: string): Promise<Education>

// Create education
async createEducation(edu: Omit<Education, 'id'>): Promise<string>

// Update education
async updateEducation(id: string, updates: Partial<Education>): Promise<void>

// Delete education
async deleteEducation(id: string): Promise<void>
```

---

### Contact Submissions

```typescript
// Get all submissions
async getAllContactSubmissions(): Promise<ContactSubmission[]>

// Get unread submissions
async getUnreadSubmissions(): Promise<ContactSubmission[]>

// Get submission by ID
async getContactSubmissionById(id: string): Promise<ContactSubmission>

// Create submission
async createContactSubmission(
  submission: Omit<ContactSubmission, 'id' | 'timestamp'>
): Promise<string>

// Update submission
async updateContactSubmission(
  id: string, 
  updates: Partial<ContactSubmission>
): Promise<void>

// Mark as read
async markSubmissionAsRead(id: string): Promise<void>

// Mark as replied
async markSubmissionAsReplied(id: string): Promise<void>

// Delete submission
async deleteContactSubmission(id: string): Promise<void>
```

**Examples**:
```typescript
// Submit contact form
const submissionId = await portfolioService.createContactSubmission({
  name: 'John Doe',
  email: 'john@example.com',
  subject: 'Project Inquiry',
  message: 'I would like to discuss...',
  status: 'new'
})

// Get unread submissions (admin)
const unread = await portfolioService.getUnreadSubmissions()

// Mark as read
await portfolioService.markSubmissionAsRead(submissionId)
```

---

## Service Initialization

### Using the Hook

```typescript
import { usePortfolio } from '../hooks/usePortfolio'

const Component = () => {
  const { portfolioService } = usePortfolio()
  
  useEffect(() => {
    loadData()
  }, [])
  
  const loadData = async () => {
    const projects = await portfolioService.getAllProjects()
    // ...
  }
}
```

### Manual Initialization

```typescript
import { PortfolioService } from '../core/usecases'
import { RepositoryFactory } from '../infrastructure/repositories/FirebaseRepositories'

const repos = RepositoryFactory.createAllRepositories()
const portfolioService = new PortfolioService(
  repos.homeRepo,
  repos.aboutRepo,
  repos.projectRepo,
  repos.experienceRepo,
  repos.skillRepo,
  repos.certificationRepo,
  repos.educationRepo,
  repos.contactRepo
)
```

---

## Error Handling

### Service-Level Errors

```typescript
try {
  const projects = await portfolioService.getAllProjects()
} catch (error) {
  if (error instanceof ValidationError) {
    console.error('Validation failed:', error.message)
  } else if (error instanceof NotFoundError) {
    console.error('Resource not found:', error.message)
  } else {
    console.error('Unexpected error:', error)
  }
}
```

### Component Error Handling

```typescript
const ProjectsList = () => {
  const [projects, setProjects] = useState<Project[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    loadProjects()
  }, [])
  
  const loadProjects = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await portfolioService.getAllProjects()
      setProjects(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load projects')
    } finally {
      setLoading(false)
    }
  }
  
  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={loadProjects} />
  
  return <ProjectList projects={projects} />
}
```

---

## Best Practices

### 1. Always Handle Errors

```typescript
// ✅ GOOD
try {
  await portfolioService.createProject(data)
  showSuccessMessage()
} catch (error) {
  showErrorMessage(error.message)
}

// ❌ BAD
await portfolioService.createProject(data) // No error handling
```

### 2. Use Loading States

```typescript
// ✅ GOOD
const [loading, setLoading] = useState(false)

const handleSubmit = async () => {
  setLoading(true)
  try {
    await portfolioService.createProject(data)
  } finally {
    setLoading(false)
  }
}

return <Button disabled={loading}>Submit</Button>
```

### 3. Validate Before Submitting

```typescript
// ✅ GOOD
const handleSubmit = async () => {
  // Client-side validation
  if (!data.title || !data.description) {
    setError('Required fields missing')
    return
  }
  
  // Server-side validation happens in service
  await portfolioService.createProject(data)
}
```

---

**Next**: [14-FIREBASE-INTEGRATION.md](./14-FIREBASE-INTEGRATION.md) - Firebase setup and configuration
