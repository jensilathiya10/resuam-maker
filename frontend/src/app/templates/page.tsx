'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FileText, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { useAuthStore } from '@/stores/authStore';

const templates = [
  {
    id: 'modern',
    name: 'Modern Pro',
    description: 'Clean and professional corporate template with a modern touch. Perfect for traditional industries.',
    features: ['Traditional layout', 'Left sidebar for contact', 'Professional typography'],
  },
  {
    id: 'minimal',
    name: 'Minimal Elegant',
    description: 'Minimalist design with plenty of white space. Stands out through simplicity and clarity.',
    features: ['Modern layout', 'Plenty of white space', 'Sans-serif typography'],
  },
  {
    id: 'creative',
    name: 'Creative Designer',
    description: 'Bold and creative template for design roles. Show off your creativity while staying professional.',
    features: ['Bold accent colors', 'Modern layout', 'Portfolio-focused'],
  },
];

export default function TemplatesPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  const handleUseTemplate = (templateId?: string) => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    router.push(`/editor?template=${templateId || ''}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Choose Your Template
            </h1>
          </div>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          {templates.map((template, index) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card hover className="h-full">
                <CardContent className="p-6">
                  {/* Preview */}
                  <div className="aspect-[3/4] bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-lg mb-4 flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-grid-pattern opacity-30" />
                    <FileText className="w-16 h-16 text-gray-400 z-10" />
                  </div>

                  {/* Info */}
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {template.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {template.description}
                  </p>

                  {/* Features */}
                  <ul className="space-y-2 mb-6">
                    {template.features.map((feature) => (
                      <li key={feature} className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                        <span className="w-1.5 h-1.5 bg-primary-500 rounded-full mr-2" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    onClick={() => handleUseTemplate(template.id)}
                  >
                    Use Template
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {!isAuthenticated && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ delay: 0.2 }}
            className="text-center mt-12 p-6 bg-primary-50 dark:bg-primary-900/20 rounded-2xl border border-primary-200 dark:border-primary-800"
          >
            <h3 className="text-lg font-semibold text-primary-600 dark:text-primary-400 mb-2">
              Start Building Your Resume
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Sign up to save your resumes and access AI features
            </p>
            <Link href="/register">
              <Button variant="primary">Get Started Free</Button>
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
}
