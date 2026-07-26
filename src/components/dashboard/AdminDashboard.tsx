import React from 'react';
import {
  Users,
  GraduationCap,
  TrendingUp,
  CreditCard,
  PlusCircle,
  FileCheck2,
  Calendar,
  ArrowUpRight,
  Sparkles,
  ChevronRight,
  Clock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import {
  SchoolSettings,
  StudentProfile,
  PaymentRecord,
  ExpenseRecord,
  AuditLog,
  ClassStructure
} from '../../types';
import { formatNaira } from '../../utils/formatters';

interface AdminDashboardProps {
  schoolSettings: SchoolSettings;
  students: StudentProfile[];
  payments: PaymentRecord[];
  expenses: ExpenseRecord[];
  auditLogs: AuditLog[];
  classes: ClassStructure[];
  onNavigate: (tab: string) => void;
  onOpenNewAdmission: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  schoolSettings,
  students,
  payments,
  expenses,
  auditLogs,
  classes,
  onNavigate,
  onOpenNewAdmission,
}) => {
  // Financial Calculations
  const totalCollected = payments.reduce((sum, p) => sum + p.amountPaid, 0);
  const totalOutstanding = students.reduce((sum, s) => sum + s.feeBalance, 0);
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const netRevenue = totalCollected - totalExpenses;

  // Chart data for revenue trend
  const revenueTrendData = [
    { month: 'Jan', revenue: 8400000, expenses: 3200000 },
    { month: 'Feb', revenue: 12500000, expenses: 4100000 },
    { month: 'Mar', revenue: 15200000, expenses: 4800000 },
    { month: 'Apr', revenue: 18900000, expenses: 5100000 },
    { month: 'May', revenue: 22400000, expenses: 6200000 },
    { month: 'Jun', revenue: 26800000, expenses: 7300000 },
    { month: 'Jul', revenue: totalCollected, expenses: totalExpenses },
  ];

  // Class enrollment data
  const classDistributionData = classes.map((c) => ({
    name: c.name,
    students: c.currentCount,
    capacity: c.maxCapacity,
    percentage: Math.round((c.currentCount / c.maxCapacity) * 100),
  }));

  const pieColors = ['#162825', '#315750', '#e2848a', '#f5ded7', '#2d4e48'];

  return (
    <div className="space-y-6 pb-12">
      {/* Top 3 Primary Cards (Inspired directly by the reference image layout) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Card 1: Dark Slate Green Financial Revenue Hero */}
        <div className="lg:col-span-4 bg-[#162825] text-white rounded-3xl p-6 shadow-xl relative overflow-hidden flex flex-col justify-between border border-[#23423d]">
          {/* Top Label & Dropdown */}
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-2xl bg-[#23423d] flex items-center justify-center text-[#f5ded7] border border-[#315750]">
              <CreditCard className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-semibold bg-[#23423d] text-[#f5ded7] px-3 py-1 rounded-full border border-[#315750]">
              {schoolSettings.currentTerm} 2026
            </span>
          </div>

          {/* Metric */}
          <div className="my-5">
            <p className="text-xs text-[#a1beba] font-medium">Total Fees Collected</p>
            <h3 className="font-serif text-3xl font-bold text-white mt-1 tracking-tight">
              {formatNaira(totalCollected)}
            </h3>
            <div className="flex items-center gap-2 mt-2 text-xs text-emerald-300 font-medium">
              <span className="flex items-center gap-0.5 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-800/50">
                <TrendingUp className="w-3.5 h-3.5" /> +18.4%
              </span>
              <span className="text-[#8ea8a2]">vs previous term</span>
            </div>
          </div>

          {/* Wavy Chart Curve */}
          <div className="h-16 w-full my-1">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueTrendData}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f5ded7" stopOpacity={0.6} />
                    <stop offset="95%" stopColor="#f5ded7" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="revenue" stroke="#f5ded7" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Action Button */}
          <div className="pt-3 border-t border-[#23423d]">
            <button
              onClick={() => onNavigate('finance')}
              className="w-full bg-[#f5ded7] hover:bg-white text-[#162825] font-bold text-xs py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
            >
              <span>View Bursary Statement</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Card 2: Soft Rose Term & Academic Highlights */}
        <div className="lg:col-span-4 bg-[#fbf0ed] border border-[#f3d3cb] rounded-3xl p-6 flex flex-col justify-between shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-900 bg-rose-100/80 px-3 py-1 rounded-full">
              Active Term Schedule 🌸
            </span>
            <Sparkles className="w-4 h-4 text-rose-500" />
          </div>

          <div className="my-4">
            <h4 className="font-serif text-2xl font-bold text-stone-900 leading-tight">
              3rd Term Final Exams & Report Cards
            </h4>
            <p className="text-xs text-stone-600 mt-2 leading-relaxed">
              Examination period starts July 13th, 2026. Result computation and report card publishing scheduled for August 5th.
            </p>
          </div>

          <div className="space-y-2 bg-white/80 backdrop-blur-sm p-3.5 rounded-2xl border border-rose-200/60 text-xs text-stone-700">
            <div className="flex justify-between items-center">
              <span className="text-stone-500">Students Enrolled:</span>
              <span className="font-bold text-stone-900">{students.length} Students</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-stone-500">Outstanding Fees:</span>
              <span className="font-bold text-rose-700">{formatNaira(totalOutstanding)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-stone-500">Attendance Average:</span>
              <span className="font-bold text-emerald-700">97.2%</span>
            </div>
          </div>

          <button
            onClick={() => onNavigate('results')}
            className="mt-4 w-full bg-[#162825] hover:bg-[#203a36] text-white font-semibold text-xs py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
          >
            <span>Result Computation Engine</span>
            <ChevronRight className="w-4 h-4 text-[#f5ded7]" />
          </button>
        </div>

        {/* Card 3: Academic Calendar & Upcoming Events (Reference image style) */}
        <div className="lg:col-span-4 bg-white border border-stone-200 rounded-3xl p-6 flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-emerald-800" />
                <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider">Academic Calendar (July 2026)</h4>
              </div>
              <span className="text-[10px] text-stone-400 font-semibold">Africa/Lagos</span>
            </div>

            {/* Quick Timeline items */}
            <div className="mt-4 space-y-3">
              <div className="flex items-start gap-3 p-2.5 rounded-xl bg-stone-50 border border-stone-100">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex flex-col items-center justify-center text-[10px] font-bold shrink-0">
                  <span>JUL</span>
                  <span className="text-sm font-extrabold leading-none">13</span>
                </div>
                <div>
                  <h5 className="text-xs font-bold text-stone-800">3rd Term Examination Commences</h5>
                  <p className="text-[11px] text-stone-500">CBT & Paper-based exams across all levels</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-2.5 rounded-xl bg-stone-50 border border-stone-100">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex flex-col items-center justify-center text-[10px] font-bold shrink-0">
                  <span>JUL</span>
                  <span className="text-sm font-extrabold leading-none">25</span>
                </div>
                <div>
                  <h5 className="text-xs font-bold text-stone-800">Inter-House Sports & Cultural Day</h5>
                  <p className="text-[11px] text-stone-500">Main Bowl Stadium, Ikeja</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-2.5 rounded-xl bg-stone-50 border border-stone-100">
                <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-800 flex flex-col items-center justify-center text-[10px] font-bold shrink-0">
                  <span>AUG</span>
                  <span className="text-sm font-extrabold leading-none">05</span>
                </div>
                <div>
                  <h5 className="text-xs font-bold text-stone-800">Report Card Release & Vacation</h5>
                  <p className="text-[11px] text-stone-500">Publish report cards on Parent Portal</p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-stone-100 mt-2 flex items-center justify-between text-xs text-[#162825] font-bold">
            <button onClick={() => onNavigate('academics')} className="hover:underline flex items-center gap-1 cursor-pointer">
              <span>View Full Academic Structure</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Quick Action Pills Row (Matching reference image icon quick bar) */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <span className="text-xs font-bold text-stone-500 uppercase tracking-wider px-2">Quick Actions:</span>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onOpenNewAdmission}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-50 text-emerald-900 border border-emerald-200 hover:bg-emerald-100 text-xs font-semibold transition-all cursor-pointer"
          >
            <PlusCircle className="w-4 h-4 text-emerald-700" />
            <span>New Student Admission</span>
          </button>

          <button
            onClick={() => onNavigate('finance')}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100 text-xs font-semibold transition-all cursor-pointer"
          >
            <CreditCard className="w-4 h-4 text-amber-700" />
            <span>Record Fee Payment</span>
          </button>

          <button
            onClick={() => onNavigate('results')}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-blue-50 text-blue-900 border border-blue-200 hover:bg-blue-100 text-xs font-semibold transition-all cursor-pointer"
          >
            <FileCheck2 className="w-4 h-4 text-blue-700" />
            <span>Compute Report Cards</span>
          </button>

          <button
            onClick={() => onNavigate('timetable_attendance')}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-purple-50 text-purple-900 border border-purple-200 hover:bg-purple-100 text-xs font-semibold transition-all cursor-pointer"
          >
            <Calendar className="w-4 h-4 text-purple-700" />
            <span>Attendance Roll Call</span>
          </button>
        </div>
      </div>

      {/* Second Row: Financial Snapshot Chart + Class Capacity Distribution + Audit Trail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Financial Chart */}
        <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-stone-200 shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-stone-100">
            <div>
              <h4 className="font-serif text-lg font-bold text-stone-900">Bursary Income vs Expense Snapshot</h4>
              <p className="text-xs text-stone-500">Academic Year 2026/2027 Revenue Growth (in ₦ Millions)</p>
            </div>
            <div className="text-right">
              <span className="text-xs text-stone-400">Net Surplus:</span>
              <p className="text-sm font-bold text-emerald-700">{formatNaira(netRevenue)}</p>
            </div>
          </div>

          <div className="h-64 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueTrendData}>
                <defs>
                  <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#162825" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#162825" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="expGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#e2848a" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#e2848a" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#a8a29e" fontSize={11} />
                <YAxis
                  stroke="#a8a29e"
                  fontSize={11}
                  tickFormatter={(val) => `₦${(val / 1000000).toFixed(1)}M`}
                />
                <Tooltip
                  formatter={(value: any) => [formatNaira(Number(value)), 'Amount']}
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e7e5e4', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="revenue" name="Fee Revenue" stroke="#162825" strokeWidth={2} fill="url(#incomeGrad)" />
                <Area type="monotone" dataKey="expenses" name="School Expenses" stroke="#e2848a" strokeWidth={2} fill="url(#expGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Class Enrolment Progress Overview */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-stone-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h4 className="font-serif text-lg font-bold text-stone-900">Class Arm Enrollment</h4>
              <span className="text-xs text-stone-500 font-semibold">Active Classes</span>
            </div>

            <div className="mt-4 space-y-3.5">
              {classDistributionData.map((cls) => (
                <div key={cls.name} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold text-stone-800">
                    <span>{cls.name}</span>
                    <span className="text-stone-500">{cls.students} / {cls.capacity} Students ({cls.percentage}%)</span>
                  </div>
                  <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        cls.percentage >= 90 ? 'bg-amber-500' : 'bg-[#162825]'
                      }`}
                      style={{ width: `${cls.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => onNavigate('academics')}
            className="mt-4 w-full py-2 bg-stone-50 hover:bg-stone-100 text-stone-800 text-xs font-bold rounded-xl border border-stone-200 transition-all cursor-pointer"
          >
            Manage Class Arms & Capacity
          </button>
        </div>
      </div>

      {/* Audit Log Activity Feed */}
      <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-stone-500" />
            <h4 className="font-serif text-lg font-bold text-stone-900">Live System Security & Audit Log</h4>
          </div>
          <span className="text-xs text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full font-semibold border border-emerald-200">
            Real-time Audit
          </span>
        </div>

        <div className="mt-4 divide-y divide-stone-100">
          {auditLogs.map((log) => (
            <div key={log.id} className="py-3 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#162825] text-white flex items-center justify-center font-bold text-[10px]">
                  {log.userName.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-stone-800">{log.action}</p>
                  <p className="text-stone-500 text-[11px]">{log.details}</p>
                </div>
              </div>
              <div className="text-right text-[11px] text-stone-400">
                <p className="font-medium text-stone-600">{log.userName}</p>
                <p>{log.timestamp}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
