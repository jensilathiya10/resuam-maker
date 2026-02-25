export interface IUser {
  _id: string;
  name: string;
  email: string;
  password?: string;
  isPremium?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IPersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  portfolio: string;
}

export interface IExperience {
  _id: string;
  jobTitle: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string[];
}

export interface IEducation {
  _id: string;
  degree: string;
  institution: string;
  location: string;
  startDate: string;
  endDate: string;
  gpa: string;
}

export interface IProject {
  _id: string;
  name: string;
  description: string;
  technologies: string[];
  link: string;
}

export interface ICertification {
  _id: string;
  name: string;
  issuer: string;
  date: string;
}

export interface IResumeData {
  personalInfo: IPersonalInfo;
  summary: string;
  experience: IExperience[];
  education: IEducation[];
  projects: IProject[];
  skills: {
    technical: string[];
    soft: string[];
  };
  certifications: ICertification[];
}

export interface IResume {
  _id: string;
  userId: string;
  title: string;
  templateType: 'modern' | 'minimal' | 'creative';
  resumeData: IResumeData;
  createdAt: Date;
  updatedAt: Date;
}

export interface JWTPayload {
  userId: string;
  email: string;
}

export interface AuthRequest {
  user?: JWTPayload;
}
