# SEO Optimization Documentation

## 📖 Table of Contents
1. [Overview](#overview)
2. [Meta Tags](#meta-tags)
3. [Open Graph](#open-graph)
4. [Structured Data](#structured-data)
5. [Sitemap](#sitemap)
6. [Performance for SEO](#performance-for-seo)

---

## Overview

SEO (Search Engine Optimization) improves visibility in search engine results, driving organic traffic to your portfolio.

### SEO Priorities
- ✅ Descriptive page titles
- ✅ Meta descriptions
- ✅ Open Graph tags
- ✅ Structured data
- ✅ XML sitemap
- ✅ robots.txt
- ✅ Fast loading times
- ✅ Mobile-friendly design

---

## Meta Tags

### Basic Meta Tags

```html
<!-- public/index.html -->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  
  <!-- Primary Meta Tags -->
  <title>John Doe - Full Stack Developer Portfolio</title>
  <meta name="title" content="John Doe - Full Stack Developer Portfolio" />
  <meta name="description" content="Experienced Full Stack Developer specializing in React, TypeScript, Node.js, and cloud technologies. View my projects, skills, and experience." />
  <meta name="keywords" content="full stack developer, react developer, typescript, web development, portfolio, software engineer" />
  <meta name="author" content="John Doe" />
  <meta name="robots" content="index, follow" />
  <link rel="canonical" href="https://yourportfolio.com/" />
  
  <!-- Favicon -->
  <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
  <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
  
  <!-- Theme Color -->
  <meta name="theme-color" content="#7dcfff" />
</head>
<body>
  <div id="root"></div>
</body>
</html>
```

### Dynamic Meta Tags with React Helmet

```bash
pnpm add react-helmet-async
```

```typescript
// src/main.tsx
import { HelmetProvider } from 'react-helmet-async'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <HelmetProvider>
    <App />
  </HelmetProvider>
)
```

```typescript
// src/components/SEO.tsx
import { Helmet } from 'react-helmet-async'

interface SEOProps {
  title?: string
  description?: string
  image?: string
  url?: string
  type?: string
}

export default function SEO({
  title = 'John Doe - Full Stack Developer',
  description = 'Experienced Full Stack Developer specializing in React, TypeScript, and cloud technologies.',
  image = 'https://yourportfolio.com/og-image.jpg',
  url = 'https://yourportfolio.com',
  type = 'website'
}: SEOProps) {
  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={url} />
    </Helmet>
  )
}
```

---

## Open Graph

### Portfolio Page

```typescript
<SEO
  title="John Doe - Full Stack Developer Portfolio"
  description="View my latest projects, technical skills, and professional experience. Specialized in React, TypeScript, Node.js, and cloud technologies."
  image="https://yourportfolio.com/og-image.jpg"
  url="https://yourportfolio.com"
  type="website"
/>
```

### Project Detail Page

```typescript
<SEO
  title={`${project.title} - John Doe Portfolio`}
  description={project.description}
  image={project.coverImage}
  url={`https://yourportfolio.com/projects/${project.id}`}
  type="article"
/>
```

### Creating OG Images

```typescript
// Recommended OG image specs:
// - Size: 1200x630px
// - Format: JPG or PNG
// - Max file size: 8MB
// - Aspect ratio: 1.91:1

// Use tools like:
// - Canva
// - Figma
// - og-image-generator
```

---

## Structured Data

### Person Schema

```typescript
// src/components/StructuredData.tsx
import { Helmet } from 'react-helmet-async'

export function PersonSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    'name': 'John Doe',
    'url': 'https://yourportfolio.com',
    'image': 'https://yourportfolio.com/profile.jpg',
    'jobTitle': 'Full Stack Developer',
    'worksFor': {
      '@type': 'Organization',
      'name': 'Tech Company'
    },
    'sameAs': [
      'https://github.com/johndoe',
      'https://linkedin.com/in/johndoe',
      'https://twitter.com/johndoe'
    ],
    'knowsAbout': [
      'React',
      'TypeScript',
      'Node.js',
      'Firebase',
      'Cloud Computing'
    ]
  }
  
  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  )
}
```

### WebSite Schema

```typescript
export function WebSiteSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    'name': 'John Doe Portfolio',
    'url': 'https://yourportfolio.com',
    'description': 'Professional portfolio showcasing web development projects and skills',
    'author': {
      '@type': 'Person',
      'name': 'John Doe'
    },
    'inLanguage': 'en-US'
  }
  
  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  )
}
```

### Breadcrumb Schema

```typescript
export function BreadcrumbSchema({ items }: { items: Array<{ name: string; url: string }> }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': items.map((item, index) => ({
      '@type': 'ListItem',
      'position': index + 1,
      'name': item.name,
      'item': item.url
    }))
  }
  
  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  )
}

// Usage
<BreadcrumbSchema
  items={[
    { name: 'Home', url: 'https://yourportfolio.com' },
    { name: 'Projects', url: 'https://yourportfolio.com/projects' },
    { name: project.title, url: `https://yourportfolio.com/projects/${project.id}` }
  ]}
/>
```

---

## Sitemap

### Generate Sitemap

```xml
<!-- public/sitemap.xml -->
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://yourportfolio.com/</loc>
    <lastmod>2024-01-01</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://yourportfolio.com/#about</loc>
    <lastmod>2024-01-01</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://yourportfolio.com/#projects</loc>
    <lastmod>2024-01-01</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://yourportfolio.com/#contact</loc>
    <lastmod>2024-01-01</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
</urlset>
```

### Dynamic Sitemap Generation

```typescript
// scripts/generate-sitemap.ts
import { writeFileSync } from 'fs'

const baseUrl = 'https://yourportfolio.com'

const pages = [
  { url: '/', priority: 1.0, changefreq: 'weekly' },
  { url: '/#about', priority: 0.8, changefreq: 'monthly' },
  { url: '/#projects', priority: 0.9, changefreq: 'weekly' },
  { url: '/#skills', priority: 0.7, changefreq: 'monthly' },
  { url: '/#contact', priority: 0.7, changefreq: 'monthly' }
]

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(page => `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`

writeFileSync('public/sitemap.xml', sitemap)
console.log('✅ Sitemap generated successfully')
```

---

## robots.txt

```txt
# public/robots.txt
User-agent: *
Allow: /
Disallow: /admin
Disallow: /admin/login

Sitemap: https://yourportfolio.com/sitemap.xml
```

---

## Performance for SEO

### Core Web Vitals

Google uses Core Web Vitals as ranking factors:

1. **Largest Contentful Paint (LCP)**: < 2.5s
2. **First Input Delay (FID)**: < 100ms
3. **Cumulative Layout Shift (CLS)**: < 0.1

### Optimization Tips

```typescript
// 1. Lazy load images
<img src={image} alt={alt} loading="lazy" />

// 2. Code splitting
const AdminPage = lazy(() => import('./pages/AdminPage'))

// 3. Preload critical resources
<link rel="preload" href="/fonts/inter.woff2" as="font" type="font/woff2" crossorigin />

// 4. Minimize JS bundle
// Use tree-shaking and code splitting

// 5. Optimize images
// Use WebP format, responsive images, compression
```

---

## SEO Best Practices

### Content Optimization

1. **Unique page titles** (50-60 characters)
2. **Compelling meta descriptions** (150-160 characters)
3. **Header hierarchy** (H1 → H2 → H3)
4. **Descriptive alt text** for images
5. **Internal linking** between pages
6. **Fresh, relevant content**

### Technical SEO

1. **HTTPS** enabled
2. **Mobile-friendly** design
3. **Fast loading** times
4. **Clean URL** structure
5. **Canonical tags** to prevent duplicates
6. **XML sitemap**
7. **robots.txt** file

### Monitoring

```bash
# Google Search Console
# - Submit sitemap
# - Monitor indexing
# - Check search performance

# Google Analytics
# - Track visitor behavior
# - Monitor traffic sources
# - Analyze conversions

# Lighthouse
# - Run SEO audits
# - Check Core Web Vitals
# - Monitor performance scores
```

---

## SEO Checklist

- [ ] Unique page title
- [ ] Meta description
- [ ] Open Graph tags
- [ ] Twitter Card tags
- [ ] Structured data (JSON-LD)
- [ ] XML sitemap
- [ ] robots.txt
- [ ] Canonical URLs
- [ ] Alt text for images
- [ ] HTTPS enabled
- [ ] Mobile-friendly
- [ ] Fast loading (< 3s)
- [ ] Clean URL structure
- [ ] Internal linking
- [ ] Google Search Console setup
- [ ] Google Analytics setup

---

**Next**: [26-EASTER-EGGS.md](./26-EASTER-EGGS.md) - Easter egg implementations
