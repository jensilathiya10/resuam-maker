import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/layouts/Header';
import { Footer } from '@/components/layouts/Footer';
import { ThemeProvider } from '@/components/ThemeProvider';

export const metadata: Metadata = {
  title: 'ResumeAI - AI-Powered Resume Builder',
  description: 'Create professional, ATS-optimized resumes in minutes with the power of AI.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4024017940073132" crossOrigin="anonymous"></script>
        <meta name="google-adsense-account" content="ca-pub-4024017940073132"></meta>
      </head>
      <body className="min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors">
        <ThemeProvider>
          <Header />
          <main className="pt-16">
            {children}
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
