import React from 'react';
import { CheckCircle2, Clock, ShieldCheck, IndianRupee, AlertCircle, Info, Sparkles } from 'lucide-react';
import { StudentProfile } from '../../types';
import { libraryStore } from '../../services/store';
import { LIBRARY_CONFIG } from '../../config/libraryInfo';

interface StudentMembershipViewProps {
  student: StudentProfile;
}

export const StudentMembershipView: React.FC<StudentMembershipViewProps> = ({ student }) => {
  const fees = libraryStore.getStudentFees(student.id);
  const currentFee = fees[0];
  const isDue = currentFee ? currentFee.status === 'due' : false;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md">
            Membership Plan
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-2">
            Keshav Library Monthly Membership
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Single transparent study plan • Shakurabad, Jehanabad, Bihar 804425
          </p>
        </div>

        {/* Pricing & Status Banner */}
        <div className={`p-6 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
          isDue ? 'bg-amber-50/80 border-amber-200' : 'bg-emerald-50/60 border-emerald-200'
        }`}>
          <div>
            <div className="text-3xl font-black text-slate-900">
              ₹{LIBRARY_CONFIG.monthlyFee} <span className="text-sm font-normal text-slate-500">/ month</span>
            </div>
            <div className="text-xs font-semibold text-slate-600 mt-1">
              Billing Cycle: Monthly Renewal • In-Person Confirmation
            </div>
          </div>

          <div>
            {isDue ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-100 text-amber-900 border border-amber-300 rounded-xl text-xs font-black">
                <AlertCircle className="w-4 h-4 text-amber-700" />
                <span>PAYMENT DUE</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-100 text-emerald-900 border border-emerald-300 rounded-xl text-xs font-black">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                <span>MEMBERSHIP ACTIVE (PAID)</span>
              </span>
            )}
          </div>
        </div>

        {/* Inclusions (Section 9) */}
        <div className="space-y-3 pt-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Included Benefits & Facilities
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700">
            <div className="flex items-center gap-2.5 p-3 bg-slate-50 rounded-xl border border-slate-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Dedicated study desk & ergonomic chair</span>
            </div>
            <div className="flex items-center gap-2.5 p-3 bg-slate-50 rounded-xl border border-slate-200">
              <Clock className="w-4 h-4 text-emerald-600 shrink-0" />
              <span><strong>24-hour access</strong> ({LIBRARY_CONFIG.hours})</span>
            </div>
            <div className="flex items-center gap-2.5 p-3 bg-slate-50 rounded-xl border border-slate-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>High-speed commercial dual-band Wi-Fi</span>
            </div>
            <div className="flex items-center gap-2.5 p-3 bg-slate-50 rounded-xl border border-slate-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Personal charging points on every desk</span>
            </div>
            <div className="flex items-center gap-2.5 p-3 bg-slate-50 rounded-xl border border-slate-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Access to all 4 study zones</span>
            </div>
            <div className="flex items-center gap-2.5 p-3 bg-slate-50 rounded-xl border border-slate-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Library-time tracking & live timer</span>
            </div>
            <div className="flex items-center gap-2.5 p-3 bg-slate-50 rounded-xl border border-slate-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Student personal dashboard access</span>
            </div>
            <div className="flex items-center gap-2.5 p-3 bg-slate-50 rounded-xl border border-slate-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Purified drinking water & security</span>
            </div>
          </div>
        </div>

        {/* Offline Payment Notice */}
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-700 space-y-2">
          <div className="font-bold flex items-center gap-1.5 text-slate-900">
            <Info className="w-4 h-4 text-emerald-600" />
            <span>How to Pay Your Monthly Membership</span>
          </div>
          <p className="leading-relaxed">
            There is <strong>no online payment gateway</strong> on this website. Monthly fee (₹600) is paid directly in person at Keshav Library, Shakurabad. Once received, the library manager marks your account as <strong>PAID</strong>.
          </p>
        </div>
      </div>
    </div>
  );
};
