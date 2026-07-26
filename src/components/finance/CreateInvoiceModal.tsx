import React, { useState } from 'react';
import { X, Plus, Trash2, FileText, Calendar, DollarSign, UserCheck, ShieldCheck } from 'lucide-react';
import { Invoice, StudentProfile, ClassName, FeeStructure } from '../../types';
import { formatNaira } from '../../utils/formatters';

interface CreateInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  students: StudentProfile[];
  feeStructures: FeeStructure[];
  onCreateInvoice: (invoice: Invoice) => void;
}

export const CreateInvoiceModal: React.FC<CreateInvoiceModalProps> = ({
  isOpen,
  onClose,
  students,
  feeStructures,
  onCreateInvoice,
}) => {
  const [studentId, setStudentId] = useState<string>(students[0]?.id || '');
  const [session, setSession] = useState<string>('2026/2027');
  const [term, setTerm] = useState<string>('Third Term');
  const [dueDate, setDueDate] = useState<string>('2026-08-15');
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [discountReason, setDiscountReason] = useState<string>('');

  const selectedStudent = students.find((s) => s.id === studentId) || students[0];

  const [items, setItems] = useState<{ id: string; title: string; amount: number }[]>([
    { id: '1', title: 'Tuition Fee', amount: 150000 },
    { id: '2', title: 'ICT & CBT Portal Access', amount: 25000 },
    { id: '3', title: 'PTA & Facilities Maintenance', amount: 20000 },
  ]);

  if (!isOpen) return null;

  // Auto-populate fee items based on student class if available
  const handleStudentChange = (id: string) => {
    setStudentId(id);
    const stu = students.find((s) => s.id === id);
    if (stu) {
      // Pick matching fee structure
      let levelFee = feeStructures.find((f) => f.level === 'senior_secondary');
      if (stu.academic.className.startsWith('Primary')) {
        levelFee = feeStructures.find((f) => f.level === 'primary');
      } else if (stu.academic.className.startsWith('JSS')) {
        levelFee = feeStructures.find((f) => f.level === 'junior_secondary');
      }

      if (levelFee) {
        setItems(
          levelFee.items.map((it, idx) => ({
            id: String(idx + 1),
            title: it.title,
            amount: it.amount,
          }))
        );
      }
    }
  };

  const handleAddItem = () => {
    setItems((prev) => [
      ...prev,
      { id: String(Date.now()), title: 'New Fee Levy', amount: 10000 },
    ]);
  };

  const handleRemoveItem = (id: string) => {
    if (items.length <= 1) return;
    setItems((prev) => prev.filter((it) => it.id !== id));
  };

  const handleItemChange = (id: string, field: 'title' | 'amount', value: string | number) => {
    setItems((prev) =>
      prev.map((it) => {
        if (it.id === id) {
          return { ...it, [field]: value };
        }
        return it;
      })
    );
  };

  const subtotal = items.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const totalAmount = Math.max(0, subtotal - Number(discountAmount || 0));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent) return;

    const randomInvNum = `INV/2026/${Math.floor(1000 + Math.random() * 9000)}`;

    const newInvoice: Invoice = {
      id: `inv-${Date.now()}`,
      invoiceNumber: randomInvNum,
      studentId: selectedStudent.id,
      studentName: `${selectedStudent.personal.firstName} ${selectedStudent.personal.surname}`,
      admissionNo: selectedStudent.academic.admissionNo,
      className: selectedStudent.academic.className as ClassName,
      session,
      term,
      items: items.map((it) => ({
        id: it.id,
        title: it.title,
        amount: Number(it.amount),
      })),
      subtotal,
      discountAmount: Number(discountAmount),
      discountReason: discountReason || undefined,
      totalAmount,
      amountPaid: 0,
      balance: totalAmount,
      dueDate,
      createdAt: new Date().toISOString().split('T')[0],
      status: 'Pending',
      qrCodeData: `${randomInvNum}-${selectedStudent.academic.admissionNo}-AUTHENTICATED`,
    };

    onCreateInvoice(newInvoice);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-stone-200 overflow-hidden flex flex-col my-auto max-h-[92vh]">
        {/* Header */}
        <div className="bg-[#162825] p-5 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#f5ded7]" />
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-[#f5ded7] text-[#162825] px-2 py-0.5 rounded">
                Bursary Billing Portal
              </span>
              <h3 className="font-serif text-lg font-bold mt-0.5">Generate Official Student Invoice</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto custom-scrollbar text-xs text-stone-800">
          {/* Student Selector */}
          <div>
            <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1">
              Select Student *
            </label>
            <select
              value={studentId}
              onChange={(e) => handleStudentChange(e.target.value)}
              className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-bold text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#162825]"
            >
              {students.map((stu) => (
                <option key={stu.id} value={stu.id}>
                  {stu.personal.surname} {stu.personal.firstName} ({stu.academic.admissionNo} • {stu.academic.className})
                </option>
              ))}
            </select>
          </div>

          {/* Academic Period & Due Date */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[10px] font-bold text-stone-500 uppercase mb-1">Session</label>
              <input
                type="text"
                value={session}
                onChange={(e) => setSession(e.target.value)}
                className="w-full p-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-bold"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-stone-500 uppercase mb-1">Term</label>
              <select
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                className="w-full p-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-bold"
              >
                <option value="First Term">First Term</option>
                <option value="Second Term">Second Term</option>
                <option value="Third Term">Third Term</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-stone-500 uppercase mb-1">Due Date</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full p-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-bold"
                required
              />
            </div>
          </div>

          {/* Itemized Fee Items */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-[11px] font-bold text-stone-700 uppercase tracking-wider">
                Itemized Fee Breakdown
              </label>
              <button
                type="button"
                onClick={handleAddItem}
                className="px-2.5 py-1 bg-[#162825]/10 hover:bg-[#162825]/20 text-[#162825] font-bold text-[10px] rounded-lg flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3 h-3" /> Add Levy Item
              </button>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {items.map((it) => (
                <div key={it.id} className="flex items-center gap-2 bg-stone-50 p-2.5 rounded-xl border border-stone-200">
                  <input
                    type="text"
                    value={it.title}
                    onChange={(e) => handleItemChange(it.id, 'title', e.target.value)}
                    placeholder="Fee Item Title"
                    className="flex-1 p-1.5 bg-white border border-stone-200 rounded-lg text-xs font-medium"
                    required
                  />
                  <div className="relative w-28">
                    <span className="absolute left-2 top-1/2 -translate-y-1/2 text-stone-400 font-bold">₦</span>
                    <input
                      type="number"
                      value={it.amount}
                      onChange={(e) => handleItemChange(it.id, 'amount', Number(e.target.value))}
                      placeholder="Amount"
                      className="w-full pl-6 pr-2 py-1.5 bg-white border border-stone-200 rounded-lg text-xs font-bold text-right"
                      required
                      min={0}
                    />
                  </div>
                  {items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(it.id)}
                      className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Discount / Scholarship Section */}
          <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold text-stone-500 uppercase mb-1">Scholarship / Discount (₦)</label>
              <input
                type="number"
                value={discountAmount}
                onChange={(e) => setDiscountAmount(Number(e.target.value))}
                className="w-full p-2 bg-white border border-stone-200 rounded-xl text-xs font-bold"
                min={0}
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-stone-500 uppercase mb-1">Discount Reason</label>
              <input
                type="text"
                value={discountReason}
                onChange={(e) => setDiscountReason(e.target.value)}
                placeholder="e.g. Sibling Waiver / Early Bird"
                className="w-full p-2 bg-white border border-stone-200 rounded-xl text-xs font-medium"
              />
            </div>
          </div>

          {/* Billing Summary Box */}
          <div className="p-4 bg-[#162825]/5 rounded-2xl border border-[#162825]/15 space-y-1.5 text-right font-mono">
            <div className="flex justify-between text-stone-600 text-xs">
              <span>Subtotal:</span>
              <span className="font-bold">{formatNaira(subtotal)}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-emerald-700 text-xs font-semibold">
                <span>Discount Applied:</span>
                <span>- {formatNaira(discountAmount)}</span>
              </div>
            )}
            <div className="flex justify-between text-stone-900 text-sm font-extrabold border-t border-stone-300 pt-1.5">
              <span>Total Net Invoice Amount:</span>
              <span>{formatNaira(totalAmount)}</span>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-[#162825] hover:bg-[#203a36] text-[#f5ded7] font-bold rounded-xl transition-all cursor-pointer shadow-md text-xs"
          >
            Issue & Save Official Invoice
          </button>
        </form>
      </div>
    </div>
  );
};
