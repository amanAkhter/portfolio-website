import { useState, useEffect } from 'react';
import { portfolioService } from '../../core/usecases';
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

export const usePortfolio = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [homeData, setHomeData] = useState<HomeData | null>(null);
  const [aboutData, setAboutData] = useState<AboutData | null>(null);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [skillSections, setSkillSections] = useState<SkillSection[]>([]);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [educations, setEducations] = useState<Education[]>([]);
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [
        home,
        about,
        exp,
        proj,
        sk,
        skSec,
        cert,
        edu,
        contact,
      ] = await Promise.all([
        portfolioService.getHomeData(),
        portfolioService.getAboutData(),
        portfolioService.getAllExperiences(),
        portfolioService.getAllProjects(),
        portfolioService.getAllSkills(),
        portfolioService.getAllSkillSections(),
        portfolioService.getAllCertifications(),
        portfolioService.getAllEducations(),
        portfolioService.getContactInfo(),
      ]);

      setHomeData(home);
      setAboutData(about);
      setExperiences(exp);
      setProjects(proj);
      setSkills(sk);
      setSkillSections(skSec);
      setCertifications(cert);
      setEducations(edu);
      setContactInfo(contact);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch portfolio data';
      setError(errorMessage);
      console.error('Error fetching portfolio data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  return {
    loading,
    error,
    homeData,
    aboutData,
    experiences,
    projects,
    skills,
    skillSections,
    certifications,
    educations,
    contactInfo,
    refetch: fetchAllData,
  };
};
