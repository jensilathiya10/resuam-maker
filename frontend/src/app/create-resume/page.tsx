'use client';

import React, { useState,useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Sparkles, ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent } from '@/components/ui/Card';
import { useAuthStore } from '@/stores/authStore';
import { aiApi } from '@/lib/api';

export default function CreateResumePage() {
  const router = useRouter();
  const { user, isAuthenticated, accessToken } = useAuthStore();
  
  const [formData, setFormData] = useState({
    jobRole: '',
    experienceLevel: '',
    skills: '',
    workHistoryNotes: '',
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGenerate = async () => {
    if (!formData.jobRole || !formData.experienceLevel || !formData.skills) {
      setError('Please fill in all required fields');
      return;
    }

    if (!accessToken) {
      setError('Please login again');
      return;
    }

    setIsGenerating(true);
    setError('');

    try {
      const skillsArray = formData.skills.split(',').map(s => s.trim());
      
      const response = await aiApi.generateFullResume({
        jobRole: formData.jobRole,
        experienceLevel: formData.experienceLevel,
        skills: skillsArray,
        workHistoryNotes: formData.workHistoryNotes,
        userName: user?.name || '',
        userEmail: user?.email || '',
      }, accessToken);

      // Redirect to editor with resume ID
      router.push(`/editor?id=${response.resume._id}`);
    } catch (err: any) {
      setError(err.message || 'Failed to generate resume. Please try again.');
    } finally {
      setIsGenerating(false);
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
              Create Your Resume
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Fill in your details and let AI create a professional resume
            </p>
          </div>
        </div>

        <div className="max-w-2xl mx-auto">
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Skills *
                  </label>
                  <textarea
                    name="skills"
                    placeholder="e.g., JavaScript, Python, React, Node.js (comma separated)"
                    value={formData.skills}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Work History Notes
                  </label>
                  <textarea
                    name="workHistoryNotes"
                    placeholder="Briefly describe your work experience, key achievements, companies worked at, etc."
                    value={formData.workHistoryNotes}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

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
      </div>
    </div>
  );
}
