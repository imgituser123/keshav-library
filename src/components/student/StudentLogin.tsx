import React, { useState, useEffect } from 'react';
import { User, Lock, Mail, ArrowRight, AlertCircle, CheckCircle2, KeyRound, Sparkles, ShieldCheck } from 'lucide-react';
import { libraryStore } from '../../services/store';
import { LIBRARY_CONFIG } from '../../config/libraryInfo';

interface StudentLoginProps {
  onNavigate: (path: string) => void;
  onLoginSuccess: () => void;
  initialMode?: 'login' | 'set-password';
}

export const StudentLogin: React.FC<StudentLoginProps> = ({ onNavigate, onLoginSuccess, initialMode = 'login' }) => {
  const [mode, setMode] = useState<'login' | 'set-password'>(initialMode);

  // Login form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Set-Password form state
  const [setupEmail, setSetupEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [emailStatus, setEmailStatus] = useState<{ checked: boolean; exists: boolean; passwordSet: boolean; name?: string; memberId?: string } | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Live check on setupEmail blur or change
  useEffect(() => {
    if (!setupEmail.trim() || !setupEmail.includes('@')) {
      setEmailStatus(null);
      return;
    }
    const timer = setTimeout(() => {
      const status = libraryStore.checkEmailStatus(setupEmail);
      setEmailStatus({
        checked: true,
        exists: status.exists,
        passwordSet: status.passwordSet,
        name: status.name,
        memberId: status.memberId
      });
    }, 300);
    return () => clearTimeout(timer);
  }, [setupEmail]);

  const handleRegularLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (!email.trim() || !password.trim()) {
      setError('Please provide your email and password.');
      return;
    }

    setLoading(true);

    try {
      const result = await libraryStore.loginStudent(email, password);
      if (result.success) {
        onLoginSuccess();
      } else if (result.needsPasswordSet) {
        // Automatic redirection to First-Time Login mode!
        setSetupEmail(email.trim());
        setMode('set-password');
        setError(null);
        setSuccessMsg('Your admission is approved! Please set your new password below to activate your account.');
      } else {
        setError(result.error || 'Invalid student email or password.');
      }
    } catch (err: any) {
      setError('An error occurred during student login. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    const targetEmail = setupEmail.trim().toLowerCase();
    if (!targetEmail) {
      setError('Please enter your admitted email address.');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match. Please verify both password fields.');
      return;
    }

    setLoading(true);

    try {
      const res = await libraryStore.setStudentPassword(targetEmail, newPassword);
      if (!res.success) {
        setError(res.error || 'Failed to set password.');
        setLoading(false);
      } else {
        setSuccessMsg('Password created successfully! Logging you into your study dashboard...');
        // Auto-login the newly configured student
        setTimeout(async () => {
          await libraryStore.loginStudent(targetEmail, newPassword);
          onLoginSuccess();
        }, 1200);
      }
    } catch (err: any) {
      setError('An error occurred while creating your password.');
      setLoading(false);
    }
  };

  const fillDemoAdmittedStudent = () => {
    setMode('set-password');
    setSetupEmail('rohan@keshavlibrary.in');
    setNewPassword('student123');
    setConfirmPassword('student123');
    setError(null);
    setSuccessMsg(null);
  };

  const fillDemoActiveStudent = () => {
    setMode('login');
    setEmail('rahul@keshavlibrary.in');
    setPassword('student123');
    setError(null);
    setSuccessMsg(null);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-slate-900 px-8 py-7 text-white text-center space-y-1.5">
          <div className="w-12 h-12 bg-emerald-500 text-slate-950 rounded-2xl flex items-center justify-center mx-auto mb-2 shadow-md">
            {mode === 'login' ? <User className="w-6 h-6" /> : <KeyRound className="w-6 h-6" />}
          </div>
          <span className="text-xs uppercase font-bold tracking-widest text-emerald-400">Student Portal</span>
          <h1 className="text-2xl font-black text-white">
            {mode === 'login' ? 'Student Login' : 'Set Password / First-Time Login'}
          </h1>
          <p className="text-xs text-slate-400">
            {LIBRARY_CONFIG.name} • Monthly Membership ₹{LIBRARY_CONFIG.monthlyFee}/mo
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 p-2 bg-slate-100 border-b border-slate-200 text-xs font-bold text-center">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setError(null);
              setSuccessMsg(null);
            }}
            className={`py-2.5 rounded-xl transition-all cursor-pointer ${
              mode === 'login'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Student Login
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('set-password');
              setError(null);
              setSuccessMsg(null);
            }}
            className={`py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              mode === 'set-password'
                ? 'bg-white text-emerald-700 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>First-Time Login</span>
          </button>
        </div>

        {/* Notices */}
        <div className="px-8 pt-6">
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
        </div>

        {/* MODE 1: REGULAR LOGIN */}
        {mode === 'login' && (
          <form onSubmit={handleRegularLogin} className="p-8 pt-4 space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Registered Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  required
                  placeholder="student@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-700">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setSetupEmail(email);
                    setMode('set-password');
                    setError(null);
                  }}
                  className="text-xs text-emerald-700 font-bold hover:underline cursor-pointer"
                >
                  First-time student?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <span>{loading ? 'Logging in...' : 'Login to Student Portal'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* First-time prompt card */}
            <div className="p-3.5 bg-emerald-50/70 border border-emerald-100 rounded-xl text-xs space-y-1">
              <div className="font-bold text-emerald-900 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Admitted by Keshav Library Admin?</span>
              </div>
              <p className="text-slate-600 text-[11px]">
                If the library owner enrolled you offline and you haven't created a password yet:
              </p>
              <button
                type="button"
                onClick={() => {
                  setSetupEmail(email);
                  setMode('set-password');
                }}
                className="mt-1 text-xs font-bold text-emerald-700 hover:underline cursor-pointer"
              >
                Click here: Set Password / First-Time Login →
              </button>
            </div>

            {/* Quick Demo Test Pills */}
            <div className="pt-2 border-t border-slate-100">
              <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                Quick Test Credentials
              </span>
              <div className="space-y-1.5">
                <button
                  type="button"
                  onClick={fillDemoActiveStudent}
                  className="w-full text-left p-2 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs flex items-center justify-between cursor-pointer"
                >
                  <div>
                    <span className="font-semibold text-slate-800">rahul@keshavlibrary.in</span>
                    <span className="text-[10px] text-slate-500 block">Password: student123 (Active)</span>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                    Login Test
                  </span>
                </button>
                <button
                  type="button"
                  onClick={fillDemoAdmittedStudent}
                  className="w-full text-left p-2 rounded-lg bg-amber-50/80 hover:bg-amber-100/80 border border-amber-200 text-xs flex items-center justify-between cursor-pointer"
                >
                  <div>
                    <span className="font-semibold text-slate-800">rohan@keshavlibrary.in</span>
                    <span className="text-[10px] text-amber-700 block">Admitted by Admin (No password yet)</span>
                  </div>
                  <span className="text-[10px] font-bold text-amber-800 bg-amber-200 px-2 py-0.5 rounded-full">
                    Setup Test
                  </span>
                </button>
              </div>
            </div>

            {/* Links */}
            <div className="pt-2 border-t border-slate-100 space-y-2 text-center text-xs">
              <div>
                <span className="text-slate-500">Not enrolled yet? </span>
                <button
                  type="button"
                  onClick={() => onNavigate('/student/register')}
                  className="text-emerald-700 font-bold hover:underline cursor-pointer"
                >
                  Register as Student
                </button>
              </div>
              <div>
                <span className="text-slate-400">Library Staff / Owner? </span>
                <button
                  type="button"
                  onClick={() => onNavigate('/admin/login')}
                  className="text-indigo-600 font-semibold hover:underline cursor-pointer"
                >
                  Admin Login
                </button>
              </div>
            </div>
          </form>
        )}

        {/* MODE 2: SET PASSWORD / FIRST-TIME LOGIN */}
        {mode === 'set-password' && (
          <form onSubmit={handleSetPassword} className="p-8 pt-4 space-y-4">
            <div className="p-3 bg-indigo-50/80 border border-indigo-100 rounded-xl text-xs text-indigo-950 space-y-1">
              <div className="font-bold flex items-center gap-1.5 text-indigo-900">
                <KeyRound className="w-4 h-4 text-indigo-600" />
                <span>First-Time Password Creation</span>
              </div>
              <p className="text-[11px] text-indigo-800 leading-relaxed">
                If the admin admitted you, enter your registered email to set a secure password. Your seat, membership, and details are already preserved.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Already-Admitted Email Address <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  required
                  placeholder="student@example.com"
                  value={setupEmail}
                  onChange={(e) => setSetupEmail(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              {/* Status indicator on the email */}
              {emailStatus && emailStatus.checked && (
                <div className="mt-1.5 text-[11px] font-semibold">
                  {emailStatus.exists && !emailStatus.passwordSet && (
                    <span className="text-emerald-700 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      Admission verified for {emailStatus.name} ({emailStatus.memberId})! Set your password below.
                    </span>
                  )}
                  {emailStatus.exists && emailStatus.passwordSet && (
                    <span className="text-amber-700 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                      Password is already configured for this student.
                      <button
                        type="button"
                        onClick={() => {
                          setEmail(setupEmail);
                          setMode('login');
                        }}
                        className="underline font-bold ml-1"
                      >
                        Switch to Login
                      </button>
                    </span>
                  )}
                  {!emailStatus.exists && (
                    <span className="text-slate-500 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 text-slate-400" />
                      No admitted student record found with this email yet.
                    </span>
                  )}
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                New Password <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  required
                  placeholder="At least 6 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Confirm Password <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  required
                  placeholder="Re-type your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-1"
            >
              <span>{loading ? 'Activating Password...' : 'Create Password & Login'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Quick Demo Test Pill */}
            <div className="pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={fillDemoAdmittedStudent}
                className="w-full text-left p-2 rounded-lg bg-amber-50/80 hover:bg-amber-100/80 border border-amber-200 text-xs flex items-center justify-between cursor-pointer"
              >
                <div>
                  <span className="font-semibold text-slate-800">rohan@keshavlibrary.in</span>
                  <span className="text-[10px] text-amber-700 block">Admitted by Admin (Pre-fill test)</span>
                </div>
                <span className="text-[10px] font-bold text-amber-800 bg-amber-200 px-2 py-0.5 rounded-full">
                  Click to Test
                </span>
              </button>
            </div>

            <div className="pt-2 border-t border-slate-100 text-center text-xs">
              <span className="text-slate-500">Already set your password? </span>
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setError(null);
                  setSuccessMsg(null);
                }}
                className="text-emerald-700 font-bold hover:underline cursor-pointer"
              >
                Back to Student Login
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
