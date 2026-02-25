import { create } from 'zustand';
import { Resume, ResumeData, TemplateType } from '@/types';
import { resumeApi, aiApi } from '@/lib/api';
import { defaultResumeData, generateId } from '@/lib/utils';
import { CloudCog } from 'lucide-react';
import { Console } from 'console';

interface ResumeState {
  currentResume: Resume | null;
  resumes: Resume[];
  selectedTemplate: TemplateType;
  isLoading: boolean;
  error: string | null;
  
  setCurrentResume: (resume: Resume | null) => void;
  setSelectedTemplate: (template: TemplateType) => void;
  updateResumeData: (data: Partial<ResumeData>) => void;
  fetchResumes: (token: string) => Promise<void>;
  saveResume: (titleOrData: string | { title: string; templateType: string; resumeData: any }, token: string) => Promise<Resume>;
  updateResume: (id: string, data: Partial<Resume>, token: string) => Promise<void>;
  deleteResume: (id: string, token: string) => Promise<void>;
  generateContent: (
    type: 'summary' | 'experience',
    data: any,
    token: string
  ) => Promise<string | string[]>;
  resetCurrentResume: () => void;
}

export const useResumeStore = create<ResumeState>((set, get) => ({
  currentResume: null,
  resumes: [],
  selectedTemplate: 'modern',
  isLoading: false,
  error: null,

  setCurrentResume: (resume) => {
    set({ 
      currentResume: resume,
      selectedTemplate: resume?.templateType || 'modern'
    });
  },

  setSelectedTemplate: (template) => {
    set({ selectedTemplate: template });
    if (get().currentResume) {
      set({
        currentResume: {
          ...get().currentResume!,
          templateType: template,
        },
      });
    }
  },

  updateResumeData: (data) => {
    const { currentResume } = get();
    if (currentResume) {
      set({
        currentResume: {
          ...currentResume,
          resumeData: {
            ...currentResume.resumeData,
            ...data,
          },
        },
      });
    }
  },

  fetchResumes: async (token) => {
    set({ isLoading: true, error: null });
    try {
      const response = await resumeApi.getAll(token);
      set({ resumes: response.resumes, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  saveResume: async (titleOrData, token) => {
    set({ isLoading: true, error: null });
    try {
      const { currentResume, selectedTemplate } = get();
      console.log(titleOrData)
      // Handle both string title and object with full data
      const isObject = typeof titleOrData === 'object';
      const title = isObject ? titleOrData.title : titleOrData;
      const templateType = isObject ? titleOrData.templateType : selectedTemplate;
      const resumeData = isObject ? titleOrData.resumeData : (currentResume?.resumeData || defaultResumeData);
      console.log(title)
      const response = await resumeApi.create(
        {
          title,
          templateType,
          resumeData,
        },
        token
      );
      console.log(response.resume)
      
      set((state) => ({
        resumes: [...state.resumes || [], response.resume],
        currentResume: response.resume,
        isLoading: false,
      }));
      
      return response.resume;
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  updateResume: async (id, data, token) => {
    set({ isLoading: true, error: null });
    try {
      const response = await resumeApi.update(id, data, token);
      
      set((state) => ({
        resumes: state.resumes.map((r) =>
          r._id === id ? response.resume : r
        ),
        currentResume: state.currentResume?._id === id
          ? response.resume
          : state.currentResume,
        isLoading: false,
      }));
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  deleteResume: async (id, token) => {
    set({ isLoading: true, error: null });
    try {
      await resumeApi.delete(id, token);
      
      set((state) => ({
        resumes: state.resumes.filter((r) => r._id !== id),
        currentResume: state.currentResume?._id === id ? null : state.currentResume,
        isLoading: false,
      }));
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  generateContent: async (type, data, token) => {
    set({ isLoading: true, error: null });
    try {
      const response = await aiApi.generate(data, token);
      set({ isLoading: false });
      return response.generatedContent;
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  resetCurrentResume: () => {
    set({
      currentResume: null,
      selectedTemplate: 'modern',
    });
  },
}));
