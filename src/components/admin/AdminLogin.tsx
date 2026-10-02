import React, { useState } from 'react';
import { Shield, Lock, Mail, ArrowRight, AlertCircle, BookOpen } from 'lucide-react';
import { libraryStore } from '../../services/store';
import { LIBRARY_CONFIG } from '../../config/libraryInfo';

interface AdminLoginProps {
  onNavigate: (path: string) => void;
  onLoginSuccess: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onNavigate, onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Please provide your admin email and password.');
      return;
    }
    setError(null);
    setLoading(true);

    try {
      const result = await libraryStore.loginAdmin(email, password);
      if (result.success) {
        onLoginSuccess();
      } else {
        setError(result.error || 'Invalid admin credentials.');
      }
    } catch (err: any) {
      setError('An error occurred during admin login.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-100">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-slate-900 px-8 py-7 text-white text-center space-y-1.5">
          <div className="w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-2 shadow-md">
            <Shield className="w-6 h-6" />
          </div>
          <span className="text-xs uppercase font-bold tracking-widest text-indigo-400">Management Console</span>
          <h1 className="text-2xl font-black text-white">Admin Login</h1>
          <p className="text-xs text-slate-400">
            {LIBRARY_CONFIG.name} Management
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          {error && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs font-semibold flex items-center gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Admin Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                placeholder="admin@keshavlibrary.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <span>{loading ? 'Authenticating...' : 'Login'}</span>
            <ArrowRight className="w-4 h-4 text-indigo-400" />
          </button>

          {/* Links (Section 6) */}
          <div className="pt-4 border-t border-slate-100 space-y-3 text-center text-xs">
            <div>
              <span className="text-slate-500">Don't have an account? </span>
              <button
                type="button"
                onClick={() => onNavigate('/admin/register')}
                className="text-indigo-600 font-bold hover:underline cursor-pointer"
              >
                Register as Admin
              </button>
            </div>
            <div>
              <span className="text-slate-400">Student Portal? </span>
              <button
                type="button"
                onClick={() => onNavigate('/student/login')}
                className="text-emerald-700 font-semibold hover:underline cursor-pointer"
              >
                Student Login
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
