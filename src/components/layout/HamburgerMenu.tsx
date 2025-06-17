'use client';

import React, { useState } from 'react';

interface NavLink {
  label: string;
  section: string;
}

interface HamburgerMenuProps {
  navLinks: NavLink[];
  onNavigate: (section: string) => void;
  currentSection: string;
}

const HamburgerMenu = ({ navLinks, onNavigate, currentSection }: HamburgerMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleLinkClick = (section: string) => {
    onNavigate(section);
    setIsOpen(false); // Close menu after navigation
  };

  return (
    <div className="hamburger-menu">
      <button onClick={handleToggle} className={`hamburger-icon ${isOpen ? 'open' : ''}`} aria-label="Toggle menu">
        <span></span>
        <span></span>
        <span></span>
      </button>
      {isOpen && (
        <div className="menu-overlay">
          <nav className="menu-nav">
            {navLinks.map(link => (
              <a
                key={link.section}
                href="#"
                className={`menu-nav__link${currentSection === link.section ? ' active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleLinkClick(link.section);
                }}
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      )}
    </div>
  );
};

export default HamburgerMenu;
