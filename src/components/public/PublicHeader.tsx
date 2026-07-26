import React, { useState } from 'react';
import apexCollegeLogo from '../../assets/images/apex_college_logo_1784887396822.jpg';
import {
  Phone,
  Mail,
  Search,
  LogIn,
  Menu,
  X,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  GraduationCap,
  Sparkles,
  ShieldAlert
} from 'lucide-react';

interface PublicHeaderProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  onOpenAuthModal: (role?: string) => void;
  onOpenAdmissionModal: (tab?: 'apply' | 'track') => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

export const PublicHeader: React.FC<PublicHeaderProps> = ({
  activeSection,
  setActiveSection,
  onOpenAuthModal,
  onOpenAdmissionModal,
  searchTerm,
  setSearchTerm,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About Us' },
    { id: 'academics', label: 'Academics' },
    { id: 'admissions', label: 'Admissions' },
    { id: 'news', label: 'News & Events' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'contact', label: 'Contact' },
  ];

  const handleNavClick = (id: string) => {
    if (id === 'admissions') {
      onOpenAdmissionModal('apply');
    } else {
      setActiveSection(id);
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#BEE8E0] shadow-xs">
      {/* Top Bar with School Contact & Social Links */}
      <div className="bg-[#162825] text-stone-200 py-1.5 px-4 sm:px-8 text-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          {/* Left: Contacts */}
          <div className="flex items-center gap-4 text-stone-300 text-[11px] sm:text-xs">
            <a
              href="tel:+2348031234567"
              className="flex items-center gap-1.5 hover:text-[#6DD5C4] transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-[#6DD5C4]" />
              <span>+234 803 123 4567</span>
            </a>
            <span className="text-[#315750] hidden sm:inline">•</span>
            <a
              href="mailto:info@apexcollege.edu.ng"
              className="flex items-center gap-1.5 hover:text-[#6DD5C4] transition-colors hidden sm:flex"
            >
              <Mail className="w-3.5 h-3.5 text-[#6DD5C4]" />
              <span>info@apexcollege.edu.ng</span>
            </a>
            <span className="text-[#315750] hidden lg:inline">•</span>
            <span className="hidden lg:inline text-stone-400 font-serif italic">
              "Excellence, Integrity & Innovation"
            </span>
          </div>

          {/* Right: Quick Portals & Socials */}
          <div className="flex items-center gap-3 ml-auto">
            <div className="hidden sm:flex items-center gap-2 text-stone-400 border-r border-[#2d4e48] pr-3">
              <a href="#" className="hover:text-[#6DD5C4] transition-colors" title="Facebook">
                <Facebook className="w-3.5 h-3.5" />
              </a>
              <a href="#" className="hover:text-[#6DD5C4] transition-colors" title="Twitter/X">
                <Twitter className="w-3.5 h-3.5" />
              </a>
              <a href="#" className="hover:text-[#6DD5C4] transition-colors" title="Instagram">
                <Instagram className="w-3.5 h-3.5" />
              </a>
              <a href="#" className="hover:text-[#6DD5C4] transition-colors" title="LinkedIn">
                <Linkedin className="w-3.5 h-3.5" />
              </a>
              <a href="#" className="hover:text-[#6DD5C4] transition-colors" title="YouTube">
                <Youtube className="w-3.5 h-3.5" />
              </a>
            </div>

            <button
              onClick={() => onOpenAdmissionModal('track')}
              className="text-[11px] font-medium text-[#6DD5C4] hover:underline cursor-pointer"
            >
              Track Application
            </button>

            <button
              onClick={() => onOpenAuthModal()}
              className="flex items-center gap-1 px-2.5 py-1 bg-[#6DD5C4] text-[#162825] hover:bg-[#86e2d3] font-bold rounded-lg text-[11px] transition-all cursor-pointer shadow-xs"
            >
              <LogIn className="w-3 h-3" />
              <span>Portal Login</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Branding Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3 flex items-center justify-between gap-4">
        {/* Brand Logo & Name */}
        <div
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-12 h-12 rounded-2xl bg-[#DFF6F0] p-1 border border-[#6DD5C4] flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
            <img
              src={apexCollegeLogo}
              alt="Apex College Logo"
              className="w-full h-full object-cover rounded-xl"
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <h1 className="font-serif text-xl sm:text-2xl font-bold text-[#162825] tracking-tight leading-none group-hover:text-[#0D5C52] transition-colors">
              Apex College
            </h1>
            <p className="text-[11px] text-stone-500 font-medium tracking-wide">
              Nigeria
            </p>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 bg-[#DFF6F0]/60 p-1.5 rounded-2xl border border-[#BEE8E0]">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleNavClick(link.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeSection === link.id
                  ? 'bg-[#162825] text-white shadow-xs'
                  : 'text-[#162825] hover:bg-[#6DD5C4]/30'
              }`}
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Action Buttons & Mobile Menu Trigger */}
        <div className="flex items-center gap-2">
          {/* Search Trigger */}
          <div className="relative">
            {isSearchOpen ? (
              <div className="flex items-center bg-stone-100 border border-[#6DD5C4] rounded-xl px-2.5 py-1 text-xs">
                <Search className="w-3.5 h-3.5 text-stone-400 mr-1.5" />
                <input
                  type="text"
                  placeholder="Search courses, news, events..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-transparent border-none outline-none text-stone-800 w-36 sm:w-48 text-xs"
                  autoFocus
                />
                <button
                  onClick={() => setIsSearchOpen(false)}
                  className="text-stone-400 hover:text-stone-700 ml-1 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2 text-[#162825] hover:bg-[#DFF6F0] rounded-xl transition-colors cursor-pointer"
                title="Search Site"
              >
                <Search className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Admission Apply CTA */}
          <button
            onClick={() => onOpenAdmissionModal('apply')}
            className="hidden lg:flex items-center gap-1.5 px-4 py-2 bg-[#162825] text-[#DFF6F0] hover:bg-[#0D5C52] font-semibold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#6DD5C4]" />
            <span>Apply Now</span>
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-[#162825] hover:bg-[#DFF6F0] rounded-xl cursor-pointer"
            aria-label="Toggle Navigation"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-[#BEE8E0] px-4 py-4 space-y-3 shadow-lg">
          <div className="grid grid-cols-2 gap-2">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold text-left transition-all ${
                  activeSection === link.id
                    ? 'bg-[#162825] text-white'
                    : 'bg-[#DFF6F0]/60 text-[#162825] hover:bg-[#6DD5C4]/20'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="pt-2 border-t border-stone-200 flex flex-col gap-2">
            <button
              onClick={() => {
                onOpenAdmissionModal('apply');
                setIsMobileMenuOpen(false);
              }}
              className="w-full py-2.5 bg-[#162825] text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-[#6DD5C4]" />
              <span>Apply for Admission</span>
            </button>
            <button
              onClick={() => {
                onOpenAuthModal();
                setIsMobileMenuOpen(false);
              }}
              className="w-full py-2.5 bg-[#6DD5C4] text-[#162825] font-bold rounded-xl text-xs flex items-center justify-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              <span>Access Authenticated Portal</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
