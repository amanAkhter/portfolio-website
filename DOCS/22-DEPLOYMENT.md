# Deployment Documentation

## 📖 Table of Contents
1. [Overview](#overview)
2. [Build Process](#build-process)
3. [Deployment Platforms](#deployment-platforms)
4. [Environment Variables](#environment-variables)
5. [CI/CD](#cicd)
6. [Post-Deployment](#post-deployment)

---

## Overview

This guide covers deploying your portfolio to various platforms. The portfolio is built with Vite and can be deployed to any static hosting service.

---

## Build Process

### Local Build

```bash
# Install dependencies
pnpm install

# Build for production
pnpm run build

# Preview production build locally
pnpm run preview
```

### Build Output

```
dist/
├── assets/
│   ├── index-[hash].js
│   ├── index-[hash].css
│   └── [other assets]
├── index.html
└── [other static files]
```

### Build Configuration

**File**: `vite.config.ts`

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'firebase': ['firebase/app', 'firebase/firestore', 'firebase/auth'],
          'animation': ['framer-motion', 'gsap']
        }
      }
    }
  }
})
```

---

## Deployment Platforms

### Vercel (Recommended)

**Why Vercel?**
- ✅ Zero configuration
- ✅ Automatic HTTPS
- ✅ Global CDN
- ✅ Automatic preview deployments
- ✅ Environment variables management

**Deploy Steps**:

1. **Install Vercel CLI**:
```bash
npm i -g vercel
```

2. **Login**:
```bash
vercel login
```

3. **Deploy**:
```bash
vercel
```

4. **Production Deploy**:
```bash
vercel --prod
```

**Or using GitHub Integration**:

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "Import Project"
4. Select your GitHub repository
5. Configure build settings:
   - **Framework Preset**: Vite
   - **Build Command**: `pnpm run build`
   - **Output Directory**: `dist`
6. Add environment variables
7. Click "Deploy"

---

### Netlify

**Deploy Steps**:

1. **Install Netlify CLI**:
```bash
npm i -g netlify-cli
```

2. **Login**:
```bash
netlify login
```

3. **Initialize**:
```bash
netlify init
```

4. **Deploy**:
```bash
netlify deploy --prod
```

**Or using Git**:

1. Push code to GitHub
2. Go to [netlify.com](https://netlify.com)
3. Click "Add new site" → "Import an existing project"
4. Connect to GitHub and select repository
5. Configure:
   - **Build command**: `pnpm run build`
   - **Publish directory**: `dist`
6. Add environment variables
7. Click "Deploy site"

**netlify.toml Configuration**:
```toml
[build]
  command = "pnpm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  NODE_VERSION = "18"
```

---

### Firebase Hosting

**Deploy Steps**:

1. **Install Firebase CLI**:
```bash
npm i -g firebase-tools
```

2. **Login**:
```bash
firebase login
```

3. **Initialize**:
```bash
firebase init hosting
```

Select:
- Public directory: `dist`
- Configure as SPA: Yes
- Set up automatic builds: No

4. **Build and Deploy**:
```bash
pnpm run build
firebase deploy
```

**firebase.json Configuration**:
```json
{
  "hosting": {
    "public": "dist",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ],
    "headers": [
      {
        "source": "**/*.@(jpg|jpeg|gif|png|svg|webp)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "max-age=31536000"
          }
        ]
      },
      {
        "source": "**/*.@(js|css)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "max-age=31536000"
          }
        ]
      }
    ]
  }
}
```

---

### GitHub Pages

**Deploy Steps**:

1. **Install gh-pages**:
```bash
pnpm add -D gh-pages
```

2. **Add deploy script** to `package.json`:
```json
{
  "scripts": {
    "predeploy": "pnpm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

3. **Update `vite.config.ts`**:
```typescript
export default defineConfig({
  base: '/your-repo-name/',
  // ... other config
})
```

4. **Deploy**:
```bash
pnpm run deploy
```

5. **Configure GitHub**:
   - Go to repository settings
   - Navigate to Pages
   - Select `gh-pages` branch
   - Save

---

## Environment Variables

### Production Environment Variables

Create `.env.production`:

```env
VITE_FIREBASE_API_KEY=your_production_api_key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### Platform-Specific Setup

**Vercel**:
1. Go to project settings
2. Navigate to "Environment Variables"
3. Add each variable
4. Select "Production" environment
5. Save

**Netlify**:
1. Go to site settings
2. Navigate to "Build & deploy" → "Environment"
3. Add each variable
4. Save

**GitHub Actions**:
1. Go to repository settings
2. Navigate to "Secrets and variables" → "Actions"
3. Add each variable as a secret

---

## CI/CD

### GitHub Actions

**File**: `.github/workflows/deploy.yml`

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 8
      
      - name: Install dependencies
        run: pnpm install
      
      - name: Build
        run: pnpm run build
        env:
          VITE_FIREBASE_API_KEY: ${{ secrets.VITE_FIREBASE_API_KEY }}
          VITE_FIREBASE_AUTH_DOMAIN: ${{ secrets.VITE_FIREBASE_AUTH_DOMAIN }}
          VITE_FIREBASE_PROJECT_ID: ${{ secrets.VITE_FIREBASE_PROJECT_ID }}
          VITE_FIREBASE_STORAGE_BUCKET: ${{ secrets.VITE_FIREBASE_STORAGE_BUCKET }}
          VITE_FIREBASE_MESSAGING_SENDER_ID: ${{ secrets.VITE_FIREBASE_MESSAGING_SENDER_ID }}
          VITE_FIREBASE_APP_ID: ${{ secrets.VITE_FIREBASE_APP_ID }}
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

---

## Post-Deployment

### 1. Test Production Site

```bash
# Check if site loads
curl -I https://your-domain.com

# Test API endpoints
curl https://your-domain.com/api/health
```

### 2. Verify Firebase Connection

- Test login functionality
- Verify data loads correctly
- Check console for errors

### 3. Monitor Performance

Use these tools:
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [WebPageTest](https://www.webpagetest.org/)
- [GTmetrix](https://gtmetrix.com/)

### 4. Setup Analytics (Optional)

**Google Analytics**:

```typescript
// src/main.tsx
import ReactGA from 'react-ga4'

ReactGA.initialize('G-XXXXXXXXXX')

// Track page views
ReactGA.send({ hitType: 'pageview', page: window.location.pathname })
```

### 5. Custom Domain

**Vercel**:
1. Go to project settings → Domains
2. Add your custom domain
3. Configure DNS records as instructed

**Netlify**:
1. Go to Domain settings
2. Add custom domain
3. Follow DNS configuration steps

---

## Troubleshooting

### Build Fails

```bash
# Clear cache and reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install
pnpm run build
```

### Environment Variables Not Working

- Ensure variables start with `VITE_`
- Restart dev server after adding variables
- Check platform-specific variable configuration

### 404 on Refresh

Configure your hosting platform to redirect all routes to `index.html`:

**Vercel**: Add `vercel.json`:
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

**Netlify**: Add `_redirects` file in `public/`:
```
/*    /index.html   200
```

---

**Next**: [23-SECURITY.md](./23-SECURITY.md) - Security best practices
