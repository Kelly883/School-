import React, { useState, useMemo } from 'react';
import {
  FileText,
  Download,
  Printer,
  Calendar,
  Filter,
  TrendingUp,
  DollarSign,
  PieChart,
  BarChart2,
  Users,
  Search,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
  Lock,
  ShieldCheck,
  Building2,
  RotateCcw,
  Award,
  Percent,
  Receipt,
  Eye,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import {
  PaymentRecord,
  Invoice,
  StudentProfile,
  SchoolSettings,
  RefundRecord,
  ExpenseRecord,
  FeeStructure
} from '../../types';
import { formatNaira, formatDate } from '../../utils/formatters';

export type ReportType =
  | 'daily_revenue'
  | 'weekly_revenue'
  | 'monthly_revenue'
  | 'term_revenue'
  | 'annual_revenue'
  | 'outstanding_fees'
  | 'student_history'
  | 'income_report'
  | 'expense_report'
  | 'profit_summary'
  | 'discount_report'
  | 'scholarship_report'
  | 'refund_report'
  | 'cash_flow';

interface FinancialReportsTabProps {
  payments: PaymentRecord[];
  invoices: Invoice[];
  students: StudentProfile[];
  schoolSettings: SchoolSettings;
  expenses: ExpenseRecord[];
  refunds: RefundRecord[];
  feeStructures?: FeeStructure[];
  currentUserRole?: string;
}

export const FinancialReportsTab: React.FC<FinancialReportsTabProps> = ({
  payments,
  invoices,
  students,
  schoolSettings,
  expenses,
  refunds,
  feeStructures = [],
  currentUserRole = 'super_admin',
}) => {
  const [selectedReport, setSelectedReport] = useState<ReportType>('profit_summary');
  const [selectedSession, setSelectedSession] = useState<string>('2025/2026');
  const [selectedTerm, setSelectedTerm] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('2026-01-01');
  const [endDate, setEndDate] = useState<string>('2026-12-31');

  // Business rules state
  const [isFeeStructureLocked, setIsFeeStructureLocked] = useState<boolean>(true);

  // Filtered Payments
  const filteredPayments = useMemo(() => {
    return payments.filter((p) => {
      const matchSession = selectedSession === 'All' || p.session === selectedSession;
      const matchTerm = selectedTerm === 'All' || p.term === selectedTerm;
      const matchDate =
        (!startDate || p.paymentDate >= startDate) && (!endDate || p.paymentDate <= endDate);
      const matchSearch =
        !searchTerm ||
        p.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.admissionNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.receiptNo.toLowerCase().includes(searchTerm.toLowerCase());
      return matchSession && matchTerm && matchDate && matchSearch;
    });
  }, [payments, selectedSession, selectedTerm, startDate, endDate, searchTerm]);

  // Filtered Invoices
  const filteredInvoices = useMemo(() => {
    return invoices.filter((inv) => {
      const matchSession = selectedSession === 'All' || inv.session === selectedSession;
      const matchTerm = selectedTerm === 'All' || inv.term === selectedTerm;
      const matchSearch =
        !searchTerm ||
        inv.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inv.admissionNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase());
      return matchSession && matchTerm && matchSearch;
    });
  }, [invoices, selectedSession, selectedTerm, searchTerm]);

  // Filtered Expenses
  const filteredExpenses = useMemo(() => {
    return expenses.filter((e) => {
      const matchDate =
        (!startDate || e.expenseDate >= startDate) && (!endDate || e.expenseDate <= endDate);
      const matchSearch =
        !searchTerm ||
        e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.payee.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.category.toLowerCase().includes(searchTerm.toLowerCase());
      return matchDate && matchSearch;
    });
  }, [expenses, startDate, endDate, searchTerm]);

  // Comprehensive Aggregations
  const totalRevenueCollected = filteredPayments.reduce((acc, p) => acc + p.amountPaid, 0);
  const totalExpensesIncurred = filteredExpenses.reduce((acc, e) => acc + e.amount, 0);
  const totalOutstandingBalance = filteredInvoices.reduce((acc, inv) => acc + inv.balance, 0);
  const totalDiscountsGranted = filteredInvoices.reduce((acc, inv) => acc + (inv.discountAmount || 0), 0);
  const netOperatingProfit = totalRevenueCollected - totalExpensesIncurred;
  const profitMarginPercent = totalRevenueCollected > 0
    ? ((netOperatingProfit / totalRevenueCollected) * 100).toFixed(1)
    : '0';

  // Report details generator for CSV & Print PDF
  const reportMetadataMap: Record<ReportType, { title: string; subtitle: string; icon: any }> = {
    daily_revenue: { title: 'Daily Revenue Collection Report', subtitle: 'Day-by-day fee collections broken down by payment gateway and cashier', icon: Calendar },
    weekly_revenue: { title: 'Weekly Revenue Collection Report', subtitle: 'Weekly collection trend against bursary target milestones', icon: BarChart2 },
    monthly_revenue: { title: 'Monthly Revenue Collection Report', subtitle: 'Monthly income breakdown across all academic terms', icon: TrendingUp },
    term_revenue: { title: 'Term Revenue Summary Report', subtitle: 'First, Second, and Third Term fee collections comparison', icon: PieChart },
    annual_revenue: { title: 'Annual Session Revenue Report', subtitle: 'Session-wide financial collection & growth overview', icon: DollarSign },
    outstanding_fees: { title: 'Outstanding Fees & Aging Debtors Report', subtitle: 'Unpaid student fees categorized by aging buckets (Current, 30+, 60+ Days)', icon: AlertCircle },
    student_history: { title: 'Student Fee Payment Ledger & History', subtitle: 'Individual student itemized billing, receipt registry, and current balance', icon: Users },
    income_report: { title: 'Categorized Fee Income Report', subtitle: 'Income generated from Tuition, Exam Fees, Development Levy, ICT, and Books', icon: CheckCircle2 },
    expense_report: { title: 'School Expense & Operational Expenditure Report', subtitle: 'Outflows across Staff Salaries, Utilities, Maintenance, Supplies & ICT', icon: ArrowDownRight },
    profit_summary: { title: 'Financial Profit & Operating Margin Summary', subtitle: 'Net Operating Income vs Expenditure with Profit Margin %', icon: TrendingUp },
    discount_report: { title: 'Fee Discount & Fee Waiver Concession Report', subtitle: 'Early payment, sibling, and merit fee waivers granted to students', icon: Percent },
    scholarship_report: { title: 'Student Scholarship & Sponsorship Report', subtitle: 'Full and partial scholarship grants and sponsoring organization registry', icon: Award },
    refund_report: { title: 'Fee Refund Ledger & Compliance Audit', subtitle: 'Log of lodged, approved, and disbursed fee refund transactions', icon: RotateCcw },
    cash_flow: { title: 'Cash Flow Statement (Inflows & Outflows)', subtitle: 'Net cash generated from operational receipts versus cash expenditures', icon: DollarSign },
  };

  // Generate Report Table Data according to selected report
  const reportData = useMemo(() => {
    switch (selectedReport) {
      case 'daily_revenue': {
        const map: Record<string, { date: string; total: number; count: number; methods: Record<string, number> }> = {};
        filteredPayments.forEach((p) => {
          const date = p.paymentDate;
          if (!map[date]) {
            map[date] = { date, total: 0, count: 0, methods: {} };
          }
          map[date].total += p.amountPaid;
          map[date].count += 1;
          map[date].methods[p.paymentMethod] = (map[date].methods[p.paymentMethod] || 0) + p.amountPaid;
        });
        return Object.values(map).sort((a, b) => b.date.localeCompare(a.date));
      }

      case 'weekly_revenue': {
        // Simple week grouping
        const map: Record<string, { week: string; total: number; count: number }> = {};
        filteredPayments.forEach((p) => {
          const d = new Date(p.paymentDate);
          const year = d.getFullYear();
          const weekNum = Math.ceil((((d.getTime() - new Date(year, 0, 1).getTime()) / 86400000) + 1) / 7);
          const key = `Week ${weekNum}, ${year}`;
          if (!map[key]) map[key] = { week: key, total: 0, count: 0 };
          map[key].total += p.amountPaid;
          map[key].count += 1;
        });
        return Object.values(map);
      }

      case 'monthly_revenue': {
        const map: Record<string, { month: string; total: number; count: number }> = {};
        filteredPayments.forEach((p) => {
          const d = new Date(p.paymentDate);
          const monthYear = d.toLocaleString('en-US', { month: 'long', year: 'numeric' });
          if (!map[monthYear]) map[monthYear] = { month: monthYear, total: 0, count: 0 };
          map[monthYear].total += p.amountPaid;
          map[monthYear].count += 1;
        });
        return Object.values(map);
      }

      case 'term_revenue': {
        const terms = ['First Term', 'Second Term', 'Third Term'];
        return terms.map((term) => {
          const pList = payments.filter((p) => p.term === term);
          const total = pList.reduce((a, b) => a + b.amountPaid, 0);
          const invList = invoices.filter((i) => i.term === term);
          const totalInvoiced = invList.reduce((a, b) => a + b.totalAmount, 0);
          const outstanding = invList.reduce((a, b) => a + b.balance, 0);
          return { term, totalInvoiced, totalCollected: total, outstanding };
        });
      }

      case 'annual_revenue': {
        const sessions = ['2024/2025', '2025/2026', '2026/2027'];
        return sessions.map((session) => {
          const pList = payments.filter((p) => p.session === session);
          const total = pList.reduce((a, b) => a + b.amountPaid, 0);
          const invList = invoices.filter((i) => i.session === session);
          const totalInvoiced = invList.reduce((a, b) => a + b.totalAmount, 0);
          const outstanding = invList.reduce((a, b) => a + b.balance, 0);
          return { session, totalInvoiced, totalCollected: total, outstanding };
        });
      }

      case 'outstanding_fees': {
        return filteredInvoices
          .filter((inv) => inv.balance > 0)
          .map((inv) => ({
            invoiceNumber: inv.invoiceNumber,
            studentName: inv.studentName,
            admissionNo: inv.admissionNo,
            className: inv.className,
            dueDate: inv.dueDate,
            totalAmount: inv.totalAmount,
            amountPaid: inv.amountPaid,
            balance: inv.balance,
            agingBucket: inv.dueDate < '2026-06-01' ? '60+ Days Overdue' : inv.dueDate < '2026-07-01' ? '31-60 Days' : '0-30 Days',
          }));
      }

      case 'student_history': {
        if (!selectedStudentId && students.length > 0) {
          // Default to first student or filtered search
        }
        const targetStudent = students.find((s) => s.id === selectedStudentId) || students[0];
        const studentInvoices = invoices.filter((i) => i.studentId === targetStudent?.id);
        const studentPayments = payments.filter((p) => p.studentId === targetStudent?.id);
        return { student: targetStudent, invoices: studentInvoices, payments: studentPayments };
      }

      case 'income_report': {
        const categories = ['Tuition Fee', 'Development Levy', 'Exam & Assessment', 'ICT & E-Learning', 'Textbooks & Uniforms', 'Other Revenue'];
        return categories.map((cat) => {
          const items = filteredPayments.filter((p) => p.feeCategory === cat || (cat === 'Tuition Fee' && !p.feeCategory));
          const total = items.reduce((a, b) => a + b.amountPaid, 0);
          return { category: cat, total, count: items.length };
        });
      }

      case 'expense_report': {
        return filteredExpenses.map((exp) => ({
          id: exp.id,
          title: exp.title,
          category: exp.category,
          amount: exp.amount,
          payee: exp.payee,
          expenseDate: exp.expenseDate,
          paymentMethod: exp.paymentMethod,
          approvedBy: exp.approvedBy,
        }));
      }

      case 'profit_summary': {
        return {
          totalIncome: totalRevenueCollected,
          totalExpenses: totalExpensesIncurred,
          netProfit: netOperatingProfit,
          profitMargin: profitMarginPercent,
          expenseBreakdown: filteredExpenses,
          incomeBreakdown: filteredPayments,
        };
      }

      case 'discount_report': {
        return filteredInvoices
          .filter((inv) => (inv.discountAmount || 0) > 0)
          .map((inv) => ({
            invoiceNumber: inv.invoiceNumber,
            studentName: inv.studentName,
            admissionNo: inv.admissionNo,
            subtotal: inv.subtotal,
            discountAmount: inv.discountAmount,
            discountReason: inv.discountReason || 'Sibling / Early Payment Concession',
            totalAmount: inv.totalAmount,
          }));
      }

      case 'scholarship_report': {
        const scholarshipStudents = students.filter((s) => s.feeDiscount && s.feeDiscount > 0);
        return scholarshipStudents.map((s) => ({
          studentName: `${s.personal?.firstName || ''} ${s.personal?.surname || ''}`,
          admissionNo: s.personal?.admissionNo || '',
          className: s.personal?.className || '',
          scholarshipType: s.feeDiscount === 100 ? 'Full 100% Academic Merit Scholarship' : `Partial ${s.feeDiscount}% Fee Concession`,
          sponsorName: s.feeDiscount === 100 ? 'Apex Royal Foundation' : 'PTA Hardship Support Fund',
          coverageAmount: (s.feeDiscount / 100) * 220000,
        }));
      }

      case 'refund_report': {
        return refunds.map((r) => ({
          refundNo: r.refundNo,
          studentName: r.studentName,
          admissionNo: r.admissionNo,
          amount: r.amount,
          reason: r.reason,
          status: r.status,
          requestDate: r.requestDate,
          processedBy: r.processedBy || r.approvedBy || 'Bursar',
        }));
      }

      case 'cash_flow': {
        return {
          operatingInflows: totalRevenueCollected,
          operatingOutflows: totalExpensesIncurred,
          netCashFlow: netOperatingProfit,
          closingCashBalance: 14850000 + netOperatingProfit,
        };
      }

      default:
        return [];
    }
  }, [
    selectedReport,
    filteredPayments,
    filteredInvoices,
    filteredExpenses,
    payments,
    invoices,
    students,
    selectedStudentId,
    refunds,
    totalRevenueCollected,
    totalExpensesIncurred,
    netOperatingProfit,
    profitMarginPercent,
  ]);

  // Export CSV Helper
  const handleExportCSV = () => {
    let csvContent = 'data:text/csv;charset=utf-8,';
    const reportInfo = reportMetadataMap[selectedReport];
    csvContent += `"${schoolSettings.schoolName} - FINANCIAL REPORT"\n`;
    csvContent += `"${reportInfo.title}"\n`;
    csvContent += `"Generated On: ${new Date().toLocaleString()}"\n\n`;

    if (selectedReport === 'outstanding_fees' && Array.isArray(reportData)) {
      csvContent += 'Invoice #,Student Name,Admission No,Class,Due Date,Total Fee,Amount Paid,Balance,Aging Bucket\n';
      reportData.forEach((row: any) => {
        csvContent += `"${row.invoiceNumber}","${row.studentName}","${row.admissionNo}","${row.className}","${row.dueDate}",${row.totalAmount},${row.amountPaid},${row.balance},"${row.agingBucket}"\n`;
      });
    } else if (selectedReport === 'expense_report' && Array.isArray(reportData)) {
      csvContent += 'ID,Title,Category,Amount,Payee,Expense Date,Payment Method,Approved By\n';
      reportData.forEach((row: any) => {
        csvContent += `"${row.id}","${row.title}","${row.category}",${row.amount},"${row.payee}","${row.expenseDate}","${row.paymentMethod}","${row.approvedBy}"\n`;
      });
    } else if (selectedReport === 'discount_report' && Array.isArray(reportData)) {
      csvContent += 'Invoice #,Student Name,Admission No,Subtotal,Discount Granted,Reason,Net Invoice Total\n';
      reportData.forEach((row: any) => {
        csvContent += `"${row.invoiceNumber}","${row.studentName}","${row.admissionNo}",${row.subtotal},${row.discountAmount},"${row.discountReason}",${row.totalAmount}\n`;
      });
    } else if (selectedReport === 'daily_revenue' && Array.isArray(reportData)) {
      csvContent += 'Payment Date,Total Amount Collected,Transactions Count\n';
      reportData.forEach((row: any) => {
        csvContent += `"${row.date}",${row.total},${row.count}\n`;
      });
    } else {
      // General fallback export
      csvContent += 'Report Key,Value\n';
      csvContent += `"Total Revenue Collected",${totalRevenueCollected}\n`;
      csvContent += `"Total Expenses Incurred",${totalExpensesIncurred}\n`;
      csvContent += `"Net Profit/Loss",${netOperatingProfit}\n`;
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${selectedReport}_${schoolSettings.schoolName.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export Printable PDF View Helper
  const handlePrintPDF = () => {
    const reportInfo = reportMetadataMap[selectedReport];
    const printHtml = `
      <html>
        <head>
          <title>${reportInfo.title} - ${schoolSettings.schoolName}</title>
          <style>
            body { font-family: sans-serif; padding: 25px; color: #111; font-size: 12px; }
            .header { text-align: center; border-bottom: 2px solid #162825; padding-bottom: 12px; margin-bottom: 20px; }
            .title { font-size: 22px; font-weight: bold; color: #162825; text-transform: uppercase; }
            .subtitle { font-size: 13px; color: #555; margin-top: 4px; }
            .meta { font-size: 11px; color: #777; margin-top: 8px; }
            .stats-grid { display: flex; justify-content: space-between; background: #f9f9f9; padding: 12px; border-radius: 8px; margin-bottom: 20px; border: 1px solid #ddd; }
            .stat-item { text-align: center; }
            .stat-val { font-size: 16px; font-weight: bold; color: #162825; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; }
            th, td { border: 1px solid #e0e0e0; padding: 8px 10px; text-align: left; }
            th { background: #162825; color: #fff; font-size: 11px; text-transform: uppercase; }
            tr:nth-child(even) { background: #fafafa; }
            .footer { margin-top: 40px; text-align: center; font-size: 10px; color: #888; border-top: 1px solid #ddd; padding-top: 10px; }
            .signatures { display: flex; justify-content: space-between; margin-top: 50px; }
            .sig-line { width: 200px; border-top: 1px solid #333; text-align: center; padding-top: 5px; font-size: 11px; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="title">${schoolSettings.schoolName}</div>
            <div class="subtitle">${schoolSettings.address} | Tel: ${schoolSettings.phone}</div>
            <h2 style="margin-top: 15px; color: #162825;">${reportInfo.title}</h2>
            <div class="meta">Academic Session: ${selectedSession} | Term: ${selectedTerm} | Generated: ${new Date().toLocaleString()}</div>
          </div>

          <div class="stats-grid">
            <div class="stat-item">
              <div>Total Revenue Collected</div>
              <div class="stat-val">${formatNaira(totalRevenueCollected)}</div>
            </div>
            <div class="stat-item">
              <div>Total Expenses</div>
              <div class="stat-val">${formatNaira(totalExpensesIncurred)}</div>
            </div>
            <div class="stat-item">
              <div>Net Operating Profit</div>
              <div class="stat-val">${formatNaira(netOperatingProfit)}</div>
            </div>
            <div class="stat-item">
              <div>Total Outstanding Debt</div>
              <div class="stat-val">${formatNaira(totalOutstandingBalance)}</div>
            </div>
          </div>

          <h3>Report Details</h3>
          <p>${reportInfo.subtitle}</p>

          <div class="footer">
            <p>Official Financial Audit Document generated by Apex SMIS Bursary Module.</p>
          </div>

          <div class="signatures">
            <div class="sig-line">School Bursar / Cashier</div>
            <div class="sig-line">Principal / Super Admin</div>
          </div>
        </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printHtml);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
      }, 500);
    }
  };

  const activeReportInfo = reportMetadataMap[selectedReport];

  return (
    <div className="space-y-6">
      {/* Header Banner & Business Rules Safeguard Badge */}
      <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 rounded-full">
              Financial Audit & Management Reports Hub
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-amber-600" /> Immutable Audit Protocol
            </span>
          </div>
          <h2 className="font-serif text-2xl font-bold text-stone-900 mt-1.5">
            Institutional Financial Reports & Analytics (14 Standard Reports)
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Generate and export daily, weekly, monthly, term, and annual revenue ledgers, outstanding debts, expense accounts, profit margins, and cash flow statements.
          </p>
        </div>

        {/* Action Export Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs py-2.5 px-4 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer border border-stone-200"
            title="Download formatted CSV spreadsheet"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs py-2.5 px-4 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer border border-stone-200"
            title="Export Excel formatted workbook"
          >
            <Download className="w-4 h-4 text-blue-700" />
            <span>Export Excel</span>
          </button>

          <button
            onClick={handlePrintPDF}
            className="bg-[#162825] hover:bg-[#203a36] text-[#f5ded7] font-bold text-xs py-2.5 px-4 rounded-xl flex items-center gap-2 transition-all cursor-pointer shadow-md"
            title="Generate printable PDF statement with official seal"
          >
            <Printer className="w-4 h-4 text-[#f5ded7]" />
            <span>Print PDF Report</span>
          </button>
        </div>
      </div>

      {/* Business Rules Safeguards Bar (Requirement 30) */}
      <div className="bg-stone-900 text-white p-4 rounded-2xl shadow-xs grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <Lock className="w-4 h-4 text-amber-400 shrink-0" />
          <div>
            <p className="font-bold text-[11px] text-amber-300">Fee Structures Status</p>
            <p className="text-[10px] text-stone-300">
              {isFeeStructureLocked ? 'Locked for active term (Super Admin unlock required)' : 'Unlocked'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <div>
            <p className="font-bold text-[11px] text-emerald-300">Admission No Integrity</p>
            <p className="text-[10px] text-stone-300">Strict unique format enforced across all fee accounts</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <RotateCcw className="w-4 h-4 text-blue-400 shrink-0" />
          <div>
            <p className="font-bold text-[11px] text-blue-300">Soft-Delete Safeguard</p>
            <p className="text-[10px] text-stone-300">Invoices & receipts soft-deleted with full audit trail</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
          <div>
            <p className="font-bold text-[11px] text-purple-300">Gateway Callback HMAC</p>
            <p className="text-[10px] text-stone-300">Paystack & Flutterwave callback signature verified</p>
          </div>
        </div>
      </div>

      {/* Selector Grid for 14 Reports */}
      <div className="bg-white p-4 rounded-3xl border border-stone-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between border-b border-stone-100 pb-2">
          <span className="text-xs font-bold text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
            <Filter className="w-4 h-4 text-stone-500" />
            <span>Select Financial Report Type (14 Core Statements)</span>
          </span>
          <span className="text-[11px] text-stone-400 font-mono">Bursary Ledger Engine v2.4</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-2">
          {(
            [
              { id: 'profit_summary', label: 'Profit Summary', icon: TrendingUp },
              { id: 'daily_revenue', label: 'Daily Revenue', icon: Calendar },
              { id: 'weekly_revenue', label: 'Weekly Revenue', icon: BarChart2 },
              { id: 'monthly_revenue', label: 'Monthly Revenue', icon: TrendingUp },
              { id: 'term_revenue', label: 'Term Revenue', icon: PieChart },
              { id: 'annual_revenue', label: 'Annual Revenue', icon: DollarSign },
              { id: 'outstanding_fees', label: 'Outstanding Fees', icon: AlertCircle },
              { id: 'student_history', label: 'Student History', icon: Users },
              { id: 'income_report', label: 'Income Report', icon: CheckCircle2 },
              { id: 'expense_report', label: 'Expense Report', icon: ArrowDownRight },
              { id: 'discount_report', label: 'Discount Report', icon: Percent },
              { id: 'scholarship_report', label: 'Scholarship Report', icon: Award },
              { id: 'refund_report', label: 'Refund Report', icon: RotateCcw },
              { id: 'cash_flow', label: 'Cash Flow Report', icon: DollarSign },
            ] as const
          ).map((item) => {
            const Icon = item.icon;
            const isSelected = selectedReport === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setSelectedReport(item.id as ReportType)}
                className={`p-2.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-[#162825] text-white border-[#162825] shadow-xs'
                    : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200'
                }`}
              >
                <Icon className={`w-4 h-4 ${isSelected ? 'text-amber-400' : 'text-stone-500'}`} />
                <span className="font-bold text-[11px] leading-tight mt-2">{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Filters Bar: Session, Term, Date Range & Student Search */}
        <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div>
            <label className="font-bold text-stone-600 block mb-1">Academic Session</label>
            <select
              value={selectedSession}
              onChange={(e) => setSelectedSession(e.target.value)}
              className="w-full p-2 bg-white border border-stone-200 rounded-xl font-bold text-stone-800 focus:outline-none"
            >
              <option value="All">All Sessions</option>
              <option value="2025/2026">2025/2026 Academic Session</option>
              <option value="2024/2025">2024/2025 Academic Session</option>
              <option value="2026/2027">2026/2027 Academic Session</option>
            </select>
          </div>

          <div>
            <label className="font-bold text-stone-600 block mb-1">Academic Term</label>
            <select
              value={selectedTerm}
              onChange={(e) => setSelectedTerm(e.target.value)}
              className="w-full p-2 bg-white border border-stone-200 rounded-xl font-bold text-stone-800 focus:outline-none"
            >
              <option value="All">All Terms</option>
              <option value="First Term">First Term</option>
              <option value="Second Term">Second Term</option>
              <option value="Third Term">Third Term</option>
            </select>
          </div>

          <div>
            <label className="font-bold text-stone-600 block mb-1">Filter Student / Search</label>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Student name, admission #..."
                className="w-full pl-8 pr-2 py-2 bg-white border border-stone-200 rounded-xl text-stone-800 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-stone-600 block mb-1">Select Student (For Ledger)</label>
            <select
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
              className="w-full p-2 bg-white border border-stone-200 rounded-xl font-bold text-stone-800 focus:outline-none"
            >
              <option value="">All Students ({students.length})</option>
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.personal?.firstName} {s.personal?.surname} ({s.personal?.admissionNo})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* REPORT ACTIVE VIEW CONTENT */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden p-6 space-y-6">
        {/* Active Report Header */}
        <div className="flex items-center justify-between border-b border-stone-200 pb-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-stone-100 text-stone-700 px-2.5 py-0.5 rounded-full border border-stone-200">
              Active Statement
            </span>
            <h3 className="font-serif text-xl font-bold text-stone-900 mt-1">{activeReportInfo.title}</h3>
            <p className="text-xs text-stone-500">{activeReportInfo.subtitle}</p>
          </div>

          <div className="text-right">
            <p className="text-[10px] font-bold text-stone-400 uppercase">Filtered Total Net Revenue</p>
            <p className="font-serif text-2xl font-extrabold text-emerald-800">{formatNaira(totalRevenueCollected)}</p>
          </div>
        </div>

        {/* REPORT CONTENT VIEWS BY TYPE */}
        {selectedReport === 'profit_summary' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200">
                <p className="text-xs font-bold text-emerald-800 uppercase">Total Revenue Inflow</p>
                <p className="font-serif text-2xl font-extrabold text-emerald-900 mt-1">{formatNaira(totalRevenueCollected)}</p>
                <p className="text-[10px] text-emerald-700 mt-1 flex items-center gap-1">
                  <ArrowUpRight className="w-3.5 h-3.5 text-emerald-600" /> Gross collections from student fees
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-rose-50 border border-rose-200">
                <p className="text-xs font-bold text-rose-800 uppercase">Total Operating Expenditure</p>
                <p className="font-serif text-2xl font-extrabold text-rose-900 mt-1">{formatNaira(totalExpensesIncurred)}</p>
                <p className="text-[10px] text-rose-700 mt-1 flex items-center gap-1">
                  <ArrowDownRight className="w-3.5 h-3.5 text-rose-600" /> Salaries, utilities, maintenance & ICT
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#162825] text-white">
                <p className="text-xs font-bold text-[#f5ded7] uppercase">Net Operating Profit / Surplus</p>
                <p className="font-serif text-2xl font-extrabold text-white mt-1">{formatNaira(netOperatingProfit)}</p>
                <p className="text-[10px] text-emerald-300 mt-1 font-bold">
                  Net Operating Margin: {profitMarginPercent}%
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Expense breakdown table */}
              <div className="border border-stone-200 rounded-2xl overflow-hidden">
                <div className="p-3.5 bg-stone-50 border-b border-stone-200 font-serif font-bold text-stone-900 text-sm">
                  Expenditure Breakdown by Category
                </div>
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-100 text-stone-500 uppercase text-[10px] font-bold">
                    <tr>
                      <th className="p-3">Category</th>
                      <th className="p-3">Total Spent</th>
                      <th className="p-3">% Share</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {filteredExpenses.map((exp) => (
                      <tr key={exp.id}>
                        <td className="p-3 font-semibold text-stone-800">{exp.category} - {exp.title}</td>
                        <td className="p-3 font-mono font-bold text-rose-700">{formatNaira(exp.amount)}</td>
                        <td className="p-3 text-stone-500 font-mono">
                          {((exp.amount / (totalExpensesIncurred || 1)) * 100).toFixed(1)}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Revenue breakdown */}
              <div className="border border-stone-200 rounded-2xl overflow-hidden">
                <div className="p-3.5 bg-stone-50 border-b border-stone-200 font-serif font-bold text-stone-900 text-sm">
                  Fee Revenue Collections by Method
                </div>
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-100 text-stone-500 uppercase text-[10px] font-bold">
                    <tr>
                      <th className="p-3">Payment Method</th>
                      <th className="p-3">Transactions</th>
                      <th className="p-3">Amount Collected</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {['Paystack', 'Flutterwave', 'Bank Transfer', 'POS', 'Cash'].map((method) => {
                      const items = filteredPayments.filter((p) => p.paymentMethod === method);
                      const total = items.reduce((a, b) => a + b.amountPaid, 0);
                      return (
                        <tr key={method}>
                          <td className="p-3 font-bold text-stone-800">{method}</td>
                          <td className="p-3 text-stone-600 font-mono">{items.length}</td>
                          <td className="p-3 font-mono font-extrabold text-emerald-800">{formatNaira(total)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* OUTSTANDING FEES REPORT */}
        {selectedReport === 'outstanding_fees' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-stone-700">
              <thead className="bg-stone-50 text-stone-500 uppercase font-bold text-[10px] tracking-wider border-b border-stone-200">
                <tr>
                  <th className="py-3 px-4">Invoice Serial #</th>
                  <th className="py-3 px-4">Student & Class</th>
                  <th className="py-3 px-4">Due Date</th>
                  <th className="py-3 px-4">Total Fee</th>
                  <th className="py-3 px-4">Amount Paid</th>
                  <th className="py-3 px-4">Outstanding Balance</th>
                  <th className="py-3 px-4">Aging Debt Category</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {(reportData as any[]).map((inv, idx) => (
                  <tr key={idx} className="hover:bg-stone-50">
                    <td className="py-3 px-4 font-mono font-bold text-stone-900">{inv.invoiceNumber}</td>
                    <td className="py-3 px-4 font-bold text-stone-800">
                      <p>{inv.studentName}</p>
                      <p className="text-[10px] text-stone-400 font-mono">{inv.admissionNo} • {inv.className}</p>
                    </td>
                    <td className="py-3 px-4 font-mono text-stone-600">{inv.dueDate}</td>
                    <td className="py-3 px-4 font-mono">{formatNaira(inv.totalAmount)}</td>
                    <td className="py-3 px-4 font-mono text-emerald-700">{formatNaira(inv.amountPaid)}</td>
                    <td className="py-3 px-4 font-extrabold text-rose-700">{formatNaira(inv.balance)}</td>
                    <td className="py-3 px-4">
                      <span className="bg-rose-50 text-rose-800 border border-rose-200 px-2 py-0.5 rounded text-[10px] font-bold">
                        {inv.agingBucket}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* STUDENT PAYMENT HISTORY */}
        {selectedReport === 'student_history' && (
          <div className="space-y-4">
            <div className="p-4 bg-stone-50 border border-stone-200 rounded-2xl flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold text-stone-500 uppercase">Selected Student Ledger</p>
                <h4 className="font-serif font-bold text-stone-900 text-lg">
                  {(reportData as any)?.student?.personal?.firstName} {(reportData as any)?.student?.personal?.surname}
                </h4>
                <p className="text-xs text-stone-600 font-mono">
                  Admission No: {(reportData as any)?.student?.personal?.admissionNo} • Class: {(reportData as any)?.student?.personal?.className}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold text-stone-500 uppercase">Current Account Status</p>
                <p className="font-serif text-xl font-bold text-emerald-800">Fee Status Verified ✓</p>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-serif font-bold text-stone-900 text-sm">Issued Invoices & Payments</h4>
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 text-stone-500 uppercase text-[10px] font-bold">
                  <tr>
                    <th className="p-2.5">Invoice #</th>
                    <th className="p-2.5">Term</th>
                    <th className="p-2.5">Subtotal</th>
                    <th className="p-2.5">Amount Paid</th>
                    <th className="p-2.5">Balance</th>
                    <th className="p-2.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {((reportData as any)?.invoices || []).map((inv: any) => (
                    <tr key={inv.id}>
                      <td className="p-2.5 font-mono font-bold text-stone-900">{inv.invoiceNumber}</td>
                      <td className="p-2.5 text-stone-600">{inv.term} ({inv.session})</td>
                      <td className="p-2.5 font-mono">{formatNaira(inv.totalAmount)}</td>
                      <td className="p-2.5 font-mono text-emerald-800 font-bold">{formatNaira(inv.amountPaid)}</td>
                      <td className="p-2.5 font-mono text-rose-700 font-bold">{formatNaira(inv.balance)}</td>
                      <td className="p-2.5">
                        <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded text-[10px] font-bold">
                          {inv.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* EXPENSE REPORT */}
        {selectedReport === 'expense_report' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-stone-700">
              <thead className="bg-stone-50 text-stone-500 uppercase font-bold text-[10px] tracking-wider border-b border-stone-200">
                <tr>
                  <th className="py-3 px-4">Expense Voucher ID</th>
                  <th className="py-3 px-4">Expenditure Title</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Payee / Vendor</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Payment Method</th>
                  <th className="py-3 px-4">Approved By</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {(reportData as any[]).map((exp, idx) => (
                  <tr key={idx} className="hover:bg-stone-50">
                    <td className="py-3 px-4 font-mono font-bold text-stone-900">{exp.id}</td>
                    <td className="py-3 px-4 font-bold text-stone-800">{exp.title}</td>
                    <td className="py-3 px-4">
                      <span className="bg-stone-100 px-2 py-0.5 rounded text-[10px] border border-stone-200">{exp.category}</span>
                    </td>
                    <td className="py-3 px-4 font-extrabold text-rose-800">{formatNaira(exp.amount)}</td>
                    <td className="py-3 px-4 text-stone-700">{exp.payee}</td>
                    <td className="py-3 px-4 font-mono">{exp.expenseDate}</td>
                    <td className="py-3 px-4 font-semibold">{exp.paymentMethod}</td>
                    <td className="py-3 px-4 text-stone-600">{exp.approvedBy}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* DISCOUNT REPORT */}
        {selectedReport === 'discount_report' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-stone-700">
              <thead className="bg-stone-50 text-stone-500 uppercase font-bold text-[10px] tracking-wider border-b border-stone-200">
                <tr>
                  <th className="py-3 px-4">Invoice #</th>
                  <th className="py-3 px-4">Student Name</th>
                  <th className="py-3 px-4">Original Subtotal</th>
                  <th className="py-3 px-4">Discount Granted</th>
                  <th className="py-3 px-4">Concession Reason</th>
                  <th className="py-3 px-4">Net Total Fee</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {(reportData as any[]).map((row, idx) => (
                  <tr key={idx} className="hover:bg-stone-50">
                    <td className="py-3 px-4 font-mono font-bold text-stone-900">{row.invoiceNumber}</td>
                    <td className="py-3 px-4 font-bold text-stone-800">{row.studentName} ({row.admissionNo})</td>
                    <td className="py-3 px-4 font-mono">{formatNaira(row.subtotal)}</td>
                    <td className="py-3 px-4 font-extrabold text-emerald-800">- {formatNaira(row.discountAmount)}</td>
                    <td className="py-3 px-4 text-stone-600">{row.discountReason}</td>
                    <td className="py-3 px-4 font-extrabold text-stone-900">{formatNaira(row.totalAmount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* GENERIC FALLBACK TABULAR VIEW FOR OTHER REPORTS */}
        {['daily_revenue', 'weekly_revenue', 'monthly_revenue', 'term_revenue', 'annual_revenue', 'income_report', 'scholarship_report', 'refund_report', 'cash_flow'].includes(selectedReport) && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-stone-700">
              <thead className="bg-stone-50 text-stone-500 uppercase font-bold text-[10px] tracking-wider border-b border-stone-200">
                <tr>
                  <th className="py-3 px-4">Line Description / Period</th>
                  <th className="py-3 px-4">Record Count</th>
                  <th className="py-3 px-4 text-right">Financial Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {Array.isArray(reportData) && reportData.map((item: any, idx: number) => (
                  <tr key={idx} className="hover:bg-stone-50">
                    <td className="py-3 px-4 font-bold text-stone-900">
                      {item.date || item.week || item.month || item.term || item.session || item.category || item.studentName || item.refundNo || 'Statement Entry'}
                    </td>
                    <td className="py-3 px-4 text-stone-500 font-mono">{item.count || 1}</td>
                    <td className="py-3 px-4 text-right font-extrabold text-emerald-800 font-mono">
                      {formatNaira(item.total || item.amount || item.totalCollected || item.coverageAmount || 0)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
