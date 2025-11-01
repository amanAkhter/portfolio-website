# Contributing Guidelines

## 📖 Table of Contents
1. [Getting Started](#getting-started)
2. [Development Workflow](#development-workflow)
3. [Code Style](#code-style)
4. [Commit Guidelines](#commit-guidelines)
5. [Pull Request Process](#pull-request-process)
6. [Testing Requirements](#testing-requirements)

---

## Getting Started

Thank you for considering contributing to this portfolio project! This document provides guidelines to make the contribution process smooth and effective.

### Prerequisites

Before contributing, ensure you have:
- Node.js 18+ installed
- pnpm package manager
- Git configured
- Code editor (VS Code recommended)
- Basic knowledge of React, TypeScript, and Firebase

### Setting Up Development Environment

```bash
# 1. Fork the repository on GitHub

# 2. Clone your fork
git clone https://github.com/YOUR_USERNAME/portfolio-modular.git
cd portfolio-modular

# 3. Add upstream remote
git remote add upstream https://github.com/ORIGINAL_OWNER/portfolio-modular.git

# 4. Install dependencies
pnpm install

# 5. Create .env file
cp .env.example .env
# Add your Firebase credentials

# 6. Start development server
pnpm dev
```

---

## Development Workflow

### Branch Strategy

```bash
# Always create a new branch for your work
git checkout -b feature/your-feature-name

# Branch naming conventions:
# feature/  - New features
# fix/      - Bug fixes
# docs/     - Documentation updates
# refactor/ - Code refactoring
# test/     - Adding tests
# chore/    - Maintenance tasks

# Examples:
git checkout -b feature/add-blog-section
git checkout -b fix/animation-performance
git checkout -b docs/update-readme
```

### Keeping Your Fork Updated

```bash
# Fetch latest changes from upstream
git fetch upstream

# Merge upstream main into your main
git checkout main
git merge upstream/main

# Push updates to your fork
git push origin main

# Rebase your feature branch
git checkout feature/your-feature
git rebase main
```

---

## Code Style

### TypeScript Guidelines

```typescript
// ✅ DO: Use explicit types
interface ProjectProps {
  project: Project
  onEdit: (id: string) => void
}

// ❌ DON'T: Use implicit any
function Component({ data }: { data: any }) {}

// ✅ DO: Use meaningful names
const fetchUserProjects = async (userId: string) => {}

// ❌ DON'T: Use unclear abbreviations
const fup = async (uid: string) => {}

// ✅ DO: Use const for immutable values
const MAX_PROJECTS = 10

// ❌ DON'T: Use let when const works
let MAX_PROJECTS = 10
```

### React Component Guidelines

```typescript
// ✅ DO: Use functional components
export default function ProjectCard({ project }: ProjectCardProps) {
  return <div>{project.title}</div>
}

// ✅ DO: Extract complex logic to hooks
function useProjects() {
  const [projects, setProjects] = useState<Project[]>([])
  // ... logic
  return { projects, loading }
}

// ✅ DO: Use proper prop destructuring
function Component({ title, description }: Props) {}

// ❌ DON'T: Access props object directly
function Component(props: Props) {
  return <div>{props.title}</div>
}

// ✅ DO: Export types with components
export interface ProjectCardProps {
  project: Project
  onEdit?: (id: string) => void
}

export default function ProjectCard({ project, onEdit }: ProjectCardProps) {}
```

### File Organization

```
src/
├── core/
│   ├── domain/        # Entities and interfaces only
│   └── usecases/      # Business logic and services
├── infrastructure/    # External dependencies
└── presentation/      # UI components and pages
    ├── components/
    │   ├── admin/     # Admin-specific components
    │   ├── sections/  # Page sections
    │   └── ui/        # Reusable UI components
    ├── hooks/         # Custom React hooks
    ├── pages/         # Route pages
    └── store/         # State management
```

### Naming Conventions

```typescript
// Components: PascalCase
export default function ProjectCard() {}

// Hooks: camelCase with 'use' prefix
export function useProjects() {}

// Constants: SCREAMING_SNAKE_CASE
export const MAX_FILE_SIZE = 5 * 1024 * 1024

// Variables: camelCase
const projectTitle = 'My Project'

// Types/Interfaces: PascalCase
export interface Project {}
export type ProjectStatus = 'active' | 'completed'

// Files: 
// - Components: PascalCase (ProjectCard.tsx)
// - Hooks: camelCase (useProjects.ts)
// - Utils: camelCase (helpers.ts)
```

---

## Commit Guidelines

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, missing semicolons, etc.)
- **refactor**: Code refactoring
- **test**: Adding or updating tests
- **chore**: Maintenance tasks

### Examples

```bash
# Good commits
git commit -m "feat(projects): add filter by category"
git commit -m "fix(animations): resolve particle memory leak"
git commit -m "docs(readme): update installation instructions"
git commit -m "refactor(api): extract service methods to separate files"

# Multi-line commit
git commit -m "feat(admin): add project image upload

- Implement file validation
- Add image compression
- Update project form component

Closes #123"
```

### Commit Best Practices

```bash
# ✅ DO: Make atomic commits
git add src/components/ProjectCard.tsx
git commit -m "feat(projects): add project card component"

# ✅ DO: Write clear, descriptive messages
git commit -m "fix(auth): resolve infinite loop in useAuth hook"

# ❌ DON'T: Make huge commits
git commit -m "updated stuff"

# ❌ DON'T: Use vague messages
git commit -m "fixes"
```

---

## Pull Request Process

### Before Submitting

```bash
# 1. Update from main
git checkout main
git pull upstream main

# 2. Rebase your feature branch
git checkout feature/your-feature
git rebase main

# 3. Run tests
pnpm test

# 4. Run linter
pnpm lint

# 5. Build to ensure no errors
pnpm build

# 6. Check for type errors
pnpm exec tsc --noEmit
```

### Pull Request Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Changes Made
- Added X component
- Fixed Y bug
- Refactored Z module

## Screenshots (if applicable)
[Add screenshots here]

## Testing
- [ ] Tested locally
- [ ] Added unit tests
- [ ] Tested on multiple browsers

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new warnings generated
- [ ] Tests pass locally
```

### Pull Request Guidelines

1. **Keep PRs focused**: One feature/fix per PR
2. **Write descriptive titles**: Clear and concise
3. **Fill out template**: Complete all relevant sections
4. **Link issues**: Reference related issues
5. **Add screenshots**: For UI changes
6. **Update docs**: If behavior changes
7. **Respond to feedback**: Address review comments promptly

---

## Testing Requirements

### Unit Tests

```typescript
// tests/components/Button.test.tsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Button from '../Button'

describe('Button', () => {
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
})
```

### Running Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage

# Run specific test file
pnpm test Button.test.tsx
```

---

## Documentation

### Code Comments

```typescript
// ✅ DO: Comment complex logic
/**
 * Calculates the optimal particle count based on viewport size
 * to maintain 60fps performance across devices
 */
function calculateParticleCount(): number {
  const area = window.innerWidth * window.innerHeight
  return Math.min(200, Math.floor(area / 15000))
}

// ✅ DO: Document function parameters
/**
 * Fetches projects with optional filtering
 * @param filter - Optional category filter
 * @param limit - Maximum number of projects to return
 * @returns Promise resolving to array of projects
 */
async function fetchProjects(filter?: string, limit?: number): Promise<Project[]> {}

// ❌ DON'T: State the obvious
// Set loading to true
setLoading(true)

// ❌ DON'T: Leave outdated comments
// TODO: This needs to be refactored (from 2022)
```

### Updating Documentation

When making changes that affect:
- **User behavior**: Update relevant docs in DOCS/
- **API changes**: Update API documentation
- **New features**: Add usage examples
- **Breaking changes**: Add migration guide

---

## Code Review

### As a Contributor

- **Be responsive**: Reply to comments promptly
- **Be open**: Welcome feedback and suggestions
- **Be patient**: Reviews take time
- **Be thorough**: Test your changes

### As a Reviewer

- **Be respectful**: Provide constructive feedback
- **Be specific**: Explain why changes are needed
- **Be helpful**: Suggest solutions
- **Be timely**: Review PRs promptly

---

## Questions?

If you have questions about contributing:
1. Check existing documentation
2. Search closed issues
3. Ask in discussions
4. Create a new issue with "question" label

---

## Recognition

Contributors will be acknowledged in:
- README.md contributors section
- CHANGELOG.md for significant contributions
- GitHub contributors page

Thank you for contributing! 🎉

---

**Next**: [30-CHANGELOG.md](./30-CHANGELOG.md) - Version history
