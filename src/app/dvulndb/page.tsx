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
import { useWallet } from '@solana/wallet-adapter-react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

const SECTIONS = [
  'landing',
  'dashboard',
  'vulnerabilities',
  'submit',
  'bounties',
  'tools',
];

// Protected sections that require wallet connection
const PROTECTED_SECTIONS = ['dashboard', 'submit', 'bounties', 'tools'];

export default function DVulnDBPage() {
  const [section, setSection] = useState('landing');
  const { connected, connecting } = useWallet();
  const router = useRouter();

  const handleNavigate = (target: string) => {
    if (!SECTIONS.includes(target)) return;
    
    // Check if trying to access protected section without wallet
    if (PROTECTED_SECTIONS.includes(target) && !connected) {
      console.log(' Access denied: Protected section requires wallet connection');
      // Redirect to home page for better UX
      router.push('/');
      return;
    }
    
    setSection(target);
  };

  // Auto-redirect to landing if accessing protected section without wallet
  useEffect(() => {
    if (PROTECTED_SECTIONS.includes(section) && !connecting && !connected) {
      console.log(' Auto-redirect: Protected section accessed without wallet');
      setSection('landing');
    }
  }, [connected, connecting, section]);

  console.log('Current section:', section);

  return (
    <ToastProvider>
      <Toasts />
      <div className="text-lime-500 font-bold bg-gray-900 p-2">DVulnDB PAGE IS RENDERING - Current section: {section}</div>
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