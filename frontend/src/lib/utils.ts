import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatDateShort(date: string): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
  });
}

export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

export const templates = [
  {
    id: 'modern' as const,
    name: 'Modern Pro',
    description: 'Clean and professional corporate template with a modern touch',
  },
  {
    id: 'minimal' as const,
    name: 'Minimal Elegant',
    description: 'Minimalist design with plenty of white space',
  },
  {
    id: 'creative' as const,
    name: 'Creative Designer',
    description: 'Bold and creative template for design roles',
  },
];

export const defaultResumeData = {
  personalInfo: {
    fullName: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    portfolio: '',
  },
  summary: '',
  experience: [],
  education: [],
  projects: [],
  skills: {
    technical: [],
    soft: [],
  },
  certifications: [],
};
