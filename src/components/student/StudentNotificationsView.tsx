import React, { useState, useEffect } from 'react';
import { Bell, CheckCircle2 } from 'lucide-react';
import { StudentProfile, AppNotification } from '../../types';
import { libraryStore } from '../../services/store';

interface StudentNotificationsViewProps {
  student: StudentProfile;
}

export const StudentNotificationsView: React.FC<StudentNotificationsViewProps> = ({ student }) => {
  const [notifs, setNotifs] = useState<AppNotification[]>([]);

  const refreshData = () => {
    // Only student's notifications
    setNotifs(libraryStore.getNotifications('student', student.id));
  };

  useEffect(() => {
    refreshData();
    const unsub = libraryStore.subscribe(refreshData);
    return () => unsub();
  }, [student.id]);

  const handleMarkRead = (id: string) => {
    libraryStore.markNotificationAsRead(id);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md">
              Alerts & Updates
            </span>
            <h1 className="text-2xl font-bold text-slate-900 mt-2">
              My Notifications
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Personal membership updates and fee confirmations
            </p>
          </div>

          <button
            onClick={() => libraryStore.markAllNotificationsAsRead('student')}
            className="text-xs px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition-colors cursor-pointer"
          >
            Mark All Read
          </button>
        </div>

        <div className="divide-y divide-slate-100">
          {notifs.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              No notifications yet. You're all caught up!
            </div>
          ) : (
            notifs.map(n => (
              <div key={n.id} className="py-4 flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                    <Bell className="w-4 h-4" />
                  </div>
                  <div className="space-y-0.5">
                    <div className="text-sm font-bold text-slate-900">{n.title}</div>
                    <p className="text-xs text-slate-600">{n.message}</p>
                    <span className="text-[10px] text-slate-400 font-mono block pt-1">{n.created_at}</span>
                  </div>
                </div>

                {!n.is_read && (
                  <button
                    onClick={() => handleMarkRead(n.id)}
                    className="text-xs text-emerald-700 font-semibold hover:underline shrink-0"
                  >
                    Mark read
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
