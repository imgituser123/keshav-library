import React from 'react';
import {
  Shield,
  LayoutDashboard,
  Users,
  Sparkles,
  MessageSquare,
  IndianRupee,
  History,
  Armchair,
  Bell,
  Settings,
  LogOut,
  ShieldAlert,
  BookOpen
} from 'lucide-react';
import { libraryStore } from '../../services/store';
import { LIBRARY_CONFIG } from '../../config/libraryInfo';

interface AdminLayoutProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ currentPath, onNavigate, children }) => {
  const currentUser = libraryStore.getCurrentUser();
  const metrics = libraryStore.getAdminMetrics();

  // Role Guard: Strict admin authorization (Section 5)
  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-rose-200 shadow-xl text-center space-y-4">
          <div className="w-14 h-14 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mx-auto">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Access Denied: Admin Only</h2>
          <p className="text-xs text-slate-600">
            This area requires verified administrator credentials. Student accounts cannot access management endpoints.
          </p>
          <button
            onClick={() => onNavigate('/admin/login')}
            className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer"
          >
            Go to Admin Login
          </button>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    libraryStore.logout();
    onNavigate('/admin/login');
  };

  const navItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/students', label: `Manage Students (${metrics.totalStudents})`, icon: Users },
    { path: '/admin/memberships', label: 'Memberships', icon: Sparkles },
    { path: '/admin/enquiries', label: `Enquiries (${metrics.newEnquiries})`, icon: MessageSquare },
    { path: '/admin/fees', label: `Fees (${metrics.feesDue} Due)`, icon: IndianRupee },
    { path: '/admin/attendance', label: 'Attendance', icon: History },
    { path: '/admin/seats', label: 'Seats (24)', icon: Armchair },
    { path: '/admin/notifications', label: 'Notifications', icon: Bell },
    { path: '/admin/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col text-slate-800">
      {/* Admin Top Header */}
      <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              onClick={() => onNavigate('/')}
              className="flex items-center gap-2 cursor-pointer group"
            >
              <div className="w-8 h-8 bg-indigo-600 text-white rounded-lg flex items-center justify-center font-bold">
                <Shield className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-sm sm:text-base text-white tracking-tight">
                {LIBRARY_CONFIG.name}
              </span>
            </div>
            <span className="text-slate-600">•</span>
            <span className="text-[11px] font-mono bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded border border-indigo-500/30">
              Admin Console
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-xs font-bold text-white">{currentUser.name}</span>
              <span className="text-[10px] text-slate-400">Administrator</span>
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

        {/* Admin Navigation Strip */}
        <div className="bg-slate-950 px-4 sm:px-6 lg:px-8 border-t border-slate-800/80 overflow-x-auto scrollbar-none">
          <div className="max-w-7xl mx-auto flex items-center gap-1.5 py-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPath === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => onNavigate(item.path)}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 transition-all cursor-pointer ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-sm'
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

      {/* Main Admin Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
};
