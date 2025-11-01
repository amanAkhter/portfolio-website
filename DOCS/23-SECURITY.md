# Security Documentation

## 📖 Table of Contents
1. [Overview](#overview)
2. [Firebase Security Rules](#firebase-security-rules)
3. [Authentication Security](#authentication-security)
4. [XSS Prevention](#xss-prevention)
5. [CSRF Protection](#csrf-protection)
6. [Input Validation](#input-validation)
7. [Environment Variables](#environment-variables)

---

## Overview

Security is critical for protecting user data and preventing unauthorized access to admin functionalities.

### Security Priorities
- ✅ Secure authentication
- ✅ Protected routes
- ✅ Input validation
- ✅ XSS prevention
- ✅ CSRF protection
- ✅ Secure API communication
- ✅ Environment variable protection

---

## Firebase Security Rules

### Firestore Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper function to check authentication
    function isAuthenticated() {
      return request.auth != null;
    }
    
    // Helper function to check if user is admin
    function isAdmin() {
      return isAuthenticated() && 
             request.auth.token.email == 'admin@yourdomain.com';
    }
    
    // Helper function to validate data
    function isValidData(data) {
      return data.keys().hasAll(['title', 'description']) &&
             data.title is string &&
             data.title.size() > 0 &&
             data.title.size() <= 200;
    }
    
    // Home data - read public, write admin only
    match /home/{document} {
      allow read: if true;
      allow write: if isAdmin();
    }
    
    // About data - read public, write admin only
    match /about/{document} {
      allow read: if true;
      allow write: if isAdmin();
    }
    
    // Projects - read public, write admin only with validation
    match /projects/{projectId} {
      allow read: if true;
      allow create: if isAdmin() && isValidData(request.resource.data);
      allow update: if isAdmin() && isValidData(request.resource.data);
      allow delete: if isAdmin();
    }
    
    // Experience - read public, write admin only
    match /experience/{experienceId} {
      allow read: if true;
      allow write: if isAdmin();
    }
    
    // Skills - read public, write admin only
    match /skills/{skillId} {
      allow read: if true;
      allow write: if isAdmin();
    }
    
    // Certifications - read public, write admin only
    match /certifications/{certificationId} {
      allow read: if true;
      allow write: if isAdmin();
    }
    
    // Education - read public, write admin only
    match /education/{educationId} {
      allow read: if true;
      allow write: if isAdmin();
    }
    
    // Contact submissions - create public, read/update/delete admin only
    match /contact/{contactId} {
      allow read, update, delete: if isAdmin();
      allow create: if true && isValidContactData(request.resource.data);
    }
    
    // Validate contact form data
    function isValidContactData(data) {
      return data.keys().hasAll(['name', 'email', 'message']) &&
             data.name is string &&
             data.name.size() > 0 &&
             data.name.size() <= 100 &&
             data.email is string &&
             data.email.matches('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$') &&
             data.message is string &&
             data.message.size() > 0 &&
             data.message.size() <= 5000;
    }
    
    // Deny all other collections
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

### Storage Rules

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    
    // Helper function
    function isAdmin() {
      return request.auth != null && 
             request.auth.token.email == 'admin@yourdomain.com';
    }
    
    // Images - read public, write admin only
    match /images/{imageId} {
      allow read: if true;
      allow write: if isAdmin() &&
                   request.resource.size < 5 * 1024 * 1024 && // Max 5MB
                   request.resource.contentType.matches('image/.*');
    }
    
    // Documents - read public, write admin only
    match /documents/{docId} {
      allow read: if true;
      allow write: if isAdmin() &&
                   request.resource.size < 10 * 1024 * 1024; // Max 10MB
    }
  }
}
```

---

## Authentication Security

### Secure Password Requirements

```typescript
// Enforce strong passwords
export function validatePassword(password: string): string | null {
  if (password.length < 8) {
    return 'Password must be at least 8 characters long'
  }
  
  if (!/[A-Z]/.test(password)) {
    return 'Password must contain at least one uppercase letter'
  }
  
  if (!/[a-z]/.test(password)) {
    return 'Password must contain at least one lowercase letter'
  }
  
  if (!/[0-9]/.test(password)) {
    return 'Password must contain at least one number'
  }
  
  if (!/[!@#$%^&*]/.test(password)) {
    return 'Password must contain at least one special character'
  }
  
  return null
}
```

### Session Management

```typescript
import { useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useNavigate } from 'react-router-dom'

export function useSessionTimeout(timeoutMinutes: number = 30) {
  const { logout } = useAuth()
  const navigate = useNavigate()
  
  useEffect(() => {
    let timeout: NodeJS.Timeout
    
    const resetTimeout = () => {
      clearTimeout(timeout)
      timeout = setTimeout(() => {
        logout()
        navigate('/admin/login', { 
          state: { message: 'Session expired due to inactivity' }
        })
      }, timeoutMinutes * 60 * 1000)
    }
    
    // Reset on user activity
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart']
    events.forEach(event => {
      document.addEventListener(event, resetTimeout)
    })
    
    resetTimeout()
    
    return () => {
      clearTimeout(timeout)
      events.forEach(event => {
        document.removeEventListener(event, resetTimeout)
      })
    }
  }, [timeoutMinutes, logout, navigate])
}
```

### Rate Limiting

```typescript
// Simple client-side rate limiting
class RateLimiter {
  private attempts: Map<string, number[]> = new Map()
  
  canAttempt(key: string, maxAttempts: number, windowMs: number): boolean {
    const now = Date.now()
    const attempts = this.attempts.get(key) || []
    
    // Remove old attempts
    const recentAttempts = attempts.filter(time => now - time < windowMs)
    
    if (recentAttempts.length >= maxAttempts) {
      return false
    }
    
    recentAttempts.push(now)
    this.attempts.set(key, recentAttempts)
    return true
  }
}

const loginRateLimiter = new RateLimiter()

// Usage in login
export async function login(email: string, password: string) {
  if (!loginRateLimiter.canAttempt(email, 5, 15 * 60 * 1000)) {
    throw new Error('Too many login attempts. Please try again later.')
  }
  
  // Proceed with login
}
```

---

## XSS Prevention

### Sanitize User Input

```typescript
import DOMPurify from 'dompurify'

// Sanitize HTML content
export function sanitizeHTML(dirty: string): string {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br'],
    ALLOWED_ATTR: ['href', 'title']
  })
}

// Usage in component
function BlogPost({ content }: { content: string }) {
  return (
    <div 
      dangerouslySetInnerHTML={{ 
        __html: sanitizeHTML(content) 
      }} 
    />
  )
}
```

### Safe String Rendering

```typescript
// Never use dangerouslySetInnerHTML with unsanitized input
// Good
<div>{userInput}</div>

// Bad
<div dangerouslySetInnerHTML={{ __html: userInput }} />

// If you must use HTML, sanitize first
<div dangerouslySetInnerHTML={{ __html: sanitizeHTML(userInput) }} />
```

### Content Security Policy

```html
<!-- index.html -->
<meta 
  http-equiv="Content-Security-Policy" 
  content="
    default-src 'self';
    script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.gstatic.com;
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
    img-src 'self' data: https:;
    font-src 'self' https://fonts.gstatic.com;
    connect-src 'self' https://*.firebaseio.com https://*.googleapis.com;
  "
/>
```

---

## CSRF Protection

### Firebase Auth Tokens

Firebase automatically includes CSRF protection with ID tokens:

```typescript
import { getIdToken } from 'firebase/auth'
import { auth } from './config'

// Get current user's ID token
async function makeAuthenticatedRequest(url: string, data: any) {
  const user = auth.currentUser
  if (!user) throw new Error('Not authenticated')
  
  const token = await getIdToken(user)
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  
  return response.json()
}
```

---

## Input Validation

### Form Validation

```typescript
// Validation schemas
export const contactFormSchema = {
  name: (value: string) => {
    if (!value) return 'Name is required'
    if (value.length < 2) return 'Name must be at least 2 characters'
    if (value.length > 100) return 'Name must be less than 100 characters'
    if (!/^[a-zA-Z\s'-]+$/.test(value)) return 'Name contains invalid characters'
    return null
  },
  
  email: (value: string) => {
    if (!value) return 'Email is required'
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    if (!emailRegex.test(value)) return 'Invalid email address'
    return null
  },
  
  message: (value: string) => {
    if (!value) return 'Message is required'
    if (value.length < 10) return 'Message must be at least 10 characters'
    if (value.length > 5000) return 'Message must be less than 5000 characters'
    return null
  }
}

// Usage
function validateContactForm(data: ContactFormData) {
  const errors: Record<string, string> = {}
  
  Object.keys(contactFormSchema).forEach(key => {
    const validator = contactFormSchema[key as keyof typeof contactFormSchema]
    const error = validator(data[key as keyof ContactFormData])
    if (error) errors[key] = error
  })
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}
```

### Sanitize File Uploads

```typescript
export function validateFileUpload(file: File): string | null {
  // Check file size (5MB max)
  const maxSize = 5 * 1024 * 1024
  if (file.size > maxSize) {
    return 'File size must be less than 5MB'
  }
  
  // Check file type
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
  if (!allowedTypes.includes(file.type)) {
    return 'Only JPEG, PNG, WebP, and GIF images are allowed'
  }
  
  // Check file extension
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif']
  const extension = file.name.toLowerCase().slice(file.name.lastIndexOf('.'))
  if (!allowedExtensions.includes(extension)) {
    return 'Invalid file extension'
  }
  
  return null
}
```

---

## Environment Variables

### Secure Configuration

```env
# .env
VITE_FIREBASE_API_KEY=AIzaSyC...
VITE_FIREBASE_AUTH_DOMAIN=your-app.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-app
VITE_FIREBASE_STORAGE_BUCKET=your-app.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123

# Never commit these to version control!
```

### .gitignore

```gitignore
# Environment variables
.env
.env.local
.env.production
.env.*.local

# Firebase
.firebase/
.firebaserc
firebase-debug.log*

# Sensitive files
*.key
*.pem
secrets.json
```

### Accessing Environment Variables

```typescript
// src/infrastructure/firebase/config.ts
export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
}

// Validate configuration
if (!firebaseConfig.apiKey) {
  throw new Error('Missing Firebase API key')
}
```

---

## HTTPS Only

### Force HTTPS in Production

```typescript
// vite.config.ts
export default defineConfig({
  server: {
    https: process.env.NODE_ENV === 'production'
  }
})
```

### Redirect HTTP to HTTPS

```typescript
// Add to main.tsx or App.tsx
useEffect(() => {
  if (
    window.location.protocol === 'http:' &&
    window.location.hostname !== 'localhost'
  ) {
    window.location.href = window.location.href.replace('http:', 'https:')
  }
}, [])
```

---

## Security Headers

### Netlify Configuration

```toml
# netlify.toml
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    X-XSS-Protection = "1; mode=block"
    Referrer-Policy = "strict-origin-when-cross-origin"
    Permissions-Policy = "geolocation=(), microphone=(), camera=()"
    Strict-Transport-Security = "max-age=31536000; includeSubDomains; preload"
```

---

## Security Checklist

- [ ] Firebase Security Rules implemented
- [ ] Authentication with strong passwords
- [ ] Protected routes for admin panel
- [ ] Input validation on all forms
- [ ] XSS prevention with sanitization
- [ ] CSRF protection with auth tokens
- [ ] Environment variables secured
- [ ] HTTPS enforced in production
- [ ] Security headers configured
- [ ] File upload validation
- [ ] Rate limiting on login
- [ ] Session timeout implemented
- [ ] Regular security audits

---

**Next**: [24-ACCESSIBILITY.md](./24-ACCESSIBILITY.md) - Accessibility guide
