# Domain Layer Documentation

## 📖 Table of Contents
1. [Overview](#overview)
2. [Entities](#entities)
3. [Repository Interfaces](#repository-interfaces)
4. [Value Objects](#value-objects)
5. [Domain Rules](#domain-rules)
6. [Best Practices](#best-practices)

---

## Overview

The Domain Layer is the heart of the application. It contains the core business logic and entities, completely independent of any framework, UI, or database.

### Location
```
src/core/domain/
├── entities/
│   └── index.ts
└── repositories/
    └── index.ts
```

### Principles
- ✅ **Framework Independent**: No React, Firebase, or any framework imports
- ✅ **Pure TypeScript**: Only interfaces and types
- ✅ **Business Focused**: Models real-world business concepts
- ✅ **Testable**: Easy to test without dependencies

---

## Entities

### HomeData Entity

```typescript
// Represents the home/hero section data
export interface HomeData {
  id?: string
  name: string                    // Full name
  greeting: string                // e.g., "Hi, I am"
  tagline: string                 // Main tagline
  taglines?: string[]             // Multiple taglines for typing effect
  description: string             // Bio/introduction
  profileURL: string              // Profile image URL
  resumeURL: string              // Resume download URL
  email: string                   // Contact email
  socialLinks: SocialLink[]       // Social media links
}

export interface SocialLink {
  platform: string                // e.g., "GitHub", "LinkedIn"
  url: string                     // Profile URL
  icon?: string                   // Icon component name
}
```

**Usage Example**:
```typescript
const homeData: HomeData = {
  name: "John Doe",
  greeting: "Hi, I am",
  tagline: "Full Stack Developer",
  taglines: [
    "Full Stack Developer",
    "Cloud Architect",
    "Problem Solver"
  ],
  description: "Building exceptional digital experiences...",
  profileURL: "https://example.com/profile.jpg",
  resumeURL: "https://example.com/resume.pdf",
  email: "john@example.com",
  socialLinks: [
    { platform: "GitHub", url: "https://github.com/johndoe", icon: "Github" },
    { platform: "LinkedIn", url: "https://linkedin.com/in/johndoe", icon: "Linkedin" }
  ]
}
```

---

### AboutData Entity

```typescript
export interface AboutData {
  id?: string
  title: string                   // Section title
  description: string             // About me description
  bio: string                     // Detailed biography
  highlights: string[]            // Key highlights/achievements
  stats?: Stat[]                  // Statistics (projects, experience, etc.)
  timeline?: TimelineEvent[]      // Career timeline
}

export interface Stat {
  label: string                   // e.g., "Years of Experience"
  value: string | number          // e.g., "5+" or 5
  icon?: string                   // Icon name
}

export interface TimelineEvent {
  id: string
  year: string                    // e.g., "2023"
  title: string                   // Event title
  description: string             // Event description
  type: 'education' | 'work' | 'achievement'
}
```

---

### Project Entity

```typescript
export interface Project {
  id: string
  title: string                   // Project name
  description: string             // Short description
  longDescription?: string        // Detailed description
  category: string                // e.g., "Web App", "Mobile App"
  technologies: string[]          // Tech stack used
  featured: boolean               // Show in featured section
  coverImage: string              // Main project image
  images?: string[]               // Additional images
  githubUrl?: string              // GitHub repository URL
  liveUrl?: string                // Live demo URL
  startDate: string               // ISO date string
  endDate?: string                // ISO date string (optional for ongoing)
  status?: 'completed' | 'in-progress' | 'planned'
  teamSize?: number               // Number of team members
  role?: string                   // Your role in the project
  challenges?: string[]           // Challenges faced
  learnings?: string[]            // Key learnings
}
```

**Business Rules**:
- `title` must be at least 3 characters
- `technologies` array must not be empty
- If `featured` is true, `coverImage` is required
- `endDate` must be after `startDate` if provided

---

### Experience Entity

```typescript
export interface Experience {
  id: string
  company: string                 // Company name
  position: string                // Job title
  location: string                // City, Country
  startDate: string               // ISO date string
  endDate?: string                // ISO date string (null if current)
  current: boolean                // Currently working here
  description: string             // Role description
  responsibilities: string[]      // Key responsibilities
  technologies: string[]          // Technologies used
  achievements?: string[]         // Notable achievements
  companyUrl?: string             // Company website
  companyLogo?: string            // Company logo URL
  employmentType?: 'full-time' | 'part-time' | 'contract' | 'internship'
}
```

**Validation Rules**:
- If `current` is true, `endDate` must be null/undefined
- `startDate` must be a valid date
- `responsibilities` must have at least one item

---

### Skill Entity

```typescript
export interface Skill {
  id: string
  name: string                    // Skill name (e.g., "React")
  category: string                // Category (e.g., "Frontend")
  proficiency: 1 | 2 | 3 | 4 | 5  // Skill level (1=beginner, 5=expert)
  icon?: string                   // Icon name or URL
  yearsOfExperience?: number      // Years using this skill
  sectionId?: string              // Related skill section
}

export interface SkillSection {
  id: string
  title: string                   // Section title (e.g., "Frontend Development")
  description?: string            // Section description
  icon?: string                   // Section icon
  order: number                   // Display order
  skills: string[]                // Array of skill IDs
}
```

---

### Certification Entity

```typescript
export interface Certification {
  id: string
  title: string                   // Certificate name
  issuingOrganization: string     // Issuer (e.g., "AWS", "Google")
  year: string                    // Year obtained
  description: string             // Certificate description
  skills: string[]                // Skills covered
  certificateUrl?: string         // Certificate verification URL
  coverImage?: string             // Certificate image
  featured: boolean               // Show in featured section
  expiryDate?: string            // Expiry date (if applicable)
  credentialId?: string          // Credential/License ID
}
```

---

### Education Entity

```typescript
export interface Education {
  id: string
  institution: string             // School/University name
  degree: string                  // Degree type (e.g., "Bachelor's")
  fieldOfStudy: string           // Major/Field
  startDate: string              // ISO date string
  endDate?: string               // ISO date string
  current: boolean               // Currently studying
  grade?: string                 // GPA/Grade
  description?: string           // Additional details
  achievements?: string[]        // Academic achievements
  coursework?: string[]          // Relevant courses
  location?: string              // City, Country
  institutionUrl?: string        // Institution website
  logoUrl?: string               // Institution logo
}
```

---

### ContactSubmission Entity

```typescript
export interface ContactSubmission {
  id: string
  name: string                   // Sender's name
  email: string                  // Sender's email
  subject?: string               // Message subject
  message: string                // Message content
  timestamp: string              // ISO date string
  read: boolean                  // Has been read by admin
  replied: boolean               // Has been replied to
  ipAddress?: string             // Sender's IP (for spam prevention)
  userAgent?: string             // Browser info
  status: 'new' | 'read' | 'replied' | 'archived'
}
```

**Validation Rules**:
- `email` must be valid email format
- `message` must be at least 10 characters
- `name` must be at least 2 characters

---

## Repository Interfaces

### IHomeRepository

```typescript
export interface IHomeRepository {
  // Read
  getHomeData(): Promise<HomeData>
  
  // Write
  updateHomeData(data: Partial<HomeData>): Promise<void>
  createHomeData(data: Omit<HomeData, 'id'>): Promise<string>
}
```

### IAboutRepository

```typescript
export interface IAboutRepository {
  getAboutData(): Promise<AboutData>
  updateAboutData(data: Partial<AboutData>): Promise<void>
  createAboutData(data: Omit<AboutData, 'id'>): Promise<string>
}
```

### IProjectRepository

```typescript
export interface IProjectRepository {
  // Read operations
  getAllProjects(): Promise<Project[]>
  getProjectById(id: string): Promise<Project>
  getFeaturedProjects(): Promise<Project[]>
  getProjectsByCategory(category: string): Promise<Project[]>
  getProjectsByTechnology(tech: string): Promise<Project[]>
  
  // Write operations
  createProject(project: Omit<Project, 'id'>): Promise<string>
  updateProject(id: string, project: Partial<Project>): Promise<void>
  deleteProject(id: string): Promise<void>
  
  // Batch operations
  updateMultipleProjects(updates: { id: string; data: Partial<Project> }[]): Promise<void>
}
```

### IExperienceRepository

```typescript
export interface IExperienceRepository {
  getAllExperiences(): Promise<Experience[]>
  getExperienceById(id: string): Promise<Experience>
  getCurrentExperience(): Promise<Experience | null>
  getExperiencesByCompany(company: string): Promise<Experience[]>
  
  createExperience(experience: Omit<Experience, 'id'>): Promise<string>
  updateExperience(id: string, experience: Partial<Experience>): Promise<void>
  deleteExperience(id: string): Promise<void>
}
```

### ISkillRepository

```typescript
export interface ISkillRepository {
  // Skills
  getAllSkills(): Promise<Skill[]>
  getSkillById(id: string): Promise<Skill>
  getSkillsByCategory(category: string): Promise<Skill[]>
  getSkillsByProficiency(level: number): Promise<Skill[]>
  
  createSkill(skill: Omit<Skill, 'id'>): Promise<string>
  updateSkill(id: string, skill: Partial<Skill>): Promise<void>
  deleteSkill(id: string): Promise<void>
  
  // Skill Sections
  getAllSkillSections(): Promise<SkillSection[]>
  getSkillSectionById(id: string): Promise<SkillSection>
  
  createSkillSection(section: Omit<SkillSection, 'id'>): Promise<string>
  updateSkillSection(id: string, section: Partial<SkillSection>): Promise<void>
  deleteSkillSection(id: string): Promise<void>
}
```

### ICertificationRepository

```typescript
export interface ICertificationRepository {
  getAllCertifications(): Promise<Certification[]>
  getCertificationById(id: string): Promise<Certification>
  getFeaturedCertifications(): Promise<Certification[]>
  getCertificationsByOrganization(org: string): Promise<Certification[]>
  
  createCertification(cert: Omit<Certification, 'id'>): Promise<string>
  updateCertification(id: string, cert: Partial<Certification>): Promise<void>
  deleteCertification(id: string): Promise<void>
}
```

### IEducationRepository

```typescript
export interface IEducationRepository {
  getAllEducation(): Promise<Education[]>
  getEducationById(id: string): Promise<Education>
  getCurrentEducation(): Promise<Education | null>
  
  createEducation(education: Omit<Education, 'id'>): Promise<string>
  updateEducation(id: string, education: Partial<Education>): Promise<void>
  deleteEducation(id: string): Promise<void>
}
```

### IContactRepository

```typescript
export interface IContactRepository {
  // Read
  getAllSubmissions(): Promise<ContactSubmission[]>
  getSubmissionById(id: string): Promise<ContactSubmission>
  getUnreadSubmissions(): Promise<ContactSubmission[]>
  getSubmissionsByStatus(status: ContactSubmission['status']): Promise<ContactSubmission[]>
  
  // Write
  createSubmission(submission: Omit<ContactSubmission, 'id' | 'timestamp'>): Promise<string>
  updateSubmission(id: string, updates: Partial<ContactSubmission>): Promise<void>
  markAsRead(id: string): Promise<void>
  markAsReplied(id: string): Promise<void>
  deleteSubmission(id: string): Promise<void>
}
```

---

## Value Objects

Value objects are immutable objects that represent concepts in your domain.

### Email Value Object

```typescript
export class Email {
  private readonly value: string
  
  constructor(email: string) {
    if (!this.isValid(email)) {
      throw new Error('Invalid email format')
    }
    this.value = email.toLowerCase()
  }
  
  private isValid(email: string): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return regex.test(email)
  }
  
  toString(): string {
    return this.value
  }
  
  equals(other: Email): boolean {
    return this.value === other.value
  }
}

// Usage
const email = new Email('john@example.com')
console.log(email.toString()) // john@example.com
```

### DateRange Value Object

```typescript
export class DateRange {
  constructor(
    private readonly startDate: Date,
    private readonly endDate: Date | null
  ) {
    if (endDate && startDate > endDate) {
      throw new Error('Start date must be before end date')
    }
  }
  
  getDuration(): number {
    const end = this.endDate || new Date()
    return end.getTime() - this.startDate.getTime()
  }
  
  getDurationInYears(): number {
    const ms = this.getDuration()
    return ms / (1000 * 60 * 60 * 24 * 365.25)
  }
  
  isOngoing(): boolean {
    return this.endDate === null
  }
  
  toString(): string {
    const start = this.startDate.toLocaleDateString()
    const end = this.endDate 
      ? this.endDate.toLocaleDateString() 
      : 'Present'
    return `${start} - ${end}`
  }
}
```

---

## Domain Rules

### Project Validation Rules

```typescript
export class ProjectValidationRules {
  static validateTitle(title: string): void {
    if (title.length < 3) {
      throw new Error('Project title must be at least 3 characters')
    }
    if (title.length > 100) {
      throw new Error('Project title must not exceed 100 characters')
    }
  }
  
  static validateTechnologies(technologies: string[]): void {
    if (technologies.length === 0) {
      throw new Error('Project must have at least one technology')
    }
    if (technologies.length > 20) {
      throw new Error('Project cannot have more than 20 technologies')
    }
  }
  
  static validateFeatured(featured: boolean, coverImage?: string): void {
    if (featured && !coverImage) {
      throw new Error('Featured projects must have a cover image')
    }
  }
  
  static validateDates(startDate: string, endDate?: string): void {
    const start = new Date(startDate)
    if (isNaN(start.getTime())) {
      throw new Error('Invalid start date')
    }
    
    if (endDate) {
      const end = new Date(endDate)
      if (isNaN(end.getTime())) {
        throw new Error('Invalid end date')
      }
      if (end < start) {
        throw new Error('End date must be after start date')
      }
    }
  }
}
```

### Experience Validation Rules

```typescript
export class ExperienceValidationRules {
  static validateCurrent(current: boolean, endDate?: string): void {
    if (current && endDate) {
      throw new Error('Current experience cannot have an end date')
    }
    if (!current && !endDate) {
      throw new Error('Past experience must have an end date')
    }
  }
  
  static validateResponsibilities(responsibilities: string[]): void {
    if (responsibilities.length === 0) {
      throw new Error('Experience must have at least one responsibility')
    }
  }
}
```

---

## Best Practices

### 1. Keep It Pure

```typescript
// ❌ BAD: Domain depends on infrastructure
import { db } from '../../infrastructure/firebase/config'

export interface Project {
  id: string
  title: string
  save(): Promise<void> // Don't do this!
}

// ✅ GOOD: Pure domain entity
export interface Project {
  id: string
  title: string
  // No methods, just data
}

// ✅ GOOD: Repository handles persistence
export interface IProjectRepository {
  save(project: Project): Promise<void>
}
```

### 2. Use Interfaces, Not Classes

```typescript
// ❌ AVOID: Classes in domain (unless needed for validation)
export class Project {
  constructor(
    public id: string,
    public title: string
  ) {}
}

// ✅ PREFER: Interfaces for data structures
export interface Project {
  id: string
  title: string
}
```

### 3. Separate Read and Write Models

```typescript
// Write model (what you send to create)
export type CreateProjectDto = Omit<Project, 'id'>

// Update model (partial updates)
export type UpdateProjectDto = Partial<Omit<Project, 'id'>>

// Read model (what you get back)
export interface Project {
  id: string
  title: string
  // ... other fields
}
```

### 4. Use Discriminated Unions for States

```typescript
// ✅ GOOD: Type-safe status
export type ProjectStatus = 
  | { type: 'draft'; lastEdited: string }
  | { type: 'in-progress'; startedAt: string }
  | { type: 'completed'; completedAt: string; outcome: string }
  | { type: 'cancelled'; reason: string }

export interface Project {
  id: string
  title: string
  status: ProjectStatus
}

// Usage
function handleProjectStatus(project: Project) {
  switch (project.status.type) {
    case 'draft':
      console.log(`Last edited: ${project.status.lastEdited}`)
      break
    case 'completed':
      console.log(`Completed: ${project.status.outcome}`)
      break
    // TypeScript ensures all cases are handled
  }
}
```

### 5. Domain Events (Advanced)

```typescript
export interface DomainEvent {
  type: string
  timestamp: Date
  aggregateId: string
}

export interface ProjectCreatedEvent extends DomainEvent {
  type: 'PROJECT_CREATED'
  project: Project
}

export interface ProjectCompletedEvent extends DomainEvent {
  type: 'PROJECT_COMPLETED'
  projectId: string
  completedAt: Date
}

// Events can trigger side effects in other layers
```

---

## Testing Domain Logic

```typescript
describe('ProjectValidationRules', () => {
  describe('validateTitle', () => {
    it('should throw error for title less than 3 characters', () => {
      expect(() => {
        ProjectValidationRules.validateTitle('AB')
      }).toThrow('Project title must be at least 3 characters')
    })
    
    it('should accept valid title', () => {
      expect(() => {
        ProjectValidationRules.validateTitle('Valid Project Title')
      }).not.toThrow()
    })
  })
  
  describe('validateTechnologies', () => {
    it('should throw error for empty technologies array', () => {
      expect(() => {
        ProjectValidationRules.validateTechnologies([])
      }).toThrow('Project must have at least one technology')
    })
  })
})
```

---

## Summary

The Domain Layer is:
- ✅ **Pure**: No framework dependencies
- ✅ **Focused**: Only business logic and entities
- ✅ **Testable**: Easy to test in isolation
- ✅ **Reusable**: Can be used in any application
- ✅ **Maintainable**: Changes don't affect other layers

**Key Files**:
- `src/core/domain/entities/index.ts` - All entity types
- `src/core/domain/repositories/index.ts` - Repository interfaces

---

**Next**: [06-USECASE-LAYER.md](./06-USECASE-LAYER.md) - Business logic implementation
