import React from 'react';
import {
  Clock,
  User,
  History,
  IndianRupee,
  Bell,
  LogOut,
  Sparkles,
  ShieldAlert,
  Armchair,
  BookOpen
} from 'lucide-react';
import { libraryStore } from '../../services/store';
import { LIBRARY_CONFIG } from '../../config/libraryInfo';

interface StudentLayoutProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  children: React.ReactNode;
}

export const StudentLayout: React.FC<StudentLayoutProps> = ({ currentPath, onNavigate, children }) => {
  const currentUser = libraryStore.getCurrentUser();
  const student = libraryStore.getCurrentStudent();

  // Role Guard: Only students allowed
  if (!currentUser || currentUser.role !== 'student') {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-rose-200 shadow-xl text-center space-y-4">
          <div className="w-14 h-14 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mx-auto">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Student Portal Access Restricted</h2>
          <p className="text-xs text-slate-600">
            Please log in with a student account to access the student dashboard, time tracker, and attendance records.
          </p>
          <button
            onClick={() => onNavigate('/student/login')}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer"
          >
            Go to Student Login
          </button>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    libraryStore.logout();
    onNavigate('/student/login');
  };

  const navItems = [
    { path: '/student/dashboard', label: 'Dashboard', icon: Clock },
    { path: '/student/attendance', label: 'Time Tracker & Attendance', icon: History },
    { path: '/student/membership', label: 'Membership (₹600)', icon: Sparkles },
    { path: '/student/fees', label: 'Fee Status', icon: IndianRupee },
    { path: '/student/profile', label: 'My Profile', icon: User },
    { path: '/student/notifications', label: 'Notifications', icon: Bell },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Student Top Bar */}
      <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              onClick={() => onNavigate('/')}
              className="flex items-center gap-2 cursor-pointer group"
            >
              <div className="w-8 h-8 bg-emerald-500 text-slate-950 rounded-lg flex items-center justify-center font-bold">
                <BookOpen className="w-4 h-4 fill-current" />
              </div>
              <span className="font-extrabold text-sm sm:text-base text-white tracking-tight">
                {LIBRARY_CONFIG.name}
              </span>
            </div>
            <span className="text-slate-600">•</span>
            <span className="text-[11px] font-mono bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/30">
              Student ID: {student?.member_id || 'Student'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-xs font-bold text-white">{student?.name || currentUser.name}</span>
              <span className="text-[10px] text-slate-400">Desk: {student?.assigned_seat || 'Unassigned'}</span>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-xl transition-colors cursor-pointer border border-slate-800"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Student Sub-Navigation Tabs */}
        <div className="bg-slate-950/80 border-t border-slate-800/80 px-4 sm:px-6 lg:px-8 overflow-x-auto scrollbar-none">
          <div className="max-w-7xl mx-auto flex items-center gap-1 py-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPath === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => onNavigate(item.path)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap flex items-center gap-2 transition-all cursor-pointer ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
};
