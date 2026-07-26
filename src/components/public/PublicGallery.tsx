import React, { useState } from 'react';
import { Camera, Image as ImageIcon, X, Play } from 'lucide-react';

interface GalleryItem {
  id: string;
  title: string;
  category: 'Campus Life' | 'Sports' | 'Science Fair' | 'Arts & Music' | 'Excursions';
  imageUrl: string;
  type: 'image' | 'video';
  caption: string;
}

export const PublicGallery: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [previewItem, setPreviewItem] = useState<GalleryItem | null>(null);

  const galleryItems: GalleryItem[] = [
    {
      id: 'gal-1',
      title: 'State-of-the-Art Science Laboratory',
      category: 'Science Fair',
      imageUrl: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=800&q=80',
      type: 'image',
      caption: 'Students conducting chemistry titration practicals under teacher supervision.',
    },
    {
      id: 'gal-2',
      title: 'Annual Inter-House Relay Race Finals',
      category: 'Sports',
      imageUrl: 'https://images.unsplash.com/photo-1517649763962-0c6232661a0b?auto=format&fit=crop&w=800&q=80',
      type: 'image',
      caption: 'Red House sprint champion crossing the finish line during inter-house sports.',
    },
    {
      id: 'gal-3',
      title: 'Digital Resource Library & Study Pods',
      category: 'Campus Life',
      imageUrl: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80',
      type: 'image',
      caption: 'Quiet collaborative research session in our central library.',
    },
    {
      id: 'gal-4',
      title: 'Orchestra & Cultural Choir Performance',
      category: 'Arts & Music',
      imageUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80',
      type: 'image',
      caption: 'School orchestra performing classical and Nigerian folk musical arrangements.',
    },
    {
      id: 'gal-5',
      title: 'Educational Excursion to National Museum',
      category: 'Excursions',
      imageUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80',
      type: 'image',
      caption: 'Senior Secondary history students inspecting ancient Nigerian bronze artifacts.',
    },
    {
      id: 'gal-6',
      title: 'ICT Lab Coding & Robotics Workshop',
      category: 'Science Fair',
      imageUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80',
      type: 'image',
      caption: 'Students assembling autonomous line-following robotics kits.',
    },
  ];

  const categories = ['All', 'Campus Life', 'Sports', 'Science Fair', 'Arts & Music', 'Excursions'];

  const filteredItems = activeCategory === 'All'
    ? galleryItems
    : galleryItems.filter((g) => g.category === activeCategory);

  return (
    <section id="gallery" className="py-16 md:py-24 bg-[#F4FAF8] border-b border-[#BEE8E0]">
      {/* Lightbox Modal */}
      {previewItem && (
        <div className="fixed inset-0 z-50 bg-stone-900/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 space-y-4 border border-[#BEE8E0] shadow-2xl relative">
            <button
              onClick={() => setPreviewItem(null)}
              className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-800 bg-stone-100 hover:bg-stone-200 rounded-full cursor-pointer transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <img
              src={previewItem.imageUrl}
              alt={previewItem.title}
              className="w-full max-h-[60vh] object-cover rounded-2xl"
            />

            <div className="space-y-1">
              <span className="px-3 py-1 bg-[#DFF6F0] text-[#0D5C52] text-xs font-bold rounded-full">
                {previewItem.category}
              </span>
              <h3 className="font-serif text-xl font-bold text-[#162825]">{previewItem.title}</h3>
              <p className="text-stone-600 text-xs">{previewItem.caption}</p>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="inline-block px-3 py-1 rounded-full bg-[#DFF6F0] text-[#0D5C52] text-xs font-bold uppercase tracking-wider">
            Campus Life
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#162825]">
            Apex College Photo & Video Gallery
          </h2>
          <p className="text-stone-600 text-sm">
            Glimpses into our vibrant campus activities, sports meets, science exhibitions, and cultural performances.
          </p>
        </div>

        {/* Filter Categories */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeCategory === cat
                  ? 'bg-[#162825] text-[#6DD5C4] shadow-xs'
                  : 'bg-white text-stone-700 hover:bg-[#DFF6F0] border border-[#BEE8E0]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setPreviewItem(item)}
              className="bg-white rounded-2xl border border-[#BEE8E0] overflow-hidden shadow-xs hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="relative h-56 overflow-hidden">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-stone-900/20 group-hover:bg-stone-900/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="p-3 bg-white text-[#162825] rounded-full shadow-lg">
                    <Camera className="w-5 h-5" />
                  </div>
                </div>
                <span className="absolute bottom-3 left-3 px-2.5 py-1 bg-[#162825]/80 text-[#6DD5C4] font-semibold text-[10px] rounded-md backdrop-blur-xs">
                  {item.category}
                </span>
              </div>

              <div className="p-4 space-y-1">
                <h4 className="font-serif font-bold text-sm text-[#162825] group-hover:text-[#0D5C52] transition-colors">
                  {item.title}
                </h4>
                <p className="text-stone-500 text-xs line-clamp-1">{item.caption}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
