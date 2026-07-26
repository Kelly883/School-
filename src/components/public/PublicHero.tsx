import React from 'react';
import {
  Sparkles,
  Users,
  GraduationCap,
  ShieldCheck,
  ChevronRight,
  UserCheck,
  Building,
  PhoneCall,
  Award,
  BookOpen
} from 'lucide-react';

interface PublicHeroProps {
  onOpenAuthModal: (role?: string) => void;
  onOpenAdmissionModal: (tab?: 'apply' | 'track') => void;
  onNavigateToContact: () => void;
}

export const PublicHero: React.FC<PublicHeroProps> = ({
  onOpenAuthModal,
  onOpenAdmissionModal,
  onNavigateToContact,
}) => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#DFF6F0] via-white to-[#F4FAF8] py-12 md:py-20 border-b border-[#BEE8E0]">
      {/* Background Decorative Mint Shapes */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-[#6DD5C4]/20 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-[#DFF6F0] blur-2xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Hero Content */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Motto Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#162825] text-[#6DD5C4] text-xs font-semibold shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-[#6DD5C4]" />
              <span>School Motto: Excellence, Integrity & Innovation</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold text-[#162825] tracking-tight leading-[1.15]">
              Nurturing Tomorrow's Leaders with{' '}
              <span className="relative inline-block text-[#0D5C52] underline decoration-[#6DD5C4] decoration-wavy decoration-2">
                Academic Rigor
              </span>{' '}
              & Moral Excellence
            </h1>

            {/* Welcome Message */}
            <p className="text-stone-600 text-sm sm:text-base max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Welcome to Apex College, Lagos. For over 28 years, we have provided an inspiring learning environment combining Cambridge & Nigerian Curricula, state-of-the-art STEM laboratories, and holistic character education.
            </p>

            {/* Redesigned CTA Buttons Grid using Image Guide Pill & Icon Node Styles */}
            <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-3">
              {/* 1. Apply for Admission (Pill with circular arrow node) */}
              <button
                onClick={() => onOpenAdmissionModal('apply')}
                className="pl-5 pr-2 py-2 bg-[#162825] text-white hover:bg-[#0D5C52] font-bold text-sm rounded-full shadow-md transition-all cursor-pointer flex items-center gap-3 group"
              >
                <span>Apply for Admission</span>
                <div className="w-8 h-8 rounded-full bg-[#6DD5C4] text-[#162825] flex items-center justify-center group-hover:scale-105 transition-transform">
                  <ChevronRight className="w-4 h-4 text-[#162825] group-hover:translate-x-0.5 transition-transform" />
                </div>
              </button>

              {/* 2. Parent Portal (Pill Button) */}
              <button
                onClick={() => onOpenAuthModal('parent')}
                className="px-5 py-3 bg-[#6DD5C4] text-[#162825] hover:bg-[#86e2d3] font-bold text-sm rounded-full shadow-xs transition-all cursor-pointer flex items-center gap-2"
              >
                <UserCheck className="w-4 h-4 text-[#162825]" />
                <span>Parent Portal</span>
              </button>

              {/* 3. Student Portal (Border Pill) */}
              <button
                onClick={() => onOpenAuthModal('student')}
                className="px-5 py-3 bg-white text-[#162825] border border-[#6DD5C4] hover:bg-[#DFF6F0] font-bold text-sm rounded-full shadow-xs transition-all cursor-pointer flex items-center gap-2"
              >
                <GraduationCap className="w-4 h-4 text-[#0D5C52]" />
                <span>Student Portal</span>
              </button>

              {/* 4. Staff Login */}
              <button
                onClick={() => onOpenAuthModal('teacher')}
                className="px-4 py-2.5 bg-stone-100 text-stone-700 hover:bg-stone-200 font-semibold text-xs rounded-full transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Building className="w-3.5 h-3.5 text-stone-500" />
                <span>Staff Login</span>
              </button>

              {/* 5. Contact Us */}
              <button
                onClick={onNavigateToContact}
                className="px-4 py-2.5 text-[#162825] hover:text-[#0D5C52] font-semibold text-xs transition-all cursor-pointer flex items-center gap-1 hover:underline"
              >
                <PhoneCall className="w-3.5 h-3.5 text-[#0D5C52]" />
                <span>Contact Us</span>
              </button>
            </div>

            {/* Quick Accreditation Badges */}
            <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs text-stone-500 font-medium">
              <span className="flex items-center gap-1 text-[#162825]">
                <ShieldCheck className="w-4 h-4 text-[#0D5C52]" /> WAEC & NECO Accredited
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 text-[#162825]">
                <Award className="w-4 h-4 text-[#0D5C52]" /> Cambridge IGCSE Center
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 text-[#162825]">
                <BookOpen className="w-4 h-4 text-[#0D5C52]" /> 100% University Transition
              </span>
            </div>
          </div>

          {/* Right Hero Image Card Stack */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Decorative Mint Frame */}
              <div className="absolute -inset-2 bg-gradient-to-r from-[#6DD5C4] to-[#DFF6F0] rounded-3xl transform rotate-2 blur-xs opacity-70" />

              {/* Main Photo Card */}
              <div className="relative bg-white p-3 rounded-3xl border border-[#BEE8E0] shadow-xl overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=1000&q=80"
                  alt="Apex College Students in Library"
                  className="w-full h-80 object-cover rounded-2xl"
                />

                {/* Overlay Floating Card */}
                <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-[#BEE8E0] shadow-lg flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#162825] text-[#6DD5C4] flex items-center justify-center font-bold text-sm">
                      2026
                    </div>
                    <div>
                      <h4 className="font-serif font-bold text-xs text-[#162825]">
                        Admissions Now Open
                      </h4>
                      <p className="text-[11px] text-stone-500">
                        Entrance Exams Scheduled for August 2026
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => onOpenAdmissionModal('apply')}
                    className="px-3 py-1.5 bg-[#6DD5C4] text-[#162825] font-bold text-[11px] rounded-lg hover:bg-[#86e2d3] transition-colors cursor-pointer shrink-0"
                  >
                    Apply
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Ticker */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-white rounded-2xl border border-[#BEE8E0] shadow-sm">
          <div className="text-center p-2 border-r border-[#DFF6F0] last:border-none">
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#162825]">1,250+</h3>
            <p className="text-xs text-stone-500 font-medium">Active Students</p>
          </div>
          <div className="text-center p-2 border-r border-[#DFF6F0] last:border-none">
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#0D5C52]">98.6%</h3>
            <p className="text-xs text-stone-500 font-medium">WAEC/NECO Distinction Rate</p>
          </div>
          <div className="text-center p-2 border-r border-[#DFF6F0] last:border-none">
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#162825]">85+</h3>
            <p className="text-xs text-stone-500 font-medium">Certified Educators</p>
          </div>
          <div className="text-center p-2">
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#0D5C52]">28 Yrs</h3>
            <p className="text-xs text-stone-500 font-medium">Educational Excellence</p>
          </div>
        </div>
      </div>
    </section>
  );
};
