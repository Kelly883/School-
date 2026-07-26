import React, { useState } from 'react';
import { PublicHeader } from './PublicHeader';
import { PublicHero } from './PublicHero';
import { PublicAbout } from './PublicAbout';
import { PublicAcademics } from './PublicAcademics';
import { PublicNewsEvents } from './PublicNewsEvents';
import { PublicGallery } from './PublicGallery';
import { PublicTestimonials } from './PublicTestimonials';
import { PublicCTA } from './PublicCTA';
import { PublicContact } from './PublicContact';
import { PublicFooter } from './PublicFooter';
import { PublicAuthModal } from './PublicAuthModal';
import { AdmissionTrackModal } from './AdmissionTrackModal';
import { User } from '../../types';

interface PublicWebsiteProps {
  onLoginSuccess: (user: User) => void;
}

export const PublicWebsite: React.FC<PublicWebsiteProps> = ({ onLoginSuccess }) => {
  const [activeSection, setActiveSection] = useState<string>('home');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Modals
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authRole, setAuthRole] = useState<string>('super_admin');

  const [isAdmissionModalOpen, setIsAdmissionModalOpen] = useState(false);
  const [admissionTab, setAdmissionTab] = useState<'apply' | 'track'>('apply');

  const handleOpenAuthModal = (role: string = 'super_admin') => {
    setAuthRole(role);
    setIsAuthModalOpen(true);
  };

  const handleOpenAdmissionModal = (tab: 'apply' | 'track' = 'apply') => {
    setAdmissionTab(tab);
    setIsAdmissionModalOpen(true);
  };

  const handleNavigateToContact = () => {
    setActiveSection('contact');
    const element = document.getElementById('contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#DFF6F0]/20 font-sans text-stone-900 antialiased flex flex-col selection:bg-[#162825] selection:text-[#6DD5C4]">
      {/* Auth Gateway Modal */}
      <PublicAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={onLoginSuccess}
        initialRole={authRole}
      />

      {/* Admissions & Track Status Modal */}
      <AdmissionTrackModal
        isOpen={isAdmissionModalOpen}
        onClose={() => setIsAdmissionModalOpen(false)}
        initialTab={admissionTab}
      />

      {/* Sticky Public Header */}
      <PublicHeader
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        onOpenAuthModal={handleOpenAuthModal}
        onOpenAdmissionModal={handleOpenAdmissionModal}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      {/* Main Page Content */}
      <main className="flex-1">
        {/* Section 1: Hero */}
        <PublicHero
          onOpenAuthModal={handleOpenAuthModal}
          onOpenAdmissionModal={handleOpenAdmissionModal}
          onNavigateToContact={handleNavigateToContact}
        />

        {/* Section 2: About the School */}
        <PublicAbout />

        {/* Section 3: Academic Levels & Why Choose Us */}
        <PublicAcademics />

        {/* Section 4: Latest News & Upcoming Events */}
        <PublicNewsEvents />

        {/* Section 5: Gallery */}
        <PublicGallery />

        {/* Section 6: Testimonials */}
        <PublicTestimonials />

        {/* Section 7: Redesigned Call-To-Action (Guide Image Banner Styles) */}
        <PublicCTA
          onOpenAuthModal={handleOpenAuthModal}
          onOpenAdmissionModal={handleOpenAdmissionModal}
          onNavigateToContact={handleNavigateToContact}
        />

        {/* Section 8: Contact Section */}
        <PublicContact />
      </main>

      {/* Footer */}
      <PublicFooter
        setActiveSection={setActiveSection}
        onOpenAuthModal={handleOpenAuthModal}
        onOpenAdmissionModal={handleOpenAdmissionModal}
      />
    </div>
  );
};
