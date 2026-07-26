import React, { useState } from 'react';
import apexCollegeLogo from '../assets/images/apex_college_logo_1784887396822.jpg';
import {
  LayoutDashboard,
  UserPlus,
  GraduationCap,
  FileSpreadsheet,
  Receipt,
  CalendarDays,
  Laptop,
  MessageSquare,
  BookOpen,
  ShieldCheck,
  Globe,
  Quote,
  Sparkles,
  ChevronUp,
  PanelLeftClose,
  PanelLeftOpen,
  ChevronLeft,
  ChevronRight,
  LogOut,
  X
} from 'lucide-react';
import { User, UserRole } from '../types';

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  currentUser: User;
  onLogout: () => void;
  unreadMessageCount?: number;
  isCollapsed?: boolean;
  setIsCollapsed?: (collapsed: boolean) => void;
  isMobileOpen?: boolean;
  setIsMobileOpen?: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  setCurrentTab,
  currentUser,
  onLogout,
  unreadMessageCount = 2,
  isCollapsed: externalIsCollapsed,
  setIsCollapsed: externalSetIsCollapsed,
  isMobileOpen = false,
  setIsMobileOpen,
}) => {
  const [internalIsCollapsed, setInternalIsCollapsed] = useState(false);

  const isCollapsed = externalIsCollapsed !== undefined ? externalIsCollapsed : internalIsCollapsed;
  const setIsCollapsed = externalSetIsCollapsed || setInternalIsCollapsed;

  const handleSelectTab = (tabId: string) => {
    setCurrentTab(tabId);
    if (setIsMobileOpen) {
      setIsMobileOpen(false);
    }
  };

  // Navigation item definitions based on permissions
  const navItems = [
    {
      id: 'public_website',
      label: 'Public Guest Portal',
      icon: Globe,
      roles: ['super_admin', 'admin_bursar', 'teacher', 'parent', 'student'],
    },
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      roles: ['super_admin', 'admin_bursar', 'teacher', 'parent', 'student'],
    },
    {
      id: 'students',
      label: 'Admissions & Students',
      icon: UserPlus,
      roles: ['super_admin', 'admin_bursar', 'teacher'],
    },
    {
      id: 'academics',
      label: 'Classes & Curriculum',
      icon: GraduationCap,
      roles: ['super_admin', 'admin_bursar', 'teacher', 'student'],
    },
    {
      id: 'results',
      label: 'Results & Report Cards',
      icon: FileSpreadsheet,
      roles: ['super_admin', 'admin_bursar', 'teacher', 'parent', 'student'],
    },
    {
      id: 'finance',
      label: 'School Fees & Bursary',
      icon: Receipt,
      roles: ['super_admin', 'admin_bursar', 'parent'],
    },
    {
      id: 'timetable_attendance',
      label: 'Timetable & Attendance',
      icon: CalendarDays,
      roles: ['super_admin', 'teacher', 'parent', 'student'],
    },
    {
      id: 'cbt',
      label: 'CBT Online Exams',
      icon: Laptop,
      roles: ['super_admin', 'teacher', 'student'],
    },
    {
      id: 'communication',
      label: 'Messages & Notices',
      icon: MessageSquare,
      badge: unreadMessageCount > 0 ? unreadMessageCount : undefined,
      roles: ['super_admin', 'admin_bursar', 'teacher', 'parent', 'student'],
    },
    {
      id: 'library_inventory',
      label: 'Library & Assets',
      icon: BookOpen,
      roles: ['super_admin', 'admin_bursar', 'teacher', 'student'],
    },
    {
      id: 'audit_settings',
      label: 'System & Audit Logs',
      icon: ShieldCheck,
      roles: ['super_admin'],
    },
  ];

  const filteredNav = navItems.filter((item) => item.roles.includes(currentUser.role));

  const roleLabels: Record<UserRole, string> = {
    super_admin: 'Super Admin',
    admin_bursar: 'Admin (Bursar)',
    teacher: 'Teacher / Staff',
    parent: 'Parent / Guardian',
    student: 'Student Portal',
  };

  const rolePortalTitles: Record<UserRole, string> = {
    super_admin: 'Super Admin Portal',
    admin_bursar: 'Bursar Portal',
    teacher: 'Teacher Portal',
    parent: 'Parent Portal',
    student: 'Student Portal',
  };

  return (
    <>
      {/* Mobile Backdrop Overlay - Tapping empty space closes sidebar */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs z-40 md:hidden transition-opacity"
          onClick={() => setIsMobileOpen && setIsMobileOpen(false)}
          title="Click empty space to collapse sidebar"
          aria-label="Close Mobile Navigation"
        />
      )}

      <aside
        className={`bg-[#162825] text-stone-200 flex flex-col h-screen shrink-0 border-r border-[#203a36] select-none transition-all duration-300 shadow-2xl md:shadow-none fixed md:static inset-y-0 left-0 z-50 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        } ${isCollapsed ? 'w-16 sm:w-20' : 'w-64'}`}
      >
        {/* Brand Header */}
        <div
          className={`p-4 border-b border-[#23423d] flex items-center ${
            isCollapsed ? 'justify-center flex-col gap-2 py-3.5' : 'justify-between'
          }`}
        >
          <div className={`flex items-center gap-3 ${isCollapsed ? 'justify-center' : ''}`}>
            <div
              onClick={() => isCollapsed && setIsCollapsed(false)}
              className={`w-10 h-10 rounded-xl bg-[#23423d] border border-[#315750] flex items-center justify-center overflow-hidden shadow-sm shrink-0 ${
                isCollapsed ? 'cursor-pointer hover:bg-[#2d4e48] transition-colors' : ''
              }`}
              title={isCollapsed ? 'Expand Sidebar' : `Apex College - ${rolePortalTitles[currentUser.role]}`}
            >
              <img
                src={apexCollegeLogo}
                alt="Apex College Logo"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            {!isCollapsed && (
              <div className="min-w-0">
                <h1 className="font-serif text-lg font-bold text-white tracking-wide leading-tight truncate">Apex College</h1>
                <p className="text-[11px] text-[#8ea8a2] tracking-wider uppercase font-medium truncate">{rolePortalTitles[currentUser.role]}</p>
              </div>
            )}
          </div>

          {/* Toggle Collapse / Close Buttons */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className={`p-1.5 rounded-xl text-[#8ea8a2] hover:text-white hover:bg-[#1f3834] transition-colors cursor-pointer shrink-0 ${
                isCollapsed ? 'mt-1' : ''
              }`}
              title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
              aria-label={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            >
              {isCollapsed ? (
                <PanelLeftOpen className="w-5 h-5" />
              ) : (
                <PanelLeftClose className="w-5 h-5" />
              )}
            </button>

            {/* Mobile-only Close Button */}
            {setIsMobileOpen && (
              <button
                onClick={() => setIsMobileOpen(false)}
                className="md:hidden p-1.5 rounded-xl text-[#8ea8a2] hover:text-white hover:bg-[#1f3834] transition-colors cursor-pointer shrink-0"
                title="Close Mobile Navigation"
                aria-label="Close Mobile Navigation"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Navigation List */}
        <nav className={`flex-1 py-4 space-y-1.5 overflow-y-auto custom-scrollbar ${isCollapsed ? 'px-2' : 'px-3'}`}>
          {filteredNav.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelectTab(item.id)}
                title={isCollapsed ? `${item.label}${item.badge ? ` (${item.badge})` : ''}` : undefined}
              className={`w-full flex items-center rounded-xl text-xs font-medium transition-all duration-150 cursor-pointer group relative ${
                isCollapsed
                  ? 'justify-center p-3'
                  : 'justify-between px-3.5 py-2.5'
              } ${
                isActive
                  ? 'bg-[#f5ded7] text-[#162825] font-semibold shadow-md shadow-[#101d1b]'
                  : 'text-[#9eb5b0] hover:bg-[#1f3834] hover:text-white'
              }`}
            >
              <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3 min-w-0'}`}>
                <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-[#162825]' : 'text-[#8ea8a2] group-hover:text-white'}`} />
                {!isCollapsed && <span className="truncate">{item.label}</span>}
              </div>

              {/* Badge for Expanded Mode */}
              {!isCollapsed && item.badge && (
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isActive ? 'bg-[#162825] text-white' : 'bg-[#e2848a] text-white'
                  }`}
                >
                  {item.badge}
                </span>
              )}

              {/* Badge Indicator Dot for Collapsed Mode */}
              {isCollapsed && item.badge && (
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-[#e2848a] ring-2 ring-[#162825]" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Inspirational / School Motto Card */}
      {!isCollapsed ? (
        <div className="px-3 py-2">
          <div className="bg-[#1f3834] border border-[#2d4e48] rounded-2xl p-3.5 relative overflow-hidden group">
            <Quote className="w-5 h-5 text-[#f5ded7]/30 absolute right-2 top-2" />
            <p className="text-[11px] text-stone-300 italic leading-relaxed relative z-10">
              “Knowledge, Integrity & Academic Excellence in Nigerian Education.”
            </p>
            <div className="mt-2 text-[10px] text-[#8ea8a2] font-medium">— Apex Royal Motto</div>
          </div>
        </div>
      ) : (
        <div className="p-2 flex justify-center" title="“Knowledge, Integrity & Academic Excellence”">
          <div className="w-9 h-9 rounded-xl bg-[#1f3834] border border-[#2d4e48] flex items-center justify-center text-[#f5ded7]/60">
            <Quote className="w-4 h-4" />
          </div>
        </div>
      )}

      {/* Active User & Logout Footer Card */}
      <div className={`p-3 border-t border-[#23423d] bg-[#12221f] ${isCollapsed ? 'space-y-2' : 'space-y-2.5'}`}>
        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
          <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-2.5 min-w-0'}`}>
            <div className="relative shrink-0">
              <img
                src={currentUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'}
                alt={currentUser.name}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-[#f5ded7]/30"
              />
              <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-[#12221f]" />
            </div>
            {!isCollapsed && (
              <div className="text-left min-w-0">
                <p className="text-xs font-semibold text-white truncate">{currentUser.name}</p>
                <p className="text-[10px] text-[#f5ded7] font-medium truncate">{roleLabels[currentUser.role]}</p>
              </div>
            )}
          </div>
        </div>

        <button
          onClick={onLogout}
          className={`w-full flex items-center gap-2 bg-[#1f3834] hover:bg-rose-950/80 hover:text-rose-200 text-stone-300 transition-colors cursor-pointer border border-[#2d4e48] hover:border-rose-800/60 ${
            isCollapsed ? 'justify-center p-2 rounded-xl' : 'justify-center py-2 px-3 rounded-xl text-xs font-bold'
          }`}
          title="Logout of your account"
        >
          <LogOut className="w-4 h-4 text-rose-400 shrink-0" />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  </>
);
};

