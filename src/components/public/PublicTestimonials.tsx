import React from 'react';
import { Quote, Star, User, GraduationCap, Heart } from 'lucide-react';

interface Testimonial {
  id: string;
  name: string;
  role: 'Parent' | 'Alumni' | 'Student';
  details: string;
  avatar: string;
  quote: string;
  rating: number;
}

export const PublicTestimonials: React.FC = () => {
  const testimonials: Testimonial[] = [
    {
      id: 't-1',
      name: 'Chief Babatunde Adeleke',
      role: 'Parent',
      details: 'Parent of 2 Apex College Students (SSS2 & Primary 5)',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
      quote: 'Enrolling my children in Apex College was the best decision we made. The school portal allows me to monitor results and fee payments in real time, and the academic progress has been phenomenal.',
      rating: 5,
    },
    {
      id: 't-2',
      name: 'Dr. Amina Yussuf',
      role: 'Alumni',
      details: 'Class of 2018 • Senior Resident Doctor, LUTH',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
      quote: 'The rigorous STEM foundation and disciplined work ethic I cultivated at Apex College paved the way for my medical career. Apex taught us integrity and leadership from day one.',
      rating: 5,
    },
    {
      id: 't-3',
      name: 'Kelechi Emmanuel',
      role: 'Student',
      details: 'Head Boy, Senior Secondary 3 (Science Track)',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80',
      quote: 'Between the CBT online exam practice portal, modern chemistry labs, and our robotics club, learning at Apex College is both challenging and thrilling!',
      rating: 5,
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-white border-b border-[#BEE8E0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-16">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="inline-block px-3 py-1 rounded-full bg-[#DFF6F0] text-[#0D5C52] text-xs font-bold uppercase tracking-wider">
            Testimonials
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#162825]">
            Voices from Our Apex Community
          </h2>
          <p className="text-stone-600 text-sm">
            Read what parents, alumni, and current students say about their experience at Apex College.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="bg-[#F4FAF8] p-8 rounded-3xl border border-[#BEE8E0] shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow relative space-y-6"
            >
              <Quote className="absolute top-6 right-6 w-10 h-10 text-[#6DD5C4]/30 pointer-events-none" />

              <div className="space-y-4">
                {/* Rating stars */}
                <div className="flex items-center gap-1 text-amber-400">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>

                <p className="text-stone-700 text-xs sm:text-sm italic leading-relaxed">
                  "{t.quote}"
                </p>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-[#DFF6F0]">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-[#6DD5C4]"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-serif font-bold text-sm text-[#162825]">{t.name}</h4>
                    <span className="px-2 py-0.5 bg-[#162825] text-[#6DD5C4] text-[10px] font-bold rounded-md">
                      {t.role}
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-500 font-medium">{t.details}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
