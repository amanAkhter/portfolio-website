# Installation & Setup Guide

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

### Required Software
```bash
Node.js >= 18.0.0
pnpm >= 8.0.0 (or npm/yarn)
Git
```

### Verify Installations
```powershell
# Check Node.js version
node --version  # Should show v18.x.x or higher

# Check pnpm version
pnpm --version  # Should show 8.x.x or higher

# Check Git
git --version
```

### Install pnpm (if not installed)
```powershell
# Using npm
npm install -g pnpm

# Or using winget (Windows)
winget install pnpm

# Or using Chocolatey
choco install pnpm
```

## 🔧 Firebase Setup

### 1. Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add Project"
3. Enter project name (e.g., "portfolio-yourname")
4. Follow the setup wizard

### 2. Enable Required Services

#### Firestore Database
1. Navigate to "Firestore Database"
2. Click "Create database"
3. Choose "Start in production mode"
4. Select your region
5. Click "Enable"

#### Authentication
1. Navigate to "Authentication"
2. Click "Get started"
3. Enable "Email/Password" sign-in method

#### Storage (Optional)
1. Navigate to "Storage"
2. Click "Get started"
3. Use default security rules
4. Choose your region

### 3. Get Firebase Configuration

1. Go to Project Settings (gear icon)
2. Scroll to "Your apps"
3. Click "Web" icon (</>) 
4. Register your app
5. Copy the Firebase configuration object:

```javascript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};
```

## 📦 Installation Steps

### 1. Clone the Repository
```powershell
# Clone the repository
git clone <your-repo-url>
cd portfolio-modular
```

### 2. Install Dependencies
```powershell
# Install all dependencies
pnpm install

# Or using npm
npm install

# Or using yarn
yarn install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```powershell
# Create .env file
New-Item -Path ".env" -ItemType File
```

Add your Firebase configuration:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

⚠️ **Important**: Never commit `.env` file to version control!

### 4. Update Firebase Config

Open `src/infrastructure/firebase/config.ts` and verify the configuration:

```typescript
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}
```

## 🚀 Running the Application

### Development Mode
```powershell
# Start development server
pnpm dev

# Or with npm
npm run dev

# Or with yarn
yarn dev
```

The application will be available at:
```
http://localhost:5173
```

### Production Build
```powershell
# Build for production
pnpm build

# Preview production build
pnpm preview
```

## 👤 Create Admin User

### Method 1: Firebase Console
1. Go to Firebase Console → Authentication
2. Click "Add user"
3. Enter email and password
4. Click "Add user"

### Method 2: Using the App
1. Navigate to `/admin/login`
2. Use the registration (if enabled)
3. Or manually add user via Firebase Console

### Recommended Admin Credentials (Development)
```
Email: admin@portfolio.com
Password: Admin@123456 (change in production!)
```

## 📊 Initialize Firestore Collections

### Option 1: Manual Creation

Create these collections in Firestore:

```
Collections to create:
├── home
├── about
├── experiences
├── projects
├── skills
├── skillSections
├── certifications
├── education
└── contactSubmissions
```

### Option 2: Use Admin Panel

1. Run the application
2. Login to admin panel
3. Navigate to each section
4. Add initial data through the UI

## 🔍 Verify Installation

### Checklist
- [ ] Dependencies installed successfully
- [ ] `.env` file created with Firebase config
- [ ] Development server starts without errors
- [ ] Can access `http://localhost:5173`
- [ ] Firebase connection working
- [ ] Can login to admin panel
- [ ] Can view portfolio page

### Test the Setup
```powershell
# 1. Check if dev server starts
pnpm dev

# 2. In a new terminal, check build
pnpm build

# 3. Check for linting errors (if configured)
pnpm lint
```

## 🐛 Troubleshooting

### Issue: pnpm not found
```powershell
# Install pnpm globally
npm install -g pnpm

# Verify installation
pnpm --version
```

### Issue: Firebase errors
```
Error: Firebase: Error (auth/invalid-api-key)
```
**Solution**: Double-check your `.env` file has correct Firebase credentials

### Issue: Port already in use
```
Port 5173 is already in use
```
**Solution**: 
```powershell
# Kill process on port 5173
Get-Process -Id (Get-NetTCPConnection -LocalPort 5173).OwningProcess | Stop-Process

# Or use a different port
pnpm dev --port 3000
```

### Issue: Module not found errors
```powershell
# Clear node_modules and reinstall
Remove-Item -Recurse -Force node_modules
pnpm install
```

### Issue: TypeScript errors
```powershell
# Check TypeScript configuration
pnpm tsc --noEmit
```

## 📂 Project Structure After Setup

```
portfolio-modular/
├── node_modules/         ✅ Installed
├── public/              ✅ Ready
├── src/                 ✅ Ready
├── .env                 ✅ Created
├── .gitignore          ✅ Configured
├── package.json        ✅ Ready
├── pnpm-lock.yaml      ✅ Generated
└── vite.config.ts      ✅ Configured
```

## 🔐 Security Considerations

### For Development
- Use test Firebase project
- Don't use production credentials
- Enable Firebase emulators (optional)

### For Production
- Use separate Firebase project
- Enable security rules
- Set up Firebase App Check
- Configure CORS properly
- Use environment-specific configs

## 🌐 Firebase Security Rules

### Firestore Rules (Development)
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

### Firestore Rules (Production)
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read: if true;
    }
    
    match /home/{document} {
      allow write: if request.auth != null;
    }
    
    match /about/{document} {
      allow write: if request.auth != null;
    }
    
    // Add specific rules for each collection
  }
}
```

## 📝 Next Steps

After successful installation:

1. **Customize Content**: Update portfolio data through admin panel
2. **Add Your Profile**: Update home section with your information
3. **Add Projects**: Showcase your work
4. **Customize Theme**: Modify TailwindCSS configuration
5. **Deploy**: Follow [24-DEPLOYMENT.md](./24-DEPLOYMENT.md)

## 🔗 Useful Commands

```powershell
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview

# Run linter (if configured)
pnpm lint

# Format code (if configured)
pnpm format

# Type checking
pnpm type-check
```

## 📚 Additional Resources

- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)
- [Firebase Documentation](https://firebase.google.com/docs)
- [TailwindCSS Documentation](https://tailwindcss.com/)
- [TypeScript Documentation](https://www.typescriptlang.org/)

---

**Next**: [03-FOLDER-STRUCTURE.md](./03-FOLDER-STRUCTURE.md) - Explore the project structure
