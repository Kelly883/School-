import React, { useState } from 'react';
import {
  BellRing,
  Send,
  Mail,
  MessageSquare,
  Clock,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Sliders,
  Sparkles,
  FileText,
  Search,
  Check,
  X,
  Phone,
  ShieldCheck,
  Zap,
  Server,
  ChevronRight,
  Filter,
  Eye,
  RotateCcw
} from 'lucide-react';
import { Invoice, StudentProfile, SchoolSettings, OverdueAlertLog } from '../../types';
import { formatNaira } from '../../utils/formatters';

interface OverdueAlertsTabProps {
  invoices: Invoice[];
  students: StudentProfile[];
  schoolSettings: SchoolSettings;
  overdueAlerts: OverdueAlertLog[];
  onTriggerOverdueAlerts: (
    selectedInvoiceIds: string[],
    channel: 'Email' | 'SMS' | 'Both' | 'Portal Message',
    customTemplate?: string
  ) => void;
}

export const OverdueAlertsTab: React.FC<OverdueAlertsTabProps> = ({
  invoices,
  students,
  schoolSettings,
  overdueAlerts,
  onTriggerOverdueAlerts,
}) => {
  const currentDateStr = new Date().toISOString().split('T')[0];

  // Identify overdue invoices (status 'Overdue' or balance > 0 and past due date)
  const overdueInvoices = invoices.filter((inv) => {
    return inv.balance > 0 && (inv.status === 'Overdue' || inv.dueDate < currentDateStr);
  });

  const [selectedInvoiceIds, setSelectedInvoiceIds] = useState<string[]>(
    overdueInvoices.map((inv) => inv.id)
  );
  const [selectedChannel, setSelectedChannel] = useState<'Email' | 'SMS' | 'Both' | 'Portal Message'>('Both');
  const [messageTemplate, setMessageTemplate] = useState<string>(
    `OVERDUE SCHOOL FEE REMINDER:\nDear {parent_name}, this is an urgent notice from {school_name} Bursary Office. Fee invoice {invoice_no} for {student_name} ({admission_no}) has an outstanding balance of {amount_due} that was due on {due_date}.\n\nPlease settle immediately to avoid restrictions. Thank you.`
  );
  const [isAutoScheduleActive, setIsAutoScheduleActive] = useState(true);
  const [autoScheduleTime, setAutoScheduleTime] = useState('08:00');
  const [gracePeriodDays, setGracePeriodDays] = useState(1);
  const [smsGatewayProvider, setSmsGatewayProvider] = useState('Termii Nigeria (Primary)');
  const [smtpStatus, setSmtpStatus] = useState('Connected (bursary@apexroyal.edu.ng)');
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [activeTab, setActiveTab] = useState<'campaign' | 'history' | 'settings'>('campaign');
  const [isSending, setIsSending] = useState(false);
  const [previewModalAlert, setPreviewModalAlert] = useState<OverdueAlertLog | null>(null);
  const [showSuccessBanner, setShowSuccessBanner] = useState<string | null>(null);

  // Filter logs
  const filteredAlertLogs = overdueAlerts.filter((log) => {
    const matchesSearch =
      log.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.parentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.parentPhone.includes(searchTerm);
    const matchesStatus = statusFilter === 'All' || log.channel === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalOverdueAmount = overdueInvoices.reduce((acc, inv) => acc + inv.balance, 0);

  const handleSelectAll = () => {
    if (selectedInvoiceIds.length === overdueInvoices.length) {
      setSelectedInvoiceIds([]);
    } else {
      setSelectedInvoiceIds(overdueInvoices.map((i) => i.id));
    }
  };

  const handleToggleInvoice = (id: string) => {
    if (selectedInvoiceIds.includes(id)) {
      setSelectedInvoiceIds(selectedInvoiceIds.filter((item) => item !== id));
    } else {
      setSelectedInvoiceIds([...selectedInvoiceIds, id]);
    }
  };

  const handleRunCampaign = () => {
    if (selectedInvoiceIds.length === 0) return;

    setIsSending(true);
    setTimeout(() => {
      onTriggerOverdueAlerts(selectedInvoiceIds, selectedChannel, messageTemplate);
      setIsSending(false);
      setShowSuccessBanner(
        `Automated notification dispatch complete! Sent ${selectedChannel} alerts to ${selectedInvoiceIds.length} parent contact(s).`
      );
      setTimeout(() => setShowSuccessBanner(null), 6000);
    }, 1200);
  };

  const getStudentParentInfo = (studentId: string) => {
    const st = students.find((s) => s.id === studentId);
    if (!st) return { parentName: 'Parent / Guardian', phone: '+234 800 000 0000', email: 'parent@gmail.com' };
    return {
      parentName: st.parent.fatherName || st.parent.motherName || 'Parent',
      phone: st.parent.phone,
      email: st.parent.email,
    };
  };

  return (
    <div className="space-y-6">
      {/* Success Notification Banner */}
      {showSuccessBanner && (
        <div className="bg-emerald-800 text-white p-4 rounded-2xl shadow-lg flex items-center justify-between gap-3 animate-fade-in border border-emerald-600">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-700/80 rounded-xl">
              <CheckCircle2 className="w-5 h-5 text-emerald-200" />
            </div>
            <div>
              <p className="font-bold text-xs uppercase tracking-wide text-emerald-200">System Notification Dispatched</p>
              <p className="text-xs font-semibold">{showSuccessBanner}</p>
            </div>
          </div>
          <button
            onClick={() => setShowSuccessBanner(null)}
            className="text-white/70 hover:text-white p-1 rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-rose-50 text-rose-800 rounded-2xl border border-rose-100">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-stone-500">Total Overdue Invoices</p>
            <p className="font-serif text-2xl font-extrabold text-stone-900 mt-0.5">
              {overdueInvoices.length} <span className="text-xs font-sans text-rose-700 font-semibold">({formatNaira(totalOverdueAmount)})</span>
            </p>
            <p className="text-[10px] text-stone-400 mt-0.5">Awaiting automated alerts</p>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-800 rounded-2xl border border-emerald-100">
            <Send className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-stone-500">Alerts Sent To Date</p>
            <p className="font-serif text-2xl font-extrabold text-stone-900 mt-0.5">
              {overdueAlerts.length} <span className="text-xs font-sans text-emerald-700 font-semibold">(100% Logged)</span>
            </p>
            <p className="text-[10px] text-stone-400 mt-0.5">SMS & Email dispatch ledger</p>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-amber-50 text-amber-800 rounded-2xl border border-amber-100">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-stone-500">Auto Scan Scheduler</p>
            <p className="font-serif text-lg font-bold text-stone-900 mt-0.5 flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Active @ {autoScheduleTime} AM</span>
            </p>
            <p className="text-[10px] text-stone-400 mt-0.5">Daily automated scan engine</p>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-[#162825] text-[#f5ded7] rounded-2xl">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-stone-500">SMS Gateway Status</p>
            <p className="font-serif text-base font-bold text-emerald-800 mt-0.5 flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600" /> Connected
            </p>
            <p className="text-[10px] text-stone-400 mt-0.5">{smsGatewayProvider}</p>
          </div>
        </div>
      </div>

      {/* Mode Sub-Tabs */}
      <div className="bg-white p-2 rounded-2xl border border-stone-200 shadow-xs flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setActiveTab('campaign')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'campaign'
                ? 'bg-[#162825] text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            <BellRing className="w-4 h-4" />
            <span>Overdue Scan & Auto Alert Runner ({overdueInvoices.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'history'
                ? 'bg-[#162825] text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Notification Delivery History ({overdueAlerts.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'settings'
                ? 'bg-[#162825] text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>Gateway & Automation Config</span>
          </button>
        </div>

        <div className="flex items-center gap-2 pr-2">
          <span className="text-[10px] font-bold text-stone-500 bg-stone-100 px-2.5 py-1 rounded-full border border-stone-200">
            {schoolSettings.schoolName} Bursary Automation
          </span>
        </div>
      </div>

      {/* TAB 1: CAMPAIGN RUNNER */}
      {activeTab === 'campaign' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Overdue Invoices Selection Table */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden flex flex-col">
            <div className="p-4 border-b border-stone-100 bg-stone-50/50 flex items-center justify-between">
              <div>
                <h3 className="font-serif font-bold text-stone-900 text-sm flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  <span>Detected Overdue Fee Invoices</span>
                </h3>
                <p className="text-[11px] text-stone-500">
                  Select student invoices to include in the automated SMS & Email dispatch campaign.
                </p>
              </div>

              <button
                onClick={handleSelectAll}
                className="text-xs font-bold text-[#162825] hover:underline cursor-pointer bg-white border border-stone-200 px-3 py-1 rounded-lg"
              >
                {selectedInvoiceIds.length === overdueInvoices.length ? 'Deselect All' : 'Select All'}
              </button>
            </div>

            <div className="divide-y divide-stone-100 max-h-[500px] overflow-y-auto">
              {overdueInvoices.length === 0 ? (
                <div className="p-12 text-center space-y-2">
                  <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
                  <p className="font-bold text-stone-800 text-sm">No Overdue Invoices Detected!</p>
                  <p className="text-xs text-stone-500">All student fee accounts are currently up to date.</p>
                </div>
              ) : (
                overdueInvoices.map((inv) => {
                  const parent = getStudentParentInfo(inv.studentId);
                  const isChecked = selectedInvoiceIds.includes(inv.id);

                  return (
                    <div
                      key={inv.id}
                      onClick={() => handleToggleInvoice(inv.id)}
                      className={`p-4 flex items-center justify-between gap-3 cursor-pointer transition-colors ${
                        isChecked ? 'bg-amber-50/40' : 'hover:bg-stone-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}}
                          className="w-4 h-4 text-[#162825] rounded accent-[#162825] cursor-pointer"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-stone-900 text-xs">{inv.studentName}</span>
                            <span className="text-[10px] font-mono bg-stone-100 text-stone-600 px-2 py-0.5 rounded">
                              {inv.admissionNo}
                            </span>
                            <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                              Due: {inv.dueDate}
                            </span>
                          </div>
                          <p className="text-[11px] text-stone-500 mt-0.5">
                            Invoice: <strong className="font-mono text-stone-700">{inv.invoiceNumber}</strong> • Parent: {parent.parentName} ({parent.phone})
                          </p>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <p className="font-extrabold text-rose-700 text-sm">{formatNaira(inv.balance)}</p>
                        <p className="text-[10px] text-stone-400">Total: {formatNaira(inv.totalAmount)}</p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div className="p-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between text-xs text-stone-600">
              <span>Selected for dispatch: <strong className="text-stone-900 font-bold">{selectedInvoiceIds.length} of {overdueInvoices.length}</strong></span>
              <span>Total balance: <strong className="text-rose-700 font-bold">{formatNaira(overdueInvoices.filter(i => selectedInvoiceIds.includes(i.id)).reduce((a,b) => a + b.balance, 0))}</strong></span>
            </div>
          </div>

          {/* Right Column: Alert Template & Dispatch Trigger Controls */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-sm space-y-4">
              <div className="flex items-center gap-2 border-b border-stone-100 pb-3">
                <Sparkles className="w-5 h-5 text-amber-600" />
                <div>
                  <h3 className="font-serif font-bold text-stone-900 text-sm">Alert Channel & Template Builder</h3>
                  <p className="text-[11px] text-stone-500">Configure message body and gateway channels.</p>
                </div>
              </div>

              {/* Notification Channel Select */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700">Dispatch Channels</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setSelectedChannel('Both')}
                    className={`p-2.5 rounded-xl border text-xs font-bold flex items-center gap-2 cursor-pointer transition-all ${
                      selectedChannel === 'Both'
                        ? 'bg-[#162825] text-white border-[#162825] shadow-xs'
                        : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                    }`}
                  >
                    <Send className="w-3.5 h-3.5 text-amber-400" />
                    <span>Email & SMS (Both)</span>
                  </button>

                  <button
                    onClick={() => setSelectedChannel('SMS')}
                    className={`p-2.5 rounded-xl border text-xs font-bold flex items-center gap-2 cursor-pointer transition-all ${
                      selectedChannel === 'SMS'
                        ? 'bg-[#162825] text-white border-[#162825] shadow-xs'
                        : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                    }`}
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                    <span>SMS Gateway Only</span>
                  </button>

                  <button
                    onClick={() => setSelectedChannel('Email')}
                    className={`p-2.5 rounded-xl border text-xs font-bold flex items-center gap-2 cursor-pointer transition-all ${
                      selectedChannel === 'Email'
                        ? 'bg-[#162825] text-white border-[#162825] shadow-xs'
                        : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                    }`}
                  >
                    <Mail className="w-3.5 h-3.5 text-blue-400" />
                    <span>Email Service Only</span>
                  </button>

                  <button
                    onClick={() => setSelectedChannel('Portal Message')}
                    className={`p-2.5 rounded-xl border text-xs font-bold flex items-center gap-2 cursor-pointer transition-all ${
                      selectedChannel === 'Portal Message'
                        ? 'bg-[#162825] text-white border-[#162825] shadow-xs'
                        : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                    }`}
                  >
                    <BellRing className="w-3.5 h-3.5 text-purple-400" />
                    <span>Portal Inbox Message</span>
                  </button>
                </div>
              </div>

              {/* Dynamic Template Variables Helpers */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-stone-700">Message Content Template</label>
                  <span className="text-[10px] text-stone-400">Insert tags below</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {['{parent_name}', '{student_name}', '{invoice_no}', '{amount_due}', '{due_date}', '{school_name}'].map(
                    (tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => setMessageTemplate((prev) => prev + ' ' + tag)}
                        className="text-[10px] bg-stone-100 hover:bg-stone-200 border border-stone-200 text-stone-700 font-mono px-2 py-0.5 rounded cursor-pointer"
                      >
                        {tag}
                      </button>
                    )
                  )}
                </div>
                <textarea
                  rows={6}
                  value={messageTemplate}
                  onChange={(e) => setMessageTemplate(e.target.value)}
                  className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 font-sans focus:outline-none focus:ring-2 focus:ring-[#162825]"
                />
              </div>

              {/* Action Trigger Button */}
              <button
                disabled={selectedInvoiceIds.length === 0 || isSending}
                onClick={handleRunCampaign}
                className="w-full py-3.5 bg-[#162825] hover:bg-[#203a36] disabled:opacity-50 text-[#f5ded7] font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
              >
                {isSending ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-amber-300" />
                    <span>Transmitting Alerts via Gateways...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 text-[#f5ded7]" />
                    <span>
                      Trigger Overdue Alert Campaign ({selectedInvoiceIds.length} Recipient{selectedInvoiceIds.length === 1 ? '' : 's'})
                    </span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SENT NOTIFICATIONS AUDIT LOG */}
      {activeTab === 'history' && (
        <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden space-y-0">
          <div className="p-4 border-b border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-stone-50/50">
            <div>
              <h3 className="font-serif font-bold text-stone-900 text-base">Overdue Alert Delivery History</h3>
              <p className="text-[11px] text-stone-500">Track SMS & Email dispatch timestamps, recipient phone numbers, and delivery states.</p>
            </div>

            <div className="flex items-center gap-2 max-w-lg w-full sm:w-auto">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search student, parent, invoice #, phone..."
                  className="w-full pl-9 pr-3 py-2 bg-white border border-stone-200 rounded-xl text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#162825]"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="p-2 bg-white border border-stone-200 rounded-xl text-xs font-bold text-stone-700 focus:outline-none"
              >
                <option value="All">All Channels</option>
                <option value="Both">Both (Email & SMS)</option>
                <option value="SMS">SMS Only</option>
                <option value="Email">Email Only</option>
                <option value="Portal Message">Portal Message</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-stone-700">
              <thead className="bg-stone-50 text-stone-500 uppercase font-bold text-[10px] tracking-wider border-b border-stone-200">
                <tr>
                  <th className="py-3.5 px-4">Alert Serial Ref</th>
                  <th className="py-3.5 px-4">Student & Admission</th>
                  <th className="py-3.5 px-4">Parent Recipient & Phone</th>
                  <th className="py-3.5 px-4">Invoice # & Balance</th>
                  <th className="py-3.5 px-4">Channel</th>
                  <th className="py-3.5 px-4">Sent Date & Time</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredAlertLogs.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-stone-400">
                      No overdue alert notification history found matching filters.
                    </td>
                  </tr>
                ) : (
                  filteredAlertLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-stone-50 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-stone-900">{log.id}</td>
                      <td className="py-3.5 px-4 font-bold text-stone-800">
                        <p>{log.studentName}</p>
                        <p className="text-[10px] text-stone-400 font-mono font-normal">{log.admissionNo}</p>
                      </td>
                      <td className="py-3.5 px-4 text-stone-700 font-medium">
                        <p className="font-bold">{log.parentName}</p>
                        <p className="text-[10px] text-stone-500 font-mono flex items-center gap-1">
                          <Phone className="w-3 h-3 text-stone-400" /> {log.parentPhone}
                        </p>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-stone-800">
                        <p className="font-bold">{log.invoiceNumber}</p>
                        <p className="text-[11px] text-rose-700 font-extrabold">{formatNaira(log.amountDue)}</p>
                      </td>
                      <td className="py-3.5 px-4 font-bold">
                        <span className="bg-stone-100 text-stone-800 px-2.5 py-0.5 rounded-full border border-stone-200 text-[10px]">
                          {log.channel}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-stone-600 font-mono text-[11px]">{log.sentAt}</td>
                      <td className="py-3.5 px-4">
                        <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 w-fit">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" /> {log.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => setPreviewModalAlert(log)}
                          className="px-2.5 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-[11px] rounded-lg transition-all cursor-pointer inline-flex items-center gap-1"
                        >
                          <Eye className="w-3 h-3 text-stone-600" />
                          <span>Inspect Alert</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: AUTOMATION & GATEWAY SETTINGS */}
      {activeTab === 'settings' && (
        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-6 max-w-3xl mx-auto">
          <div className="border-b border-stone-200 pb-4">
            <h3 className="font-serif font-bold text-stone-900 text-lg flex items-center gap-2">
              <Sliders className="w-5 h-5 text-[#162825]" />
              <span>Automated Overdue Notification Engine Settings</span>
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Configure background CRON execution times, SMS API gateway secrets, and email SMTP parameters.
            </p>
          </div>

          <div className="space-y-5 text-xs text-stone-800">
            {/* Auto Schedule Switch */}
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex items-center justify-between">
              <div>
                <p className="font-bold text-stone-900 text-sm">Automated Daily Background Scan</p>
                <p className="text-[11px] text-stone-500">Automatically scan fee database every morning and trigger overdue alerts.</p>
              </div>
              <button
                onClick={() => setIsAutoScheduleActive(!isAutoScheduleActive)}
                className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                  isAutoScheduleActive ? 'bg-[#162825]' : 'bg-stone-300'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                    isAutoScheduleActive ? 'left-7' : 'left-1'
                  }`}
                />
              </button>
            </div>

            {/* Schedule Time & Grace Period */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="font-bold text-stone-700">Scheduled Execution Time (Daily)</label>
                <input
                  type="time"
                  value={autoScheduleTime}
                  onChange={(e) => setAutoScheduleTime(e.target.value)}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-bold text-stone-800 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-stone-700">Grace Period Before Alert (Days)</label>
                <input
                  type="number"
                  min={0}
                  max={30}
                  value={gracePeriodDays}
                  onChange={(e) => setGracePeriodDays(Number(e.target.value))}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-bold text-stone-800 focus:outline-none"
                />
              </div>
            </div>

            {/* SMS Gateway Provider Config */}
            <div className="space-y-1.5">
              <label className="font-bold text-stone-700">Primary SMS Gateway Provider (Nigeria/West Africa)</label>
              <select
                value={smsGatewayProvider}
                onChange={(e) => setSmsGatewayProvider(e.target.value)}
                className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-bold text-stone-800 focus:outline-none"
              >
                <option value="Termii Nigeria (Primary)">Termii Nigeria (API Key: Live Connected)</option>
                <option value="Twilio SMS API">Twilio Global SMS Service</option>
                <option value="BulkSMS Nigeria">BulkSMS Nigeria Direct Gateway</option>
                <option value="AfricasTalking">Africa's Talking SMS API</option>
              </select>
            </div>

            {/* Email SMTP Gateway */}
            <div className="space-y-1.5">
              <label className="font-bold text-stone-700">Email SMTP Server Status</label>
              <input
                type="text"
                readOnly
                value={smtpStatus}
                className="w-full p-2.5 bg-stone-100 border border-stone-200 rounded-xl text-xs font-mono font-bold text-emerald-800"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => {
                  setShowSuccessBanner('Overdue Notification Service Configuration saved successfully.');
                  setTimeout(() => setShowSuccessBanner(null), 4000);
                }}
                className="px-5 py-2.5 bg-[#162825] hover:bg-[#203a36] text-white font-bold text-xs rounded-xl cursor-pointer shadow-md"
              >
                Save Settings
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Inspect Sent Alert Content */}
      {previewModalAlert && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-full">
                  Dispatched Alert Details
                </span>
                <h3 className="font-serif font-bold text-stone-900 text-base mt-1">{previewModalAlert.id}</h3>
              </div>
              <button
                onClick={() => setPreviewModalAlert(null)}
                className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 text-xs text-stone-800">
              <div className="flex justify-between py-1 border-b border-stone-100">
                <span className="text-stone-500">Student:</span>
                <span className="font-bold">{previewModalAlert.studentName} ({previewModalAlert.admissionNo})</span>
              </div>
              <div className="flex justify-between py-1 border-b border-stone-100">
                <span className="text-stone-500">Parent Recipient:</span>
                <span className="font-bold">{previewModalAlert.parentName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-stone-100">
                <span className="text-stone-500">Parent Contact:</span>
                <span className="font-mono">{previewModalAlert.parentPhone} / {previewModalAlert.parentEmail}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-stone-100">
                <span className="text-stone-500">Invoice Number:</span>
                <span className="font-mono font-bold">{previewModalAlert.invoiceNumber}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-stone-100">
                <span className="text-stone-500">Amount Past Due:</span>
                <span className="font-bold text-rose-700">{formatNaira(previewModalAlert.amountDue)}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-stone-100">
                <span className="text-stone-500">Channel Dispatched:</span>
                <span className="font-bold text-stone-900">{previewModalAlert.channel}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-stone-100">
                <span className="text-stone-500">Sent Timestamp:</span>
                <span className="font-mono">{previewModalAlert.sentAt}</span>
              </div>

              <div className="pt-2 space-y-1">
                <label className="text-stone-500 font-bold text-[11px]">Transmitted Message Body:</label>
                <div className="p-3 bg-stone-50 border border-stone-200 rounded-xl text-[11px] text-stone-800 font-sans leading-relaxed">
                  {previewModalAlert.messageSnippet}
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setPreviewModalAlert(null)}
                className="py-2 px-4 bg-stone-100 hover:bg-stone-200 font-bold text-xs text-stone-800 rounded-xl cursor-pointer"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
