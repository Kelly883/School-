import React from 'react';
import apexCollegeLogo from '../../assets/images/apex_college_logo_1784887396822.jpg';
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

interface PublicFooterProps {
  setActiveSection: (section: string) => void;
  onOpenAuthModal: (role?: string) => void;
  onOpenAdmissionModal: (tab?: 'apply' | 'track') => void;
}

export const PublicFooter: React.FC<PublicFooterProps> = ({
  setActiveSection,
  onOpenAuthModal,
  onOpenAdmissionModal,
}) => {
  return (
    <footer className="bg-[#162825] text-stone-300 pt-16 pb-8 border-t border-[#203a36]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#DFF6F0] p-1 border border-[#6DD5C4] flex items-center justify-center overflow-hidden">
                <img
                  src={apexCollegeLogo}
                  alt="Apex College Logo"
                  className="w-full h-full object-cover rounded-xl"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div>
                <h3 className="font-serif text-2xl font-bold text-white tracking-wide">
                  Apex College
                </h3>
                <p className="text-xs text-[#6DD5C4] font-medium">Victoria Island, Lagos</p>
              </div>
            </div>

            <p className="text-stone-400 text-xs leading-relaxed max-w-sm">
              Delivering world-class education for over 28 years. Integrating Nigerian & Cambridge curricula to foster academic excellence, character development, and technological mastery.
            </p>

            <div className="flex items-center gap-3 text-stone-300 pt-2">
              <a href="#" className="p-2 bg-[#203a36] hover:bg-[#2d4e48] rounded-xl text-[#6DD5C4] transition-colors cursor-pointer" title="Facebook">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 bg-[#203a36] hover:bg-[#2d4e48] rounded-xl text-[#6DD5C4] transition-colors cursor-pointer" title="Twitter/X">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 bg-[#203a36] hover:bg-[#2d4e48] rounded-xl text-[#6DD5C4] transition-colors cursor-pointer" title="Instagram">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 bg-[#203a36] hover:bg-[#2d4e48] rounded-xl text-[#6DD5C4] transition-colors cursor-pointer" title="LinkedIn">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 bg-[#203a36] hover:bg-[#2d4e48] rounded-xl text-[#6DD5C4] transition-colors cursor-pointer" title="YouTube">
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-white text-sm tracking-wide">Quick Links</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => setActiveSection('home')}
                  className="hover:text-[#6DD5C4] transition-colors cursor-pointer flex items-center gap-1"
                >
                  <ChevronRight className="w-3 h-3 text-[#6DD5C4]" /> Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveSection('about')}
                  className="hover:text-[#6DD5C4] transition-colors cursor-pointer flex items-center gap-1"
                >
                  <ChevronRight className="w-3 h-3 text-[#6DD5C4]" /> About Us
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveSection('academics')}
                  className="hover:text-[#6DD5C4] transition-colors cursor-pointer flex items-center gap-1"
                >
                  <ChevronRight className="w-3 h-3 text-[#6DD5C4]" /> Academic Levels
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveSection('news')}
                  className="hover:text-[#6DD5C4] transition-colors cursor-pointer flex items-center gap-1"
                >
                  <ChevronRight className="w-3 h-3 text-[#6DD5C4]" /> News & Events
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveSection('gallery')}
                  className="hover:text-[#6DD5C4] transition-colors cursor-pointer flex items-center gap-1"
                >
                  <ChevronRight className="w-3 h-3 text-[#6DD5C4]" /> Photo Gallery
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveSection('contact')}
                  className="hover:text-[#6DD5C4] transition-colors cursor-pointer flex items-center gap-1"
                >
                  <ChevronRight className="w-3 h-3 text-[#6DD5C4]" /> Contact Us
                </button>
              </li>
            </ul>
          </div>

          {/* Admissions & Portals */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-white text-sm tracking-wide">Admissions & Portals</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onOpenAdmissionModal('apply')}
                  className="hover:text-[#6DD5C4] transition-colors cursor-pointer flex items-center gap-1"
                >
                  <ChevronRight className="w-3 h-3 text-[#6DD5C4]" /> Apply for Admission
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenAdmissionModal('track')}
                  className="hover:text-[#6DD5C4] transition-colors cursor-pointer flex items-center gap-1"
                >
                  <ChevronRight className="w-3 h-3 text-[#6DD5C4]" /> Track Application
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenAuthModal('parent')}
                  className="hover:text-[#6DD5C4] transition-colors cursor-pointer flex items-center gap-1"
                >
                  <ChevronRight className="w-3 h-3 text-[#6DD5C4]" /> Parent Portal
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenAuthModal('student')}
                  className="hover:text-[#6DD5C4] transition-colors cursor-pointer flex items-center gap-1"
                >
                  <ChevronRight className="w-3 h-3 text-[#6DD5C4]" /> Student Portal
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenAuthModal('teacher')}
                  className="hover:text-[#6DD5C4] transition-colors cursor-pointer flex items-center gap-1"
                >
                  <ChevronRight className="w-3 h-3 text-[#6DD5C4]" /> Staff & Teacher Login
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenAuthModal('super_admin')}
                  className="hover:text-[#6DD5C4] transition-colors cursor-pointer flex items-center gap-1"
                >
                  <ChevronRight className="w-3 h-3 text-[#6DD5C4]" /> Super Admin Gateway
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-white text-sm tracking-wide">School Office</h4>
            <div className="space-y-2 text-xs text-stone-400">
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#6DD5C4] shrink-0 mt-0.5" />
                <span>12 Apex College Ave, Victoria Island, Lagos</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#6DD5C4] shrink-0" />
                <span>+234 803 123 4567</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#6DD5C4] shrink-0" />
                <span>info@apexcollege.edu.ng</span>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar & Legal */}
        <div className="pt-8 border-t border-[#203a36] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-400">
          <p>© 2026 Apex College Lagos. All Rights Reserved.</p>
          <div className="flex items-center gap-4 text-stone-400">
            <a href="#" className="hover:text-[#6DD5C4] transition-colors">Privacy Policy</a>
            <span>•</span>
            <a href="#" className="hover:text-[#6DD5C4] transition-colors">Terms of Service</a>
            <span>•</span>
            <a href="#" className="hover:text-[#6DD5C4] transition-colors">Student Safeguarding</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
