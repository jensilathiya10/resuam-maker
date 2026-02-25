'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Sparkles, ArrowLeft, Loader2, Check } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Input';
import { Card, CardContent } from '@/components/ui/Card';
import { useAuthStore } from '@/stores/authStore';
import { useResumeStore } from '@/stores/resumeStore';
import { generateAIResume } from '@/lib/api';

export default function AIGeneratePage() {
  const router = useRouter();
  const { user, isAuthenticated, accessToken } = useAuthStore();
  const { saveResume } = useResumeStore();
  
  const [formData, setFormData] = useState({
    jobRole: '',
    experienceLevel: '',
    skills: '',
    workHistoryNotes: '',
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<any>(null);
  const [error, setError] = useState('');

  if (!isAuthenticated) {
    router.push('/login');
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGenerate = async () => {
    if (!formData.jobRole || !formData.experienceLevel || !formData.skills) {
      setError('Please fill in all required fields');
      return;
    }

    setIsGenerating(true);
    setError('');

    try {
      const skillsArray = formData.skills.split(',').map(s => s.trim());
      
      const response = await generateAIResume(
        {
          type: 'full',
          jobRole: formData.jobRole,
          experienceLevel: formData.experienceLevel,
          skills: skillsArray,
          workHistoryNotes: formData.workHistoryNotes,
        },
        ''
      );

      setGeneratedContent(response.generatedContent);
    } catch (err: any) {
      setError(err.message || 'Failed to generate resume. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveResume = async () => {
    if (!generatedContent || !accessToken) return;

    try {
      const resumeData = {
        title: `${formData.jobRole} Resume`,
        templateType: 'modern',
        resumeData: {
          personalInfo: {
            fullName: user?.name || '',
            email: user?.email || '',
            phone: '',
            location: '',
            linkedin: '',
            portfolio: '',
          },
          summary: generatedContent.summary || '',
          experience: generatedContent.experience || [],
          education: generatedContent.education || [],
          projects: generatedContent.projects || [],
          skills: {
            technical: formData.skills.split(',').map(s => s.trim()),
            soft: [],
          },
          certifications: [],
        },
      };

      await saveResume(resumeData, accessToken);
      router.push('/dashboard');
    } catch (err) {
      setError('Failed to save resume. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button 
            variant="ghost" 
            onClick={() => router.back()}
            className="mr-4"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
              <Sparkles className="w-8 h-8 text-secondary-500 mr-2" />
              Generate with AI
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Let AI create a professional resume based on your details
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Your Information
                </h2>
                
                <div className="space-y-4">
                  <Input
                    label="Job Role *"
                    name="jobRole"
                    placeholder="e.g., Software Engineer, Product Manager"
                    value={formData.jobRole}
                    onChange={handleChange}
                  />

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                      Experience Level *
                    </label>
                    <select
                      name="experienceLevel"
                      value={formData.experienceLevel}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="">Select experience level</option>
                      <option value="entry">Entry Level (0-2 years)</option>
                      <option value="mid">Mid Level (2-5 years)</option>
                      <option value="senior">Senior Level (5-10 years)</option>
                      <option value="executive">Executive (10+ years)</option>
                    </select>
                  </div>

                  <Textarea
                    label="Skills *"
                    name="skills"
                    placeholder="e.g., JavaScript, Python, React, Node.js (comma separated)"
                    value={formData.skills}
                    onChange={handleChange}
                    rows={3}
                  />

                  <Textarea
                    label="Work History Notes"
                    name="workHistoryNotes"
                    placeholder="Briefly describe your work experience, key achievements, companies worked at, etc."
                    value={formData.workHistoryNotes}
                    onChange={handleChange}
                    rows={4}
                  />

                  {error && (
                    <p className="text-sm text-red-500">{error}</p>
                  )}

                  <Button
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className="w-full"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Generating your resume...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5 mr-2" />
                        Generate Resume
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Preview */}
          <div className="space-y-6">
            {generatedContent ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Generated Resume
                      </h2>
                      <span className="flex items-center text-sm text-secondary-500">
                        <Check className="w-4 h-4 mr-1" />
                        AI Generated
                      </span>
                    </div>

                    <div className="space-y-6">
                      {/* Summary */}
                      <div>
                        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                          Professional Summary
                        </h3>
                        <p className="text-gray-900 dark:text-gray-100 text-sm">
                          {generatedContent.summary}
                        </p>
                      </div>

                      {/* Experience */}
                      {generatedContent.experience && generatedContent.experience.length > 0 && (
                        <div>
                          <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                            Work Experience
                          </h3>
                          {generatedContent.experience.map((exp: any, index: number) => (
                            <div key={index} className="mb-3">
                              <p className="font-medium text-gray-900 dark:text-white">
                                {exp.jobTitle}
                              </p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {exp.company}
                              </p>
                              <ul className="mt-1 text-sm text-gray-600 dark:text-gray-400 list-disc list-inside">
{exp.bullets && exp.bullets.map((desc: string, i: number) => (
                                  <li key={i}>{desc}</li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Education */}
                      {generatedContent.education && generatedContent.education.length > 0 && (
                        <div>
                          <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                            Education
                          </h3>
                          {generatedContent.education.map((edu: any, index: number) => (
                            <div key={index} className="mb-2">
                              <p className="font-medium text-gray-900 dark:text-white">
                                {edu.degree}
                              </p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {edu.institution}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}

                      <Button onClick={handleSaveResume} className="w-full">
                        Save Resume to Dashboard
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <Card>
                <CardContent className="p-6">
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Sparkles className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      Your resume preview will appear here
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      Fill in your information and click generate to see your AI-created resume
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
