import React from 'react';
import {
  Compass,
  Target,
  Award,
  CheckCircle2,
  Quote,
  GraduationCap,
  Sparkles
} from 'lucide-react';

export const PublicAbout: React.FC = () => {
  const coreValues = [
    { title: 'Integrity', desc: 'Upholding honesty, moral uprightness, and truthfulness in all endeavors.' },
    { title: 'Excellence', desc: 'Striving for the highest quality in academic performance and character.' },
    { title: 'Innovation', desc: 'Embracing modern technology, STEM labs, and creative problem solving.' },
    { title: 'Resilience', desc: 'Fostering grit, perseverance, and emotional intelligence in every student.' },
    { title: 'Community', desc: 'Cultivating teamwork, social responsibility, and mutual respect.' },
  ];

  const accreditations = [
    'Federal & Lagos State Ministry of Education Approved',
    'West African Examinations Council (WAEC) Certified Center',
    'National Examinations Council (NECO) Certified Center',
    'Cambridge Assessment International Education (IGCSE & A-Levels)',
    'Member, Association of International Schools in Nigeria (AISEN)',
  ];

  return (
    <section id="about" className="py-16 md:py-24 bg-white border-b border-[#BEE8E0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-16">
        {/* Header Title */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="inline-block px-3 py-1 rounded-full bg-[#DFF6F0] text-[#0D5C52] text-xs font-bold uppercase tracking-wider">
            About Apex College
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#162825]">
            A Legacy of Excellence, Leadership & Moral Soundness
          </h2>
          <p className="text-stone-600 text-sm sm:text-base">
            Since our inception in 1998, Apex College has stood as a beacon of academic rigor and character building in Victoria Island, Lagos.
          </p>
        </div>

        {/* History, Vision, Mission Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* History */}
          <div className="bg-[#F4FAF8] p-8 rounded-3xl border border-[#BEE8E0] space-y-4 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-[#162825] text-[#6DD5C4] flex items-center justify-center font-bold">
              1998
            </div>
            <h3 className="font-serif text-xl font-bold text-[#162825]">Brief History</h3>
            <p className="text-stone-600 text-sm leading-relaxed">
              Founded by visionary educators to bridge global academic standards with local cultural grounding, Apex College grew from 45 pioneer students to over 1,200 learners across Nursery, Primary, Junior, and Senior Secondary levels.
            </p>
          </div>

          {/* Vision */}
          <div className="bg-[#DFF6F0]/60 p-8 rounded-3xl border border-[#6DD5C4] space-y-4 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-[#0D5C52] text-white flex items-center justify-center">
              <Compass className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl font-bold text-[#162825]">Our Vision</h3>
            <p className="text-stone-600 text-sm leading-relaxed">
              To be a world-class center of educational innovation, raising self-reliant global leaders equipped with exemplary character, technological fluency, and intellectual curiosity.
            </p>
          </div>

          {/* Mission */}
          <div className="bg-[#F4FAF8] p-8 rounded-3xl border border-[#BEE8E0] space-y-4 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-[#162825] text-[#6DD5C4] flex items-center justify-center">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl font-bold text-[#162825]">Our Mission</h3>
            <p className="text-stone-600 text-sm leading-relaxed">
              To deliver holistic, student-centered education through modern infrastructure, certified faculty, rigorous STEM & Arts programs, and robust parent-school collaboration.
            </p>
          </div>
        </div>

        {/* Core Values Section */}
        <div className="space-y-6">
          <h3 className="font-serif text-2xl font-bold text-center text-[#162825]">
            Our Core Values
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {coreValues.map((val) => (
              <div
                key={val.title}
                className="bg-white p-5 rounded-2xl border border-[#BEE8E0] shadow-xs space-y-2 hover:border-[#6DD5C4] transition-colors"
              >
                <div className="flex items-center gap-2 text-[#0D5C52]">
                  <Sparkles className="w-4 h-4 text-[#6DD5C4]" />
                  <h4 className="font-serif font-bold text-base text-[#162825]">{val.title}</h4>
                </div>
                <p className="text-stone-600 text-xs leading-normal">{val.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Principal Welcome Message & Accreditation Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-6">
          {/* Principal Card */}
          <div className="lg:col-span-7 bg-[#162825] text-stone-200 p-8 sm:p-10 rounded-3xl shadow-xl relative overflow-hidden space-y-6">
            <Quote className="absolute top-4 right-4 w-20 h-20 text-[#203a36] pointer-events-none" />
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#203a36] text-[#6DD5C4] text-xs font-semibold">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Principal's Welcome Address</span>
            </div>

            <p className="font-serif italic text-sm sm:text-base text-stone-300 leading-relaxed">
              "At Apex College, we do not merely teach subjects; we inspire young minds to explore their highest capabilities. Our blend of traditional discipline and modern digital tools ensures every child discovers their unique purpose."
            </p>

            <div className="flex items-center gap-4 pt-2">
              <div className="w-12 h-12 rounded-full bg-[#6DD5C4] text-[#162825] font-bold font-serif flex items-center justify-center text-lg shadow-sm">
                CO
              </div>
              <div>
                <h4 className="font-serif font-bold text-white text-base">Dr. (Mrs.) Chidimma Okeke</h4>
                <p className="text-xs text-[#6DD5C4]">Principal & Executive Director</p>
              </div>
            </div>
          </div>

          {/* Accreditation List */}
          <div className="lg:col-span-5 bg-[#DFF6F0]/40 p-8 rounded-3xl border border-[#BEE8E0] space-y-4">
            <div className="flex items-center gap-2 text-[#0D5C52] font-serif font-bold text-lg">
              <Award className="w-5 h-5 text-[#6DD5C4]" />
              <h3>Accreditation & Approvals</h3>
            </div>
            <ul className="space-y-3">
              {accreditations.map((acc, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs text-stone-700 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-[#0D5C52] shrink-0 mt-0.5" />
                  <span>{acc}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};
