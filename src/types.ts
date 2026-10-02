export type UserRole = 'student' | 'admin';

export interface User {
  id: string;
  name: string;
  phone: string;
  email: string;
  password_hash?: string;
  password_set?: boolean; // false if admitted by admin but password not created yet
  role: UserRole;
  created_at: string;
  is_active: boolean;
}

export type MembershipStatus = 'active' | 'inactive';

export interface StudentProfile {
  id: string;
  user_id: string;
  name: string;
  phone: string;
  email: string;
  member_id: string; // e.g. KL-1001
  join_date: string;
  assigned_seat: string; // e.g. "Seat 25" or "25" or "Unassigned"
  membership_status: MembershipStatus;
  created_at: string;
}

export interface Membership {
  id: string;
  student_id: string;
  monthly_fee: number; // default 600
  start_date: string;
  current_status: MembershipStatus;
  created_at: string;
}

export type FeeStatus = 'paid' | 'due';

export interface MonthlyFee {
  id: string;
  student_id: string;
  student_name: string;
  student_phone: string;
  month: string; // e.g. October
  year: number; // e.g. 2026
  amount: number; // 600
  status: FeeStatus;
  paid_at?: string | null;
  reminder_sent_at?: string | null;
}

export type EnquiryType = 'membership' | 'general';
export type EnquiryStatus = 'new' | 'contacted' | 'converted' | 'closed';

export interface Enquiry {
  id: string;
  name: string;
  phone: string;
  email: string;
  enquiry_type: EnquiryType;
  preferred_start_date: string;
  message: string;
  status: EnquiryStatus;
  created_at: string;
}

export type AttendanceStatus = 'inside' | 'completed';

export interface AttendanceSession {
  id: string;
  student_id: string;
  student_name: string;
  date: string; // YYYY-MM-DD
  check_in: string; // HH:MM or HH:MM AM/PM
  check_out?: string | null; // HH:MM or HH:MM AM/PM
  check_in_timestamp: number; // epoch ms for accurate live duration
  check_out_timestamp?: number | null;
  total_minutes: number;
  status: AttendanceStatus;
}

export type NotificationType = 'new_enquiry' | 'membership' | 'fee_due' | 'attendance' | 'system';

export interface AppNotification {
  id: string;
  recipient_type: 'admin' | 'student';
  recipient_id?: string;
  title: string;
  message: string;
  type: NotificationType;
  is_read: boolean;
  created_at: string;
}

export type SeatStatus = 'available' | 'assigned';

export interface Seat {
  id: string;
  seat_number: number; // 1 to 100
  status: SeatStatus;
  assigned_student_id?: string | null;
  assigned_student_name?: string | null;
  assigned_student_email?: string | null;
  assigned_student_phone?: string | null;
}

export interface SeatStatusDetail {
  seat_number: number;
  assigned: boolean;
  student: {
    id: string;
    name: string;
    email: string;
    phone: string;
    member_id: string;
  } | null;
  presence: 'present' | 'absent' | 'available';
  check_in?: string | null;
}
