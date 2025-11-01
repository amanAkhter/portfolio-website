# Admin Panel Documentation

## 📖 Table of Contents
1. [Overview](#overview)
2. [Admin Page Structure](#admin-page-structure)
3. [Manager Components](#manager-components)
4. [CRUD Operations](#crud-operations)
5. [Form Patterns](#form-patterns)
6. [Data Tables](#data-tables)
7. [Best Practices](#best-practices)

---

## Overview

The Admin Panel provides a complete interface for managing all portfolio content. Each section has dedicated manager components for Create, Read, Update, and Delete operations.

### Admin Features
- ✅ Content management for all sections
- ✅ Real-time data updates
- ✅ Form validation
- ✅ Responsive design
- ✅ Confirmation dialogs
- ✅ Error handling
- ✅ Success notifications

---

## Admin Page Structure

**File**: `src/presentation/pages/AdminPage.tsx`

```typescript
import { useState } from 'react'
import { useAuth } from '../hooks'
import { Button } from '../components/ui'
import {
  HomeManager,
  AboutManager,
  ExperienceManager,
  ProjectManager,
  SkillManager,
  CertificationManager,
  EducationManager,
  ContactSubmissionsManager
} from '../components/admin'

type Tab = 'home' | 'about' | 'experience' | 'projects' | 'skills' | 
           'certifications' | 'education' | 'contact'

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<Tab>('home')
  const { user, logout } = useAuth()
  
  const tabs: { id: Tab; label: string }[] = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'experience', label: 'Experience' },
    { id: 'projects', label: 'Projects' },
    { id: 'skills', label: 'Skills' },
    { id: 'certifications', label: 'Certifications' },
    { id: 'education', label: 'Education' },
    { id: 'contact', label: 'Contact Submissions' }
  ]
  
  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <HomeManager />
      case 'about':
        return <AboutManager />
      case 'experience':
        return <ExperienceManager />
      case 'projects':
        return <ProjectManager />
      case 'skills':
        return <SkillManager />
      case 'certifications':
        return <CertificationManager />
      case 'education':
        return <EducationManager />
      case 'contact':
        return <ContactSubmissionsManager />
      default:
        return <HomeManager />
    }
  }
  
  return (
    <div className="min-h-screen bg-tokyo-bg">
      {/* Header */}
      <header className="bg-tokyo-night border-b border-tokyo-comment sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-tokyo-cyan">
              Admin Panel
            </h1>
            
            <div className="flex items-center gap-4">
              <span className="text-sm text-tokyo-comment">
                {user?.email}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={logout}
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>
      
      {/* Tabs */}
      <div className="border-b border-tokyo-comment bg-tokyo-night sticky top-[73px] z-30">
        <div className="container mx-auto px-4">
          <div className="flex gap-1 overflow-x-auto">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  px-4 py-3 text-sm font-medium transition-colors whitespace-nowrap
                  ${activeTab === tab.id
                    ? 'text-tokyo-cyan border-b-2 border-tokyo-cyan'
                    : 'text-tokyo-fg hover:text-tokyo-cyan'
                  }
                `}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Content */}
      <main className="container mx-auto px-4 py-8">
        {renderContent()}
      </main>
    </div>
  )
}
```

---

## Manager Components

### Project Manager Example

**File**: `src/presentation/components/admin/ProjectManager.tsx`

```typescript
import { useEffect, useState } from 'react'
import { Plus, Edit, Trash2, Eye } from 'lucide-react'
import { usePortfolio } from '../../hooks'
import { Button, Card, Modal, Loading, Badge } from '../ui'
import type { Project } from '../../../core/domain'

export default function ProjectManager() {
  const { portfolioService } = usePortfolio()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null)
  
  useEffect(() => {
    loadProjects()
  }, [])
  
  const loadProjects = async () => {
    try {
      setLoading(true)
      const data = await portfolioService.getAllProjects()
      setProjects(data)
    } catch (error) {
      console.error('Error loading projects:', error)
    } finally {
      setLoading(false)
    }
  }
  
  const handleCreate = () => {
    setEditingProject(null)
    setIsModalOpen(true)
  }
  
  const handleEdit = (project: Project) => {
    setEditingProject(project)
    setIsModalOpen(true)
  }
  
  const handleDelete = async () => {
    if (!projectToDelete) return
    
    try {
      await portfolioService.deleteProject(projectToDelete)
      await loadProjects()
      setIsDeleteModalOpen(false)
      setProjectToDelete(null)
    } catch (error) {
      console.error('Error deleting project:', error)
    }
  }
  
  const handleSave = async (project: Omit<Project, 'id'>) => {
    try {
      if (editingProject) {
        await portfolioService.updateProject(editingProject.id, project)
      } else {
        await portfolioService.createProject(project)
      }
      await loadProjects()
      setIsModalOpen(false)
    } catch (error) {
      console.error('Error saving project:', error)
    }
  }
  
  if (loading) return <Loading />
  
  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-tokyo-fg">Projects</h2>
        <Button icon={Plus} onClick={handleCreate}>
          Add Project
        </Button>
      </div>
      
      {/* Projects List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map(project => (
          <Card key={project.id} className="p-6">
            {/* Cover Image */}
            {project.coverImage && (
              <img
                src={project.coverImage}
                alt={project.title}
                className="w-full h-40 object-cover rounded-lg mb-4"
              />
            )}
            
            {/* Title */}
            <h3 className="text-xl font-bold text-tokyo-fg mb-2">
              {project.title}
            </h3>
            
            {/* Description */}
            <p className="text-tokyo-comment text-sm mb-4 line-clamp-2">
              {project.description}
            </p>
            
            {/* Badges */}
            <div className="flex flex-wrap gap-2 mb-4">
              {project.featured && (
                <Badge variant="primary">Featured</Badge>
              )}
              <Badge variant="secondary">{project.status}</Badge>
              <Badge>{project.category}</Badge>
            </div>
            
            {/* Technologies */}
            <div className="flex flex-wrap gap-2 mb-4">
              {project.technologies.slice(0, 3).map(tech => (
                <Badge key={tech} size="sm" variant="secondary">
                  {tech}
                </Badge>
              ))}
              {project.technologies.length > 3 && (
                <Badge size="sm" variant="secondary">
                  +{project.technologies.length - 3}
                </Badge>
              )}
            </div>
            
            {/* Actions */}
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                icon={Edit}
                onClick={() => handleEdit(project)}
              >
                Edit
              </Button>
              <Button
                size="sm"
                variant="outline"
                icon={Trash2}
                onClick={() => {
                  setProjectToDelete(project.id)
                  setIsDeleteModalOpen(true)
                }}
              >
                Delete
              </Button>
            </div>
          </Card>
        ))}
      </div>
      
      {/* Edit/Create Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProject ? 'Edit Project' : 'Create Project'}
        size="lg"
      >
        <ProjectForm
          project={editingProject}
          onSave={handleSave}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
      
      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Project"
      >
        <div className="space-y-4">
          <p className="text-tokyo-comment">
            Are you sure you want to delete this project? This action cannot be undone.
          </p>
          <div className="flex gap-2 justify-end">
            <Button
              variant="outline"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="secondary"
              onClick={handleDelete}
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
```

---

## CRUD Operations

### Create Operation

```typescript
const handleCreate = async (data: Omit<Entity, 'id'>) => {
  try {
    setLoading(true)
    const id = await portfolioService.createEntity(data)
    
    // Optimistic update
    const newEntity = { ...data, id }
    setEntities([...entities, newEntity])
    
    // Show success message
    showSuccess('Entity created successfully')
    
    // Close modal
    setIsModalOpen(false)
  } catch (error) {
    showError('Failed to create entity')
    console.error('Create error:', error)
  } finally {
    setLoading(false)
  }
}
```

### Read Operation

```typescript
const loadEntities = async () => {
  try {
    setLoading(true)
    setError(null)
    const data = await portfolioService.getAllEntities()
    setEntities(data)
  } catch (error) {
    setError('Failed to load data')
    console.error('Load error:', error)
  } finally {
    setLoading(false)
  }
}
```

### Update Operation

```typescript
const handleUpdate = async (id: string, updates: Partial<Entity>) => {
  try {
    setLoading(true)
    await portfolioService.updateEntity(id, updates)
    
    // Optimistic update
    setEntities(entities.map(e => 
      e.id === id ? { ...e, ...updates } : e
    ))
    
    showSuccess('Entity updated successfully')
    setIsModalOpen(false)
  } catch (error) {
    showError('Failed to update entity')
    console.error('Update error:', error)
  } finally {
    setLoading(false)
  }
}
```

### Delete Operation

```typescript
const handleDelete = async (id: string) => {
  try {
    setLoading(true)
    await portfolioService.deleteEntity(id)
    
    // Optimistic update
    setEntities(entities.filter(e => e.id !== id))
    
    showSuccess('Entity deleted successfully')
    setIsDeleteModalOpen(false)
  } catch (error) {
    showError('Failed to delete entity')
    console.error('Delete error:', error)
  } finally {
    setLoading(false)
  }
}
```

---

## Form Patterns

### Project Form Component

```typescript
interface ProjectFormProps {
  project?: Project | null
  onSave: (project: Omit<Project, 'id'>) => Promise<void>
  onCancel: () => void
}

function ProjectForm({ project, onSave, onCancel }: ProjectFormProps) {
  const [formData, setFormData] = useState<Omit<Project, 'id'>>({
    title: project?.title || '',
    description: project?.description || '',
    longDescription: project?.longDescription || '',
    technologies: project?.technologies || [],
    category: project?.category || '',
    featured: project?.featured || false,
    coverImage: project?.coverImage || '',
    images: project?.images || [],
    demoUrl: project?.demoUrl || '',
    githubUrl: project?.githubUrl || '',
    startDate: project?.startDate || '',
    endDate: project?.endDate,
    status: project?.status || 'in-progress',
    highlights: project?.highlights || []
  })
  
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  
  const handleChange = (field: keyof typeof formData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }
  
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.title) {
      newErrors.title = 'Title is required'
    } else if (formData.title.length < 3) {
      newErrors.title = 'Title must be at least 3 characters'
    }
    
    if (!formData.description) {
      newErrors.description = 'Description is required'
    }
    
    if (formData.technologies.length === 0) {
      newErrors.technologies = 'At least one technology is required'
    }
    
    if (!formData.category) {
      newErrors.category = 'Category is required'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validate()) return
    
    try {
      setLoading(true)
      await onSave(formData)
    } catch (error) {
      console.error('Save error:', error)
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title */}
      <Input
        label="Title"
        value={formData.title}
        onChange={(e) => handleChange('title', e.target.value)}
        error={errors.title}
        required
      />
      
      {/* Description */}
      <Textarea
        label="Short Description"
        value={formData.description}
        onChange={(e) => handleChange('description', e.target.value)}
        error={errors.description}
        rows={3}
        required
      />
      
      {/* Long Description */}
      <Textarea
        label="Detailed Description"
        value={formData.longDescription}
        onChange={(e) => handleChange('longDescription', e.target.value)}
        rows={6}
      />
      
      {/* Category */}
      <div>
        <label className="block text-sm font-medium text-tokyo-fg mb-2">
          Category
        </label>
        <select
          value={formData.category}
          onChange={(e) => handleChange('category', e.target.value)}
          className="w-full px-4 py-2 bg-tokyo-bg border border-tokyo-comment rounded-lg text-tokyo-fg focus:outline-none focus:ring-2 focus:ring-tokyo-cyan"
        >
          <option value="">Select category</option>
          <option value="Web Development">Web Development</option>
          <option value="Mobile App">Mobile App</option>
          <option value="Desktop App">Desktop App</option>
          <option value="API">API</option>
          <option value="Other">Other</option>
        </select>
        {errors.category && (
          <p className="mt-1 text-sm text-tokyo-red">{errors.category}</p>
        )}
      </div>
      
      {/* Featured Checkbox */}
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={formData.featured}
          onChange={(e) => handleChange('featured', e.target.checked)}
          className="w-4 h-4"
        />
        <span className="text-sm text-tokyo-fg">Featured Project</span>
      </label>
      
      {/* Actions */}
      <div className="flex gap-2 justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Save'}
        </Button>
      </div>
    </form>
  )
}
```

---

## Data Tables

### Table Component for Lists

```typescript
interface Column<T> {
  header: string
  accessor: keyof T | ((item: T) => React.ReactNode)
  width?: string
}

interface DataTableProps<T> {
  data: T[]
  columns: Column<T>[]
  onEdit?: (item: T) => void
  onDelete?: (item: T) => void
}

function DataTable<T extends { id: string }>({ 
  data, 
  columns, 
  onEdit, 
  onDelete 
}: DataTableProps<T>) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-tokyo-night border-b border-tokyo-comment">
          <tr>
            {columns.map((col, index) => (
              <th
                key={index}
                className="px-4 py-3 text-left text-sm font-medium text-tokyo-fg"
                style={{ width: col.width }}
              >
                {col.header}
              </th>
            ))}
            {(onEdit || onDelete) && (
              <th className="px-4 py-3 text-right text-sm font-medium text-tokyo-fg">
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {data.map(item => (
            <tr
              key={item.id}
              className="border-b border-tokyo-comment hover:bg-tokyo-selection"
            >
              {columns.map((col, index) => (
                <td key={index} className="px-4 py-3 text-sm text-tokyo-comment">
                  {typeof col.accessor === 'function'
                    ? col.accessor(item)
                    : String(item[col.accessor])
                  }
                </td>
              ))}
              {(onEdit || onDelete) && (
                <td className="px-4 py-3 text-right">
                  <div className="flex gap-2 justify-end">
                    {onEdit && (
                      <Button
                        size="sm"
                        variant="ghost"
                        icon={Edit}
                        onClick={() => onEdit(item)}
                      >
                        Edit
                      </Button>
                    )}
                    {onDelete && (
                      <Button
                        size="sm"
                        variant="ghost"
                        icon={Trash2}
                        onClick={() => onDelete(item)}
                      >
                        Delete
                      </Button>
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
```

---

## Best Practices

### 1. Confirmation Before Delete

Always confirm destructive actions:

```typescript
const handleDeleteClick = (item: Entity) => {
  setItemToDelete(item)
  setIsDeleteModalOpen(true)
}

// In Modal
<Modal isOpen={isDeleteModalOpen}>
  <p>Are you sure you want to delete "{itemToDelete?.name}"?</p>
  <Button onClick={confirmDelete}>Delete</Button>
</Modal>
```

### 2. Optimistic Updates

Update UI immediately for better UX:

```typescript
const handleUpdate = async (id: string, updates: Partial<Entity>) => {
  // Update UI optimistically
  setEntities(entities.map(e => e.id === id ? { ...e, ...updates } : e))
  
  try {
    await portfolioService.updateEntity(id, updates)
  } catch (error) {
    // Rollback on error
    await loadEntities()
  }
}
```

### 3. Form Validation

Validate before submission:

```typescript
const validate = () => {
  const errors = {}
  
  if (!formData.field) {
    errors.field = 'Field is required'
  }
  
  setErrors(errors)
  return Object.keys(errors).length === 0
}
```

---

**Next**: [18-ANIMATIONS.md](./18-ANIMATIONS.md) - Animation implementation guide
