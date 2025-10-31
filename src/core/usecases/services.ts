// Service Layer - Application Use Cases
// These coordinate between repositories and provide business logic

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
} from '../domain/entities';
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
  IAuthRepository,
  IUserRepository,
} from '../domain/repositories';

// Import configurations as fallback
import {
  homeConfig,
  aboutConfig,
  experiencesConfig,
  projectsConfig,
  skillsConfig,
  skillSectionsConfig,
  certificationsConfig,
  educationsConfig,
  contactConfig,
} from '../../shared/constants/configuration';

export class PortfolioService {
  homeRepo: IHomeRepository;
  aboutRepo: IAboutRepository;
  experienceRepo: IExperienceRepository;
  projectRepo: IProjectRepository;
  skillRepo: ISkillRepository;
  skillSectionRepo: ISkillSectionRepository;
  certificationRepo: ICertificationRepository;
  educationRepo: IEducationRepository;
  contactRepo: IContactRepository;
  contactSubmissionRepo: IContactSubmissionRepository;

  constructor(
    homeRepo: IHomeRepository,
    aboutRepo: IAboutRepository,
    experienceRepo: IExperienceRepository,
    projectRepo: IProjectRepository,
    skillRepo: ISkillRepository,
    skillSectionRepo: ISkillSectionRepository,
    certificationRepo: ICertificationRepository,
    educationRepo: IEducationRepository,
    contactRepo: IContactRepository,
    contactSubmissionRepo: IContactSubmissionRepository
  ) {
    this.homeRepo = homeRepo;
    this.aboutRepo = aboutRepo;
    this.experienceRepo = experienceRepo;
    this.projectRepo = projectRepo;
    this.skillRepo = skillRepo;
    this.skillSectionRepo = skillSectionRepo;
    this.certificationRepo = certificationRepo;
    this.educationRepo = educationRepo;
    this.contactRepo = contactRepo;
    this.contactSubmissionRepo = contactSubmissionRepo;
  }

  // ========== HOME SERVICES ==========
  async getHomeData(): Promise<HomeData> {
    const data = await this.homeRepo.get();
    return data || homeConfig;
  }

  async getHomeDataAdmin(): Promise<HomeData | null> {
    return await this.homeRepo.get();
  }

  async updateHomeData(data: HomeData): Promise<HomeData> {
    return await this.homeRepo.update(data);
  }

  // ========== ABOUT SERVICES ==========
  async getAboutData(): Promise<AboutData> {
    const data = await this.aboutRepo.get();
    return data || aboutConfig;
  }

  async getAboutDataAdmin(): Promise<AboutData | null> {
    return await this.aboutRepo.get();
  }

  async updateAboutData(data: AboutData): Promise<AboutData> {
    return await this.aboutRepo.update(data);
  }

  // ========== EXPERIENCE SERVICES ==========
  async getAllExperiences(): Promise<Experience[]> {
    const data = await this.experienceRepo.getAll();
    return data.length > 0 ? data : experiencesConfig;
  }

  async getAllExperiencesAdmin(): Promise<Experience[]> {
    return await this.experienceRepo.getAll();
  }

  async getExperienceById(id: string): Promise<Experience | null> {
    return await this.experienceRepo.getById(id);
  }

  async getLatestExperiences(count: number): Promise<Experience[]> {
    const data = await this.experienceRepo.getLatest(count);
    return data.length > 0 ? data : experiencesConfig.slice(0, count);
  }

  async createExperience(data: Omit<Experience, 'id'>): Promise<Experience> {
    return await this.experienceRepo.create(data);
  }

  async updateExperience(id: string, data: Partial<Experience>): Promise<Experience> {
    return await this.experienceRepo.update(id, data);
  }

  async deleteExperience(id: string): Promise<void> {
    return await this.experienceRepo.delete(id);
  }

  // ========== PROJECT SERVICES ==========
  async getAllProjects(): Promise<Project[]> {
    const data = await this.projectRepo.getAll();
    return data.length > 0 ? data : projectsConfig;
  }

  async getAllProjectsAdmin(): Promise<Project[]> {
    return await this.projectRepo.getAll();
  }

  async getFeaturedProjects(): Promise<Project[]> {
    const data = await this.projectRepo.getFeatured();
    return data.length > 0 ? data : projectsConfig.filter(p => p.featured);
  }

  async getProjectById(id: string): Promise<Project | null> {
    return await this.projectRepo.getById(id);
  }

  async createProject(data: Omit<Project, 'id'>): Promise<Project> {
    return await this.projectRepo.create(data);
  }

  async updateProject(id: string, data: Partial<Project>): Promise<Project> {
    return await this.projectRepo.update(id, data);
  }

  async deleteProject(id: string): Promise<void> {
    return await this.projectRepo.delete(id);
  }

  // ========== SKILL SERVICES ==========
  async getAllSkills(): Promise<Skill[]> {
    const data = await this.skillRepo.getAll();
    return data.length > 0 ? data : skillsConfig;
  }

  async getAllSkillsAdmin(): Promise<Skill[]> {
    return await this.skillRepo.getAll();
  }

  async getSkillsBySection(section: string): Promise<Skill[]> {
    const data = await this.skillRepo.getBySection(section);
    return data.length > 0 ? data : skillsConfig.filter(s => s.section === section);
  }

  async getSkillById(id: string): Promise<Skill | null> {
    return await this.skillRepo.getById(id);
  }

  async createSkill(data: Omit<Skill, 'id'>): Promise<Skill> {
    return await this.skillRepo.create(data);
  }

  async updateSkill(id: string, data: Partial<Skill>): Promise<Skill> {
    return await this.skillRepo.update(id, data);
  }

  async deleteSkill(id: string): Promise<void> {
    return await this.skillRepo.delete(id);
  }

  // ========== SKILL SECTION SERVICES ==========
  async getAllSkillSections(): Promise<SkillSection[]> {
    const data = await this.skillSectionRepo.getAll();
    return data.length > 0 ? data : skillSectionsConfig;
  }

  async getAllSkillSectionsAdmin(): Promise<SkillSection[]> {
    return await this.skillSectionRepo.getAll();
  }

  async getSkillSectionById(id: string): Promise<SkillSection | null> {
    return await this.skillSectionRepo.getById(id);
  }

  async createSkillSection(data: Omit<SkillSection, 'id'>): Promise<SkillSection> {
    return await this.skillSectionRepo.create(data);
  }

  async updateSkillSection(id: string, data: Partial<SkillSection>): Promise<SkillSection> {
    return await this.skillSectionRepo.update(id, data);
  }

  async deleteSkillSection(id: string): Promise<void> {
    return await this.skillSectionRepo.delete(id);
  }

  // ========== CERTIFICATION SERVICES ==========
  async getAllCertifications(): Promise<Certification[]> {
    const data = await this.certificationRepo.getAll();
    return data.length > 0 ? data : certificationsConfig;
  }

  async getAllCertificationsAdmin(): Promise<Certification[]> {
    return await this.certificationRepo.getAll();
  }

  async getFeaturedCertifications(): Promise<Certification[]> {
    const data = await this.certificationRepo.getFeatured();
    return data.length > 0 ? data : certificationsConfig.filter(c => c.featured);
  }

  async getCertificationById(id: string): Promise<Certification | null> {
    return await this.certificationRepo.getById(id);
  }

  async createCertification(data: Omit<Certification, 'id'>): Promise<Certification> {
    return await this.certificationRepo.create(data);
  }

  async updateCertification(id: string, data: Partial<Certification>): Promise<Certification> {
    return await this.certificationRepo.update(id, data);
  }

  async deleteCertification(id: string): Promise<void> {
    return await this.certificationRepo.delete(id);
  }

  // ========== EDUCATION SERVICES ==========
  async getAllEducations(): Promise<Education[]> {
    const data = await this.educationRepo.getAll();
    return data.length > 0 ? data : educationsConfig;
  }

  async getAllEducationsAdmin(): Promise<Education[]> {
    return await this.educationRepo.getAll();
  }

  async getEducationById(id: string): Promise<Education | null> {
    return await this.educationRepo.getById(id);
  }

  async createEducation(data: Omit<Education, 'id'>): Promise<Education> {
    return await this.educationRepo.create(data);
  }

  async updateEducation(id: string, data: Partial<Education>): Promise<Education> {
    return await this.educationRepo.update(id, data);
  }

  async deleteEducation(id: string): Promise<void> {
    return await this.educationRepo.delete(id);
  }

  // ========== CONTACT SERVICES ==========
  async getContactInfo(): Promise<ContactInfo> {
    const data = await this.contactRepo.get();
    return data || contactConfig;
  }

  async getContactInfoAdmin(): Promise<ContactInfo | null> {
    return await this.contactRepo.get();
  }

  async updateContactInfo(data: ContactInfo): Promise<ContactInfo> {
    return await this.contactRepo.update(data);
  }

  // ========== CONTACT SUBMISSION SERVICES ==========
  async getAllContactSubmissions(): Promise<ContactSubmission[]> {
    return await this.contactSubmissionRepo.getAll();
  }

  async getUnreadContactSubmissions(): Promise<ContactSubmission[]> {
    return await this.contactSubmissionRepo.getUnread();
  }

  async createContactSubmission(data: Omit<ContactSubmission, 'id'>): Promise<ContactSubmission> {
    return await this.contactSubmissionRepo.create(data);
  }

  async markSubmissionAsRead(id: string): Promise<void> {
    return await this.contactSubmissionRepo.markAsRead(id);
  }

  async deleteContactSubmission(id: string): Promise<void> {
    return await this.contactSubmissionRepo.delete(id);
  }
}

export class AuthService {
  authRepo: IAuthRepository;
  userRepo: IUserRepository;

  constructor(
    authRepo: IAuthRepository,
    userRepo: IUserRepository
  ) {
    this.authRepo = authRepo;
    this.userRepo = userRepo;
  }

  async signIn(email: string, password: string) {
    return await this.authRepo.signIn(email, password);
  }

  async signInWithGoogle() {
    return await this.authRepo.signInWithGoogle();
  }

  async signOut() {
    return await this.authRepo.signOut();
  }

  async getCurrentUser() {
    return await this.authRepo.getCurrentUser();
  }

  async isAdmin(uid: string): Promise<boolean> {
    return await this.userRepo.isAdmin(uid);
  }

  onAuthStateChanged(callback: (user: User | null) => void) {
    return this.authRepo.onAuthStateChanged(callback);
  }
}
