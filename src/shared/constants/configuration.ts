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
  profileURL: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
  resumeURL: 'https://drive.google.com/file/d/1a2b3c4d5e6f7g8h9i0j/view',
  email: 'alex.developer@techmail.com',
  greeting: 'Hi, I am',
  name: 'Alex Thompson',
  tagline: 'Full Stack Developer | Cloud Enthusiast | Open Source Contributor',
  description: 'Crafting scalable web applications and cloud solutions with 5+ years of experience. Passionate about clean code, modern architectures, and building products that make a difference.',
  socialLinks: [
    { platform: 'GitHub', url: 'https://github.com/alexthompson', icon: 'Github' },
    { platform: 'LinkedIn', url: 'https://linkedin.com/in/alex-thompson-dev', icon: 'Linkedin' },
    { platform: 'Twitter', url: 'https://twitter.com/alexcodes', icon: 'Twitter' },
    { platform: 'Instagram', url: 'https://instagram.com/alex.codes', icon: 'Instagram' },
    { platform: 'Dev.to', url: 'https://dev.to/alexthompson', icon: 'BookOpen' },
  ],
};

// ========== ABOUT DATA ==========
export const aboutConfig: AboutData = {
  intro: `Hey there! 👋 I'm Alex Thompson, a passionate Full Stack Developer with 5+ years of experience building scalable, user-centric web applications that make a real difference. I thrive at the intersection of design and engineering, creating solutions that are both beautiful and performant.

My journey in tech started with a simple curiosity about how websites work, which led me to write my first line of code at 16. Since then, I've transformed that curiosity into a career of turning complex business problems into elegant, efficient digital solutions. I believe that great software is not just about writing code—it's about understanding people, solving real problems, and creating experiences that users love.`,
  
  overview: `🚀 **What I Do**
I specialize in the MERN stack (MongoDB, Express.js, React, Node.js) and modern cloud technologies, architecting scalable systems that handle millions of users daily. From building real-time applications to designing microservices architectures, I love tackling challenges that push the boundaries of what's possible on the web.

💡 **My Approach**
I'm a strong advocate for clean code, test-driven development, and continuous learning. Every project is an opportunity to not just deliver features, but to craft maintainable, well-documented solutions that stand the test of time. I believe in measuring twice and cutting once—investing time in proper planning and architecture always pays dividends.

🌟 **Beyond Code**
When I'm not behind the keyboard, you'll find me:
• Contributing to open-source projects (500+ contributions on GitHub)
• Writing technical articles on Medium and Dev.to (50K+ readers)
• Mentoring aspiring developers through coding bootcamps
• Speaking at tech conferences and local meetups
• Exploring the latest in AI, blockchain, and web3 technologies

🎯 **What Drives Me**
I'm passionate about building products that genuinely improve people's lives. Whether it's a blazing-fast e-commerce platform that helps small businesses grow or a collaborative tool that makes remote teams more productive, I find fulfillment in creating technology that matters. My goal is to leave every codebase better than I found it and every team stronger than when I joined.`,
  
  latestPositions: [
    {
      title: 'Senior Full Stack Engineer',
      company: 'TechVision Solutions',
      duration: 'Jan 2023 - Present',
    },
    {
      title: 'Full Stack Developer',
      company: 'CloudStart Inc.',
      duration: 'Mar 2021 - Dec 2022',
    },
    {
      title: 'Frontend Developer',
      company: 'Digital Craft Agency',
      duration: 'Jun 2020 - Feb 2021',
    },
  ],
};

// ========== EXPERIENCE DATA ==========
export const experiencesConfig: Experience[] = [
  {
    currentPosition: 'Senior Full Stack Engineer',
    companyName: 'TechVision Solutions',
    description: 'Leading the development of a cloud-native SaaS platform serving 500K+ users across 50+ countries. Architecting microservices, implementing CI/CD pipelines, and mentoring a team of 6 developers in modern web technologies and best practices.',
    keyAchievements: [
      'Architected and deployed microservices infrastructure handling 2M+ API requests daily with 99.9% uptime',
      'Reduced application bundle size by 65% and improved page load times from 4.2s to 1.1s through code splitting and optimization',
      'Implemented real-time features using WebSocket, serving 100K+ concurrent users',
      'Led migration from monolithic architecture to microservices, improving deployment frequency from weekly to multiple times daily',
      'Mentored 6 junior developers, conducting code reviews and technical workshops',
      'Introduced automated testing suite achieving 85% code coverage, reducing production bugs by 70%',
    ],
    duration: '2 years',
    type: 'Hybrid',
    location: 'San Francisco, CA',
    technologies: ['React', 'TypeScript', 'Node.js', 'Express', 'MongoDB', 'Redis', 'AWS', 'Docker', 'Kubernetes', 'GraphQL', 'Jest', 'WebSocket'],
    startDate: '2023-01',
    order: 1,
  },
  {
    currentPosition: 'Full Stack Developer',
    companyName: 'CloudStart Inc.',
    description: 'Core team member developing a B2B analytics platform from ground up. Built responsive dashboards, RESTful APIs, and integrated third-party services. Collaborated with product managers and designers to deliver features that increased user engagement by 150%.',
    keyAchievements: [
      'Developed 15+ responsive web applications using React and modern CSS techniques',
      'Built RESTful APIs handling 500K+ daily requests with Node.js and PostgreSQL',
      'Implemented CI/CD pipeline using GitHub Actions, reducing deployment time from 2 hours to 15 minutes',
      'Integrated Stripe payment gateway processing $1M+ in transactions',
      'Optimized database queries reducing response time by 60% and server costs by 40%',
      'Created comprehensive API documentation and developer guides',
      'Participated in Agile ceremonies and contributed to sprint planning',
    ],
    duration: '1 year 10 months',
    type: 'Remote',
    technologies: ['React', 'JavaScript', 'Node.js', 'Express.js', 'PostgreSQL', 'Redis', 'AWS S3', 'Stripe', 'GitHub Actions', 'Docker'],
    startDate: '2021-03',
    endDate: '2023-01',
    order: 2,
  },
  {
    currentPosition: 'Frontend Developer',
    companyName: 'Digital Craft Agency',
    description: 'Developed pixel-perfect, responsive websites for diverse clients including e-commerce, corporate, and creative portfolios. Worked closely with UI/UX designers to transform Figma designs into interactive web experiences.',
    keyAchievements: [
      'Delivered 20+ client websites with 98% satisfaction rate',
      'Reduced average page load time to under 2 seconds through image optimization and lazy loading',
      'Implemented accessibility standards (WCAG 2.1 AA) across all projects',
      'Created reusable component library reducing development time by 40%',
      'Collaborated with design team to establish design system and style guide',
      'Mentored 2 junior developers in frontend best practices',
    ],
    duration: '9 months',
    type: 'Office',
    location: 'New York, NY',
    technologies: ['React', 'JavaScript', 'HTML5', 'CSS3', 'SASS', 'Bootstrap', 'Figma', 'Git', 'Webpack'],
    startDate: '2020-06',
    endDate: '2021-03',
    order: 3,
  },
  {
    currentPosition: 'Junior Web Developer (Intern)',
    companyName: 'StartupHub Ventures',
    description: 'Contributed to the development of internal tools and client-facing features. Gained hands-on experience with modern web technologies, version control, and Agile methodologies.',
    keyAchievements: [
      'Built admin dashboard with CRUD operations for managing 10K+ user records',
      'Fixed 50+ bugs and implemented 15+ new features',
      'Improved website performance score from 65 to 92 on Lighthouse',
      'Participated in daily standups and sprint retrospectives',
      'Learned React, Node.js, and database management from senior developers',
    ],
    duration: '6 months',
    type: 'Office',
    location: 'Austin, TX',
    technologies: ['React', 'JavaScript', 'Node.js', 'MongoDB', 'Bootstrap', 'Git'],
    startDate: '2019-12',
    endDate: '2020-05',
    order: 4,
  },
];

// ========== PROJECTS DATA ==========
export const projectsConfig: Project[] = [
  {
    coverImage: 'https://images.unsplash.com/photo-1557821552-17105176677c?w=800&auto=format&fit=crop',
    name: 'ShopSphere - E-Commerce Platform',
    year: 2024,
    description: 'A comprehensive full-stack e-commerce platform featuring real-time inventory management, secure payment processing via Stripe, advanced product search with filters, shopping cart with persistent storage, order tracking system, and a powerful admin dashboard for managing products, orders, and analytics. Built with microservices architecture for scalability and includes email notifications, product reviews, wishlists, and multi-currency support.',
    shortDescription: 'Modern e-commerce solution with real-time features and admin dashboard',
    technologies: ['React', 'TypeScript', 'Node.js', 'Express', 'MongoDB', 'Redis', 'Stripe', 'AWS S3', 'Socket.io', 'Tailwind CSS', 'Jest'],
    liveUrl: 'https://shopsphere-demo.vercel.app',
    githubUrl: 'https://github.com/alexthompson/shopsphere',
    tags: [
      { label: 'Real-Time', subHeading: 'Live Inventory & Orders', icon: 'Zap' },
      { label: 'Secure Payments', subHeading: 'Stripe Integration', icon: 'Shield' },
      { label: 'Scalable', subHeading: 'Microservices', icon: 'Cloud' },
    ],
    featured: true,
    order: 1,
  },
  {
    coverImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop',
    name: 'DataViz Pro - Analytics Dashboard',
    year: 2024,
    description: 'Enterprise-grade analytics platform with interactive data visualizations, customizable dashboards, and AI-powered insights. Features include real-time data streaming, advanced filtering and drill-down capabilities, automated report generation, data export in multiple formats (PDF, Excel, CSV), role-based access control, and RESTful API for third-party integrations. Handles millions of data points with optimized performance.',
    shortDescription: 'AI-powered analytics platform with real-time visualizations',
    technologies: ['React', 'TypeScript', 'D3.js', 'Python', 'FastAPI', 'PostgreSQL', 'Redis', 'TensorFlow', 'Docker', 'Nginx'],
    liveUrl: 'https://dataviz-pro-demo.com',
    githubUrl: 'https://github.com/alexthompson/dataviz-pro',
    tags: [
      { label: 'AI-Powered', subHeading: 'Predictive Analytics', icon: 'Brain' },
      { label: 'Real-Time', subHeading: 'Live Data Streams', icon: 'Activity' },
      { label: 'Interactive', subHeading: 'Custom Dashboards', icon: 'BarChart3' },
    ],
    featured: true,
    order: 2,
  },
  {
    coverImage: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&auto=format&fit=crop',
    name: 'ConnectHub - Social Media Platform',
    year: 2023,
    description: 'Feature-rich social networking application with real-time messaging, post creation with multimedia support, stories with 24-hour expiry, user profiles with followers/following, notifications system, hashtag trending, advanced search, content moderation, and dark mode. Built with React Native for cross-platform mobile support and uses WebSocket for real-time updates.',
    shortDescription: 'Full-featured social network with real-time chat and multimedia sharing',
    technologies: ['React Native', 'Node.js', 'Express', 'MongoDB', 'Socket.io', 'Firebase', 'AWS S3', 'Redux', 'JWT'],
    liveUrl: 'https://apps.apple.com/app/connecthub',
    githubUrl: 'https://github.com/alexthompson/connecthub',
    tags: [
      { label: 'Real-Time', subHeading: 'Instant Messaging', icon: 'MessageCircle' },
      { label: 'Multi-Media', subHeading: 'Photos & Videos', icon: 'Image' },
      { label: 'Cross-Platform', subHeading: 'iOS & Android', icon: 'Smartphone' },
    ],
    featured: true,
    order: 3,
  },
  {
    coverImage: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&auto=format&fit=crop',
    name: 'TaskMaster - Project Management',
    year: 2023,
    description: 'Collaborative project management tool with Kanban boards, Gantt charts, time tracking, team collaboration features, file attachments, comments and mentions, deadline reminders, project templates, and comprehensive reporting. Includes integrations with Slack, GitHub, and Google Calendar.',
    shortDescription: 'Agile project management with team collaboration',
    technologies: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'GraphQL', 'Apollo', 'Material-UI', 'Docker'],
    liveUrl: 'https://taskmaster-pm.com',
    githubUrl: 'https://github.com/alexthompson/taskmaster',
    tags: [
      { label: 'Collaborative', subHeading: 'Team Workspace', icon: 'Users' },
      { label: 'Time Tracking', subHeading: 'Productivity Metrics', icon: 'Clock' },
      { label: 'Integrations', subHeading: 'Popular Tools', icon: 'Link' },
    ],
    order: 4,
  },
  {
    coverImage: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=800&auto=format&fit=crop',
    name: 'FitTrack - Fitness & Health App',
    year: 2023,
    description: 'Comprehensive fitness tracking application with workout logging, nutrition tracking, progress charts, personalized workout plans, exercise library with video demonstrations, calorie calculator, water intake tracker, and social features to connect with friends. Integrates with wearable devices and health apps.',
    shortDescription: 'All-in-one fitness tracking with personalized plans',
    technologies: ['React Native', 'Redux', 'Node.js', 'MongoDB', 'Chart.js', 'Firebase Auth', 'Push Notifications'],
    githubUrl: 'https://github.com/alexthompson/fittrack',
    tags: [
      { label: 'Personalized', subHeading: 'Custom Plans', icon: 'Target' },
      { label: 'Tracking', subHeading: 'Progress Analytics', icon: 'TrendingUp' },
      { label: 'Social', subHeading: 'Community Support', icon: 'Heart' },
    ],
    order: 5,
  },
  {
    coverImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop',
    name: 'CodeCollab - Developer Platform',
    year: 2022,
    description: 'Real-time collaborative code editor with syntax highlighting for 50+ languages, live cursor tracking, integrated terminal, version control, code sharing via unique URLs, and video chat. Perfect for pair programming, technical interviews, and code reviews.',
    shortDescription: 'Real-time collaborative coding platform',
    technologies: ['React', 'Monaco Editor', 'WebRTC', 'Socket.io', 'Node.js', 'Docker', 'Kubernetes'],
    liveUrl: 'https://codecollab.dev',
    githubUrl: 'https://github.com/alexthompson/codecollab',
    tags: [
      { label: 'Real-Time', subHeading: 'Live Collaboration', icon: 'Code' },
      { label: 'Video Chat', subHeading: 'Screen Sharing', icon: 'Video' },
      { label: 'Multi-Language', subHeading: '50+ Languages', icon: 'Globe' },
    ],
    order: 6,
  },
];

// ========== SKILL SECTIONS ==========
export const skillSectionsConfig: SkillSection[] = [
  { name: 'Frontend Development', order: 1 },
  { name: 'Backend Development', order: 2 },
  { name: 'Programming Languages', order: 3 },
  { name: 'Cloud & DevOps', order: 4 },
  { name: 'Databases & Storage', order: 5 },
  { name: 'Tools & Others', order: 6 },
];

// ========== SKILLS DATA ==========
export const skillsConfig: Skill[] = [
  // Frontend Development
  { name: 'React.js', percentage: 95, section: 'Frontend Development', order: 1 },
  { name: 'TypeScript', percentage: 92, section: 'Frontend Development', order: 2 },
  { name: 'Next.js', percentage: 88, section: 'Frontend Development', order: 3 },
  { name: 'Tailwind CSS', percentage: 93, section: 'Frontend Development', order: 4 },
  { name: 'JavaScript (ES6+)', percentage: 96, section: 'Frontend Development', order: 5 },
  { name: 'HTML5 & CSS3', percentage: 98, section: 'Frontend Development', order: 6 },
  { name: 'Redux & Zustand', percentage: 90, section: 'Frontend Development', order: 7 },
  { name: 'React Native', percentage: 85, section: 'Frontend Development', order: 8 },
  { name: 'Vue.js', percentage: 75, section: 'Frontend Development', order: 9 },
  { name: 'SASS/SCSS', percentage: 90, section: 'Frontend Development', order: 10 },
  
  // Backend Development
  { name: 'Node.js', percentage: 92, section: 'Backend Development', order: 11 },
  { name: 'Express.js', percentage: 93, section: 'Backend Development', order: 12 },
  { name: 'REST APIs', percentage: 95, section: 'Backend Development', order: 13 },
  { name: 'GraphQL', percentage: 85, section: 'Backend Development', order: 14 },
  { name: 'Socket.io / WebSocket', percentage: 88, section: 'Backend Development', order: 15 },
  { name: 'Microservices', percentage: 82, section: 'Backend Development', order: 16 },
  { name: 'Python (FastAPI)', percentage: 78, section: 'Backend Development', order: 17 },
  { name: 'Nest.js', percentage: 80, section: 'Backend Development', order: 18 },
  
  // Programming Languages
  { name: 'JavaScript', percentage: 96, section: 'Programming Languages', order: 19 },
  { name: 'TypeScript', percentage: 92, section: 'Programming Languages', order: 20 },
  { name: 'Python', percentage: 82, section: 'Programming Languages', order: 21 },
  { name: 'Java', percentage: 75, section: 'Programming Languages', order: 22 },
  { name: 'SQL', percentage: 88, section: 'Programming Languages', order: 23 },
  { name: 'Bash/Shell', percentage: 80, section: 'Programming Languages', order: 24 },
  
  // Cloud & DevOps
  { name: 'AWS (EC2, S3, Lambda)', percentage: 87, section: 'Cloud & DevOps', order: 25 },
  { name: 'Docker', percentage: 90, section: 'Cloud & DevOps', order: 26 },
  { name: 'Kubernetes', percentage: 78, section: 'Cloud & DevOps', order: 27 },
  { name: 'CI/CD (GitHub Actions)', percentage: 85, section: 'Cloud & DevOps', order: 28 },
  { name: 'Nginx', percentage: 83, section: 'Cloud & DevOps', order: 29 },
  { name: 'Vercel & Netlify', percentage: 92, section: 'Cloud & DevOps', order: 30 },
  { name: 'Azure', percentage: 70, section: 'Cloud & DevOps', order: 31 },
  { name: 'Terraform', percentage: 72, section: 'Cloud & DevOps', order: 32 },
  
  // Databases & Storage
  { name: 'MongoDB', percentage: 93, section: 'Databases & Storage', order: 33 },
  { name: 'PostgreSQL', percentage: 88, section: 'Databases & Storage', order: 34 },
  { name: 'Redis', percentage: 85, section: 'Databases & Storage', order: 35 },
  { name: 'MySQL', percentage: 86, section: 'Databases & Storage', order: 36 },
  { name: 'Firebase', percentage: 87, section: 'Databases & Storage', order: 37 },
  { name: 'DynamoDB', percentage: 75, section: 'Databases & Storage', order: 38 },
  { name: 'Elasticsearch', percentage: 73, section: 'Databases & Storage', order: 39 },
  
  // Tools & Others
  { name: 'Git & GitHub', percentage: 95, section: 'Tools & Others', order: 40 },
  { name: 'VS Code', percentage: 98, section: 'Tools & Others', order: 41 },
  { name: 'Postman', percentage: 92, section: 'Tools & Others', order: 42 },
  { name: 'Jest & Testing Library', percentage: 88, section: 'Tools & Others', order: 43 },
  { name: 'Webpack & Vite', percentage: 85, section: 'Tools & Others', order: 44 },
  { name: 'Figma', percentage: 80, section: 'Tools & Others', order: 45 },
  { name: 'Jira & Agile', percentage: 87, section: 'Tools & Others', order: 46 },
  { name: 'Stripe API', percentage: 82, section: 'Tools & Others', order: 47 },
];

// ========== CERTIFICATIONS DATA ==========
export const certificationsConfig: Certification[] = [
  {
    coverImage: 'https://images.unsplash.com/photo-1592478411213-6153e4ebc07d?w=800&auto=format&fit=crop',
    title: 'AWS Certified Solutions Architect - Associate',
    issuingOrganization: 'Amazon Web Services (AWS)',
    year: 2024,
    description: 'Earned professional certification demonstrating comprehensive knowledge of AWS cloud services, architectural best practices, security, and cost optimization. Validated skills in designing distributed systems, implementing scalable applications, and selecting appropriate AWS services for different use cases.',
    skills: ['AWS Cloud', 'Cloud Architecture', 'EC2', 'S3', 'Lambda', 'RDS', 'VPC', 'IAM', 'Security', 'Cost Optimization'],
    certificateUrl: 'https://aws.amazon.com/certification/certified-solutions-architect-associate/',
    featured: true,
    order: 1,
  },
  {
    coverImage: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop',
    title: 'MongoDB Certified Developer Associate',
    issuingOrganization: 'MongoDB University',
    year: 2023,
    description: 'Advanced certification covering MongoDB database design patterns, CRUD operations, aggregation framework, indexing strategies, replication, sharding, and performance optimization. Demonstrates expertise in building scalable NoSQL applications.',
    skills: ['MongoDB', 'NoSQL', 'Database Design', 'Aggregation Pipeline', 'Indexing', 'Performance Tuning', 'Replication', 'Sharding'],
    certificateUrl: 'https://university.mongodb.com/certification',
    featured: true,
    order: 2,
  },
  {
    coverImage: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop',
    title: 'Meta Front-End Developer Professional Certificate',
    issuingOrganization: 'Meta (Facebook)',
    year: 2023,
    description: 'Comprehensive program covering modern frontend development with React, responsive design, UX/UI principles, version control with Git, and advanced JavaScript concepts. Includes hands-on projects and real-world scenarios.',
    skills: ['React.js', 'JavaScript', 'HTML5', 'CSS3', 'Git', 'UX Design', 'Responsive Design', 'Web Accessibility'],
    certificateUrl: 'https://www.coursera.org/professional-certificates/meta-front-end-developer',
    featured: true,
    order: 3,
  },
  {
    coverImage: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&auto=format&fit=crop',
    title: 'Docker Certified Associate (DCA)',
    issuingOrganization: 'Docker Inc.',
    year: 2023,
    description: 'Professional certification validating skills in container orchestration, Docker engine, image management, networking, security, and storage. Covers Docker Swarm, Docker Compose, and container best practices.',
    skills: ['Docker', 'Containerization', 'Docker Compose', 'Docker Swarm', 'Container Security', 'Orchestration', 'DevOps'],
    certificateUrl: 'https://training.mirantis.com/certification/dca-certification-exam/',
    featured: false,
    order: 4,
  },
  {
    coverImage: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&auto=format&fit=crop',
    title: 'Google Cloud Professional Cloud Developer',
    issuingOrganization: 'Google Cloud',
    year: 2022,
    description: 'Certification demonstrating ability to build scalable and highly available applications using Google Cloud services including App Engine, Cloud Functions, Cloud Run, and Kubernetes Engine.',
    skills: ['Google Cloud Platform', 'Cloud Functions', 'Kubernetes Engine', 'App Engine', 'Cloud Storage', 'Pub/Sub'],
    certificateUrl: 'https://cloud.google.com/certification/cloud-developer',
    featured: false,
    order: 5,
  },
  {
    coverImage: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&auto=format&fit=crop',
    title: 'GitHub Actions Certified',
    issuingOrganization: 'GitHub',
    year: 2023,
    description: 'Certification focused on building CI/CD pipelines with GitHub Actions, workflow automation, security best practices, and integration with various development tools and cloud platforms.',
    skills: ['GitHub Actions', 'CI/CD', 'Workflow Automation', 'DevOps', 'YAML', 'Pipeline Design'],
    certificateUrl: 'https://github.com/certifications',
    featured: false,
    order: 6,
  },
  {
    coverImage: 'https://images.unsplash.com/photo-1589149098258-3e9102cd63d3?w=800&auto=format&fit=crop',
    title: 'Certified Kubernetes Application Developer (CKAD)',
    issuingOrganization: 'Cloud Native Computing Foundation',
    year: 2022,
    description: 'Performance-based certification testing ability to design, build, configure, and expose cloud native applications for Kubernetes. Covers pods, deployments, services, configuration, and observability.',
    skills: ['Kubernetes', 'Container Orchestration', 'Pods', 'Services', 'Deployments', 'ConfigMaps', 'Secrets', 'kubectl'],
    certificateUrl: 'https://www.cncf.io/certification/ckad/',
    featured: false,
    order: 7,
  },
];

// ========== EDUCATION DATA ==========
export const educationsConfig: Education[] = [
  {
    courseName: 'Bachelor of Technology (B.Tech) in Computer Science',
    universityName: 'Massachusetts Institute of Technology',
    location: 'Cambridge, Massachusetts',
    status: 'Completed',
    keyAchievements: [
      'Graduated Summa Cum Laude with GPA 3.9/4.0',
      'Published research paper on "Machine Learning Applications in Real-Time Systems" in IEEE journal',
      'Led MIT Coding Club as President, organizing hackathons and workshops for 200+ students',
      'Winner of MIT HackX 2020 - Built AI-powered code review system',
      'Dean\'s List all 8 semesters',
      'Teaching Assistant for "Data Structures & Algorithms" and "Web Development" courses',
      'Received "Outstanding Student in Computer Science" award',
    ],
    academicFocus: {
      mainCourse: 'Computer Science and Engineering',
      specialization: 'Artificial Intelligence and Software Engineering',
    },
    relevantCoursework: [
      'Advanced Data Structures and Algorithms',
      'Database Management Systems',
      'Web Technologies and Applications',
      'Machine Learning and Deep Learning',
      'Cloud Computing and Distributed Systems',
      'Software Engineering Principles',
      'Computer Networks',
      'Operating Systems',
      'Compiler Design',
      'Artificial Intelligence',
    ],
    startDate: '2017-08',
    endDate: '2021-05',
    order: 1,
  },
  {
    courseName: 'Master of Science (M.S.) in Computer Science',
    universityName: 'Stanford University',
    location: 'Stanford, California',
    status: 'In Progress',
    keyAchievements: [
      'Current GPA: 3.95/4.0',
      'Research Assistant in Stanford AI Lab working on distributed machine learning systems',
      'Teaching Assistant for CS142: "Web Applications" - instructing 120+ students',
      'Published 2 papers in top-tier conferences (ICSE, WWW)',
      'Awarded Stanford Graduate Fellowship for academic excellence',
      'Core team member of Stanford ML Group developing scalable ML frameworks',
      'Presenter at Stanford Tech Talks on "Microservices Architecture at Scale"',
    ],
    academicFocus: {
      mainCourse: 'Computer Science',
      specialization: 'Distributed Systems and Cloud Computing',
    },
    relevantCoursework: [
      'Advanced Distributed Systems',
      'Cloud Infrastructure and Services',
      'Scalable Web Systems',
      'Big Data Analytics and Processing',
      'Advanced Algorithms',
      'Machine Learning Systems',
      'Computer Systems Design',
      'Network Architecture',
    ],
    startDate: '2023-09',
    order: 2,
  },
  {
    courseName: 'Full Stack Web Development Bootcamp',
    universityName: 'App Academy',
    location: 'San Francisco, California (Online)',
    status: 'Completed',
    keyAchievements: [
      'Completed intensive 1000+ hour program with 100% project completion rate',
      'Built 15+ full-stack applications using MERN stack',
      'Ranked #1 in cohort of 50 students',
      'Graduated 2 weeks early due to exceptional performance',
      'Received job offer within 1 week of graduation',
    ],
    academicFocus: {
      mainCourse: 'Full Stack Development',
      specialization: 'MERN Stack (MongoDB, Express, React, Node.js)',
    },
    relevantCoursework: [
      'JavaScript Fundamentals',
      'React and Redux',
      'Node.js and Express',
      'MongoDB and Mongoose',
      'RESTful API Design',
      'Authentication and Authorization',
      'Deployment and DevOps',
      'Data Structures in JavaScript',
    ],
    startDate: '2019-06',
    endDate: '2019-12',
    order: 3,
  },
];

// ========== CONTACT DATA ==========
export const contactConfig: ContactInfo = {
  email: 'alex.developer@techmail.com',
  phone: '+1 (415) 789-4563',
  location: 'San Francisco, California, USA',
  socialLinks: [
    { platform: 'GitHub', url: 'https://github.com/alexthompson', icon: 'Github' },
    { platform: 'LinkedIn', url: 'https://linkedin.com/in/alex-thompson-dev', icon: 'Linkedin' },
    { platform: 'Twitter', url: 'https://twitter.com/alexcodes', icon: 'Twitter' },
    { platform: 'Instagram', url: 'https://instagram.com/alex.codes', icon: 'Instagram' },
    { platform: 'Dev.to', url: 'https://dev.to/alexthompson', icon: 'BookOpen' },
    { platform: 'Medium', url: 'https://medium.com/@alexthompson', icon: 'FileText' },
    { platform: 'Stack Overflow', url: 'https://stackoverflow.com/users/alexthompson', icon: 'Code2' },
    { platform: 'LeetCode', url: 'https://leetcode.com/alexthompson', icon: 'Code' },
    { platform: 'HackerRank', url: 'https://hackerrank.com/alexthompson', icon: 'Trophy' },
    { platform: 'CodeChef', url: 'https://codechef.com/users/alexthompson', icon: 'Award' },
    { platform: 'YouTube', url: 'https://youtube.com/@alexcodes', icon: 'Youtube' },
    { platform: 'Discord', url: 'https://discord.gg/alexthompson', icon: 'MessageSquare' },
  ],
};
