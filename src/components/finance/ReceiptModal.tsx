import React from 'react';
import { X, Printer, Download, ShieldCheck, QrCode, Building2, Phone, Mail, MapPin } from 'lucide-react';
import { PaymentRecord, SchoolSettings } from '../../types';
import { formatNaira } from '../../utils/formatters';

interface ReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  receipt: PaymentRecord;
  schoolSettings: SchoolSettings;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({
  isOpen,
  onClose,
  receipt,
  schoolSettings,
}) => {
  if (!isOpen) return null;

  const handleDownloadPDF = () => {
    const receiptHtml = `
      <html>
        <head>
          <title>Receipt - ${receipt.receiptNo}</title>
          <style>
            body { font-family: sans-serif; padding: 20px; color: #111; }
            .header { text-align: center; border-bottom: 2px solid #162825; padding-bottom: 10px; margin-bottom: 20px; }
            .title { font-size: 20px; font-weight: bold; text-transform: uppercase; }
            .details { font-size: 13px; margin-bottom: 20px; line-height: 1.6; }
            .row { display: flex; justify-content: space-between; border-bottom: 1px border #eee; padding: 6px 0; }
            .total { font-size: 16px; font-weight: bold; color: #162825; margin-top: 10px; }
            .footer { text-align: center; margin-top: 30px; font-size: 10px; color: #666; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="title">${schoolSettings.schoolName}</div>
            <p>${schoolSettings.address}</p>
            <p>Tel: ${schoolSettings.phone} | Email: ${schoolSettings.email}</p>
            <h3 style="margin-top:10px; color:#162825;">OFFICIAL PAYMENT RECEIPT: ${receipt.receiptNo}</h3>
          </div>
          <div class="details">
            <div class="row"><span>Student Name:</span> <strong>${receipt.studentName}</strong></div>
            <div class="row"><span>Admission Number:</span> <strong>${receipt.admissionNo}</strong></div>
            <div class="row"><span>Class Level:</span> <strong>${receipt.className}</strong></div>
            <div class="row"><span>Session / Term:</span> <strong>${receipt.session} (${receipt.term})</strong></div>
            <div class="row"><span>Fee Category:</span> <strong>${receipt.feeCategory}</strong></div>
            <div class="row"><span>Payment Method:</span> <strong>${receipt.paymentMethod}</strong></div>
            <div class="row"><span>Transaction Reference:</span> <strong>${receipt.transactionRef}</strong></div>
            <div class="row"><span>Payment Date:</span> <strong>${receipt.paymentDate}</strong></div>
            <div class="row"><span>Cashier / Verifier:</span> <strong>${receipt.approvedBy || receipt.verifiedBy}</strong></div>
            <div class="row total"><span>Amount Paid:</span> <strong>${formatNaira(receipt.amountPaid)}</strong></div>
            <div class="row"><span>Remaining Balance:</span> <strong>${formatNaira(receipt.remainingBalance ?? 0)}</strong></div>
          </div>
          <div class="footer">
            <p>QR Code Verification Hash: ${receipt.receiptNo}-${receipt.transactionRef}-VERIFIED</p>
            <p>Thank you for your prompt fee payment. Apex Royal College Bursary Office.</p>
          </div>
        </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(receiptHtml);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
      }, 500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-stone-200 overflow-hidden flex flex-col my-auto max-h-[92vh]">
        {/* Top Header */}
        <div className="bg-[#162825] p-5 text-white flex items-center justify-between shrink-0">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-[#f5ded7] text-[#162825] px-2.5 py-0.5 rounded-full">
              Official School Fee Receipt
            </span>
            <h3 className="font-serif text-lg font-bold mt-1">{receipt.receiptNo}</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Printable Receipt Body */}
        <div className="p-6 space-y-5 text-xs text-stone-800 overflow-y-auto custom-scrollbar">
          {/* School Contact Information Header with Logo */}
          <div className="text-center border-b border-stone-200 pb-4 space-y-1">
            {schoolSettings.logoUrl ? (
              <img
                src={schoolSettings.logoUrl}
                alt="School Emblem"
                className="w-12 h-12 mx-auto rounded-full object-cover ring-2 ring-[#162825]/20 mb-2"
              />
            ) : (
              <div className="w-12 h-12 mx-auto rounded-full bg-[#162825] text-white flex items-center justify-center font-serif text-xl font-bold mb-2">
                A
              </div>
            )}
            <h2 className="font-serif text-lg font-bold text-stone-900 uppercase tracking-tight">
              {schoolSettings.schoolName}
            </h2>
            <p className="text-[11px] text-stone-500 flex items-center justify-center gap-1">
              <MapPin className="w-3 h-3 text-stone-400" /> {schoolSettings.address}
            </p>
            <p className="text-[11px] text-stone-500 flex items-center justify-center gap-3">
              <span className="flex items-center gap-1"><Phone className="w-3 h-3 text-stone-400" /> {schoolSettings.phone}</span>
              <span className="flex items-center gap-1"><Mail className="w-3 h-3 text-stone-400" /> {schoolSettings.email}</span>
            </p>
            <p className="text-[10px] text-emerald-800 font-bold bg-emerald-50 border border-emerald-200 py-1 px-3 rounded-full inline-flex items-center gap-1 mt-2">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> STATUS: PAYMENT VERIFIED & POSTED TO BURSER LEDGER
            </p>
          </div>

          {/* Student & Payment Breakdown */}
          <div className="space-y-2 font-mono text-[11px]">
            <div className="flex justify-between py-1 border-b border-stone-100">
              <span className="text-stone-500 font-sans">Receipt Number:</span>
              <span className="font-bold text-stone-900">{receipt.receiptNo}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-stone-100">
              <span className="text-stone-500 font-sans">Student Name:</span>
              <span className="font-bold text-stone-900">{receipt.studentName}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-stone-100">
              <span className="text-stone-500 font-sans">Admission Number:</span>
              <span className="font-bold text-stone-900">{receipt.admissionNo}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-stone-100">
              <span className="text-stone-500 font-sans">Class Level:</span>
              <span>{receipt.className}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-stone-100">
              <span className="text-stone-500 font-sans">Fee Category:</span>
              <span>{receipt.feeCategory}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-stone-100">
              <span className="text-stone-500 font-sans">Payment Method:</span>
              <span className="font-bold text-emerald-800">{receipt.paymentMethod}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-stone-100">
              <span className="text-stone-500 font-sans">Payment Date:</span>
              <span>{receipt.paymentDate}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-stone-100">
              <span className="text-stone-500 font-sans">Transaction Reference:</span>
              <span>{receipt.transactionRef}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-stone-100">
              <span className="text-stone-500 font-sans">Cashier / Verifier:</span>
              <span className="font-bold">{receipt.approvedBy || receipt.verifiedBy}</span>
            </div>
            <div className="flex justify-between border-t border-stone-300 pt-2 text-sm font-bold">
              <span className="font-sans">Amount Paid:</span>
              <span className="text-emerald-800">{formatNaira(receipt.amountPaid)}</span>
            </div>
            <div className="flex justify-between text-xs font-bold text-stone-600">
              <span className="font-sans">Remaining Fee Balance:</span>
              <span className={receipt.remainingBalance > 0 ? 'text-rose-700' : 'text-emerald-700'}>
                {formatNaira(receipt.remainingBalance ?? 0)}
              </span>
            </div>
          </div>

          {/* Verification QR Code */}
          <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200 flex items-center gap-3">
            <div className="p-2 bg-stone-900 text-white rounded-xl">
              <QrCode className="w-8 h-8" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-stone-500 uppercase">Verification Hash</p>
              <p className="text-[10px] font-mono font-bold text-stone-800">
                {receipt.receiptNo}-{receipt.transactionRef}-AUTHENTICATED
              </p>
              <p className="text-[9px] text-emerald-700 font-semibold mt-0.5">
                Authentic electronic receipt generated by Apex SMIS
              </p>
            </div>
          </div>

          {/* Action Buttons: Download PDF & Print */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              onClick={handleDownloadPDF}
              className="py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
            >
              <Download className="w-4 h-4" /> Download PDF
            </button>
            <button
              onClick={() => window.print()}
              className="py-2.5 bg-[#162825] hover:bg-[#203a36] text-[#f5ded7] font-bold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition-colors shadow-md"
            >
              <Printer className="w-4 h-4" /> Print Receipt
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
