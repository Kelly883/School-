import React, { useState } from 'react';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  CheckCircle2,
  Building2,
  HelpCircle
} from 'lucide-react';

export const PublicContact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    inquiryType: 'General Admission',
    message: '',
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        inquiryType: 'General Admission',
        message: '',
      });
    }, 4000);
  };

  return (
    <section id="contact" className="py-16 md:py-24 bg-[#F4FAF8] border-b border-[#BEE8E0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-16">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="inline-block px-3 py-1 rounded-full bg-[#DFF6F0] text-[#0D5C52] text-xs font-bold uppercase tracking-wider">
            Contact Apex College
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#162825]">
            We'd Love to Hear From You
          </h2>
          <p className="text-stone-600 text-sm">
            Have questions about admissions, school fees, transfer placements, or campus tours? Get in touch with our team today.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Contact Cards & Info */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-[#BEE8E0] shadow-xs space-y-6">
              <h3 className="font-serif font-bold text-xl text-[#162825] flex items-center gap-2">
                <Building2 className="w-5 h-5 text-[#0D5C52]" />
                <span>Campus Location & Details</span>
              </h3>

              <div className="space-y-4 text-xs text-stone-700">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#DFF6F0] text-[#0D5C52] flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="font-bold text-[#162825] text-xs">Main Campus Address</h5>
                    <p className="text-stone-600">Plot 12 Apex College Avenue, Off Ahmadu Bello Way, Victoria Island, Lagos, Nigeria.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#DFF6F0] text-[#0D5C52] flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="font-bold text-[#162825] text-xs">Direct Phone Numbers</h5>
                    <p className="text-stone-600">+234 803 123 4567 • +234 802 987 6543</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#DFF6F0] text-[#0D5C52] flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="font-bold text-[#162825] text-xs">Email Addresses</h5>
                    <p className="text-stone-600">admissions@apexcollege.edu.ng • info@apexcollege.edu.ng</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#DFF6F0] text-[#0D5C52] flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="font-bold text-[#162825] text-xs">Administrative Working Hours</h5>
                    <p className="text-stone-600">Monday - Friday: 7:30 AM - 4:30 PM (WAT)</p>
                    <p className="text-stone-400 text-[11px]">Saturday & Sunday: Closed for Admin Tours</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Google Map Mock Card */}
            <div className="bg-white p-3 rounded-3xl border border-[#BEE8E0] shadow-xs space-y-2">
              <div className="h-44 bg-[#DFF6F0] rounded-2xl relative overflow-hidden flex items-center justify-center border border-[#6DD5C4]">
                <iframe
                  title="Apex College Victoria Island Location Map"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3964.7282862892913!2d3.4215!3d6.4281!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103bf53280e32b0d%3A0x8e8749f7cf7c7f3b!2sVictoria%20Island%2C%20Lagos!5e0!3m2!1sen!2sng!4v1650000000000!5m2!1sen!2sng"
                  className="w-full h-full border-0 rounded-xl"
                  loading="lazy"
                />
              </div>
            </div>
          </div>

          {/* Right Contact Form */}
          <div className="lg:col-span-7 bg-white p-8 sm:p-10 rounded-3xl border border-[#BEE8E0] shadow-sm space-y-6">
            <div className="space-y-1">
              <h3 className="font-serif text-2xl font-bold text-[#162825]">
                Send Us a Direct Message
              </h3>
              <p className="text-stone-500 text-xs">
                Fill out the form below and an admissions officer will reply within 24 hours.
              </p>
            </div>

            {isSubmitted ? (
              <div className="p-6 bg-[#DFF6F0] rounded-2xl border border-[#6DD5C4] text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-[#0D5C52] mx-auto" />
                <h4 className="font-serif font-bold text-lg text-[#162825]">Message Sent Successfully!</h4>
                <p className="text-xs text-stone-700">
                  Thank you for reaching out to Apex College. Our admissions team has received your message and will get back to you shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Mr. Chidi Okafor"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2.5 bg-[#F4FAF8] border border-[#BEE8E0] focus:border-[#6DD5C4] rounded-xl text-xs outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. parent@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2.5 bg-[#F4FAF8] border border-[#BEE8E0] focus:border-[#6DD5C4] rounded-xl text-xs outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      placeholder="e.g. +234 803 000 0000"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-2.5 bg-[#F4FAF8] border border-[#BEE8E0] focus:border-[#6DD5C4] rounded-xl text-xs outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Inquiry Category
                    </label>
                    <select
                      value={formData.inquiryType}
                      onChange={(e) => setFormData({ ...formData, inquiryType: e.target.value })}
                      className="w-full px-4 py-2.5 bg-[#F4FAF8] border border-[#BEE8E0] focus:border-[#6DD5C4] rounded-xl text-xs outline-none transition-colors"
                    >
                      <option value="General Admission">General Admission</option>
                      <option value="Tuition & Fee Structure">Tuition & Fee Structure</option>
                      <option value="Transfer Student Placement">Transfer Student Placement</option>
                      <option value="Campus Tour Booking">Campus Tour Booking</option>
                      <option value="General Complaint / Feedback">General Feedback</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Your Message / Question *
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Write your inquiry or question here..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-2.5 bg-[#F4FAF8] border border-[#BEE8E0] focus:border-[#6DD5C4] rounded-xl text-xs outline-none transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#162825] text-white hover:bg-[#0D5C52] font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4 text-[#6DD5C4]" />
                  <span>Send Message</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
