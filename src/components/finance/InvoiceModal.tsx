import React from 'react';
import {
  X,
  Printer,
  QrCode,
  CheckCircle2,
  Clock,
  AlertCircle,
  CreditCard,
  Building2,
  FileText,
  ShieldCheck,
  Receipt
} from 'lucide-react';
import { Invoice, PaymentRecord, SchoolSettings } from '../../types';
import { formatNaira } from '../../utils/formatters';

interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: Invoice;
  payments: PaymentRecord[];
  schoolSettings: SchoolSettings;
  onPayInvoice?: (invoice: Invoice) => void;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({
  isOpen,
  onClose,
  invoice,
  payments,
  schoolSettings,
  onPayInvoice,
}) => {
  if (!isOpen) return null;

  const invoicePayments = payments.filter((p) => p.invoiceId === invoice.id || p.studentId === invoice.studentId);

  const getStatusBadge = (status: Invoice['status']) => {
    switch (status) {
      case 'Paid':
        return (
          <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 border border-emerald-300 px-3 py-1 rounded-full text-xs font-bold">
            <CheckCircle2 className="w-3.5 h-3.5" /> Fully Paid
          </span>
        );
      case 'Partially Paid':
        return (
          <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 border border-amber-300 px-3 py-1 rounded-full text-xs font-bold">
            <Clock className="w-3.5 h-3.5" /> Partially Paid
          </span>
        );
      case 'Overdue':
        return (
          <span className="inline-flex items-center gap-1 bg-rose-100 text-rose-800 border border-rose-300 px-3 py-1 rounded-full text-xs font-bold">
            <AlertCircle className="w-3.5 h-3.5" /> Overdue
          </span>
        );
      case 'Cancelled':
        return (
          <span className="inline-flex items-center gap-1 bg-stone-100 text-stone-600 border border-stone-300 px-3 py-1 rounded-full text-xs font-bold">
            Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 border border-blue-300 px-3 py-1 rounded-full text-xs font-bold">
            Pending
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-stone-200 overflow-hidden flex flex-col my-auto max-h-[92vh]">
        {/* Top Header */}
        <div className="bg-[#162825] p-4 sm:p-5 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#f5ded7]" />
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-[#f5ded7] text-[#162825] px-2 py-0.5 rounded">
                Official School Fee Invoice
              </span>
              <h3 className="font-serif text-lg font-bold mt-0.5">{invoice.invoiceNumber}</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white cursor-pointer transition-colors"
            title="Close Invoice"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Invoice Printable Body */}
        <div className="p-5 sm:p-6 space-y-6 overflow-y-auto custom-scrollbar text-stone-800 text-xs">
          {/* School Header */}
          <div className="flex flex-col sm:flex-row items-start justify-between gap-4 pb-4 border-b border-stone-200">
            <div>
              <h2 className="font-serif text-xl font-bold text-stone-900 uppercase tracking-tight">
                {schoolSettings.schoolName}
              </h2>
              <p className="text-[11px] text-stone-500 mt-0.5">{schoolSettings.address}</p>
              <p className="text-[11px] text-stone-500">Tel: {schoolSettings.phone} | Email: {schoolSettings.email}</p>
            </div>
            <div className="text-left sm:text-right shrink-0">
              <div className="mb-2">{getStatusBadge(invoice.status)}</div>
              <p className="text-[11px] text-stone-500">Issued: <strong>{invoice.createdAt}</strong></p>
              <p className="text-[11px] text-stone-500">Due Date: <strong className="text-rose-700">{invoice.dueDate}</strong></p>
            </div>
          </div>

          {/* Student & Term Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-stone-50 rounded-2xl border border-stone-200">
            <div>
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Billed To (Student)</span>
              <p className="text-sm font-bold text-stone-900 mt-0.5">{invoice.studentName}</p>
              <p className="text-xs text-stone-600 font-mono mt-0.5">
                Admission No: <strong>{invoice.admissionNo}</strong>
              </p>
              <p className="text-xs text-stone-600">Class Level: <strong>{invoice.className}</strong></p>
            </div>

            <div>
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Academic Period</span>
              <p className="text-sm font-bold text-stone-900 mt-0.5">{invoice.session} ({invoice.term})</p>
              <p className="text-xs text-stone-600 mt-0.5">Bursary Office: {schoolSettings.bursarName}</p>
              <p className="text-xs text-stone-600">Currency: Nigerian Naira (NGN)</p>
            </div>
          </div>

          {/* Fee Breakdown Table */}
          <div>
            <h4 className="font-serif font-bold text-sm text-stone-900 mb-2">Itemized Fee Breakdown</h4>
            <div className="overflow-x-auto rounded-xl border border-stone-200">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-100 text-stone-600 font-bold uppercase text-[10px] border-b border-stone-200">
                  <tr>
                    <th className="py-2.5 px-3">Item #</th>
                    <th className="py-2.5 px-3">Description / Levy Title</th>
                    <th className="py-2.5 px-3 text-right">Amount (₦)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {invoice.items.map((item, idx) => (
                    <tr key={item.id || idx} className="hover:bg-stone-50">
                      <td className="py-2 px-3 font-mono text-stone-400">{idx + 1}</td>
                      <td className="py-2 px-3 font-medium text-stone-800">{item.title}</td>
                      <td className="py-2 px-3 text-right font-bold text-stone-900">{formatNaira(item.amount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Subtotal, Discounts, Total & Balance Summary */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-[#162825]/5 rounded-2xl border border-[#162825]/10">
            {/* Verification QR Code Graphic */}
            <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-stone-200 shadow-2xs">
              <div className="p-2 bg-stone-900 rounded-lg text-white">
                <QrCode className="w-8 h-8" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-stone-500 uppercase">Instant QR Verification</p>
                <p className="text-[10px] font-mono font-bold text-stone-800">{invoice.qrCodeData}</p>
                <span className="text-[9px] text-emerald-700 font-semibold flex items-center gap-0.5 mt-0.5">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" /> Authenticated by Apex SMIS
                </span>
              </div>
            </div>

            {/* Financial Summary */}
            <div className="w-full sm:w-auto space-y-1.5 text-right font-mono text-xs">
              <div className="flex justify-between sm:justify-end gap-6 text-stone-600">
                <span>Subtotal Fee:</span>
                <span className="font-bold">{formatNaira(invoice.subtotal)}</span>
              </div>

              {invoice.discountAmount > 0 && (
                <div className="flex justify-between sm:justify-end gap-6 text-emerald-700 font-semibold">
                  <span>Scholarship / Discount ({invoice.discountReason || 'Approved'}):</span>
                  <span>- {formatNaira(invoice.discountAmount)}</span>
                </div>
              )}

              <div className="flex justify-between sm:justify-end gap-6 text-stone-900 font-extrabold text-sm border-t border-stone-300 pt-1.5">
                <span>Total Net Fee:</span>
                <span>{formatNaira(invoice.totalAmount)}</span>
              </div>

              <div className="flex justify-between sm:justify-end gap-6 text-emerald-800 font-bold">
                <span>Total Amount Paid:</span>
                <span>{formatNaira(invoice.amountPaid)}</span>
              </div>

              <div className={`flex justify-between sm:justify-end gap-6 font-extrabold text-sm border-t border-stone-300 pt-1.5 ${
                invoice.balance > 0 ? 'text-rose-700' : 'text-emerald-700'
              }`}>
                <span>Outstanding Balance:</span>
                <span>{formatNaira(invoice.balance)}</span>
              </div>
            </div>
          </div>

          {/* Payment History / Installment Audit Ledger */}
          <div>
            <h4 className="font-serif font-bold text-sm text-stone-900 mb-2 flex items-center justify-between">
              <span>Installment Payment Audit History</span>
              <span className="text-[11px] font-sans font-normal text-stone-500">
                {invoicePayments.length} Payment Receipts Recorded
              </span>
            </h4>

            {invoicePayments.length === 0 ? (
              <div className="p-4 bg-stone-50 rounded-xl border border-dashed border-stone-300 text-center text-stone-500">
                No payments recorded yet for this invoice. Outstanding balance: <strong>{formatNaira(invoice.balance)}</strong>.
              </div>
            ) : (
              <div className="space-y-2">
                {invoicePayments.map((pmt) => (
                  <div
                    key={pmt.id}
                    className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-stone-900">{pmt.receiptNo}</span>
                        <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                          {pmt.paymentMethod}
                        </span>
                      </div>
                      <p className="text-[10px] text-stone-500 mt-0.5 font-mono">
                        Ref: {pmt.transactionRef} • Paid on: {pmt.paymentDate}
                      </p>
                      <p className="text-[10px] text-stone-400">Approved By: {pmt.approvedBy}</p>
                    </div>

                    <div className="text-left sm:text-right shrink-0">
                      <span className="text-sm font-extrabold text-emerald-800">{formatNaira(pmt.amountPaid)}</span>
                      <p className="text-[10px] text-stone-500">
                        Remaining Bal: {formatNaira(pmt.remainingBalance)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <button
            onClick={() => window.print()}
            className="w-full sm:w-auto px-4 py-2.5 bg-stone-800 hover:bg-stone-900 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print Invoice</span>
          </button>

          {invoice.balance > 0 && onPayInvoice && (
            <button
              onClick={() => {
                onClose();
                onPayInvoice(invoice);
              }}
              className="w-full sm:w-auto px-6 py-2.5 bg-[#162825] hover:bg-[#203a36] text-[#f5ded7] font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
            >
              <CreditCard className="w-4 h-4 text-[#f5ded7]" />
              <span>Proceed to Pay {formatNaira(invoice.balance)} Balance</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
