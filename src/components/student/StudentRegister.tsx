import React, { useState, useEffect } from 'react';
import { User, Lock, Mail, Phone, ArrowRight, CheckCircle2, AlertCircle, KeyRound, Sparkles } from 'lucide-react';
import { libraryStore } from '../../services/store';
import { LIBRARY_CONFIG } from '../../config/libraryInfo';

interface StudentRegisterProps {
  onNavigate: (path: string) => void;
}

export const StudentRegister: React.FC<StudentRegisterProps> = ({ onNavigate }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Email status inspection to catch first-time setup smoothly
  const [admittedStatus, setAdmittedStatus] = useState<{ isAdmitted: boolean; studentName?: string; memberId?: string } | null>(null);

  useEffect(() => {
    if (!email.trim() || !email.includes('@')) {
      setAdmittedStatus(null);
      return;
    }
    const timer = setTimeout(() => {
      const status = libraryStore.checkEmailStatus(email);
      if (status.exists && !status.passwordSet) {
        setAdmittedStatus({
          isAdmitted: true,
          studentName: status.name,
          memberId: status.memberId
        });
      } else {
        setAdmittedStatus(null);
      }
    }, 250);
    return () => clearTimeout(timer);
  }, [email]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password.trim()) {
      setError('Please fill in all required fields.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please verify your password.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);

    try {
      const res = await libraryStore.registerStudent({
        name: name.trim() || (admittedStatus?.studentName || 'Student'),
        email: email.trim(),
        phone: phone.trim() || '+91 83402 35780',
        password: password
      });

      if (!res.success) {
        setError(res.error || 'Failed to create student account.');
        setLoading(false);
      } else {
        // Section 1 Bug Fix: If admitted by admin, do NOT show "Email already exists"
        // Instead, recognize as valid first-time password setup!
        if (res.isFirstTimeSetup) {
          setSuccessMsg('Student admission verified! Your password has been set. Redirecting to Student Login...');
        } else {
          setSuccessMsg('Student account created successfully. Please login to continue.');
        }
        setTimeout(() => {
          onNavigate('/student/login');
        }, 1600);
      }
    } catch (err: any) {
      setError('An error occurred during student registration.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-slate-900 px-8 py-7 text-white text-center space-y-1.5">
          <div className="w-12 h-12 bg-emerald-500 text-slate-950 rounded-2xl flex items-center justify-center mx-auto mb-2 shadow-md">
            <User className="w-6 h-6" />
          </div>
          <span className="text-xs uppercase font-bold tracking-widest text-emerald-400">Student Enrolment</span>
          <h1 className="text-2xl font-black text-white">Student Registration</h1>
          <p className="text-xs text-slate-400">
            Monthly Membership: ₹{LIBRARY_CONFIG.monthlyFee}/month (Paid Offline)
          </p>
        </div>

        {/* Admitted by Admin Alert Card */}
        <div className="p-4 bg-emerald-50 border-b border-emerald-100 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-emerald-900 font-semibold">
            <KeyRound className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>Admitted by admin already?</span>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('/student/login')}
            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold text-[11px] shadow-xs cursor-pointer shrink-0"
          >
            Set Password Here →
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-4">
          {error && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs font-semibold flex items-center gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-xs font-bold flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Email Address <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                placeholder="student@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            {/* Admitted banner */}
            {admittedStatus && admittedStatus.isAdmitted && (
              <div className="mt-2 p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-[11px] text-emerald-900 font-semibold flex items-center gap-1.5 animate-in fade-in">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>
                  Admission verified for <strong>{admittedStatus.studentName}</strong> ({admittedStatus.memberId})! Entering your password below will activate your account.
                </span>
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Full Name <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                required
                placeholder="e.g. Rahul Sharma"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Mobile Number <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="tel"
                required
                placeholder="+91 83402 35780"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full pl-10 pr-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Password <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  placeholder="Min 6 chars"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Confirm Password <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  placeholder="Repeat password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
          >
            <span>{loading ? 'Processing...' : (admittedStatus?.isAdmitted ? 'Activate Admitted Account' : 'Create Student Account')}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="pt-3 border-t border-slate-100 text-center text-xs">
            <span className="text-slate-500">Already have an account? </span>
            <button
              type="button"
              onClick={() => onNavigate('/student/login')}
              className="text-emerald-700 font-bold hover:underline cursor-pointer"
            >
              Login to Student Portal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
