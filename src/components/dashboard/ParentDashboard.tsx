import React, { useState } from 'react';
import {
  Users,
  Receipt,
  FileSpreadsheet,
  Download,
  CreditCard,
  MessageSquare,
  CheckCircle2,
  Calendar,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { User, StudentProfile, ReportCard, PaymentRecord, Invoice } from '../../types';
import { formatNaira } from '../../utils/formatters';

interface ParentDashboardProps {
  currentUser: User;
  students: StudentProfile[];
  reportCards: ReportCard[];
  payments: PaymentRecord[];
  invoices?: Invoice[];
  onNavigate: (tab: string) => void;
  onOpenPaymentModal: (student: StudentProfile, invoice?: Invoice) => void;
}

export const ParentDashboard: React.FC<ParentDashboardProps> = ({
  currentUser,
  students,
  reportCards,
  payments,
  invoices = [],
  onNavigate,
  onOpenPaymentModal,
}) => {
  // Filter children associated with parent
  const parentChildren = students.filter((s) =>
    currentUser.associatedStudentIds?.includes(s.id)
  ) || [students[0]];

  const [selectedChildId, setSelectedChildId] = useState<string>(
    parentChildren[0]?.id || students[0].id
  );

  const activeChild = students.find((s) => s.id === selectedChildId) || students[0];
  const activeReport = reportCards.find((r) => r.studentId === activeChild.id);
  const childPayments = payments.filter((p) => p.studentId === activeChild.id);

  return (
    <div className="space-y-6 pb-12">
      {/* Parent Banner */}
      <div className="bg-[#162825] text-white rounded-3xl p-6 shadow-xl border border-[#23423d] flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider bg-[#f5ded7] text-[#162825] px-2.5 py-0.5 rounded-full">
            Parent & Guardian Portal
          </span>
          <h3 className="font-serif text-2xl font-bold mt-1.5">{currentUser.name}</h3>
          <p className="text-xs text-[#a1beba] mt-0.5">
            Registered Children: <strong className="text-white">{parentChildren.length} Wards Enrolled</strong> at Apex Royal College
          </p>
        </div>

        {/* Child Selector Tabs */}
        <div className="flex items-center gap-2 bg-[#12221f] p-1.5 rounded-2xl border border-[#23423d]">
          {parentChildren.map((child) => (
            <button
              key={child.id}
              onClick={() => setSelectedChildId(child.id)}
              className={`flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedChildId === child.id
                  ? 'bg-[#f5ded7] text-[#162825] shadow-sm'
                  : 'text-[#8ea8a2] hover:text-white hover:bg-[#1a322d]'
              }`}
            >
              <img
                src={child.personal.passportUrl}
                alt={child.personal.firstName}
                className="w-5 h-5 rounded-full object-cover"
              />
              <span>{child.personal.firstName} ({child.personal.className})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Selected Child Detail Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Child Profile & Academics */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-stone-100">
            <div className="flex items-center gap-4">
              <img
                src={activeChild.personal.passportUrl}
                alt={activeChild.personal.firstName}
                className="w-16 h-16 rounded-2xl object-cover ring-4 ring-emerald-50 border border-stone-200 shadow-sm"
              />
              <div>
                <h4 className="font-serif text-xl font-bold text-stone-900">
                  {activeChild.personal.surname} {activeChild.personal.firstName} {activeChild.personal.middleName}
                </h4>
                <p className="text-xs text-stone-500 font-mono mt-0.5">
                  Admission No: <strong className="text-stone-800">{activeChild.personal.admissionNo}</strong> • {activeChild.personal.className} ({activeChild.personal.arm})
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-[10px] font-bold bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded border border-emerald-200">
                    House: {activeChild.personal.house}
                  </span>
                  <span className="text-[10px] font-bold bg-stone-100 text-stone-700 px-2 py-0.5 rounded border border-stone-200">
                    Genotype: {activeChild.personal.genotype} | Blood Group: {activeChild.personal.bloodGroup}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onNavigate('results')}
              className="bg-[#162825] hover:bg-[#203a36] text-white font-bold text-xs py-2.5 px-4 rounded-xl flex items-center gap-2 transition-all cursor-pointer shadow-sm"
            >
              <FileSpreadsheet className="w-4 h-4 text-[#f5ded7]" />
              <span>View Terminal Report Card</span>
            </button>
          </div>

          {/* Performance Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-100">
              <p className="text-xs text-stone-500 font-medium">Terminal Position</p>
              <h5 className="text-2xl font-extrabold text-stone-900 mt-1">
                {activeReport?.positionInClass || '1st'} <span className="text-xs font-normal text-stone-500">out of {activeReport?.totalStudentsInClass || 32}</span>
              </h5>
              <p className="text-[10px] text-emerald-700 font-semibold mt-1">GPA: {activeChild.currentGpa} / 5.0</p>
            </div>

            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-100">
              <p className="text-xs text-stone-500 font-medium">Attendance Rate</p>
              <h5 className="text-2xl font-extrabold text-emerald-700 mt-1">{activeChild.attendanceRate}%</h5>
              <p className="text-[10px] text-stone-500 mt-1">64 Days Present / 65 Days Opened</p>
            </div>

            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-100">
              <p className="text-xs text-stone-500 font-medium">Outstanding Fees</p>
              <h5 className={`text-2xl font-extrabold mt-1 ${activeChild.feeBalance > 0 ? 'text-rose-700' : 'text-emerald-700'}`}>
                {formatNaira(activeChild.feeBalance)}
              </h5>
              <p className="text-[10px] text-stone-500 mt-1">
                {activeChild.feeBalance > 0 ? 'Payment Due Immediately' : 'All Fees Paid in Full ✓'}
              </p>
            </div>
          </div>

          {/* Recent Subject Scores Table */}
          {activeReport && (
            <div>
              <h5 className="text-xs font-bold text-stone-800 uppercase tracking-wider mb-2">3rd Term Subject Score Summary</h5>
              <div className="overflow-x-auto rounded-2xl border border-stone-200">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-50 text-stone-500 uppercase font-bold text-[10px]">
                    <tr>
                      <th className="py-2.5 px-3">Subject</th>
                      <th className="py-2.5 px-3">CA Total (40%)</th>
                      <th className="py-2.5 px-3">Exam (60%)</th>
                      <th className="py-2.5 px-3">Total Score</th>
                      <th className="py-2.5 px-3">Grade</th>
                      <th className="py-2.5 px-3">Remarks</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {activeReport.scores.map((s) => (
                      <tr key={s.subjectId}>
                        <td className="py-2.5 px-3 font-bold text-stone-800">{s.subjectName}</td>
                        <td className="py-2.5 px-3 font-semibold">{s.ca1 + s.ca2 + s.midTerm + s.project} / 40</td>
                        <td className="py-2.5 px-3 font-semibold">{s.exam} / 60</td>
                        <td className="py-2.5 px-3 font-extrabold text-stone-900">{s.total} / 100</td>
                        <td className="py-2.5 px-3">
                          <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                            s.grade === 'A' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                          }`}>
                            {s.grade}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-stone-600">{s.remarks}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Fee Payment & Receipt Actions */}
        <div className="lg:col-span-4 space-y-5">
          {/* Fee Payment Card */}
          <div className="bg-[#162825] text-white p-6 rounded-3xl border border-[#23423d] shadow-lg flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-[#23423d]">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-[#f5ded7] text-[#162825] px-2.5 py-0.5 rounded-full">
                  Paystack / Flutterwave Portal
                </span>
                <Receipt className="w-4 h-4 text-[#f5ded7]" />
              </div>

              <div className="my-4">
                <p className="text-xs text-[#8ea8a2]">Outstanding Fees for {activeChild.personal.firstName}:</p>
                <h3 className="font-serif text-3xl font-bold text-white mt-1">
                  {formatNaira(activeChild.feeBalance)}
                </h3>
              </div>

              {/* Outstanding Invoices List for Child */}
              {(() => {
                const childInvs = invoices.filter((inv) => inv.studentId === activeChild.id && inv.balance > 0);
                if (childInvs.length > 0) {
                  return (
                    <div className="space-y-2 mb-4 bg-[#12221f] p-3 rounded-2xl border border-[#23423d]">
                      <span className="text-[10px] font-bold text-[#8ea8a2] uppercase">Active Fee Invoice</span>
                      {childInvs.map((inv) => (
                        <div key={inv.id} className="flex items-center justify-between text-xs pt-1 border-t border-[#1a322d]">
                          <div>
                            <p className="font-mono font-bold text-[#f5ded7]">{inv.invoiceNumber}</p>
                            <p className="text-[10px] text-[#a1beba]">{inv.term}</p>
                          </div>
                          <span className="font-bold text-emerald-400">{formatNaira(inv.balance)}</span>
                        </div>
                      ))}
                    </div>
                  );
                }
                return null;
              })()}

              <p className="text-xs text-[#a1beba] leading-relaxed">
                Step-by-step verified online payment workflow with instant receipt issuance and wallet credit.
              </p>
            </div>

            <div className="mt-6 space-y-2">
              <button
                onClick={() => onOpenPaymentModal(activeChild)}
                className="w-full py-3 bg-[#f5ded7] hover:bg-white text-[#162825] font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
              >
                <CreditCard className="w-4 h-4" />
                <span>Review Invoice & Pay Online</span>
              </button>

              <button
                onClick={() => onNavigate('finance')}
                className="w-full py-2.5 bg-[#23423d] hover:bg-[#2d4e48] text-stone-200 font-semibold text-xs rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <span>View All Invoices & Receipts</span>
              </button>
            </div>
          </div>

          {/* Quick Contact Form Teacher */}
          <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-sm">
            <h5 className="text-xs font-bold text-stone-800 uppercase tracking-wider mb-2">Class Form Teacher</h5>
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-stone-50 border border-stone-100">
              <div className="w-10 h-10 rounded-full bg-[#162825] text-[#f5ded7] font-bold flex items-center justify-center text-xs">
                CO
              </div>
              <div>
                <p className="text-xs font-bold text-stone-900">Mrs. Chidimma Okeke</p>
                <p className="text-[11px] text-stone-500">General Mathematics & Form Teacher</p>
              </div>
            </div>
            <button
              onClick={() => onNavigate('communication')}
              className="mt-3 w-full py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5 text-stone-600" />
              <span>Send Private Message</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
