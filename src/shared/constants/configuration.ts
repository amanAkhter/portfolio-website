import type {
  HomeData,
  AboutData,
  Experience,
  Project,
  Skill,
  Certification,
  Education,
  ContactInfo,
  SkillSection,
} from '../types';

// ========== HOME DATA ==========
export const homeConfig: HomeData = {
  profileURL: 'https://drive.google.com/uc?export=view&id=YOUR_PROFILE_IMAGE_ID',
  resumeURL: 'https://drive.google.com/file/d/YOUR_RESUME_ID/view',
  email: 'your.email@example.com',
  greeting: 'Hi, I am',
  name: 'Your Name',
  tagline: 'Full Stack Developer',
  description: 'Building exceptional digital experiences with modern web technologies.',
  socialLinks: [
    { platform: 'GitHub', url: 'https://github.com/yourusername', icon: 'Github' },
    { platform: 'LinkedIn', url: 'https://linkedin.com/in/yourusername', icon: 'Linkedin' },
    { platform: 'Twitter', url: 'https://twitter.com/yourusername', icon: 'Twitter' },
    { platform: 'Instagram', url: 'https://instagram.com/yourusername', icon: 'Instagram' },
  ],
};

// ========== ABOUT DATA ==========
export const aboutConfig: AboutData = {
  intro: `A passionate Full Stack Developer with expertise in building scalable web applications. 
  I specialize in the MERN stack and have a strong foundation in creating responsive, 
  user-friendly interfaces with modern design principles.`,
  overview: `With a proven track record of delivering high-quality software solutions, I combine 
  technical expertise with creative problem-solving to build applications that make a difference.`,
  latestPositions: [
    {
      title: 'Senior Full Stack Developer',
      company: 'Tech Company',
      duration: '2023 - Present',
    },
    {
      title: 'Full Stack Developer',
      company: 'Startup Inc',
      duration: '2021 - 2023',
    },
  ],
};

// ========== EXPERIENCE DATA ==========
export const experiencesConfig: Experience[] = [
  {
    currentPosition: 'Senior Full Stack Developer',
    companyName: 'Tech Innovations Inc.',
    description: 'Leading development of enterprise-grade web applications using MERN stack and cloud technologies.',
    keyAchievements: [
      'Architected and deployed microservices handling 1M+ daily requests',
      'Reduced application load time by 60% through optimization',
      'Mentored team of 5 junior developers',
    ],
    duration: '2 years',
    type: 'Hybrid',
    location: 'San Francisco, CA',
    technologies: ['React', 'Node.js', 'MongoDB', 'AWS', 'Docker', 'Kubernetes'],
    startDate: '2023-01',
    order: 1,
  },
  {
    currentPosition: 'Full Stack Developer',
    companyName: 'Digital Solutions Corp',
    description: 'Developed and maintained multiple client-facing applications with focus on performance and user experience.',
    keyAchievements: [
      'Built 10+ responsive web applications from scratch',
      'Implemented CI/CD pipeline reducing deployment time by 70%',
      'Improved code quality with comprehensive testing suite',
    ],
    duration: '2 years',
    type: 'Remote',
    technologies: ['React', 'TypeScript', 'Express.js', 'PostgreSQL', 'Redis'],
    startDate: '2021-01',
    endDate: '2023-01',
    order: 2,
  },
  {
    currentPosition: 'Frontend Developer',
    companyName: 'Creative Agency',
    description: 'Specialized in creating beautiful, interactive user interfaces for various client projects.',
    keyAchievements: [
      'Delivered 15+ pixel-perfect responsive websites',
      'Increased client satisfaction rate to 95%',
    ],
    duration: '1 year',
    type: 'Office',
    location: 'New York, NY',
    technologies: ['React', 'JavaScript', 'CSS3', 'SASS', 'Figma'],
    startDate: '2020-01',
    endDate: '2021-01',
    order: 3,
  },
];

// ========== PROJECTS DATA ==========
export const projectsConfig: Project[] = [
  {
    coverImage: 'https://images.unsplash.com/photo-1557821552-17105176677c?w=800',
    name: 'E-Commerce Platform',
    year: 2024,
    description: 'A full-featured e-commerce platform with real-time inventory management, payment processing, and admin dashboard.',
    shortDescription: 'Modern e-commerce solution with advanced features',
    technologies: ['React', 'Node.js', 'MongoDB', 'Stripe', 'Redis', 'AWS'],
    liveUrl: 'https://example.com',
    githubUrl: 'https://github.com/yourusername/ecommerce',
    tags: [
      { label: 'Real-Time', subHeading: 'Inventory Sync', icon: 'Zap' },
      { label: 'Secure', subHeading: 'Payment Gateway', icon: 'Shield' },
      { label: 'Scalable', subHeading: 'Cloud Infrastructure', icon: 'Cloud' },
    ],
    featured: true,
    order: 1,
  },
  {
    coverImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800',
    name: 'Analytics Dashboard',
    year: 2024,
    description: 'Real-time analytics dashboard with data visualization, custom reports, and AI-powered insights.',
    shortDescription: 'Data visualization platform with AI insights',
    technologies: ['React', 'TypeScript', 'Python', 'FastAPI', 'PostgreSQL'],
    liveUrl: 'https://example.com',
    githubUrl: 'https://github.com/yourusername/analytics',
    tags: [
      { label: 'AI-Powered', subHeading: 'Smart Insights', icon: 'Brain' },
      { label: 'Real-Time', subHeading: 'Live Data', icon: 'Activity' },
    ],
    featured: true,
    order: 2,
  },
  {
    coverImage: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800',
    name: 'Social Media App',
    year: 2023,
    description: 'Social networking platform with real-time chat, posts, stories, and multimedia sharing.',
    shortDescription: 'Feature-rich social networking platform',
    technologies: ['React Native', 'Node.js', 'Socket.io', 'MongoDB', 'Firebase'],
    githubUrl: 'https://github.com/yourusername/social-app',
    tags: [
      { label: 'Real-Time', subHeading: 'Chat & Updates', icon: 'MessageCircle' },
      { label: 'Multi-Media', subHeading: 'Content Sharing', icon: 'Image' },
    ],
    order: 3,
  },
];

// ========== SKILL SECTIONS ==========
export const skillSectionsConfig: SkillSection[] = [
  { name: 'Frontend', order: 1 },
  { name: 'Backend', order: 2 },
  { name: 'Languages', order: 3 },
  { name: 'Cloud & DevOps', order: 4 },
  { name: 'Databases', order: 5 },
];

// ========== SKILLS DATA ==========
export const skillsConfig: Skill[] = [
  // Frontend
  { name: 'React', percentage: 95, section: 'Frontend', order: 1 },
  { name: 'TypeScript', percentage: 90, section: 'Frontend', order: 2 },
  { name: 'Next.js', percentage: 85, section: 'Frontend', order: 3 },
  { name: 'Tailwind CSS', percentage: 90, section: 'Frontend', order: 4 },
  { name: 'HTML/CSS', percentage: 95, section: 'Frontend', order: 5 },
  
  // Backend
  { name: 'Node.js', percentage: 90, section: 'Backend', order: 6 },
  { name: 'Express.js', percentage: 90, section: 'Backend', order: 7 },
  { name: 'GraphQL', percentage: 80, section: 'Backend', order: 8 },
  { name: 'REST APIs', percentage: 95, section: 'Backend', order: 9 },
  
  // Languages
  { name: 'JavaScript', percentage: 95, section: 'Languages', order: 10 },
  { name: 'TypeScript', percentage: 90, section: 'Languages', order: 11 },
  { name: 'Python', percentage: 80, section: 'Languages', order: 12 },
  { name: 'Java', percentage: 75, section: 'Languages', order: 13 },
  
  // Cloud & DevOps
  { name: 'AWS', percentage: 85, section: 'Cloud & DevOps', order: 14 },
  { name: 'Docker', percentage: 85, section: 'Cloud & DevOps', order: 15 },
  { name: 'Kubernetes', percentage: 75, section: 'Cloud & DevOps', order: 16 },
  { name: 'CI/CD', percentage: 80, section: 'Cloud & DevOps', order: 17 },
  
  // Databases
  { name: 'MongoDB', percentage: 90, section: 'Databases', order: 18 },
  { name: 'PostgreSQL', percentage: 85, section: 'Databases', order: 19 },
  { name: 'Redis', percentage: 80, section: 'Databases', order: 20 },
  { name: 'Firebase', percentage: 85, section: 'Databases', order: 21 },
];

// ========== CERTIFICATIONS DATA ==========
export const certificationsConfig: Certification[] = [
  {
    coverImage: 'https://images.unsplash.com/photo-1592478411213-6153e4ebc07d?w=800',
    title: 'AWS Certified Solutions Architect',
    issuingOrganization: 'Amazon Web Services',
    year: 2024,
    description: 'Professional certification demonstrating expertise in designing distributed systems on AWS.',
    skills: ['AWS', 'Cloud Architecture', 'DevOps', 'Scalability', 'Security'],
    certificateUrl: 'https://aws.amazon.com/certification/',
    featured: true,
    order: 1,
  },
  {
    coverImage: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800',
    title: 'MongoDB Certified Developer',
    issuingOrganization: 'MongoDB University',
    year: 2023,
    description: 'Advanced certification in MongoDB database design, development, and administration.',
    skills: ['MongoDB', 'Database Design', 'NoSQL', 'Performance Tuning'],
    certificateUrl: 'https://university.mongodb.com/',
    featured: true,
    order: 2,
  },
  {
    coverImage: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800',
    title: 'Meta Frontend Developer',
    issuingOrganization: 'Meta',
    year: 2023,
    description: 'Professional certificate in modern frontend development practices and technologies.',
    skills: ['React', 'JavaScript', 'HTML/CSS', 'UX Design'],
    certificateUrl: 'https://www.coursera.org/professional-certificates/meta-front-end-developer',
    featured: false,
    order: 3,
  },
];

// ========== EDUCATION DATA ==========
export const educationsConfig: Education[] = [
  {
    courseName: 'Bachelor of Technology',
    universityName: 'Technical University',
    location: 'City, State',
    status: 'Completed',
    keyAchievements: [
      'Graduated with Honors (GPA: 3.8/4.0)',
      'Published research paper on Machine Learning',
      'Led university coding club with 100+ members',
    ],
    academicFocus: {
      mainCourse: 'Computer Science and Engineering',
      specialization: 'Artificial Intelligence and Machine Learning',
    },
    relevantCoursework: [
      'Data Structures and Algorithms',
      'Database Management Systems',
      'Web Development',
      'Machine Learning',
      'Cloud Computing',
      'Software Engineering',
    ],
    startDate: '2017-08',
    endDate: '2021-05',
    order: 1,
  },
  {
    courseName: 'Master of Science',
    universityName: 'Graduate School',
    location: 'City, State',
    status: 'In Progress',
    keyAchievements: [
      'Research Assistant in AI Lab',
      'Teaching Assistant for Advanced Algorithms',
    ],
    academicFocus: {
      mainCourse: 'Computer Science',
      specialization: 'Distributed Systems',
    },
    relevantCoursework: [
      'Advanced Algorithms',
      'Distributed Systems',
      'Cloud Architecture',
      'Big Data Analytics',
    ],
    startDate: '2023-08',
    order: 2,
  },
];

// ========== CONTACT DATA ==========
export const contactConfig: ContactInfo = {
  email: 'your.email@example.com',
  phone: '+1 (555) 123-4567',
  location: 'San Francisco, CA',
  socialLinks: [
    { platform: 'GitHub', url: 'https://github.com/yourusername', icon: 'Github' },
    { platform: 'LinkedIn', url: 'https://linkedin.com/in/yourusername', icon: 'Linkedin' },
    { platform: 'LeetCode', url: 'https://leetcode.com/yourusername', icon: 'Code' },
    { platform: 'HackerRank', url: 'https://hackerrank.com/yourusername', icon: 'Trophy' },
    { platform: 'CodeChef', url: 'https://codechef.com/users/yourusername', icon: 'Award' },
    { platform: 'Twitter', url: 'https://twitter.com/yourusername', icon: 'Twitter' },
    { platform: 'Instagram', url: 'https://instagram.com/yourusername', icon: 'Instagram' },
  ],
};
