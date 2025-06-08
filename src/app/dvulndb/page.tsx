"use client";
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

  console.log('Current section:', section);

  return (
    <>
      <div style={{ color: 'lime', fontWeight: 'bold', background: '#111', padding: 8 }}>DVulnDB PAGE IS RENDERING - Current section: {section}</div>
      <Header currentSection={section} onNavigate={handleNavigate} />
      <main>
        <Dashboard onNavigate={handleNavigate} isActive={section === 'dashboard'} />
        <Vulnerabilities isActive={section === 'vulnerabilities'} />
        <SubmitForm isActive={section === 'submit'} />
        <Bounties isActive={section === 'bounties'} />
        <Tools isActive={section === 'tools'} />
      </main>
      <Footer />
    </>
  );
} 