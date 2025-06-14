"use client";
import Bounties from '@components/dvulndb/Bounties';
import Dashboard from '@components/dvulndb/Dashboard';
import Footer from '@components/dvulndb/Footer';
import Header from '@components/dvulndb/Header';
import Landing from '@components/dvulndb/Landing';
import SubmitForm from '@components/dvulndb/SubmitForm';
import Toasts from '@components/dvulndb/Toasts';
import Tools from '@components/dvulndb/Tools';
import Vulnerabilities from '@components/dvulndb/Vulnerabilities';
import { ToastProvider } from '@context/ToastContext';
import ProtectedRoute from '@components/auth/ProtectedRoute';
import { useState, Suspense } from 'react';

const SECTIONS = [
  'landing',
  'dashboard',
  'vulnerabilities',
  'submit',
  'bounties',
  'tools',
];

function DVulnDBPage() {
  const [section, setSection] = useState('landing');

  const handleNavigate = (target: string) => {
    if (!SECTIONS.includes(target)) return;
    setSection(target);
  };

  return (
    <ToastProvider>
      <Toasts />
      <div className="text-lime-500 font-bold bg-gray-900 p-2">Current section: {section}</div>
      <Header currentSection={section} onNavigate={handleNavigate} />
      <main>
        <Landing isActive={section === 'landing'} onNavigate={handleNavigate} />
        <Dashboard onNavigate={handleNavigate} isActive={section === 'dashboard'} />
        <Vulnerabilities isActive={section === 'vulnerabilities'} />
        <SubmitForm isActive={section === 'submit'} />
        <Bounties isActive={section === 'bounties'} />
        <Tools isActive={section === 'tools'} />
      </main>
      <Footer />
    </ToastProvider>
  );
}

// Wrap the entire page with ProtectedRoute to ensure wallet connection before access
export default function ProtectedDVulnDBPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-green-400 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-300">Loading...</p>
        </div>
      </div>
    }>
      <ProtectedRoute>
        <DVulnDBPage />
      </ProtectedRoute>
    </Suspense>
  );
}