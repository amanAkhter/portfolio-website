// Repository Interfaces - Contracts for data access
// These define the methods that repositories must implement

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
} from '../entities';

// Base Repository Interface
export interface BaseRepository<T> {
  getAll(): Promise<T[]>;
  getById(id: string): Promise<T | null>;
  create(data: Omit<T, 'id'>): Promise<T>;
  update(id: string, data: Partial<T>): Promise<T>;
  delete(id: string): Promise<void>;
}

// Home Repository
export interface IHomeRepository {
  get(): Promise<HomeData | null>;
  update(data: HomeData): Promise<HomeData>;
}

// About Repository
export interface IAboutRepository {
  get(): Promise<AboutData | null>;
  update(data: AboutData): Promise<AboutData>;
}

// Experience Repository
export interface IExperienceRepository extends BaseRepository<Experience> {
  getLatest(count: number): Promise<Experience[]>;
}

// Project Repository
export interface IProjectRepository extends BaseRepository<Project> {
  getFeatured(): Promise<Project[]>;
}

// Skill Repository
export interface ISkillRepository extends BaseRepository<Skill> {
  getBySection(section: string): Promise<Skill[]>;
}

// Skill Section Repository
export interface ISkillSectionRepository extends BaseRepository<SkillSection> {
  // Extends base repository
}

// Certification Repository
export interface ICertificationRepository extends BaseRepository<Certification> {
  getFeatured(): Promise<Certification[]>;
}

// Education Repository
export interface IEducationRepository extends BaseRepository<Education> {
  // Extends base repository
}

// Contact Repository
export interface IContactRepository {
  get(): Promise<ContactInfo | null>;
  update(data: ContactInfo): Promise<ContactInfo>;
}

// Contact Submission Repository
export interface IContactSubmissionRepository extends BaseRepository<ContactSubmission> {
  getUnread(): Promise<ContactSubmission[]>;
  markAsRead(id: string): Promise<void>;
}

// User Repository
export interface IUserRepository {
  getById(uid: string): Promise<User | null>;
  isAdmin(uid: string): Promise<boolean>;
}

// Auth Repository
export interface IAuthRepository {
  signIn(email: string, password: string): Promise<User>;
  signOut(): Promise<void>;
  getCurrentUser(): Promise<User | null>;
  onAuthStateChanged(callback: (user: User | null) => void): () => void;
}
