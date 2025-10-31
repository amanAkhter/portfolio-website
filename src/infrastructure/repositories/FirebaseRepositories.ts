import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../firebase/config';
import type {
  HomeData,
  AboutData,
  Experience,
  Project,
  Skill,
  SkillSection,
  Certification,
  Education,
  ContactInfo,
  ContactSubmission,
  User,
} from '../../core/domain/entities';
import type {
  IHomeRepository,
  IAboutRepository,
  IExperienceRepository,
  IProjectRepository,
  ISkillRepository,
  ISkillSectionRepository,
  ICertificationRepository,
  IEducationRepository,
  IContactRepository,
  IContactSubmissionRepository,
  IUserRepository,
} from '../../core/domain/repositories';

// Check if Firestore is available
const checkFirestore = () => {
  if (!db || !isFirebaseConfigured()) {
    return null;
  }
  return db;
};

// Utility function to convert Firestore data
const convertTimestamp = (data: unknown): unknown => {
  if (!data || typeof data !== 'object' || Array.isArray(data)) return {};
  const converted: Record<string, unknown> = { ...(data as Record<string, unknown>) };
  Object.keys(converted).forEach(key => {
    if (converted[key] instanceof Timestamp) {
      converted[key] = (converted[key] as Timestamp).toDate();
    }
  });
  return converted;
};

// ========== HOME REPOSITORY ==========
export class FirebaseHomeRepository implements IHomeRepository {
  private collectionName = 'home';

  async get(): Promise<HomeData | null> {
    try {
      const dbInstance = checkFirestore();
      if (!dbInstance) return null;

      const querySnapshot = await getDocs(collection(dbInstance, this.collectionName));
      if (querySnapshot.empty) return null;
      
      const docData = querySnapshot.docs[0];
  const raw = docData.data();
  const converted = convertTimestamp(raw);
  return { id: docData.id, ...(typeof converted === 'object' ? converted : {}) } as HomeData;
    } catch (error) {
      console.error('Error fetching home data:', error);
      return null;
    }
  }

  async update(data: HomeData): Promise<HomeData> {
    try {
      const dbInstance = checkFirestore();
      if (!dbInstance) throw new Error('Firestore not configured');

      const querySnapshot = await getDocs(collection(dbInstance, this.collectionName));
      
      if (querySnapshot.empty) {
        const docRef = await addDoc(collection(dbInstance, this.collectionName), data);
        return { id: docRef.id, ...data };
      } else {
        const docRef = querySnapshot.docs[0].ref;
        await updateDoc(docRef, { ...data });
        return { id: docRef.id, ...data };
      }
    } catch (error) {
      console.error('Error updating home data:', error);
      throw error;
    }
  }
}

// ========== ABOUT REPOSITORY ==========
export class FirebaseAboutRepository implements IAboutRepository {
  private collectionName = 'about';

  async get(): Promise<AboutData | null> {
    try {
      const dbInstance = checkFirestore();
      if (!dbInstance) return null;

      const querySnapshot = await getDocs(collection(dbInstance, this.collectionName));
      if (querySnapshot.empty) return null;
      
      const docData = querySnapshot.docs[0];
  const raw = docData.data();
  const converted = convertTimestamp(raw);
  return { id: docData.id, ...(typeof converted === 'object' ? converted : {}) } as AboutData;
    } catch (error) {
      console.error('Error fetching about data:', error);
      return null;
    }
  }

  async update(data: AboutData): Promise<AboutData> {
    try {
      const dbInstance = checkFirestore();
      if (!dbInstance) throw new Error('Firestore not configured');

      const querySnapshot = await getDocs(collection(dbInstance, this.collectionName));
      
      if (querySnapshot.empty) {
        const docRef = await addDoc(collection(dbInstance, this.collectionName), data);
        return { id: docRef.id, ...data };
      } else {
        const docRef = querySnapshot.docs[0].ref;
        await updateDoc(docRef, { ...data } as Record<string, unknown>);
        return { id: docRef.id, ...data };
      }
    } catch (error) {
      console.error('Error updating about data:', error);
      throw error;
    }
  }
}

// ========== EXPERIENCE REPOSITORY ==========
export class FirebaseExperienceRepository implements IExperienceRepository {
  private collectionName = 'experiences';

  async getAll(): Promise<Experience[]> {
    try {
      const dbInstance = checkFirestore();
      if (!dbInstance) return [];

      const q = query(collection(dbInstance, this.collectionName), orderBy('order', 'asc'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(docData => {
        const raw = docData.data();
        const converted = convertTimestamp(raw);
        return { id: docData.id, ...(typeof converted === 'object' ? converted : {}) } as Experience;
      });
    } catch (error) {
      console.error('Error fetching experiences:', error);
      return [];
    }
  }

  async getById(id: string): Promise<Experience | null> {
    try {
      const dbInstance = checkFirestore();
      if (!dbInstance) return null;

      const docRef = doc(dbInstance, this.collectionName, id);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) return null;
  const raw = docSnap.data();
  const converted = convertTimestamp(raw);
  return { id: docSnap.id, ...(typeof converted === 'object' ? converted : {}) } as Experience;
    } catch (error) {
      console.error('Error fetching experience:', error);
      return null;
    }
  }

  async getLatest(count: number): Promise<Experience[]> {
    try {
      const dbInstance = checkFirestore();
      if (!dbInstance) return [];

      const q = query(
        collection(dbInstance, this.collectionName),
        orderBy('order', 'asc'),
        limit(count)
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(docData => {
        const raw = docData.data();
        const converted = convertTimestamp(raw);
        return { id: docData.id, ...(typeof converted === 'object' ? converted : {}) } as Experience;
      });
    } catch (error) {
      console.error('Error fetching latest experiences:', error);
      return [];
    }
  }

  async create(data: Omit<Experience, 'id'>): Promise<Experience> {
    try {
      const dbInstance = checkFirestore();
      if (!dbInstance) throw new Error('Firestore not configured');

      const docRef = await addDoc(collection(dbInstance, this.collectionName), data);
      return { id: docRef.id, ...data } as Experience;
    } catch (error) {
      console.error('Error creating experience:', error);
      throw error;
    }
  }

  async update(id: string, data: Partial<Experience>): Promise<Experience> {
    try {
      const dbInstance = checkFirestore();
      if (!dbInstance) throw new Error('Firestore not configured');

      const docRef = doc(dbInstance, this.collectionName, id);
      await updateDoc(docRef, { ...data } as Record<string, unknown>);
      const updated = await this.getById(id);
      if (!updated) throw new Error('Failed to fetch updated experience');
      return updated;
    } catch (error) {
      console.error('Error updating experience:', error);
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const dbInstance = checkFirestore();
      if (!dbInstance) throw new Error('Firestore not configured');

      await deleteDoc(doc(dbInstance, this.collectionName, id));
    } catch (error) {
      console.error('Error deleting experience:', error);
      throw error;
    }
  }
}

// ========== PROJECT REPOSITORY ==========
export class FirebaseProjectRepository implements IProjectRepository {
  private collectionName = 'projects';

  async getAll(): Promise<Project[]> {
    try {
      const dbInstance = checkFirestore();
      if (!dbInstance) return [];
      const q = query(collection(dbInstance, this.collectionName), orderBy('order', 'asc'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(docData => {
        const raw = docData.data();
        const converted = convertTimestamp(raw);
        return { id: docData.id, ...(typeof converted === 'object' ? converted : {}) } as Project;
      });
    } catch (error) {
      console.error('Error fetching projects:', error);
      return [];
    }
  }

  async getFeatured(): Promise<Project[]> {
    try {
      const dbInstance = checkFirestore();
      if (!dbInstance) return [];
      const q = query(
        collection(dbInstance, this.collectionName),
        where('featured', '==', true),
        orderBy('order', 'asc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(docData => {
        const raw = docData.data();
        const converted = convertTimestamp(raw);
        return { id: docData.id, ...(typeof converted === 'object' ? converted : {}) } as Project;
      });
    } catch (error) {
      console.error('Error fetching featured projects:', error);
      return [];
    }
  }

  async getById(id: string): Promise<Project | null> {
    try {
      const dbInstance = checkFirestore();
      if (!dbInstance) return null;
      const docRef = doc(dbInstance, this.collectionName, id);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) return null;
      const raw = docSnap.data();
      const converted = convertTimestamp(raw);
      return { id: docSnap.id, ...(typeof converted === 'object' ? converted : {}) } as Project;
    } catch (error) {
      console.error('Error fetching project:', error);
      return null;
    }
  }

  async create(data: Omit<Project, 'id'>): Promise<Project> {
    try {
      const dbInstance = checkFirestore();
      if (!dbInstance) throw new Error('Firestore not configured');
      const docRef = await addDoc(collection(dbInstance, this.collectionName), data);
      return { id: docRef.id, ...data } as Project;
    } catch (error) {
      console.error('Error creating project:', error);
      throw error;
    }
  }

  async update(id: string, data: Partial<Project>): Promise<Project> {
    try {
      const dbInstance = checkFirestore();
      if (!dbInstance) throw new Error('Firestore not configured');
      const docRef = doc(dbInstance, this.collectionName, id);
      await updateDoc(docRef, { ...data } as Record<string, unknown>);
      const updated = await this.getById(id);
      if (!updated) throw new Error('Failed to fetch updated project');
      return updated;
    } catch (error) {
      console.error('Error updating project:', error);
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const dbInstance = checkFirestore();
      if (!dbInstance) throw new Error('Firestore not configured');
      await deleteDoc(doc(dbInstance, this.collectionName, id));
    } catch (error) {
      console.error('Error deleting project:', error);
      throw error;
    }
  }
}

// ========== SKILL REPOSITORY ==========
export class FirebaseSkillRepository implements ISkillRepository {
  private collectionName = 'skills';

  async getAll(): Promise<Skill[]> {
    try {
      const dbInstance = checkFirestore();
      if (!dbInstance) return [];
      const q = query(collection(dbInstance, this.collectionName), orderBy('order', 'asc'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(docData => {
        const raw = docData.data();
        const converted = convertTimestamp(raw);
        return { id: docData.id, ...(typeof converted === 'object' ? converted : {}) } as Skill;
      });
    } catch (error) {
      console.error('Error fetching skills:', error);
      return [];
    }
  }

  async getBySection(section: string): Promise<Skill[]> {
    try {
      const dbInstance = checkFirestore();
      if (!dbInstance) return [];
      const q = query(
        collection(dbInstance, this.collectionName),
        where('section', '==', section),
        orderBy('order', 'asc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(docData => {
        const raw = docData.data();
        const converted = convertTimestamp(raw);
        return { id: docData.id, ...(typeof converted === 'object' ? converted : {}) } as Skill;
      });
    } catch (error) {
      console.error('Error fetching skills by section:', error);
      return [];
    }
  }

  async getById(id: string): Promise<Skill | null> {
    try {
      const dbInstance = checkFirestore();
      if (!dbInstance) return null;
      const docRef = doc(dbInstance, this.collectionName, id);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) return null;
      const raw = docSnap.data();
      const converted = convertTimestamp(raw);
      return { id: docSnap.id, ...(typeof converted === 'object' ? converted : {}) } as Skill;
    } catch (error) {
      console.error('Error fetching skill:', error);
      return null;
    }
  }

  async create(data: Omit<Skill, 'id'>): Promise<Skill> {
    try {
      const dbInstance = checkFirestore();
      if (!dbInstance) throw new Error('Firestore not configured');
      const docRef = await addDoc(collection(dbInstance, this.collectionName), data);
      return { id: docRef.id, ...data } as Skill;
    } catch (error) {
      console.error('Error creating skill:', error);
      throw error;
    }
  }

  async update(id: string, data: Partial<Skill>): Promise<Skill> {
    try {
      const dbInstance = checkFirestore();
      if (!dbInstance) throw new Error('Firestore not configured');
      const docRef = doc(dbInstance, this.collectionName, id);
      await updateDoc(docRef, { ...data } as Record<string, unknown>);
      const updated = await this.getById(id);
      if (!updated) throw new Error('Failed to fetch updated skill');
      return updated;
    } catch (error) {
      console.error('Error updating skill:', error);
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const dbInstance = checkFirestore();
      if (!dbInstance) throw new Error('Firestore not configured');
      await deleteDoc(doc(dbInstance, this.collectionName, id));
    } catch (error) {
      console.error('Error deleting skill:', error);
      throw error;
    }
  }
}

// ========== SKILL SECTION REPOSITORY ==========
export class FirebaseSkillSectionRepository implements ISkillSectionRepository {
  private collectionName = 'skillSections';

  async getAll(): Promise<SkillSection[]> {
    try {
      const dbInstance = checkFirestore();
      if (!dbInstance) return [];
      const q = query(collection(dbInstance, this.collectionName), orderBy('order', 'asc'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(docData => {
        const raw = docData.data();
        const converted = convertTimestamp(raw);
        return { id: docData.id, ...(typeof converted === 'object' ? converted : {}) } as SkillSection;
      });
    } catch (error) {
      console.error('Error fetching skill sections:', error);
      return [];
    }
  }

  async getById(id: string): Promise<SkillSection | null> {
    try {
      const dbInstance = checkFirestore();
      if (!dbInstance) return null;
      const docRef = doc(dbInstance, this.collectionName, id);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) return null;
      const raw = docSnap.data();
      const converted = convertTimestamp(raw);
      return { id: docSnap.id, ...(typeof converted === 'object' ? converted : {}) } as SkillSection;
    } catch (error) {
      console.error('Error fetching skill section:', error);
      return null;
    }
  }

  async create(data: Omit<SkillSection, 'id'>): Promise<SkillSection> {
    try {
      const dbInstance = checkFirestore();
      if (!dbInstance) throw new Error('Firestore not configured');
      const docRef = await addDoc(collection(dbInstance, this.collectionName), data);
      return { id: docRef.id, ...data } as SkillSection;
    } catch (error) {
      console.error('Error creating skill section:', error);
      throw error;
    }
  }

  async update(id: string, data: Partial<SkillSection>): Promise<SkillSection> {
    try {
      const dbInstance = checkFirestore();
      if (!dbInstance) throw new Error('Firestore not configured');
      const docRef = doc(dbInstance, this.collectionName, id);
      await updateDoc(docRef, { ...data } as Record<string, unknown>);
      const updated = await this.getById(id);
      if (!updated) throw new Error('Failed to fetch updated skill section');
      return updated;
    } catch (error) {
      console.error('Error updating skill section:', error);
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const dbInstance = checkFirestore();
      if (!dbInstance) throw new Error('Firestore not configured');
      await deleteDoc(doc(dbInstance, this.collectionName, id));
    } catch (error) {
      console.error('Error deleting skill section:', error);
      throw error;
    }
  }
}

// ========== CERTIFICATION REPOSITORY ==========
export class FirebaseCertificationRepository implements ICertificationRepository {
  private collectionName = 'certifications';

  async getAll(): Promise<Certification[]> {
    try {
      const dbInstance = checkFirestore();
      if (!dbInstance) return [];
      const q = query(collection(dbInstance, this.collectionName), orderBy('order', 'asc'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(docData => {
        const raw = docData.data();
        const converted = convertTimestamp(raw);
        return { id: docData.id, ...(typeof converted === 'object' ? converted : {}) } as Certification;
      });
    } catch (error) {
      console.error('Error fetching certifications:', error);
      return [];
    }
  }

  async getFeatured(): Promise<Certification[]> {
    try {
      const dbInstance = checkFirestore();
      if (!dbInstance) return [];
      const q = query(
        collection(dbInstance, this.collectionName),
        where('featured', '==', true),
        orderBy('order', 'asc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(docData => {
        const raw = docData.data();
        const converted = convertTimestamp(raw);
        return { id: docData.id, ...(typeof converted === 'object' ? converted : {}) } as Certification;
      });
    } catch (error) {
      console.error('Error fetching featured certifications:', error);
      return [];
    }
  }

  async getById(id: string): Promise<Certification | null> {
    try {
      const dbInstance = checkFirestore();
      if (!dbInstance) return null;
      const docRef = doc(dbInstance, this.collectionName, id);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) return null;
      const raw = docSnap.data();
      const converted = convertTimestamp(raw);
      return { id: docSnap.id, ...(typeof converted === 'object' ? converted : {}) } as Certification;
    } catch (error) {
      console.error('Error fetching certification:', error);
      return null;
    }
  }

  async create(data: Omit<Certification, 'id'>): Promise<Certification> {
    try {
      const dbInstance = checkFirestore();
      if (!dbInstance) throw new Error('Firestore not configured');
      const docRef = await addDoc(collection(dbInstance, this.collectionName), data);
      return { id: docRef.id, ...data } as Certification;
    } catch (error) {
      console.error('Error creating certification:', error);
      throw error;
    }
  }

  async update(id: string, data: Partial<Certification>): Promise<Certification> {
    try {
      const dbInstance = checkFirestore();
      if (!dbInstance) throw new Error('Firestore not configured');
      const docRef = doc(dbInstance, this.collectionName, id);
      await updateDoc(docRef, { ...data } as Record<string, unknown>);
      const updated = await this.getById(id);
      if (!updated) throw new Error('Failed to fetch updated certification');
      return updated;
    } catch (error) {
      console.error('Error updating certification:', error);
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const dbInstance = checkFirestore();
      if (!dbInstance) throw new Error('Firestore not configured');
      await deleteDoc(doc(dbInstance, this.collectionName, id));
    } catch (error) {
      console.error('Error deleting certification:', error);
      throw error;
    }
  }
}

// ========== EDUCATION REPOSITORY ==========
export class FirebaseEducationRepository implements IEducationRepository {
  private collectionName = 'educations';

  async getAll(): Promise<Education[]> {
    try {
      const dbInstance = checkFirestore();
      if (!dbInstance) return [];
      const q = query(collection(dbInstance, this.collectionName), orderBy('order', 'asc'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(docData => {
        const raw = docData.data();
        const converted = convertTimestamp(raw);
        return { id: docData.id, ...(typeof converted === 'object' ? converted : {}) } as Education;
      });
    } catch (error) {
      console.error('Error fetching educations:', error);
      return [];
    }
  }

  async getById(id: string): Promise<Education | null> {
    try {
      const dbInstance = checkFirestore();
      if (!dbInstance) return null;
      const docRef = doc(dbInstance, this.collectionName, id);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) return null;
      const raw = docSnap.data();
      const converted = convertTimestamp(raw);
      return { id: docSnap.id, ...(typeof converted === 'object' ? converted : {}) } as Education;
    } catch (error) {
      console.error('Error fetching education:', error);
      return null;
    }
  }

  async create(data: Omit<Education, 'id'>): Promise<Education> {
    try {
      const dbInstance = checkFirestore();
      if (!dbInstance) throw new Error('Firestore not configured');
      const docRef = await addDoc(collection(dbInstance, this.collectionName), data);
      return { id: docRef.id, ...data } as Education;
    } catch (error) {
      console.error('Error creating education:', error);
      throw error;
    }
  }

  async update(id: string, data: Partial<Education>): Promise<Education> {
    try {
      const dbInstance = checkFirestore();
      if (!dbInstance) throw new Error('Firestore not configured');
      const docRef = doc(dbInstance, this.collectionName, id);
      await updateDoc(docRef, { ...data } as Record<string, unknown>);
      const updated = await this.getById(id);
      if (!updated) throw new Error('Failed to fetch updated education');
      return updated;
    } catch (error) {
      console.error('Error updating education:', error);
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const dbInstance = checkFirestore();
      if (!dbInstance) throw new Error('Firestore not configured');
      await deleteDoc(doc(dbInstance, this.collectionName, id));
    } catch (error) {
      console.error('Error deleting education:', error);
      throw error;
    }
  }
}

// ========== CONTACT REPOSITORY ==========
export class FirebaseContactRepository implements IContactRepository {
  private collectionName = 'contact';

  async get(): Promise<ContactInfo | null> {
    try {
      const dbInstance = checkFirestore();
      if (!dbInstance) return null;
      const querySnapshot = await getDocs(collection(dbInstance, this.collectionName));
      if (querySnapshot.empty) return null;
      const docData = querySnapshot.docs[0];
      const raw = docData.data();
      const converted = convertTimestamp(raw);
      return { id: docData.id, ...(typeof converted === 'object' ? converted : {}) } as ContactInfo;
    } catch (error) {
      console.error('Error fetching contact data:', error);
      return null;
    }
  }

  async update(data: ContactInfo): Promise<ContactInfo> {
    try {
      const dbInstance = checkFirestore();
      if (!dbInstance) throw new Error('Firestore not configured');
      const querySnapshot = await getDocs(collection(dbInstance, this.collectionName));
      if (querySnapshot.empty) {
        const docRef = await addDoc(collection(dbInstance, this.collectionName), data);
        return { id: docRef.id, ...data };
      } else {
        const docRef = querySnapshot.docs[0].ref;
        await updateDoc(docRef, { ...data } as Record<string, unknown>);
        return { id: docRef.id, ...data };
      }
    } catch (error) {
      console.error('Error updating contact data:', error);
      throw error;
    }
  }
}

// ========== CONTACT SUBMISSION REPOSITORY ==========
export class FirebaseContactSubmissionRepository implements IContactSubmissionRepository {
  private collectionName = 'contactSubmissions';

  async getAll(): Promise<ContactSubmission[]> {
    try {
      const dbInstance = checkFirestore();
      if (!dbInstance) return [];
      const q = query(collection(dbInstance, this.collectionName), orderBy('timestamp', 'desc'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(docData => {
        const raw = docData.data();
        const converted = convertTimestamp(raw);
        return { id: docData.id, ...(typeof converted === 'object' ? converted : {}) } as ContactSubmission;
      });
    } catch (error) {
      console.error('Error fetching contact submissions:', error);
      return [];
    }
  }

  async getUnread(): Promise<ContactSubmission[]> {
    try {
      const dbInstance = checkFirestore();
      if (!dbInstance) return [];
      const q = query(
        collection(dbInstance, this.collectionName),
        where('read', '==', false),
        orderBy('timestamp', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(docData => {
        const raw = docData.data();
        const converted = convertTimestamp(raw);
        return { id: docData.id, ...(typeof converted === 'object' ? converted : {}) } as ContactSubmission;
      });
    } catch (error) {
      console.error('Error fetching unread submissions:', error);
      return [];
    }
  }

  async getById(id: string): Promise<ContactSubmission | null> {
    try {
      const dbInstance = checkFirestore();
      if (!dbInstance) return null;
      const docRef = doc(dbInstance, this.collectionName, id);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) return null;
      const raw = docSnap.data();
      const converted = convertTimestamp(raw);
      return { id: docSnap.id, ...(typeof converted === 'object' ? converted : {}) } as ContactSubmission;
    } catch (error) {
      console.error('Error fetching contact submission:', error);
      return null;
    }
  }

  async create(data: Omit<ContactSubmission, 'id'>): Promise<ContactSubmission> {
    try {
      const dbInstance = checkFirestore();
      if (!dbInstance) throw new Error('Firestore not configured');
      const submissionData = {
        ...data,
        timestamp: Timestamp.now(),
        read: false,
      };
      const docRef = await addDoc(collection(dbInstance, this.collectionName), submissionData);
      return { id: docRef.id, ...data, timestamp: new Date(), read: false };
    } catch (error) {
      console.error('Error creating contact submission:', error);
      throw error;
    }
  }

  async update(id: string, data: Partial<ContactSubmission>): Promise<ContactSubmission> {
    try {
      const dbInstance = checkFirestore();
      if (!dbInstance) throw new Error('Firestore not configured');
      const docRef = doc(dbInstance, this.collectionName, id);
      await updateDoc(docRef, { ...data } as Record<string, unknown>);
      const updated = await this.getById(id);
      if (!updated) throw new Error('Failed to fetch updated submission');
      return updated;
    } catch (error) {
      console.error('Error updating contact submission:', error);
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const dbInstance = checkFirestore();
      if (!dbInstance) throw new Error('Firestore not configured');
      await deleteDoc(doc(dbInstance, this.collectionName, id));
    } catch (error) {
      console.error('Error deleting contact submission:', error);
      throw error;
    }
  }

  async markAsRead(id: string): Promise<void> {
    try {
      const dbInstance = checkFirestore();
      if (!dbInstance) throw new Error('Firestore not configured');
      const docRef = doc(dbInstance, this.collectionName, id);
      await updateDoc(docRef, { read: true });
    } catch (error) {
      console.error('Error marking submission as read:', error);
      throw error;
    }
  }
}

// ========== USER REPOSITORY ==========
export class FirebaseUserRepository implements IUserRepository {
  private collectionName = 'users';

  async getById(uid: string): Promise<User | null> {
    try {
      const dbInstance = checkFirestore();
      if (!dbInstance) return null;
      const docRef = doc(dbInstance, this.collectionName, uid);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) return null;
      const raw = docSnap.data();
      const converted = convertTimestamp(raw);
      return { uid, ...(typeof converted === 'object' ? converted : {}) } as User;
    } catch (error) {
      console.error('Error fetching user:', error);
      return null;
    }
  }

  async isAdmin(uid: string): Promise<boolean> {
    try {
      const user = await this.getById(uid);
      return user?.role === 'admin';
    } catch (error) {
      console.error('Error checking admin status:', error);
      return false;
    }
  }
}
