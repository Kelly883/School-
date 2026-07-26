import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Megaphone,
  ArrowRight,
  X,
  Sparkles,
  Trophy,
  Users,
  GraduationCap,
  FileCheck2,
  HeartHandshake
} from 'lucide-react';

interface NewsItem {
  id: string;
  title: string;
  category: 'Academic' | 'Achievement' | 'Sports' | 'Notice';
  date: string;
  summary: string;
  fullContent: string;
  image: string;
}

interface EventItem {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  category: string;
  description: string;
  icon: any;
}

export const PublicNewsEvents: React.FC = () => {
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);

  const newsList: NewsItem[] = [
    {
      id: 'news-1',
      title: 'Apex College Students Record 98.6% Distinction in 2026 WAEC Examinations',
      category: 'Achievement',
      date: 'July 20, 2026',
      summary: 'Our SSS3 graduating class achieved outstanding results in Mathematics, English, Physics, and Economics across national boards.',
      fullContent: 'Apex College is thrilled to announce the exceptional performance of our 2026 graduating class in the West African Senior School Certificate Examination (WASSCE). Out of 142 candidates presented, 140 recorded distinction grades in core subjects, with 12 candidates scoring straight A1s in eight subjects. The Executive Director expressed immense gratitude to the faculty and supportive parents.',
      image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'news-2',
      title: 'Robotics Team Wins 1st Place at National STEM Innovation Fair',
      category: 'Academic',
      date: 'July 12, 2026',
      summary: 'The Apex Junior Robotics Club created an automated solar-powered water filtration prototype for rural communities.',
      fullContent: 'Our student robotics team represented Lagos State at the National Young Innovators Challenge held in Abuja and clinched the coveted top prize. Their project, titled "EcoAqua Solar Filtration", was commended for its practical engineering and potential to improve clean water access across coastal communities.',
      image: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'news-3',
      title: 'Commencement of 2026/2027 Academic Session Entrance Examination Registration',
      category: 'Notice',
      date: 'July 05, 2026',
      summary: 'Applications are now open for prospective students into Creche, Primary, JSS1, and SSS1 classes.',
      fullContent: 'Registration for entrance examinations into Apex College for the 2026/2027 academic session is officially underway. Parents can submit applications online via our Guest Portal or visit the Admissions Office in person. Entrance screening exams are scheduled for August 15 and August 29, 2026.',
      image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80',
    },
  ];

  const upcomingEvents: EventItem[] = [
    {
      id: 'evt-1',
      title: '25th Annual Inter-House Sports Competition',
      date: 'August 10, 2026',
      time: '9:00 AM - 4:00 PM',
      location: 'Apex College Sports Complex Field',
      category: 'Sports & Athletics',
      description: 'Red House, Blue House, Green House, and Yellow House compete in track & field, relays, march past, and novelty matches.',
      icon: Trophy,
    },
    {
      id: 'evt-2',
      title: 'Third Term PTA General Assembly Meeting',
      date: 'August 18, 2026',
      time: '11:00 AM - 1:30 PM',
      location: 'Main School Auditorium',
      category: 'Parent Governance',
      description: 'Deliberation on third-term academic reports, security enhancements, school bus expansion routes, and upcoming graduation fees.',
      icon: Users,
    },
    {
      id: 'evt-3',
      title: 'Class of 2026 Graduation & Prize-Giving Ceremony',
      date: 'August 25, 2026',
      time: '10:00 AM - 2:00 PM',
      location: 'Apex College Grand Banquet Hall',
      category: 'Academic Celebration',
      description: 'Honoring our SSS3 graduating seniors, valedictorians, subject award winners, and long-serving faculty members.',
      icon: GraduationCap,
    },
    {
      id: 'evt-4',
      title: 'National Entrance & Scholarship Examination (Batch B)',
      date: 'August 29, 2026',
      time: '8:30 AM - 12:30 PM',
      location: 'CBT Exam Center & Classrooms',
      category: 'Admissions',
      description: 'Standardized entrance examination and merit-based scholarship assessment for prospective JSS1 & SSS1 candidates.',
      icon: FileCheck2,
    },
    {
      id: 'evt-5',
      title: 'Mid-Term Visiting Day & Exhibition Open House',
      date: 'September 12, 2026',
      time: '12:00 PM - 5:00 PM',
      location: 'Classroom Blocks & Art Gallery',
      category: 'Community',
      description: 'Parents visit boarders and day students, inspect science lab projects, review mid-term continuous assessment scores, and interact with teachers.',
      icon: HeartHandshake,
    },
  ];

  return (
    <section id="news" className="py-16 md:py-24 bg-white border-b border-[#BEE8E0]">
      {/* News Content Modal */}
      {selectedNews && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-4 border border-[#BEE8E0] shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedNews(null)}
              className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-full transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <img
              src={selectedNews.image}
              alt={selectedNews.title}
              className="w-full h-56 object-cover rounded-2xl"
            />

            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-[#DFF6F0] text-[#0D5C52] text-xs font-bold rounded-full">
                {selectedNews.category}
              </span>
              <span className="text-xs text-stone-400">• {selectedNews.date}</span>
            </div>

            <h3 className="font-serif text-2xl font-bold text-[#162825]">{selectedNews.title}</h3>

            <p className="text-stone-600 text-sm leading-relaxed">{selectedNews.fullContent}</p>

            <button
              onClick={() => setSelectedNews(null)}
              className="w-full py-3 bg-[#162825] text-white font-bold text-xs rounded-xl hover:bg-[#0D5C52] transition-colors cursor-pointer"
            >
              Close Article
            </button>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-16">
        {/* News Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <span className="inline-block px-3 py-1 rounded-full bg-[#DFF6F0] text-[#0D5C52] text-xs font-bold uppercase tracking-wider">
              News & Updates
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#162825]">
              Latest Campus News & Achievements
            </h2>
          </div>
        </div>

        {/* News Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {newsList.map((item) => (
            <div
              key={item.id}
              className="bg-[#F4FAF8] rounded-3xl border border-[#BEE8E0] overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-3 left-3 px-3 py-1 bg-[#162825] text-[#6DD5C4] font-bold text-[11px] rounded-lg shadow-sm">
                  {item.category}
                </span>
              </div>

              <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <span className="text-[11px] text-stone-400 font-medium flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-[#0D5C52]" />
                    {item.date}
                  </span>
                  <h3 className="font-serif font-bold text-base text-[#162825] leading-snug group-hover:text-[#0D5C52] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-stone-600 text-xs leading-relaxed line-clamp-3">
                    {item.summary}
                  </p>
                </div>

                <button
                  onClick={() => setSelectedNews(item)}
                  className="pt-2 text-xs font-bold text-[#0D5C52] hover:text-[#162825] flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <span>Read Full Article</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Upcoming Events Section */}
        <div className="pt-12 space-y-8 border-t border-[#DFF6F0]">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="inline-block px-3 py-1 rounded-full bg-[#162825] text-[#6DD5C4] text-xs font-bold uppercase tracking-wider">
              Calendar
            </span>
            <h2 className="font-serif text-3xl font-bold text-[#162825]">
              Upcoming School Events
            </h2>
            <p className="text-stone-600 text-sm">
              Mark your calendar for upcoming inter-house sports, PTA general assemblies, graduation ceremonies, and visiting days.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {upcomingEvents.map((evt) => {
              const Icon = evt.icon;
              return (
                <div
                  key={evt.id}
                  className="bg-white p-5 rounded-2xl border border-[#BEE8E0] shadow-xs flex items-start gap-4 hover:border-[#6DD5C4] transition-colors"
                >
                  <div className="w-12 h-12 rounded-2xl bg-[#DFF6F0] text-[#0D5C52] flex items-center justify-center shrink-0">
                    <Icon className="w-6 h-6" />
                  </div>

                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-2.5 py-0.5 bg-[#F4FAF8] text-[#0D5C52] text-[11px] font-bold rounded-md">
                        {evt.category}
                      </span>
                      <span className="text-xs text-stone-500 font-bold">{evt.date}</span>
                    </div>

                    <h4 className="font-serif font-bold text-base text-[#162825]">{evt.title}</h4>
                    <p className="text-stone-600 text-xs leading-relaxed">{evt.description}</p>

                    <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] text-stone-500 font-medium">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-[#0D5C52]" /> {evt.time}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-[#0D5C52]" /> {evt.location}
                      </span>
                    </div>
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
