import React, { useState } from 'react';
import {
  RotateCcw,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  UserCheck,
  Send,
  X,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { RefundRecord, RefundStatus, StudentProfile, Invoice, PaymentRecord, AuditLog, Message } from '../../types';
import { formatNaira } from '../../utils/formatters';

interface RefundsTabProps {
  refunds: RefundRecord[];
  students: StudentProfile[];
  invoices: Invoice[];
  payments: PaymentRecord[];
  onAddRefund: (refund: RefundRecord) => void;
  onUpdateRefundStatus: (refundId: string, newStatus: RefundStatus, approvedBy: string, notes?: string) => void;
}

export const RefundsTab: React.FC<RefundsTabProps> = ({
  refunds,
  students,
  invoices,
  payments,
  onAddRefund,
  onUpdateRefundStatus,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [selectedRefundForView, setSelectedRefundForView] = useState<RefundRecord | null>(null);

  // Form State for New Refund Request
  const [studentId, setStudentId] = useState<string>(students[0]?.id || '');
  const [invoiceId, setInvoiceId] = useState<string>('');
  const [refundAmount, setRefundAmount] = useState<number>(10000);
  const [reason, setReason] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  const selectedStudent = students.find((s) => s.id === studentId) || students[0];

  const filteredRefunds = refunds.filter((r) => {
    const matchesSearch =
      r.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.refundNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.admissionNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.reason.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalRequested = refunds.reduce((sum, r) => sum + r.amount, 0);
  const totalProcessed = refunds
    .filter((r) => r.status === 'Refund Processed')
    .reduce((sum, r) => sum + r.amount, 0);
  const pendingCount = refunds.filter((r) => r.status !== 'Refund Processed' && r.status !== 'Rejected').length;

  const handleCreateRefundRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent || !reason) return;

    const matchedInvoice = invoices.find((inv) => inv.id === invoiceId);

    const newRefNo = `RFD/2026/${Math.floor(100 + Math.random() * 900)}`;

    const newRefund: RefundRecord = {
      id: `rfd-${Date.now()}`,
      refundNo: newRefNo,
      studentId: selectedStudent.id,
      studentName: `${selectedStudent.personal.firstName} ${selectedStudent.personal.surname}`,
      admissionNo: selectedStudent.academic.admissionNo,
      className: selectedStudent.academic.className,
      invoiceId: matchedInvoice?.id,
      invoiceNumber: matchedInvoice?.invoiceNumber,
      amount: Number(refundAmount),
      reason,
      requestedBy: 'Bursary Desk Officer',
      requestDate: new Date().toISOString().split('T')[0],
      status: 'Refund Request',
      notes,
      parentNotified: false,
    };

    onAddRefund(newRefund);
    setIsRequestModalOpen(false);
    setReason('');
    setNotes('');
  };

  const getStatusBadge = (status: RefundStatus) => {
    switch (status) {
      case 'Refund Processed':
        return (
          <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 px-2.5 py-0.5 rounded-full text-[10px] font-bold inline-flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Refund Processed
          </span>
        );
      case 'Approval':
        return (
          <span className="bg-blue-100 text-blue-800 border border-blue-300 px-2.5 py-0.5 rounded-full text-[10px] font-bold inline-flex items-center gap-1">
            <UserCheck className="w-3 h-3 text-blue-600" /> Approval Stage
          </span>
        );
      case 'Review':
        return (
          <span className="bg-amber-100 text-amber-800 border border-amber-300 px-2.5 py-0.5 rounded-full text-[10px] font-bold inline-flex items-center gap-1">
            <Clock className="w-3 h-3 text-amber-600" /> Under Review
          </span>
        );
      case 'Rejected':
        return (
          <span className="bg-stone-200 text-stone-700 border border-stone-300 px-2.5 py-0.5 rounded-full text-[10px] font-bold">
            Rejected
          </span>
        );
      default:
        return (
          <span className="bg-purple-100 text-purple-800 border border-purple-300 px-2.5 py-0.5 rounded-full text-[10px] font-bold inline-flex items-center gap-1">
            <RotateCcw className="w-3 h-3 text-purple-600" /> Refund Request
          </span>
        );
    }
  };

  const getNextStatus = (current: RefundStatus): RefundStatus | null => {
    if (current === 'Refund Request') return 'Review';
    if (current === 'Review') return 'Approval';
    if (current === 'Approval') return 'Refund Processed';
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Overview Cards & Trigger */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Total Refund Volume</span>
            <h3 className="font-serif text-2xl font-extrabold text-stone-900 mt-1">{formatNaira(totalRequested)}</h3>
            <p className="text-[11px] text-stone-500 mt-0.5">{refunds.length} Refund Cases Submitted</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-stone-100 text-stone-700 flex items-center justify-center">
            <RotateCcw className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">Disbursed & Processed</span>
            <h3 className="font-serif text-2xl font-extrabold text-emerald-800 mt-1">{formatNaira(totalProcessed)}</h3>
            <p className="text-[11px] text-emerald-700 font-semibold mt-0.5">Logged & Parent Notified</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600">Pending Workflow Cases</span>
            <h3 className="font-serif text-2xl font-extrabold text-amber-800 mt-1">{pendingCount} Active</h3>
            <p className="text-[11px] text-amber-700 font-medium mt-0.5">Awaiting Review / Approval</p>
          </div>
          <button
            onClick={() => setIsRequestModalOpen(true)}
            className="px-4 py-2 bg-[#162825] hover:bg-[#203a36] text-[#f5ded7] font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>New Request</span>
          </button>
        </div>
      </div>

      {/* Visual Workflow Steps Banner */}
      <div className="bg-stone-900 text-stone-100 p-5 rounded-3xl border border-stone-800 space-y-3">
        <span className="text-[10px] font-bold uppercase tracking-wider text-[#f5ded7]">
          4-Step Refund Compliance Workflow
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 bg-stone-800/80 rounded-2xl border border-stone-700/80 flex items-center justify-between">
            <div>
              <p className="font-bold text-[#f5ded7]">1. Refund Request</p>
              <p className="text-[10px] text-stone-400">Lodged by parent or bursar</p>
            </div>
            <ArrowRight className="w-4 h-4 text-stone-500 hidden sm:block" />
          </div>

          <div className="p-3 bg-stone-800/80 rounded-2xl border border-stone-700/80 flex items-center justify-between">
            <div>
              <p className="font-bold text-amber-300">2. Review</p>
              <p className="text-[10px] text-stone-400">Verified by Bursar Office</p>
            </div>
            <ArrowRight className="w-4 h-4 text-stone-500 hidden sm:block" />
          </div>

          <div className="p-3 bg-stone-800/80 rounded-2xl border border-stone-700/80 flex items-center justify-between">
            <div>
              <p className="font-bold text-blue-300">3. Approval</p>
              <p className="text-[10px] text-stone-400">Authorized by Principal</p>
            </div>
            <ArrowRight className="w-4 h-4 text-stone-500 hidden sm:block" />
          </div>

          <div className="p-3 bg-stone-800/80 rounded-2xl border border-stone-700/80">
            <p className="font-bold text-emerald-400">4. Refund Processed</p>
            <p className="text-[10px] text-stone-400">Payout + Parent Msg + Audit</p>
          </div>
        </div>
      </div>

      {/* Filter & Search Header */}
      <div className="bg-white p-4 rounded-3xl border border-stone-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full sm:w-auto">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search refund serial, student, reason..."
            className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#162825]"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="p-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-bold text-stone-700 focus:outline-none w-full sm:w-auto"
        >
          <option value="All">All Workflow States</option>
          <option value="Refund Request">1. Refund Request</option>
          <option value="Review">2. Review</option>
          <option value="Approval">3. Approval</option>
          <option value="Refund Processed">4. Refund Processed</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      {/* Refunds Table */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-stone-700">
            <thead className="bg-stone-50 text-stone-500 uppercase font-bold text-[10px] tracking-wider border-b border-stone-200">
              <tr>
                <th className="py-3.5 px-4">Refund Ref #</th>
                <th className="py-3.5 px-4">Student & Class</th>
                <th className="py-3.5 px-4">Amount (₦)</th>
                <th className="py-3.5 px-4">Reason</th>
                <th className="py-3.5 px-4">Current Workflow Stage</th>
                <th className="py-3.5 px-4">Dates</th>
                <th className="py-3.5 px-4 text-right">Workflow Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredRefunds.map((r) => {
                const nextStage = getNextStatus(r.status);
                return (
                  <tr key={r.id} className="hover:bg-stone-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-stone-900">{r.refundNo}</td>
                    <td className="py-3.5 px-4 font-bold text-stone-800">
                      <p>{r.studentName}</p>
                      <p className="text-[10px] text-stone-400 font-normal">{r.admissionNo} • {r.className}</p>
                    </td>
                    <td className="py-3.5 px-4 font-extrabold text-stone-900 text-xs">
                      {formatNaira(r.amount)}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-stone-700 max-w-xs truncate">
                      {r.reason}
                    </td>
                    <td className="py-3.5 px-4">{getStatusBadge(r.status)}</td>
                    <td className="py-3.5 px-4 text-stone-600 text-[11px]">
                      <p>Req: {r.requestDate}</p>
                      {r.refundDate && <p className="text-emerald-700 font-bold">Proc: {r.refundDate}</p>}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedRefundForView(r)}
                          className="px-2.5 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-[11px] rounded-lg cursor-pointer"
                        >
                          Details
                        </button>

                        {nextStage && (
                          <button
                            onClick={() =>
                              onUpdateRefundStatus(
                                r.id,
                                nextStage,
                                nextStage === 'Approval' ? 'Dr. Ayesha Khan (Principal)' : 'Mr. Babatunde Ogunleye (Bursar)',
                                'Workflow stage advanced via Bursary Portal'
                              )
                            }
                            className="px-2.5 py-1.5 bg-[#162825] hover:bg-[#203a36] text-[#f5ded7] font-bold text-[11px] rounded-lg cursor-pointer shadow-2xs flex items-center gap-1"
                          >
                            <span>Advance to {nextStage}</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Refund Request Modal */}
      {isRequestModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-stone-200 overflow-hidden flex flex-col my-auto">
            <div className="bg-[#162825] p-5 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <RotateCcw className="w-5 h-5 text-[#f5ded7]" />
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-[#f5ded7] text-[#162825] px-2 py-0.5 rounded">
                    Bursary Workflow
                  </span>
                  <h3 className="font-serif text-lg font-bold mt-0.5">Submit Refund Request</h3>
                </div>
              </div>
              <button
                onClick={() => setIsRequestModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateRefundRequest} className="p-6 space-y-4 text-xs text-stone-800">
              <div>
                <label className="block text-[10px] font-bold text-stone-500 uppercase mb-1">Select Student *</label>
                <select
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl font-bold"
                >
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.personal.surname} {s.personal.firstName} ({s.academic.admissionNo})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-stone-500 uppercase mb-1">Link to Invoice (Optional)</label>
                <select
                  value={invoiceId}
                  onChange={(e) => setInvoiceId(e.target.value)}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl font-medium"
                >
                  <option value="">-- None / General Overpayment --</option>
                  {invoices
                    .filter((inv) => inv.studentId === studentId)
                    .map((inv) => (
                      <option key={inv.id} value={inv.id}>
                        {inv.invoiceNumber} - Total: {formatNaira(inv.totalAmount)}
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-stone-500 uppercase mb-1">Refund Amount (₦) *</label>
                <input
                  type="number"
                  value={refundAmount}
                  onChange={(e) => setRefundAmount(Number(e.target.value))}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl font-bold text-base text-stone-900"
                  required
                  min={1000}
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-stone-500 uppercase mb-1">Reason for Refund *</label>
                <input
                  type="text"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="e.g. Duplicate bank transfer / Overpayment"
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl font-medium"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-stone-500 uppercase mb-1">Notes / Bank Details</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Parent account name, bank name and NUBAN account number..."
                  rows={2}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl font-medium"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#162825] hover:bg-[#203a36] text-[#f5ded7] font-bold rounded-xl transition-all cursor-pointer shadow-md"
              >
                Initiate Refund Request
              </button>
            </form>
          </div>
        </div>
      )}

      {/* View Refund Detail Drawer Modal */}
      {selectedRefundForView && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-stone-200 overflow-hidden flex flex-col my-auto">
            <div className="bg-[#162825] p-5 text-white flex items-center justify-between shrink-0">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-[#f5ded7] text-[#162825] px-2 py-0.5 rounded">
                  Refund Audit Trace
                </span>
                <h3 className="font-serif text-lg font-bold mt-0.5">{selectedRefundForView.refundNo}</h3>
              </div>
              <button
                onClick={() => setSelectedRefundForView(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs text-stone-800">
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
                <div className="flex justify-between">
                  <span className="text-stone-500 font-bold">Student Name:</span>
                  <span className="font-bold text-stone-900">{selectedRefundForView.studentName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500 font-bold">Admission Number:</span>
                  <span className="font-mono font-bold text-stone-900">{selectedRefundForView.admissionNo}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500 font-bold">Class Level:</span>
                  <span>{selectedRefundForView.className}</span>
                </div>
                <div className="flex justify-between text-sm font-bold pt-2 border-t border-stone-200">
                  <span>Refund Amount:</span>
                  <span className="text-emerald-800">{formatNaira(selectedRefundForView.amount)}</span>
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-[10px] font-bold uppercase text-stone-400">Reason & Notes</p>
                <p className="font-bold text-stone-800">{selectedRefundForView.reason}</p>
                {selectedRefundForView.notes && (
                  <p className="text-stone-600 bg-stone-100 p-2.5 rounded-xl border border-stone-200 font-mono text-[11px]">
                    {selectedRefundForView.notes}
                  </p>
                )}
              </div>

              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-1.5 text-[11px]">
                <p className="font-bold text-stone-700">Audit Trail:</p>
                <p className="text-stone-600">Lodged By: <strong>{selectedRefundForView.requestedBy}</strong> ({selectedRefundForView.requestDate})</p>
                {selectedRefundForView.reviewedBy && (
                  <p className="text-stone-600">Reviewed By: <strong>{selectedRefundForView.reviewedBy}</strong> ({selectedRefundForView.reviewDate || 'Done'})</p>
                )}
                {selectedRefundForView.approvedBy && (
                  <p className="text-stone-600">Approved By: <strong>{selectedRefundForView.approvedBy}</strong> ({selectedRefundForView.approvalDate || 'Done'})</p>
                )}
                {selectedRefundForView.refundDate && (
                  <p className="text-emerald-700 font-bold">Processed Date: {selectedRefundForView.refundDate}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
