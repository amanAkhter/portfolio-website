import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  onAuthStateChanged as firebaseOnAuthStateChanged,
  type User as FirebaseUser,
} from 'firebase/auth';
import { auth, isFirebaseConfigured } from '../firebase/config';
import { FirebaseUserRepository } from './FirebaseRepositories';
import type { IAuthRepository } from '../../core/domain/repositories';
import type { User } from '../../core/domain/entities';

export class FirebaseAuthRepository implements IAuthRepository {
  private userRepository = new FirebaseUserRepository();

  private checkFirebaseAuth() {
    if (!auth || !isFirebaseConfigured()) {
      throw new Error('Firebase authentication is not configured');
    }
    return auth;
  }

  private mapFirebaseUser(firebaseUser: FirebaseUser): User {
    return {
      uid: firebaseUser.uid,
      email: firebaseUser.email || '',
      displayName: firebaseUser.displayName || undefined,
      role: 'user', // Default role, will be overridden by Firestore data
    };
  }

  async signIn(email: string, password: string): Promise<User> {
    try {
      const authInstance = this.checkFirebaseAuth();
      const userCredential = await signInWithEmailAndPassword(authInstance, email, password);
      const user = this.mapFirebaseUser(userCredential.user);
      
      // Fetch user role from Firestore
      const userData = await this.userRepository.getById(user.uid);
      if (userData) {
        return { ...user, role: userData.role };
      }
      
      return user;
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    }
  }

  async signInWithGoogle(): Promise<User> {
    try {
      const authInstance = this.checkFirebaseAuth();
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(authInstance, provider);
      const user = this.mapFirebaseUser(userCredential.user);
      
      // Fetch user role from Firestore
      const userData = await this.userRepository.getById(user.uid);
      if (userData) {
        return { ...user, role: userData.role };
      }
      
      return user;
    } catch (error) {
      console.error('Error signing in with Google:', error);
      throw error;
    }
  }

  async signOut(): Promise<void> {
    try {
      const authInstance = this.checkFirebaseAuth();
      await firebaseSignOut(authInstance);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const authInstance = this.checkFirebaseAuth();
      const firebaseUser = authInstance.currentUser;
      if (!firebaseUser) return null;

      const user = this.mapFirebaseUser(firebaseUser);
      
      // Fetch user role from Firestore
      const userData = await this.userRepository.getById(user.uid);
      if (userData) {
        return { ...user, role: userData.role };
      }
      
      return user;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  onAuthStateChanged(callback: (user: User | null) => void): () => void {
    // Check if Firebase is configured before attempting to use it
    if (!auth || !isFirebaseConfigured()) {
      // Firebase not configured - immediately call callback with null and return no-op
      callback(null);
      return () => {};
    }

    try {
      const authInstance = this.checkFirebaseAuth();
      return firebaseOnAuthStateChanged(authInstance, async (firebaseUser) => {
        if (!firebaseUser) {
          callback(null);
          return;
        }

        const user = this.mapFirebaseUser(firebaseUser);
        
        // Fetch user role from Firestore
        const userData = await this.userRepository.getById(user.uid);
        if (userData) {
          callback({ ...user, role: userData.role });
        } else {
          callback(user);
        }
      });
    } catch {
      // Silent fallback - no error logging needed
      callback(null);
      return () => {};
    }
  }
}
