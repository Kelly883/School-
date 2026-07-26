import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';

import { PublicWebsite } from './components/public/PublicWebsite';

// Dashboards
import { AdminDashboard } from './components/dashboard/AdminDashboard';
import { TeacherDashboard } from './components/dashboard/TeacherDashboard';
import { ParentDashboard } from './components/dashboard/ParentDashboard';
import { StudentDashboard } from './components/dashboard/StudentDashboard';

// Modules
import { StudentList } from './components/students/StudentList';
import { AdmissionForm } from './components/students/AdmissionForm';
import { StudentProfileModal } from './components/students/StudentProfileModal';
import { ScoreUpload } from './components/results/ScoreUpload';
import { ReportCardGenerator } from './components/results/ReportCardGenerator';
import { FeeStructures } from './components/finance/FeeStructures';
import { FeePayments } from './components/finance/FeePayments';
import { PaymentGatewayModal } from './components/finance/PaymentGatewayModal';
import { TimetableAttendance } from './components/timetable/TimetableAttendance';
import { CBTModule } from './components/cbt/CBTModule';
import { CommunicationModule } from './components/communication/CommunicationModule';
import { AcademicsModule } from './components/academics/AcademicsModule';
import { LibraryInventoryModule } from './components/library_inventory/LibraryInventoryModule';
import { AuditSettingsModule } from './components/audit_settings/AuditSettingsModule';

// Mock Data
import {
  INITIAL_USERS,
  INITIAL_STUDENTS,
  INITIAL_CLASSES,
  INITIAL_FEE_STRUCTURES,
  INITIAL_INVOICES,
  INITIAL_PAYMENTS,
  INITIAL_EXPENSES,
  INITIAL_REPORT_CARDS,
  INITIAL_TIMETABLE,
  INITIAL_ATTENDANCE,
  INITIAL_CBT_EXAMS,
  INITIAL_MESSAGES,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_BOOKS,
  INITIAL_INVENTORY,
  INITIAL_AUDIT_LOGS,
  INITIAL_REFUNDS,
  INITIAL_OVERDUE_ALERTS,
  INITIAL_SCHOOL_SETTINGS,
  INITIAL_TERMS
} from './data/mockData';

import {
  User,
  StudentProfile,
  ClassStructure,
  FeeStructure,
  Invoice,
  PaymentRecord,
  RefundRecord,
  RefundStatus,
  OverdueAlertLog,
  AuditLog,
  ReportCard,
  AttendanceEntry,
  Message,
  SchoolSettings,
  SubjectScore
} from './types';

export function App() {
  // State initialization
  const [currentUser, setCurrentUser] = useState<User>(INITIAL_USERS[0]); // Default: Super Admin
  const [currentTab, setCurrentTab] = useState<string>('public_website'); // Default view: Module 0 Public Website
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Modals & Active Selections
  const [isAdmissionFormOpen, setIsAdmissionFormOpen] = useState(false);
  const [selectedStudentForProfile, setSelectedStudentForProfile] = useState<StudentProfile | null>(null);
  const [isPaymentGatewayOpen, setIsPaymentGatewayOpen] = useState(false);
  const [paymentModalStudent, setPaymentModalStudent] = useState<StudentProfile | undefined>(undefined);
  const [paymentModalInvoice, setPaymentModalInvoice] = useState<Invoice | undefined>(undefined);

  // Core Data State
  const [students, setStudents] = useState<StudentProfile[]>(INITIAL_STUDENTS);
  const [classes, setClasses] = useState<ClassStructure[]>(INITIAL_CLASSES);
  const [feeStructures, setFeeStructures] = useState<FeeStructure[]>(INITIAL_FEE_STRUCTURES);
  const [invoices, setInvoices] = useState<Invoice[]>(INITIAL_INVOICES);
  const [payments, setPayments] = useState<PaymentRecord[]>(INITIAL_PAYMENTS);
  const [refunds, setRefunds] = useState<RefundRecord[]>(INITIAL_REFUNDS);
  const [overdueAlerts, setOverdueAlerts] = useState<OverdueAlertLog[]>(INITIAL_OVERDUE_ALERTS);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(INITIAL_AUDIT_LOGS);
  const [reportCards, setReportCards] = useState<ReportCard[]>(INITIAL_REPORT_CARDS);
  const [attendance, setAttendance] = useState<AttendanceEntry[]>(INITIAL_ATTENDANCE);
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [schoolSettings, setSchoolSettings] = useState<SchoolSettings>(INITIAL_SCHOOL_SETTINGS);

  // Handlers
  const handleTriggerOverdueAlerts = (
    selectedInvoiceIds: string[],
    channel: 'Email' | 'SMS' | 'Both' | 'Portal Message',
    customTemplate?: string
  ) => {
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);
    const newAlertLogs: OverdueAlertLog[] = [];
    const newMessages: Message[] = [];

    selectedInvoiceIds.forEach((invId) => {
      const inv = invoices.find((i) => i.id === invId);
      if (!inv) return;

      const student = students.find((s) => s.id === inv.studentId);
      const parentName = student?.parent.fatherName || student?.parent.motherName || 'Parent';
      const parentPhone = student?.parent.phone || '+234 800 000 0000';
      const parentEmail = student?.parent.email || 'parent@gmail.com';

      // Build text snippet
      let text = customTemplate || `OVERDUE SCHOOL FEE REMINDER: Dear {parent_name}, invoice {invoice_no} for {student_name} of {amount_due} is past due since {due_date}. Kindly settle via the portal.`;
      text = text
        .replace(/{parent_name}/g, parentName)
        .replace(/{student_name}/g, inv.studentName)
        .replace(/{admission_no}/g, inv.admissionNo)
        .replace(/{invoice_no}/g, inv.invoiceNumber)
        .replace(/{amount_due}/g, `₦${inv.balance.toLocaleString()}`)
        .replace(/{due_date}/g, inv.dueDate)
        .replace(/{school_name}/g, schoolSettings.schoolName);

      const alertLog: OverdueAlertLog = {
        id: `alert-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        invoiceId: inv.id,
        invoiceNumber: inv.invoiceNumber,
        studentId: inv.studentId,
        studentName: inv.studentName,
        admissionNo: inv.admissionNo,
        parentName,
        parentPhone,
        parentEmail,
        amountDue: inv.balance,
        dueDate: inv.dueDate,
        channel,
        sentAt: nowStr,
        status: 'Delivered',
        messageSnippet: text,
      };

      newAlertLogs.push(alertLog);

      // Create in-portal message for the parent
      const portalMsg: Message = {
        id: `msg-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        senderId: currentUser.id,
        senderName: `${currentUser.name} (Bursary Auto Alerts)`,
        senderRole: currentUser.role,
        receiverId: inv.studentId,
        receiverName: `${inv.studentName} Parent`,
        subject: `URGENT OVERDUE FEE NOTICE: ${inv.invoiceNumber}`,
        body: text,
        timestamp: nowStr,
        isRead: false,
      };
      newMessages.push(portalMsg);
    });

    setOverdueAlerts((prev) => [...newAlertLogs, ...prev]);
    setMessages((prev) => [...newMessages, ...prev]);

    // Update invoice status to 'Overdue' if balance > 0
    setInvoices((prev) =>
      prev.map((i) => (selectedInvoiceIds.includes(i.id) ? { ...i, status: 'Overdue' } : i))
    );

    // Audit Log
    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      role: currentUser.role,
      action: 'Automated Overdue Alerts Dispatched',
      details: `Triggered ${channel} overdue fee alerts to ${selectedInvoiceIds.length} parent contact(s) via Automated Bursary Engine.`,
      ipAddress: '197.210.226.41',
      timestamp: nowStr,
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  // Handlers
  const handleCreateInvoice = (newInvoice: Invoice) => {
    setInvoices((prev) => [newInvoice, ...prev]);

    // Log to Audit Log
    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      role: currentUser.role,
      action: 'Created Invoice',
      details: `Generated Invoice ${newInvoice.invoiceNumber} (₦${newInvoice.totalAmount.toLocaleString()}) for ${newInvoice.studentName}`,
      ipAddress: '197.210.226.41',
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  const handleAddRefund = (newRefund: RefundRecord) => {
    setRefunds((prev) => [newRefund, ...prev]);

    // Log to Audit Log
    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      role: currentUser.role,
      action: 'Refund Requested',
      details: `Lodged refund request ${newRefund.refundNo} for ₦${newRefund.amount.toLocaleString()} (${newRefund.studentName}). Reason: ${newRefund.reason}`,
      ipAddress: '197.210.226.41',
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  const handleUpdateRefundStatus = (
    refundId: string,
    newStatus: RefundStatus,
    approvedBy: string,
    notes?: string
  ) => {
    let updatedRecord: RefundRecord | undefined;

    setRefunds((prev) =>
      prev.map((r) => {
        if (r.id === refundId) {
          const nowStr = new Date().toISOString().split('T')[0];
          updatedRecord = {
            ...r,
            status: newStatus,
            notes: notes || r.notes,
            ...(newStatus === 'Review' ? { reviewedBy: approvedBy, reviewDate: nowStr } : {}),
            ...(newStatus === 'Approval' ? { approvedBy, approvalDate: nowStr } : {}),
            ...(newStatus === 'Refund Processed'
              ? { processedBy: approvedBy, refundDate: nowStr, parentNotified: true }
              : {}),
          };
          return updatedRecord;
        }
        return r;
      })
    );

    if (updatedRecord) {
      // Append to Audit Logs
      const newLog: AuditLog = {
        id: `log-${Date.now()}`,
        userId: currentUser.id,
        userName: currentUser.name,
        role: currentUser.role,
        action: `Refund ${newStatus}`,
        details: `Advanced refund ${updatedRecord.refundNo} (₦${updatedRecord.amount.toLocaleString()}) for ${updatedRecord.studentName} to ${newStatus}`,
        ipAddress: '197.210.226.41',
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      };
      setAuditLogs((prev) => [newLog, ...prev]);

      // If refund is processed, send automatic notification message to parent
      if (newStatus === 'Refund Processed') {
        const parentMsg: Message = {
          id: `msg-${Date.now()}`,
          senderId: currentUser.id,
          senderName: `${currentUser.name} (Bursary Office)`,
          senderRole: currentUser.role,
          receiverId: updatedRecord.studentId,
          receiverName: `${updatedRecord.studentName} Parent`,
          subject: `Refund Processed: ${updatedRecord.refundNo}`,
          body: `Dear Parent, your fee refund request (${updatedRecord.refundNo}) of ₦${updatedRecord.amount.toLocaleString()} for ${updatedRecord.studentName} (${updatedRecord.admissionNo}) has been fully processed and disbursed. Reason: ${updatedRecord.reason}.`,
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
          isRead: false,
        };
        setMessages((prev) => [parentMsg, ...prev]);
      }
    }
  };

  // Handlers
  const handleSwitchUser = (user: User) => {
    setCurrentUser(user);
    setCurrentTab('dashboard');
  };

  const handleLogout = () => {
    setCurrentTab('public_website');
  };

  const handleOpenPaymentModal = (student?: StudentProfile, invoice?: Invoice) => {
    setPaymentModalStudent(student);
    setPaymentModalInvoice(invoice);
    setIsPaymentGatewayOpen(true);
  };

  const handleRegisterStudent = (newStudent: StudentProfile) => {
    setStudents((prev) => [newStudent, ...prev]);
    setIsAdmissionFormOpen(false);
    setCurrentTab('students');
  };

  const handleProcessPayment = (newPayment: PaymentRecord, invoiceId?: string) => {
    setPayments((prev) => [newPayment, ...prev]);

    // Audit log
    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      role: currentUser.role,
      action: 'Verified Payment',
      details: `Posted Receipt ${newPayment.receiptNo} (₦${newPayment.amountPaid.toLocaleString()}) for ${newPayment.studentName} (${newPayment.admissionNo}) via ${newPayment.paymentMethod}`,
      ipAddress: '197.210.226.41',
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };
    setAuditLogs((prev) => [newLog, ...prev]);

    // Update invoice balance & status if payment is linked to an invoice
    if (invoiceId || newPayment.invoiceId) {
      const targetInvId = invoiceId || newPayment.invoiceId;
      setInvoices((prev) =>
        prev.map((inv) => {
          if (inv.id === targetInvId) {
            const newAmountPaid = inv.amountPaid + newPayment.amountPaid;
            const newBal = Math.max(0, inv.totalAmount - newAmountPaid);
            const newStatus = newBal === 0 ? 'Paid' : 'Partially Paid';
            return {
              ...inv,
              amountPaid: newAmountPaid,
              balance: newBal,
              status: newStatus,
            };
          }
          return inv;
        })
      );
    }

    // Deduct paid amount from student fee balance
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id === newPayment.studentId) {
          const newBal = Math.max(0, s.feeBalance - newPayment.amountPaid);
          const newStatus = newBal === 0 ? 'Paid' : newBal < 100000 ? 'Partial' : 'Pending';
          return { ...s, feeBalance: newBal, feeStatus: newStatus };
        }
        return s;
      })
    );
  };

  const handleSaveScores = (studentId: string, updatedScores: SubjectScore[]) => {
    setReportCards((prev) =>
      prev.map((r) => {
        if (r.studentId === studentId) {
          const existingScoresMap = new Map<string, SubjectScore>(r.scores.map((s) => [s.subjectName, s]));
          updatedScores.forEach((s) => existingScoresMap.set(s.subjectName, s));
          const scoresArr: SubjectScore[] = Array.from(existingScoresMap.values());
          const totalScore: number = scoresArr.reduce((sum: number, sc: SubjectScore) => sum + sc.total, 0);
          const averageScore: number = scoresArr.length > 0 ? Number((totalScore / scoresArr.length).toFixed(1)) : 0;

          return {
            ...r,
            scores: scoresArr,
            totalScore,
            averageScore,
          };
        }
        return r;
      })
    );
  };

  const handleSendMessage = (msg: Message) => {
    setMessages((prev) => [msg, ...prev]);
  };

  // Active student profile for parent/student role
  const activeUserStudent = students.find((s) => s.id === currentUser.associatedStudentIds?.[0]) || students[0];

  if (currentTab === 'public_website') {
    return <PublicWebsite onLoginSuccess={handleSwitchUser} />;
  }

  return (
    <div className="min-h-screen bg-[#f9f8f6] font-sans text-stone-900 flex flex-col md:flex-row antialiased selection:bg-[#162825] selection:text-[#f5ded7]">
      {/* Navigation Sidebar */}
      <Sidebar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        currentUser={currentUser}
        onLogout={handleLogout}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
      />

      {/* Main Content View Container */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen overflow-x-hidden">
        {/* Top Sticky Header */}
        <Header
          currentUser={currentUser}
          schoolSettings={schoolSettings}
          announcements={INITIAL_ANNOUNCEMENTS}
          onLogout={handleLogout}
          onNavigateToPublic={() => setCurrentTab('public_website')}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          onToggleMobileMenu={() => setIsMobileOpen((prev) => !prev)}
        />

        {/* Dynamic Main Workspace View */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {/* DASHBOARD VIEW */}
          {currentTab === 'dashboard' && (
            <>
              {(currentUser.role === 'super_admin' || currentUser.role === 'admin_bursar') && (
                <AdminDashboard
                  schoolSettings={schoolSettings}
                  students={students}
                  payments={payments}
                  expenses={INITIAL_EXPENSES}
                  auditLogs={auditLogs}
                  classes={classes}
                  onNavigate={setCurrentTab}
                />
              )}

              {currentUser.role === 'teacher' && (
                <TeacherDashboard
                  currentUser={currentUser}
                  students={students}
                  classes={classes}
                  cbtExams={INITIAL_CBT_EXAMS}
                  onNavigate={setCurrentTab}
                />
              )}

              {currentUser.role === 'parent' && (
                <ParentDashboard
                  currentUser={currentUser}
                  students={students}
                  reportCards={reportCards}
                  payments={payments}
                  invoices={invoices}
                  onNavigate={setCurrentTab}
                  onOpenPaymentModal={(stu, inv) => handleOpenPaymentModal(stu, inv)}
                />
              )}

              {currentUser.role === 'student' && (
                <StudentDashboard
                  currentUser={currentUser}
                  studentProfile={activeUserStudent}
                  cbtExams={INITIAL_CBT_EXAMS}
                  timetable={INITIAL_TIMETABLE}
                  reportCards={reportCards}
                  onNavigate={setCurrentTab}
                  onTakeCBT={() => setCurrentTab('cbt')}
                />
              )}
            </>
          )}

          {/* STUDENT DIRECTORY */}
          {(currentTab === 'students' || currentTab === 'add_student') && (
            <StudentList
              students={students}
              onOpenAdmissionForm={() => setIsAdmissionFormOpen(true)}
              onSelectStudent={(stu) => setSelectedStudentForProfile(stu)}
              onRegisterStudent={handleRegisterStudent}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
            />
          )}

          {/* RESULTS & REPORT CARDS */}
          {(currentTab === 'results' || currentTab === 'report_cards' || currentTab === 'scores') && (
            <div className="space-y-6">
              {['super_admin', 'teacher'].includes(currentUser.role) && (
                <div className="flex items-center gap-3 bg-white p-2 rounded-2xl border border-stone-200 w-fit shadow-sm">
                  <button
                    onClick={() => setCurrentTab('results')}
                    className={`px-4 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                      currentTab !== 'scores'
                        ? 'bg-[#162825] text-white shadow-sm font-semibold'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    Report Cards & Transcripts
                  </button>
                  <button
                    onClick={() => setCurrentTab('scores')}
                    className={`px-4 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                      currentTab === 'scores'
                        ? 'bg-[#162825] text-white shadow-sm font-semibold'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    Upload CA & Exam Scores
                  </button>
                </div>
              )}

              {currentTab === 'scores' && ['super_admin', 'teacher'].includes(currentUser.role) ? (
                <ScoreUpload
                  students={students}
                  classes={classes}
                  currentUser={currentUser}
                  onSaveScores={handleSaveScores}
                />
              ) : (
                <ReportCardGenerator
                  reportCards={reportCards}
                  students={students}
                  schoolSettings={schoolSettings}
                />
              )}
            </div>
          )}

          {/* BURSARY & SCHOOL FEES */}
          {(currentTab === 'finance' || currentTab === 'finance_ledger' || currentTab === 'fee_setup') && (
            <div className="space-y-6">
              {['super_admin', 'admin_bursar'].includes(currentUser.role) && (
                <div className="flex items-center gap-3 bg-white p-2 rounded-2xl border border-stone-200 w-fit shadow-sm">
                  <button
                    onClick={() => setCurrentTab('finance')}
                    className={`px-4 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                      currentTab !== 'fee_setup'
                        ? 'bg-[#162825] text-white shadow-sm font-semibold'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    Fee Payments & Receipts
                  </button>
                  <button
                    onClick={() => setCurrentTab('fee_setup')}
                    className={`px-4 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                      currentTab === 'fee_setup'
                        ? 'bg-[#162825] text-white shadow-sm font-semibold'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    Fee Schedule Setup
                  </button>
                </div>
              )}

              {currentTab === 'fee_setup' && ['super_admin', 'admin_bursar'].includes(currentUser.role) ? (
                <FeeStructures
                  feeStructures={feeStructures}
                  onUpdateFeeStructures={setFeeStructures}
                />
              ) : (
                <FeePayments
                  payments={payments}
                  invoices={invoices}
                  students={students}
                  schoolSettings={schoolSettings}
                  refunds={refunds}
                  feeStructures={feeStructures}
                  expenses={INITIAL_EXPENSES}
                  overdueAlerts={overdueAlerts}
                  onOpenPaymentModal={(stu, inv) => handleOpenPaymentModal(stu, inv)}
                  onCreateInvoice={handleCreateInvoice}
                  onAddRefund={handleAddRefund}
                  onUpdateRefundStatus={handleUpdateRefundStatus}
                  onTriggerOverdueAlerts={handleTriggerOverdueAlerts}
                />
              )}
            </div>
          )}

          {/* TIMETABLE & ATTENDANCE ROLL CALL */}
          {(currentTab === 'timetable_attendance' || currentTab === 'timetable') && (
            <TimetableAttendance
              students={students}
              classes={classes}
              timetable={INITIAL_TIMETABLE}
              attendance={attendance}
              onSaveAttendance={(entries) => setAttendance((prev) => [...entries, ...prev])}
            />
          )}

          {/* CBT ONLINE EXAM PORTAL */}
          {currentTab === 'cbt' && (
            <CBTModule
              cbtExams={INITIAL_CBT_EXAMS}
            />
          )}

          {/* MESSAGING & ANNOUNCEMENTS */}
          {(currentTab === 'communication' || currentTab === 'messages') && (
            <CommunicationModule
              currentUser={currentUser}
              messages={messages}
              announcements={INITIAL_ANNOUNCEMENTS}
              onSendMessage={handleSendMessage}
            />
          )}

          {/* CLASSES & CURRICULUM */}
          {currentTab === 'academics' && (
            <AcademicsModule
              classes={classes}
              terms={INITIAL_TERMS}
              schoolSettings={schoolSettings}
              onUpdateTerm={() => {}}
            />
          )}

          {/* LIBRARY & ASSETS */}
          {(currentTab === 'library_inventory' || currentTab === 'inventory') && (
            <LibraryInventoryModule
              books={INITIAL_BOOKS}
              inventory={INITIAL_INVENTORY}
            />
          )}

          {/* SCHOOL CONFIGURATION & AUDIT LOGS */}
          {(currentTab === 'audit_settings' || currentTab === 'settings') && (
            <AuditSettingsModule
              schoolSettings={schoolSettings}
              auditLogs={auditLogs}
              onSaveSettings={setSchoolSettings}
            />
          )}
        </main>
      </div>

      {/* ADMISSION REGISTRATION MODAL */}
      <AdmissionForm
        isOpen={isAdmissionFormOpen}
        onClose={() => setIsAdmissionFormOpen(false)}
        onSaveStudent={handleRegisterStudent}
        studentCount={students.length}
      />

      {/* STUDENT FULL PROFILE MODAL */}
      <StudentProfileModal
        student={selectedStudentForProfile}
        onClose={() => setSelectedStudentForProfile(null)}
        onOpenReportCard={() => {
          setSelectedStudentForProfile(null);
          setCurrentTab('results');
        }}
      />

      {/* ONLINE PAYMENT GATEWAY MODAL */}
      <PaymentGatewayModal
        isOpen={isPaymentGatewayOpen}
        onClose={() => {
          setIsPaymentGatewayOpen(false);
          setPaymentModalStudent(undefined);
          setPaymentModalInvoice(undefined);
        }}
        students={students}
        invoices={invoices}
        initialStudent={paymentModalStudent || activeUserStudent}
        initialInvoice={paymentModalInvoice}
        onProcessPayment={handleProcessPayment}
      />
    </div>
  );
}

export default App;

