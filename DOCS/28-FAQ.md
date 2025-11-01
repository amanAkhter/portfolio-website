# Frequently Asked Questions (FAQ)

## 📖 Table of Contents
1. [General Questions](#general-questions)
2. [Setup Questions](#setup-questions)
3. [Development Questions](#development-questions)
4. [Customization Questions](#customization-questions)
5. [Deployment Questions](#deployment-questions)

---

## General Questions

### What is this portfolio built with?

The portfolio is built using:
- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS (Tokyo Night theme)
- **Backend**: Firebase (Firestore + Authentication)
- **Animations**: Framer Motion + GSAP
- **Routing**: React Router v6
- **Architecture**: Clean Architecture pattern

---

### Can I use this portfolio for my own website?

Yes! This portfolio is designed to be easily customizable. You can:
1. Clone the repository
2. Update the content with your information
3. Customize colors and styles
4. Deploy to your preferred hosting platform

See [CUSTOMIZATION.md](./CUSTOMIZATION.md) for detailed instructions.

---

### Do I need coding experience to use this?

Basic knowledge is helpful but not required:
- **No coding needed**: Just update Firebase data through admin panel
- **Basic HTML/CSS**: Customize colors and styles
- **React/TypeScript**: Make structural changes and add features

---

### Is this portfolio free to use?

Yes, the code is free to use. However, you'll need:
- Firebase account (free tier available)
- Hosting platform (many offer free tiers)
- Domain name (optional, but recommended)

---

## Setup Questions

### How long does setup take?

- **Quick start**: 15-30 minutes
  - Clone repo
  - Install dependencies
  - Basic Firebase setup
  - Run locally

- **Full setup**: 1-2 hours
  - Configure all Firebase collections
  - Add your content
  - Customize styling
  - Deploy to hosting

---

### What Firebase plan do I need?

The **Spark (free) plan** is sufficient for most portfolios:
- 1 GB storage
- 10 GB/month transfer
- 50K reads/day
- 20K writes/day

Upgrade to **Blaze (pay-as-you-go)** only if you exceed these limits.

---

### Can I use a different database?

Yes! The architecture supports swapping databases:
1. Implement the repository interfaces
2. Update dependency injection
3. Keep the same domain layer

Examples: PostgreSQL, MongoDB, Supabase, or static JSON files.

---

### Do I need a custom domain?

Not required, but recommended:
- **Without domain**: Use platform subdomain (e.g., `yourname.vercel.app`)
- **With domain**: Professional appearance (e.g., `yourname.com`)

Cost: $10-15/year for most domains.

---

## Development Questions

### How do I add a new section?

1. **Create section component**:
```typescript
// src/presentation/components/sections/NewSection.tsx
export default function NewSection() {
  return (
    <section id="new-section">
      <h2>New Section</h2>
    </section>
  )
}
```

2. **Add to PortfolioPage**:
```typescript
import NewSection from './components/sections/NewSection'

// In PortfolioPage
<NewSection />
```

3. **Add navigation link**:
```typescript
<Link to="new-section">New Section</Link>
```

---

### How do I change the color scheme?

Update Tailwind configuration:

```javascript
// tailwind.config.js
export default {
  theme: {
    extend: {
      colors: {
        'tokyo-bg': '#1a1b26',      // Your background color
        'tokyo-cyan': '#7dcfff',     // Your primary color
        'tokyo-fg': '#a9b1d6',       // Your text color
        // ... other colors
      }
    }
  }
}
```

---

### How do I add more projects?

**Via Admin Panel** (Recommended):
1. Login to `/admin`
2. Go to Projects tab
3. Click "Add Project"
4. Fill in details
5. Save

**Via Firebase Console**:
1. Go to Firestore Database
2. Navigate to `projects` collection
3. Click "Add document"
4. Enter project data

---

### Can I add a blog?

Yes! Add a blog section:

1. **Create Blog entity**:
```typescript
// src/core/domain/entities/Blog.ts
export interface BlogPost {
  id: string
  title: string
  content: string
  excerpt: string
  coverImage: string
  tags: string[]
  publishedAt: string
  author: string
}
```

2. **Create repository and service**
3. **Add blog components**
4. **Create blog routes**

---

### How do I integrate analytics?

**Google Analytics**:
```typescript
// src/main.tsx
import ReactGA from 'react-ga4'

ReactGA.initialize('G-XXXXXXXXXX')

// Track page views
ReactGA.send({ hitType: 'pageview', page: window.location.pathname })
```

**Vercel Analytics**:
```bash
pnpm add @vercel/analytics
```
```typescript
import { Analytics } from '@vercel/analytics/react'

<App>
  <Analytics />
</App>
```

---

## Customization Questions

### Can I change the font?

Yes! Update in `index.css`:

```css
@import url('https://fonts.googleapis.com/css2?family=Your+Font&display=swap');

body {
  font-family: 'Your Font', sans-serif;
}
```

Update Tailwind config:
```javascript
export default {
  theme: {
    extend: {
      fontFamily: {
        sans: ['Your Font', 'system-ui', 'sans-serif']
      }
    }
  }
}
```

---

### How do I change the hero animation?

Edit Home component:

```typescript
// src/presentation/components/sections/Home.tsx

// Use different animation
<motion.h1
  initial={{ opacity: 0, scale: 0.5 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ duration: 0.8 }}
>
  {title}
</motion.h1>

// Or use GSAP
useEffect(() => {
  gsap.from('.hero-title', {
    opacity: 0,
    y: -50,
    duration: 1
  })
}, [])
```

---

### Can I disable particle effects?

Yes! Remove or conditionally render:

```typescript
// src/presentation/pages/PortfolioPage.tsx

// Option 1: Remove component
// <ParticlesBackground />

// Option 2: Add toggle
const [showParticles, setShowParticles] = useState(true)

{showParticles && <ParticlesBackground />}
```

---

### How do I add social media links?

Update Home component:

```typescript
const socialLinks = [
  { icon: Github, url: 'https://github.com/yourusername', label: 'GitHub' },
  { icon: Linkedin, url: 'https://linkedin.com/in/yourusername', label: 'LinkedIn' },
  { icon: Twitter, url: 'https://twitter.com/yourusername', label: 'Twitter' },
  { icon: Mail, url: 'mailto:your@email.com', label: 'Email' }
]

<div className="flex gap-4">
  {socialLinks.map(link => (
    <a
      key={link.label}
      href={link.url}
      aria-label={link.label}
      target="_blank"
      rel="noopener noreferrer"
    >
      <link.icon />
    </a>
  ))}
</div>
```

---

## Deployment Questions

### Which hosting platform is best?

**Recommended platforms**:

1. **Vercel** (Best for React)
   - Automatic deployments
   - Great performance
   - Free SSL
   - Generous free tier

2. **Netlify** (Great features)
   - Easy setup
   - Form handling
   - Split testing
   - Good free tier

3. **Firebase Hosting** (Integrated)
   - Same platform as backend
   - Fast CDN
   - Easy setup
   - Free tier

Choose based on your needs and familiarity.

---

### How do I set up a custom domain?

**On Vercel**:
1. Project Settings → Domains
2. Add your domain
3. Update DNS records at domain registrar
4. Wait for verification (up to 48 hours)

**On Netlify**:
1. Site Settings → Domain management
2. Add custom domain
3. Update nameservers or CNAME
4. SSL auto-provisions

---

### Do I need to rebuild after content changes?

**No!** Content is stored in Firebase:
- Changes appear immediately
- No rebuild required
- Update through admin panel

**Yes!** For code/style changes:
- Styling modifications
- New features
- Component updates

---

### How do I enable HTTPS?

Most platforms provide free SSL:
- **Vercel**: Automatic
- **Netlify**: Automatic
- **Firebase**: Automatic after domain setup

Manual setup rarely needed.

---

### What about SEO?

The portfolio includes SEO optimization:
- ✅ Meta tags
- ✅ Open Graph tags
- ✅ Structured data
- ✅ Sitemap
- ✅ Fast loading
- ✅ Mobile-friendly

Update in `public/index.html` and SEO component.

---

## Performance Questions

### Why is my portfolio slow?

Common causes and fixes:

1. **Large images**:
   - Compress images
   - Use WebP format
   - Add lazy loading

2. **Too many animations**:
   - Reduce particle count
   - Optimize animations
   - Use CSS transforms

3. **Large bundle size**:
   - Enable code splitting
   - Remove unused dependencies
   - Tree-shake imports

4. **Network issues**:
   - Enable caching
   - Use CDN
   - Minimize requests

---

### What's a good Lighthouse score?

Target scores:
- **Performance**: > 90
- **Accessibility**: > 95
- **Best Practices**: > 95
- **SEO**: > 95

Run audit: Chrome DevTools → Lighthouse

---

## Support Questions

### Where can I get help?

1. **Documentation**: Check the DOCS folder
2. **GitHub Issues**: Report bugs or ask questions
3. **Stack Overflow**: Search for similar issues
4. **Discord/Slack**: Join developer communities

---

### How do I report a bug?

Create a GitHub issue with:
1. Description of the problem
2. Steps to reproduce
3. Expected vs actual behavior
4. Screenshots if applicable
5. Environment details (browser, OS, versions)

---

### Can I contribute?

Yes! Contributions welcome:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

See [CONTRIBUTING.md](./29-CONTRIBUTING.md) for guidelines.

---

**Next**: [29-CONTRIBUTING.md](./29-CONTRIBUTING.md) - Contribution guidelines
