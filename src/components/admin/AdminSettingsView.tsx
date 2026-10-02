import React, { useState } from 'react';
import { Settings, MapPin, Phone, Mail, Clock, ExternalLink, RefreshCw, CheckCircle2, AlertTriangle } from 'lucide-react';
import { libraryStore } from '../../services/store';
import { LIBRARY_CONFIG } from '../../config/libraryInfo';

interface AdminSettingsViewProps {
  onNavigate: (path: string) => void;
}

export const AdminSettingsView: React.FC<AdminSettingsViewProps> = ({ onNavigate }) => {
  const [resetConfirm, setResetConfirm] = useState(false);
  const [resetDone, setResetDone] = useState(false);

  const handleResetToClean = () => {
    libraryStore.resetDatabaseToClean();
    setResetDone(true);
    setResetConfirm(false);
    setTimeout(() => setResetDone(false), 4000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-md">
            System & Facility
          </span>
          <h1 className="text-2xl font-bold text-slate-900 mt-2">Library Settings & Configuration</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Operational details and production database controls
          </p>
        </div>

        {resetDone && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>Database has been successfully cleared to a clean state with 0 records!</span>
          </div>
        )}

        {/* Library Info Verification (Section 15 & 16) */}
        <div className="space-y-4 pt-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Official Library Contact Configuration
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
              <span className="text-[11px] font-bold text-slate-500 uppercase">Physical Address</span>
              <div className="text-xs font-bold text-slate-900 flex items-start gap-1.5">
                <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{LIBRARY_CONFIG.address}</span>
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
              <span className="text-[11px] font-bold text-slate-500 uppercase">Operating Hours</span>
              <div className="text-xs font-black text-emerald-700 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{LIBRARY_CONFIG.hours}</span>
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
              <span className="text-[11px] font-bold text-slate-500 uppercase">Direct Phone / WhatsApp</span>
              <div className="text-xs font-mono font-bold text-slate-900 flex items-center gap-1.5">
                <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{LIBRARY_CONFIG.phone}</span>
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
              <span className="text-[11px] font-bold text-slate-500 uppercase">Official Email</span>
              <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Mail className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{LIBRARY_CONFIG.email}</span>
              </div>
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[11px] font-bold text-slate-500 uppercase block">Verified Google Maps Link</span>
              <div className="text-xs text-slate-700 truncate max-w-lg font-mono mt-0.5">
                {LIBRARY_CONFIG.googleMapsUrl}
              </div>
            </div>
            <a
              href={LIBRARY_CONFIG.googleMapsUrl}
              target="_blank"
              rel="noreferrer"
              className="px-3.5 py-2 bg-slate-900 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shrink-0"
            >
              <span>Verify Link</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Clean Database Control (Section 22) */}
        <div className="pt-6 border-t border-slate-100 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-rose-600 flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4" />
            <span>Database Hygiene & Reset Control</span>
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Per the project requirements, the system must operate on a clean database without any dummy/sample records. You can reset all local storage data at any time to guarantee 0 students, 0 enquiries, and 0 dummy attendance records.
          </p>

          {!resetConfirm ? (
            <button
              onClick={() => setResetConfirm(true)}
              className="px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl font-bold text-xs flex items-center gap-2 cursor-pointer transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Reset Database to Clean State</span>
            </button>
          ) : (
            <div className="p-4 bg-rose-50 border border-rose-300 rounded-2xl space-y-3">
              <p className="text-xs font-bold text-rose-900">
                Are you sure you want to clear all data and start with 0 students, 0 enquiries, and 0 fees?
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleResetToClean}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl cursor-pointer"
                >
                  Yes, Reset to Clean
                </button>
                <button
                  onClick={() => setResetConfirm(false)}
                  className="px-4 py-2 bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
