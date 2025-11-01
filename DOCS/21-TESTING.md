# Testing Documentation

## 📖 Table of Contents
1. [Overview](#overview)
2. [Unit Testing](#unit-testing)
3. [Component Testing](#component-testing)
4. [Integration Testing](#integration-testing)
5. [E2E Testing](#e2e-testing)
6. [Testing Best Practices](#testing-best-practices)

---

## Overview

Comprehensive testing ensures code quality, prevents regressions, and provides confidence when refactoring.

### Testing Stack
- **Vitest**: Fast unit test framework
- **React Testing Library**: Component testing
- **Testing Library User Event**: User interaction simulation
- **MSW**: API mocking
- **Playwright**: E2E testing

---

## Unit Testing

### Setup

```bash
pnpm add -D vitest @vitest/ui jsdom
pnpm add -D @testing-library/react @testing-library/jest-dom
pnpm add -D @testing-library/user-event
```

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    css: true
  }
})
```

```typescript
// src/test/setup.ts
import '@testing-library/jest-dom'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

afterEach(() => {
  cleanup()
})
```

### Testing Utilities

```typescript
// tests/utils/helpers.test.ts
import { describe, it, expect } from 'vitest'
import { formatDate, truncateText } from '../../src/shared/utils/helpers'

describe('formatDate', () => {
  it('formats date correctly', () => {
    const date = '2024-01-15'
    expect(formatDate(date)).toBe('Jan 15, 2024')
  })
  
  it('handles invalid date', () => {
    expect(formatDate('invalid')).toBe('Invalid Date')
  })
})

describe('truncateText', () => {
  it('truncates long text', () => {
    const text = 'This is a very long text that should be truncated'
    expect(truncateText(text, 20)).toBe('This is a very long...')
  })
  
  it('does not truncate short text', () => {
    const text = 'Short text'
    expect(truncateText(text, 20)).toBe('Short text')
  })
})
```

### Testing Domain Entities

```typescript
// tests/domain/entities/Project.test.ts
import { describe, it, expect } from 'vitest'
import type { Project } from '../../../src/core/domain'

describe('Project Entity', () => {
  const mockProject: Project = {
    id: '1',
    title: 'Test Project',
    description: 'Test description',
    longDescription: 'Long description',
    technologies: ['React', 'TypeScript'],
    category: 'Web Development',
    featured: true,
    coverImage: '/image.jpg',
    images: [],
    demoUrl: 'https://demo.com',
    githubUrl: 'https://github.com',
    startDate: '2024-01-01',
    status: 'completed',
    highlights: []
  }
  
  it('has required properties', () => {
    expect(mockProject).toHaveProperty('id')
    expect(mockProject).toHaveProperty('title')
    expect(mockProject).toHaveProperty('technologies')
  })
  
  it('validates featured status', () => {
    expect(mockProject.featured).toBe(true)
  })
  
  it('has valid status', () => {
    expect(['in-progress', 'completed', 'archived']).toContain(mockProject.status)
  })
})
```

---

## Component Testing

### Button Component

```typescript
// tests/components/Button.test.tsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Button from '../../src/presentation/components/ui/Button'

describe('Button Component', () => {
  it('renders with text', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })
  
  it('handles click events', async () => {
    const handleClick = vi.fn()
    const user = userEvent.setup()
    
    render(<Button onClick={handleClick}>Click me</Button>)
    
    await user.click(screen.getByText('Click me'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })
  
  it('can be disabled', () => {
    render(<Button disabled>Click me</Button>)
    expect(screen.getByText('Click me')).toBeDisabled()
  })
  
  it('applies variant classes', () => {
    render(<Button variant="outline">Click me</Button>)
    const button = screen.getByText('Click me')
    expect(button).toHaveClass('border')
  })
  
  it('renders with icon', () => {
    const Icon = () => <svg data-testid="icon" />
    render(<Button icon={Icon}>Click me</Button>)
    expect(screen.getByTestId('icon')).toBeInTheDocument()
  })
})
```

### Card Component

```typescript
// tests/components/Card.test.tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Card from '../../src/presentation/components/ui/Card'

describe('Card Component', () => {
  it('renders children', () => {
    render(
      <Card>
        <h1>Card Title</h1>
        <p>Card content</p>
      </Card>
    )
    
    expect(screen.getByText('Card Title')).toBeInTheDocument()
    expect(screen.getByText('Card content')).toBeInTheDocument()
  })
  
  it('applies custom className', () => {
    const { container } = render(
      <Card className="custom-class">Content</Card>
    )
    
    expect(container.firstChild).toHaveClass('custom-class')
  })
  
  it('has default styles', () => {
    const { container } = render(<Card>Content</Card>)
    const card = container.firstChild as HTMLElement
    
    expect(card).toHaveClass('bg-tokyo-night')
    expect(card).toHaveClass('rounded-lg')
  })
})
```

### Form Component

```typescript
// tests/components/ContactForm.test.tsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ContactForm from '../../src/presentation/components/sections/Contact'

describe('ContactForm', () => {
  it('renders all form fields', () => {
    render(<ContactForm />)
    
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/message/i)).toBeInTheDocument()
  })
  
  it('validates required fields', async () => {
    const user = userEvent.setup()
    render(<ContactForm />)
    
    const submitButton = screen.getByRole('button', { name: /send/i })
    await user.click(submitButton)
    
    expect(screen.getByText(/name is required/i)).toBeInTheDocument()
  })
  
  it('submits form with valid data', async () => {
    const user = userEvent.setup()
    const handleSubmit = vi.fn()
    
    render(<ContactForm onSubmit={handleSubmit} />)
    
    await user.type(screen.getByLabelText(/name/i), 'John Doe')
    await user.type(screen.getByLabelText(/email/i), 'john@example.com')
    await user.type(screen.getByLabelText(/message/i), 'Hello world')
    
    await user.click(screen.getByRole('button', { name: /send/i }))
    
    expect(handleSubmit).toHaveBeenCalledWith({
      name: 'John Doe',
      email: 'john@example.com',
      message: 'Hello world'
    })
  })
})
```

---

## Integration Testing

### Testing with Mock Data

```typescript
// tests/integration/ProjectList.test.tsx
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import Projects from '../../src/presentation/components/sections/Projects'
import type { Project } from '../../src/core/domain'

const mockProjects: Project[] = [
  {
    id: '1',
    title: 'Project 1',
    description: 'Description 1',
    technologies: ['React', 'TypeScript'],
    // ... other properties
  },
  {
    id: '2',
    title: 'Project 2',
    description: 'Description 2',
    technologies: ['Vue', 'JavaScript'],
    // ... other properties
  }
]

// Mock the portfolioService
vi.mock('../../src/core/usecases/services', () => ({
  portfolioService: {
    getAllProjects: vi.fn(() => Promise.resolve(mockProjects))
  }
}))

describe('Projects Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })
  
  it('loads and displays projects', async () => {
    render(<Projects />)
    
    // Should show loading initially
    expect(screen.getByText(/loading/i)).toBeInTheDocument()
    
    // Wait for projects to load
    await waitFor(() => {
      expect(screen.getByText('Project 1')).toBeInTheDocument()
    })
    
    expect(screen.getByText('Project 2')).toBeInTheDocument()
  })
  
  it('displays project details', async () => {
    render(<Projects />)
    
    await waitFor(() => {
      expect(screen.getByText('Project 1')).toBeInTheDocument()
    })
    
    expect(screen.getByText('Description 1')).toBeInTheDocument()
    expect(screen.getByText('React')).toBeInTheDocument()
    expect(screen.getByText('TypeScript')).toBeInTheDocument()
  })
})
```

### Testing API Calls with MSW

```typescript
// tests/mocks/handlers.ts
import { rest } from 'msw'

export const handlers = [
  rest.get('/api/projects', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([
        { id: '1', title: 'Project 1' },
        { id: '2', title: 'Project 2' }
      ])
    )
  }),
  
  rest.post('/api/contact', async (req, res, ctx) => {
    const body = await req.json()
    
    if (!body.email) {
      return res(
        ctx.status(400),
        ctx.json({ error: 'Email is required' })
      )
    }
    
    return res(
      ctx.status(200),
      ctx.json({ message: 'Message sent successfully' })
    )
  })
]
```

```typescript
// tests/setup.ts
import { setupServer } from 'msw/node'
import { handlers } from './mocks/handlers'
import { beforeAll, afterEach, afterAll } from 'vitest'

const server = setupServer(...handlers)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
```

---

## E2E Testing

### Playwright Setup

```bash
pnpm add -D @playwright/test
npx playwright install
```

```typescript
// playwright.config.ts
import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  use: {
    baseURL: 'http://localhost:5173',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  },
  webServer: {
    command: 'pnpm dev',
    port: 5173,
    reuseExistingServer: !process.env.CI
  }
})
```

### Basic E2E Tests

```typescript
// e2e/portfolio.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Portfolio Page', () => {
  test('loads homepage', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/Portfolio/)
  })
  
  test('navigates between sections', async ({ page }) => {
    await page.goto('/')
    
    // Click on About link
    await page.click('text=About')
    
    // Check URL has changed
    await expect(page).toHaveURL(/#about/)
    
    // Check About section is visible
    await expect(page.locator('#about')).toBeVisible()
  })
  
  test('displays projects', async ({ page }) => {
    await page.goto('/')
    
    // Navigate to projects
    await page.click('text=Projects')
    
    // Wait for projects to load
    await page.waitForSelector('[data-testid="project-card"]')
    
    // Check at least one project is displayed
    const projects = await page.locator('[data-testid="project-card"]').count()
    expect(projects).toBeGreaterThan(0)
  })
})
```

### Admin Flow E2E

```typescript
// e2e/admin.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Admin Panel', () => {
  test('login flow', async ({ page }) => {
    await page.goto('/admin/login')
    
    // Fill login form
    await page.fill('input[type="email"]', 'admin@example.com')
    await page.fill('input[type="password"]', 'password123')
    
    // Submit form
    await page.click('button[type="submit"]')
    
    // Should redirect to admin panel
    await expect(page).toHaveURL('/admin')
    await expect(page.locator('text=Admin Panel')).toBeVisible()
  })
  
  test('create project', async ({ page }) => {
    // Login first
    await page.goto('/admin/login')
    await page.fill('input[type="email"]', 'admin@example.com')
    await page.fill('input[type="password"]', 'password123')
    await page.click('button[type="submit"]')
    
    // Navigate to projects tab
    await page.click('text=Projects')
    
    // Click add project button
    await page.click('text=Add Project')
    
    // Fill form
    await page.fill('input[name="title"]', 'New Project')
    await page.fill('textarea[name="description"]', 'Project description')
    
    // Submit
    await page.click('text=Save')
    
    // Verify project appears in list
    await expect(page.locator('text=New Project')).toBeVisible()
  })
})
```

---

## Testing Best Practices

### 1. Test Naming

```typescript
// Good
test('displays error when email is invalid', () => {})

// Bad
test('test1', () => {})
```

### 2. Arrange-Act-Assert Pattern

```typescript
test('submits form successfully', async () => {
  // Arrange
  const user = userEvent.setup()
  render(<Form />)
  
  // Act
  await user.type(screen.getByLabelText('Email'), 'test@example.com')
  await user.click(screen.getByText('Submit'))
  
  // Assert
  expect(screen.getByText('Success')).toBeInTheDocument()
})
```

### 3. Use Data Attributes for Testing

```typescript
// Component
<div data-testid="project-card">
  {project.title}
</div>

// Test
const card = screen.getByTestId('project-card')
```

### 4. Mock External Dependencies

```typescript
vi.mock('firebase/firestore', () => ({
  collection: vi.fn(),
  getDocs: vi.fn(() => Promise.resolve(mockData)),
  addDoc: vi.fn()
}))
```

### 5. Test User Interactions

```typescript
test('filters projects by category', async () => {
  const user = userEvent.setup()
  render(<Projects />)
  
  await user.click(screen.getByRole('button', { name: 'Web Development' }))
  
  // Only web dev projects should be visible
  expect(screen.getByText('Web Project')).toBeVisible()
  expect(screen.queryByText('Mobile Project')).not.toBeInTheDocument()
})
```

---

**Next**: [23-SECURITY.md](./23-SECURITY.md) - Security best practices
