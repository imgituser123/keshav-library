import React, { useState, useEffect } from 'react';
import {
  Clock,
  Play,
  Square,
  Flame,
  Calendar,
  IndianRupee,
  User,
  History,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Armchair
} from 'lucide-react';
import { libraryStore } from '../../services/store';
import { AttendanceSession, MonthlyFee, StudentProfile } from '../../types';
import { LIBRARY_CONFIG } from '../../config/libraryInfo';

interface StudentDashboardViewProps {
  student: StudentProfile;
  onNavigate: (path: string) => void;
}

export const StudentDashboardView: React.FC<StudentDashboardViewProps> = ({ student, onNavigate }) => {
  const [activeSession, setActiveSession] = useState<AttendanceSession | null>(null);
  const [liveElapsedSeconds, setLiveElapsedSeconds] = useState(0);
  const [todayMinutes, setTodayMinutes] = useState(0);
  const [monthMinutes, setMonthMinutes] = useState(0);
  const [streak, setStreak] = useState(0);
  const [fees, setFees] = useState<MonthlyFee[]>([]);
  const [actionNotice, setActionNotice] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const refreshData = () => {
    setActiveSession(libraryStore.getActiveSession(student.id));
    setTodayMinutes(libraryStore.getTodayMinutes(student.id));
    setMonthMinutes(libraryStore.getMonthMinutes(student.id));
    setStreak(libraryStore.calculateStreak(student.id));
    setFees(libraryStore.getStudentFees(student.id));
  };

  useEffect(() => {
    refreshData();
    const unsub = libraryStore.subscribe(refreshData);
    return () => unsub();
  }, [student.id]);

  useEffect(() => {
    if (!activeSession) {
      setLiveElapsedSeconds(0);
      return;
    }
    const update = () => {
      const now = Date.now();
      const diffMs = Math.max(0, now - activeSession.check_in_timestamp);
      setLiveElapsedSeconds(Math.floor(diffMs / 1000));
    };
    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, [activeSession]);

  const handleStartSession = () => {
    setActionError(null);
    setActionNotice(null);
    const res = libraryStore.startSession(student.id);
    if (!res.success) {
      setActionError(res.error || 'Unable to start session.');
    } else {
      setActionNotice('Study session started! Welcome to Keshav Library.');
      setTimeout(() => setActionNotice(null), 4000);
    }
  };

  const handleEndSession = () => {
    if (!activeSession) return;
    setActionError(null);
    setActionNotice(null);
    const res = libraryStore.endSession(activeSession.id);
    if (!res.success) {
      setActionError(res.error || 'Unable to end session.');
    } else {
      const mins = res.session?.total_minutes || 0;
      const hours = Math.floor(mins / 60);
      const remainingMins = mins % 60;
      setActionNotice(`Session ended! Recorded ${hours}h ${remainingMins}m of library time.`);
      setTimeout(() => setActionNotice(null), 5000);
    }
  };

  const formatMins = (totalMins: number) => {
    const hours = Math.floor(totalMins / 60);
    const mins = totalMins % 60;
    return `${hours}h ${mins.toString().padStart(2, '0')}m`;
  };

  const formatLiveDuration = (totalSec: number) => {
    const hours = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    return `${hours.toString().padStart(2, '0')}h ${mins.toString().padStart(2, '0')}m ${secs.toString().padStart(2, '0')}s`;
  };

  // Find latest fee
  const currentFee = fees[0];
  const isFeeDue = currentFee ? currentFee.status === 'due' : false;

  return (
    <div className="space-y-6">
      {/* Top Banner (Section 8) */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-bold tracking-widest text-emerald-400">Student Dashboard</span>
            <span className="text-slate-600">•</span>
            <span className="text-xs text-slate-400">{LIBRARY_CONFIG.hours}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white">
            Welcome, {student.name} 👋
          </h1>
          <div className="flex flex-wrap items-center gap-3 pt-2 text-xs text-slate-300">
            <span className="bg-slate-800 px-3 py-1 rounded-lg border border-slate-700 font-mono">
              Member ID: {student.member_id}
            </span>
            <span className="bg-slate-800 px-3 py-1 rounded-lg border border-slate-700 flex items-center gap-1.5">
              <Armchair className="w-3.5 h-3.5 text-emerald-400" />
              Desk: <strong>{student.assigned_seat}</strong>
            </span>
            <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-lg font-medium">
              Joined: {student.join_date}
            </span>
          </div>
        </div>
      </div>

      {/* Action Notices */}
      {actionNotice && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl flex items-center gap-3 text-sm font-semibold animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{actionNotice}</span>
        </div>
      )}

      {actionError && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl flex items-center gap-3 text-sm font-semibold animate-in fade-in">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{actionError}</span>
        </div>
      )}

      {/* Section 8 Required Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Membership Card */}
        <div className={`p-6 rounded-2xl border shadow-xs flex flex-col justify-between ${
          isFeeDue ? 'bg-amber-50/80 border-amber-200' : 'bg-white border-slate-200'
        }`}>
          <div>
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-500">
              <span>Membership</span>
              <span className={`px-2 py-0.5 rounded text-[10px] uppercase ${
                student.membership_status === 'active' ? 'bg-emerald-100 text-emerald-800 font-bold' : 'bg-rose-100 text-rose-800 font-bold'
              }`}>
                {student.membership_status}
              </span>
            </div>
            <div className="text-2xl font-black text-slate-900 mt-2">
              ₹{LIBRARY_CONFIG.monthlyFee} <span className="text-xs font-normal text-slate-500">/ month</span>
            </div>
            <div className="mt-1 text-xs font-semibold">
              Status: <span className={isFeeDue ? 'text-amber-700 font-bold' : 'text-emerald-700 font-bold'}>
                {isFeeDue ? 'PAYMENT DUE' : 'ACTIVE (PAID)'}
              </span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-200/60">
            <button
              onClick={() => onNavigate('/student/membership')}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
            >
              <span>View Membership Details</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Today's Library Time */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Today's Library Time
            </div>
            <div className="text-3xl font-black text-slate-900 mt-2 font-mono">
              {formatMins(todayMinutes)}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Time spent inside library today
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-emerald-600 font-semibold flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Dedicated study hours</span>
          </div>
        </div>

        {/* Current Session */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Current Session
            </div>
            {activeSession ? (
              <div className="mt-2 space-y-1">
                <div className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded inline-block">
                  Checked in: {activeSession.check_in}
                </div>
                <div className="text-xl font-black font-mono text-emerald-600 animate-pulse pt-1">
                  {formatLiveDuration(liveElapsedSeconds)}
                </div>
              </div>
            ) : (
              <div className="mt-2">
                <div className="text-lg font-bold text-slate-700">No active session</div>
                <p className="text-xs text-slate-500 mt-1">Ready to study? Start below.</p>
              </div>
            )}
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500">
            {activeSession ? 'Session in progress' : 'Desk available'}
          </div>
        </div>

        {/* This Month Time */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
              This Month
            </div>
            <div className="text-3xl font-black text-slate-900 mt-2 font-mono">
              {formatMins(monthMinutes)}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Accumulated monthly study time
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-orange-600 font-bold flex items-center gap-1">
            <Flame className="w-3.5 h-3.5 fill-orange-500" />
            <span>{streak} Days Active Streak</span>
          </div>
        </div>
      </div>

      {/* Primary Action Box: Large Session Tracker */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-lg">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
              Library Time Tracking System
            </span>
            <h2 className="text-2xl font-black text-white">
              {activeSession ? 'Your Study Session is in Progress' : 'Arrived at Keshav Library?'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-lg">
              {activeSession
                ? `You checked in at ${activeSession.check_in}. When packing up to leave, click END MY SESSION to log your completed duration.`
                : `Take your desk at ${student.assigned_seat}, bring out your books and notes, and click START MY SESSION to begin recording.`}
            </p>
          </div>

          <div className="flex flex-col items-center gap-2 shrink-0">
            {activeSession ? (
              <button
                onClick={handleEndSession}
                className="px-8 py-4.5 bg-rose-600 hover:bg-rose-500 text-white font-black text-base rounded-2xl transition-all shadow-xl hover:shadow-rose-600/30 flex items-center gap-2.5 cursor-pointer"
              >
                <Square className="w-5 h-5 fill-current" />
                <span>END MY SESSION</span>
              </button>
            ) : (
              <button
                onClick={handleStartSession}
                className="px-8 py-4.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-base rounded-2xl transition-all shadow-xl hover:shadow-emerald-500/20 flex items-center gap-2.5 cursor-pointer"
              >
                <Play className="w-5 h-5 fill-current" />
                <span>START MY SESSION</span>
              </button>
            )}
            <span className="text-[11px] text-slate-400">
              {activeSession ? 'Automatically computes duration' : 'Logs exact timestamp'}
            </span>
          </div>
        </div>
      </div>

      {/* Main Actions Grid (Section 8) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Main Actions & Navigation
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <button
            onClick={() => onNavigate('/student/attendance')}
            className="p-4 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left transition-colors cursor-pointer group"
          >
            <History className="w-5 h-5 text-emerald-600 mb-2 group-hover:scale-110 transition-transform" />
            <div className="text-xs font-bold text-slate-900">View Attendance</div>
            <p className="text-[11px] text-slate-500 mt-0.5">Session history & logs</p>
          </button>

          <button
            onClick={() => onNavigate('/student/membership')}
            className="p-4 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left transition-colors cursor-pointer group"
          >
            <Sparkles className="w-5 h-5 text-emerald-600 mb-2 group-hover:scale-110 transition-transform" />
            <div className="text-xs font-bold text-slate-900">View Membership</div>
            <p className="text-[11px] text-slate-500 mt-0.5">₹600/month plan</p>
          </button>

          <button
            onClick={() => onNavigate('/student/fees')}
            className="p-4 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left transition-colors cursor-pointer group"
          >
            <IndianRupee className="w-5 h-5 text-emerald-600 mb-2 group-hover:scale-110 transition-transform" />
            <div className="text-xs font-bold text-slate-900">View Fee Status</div>
            <p className="text-[11px] text-slate-500 mt-0.5">Due & paid records</p>
          </button>

          <button
            onClick={() => onNavigate('/student/profile')}
            className="p-4 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left transition-colors cursor-pointer group"
          >
            <User className="w-5 h-5 text-emerald-600 mb-2 group-hover:scale-110 transition-transform" />
            <div className="text-xs font-bold text-slate-900">My Profile</div>
            <p className="text-[11px] text-slate-500 mt-0.5">Contact & desk info</p>
          </button>

          <button
            onClick={() => onNavigate('/student/notifications')}
            className="p-4 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left transition-colors cursor-pointer group"
          >
            <Clock className="w-5 h-5 text-emerald-600 mb-2 group-hover:scale-110 transition-transform" />
            <div className="text-xs font-bold text-slate-900">Notifications</div>
            <p className="text-[11px] text-slate-500 mt-0.5">Announcements & alerts</p>
          </button>
        </div>
      </div>
    </div>
  );
};
