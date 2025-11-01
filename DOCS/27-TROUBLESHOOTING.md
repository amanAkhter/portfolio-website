# Troubleshooting Guide

## 📖 Table of Contents
1. [Common Issues](#common-issues)
2. [Firebase Issues](#firebase-issues)
3. [Build Problems](#build-problems)
4. [Deployment Issues](#deployment-issues)
5. [Performance Issues](#performance-issues)

---

## Common Issues

### Port Already in Use

**Problem**: `Error: Port 5173 is already in use`

**Solutions**:
```bash
# Option 1: Kill process using the port (Windows PowerShell)
Get-Process -Id (Get-NetTCPConnection -LocalPort 5173).OwningProcess | Stop-Process

# Option 2: Use a different port
pnpm dev -- --port 3000

# Option 3: Change default port in vite.config.ts
export default defineConfig({
  server: {
    port: 3000
  }
})
```

---

### Module Not Found

**Problem**: `Cannot find module 'xyz'`

**Solutions**:
```bash
# Clear node_modules and reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install

# Clear Vite cache
rm -rf node_modules/.vite

# Restart TypeScript server in VS Code
# Ctrl+Shift+P → "TypeScript: Restart TS Server"
```

---

### TypeScript Errors

**Problem**: Type errors after updating packages

**Solutions**:
```bash
# Update TypeScript
pnpm add -D typescript@latest

# Regenerate types
pnpm exec tsc --noEmit

# Check tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "skipLibCheck": true  // Skip type checking of declaration files
  }
}
```

---

### Import Path Issues

**Problem**: Module resolution errors

**Solutions**:
```typescript
// Use path aliases in tsconfig.json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@/components/*": ["src/presentation/components/*"],
      "@/hooks/*": ["src/presentation/hooks/*"]
    }
  }
}

// Update vite.config.ts
import path from 'path'

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
})
```

---

## Firebase Issues

### Authentication Errors

**Problem**: `Firebase: Error (auth/configuration-not-found)`

**Solutions**:
```typescript
// Verify Firebase config
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  // ... other config
}

// Check .env file exists
// Check environment variables are prefixed with VITE_
// Restart dev server after adding env variables
```

**Problem**: `Firebase: Error (auth/unauthorized-domain)`

**Solutions**:
1. Go to Firebase Console
2. Authentication → Settings
3. Add your domain to "Authorized domains"
4. Add: `localhost`, `yourdomain.com`, `your-app.vercel.app`

---

### Firestore Permission Denied

**Problem**: `FirebaseError: Missing or insufficient permissions`

**Solutions**:
```javascript
// Check Firestore Rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read for everyone
    match /{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}

// Verify authentication
const user = auth.currentUser
if (!user) {
  console.error('User not authenticated')
}
```

---

### Firebase Not Initialized

**Problem**: `Firebase: No Firebase App '[DEFAULT]' has been created`

**Solutions**:
```typescript
// Ensure Firebase is initialized before use
// src/infrastructure/firebase/config.ts
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)

// Import in main.tsx before rendering
import './infrastructure/firebase/config'
```

---

## Build Problems

### Build Fails with Memory Error

**Problem**: `JavaScript heap out of memory`

**Solutions**:
```bash
# Increase Node memory limit
export NODE_OPTIONS="--max-old-space-size=4096"
pnpm build

# Or in package.json
{
  "scripts": {
    "build": "NODE_OPTIONS='--max-old-space-size=4096' vite build"
  }
}
```

---

### Dependency Conflicts

**Problem**: Peer dependency warnings

**Solutions**:
```bash
# Use --force flag (use cautiously)
pnpm install --force

# Or use legacy peer deps
pnpm install --legacy-peer-deps

# Check for conflicting versions
pnpm list <package-name>
```

---

### CSS Not Loading

**Problem**: Styles not appearing in production

**Solutions**:
```typescript
// Ensure CSS is imported in main.tsx
import './index.css'
import './App.css'

// Check PostCSS config
// postcss.config.js
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {}
  }
}

// Verify Tailwind config
// tailwind.config.js
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ]
}
```

---

## Deployment Issues

### Vercel Deployment Fails

**Problem**: Build fails on Vercel

**Solutions**:
```bash
# Check Node version
# Vercel → Project Settings → General → Node.js Version
# Use Node 18.x or 20.x

# Check build command
# Build Command: pnpm build
# Output Directory: dist

# Check environment variables
# Vercel → Project Settings → Environment Variables
# Add all VITE_* variables
```

---

### 404 on Page Refresh

**Problem**: React Router routes return 404 on direct access

**Solutions**:
```toml
# Netlify - netlify.toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

# Vercel - vercel.json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/" }
  ]
}

# Firebase - firebase.json
{
  "hosting": {
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

---

### Environment Variables Not Working

**Problem**: `import.meta.env.VITE_* is undefined`

**Solutions**:
```bash
# Verify variables are prefixed with VITE_
VITE_FIREBASE_API_KEY=xxx  # ✓ Correct
FIREBASE_API_KEY=xxx        # ✗ Wrong

# Add to deployment platform
# Vercel: Settings → Environment Variables
# Netlify: Site settings → Environment variables
# Check "Production" is selected

# Rebuild after adding variables
```

---

## Performance Issues

### Slow Initial Load

**Solutions**:
```typescript
// 1. Code splitting
const AdminPage = lazy(() => import('./pages/AdminPage'))

// 2. Image optimization
<img src="/image.webp" loading="lazy" />

// 3. Bundle analysis
pnpm add -D rollup-plugin-visualizer
// Check bundle size and optimize

// 4. Reduce dependencies
// Remove unused packages
pnpm remove <package>

// 5. Enable compression
// Most hosting platforms do this automatically
```

---

### Memory Leaks

**Problem**: App slows down over time

**Solutions**:
```typescript
// Always cleanup effects
useEffect(() => {
  const subscription = service.subscribe()
  
  return () => {
    subscription.unsubscribe()  // ✓ Cleanup
  }
}, [])

// Cancel pending requests
useEffect(() => {
  const controller = new AbortController()
  
  fetch('/api/data', { signal: controller.signal })
  
  return () => {
    controller.abort()  // ✓ Cancel on unmount
  }
}, [])

// Clear timers
useEffect(() => {
  const timer = setTimeout(() => {}, 1000)
  
  return () => {
    clearTimeout(timer)  // ✓ Clear timer
  }
}, [])
```

---

### Animations Janky

**Solutions**:
```typescript
// Use CSS transforms instead of position
// Good
<motion.div animate={{ x: 100 }} />

// Bad
<motion.div animate={{ left: '100px' }} />

// Use will-change for better performance
.animated {
  will-change: transform, opacity;
}

// Reduce particle count
const particleCount = Math.min(
  100,
  Math.floor((window.innerWidth * window.innerHeight) / 20000)
)

// Use requestAnimationFrame properly
const animate = () => {
  // Animation logic
  requestId = requestAnimationFrame(animate)
}

// Cleanup
return () => {
  if (requestId) {
    cancelAnimationFrame(requestId)
  }
}
```

---

## Development Issues

### Hot Reload Not Working

**Solutions**:
```bash
# Clear Vite cache
rm -rf node_modules/.vite

# Check vite.config.ts
export default defineConfig({
  server: {
    watch: {
      usePolling: true  // For Docker/WSL
    }
  }
})

# Restart dev server
pnpm dev
```

---

### ESLint Errors

**Solutions**:
```bash
# Update ESLint config
pnpm add -D @typescript-eslint/eslint-plugin @typescript-eslint/parser

# Fix auto-fixable errors
pnpm exec eslint . --fix

# Disable rules if needed
// eslint.config.js
export default {
  rules: {
    '@typescript-eslint/no-explicit-any': 'warn'
  }
}
```

---

## Getting Help

### Debug Mode

```typescript
// Enable debug logs
localStorage.setItem('debug', 'portfolio:*')

// Log component renders
useEffect(() => {
  console.log('Component rendered:', props)
}, [props])

// Check Firebase connection
console.log('Firebase initialized:', app.name)
console.log('Current user:', auth.currentUser)
```

### Useful Commands

```bash
# Check package versions
pnpm list

# Audit dependencies
pnpm audit

# Update dependencies
pnpm update

# Clean install
rm -rf node_modules pnpm-lock.yaml
pnpm install

# Check TypeScript errors
pnpm exec tsc --noEmit

# Build for production
pnpm build

# Preview production build
pnpm preview
```

---

**Next**: [28-FAQ.md](./28-FAQ.md) - Frequently asked questions
