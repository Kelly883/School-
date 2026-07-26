import React, { useState } from 'react';
import {
  Receipt,
  Search,
  CreditCard,
  Printer,
  CheckCircle2,
  X,
  PlusCircle,
  Building2,
  Clock,
  ArrowUpRight,
  FileText,
  Filter,
  AlertCircle,
  Eye,
  QrCode,
  ShieldCheck,
  TrendingUp,
  Download,
  RotateCcw,
  LayoutDashboard,
  Plus,
  BellRing,
  BarChart3
} from 'lucide-react';
import {
  PaymentRecord,
  StudentProfile,
  SchoolSettings,
  Invoice,
  InvoiceStatus,
  RefundRecord,
  RefundStatus,
  FeeStructure,
  ExpenseRecord,
  OverdueAlertLog
} from '../../types';
import { formatNaira } from '../../utils/formatters';
import { InvoiceModal } from './InvoiceModal';
import { ReceiptModal } from './ReceiptModal';
import { CreateInvoiceModal } from './CreateInvoiceModal';
import { RefundsTab } from './RefundsTab';
import { FinancialDashboard } from './FinancialDashboard';
import { OverdueAlertsTab } from './OverdueAlertsTab';
import { FinancialReportsTab } from './FinancialReportsTab';

interface FeePaymentsProps {
  payments: PaymentRecord[];
  invoices?: Invoice[];
  students: StudentProfile[];
  schoolSettings: SchoolSettings;
  refunds?: RefundRecord[];
  feeStructures?: FeeStructure[];
  expenses?: ExpenseRecord[];
  overdueAlerts?: OverdueAlertLog[];
  onOpenPaymentModal: (student?: StudentProfile, invoice?: Invoice) => void;
  onCreateInvoice?: (invoice: Invoice) => void;
  onAddRefund?: (refund: RefundRecord) => void;
  onUpdateRefundStatus?: (refundId: string, newStatus: RefundStatus, approvedBy: string, notes?: string) => void;
  onTriggerOverdueAlerts?: (
    selectedInvoiceIds: string[],
    channel: 'Email' | 'SMS' | 'Both' | 'Portal Message',
    customTemplate?: string
  ) => void;
}

export const FeePayments: React.FC<FeePaymentsProps> = ({
  payments,
  invoices = [],
  students,
  schoolSettings,
  refunds = [],
  feeStructures = [],
  expenses = [],
  overdueAlerts = [],
  onOpenPaymentModal,
  onCreateInvoice,
  onAddRefund,
  onUpdateRefundStatus,
  onTriggerOverdueAlerts,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'dashboard' | 'invoices' | 'receipts' | 'refunds' | 'overdue_alerts' | 'financial_reports'>('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [selectedReceipt, setSelectedReceipt] = useState<PaymentRecord | null>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isCreateInvoiceOpen, setIsCreateInvoiceOpen] = useState(false);

  // Filter Invoices
  const filteredInvoices = invoices.filter((inv) => {
    const matchesSearch =
      inv.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.admissionNo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || inv.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Filter Payments / Receipts
  const filteredPayments = payments.filter((p) => {
    const matchesSearch =
      p.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.receiptNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.transactionRef.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || p.paymentMethod === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getInvoiceBadge = (status: InvoiceStatus) => {
    switch (status) {
      case 'Paid':
        return (
          <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 rounded-full text-[10px] font-bold">
            Paid ✓
          </span>
        );
      case 'Partially Paid':
        return (
          <span className="bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-0.5 rounded-full text-[10px] font-bold">
            Partially Paid
          </span>
        );
      case 'Overdue':
        return (
          <span className="bg-rose-50 text-rose-800 border border-rose-200 px-2.5 py-0.5 rounded-full text-[10px] font-bold">
            Overdue
          </span>
        );
      case 'Cancelled':
        return (
          <span className="bg-stone-100 text-stone-600 border border-stone-200 px-2.5 py-0.5 rounded-full text-[10px] font-bold">
            Cancelled
          </span>
        );
      default:
        return (
          <span className="bg-blue-50 text-blue-800 border border-blue-200 px-2.5 py-0.5 rounded-full text-[10px] font-bold">
            Pending
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Title Header */}
      <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 rounded-full">
            Bursary & Financial Operations Hub
          </span>
          <h2 className="font-serif text-2xl font-bold text-stone-900 mt-1">
            Financial Dashboard, Invoices, Receipts & Refunds
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Manage itemized student fee billing, QR-verified receipts, payment gateways, and end-to-end refund compliance workflows.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeSubTab === 'invoices' && onCreateInvoice && (
            <button
              onClick={() => setIsCreateInvoiceOpen(true)}
              className="bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs py-3 px-4 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4 text-stone-700" />
              <span>Create Invoice</span>
            </button>
          )}

          <button
            onClick={() => onOpenPaymentModal()}
            className="bg-[#162825] hover:bg-[#203a36] text-[#f5ded7] font-bold text-xs py-3 px-5 rounded-xl flex items-center gap-2 transition-all cursor-pointer shadow-md"
          >
            <CreditCard className="w-4 h-4 text-[#f5ded7]" />
            <span>Pay Fee / Record Payment</span>
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs Bar */}
      <div className="bg-white p-2 rounded-2xl border border-stone-200 shadow-xs flex flex-wrap items-center gap-1.5">
        <button
          onClick={() => {
            setActiveSubTab('dashboard');
            setStatusFilter('All');
          }}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeSubTab === 'dashboard'
              ? 'bg-[#162825] text-white shadow-xs'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Financial Dashboard</span>
        </button>

        <button
          onClick={() => {
            setActiveSubTab('invoices');
            setStatusFilter('All');
          }}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeSubTab === 'invoices'
              ? 'bg-[#162825] text-white shadow-xs'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Invoice Management ({invoices.length})</span>
        </button>

        <button
          onClick={() => {
            setActiveSubTab('receipts');
            setStatusFilter('All');
          }}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeSubTab === 'receipts'
              ? 'bg-[#162825] text-white shadow-xs'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          <Receipt className="w-4 h-4" />
          <span>Receipt Generation ({payments.length})</span>
        </button>

        <button
          onClick={() => {
            setActiveSubTab('refunds');
            setStatusFilter('All');
          }}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeSubTab === 'refunds'
              ? 'bg-[#162825] text-white shadow-xs'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          <RotateCcw className="w-4 h-4" />
          <span>Refund Management ({refunds.length})</span>
        </button>

        <button
          onClick={() => {
            setActiveSubTab('overdue_alerts');
            setStatusFilter('All');
          }}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeSubTab === 'overdue_alerts'
              ? 'bg-[#162825] text-white shadow-xs'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          <BellRing className="w-4 h-4 text-rose-400" />
          <span>Automated Overdue Alerts Service</span>
        </button>

        <button
          onClick={() => {
            setActiveSubTab('financial_reports');
            setStatusFilter('All');
          }}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeSubTab === 'financial_reports'
              ? 'bg-[#162825] text-white shadow-xs'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          <BarChart3 className="w-4 h-4 text-amber-400" />
          <span>Financial Reports (14 Statements)</span>
        </button>
      </div>

      {/* SUB-TAB 1: FINANCIAL DASHBOARD */}
      {activeSubTab === 'dashboard' && (
        <FinancialDashboard
          payments={payments}
          invoices={invoices}
          students={students}
          refunds={refunds}
          expenses={expenses}
          schoolSettings={schoolSettings}
          onNavigateSubTab={(tab) => setActiveSubTab(tab)}
          onOpenPaymentModal={() => onOpenPaymentModal()}
        />
      )}

      {/* SUB-TAB 2: INVOICES LEDGER */}
      {activeSubTab === 'invoices' && (
        <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-stone-700" />
              <div>
                <h3 className="font-serif font-bold text-stone-900 text-base">Student Fee Invoice Ledger</h3>
                <p className="text-[11px] text-stone-500">Filter by status, view QR codes, apply discounts & process payments.</p>
              </div>
            </div>

            {/* Search & Status Filters */}
            <div className="flex items-center gap-2 max-w-lg w-full sm:w-auto">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search invoice #, student name, admission no..."
                  className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#162825]"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="p-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-bold text-stone-700 focus:outline-none"
              >
                <option value="All">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Partially Paid">Partially Paid</option>
                <option value="Paid">Paid</option>
                <option value="Overdue">Overdue</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-stone-700">
              <thead className="bg-stone-50 text-stone-500 uppercase font-bold text-[10px] tracking-wider border-b border-stone-200">
                <tr>
                  <th className="py-3.5 px-4">Invoice Serial No</th>
                  <th className="py-3.5 px-4">Student & Class</th>
                  <th className="py-3.5 px-4">Term & Session</th>
                  <th className="py-3.5 px-4">Subtotal & Discount</th>
                  <th className="py-3.5 px-4">Total Net Fee</th>
                  <th className="py-3.5 px-4">Amount Paid</th>
                  <th className="py-3.5 px-4">Balance</th>
                  <th className="py-3.5 px-4">Due Date</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-stone-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-stone-900 flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-stone-400" />
                      <span>{inv.invoiceNumber}</span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-stone-800">
                      <p>{inv.studentName}</p>
                      <p className="text-[10px] text-stone-400 font-mono font-normal">
                        {inv.admissionNo} • {inv.className}
                      </p>
                    </td>
                    <td className="py-3.5 px-4 text-stone-600 font-medium">
                      {inv.session} ({inv.term})
                    </td>
                    <td className="py-3.5 px-4 font-mono text-stone-600">
                      <p>{formatNaira(inv.subtotal)}</p>
                      {inv.discountAmount > 0 && (
                        <p className="text-[10px] text-emerald-700 font-bold">- {formatNaira(inv.discountAmount)}</p>
                      )}
                    </td>
                    <td className="py-3.5 px-4 font-extrabold text-stone-900 text-xs">
                      {formatNaira(inv.totalAmount)}
                    </td>
                    <td className="py-3.5 px-4 font-extrabold text-emerald-800 text-xs">
                      {formatNaira(inv.amountPaid)}
                    </td>
                    <td className={`py-3.5 px-4 font-extrabold text-xs ${inv.balance > 0 ? 'text-rose-700' : 'text-emerald-700'}`}>
                      {formatNaira(inv.balance)}
                    </td>
                    <td className="py-3.5 px-4 text-stone-600 font-mono">{inv.dueDate}</td>
                    <td className="py-3.5 px-4">{getInvoiceBadge(inv.status)}</td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedInvoice(inv)}
                          className="px-2.5 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-[11px] rounded-lg transition-all cursor-pointer inline-flex items-center gap-1"
                          title="View & Print Official Invoice"
                        >
                          <Eye className="w-3 h-3 text-stone-600" />
                          <span>View</span>
                        </button>

                        {inv.balance > 0 && (
                          <button
                            onClick={() => onOpenPaymentModal(students.find((s) => s.id === inv.studentId), inv)}
                            className="px-2.5 py-1.5 bg-[#162825] hover:bg-[#203a36] text-[#f5ded7] font-bold text-[11px] rounded-lg transition-all cursor-pointer inline-flex items-center gap-1 shadow-2xs"
                            title="Pay Balance / Record Installment"
                          >
                            <CreditCard className="w-3 h-3 text-[#f5ded7]" />
                            <span>Pay Balance</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: PAYMENT RECEIPTS */}
      {activeSubTab === 'receipts' && (
        <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Receipt className="w-5 h-5 text-[#162825]" />
              <div>
                <h3 className="font-serif font-bold text-stone-900 text-base">Verified Payment Receipts Ledger</h3>
                <p className="text-[11px] text-stone-500">Includes school logo, cashier, transaction reference, QR code, PDF download & print.</p>
              </div>
            </div>

            <div className="flex items-center gap-2 max-w-lg w-full sm:w-auto">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search receipt #, reference, student..."
                  className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#162825]"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="p-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-bold text-stone-700 focus:outline-none"
              >
                <option value="All">All Gateways</option>
                <option value="Paystack">Paystack</option>
                <option value="Flutterwave">Flutterwave</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="POS">POS</option>
                <option value="Cash">Cash</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-stone-700">
              <thead className="bg-stone-50 text-stone-500 uppercase font-bold text-[10px] tracking-wider border-b border-stone-200">
                <tr>
                  <th className="py-3.5 px-4">Receipt Serial No</th>
                  <th className="py-3.5 px-4">Student & Class</th>
                  <th className="py-3.5 px-4">Amount Paid</th>
                  <th className="py-3.5 px-4">Remaining Balance</th>
                  <th className="py-3.5 px-4">Payment Method</th>
                  <th className="py-3.5 px-4">Transaction Ref</th>
                  <th className="py-3.5 px-4">Cashier / Verifier</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredPayments.map((p) => (
                  <tr key={p.id} className="hover:bg-stone-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-stone-900">{p.receiptNo}</td>
                    <td className="py-3.5 px-4 font-bold text-stone-800">
                      <p>{p.studentName}</p>
                      <p className="text-[10px] text-stone-400 font-normal">{p.admissionNo} • {p.className}</p>
                    </td>
                    <td className="py-3.5 px-4 font-extrabold text-emerald-800 text-sm">
                      {formatNaira(p.amountPaid)}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-semibold text-stone-600 text-xs">
                      {formatNaira(p.remainingBalance ?? 0)}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-stone-700">
                      <span className="bg-stone-100 px-2 py-0.5 rounded text-[11px] border border-stone-200">
                        {p.paymentMethod}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-stone-500">{p.transactionRef}</td>
                    <td className="py-3.5 px-4 text-stone-600">
                      <p className="font-semibold">{p.approvedBy || p.verifiedBy}</p>
                      <p className="text-[10px] text-stone-400">{p.paymentDate}</p>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setSelectedReceipt(p)}
                        className="px-3 py-1.5 bg-[#162825] hover:bg-[#203a36] text-white font-bold text-[11px] rounded-lg transition-all cursor-pointer inline-flex items-center gap-1 shadow-2xs"
                      >
                        <Receipt className="w-3 h-3 text-[#f5ded7]" />
                        <span>Receipt / PDF</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB-TAB 4: REFUND MANAGEMENT */}
      {activeSubTab === 'refunds' && (
        <RefundsTab
          refunds={refunds}
          students={students}
          invoices={invoices}
          payments={payments}
          onAddRefund={onAddRefund || (() => {})}
          onUpdateRefundStatus={onUpdateRefundStatus || (() => {})}
        />
      )}

      {/* SUB-TAB 5: AUTOMATED OVERDUE ALERTS SERVICE */}
      {activeSubTab === 'overdue_alerts' && (
        <OverdueAlertsTab
          invoices={invoices}
          students={students}
          schoolSettings={schoolSettings}
          overdueAlerts={overdueAlerts}
          onTriggerOverdueAlerts={
            onTriggerOverdueAlerts || (() => {})
          }
        />
      )}

      {/* SUB-TAB 6: FINANCIAL REPORTS (14 STATEMENTS) */}
      {activeSubTab === 'financial_reports' && (
        <FinancialReportsTab
          payments={payments}
          invoices={invoices}
          students={students}
          schoolSettings={schoolSettings}
          expenses={expenses}
          refunds={refunds}
          feeStructures={feeStructures}
        />
      )}

      {/* Modal 1: Create Invoice */}
      {isCreateInvoiceOpen && (
        <CreateInvoiceModal
          isOpen={isCreateInvoiceOpen}
          onClose={() => setIsCreateInvoiceOpen(false)}
          students={students}
          feeStructures={feeStructures}
          onCreateInvoice={(inv) => {
            if (onCreateInvoice) onCreateInvoice(inv);
          }}
        />
      )}

      {/* Modal 2: View Printable Invoice */}
      {selectedInvoice && (
        <InvoiceModal
          isOpen={!!selectedInvoice}
          onClose={() => setSelectedInvoice(null)}
          invoice={selectedInvoice}
          payments={payments}
          schoolSettings={schoolSettings}
          onPayInvoice={(inv) => {
            setSelectedInvoice(null);
            onOpenPaymentModal(students.find((s) => s.id === inv.studentId), inv);
          }}
        />
      )}

      {/* Modal 3: View Official Receipt with PDF Download & Print */}
      {selectedReceipt && (
        <ReceiptModal
          isOpen={!!selectedReceipt}
          onClose={() => setSelectedReceipt(null)}
          receipt={selectedReceipt}
          schoolSettings={schoolSettings}
        />
      )}
    </div>
  );
};
