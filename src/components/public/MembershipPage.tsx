import React from 'react';
import { CheckCircle2, Clock, ShieldCheck, Zap, Wifi, ArrowRight, FileText, AlertCircle } from 'lucide-react';
import { LIBRARY_CONFIG } from '../../config/libraryInfo';

interface MembershipPageProps {
  onOpenEnquiry: () => void;
  onNavigateLogin: (role?: 'student' | 'admin') => void;
}

export const MembershipPage: React.FC<MembershipPageProps> = ({ onOpenEnquiry, onNavigateLogin }) => {
  return (
    <div className="min-h-screen bg-slate-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Transparent Pricing
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Keshav Library Membership
          </h1>
          <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto">
            A single, flat monthly plan with zero hidden fees. Open 24 hours in Shakurabad, Jehanabad, Bihar.
          </p>
        </div>

        {/* The Exact Single Plan (Section 9) */}
        <div className="max-w-xl mx-auto bg-white rounded-3xl border-2 border-emerald-500 shadow-2xl overflow-hidden relative">
          <div className="bg-emerald-500 px-6 py-2.5 text-center text-slate-950 font-black text-xs uppercase tracking-widest">
            ★ Keshav Library Monthly Membership ★
          </div>

          <div className="p-8 sm:p-10 space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-slate-900">Monthly Study Space Membership</h2>
              <div className="flex items-baseline justify-center gap-2">
                <span className="text-5xl font-black text-slate-900">₹{LIBRARY_CONFIG.monthlyFee}</span>
                <span className="text-slate-500 font-semibold text-lg">/ month</span>
              </div>
              <div className="inline-flex items-center gap-1.5 text-xs text-emerald-700 font-bold bg-emerald-50 px-3 py-1 rounded-full">
                <Clock className="w-3.5 h-3.5" />
                <span>{LIBRARY_CONFIG.hours} Access</span>
              </div>
            </div>

            {/* Inclusions (Section 9) */}
            <div className="border-t border-b border-slate-100 py-6 space-y-3.5">
              <div className="flex items-center gap-3 text-sm text-slate-700 font-medium">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>Dedicated, comfortable study space desk</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-700 font-medium">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span><strong>24-hour uninterrupted access</strong> (Open 24 Hours)</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-700 font-medium">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>High-speed commercial dual-band Wi-Fi</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-700 font-medium">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>Dedicated charging facilities on every desk</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-700 font-medium">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>Access to Silent, General, Digital, & Discussion zones</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-700 font-medium">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>Digital library-time tracking & session records</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-700 font-medium">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>Personal student portal & attendance history</span>
              </div>
            </div>

            {/* Offline Rule Banner */}
            <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 space-y-1.5">
              <div className="font-bold flex items-center gap-1.5 text-amber-950">
                <AlertCircle className="w-4 h-4 text-amber-700" />
                <span>No Online Payment Gateway</span>
              </div>
              <p className="text-amber-900 leading-relaxed">
                Keshav Library operates purely offline payments. Enquire online to book your seat. Visit our physical space in Shakurabad to verify your desk and pay in person.
              </p>
            </div>

            <button
              onClick={onOpenEnquiry}
              className="w-full py-4 px-6 bg-slate-900 hover:bg-slate-800 text-white font-bold text-base rounded-xl transition-all shadow-xl hover:shadow-slate-900/20 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Enquire / Purchase Membership</span>
              <ArrowRight className="w-4 h-4 text-emerald-400" />
            </button>
          </div>
        </div>

        {/* Already a member */}
        <div className="text-center text-xs text-slate-500">
          Already registered?{' '}
          <button
            onClick={() => onNavigateLogin('student')}
            className="text-emerald-700 font-bold underline hover:text-emerald-800 cursor-pointer"
          >
            Sign in to Student Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};
