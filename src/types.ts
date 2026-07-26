export type UserRole = 'super_admin' | 'admin_bursar' | 'teacher' | 'parent' | 'student';

export type SchoolLevel = 'nursery' | 'primary' | 'junior_secondary' | 'senior_secondary';

export type ClassName = 
  | 'Creche' | 'Nursery 1' | 'Nursery 2'
  | 'Primary 1' | 'Primary 2' | 'Primary 3' | 'Primary 4' | 'Primary 5' | 'Primary 6'
  | 'JSS1' | 'JSS2' | 'JSS3'
  | 'SSS1' | 'SSS2' | 'SSS3';

export type ClassArm = 'Arm A' | 'Arm B' | 'Arm C' | 'Gold' | 'Diamond' | 'Silver';

export type StudentStatus = 'active' | 'graduated' | 'transferred' | 'suspended' | 'withdrawn';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  associatedStudentIds?: string[]; // For parents
  teacherSubjectIds?: string[]; // For teachers
}

export interface StudentPersonal {
  admissionNo: string; // e.g. SCH/2026/0001
  surname: string;
  firstName: string;
  middleName?: string;
  passportUrl?: string;
  gender: 'Male' | 'Female';
  dateOfBirth: string;
  age: number;
  religion: 'Christianity' | 'Islam' | 'Other';
  stateOfOrigin: string;
  lga: string;
  nationality: string;
  address: string;
  bloodGroup: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  genotype: 'AA' | 'AS' | 'SS' | 'AC';
  medicalConditions?: string;
  disabilityStatus?: string;
  admissionDate: string;
  className: ClassName;
  arm: ClassArm;
  house?: 'Red House' | 'Blue House' | 'Green House' | 'Yellow House';
  status: StudentStatus;
}

export interface ParentInfo {
  fatherName: string;
  motherName: string;
  guardianName?: string;
  occupation: string;
  phone: string;
  email: string;
  address: string;
  emergencyContact: string;
  relationship: string;
}

export interface PreviousSchool {
  name: string;
  lastClass: string;
  transferReason: string;
  lastResultUrl?: string;
}

export interface StudentDocument {
  id: string;
  title: string;
  type: 'Birth Certificate' | 'Passport' | 'Admission Letter' | 'Transfer Letter' | 'Medical Report' | 'Other';
  url: string;
  uploadDate: string;
}

export interface StudentProfile {
  id: string;
  personal: StudentPersonal;
  parent: ParentInfo;
  previousSchool?: PreviousSchool;
  documents: StudentDocument[];
  currentGpa?: number;
  attendanceRate?: number;
  feeBalance: number; // in Naira (₦)
}

export interface Subject {
  id: string;
  code: string;
  name: string;
  level: SchoolLevel;
  department?: 'Science' | 'Arts' | 'Commercial' | 'General';
  teacherName?: string;
}

export interface ClassStructure {
  id: string;
  name: ClassName;
  level: SchoolLevel;
  arm: ClassArm;
  classTeacher: string;
  maxCapacity: number;
  currentCount: number;
  subjects: Subject[];
}

export interface AcademicTerm {
  id: string;
  name: 'First Term' | 'Second Term' | 'Third Term';
  session: string; // e.g. "2026/2027"
  openingDate: string;
  closingDate: string;
  midTermBreak: string;
  examStartDate: string;
  vacationDate: string;
  resultReleaseDate: string;
  isCurrent: boolean;
}

export interface SubjectScore {
  subjectId: string;
  subjectName: string;
  ca1: number; // Max 10
  ca2: number; // Max 10
  midTerm: number; // Max 10
  project: number; // Max 10
  exam: number; // Max 60
  total: number; // Max 100
  grade: 'A' | 'B' | 'C' | 'D' | 'E' | 'F';
  remarks: string;
  classHighest?: number;
  classLowest?: number;
  classAverage?: number;
}

export interface PsychomotorRating {
  category: string; // e.g., Punctuality, Neatness, Honesty, Leadership, Sports, Emotional Stability
  rating: 1 | 2 | 3 | 4 | 5; // 5 = Excellent, 1 = Poor
}

export interface ReportCard {
  id: string;
  studentId: string;
  studentName: string;
  admissionNo: string;
  passportUrl?: string;
  className: ClassName;
  arm: ClassArm;
  session: string;
  term: 'First Term' | 'Second Term' | 'Third Term';
  totalStudentsInClass: number;
  positionInClass: number;
  totalScore: number;
  averageScore: number;
  gpa: number;
  scores: SubjectScore[];
  psychomotor: PsychomotorRating[];
  teacherRemarks: string;
  principalRemarks: string;
  daysPresent: number;
  daysOpened: number;
  nextTermBegins: string;
  nextTermFees: number;
  status: 'Draft' | 'Approved' | 'Published';
}

export type PaymentMethod = 'Paystack' | 'Flutterwave' | 'Cash' | 'POS' | 'Bank Transfer' | 'Cheque';

export type InvoiceStatus = 'Pending' | 'Partially Paid' | 'Paid' | 'Overdue' | 'Cancelled';

export interface FeeBreakdownItem {
  id: string;
  title: string;
  amount: number;
  isCompulsory: boolean;
}

export interface FeeStructure {
  id: string;
  level: SchoolLevel;
  session: string;
  term: string;
  items: FeeBreakdownItem[];
  totalAmount: number;
}

export interface InvoiceItem {
  id: string;
  title: string;
  amount: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string; // e.g. INV/2026/0018
  studentId: string;
  studentName: string;
  admissionNo: string;
  className: ClassName;
  session: string;
  term: string;
  items: InvoiceItem[];
  subtotal: number;
  discountAmount: number;
  discountReason?: string;
  totalAmount: number;
  amountPaid: number;
  balance: number;
  dueDate: string;
  createdAt: string;
  status: InvoiceStatus;
  qrCodeData: string;
}

export interface PaymentRecord {
  id: string;
  invoiceId?: string;
  receiptNo: string;
  studentId: string;
  studentName: string;
  admissionNo: string;
  className: ClassName;
  amountPaid: number;
  amountDue: number; // Balance before payment
  remainingBalance: number; // Balance after payment
  paymentMethod: PaymentMethod;
  transactionRef: string; // Payment Reference
  paymentDate: string;
  session: string;
  term: string;
  approvedBy: string; // Staff / System verifier
  verifiedBy: string; // Gateway verification authority
  status: 'Successful' | 'Pending' | 'Failed';
  feeCategory: string;
}

export type RefundStatus = 'Refund Request' | 'Review' | 'Approval' | 'Refund Processed' | 'Rejected';

export interface RefundRecord {
  id: string;
  refundNo: string;
  studentId: string;
  studentName: string;
  admissionNo: string;
  className: ClassName;
  invoiceId?: string;
  invoiceNumber?: string;
  paymentId?: string;
  receiptNo?: string;
  amount: number;
  reason: string;
  requestedBy: string;
  requestDate: string;
  reviewedBy?: string;
  reviewDate?: string;
  approvedBy?: string;
  approvalDate?: string;
  processedBy?: string;
  refundDate?: string;
  status: RefundStatus;
  notes?: string;
  parentNotified?: boolean;
}

export interface OverdueAlertLog {
  id: string;
  invoiceId: string;
  invoiceNumber: string;
  studentId: string;
  studentName: string;
  admissionNo: string;
  parentName: string;
  parentPhone: string;
  parentEmail: string;
  amountDue: number;
  dueDate: string;
  channel: 'Email' | 'SMS' | 'Both' | 'Portal Message';
  sentAt: string;
  status: 'Delivered' | 'Sent' | 'Failed';
  messageSnippet: string;
}

export interface ExpenseRecord {
  id: string;
  category: 'Staff Salary' | 'Utilities' | 'Maintenance' | 'ICT & Software' | 'Events & Sports' | 'Supplies';
  description: string;
  amount: number;
  date: string;
  approvedBy: string;
}

export interface AttendanceEntry {
  id: string;
  studentId: string;
  studentName: string;
  admissionNo: string;
  date: string;
  className: ClassName;
  arm: ClassArm;
  status: 'Present' | 'Absent' | 'Late' | 'Excused';
  remark?: string;
}

export interface TimetableSlot {
  id: string;
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';
  startTime: string;
  endTime: string;
  subjectName: string;
  teacherName: string;
  room: string;
  className: ClassName;
  arm: ClassArm;
}

export interface CBTQuestion {
  id: string;
  text: string;
  options: string[];
  correctOptionIndex: number;
  explanation?: string;
  marks: number;
}

export interface CBTExam {
  id: string;
  title: string;
  subjectName: string;
  className: ClassName;
  durationMinutes: number;
  totalMarks: number;
  questions: CBTQuestion[];
  createdTeacher: string;
  deadline: string;
  status: 'Active' | 'Completed' | 'Upcoming';
}

export interface CBTResult {
  id: string;
  examId: string;
  examTitle: string;
  studentId: string;
  studentName: string;
  score: number;
  totalMarks: number;
  percentage: number;
  submittedAt: string;
  answers: { questionId: string; selectedOption: number; isCorrect: boolean }[];
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  receiverId: string;
  receiverName: string;
  subject: string;
  body: string;
  timestamp: string;
  isRead: boolean;
}

export interface Announcement {
  id: string;
  title: string;
  category: 'General' | 'Academic' | 'Fees' | 'Sports' | 'Urgent';
  content: string;
  author: string;
  targetAudience: 'All' | 'Parents' | 'Teachers' | 'Students';
  date: string;
}

export interface LibraryBook {
  id: string;
  title: string;
  author: string;
  isbn: string;
  category: string;
  copiesAvailable: number;
  totalCopies: number;
  locationShelf: string;
}

export interface BorrowRecord {
  id: string;
  bookId: string;
  bookTitle: string;
  borrowerName: string;
  borrowerRole: string;
  issueDate: string;
  dueDate: string;
  returnDate?: string;
  status: 'Borrowed' | 'Returned' | 'Overdue';
}

export interface InventoryItem {
  id: string;
  name: string;
  category: 'Furniture' | 'Laboratory' | 'Sports' | 'Stationery' | 'IT Equipment';
  quantity: number;
  unit: string;
  condition: 'Good' | 'Needs Repair' | 'Replaced';
  lastChecked: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  role: UserRole;
  action: string;
  details: string;
  ipAddress: string;
  timestamp: string;
}

export interface SchoolSettings {
  schoolName: string;
  motto: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  logoUrl?: string;
  currencySymbol: string;
  currencyCode: string;
  admissionPrefix: string;
  currentSession: string;
  currentTerm: 'First Term' | 'Second Term' | 'Third Term';
  principalName: string;
  bursarName: string;
  gradingScale: { grade: string; minScore: number; maxScore: number; remark: string }[];
}
