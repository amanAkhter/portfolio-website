import { initializeApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getStorage, type FirebaseStorage } from 'firebase/storage';

// const firebaseConfig = {
//   apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
//   authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
//   projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
//   storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
//   messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
//   appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
// };

const firebaseConfig = {
  apiKey: "AIzaSyDyyLXY2891sxsPN7_d4PiqiZuWPkIt5tc",
  authDomain: "portfolio-amanakhter.firebaseapp.com",
  projectId: "portfolio-amanakhter",
  storageBucket: "portfolio-amanakhter.firebasestorage.app",
  messagingSenderId: "509248555911",
  appId: "1:509248555911:web:e3646fdc50dcdd70906122",
  measurementId: "G-5D50N7J5DB"
};

// Check if Firebase config is provided
const isFirebaseConfigured = () => {
  return Boolean(
    firebaseConfig.apiKey &&
    firebaseConfig.authDomain &&
    firebaseConfig.projectId &&
    firebaseConfig.appId
  );
};

// Initialize Firebase only if configured
let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;
let storage: FirebaseStorage | null = null;

if (isFirebaseConfigured()) {
  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
    // Silent initialization - no console message needed
  } catch (error) {
    console.warn('Firebase initialization failed:', error);
  }
} else {
  // Silent fallback - no console message needed
}

export { auth, db, storage, isFirebaseConfigured };
export default app;
