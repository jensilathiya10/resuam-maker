import mongoose, { Schema, Document } from 'mongoose';

const ResumeSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  templateType: {
    type: String,
    enum: ['modern', 'minimal', 'creative'],
    default: 'modern',
  },
  resumeData: {
    personalInfo: {
      fullName: String,
      email: String,
      phone: String,
      location: String,
      linkedin: String,
      portfolio: String,
    },
    summary: String,
    experience: [{
      jobTitle: String,
      company: String,
      location: String,
      startDate: String,
      endDate: String,
      description: [String],
    }],
    education: [{
      degree: String,
      institution: String,
      location: String,
      startDate: String,
      endDate: String,
      gpa: String,
    }],
    projects: [{
      name: String,
      description: String,
      technologies: [String],
      link: String,
    }],
    skills: {
      technical: [String],
      soft: [String],
    },
    certifications: [{
      name: String,
      issuer: String,
      date: String,
    }],
  },
}, {
  timestamps: true,
});

export interface IResume extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  templateType: 'modern' | 'minimal' | 'creative';
  resumeData: {
    personalInfo: {
      fullName?: string;
      email?: string;
      phone?: string;
      location?: string;
      linkedin?: string;
      portfolio?: string;
    };
    summary?: string;
    experience: Array<{
      jobTitle?: string;
      company?: string;
      location?: string;
      startDate?: string;
      endDate?: string;
      description?: string[];
    }>;
    education: Array<{
      degree?: string;
      institution?: string;
      location?: string;
      startDate?: string;
      endDate?: string;
      gpa?: string;
    }>;
    projects: Array<{
      name?: string;
      description?: string;
      technologies?: string[];
      link?: string;
    }>;
    skills: {
      technical?: string[];
      soft?: string[];
    };
    certifications: Array<{
      name?: string;
      issuer?: string;
      date?: string;
    }>;
  };
  createdAt: Date;
  updatedAt: Date;
}

const Resume = mongoose.model<IResume>('Resume', ResumeSchema);

export default Resume;
