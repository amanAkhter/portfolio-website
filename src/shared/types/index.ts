// Shared Types for the Portfolio Application

export interface SocialLink {
  platform: string;
  url: string;
  icon?: string;
}

export interface HomeData {
  id?: string;
  profileURL: string;
  resumeURL: string;
  email: string;
  socialLinks: SocialLink[];
  greeting?: string;
  name?: string;
  tagline?: string;
  taglines?: string[]; // Multiple taglines for typing animation
  description?: string;
}

export interface AboutData {
  id?: string;
  intro: string;
  overview: string;
  latestPositions: {
    title: string;
    company: string;
    duration: string;
  }[];
}

export interface Experience {
  id?: string;
  currentPosition: string;
  companyName: string;
  description: string;
  keyAchievements: string[];
  duration: string;
  type: 'Remote' | 'Office' | 'Hybrid';
  location?: string;
  technologies: string[];
  startDate: string;
  endDate?: string;
  order: number;
}

export interface ProjectTag {
  label: string;
  subHeading: string;
  icon: string;
}

export interface Project {
  id?: string;
  coverImage: string;
  name: string;
  year: number;
  description: string;
  shortDescription: string;
  technologies: string[];
  liveUrl?: string;
  githubUrl?: string;
  tags: ProjectTag[];
  featured?: boolean;
  order: number;
}

export interface SkillSection {
  id?: string;
  name: string;
  order: number;
}

export interface Skill {
  id?: string;
  name: string;
  percentage: number;
  section: string;
  sectionId?: string;
  order: number;
}

export interface Certification {
  id?: string;
  coverImage: string;
  title: string;
  issuingOrganization: string;
  year: number;
  description: string;
  skills: string[];
  certificateUrl: string;
  featured: boolean;
  order: number;
}

export interface Education {
  id?: string;
  courseName: string;
  universityName: string;
  location: string;
  status: 'Completed' | 'In Progress';
  keyAchievements: string[];
  academicFocus: {
    mainCourse: string;
    specialization?: string;
  };
  relevantCoursework: string[];
  startDate: string;
  endDate?: string;
  order: number;
}

export interface ContactInfo {
  id?: string;
  email: string;
  phone?: string;
  location?: string;
  socialLinks: SocialLink[];
}

export interface ContactSubmission {
  id?: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  timestamp: Date;
  read?: boolean;
}

export interface User {
  uid: string;
  email: string;
  role: 'admin' | 'user';
  displayName?: string;
}

// Form Data Types (using type instead of interface to avoid empty interface lint error)
export type ExperienceFormData = Omit<Experience, 'id' | 'order'>;
export type ProjectFormData = Omit<Project, 'id' | 'order'>;
export type SkillFormData = Omit<Skill, 'id' | 'order'>;
export type CertificationFormData = Omit<Certification, 'id' | 'order'>;
export type EducationFormData = Omit<Education, 'id' | 'order'>;
export type ContactSubmissionFormData = Omit<ContactSubmission, 'id' | 'timestamp' | 'read'>;
