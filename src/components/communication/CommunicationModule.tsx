import React, { useState } from 'react';
import {
  MessageSquare,
  Send,
  Bell,
  User,
  PlusCircle,
  Search,
  CheckCircle2
} from 'lucide-react';
import { Message, Announcement, User as UserType } from '../../types';

interface CommunicationModuleProps {
  currentUser: UserType;
  messages: Message[];
  announcements: Announcement[];
  onSendMessage: (msg: Message) => void;
}

export const CommunicationModule: React.FC<CommunicationModuleProps> = ({
  currentUser,
  messages,
  announcements,
  onSendMessage,
}) => {
  const [activeTab, setActiveTab] = useState<'messages' | 'announcements'>('messages');
  const [bodyText, setBodyText] = useState('');
  const [subjectText, setSubjectText] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bodyText.trim()) return;

    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderRole: currentUser.role,
      receiverId: 'u-4',
      receiverName: 'Chief Emeka Nwachukwu',
      subject: subjectText || 'Academic Update',
      body: bodyText,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      isRead: false,
    };

    onSendMessage(newMsg);
    setBodyText('');
    setSubjectText('');
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-900 border border-blue-200 px-2.5 py-0.5 rounded-full">
            Messaging & School Notices
          </span>
          <h2 className="font-serif text-2xl font-bold text-stone-900 mt-1">
            Communication Portal
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Internal messaging between parents, teachers, bursar and school management.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-stone-100 p-1.5 rounded-2xl border border-stone-200 text-xs font-bold">
          <button
            onClick={() => setActiveTab('messages')}
            className={`px-4 py-2 rounded-xl cursor-pointer transition-all ${
              activeTab === 'messages' ? 'bg-[#162825] text-white shadow-sm' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Direct Messages ({messages.length})
          </button>
          <button
            onClick={() => setActiveTab('announcements')}
            className={`px-4 py-2 rounded-xl cursor-pointer transition-all ${
              activeTab === 'announcements' ? 'bg-[#162825] text-white shadow-sm' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            School Circulars ({announcements.length})
          </button>
        </div>
      </div>

      {activeTab === 'messages' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Message History */}
          <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-4">
            <h4 className="font-serif text-lg font-bold text-stone-900">Conversation Thread</h4>
            <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
              {messages.map((m) => (
                <div key={m.id} className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-1 text-xs">
                  <div className="flex items-center justify-between text-stone-500 text-[10px]">
                    <span className="font-bold text-stone-800">{m.senderName} ({m.senderRole})</span>
                    <span>{m.timestamp}</span>
                  </div>
                  <p className="font-bold text-stone-900">{m.subject}</p>
                  <p className="text-stone-600 leading-relaxed">{m.body}</p>
                </div>
              ))}
            </div>
          </div>

          {/* New Message Box */}
          <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-4">
            <h4 className="font-serif text-lg font-bold text-stone-900">Send New Message</h4>
            <form onSubmit={handleSend} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-stone-800 mb-1">Subject</label>
                <input
                  type="text"
                  required
                  value={subjectText}
                  onChange={(e) => setSubjectText(e.target.value)}
                  placeholder="e.g. Academic Inquiry regarding Tobi"
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-800 mb-1">Message Body</label>
                <textarea
                  rows={4}
                  required
                  value={bodyText}
                  onChange={(e) => setBodyText(e.target.value)}
                  placeholder="Type your message..."
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#162825] text-[#f5ded7] font-bold rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <Send className="w-4 h-4 text-[#f5ded7]" /> Send Message
              </button>
            </form>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {announcements.map((ann) => (
            <div key={ann.id} className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-2">
              <div className="flex items-center justify-between text-xs text-stone-400">
                <span className="font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  {ann.category}
                </span>
                <span>{ann.date}</span>
              </div>
              <h3 className="font-serif text-xl font-bold text-stone-900">{ann.title}</h3>
              <p className="text-xs text-stone-600 leading-relaxed">{ann.content}</p>
              <div className="text-[10px] text-stone-400 font-semibold pt-2 border-t border-stone-100">
                Author: {ann.author} • Target Audience: {ann.targetAudience}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
