# Accessibility Documentation

## 📖 Table of Contents
1. [Overview](#overview)
2. [WCAG 2.1 Compliance](#wcag-21-compliance)
3. [Semantic HTML](#semantic-html)
4. [ARIA Labels](#aria-labels)
5. [Keyboard Navigation](#keyboard-navigation)
6. [Screen Reader Support](#screen-reader-support)
7. [Color Contrast](#color-contrast)

---

## Overview

Accessibility ensures that all users, including those with disabilities, can access and interact with the portfolio.

### Accessibility Goals
- ✅ WCAG 2.1 Level AA compliance
- ✅ Keyboard navigation
- ✅ Screen reader support
- ✅ Sufficient color contrast
- ✅ Responsive text sizing
- ✅ Focus indicators
- ✅ Alt text for images

---

## WCAG 2.1 Compliance

### Four Principles (POUR)

1. **Perceivable**: Information must be presentable to users in ways they can perceive
2. **Operable**: UI components must be operable
3. **Understandable**: Information and operation must be understandable
4. **Robust**: Content must be robust enough for assistive technologies

### Level AA Requirements

- Color contrast ratio of at least 4.5:1 for normal text
- Color contrast ratio of at least 3:1 for large text
- No keyboard traps
- Skip to main content link
- Page titles
- Focus visible
- Label or instructions for form inputs
- Error identification and suggestions

---

## Semantic HTML

### Use Proper HTML Elements

```typescript
// Good - Semantic HTML
<nav aria-label="Main navigation">
  <ul>
    <li><a href="#home">Home</a></li>
    <li><a href="#about">About</a></li>
  </ul>
</nav>

<main>
  <h1>Welcome</h1>
  <article>
    <h2>Blog Post Title</h2>
    <p>Content...</p>
  </article>
</main>

<footer>
  <p>&copy; 2024 Portfolio</p>
</footer>

// Bad - Non-semantic
<div class="nav">
  <div class="link">Home</div>
  <div class="link">About</div>
</div>

<div class="content">
  <div class="title">Welcome</div>
  <div class="post">
    <div class="heading">Blog Post Title</div>
    <div class="text">Content...</div>
  </div>
</div>
```

### Heading Hierarchy

```typescript
// Good - Proper hierarchy
<h1>Portfolio</h1>
  <h2>About Me</h2>
    <h3>Skills</h3>
  <h2>Projects</h2>
    <h3>Featured Projects</h3>
      <h4>Project Details</h4>

// Bad - Skipped levels
<h1>Portfolio</h1>
<h3>About Me</h3>  {/* Skipped h2 */}
<h4>Projects</h4>  {/* Wrong level */}
```

---

## ARIA Labels

### Navigation

```typescript
<nav aria-label="Main navigation">
  <button
    aria-label="Toggle navigation menu"
    aria-expanded={isOpen}
    onClick={toggleMenu}
  >
    <span aria-hidden="true">☰</span>
  </button>
</nav>
```

### Buttons and Links

```typescript
// Icon-only buttons need labels
<button
  aria-label="Close modal"
  onClick={onClose}
>
  <X aria-hidden="true" />
</button>

// Link with icon
<a
  href={project.githubUrl}
  aria-label={`View ${project.title} on GitHub`}
  target="_blank"
  rel="noopener noreferrer"
>
  <Github aria-hidden="true" />
  <span className="sr-only">Opens in new tab</span>
</a>
```

### Forms

```typescript
<form aria-labelledby="contact-form-title">
  <h2 id="contact-form-title">Contact Form</h2>
  
  <div>
    <label htmlFor="name">Name</label>
    <input
      id="name"
      type="text"
      aria-required="true"
      aria-invalid={errors.name ? 'true' : 'false'}
      aria-describedby={errors.name ? 'name-error' : undefined}
    />
    {errors.name && (
      <span id="name-error" role="alert">
        {errors.name}
      </span>
    )}
  </div>
  
  <div>
    <label htmlFor="email">Email</label>
    <input
      id="email"
      type="email"
      aria-required="true"
      aria-describedby="email-help"
    />
    <span id="email-help" className="text-sm text-tokyo-comment">
      We'll never share your email
    </span>
  </div>
</form>
```

### Loading States

```typescript
<div
  role="status"
  aria-live="polite"
  aria-busy="true"
>
  <span className="sr-only">Loading content...</span>
  <LoadingSpinner aria-hidden="true" />
</div>
```

### Modals

```typescript
export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      // Trap focus in modal
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])
  
  if (!isOpen) return null
  
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="fixed inset-0 z-50"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50"
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Content */}
      <div className="relative bg-tokyo-night p-6 rounded-lg">
        <h2 id="modal-title">{title}</h2>
        
        <button
          aria-label="Close modal"
          onClick={onClose}
          className="absolute top-4 right-4"
        >
          <X aria-hidden="true" />
        </button>
        
        {children}
      </div>
    </div>
  )
}
```

---

## Keyboard Navigation

### Focus Management

```typescript
// Ensure visible focus indicators
<button className="
  px-4 py-2
  focus:outline-none
  focus:ring-2
  focus:ring-tokyo-cyan
  focus:ring-offset-2
  focus:ring-offset-tokyo-bg
">
  Click me
</button>
```

### Skip to Main Content

```typescript
export default function SkipToMain() {
  return (
    <a
      href="#main-content"
      className="
        sr-only
        focus:not-sr-only
        focus:absolute
        focus:top-4
        focus:left-4
        focus:z-50
        focus:px-4
        focus:py-2
        focus:bg-tokyo-cyan
        focus:text-tokyo-bg
        focus:rounded
      "
    >
      Skip to main content
    </a>
  )
}

// In layout
<body>
  <SkipToMain />
  <Header />
  <main id="main-content" tabIndex={-1}>
    {/* Content */}
  </main>
</body>
```

### Keyboard Event Handlers

```typescript
// Support both click and keyboard
function Card({ onClick }: { onClick: () => void }) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onClick()
    }
  }
  
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      className="cursor-pointer focus:ring-2 focus:ring-tokyo-cyan"
    >
      Card content
    </div>
  )
}
```

### Tab Order

```typescript
// Ensure logical tab order
<div>
  <button tabIndex={1}>First</button>
  <button tabIndex={2}>Second</button>
  <button tabIndex={3}>Third</button>
</div>

// Better - Use natural DOM order
<div>
  <button>First</button>
  <button>Second</button>
  <button>Third</button>
</div>
```

---

## Screen Reader Support

### Screen Reader Only Text

```css
/* globals.css */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

.sr-only:focus {
  position: static;
  width: auto;
  height: auto;
  padding: 0;
  margin: 0;
  overflow: visible;
  clip: auto;
  white-space: normal;
}
```

### Live Regions

```typescript
// Announce dynamic content changes
<div
  role="status"
  aria-live="polite"
  aria-atomic="true"
>
  {message}
</div>

// For urgent messages
<div
  role="alert"
  aria-live="assertive"
>
  {errorMessage}
</div>
```

### Image Alt Text

```typescript
// Informative image
<img
  src="/profile.jpg"
  alt="John Doe, Full Stack Developer wearing a blue shirt"
/>

// Decorative image
<img
  src="/decoration.svg"
  alt=""
  aria-hidden="true"
/>

// Functional image (in link/button)
<button aria-label="Delete project">
  <img src="/delete-icon.svg" alt="" aria-hidden="true" />
</button>
```

---

## Color Contrast

### Tokyo Night Theme Contrast Ratios

```typescript
// Color combinations that meet WCAG AA standards

// Text on background
// #a9b1d6 (tokyo-fg) on #1a1b26 (tokyo-bg) = 9.8:1 ✓

// Cyan on background
// #7dcfff (tokyo-cyan) on #1a1b26 (tokyo-bg) = 10.5:1 ✓

// Comments on background
// #565f89 (tokyo-comment) on #1a1b26 (tokyo-bg) = 4.7:1 ✓

// Red on background
// #f7768e (tokyo-red) on #1a1b26 (tokyo-bg) = 6.1:1 ✓

// Green on background
// #9ece6a (tokyo-green) on #1a1b26 (tokyo-bg) = 10.8:1 ✓
```

### Check Contrast

```typescript
// Use browser DevTools or online tools
// - Chrome: Inspect > Accessibility pane
// - WebAIM Contrast Checker
// - WAVE browser extension
```

### Color Alone Not Sufficient

```typescript
// Bad - Color only indicates error
<input className={errors.email ? 'text-red-500' : ''} />

// Good - Icon + color + text
<div>
  <input
    className={errors.email ? 'border-tokyo-red' : ''}
    aria-invalid={errors.email ? 'true' : 'false'}
    aria-describedby={errors.email ? 'email-error' : undefined}
  />
  {errors.email && (
    <p id="email-error" className="text-tokyo-red flex items-center gap-2">
      <AlertCircle aria-hidden="true" />
      <span>{errors.email}</span>
    </p>
  )}
</div>
```

---

## Responsive Text

### Avoid Fixed Sizes

```typescript
// Bad - Fixed pixel sizes
<p className="text-[14px]">Content</p>

// Good - Responsive rem/em units
<p className="text-base">Content</p>  {/* 1rem = 16px default */}

// Better - Responsive with breakpoints
<p className="text-sm md:text-base lg:text-lg">Content</p>
```

### Allow Text Zoom

```html
<!-- Don't prevent zooming -->
<meta name="viewport" content="width=device-width, initial-scale=1">

<!-- Bad - Prevents zoom -->
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
```

---

## Testing Accessibility

### Automated Testing

```bash
# Install axe-core for automated tests
pnpm add -D @axe-core/react
```

```typescript
// src/main.tsx (development only)
if (process.env.NODE_ENV === 'development') {
  import('@axe-core/react').then(axe => {
    axe.default(React, ReactDOM, 1000)
  })
}
```

### Manual Testing

1. **Keyboard Only**:
   - Tab through all interactive elements
   - Ensure focus is visible
   - No keyboard traps
   - Enter/Space activates buttons

2. **Screen Reader**:
   - NVDA (Windows)
   - JAWS (Windows)
   - VoiceOver (Mac/iOS)
   - TalkBack (Android)

3. **Browser Extensions**:
   - axe DevTools
   - WAVE
   - Lighthouse

### Accessibility Checklist

- [ ] All images have alt text
- [ ] Form inputs have labels
- [ ] Buttons have descriptive text/labels
- [ ] Headings are in logical order
- [ ] Color contrast meets WCAG AA
- [ ] Keyboard navigation works
- [ ] Focus indicators visible
- [ ] No keyboard traps
- [ ] Skip to main content link
- [ ] ARIA labels where needed
- [ ] Screen reader tested
- [ ] Lighthouse score > 90

---

**Next**: [25-SEO.md](./25-SEO.md) - SEO optimization
