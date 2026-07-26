import { SubjectScore } from '../types';

/**
 * Format numbers into Nigerian Naira (₦) currency format.
 */
export function formatNaira(amount: number): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0,
  }).format(amount).replace('NGN', '₦');
}

/**
 * Calculate grade and remarks for Nigerian curriculum score.
 */
export function calculateGrade(score: number): { grade: 'A' | 'B' | 'C' | 'D' | 'E' | 'F'; remarks: string } {
  if (score >= 75) return { grade: 'A', remarks: 'Excellent' };
  if (score >= 65) return { grade: 'B', remarks: 'Very Good' };
  if (score >= 55) return { grade: 'C', remarks: 'Good' };
  if (score >= 45) return { grade: 'D', remarks: 'Pass' };
  if (score >= 40) return { grade: 'E', remarks: 'Fair' };
  return { grade: 'F', remarks: 'Fail' };
}

/**
 * Generate Next Admission Number (e.g. SCH/2026/0008)
 */
export function generateAdmissionNumber(prefix = 'SCH', year = '2026', currentCount = 7): string {
  const nextNum = (currentCount + 1).toString().padStart(4, '0');
  return `${prefix}/${year}/${nextNum}`;
}

/**
 * Compute GPA based on 5.0 Nigerian scale
 */
export function calculateGPA(scores: SubjectScore[]): number {
  if (!scores.length) return 0;
  
  const totalPoints = scores.reduce((acc, s) => {
    if (s.grade === 'A') return acc + 5;
    if (s.grade === 'B') return acc + 4;
    if (s.grade === 'C') return acc + 3;
    if (s.grade === 'D') return acc + 2;
    if (s.grade === 'E') return acc + 1;
    return acc + 0;
  }, 0);

  return Number((totalPoints / scores.length).toFixed(2));
}

/**
 * Format date nicely in West Africa Time context
 */
export function formatDate(dateString: string): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export interface ScheduleDetails {
  sectionTitle: string;
  scheduleLabel: string;
  scheduleValue: string;
  venueLabel: string;
  venueValue: string;
  instructionNote: string;
  statusBadgeText: string;
  badgeStyle: string;
}

/**
 * Dynamically computes schedule, venue, title, and instructions based on application status.
 */
export function getDynamicScheduleInfo(
  status: string,
  customExamDate?: string,
  customVenue?: string
): ScheduleDetails {
  const normalizedStatus = (status || '').toLowerCase();

  if (normalizedStatus.includes('passed examination') || normalizedStatus.includes('interview')) {
    return {
      sectionTitle: 'Oral Interview & Screening Details',
      scheduleLabel: 'Interview Schedule',
      scheduleValue:
        customExamDate &&
        !customExamDate.toLowerCase().includes('saturday, august 15') &&
        !customExamDate.toLowerCase().includes('completed on')
          ? customExamDate
          : 'Friday, August 21, 2026 at 10:00 AM',
      venueLabel: 'Interview Venue',
      venueValue:
        customVenue && !customVenue.toLowerCase().includes('cbt hall')
          ? customVenue
          : 'Administrative Boardroom, Apex Main Campus',
      instructionNote:
        'Congratulations! Candidate passed the CBT Entrance Exam. Please bring original birth certificate, state of origin certificate, and previous academic report cards for the physical interview.',
      statusBadgeText: 'Passed Exam - Interview Pending',
      badgeStyle: 'bg-emerald-100 text-emerald-900 border-emerald-300',
    };
  }

  if (normalizedStatus.includes('admission granted') || normalizedStatus.includes('pending enrollment')) {
    return {
      sectionTitle: 'Official Admission Offer & Acceptance',
      scheduleLabel: 'Acceptance Deadline',
      scheduleValue: 'Friday, August 28, 2026 (5:00 PM WAT)',
      venueLabel: 'Clearance Office',
      venueValue: 'Bursary & Admissions Office / Student Portal',
      instructionNote:
        'Provisional Admission Granted! Please complete acceptance fee payment and document verification to lock your seat.',
      statusBadgeText: 'Admission Granted - Pending Enrollment',
      badgeStyle: 'bg-emerald-500 text-white border-emerald-600',
    };
  }

  if (normalizedStatus.includes('enrolled') || normalizedStatus.includes('admitted & enrolled')) {
    return {
      sectionTitle: 'Student Resumption & Orientation Schedule',
      scheduleLabel: 'Resumption & Orientation',
      scheduleValue: 'Monday, September 7, 2026 at 8:00 AM',
      venueLabel: 'Resumption Venue',
      venueValue: 'Main Campus Auditorium & Assigned Classroom Block',
      instructionNote:
        'Student is fully admitted and registered into the active directory for the 2026/2027 Academic Session.',
      statusBadgeText: 'Admitted & Enrolled',
      badgeStyle: 'bg-teal-700 text-white border-teal-800',
    };
  }

  if (normalizedStatus.includes('under review') || normalizedStatus.includes('screening')) {
    return {
      sectionTitle: 'Application Screening & Review Status',
      scheduleLabel: 'Processing Status',
      scheduleValue: 'Document Verification & Eligibility Check in Progress',
      venueLabel: 'Processing Office',
      venueValue: 'Apex Admissions Screening Committee',
      instructionNote:
        'Application credentials have been successfully logged. Examination schedule will be confirmed upon verification.',
      statusBadgeText: 'Application Under Review',
      badgeStyle: 'bg-amber-100 text-amber-900 border-amber-300',
    };
  }

  if (normalizedStatus.includes('declined') || normalizedStatus.includes('rejected')) {
    return {
      sectionTitle: 'Application Outcome Notification',
      scheduleLabel: 'Decision Status',
      scheduleValue: 'Review Processed for 2026/2027 Intake',
      venueLabel: 'Notification Office',
      venueValue: 'Admissions Directorate',
      instructionNote:
        'We regret to inform you that candidate was not shortlisted for this academic session intake.',
      statusBadgeText: 'Application Declined',
      badgeStyle: 'bg-rose-100 text-rose-900 border-rose-300',
    };
  }

  // Default: Entrance Examination Scheduled
  return {
    sectionTitle: 'Entrance Examination Details',
    scheduleLabel: 'Exam Schedule',
    scheduleValue: customExamDate || 'Saturday, August 15, 2026 at 8:30 AM',
    venueLabel: 'Examination Venue',
    venueValue: customVenue || 'Apex College CBT Hall, Victoria Island',
    instructionNote:
      'Candidate is scheduled for the CBT entrance assessment. Please arrive at the venue 30 minutes prior with writing materials.',
    statusBadgeText: 'Entrance Examination Scheduled',
    badgeStyle: 'bg-[#DFF6F0] text-[#0D5C52] border-[#6DD5C4]',
  };
}

