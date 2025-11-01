# Use Case Layer Documentation

## 📖 Table of Contents
1. [Overview](#overview)
2. [PortfolioService](#portfolioservice)
3. [Service Methods](#service-methods)
4. [Business Logic](#business-logic)
5. [Error Handling](#error-handling)
6. [Best Practices](#best-practices)

---

## Overview

The Use Case Layer orchestrates business logic and coordinates between the Domain and Infrastructure layers. It implements application-specific operations and workflows.

### Location
```
src/core/usecases/
├── services.ts    # PortfolioService implementation
└── index.ts       # Exports and service instances
```

### Responsibilities
- ✅ Implement business workflows
- ✅ Coordinate repository operations
- ✅ Apply business rules
- ✅ Transform data for presentation
- ✅ Handle application logic

### Dependencies
- **Depends on**: Domain layer (entities, repositories)
- **Used by**: Presentation layer
- **Independent of**: Infrastructure, UI frameworks

---

## PortfolioService

The main service class that coordinates all portfolio operations.

### Service Structure

```typescript
import type {
  IHomeRepository,
  IAboutRepository,
  IProjectRepository,
  IExperienceRepository,
  ISkillRepository,
  ICertificationRepository,
  IEducationRepository,
  IContactRepository,
  HomeData,
  AboutData,
  Project,
  Experience,
  Skill,
  SkillSection,
  Certification,
  Education,
  ContactSubmission
} from '../domain'

export class PortfolioService {
  constructor(
    private homeRepo: IHomeRepository,
    private aboutRepo: IAboutRepository,
    private projectRepo: IProjectRepository,
    private experienceRepo: IExperienceRepository,
    private skillRepo: ISkillRepository,
    private certificationRepo: ICertificationRepository,
    private educationRepo: IEducationRepository,
    private contactRepo: IContactRepository
  ) {}
  
  // Home methods
  async getHomeData(): Promise<HomeData> { /* ... */ }
  async updateHomeData(data: Partial<HomeData>): Promise<void> { /* ... */ }
  
  // Project methods
  async getAllProjects(): Promise<Project[]> { /* ... */ }
  async getFeaturedProjects(): Promise<Project[]> { /* ... */ }
  
  // ... more methods
}
```

---

## Service Methods

### Home Data Operations

```typescript
export class PortfolioService {
  // Get home data
  async getHomeData(): Promise<HomeData> {
    try {
      return await this.homeRepo.getHomeData()
    } catch (error) {
      console.error('Error fetching home data:', error)
      throw new Error('Failed to fetch home data')
    }
  }
  
  // Update home data
  async updateHomeData(data: Partial<HomeData>): Promise<void> {
    // Validation
    if (data.email && !this.isValidEmail(data.email)) {
      throw new Error('Invalid email format')
    }
    
    if (data.socialLinks) {
      data.socialLinks.forEach(link => {
        if (!this.isValidUrl(link.url)) {
          throw new Error(`Invalid URL for ${link.platform}`)
        }
      })
    }
    
    await this.homeRepo.updateHomeData(data)
  }
  
  // Helper validation methods
  private isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }
  
  private isValidUrl(url: string): boolean {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }
}
```

---

### About Data Operations

```typescript
export class PortfolioService {
  async getAboutData(): Promise<AboutData> {
    return await this.aboutRepo.getAboutData()
  }
  
  async updateAboutData(data: Partial<AboutData>): Promise<void> {
    // Business logic: Validate highlights
    if (data.highlights && data.highlights.length > 10) {
      throw new Error('Maximum 10 highlights allowed')
    }
    
    await this.aboutRepo.updateAboutData(data)
  }
  
  // Get about data with aggregated stats
  async getAboutDataWithStats(): Promise<AboutData> {
    const aboutData = await this.aboutRepo.getAboutData()
    
    // Calculate stats from other entities
    const projects = await this.projectRepo.getAllProjects()
    const experiences = await this.experienceRepo.getAllExperiences()
    const certifications = await this.certificationRepo.getAllCertifications()
    
    // Add computed stats
    aboutData.stats = [
      { label: 'Projects', value: projects.length, icon: 'FolderGit2' },
      { label: 'Experience', value: `${this.calculateYearsOfExperience(experiences)}+`, icon: 'Briefcase' },
      { label: 'Certifications', value: certifications.length, icon: 'Award' }
    ]
    
    return aboutData
  }
  
  private calculateYearsOfExperience(experiences: Experience[]): number {
    if (experiences.length === 0) return 0
    
    const totalMs = experiences.reduce((total, exp) => {
      const start = new Date(exp.startDate).getTime()
      const end = exp.endDate ? new Date(exp.endDate).getTime() : Date.now()
      return total + (end - start)
    }, 0)
    
    return Math.floor(totalMs / (1000 * 60 * 60 * 24 * 365.25))
  }
}
```

---

### Project Operations

```typescript
export class PortfolioService {
  // Get all projects
  async getAllProjects(): Promise<Project[]> {
    const projects = await this.projectRepo.getAllProjects()
    return this.sortProjectsByDate(projects)
  }
  
  // Get featured projects
  async getFeaturedProjects(): Promise<Project[]> {
    const projects = await this.projectRepo.getFeaturedProjects()
    return this.sortProjectsByDate(projects)
  }
  
  // Get projects by category
  async getProjectsByCategory(category: string): Promise<Project[]> {
    return await this.projectRepo.getProjectsByCategory(category)
  }
  
  // Get projects by technology
  async getProjectsByTechnology(tech: string): Promise<Project[]> {
    return await this.projectRepo.getProjectsByTechnology(tech)
  }
  
  // Search projects
  async searchProjects(query: string): Promise<Project[]> {
    const allProjects = await this.projectRepo.getAllProjects()
    
    const lowercaseQuery = query.toLowerCase()
    
    return allProjects.filter(project => 
      project.title.toLowerCase().includes(lowercaseQuery) ||
      project.description.toLowerCase().includes(lowercaseQuery) ||
      project.technologies.some(tech => 
        tech.toLowerCase().includes(lowercaseQuery)
      )
    )
  }
  
  // Create project with validation
  async createProject(project: Omit<Project, 'id'>): Promise<string> {
    // Validation
    this.validateProject(project)
    
    // Business rule: Auto-generate slug
    const slug = this.generateSlug(project.title)
    
    // Business rule: Set creation date
    const projectWithDefaults = {
      ...project,
      startDate: project.startDate || new Date().toISOString(),
      status: project.status || 'in-progress'
    }
    
    return await this.projectRepo.createProject(projectWithDefaults)
  }
  
  // Update project
  async updateProject(id: string, updates: Partial<Project>): Promise<void> {
    // Get existing project
    const existing = await this.projectRepo.getProjectById(id)
    
    // Validate updates
    if (updates.title) {
      this.validateProjectTitle(updates.title)
    }
    
    if (updates.technologies) {
      this.validateTechnologies(updates.technologies)
    }
    
    // Business rule: Can't unfeatured if only featured project
    if (updates.featured === false && existing.featured) {
      const featuredProjects = await this.getFeaturedProjects()
      if (featuredProjects.length === 1) {
        throw new Error('Cannot unfeatured the only featured project')
      }
    }
    
    await this.projectRepo.updateProject(id, updates)
  }
  
  // Delete project
  async deleteProject(id: string): Promise<void> {
    // Business rule: Confirm project exists
    await this.projectRepo.getProjectById(id)
    await this.projectRepo.deleteProject(id)
  }
  
  // Helper methods
  private sortProjectsByDate(projects: Project[]): Project[] {
    return projects.sort((a, b) => {
      const dateA = new Date(a.startDate).getTime()
      const dateB = new Date(b.startDate).getTime()
      return dateB - dateA // Newest first
    })
  }
  
  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
  }
  
  private validateProject(project: Omit<Project, 'id'>): void {
    this.validateProjectTitle(project.title)
    this.validateTechnologies(project.technologies)
    
    if (project.featured && !project.coverImage) {
      throw new Error('Featured projects must have a cover image')
    }
  }
  
  private validateProjectTitle(title: string): void {
    if (title.length < 3) {
      throw new Error('Project title must be at least 3 characters')
    }
    if (title.length > 100) {
      throw new Error('Project title must not exceed 100 characters')
    }
  }
  
  private validateTechnologies(technologies: string[]): void {
    if (technologies.length === 0) {
      throw new Error('Project must have at least one technology')
    }
    if (technologies.length > 20) {
      throw new Error('Project cannot have more than 20 technologies')
    }
  }
}
```

---

### Experience Operations

```typescript
export class PortfolioService {
  // Get all experiences (sorted)
  async getAllExperiences(): Promise<Experience[]> {
    const experiences = await this.experienceRepo.getAllExperiences()
    return this.sortExperiencesByDate(experiences)
  }
  
  // Get current experience
  async getCurrentExperience(): Promise<Experience | null> {
    return await this.experienceRepo.getCurrentExperience()
  }
  
  // Create experience
  async createExperience(experience: Omit<Experience, 'id'>): Promise<string> {
    this.validateExperience(experience)
    
    // Business rule: If current, set other experiences to not current
    if (experience.current) {
      const currentExp = await this.getCurrentExperience()
      if (currentExp) {
        await this.experienceRepo.updateExperience(currentExp.id, { 
          current: false,
          endDate: new Date().toISOString()
        })
      }
    }
    
    return await this.experienceRepo.createExperience(experience)
  }
  
  // Update experience
  async updateExperience(id: string, updates: Partial<Experience>): Promise<void> {
    const existing = await this.experienceRepo.getExperienceById(id)
    
    // Validate current status
    if (updates.current !== undefined) {
      if (updates.current && updates.endDate) {
        throw new Error('Current experience cannot have an end date')
      }
      
      if (updates.current) {
        // Set other experiences to not current
        const currentExp = await this.getCurrentExperience()
        if (currentExp && currentExp.id !== id) {
          await this.experienceRepo.updateExperience(currentExp.id, { 
            current: false,
            endDate: new Date().toISOString()
          })
        }
      }
    }
    
    await this.experienceRepo.updateExperience(id, updates)
  }
  
  // Calculate total years of experience
  async getTotalYearsOfExperience(): Promise<number> {
    const experiences = await this.getAllExperiences()
    return this.calculateYearsOfExperience(experiences)
  }
  
  // Get experience timeline
  async getExperienceTimeline(): Promise<TimelineItem[]> {
    const experiences = await this.getAllExperiences()
    
    return experiences.map(exp => ({
      id: exp.id,
      title: exp.position,
      subtitle: exp.company,
      date: this.formatDateRange(exp.startDate, exp.endDate),
      description: exp.description,
      type: 'work' as const
    }))
  }
  
  private sortExperiencesByDate(experiences: Experience[]): Experience[] {
    return experiences.sort((a, b) => {
      // Current jobs first
      if (a.current && !b.current) return -1
      if (!a.current && b.current) return 1
      
      // Then by start date (newest first)
      const dateA = new Date(a.startDate).getTime()
      const dateB = new Date(b.startDate).getTime()
      return dateB - dateA
    })
  }
  
  private validateExperience(experience: Omit<Experience, 'id'>): void {
    if (experience.current && experience.endDate) {
      throw new Error('Current experience cannot have an end date')
    }
    
    if (!experience.current && !experience.endDate) {
      throw new Error('Past experience must have an end date')
    }
    
    if (experience.responsibilities.length === 0) {
      throw new Error('Experience must have at least one responsibility')
    }
  }
  
  private formatDateRange(startDate: string, endDate?: string): string {
    const start = new Date(startDate).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short' 
    })
    const end = endDate 
      ? new Date(endDate).toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'short' 
        })
      : 'Present'
    return `${start} - ${end}`
  }
}

interface TimelineItem {
  id: string
  title: string
  subtitle: string
  date: string
  description: string
  type: 'work' | 'education' | 'achievement'
}
```

---

### Skill Operations

```typescript
export class PortfolioService {
  // Get all skills grouped by section
  async getGroupedSkills(): Promise<SkillGroup[]> {
    const [skills, sections] = await Promise.all([
      this.skillRepo.getAllSkills(),
      this.skillRepo.getAllSkillSections()
    ])
    
    return sections
      .sort((a, b) => a.order - b.order)
      .map(section => ({
        section,
        skills: skills.filter(skill => 
          section.skills.includes(skill.id)
        ).sort((a, b) => b.proficiency - a.proficiency)
      }))
  }
  
  // Get skills by proficiency level
  async getSkillsByProficiency(minLevel: number): Promise<Skill[]> {
    const allSkills = await this.skillRepo.getAllSkills()
    return allSkills.filter(skill => skill.proficiency >= minLevel)
  }
  
  // Get expert skills (proficiency 4-5)
  async getExpertSkills(): Promise<Skill[]> {
    return await this.getSkillsByProficiency(4)
  }
  
  // Create skill and add to section
  async createSkill(
    skill: Omit<Skill, 'id'>,
    sectionId: string
  ): Promise<string> {
    // Validate proficiency
    if (skill.proficiency < 1 || skill.proficiency > 5) {
      throw new Error('Proficiency must be between 1 and 5')
    }
    
    const skillId = await this.skillRepo.createSkill(skill)
    
    // Add to section
    const section = await this.skillRepo.getSkillSectionById(sectionId)
    await this.skillRepo.updateSkillSection(sectionId, {
      skills: [...section.skills, skillId]
    })
    
    return skillId
  }
  
  // Update skill proficiency
  async updateSkillProficiency(
    id: string,
    proficiency: number
  ): Promise<void> {
    if (proficiency < 1 || proficiency > 5) {
      throw new Error('Proficiency must be between 1 and 5')
    }
    
    await this.skillRepo.updateSkill(id, { proficiency })
  }
}

interface SkillGroup {
  section: SkillSection
  skills: Skill[]
}
```

---

### Certification Operations

```typescript
export class PortfolioService {
  async getAllCertifications(): Promise<Certification[]> {
    const certs = await this.certificationRepo.getAllCertifications()
    return this.sortCertificationsByYear(certs)
  }
  
  async getFeaturedCertifications(): Promise<Certification[]> {
    return await this.certificationRepo.getFeaturedCertifications()
  }
  
  async createCertification(
    cert: Omit<Certification, 'id'>
  ): Promise<string> {
    // Validate year
    const currentYear = new Date().getFullYear()
    const certYear = parseInt(cert.year)
    
    if (certYear > currentYear) {
      throw new Error('Certification year cannot be in the future')
    }
    
    return await this.certificationRepo.createCertification(cert)
  }
  
  // Get certifications grouped by organization
  async getCertificationsByOrganization(): Promise<CertificationGroup[]> {
    const certs = await this.getAllCertifications()
    
    const grouped = certs.reduce((acc, cert) => {
      const org = cert.issuingOrganization
      if (!acc[org]) {
        acc[org] = []
      }
      acc[org].push(cert)
      return acc
    }, {} as Record<string, Certification[]>)
    
    return Object.entries(grouped).map(([organization, certifications]) => ({
      organization,
      certifications: this.sortCertificationsByYear(certifications),
      count: certifications.length
    }))
  }
  
  private sortCertificationsByYear(certs: Certification[]): Certification[] {
    return certs.sort((a, b) => parseInt(b.year) - parseInt(a.year))
  }
}

interface CertificationGroup {
  organization: string
  certifications: Certification[]
  count: number
}
```

---

### Contact Submission Operations

```typescript
export class PortfolioService {
  async getAllContactSubmissions(): Promise<ContactSubmission[]> {
    return await this.contactRepo.getAllSubmissions()
  }
  
  async getUnreadSubmissions(): Promise<ContactSubmission[]> {
    return await this.contactRepo.getUnreadSubmissions()
  }
  
  async createContactSubmission(
    submission: Omit<ContactSubmission, 'id' | 'timestamp'>
  ): Promise<string> {
    // Validate
    this.validateContactSubmission(submission)
    
    // Business rule: Set initial status
    const submissionWithDefaults = {
      ...submission,
      status: 'new' as const,
      read: false,
      replied: false
    }
    
    return await this.contactRepo.createSubmission(submissionWithDefaults)
  }
  
  async markSubmissionAsRead(id: string): Promise<void> {
    await this.contactRepo.markAsRead(id)
    await this.contactRepo.updateSubmission(id, { status: 'read' })
  }
  
  async markSubmissionAsReplied(id: string): Promise<void> {
    await this.contactRepo.markAsReplied(id)
    await this.contactRepo.updateSubmission(id, { status: 'replied' })
  }
  
  private validateContactSubmission(
    submission: Omit<ContactSubmission, 'id' | 'timestamp'>
  ): void {
    // Validate email
    if (!this.isValidEmail(submission.email)) {
      throw new Error('Invalid email format')
    }
    
    // Validate name
    if (submission.name.length < 2) {
      throw new Error('Name must be at least 2 characters')
    }
    
    // Validate message
    if (submission.message.length < 10) {
      throw new Error('Message must be at least 10 characters')
    }
    
    if (submission.message.length > 5000) {
      throw new Error('Message must not exceed 5000 characters')
    }
  }
}
```

---

## Business Logic Examples

### Complex Workflow: Complete Portfolio Statistics

```typescript
export class PortfolioService {
  async getCompletePortfolioStats(): Promise<PortfolioStats> {
    // Fetch all data in parallel
    const [
      projects,
      experiences,
      skills,
      certifications,
      education
    ] = await Promise.all([
      this.projectRepo.getAllProjects(),
      this.experienceRepo.getAllExperiences(),
      this.skillRepo.getAllSkills(),
      this.certificationRepo.getAllCertifications(),
      this.educationRepo.getAllEducation()
    ])
    
    // Calculate statistics
    return {
      projects: {
        total: projects.length,
        featured: projects.filter(p => p.featured).length,
        completed: projects.filter(p => p.status === 'completed').length,
        technologies: this.getUniqueTechnologies(projects)
      },
      experience: {
        total: experiences.length,
        years: this.calculateYearsOfExperience(experiences),
        current: experiences.filter(e => e.current).length,
        companies: new Set(experiences.map(e => e.company)).size
      },
      skills: {
        total: skills.length,
        expert: skills.filter(s => s.proficiency >= 4).length,
        categories: new Set(skills.map(s => s.category)).size
      },
      certifications: {
        total: certifications.length,
        featured: certifications.filter(c => c.featured).length,
        organizations: new Set(certifications.map(c => c.issuingOrganization)).size
      },
      education: {
        total: education.length,
        degrees: education.map(e => e.degree)
      }
    }
  }
  
  private getUniqueTechnologies(projects: Project[]): string[] {
    const techSet = new Set<string>()
    projects.forEach(project => {
      project.technologies.forEach(tech => techSet.add(tech))
    })
    return Array.from(techSet).sort()
  }
}

interface PortfolioStats {
  projects: {
    total: number
    featured: number
    completed: number
    technologies: string[]
  }
  experience: {
    total: number
    years: number
    current: number
    companies: number
  }
  skills: {
    total: number
    expert: number
    categories: number
  }
  certifications: {
    total: number
    featured: number
    organizations: number
  }
  education: {
    total: number
    degrees: string[]
  }
}
```

---

## Error Handling

### Custom Error Classes

```typescript
export class ValidationError extends Error {
  constructor(message: string, public field?: string) {
    super(message)
    this.name = 'ValidationError'
  }
}

export class NotFoundError extends Error {
  constructor(entity: string, id: string) {
    super(`${entity} with id ${id} not found`)
    this.name = 'NotFoundError'
  }
}

export class BusinessRuleError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'BusinessRuleError'
  }
}

// Usage in service
async updateProject(id: string, updates: Partial<Project>): Promise<void> {
  try {
    const existing = await this.projectRepo.getProjectById(id)
    
    if (!existing) {
      throw new NotFoundError('Project', id)
    }
    
    if (updates.title && updates.title.length < 3) {
      throw new ValidationError('Title too short', 'title')
    }
    
    await this.projectRepo.updateProject(id, updates)
  } catch (error) {
    if (error instanceof ValidationError) {
      // Handle validation error
      console.error(`Validation failed on field: ${error.field}`)
    }
    throw error
  }
}
```

---

## Best Practices

### 1. Single Responsibility

```typescript
// ❌ BAD: Service doing too much
async createProjectWithNotification(project: Omit<Project, 'id'>): Promise<string> {
  const id = await this.projectRepo.createProject(project)
  await this.sendEmail('admin@example.com', 'New project created')
  await this.logActivity('project_created', id)
  return id
}

// ✅ GOOD: Separate concerns
async createProject(project: Omit<Project, 'id'>): Promise<string> {
  return await this.projectRepo.createProject(project)
}

// Notifications and logging handled elsewhere (events, middleware)
```

### 2. Dependency Injection

```typescript
// ✅ GOOD: Dependencies injected
export class PortfolioService {
  constructor(
    private projectRepo: IProjectRepository,
    private experienceRepo: IExperienceRepository
  ) {}
}

// Easy to test with mocks
const mockProjectRepo: IProjectRepository = {
  getAllProjects: jest.fn().mockResolvedValue([])
}
const service = new PortfolioService(mockProjectRepo, ...)
```

### 3. Async/Await with Proper Error Handling

```typescript
async getProjectById(id: string): Promise<Project> {
  try {
    return await this.projectRepo.getProjectById(id)
  } catch (error) {
    console.error(`Failed to fetch project ${id}:`, error)
    throw new Error('Failed to fetch project')
  }
}
```

---

**Next**: [07-INFRASTRUCTURE-LAYER.md](./07-INFRASTRUCTURE-LAYER.md) - Firebase implementation
