import { create } from 'zustand';
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
} from '../../shared/types';

interface PortfolioState {
  homeData: HomeData | null;
  aboutData: AboutData | null;
  experiences: Experience[];
  projects: Project[];
  skills: Skill[];
  skillSections: SkillSection[];
  certifications: Certification[];
  educations: Education[];
  contactInfo: ContactInfo | null;
  
  setHomeData: (data: HomeData | null) => void;
  setAboutData: (data: AboutData | null) => void;
  setExperiences: (data: Experience[]) => void;
  setProjects: (data: Project[]) => void;
  setSkills: (data: Skill[]) => void;
  setSkillSections: (data: SkillSection[]) => void;
  setCertifications: (data: Certification[]) => void;
  setEducations: (data: Education[]) => void;
  setContactInfo: (data: ContactInfo | null) => void;
}

export const usePortfolioStore = create<PortfolioState>((set) => ({
  homeData: null,
  aboutData: null,
  experiences: [],
  projects: [],
  skills: [],
  skillSections: [],
  certifications: [],
  educations: [],
  contactInfo: null,
  
  setHomeData: (homeData) => set({ homeData }),
  setAboutData: (aboutData) => set({ aboutData }),
  setExperiences: (experiences) => set({ experiences }),
  setProjects: (projects) => set({ projects }),
  setSkills: (skills) => set({ skills }),
  setSkillSections: (skillSections) => set({ skillSections }),
  setCertifications: (certifications) => set({ certifications }),
  setEducations: (educations) => set({ educations }),
  setContactInfo: (contactInfo) => set({ contactInfo }),
}));
