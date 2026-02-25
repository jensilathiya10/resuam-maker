const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

interface FetchOptions extends RequestInit {
  token?: string;
}

class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = 'ApiError';
  }
}

export async function api<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const { token: providedToken, ...fetchOptions } = options;

  // Get token from localStorage if not provided
  const token = providedToken || (typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null);

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...fetchOptions.headers,
  };

  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }

  let response = await fetch(`${API_URL}${endpoint}`, {
    ...fetchOptions,
    headers,
  });

  // If unauthorized, throw error - user needs to re-login
  if (response.status === 401) {
    throw new ApiError('Session expired. Please login again.', 401);
  }

  if (!response.ok) {
    const error: { message: string } = await response.json().catch(() => ({
      message: 'An error occurred',
    }));
    throw new ApiError(error.message, response.status);
  }

  return response.json();
}

// Auth API
export const authApi = {
  register: (data: { name: string; email: string; password: string }) =>
    api<{ user: any; accessToken: string; refreshToken: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  login: (data: { email: string; password: string }) =>
    api<{ user: any; accessToken: string; refreshToken: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  refresh: (refreshToken: string) =>
    api<{ accessToken: string }>('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    }),

  logout: (refreshToken: string) =>
    api<{ message: string }>('/auth/logout', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    }),
};

// Resume API
export const resumeApi = {
  getAll: (token: string) =>
    api<{ resumes: any[] }>('/resumes', { token }),

  getById: (id: string, token: string) =>
    api<{ resume: any }>(`/resumes/${id}`, { token }),

  create: (data: { title: string; templateType: string; resumeData: any }, token: string) =>
    api<{ resume: any }>('/resumes', {
      method: 'POST',
      body: JSON.stringify(data),
      token,
    }),

  update: (id: string, data: Partial<{ title: string; templateType: string; resumeData: any }>, token: string) =>
    api<{ resume: any }>(`/resumes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
      token,
    }),

  delete: (id: string, token: string) =>
    api<{ message: string }>(`/resumes/${id}`, {
      method: 'DELETE',
      token,
    }),
};

// AI API
export const aiApi = {
  generate: (
    data: {
      type: 'summary' | 'experience' | 'full';
      jobRole?: string;
      experienceLevel?: string;
      skills?: string[];
      workHistoryNotes?: string;
      jobTitle?: string;
      company?: string;
      experienceDetails?: string;
    },
    token: string
  ) =>
    api<{ generatedContent: any }>('/ai/generate', {
      method: 'POST',
      body: JSON.stringify(data),
      token,
    }),

  generateFullResume: (
    data: {
      jobRole: string;
      experienceLevel: string;
      skills: string[];
      workHistoryNotes?: string;
      userName?: string;
      userEmail?: string;
    },
    token: string
  ) =>
    api<{ resume: any }>('/ai/generate-resume', {
      method: 'POST',
      body: JSON.stringify(data),
      token,
    }),

  generateResumePreviews: (
    data: {
      personalInfo: {
        fullName: string;
        email: string;
        phone: string;
        location: string;
        linkedin: string;
        portfolio: string;
      };
      skills: { technical: string[]; soft: string[] };
      experience: Array<{
        jobTitle: string;
        company: string;
        location: string;
        startDate: string;
        endDate: string;
        description: string[];
      }>;
      education: Array<{
        degree: string;
        institution: string;
        location: string;
        startDate: string;
        endDate: string;
      }>;
      projects: Array<{
        name: string;
        description: string;
        technologies: string[];
        link: string;
      }>;
    },
    token: string
  ) =>
    api<{
      resumes: Array<{
        id: string;
        name: string;
        style: 'classic' | 'modern' | 'creative';
        summary: string;
        experience: Array<{
          jobTitle: string;
          company: string;
          location: string;
          startDate: string;
          endDate: string;
          description: string[];
        }>;
      }>
    }>('/ai/generate-resume-previews', {
      method: 'POST',
      body: JSON.stringify(data),
      token,
    }),
};

// Helper function for AI resume generation
export async function generateAIResume(
  data: {
    type: 'full';
    jobRole: string;
    experienceLevel: string;
    skills: string[];
    workHistoryNotes: string;
  },
  token: string
) {
  return aiApi.generate(data, token);
}


