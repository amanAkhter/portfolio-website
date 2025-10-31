# 🎨 Component Examples & Patterns

Quick reference for creating new components following the project patterns.

## 📁 File Organization

```
src/presentation/components/
├── ui/              # Reusable atomic components
├── sections/        # Page sections (Home, About, etc.)
└── admin/           # Admin-specific components
```

## 🧩 Component Patterns

### 1. Basic UI Component

```typescript
// src/presentation/components/ui/MyComponent.tsx
import React from 'react'
import { cn } from '../../../shared/utils/helpers'

interface MyComponentProps {
  className?: string
  variant?: 'default' | 'primary' | 'secondary'
  children: React.ReactNode
}

export const MyComponent: React.FC<MyComponentProps> = ({
  className,
  variant = 'default',
  children,
}) => {
  return (
    <div className={cn('base-classes', className)}>
      {children}
    </div>
  )
}
```

### 2. Section Component with Data

```typescript
// src/presentation/components/sections/MySection.tsx
import React, { useEffect, useState } from 'react'
import { portfolioService } from '../../../core/usecases'
import { ScrollReveal, FadeIn } from '../ui/Animations'
import { Card, CardContent } from '../ui'
import type { MyData } from '../../../shared/types'

interface MySectionProps {
  // Optional props if passed from parent
}

export const MySection: React.FC<MySectionProps> = () => {
  const [data, setData] = useState<MyData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await portfolioService.getMyData()
        setData(result)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) return <div>Loading...</div>

  return (
    <section id="mysection" className="py-20 bg-tokyo-bg">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <h2 className="text-4xl font-bold text-center text-tokyo-fg mb-12">
            My Section
          </h2>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.map((item, index) => (
            <ScrollReveal key={item.id || index} delay={index * 0.1}>
              <Card className="hover:border-tokyo-blue transition-all">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-tokyo-fg mb-2">
                    {item.title}
                  </h3>
                  <p className="text-tokyo-fg-dark">{item.description}</p>
                </CardContent>
              </Card>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
```

### 3. Admin Form Component

```typescript
// src/presentation/components/admin/MyForm.tsx
import React, { useState } from 'react'
import { portfolioService } from '../../../core/usecases'
import { Button, Input, Textarea, Card, CardContent } from '../ui'
import type { MyData } from '../../../shared/types'

interface MyFormProps {
  initialData?: MyData
  onSuccess?: () => void
  onCancel?: () => void
}

export const MyForm: React.FC<MyFormProps> = ({
  initialData,
  onSuccess,
  onCancel,
}) => {
  const [formData, setFormData] = useState<Partial<MyData>>(
    initialData || {}
  )
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (initialData?.id) {
        await portfolioService.updateMyData(initialData.id, formData)
      } else {
        await portfolioService.createMyData(formData as MyData)
      }
      onSuccess?.()
    } catch (err) {
      setError('Failed to save data')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-tokyo-fg mb-2">
              Title
            </label>
            <Input
              value={formData.title || ''}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-tokyo-fg mb-2">
              Description
            </label>
            <Textarea
              value={formData.description || ''}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={4}
              required
            />
          </div>

          {error && (
            <div className="bg-tokyo-red/10 border border-tokyo-red text-tokyo-red px-4 py-2 rounded-md text-sm">
              {error}
            </div>
          )}

          <div className="flex gap-4">
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Save'}
            </Button>
            {onCancel && (
              <Button type="button" variant="ghost" onClick={onCancel}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
```

### 4. Card Component with Modal

```typescript
// src/presentation/components/sections/MyCard.tsx
import React, { useState } from 'react'
import { Card, CardContent, Badge } from '../ui'
import {
  Modal,
  ModalHeader,
  ModalTitle,
  ModalBody,
  ModalFooter,
} from '../ui/Modal'
import { ScaleOnHover } from '../ui/Animations'
import type { MyData } from '../../../shared/types'

interface MyCardProps {
  data: MyData
}

export const MyCard: React.FC<MyCardProps> = ({ data }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <ScaleOnHover>
        <Card
          className="cursor-pointer hover:border-tokyo-blue transition-all"
          onClick={() => setIsModalOpen(true)}
        >
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold text-tokyo-fg mb-2">
              {data.title}
            </h3>
            <p className="text-tokyo-fg-dark mb-4">{data.description}</p>
            
            <div className="flex flex-wrap gap-2">
              {data.tags?.slice(0, 3).map((tag, i) => (
                <Badge key={i}>{tag}</Badge>
              ))}
              {data.tags && data.tags.length > 3 && (
                <Badge variant="secondary">+{data.tags.length - 3}</Badge>
              )}
            </div>
          </CardContent>
        </Card>
      </ScaleOnHover>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        size="lg"
      >
        <ModalHeader>
          <ModalTitle>{data.title}</ModalTitle>
        </ModalHeader>
        <ModalBody>
          <p className="text-tokyo-fg-dark mb-4">{data.description}</p>
          
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-tokyo-fg mb-2">Tags</h4>
              <div className="flex flex-wrap gap-2">
                {data.tags?.map((tag, i) => (
                  <Badge key={i}>{tag}</Badge>
                ))}
              </div>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button onClick={() => setIsModalOpen(false)}>Close</Button>
        </ModalFooter>
      </Modal>
    </>
  )
}
```

### 5. List with Load More

```typescript
// src/presentation/components/sections/MyList.tsx
import React, { useState, useEffect } from 'react'
import { portfolioService } from '../../../core/usecases'
import { Button, Spinner } from '../ui'
import { ScrollReveal } from '../ui/Animations'
import { MyCard } from './MyCard'
import type { MyData } from '../../../shared/types'

const ITEMS_PER_PAGE = 6

export const MyList: React.FC = () => {
  const [items, setItems] = useState<MyData[]>([])
  const [displayCount, setDisplayCount] = useState(ITEMS_PER_PAGE)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const data = await portfolioService.getAllMyData()
      setItems(data)
      setLoading(false)
    }
    fetchData()
  }, [])

  const displayedItems = items.slice(0, displayCount)
  const hasMore = displayCount < items.length

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayedItems.map((item, index) => (
          <ScrollReveal key={item.id} delay={index * 0.1}>
            <MyCard data={item} />
          </ScrollReveal>
        ))}
      </div>

      {hasMore && (
        <div className="flex justify-center">
          <Button
            onClick={() => setDisplayCount((prev) => prev + ITEMS_PER_PAGE)}
            variant="outline"
          >
            Load More
          </Button>
        </div>
      )}
    </div>
  )
}
```

## 🎨 Animation Patterns

### Fade In on Load
```typescript
<FadeIn delay={0.2}>
  <div>Your content</div>
</FadeIn>
```

### Scroll Reveal
```typescript
<ScrollReveal delay={0.1}>
  <div>Reveals when scrolled into view</div>
</ScrollReveal>
```

### Slide In
```typescript
<SlideIn direction="left" delay={0.3}>
  <div>Slides in from left</div>
</SlideIn>
```

### Scale on Hover
```typescript
<ScaleOnHover scale={1.05}>
  <div>Scales up on hover</div>
</ScaleOnHover>
```

### Glow Effect
```typescript
<GlowOnHover glowColor="rgba(122, 162, 247, 0.5)">
  <Button>Glowing button</Button>
</GlowOnHover>
```

### Stagger Children
```typescript
<StaggerChildren staggerDelay={0.1}>
  <div>Child 1</div>
  <div>Child 2</div>
  <div>Child 3</div>
</StaggerChildren>
```

## 🎯 Common Patterns

### Loading State
```typescript
{loading ? (
  <div className="flex justify-center py-12">
    <Spinner size="lg" />
  </div>
) : (
  // Your content
)}
```

### Error State
```typescript
{error && (
  <div className="bg-tokyo-red/10 border border-tokyo-red text-tokyo-red px-4 py-2 rounded-md">
    {error}
  </div>
)}
```

### Empty State
```typescript
{items.length === 0 && (
  <div className="text-center py-12 text-tokyo-comment">
    <p>No items found</p>
  </div>
)}
```

### Responsive Grid
```typescript
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
  {/* Items */}
</div>
```

## 🔧 Service Usage

### Fetch Data
```typescript
const data = await portfolioService.getAllMyData()
```

### Create
```typescript
const newItem = await portfolioService.createMyData(formData)
```

### Update
```typescript
const updated = await portfolioService.updateMyData(id, changes)
```

### Delete
```typescript
await portfolioService.deleteMyData(id)
```

## 📝 TypeScript Patterns

### Props Interface
```typescript
interface MyComponentProps {
  required: string
  optional?: number
  withDefault?: boolean
  children?: React.ReactNode
  onClick?: () => void
}
```

### State with Type
```typescript
const [data, setData] = useState<MyData[]>([])
const [loading, setLoading] = useState<boolean>(false)
```

### Event Handlers
```typescript
const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
  // Handle click
}

const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  setValue(e.target.value)
}

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  // Handle submit
}
```

## 🎨 Styling Patterns

### Responsive Classes
```typescript
className="text-sm md:text-base lg:text-lg"
className="p-4 md:p-6 lg:p-8"
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
```

### Hover Effects
```typescript
className="hover:bg-tokyo-blue hover:text-white transition-all duration-300"
```

### Conditional Classes
```typescript
className={cn(
  'base-classes',
  isActive && 'active-classes',
  variant === 'primary' && 'primary-classes',
  className
)}
```

## 🚀 Quick Reference

### Import Statements
```typescript
// UI Components
import { Button, Input, Card } from '../ui'

// Animations
import { FadeIn, ScrollReveal } from '../ui/Animations'

// Services
import { portfolioService } from '../../../core/usecases'

// Types
import type { MyData } from '../../../shared/types'

// Utils
import { cn } from '../../../shared/utils/helpers'
```

### Export Patterns
```typescript
// Named export (preferred)
export const MyComponent: React.FC<Props> = () => {}

// Default export (for pages)
export default MyPage
```

---

**Follow these patterns for consistent, maintainable code!** 🎉
