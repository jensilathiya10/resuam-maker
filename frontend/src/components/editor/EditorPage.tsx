'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Save, Download, ChevronDown, ChevronUp, Plus, Trash2,
  Sparkles, ArrowLeft, Loader2, Check, Eye, FileText, Palette
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import { useAuthStore } from '@/stores/authStore';
import { useResumeStore } from '@/stores/resumeStore';
import { ResumeData, TemplateType } from '@/types';
import { PDFDownloadLink, pdf } from '@react-pdf/renderer';
import ResumePDF from '@/components/resume/ResumePDF';

const emptyResumeData: ResumeData = {
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

// AI Generated Resume Types
type AIResumeVariant = {
  id: string;
  name: string;
  style: 'classic' | 'modern' | 'creative';
  summary: string;
  experience: Array<{
    jobTitle: string;
    company: string;
    location?: string;
    startDate: string;
    endDate: string;
    description: string[];
  }>;
};

export default function EditorPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, accessToken } = useAuthStore();
  const { updateResume, saveResume, isLoading: isSaving } = useResumeStore();

  const [resumeData, setResumeData] = useState<ResumeData>(emptyResumeData);
  const [template, setTemplate] = useState<TemplateType>('modern');
  const [title, setTitle] = useState('My Resume');
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    personal: true,
    summary: true,
    experience: true,
    education: true,
    projects: true,
    skills: true,
    certifications: false,
  });

  // AI Generation State
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiResumes, setAiResumes] = useState<AIResumeVariant[]>([]);
  const [selectedAIResume, setSelectedAIResume] = useState<number>(0);
  const [showAIResumes, setShowAIResumes] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    const resumeId = searchParams.get('id');
    const templateParam = searchParams.get('template');

    if (templateParam && ['modern', 'minimal', 'creative'].includes(templateParam)) {
      setTemplate(templateParam as TemplateType);
    }

    if (resumeId && accessToken) {
      const loadResume = async () => {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/resumes/${resumeId}`, {
            headers: { 'Authorization': `Bearer ${accessToken}` },
          });

          if (response.ok) {
            const data = await response.json();
            console.log(data.resumeData)
            if (data.resumeData) {
              setResumeData(data.resumeData);
              setTitle(data.title);
              setTemplate(data.templateType);
              console.log(resumeData)
            }
          }
        } catch (error) {
          console.error('Failed to load resume:', error);
        }
      };
      loadResume();
    }
  }, [isAuthenticated, router, searchParams, accessToken]);

  const handleInputChange = (section: string, field: string, value: any) => {
    if (section === 'personalInfo') {
      setResumeData((prev: ResumeData) => ({
        ...prev,
        personalInfo: { ...prev.personalInfo, [field]: value },
      }));
    } else if (section === 'skills') {
      setResumeData((prev: ResumeData) => ({
        ...prev,
        skills: { ...prev.skills, [field]: value },
      }));
    }
    console.log(resumeData)
  };

  const handleArrayAdd = (section: keyof ResumeData) => {
    const newItem = section === 'experience'
      ? { jobTitle: '', company: '', location: '', startDate: '', endDate: '', description: [] as string[] }
      : section === 'education'
        ? { degree: '', institution: '', location: '', startDate: '', endDate: '', gpa: '' }
        : section === 'projects'
          ? { name: '', description: '', technologies: [] as string[], link: '' }
          : section === 'certifications'
            ? { name: '', issuer: '', date: '' }
            : {};
    setResumeData((prev: ResumeData) => ({
      ...prev,
      [section]: [...(prev as any)[section], newItem],
    }));
  };

  const handleArrayRemove = (section: keyof ResumeData, index: number) => {
    setResumeData((prev: ResumeData) => ({
      ...prev,
      [section]: (prev as any)[section].filter((_: any, i: number) => i !== index),
    }));
  };

  const handleArrayItemChange = (section: keyof ResumeData, index: number, field: string, value: any) => {
    setResumeData((prev: ResumeData) => {
      const items = [...(prev as any)[section]];
      items[index] = { ...items[index], [field]: value };
      return { ...prev, [section]: items };
    });
    console.log(resumeData)
  };

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  // AI Generate Handler
  const handleAIGenerate = async () => {
    if (!accessToken || !resumeData.personalInfo.fullName) {
      alert('Please fill in your name first');
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ai/generate-resume-previews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          personalInfo: resumeData.personalInfo,
          skills: resumeData.skills,
          experience: resumeData.experience,
          education: resumeData.education,
          projects: resumeData.projects,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.resumes && data.resumes.length > 0) {
          setAiResumes(data.resumes);
          setShowAIResumes(true);
          setSelectedAIResume(0);
        }
      } else {
        alert('Failed to generate resumes. Please try again.');
      }
    } catch (error) {
      console.error('AI Generation error:', error);
      alert('Error generating resumes. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = async () => {
    if (!resumeData) return;
    console.log(template)
    const blob = await pdf(
      <ResumePDF resumeData={resumeData} template={template} />
    ).toBlob();

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${'resume'}.pdf`;
    link.click();

    URL.revokeObjectURL(url);
  };


  // Apply AI Resume
  const applyAIResume = (index: number) => {
    const selected = aiResumes[index];
    if (!selected) return;

    setResumeData((prev: ResumeData) => ({
      ...prev,
      summary: selected.summary || prev.summary,
      experience: selected.experience?.length > 0 ? selected.experience : prev.experience,
    }));
    setShowAIResumes(false);
    // Set template based on style
    if (selected.style === 'classic') setTemplate('modern');
    else if (selected.style === 'modern') setTemplate('minimal');
    else setTemplate('creative');
  };

  const handleSave = async () => {
    if (!accessToken) return;
    const id = searchParams.get('id')
    if (id) {

      await updateResume(id, { resumeData }, accessToken)
      router.push('/dashboard');
    }
    else {
      await saveResume({ title, templateType: template, resumeData }, accessToken);
      router.push('/dashboard');
    }

  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-slate-800 flex flex-col">
      {/* Header */}
      <header className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center justify-between sticky top-14 z-10">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={() => router.push('/dashboard')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-lg font-semibold bg-transparent border-none focus:outline-none text-gray-900 dark:text-white"
          />
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" onClick={handleSave} disabled={isSaving}>
            {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            Save
          </Button>
          <Button variant="primary" onClick={handleDownload}>
            <Download className="w-4 h-4 mr-2" />
            Download PDF
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Left Panel - Form */}
        <div className="w-1/2 overflow-y-auto p-6 space-y-4">
          {/* Personal Information */}
          <Card>
            <div className="p-4 flex items-center justify-between cursor-pointer" onClick={() => toggleSection('personal')}>
              <h3 className="font-semibold text-gray-900 dark:text-white">Personal Information</h3>
              {expandedSections.personal ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </div>
            {expandedSections.personal && (
              <CardContent className="pt-0 space-y-4">
                <Input label="Full Name" value={resumeData.personalInfo.fullName} onChange={(e) => handleInputChange('personalInfo', 'fullName', e.target.value)} placeholder="John Doe" />
                <div className="grid grid-cols-2 gap-4">
                  <Input label="Email" type="email" value={resumeData.personalInfo.email} onChange={(e) => handleInputChange('personalInfo', 'email', e.target.value)} placeholder="john@example.com" />
                  <Input label="Phone" value={resumeData.personalInfo.phone} onChange={(e) => handleInputChange('personalInfo', 'phone', e.target.value)} placeholder="+1 (555) 123-4567" />
                </div>
                <Input label="Location" value={resumeData.personalInfo.location} onChange={(e) => handleInputChange('personalInfo', 'location', e.target.value)} placeholder="San Francisco, CA" />
                <div className="grid grid-cols-2 gap-4">
                  <Input label="LinkedIn" value={resumeData.personalInfo.linkedin} onChange={(e) => handleInputChange('personalInfo', 'linkedin', e.target.value)} placeholder="linkedin.com/in/johndoe" />
                  <Input label="Portfolio" value={resumeData.personalInfo.portfolio} onChange={(e) => handleInputChange('personalInfo', 'portfolio', e.target.value)} placeholder="johndoe.com" />
                </div>
              </CardContent>
            )}
          </Card>

          {/* Professional Summary */}
          <Card>
            <div className="p-4 flex items-center justify-between cursor-pointer" onClick={() => toggleSection('summary')}>
              <h3 className="font-semibold text-gray-900 dark:text-white">Professional Summary</h3>
              {expandedSections.summary ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </div>
            {expandedSections.summary && (
              <CardContent className="pt-0">
                <div className="relative">
                  <textarea
                    value={resumeData.summary || ''}
                    onChange={(e) => setResumeData((prev) => ({ ...prev, summary: e.target.value }))}
                    placeholder="Write a brief professional summary..."
                    rows={4}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                  />
                  <Button variant="primary" size="sm" className="absolute bottom-3 right-3" onClick={handleAIGenerate} disabled={isGenerating}>
                    {isGenerating ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Sparkles className="w-4 h-4 mr-1" />}
                    {isGenerating ? 'Generating...' : 'Generate with AI'}
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  AI will create 3 different professional resume styles based on your details
                </p>
              </CardContent>
            )}
          </Card>

          {/* Work Experience */}
          <Card>
            <div className="p-4 flex items-center justify-between cursor-pointer" onClick={() => toggleSection('experience')}>
              <h3 className="font-semibold text-gray-900 dark:text-white">Work Experience</h3>
              {expandedSections.experience ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </div>
            {expandedSections.experience && (
              <CardContent className="pt-0 space-y-4">
                {resumeData.experience.map((exp, index) => (
                  <div key={index} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-500">Experience {index + 1}</span>
                      <Button variant="ghost" size="sm" onClick={() => handleArrayRemove('experience', index)} className="text-red-500">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <Input label="Job Title" value={exp.jobTitle} onChange={(e) => handleArrayItemChange('experience', index, 'jobTitle', e.target.value)} placeholder="Software Engineer" />
                    <Input label="Company" value={exp.company} onChange={(e) => handleArrayItemChange('experience', index, 'company', e.target.value)} placeholder="Tech Company Inc." />
                    <div className="grid grid-cols-2 gap-4">
                      <Input label="Start Date" value={exp.startDate} onChange={(e) => handleArrayItemChange('experience', index, 'startDate', e.target.value)} placeholder="Jan 2020" />
                      <Input label="End Date" value={exp.endDate} onChange={(e) => handleArrayItemChange('experience', index, 'endDate', e.target.value)} placeholder="Present" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                      <textarea value={(exp.description || []).join('\n')} onChange={(e) => handleArrayItemChange('experience', index, 'description', e.target.value.split('\n'))} placeholder="• Led development of..." rows={4} className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none" />
                    </div>
                  </div>
                ))}
                <Button variant="outline" onClick={() => handleArrayAdd('experience')} className="w-full">
                  <Plus className="w-4 h-4 mr-2" /> Add Experience
                </Button>
              </CardContent>
            )}
          </Card>

          {/* Education */}
          <Card>
            <div className="p-4 flex items-center justify-between cursor-pointer" onClick={() => toggleSection('education')}>
              <h3 className="font-semibold text-gray-900 dark:text-white">Education</h3>
              {expandedSections.education ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </div>
            {expandedSections.education && (
              <CardContent className="pt-0 space-y-4">
                {resumeData.education.map((edu, index) => (
                  <div key={index} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-500">Education {index + 1}</span>
                      <Button variant="ghost" size="sm" onClick={() => handleArrayRemove('education', index)} className="text-red-500">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <Input label="Degree" value={edu.degree} onChange={(e) => handleArrayItemChange('education', index, 'degree', e.target.value)} placeholder="Bachelor of Science in Computer Science" />
                    <Input label="Institution" value={edu.institution} onChange={(e) => handleArrayItemChange('education', index, 'institution', e.target.value)} placeholder="Stanford University" />
                    <div className="grid grid-cols-2 gap-4">
                      <Input label="Start Date" value={edu.startDate} onChange={(e) => handleArrayItemChange('education', index, 'startDate', e.target.value)} placeholder="Sep 2016" />
                      <Input label="End Date" value={edu.endDate} onChange={(e) => handleArrayItemChange('education', index, 'endDate', e.target.value)} placeholder="Jun 2020" />
                    </div>
                  </div>
                ))}
                <Button variant="outline" onClick={() => handleArrayAdd('education')} className="w-full">
                  <Plus className="w-4 h-4 mr-2" /> Add Education
                </Button>
              </CardContent>
            )}
          </Card>

          {/* Skills */}
          <Card>
            <div className="p-4 flex items-center justify-between cursor-pointer" onClick={() => toggleSection('skills')}>
              <h3 className="font-semibold text-gray-900 dark:text-white">Skills</h3>
              {expandedSections.skills ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </div>
            {expandedSections.skills && (
              <CardContent className="pt-0 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Technical Skills</label>
                  <input
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    type="text"
                    value={resumeData.skills.technical?.join(', ') || ''}
                    onChange={(e) =>
                      setResumeData((prev) => ({
                        ...prev,
                        skills: {
                          ...prev.skills,
                          technical: e.target.value.split(',').map(s => s.trim())
                        }
                      }))
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Soft Skills</label>
                  <input
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    type="text"
                    value={resumeData.skills.soft?.join(', ') || ''}
                    onChange={(e) =>
                      setResumeData((prev) => ({
                        ...prev,
                        skills: {
                          ...prev.skills,
                          soft: e.target.value.split(',').map(s => s.trim())
                        }
                      }))
                    }
                  />
                </div>
              </CardContent>
            )}
          </Card>

          {/* Projects */}
          <Card>
            <div className="p-4 flex items-center justify-between cursor-pointer" onClick={() => toggleSection('projects')}>
              <h3 className="font-semibold text-gray-900 dark:text-white">Projects</h3>
              {expandedSections.projects ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </div>
            {expandedSections.projects && (
              <CardContent className="pt-0 space-y-4">
                {resumeData.projects.map((project, index) => (
                  <div key={index} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-500">Project {index + 1}</span>
                      <Button variant="ghost" size="sm" onClick={() => handleArrayRemove('projects', index)} className="text-red-500">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <Input label="Project Name" value={project.name} onChange={(e) => handleArrayItemChange('projects', index, 'name', e.target.value)} placeholder="E-commerce Platform" />
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                      <textarea value={project.description} onChange={(e) => handleArrayItemChange('projects', index, 'description', e.target.value)} placeholder="Built a full-stack e-commerce platform..." rows={3} className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none" />
                    </div>
                    <Input label="Technologies" value={(project.technologies || []).join(', ')} onChange={(e) => handleArrayItemChange('projects', index, 'technologies', e.target.value.split(',').map(s => s.trim()).filter(Boolean))} placeholder="React, Node.js, MongoDB..." />
                    <Input label="Link" value={project.link} onChange={(e) => handleArrayItemChange('projects', index, 'link', e.target.value)} placeholder="github.com/user/project" />
                  </div>
                ))}
                <Button variant="outline" onClick={() => handleArrayAdd('projects')} className="w-full">
                  <Plus className="w-4 h-4 mr-2" /> Add Project
                </Button>
              </CardContent>
            )}
          </Card>

          {/* Certifications */}
          <Card>
            <div className="p-4 flex items-center justify-between cursor-pointer" onClick={() => toggleSection('certifications')}>
              <h3 className="font-semibold text-gray-900 dark:text-white">Certifications</h3>
              {expandedSections.certifications ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </div>
            {expandedSections.certifications && (
              <CardContent className="pt-0 space-y-4">
                {resumeData.certifications.map((cert, index) => (
                  <div key={index} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-500">Certification {index + 1}</span>
                      <Button variant="ghost" size="sm" onClick={() => handleArrayRemove('certifications', index)} className="text-red-500">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <Input label="Certification Name" value={cert.name} onChange={(e) => handleArrayItemChange('certifications', index, 'name', e.target.value)} placeholder="AWS Solutions Architect" />
                    <Input label="Issuer" value={cert.issuer} onChange={(e) => handleArrayItemChange('certifications', index, 'issuer', e.target.value)} placeholder="Amazon Web Services" />
                    <Input label="Date" value={cert.date} onChange={(e) => handleArrayItemChange('certifications', index, 'date', e.target.value)} placeholder="Jan 2023" />
                  </div>
                ))}
                <Button variant="outline" onClick={() => handleArrayAdd('certifications')} className="w-full">
                  <Plus className="w-4 h-4 mr-2" /> Add Certification
                </Button>
              </CardContent>
            )}
          </Card>
        </div>

        {/* Right Panel - Preview */}
        <div className="w-1/2 bg-gray-200 sticky top-28  dark:bg-slate-900 p-6 overflow-y-auto h-fit flex justify-center">
          <div className="bg-white w-[210mm] min-h-[297mm] shadow-2xl transform scale-90 origin-top">
            {/* Modern/Classic Template */}
            {template === 'modern' && (
              <div className="p-8 font-serif">
                <div className="border-b-2 border-gray-800 pb-4 mb-6">
                  <h1 className="text-3xl font-bold text-gray-900">{resumeData.personalInfo?.fullName || 'Your Name'}</h1>
                  <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-600">
                    {resumeData.personalInfo?.email && <span>{resumeData.personalInfo.email}</span>}
                    {resumeData.personalInfo?.phone && <span>• {resumeData.personalInfo.phone}</span>}
                    {resumeData.personalInfo?.location && <span>• {resumeData.personalInfo.location}</span>}
                  </div>
                </div>
                {resumeData.summary && (
                  <div className="mb-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-2">Professional Summary</h2>
                    <p className="text-sm text-gray-700">{resumeData.summary}</p>
                  </div>
                )}
                {(resumeData.experience || []).length > 0 && (
                  <div className="mb-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-3">Work Experience</h2>
                    {resumeData.experience.map((exp, index) => (
                      <div key={index} className="mb-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-gray-900">{exp.jobTitle}</h3>
                            <p className="text-sm text-gray-600">{exp.company}</p>
                            {exp.description?.length > 0 && (
                              <ul className="mt-1 list-disc list-inside text-sm text-gray-600">
                                {exp.description.map((point, i) => (
                                  <li key={i}>{point}</li>
                                ))}
                              </ul>
                            )}
                          </div>
                          <span className="text-sm text-gray-500">{exp.startDate} - {exp.endDate}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {(resumeData.education || []).length > 0 && (
                  <div className="mb-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-3">Education</h2>
                    {resumeData.education.map((edu, index) => (
                      <div key={index} className="mb-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-gray-900">{edu.degree}</h3>
                            <p className="text-sm text-gray-600">{edu.institution}</p>
                          </div>
                          <span className="text-sm text-gray-500">
                            {edu.startDate} - {edu.endDate}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {((resumeData.skills?.technical?.length || 0) > 0) && (
                  <div className='mb-6'>
                    <h2 className="text-lg font-semibold text-gray-900 mb-1">Skills</h2>
                    <ul
                      className={`list-disc list-inside text-sm text-gray-600 space-y-1 ${resumeData.skills.technical.length > 4 ? 'grid grid-cols-2 gap-x-6 gap-y-1' : ''
                        }`}
                    >
                      {resumeData.skills.technical.map((skill, index) => (
                        <li key={index}>{skill}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {((resumeData.skills?.soft?.length || 0) > 0) && (
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-">Soft Skills</h2>
                    <ul
                      className={`list-disc list-inside text-sm text-gray-600 space-y-1 ${resumeData.skills.soft.length > 4 ? 'grid grid-cols-2 gap-x-6 gap-y-1' : ''
                        }`}
                    >
                      {resumeData.skills.soft.map((skill, index) => (
                        <li key={index}>{skill}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Minimal Template */}
            {template === 'minimal' && (
              <div className="p-10 font-sans">
                <h1 className="text-4xl font-light text-gray-900 mb-2">{resumeData.personalInfo?.fullName || 'Your Name'}</h1>
                <div className="flex gap-4 text-sm text-gray-500 mb-8">
                  {resumeData.personalInfo?.email && <span>{resumeData.personalInfo.email}</span>}
                  {resumeData.personalInfo?.phone && <span>{resumeData.personalInfo.phone}</span>}
                  {resumeData.personalInfo?.location && <span>{resumeData.personalInfo.location}</span>}
                </div>
                {resumeData.summary && <p className="text-gray-600 mb-8 leading-relaxed">{resumeData.summary}</p>}
                {(resumeData.experience || []).length > 0 && (
                  <div className="mb-8">
                    <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Experience</h2>
                    {resumeData.experience.map((exp, index) => (
                      <div key={index} className="mb-4">
                        <div className="flex justify-between">
                          <h3 className="font-medium text-gray-900">{exp.jobTitle}</h3>
                          <span className="text-sm text-gray-500">{exp.startDate} — {exp.endDate}</span>
                        </div>
                        <p className="text-gray-600">{exp.company}</p>
                      </div>
                    ))}
                  </div>
                )}
                {((resumeData.skills?.technical?.length || 0) > 0) && (
                  <div>
                    <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Skills</h2>
                    <p className="text-gray-600">{(resumeData.skills?.technical || []).join(' · ')}</p>
                  </div>
                )}
                {((resumeData.skills?.soft?.length || 0) > 0) && (
                  <div>
                    <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Soft Skills</h2>
                    <p className="text-gray-600">{(resumeData.skills?.soft || []).join(' · ')}</p>
                  </div>
                )}
              </div>
            )}

            {/* Creative Template */}
            {template === 'creative' && (
              <div className="h-full font-sans">
                <div className="bg-gradient-to-r from-violet-600 to-pink-600 p-8 text-white">
                  <h1 className="text-4xl font-bold mb-2">{resumeData.personalInfo?.fullName || 'Your Name'}</h1>
                  <div className="flex gap-4 opacity-90">
                    {resumeData.personalInfo?.email && <span>{resumeData.personalInfo.email}</span>}
                    {resumeData.personalInfo?.phone && <span>• {resumeData.personalInfo.phone}</span>}
                    {resumeData.personalInfo?.location && <span>• {resumeData.personalInfo.location}</span>}
                  </div>
                </div>
                <div className="p-8">
                  {resumeData.summary && <p className="text-gray-600 mb-6">{resumeData.summary}</p>}
                  {((resumeData.skills?.technical?.length || 0) > 0) && (
                    <div className="mb-6">
                      <h2 className="font-semibold text-gray-900 mb-3">Skills</h2>
                      <div className="flex flex-wrap gap-2">
                        {(resumeData.skills?.technical || []).map((skill, i) => (
                          <span key={i} className="px-3 py-1 bg-violet-100 text-violet-700 rounded-full text-sm">{skill}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  {((resumeData.skills?.soft?.length || 0) > 0) && (
                    <div className="mb-6">
                      <h2 className="font-semibold text-gray-900 mb-3">Soft Skills</h2>
                      <div className="flex flex-wrap gap-2">
                        {(resumeData.skills?.soft || []).map((skill, i) => (
                          <span key={i} className="px-3 py-1 bg-violet-100 text-violet-700 rounded-full text-sm">{skill}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  {(resumeData.experience || []).length > 0 && (
                    <div>
                      <h2 className="font-semibold text-gray-900 mb-3">Experience</h2>
                      {resumeData.experience.map((exp, index) => (
                        <div key={index} className="mb-3">
                          <h3 className="font-medium text-gray-900">{exp.jobTitle}</h3>
                          <p className="text-gray-600 text-sm">{exp.company} | {exp.startDate} - {exp.endDate}</p>

                          {exp.description?.length > 0 && (
                            <ul className="mt-1 list-disc list-inside text-sm text-gray-600">
                              {exp.description.map((point, i) => (
                                <li key={i}>{point}</li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                  {(resumeData.education || []).length > 0 && (
                    <div className="mb-6">
                      <h2 className="text-lg font-semibold text-gray-900 mb-3">Education</h2>
                      {resumeData.education.map((edu, index) => (
                        <div key={index} className="mb-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-semibold text-gray-900">{edu.degree}</h3>
                              <p className="text-sm text-gray-600">{edu.institution}</p>
                            </div>
                            <span className="text-sm text-gray-500">
                              {edu.startDate} - {edu.endDate}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* AI Resume Selection Modal */}
      <Modal isOpen={showAIResumes} onClose={() => setShowAIResumes(false)} title="Choose Your Resume Style" size="xl">
        <div className="grid grid-cols-3 gap-4">
          {aiResumes.map((resume, index) => (
            <motion.div
              key={resume.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-4 border-2 rounded-xl cursor-pointer transition-all hover:shadow-lg ${selectedAIResume === index ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' : 'border-gray-200 dark:border-gray-700'
                }`}
              onClick={() => setSelectedAIResume(index)}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  {resume.style === 'classic' && <FileText className="w-5 h-5" />}
                  {resume.style === 'modern' && <Eye className="w-5 h-5" />}
                  {resume.style === 'creative' && <Palette className="w-5 h-5" />}
                  <span className="font-semibold text-gray-900 dark:text-white capitalize">{resume.name}</span>
                </div>
                {selectedAIResume === index && <Check className="w-5 h-5 text-primary-600" />}
              </div>
              <div className="text-xs text-gray-500 mb-3 capitalize">{resume.style} Style</div>
              <div className="h-24 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 p-2 text-xs overflow-hidden">
                <div className="font-bold">{resume.summary?.substring(0, 80)}...</div>
              </div>
            </motion.div>
          ))}
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="outline" onClick={() => setShowAIResumes(false)}>Cancel</Button>
          <Button variant="primary" onClick={() => applyAIResume(selectedAIResume)}>
            <Check className="w-4 h-4 mr-2" />
            Apply This Style
          </Button>
        </div>
      </Modal>
    </div>
  );
}
