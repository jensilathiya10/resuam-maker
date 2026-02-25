import { Request, Response } from 'express';
import { generateSummary, generateExperienceBullets, generateFullResume as generateFullResumeContent, generateResumeVariants } from '../services/aiService';
import Resume from '../models/Resume';

interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
  };
}

export const generateResumeContent = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { type, jobRole, experienceLevel, skills, workHistoryNotes, jobTitle, company, experienceDetails } = req.body;

    let generatedContent: any;

    if (type === 'summary') {
      if (!jobRole || !experienceLevel || !skills || !workHistoryNotes) {
        res.status(400).json({ message: 'Missing required fields for summary generation' });
        return;
      }

      generatedContent = await generateSummary(
        jobRole,
        experienceLevel,
        skills,
        workHistoryNotes
      );
    } else if (type === 'experience') {
      if (!jobTitle || !company || !experienceDetails) {
        res.status(400).json({ message: 'Missing required fields for experience generation' });
        return;
      }

      generatedContent = await generateExperienceBullets(
        jobTitle,
        company,
        experienceDetails
      );
    } else if (type === 'full') {
      if (!jobRole || !experienceLevel || !skills) {
        res.status(400).json({ message: 'Missing required fields for full resume generation' });
        return;
      }

      generatedContent = await generateFullResumeContent(
        jobRole,
        experienceLevel,
        skills,
        workHistoryNotes || ''
      );
    } else {
      res.status(400).json({ message: 'Invalid generation type' });
      return;
    }

    res.json({ generatedContent });
  } catch (error) {
    console.error('AI generation error:', error);
    res.status(500).json({ message: 'Failed to generate content' });
  }
};

// New endpoint: Generate 3 resume variants for editor
export const generateResumePreviews = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { personalInfo, skills, experience, education, projects } = req.body;

    if (!personalInfo?.fullName || !skills) {
      res.status(400).json({ message: 'Missing required fields' });
      return;
    }

    // Generate 3 different resume variants
    const resumes = await generateResumeVariants(
      personalInfo,
      skills,
      experience || [],
      education || [],
      projects || []
    );

    res.json({ resumes });
  } catch (error) {
    console.error('AI generate resume previews error:', error);
    res.status(500).json({ message: 'Failed to generate resume previews' });
  }
};

// Generate full resume and save to database
export const generateFullResume = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { jobRole, experienceLevel, skills, workHistoryNotes, userName, userEmail } = req.body;

    if (!jobRole || !experienceLevel || !skills) {
      res.status(400).json({ message: 'Missing required fields' });
      return;
    }

    const skillsArray = Array.isArray(skills) ? skills : skills.split(',').map((s: string) => s.trim());

    // Generate the resume content
    const generatedContent = await generateFullResumeContent(
      jobRole,
      experienceLevel,
      skillsArray,
      workHistoryNotes || ''
    );

    // Create resume data structure - map AI response to database schema
    const experienceArray = (generatedContent.experience || []).map((exp: any) => ({
      jobTitle: exp.jobTitle || '',
      company: exp.company || '',
      location: '',
      startDate: '',
      endDate: '',
      description: exp.bullets || [],
    }));

    const projectsArray = (generatedContent.projects || []).map((proj: any) => ({
      name: proj.name || '',
      description: proj.description || '',
      technologies: proj.technologies || [],
      link: '',
    }));

    // Save resume to database
    const resume = await Resume.create({
      userId: req.user?.userId,
      title: `${jobRole} Resume`,
      templateType: 'modern',
      resumeData: {
        personalInfo: {
          fullName: userName || '',
          email: userEmail || '',
          phone: '',
          location: '',
          linkedin: '',
          portfolio: '',
        },
        summary: generatedContent.summary || '',
        experience: experienceArray,
        education: [],
        projects: projectsArray,
        skills: {
          technical: skillsArray,
          soft: [],
        },
        certifications: [],
      },
    });

    res.json({ resume });
  } catch (error) {
    console.error('AI generate resume error:', error);
    res.status(500).json({ message: 'Failed to generate resume' });
  }
};
