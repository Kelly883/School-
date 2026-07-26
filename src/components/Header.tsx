import React, { useState } from 'react';
import {
  Search,
  Bell,
  LogOut,
  Calendar,
  CheckCircle2,
  X,
  Menu,
  Globe
} from 'lucide-react';
import { User, SchoolSettings, Announcement } from '../types';

interface HeaderProps {
  currentUser: User;
  schoolSettings: SchoolSettings;
  announcements: Announcement[];
  onLogout: () => void;
  onNavigateToPublic?: () => void;
  searchTerm: string;
  setSearchTerm: (s: string) => void;
  onToggleMobileMenu?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  schoolSettings,
  announcements,
  onLogout,
  onNavigateToPublic,
  searchTerm,
  setSearchTerm,
  onToggleMobileMenu,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="bg-[#fbf8f5] border-b border-stone-200 px-4 md:px-6 py-3 md:py-4 flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-4 sticky top-0 z-20 backdrop-blur-md bg-opacity-90">
      {/* Welcome Greeting & Active Term */}
      <div className="flex items-center justify-between md:justify-start gap-3 w-full md:w-auto">
        <div className="flex items-center gap-2.5">
          {onToggleMobileMenu && (
            <button
              onClick={onToggleMobileMenu}
              className="md:hidden p-2 rounded-xl bg-white border border-stone-200 text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer shadow-xs shrink-0"
              title="Toggle Menu Sidebar"
              aria-label="Toggle Menu Sidebar"
            >
              <Menu className="w-5 h-5 text-[#162825]" />
            </button>
          )}
          <div>
            <h2 className="font-serif text-base md:text-xl font-bold text-stone-800 flex items-center gap-1.5 md:gap-2">
              Welcome back, {currentUser.name}! <span className="text-sm md:text-xl">👋</span>
            </h2>
            <p className="text-[11px] md:text-xs text-stone-500 font-medium flex items-center gap-1.5 md:gap-2 mt-0.5">
              <span>{schoolSettings.schoolName}</span>
              <span className="inline-block w-1 h-1 rounded-full bg-stone-300" />
              <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
                {schoolSettings.currentSession} {schoolSettings.currentTerm}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Center Search Bar */}
      <div className="flex items-center gap-3 w-full md:w-auto md:flex-1 max-w-md">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search students, admission no, payments, classes..."
            className="w-full pl-9 pr-4 py-2 bg-white border border-stone-200 rounded-full text-xs text-stone-700 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#162825]/20 focus:border-[#162825] transition-all shadow-xs"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-3 w-full md:w-auto pt-1 md:pt-0 border-t md:border-0 border-stone-100">
        <div className="flex items-center gap-2">
          {/* Public Website Gateway Button */}
          {onNavigateToPublic && (
            <button
              onClick={onNavigateToPublic}
              className="flex items-center gap-1.5 bg-[#DFF6F0] text-[#162825] hover:bg-[#6DD5C4] px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer border border-[#6DD5C4] shadow-xs"
              title="Return to Public Website (Guest Portal)"
            >
              <Globe className="w-3.5 h-3.5 text-[#0D5C52]" />
              <span>Public Site</span>
            </button>
          )}

          {/* Logout Button */}
          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 hover:text-rose-800 px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer border border-rose-200 shadow-2xs"
            title="Logout of your session"
          >
            <LogOut className="w-3.5 h-3.5 text-rose-600" />
            <span>Logout</span>
          </button>
        </div>

        {/* Notifications Dropdown */}
        <div className="relative shrink-0">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="w-9 h-9 rounded-full bg-white border border-stone-200 flex items-center justify-center text-stone-600 hover:text-stone-900 hover:border-stone-300 transition-all cursor-pointer relative shadow-xs"
            title="School Circulars & Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
          </button>

          {showNotifications && (
            <>
              {/* Mobile Backdrop Overlay */}
              <div
                className="fixed inset-0 bg-black/20 z-40 sm:hidden"
                onClick={() => setShowNotifications(false)}
              />

              <div className="fixed inset-x-4 top-28 sm:absolute sm:top-full sm:right-0 sm:left-auto sm:inset-x-auto sm:mt-2 w-auto sm:w-80 max-w-sm mx-auto sm:mx-0 bg-white border border-stone-200 rounded-2xl shadow-2xl sm:shadow-xl py-3 px-4 z-50">
                <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                  <h4 className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                    <Bell className="w-3.5 h-3.5 text-stone-500" />
                    School Circulars ({announcements.length})
                  </h4>
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="text-stone-400 hover:text-stone-600 p-1 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="mt-2 space-y-2.5 max-h-64 overflow-y-auto custom-scrollbar">
                  {announcements.map((ann) => (
                    <div key={ann.id} className="p-2.5 rounded-xl bg-stone-50 border border-stone-100 text-left">
                      <div className="flex items-center justify-between text-[10px] text-stone-400 mb-1">
                        <span className="font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                          {ann.category}
                        </span>
                        <span>{ann.date}</span>
                      </div>
                      <p className="text-xs font-semibold text-stone-800 leading-snug">{ann.title}</p>
                      <p className="text-[11px] text-stone-500 mt-1 line-clamp-2">{ann.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Current Date Badge */}
        <div className="hidden lg:flex items-center gap-1.5 text-xs text-stone-500 bg-white px-3 py-1.5 rounded-full border border-stone-200 shadow-xs">
          <Calendar className="w-3.5 h-3.5 text-stone-400" />
          <span>July 2026</span>
        </div>
      </div>
    </header>
  );
};
