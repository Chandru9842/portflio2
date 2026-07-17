export type SkillCategory = 
  | 'Languages' 
  | 'Frontend' 
  | 'Backend' 
  | 'Databases' 
  | 'Tools' 
  | 'Core CS';

export interface Skill {
  name: string;
  category: SkillCategory;
  level?: string; // e.g. "Advanced", "Intermediate" (not percentage!)
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  duration: string;
  location: string;
  description: string[];
  technologies: string[];
}

export interface Education {
  id: string;
  degree: string;
  institution: string;
  duration: string;
  location: string;
  highlights?: string[];
}

export interface Project {
  id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  image: string; // Placeholder styling/SVG key in code
  tags: string[];
  liveUrl?: string;
  codeUrl?: string;
  featured: boolean;
}

export interface Certificate {
  id: string;
  title: string;
  issuer: string;
  date: string;
  credentialUrl?: string;
}

export interface Achievement {
  id: string;
  title: string;
  highlight: string;
  description: string;
  date: string;
}

export interface PortfolioData {
  name: string;
  title: string;
  subTitle: string;
  description: string;
  avatarPlaceholder: string;
  resumeUrl: string;
  socials: {
    github: string;
    linkedin: string;
    leetcode: string;
    email: string;
  };
  skills: Skill[];
  experience: Experience[];
  education: Education[];
  projects: Project[];
  certificates: Certificate[];
  achievements: Achievement[];
}
