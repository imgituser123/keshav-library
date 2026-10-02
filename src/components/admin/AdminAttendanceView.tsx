import React, { useState } from 'react';
import { History, Calendar, Clock, Square, CheckCircle2 } from 'lucide-react';
import { libraryStore } from '../../services/store';

export const AdminAttendanceView: React.FC = () => {
  const attendance = libraryStore.getState().attendance;
  const todayStr = new Date().toISOString().split('T')[0];
  const [filterTodayOnly, setFilterTodayOnly] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const displayedSessions = filterTodayOnly
    ? attendance.filter(a => a.date === todayStr)
    : attendance;

  const handleManualCheckout = (sessionId: string, studentName: string) => {
    const res = libraryStore.endSession(sessionId);
    if (res.success) {
      setNotice(`Ended active session for ${studentName}. Total library time recorded.`);
      setTimeout(() => setNotice(null), 3000);
    }
  };

  const formatMins = (totalMins: number) => {
    const hours = Math.floor(totalMins / 60);
    const mins = totalMins % 60;
    return `${hours}h ${mins.toString().padStart(2, '0')}m`;
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-md">
              Attendance Records
            </span>
            <h1 className="text-2xl font-bold text-slate-900 mt-2">Library Time & Attendance</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Live desk check-ins and cumulative daily study durations for all students
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilterTodayOnly(!filterTodayOnly)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                filterTodayOnly
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {filterTodayOnly ? 'Showing Today Only' : 'Show All Dates'}
            </button>
          </div>
        </div>

        {notice && (
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{notice}</span>
          </div>
        )}

        <div className="overflow-x-auto rounded-2xl border border-slate-200">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 uppercase text-[11px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Check In</th>
                <th className="py-3 px-4">Check Out</th>
                <th className="py-3 px-4">Total Library Time</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {displayedSessions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No attendance sessions recorded yet.
                  </td>
                </tr>
              ) : (
                displayedSessions.map(sess => (
                  <tr key={sess.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900">{sess.student_name}</td>
                    <td className="py-3.5 px-4 font-mono text-xs">{sess.date}</td>
                    <td className="py-3.5 px-4 font-mono text-slate-600">{sess.check_in}</td>
                    <td className="py-3.5 px-4 font-mono text-slate-600">{sess.check_out || '—'}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {sess.status === 'inside' ? (
                        <span className="text-emerald-600 font-mono">Inside (Ticking)</span>
                      ) : (
                        formatMins(sess.total_minutes)
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      {sess.status === 'inside' ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                          Inside
                        </span>
                      ) : (
                        <span className="text-xs px-2.5 py-0.5 rounded-full font-medium bg-slate-100 text-slate-700">
                          Completed
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {sess.status === 'inside' ? (
                        <button
                          onClick={() => handleManualCheckout(sess.id, sess.student_name)}
                          className="text-xs px-2.5 py-1 bg-rose-50 text-rose-700 hover:bg-rose-100 font-bold rounded-lg border border-rose-200 cursor-pointer"
                        >
                          End Session
                        </button>
                      ) : (
                        <span className="text-xs text-slate-400 font-mono">Completed</span>
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
