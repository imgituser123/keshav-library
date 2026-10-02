import React from 'react';
import {
  Users,
  Clock,
  IndianRupee,
  MessageSquare,
  Armchair,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Plus,
  ArrowRight,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { libraryStore } from '../../services/store';
import { LIBRARY_CONFIG } from '../../config/libraryInfo';

interface AdminDashboardViewProps {
  onNavigate: (path: string) => void;
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({ onNavigate }) => {
  const metrics = libraryStore.getAdminMetrics();
  const students = libraryStore.getStudents();
  const enquiries = libraryStore.getEnquiries();
  const attendance = libraryStore.getState().attendance;

  const todayStr = new Date().toISOString().split('T')[0];
  const activeInsideSessions = attendance.filter(a => a.status === 'inside' && a.date === todayStr);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-bold tracking-widest text-indigo-400">Management Overview</span>
            <span className="text-slate-600">•</span>
            <span className="text-xs text-slate-400">{LIBRARY_CONFIG.name}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Admin Dashboard
          </h1>
          <p className="text-xs text-slate-300">
            {LIBRARY_CONFIG.address} • {LIBRARY_CONFIG.hours}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('/admin/students')}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Manage Students</span>
          </button>
        </div>
      </div>

      {/* Required Clean Metrics (Section 7 & 22) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Total Students */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 block">Total Students</span>
          <div className="text-3xl font-black text-slate-900 mt-1 font-mono">
            {metrics.totalStudents}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Registered in system</span>
        </div>

        {/* Active Members */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 block">Active Members</span>
          <div className="text-3xl font-black text-emerald-600 mt-1 font-mono">
            {metrics.activeMembers}
          </div>
          <span className="text-[11px] text-emerald-600 font-medium mt-1 block">Valid study passes</span>
        </div>

        {/* Present Today */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 block">Present Today</span>
          <div className="text-3xl font-black text-sky-600 mt-1 font-mono">
            {metrics.presentToday}
          </div>
          <span className="text-[11px] text-sky-600 font-medium mt-1 block">Unique student visits</span>
        </div>

        {/* Currently Inside */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 block">Currently Inside</span>
          <div className="text-3xl font-black text-indigo-600 mt-1 font-mono">
            {metrics.currentlyInside}
          </div>
          <span className="text-[11px] text-indigo-600 font-medium mt-1 block">Active desk sessions</span>
        </div>

        {/* Fees Due */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 block">Fees Due</span>
          <div className="text-3xl font-black text-rose-600 mt-1 font-mono">
            {metrics.feesDue}
          </div>
          <span className="text-[11px] text-rose-600 font-medium mt-1 block">Pending ₹600 payments</span>
        </div>

        {/* New Enquiries */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 block">New Enquiries</span>
          <div className="text-3xl font-black text-amber-600 mt-1 font-mono">
            {metrics.newEnquiries}
          </div>
          <span className="text-[11px] text-amber-600 font-medium mt-1 block">Awaiting response</span>
        </div>
      </div>

      {/* Zero State Guide if clean database */}
      {metrics.totalStudents === 0 && (
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xs text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">
            Clean Database Active — Zero Dummy Records
          </h3>
          <p className="text-xs text-slate-600 max-w-lg mx-auto leading-relaxed">
            The platform is running in clean production mode with 0 dummy records. As new students register or visitors submit enquiries through the website, real records and statistics will populate dynamically.
          </p>
          <div className="pt-2 flex flex-wrap justify-center gap-3">
            <button
              onClick={() => onNavigate('/admin/students')}
              className="px-4 py-2 bg-slate-900 text-white font-bold text-xs rounded-xl shadow-xs"
            >
              Enroll First Student
            </button>
            <button
              onClick={() => onNavigate('/contact')}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl"
            >
              View Public Website
            </button>
          </div>
        </div>
      )}

      {/* Operational Highlights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Live inside students */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Clock className="w-5 h-5 text-indigo-600" />
                <span>Currently Inside Keshav Library</span>
              </h3>
              <p className="text-xs text-slate-500">Live active sessions logged by students</p>
            </div>
            <button
              onClick={() => onNavigate('/admin/attendance')}
              className="text-xs text-indigo-600 font-bold hover:underline cursor-pointer"
            >
              All Attendance →
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {activeInsideSessions.length === 0 ? (
              <div className="py-8 text-center text-slate-400 text-xs">
                No students currently marked inside.
              </div>
            ) : (
              activeInsideSessions.map(sess => (
                <div key={sess.id} className="py-3.5 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
                    <div>
                      <div className="text-sm font-bold text-slate-900">{sess.student_name}</div>
                      <div className="text-xs text-slate-500">
                        Check-in: <strong className="font-mono text-slate-800">{sess.check_in}</strong> • Date: {sess.date}
                      </div>
                    </div>
                  </div>
                  <span className="text-xs px-2.5 py-1 bg-emerald-100 text-emerald-800 font-bold rounded-lg">
                    Inside
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Col: Quick Management Actions */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-indigo-600" />
              <span>Administrative Tools</span>
            </h3>

            <div className="space-y-2">
              <button
                onClick={() => onNavigate('/admin/enquiries')}
                className="w-full p-3 bg-slate-50 hover:bg-slate-100 rounded-xl text-left border border-slate-200 transition-colors flex items-center justify-between cursor-pointer"
              >
                <div>
                  <div className="text-xs font-bold text-slate-900">Review Enquiries</div>
                  <div className="text-[11px] text-slate-500">{metrics.newEnquiries} pending review</div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </button>

              <button
                onClick={() => onNavigate('/admin/fees')}
                className="w-full p-3 bg-slate-50 hover:bg-slate-100 rounded-xl text-left border border-slate-200 transition-colors flex items-center justify-between cursor-pointer"
              >
                <div>
                  <div className="text-xs font-bold text-slate-900">Fee Management & WhatsApp</div>
                  <div className="text-[11px] text-slate-500">{metrics.feesDue} fees due</div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </button>

              <button
                onClick={() => onNavigate('/admin/seats')}
                className="w-full p-3 bg-slate-50 hover:bg-slate-100 rounded-xl text-left border border-slate-200 transition-colors flex items-center justify-between cursor-pointer"
              >
                <div>
                  <div className="text-xs font-bold text-slate-900">24 Study Desks Grid</div>
                  <div className="text-[11px] text-slate-500">Silent, General, Digital, Discussion</div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </button>

              <button
                onClick={() => onNavigate('/admin/settings')}
                className="w-full p-3 bg-slate-50 hover:bg-slate-100 rounded-xl text-left border border-slate-200 transition-colors flex items-center justify-between cursor-pointer"
              >
                <div>
                  <div className="text-xs font-bold text-slate-900">Library Settings</div>
                  <div className="text-[11px] text-slate-500">Location & Database controls</div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 text-xs text-slate-500">
            <strong>Location:</strong> {LIBRARY_CONFIG.address}
          </div>
        </div>
      </div>
    </div>
  );
};
