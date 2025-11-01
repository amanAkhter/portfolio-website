# Forms & Validation in React with TypeScript

> Master type-safe form handling, validation, and user input management

## 📚 Table of Contents
1. [Controlled Components](#controlled-components)
2. [Form Submission](#form-submission)
3. [Validation Patterns](#validation-patterns)
4. [Custom Form Hooks](#custom-form-hooks)
5. [Advanced Forms](#advanced-forms)
6. [Real Portfolio Examples](#real-portfolio-examples)

---

## 🎮 Controlled Components

### Basic Input

```typescript
import { useState, ChangeEvent, FormEvent } from 'react'

const LoginForm = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  
  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
  }
  
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log({ email, password })
  }
  
  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={handleEmailChange}
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button type="submit">Login</button>
    </form>
  )
}
```

### Input Component with Types

```typescript
interface InputProps {
  label: string
  name: string
  type?: 'text' | 'email' | 'password' | 'number'
  value: string
  onChange: (value: string) => void
  error?: string
  placeholder?: string
  required?: boolean
}

const Input: React.FC<InputProps> = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  error,
  placeholder,
  required = false
}) => {
  return (
    <div className="input-group">
      <label htmlFor={name}>
        {label}
        {required && <span className="required">*</span>}
      </label>
      
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={error ? 'input-error' : ''}
        required={required}
      />
      
      {error && <span className="error-message">{error}</span>}
    </div>
  )
}

// Usage
const MyForm = () => {
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState('')
  
  return (
    <Input
      label="Email Address"
      name="email"
      type="email"
      value={email}
      onChange={setEmail}
      error={emailError}
      required
    />
  )
}
```

### Textarea Component

```typescript
interface TextareaProps {
  label: string
  name: string
  value: string
  onChange: (value: string) => void
  error?: string
  placeholder?: string
  rows?: number
  maxLength?: number
}

const Textarea: React.FC<TextareaProps> = ({
  label,
  name,
  value,
  onChange,
  error,
  placeholder,
  rows = 4,
  maxLength
}) => {
  return (
    <div className="textarea-group">
      <label htmlFor={name}>{label}</label>
      
      <textarea
        id={name}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        maxLength={maxLength}
        className={error ? 'textarea-error' : ''}
      />
      
      {maxLength && (
        <span className="character-count">
          {value.length} / {maxLength}
        </span>
      )}
      
      {error && <span className="error-message">{error}</span>}
    </div>
  )
}
```

### Select Component

```typescript
interface SelectOption {
  value: string
  label: string
}

interface SelectProps {
  label: string
  name: string
  value: string
  onChange: (value: string) => void
  options: SelectOption[]
  error?: string
  placeholder?: string
}

const Select: React.FC<SelectProps> = ({
  label,
  name,
  value,
  onChange,
  options,
  error,
  placeholder = 'Select an option'
}) => {
  return (
    <div className="select-group">
      <label htmlFor={name}>{label}</label>
      
      <select
        id={name}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={error ? 'select-error' : ''}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      
      {error && <span className="error-message">{error}</span>}
    </div>
  )
}

// Usage
const ProjectForm = () => {
  const [status, setStatus] = useState('')
  
  const statusOptions: SelectOption[] = [
    { value: 'draft', label: 'Draft' },
    { value: 'published', label: 'Published' },
    { value: 'archived', label: 'Archived' }
  ]
  
  return (
    <Select
      label="Project Status"
      name="status"
      value={status}
      onChange={setStatus}
      options={statusOptions}
    />
  )
}
```

---

## 📝 Form Submission

### Basic Form with State

```typescript
interface FormData {
  name: string
  email: string
  message: string
}

const ContactForm = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    message: ''
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  
  const handleChange = (field: keyof FormData) => (value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }
  
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitError('')
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      
      if (!response.ok) throw new Error('Failed to submit')
      
      // Success!
      alert('Message sent successfully!')
      setFormData({ name: '', email: '', message: '' })
    } catch (error) {
      setSubmitError('Failed to send message. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }
  
  return (
    <form onSubmit={handleSubmit}>
      <Input
        label="Name"
        name="name"
        value={formData.name}
        onChange={handleChange('name')}
      />
      
      <Input
        label="Email"
        name="email"
        type="email"
        value={formData.email}
        onChange={handleChange('email')}
      />
      
      <Textarea
        label="Message"
        name="message"
        value={formData.message}
        onChange={handleChange('message')}
      />
      
      {submitError && <div className="error">{submitError}</div>}
      
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Sending...' : 'Send Message'}
      </button>
    </form>
  )
}
```

### Form with FormData API

```typescript
const FileUploadForm = () => {
  const [file, setFile] = useState<File | null>(null)
  
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    const formData = new FormData(e.currentTarget)
    
    // Add file if selected
    if (file) {
      formData.append('file', file)
    }
    
    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData // No Content-Type header needed
      })
      
      if (!response.ok) throw new Error('Upload failed')
      
      const result = await response.json()
      console.log('Upload success:', result)
    } catch (error) {
      console.error('Upload error:', error)
    }
  }
  
  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="title"
        placeholder="Title"
        required
      />
      
      <input
        type="file"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        accept="image/*"
      />
      
      <button type="submit">Upload</button>
    </form>
  )
}
```

---

## ✅ Validation Patterns

### Client-Side Validation

```typescript
interface ValidationRules {
  required?: boolean
  minLength?: number
  maxLength?: number
  pattern?: RegExp
  custom?: (value: string) => string | undefined
}

const validate = (value: string, rules: ValidationRules): string | undefined => {
  if (rules.required && !value.trim()) {
    return 'This field is required'
  }
  
  if (rules.minLength && value.length < rules.minLength) {
    return `Minimum ${rules.minLength} characters required`
  }
  
  if (rules.maxLength && value.length > rules.maxLength) {
    return `Maximum ${rules.maxLength} characters allowed`
  }
  
  if (rules.pattern && !rules.pattern.test(value)) {
    return 'Invalid format'
  }
  
  if (rules.custom) {
    return rules.custom(value)
  }
  
  return undefined
}

// Usage
const validateEmail = (email: string) => {
  return validate(email, {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    custom: (value) => {
      if (value.includes('+')) {
        return 'Email aliases not allowed'
      }
    }
  })
}

const validatePassword = (password: string) => {
  return validate(password, {
    required: true,
    minLength: 8,
    custom: (value) => {
      if (!/[A-Z]/.test(value)) {
        return 'Password must contain uppercase letter'
      }
      if (!/[a-z]/.test(value)) {
        return 'Password must contain lowercase letter'
      }
      if (!/[0-9]/.test(value)) {
        return 'Password must contain number'
      }
    }
  })
}
```

### Form with Validation

```typescript
interface LoginFormData {
  email: string
  password: string
}

interface FormErrors {
  email?: string
  password?: string
}

const LoginForm = () => {
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: ''
  })
  
  const [errors, setErrors] = useState<FormErrors>({})
  const [touched, setTouched] = useState<Record<keyof LoginFormData, boolean>>({
    email: false,
    password: false
  })
  
  const validateField = (name: keyof LoginFormData, value: string) => {
    switch (name) {
      case 'email':
        return validateEmail(value)
      case 'password':
        return validatePassword(value)
      default:
        return undefined
    }
  }
  
  const handleChange = (name: keyof LoginFormData) => (value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Validate if field has been touched
    if (touched[name]) {
      const error = validateField(name, value)
      setErrors(prev => ({ ...prev, [name]: error }))
    }
  }
  
  const handleBlur = (name: keyof LoginFormData) => () => {
    setTouched(prev => ({ ...prev, [name]: true }))
    
    const error = validateField(name, formData[name])
    setErrors(prev => ({ ...prev, [name]: error }))
  }
  
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    // Validate all fields
    const newErrors: FormErrors = {
      email: validateField('email', formData.email),
      password: validateField('password', formData.password)
    }
    
    setErrors(newErrors)
    setTouched({ email: true, password: true })
    
    // Check if any errors
    if (Object.values(newErrors).some(error => error)) {
      return
    }
    
    // Submit form
    console.log('Form is valid:', formData)
  }
  
  return (
    <form onSubmit={handleSubmit}>
      <Input
        label="Email"
        name="email"
        type="email"
        value={formData.email}
        onChange={handleChange('email')}
        onBlur={handleBlur('email')}
        error={touched.email ? errors.email : undefined}
        required
      />
      
      <Input
        label="Password"
        name="password"
        type="password"
        value={formData.password}
        onChange={handleChange('password')}
        onBlur={handleBlur('password')}
        error={touched.password ? errors.password : undefined}
        required
      />
      
      <button type="submit">Login</button>
    </form>
  )
}
```

### Async Validation

```typescript
const useAsyncValidation = (
  value: string,
  validator: (value: string) => Promise<string | undefined>,
  delay = 500
) => {
  const [error, setError] = useState<string>()
  const [isValidating, setIsValidating] = useState(false)
  
  useEffect(() => {
    if (!value) {
      setError(undefined)
      return
    }
    
    setIsValidating(true)
    
    const timer = setTimeout(async () => {
      try {
        const errorMessage = await validator(value)
        setError(errorMessage)
      } catch (err) {
        setError('Validation failed')
      } finally {
        setIsValidating(false)
      }
    }, delay)
    
    return () => clearTimeout(timer)
  }, [value, validator, delay])
  
  return { error, isValidating }
}

// Usage: Check if username is available
const checkUsernameAvailable = async (username: string) => {
  const response = await fetch(`/api/users/check?username=${username}`)
  const { available } = await response.json()
  
  if (!available) {
    return 'Username is already taken'
  }
  
  return undefined
}

const SignupForm = () => {
  const [username, setUsername] = useState('')
  
  const { error: usernameError, isValidating } = useAsyncValidation(
    username,
    checkUsernameAvailable
  )
  
  return (
    <div>
      <Input
        label="Username"
        name="username"
        value={username}
        onChange={setUsername}
        error={usernameError}
      />
      {isValidating && <span>Checking availability...</span>}
    </div>
  )
}
```

---

## 🎣 Custom Form Hooks

### useForm Hook

```typescript
interface UseFormOptions<T> {
  initialValues: T
  validate?: (values: T) => Partial<Record<keyof T, string>>
  onSubmit: (values: T) => void | Promise<void>
}

function useForm<T extends Record<string, any>>({
  initialValues,
  validate,
  onSubmit
}: UseFormOptions<T>) {
  const [values, setValues] = useState<T>(initialValues)
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({})
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const handleChange = (name: keyof T) => (value: any) => {
    setValues(prev => ({ ...prev, [name]: value }))
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }
  
  const handleBlur = (name: keyof T) => () => {
    setTouched(prev => ({ ...prev, [name]: true }))
    
    // Run validation on blur
    if (validate) {
      const validationErrors = validate(values)
      if (validationErrors[name]) {
        setErrors(prev => ({ ...prev, [name]: validationErrors[name] }))
      }
    }
  }
  
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    // Mark all as touched
    const allTouched = Object.keys(values).reduce(
      (acc, key) => ({ ...acc, [key]: true }),
      {}
    )
    setTouched(allTouched)
    
    // Validate
    if (validate) {
      const validationErrors = validate(values)
      setErrors(validationErrors)
      
      if (Object.keys(validationErrors).length > 0) {
        return
      }
    }
    
    // Submit
    setIsSubmitting(true)
    try {
      await onSubmit(values)
    } finally {
      setIsSubmitting(false)
    }
  }
  
  const reset = () => {
    setValues(initialValues)
    setErrors({})
    setTouched({})
  }
  
  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    reset
  }
}

// Usage
interface ContactFormData {
  name: string
  email: string
  message: string
}

const ContactForm = () => {
  const form = useForm<ContactFormData>({
    initialValues: {
      name: '',
      email: '',
      message: ''
    },
    validate: (values) => {
      const errors: Partial<Record<keyof ContactFormData, string>> = {}
      
      if (!values.name) errors.name = 'Name is required'
      if (!values.email) errors.email = 'Email is required'
      if (!values.message) errors.message = 'Message is required'
      
      return errors
    },
    onSubmit: async (values) => {
      await fetch('/api/contact', {
        method: 'POST',
        body: JSON.stringify(values)
      })
      alert('Message sent!')
      form.reset()
    }
  })
  
  return (
    <form onSubmit={form.handleSubmit}>
      <Input
        label="Name"
        name="name"
        value={form.values.name}
        onChange={form.handleChange('name')}
        onBlur={form.handleBlur('name')}
        error={form.touched.name ? form.errors.name : undefined}
      />
      
      <Input
        label="Email"
        name="email"
        type="email"
        value={form.values.email}
        onChange={form.handleChange('email')}
        onBlur={form.handleBlur('email')}
        error={form.touched.email ? form.errors.email : undefined}
      />
      
      <Textarea
        label="Message"
        name="message"
        value={form.values.message}
        onChange={form.handleChange('message')}
        onBlur={form.handleBlur('message')}
        error={form.touched.message ? form.errors.message : undefined}
      />
      
      <button type="submit" disabled={form.isSubmitting}>
        {form.isSubmitting ? 'Sending...' : 'Send'}
      </button>
    </form>
  )
}
```

---

## 🚀 Advanced Forms

### Multi-Step Form

```typescript
interface Step1Data {
  email: string
  password: string
}

interface Step2Data {
  firstName: string
  lastName: string
}

interface Step3Data {
  bio: string
  website: string
}

type SignupData = Step1Data & Step2Data & Step3Data

const MultiStepSignup = () => {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<Partial<SignupData>>({})
  
  const updateData = (data: Partial<SignupData>) => {
    setFormData(prev => ({ ...prev, ...data }))
  }
  
  const nextStep = () => setCurrentStep(prev => prev + 1)
  const prevStep = () => setCurrentStep(prev => prev - 1)
  
  const handleSubmit = async () => {
    await fetch('/api/signup', {
      method: 'POST',
      body: JSON.stringify(formData)
    })
  }
  
  return (
    <div>
      <div className="progress-bar">
        Step {currentStep} of 3
      </div>
      
      {currentStep === 1 && (
        <Step1
          data={formData}
          onNext={(data) => {
            updateData(data)
            nextStep()
          }}
        />
      )}
      
      {currentStep === 2 && (
        <Step2
          data={formData}
          onNext={(data) => {
            updateData(data)
            nextStep()
          }}
          onPrev={prevStep}
        />
      )}
      
      {currentStep === 3 && (
        <Step3
          data={formData}
          onSubmit={(data) => {
            updateData(data)
            handleSubmit()
          }}
          onPrev={prevStep}
        />
      )}
    </div>
  )
}
```

### Dynamic Fields

```typescript
interface SkillInput {
  id: string
  name: string
  level: number
}

const SkillsForm = () => {
  const [skills, setSkills] = useState<SkillInput[]>([
    { id: '1', name: '', level: 1 }
  ])
  
  const addSkill = () => {
    setSkills(prev => [
      ...prev,
      { id: Date.now().toString(), name: '', level: 1 }
    ])
  }
  
  const removeSkill = (id: string) => {
    setSkills(prev => prev.filter(skill => skill.id !== id))
  }
  
  const updateSkill = (id: string, field: keyof SkillInput, value: any) => {
    setSkills(prev =>
      prev.map(skill =>
        skill.id === id ? { ...skill, [field]: value } : skill
      )
    )
  }
  
  return (
    <div>
      {skills.map((skill) => (
        <div key={skill.id} className="skill-input">
          <input
            type="text"
            value={skill.name}
            onChange={(e) => updateSkill(skill.id, 'name', e.target.value)}
            placeholder="Skill name"
          />
          
          <input
            type="range"
            min="1"
            max="5"
            value={skill.level}
            onChange={(e) => updateSkill(skill.id, 'level', Number(e.target.value))}
          />
          
          <button onClick={() => removeSkill(skill.id)}>Remove</button>
        </div>
      ))}
      
      <button onClick={addSkill}>Add Skill</button>
    </div>
  )
}
```

---

## 🎯 Real Portfolio Examples

### Project Form (Admin Panel)

```typescript
interface ProjectFormData {
  name: string
  shortDescription: string
  description: string
  technologies: string[]
  coverImage: string
  demoUrl?: string
  repoUrl?: string
  status: 'draft' | 'published'
}

const ProjectForm: React.FC<{
  initialData?: ProjectFormData
  onSubmit: (data: ProjectFormData) => Promise<void>
}> = ({ initialData, onSubmit }) => {
  const form = useForm<ProjectFormData>({
    initialValues: initialData || {
      name: '',
      shortDescription: '',
      description: '',
      technologies: [],
      coverImage: '',
      status: 'draft'
    },
    validate: (values) => {
      const errors: Partial<Record<keyof ProjectFormData, string>> = {}
      
      if (!values.name) {
        errors.name = 'Project name is required'
      }
      
      if (!values.shortDescription) {
        errors.shortDescription = 'Short description is required'
      } else if (values.shortDescription.length > 100) {
        errors.shortDescription = 'Maximum 100 characters'
      }
      
      if (!values.description) {
        errors.description = 'Description is required'
      }
      
      if (values.technologies.length === 0) {
        errors.technologies = 'Add at least one technology'
      }
      
      return errors
    },
    onSubmit
  })
  
  return (
    <form onSubmit={form.handleSubmit} className="project-form">
      <Input
        label="Project Name"
        name="name"
        value={form.values.name}
        onChange={form.handleChange('name')}
        onBlur={form.handleBlur('name')}
        error={form.touched.name ? form.errors.name : undefined}
        required
      />
      
      <Input
        label="Short Description"
        name="shortDescription"
        value={form.values.shortDescription}
        onChange={form.handleChange('shortDescription')}
        onBlur={form.handleBlur('shortDescription')}
        error={form.touched.shortDescription ? form.errors.shortDescription : undefined}
        placeholder="Brief one-line description"
        required
      />
      
      <Textarea
        label="Full Description"
        name="description"
        value={form.values.description}
        onChange={form.handleChange('description')}
        onBlur={form.handleBlur('description')}
        error={form.touched.description ? form.errors.description : undefined}
        rows={6}
        required
      />
      
      <Input
        label="Cover Image URL"
        name="coverImage"
        value={form.values.coverImage}
        onChange={form.handleChange('coverImage')}
        placeholder="https://..."
      />
      
      <Input
        label="Demo URL"
        name="demoUrl"
        value={form.values.demoUrl || ''}
        onChange={form.handleChange('demoUrl')}
        placeholder="https://..."
      />
      
      <Input
        label="Repository URL"
        name="repoUrl"
        value={form.values.repoUrl || ''}
        onChange={form.handleChange('repoUrl')}
        placeholder="https://github.com/..."
      />
      
      <Select
        label="Status"
        name="status"
        value={form.values.status}
        onChange={form.handleChange('status')}
        options={[
          { value: 'draft', label: 'Draft' },
          { value: 'published', label: 'Published' }
        ]}
      />
      
      <button type="submit" disabled={form.isSubmitting}>
        {form.isSubmitting ? 'Saving...' : 'Save Project'}
      </button>
    </form>
  )
}
```

### Admin Login Form

```typescript
interface LoginFormData {
  email: string
  password: string
}

const AdminLoginForm = () => {
  const navigate = useNavigate()
  const { login } = useAuthStore()
  const [error, setError] = useState('')
  
  const form = useForm<LoginFormData>({
    initialValues: {
      email: '',
      password: ''
    },
    validate: (values) => {
      const errors: Partial<Record<keyof LoginFormData, string>> = {}
      
      if (!values.email) {
        errors.email = 'Email is required'
      } else if (!/\S+@\S+\.\S+/.test(values.email)) {
        errors.email = 'Invalid email address'
      }
      
      if (!values.password) {
        errors.password = 'Password is required'
      } else if (values.password.length < 6) {
        errors.password = 'Password must be at least 6 characters'
      }
      
      return errors
    },
    onSubmit: async (values) => {
      try {
        setError('')
        await login(values.email, values.password)
        navigate('/admin')
      } catch (err) {
        setError('Invalid credentials. Please try again.')
      }
    }
  })
  
  return (
    <div className="login-container">
      <h1>Admin Login</h1>
      
      <form onSubmit={form.handleSubmit}>
        <Input
          label="Email"
          name="email"
          type="email"
          value={form.values.email}
          onChange={form.handleChange('email')}
          onBlur={form.handleBlur('email')}
          error={form.touched.email ? form.errors.email : undefined}
          placeholder="admin@example.com"
          required
        />
        
        <Input
          label="Password"
          name="password"
          type="password"
          value={form.values.password}
          onChange={form.handleChange('password')}
          onBlur={form.handleBlur('password')}
          error={form.touched.password ? form.errors.password : undefined}
          required
        />
        
        {error && (
          <div className="error-banner">{error}</div>
        )}
        
        <button
          type="submit"
          disabled={form.isSubmitting}
          className="btn-primary"
        >
          {form.isSubmitting ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  )
}
```

---

## ✅ Best Practices

1. **Always use controlled components** for form inputs
2. **Validate on blur** to avoid annoying users while typing
3. **Show errors only after touched** to improve UX
4. **Disable submit button** during submission
5. **Use TypeScript** for type-safe form data
6. **Debounce async validation** to reduce API calls
7. **Reset form** after successful submission
8. **Provide clear error messages** to users
9. **Use proper input types** (email, number, tel, etc.)
10. **Implement proper accessibility** (labels, aria attributes)

---

## 🚫 Anti-Patterns

```typescript
// ❌ Uncontrolled component (no state)
<input type="text" />

// ✅ Controlled component
<input type="text" value={value} onChange={(e) => setValue(e.target.value)} />

// ❌ Showing errors immediately
{errors.email && <span>{errors.email}</span>}

// ✅ Show errors only after field is touched
{touched.email && errors.email && <span>{errors.email}</span>}

// ❌ Not preventing default on submit
<form onSubmit={handleSubmit}>

// ✅ Prevent default behavior
<form onSubmit={(e) => { e.preventDefault(); handleSubmit() }}>

// ❌ Direct DOM manipulation
document.getElementById('email').value = ''

// ✅ Use state
setEmail('')
```

---

## 🎓 Practice Exercises

1. Build a signup form with password confirmation
2. Create a search form with debounced API calls
3. Implement a multi-step checkout form
4. Build a dynamic form with add/remove fields
5. Create a file upload form with preview

---

**Next:** [Context API & Props Drilling →](./10-CONTEXT-API.md)
