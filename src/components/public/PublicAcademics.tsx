import React, { useState } from 'react';
import {
  Baby,
  BookOpen,
  GraduationCap,
  Sparkles,
  CheckCircle,
  X,
  Users,
  Monitor,
  FlaskConical,
  Library,
  Trophy,
  Music,
  Bus,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

interface CurriculumDetailModalProps {
  level: {
    title: string;
    subTitle: string;
    description: string;
    keySubjects: string[];
    activities: string[];
    ageGroup: string;
  } | null;
  onClose: () => void;
}

const CurriculumModal: React.FC<CurriculumDetailModalProps> = ({ level, onClose }) => {
  if (!level) return null;

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 border border-[#BEE8E0] shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-full transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-2">
          <span className="px-3 py-1 bg-[#DFF6F0] text-[#0D5C52] text-xs font-bold rounded-full">
            {level.ageGroup}
          </span>
          <h3 className="font-serif text-2xl font-bold text-[#162825]">{level.title}</h3>
          <p className="text-xs text-stone-500 font-medium">{level.subTitle}</p>
        </div>

        <p className="text-stone-600 text-sm leading-relaxed">{level.description}</p>

        <div className="space-y-3">
          <h4 className="font-serif font-bold text-sm text-[#162825]">Core Curriculum Focus</h4>
          <div className="grid grid-cols-2 gap-2">
            {level.keySubjects.map((subj, idx) => (
              <div key={idx} className="flex items-center gap-2 p-2 bg-[#F4FAF8] rounded-xl text-xs font-semibold text-stone-800">
                <CheckCircle className="w-3.5 h-3.5 text-[#0D5C52]" />
                <span>{subj}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3 pt-2">
          <h4 className="font-serif font-bold text-sm text-[#162825]">Extracurriculars & Clubs</h4>
          <div className="flex flex-wrap gap-2">
            {level.activities.map((act, idx) => (
              <span key={idx} className="px-3 py-1 bg-[#DFF6F0] text-[#162825] font-medium text-xs rounded-lg">
                {act}
              </span>
            ))}
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 bg-[#162825] text-white font-bold text-xs rounded-xl hover:bg-[#0D5C52] transition-colors cursor-pointer"
        >
          Close Curriculum Overview
        </button>
      </div>
    </div>
  );
};

export const PublicAcademics: React.FC = () => {
  const [selectedLevel, setSelectedLevel] = useState<any | null>(null);

  const academicLevels = [
    {
      id: 'nursery',
      title: 'Nursery School',
      subTitle: 'Creche, Nursery 1 & Nursery 2',
      ageGroup: 'Ages 1 - 5 Years',
      icon: Baby,
      description: 'Foundational play-based learning emphasizing sensory development, phonics, early numeracy, social interaction, and emotional well-being in a loving, safe nursery environment.',
      keySubjects: ['Early Phonics', 'Sensory Math', 'Creative Arts', 'Rhymes & Music', 'Social Habits', 'Basic French'],
      activities: ['Coloring & Crafts', 'Storytelling', 'Outdoor Playground', 'Sing-along Sessions'],
    },
    {
      id: 'primary',
      title: 'Primary School',
      subTitle: 'Primary 1 through Primary 6',
      ageGroup: 'Ages 6 - 11 Years',
      icon: BookOpen,
      description: 'Comprehensive primary education building strong literacy, mathematical reasoning, STEM curiosity, civic awareness, and computer literacy under guided teacher care.',
      keySubjects: ['Mathematics', 'English Language', 'Basic Science & Tech', 'Social Studies', 'ICT Literacy', 'Agricultural Science'],
      activities: ['Junior Coding Club', 'Chess Club', 'Spelling Bee', 'Taekwondo', 'Junior Choir'],
    },
    {
      id: 'junior_secondary',
      title: 'Junior Secondary',
      subTitle: 'JSS 1 through JSS 3',
      ageGroup: 'Ages 12 - 14 Years',
      icon: GraduationCap,
      description: 'A robust transition phase preparing students for the BECE & Junior NECO exams with pre-vocational training, analytical reasoning, and introductory science practicals.',
      keySubjects: ['General Mathematics', 'English Literature', 'Basic Technology', 'Integrated Science', 'Business Studies', 'Computer Science'],
      activities: ['Robotics Club', 'Press & Literary Club', 'Scouts & Girl Guides', 'Inter-house Athletics'],
    },
    {
      id: 'senior_secondary',
      title: 'Senior Secondary',
      subTitle: 'SSS 1 through SSS 3 (Science, Arts, Commercial)',
      ageGroup: 'Ages 15 - 18 Years',
      icon: Sparkles,
      description: 'Specialized secondary education structured into Science, Commercial, and Arts tracks preparing students for WAEC, NECO, UTME/JAMB, and Cambridge IGCSE examinations.',
      keySubjects: ['Physics & Chemistry', 'Biology & Further Math', 'Accounting & Commerce', 'Government & Literature', 'Data Processing', 'Economics'],
      activities: ['Young Entrepreneurs', 'Model UN', 'Science Fair Exhibition', 'Debating Society'],
    },
  ];

  const whyChooseUs = [
    {
      icon: Users,
      title: 'Qualified Teachers',
      desc: '100% TRCN-certified educators with advanced degrees and continuous professional development training.',
    },
    {
      icon: Monitor,
      title: 'Modern Classrooms',
      desc: 'Air-conditioned, interactive smart-board equipped classrooms fostering active digital engagement.',
    },
    {
      icon: Monitor,
      title: 'ICT Laboratory',
      desc: 'State-of-the-art computer lab with high-speed fiber internet, coding tools, and modern desktop PCs.',
    },
    {
      icon: FlaskConical,
      title: 'Science Laboratories',
      desc: 'Fully equipped Physics, Chemistry, and Biology practical labs adhering to international safety standards.',
    },
    {
      icon: Library,
      title: 'Digital & Physical Library',
      desc: 'Over 15,000 physical titles alongside 24/7 access to online research journals and e-books.',
    },
    {
      icon: Trophy,
      title: 'Sports Facilities',
      desc: 'Standard football pitch, basketball court, lawn tennis court, table tennis, and athletics track.',
    },
    {
      icon: Music,
      title: 'Music & Arts Studio',
      desc: 'Dedicated studio equipped with pianos, brass instruments, traditional drums, and painting easels.',
    },
    {
      icon: Bus,
      title: 'School Bus Services',
      desc: 'Air-conditioned school buses covering major routes across Victoria Island, Ikoyi, Lekki, and Surulere.',
    },
    {
      icon: ShieldCheck,
      title: 'Safe Learning Environment',
      desc: '24/7 CCTV surveillance, uniformed security team, electronic access control gates, and resident nurse.',
    },
  ];

  return (
    <section id="academics" className="py-16 md:py-24 bg-[#F4FAF8] border-b border-[#BEE8E0]">
      <CurriculumModal level={selectedLevel} onClose={() => setSelectedLevel(null)} />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-20">
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="inline-block px-3 py-1 rounded-full bg-[#DFF6F0] text-[#0D5C52] text-xs font-bold uppercase tracking-wider">
            Academic Excellence
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#162825]">
            Structured Educational Pathways for Every Stage
          </h2>
          <p className="text-stone-600 text-sm sm:text-base">
            From early childhood discovery to senior secondary college preparation, our curriculum inspires mastery and critical thinking.
          </p>
        </div>

        {/* Academic Levels Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {academicLevels.map((lvl) => {
            const Icon = lvl.icon;
            return (
              <div
                key={lvl.id}
                className="bg-white p-6 rounded-3xl border border-[#BEE8E0] shadow-xs flex flex-col justify-between hover:shadow-lg transition-all group"
              >
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#DFF6F0] text-[#0D5C52] flex items-center justify-center group-hover:bg-[#162825] group-hover:text-[#6DD5C4] transition-colors">
                    <Icon className="w-6 h-6" />
                  </div>

                  <div>
                    <span className="text-[11px] font-bold text-[#0D5C52] tracking-wide uppercase">
                      {lvl.ageGroup}
                    </span>
                    <h3 className="font-serif text-xl font-bold text-[#162825] mt-1">
                      {lvl.title}
                    </h3>
                    <p className="text-xs text-stone-500 font-medium">{lvl.subTitle}</p>
                  </div>

                  <p className="text-stone-600 text-xs leading-relaxed line-clamp-4">
                    {lvl.description}
                  </p>
                </div>

                <div className="pt-6 border-t border-stone-100 mt-6">
                  <button
                    onClick={() => setSelectedLevel(lvl)}
                    className="w-full py-2.5 bg-[#DFF6F0] text-[#162825] hover:bg-[#6DD5C4] font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span>Explore Curriculum</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Why Choose Our School Section */}
        <div className="space-y-12 pt-8">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="inline-block px-3 py-1 rounded-full bg-[#162825] text-[#6DD5C4] text-xs font-bold uppercase tracking-wider">
              The Apex Advantage
            </span>
            <h2 className="font-serif text-3xl font-bold text-[#162825]">
              Why Parents Choose Apex College
            </h2>
            <p className="text-stone-600 text-sm">
              World-class learning facilities designed to empower holistic intellectual, athletic, and creative development.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {whyChooseUs.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="bg-white p-6 rounded-2xl border border-[#BEE8E0] shadow-xs flex items-start gap-4 hover:border-[#6DD5C4] transition-colors"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#DFF6F0] text-[#0D5C52] flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-serif font-bold text-base text-[#162825]">
                      {item.title}
                    </h4>
                    <p className="text-stone-600 text-xs leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
