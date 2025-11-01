# ⚡ Quick Start Guide

Get your portfolio running in 5 minutes!

## 🚀 Fast Track Setup

### Step 1: Install Dependencies (2 minutes)
```bash
npm install
```

If you get errors:
```bash
npm install --legacy-peer-deps
```

### Step 2: Firebase Setup (2 minutes)

1. **Go to** https://console.firebase.google.com/
2. **Create a new project**
3. **Enable these services:**
   - Authentication → Email/Password
   - Firestore Database → Start in production mode
4. **Get your config:**
   - Project Settings → General → Your apps → Web
   - Copy the config values

5. **Create `.env` file:**
```bash
# Copy the example
cp .env.example .env

# Edit .env with your Firebase values
VITE_FIREBASE_API_KEY=your_value_here
VITE_FIREBASE_AUTH_DOMAIN=your_value_here
VITE_FIREBASE_PROJECT_ID=your_value_here
VITE_FIREBASE_STORAGE_BUCKET=your_value_here
VITE_FIREBASE_MESSAGING_SENDER_ID=your_value_here
VITE_FIREBASE_APP_ID=your_value_here
```

### Step 3: Create Admin User (1 minute)

1. **Firebase Console → Authentication:**
   - Click "Add user"
   - Email: your.email@example.com
   - Password: (your secure password)
   - Copy the User UID

2. **Firebase Console → Firestore Database:**
   - Click "Start collection"
   - Collection ID: `users`
   - Document ID: (paste the User UID)
   - Add fields:
     ```
     email: "your.email@example.com"
     role: "admin"
     displayName: "Your Name"
     ```

### Step 4: Run! (30 seconds)
```bash
npm run dev
```

**Open:** http://localhost:5173

**Login at:** http://localhost:5173/admin/login

## 🎯 What You Get

✅ **Working Portfolio Website**
- Hero section with animations
- About section with stats
- Responsive navigation
- Tokyo Night theme

✅ **Admin Panel**
- Secure authentication
- Dashboard layout
- Ready for content management

✅ **Clean Architecture**
- Modular code structure
- Type-safe with TypeScript
- Easy to extend

## 🎨 Quick Customization

### 1. Update Your Info (2 minutes)
Edit `src/shared/constants/configuration.ts`:
```typescript
export const homeConfig: HomeData = {
  profileURL: 'your-image-url',
  resumeURL: 'your-resume-url',
  email: 'your.email@example.com',
  name: 'Your Name',
  tagline: 'Your Title',
  // ... update all sections
}
```

### 2. Change Colors (optional)
Edit `tailwind.config.js` → `tokyo` colors

### 3. Add Sections
Follow patterns in `src/presentation/components/sections/`

## 📖 Useful Commands

```bash
# Development
npm run dev              # Start dev server

# Production
npm run build            # Build for production
npm run preview          # Preview production build

# Type checking
npm run type-check       # Check TypeScript types
```

## 🆘 Common Issues

### Issue: "Cannot find module"
**Fix:** 
```bash
npm install
```

### Issue: "Firebase not initialized"
**Fix:** Check your `.env` file has correct values

### Issue: "Admin login not working"  
**Fix:** Make sure you created the user in both:
1. Firebase Authentication
2. Firestore `users` collection

### Issue: "Animations not working"
**Fix:** Check that motion and gsap are installed:
```bash
npm install motion gsap
```

## 📚 Documentation

- **Full Setup:** See `SETUP_GUIDE.md`
- **Architecture:** See `ARCHITECTURE.md`
- **File Structure:** See `FILE_STRUCTURE.md`
- **README:** See `README.md`

## 🎯 Next Steps

1. ✅ **Portfolio is running!**
2. 📝 **Customize your data** in `configuration.ts`
3. 🎨 **Add more sections** (Experience, Projects, Skills, etc.)
4. 🔧 **Build admin forms** for content management
5. 🚀 **Deploy** to Vercel, Netlify, or Firebase Hosting

## 🎉 You're Ready!

Your modern portfolio foundation is complete. The architecture is solid, the design is beautiful, and it's ready to be customized with your content!

**Need Help?**
- Check the detailed guides in the documentation files
- Review the code comments
- Examine the existing component patterns

**Happy Building! 🚀**
