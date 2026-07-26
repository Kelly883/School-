import React, { useState } from 'react';
import {
  X,
  LogIn,
  KeyRound,
  ShieldCheck,
  UserCheck,
  GraduationCap,
  Building2,
  Lock,
  Mail,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  Sparkles,
  HelpCircle,
  Eye,
  EyeOff
} from 'lucide-react';
import { User, UserRole } from '../../types';
import { INITIAL_USERS } from '../../data/mockData';

interface PublicAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: User) => void;
  initialRole?: string;
}

export const PublicAuthModal: React.FC<PublicAuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  initialRole = 'super_admin',
}) => {
  if (!isOpen) return null;

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Authentication states
  const [authView, setAuthView] = useState<'login' | 'forgot' | '2fa'>('login');
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [isLockedOut, setIsLockedOut] = useState(false);
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [captchaInput, setCaptchaInput] = useState('');
  const [captchaAnswer, setCaptchaAnswer] = useState('7'); // e.g. 3 + 4 = 7
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [pendingUser, setPendingUser] = useState<User | null>(null);

  // Notifications
  const [errorMessage, setErrorMessage] = useState('');
  const [resetSentEmail, setResetSentEmail] = useState('');

  // Selected preset role tab for easy testing
  const [selectedRole, setSelectedRole] = useState<UserRole>((initialRole as UserRole) || 'super_admin');

  // Handle Login
  const handleAuthenticate = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (isLockedOut) {
      setErrorMessage('Account locked due to multiple failed login attempts. Please wait or reset password.');
      return;
    }

    if (showCaptcha && captchaInput !== captchaAnswer) {
      setErrorMessage('Incorrect CAPTCHA answer. Please try again.');
      return;
    }

    // Match user by selected role or identifier
    let matchedUser = INITIAL_USERS.find((u) => u.role === selectedRole);
    if (!matchedUser) {
      matchedUser = INITIAL_USERS[0];
    }

    // If 2FA required for Super Admin or Bursar
    if (['super_admin', 'admin_bursar'].includes(matchedUser.role) && authView !== '2fa') {
      setPendingUser(matchedUser);
      setAuthView('2fa');
      return;
    }

    // Success!
    onLoginSuccess(matchedUser);
    onClose();
  };

  // 2FA Verification
  const handleVerify2FA = (e: React.FormEvent) => {
    e.preventDefault();
    if (twoFactorCode.trim().length < 4) {
      setErrorMessage('Invalid 2FA Verification Code. Use 123456 for demo.');
      return;
    }
    if (pendingUser) {
      onLoginSuccess(pendingUser);
      onClose();
    }
  };

  // Password Reset
  const handleSendPasswordReset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetSentEmail) return;
    setErrorMessage('');
    alert(`Password reset link dispatched to ${resetSentEmail}. Please check your inbox.`);
    setAuthView('login');
  };

  const demoUsers: { role: UserRole; title: string; subtitle: string; icon: any }[] = [
    { role: 'super_admin', title: 'Super Admin', subtitle: 'Dr. Chidimma Okeke', icon: ShieldCheck },
    { role: 'admin_bursar', title: 'Bursar', subtitle: 'Mr. Babajide Phillips', icon: Building2 },
    { role: 'teacher', title: 'Teacher', subtitle: 'Mr. David Adeleke', icon: UserCheck },
    { role: 'parent', title: 'Parent Portal', subtitle: 'Chief Adeleke', icon: UserCheck },
    { role: 'student', title: 'Student Portal', subtitle: 'Kelechi Emmanuel (SSS2)', icon: GraduationCap },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/70 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 border border-[#BEE8E0] shadow-2xl relative max-h-[95vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-800 bg-stone-100 hover:bg-stone-200 rounded-full transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-[#DFF6F0] text-[#162825] flex items-center justify-center mx-auto border border-[#6DD5C4] shadow-xs">
            <Lock className="w-6 h-6 text-[#0D5C52]" />
          </div>
          <h3 className="font-serif text-2xl font-bold text-[#162825]">
            Unified Portal Authentication
          </h3>
          <p className="text-xs text-stone-500 font-medium">
            Single gateway for Administrators, Teachers, Bursars, Parents & Students
          </p>
        </div>

        {/* Error Banner */}
        {errorMessage && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs text-red-700 font-medium">
            <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* 2FA VIEW */}
        {authView === '2fa' && (
          <form onSubmit={handleVerify2FA} className="space-y-4 pt-2">
            <div className="p-4 bg-[#DFF6F0] rounded-2xl border border-[#6DD5C4] text-center space-y-1">
              <ShieldCheck className="w-8 h-8 text-[#0D5C52] mx-auto" />
              <h4 className="font-serif font-bold text-sm text-[#162825]">
                Two-Factor Authentication (2FA) Required
              </h4>
              <p className="text-[11px] text-stone-600">
                A 6-digit security token was sent to your registered authenticator app or phone number. (Demo code: <strong className="text-[#0D5C52]">123456</strong>)
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Enter 6-Digit 2FA Code
              </label>
              <input
                type="text"
                required
                placeholder="e.g. 123456"
                value={twoFactorCode}
                onChange={(e) => setTwoFactorCode(e.target.value)}
                className="w-full text-center tracking-widest text-lg font-mono font-bold px-4 py-2.5 bg-[#F4FAF8] border border-[#BEE8E0] focus:border-[#6DD5C4] rounded-xl outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#162825] text-white hover:bg-[#0D5C52] font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4 text-[#6DD5C4]" />
              <span>Verify & Access Portal</span>
            </button>
          </form>
        )}

        {/* FORGOT PASSWORD VIEW */}
        {authView === 'forgot' && (
          <form onSubmit={handleSendPasswordReset} className="space-y-4 pt-2">
            <div className="space-y-1">
              <h4 className="font-serif font-bold text-base text-[#162825]">
                Reset Portal Password
              </h4>
              <p className="text-xs text-stone-500">
                Enter your registered Email Address, Admission Number, or Staff ID to receive a password reset link.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Email / Admission No / Staff ID
              </label>
              <input
                type="text"
                required
                placeholder="e.g. parent@apexcollege.edu.ng"
                value={resetSentEmail}
                onChange={(e) => setResetSentEmail(e.target.value)}
                className="w-full px-4 py-2.5 bg-[#F4FAF8] border border-[#BEE8E0] focus:border-[#6DD5C4] rounded-xl text-xs outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#162825] text-white font-bold text-xs rounded-xl hover:bg-[#0D5C52] transition-colors cursor-pointer"
            >
              Dispatch Password Reset Link
            </button>

            <button
              type="button"
              onClick={() => setAuthView('login')}
              className="w-full text-center text-xs font-semibold text-[#0D5C52] hover:underline cursor-pointer"
            >
              Back to Login
            </button>
          </form>
        )}

        {/* LOGIN VIEW */}
        {authView === 'login' && (
          <div className="space-y-5">
            {/* Role Quick Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-stone-700">
                Select Target Portal Role
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {demoUsers.map((d) => {
                  const Icon = d.icon;
                  const isSelected = selectedRole === d.role;
                  return (
                    <button
                      key={d.role}
                      type="button"
                      onClick={() => {
                        setSelectedRole(d.role);
                        setIdentifier(`${d.role}@apexcollege.edu.ng`);
                        setPassword('••••••••');
                      }}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2 ${
                        isSelected
                          ? 'bg-[#162825] text-white border-[#162825] shadow-xs'
                          : 'bg-[#F4FAF8] text-stone-700 border-[#BEE8E0] hover:bg-[#DFF6F0]'
                      }`}
                    >
                      <Icon className={`w-4 h-4 shrink-0 ${isSelected ? 'text-[#6DD5C4]' : 'text-[#0D5C52]'}`} />
                      <div className="min-w-0">
                        <p className="font-bold text-[11px] truncate">{d.title}</p>
                        <p className={`text-[10px] truncate ${isSelected ? 'text-stone-300' : 'text-stone-400'}`}>
                          {d.subtitle}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Form Inputs */}
            <form onSubmit={handleAuthenticate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Email / Username / Admission No / Staff ID
                </label>
                <input
                  type="text"
                  required
                  placeholder="Enter your assigned identifier"
                  value={identifier || `${selectedRole}@apexcollege.edu.ng`}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#F4FAF8] border border-[#BEE8E0] focus:border-[#6DD5C4] rounded-xl text-xs outline-none"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-stone-700">Password</label>
                  <button
                    type="button"
                    onClick={() => setAuthView('forgot')}
                    className="text-[11px] font-semibold text-[#0D5C52] hover:underline cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Enter account password"
                    value={password || '••••••••'}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#F4FAF8] border border-[#BEE8E0] focus:border-[#6DD5C4] rounded-xl text-xs outline-none pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* CAPTCHA Challenge if failed */}
              {showCaptcha && (
                <div className="p-3 bg-[#DFF6F0] rounded-xl border border-[#6DD5C4] flex items-center justify-between gap-3 text-xs">
                  <span className="font-bold text-[#162825]">CAPTCHA: What is 3 + 4?</span>
                  <input
                    type="text"
                    required
                    placeholder="Answer"
                    value={captchaInput}
                    onChange={(e) => setCaptchaInput(e.target.value)}
                    className="w-20 px-2.5 py-1 bg-white border border-[#6DD5C4] rounded-lg text-center font-bold"
                  />
                </div>
              )}

              {/* Remember me & Session Timeout */}
              <div className="flex items-center justify-between text-xs text-stone-600 pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-[#6DD5C4] text-[#162825] focus:ring-0"
                  />
                  <span className="font-medium">Remember Me on this device</span>
                </label>

                <span className="text-[10px] text-stone-400">
                  Auto-logout after 30m inactivity
                </span>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#162825] text-white hover:bg-[#0D5C52] font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <LogIn className="w-4 h-4 text-[#6DD5C4]" />
                <span>Log In & Launch Portal</span>
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
