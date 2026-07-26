import React, { useState, useEffect } from 'react';
import {
  CreditCard,
  Building2,
  CheckCircle2,
  X,
  Lock,
  Sparkles,
  Smartphone,
  ShieldCheck,
  AlertCircle,
  Receipt,
  ArrowRight,
  RefreshCw,
  FileText
} from 'lucide-react';
import { StudentProfile, PaymentRecord, PaymentMethod, Invoice } from '../../types';
import { formatNaira } from '../../utils/formatters';

interface PaymentGatewayModalProps {
  isOpen: boolean;
  onClose: () => void;
  students: StudentProfile[];
  invoices?: Invoice[];
  initialStudent?: StudentProfile;
  initialInvoice?: Invoice;
  onProcessPayment: (payment: PaymentRecord, invoiceId?: string) => void;
}

export const PaymentGatewayModal: React.FC<PaymentGatewayModalProps> = ({
  isOpen,
  onClose,
  students,
  invoices = [],
  initialStudent,
  initialInvoice,
  onProcessPayment,
}) => {
  if (!isOpen) return null;

  // Selected Student & Invoice
  const [selectedStudentId, setSelectedStudentId] = useState<string>(
    initialInvoice?.studentId || initialStudent?.id || students[0]?.id || ''
  );

  const activeStudent = students.find((s) => s.id === selectedStudentId) || students[0];
  
  // Find invoices for active student
  const studentInvoices = invoices.filter((inv) => inv.studentId === activeStudent?.id && inv.balance > 0);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string>(
    initialInvoice?.id || studentInvoices[0]?.id || ''
  );

  const activeInvoice = invoices.find((inv) => inv.id === selectedInvoiceId) || studentInvoices[0];

  const maxBalance = activeInvoice ? activeInvoice.balance : (activeStudent?.feeBalance || 120000);

  const [amountToPay, setAmountToPay] = useState<number>(maxBalance);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Paystack');
  const [verificationStage, setVerificationStage] = useState<number>(0); // 0 = Review, 1 = Gateway Processing, 2 = Gateway Verifying, 3 = Success
  const [verificationMessage, setVerificationMessage] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');

  // Reset when student or invoice changes
  useEffect(() => {
    const stuInvs = invoices.filter((inv) => inv.studentId === selectedStudentId && inv.balance > 0);
    if (stuInvs.length > 0) {
      setSelectedInvoiceId(stuInvs[0].id);
      setAmountToPay(stuInvs[0].balance);
    } else {
      setSelectedInvoiceId('');
      setAmountToPay(activeStudent?.feeBalance || 0);
    }
    setErrorMsg('');
  }, [selectedStudentId]);

  useEffect(() => {
    if (activeInvoice) {
      setAmountToPay(activeInvoice.balance);
    } else {
      setAmountToPay(activeStudent?.feeBalance || 0);
    }
    setErrorMsg('');
  }, [selectedInvoiceId]);

  // Handle Amount change & overpayment validation
  const handleAmountChange = (val: number) => {
    setAmountToPay(val);
    if (val > maxBalance) {
      setErrorMsg(`Overpayment prevented! Payment amount (${formatNaira(val)}) cannot exceed outstanding balance of ${formatNaira(maxBalance)}.`);
    } else if (val <= 0) {
      setErrorMsg('Please enter a valid payment amount greater than ₦0.');
    } else {
      setErrorMsg('');
    }
  };

  const handlePaySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amountToPay > maxBalance) {
      setErrorMsg(`Overpayment prevented! Amount exceeds outstanding balance of ${formatNaira(maxBalance)}.`);
      return;
    }
    if (amountToPay <= 0) {
      setErrorMsg('Payment amount must be greater than ₦0.');
      return;
    }

    // Step 1: Gateway Processing
    setVerificationStage(1);
    setVerificationMessage(`Connecting to ${paymentMethod} Gateway endpoint...`);

    setTimeout(() => {
      // Step 2: Gateway Verification
      setVerificationStage(2);
      setVerificationMessage(`Verifying 256-bit SSL transaction signature with ${paymentMethod}...`);

      setTimeout(() => {
        // Step 3: Success & Ledger Posting
        setVerificationStage(3);
        setVerificationMessage('Transaction Verified! Generating Receipt & Updating Wallet...');

        const remainingBal = Math.max(0, maxBalance - amountToPay);
        const receiptNo = `RCP/2026/0${Math.floor(100 + Math.random() * 900)}`;
        const txRef = paymentMethod === 'Paystack' 
          ? `PSTK-REF-${Math.floor(100000 + Math.random() * 900000)}`
          : paymentMethod === 'Flutterwave'
          ? `FLW-REF-${Math.floor(100000 + Math.random() * 900000)}`
          : `${paymentMethod.toUpperCase()}-REF-${Math.floor(100000 + Math.random() * 900000)}`;

        const newRecord: PaymentRecord = {
          id: `pay-${Date.now()}`,
          invoiceId: activeInvoice?.id,
          receiptNo,
          studentId: activeStudent.id,
          studentName: `${activeStudent.personal.surname} ${activeStudent.personal.firstName}`,
          admissionNo: activeStudent.personal.admissionNo,
          className: activeStudent.personal.className,
          amountPaid: Number(amountToPay),
          amountDue: maxBalance,
          remainingBalance: remainingBal,
          paymentMethod,
          transactionRef: txRef,
          paymentDate: new Date().toISOString().split('T')[0],
          session: activeInvoice?.session || '2026/2027',
          term: activeInvoice?.term || 'Third Term',
          approvedBy: paymentMethod === 'Paystack' || paymentMethod === 'Flutterwave' 
            ? `${paymentMethod} Automated Webhook Verifier` 
            : 'Mr. Babatunde Ogunleye (Bursar)',
          verifiedBy: paymentMethod === 'Paystack' 
            ? 'Paystack Automated Gateway' 
            : paymentMethod === 'Flutterwave' 
            ? 'Flutterwave Secured API' 
            : 'Bursary School Desk Terminal',
          status: 'Successful',
          feeCategory: activeInvoice ? `Invoice ${activeInvoice.invoiceNumber} Installment` : 'School Fee Payment',
        };

        onProcessPayment(newRecord, activeInvoice?.id);

        setTimeout(() => {
          setVerificationStage(0);
          onClose();
        }, 2500);
      }, 1500);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/65 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-stone-200 overflow-hidden flex flex-col my-auto max-h-[92vh]">
        {/* Gateway Header */}
        <div className="bg-[#162825] p-5 text-white flex items-center justify-between shrink-0">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-[#f5ded7] font-bold">
              <Lock className="w-3.5 h-3.5 text-emerald-400" /> 256-Bit SSL Secured Nigerian Gateway
            </div>
            <h4 className="font-serif text-lg font-bold mt-1">
              Paystack & Flutterwave Online Payment Portal
            </h4>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Verification Loading Screen */}
        {verificationStage === 1 || verificationStage === 2 ? (
          <div className="p-8 text-center space-y-6 my-auto">
            <div className="relative w-20 h-20 mx-auto">
              <div className="absolute inset-0 rounded-full border-4 border-stone-200 border-t-[#162825] animate-spin" />
              <div className="absolute inset-2 rounded-full border-4 border-emerald-100 border-b-emerald-600 animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <ShieldCheck className="w-8 h-8 text-[#162825]" />
              </div>
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1 rounded-full">
                Step {verificationStage} of 2: Gateway Verification
              </span>
              <h3 className="font-serif text-lg font-bold text-stone-900 mt-2">
                Processing {paymentMethod} Transaction
              </h3>
              <p className="text-xs text-stone-500 mt-1 max-w-xs mx-auto animate-pulse">
                {verificationMessage}
              </p>
            </div>

            <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 text-[11px] text-stone-600 font-mono">
              <p>Student: <strong>{activeStudent.personal.surname} {activeStudent.personal.firstName}</strong></p>
              <p>Amount: <strong>{formatNaira(amountToPay)}</strong></p>
            </div>
          </div>
        ) : verificationStage === 3 ? (
          <div className="p-8 text-center space-y-4 my-auto">
            <CheckCircle2 className="w-16 h-16 text-emerald-600 mx-auto animate-bounce" />
            <h3 className="font-serif text-xl font-bold text-stone-900">Payment Verified & Successful!</h3>
            <p className="text-xs text-stone-600">
              Transaction verified by gateway. Digital receipt issued & student fee balance updated.
            </p>

            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-left space-y-1.5 font-mono text-xs text-emerald-900">
              <div className="flex justify-between">
                <span>Amount Paid:</span>
                <span className="font-extrabold">{formatNaira(amountToPay)}</span>
              </div>
              <div className="flex justify-between">
                <span>Remaining Balance:</span>
                <span className="font-bold">{formatNaira(Math.max(0, maxBalance - amountToPay))}</span>
              </div>
              <div className="flex justify-between border-t border-emerald-200 pt-1 text-[11px] text-emerald-700">
                <span>Verified By:</span>
                <span>{paymentMethod} Gateway</span>
              </div>
            </div>
          </div>
        ) : (
          /* Main Payment Form */
          <form onSubmit={handlePaySubmit} className="p-5 sm:p-6 space-y-4 text-xs text-stone-800 overflow-y-auto custom-scrollbar">
            {/* Workflow Step Indicator */}
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 text-[10px] font-bold text-stone-500 uppercase tracking-wider">
              <span className="text-[#162825]">1. Review Outstanding Fees</span>
              <span>→</span>
              <span>2. Installment Amount</span>
              <span>→</span>
              <span>3. Gateway Verification</span>
            </div>

            {/* Student Ward Selection */}
            <div>
              <label className="block font-bold text-stone-800 mb-1">Select Student Ward *</label>
              <select
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value)}
                className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl font-bold text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#162825]"
              >
                {students.map((stu) => (
                  <option key={stu.id} value={stu.id}>
                    {stu.personal.surname} {stu.personal.firstName} ({stu.personal.admissionNo} - {stu.personal.className} • Balance: {formatNaira(stu.feeBalance)})
                  </option>
                ))}
              </select>
            </div>

            {/* Invoice Selector */}
            {studentInvoices.length > 0 ? (
              <div>
                <label className="block font-bold text-stone-800 mb-1">Select Outstanding Invoice *</label>
                <select
                  value={selectedInvoiceId}
                  onChange={(e) => setSelectedInvoiceId(e.target.value)}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl font-mono text-xs font-bold text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#162825]"
                >
                  {studentInvoices.map((inv) => (
                    <option key={inv.id} value={inv.id}>
                      {inv.invoiceNumber} - Total: {formatNaira(inv.totalAmount)} | Outstanding: {formatNaira(inv.balance)}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-stone-600 font-medium">
                No unpaid invoice found. Billing against student account balance: <strong>{formatNaira(activeStudent?.feeBalance || 0)}</strong>
              </div>
            )}

            {/* Invoice Summary Card */}
            {activeInvoice && (
              <div className="p-3.5 bg-emerald-50/60 rounded-2xl border border-emerald-200/80 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-emerald-900">
                  <span className="flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5 text-emerald-700" />
                    Invoice {activeInvoice.invoiceNumber} ({activeInvoice.session} {activeInvoice.term})
                  </span>
                  <span className="bg-emerald-200/80 text-emerald-900 px-2 py-0.5 rounded text-[10px]">
                    {activeInvoice.status}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-[11px] font-mono border-t border-emerald-200/60 pt-2">
                  <div>
                    <span className="text-[10px] text-stone-500 font-sans block">Total Invoice</span>
                    <strong className="text-stone-900">{formatNaira(activeInvoice.totalAmount)}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-500 font-sans block">Paid So Far</span>
                    <strong className="text-emerald-800">{formatNaira(activeInvoice.amountPaid)}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-500 font-sans block">Outstanding Bal</span>
                    <strong className="text-rose-700">{formatNaira(activeInvoice.balance)}</strong>
                  </div>
                </div>
              </div>
            )}

            {/* Installment Payment Amount & Quick Presets */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-bold text-stone-800">Enter Payment Amount (₦) *</label>
                <span className="text-[10px] text-stone-500">Max Due: {formatNaira(maxBalance)}</span>
              </div>
              <input
                type="number"
                required
                min={1000}
                max={maxBalance}
                value={amountToPay || ''}
                onChange={(e) => handleAmountChange(Number(e.target.value))}
                className={`w-full p-3 rounded-xl font-extrabold text-stone-900 text-base focus:outline-none focus:ring-2 ${
                  errorMsg ? 'bg-rose-50 border-2 border-rose-400 focus:ring-rose-200' : 'bg-stone-50 border border-stone-300 focus:ring-[#162825]'
                }`}
              />

              {/* Installment Presets */}
              <div className="flex items-center gap-1.5 mt-2 overflow-x-auto pb-1">
                <button
                  type="button"
                  onClick={() => handleAmountChange(maxBalance)}
                  className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg text-[10px] font-bold shrink-0 cursor-pointer"
                >
                  Full Balance ({formatNaira(maxBalance)})
                </button>
                <button
                  type="button"
                  onClick={() => handleAmountChange(Math.round(maxBalance / 2))}
                  className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg text-[10px] font-bold shrink-0 cursor-pointer"
                >
                  50% ({formatNaira(Math.round(maxBalance / 2))})
                </button>
                {maxBalance >= 30000 && (
                  <button
                    type="button"
                    onClick={() => handleAmountChange(30000)}
                    className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg text-[10px] font-bold shrink-0 cursor-pointer"
                  >
                    ₦30,000 Installment
                  </button>
                )}
                {maxBalance >= 20000 && (
                  <button
                    type="button"
                    onClick={() => handleAmountChange(20000)}
                    className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg text-[10px] font-bold shrink-0 cursor-pointer"
                  >
                    ₦20,000 Installment
                  </button>
                )}
              </div>

              {/* Real-time Validation Error or Balance Preview */}
              {errorMsg ? (
                <div className="mt-2 p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-[11px] font-semibold flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{errorMsg}</span>
                </div>
              ) : (
                <div className="mt-2 text-[11px] font-mono text-stone-500 flex justify-between px-1">
                  <span>Balance after payment:</span>
                  <span className="font-bold text-stone-900">{formatNaira(Math.max(0, maxBalance - amountToPay))}</span>
                </div>
              )}
            </div>

            {/* Select Payment Method (Online & Offline) */}
            <div>
              <label className="block font-bold text-stone-800 mb-1.5">Select Payment Method *</label>
              
              {/* Online Methods */}
              <p className="text-[10px] text-stone-400 font-bold uppercase mb-1">Online Gateway Channels</p>
              <div className="grid grid-cols-2 gap-2 mb-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('Paystack')}
                  className={`p-2.5 rounded-xl border flex items-center justify-center gap-2 font-bold transition-all cursor-pointer ${
                    paymentMethod === 'Paystack'
                      ? 'bg-[#162825] text-white border-[#162825] shadow-sm'
                      : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  <CreditCard className="w-4 h-4 text-emerald-400" />
                  <span>Paystack Gateway</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('Flutterwave')}
                  className={`p-2.5 rounded-xl border flex items-center justify-center gap-2 font-bold transition-all cursor-pointer ${
                    paymentMethod === 'Flutterwave'
                      ? 'bg-[#162825] text-white border-[#162825] shadow-sm'
                      : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Flutterwave Gateway</span>
                </button>
              </div>

              {/* Offline Methods */}
              <p className="text-[10px] text-stone-400 font-bold uppercase mb-1">Offline & Direct Channels</p>
              <div className="grid grid-cols-4 gap-1.5">
                {(['Bank Transfer', 'POS', 'Cash', 'Cheque'] as PaymentMethod[]).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setPaymentMethod(m)}
                    className={`py-2 px-1 rounded-xl border text-center font-bold text-[10px] transition-all cursor-pointer ${
                      paymentMethod === m
                        ? 'bg-[#162825] text-white border-[#162825]'
                        : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            {/* Gateway Details Box */}
            {(paymentMethod === 'Paystack' || paymentMethod === 'Flutterwave') && (
              <div className="p-3 bg-stone-50 border border-stone-200 rounded-2xl space-y-1.5 text-stone-600">
                <p className="text-[10px] font-bold text-stone-800 uppercase flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Simulated {paymentMethod} API Webhook & Verification
                </p>
                <p className="text-[11px] text-stone-500">
                  Card, Bank USSD (*737*, *901*), or Virtual Transfer account generated instantly with automated gateway verification callback.
                </p>
              </div>
            )}

            {paymentMethod === 'Bank Transfer' && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs space-y-1 text-emerald-900 font-mono">
                <p className="font-bold font-sans">Official School Virtual Account:</p>
                <p className="font-extrabold text-sm text-emerald-950">Providus Bank • 9921048821</p>
                <p className="text-[10px] text-emerald-700 font-sans">Account Name: Apex Royal College Fees Account</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!!errorMsg || amountToPay <= 0}
              className={`w-full py-3.5 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all shadow-md ${
                errorMsg || amountToPay <= 0
                  ? 'bg-stone-300 text-stone-500 cursor-not-allowed'
                  : 'bg-[#162825] hover:bg-[#203a36] text-[#f5ded7] cursor-pointer'
              }`}
            >
              <CreditCard className="w-4 h-4 text-[#f5ded7]" />
              <span>Proceed to Pay {formatNaira(amountToPay)} via {paymentMethod}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
