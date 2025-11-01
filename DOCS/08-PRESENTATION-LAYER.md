# Presentation Layer Documentation

## 📖 Table of Contents
1. [Overview](#overview)
2. [Component Architecture](#component-architecture)
3. [Pages](#pages)
4. [Section Components](#section-components)
5. [UI Components](#ui-components)
6. [Admin Components](#admin-components)
7. [Best Practices](#best-practices)

---

## Overview

The Presentation Layer contains all React components, pages, and UI elements. It's organized by responsibility and reusability.

### Location
```
src/presentation/
├── components/
│   ├── admin/         # Admin panel components
│   ├── sections/      # Portfolio sections
│   └── ui/            # Reusable UI components
├── hooks/             # Custom React hooks
├── pages/             # Page-level components
└── store/             # State management
```

### Design Principles
- 🎨 **Atomic Design**: Components organized from atoms to organisms
- 🔄 **Reusability**: DRY principle throughout
- 📱 **Responsive**: Mobile-first approach
- ♿ **Accessible**: WCAG 2.1 AA compliant
- 🎭 **Animated**: Smooth transitions and interactions

---

## Component Architecture

### Component Hierarchy

```
App
├── PortfolioPage (Public)
│   ├── Home Section
│   ├── About Section
│   ├── Experience Section
│   ├── Projects Section
│   ├── Skills Section
│   ├── Certifications Section
│   ├── Education Section
│   └── Contact Section
│
└── AdminPage (Protected)
    ├── HomeManager
    ├── AboutManager
    ├── ExperienceManager
    ├── ProjectManager
    ├── SkillManager
    ├── CertificationManager
    ├── EducationManager
    └── ContactSubmissionsManager
```

---

## Pages

### Portfolio Page

**File**: `src/presentation/pages/PortfolioPage.tsx`

```typescript
import { useEffect, useRef } from 'react'
import { Link } from 'react-scroll'
import { Menu } from 'lucide-react'
import {
  Home,
  About,
  Experience,
  Projects,
  Skills,
  Certifications,
  Education,
  Contact
} from '../components/sections'
import { ParticlesBackground, SpaceParticles } from '../components/ui'
import { useEasterEggs } from '../hooks'

export default function PortfolioPage() {
  const menuRef = useRef<HTMLDivElement>(null)
  const { easterEggs } = useEasterEggs()
  
  // Toggle mobile menu
  const toggleMenu = () => {
    menuRef.current?.classList.toggle('hidden')
  }
  
  return (
    <div className="min-h-screen bg-tokyo-bg text-tokyo-fg">
      {/* Background Effects */}
      <ParticlesBackground />
      <SpaceParticles />
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-tokyo-bg/80 backdrop-blur-md border-b border-tokyo-comment">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link
              to="home"
              spy={true}
              smooth={true}
              duration={500}
              className="text-2xl font-bold text-tokyo-cyan cursor-pointer hover:text-tokyo-blue transition-colors"
            >
              Portfolio
            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {['Home', 'About', 'Experience', 'Projects', 'Skills', 'Certifications', 'Education', 'Contact'].map(
                (section) => (
                  <Link
                    key={section}
                    to={section.toLowerCase()}
                    spy={true}
                    smooth={true}
                    duration={500}
                    offset={-80}
                    activeClass="text-tokyo-cyan"
                    className="text-sm font-medium text-tokyo-fg hover:text-tokyo-cyan transition-colors cursor-pointer"
                  >
                    {section}
                  </Link>
                )
              )}
            </div>
            
            {/* Mobile Menu Button */}
            <button
              onClick={toggleMenu}
              className="md:hidden p-2 text-tokyo-fg hover:text-tokyo-cyan transition-colors"
            >
              <Menu size={24} />
            </button>
          </div>
          
          {/* Mobile Navigation */}
          <div
            ref={menuRef}
            className="hidden md:hidden pb-4 flex flex-col gap-2"
          >
            {['Home', 'About', 'Experience', 'Projects', 'Skills', 'Certifications', 'Education', 'Contact'].map(
              (section) => (
                <Link
                  key={section}
                  to={section.toLowerCase()}
                  spy={true}
                  smooth={true}
                  duration={500}
                  offset={-80}
                  onClick={toggleMenu}
                  className="text-sm font-medium text-tokyo-fg hover:text-tokyo-cyan transition-colors cursor-pointer py-2"
                >
                  {section}
                </Link>
              )
            )}
          </div>
        </div>
      </nav>
      
      {/* Sections */}
      <main>
        <section id="home">
          <Home />
        </section>
        
        <section id="about">
          <About />
        </section>
        
        <section id="experience">
          <Experience />
        </section>
        
        <section id="projects">
          <Projects />
        </section>
        
        <section id="skills">
          <Skills />
        </section>
        
        <section id="certifications">
          <Certifications />
        </section>
        
        <section id="education">
          <Education />
        </section>
        
        <section id="contact">
          <Contact />
        </section>
      </main>
      
      {/* Easter Eggs */}
      {easterEggs.konami && (
        <div className="fixed bottom-4 right-4 z-50">
          <div className="animate-bounce text-4xl">🎉</div>
        </div>
      )}
    </div>
  )
}
```

---

### Admin Page

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

type Tab = 'home' | 'about' | 'experience' | 'projects' | 'skills' | 'certifications' | 'education' | 'contact'

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
      <header className="bg-tokyo-night border-b border-tokyo-comment">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-tokyo-cyan">
              Admin Panel
            </h1>
            
            <div className="flex items-center gap-4">
              <span className="text-sm text-tokyo-fg">
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
      <div className="border-b border-tokyo-comment">
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

## Section Components

### Home Section

**File**: `src/presentation/components/sections/Home.tsx`

```typescript
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Github, Linkedin, Mail, Download, ExternalLink } from 'lucide-react'
import { usePortfolio } from '../../hooks'
import { Button, Loading, TypingTagline } from '../ui'
import type { HomeData } from '../../../core/domain'

export default function Home() {
  const { portfolioService } = usePortfolio()
  const [homeData, setHomeData] = useState<HomeData | null>(null)
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    loadHomeData()
  }, [])
  
  const loadHomeData = async () => {
    try {
      const data = await portfolioService.getHomeData()
      setHomeData(data)
    } catch (error) {
      console.error('Error loading home data:', error)
    } finally {
      setLoading(false)
    }
  }
  
  if (loading) return <Loading />
  if (!homeData) return null
  
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-4xl w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          {/* Profile Image */}
          {homeData.profileImage && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="mb-8"
            >
              <img
                src={homeData.profileImage}
                alt={homeData.name}
                className="w-32 h-32 rounded-full mx-auto border-4 border-tokyo-cyan shadow-lg shadow-tokyo-cyan/20"
              />
            </motion.div>
          )}
          
          {/* Name */}
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-5xl md:text-7xl font-bold text-tokyo-fg mb-4"
          >
            {homeData.name}
          </motion.h1>
          
          {/* Title */}
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-2xl md:text-3xl text-tokyo-cyan mb-6"
          >
            {homeData.title}
          </motion.h2>
          
          {/* Typing Tagline */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mb-8"
          >
            <TypingTagline text={homeData.tagline} />
          </motion.div>
          
          {/* Bio */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-lg text-tokyo-comment max-w-2xl mx-auto mb-8"
          >
            {homeData.bio}
          </motion.p>
          
          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="flex flex-wrap items-center justify-center gap-4 mb-12"
          >
            {homeData.resume && (
              <Button
                as="a"
                href={homeData.resume}
                target="_blank"
                rel="noopener noreferrer"
                icon={Download}
              >
                Download Resume
              </Button>
            )}
            
            <Button
              as="a"
              href={`mailto:${homeData.email}`}
              variant="outline"
              icon={Mail}
            >
              Get In Touch
            </Button>
          </motion.div>
          
          {/* Social Links */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex items-center justify-center gap-6"
          >
            {homeData.socialLinks.map((social, index) => (
              <motion.a
                key={social.platform}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="text-tokyo-fg hover:text-tokyo-cyan transition-colors"
                title={social.platform}
              >
                <SocialIcon platform={social.platform} />
              </motion.a>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

function SocialIcon({ platform }: { platform: string }) {
  const iconMap: Record<string, any> = {
    GitHub: Github,
    LinkedIn: Linkedin,
    Email: Mail
  }
  
  const Icon = iconMap[platform] || ExternalLink
  return <Icon size={24} />
}
```

---

### Projects Section

**File**: `src/presentation/components/sections/Projects.tsx`

```typescript
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Github, ExternalLink, Filter } from 'lucide-react'
import { usePortfolio } from '../../hooks'
import { Card, Badge, Button, Loading, EmptyState } from '../ui'
import type { Project } from '../../../core/domain'

export default function Projects() {
  const { portfolioService } = usePortfolio()
  const [projects, setProjects] = useState<Project[]>([])
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    loadProjects()
  }, [])
  
  useEffect(() => {
    filterProjects()
  }, [projects, selectedCategory])
  
  const loadProjects = async () => {
    try {
      const data = await portfolioService.getAllProjects()
      setProjects(data)
    } catch (error) {
      console.error('Error loading projects:', error)
    } finally {
      setLoading(false)
    }
  }
  
  const filterProjects = () => {
    if (selectedCategory === 'all') {
      setFilteredProjects(projects)
    } else {
      setFilteredProjects(
        projects.filter(p => p.category === selectedCategory)
      )
    }
  }
  
  const categories = ['all', ...new Set(projects.map(p => p.category))]
  
  if (loading) return <Loading />
  
  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-tokyo-fg mb-4">
            Projects
          </h2>
          <p className="text-tokyo-comment text-lg">
            Check out some of my recent work
          </p>
        </motion.div>
        
        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex flex-wrap items-center justify-center gap-2 mb-12"
        >
          {categories.map(category => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(category)}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </Button>
          ))}
        </motion.div>
        
        {/* Projects Grid */}
        {filteredProjects.length === 0 ? (
          <EmptyState
            icon={Filter}
            title="No projects found"
            description="Try selecting a different category"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={index}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
    >
      <Card className="h-full group hover:scale-105 transition-transform">
        {/* Cover Image */}
        {project.coverImage && (
          <div className="aspect-video overflow-hidden rounded-t-lg">
            <img
              src={project.coverImage}
              alt={project.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
          </div>
        )}
        
        <div className="p-6">
          {/* Title */}
          <h3 className="text-xl font-bold text-tokyo-fg mb-2">
            {project.title}
          </h3>
          
          {/* Description */}
          <p className="text-tokyo-comment mb-4 line-clamp-2">
            {project.description}
          </p>
          
          {/* Technologies */}
          <div className="flex flex-wrap gap-2 mb-4">
            {project.technologies.slice(0, 3).map(tech => (
              <Badge key={tech} variant="secondary">
                {tech}
              </Badge>
            ))}
            {project.technologies.length > 3 && (
              <Badge variant="secondary">
                +{project.technologies.length - 3}
              </Badge>
            )}
          </div>
          
          {/* Links */}
          <div className="flex items-center gap-2">
            {project.githubUrl && (
              <Button
                as="a"
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                variant="outline"
                size="sm"
                icon={Github}
              >
                Code
              </Button>
            )}
            
            {project.demoUrl && (
              <Button
                as="a"
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                size="sm"
                icon={ExternalLink}
              >
                Demo
              </Button>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  )
}
```

---

## UI Components

### Button Component

**File**: `src/presentation/components/ui/Button.tsx`

```typescript
import React from 'react'
import { LucideIcon } from 'lucide-react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  icon?: LucideIcon
  as?: 'button' | 'a'
  href?: string
  target?: string
  rel?: string
  children: React.ReactNode
}

export default function Button({
  variant = 'primary',
  size = 'md',
  icon: Icon,
  as = 'button',
  className = '',
  children,
  ...props
}: ButtonProps) {
  const baseClasses = 'inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-tokyo-cyan focus:ring-offset-2 focus:ring-offset-tokyo-bg disabled:opacity-50 disabled:cursor-not-allowed'
  
  const variants = {
    primary: 'bg-tokyo-cyan text-tokyo-bg hover:bg-tokyo-blue shadow-lg shadow-tokyo-cyan/20',
    secondary: 'bg-tokyo-purple text-white hover:bg-tokyo-magenta shadow-lg shadow-tokyo-purple/20',
    outline: 'border-2 border-tokyo-cyan text-tokyo-cyan hover:bg-tokyo-cyan hover:text-tokyo-bg',
    ghost: 'text-tokyo-fg hover:bg-tokyo-selection'
  }
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  }
  
  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`
  
  const content = (
    <>
      {Icon && <Icon size={size === 'sm' ? 16 : size === 'lg' ? 24 : 20} />}
      {children}
    </>
  )
  
  if (as === 'a') {
    return (
      <a className={classes} {...(props as any)}>
        {content}
      </a>
    )
  }
  
  return (
    <button className={classes} {...props}>
      {content}
    </button>
  )
}
```

---

### Card Component

**File**: `src/presentation/components/ui/Card.tsx`

```typescript
import React from 'react'

interface CardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
}

export default function Card({ children, className = '', hover = false }: CardProps) {
  return (
    <div
      className={`
        bg-tokyo-night border border-tokyo-comment rounded-lg shadow-xl
        ${hover ? 'hover:border-tokyo-cyan hover:shadow-tokyo-cyan/20 transition-all' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  )
}
```

---

**Next**: [09-DATA-FLOW.md](./09-DATA-FLOW.md) - Request/response patterns
