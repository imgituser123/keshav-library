import {
  User,
  StudentProfile,
  Membership,
  MonthlyFee,
  Enquiry,
  AttendanceSession,
  AppNotification,
  Seat,
  SeatStatus,
  SeatStatusDetail,
  FeeStatus
} from '../types';

const STORAGE_KEY = 'keshav_library_v4_seats100';

export interface AppState {
  users: User[];
  students: StudentProfile[];
  memberships: Membership[];
  fees: MonthlyFee[];
  enquiries: Enquiry[];
  attendance: AttendanceSession[];
  notifications: AppNotification[];
  seats: Seat[];
  currentUserId: string | null;
}

// Exactly 100 Numbered Study Desks (1 to 100), all starting Available with NO zones
const generateClean100Seats = (): Seat[] => {
  return Array.from({ length: 100 }, (_, i) => ({
    id: `seat_${i + 1}`,
    seat_number: i + 1,
    status: 'available',
    assigned_student_id: null,
    assigned_student_name: null,
    assigned_student_email: null,
    assigned_student_phone: null
  }));
};

const getInitialSeedState = (): AppState => {
  const seats = generateClean100Seats();

  // Seat 12 assigned to Rahul (Password Set)
  seats[11].status = 'assigned';
  seats[11].assigned_student_id = 'std_rahul';
  seats[11].assigned_student_name = 'Rahul Sharma';
  seats[11].assigned_student_email = 'rahul@keshavlibrary.in';
  seats[11].assigned_student_phone = '+91 83402 35780';

  // Seat 15 assigned to Rohan (Admitted by Admin, Awaiting Password Setup)
  seats[14].status = 'assigned';
  seats[14].assigned_student_id = 'std_rohan';
  seats[14].assigned_student_name = 'Rohan Verma';
  seats[14].assigned_student_email = 'rohan@keshavlibrary.in';
  seats[14].assigned_student_phone = '+91 98765 43210';

  const today = new Date().toISOString().split('T')[0];

  return {
    users: [
      {
        id: 'usr_admin',
        name: 'Keshav Sharma (Owner)',
        phone: '+91 83402 35780',
        email: 'admin@keshavlibrary.in',
        password_hash: '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', // admin123
        password_set: true,
        role: 'admin',
        created_at: today,
        is_active: true
      },
      {
        id: 'usr_rahul',
        name: 'Rahul Sharma',
        phone: '+91 83402 35780',
        email: 'rahul@keshavlibrary.in',
        password_hash: '703b0a3d6ad75b649a28adde7d83c6251da457549263bc7ff45ec709b0a8448b', // student123
        password_set: true,
        role: 'student',
        created_at: today,
        is_active: true
      },
      {
        id: 'usr_rohan',
        name: 'Rohan Verma',
        phone: '+91 98765 43210',
        email: 'rohan@keshavlibrary.in',
        password_hash: '', // No usable password yet
        password_set: false, // Admitted by admin, awaiting first-time login
        role: 'student',
        created_at: today,
        is_active: true
      }
    ],
    students: [
      {
        id: 'std_rahul',
        user_id: 'usr_rahul',
        name: 'Rahul Sharma',
        phone: '+91 83402 35780',
        email: 'rahul@keshavlibrary.in',
        member_id: 'KL-1001',
        join_date: today,
        assigned_seat: 'Seat 12',
        membership_status: 'active',
        created_at: today
      },
      {
        id: 'std_rohan',
        user_id: 'usr_rohan',
        name: 'Rohan Verma',
        phone: '+91 98765 43210',
        email: 'rohan@keshavlibrary.in',
        member_id: 'KL-1002',
        join_date: today,
        assigned_seat: 'Seat 15',
        membership_status: 'active',
        created_at: today
      }
    ],
    memberships: [
      {
        id: 'mem_std_rahul',
        student_id: 'std_rahul',
        monthly_fee: 600,
        start_date: today,
        current_status: 'active',
        created_at: today
      },
      {
        id: 'mem_std_rohan',
        student_id: 'std_rohan',
        monthly_fee: 600,
        start_date: today,
        current_status: 'active',
        created_at: today
      }
    ],
    fees: [
      {
        id: 'fee_rahul_1',
        student_id: 'std_rahul',
        student_name: 'Rahul Sharma',
        student_phone: '+91 83402 35780',
        month: 'October',
        year: 2026,
        amount: 600,
        status: 'paid',
        paid_at: `${today} 10:30`
      },
      {
        id: 'fee_rohan_1',
        student_id: 'std_rohan',
        student_name: 'Rohan Verma',
        student_phone: '+91 98765 43210',
        month: 'October',
        year: 2026,
        amount: 600,
        status: 'due'
      }
    ],
    enquiries: [
      {
        id: 'enq_1',
        name: 'Vikram Joshi',
        phone: '+91 98112 34567',
        email: 'vikram.j@gmail.com',
        enquiry_type: 'membership',
        preferred_start_date: '2026-10-05',
        message: 'Preparing for UPSC Civil Services examination, need silent study space with WiFi.',
        status: 'new',
        created_at: `${today} 09:15`
      }
    ],
    attendance: [
      {
        id: 'att_seed_1',
        student_id: 'std_rahul',
        student_name: 'Rahul Sharma',
        date: today,
        check_in: '08:30 AM',
        check_out: null,
        check_in_timestamp: Date.now() - (3 * 3600 * 1000), // 3 hours ago
        check_out_timestamp: null,
        total_minutes: 180,
        status: 'inside'
      }
    ],
    notifications: [
      {
        id: 'notif_welcome',
        recipient_type: 'admin',
        title: 'Keshav Library Portal Ready',
        message: 'Study space management system initialized with seats 1 to 100 and admission authentication.',
        type: 'system',
        is_read: false,
        created_at: `${today} 08:00`
      }
    ],
    seats,
    currentUserId: null
  };
};

// Secure password hashing with SHA-256
export async function hashPassword(plainText: string): Promise<string> {
  try {
    const msgUint8 = new TextEncoder().encode(plainText);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  } catch (e) {
    let hash = 0;
    for (let i = 0; i < plainText.length; i++) {
      hash = ((hash << 5) - hash) + plainText.charCodeAt(i);
      hash |= 0;
    }
    return `hash_${Math.abs(hash)}`;
  }
}

export class LibraryStore {
  private state: AppState;
  private listeners: (() => void)[] = [];

  constructor() {
    // Clear old versions with old seat formats
    try {
      localStorage.removeItem('keshav_library_state_v1');
      localStorage.removeItem('keshav_library_clean_v2');
    } catch (_) {}

    this.state = this.loadState();
  }

  private loadState(): AppState {
    const seed = getInitialSeedState();
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        const users: User[] = (parsed.users && parsed.users.length > 0) ? parsed.users : seed.users;
        
        // Ensure all users have explicit password_set boolean
        users.forEach(u => {
          if (u.password_set === undefined) {
            u.password_set = Boolean(u.password_hash && u.password_hash.length > 0);
          }
        });

        // Ensure admin account exists
        if (!users.some(u => u.role === 'admin')) {
          users.unshift(seed.users[0]);
        }

        // Ensure at least one pending admission student exists for easy testing if none present
        if (!users.some(u => u.email === 'rohan@keshavlibrary.in' || u.password_set === false)) {
          users.push(seed.users[2]);
          if (parsed.students && !parsed.students.some((s: any) => s.email === 'rohan@keshavlibrary.in')) {
            parsed.students.push(seed.students[1]);
          }
        }

        return {
          users: users,
          students: parsed.students && parsed.students.length > 0 ? parsed.students : seed.students,
          memberships: parsed.memberships || seed.memberships,
          fees: parsed.fees || seed.fees,
          enquiries: parsed.enquiries || seed.enquiries,
          attendance: parsed.attendance || seed.attendance,
          notifications: parsed.notifications || seed.notifications,
          seats: parsed.seats && parsed.seats.length === 100 ? parsed.seats : seed.seats,
          currentUserId: parsed.currentUserId ?? null
        };
      }
    } catch (e) {
      console.error('Error loading library state from localStorage', e);
    }

    return seed;
  }

  private saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch (e) {
      console.error('Failed to save library state', e);
    }
    this.notify();
  }

  public subscribe(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach(l => l());
  }

  public resetDatabaseToClean() {
    localStorage.removeItem(STORAGE_KEY);
    this.state = getInitialSeedState();
    this.saveState();
  }

  public getState(): AppState {
    return this.state;
  }

  // ---------------- AUTHENTICATION & ADMISSION FLOW ----------------

  public getCurrentUser(): User | null {
    if (!this.state.currentUserId) return null;
    return this.state.users.find(u => u.id === this.state.currentUserId) || null;
  }

  public getCurrentStudent(): StudentProfile | null {
    const user = this.getCurrentUser();
    if (!user || user.role !== 'student') return null;
    return this.state.students.find(s => s.user_id === user.id) || null;
  }

  /**
   * Section 1 & 3: Admin admits a student.
   * No password is asked from the admin. Account has password_set = false.
   */
  public admitStudentByAdmin(data: {
    name: string;
    email: string;
    phone: string;
    joinDate?: string;
    membershipStatus?: 'active' | 'inactive';
    seatNumber?: number | string | null;
  }): { success: boolean; student?: StudentProfile; error?: string } {
    const email = data.email.trim().toLowerCase();
    const phone = data.phone.trim();
    const name = data.name.trim();

    // Check duplicate
    if (this.state.users.some(u => u.email.toLowerCase() === email)) {
      return { success: false, error: 'A student account with this email address already exists.' };
    }
    if (this.state.users.some(u => u.phone === phone)) {
      return { success: false, error: 'A student account with this mobile number already exists.' };
    }

    // Check seat availability if seat specified
    let assignedSeatStr = 'Unassigned';
    if (data.seatNumber && data.seatNumber !== 'Unassigned') {
      const seatNum = typeof data.seatNumber === 'number' ? data.seatNumber : parseInt(String(data.seatNumber).replace(/[^0-9]/g, ''), 10);
      if (seatNum < 1 || seatNum > 100) {
        return { success: false, error: 'Invalid seat number. Keshav Library has seats 1 to 100.' };
      }
      const existingSeat = this.state.seats.find(s => s.seat_number === seatNum);
      if (existingSeat && existingSeat.status === 'assigned' && existingSeat.assigned_student_id) {
        return { success: false, error: 'This seat is already assigned to another student.' };
      }
      assignedSeatStr = `Seat ${seatNum}`;
    }

    const userId = `usr_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;
    const studentId = `std_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;
    const today = data.joinDate || new Date().toISOString().split('T')[0];
    const memberId = `KL-${1001 + this.state.students.length}`;

    // Account created WITHOUT usable password (password_set = false)
    const newUser: User = {
      id: userId,
      name: name,
      phone: phone,
      email: email,
      password_hash: '', // No usable password yet
      password_set: false, // Must be set by student on first login
      role: 'student',
      created_at: today,
      is_active: true
    };

    const newStudent: StudentProfile = {
      id: studentId,
      user_id: userId,
      name: name,
      phone: phone,
      email: email,
      member_id: memberId,
      join_date: today,
      assigned_seat: assignedSeatStr,
      membership_status: data.membershipStatus || 'active',
      created_at: today
    };

    const newMembership: Membership = {
      id: `mem_${studentId}`,
      student_id: studentId,
      monthly_fee: 600,
      start_date: today,
      current_status: data.membershipStatus || 'active',
      created_at: today
    };

    const currentMonth = new Date().toLocaleString('default', { month: 'long' });
    const currentYear = new Date().getFullYear();

    const initialFee: MonthlyFee = {
      id: `fee_${studentId}_${Date.now()}`,
      student_id: studentId,
      student_name: name,
      student_phone: phone,
      month: currentMonth,
      year: currentYear,
      amount: 600,
      status: 'due'
    };

    // Assign seat in seat grid
    if (assignedSeatStr !== 'Unassigned') {
      const seatNum = parseInt(assignedSeatStr.replace(/[^0-9]/g, ''), 10);
      const targetSeat = this.state.seats.find(s => s.seat_number === seatNum);
      if (targetSeat) {
        targetSeat.status = 'assigned';
        targetSeat.assigned_student_id = studentId;
        targetSeat.assigned_student_name = name;
        targetSeat.assigned_student_email = email;
        targetSeat.assigned_student_phone = phone;
      }
    }

    this.state.users.push(newUser);
    this.state.students.push(newStudent);
    this.state.memberships.push(newMembership);
    this.state.fees.push(initialFee);

    this.createNotification({
      recipient_type: 'admin',
      title: 'Student Admitted',
      message: `${name} admitted as member ${memberId}. Seat: ${assignedSeatStr}. Awaiting student password setup.`,
      type: 'membership'
    });

    this.saveState();
    return { success: true, student: newStudent };
  }

  /**
   * Section 1 & 23: First-time password setup by student.
   */
  public async setStudentPassword(emailInput: string, newPassword: string): Promise<{ success: boolean; user?: User; error?: string }> {
    const email = emailInput.trim().toLowerCase();
    const user = this.state.users.find(u => u.email.toLowerCase() === email);

    if (!user) {
      return { success: false, error: 'No admitted student account found with this email. Please check your email or contact Keshav Library admin.' };
    }

    if (user.role !== 'student') {
      return { success: false, error: 'This email is not registered as a student account.' };
    }

    if (user.password_set) {
      return { success: false, error: 'Password has already been set for this account. Please use Student Login directly with your password.' };
    }

    if (!newPassword || newPassword.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters long.' };
    }

    const hashed = await hashPassword(newPassword);
    user.password_hash = hashed;
    user.password_set = true;

    this.createNotification({
      recipient_type: 'admin',
      title: 'Student Password Activated',
      message: `${user.name} has completed first-time password setup.`,
      type: 'membership'
    });

    this.createNotification({
      recipient_type: 'student',
      recipient_id: user.id,
      title: 'Welcome to Keshav Library',
      message: 'Your login password has been configured. You can now use your study dashboard.',
      type: 'system'
    });

    this.saveState();
    return { success: true, user };
  }

  /**
   * Check status of email before login/registration
   */
  public checkEmailStatus(emailInput: string): { exists: boolean; passwordSet: boolean; role?: string; name?: string; memberId?: string } {
    const email = emailInput.trim().toLowerCase();
    const user = this.state.users.find(u => u.email.toLowerCase() === email);
    if (!user) {
      return { exists: false, passwordSet: false };
    }
    const student = this.state.students.find(s => s.user_id === user.id);
    return {
      exists: true,
      passwordSet: user.password_set === true,
      role: user.role,
      name: user.name,
      memberId: student?.member_id
    };
  }

  /**
   * Student registration flow.
   * If already admitted by admin (password_set == false), does NOT show "Email already exists".
   * Instead, recognizes this as a valid first-time password setup case and activates the account without creating duplicate records.
   */
  public async registerStudent(data: {
    name: string;
    email: string;
    phone: string;
    password: string;
  }): Promise<{ success: boolean; user?: User; error?: string; isFirstTimeSetup?: boolean; message?: string }> {
    const email = data.email.trim().toLowerCase();
    const phone = data.phone.trim();

    const existingUser = this.state.users.find(u => u.email.toLowerCase() === email);
    if (existingUser) {
      if (existingUser.password_set === false) {
        // Section 1 Bug Fix: Recognized as valid first-time password setup!
        if (data.password.length < 6) {
          return { success: false, error: 'Password must be at least 6 characters long.' };
        }

        const hashed = await hashPassword(data.password);
        existingUser.password_hash = hashed;
        existingUser.password_set = true;
        if (data.name.trim()) existingUser.name = data.name.trim();
        if (phone) existingUser.phone = phone;

        // Keep existing student profile intact without duplicates
        const student = this.state.students.find(s => s.user_id === existingUser.id);
        if (student) {
          if (data.name.trim()) student.name = data.name.trim();
          if (phone) student.phone = phone;
        }

        this.createNotification({
          recipient_type: 'admin',
          title: 'Student Password Activated',
          message: `${existingUser.name} activated their password for member ${student?.member_id || ''}.`,
          type: 'membership'
        });

        this.saveState();
        return {
          success: true,
          user: existingUser,
          isFirstTimeSetup: true,
          message: 'Admission verified! Your password has been configured successfully. Please log in.'
        };
      }
      return { success: false, error: 'An account with this email address already exists. Please log in.' };
    }

    if (this.state.users.some(u => u.phone === phone)) {
      return { success: false, error: 'An account with this mobile number already exists.' };
    }

    const password_hash = await hashPassword(data.password);
    const userId = `usr_${Date.now()}`;
    const studentId = `std_${Date.now()}`;
    const today = new Date().toISOString().split('T')[0];
    const memberId = `KL-${1001 + this.state.students.length}`;

    const newUser: User = {
      id: userId,
      name: data.name.trim(),
      phone: phone,
      email: email,
      password_hash: password_hash,
      password_set: true,
      role: 'student',
      created_at: today,
      is_active: true
    };

    const newStudent: StudentProfile = {
      id: studentId,
      user_id: userId,
      name: data.name.trim(),
      phone: phone,
      email: email,
      member_id: memberId,
      join_date: today,
      assigned_seat: 'Unassigned',
      membership_status: 'active',
      created_at: today
    };

    const newMembership: Membership = {
      id: `mem_${studentId}`,
      student_id: studentId,
      monthly_fee: 600,
      start_date: today,
      current_status: 'active',
      created_at: today
    };

    const currentMonth = new Date().toLocaleString('default', { month: 'long' });
    const currentYear = new Date().getFullYear();

    const initialFee: MonthlyFee = {
      id: `fee_${studentId}_${Date.now()}`,
      student_id: studentId,
      student_name: data.name.trim(),
      student_phone: phone,
      month: currentMonth,
      year: currentYear,
      amount: 600,
      status: 'due'
    };

    this.state.users.push(newUser);
    this.state.students.push(newStudent);
    this.state.memberships.push(newMembership);
    this.state.fees.push(initialFee);

    this.createNotification({
      recipient_type: 'admin',
      title: 'New Student Registered',
      message: `${data.name.trim()} self-registered as student (${memberId}).`,
      type: 'membership'
    });

    this.saveState();
    return { success: true, user: newUser };
  }

  public async registerAdmin(data: {
    name: string;
    email: string;
    phone: string;
    password: string;
  }): Promise<{ success: boolean; user?: User; error?: string }> {
    const email = data.email.trim().toLowerCase();
    const phone = data.phone.trim();

    if (this.state.users.some(u => u.email.toLowerCase() === email)) {
      return { success: false, error: 'An account with this email address already exists.' };
    }

    const password_hash = await hashPassword(data.password);
    const userId = `adm_${Date.now()}`;
    const today = new Date().toISOString().split('T')[0];

    const newAdmin: User = {
      id: userId,
      name: data.name.trim(),
      phone: phone,
      email: email,
      password_hash: password_hash,
      password_set: true,
      role: 'admin',
      created_at: today,
      is_active: true
    };

    this.state.users.push(newAdmin);
    this.saveState();
    return { success: true, user: newAdmin };
  }

  public async loginStudent(email: string, plainPassword: string): Promise<{
    success: boolean;
    user?: User;
    error?: string;
    needsPasswordSet?: boolean;
  }> {
    const trimmed = email.trim().toLowerCase();
    const user = this.state.users.find(u => u.email.toLowerCase() === trimmed);

    if (!user) {
      return { success: false, error: 'Invalid email or password.' };
    }

    if (user.role !== 'student') {
      return { success: false, error: 'This login page is for Students only. Please use Admin Login.' };
    }

    if (!user.is_active) {
      return { success: false, error: 'Your account is deactivated. Please contact Keshav Library.' };
    }

    // Section 1: Check if admitted student has not created password yet
    if (user.password_set === false) {
      return {
        success: false,
        needsPasswordSet: true,
        error: 'Your account was admitted by the administrator. Please click "Set Password / First-Time Login" to create your password.'
      };
    }

    const inputHash = await hashPassword(plainPassword);
    if (user.password_hash !== inputHash) {
      return { success: false, error: 'Invalid email or password.' };
    }

    this.state.currentUserId = user.id;
    this.saveState();
    return { success: true, user };
  }

  public async loginAdmin(email: string, plainPassword: string): Promise<{ success: boolean; user?: User; error?: string }> {
    const trimmed = email.trim().toLowerCase();
    const user = this.state.users.find(u => u.email.toLowerCase() === trimmed);

    if (!user) {
      return { success: false, error: 'Invalid admin email or password.' };
    }

    if (user.role !== 'admin') {
      return { success: false, error: 'Access denied: This login page is for Admin only.' };
    }

    if (!user.is_active) {
      return { success: false, error: 'Admin account is deactivated.' };
    }

    const inputHash = await hashPassword(plainPassword);
    if (user.password_hash && user.password_hash !== inputHash) {
      return { success: false, error: 'Invalid admin email or password.' };
    }

    this.state.currentUserId = user.id;
    this.saveState();
    return { success: true, user };
  }

  public logout() {
    this.state.currentUserId = null;
    this.saveState();
  }

  // ---------------- SEAT MANAGEMENT (SEATS 1 TO 100, NO ZONES) ----------------

  public getSeats(): Seat[] {
    return this.state.seats;
  }

  /**
   * Reassign a student to a new seat or unassign them.
   * Prevents duplicate active seat assignments (Section 6).
   */
  public updateStudentSeat(studentId: string, seatNumber: number | string | null): { success: boolean; error?: string } {
    const student = this.state.students.find(s => s.id === studentId);
    if (!student) return { success: false, error: 'Student not found.' };

    let targetSeatNum: number | null = null;
    if (seatNumber && seatNumber !== 'Unassigned') {
      targetSeatNum = typeof seatNumber === 'number' ? seatNumber : parseInt(String(seatNumber).replace(/[^0-9]/g, ''), 10);
      if (isNaN(targetSeatNum) || targetSeatNum < 1 || targetSeatNum > 100) {
        return { success: false, error: 'Seat number must be between 1 and 100.' };
      }

      // Check if already assigned to ANOTHER student
      const targetSeat = this.state.seats.find(s => s.seat_number === targetSeatNum);
      if (targetSeat && targetSeat.status === 'assigned' && targetSeat.assigned_student_id && targetSeat.assigned_student_id !== studentId) {
        return { success: false, error: 'This seat is already assigned to another student.' };
      }
    }

    // Free student's current seat
    const currentSeatNum = parseInt(student.assigned_seat.replace(/[^0-9]/g, ''), 10);
    if (!isNaN(currentSeatNum)) {
      const oldSeat = this.state.seats.find(s => s.seat_number === currentSeatNum);
      if (oldSeat && oldSeat.assigned_student_id === studentId) {
        oldSeat.status = 'available';
        oldSeat.assigned_student_id = null;
        oldSeat.assigned_student_name = null;
        oldSeat.assigned_student_email = null;
        oldSeat.assigned_student_phone = null;
      }
    }

    if (targetSeatNum !== null) {
      student.assigned_seat = `Seat ${targetSeatNum}`;
      const newSeat = this.state.seats.find(s => s.seat_number === targetSeatNum);
      if (newSeat) {
        newSeat.status = 'assigned';
        newSeat.assigned_student_id = student.id;
        newSeat.assigned_student_name = student.name;
        newSeat.assigned_student_email = student.email;
        newSeat.assigned_student_phone = student.phone;
      }
    } else {
      student.assigned_seat = 'Unassigned';
    }

    this.saveState();
    return { success: true };
  }

  /**
   * Section 7–16: Calculate complete Student Status Grid for all 100 seats.
   * Seat Assigned = RED
   * Student Presence = PRESENT (if active session) or ABSENT
   */
  public getStudentStatusGrid(): SeatStatusDetail[] {
    const today = new Date().toISOString().split('T')[0];
    const activeSessions = this.state.attendance.filter(a => a.status === 'inside' && a.date === today);

    return this.state.seats.map(seat => {
      const isAssigned = seat.status === 'assigned' && !!seat.assigned_student_id;
      if (!isAssigned) {
        return {
          seat_number: seat.seat_number,
          assigned: false,
          student: null,
          presence: 'available',
          check_in: null
        };
      }

      // Seat is assigned to a student
      const student = this.state.students.find(s => s.id === seat.assigned_student_id);
      const studentInfo = student ? {
        id: student.id,
        name: student.name,
        email: student.email,
        phone: student.phone,
        member_id: student.member_id
      } : {
        id: seat.assigned_student_id || '',
        name: seat.assigned_student_name || 'Assigned Student',
        email: seat.assigned_student_email || '',
        phone: seat.assigned_student_phone || '',
        member_id: ''
      };

      // Check presence dynamically from active session
      const activeSession = activeSessions.find(s => s.student_id === seat.assigned_student_id);
      const isPresent = !!activeSession;

      return {
        seat_number: seat.seat_number,
        assigned: true,
        student: studentInfo,
        presence: isPresent ? 'present' : 'absent',
        check_in: isPresent ? activeSession.check_in : null
      };
    });
  }

  // ---------------- ATTENDANCE / SESSION LOGIC ----------------

  public getActiveSession(studentId: string): AttendanceSession | null {
    return this.state.attendance.find(a => a.student_id === studentId && a.status === 'inside') || null;
  }

  public startSession(studentId: string): { success: boolean; session?: AttendanceSession; error?: string } {
    const existing = this.getActiveSession(studentId);
    if (existing) {
      return { success: false, error: 'Your session is already active.' };
    }

    const student = this.state.students.find(s => s.id === studentId);
    if (!student) {
      return { success: false, error: 'Student profile not found.' };
    }
    if (student.membership_status !== 'active') {
      return { success: false, error: 'Your membership is currently inactive. Please contact Keshav Library.' };
    }

    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const dateStr = now.toISOString().split('T')[0];

    const newSession: AttendanceSession = {
      id: `att_${Date.now()}`,
      student_id: student.id,
      student_name: student.name,
      date: dateStr,
      check_in: timeStr,
      check_out: null,
      check_in_timestamp: now.getTime(),
      check_out_timestamp: null,
      total_minutes: 0,
      status: 'inside'
    };

    this.state.attendance = [newSession, ...this.state.attendance];

    this.createNotification({
      recipient_type: 'admin',
      title: 'Student Checked In',
      message: `${student.name} (${student.assigned_seat}) checked in at ${timeStr}.`,
      type: 'attendance'
    });

    this.saveState();
    return { success: true, session: newSession };
  }

  public endSession(sessionId: string): { success: boolean; session?: AttendanceSession; error?: string } {
    const index = this.state.attendance.findIndex(a => a.id === sessionId);
    if (index === -1) {
      return { success: false, error: 'Attendance session not found.' };
    }
    const session = this.state.attendance[index];
    if (session.status !== 'inside') {
      return { success: false, error: 'Session is already completed.' };
    }

    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const checkOutTimestamp = now.getTime();
    const diffMs = Math.max(0, checkOutTimestamp - session.check_in_timestamp);
    const totalMinutes = Math.max(1, Math.round(diffMs / 60000));

    const updatedSession: AttendanceSession = {
      ...session,
      check_out: timeStr,
      check_out_timestamp: checkOutTimestamp,
      total_minutes: totalMinutes,
      status: 'completed'
    };

    this.state.attendance[index] = updatedSession;
    this.saveState();
    return { success: true, session: updatedSession };
  }

  public getStudentAttendanceHistory(studentId: string): AttendanceSession[] {
    return this.state.attendance.filter(a => a.student_id === studentId);
  }

  public calculateStreak(studentId: string): number {
    const sessions = this.getStudentAttendanceHistory(studentId).filter(s => s.status === 'completed' || s.status === 'inside');
    if (sessions.length === 0) return 0;
    const uniqueDates = Array.from(new Set(sessions.map(s => s.date))).sort().reverse();
    return uniqueDates.length;
  }

  public getTodayMinutes(studentId: string): number {
    const today = new Date().toISOString().split('T')[0];
    const sessions = this.state.attendance.filter(a => a.student_id === studentId && a.date === today);
    return sessions.reduce((acc, s) => {
      if (s.status === 'inside') {
        const liveMins = Math.max(1, Math.round((Date.now() - s.check_in_timestamp) / 60000));
        return acc + liveMins;
      }
      return acc + s.total_minutes;
    }, 0);
  }

  public getMonthMinutes(studentId: string): number {
    const currentYearMonth = new Date().toISOString().substring(0, 7);
    const sessions = this.state.attendance.filter(a => a.student_id === studentId && a.date.startsWith(currentYearMonth));
    return sessions.reduce((acc, s) => {
      if (s.status === 'inside') {
        const liveMins = Math.max(1, Math.round((Date.now() - s.check_in_timestamp) / 60000));
        return acc + liveMins;
      }
      return acc + s.total_minutes;
    }, 0);
  }

  // ---------------- FEES ----------------

  public getFees(month?: string, year?: number): MonthlyFee[] {
    let list = this.state.fees;
    if (month) list = list.filter(f => f.month.toLowerCase() === month.toLowerCase());
    if (year) list = list.filter(f => f.year === year);
    return list;
  }

  public getStudentFees(studentId: string): MonthlyFee[] {
    return this.state.fees.filter(f => f.student_id === studentId);
  }

  public markFeePaid(feeId: string): { success: boolean; error?: string } {
    const fee = this.state.fees.find(f => f.id === feeId);
    if (!fee) return { success: false, error: 'Fee record not found.' };

    fee.status = 'paid';
    fee.paid_at = new Date().toISOString().replace('T', ' ').substring(0, 16);

    this.createNotification({
      recipient_type: 'student',
      recipient_id: fee.student_id,
      title: `${fee.month} Fee Confirmed`,
      message: `Your membership fee of ₹${fee.amount} for ${fee.month} has been marked as PAID offline by Keshav Library.`,
      type: 'membership'
    });

    this.saveState();
    return { success: true };
  }

  public markFeeReminderSent(feeId: string): { success: boolean; error?: string } {
    const fee = this.state.fees.find(f => f.id === feeId);
    if (!fee) return { success: false, error: 'Fee record not found.' };

    fee.reminder_sent_at = new Date().toISOString().replace('T', ' ').substring(0, 16);
    this.saveState();
    return { success: true };
  }

  // ---------------- ENQUIRIES ----------------

  public getEnquiries(): Enquiry[] {
    return this.state.enquiries;
  }

  public submitEnquiry(data: Omit<Enquiry, 'id' | 'status' | 'created_at'>): Enquiry {
    const now = new Date();
    const dateStr = now.toISOString().replace('T', ' ').substring(0, 16);
    const newEnquiry: Enquiry = {
      id: `enq_${Date.now()}`,
      ...data,
      status: 'new',
      created_at: dateStr
    };

    this.state.enquiries = [newEnquiry, ...this.state.enquiries];

    this.createNotification({
      recipient_type: 'admin',
      title: 'New Membership Enquiry',
      message: `${data.name} has submitted a membership enquiry for Keshav Library.`,
      type: 'new_enquiry'
    });

    this.saveState();
    return newEnquiry;
  }

  public updateEnquiryStatus(enquiryId: string, status: Enquiry['status']): boolean {
    const enq = this.state.enquiries.find(e => e.id === enquiryId);
    if (!enq) return false;
    enq.status = status;
    this.saveState();
    return true;
  }

  public convertEnquiryToMember(enquiryId: string, assignedSeatNumber: number | string | null): { success: boolean; student?: StudentProfile; error?: string } {
    const enq = this.state.enquiries.find(e => e.id === enquiryId);
    if (!enq) return { success: false, error: 'Enquiry not found.' };

    const res = this.admitStudentByAdmin({
      name: enq.name,
      email: enq.email || `${enq.name.toLowerCase().replace(/\s+/g, '')}@student.keshavlibrary.in`,
      phone: enq.phone,
      seatNumber: assignedSeatNumber
    });

    if (res.success) {
      enq.status = 'converted';
      this.saveState();
    }

    return res;
  }

  // ---------------- STUDENTS MANAGEMENT ----------------

  public getStudents(): StudentProfile[] {
    return this.state.students;
  }

  public toggleStudentStatus(studentId: string): boolean {
    const student = this.state.students.find(s => s.id === studentId);
    if (!student) return false;
    student.membership_status = student.membership_status === 'active' ? 'inactive' : 'active';
    this.saveState();
    return true;
  }

  public updateStudentProfile(studentId: string, data: { name: string; phone: string; email: string }): boolean {
    const student = this.state.students.find(s => s.id === studentId);
    if (!student) return false;

    student.name = data.name.trim();
    student.phone = data.phone.trim();
    student.email = data.email.trim();

    const user = this.state.users.find(u => u.id === student.user_id);
    if (user) {
      user.name = data.name.trim();
      user.phone = data.phone.trim();
      user.email = data.email.trim();
    }

    this.saveState();
    return true;
  }

  // ---------------- NOTIFICATIONS ----------------

  public getNotifications(type?: 'admin' | 'student', recipientId?: string): AppNotification[] {
    return this.state.notifications.filter(n => {
      if (type && n.recipient_type !== type) return false;
      if (recipientId && n.recipient_id && n.recipient_id !== recipientId) return false;
      return true;
    });
  }

  public createNotification(data: Omit<AppNotification, 'id' | 'is_read' | 'created_at'>): AppNotification {
    const notif: AppNotification = {
      id: `notif_${Date.now()}`,
      ...data,
      is_read: false,
      created_at: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };
    this.state.notifications = [notif, ...this.state.notifications];
    this.saveState();
    return notif;
  }

  public markNotificationAsRead(id: string) {
    const notif = this.state.notifications.find(n => n.id === id);
    if (notif) {
      notif.is_read = true;
      this.saveState();
    }
  }

  public markAllNotificationsAsRead(recipientType: 'admin' | 'student') {
    this.state.notifications.forEach(n => {
      if (n.recipient_type === recipientType) n.is_read = true;
    });
    this.saveState();
  }

  // ---------------- METRICS ----------------

  public getAdminMetrics() {
    const totalStudents = this.state.students.length;
    const activeMembers = this.state.students.filter(s => s.membership_status === 'active').length;
    const today = new Date().toISOString().split('T')[0];
    const todaySessions = this.state.attendance.filter(a => a.date === today);
    const presentToday = new Set(todaySessions.map(a => a.student_id)).size;
    const currentlyInside = todaySessions.filter(a => a.status === 'inside').length;
    const feesDue = this.state.fees.filter(f => f.status === 'due').length;
    const newEnquiries = this.state.enquiries.filter(e => e.status === 'new').length;

    const assignedSeats = this.state.seats.filter(s => s.status === 'assigned').length;
    const availableSeats = 100 - assignedSeats;

    return {
      totalStudents,
      activeMembers,
      presentToday,
      currentlyInside,
      feesDue,
      newEnquiries,
      totalSeats: 100,
      assignedSeats,
      availableSeats,
      presentStudents: currentlyInside,
      absentStudents: assignedSeats - currentlyInside
    };
  }
}

export const libraryStore = new LibraryStore();
