import React from 'react';
import { Sparkles, Calendar, CheckCircle2, AlertCircle } from 'lucide-react';
import { libraryStore } from '../../services/store';
import { LIBRARY_CONFIG } from '../../config/libraryInfo';

export const AdminMembershipsView: React.FC = () => {
  const students = libraryStore.getStudents();
  const memberships = libraryStore.getState().memberships;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-md">
              Plan Management
            </span>
            <h1 className="text-2xl font-bold text-slate-900 mt-2">Active Memberships</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Keshav Library operates on exactly one flat plan: ₹{LIBRARY_CONFIG.monthlyFee}/month with 24-hour access
            </p>
          </div>

          <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-900 font-semibold">
            Single Plan: <strong>₹600 / Month</strong> • Open 24 Hours
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-2xl border border-slate-200">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 uppercase text-[11px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Member ID</th>
                <th className="py-3 px-4">Student Name</th>
                <th className="py-3 px-4">Plan Name</th>
                <th className="py-3 px-4">Monthly Rate</th>
                <th className="py-3 px-4">Start Date</th>
                <th className="py-3 px-4">Membership Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {students.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    No active student memberships recorded yet.
                  </td>
                </tr>
              ) : (
                students.map(student => {
                  const mem = memberships.find(m => m.student_id === student.id);
                  return (
                    <tr key={student.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                        {student.member_id}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-900">{student.name}</td>
                      <td className="py-3.5 px-4">Keshav Library Monthly Pass</td>
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        ₹{mem?.monthly_fee || LIBRARY_CONFIG.monthlyFee}/mo
                      </td>
                      <td className="py-3.5 px-4 font-mono text-xs">{mem?.start_date || student.join_date}</td>
                      <td className="py-3.5 px-4">
                        <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase ${
                          student.membership_status === 'active'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : 'bg-rose-100 text-rose-800 border border-rose-200'
                        }`}>
                          {student.membership_status}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
