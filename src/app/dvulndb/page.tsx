import React, { useState } from 'react';
import Header from '../../components/dvulndb/Header';
import Dashboard from '../../components/dvulndb/Dashboard';
import Vulnerabilities from '../../components/dvulndb/Vulnerabilities';
import SubmitForm from '../../components/dvulndb/SubmitForm';
import Bounties from '../../components/dvulndb/Bounties';
import Tools from '../../components/dvulndb/Tools';
import Footer from '../../components/dvulndb/Footer';

const SECTIONS = [
  'dashboard',
  'vulnerabilities',
  'submit',
  'bounties',
  'tools',
];

export default function DVulnDBPage() {
  const [section, setSection] = useState('dashboard');

  const handleNavigate = (target: string) => {
    if (SECTIONS.includes(target)) setSection(target);
  };

  return (
    <>
      <Header currentSection={section} onNavigate={handleNavigate} />
      <main>
        {section === 'dashboard' && <Dashboard onNavigate={handleNavigate} />}
        {section === 'vulnerabilities' && <Vulnerabilities />}
        {section === 'submit' && <SubmitForm />}
        {section === 'bounties' && <Bounties />}
        {section === 'tools' && <Tools />}
      </main>
      <Footer />
    </>
  );
} 