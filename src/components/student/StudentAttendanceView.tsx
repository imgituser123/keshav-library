import React, { useState, useEffect } from 'react';
import { History, Calendar, Clock, Play, Square, AlertCircle, CheckCircle2, TrendingUp } from 'lucide-react';
import { StudentProfile, AttendanceSession } from '../../types';
import { libraryStore } from '../../services/store';

interface StudentAttendanceViewProps {
  student: StudentProfile;
}

export const StudentAttendanceView: React.FC<StudentAttendanceViewProps> = ({ student }) => {
  const [history, setHistory] = useState<AttendanceSession[]>([]);
  const [activeSession, setActiveSession] = useState<AttendanceSession | null>(null);
  const [liveSeconds, setLiveSeconds] = useState(0);
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const refreshData = () => {
    // Only this student's records (Section 14)
    setHistory(libraryStore.getStudentAttendanceHistory(student.id));
    setActiveSession(libraryStore.getActiveSession(student.id));
  };

  useEffect(() => {
    refreshData();
    const unsub = libraryStore.subscribe(refreshData);
    return () => unsub();
  }, [student.id]);

  useEffect(() => {
    if (!activeSession) {
      setLiveSeconds(0);
      return;
    }
    const update = () => {
      const now = Date.now();
      const diffMs = Math.max(0, now - activeSession.check_in_timestamp);
      setLiveSeconds(Math.floor(diffMs / 1000));
    };
    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, [activeSession]);

  const handleStartSession = () => {
    setError(null);
    setNotice(null);
    const res = libraryStore.startSession(student.id);
    if (!res.success) {
      setError(res.error || 'Failed to start session.');
    } else {
      setNotice('Session started successfully!');
      setTimeout(() => setNotice(null), 4000);
    }
  };

  const handleEndSession = () => {
    if (!activeSession) return;
    setError(null);
    setNotice(null);
    const res = libraryStore.endSession(activeSession.id);
    if (!res.success) {
      setError(res.error || 'Failed to end session.');
    } else {
      const mins = res.session?.total_minutes || 0;
      const hours = Math.floor(mins / 60);
      const remainingMins = mins % 60;
      setNotice(`Session ended! Recorded ${hours}h ${remainingMins}m of library time.`);
      setTimeout(() => setNotice(null), 5000);
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

  return (
    <div className="space-y-6">
      {/* Session Tracker Control */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1.5 text-center md:text-left">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
              Session Controller
            </span>
            <h2 className="text-2xl font-black text-white">
              {activeSession ? 'You are currently inside Keshav Library' : 'Start Today\'s Study Session'}
            </h2>
            <p className="text-xs text-slate-300">
              {activeSession
                ? `Entry recorded at ${activeSession.check_in}. Duration: ${formatLiveDuration(liveSeconds)}`
                : `Assigned Desk: ${student.assigned_seat}. Click below when arriving.`}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {activeSession ? (
              <button
                onClick={handleEndSession}
                className="px-8 py-3.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer"
              >
                <Square className="w-4 h-4 fill-current" />
                <span>END MY SESSION</span>
              </button>
            ) : (
              <button
                onClick={handleStartSession}
                className="px-8 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>START MY SESSION</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {notice && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{notice}</span>
        </div>
      )}

      {error && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-900 rounded-xl text-xs font-bold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600" />
          <span>{error}</span>
        </div>
      )}

      {/* Attendance History Table (Section 14) */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <History className="w-5 h-5 text-emerald-600" />
              <span>My Attendance & Library Time History</span>
            </h3>
            <p className="text-xs text-slate-500">
              Only your private library study logs are displayed.
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg">
            {history.length} Total Sessions
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 uppercase text-[11px] tracking-wider">
              <tr>
                <th className="py-3.5 px-6">Date</th>
                <th className="py-3.5 px-6">Check In</th>
                <th className="py-3.5 px-6">Check Out</th>
                <th className="py-3.5 px-6">Library Time</th>
                <th className="py-3.5 px-6">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {history.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400">
                    No attendance sessions recorded yet. Click START MY SESSION to log your first study hour!
                  </td>
                </tr>
              ) : (
                history.map((session) => (
                  <tr key={session.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-4 px-6 font-semibold text-slate-900 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      <span>{session.date}</span>
                    </td>
                    <td className="py-4 px-6 font-mono text-slate-600">{session.check_in}</td>
                    <td className="py-4 px-6 font-mono text-slate-600">
                      {session.check_out || '—'}
                    </td>
                    <td className="py-4 px-6 font-bold text-slate-900">
                      {session.status === 'inside' ? (
                        <span className="text-emerald-600 animate-pulse font-mono">
                          {formatLiveDuration(liveSeconds)} (Inside)
                        </span>
                      ) : (
                        formatMins(session.total_minutes)
                      )}
                    </td>
                    <td className="py-4 px-6">
                      {session.status === 'inside' ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                          Inside
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                          Completed
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
