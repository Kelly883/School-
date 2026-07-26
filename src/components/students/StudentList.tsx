import React, { useState, useEffect } from 'react';
import {
  UserPlus,
  Search,
  Filter,
  Eye,
  CheckCircle2,
  AlertCircle,
  GraduationCap,
  KeyRound,
  ShieldCheck,
  X,
  Sparkles,
  Clock,
  UserCheck,
  XCircle,
  Calendar,
  Building2,
  FileSpreadsheet
} from 'lucide-react';
import { StudentProfile, StudentStatus, ClassName } from '../../types';
import { formatNaira, generateAdmissionNumber, getDynamicScheduleInfo } from '../../utils/formatters';

export interface AdmissionApplication {
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

const DEFAULT_PROSPECTIVE_APPS: AdmissionApplication[] = [
  {
    appNo: 'APX-2026-8942',
    securityPin: '1234',
    studentName: 'Chidi Victor Okeke',
    surname: 'Okeke',
    firstName: 'Chidi',
    otherNames: 'Victor',
    gender: 'Male',
    dateOfBirth: '2014-05-12',
    targetClass: 'JSS1',
    parentName: 'Mr. Emmanuel Okeke',
    parentPhone: '+234 803 111 2233',
    parentEmail: 'e.okeke@example.com',
    address: 'Lekki Phase 1, Lagos',
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
    targetClass: 'Primary 1',
    parentName: 'Mrs. Aisha Bello',
    parentPhone: '+234 802 334 5566',
    parentEmail: 'a.bello@example.com',
    address: 'Ikeja GRA, Lagos',
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
    targetClass: 'SSS1',
    parentName: 'Chief Nnamdi',
    parentPhone: '+234 805 778 9900',
    parentEmail: 'c.nnamdi@example.com',
    address: 'Ikoyi, Lagos',
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
  return DEFAULT_PROSPECTIVE_APPS;
};

const saveStoredApplications = (apps: AdmissionApplication[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(apps));
  } catch (err) {
    console.error('Failed to save admission applications', err);
  }
};

interface StudentListProps {
  students: StudentProfile[];
  onOpenAdmissionForm: () => void;
  onSelectStudent: (student: StudentProfile) => void;
  searchTerm: string;
  setSearchTerm: (s: string) => void;
  onRegisterStudent?: (newStudent: StudentProfile) => void;
}

export const StudentList: React.FC<StudentListProps> = ({
  students,
  onOpenAdmissionForm,
  onSelectStudent,
  searchTerm,
  setSearchTerm,
  onRegisterStudent,
}) => {
  const [viewMode, setViewMode] = useState<'enrolled' | 'prospective'>('enrolled');
  const [selectedClassFilter, setSelectedClassFilter] = useState<string>('All');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('All');

  // Prospective Applications State
  const [applications, setApplications] = useState<AdmissionApplication[]>([]);
  const [selectedApp, setSelectedApp] = useState<AdmissionApplication | null>(null);
  const [editingStatusApp, setEditingStatusApp] = useState<AdmissionApplication | null>(null);
  const [newStatusValue, setNewStatusValue] = useState<string>('');
  const [admittingApp, setAdmittingApp] = useState<AdmissionApplication | null>(null);
  const [admitArm, setAdmitArm] = useState<string>('Arm A');

  useEffect(() => {
    setApplications(getStoredApplications());
  }, []);

  const updateAppStatus = (appNo: string, newStatus: string) => {
    const dynamic = getDynamicScheduleInfo(newStatus);
    const updated = applications.map((a) => {
      if (a.appNo === appNo) {
        return {
          ...a,
          status: newStatus,
          examDate: dynamic.scheduleValue,
          venue: dynamic.venueValue,
        };
      }
      return a;
    });
    setApplications(updated);
    saveStoredApplications(updated);
    if (selectedApp?.appNo === appNo) {
      setSelectedApp({
        ...selectedApp,
        status: newStatus,
        examDate: dynamic.scheduleValue,
        venue: dynamic.venueValue,
      });
    }
    setEditingStatusApp(null);
  };

  const handleEnrollApplicant = (app: AdmissionApplication) => {
    if (!onRegisterStudent) return;

    const newAdmissionNo = generateAdmissionNumber('SCH', '2026', students.length + 1);

    const newStudentProfile: StudentProfile = {
      id: `stu-${Date.now()}`,
      personal: {
        firstName: app.firstName,
        surname: app.surname,
        middleName: app.otherNames || '',
        gender: app.gender as 'Male' | 'Female',
        dateOfBirth: app.dateOfBirth,
        age: app.age || 12,
        religion: (app.religion as any) || 'Christianity',
        nationality: 'Nigerian',
        stateOfOrigin: app.stateOfOrigin || 'Lagos',
        lga: app.lga || 'Ikeja',
        genotype: (app.genotype as any) || 'AA',
        bloodGroup: (app.bloodGroup as any) || 'O+',
        className: app.targetClass as ClassName,
        arm: (app.arm as any) || (admitArm as any) || 'Arm A',
        admissionNo: newAdmissionNo,
        admissionDate: new Date().toISOString().substring(0, 10),
        status: 'active',
        passportUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=100',
        address: app.address || 'Lagos, Nigeria',
        house: (app.house as any) || 'Blue House',
      },
      parent: {
        fatherName: app.fatherName || app.parentName || 'Father',
        motherName: app.motherName || 'Mother',
        occupation: app.occupation || 'Civil Servant',
        phone: app.parentPhone,
        email: app.parentEmail || 'parent@example.com',
        address: app.address || 'Lagos, Nigeria',
        emergencyContact: app.emergencyContact || app.parentPhone,
        relationship: 'Parent / Guardian',
      },
      previousSchool: app.prevSchool ? {
        name: app.prevSchool,
        lastClass: app.prevClass || '',
        transferReason: app.transferReason || '',
      } : undefined,
      documents: [
        { id: 'doc-1', title: 'Birth Certificate', type: 'Birth Certificate', url: '#', uploadDate: new Date().toISOString().split('T')[0] }
      ],
      currentGpa: 3.8,
      attendanceRate: 100,
      feeBalance: 195000,
    };

    onRegisterStudent(newStudentProfile);
    updateAppStatus(app.appNo, 'Admitted & Enrolled');
    setAdmittingApp(null);
  };

  // Filter Enrolled Students
  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.personal.surname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.personal.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.personal.admissionNo.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesClass = selectedClassFilter === 'All' || s.personal.className === selectedClassFilter;
    const matchesStatus = selectedStatusFilter === 'All' || s.personal.status === selectedStatusFilter;

    return matchesSearch && matchesClass && matchesStatus;
  });

  // Filter Prospective Applicants
  const filteredApplications = applications.filter((a) => {
    const matchesSearch =
      a.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.appNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.parentPhone.includes(searchTerm) ||
      (a.parentEmail && a.parentEmail.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesClass = selectedClassFilter === 'All' || a.targetClass === selectedClassFilter;
    const matchesStatus = selectedStatusFilter === 'All' || a.status.toLowerCase().includes(selectedStatusFilter.toLowerCase());

    return matchesSearch && matchesClass && matchesStatus;
  });

  const statusBadgeStyle = (status: StudentStatus) => {
    switch (status) {
      case 'active':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'graduated':
        return 'bg-blue-50 text-blue-800 border-blue-200';
      case 'transferred':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'suspended':
        return 'bg-rose-50 text-rose-800 border-rose-200';
      default:
        return 'bg-stone-100 text-stone-700 border-stone-200';
    }
  };

  const prospectiveStatusBadgeStyle = (status: string) => {
    if (status.includes('Admitted') || status.includes('Granted')) {
      return 'bg-emerald-50 text-emerald-800 border-emerald-200';
    }
    if (status.includes('Scheduled') || status.includes('Exam')) {
      return 'bg-blue-50 text-blue-800 border-blue-200';
    }
    if (status.includes('Review')) {
      return 'bg-amber-50 text-amber-800 border-amber-200';
    }
    if (status.includes('Declined') || status.includes('Rejected')) {
      return 'bg-rose-50 text-rose-800 border-rose-200';
    }
    return 'bg-stone-100 text-stone-700 border-stone-200';
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Module Title Header */}
      <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-serif text-2xl font-bold text-stone-900">Student Directory & Admissions</h2>
            <span className="px-2.5 py-0.5 bg-[#DFF6F0] text-[#0D5C52] text-[10px] font-bold rounded-full border border-[#6DD5C4]">
              2026/2027 Session
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Manage official enrolled student profiles, Nigerian admission numbers, and online prospective applicants.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onOpenAdmissionForm}
            className="bg-[#162825] hover:bg-[#203a36] text-white font-bold text-xs py-3 px-5 rounded-xl flex items-center gap-2 transition-all cursor-pointer shadow-md"
          >
            <UserPlus className="w-4 h-4 text-[#f5ded7]" />
            <span>Register New Student</span>
          </button>
        </div>
      </div>

      {/* Primary Tab View Switcher */}
      <div className="flex items-center p-1.5 bg-stone-100 rounded-2xl border border-stone-200 max-w-xl">
        <button
          onClick={() => setViewMode('enrolled')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
            viewMode === 'enrolled'
              ? 'bg-[#162825] text-white shadow-md'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
          }`}
        >
          <GraduationCap className="w-4 h-4 text-[#6DD5C4]" />
          <span>Enrolled Directory</span>
          <span className="ml-1 px-2 py-0.5 bg-white/20 text-white rounded-full text-[10px]">
            {students.length}
          </span>
        </button>

        <button
          onClick={() => setViewMode('prospective')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
            viewMode === 'prospective'
              ? 'bg-[#162825] text-white shadow-md'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
          }`}
        >
          <FileSpreadsheet className="w-4 h-4 text-[#6DD5C4]" />
          <span>Prospective Applicants</span>
          <span className="ml-1 px-2 py-0.5 bg-[#6DD5C4] text-[#162825] font-black rounded-full text-[10px]">
            {applications.length}
          </span>
        </button>
      </div>

      {/* VIEW MODE 1: ENROLLED STUDENTS DIRECTORY */}
      {viewMode === 'enrolled' && (
        <div className="space-y-6">
          {/* Filters Bar */}
          <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
              {/* Class Filter */}
              <div className="flex items-center gap-2 text-xs text-stone-600">
                <Filter className="w-3.5 h-3.5 text-stone-400" />
                <span className="font-semibold">Class:</span>
                <select
                  value={selectedClassFilter}
                  onChange={(e) => setSelectedClassFilter(e.target.value)}
                  className="bg-stone-50 border border-stone-200 rounded-lg py-1.5 px-3 text-xs font-semibold text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#162825]"
                >
                  <option value="All">All Classes</option>
                  <option value="Nursery 2">Nursery 2</option>
                  <option value="Primary 2">Primary 2</option>
                  <option value="Primary 5">Primary 5</option>
                  <option value="JSS3">JSS3</option>
                  <option value="SSS2">SSS2</option>
                </select>
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-2 text-xs text-stone-600">
                <span className="font-semibold">Status:</span>
                <select
                  value={selectedStatusFilter}
                  onChange={(e) => setSelectedStatusFilter(e.target.value)}
                  className="bg-stone-50 border border-stone-200 rounded-lg py-1.5 px-3 text-xs font-semibold text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#162825]"
                >
                  <option value="All">All Statuses</option>
                  <option value="active">Active</option>
                  <option value="graduated">Graduated</option>
                  <option value="transferred">Transferred</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>
            </div>

            <span className="text-xs font-bold text-stone-500">
              Showing <strong>{filteredStudents.length}</strong> of {students.length} Enrolled Students
            </span>
          </div>

          {/* Student List Table */}
          <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-stone-700">
                <thead className="bg-stone-50 text-stone-500 uppercase font-bold text-[10px] tracking-wider border-b border-stone-200">
                  <tr>
                    <th className="py-3.5 px-4">Student Name</th>
                    <th className="py-3.5 px-4">Admission Number</th>
                    <th className="py-3.5 px-4">Class & Arm</th>
                    <th className="py-3.5 px-4">Genotype / Blood</th>
                    <th className="py-3.5 px-4">Parent / Guardian</th>
                    <th className="py-3.5 px-4">Fee Balance</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {filteredStudents.map((stu) => (
                    <tr key={stu.id} className="hover:bg-stone-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-stone-900">
                        <div className="flex items-center gap-3">
                          <img
                            src={stu.personal.passportUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'}
                            alt={stu.personal.firstName}
                            className="w-9 h-9 rounded-full object-cover ring-2 ring-stone-100"
                          />
                          <div>
                            <p className="text-xs font-bold text-stone-900">
                              {stu.personal.surname}, {stu.personal.firstName} {stu.personal.middleName}
                            </p>
                            <p className="text-[10px] text-stone-400 font-normal">
                              {stu.personal.gender} • {stu.personal.age} Yrs • {stu.personal.stateOfOrigin} State
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-mono font-semibold text-stone-800">
                        <span className="bg-stone-100 px-2 py-1 rounded border border-stone-200">
                          {stu.personal.admissionNo}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-bold text-stone-800">{stu.personal.className}</span>{' '}
                        <span className="text-stone-500">({stu.personal.arm})</span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="text-[10px] font-bold bg-amber-50 text-amber-900 px-2 py-0.5 rounded border border-amber-200">
                          {stu.personal.genotype} / {stu.personal.bloodGroup}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <p className="font-bold text-stone-800">{stu.parent.fatherName || stu.parent.motherName}</p>
                        <p className="text-[10px] text-stone-500 font-mono">{stu.parent.phone}</p>
                      </td>

                      <td className="py-3.5 px-4 font-bold">
                        {stu.feeBalance > 0 ? (
                          <span className="text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                            {formatNaira(stu.feeBalance)}
                          </span>
                        ) : (
                          <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            Cleared ₦0
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border capitalize ${statusBadgeStyle(
                            stu.personal.status
                          )}`}
                        >
                          {stu.personal.status}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => onSelectStudent(stu)}
                          className="px-3 py-1.5 bg-[#162825] hover:bg-[#203a36] text-white font-bold text-[11px] rounded-lg transition-all cursor-pointer shadow-sm inline-flex items-center gap-1"
                        >
                          <Eye className="w-3 h-3 text-[#f5ded7]" />
                          <span>Profile</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* VIEW MODE 2: PROSPECTIVE ADMISSION APPLICANTS */}
      {viewMode === 'prospective' && (
        <div className="space-y-6">
          {/* Banner Notice */}
          <div className="p-5 bg-[#DFF6F0] rounded-2xl border border-[#6DD5C4] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#162825] text-[#6DD5C4] flex items-center justify-center shrink-0 mt-0.5">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <h3 className="font-bold text-sm text-[#162825]">
                  Online Admission Applications Portal
                </h3>
                <p className="text-xs text-stone-600">
                  Manage candidate applications submitted online. Verify applicant security PINs, update entrance examination schedules, and convert approved candidates into official enrolled students.
                </p>
              </div>
            </div>

            <div className="shrink-0 bg-white/80 px-3 py-1.5 rounded-xl border border-[#BEE8E0] text-right">
              <span className="text-[10px] text-stone-400 font-bold uppercase block">Total Applications</span>
              <span className="font-mono text-lg font-black text-[#162825]">{applications.length} Applicants</span>
            </div>
          </div>

          {/* Filters Bar */}
          <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
              <div className="flex items-center gap-2 text-xs text-stone-600">
                <Filter className="w-3.5 h-3.5 text-stone-400" />
                <span className="font-semibold">Target Class:</span>
                <select
                  value={selectedClassFilter}
                  onChange={(e) => setSelectedClassFilter(e.target.value)}
                  className="bg-stone-50 border border-stone-200 rounded-lg py-1.5 px-3 text-xs font-semibold text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#162825]"
                >
                  <option value="All">All Classes</option>
                  <option value="Primary 1">Primary 1</option>
                  <option value="JSS1">JSS1</option>
                  <option value="SSS1">SSS1</option>
                </select>
              </div>
            </div>

            <span className="text-xs font-bold text-stone-500">
              Showing <strong>{filteredApplications.length}</strong> of {applications.length} Prospective Applicants
            </span>
          </div>

          {/* Applications Table */}
          <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-stone-700">
                <thead className="bg-stone-50 text-stone-500 uppercase font-bold text-[10px] tracking-wider border-b border-stone-200">
                  <tr>
                    <th className="py-3.5 px-4">Applicant Name</th>
                    <th className="py-3.5 px-4">Tracking ID & Security PIN</th>
                    <th className="py-3.5 px-4">Target Class</th>
                    <th className="py-3.5 px-4">Parent / Guardian Contact</th>
                    <th className="py-3.5 px-4">Exam Schedule & Venue</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {filteredApplications.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-stone-400">
                        No prospective applications match your current filter criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredApplications.map((app) => (
                      <tr key={app.appNo} className="hover:bg-stone-50/80 transition-colors">
                        <td className="py-3.5 px-4 font-bold text-stone-900">
                          <div>
                            <p className="text-xs font-bold text-stone-900">{app.studentName}</p>
                            <p className="text-[10px] text-stone-400 font-normal">
                              {app.gender} • DOB: {app.dateOfBirth}
                            </p>
                          </div>
                        </td>

                        <td className="py-3.5 px-4 font-mono font-semibold text-stone-800">
                          <div className="space-y-0.5">
                            <span className="bg-stone-100 px-2 py-0.5 rounded border border-stone-200 text-xs font-bold text-[#162825] block w-fit">
                              {app.appNo}
                            </span>
                            <span className="text-[10px] text-[#0D5C52] font-mono flex items-center gap-1">
                              <KeyRound className="w-3 h-3 text-[#0D5C52]" />
                              <span>PIN: {app.securityPin}</span>
                            </span>
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          <span className="font-bold text-[#162825] bg-[#DFF6F0] px-2.5 py-1 rounded-lg border border-[#6DD5C4]">
                            {app.targetClass}
                          </span>
                        </td>

                        <td className="py-3.5 px-4">
                          <p className="font-bold text-stone-800">{app.parentName}</p>
                          <p className="text-[10px] text-stone-500 font-mono">{app.parentPhone}</p>
                          {app.parentEmail && (
                            <p className="text-[10px] text-stone-400">{app.parentEmail}</p>
                          )}
                        </td>

                        <td className="py-3.5 px-4">
                          {(() => {
                            const details = getDynamicScheduleInfo(app.status, app.examDate, app.venue);
                            return (
                              <div>
                                <p className="font-semibold text-stone-800 text-[11px]">{details.scheduleValue}</p>
                                <p className="text-[10px] text-stone-400">{details.venueValue}</p>
                              </div>
                            );
                          })()}
                        </td>

                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold border inline-block ${prospectiveStatusBadgeStyle(
                              app.status
                            )}`}
                          >
                            {app.status}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => setSelectedApp(app)}
                              className="px-2.5 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-[11px] rounded-lg transition-all cursor-pointer border border-stone-300 flex items-center gap-1"
                              title="View Full Application Details"
                            >
                              <Eye className="w-3.5 h-3.5 text-stone-600" />
                              <span>View</span>
                            </button>

                            <button
                              onClick={() => {
                                setEditingStatusApp(app);
                                setNewStatusValue(app.status);
                              }}
                              className="px-2.5 py-1.5 bg-[#DFF6F0] hover:bg-[#6DD5C4]/30 text-[#0D5C52] font-bold text-[11px] rounded-lg transition-all cursor-pointer border border-[#6DD5C4] flex items-center gap-1"
                              title="Update Application Status"
                            >
                              <Sparkles className="w-3.5 h-3.5 text-[#0D5C52]" />
                              <span>Status</span>
                            </button>

                            {onRegisterStudent && !app.status.includes('Enrolled') && (
                              <button
                                onClick={() => setAdmittingApp(app)}
                                className="px-2.5 py-1.5 bg-[#162825] hover:bg-[#203a36] text-[#6DD5C4] font-bold text-[11px] rounded-lg transition-all cursor-pointer flex items-center gap-1 shadow-xs"
                                title="Admit as Official Enrolled Student"
                              >
                                <UserCheck className="w-3.5 h-3.5" />
                                <span>Admit</span>
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 1: VIEW PROSPECTIVE APPLICATION DETAILS */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-5 border border-stone-200 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedApp(null)}
              className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-800 bg-stone-100 hover:bg-stone-200 rounded-full transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 border-b border-stone-100 pb-4">
              <div className="w-10 h-10 rounded-2xl bg-[#DFF6F0] text-[#0D5C52] flex items-center justify-center border border-[#6DD5C4]">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-stone-900">
                  Prospective Admission Details
                </h3>
                <p className="text-xs text-stone-500 font-mono">
                  {selectedApp.appNo} • PIN: {selectedApp.securityPin}
                </p>
              </div>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200 grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div>
                  <span className="text-[10px] font-bold text-stone-400 uppercase block">Candidate Name</span>
                  <span className="font-bold text-stone-900 text-sm">{selectedApp.studentName}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-stone-400 uppercase block">Target Class</span>
                  <span className="font-bold text-[#162825]">{selectedApp.targetClass}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-stone-400 uppercase block">Gender</span>
                  <span className="font-medium text-stone-800">{selectedApp.gender}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-stone-400 uppercase block">Date of Birth</span>
                  <span className="font-medium text-stone-800">{selectedApp.dateOfBirth} {selectedApp.age ? `(${selectedApp.age} yrs)` : ''}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-stone-400 uppercase block">Genotype / Blood</span>
                  <span className="font-medium text-stone-800">{selectedApp.genotype || 'AA'} / {selectedApp.bloodGroup || 'O+'}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-stone-400 uppercase block">State / LGA</span>
                  <span className="font-medium text-stone-800">{selectedApp.stateOfOrigin || 'N/A'}, {selectedApp.lga || ''}</span>
                </div>
              </div>

              <div className="p-3.5 bg-[#F4FAF8] rounded-2xl border border-[#BEE8E0] space-y-1.5">
                <span className="text-[10px] font-bold text-[#0D5C52] uppercase block">Parent / Guardian Information</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <p className="font-bold text-stone-900">Father: {selectedApp.fatherName || selectedApp.parentName}</p>
                  <p className="font-bold text-stone-900">Mother: {selectedApp.motherName || 'N/A'}</p>
                </div>
                <p className="font-mono text-stone-700">Phone: {selectedApp.parentPhone} {selectedApp.emergencyContact ? `(Emergency: ${selectedApp.emergencyContact})` : ''}</p>
                {selectedApp.parentEmail && <p className="text-stone-600">Email: {selectedApp.parentEmail}</p>}
                {selectedApp.occupation && <p className="text-stone-600">Occupation: {selectedApp.occupation}</p>}
                {selectedApp.address && <p className="text-stone-500 pt-1 border-t border-[#BEE8E0]">Address: {selectedApp.address}</p>}
              </div>

              {selectedApp.prevSchool && (
                <div className="p-3 bg-amber-50/70 rounded-2xl border border-amber-200/80 space-y-1 text-amber-950">
                  <span className="text-[10px] font-bold text-amber-800 uppercase block">Previous School History</span>
                  <p className="font-semibold">School: {selectedApp.prevSchool} {selectedApp.prevClass ? `(Last Class: ${selectedApp.prevClass})` : ''}</p>
                  {selectedApp.transferReason && <p className="text-stone-600 italic">Reason: {selectedApp.transferReason}</p>}
                </div>
              )}

              {(() => {
                const details = getDynamicScheduleInfo(selectedApp.status, selectedApp.examDate, selectedApp.venue);
                return (
                  <div className="p-3.5 bg-stone-900 text-white rounded-2xl space-y-1.5">
                    <span className="text-[10px] font-bold text-[#6DD5C4] uppercase block">{details.sectionTitle}</span>
                    <p><strong>Status:</strong> <span className="text-[#6DD5C4] font-bold">{selectedApp.status}</span></p>
                    <p><strong>{details.scheduleLabel}:</strong> {details.scheduleValue}</p>
                    <p><strong>{details.venueLabel}:</strong> {details.venueValue}</p>
                    {details.instructionNote && (
                      <p className="text-[10px] text-[#6DD5C4] pt-2 border-t border-stone-800 leading-relaxed">
                        💡 {details.instructionNote}
                      </p>
                    )}
                    <p className="text-[10px] text-stone-400 pt-1">Submitted: {new Date(selectedApp.submittedAt).toLocaleString()}</p>
                  </div>
                );
              })()}
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => {
                  setEditingStatusApp(selectedApp);
                  setNewStatusValue(selectedApp.status);
                  setSelectedApp(null);
                }}
                className="flex-1 py-2.5 bg-[#162825] text-white font-bold text-xs rounded-xl hover:bg-[#0D5C52] transition-colors cursor-pointer"
              >
                Update Application Status
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: UPDATE STATUS */}
      {editingStatusApp && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 border border-stone-200 shadow-2xl relative">
            <button
              onClick={() => setEditingStatusApp(null)}
              className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-800 bg-stone-100 hover:bg-stone-200 rounded-full transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <h3 className="font-serif text-lg font-bold text-stone-900">
                Update Status for {editingStatusApp.studentName}
              </h3>
              <p className="text-xs text-stone-500 font-mono">
                App ID: {editingStatusApp.appNo}
              </p>
            </div>

            <div className="space-y-3 text-xs">
              <label className="block font-bold text-stone-700">Select Application Status:</label>
              <select
                value={newStatusValue}
                onChange={(e) => setNewStatusValue(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#162825]"
              >
                <option value="Application Under Review">Application Under Review</option>
                <option value="Entrance Examination Scheduled">Entrance Examination Scheduled</option>
                <option value="Passed Examination - Interview Pending">Passed Examination - Interview Pending</option>
                <option value="Admission Granted - Pending Enrollment">Admission Granted - Pending Enrollment</option>
                <option value="Admitted & Enrolled">Admitted & Enrolled</option>
                <option value="Application Declined">Application Declined</option>
              </select>

              <button
                onClick={() => updateAppStatus(editingStatusApp.appNo, newStatusValue)}
                className="w-full py-3 bg-[#162825] text-white font-bold text-xs rounded-xl hover:bg-[#0D5C52] transition-colors cursor-pointer shadow-md"
              >
                Save Updated Status
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: ADMIT & ENROLL CANDIDATE INTO OFFICIAL STUDENTS */}
      {admittingApp && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 border border-[#BEE8E0] shadow-2xl relative">
            <button
              onClick={() => setAdmittingApp(null)}
              className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-800 bg-stone-100 hover:bg-stone-200 rounded-full transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#DFF6F0] text-[#0D5C52] flex items-center justify-center border border-[#6DD5C4]">
                <UserCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-[#162825]">
                  Admit & Enroll Candidate
                </h3>
                <p className="text-xs text-stone-500">
                  {admittingApp.studentName} ({admittingApp.targetClass})
                </p>
              </div>
            </div>

            <div className="space-y-3 text-xs bg-[#F4FAF8] p-4 rounded-2xl border border-[#BEE8E0]">
              <p className="text-stone-700">
                This action will automatically generate an official Nigerian school admission number for <strong>{admittingApp.studentName}</strong> and transfer their profile into the active enrolled directory.
              </p>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Assigned Class Arm *</label>
                <select
                  value={admitArm}
                  onChange={(e) => setAdmitArm(e.target.value)}
                  className="w-full px-3.5 py-2 bg-white border border-[#BEE8E0] rounded-xl text-xs font-bold text-[#162825] outline-none"
                >
                  <option value="Arm A">Arm A</option>
                  <option value="Arm B">Arm B</option>
                  <option value="Arm C">Arm C</option>
                </select>
              </div>

              <div className="p-3 bg-white rounded-xl border border-[#6DD5C4]/40 font-mono text-xs">
                <span className="text-[10px] text-stone-400 font-bold uppercase block">Generated Admission Number</span>
                <span className="font-bold text-[#162825] text-sm">
                  {generateAdmissionNumber('SCH', '2026', students.length + 1)}
                </span>
              </div>
            </div>

            <button
              onClick={() => handleEnrollApplicant(admittingApp)}
              className="w-full py-3 bg-[#162825] text-[#6DD5C4] font-bold text-xs rounded-xl hover:bg-[#0D5C52] transition-colors cursor-pointer shadow-md flex items-center justify-center gap-2"
            >
              <UserCheck className="w-4 h-4 text-[#6DD5C4]" />
              <span>Confirm Admission & Transfer to Directory</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
