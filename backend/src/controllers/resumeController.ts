import { Request, Response } from 'express';
import Resume from '../models/Resume';

interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
  };
}

export const getResumes = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const resumes = await Resume.find({ userId: req.user?.userId }).sort({ updatedAt: -1 });
    res.json({resumes:resumes});
  } catch (error) {
    console.error('Get resumes error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getResume = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      userId: req.user?.userId,
    });

    if (!resume) {
      res.status(404).json({ message: 'Resume not found' });
      return;
    }

    res.json(resume);
  } catch (error) {
    console.error('Get resume error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const createResume = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { title, templateType, resumeData } = req.body;

    const resume = await Resume.create({
      userId: req.user?.userId,
      title,
      templateType: templateType || 'modern',
      resumeData: resumeData || {
        personalInfo: {},
        summary: '',
        experience: [],
        education: [],
        projects: [],
        skills: { technical: [], soft: [] },
        certifications: [],
      },
    });

    res.status(201).json(resume);
  } catch (error) {
    console.error('Create resume error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateResume = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { title, templateType, resumeData } = req.body;

    const resume = await Resume.findOneAndUpdate(
      { _id: req.params.id, userId: req.user?.userId },
      { title, templateType, resumeData },
      { new: true, runValidators: true }
    );

    if (!resume) {
      res.status(404).json({ message: 'Resume not found' });
      return;
    }

    res.json(resume);
  } catch (error) {
    console.error('Update resume error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteResume = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const resume = await Resume.findOneAndDelete({
      _id: req.params.id,
      userId: req.user?.userId,
    });

    if (!resume) {
      res.status(404).json({ message: 'Resume not found' });
      return;
    }

    res.json({ message: 'Resume deleted successfully' });
  } catch (error) {
    console.error('Delete resume error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
