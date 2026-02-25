export interface User {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  portfolio: string;
}

export interface Experience {
  _id?: string;
  jobTitle: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string[];
}

export interface Education {
  _id?: string;
  degree: string;
  institution: string;
  location: string;
  startDate: string;
  endDate: string;
  gpa?: string;
}

export interface Project {
  _id?: string;
  name: string;
  description: string;
  technologies: string[];
  link: string;
}

export interface Skills {
  technical: string[];
  soft: string[];
}

export interface Certification {
  _id?: string;
  name: string;
  issuer: string;
  date: string;
}

export interface ResumeData {
  personalInfo: PersonalInfo;
  summary: string;
  experience: Experience[];
  education: Education[];
  projects: Project[];
  skills: Skills;
  certifications: Certification[];
}

export interface Resume {
  _id: string;
  userId: string;
  title: string;
  templateType: 'modern' | 'minimal' | 'creative';
  resumeData: ResumeData;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface ApiError {
  message: string;
}

export type TemplateType = 'modern' | 'minimal' | 'creative';

export interface Template {
  id: TemplateType;
  name: string;
  description: string;
  preview: string;
}
