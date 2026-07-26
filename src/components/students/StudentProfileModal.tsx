import React, { useState } from 'react';
import {
  X,
  User,
  HeartPulse,
  Users,
  FileSpreadsheet,
  FileText,
  CreditCard,
  Download,
  Calendar,
  Building,
  CheckCircle2
} from 'lucide-react';
import { StudentProfile } from '../../types';
import { formatNaira } from '../../utils/formatters';

interface StudentProfileModalProps {
  student: StudentProfile | null;
  onClose: () => void;
  onOpenReportCard: () => void;
}

export const StudentProfileModal: React.FC<StudentProfileModalProps> = ({
  student,
  onClose,
  onOpenReportCard,
}) => {
  if (!student) return null;

  const [activeTab, setActiveTab] = useState<'personal' | 'guardian' | 'documents' | 'history'>('personal');

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-[#162825] p-6 text-white relative flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img
              src={student.personal.passportUrl || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100'}
              alt={student.personal.firstName}
              className="w-16 h-16 rounded-2xl object-cover ring-4 ring-[#f5ded7]/30 shadow-md"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-[#f5ded7] text-[#162825] px-2 py-0.5 rounded">
                  {student.personal.className} ({student.personal.arm})
                </span>
                <span className="text-xs font-mono font-bold text-[#f5ded7]">
                  {student.personal.admissionNo}
                </span>
              </div>
              <h3 className="font-serif text-xl font-bold mt-1">
                {student.personal.surname}, {student.personal.firstName} {student.personal.middleName}
              </h3>
              <p className="text-xs text-[#a1beba] mt-0.5">
                Genotype: <strong className="text-white">{student.personal.genotype}</strong> • Blood: {student.personal.bloodGroup} • State: {student.personal.stateOfOrigin}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-stone-50 border-b border-stone-200 px-6 py-2.5 flex items-center gap-2 text-xs font-bold text-stone-600 overflow-x-auto">
          <button
            onClick={() => setActiveTab('personal')}
            className={`px-3.5 py-1.5 rounded-xl cursor-pointer transition-all ${
              activeTab === 'personal' ? 'bg-[#162825] text-white shadow-sm' : 'hover:bg-stone-200'
            }`}
          >
            Personal & Health
          </button>

          <button
            onClick={() => setActiveTab('guardian')}
            className={`px-3.5 py-1.5 rounded-xl cursor-pointer transition-all ${
              activeTab === 'guardian' ? 'bg-[#162825] text-white shadow-sm' : 'hover:bg-stone-200'
            }`}
          >
            Parent & Guardian
          </button>

          <button
            onClick={() => setActiveTab('documents')}
            className={`px-3.5 py-1.5 rounded-xl cursor-pointer transition-all ${
              activeTab === 'documents' ? 'bg-[#162825] text-white shadow-sm' : 'hover:bg-stone-200'
            }`}
          >
            Documents ({student.documents.length})
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`px-3.5 py-1.5 rounded-xl cursor-pointer transition-all ${
              activeTab === 'history' ? 'bg-[#162825] text-white shadow-sm' : 'hover:bg-stone-200'
            }`}
          >
            Academic Ledger
          </button>
        </div>

        {/* Tab Contents */}
        <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-4 text-xs text-stone-700">
          {activeTab === 'personal' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-stone-50 border border-stone-100">
                <div>
                  <span className="text-[10px] uppercase font-bold text-stone-400">Date of Birth</span>
                  <p className="font-bold text-stone-800 mt-0.5">{student.personal.dateOfBirth} ({student.personal.age} Yrs)</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-stone-400">Gender</span>
                  <p className="font-bold text-stone-800 mt-0.5">{student.personal.gender}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-stone-400">Religion</span>
                  <p className="font-bold text-stone-800 mt-0.5">{student.personal.religion}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-stone-400">Genotype</span>
                  <p className="font-extrabold text-amber-800 mt-0.5">{student.personal.genotype}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-stone-400">Blood Group</span>
                  <p className="font-extrabold text-stone-800 mt-0.5">{student.personal.bloodGroup}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-stone-400">House</span>
                  <p className="font-bold text-emerald-800 mt-0.5">{student.personal.house}</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-rose-50/60 border border-rose-100 space-y-1">
                <h5 className="font-bold text-rose-900 flex items-center gap-1.5">
                  <HeartPulse className="w-4 h-4 text-rose-600" />
                  Medical Profile & Disability Notes
                </h5>
                <p className="text-stone-700">Medical Conditions: <strong>{student.personal.medicalConditions || 'None Disclosed'}</strong></p>
                <p className="text-stone-700">Disability Status: <strong>{student.personal.disabilityStatus || 'None'}</strong></p>
              </div>

              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-100">
                <span className="text-[10px] uppercase font-bold text-stone-400">Residential Address</span>
                <p className="font-medium text-stone-800 mt-1">{student.personal.address}</p>
              </div>
            </div>
          )}

          {activeTab === 'guardian' && (
            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-100 space-y-2">
                <p className="text-stone-500 text-[10px] font-bold uppercase">Father / Sponsor</p>
                <h5 className="font-bold text-stone-900 text-sm">{student.parent.fatherName}</h5>
                <p className="text-stone-600">Occupation: {student.parent.occupation}</p>
                <p className="text-stone-800 font-mono font-bold">Phone: {student.parent.phone}</p>
                <p className="text-stone-600 font-mono">Email: {student.parent.email}</p>
              </div>

              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-100 space-y-2">
                <p className="text-stone-500 text-[10px] font-bold uppercase">Mother / Co-Sponsor</p>
                <h5 className="font-bold text-stone-900 text-sm">{student.parent.motherName}</h5>
                <p className="text-stone-600 font-mono">Emergency Contact: {student.parent.emergencyContact}</p>
              </div>
            </div>
          )}

          {activeTab === 'documents' && (
            <div className="space-y-2">
              {student.documents.map((doc) => (
                <div key={doc.id} className="p-3 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-between">
                  <div>
                    <h5 className="font-bold text-stone-800">{doc.title}</h5>
                    <p className="text-[10px] text-stone-400">Uploaded: {doc.uploadDate} • Verified Official Document</p>
                  </div>
                  <button className="px-3 py-1 bg-stone-200 hover:bg-stone-300 text-stone-800 font-bold rounded-lg text-[11px] flex items-center gap-1">
                    <Download className="w-3 h-3" /> View
                  </button>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex justify-between items-center">
                <div>
                  <p className="text-xs font-bold text-emerald-900">3rd Term Terminal Report Card</p>
                  <p className="text-[11px] text-emerald-700">GPA: {student.currentGpa} / 5.0 • Class Rank: 1st / 32</p>
                </div>
                <button
                  onClick={onOpenReportCard}
                  className="px-3.5 py-1.5 bg-[#162825] text-white font-bold rounded-xl text-xs flex items-center gap-1 cursor-pointer"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-[#f5ded7]" /> Open Report Card
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex justify-between items-center">
                <div>
                  <p className="text-xs font-bold text-stone-900">School Fees Balance</p>
                  <p className="text-xs text-stone-600">{formatNaira(student.feeBalance)} Outstanding</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
