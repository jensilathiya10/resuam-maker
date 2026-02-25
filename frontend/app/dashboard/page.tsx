'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, FileText, Clock, Sparkles, PenTool, CloudCog } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import { useAuthStore } from '@/stores/authStore';
import { useResumeStore } from '@/stores/resumeStore';
import { formatDate } from '@/lib/utils';
import { Resume } from '@/types';
import { access } from 'fs';

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, accessToken } = useAuthStore();
  const { resumes, fetchResumes, deleteResume, isLoading } = useResumeStore();
  const [isModalOpen, setIsModalOpen] = useState(false);


  useEffect(() => {
    if (!isAuthenticated || !accessToken) {
      router.push('/login');
      return;
    }

    
    const loadResume = async () => {
      try {
        await fetchResumes(accessToken);
      }
      catch (err) {
        console.log("error to load resumes", err)
      }
    }
    loadResume();

  }, [accessToken, fetchResumes]);

  useEffect(() => {
    console.log('Resumes updated:', resumes);
  }, [resumes]);

  const handleDelete = async (id: string) => {
    if (!accessToken) return;
    if (confirm('Are you sure you want to delete this resume?')) {
      await deleteResume(id, accessToken);
    }
  };

  const handleManualBuild = () => {
    setIsModalOpen(false);
    router.push('/templates');
  };

  const handleAIGenerate = () => {
    setIsModalOpen(false);
    router.push('/ai-generate');
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Welcome back, {user?.name?.split(' ')[0]}!
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Manage your resumes and create new ones
            </p>
          </div>
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus className="w-5 h-5 mr-2" />
            Create New Resume
          </Button>
        </div>

        {/* Resume Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : !resumes || resumes.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <FileText className="w-12 h-12 text-gray-400" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
              No resumes yet
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Create your first resume to get started
            </p>
            <Button onClick={() => setIsModalOpen(true)}>
              <Plus className="w-5 h-5 mr-2" />
              Create Your First Resume
            </Button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resumes.map((resume: Resume, index: number) => (
              <motion.div
                key={resume?._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full">
                  <CardContent className="p-6">
                    <div className="aspect-[3/4] bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-lg mb-4 flex items-center justify-center">
                      <FileText className="w-16 h-16 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                      {resume?.title}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                      {resume?.templateType.charAt(0).toUpperCase() + resume?.templateType.slice(1)} Template
                    </p>
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
                      <Clock className="w-4 h-4 mr-1" />
                      {formatDate(resume?.updatedAt)}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Link href={`/editor?id=${resume?._id}`} className="flex-1">
                        <Button variant="outline" className="w-full">
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(resume?._id)}
                        className="text-red-500 hover:text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Create Resume Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Choose How You Want to Create Your Resume"
      >
        <div className="space-y-4">
          {/* Option 1: Build Manually */}
          <button
            onClick={handleManualBuild}
            className="w-full p-6 text-left border-2 border-gray-200 dark:border-gray-700 rounded-2xl hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all group"
          >
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                <PenTool className="w-6 h-6 text-primary-600 dark:text-primary-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                  Build Manually
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Create your resume from scratch with our easy-to-use editor. Choose from professional templates and customize every section.
                </p>
              </div>
            </div>
          </button>

          {/* Option 2: Generate with AI */}
          <button
            onClick={handleAIGenerate}
            className="w-full p-6 text-left border-2 border-gray-200 dark:border-gray-700 rounded-2xl hover:border-secondary-500 hover:bg-secondary-50 dark:hover:bg-secondary-900/20 transition-all group"
          >
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 rounded-xl bg-secondary-100 dark:bg-secondary-900/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Sparkles className="w-6 h-6 text-secondary-600 dark:text-secondary-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                  Generate with AI
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Let AI create a professional resume based on your experience. Just provide your details and get an ATS-optimized resume instantly.
                </p>
              </div>
            </div>
          </button>
        </div>
      </Modal>
    </div>
  );
}
