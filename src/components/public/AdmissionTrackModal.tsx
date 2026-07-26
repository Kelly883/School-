import React, { useState } from 'react';
import {
  X,
  Search,
  Sparkles,
  CheckCircle2,
  GraduationCap,
  AlertCircle,
  KeyRound,
  ShieldCheck,
  Lock,
  Copy,
  Check,
  ArrowRight,
  ArrowLeft,
  Upload
} from 'lucide-react';
import { ClassName } from '../../types';
import { getDynamicScheduleInfo } from '../../utils/formatters';

interface AdmissionApplication {
  appNo: string;
  securityPin: string;
  studentName: string;
  surname: string;
  firstName: string;
  otherNames?: string;
  gender: string;
  dateOfBirth: string;
  age?: number;
  religion?: string;
  genotype?: string;
  bloodGroup?: string;
  stateOfOrigin?: string;
  lga?: string;
  targetClass: string;
  arm?: string;
  house?: string;
  fatherName?: string;
  motherName?: string;
  parentName: string;
  parentPhone: string;
  parentEmail?: string;
  occupation?: string;
  emergencyContact?: string;
  address?: string;
  prevSchool?: string;
  prevClass?: string;
  transferReason?: string;
  status: string;
  examDate: string;
  venue: string;
  submittedAt: string;
}

const STORAGE_KEY = 'apex_admission_applications';

const DEFAULT_SAMPLE_APPS: AdmissionApplication[] = [
  {
    appNo: 'APX-2026-8942',
    securityPin: '1234',
    studentName: 'Chidi Victor Okeke',
    surname: 'Okeke',
    firstName: 'Chidi',
    otherNames: 'Victor',
    gender: 'Male',
    dateOfBirth: '2014-05-12',
    age: 12,
    religion: 'Christianity',
    genotype: 'AA',
    bloodGroup: 'O+',
    stateOfOrigin: 'Anambra',
    lga: 'Nnewi North',
    targetClass: 'JSS1',
    arm: 'Arm A',
    house: 'Red House',
    fatherName: 'Mr. Emmanuel Okeke',
    motherName: 'Mrs. Chinyere Okeke',
    parentName: 'Mr. Emmanuel Okeke',
    parentPhone: '+234 803 111 2233',
    parentEmail: 'e.okeke@example.com',
    occupation: 'Business Executive',
    emergencyContact: '+234 803 111 2244',
    address: 'Lekki Phase 1, Lagos',
    prevSchool: 'Saint Francis Primary School',
    prevClass: 'Primary 6',
    transferReason: 'Graduation & Transition to Junior Secondary',
    status: 'Entrance Examination Scheduled',
    examDate: 'Saturday, August 15, 2026 at 8:30 AM',
    venue: 'Apex College CBT Hall, Victoria Island',
    submittedAt: '2026-07-01T10:00:00.000Z',
  },
  {
    appNo: 'APX-2026-5120',
    securityPin: '5821',
    studentName: 'Amina Fatima Bello',
    surname: 'Bello',
    firstName: 'Amina',
    otherNames: 'Fatima',
    gender: 'Female',
    dateOfBirth: '2018-03-22',
    age: 8,
    religion: 'Islam',
    genotype: 'AS',
    bloodGroup: 'A+',
    stateOfOrigin: 'Kano',
    lga: 'Kano Municipal',
    targetClass: 'Primary 1',
    arm: 'Arm B',
    house: 'Blue House',
    fatherName: 'Alhaji Ibrahim Bello',
    motherName: 'Mrs. Aisha Bello',
    parentName: 'Mrs. Aisha Bello',
    parentPhone: '+234 802 334 5566',
    parentEmail: 'a.bello@example.com',
    occupation: 'Architect',
    emergencyContact: '+234 802 334 5577',
    address: 'Ikeja GRA, Lagos',
    prevSchool: 'Apex Nursery School',
    prevClass: 'Nursery 2',
    transferReason: 'Promotion to Primary School',
    status: 'Application Under Review',
    examDate: 'Saturday, August 15, 2026 at 10:00 AM',
    venue: 'Apex Primary Block, Main Campus',
    submittedAt: '2026-07-20T14:30:00.000Z',
  },
  {
    appNo: 'APX-2026-3091',
    securityPin: '7741',
    studentName: 'Kelechi David Nnamdi',
    surname: 'Nnamdi',
    firstName: 'Kelechi',
    otherNames: 'David',
    gender: 'Male',
    dateOfBirth: '2011-11-05',
    age: 15,
    religion: 'Christianity',
    genotype: 'AA',
    bloodGroup: 'O+',
    stateOfOrigin: 'Enugu',
    lga: 'Enugu North',
    targetClass: 'SSS1',
    arm: 'Arm A',
    house: 'Green House',
    fatherName: 'Chief Nnamdi',
    motherName: 'Dr. Mrs. Nnamdi',
    parentName: 'Chief Nnamdi',
    parentPhone: '+234 805 778 9900',
    parentEmail: 'c.nnamdi@example.com',
    occupation: 'Legal Practitioner',
    emergencyContact: '+234 805 778 9911',
    address: 'Ikoyi, Lagos',
    prevSchool: 'Command Secondary School',
    prevClass: 'JSS3',
    transferReason: 'Family relocation to Victoria Island',
    status: 'Admission Granted - Pending Enrollment',
    examDate: 'Completed on July 10, 2026',
    venue: 'Apex Senior Block, Victoria Island',
    submittedAt: '2026-07-15T09:15:00.000Z',
  }
];

const getStoredApplications = (): AdmissionApplication[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Failed to read admission applications', err);
  }
  return DEFAULT_SAMPLE_APPS;
};

const saveApplication = (app: AdmissionApplication) => {
  try {
    const current = getStoredApplications();
    const updated = [app, ...current.filter((a) => a.appNo.toUpperCase() !== app.appNo.toUpperCase())];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to save admission application', err);
  }
};

interface AdmissionTrackModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'apply' | 'track';
}

export const AdmissionTrackModal: React.FC<AdmissionTrackModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'apply',
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'apply' | 'track'>(initialTab);
  const [activeStep, setActiveStep] = useState<number>(1);

  // Comprehensive Application form state
  const [formData, setFormData] = useState({
    surname: '',
    firstName: '',
    otherNames: '',
    gender: 'Male',
    dateOfBirth: '2014-05-12',
    age: 12,
    genotype: 'AA',
    bloodGroup: 'O+',
    religion: 'Christianity',
    targetClass: 'JSS1' as ClassName,
    arm: 'Arm A',
    house: 'Red House',
    stateOfOrigin: 'Lagos',
    lga: 'Ikeja',
    address: '',
    fatherName: '',
    motherName: '',
    occupation: '',
    parentPhone: '',
    parentEmail: '',
    emergencyContact: '',
    prevSchool: '',
    prevClass: '',
    transferReason: '',
  });

  const [submittedApp, setSubmittedApp] = useState<AdmissionApplication | null>(null);

  // Tracking lookup state
  const [trackAppNo, setTrackAppNo] = useState('');
  const [verificationInput, setVerificationInput] = useState('');
  const [verificationMethod, setVerificationMethod] = useState<'pin' | 'dob' | 'phone'>('pin');
  
  const [foundApp, setFoundApp] = useState<AdmissionApplication | null>(null);
  const [isVerified, setIsVerified] = useState(false);
  const [searchAttempted, setSearchAttempted] = useState(false);
  const [verificationError, setVerificationError] = useState<string | null>(null);
  const [copiedPin, setCopiedPin] = useState(false);

  // Handle Application Submit
  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.surname || !formData.firstName || !formData.parentPhone) return;

    const fullStudentName = `${formData.firstName} ${formData.otherNames ? formData.otherNames + ' ' : ''}${formData.surname}`.trim();
    const parentName = formData.fatherName || formData.motherName || 'Parent / Guardian';
    const randomAppNo = `APX-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const randomPin = Math.floor(1000 + Math.random() * 9000).toString();

    const newApp: AdmissionApplication = {
      appNo: randomAppNo,
      securityPin: randomPin,
      studentName: fullStudentName,
      surname: formData.surname,
      firstName: formData.firstName,
      otherNames: formData.otherNames,
      gender: formData.gender,
      dateOfBirth: formData.dateOfBirth,
      age: Number(formData.age),
      religion: formData.religion,
      genotype: formData.genotype,
      bloodGroup: formData.bloodGroup,
      stateOfOrigin: formData.stateOfOrigin,
      lga: formData.lga,
      targetClass: formData.targetClass,
      arm: formData.arm || 'Arm A',
      house: formData.house || 'Red House',
      fatherName: formData.fatherName,
      motherName: formData.motherName,
      parentName,
      parentPhone: formData.parentPhone,
      parentEmail: formData.parentEmail,
      occupation: formData.occupation,
      emergencyContact: formData.emergencyContact,
      address: formData.address,
      prevSchool: formData.prevSchool,
      prevClass: formData.prevClass,
      transferReason: formData.transferReason,
      status: 'Entrance Examination Scheduled',
      examDate: 'Saturday, August 15, 2026 at 8:30 AM',
      venue: 'Apex College CBT Hall, Victoria Island',
      submittedAt: new Date().toISOString(),
    };

    saveApplication(newApp);
    setSubmittedApp(newApp);
    setTrackAppNo(randomAppNo);
  };

  // Handle Initial Application Search
  const handleTrackSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setVerificationError(null);
    setVerificationInput('');
    setIsVerified(false);

    if (!trackAppNo.trim()) return;

    const query = trackAppNo.trim().toUpperCase();
    const stored = getStoredApplications();

    const matched = stored.find((a) => {
      const cleanApp = a.appNo.replace(/[^A-Z0-9]/gi, '').toUpperCase();
      const cleanQuery = query.replace(/[^A-Z0-9]/gi, '');
      return a.appNo.toUpperCase() === query || cleanApp === cleanQuery;
    });

    setSearchAttempted(true);
    if (matched) {
      setFoundApp(matched);
    } else {
      setFoundApp(null);
    }
  };

  // Handle Secondary Verification
  const handleVerifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!foundApp) return;

    setVerificationError(null);
    const userInput = verificationInput.trim();

    if (!userInput) {
      setVerificationError('Please enter verification details.');
      return;
    }

    let matches = false;

    if (verificationMethod === 'pin') {
      matches = userInput === foundApp.securityPin;
    } else if (verificationMethod === 'dob') {
      matches = userInput === foundApp.dateOfBirth;
    } else if (verificationMethod === 'phone') {
      const cleanInput = userInput.replace(/[^0-9]/g, '');
      const cleanAppPhone = foundApp.parentPhone.replace(/[^0-9]/g, '');
      matches = cleanInput.length > 3 && cleanAppPhone.includes(cleanInput);
    }

    if (matches) {
      setIsVerified(true);
      setVerificationError(null);
    } else {
      setIsVerified(false);
      setVerificationError(
        `Verification failed: The entered ${
          verificationMethod === 'pin' ? 'PIN' : verificationMethod === 'dob' ? 'Date of Birth' : 'Phone Number'
        } does not match our registration records for ${foundApp.appNo}.`
      );
    }
  };

  const handleTrackSubmittedApp = () => {
    if (!submittedApp) return;
    setFoundApp(submittedApp);
    setIsVerified(true); // Auto-verify freshly submitted app in same session
    setSearchAttempted(true);
    setActiveTab('track');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPin(true);
    setTimeout(() => setCopiedPin(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/70 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 border border-[#BEE8E0] shadow-2xl relative max-h-[95vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-800 bg-stone-100 hover:bg-stone-200 rounded-full transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-[#DFF6F0] text-[#162825] flex items-center justify-center mx-auto border border-[#6DD5C4] shadow-xs">
            <GraduationCap className="w-6 h-6 text-[#0D5C52]" />
          </div>
          <h3 className="font-serif text-2xl font-bold text-[#162825]">
            Admissions Portal
          </h3>
          <p className="text-xs text-stone-500 font-medium">
            2026/2027 Academic Session Application & Secure Status Verification
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center p-1 bg-[#DFF6F0] rounded-2xl border border-[#BEE8E0]">
          <button
            onClick={() => {
              setActiveTab('apply');
              setSubmittedApp(null);
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'apply'
                ? 'bg-[#162825] text-[#6DD5C4] shadow-xs'
                : 'text-[#162825] hover:bg-[#6DD5C4]/20'
            }`}
          >
            Apply for Admission
          </button>
          <button
            onClick={() => setActiveTab('track')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'track'
                ? 'bg-[#162825] text-[#6DD5C4] shadow-xs'
                : 'text-[#162825] hover:bg-[#6DD5C4]/20'
            }`}
          >
            Track Application Status
          </button>
        </div>

        {/* TAB 1: APPLY */}
        {activeTab === 'apply' && (
          <div>
            {submittedApp ? (
              <div className="p-6 bg-[#DFF6F0] rounded-2xl border border-[#6DD5C4] text-center space-y-4">
                <CheckCircle2 className="w-12 h-12 text-[#0D5C52] mx-auto" />
                <div className="space-y-1">
                  <h4 className="font-serif font-bold text-xl text-[#162825]">
                    Application Submitted Successfully!
                  </h4>
                  <p className="text-xs text-stone-600">
                    Your application and security verification credentials have been generated.
                  </p>
                </div>

                {/* Credentials Display Box */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-white rounded-xl border border-[#BEE8E0] text-left">
                  <div className="space-y-1">
                    <p className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">
                      Tracking Application ID
                    </p>
                    <p className="font-mono text-lg font-bold text-[#162825] tracking-wider">
                      {submittedApp.appNo}
                    </p>
                  </div>
                  <div className="space-y-1 bg-[#F4FAF8] p-2.5 rounded-lg border border-[#6DD5C4]/40 relative">
                    <p className="text-[10px] text-[#0D5C52] font-bold uppercase tracking-wider flex items-center gap-1">
                      <KeyRound className="w-3 h-3 text-[#0D5C52]" />
                      <span>Security Verification PIN</span>
                    </p>
                    <div className="flex items-center justify-between">
                      <p className="font-mono text-lg font-black text-[#162825] tracking-widest">
                        {submittedApp.securityPin}
                      </p>
                      <button
                        onClick={() => copyToClipboard(`ID: ${submittedApp.appNo}, PIN: ${submittedApp.securityPin}`)}
                        className="text-[11px] font-bold text-[#0D5C52] hover:text-[#162825] flex items-center gap-1 bg-white px-2 py-1 rounded border border-[#BEE8E0] cursor-pointer"
                        title="Copy Application credentials"
                      >
                        {copiedPin ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedPin ? 'Copied' : 'Copy Credentials'}</span>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="text-xs text-stone-600 text-left space-y-1.5 bg-white/70 p-3.5 rounded-xl border border-[#BEE8E0]">
                  <p className="font-bold text-[#162825] flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-[#0D5C52]" />
                    <span>Applicant Registration Details:</span>
                  </p>
                  <p>• <strong>Student Name:</strong> {submittedApp.studentName}</p>
                  <p>• <strong>Target Class:</strong> {submittedApp.targetClass}</p>
                  <p>• <strong>Date of Birth:</strong> {submittedApp.dateOfBirth}</p>
                  <p>• <strong>Parent/Guardian:</strong> {submittedApp.parentName} ({submittedApp.parentPhone})</p>
                  
                  <div className="mt-3 p-2.5 bg-amber-50 rounded-lg border border-amber-200 text-amber-900 text-[11px]">
                    <strong>Important Note:</strong> Please write down or screenshot your <strong>Application ID ({submittedApp.appNo})</strong> and <strong>Security PIN ({submittedApp.securityPin})</strong>. You will be required to verify your identity before accessing entrance exam results and admission updates.
                  </div>
                </div>

                <button
                  onClick={handleTrackSubmittedApp}
                  className="w-full py-3 bg-[#162825] text-white font-bold text-xs rounded-xl hover:bg-[#0D5C52] transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4 text-[#6DD5C4]" />
                  <span>View Verified Application Status</span>
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplySubmit} className="space-y-4">
                {/* Step Indicator Bar */}
                <div className="bg-[#F4FAF8] border border-[#BEE8E0] rounded-xl p-1.5 flex items-center justify-between text-xs font-bold text-stone-600">
                  <button
                    type="button"
                    onClick={() => setActiveStep(1)}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg cursor-pointer transition-all ${
                      activeStep === 1 ? 'bg-[#162825] text-[#6DD5C4] shadow-xs' : 'text-stone-500 hover:text-stone-800'
                    }`}
                  >
                    <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                      activeStep === 1 ? 'bg-[#6DD5C4] text-[#162825]' : 'bg-stone-200 text-stone-600'
                    }`}>1</span>
                    <span>1. Personal</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveStep(2)}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg cursor-pointer transition-all ${
                      activeStep === 2 ? 'bg-[#162825] text-[#6DD5C4] shadow-xs' : 'text-stone-500 hover:text-stone-800'
                    }`}
                  >
                    <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                      activeStep === 2 ? 'bg-[#6DD5C4] text-[#162825]' : 'bg-stone-200 text-stone-600'
                    }`}>2</span>
                    <span>2. Parent/Guardian</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveStep(3)}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg cursor-pointer transition-all ${
                      activeStep === 3 ? 'bg-[#162825] text-[#6DD5C4] shadow-xs' : 'text-stone-500 hover:text-stone-800'
                    }`}
                  >
                    <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                      activeStep === 3 ? 'bg-[#6DD5C4] text-[#162825]' : 'bg-stone-200 text-stone-600'
                    }`}>3</span>
                    <span>3. School & Docs</span>
                  </button>
                </div>

                {/* STEP 1: PERSONAL INFORMATION */}
                {activeStep === 1 && (
                  <div className="space-y-3 animate-fadeIn">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      <div>
                        <label className="block text-[11px] font-bold text-stone-700 mb-1">Surname *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Okafor"
                          value={formData.surname}
                          onChange={(e) => setFormData({ ...formData, surname: e.target.value })}
                          className="w-full px-3 py-2 bg-[#F4FAF8] border border-[#BEE8E0] focus:border-[#6DD5C4] rounded-xl text-xs outline-none font-semibold"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-stone-700 mb-1">First Name *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Emeka"
                          value={formData.firstName}
                          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                          className="w-full px-3 py-2 bg-[#F4FAF8] border border-[#BEE8E0] focus:border-[#6DD5C4] rounded-xl text-xs outline-none font-semibold"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-stone-700 mb-1">Middle Name</label>
                        <input
                          type="text"
                          placeholder="e.g. Chidera"
                          value={formData.otherNames}
                          onChange={(e) => setFormData({ ...formData, otherNames: e.target.value })}
                          className="w-full px-3 py-2 bg-[#F4FAF8] border border-[#BEE8E0] focus:border-[#6DD5C4] rounded-xl text-xs outline-none font-semibold"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      <div>
                        <label className="block text-[11px] font-bold text-stone-700 mb-1">Gender *</label>
                        <select
                          value={formData.gender}
                          onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                          className="w-full px-3 py-2 bg-[#F4FAF8] border border-[#BEE8E0] focus:border-[#6DD5C4] rounded-xl text-xs outline-none font-semibold"
                        >
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-stone-700 mb-1">Date of Birth *</label>
                        <input
                          type="date"
                          required
                          value={formData.dateOfBirth}
                          onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                          className="w-full px-2.5 py-2 bg-[#F4FAF8] border border-[#BEE8E0] focus:border-[#6DD5C4] rounded-xl text-xs outline-none font-semibold"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-stone-700 mb-1">Age (Years)</label>
                        <input
                          type="number"
                          value={formData.age}
                          onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
                          className="w-full px-3 py-2 bg-[#F4FAF8] border border-[#BEE8E0] focus:border-[#6DD5C4] rounded-xl text-xs outline-none font-semibold"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-stone-700 mb-1">Genotype</label>
                        <select
                          value={formData.genotype}
                          onChange={(e) => setFormData({ ...formData, genotype: e.target.value })}
                          className="w-full px-3 py-2 bg-[#F4FAF8] border border-[#BEE8E0] focus:border-[#6DD5C4] rounded-xl text-xs outline-none font-semibold"
                        >
                          <option value="AA">AA</option>
                          <option value="AS">AS</option>
                          <option value="SS">SS</option>
                          <option value="AC">AC</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      <div>
                        <label className="block text-[11px] font-bold text-stone-700 mb-1">Blood Group</label>
                        <select
                          value={formData.bloodGroup}
                          onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                          className="w-full px-3 py-2 bg-[#F4FAF8] border border-[#BEE8E0] focus:border-[#6DD5C4] rounded-xl text-xs outline-none font-semibold"
                        >
                          <option value="O+">O+</option>
                          <option value="A+">A+</option>
                          <option value="B+">B+</option>
                          <option value="AB+">AB+</option>
                          <option value="O-">O-</option>
                          <option value="A-">A-</option>
                          <option value="B-">B-</option>
                          <option value="AB-">AB-</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-stone-700 mb-1">Religion</label>
                        <select
                          value={formData.religion}
                          onChange={(e) => setFormData({ ...formData, religion: e.target.value })}
                          className="w-full px-3 py-2 bg-[#F4FAF8] border border-[#BEE8E0] focus:border-[#6DD5C4] rounded-xl text-xs outline-none font-semibold"
                        >
                          <option value="Christianity">Christianity</option>
                          <option value="Islam">Islam</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-stone-700 mb-1">Target Class *</label>
                        <select
                          value={formData.targetClass}
                          onChange={(e) => setFormData({ ...formData, targetClass: e.target.value as ClassName })}
                          className="w-full px-3 py-2 bg-[#162825] text-white font-bold rounded-xl text-xs outline-none"
                        >
                          <option value="Creche">Creche</option>
                          <option value="Nursery 1">Nursery 1</option>
                          <option value="Nursery 2">Nursery 2</option>
                          <option value="Primary 1">Primary 1</option>
                          <option value="Primary 2">Primary 2</option>
                          <option value="Primary 3">Primary 3</option>
                          <option value="Primary 4">Primary 4</option>
                          <option value="Primary 5">Primary 5</option>
                          <option value="Primary 6">Primary 6</option>
                          <option value="JSS1">JSS1 (Junior Sec)</option>
                          <option value="JSS2">JSS2 (Junior Sec)</option>
                          <option value="JSS3">JSS3 (Junior Sec)</option>
                          <option value="SSS1">SSS1 (Senior Sec)</option>
                          <option value="SSS2">SSS2 (Senior Sec)</option>
                          <option value="SSS3">SSS3 (Senior Sec)</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div>
                        <label className="block text-[11px] font-bold text-stone-700 mb-1">State of Origin</label>
                        <input
                          type="text"
                          placeholder="e.g. Lagos"
                          value={formData.stateOfOrigin}
                          onChange={(e) => setFormData({ ...formData, stateOfOrigin: e.target.value })}
                          className="w-full px-3 py-2 bg-[#F4FAF8] border border-[#BEE8E0] focus:border-[#6DD5C4] rounded-xl text-xs outline-none font-semibold"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-stone-700 mb-1">Local Govt Area (LGA)</label>
                        <input
                          type="text"
                          placeholder="e.g. Ikeja"
                          value={formData.lga}
                          onChange={(e) => setFormData({ ...formData, lga: e.target.value })}
                          className="w-full px-3 py-2 bg-[#F4FAF8] border border-[#BEE8E0] focus:border-[#6DD5C4] rounded-xl text-xs outline-none font-semibold"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-stone-700 mb-1">Residential Address *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. 12 Allen Avenue, Ikeja, Lagos State"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        className="w-full px-3 py-2 bg-[#F4FAF8] border border-[#BEE8E0] focus:border-[#6DD5C4] rounded-xl text-xs outline-none font-semibold"
                      />
                    </div>
                  </div>
                )}

                {/* STEP 2: PARENT / GUARDIAN */}
                {activeStep === 2 && (
                  <div className="space-y-3 animate-fadeIn">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div>
                        <label className="block text-[11px] font-bold text-stone-700 mb-1">Father's Full Name *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Chief Babatunde Okafor"
                          value={formData.fatherName}
                          onChange={(e) => setFormData({ ...formData, fatherName: e.target.value })}
                          className="w-full px-3 py-2 bg-[#F4FAF8] border border-[#BEE8E0] focus:border-[#6DD5C4] rounded-xl text-xs outline-none font-semibold"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-stone-700 mb-1">Mother's Full Name *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Mrs. Ngozi Okafor"
                          value={formData.motherName}
                          onChange={(e) => setFormData({ ...formData, motherName: e.target.value })}
                          className="w-full px-3 py-2 bg-[#F4FAF8] border border-[#BEE8E0] focus:border-[#6DD5C4] rounded-xl text-xs outline-none font-semibold"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div>
                        <label className="block text-[11px] font-bold text-stone-700 mb-1">Parent Phone Number (+234) *</label>
                        <input
                          type="tel"
                          required
                          placeholder="e.g. +234 803 123 4567"
                          value={formData.parentPhone}
                          onChange={(e) => setFormData({ ...formData, parentPhone: e.target.value })}
                          className="w-full px-3 py-2 bg-[#F4FAF8] border border-[#BEE8E0] focus:border-[#6DD5C4] rounded-xl text-xs outline-none font-semibold"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-stone-700 mb-1">Parent Email Address *</label>
                        <input
                          type="email"
                          required
                          placeholder="e.g. parent@gmail.com"
                          value={formData.parentEmail}
                          onChange={(e) => setFormData({ ...formData, parentEmail: e.target.value })}
                          className="w-full px-3 py-2 bg-[#F4FAF8] border border-[#BEE8E0] focus:border-[#6DD5C4] rounded-xl text-xs outline-none font-semibold"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div>
                        <label className="block text-[11px] font-bold text-stone-700 mb-1">Primary Occupation</label>
                        <input
                          type="text"
                          placeholder="e.g. Civil Servant / Engineer"
                          value={formData.occupation}
                          onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                          className="w-full px-3 py-2 bg-[#F4FAF8] border border-[#BEE8E0] focus:border-[#6DD5C4] rounded-xl text-xs outline-none font-semibold"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-stone-700 mb-1">Emergency Contact Phone</label>
                        <input
                          type="tel"
                          placeholder="e.g. +234 803 999 8877"
                          value={formData.emergencyContact}
                          onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                          className="w-full px-3 py-2 bg-[#F4FAF8] border border-[#BEE8E0] focus:border-[#6DD5C4] rounded-xl text-xs outline-none font-semibold"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 3: SCHOOL HISTORY & DOCS */}
                {activeStep === 3 && (
                  <div className="space-y-3 animate-fadeIn">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div>
                        <label className="block text-[11px] font-bold text-stone-700 mb-1">Previous School Attended</label>
                        <input
                          type="text"
                          placeholder="e.g. Grace International Academy"
                          value={formData.prevSchool}
                          onChange={(e) => setFormData({ ...formData, prevSchool: e.target.value })}
                          className="w-full px-3 py-2 bg-[#F4FAF8] border border-[#BEE8E0] focus:border-[#6DD5C4] rounded-xl text-xs outline-none font-semibold"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-stone-700 mb-1">Last Class Completed</label>
                        <input
                          type="text"
                          placeholder="e.g. Primary 6 / JSS 3"
                          value={formData.prevClass}
                          onChange={(e) => setFormData({ ...formData, prevClass: e.target.value })}
                          className="w-full px-3 py-2 bg-[#F4FAF8] border border-[#BEE8E0] focus:border-[#6DD5C4] rounded-xl text-xs outline-none font-semibold"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-stone-700 mb-1">Reason for Transfer</label>
                      <input
                        type="text"
                        placeholder="e.g. Relocation / Graduation to Secondary School"
                        value={formData.transferReason}
                        onChange={(e) => setFormData({ ...formData, transferReason: e.target.value })}
                        className="w-full px-3 py-2 bg-[#F4FAF8] border border-[#BEE8E0] focus:border-[#6DD5C4] rounded-xl text-xs outline-none font-semibold"
                      />
                    </div>

                    {/* Upload Box */}
                    <div className="p-3 bg-[#F4FAF8] border border-dashed border-[#6DD5C4] rounded-xl text-center space-y-1">
                      <Upload className="w-5 h-5 text-[#0D5C52] mx-auto" />
                      <p className="text-xs font-bold text-[#162825]">Upload Birth Certificate & Passport Photograph</p>
                      <p className="text-[10px] text-stone-500">Supported formats: JPG, PNG, PDF (Max size 5MB)</p>
                      <button
                        type="button"
                        className="text-[11px] font-bold text-[#0D5C52] bg-white px-2.5 py-1 rounded-lg border border-[#BEE8E0] hover:bg-[#DFF6F0] transition-colors cursor-pointer mt-1"
                      >
                        Choose File
                      </button>
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex items-center justify-between pt-2 border-t border-stone-200">
                  {activeStep > 1 ? (
                    <button
                      type="button"
                      onClick={() => setActiveStep(activeStep - 1)}
                      className="px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs rounded-xl transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Previous Step</span>
                    </button>
                  ) : (
                    <div />
                  )}

                  {activeStep < 3 ? (
                    <button
                      type="button"
                      onClick={() => {
                        if (activeStep === 1 && (!formData.surname || !formData.firstName)) {
                          alert('Please enter student surname and first name to proceed.');
                          return;
                        }
                        if (activeStep === 2 && !formData.parentPhone) {
                          alert('Please enter parent phone number to proceed.');
                          return;
                        }
                        setActiveStep(activeStep + 1);
                      }}
                      className="px-4 py-2 bg-[#162825] hover:bg-[#0D5C52] text-white font-bold text-xs rounded-xl transition-colors cursor-pointer flex items-center gap-1 shadow-sm"
                    >
                      <span>Next Step</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-[#162825] hover:bg-[#0D5C52] text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <Sparkles className="w-4 h-4 text-[#6DD5C4]" />
                      <span>Submit Admission Application</span>
                    </button>
                  )}
                </div>
              </form>
            )}
          </div>
        )}

        {/* TAB 2: TRACK & VERIFY STATUS */}
        {activeTab === 'track' && (
          <div className="space-y-4">
            {/* Step 1: Search Form */}
            <form onSubmit={handleTrackSearch} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Application Tracking Number *
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    placeholder="e.g. APX-2026-8942"
                    value={trackAppNo}
                    onChange={(e) => {
                      setTrackAppNo(e.target.value);
                      if (searchAttempted) setSearchAttempted(false);
                    }}
                    className="flex-1 px-3.5 py-2.5 bg-[#F4FAF8] border border-[#BEE8E0] focus:border-[#6DD5C4] rounded-xl text-xs outline-none uppercase font-mono font-bold text-[#162825]"
                  />
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-[#162825] text-white hover:bg-[#0D5C52] font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1.5 shrink-0"
                  >
                    <Search className="w-4 h-4 text-[#6DD5C4]" />
                    <span>Search</span>
                  </button>
                </div>
              </div>
            </form>

            {/* Step 2: Search Result handling */}
            {searchAttempted && !foundApp && (
              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 space-y-2 mt-4 text-xs text-amber-900">
                <div className="flex items-center gap-2 font-bold text-amber-800">
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                  <span>Application Not Found</span>
                </div>
                <p>
                  No registered application matching ID <strong className="font-mono">{trackAppNo.toUpperCase()}</strong> was found in our database.
                </p>
                <p className="text-[11px] text-amber-700">
                  Please verify your tracking code or submit a new application under the <strong>Apply for Admission</strong> tab.
                </p>
                <button
                  type="button"
                  onClick={() => setActiveTab('apply')}
                  className="mt-2 text-xs font-bold text-[#162825] underline hover:text-[#0D5C52] cursor-pointer"
                >
                  Submit New Application &rarr;
                </button>
              </div>
            )}

            {/* Step 3: Application Found -> Verification Challenge Gate */}
            {foundApp && !isVerified && (
              <div className="p-5 bg-[#F4FAF8] rounded-2xl border border-[#6DD5C4] space-y-4">
                <div className="flex items-center justify-between border-b border-[#BEE8E0] pb-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                      Application Found
                    </span>
                    <span className="font-mono text-sm font-bold text-[#162825]">
                      {foundApp.appNo}
                    </span>
                  </div>
                  <span className="px-2.5 py-1 bg-amber-100 text-amber-800 text-[10px] font-bold rounded-md flex items-center gap-1 border border-amber-300">
                    <Lock className="w-3 h-3" />
                    <span>Verification Required</span>
                  </span>
                </div>

                <div className="space-y-1 text-xs text-stone-600">
                  <p className="font-semibold text-[#162825]">
                    Identity Verification Gate
                  </p>
                  <p className="text-[11px] leading-relaxed">
                    To protect student privacy and prevent data mismatch errors, please confirm your secondary credential before viewing registration details.
                  </p>
                </div>

                {/* Verification Selector */}
                <div className="space-y-3 bg-white p-3.5 rounded-xl border border-[#BEE8E0]">
                  <div className="flex items-center gap-2 text-xs font-bold text-stone-700">
                    <KeyRound className="w-4 h-4 text-[#0D5C52]" />
                    <span>Select Verification Match Method:</span>
                  </div>

                  <div className="grid grid-cols-3 gap-1.5 p-1 bg-[#F4FAF8] rounded-lg border border-[#BEE8E0] text-[11px] font-bold">
                    <button
                      type="button"
                      onClick={() => {
                        setVerificationMethod('pin');
                        setVerificationError(null);
                        setVerificationInput('');
                      }}
                      className={`py-1.5 rounded-md transition-all cursor-pointer ${
                        verificationMethod === 'pin'
                          ? 'bg-[#162825] text-[#6DD5C4] shadow-xs'
                          : 'text-stone-600 hover:text-stone-900'
                      }`}
                    >
                      Security PIN
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setVerificationMethod('dob');
                        setVerificationError(null);
                        setVerificationInput('');
                      }}
                      className={`py-1.5 rounded-md transition-all cursor-pointer ${
                        verificationMethod === 'dob'
                          ? 'bg-[#162825] text-[#6DD5C4] shadow-xs'
                          : 'text-stone-600 hover:text-stone-900'
                      }`}
                    >
                      Date of Birth
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setVerificationMethod('phone');
                        setVerificationError(null);
                        setVerificationInput('');
                      }}
                      className={`py-1.5 rounded-md transition-all cursor-pointer ${
                        verificationMethod === 'phone'
                          ? 'bg-[#162825] text-[#6DD5C4] shadow-xs'
                          : 'text-stone-600 hover:text-stone-900'
                      }`}
                    >
                      Parent Phone
                    </button>
                  </div>

                  <form onSubmit={handleVerifySubmit} className="space-y-3 pt-2">
                    {verificationMethod === 'pin' && (
                      <div>
                        <label className="block text-[11px] font-bold text-stone-700 mb-1">
                          4-Digit Security PIN *
                        </label>
                        <input
                          type="password"
                          maxLength={6}
                          required
                          placeholder="e.g. 1234 or 4821"
                          value={verificationInput}
                          onChange={(e) => setVerificationInput(e.target.value)}
                          className="w-full px-3.5 py-2 bg-[#F4FAF8] border border-[#BEE8E0] focus:border-[#6DD5C4] rounded-xl text-xs font-mono tracking-widest outline-none"
                        />
                        <span className="text-[10px] text-stone-400 mt-1 block">
                          Tip: Default sample application PIN is <strong className="font-mono">1234</strong>
                        </span>
                      </div>
                    )}

                    {verificationMethod === 'dob' && (
                      <div>
                        <label className="block text-[11px] font-bold text-stone-700 mb-1">
                          Student Date of Birth *
                        </label>
                        <input
                          type="date"
                          required
                          value={verificationInput}
                          onChange={(e) => setVerificationInput(e.target.value)}
                          className="w-full px-3 py-2 bg-[#F4FAF8] border border-[#BEE8E0] focus:border-[#6DD5C4] rounded-xl text-xs outline-none"
                        />
                      </div>
                    )}

                    {verificationMethod === 'phone' && (
                      <div>
                        <label className="block text-[11px] font-bold text-stone-700 mb-1">
                          Parent Registered Phone Number *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. +234 803 111 2233"
                          value={verificationInput}
                          onChange={(e) => setVerificationInput(e.target.value)}
                          className="w-full px-3.5 py-2 bg-[#F4FAF8] border border-[#BEE8E0] focus:border-[#6DD5C4] rounded-xl text-xs outline-none"
                        />
                      </div>
                    )}

                    {verificationError && (
                      <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-[11px] flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                        <span>{verificationError}</span>
                      </div>
                    )}

                    <button
                      type="submit"
                      className="w-full py-2.5 bg-[#162825] text-[#6DD5C4] hover:bg-[#0D5C52] font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      <span>Verify Credentials & View Details</span>
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* Step 4: Fully Verified Details Display */}
            {foundApp && isVerified && (
              <div className="p-5 bg-[#DFF6F0] rounded-2xl border border-[#6DD5C4] space-y-4 animate-fadeIn">
                <div className="flex items-center justify-between border-b border-[#6DD5C4] pb-3">
                  <div>
                    <span className="font-mono text-xs font-bold text-[#162825] block">
                      {foundApp.appNo}
                    </span>
                    <span className="text-[10px] text-emerald-800 font-bold flex items-center gap-1 mt-0.5">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                      <span>Verified Applicant Identity</span>
                    </span>
                  </div>
                  <span className="px-3 py-1 bg-[#162825] text-[#6DD5C4] text-[10px] font-bold rounded-lg shadow-xs">
                    {foundApp.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-white/80 p-3.5 rounded-xl border border-[#BEE8E0]">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-stone-400 uppercase">Student Name</p>
                    <p className="font-bold text-[#162825] text-sm">{foundApp.studentName}</p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-stone-400 uppercase">Target Class</p>
                    <p className="font-semibold text-stone-800">{foundApp.targetClass}</p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-stone-400 uppercase">Date of Birth</p>
                    <p className="font-medium text-stone-800">{foundApp.dateOfBirth}</p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-stone-400 uppercase">Gender</p>
                    <p className="font-medium text-stone-800">{foundApp.gender}</p>
                  </div>

                  <div className="space-y-1 sm:col-span-2 pt-2 border-t border-stone-200">
                    <p className="text-[10px] font-bold text-stone-400 uppercase">Parent / Guardian Contact</p>
                    <p className="font-semibold text-[#162825]">{foundApp.parentName}</p>
                    <p className="text-[#0D5C52] text-[11px] font-mono">{foundApp.parentPhone} {foundApp.parentEmail ? `• ${foundApp.parentEmail}` : ''}</p>
                  </div>
                </div>

                {(() => {
                  const scheduleInfo = getDynamicScheduleInfo(foundApp.status, foundApp.examDate, foundApp.venue);
                  return (
                    <div className="space-y-1.5 text-xs bg-[#162825] text-white p-4 rounded-xl shadow-xs">
                      <p className="text-[#6DD5C4] font-bold flex items-center gap-1.5 text-xs">
                        <GraduationCap className="w-4 h-4 text-[#6DD5C4]" />
                        <span>{scheduleInfo.sectionTitle}</span>
                      </p>
                      <p className="text-stone-200 text-[11px] pt-1">
                        <strong>{scheduleInfo.scheduleLabel}:</strong> {scheduleInfo.scheduleValue}
                      </p>
                      <p className="text-stone-200 text-[11px]">
                        <strong>{scheduleInfo.venueLabel}:</strong> {scheduleInfo.venueValue}
                      </p>
                      {scheduleInfo.instructionNote && (
                        <p className="text-[10px] text-[#6DD5C4] pt-2 border-t border-stone-800 leading-relaxed font-medium">
                          💡 {scheduleInfo.instructionNote}
                        </p>
                      )}
                    </div>
                  );
                })()}

                <div className="flex justify-between items-center pt-1 text-[11px] text-stone-500">
                  <button
                    onClick={() => {
                      setIsVerified(false);
                      setVerificationInput('');
                    }}
                    className="text-[#0D5C52] hover:underline font-bold cursor-pointer"
                  >
                    Lock / Re-verify Credentials
                  </button>
                  <span>Submitted: {new Date(foundApp.submittedAt).toLocaleDateString()}</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
