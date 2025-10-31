// Service Initializer - Creates and exports service instances

import {
  FirebaseHomeRepository,
  FirebaseAboutRepository,
  FirebaseExperienceRepository,
  FirebaseProjectRepository,
  FirebaseSkillRepository,
  FirebaseSkillSectionRepository,
  FirebaseCertificationRepository,
  FirebaseEducationRepository,
  FirebaseContactRepository,
  FirebaseContactSubmissionRepository,
  FirebaseUserRepository,
} from '../../infrastructure/repositories/FirebaseRepositories';
import { FirebaseAuthRepository } from '../../infrastructure/repositories/AuthRepository';
import { PortfolioService, AuthService } from './services';

// Initialize repositories
const homeRepo = new FirebaseHomeRepository();
const aboutRepo = new FirebaseAboutRepository();
const experienceRepo = new FirebaseExperienceRepository();
const projectRepo = new FirebaseProjectRepository();
const skillRepo = new FirebaseSkillRepository();
const skillSectionRepo = new FirebaseSkillSectionRepository();
const certificationRepo = new FirebaseCertificationRepository();
const educationRepo = new FirebaseEducationRepository();
const contactRepo = new FirebaseContactRepository();
const contactSubmissionRepo = new FirebaseContactSubmissionRepository();
const userRepo = new FirebaseUserRepository();
const authRepo = new FirebaseAuthRepository();

// Initialize services
export const portfolioService = new PortfolioService(
  homeRepo,
  aboutRepo,
  experienceRepo,
  projectRepo,
  skillRepo,
  skillSectionRepo,
  certificationRepo,
  educationRepo,
  contactRepo,
  contactSubmissionRepo
);

export const authService = new AuthService(authRepo, userRepo);
