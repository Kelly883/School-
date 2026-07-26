import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  Send,
  Rocket,
  MessageSquare,
  ChevronRight,
  GraduationCap,
  Star,
  CheckCircle2,
  Calendar,
  Layers
} from 'lucide-react';

interface PublicCTAProps {
  onOpenAuthModal: (role?: string) => void;
  onOpenAdmissionModal: (tab?: 'apply' | 'track') => void;
  onNavigateToContact: () => void;
}

export const PublicCTA: React.FC<PublicCTAProps> = ({
  onOpenAuthModal,
  onOpenAdmissionModal,
  onNavigateToContact,
}) => {
  const [activeStyle, setActiveStyle] = useState<'all' | 'style1' | 'style2' | 'style3' | 'style4'>('all');

  return (
    <section id="cta" className="py-16 md:py-24 bg-[#DFF6F0]/30 border-b border-[#BEE8E0] relative overflow-hidden">
      {/* Background Glow Effects preserving color palette */}
      <div className="absolute top-1/2 left-10 -translate-y-1/2 w-80 h-80 rounded-full bg-[#6DD5C4]/20 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-10 w-96 h-96 rounded-full bg-[#DFF6F0] blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-10 relative z-10">
        {/* Section Title & Style Selector */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#BEE8E0] pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#162825] text-[#6DD5C4] text-xs font-bold tracking-wide uppercase mb-2">
              <Sparkles className="w-3.5 h-3.5 text-[#6DD5C4]" />
              <span>Redesigned Call-To-Action Banners</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#162825]">
              Ready to Take the Next Step?
            </h2>
            <p className="text-stone-600 text-xs sm:text-sm max-w-xl mt-1">
              Explore our redesigned Call-To-Action banners inspired by modern design layouts, perfectly matched to our signature school color palette.
            </p>
          </div>

          {/* Banner Selector Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 bg-white p-1.5 rounded-2xl border border-[#BEE8E0] shadow-xs shrink-0">
            <button
              onClick={() => setActiveStyle('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeStyle === 'all'
                  ? 'bg-[#162825] text-white shadow-xs'
                  : 'text-stone-600 hover:bg-[#F4FAF8]'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-[#6DD5C4]" />
              <span>Show All Banners</span>
            </button>
            <button
              onClick={() => setActiveStyle('style1')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeStyle === 'style1'
                  ? 'bg-[#162825] text-white shadow-xs'
                  : 'text-stone-600 hover:bg-[#F4FAF8]'
              }`}
            >
              Style 1 (Orbit Arc)
            </button>
            <button
              onClick={() => setActiveStyle('style2')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeStyle === 'style2'
                  ? 'bg-[#162825] text-white shadow-xs'
                  : 'text-stone-600 hover:bg-[#F4FAF8]'
              }`}
            >
              Style 2 (Angled Split)
            </button>
            <button
              onClick={() => setActiveStyle('style3')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeStyle === 'style3'
                  ? 'bg-[#162825] text-white shadow-xs'
                  : 'text-stone-600 hover:bg-[#F4FAF8]'
              }`}
            >
              Style 3 (Squircle Star)
            </button>
            <button
              onClick={() => setActiveStyle('style4')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeStyle === 'style4'
                  ? 'bg-[#162825] text-white shadow-xs'
                  : 'text-stone-600 hover:bg-[#F4FAF8]'
              }`}
            >
              Style 4 (Curved Wave)
            </button>
          </div>
        </div>

        {/* CTA Banner Variations */}
        <div className="space-y-10">
          {/* ==========================================
              CTA STYLE 1: Orbit Arc Layout
              ========================================== */}
          {(activeStyle === 'all' || activeStyle === 'style1') && (
            <div className="bg-[#F4FAF8] border border-[#BEE8E0] rounded-3xl p-6 sm:p-10 shadow-sm relative overflow-hidden group">
              {/* Background Arc Elements */}
              <div className="absolute right-1/3 top-1/2 -translate-y-1/2 w-72 h-72 rounded-full border border-[#6DD5C4]/40 bg-[#DFF6F0]/30 pointer-events-none hidden lg:block" />

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
                {/* Left Text */}
                <div className="lg:col-span-5 space-y-3 text-center lg:text-left">
                  <h3 className="font-serif text-2xl sm:text-4xl font-bold text-[#162825] leading-tight">
                    Ready to bring <br className="hidden sm:inline" />
                    <span className="italic font-normal text-[#0D5C52]">your child's potential to life?</span>
                  </h3>
                  <p className="text-stone-600 text-xs sm:text-sm max-w-md mx-auto lg:mx-0">
                    Let's collaborate and create an extraordinary educational foundation together at Apex College.
                  </p>
                </div>

                {/* Middle Orbit Center Icon Button */}
                <div className="lg:col-span-2 flex items-center justify-center py-2 lg:py-0">
                  <div className="relative flex items-center justify-center">
                    {/* Concentric rings */}
                    <div className="absolute w-28 h-28 rounded-full border border-[#6DD5C4]/50 animate-pulse pointer-events-none" />
                    <button
                      onClick={() => onOpenAdmissionModal('apply')}
                      className="w-16 h-16 rounded-full bg-[#162825] text-[#6DD5C4] hover:bg-[#0D5C52] hover:scale-110 shadow-lg flex items-center justify-center transition-all cursor-pointer group/btn"
                      title="Apply Now"
                    >
                      <ArrowRight className="w-6 h-6 text-[#6DD5C4] group-hover/btn:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                </div>

                {/* Right Action Block */}
                <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-[#BEE8E0] shadow-xs space-y-3 text-center lg:text-left">
                  <h4 className="font-serif font-bold text-base text-[#162825]">
                    Let's Start an Application
                  </h4>
                  <p className="text-stone-500 text-xs leading-relaxed">
                    We're excited to hear about your child's academic aspirations and help you make their transition seamless.
                  </p>
                  <div className="pt-1 flex flex-wrap items-center justify-center lg:justify-start gap-3">
                    <button
                      onClick={() => onOpenAdmissionModal('apply')}
                      className="px-6 py-2.5 bg-[#162825] text-white hover:bg-[#0D5C52] font-bold text-xs rounded-full shadow-sm transition-all cursor-pointer flex items-center gap-2"
                    >
                      <span>Get in Touch</span>
                      <ChevronRight className="w-3.5 h-3.5 text-[#6DD5C4]" />
                    </button>
                    <button
                      onClick={() => onOpenAdmissionModal('track')}
                      className="px-4 py-2.5 text-[#0D5C52] hover:bg-[#DFF6F0] font-bold text-xs rounded-full transition-all cursor-pointer border border-[#6DD5C4]/50"
                    >
                      Track Application Status
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ==========================================
              CTA STYLE 2: Dark Luxury Split with Angled Cutout
              ========================================== */}
          {(activeStyle === 'all' || activeStyle === 'style2') && (
            <div className="bg-[#162825] text-white rounded-3xl p-6 sm:p-10 shadow-xl relative overflow-hidden">
              {/* Background Glow */}
              <div className="absolute -top-10 -right-10 w-64 h-64 rounded-full bg-[#6DD5C4]/15 blur-2xl pointer-events-none" />

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                {/* Left Title & Message */}
                <div className="lg:col-span-7 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <h3 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
                      Let's Create <br />
                      <span className="italic font-normal text-[#6DD5C4]">Impact Together.</span>
                    </h3>
                    <div className="hidden sm:block w-px h-16 bg-[#6DD5C4]/30" />
                    <p className="text-stone-300 text-xs sm:text-sm max-w-sm leading-relaxed">
                      Great education starts with a conversation. Share your vision and let's build something meaningful for your family.
                    </p>
                  </div>
                </div>

                {/* Right Angled Cutout Box */}
                <div className="lg:col-span-5">
                  <div className="bg-[#DFF6F0] text-[#162825] p-6 rounded-3xl sm:rounded-l-[40px] shadow-lg flex items-center gap-4 border border-[#6DD5C4]">
                    <div className="w-12 h-12 rounded-full bg-[#162825] text-[#6DD5C4] flex items-center justify-center shrink-0 shadow-md">
                      <Send className="w-5 h-5 text-[#6DD5C4]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-serif font-bold text-base text-[#162825]">
                        Start Your Project
                      </h4>
                      <p className="text-stone-600 text-xs truncate">
                        We'll get back to you within 24 hours.
                      </p>
                      <div className="mt-2 flex items-center gap-2">
                        <button
                          onClick={() => onOpenAdmissionModal('apply')}
                          className="px-4 py-1.5 bg-[#162825] text-white hover:bg-[#0D5C52] text-xs font-bold rounded-lg transition-colors cursor-pointer"
                        >
                          Apply Now
                        </button>
                        <button
                          onClick={onNavigateToContact}
                          className="px-3 py-1.5 text-[#0D5C52] hover:bg-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
                        >
                          Contact Us
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ==========================================
              CTA STYLE 3: Squircle Badge + Star Node + Pill Button
              ========================================== */}
          {(activeStyle === 'all' || activeStyle === 'style3') && (
            <div className="bg-white border border-[#BEE8E0] rounded-3xl p-6 sm:p-10 shadow-sm relative overflow-hidden">
              {/* Decorative Dot Matrix on Right */}
              <div className="absolute right-6 top-1/2 -translate-y-1/2 grid grid-cols-5 gap-2 opacity-15 pointer-events-none hidden md:grid">
                {[...Array(25)].map((_, i) => (
                  <div key={i} className="w-2 h-2 rounded-full bg-[#0D5C52]" />
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center relative z-10">
                {/* Left Squircle Badge + Heading */}
                <div className="md:col-span-6 flex items-start sm:items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-[#DFF6F0] border border-[#6DD5C4] shadow-xs flex items-center justify-center shrink-0 text-[#0D5C52]">
                    <Rocket className="w-8 h-8 text-[#0D5C52]" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#162825]">
                      Your Vision. <br />
                      <span className="italic font-normal text-[#0D5C52]">Our Expertise.</span>
                    </h3>
                    <p className="text-stone-500 text-xs">
                      Let's turn your child's goals into educational experiences that make a difference.
                    </p>
                  </div>
                </div>

                {/* Middle Star Node Divider */}
                <div className="hidden md:flex md:col-span-1 items-center justify-center">
                  <div className="relative flex items-center justify-center h-16">
                    <div className="w-px h-full bg-[#BEE8E0]" />
                    <div className="absolute w-7 h-7 rounded-full bg-[#162825] text-[#6DD5C4] flex items-center justify-center shadow-xs border border-[#6DD5C4]">
                      <Star className="w-3.5 h-3.5 fill-[#6DD5C4] text-[#6DD5C4]" />
                    </div>
                  </div>
                </div>

                {/* Right Action & Subtitle */}
                <div className="md:col-span-5 space-y-3 text-center md:text-left">
                  <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-3">
                    <button
                      onClick={() => onOpenAdmissionModal('apply')}
                      className="px-6 py-3 bg-[#162825] text-white hover:bg-[#0D5C52] font-bold text-xs rounded-full shadow-md transition-all cursor-pointer flex items-center gap-2 group/star"
                    >
                      <span>Let's Work Together</span>
                      <Star className="w-3.5 h-3.5 fill-[#6DD5C4] text-[#6DD5C4] group-hover/star:rotate-45 transition-transform" />
                    </button>
                    <button
                      onClick={() => onOpenAuthModal('parent')}
                      className="px-4 py-3 bg-[#DFF6F0] text-[#162825] hover:bg-[#6DD5C4] font-bold text-xs rounded-full transition-all cursor-pointer"
                    >
                      Parent Login
                    </button>
                  </div>
                  <p className="text-stone-500 text-xs">
                    From enrollment to graduation, we're here to guide every step.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ==========================================
              CTA STYLE 4: Eyebrow + Asymmetric Curved Wave + White Pill Button
              ========================================== */}
          {(activeStyle === 'all' || activeStyle === 'style4') && (
            <div className="bg-[#F4FAF8] border border-[#BEE8E0] rounded-3xl overflow-hidden shadow-sm grid grid-cols-1 lg:grid-cols-12 relative">
              {/* Left Content */}
              <div className="lg:col-span-6 p-8 sm:p-12 flex flex-col justify-center space-y-4">
                <span className="text-[11px] font-bold tracking-widest text-[#0D5C52] uppercase">
                  READY TO START?
                </span>
                <h3 className="font-serif text-3xl sm:text-5xl font-bold text-[#162825] leading-tight">
                  Let's Build Something <br />
                  <span className="italic font-normal text-[#0D5C52]">Extraordinary.</span>
                </h3>
                <p className="text-stone-600 text-xs sm:text-sm max-w-md">
                  Join hundreds of families who have trusted Apex College for world-class education and character development.
                </p>

                {/* Decorative Curved Path */}
                <div className="pt-2 opacity-60">
                  <svg className="w-32 h-8 text-[#0D5C52]" viewBox="0 0 120 30" fill="none">
                    <path
                      d="M2 15 Q 30 -5, 60 15 T 110 15"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeDasharray="4 4"
                      fill="none"
                    />
                    <path
                      d="M105 10 L 115 15 L 105 20"
                      stroke="currentColor"
                      strokeWidth="2"
                      fill="none"
                    />
                  </svg>
                </div>
              </div>

              {/* Right Asymmetric Dark Curved Wave */}
              <div className="lg:col-span-6 bg-[#162825] text-white p-8 sm:p-12 lg:rounded-l-[90px] flex flex-col justify-center space-y-5 relative shadow-xl">
                {/* Floating Circular Badge */}
                <div className="w-12 h-12 rounded-full bg-white text-[#162825] flex items-center justify-center shadow-md">
                  <MessageSquare className="w-5 h-5 text-[#162825]" />
                </div>

                <div>
                  <h4 className="font-serif text-xl sm:text-2xl font-bold text-white">
                    Have a question or inquiry in mind?
                  </h4>
                  <p className="text-stone-300 text-xs sm:text-sm mt-1 max-w-md leading-relaxed">
                    We'd love to hear from you and explore how Apex College fits your family's educational needs.
                  </p>
                </div>

                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <button
                    onClick={onNavigateToContact}
                    className="px-6 py-3 bg-white text-[#162825] hover:bg-[#DFF6F0] font-bold text-xs rounded-full shadow-md transition-all cursor-pointer flex items-center gap-2 group/pill"
                  >
                    <span>Contact Us</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#162825] group-hover/pill:translate-x-1 transition-transform" />
                  </button>

                  <button
                    onClick={() => onOpenAdmissionModal('apply')}
                    className="px-5 py-3 bg-[#0D5C52] text-white hover:bg-[#6DD5C4] hover:text-[#162825] font-bold text-xs rounded-full transition-all cursor-pointer"
                  >
                    Apply for 2026
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
