import React, { useState } from 'react';
import { User, Mail, Phone, Armchair, Calendar, ShieldCheck, CheckCircle2, Save } from 'lucide-react';
import { libraryStore } from '../../services/store';
import { StudentProfile } from '../../types';
import { LIBRARY_CONFIG } from '../../config/libraryInfo';

interface StudentProfileViewProps {
  student: StudentProfile;
}

export const StudentProfileView: React.FC<StudentProfileViewProps> = ({ student }) => {
  const [name, setName] = useState(student.name);
  const [phone, setPhone] = useState(student.phone);
  const [email, setEmail] = useState(student.email);
  const [savedNotice, setSavedNotice] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    libraryStore.updateStudentProfile(student.id, { name, phone, email });
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md">
              Student Profile
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-2">
              {student.name}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Member ID: <strong className="font-mono text-slate-800">{student.member_id}</strong>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-xl font-bold text-xs">
              Status: {student.membership_status.toUpperCase()}
            </span>
          </div>
        </div>

        {savedNotice && (
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Profile details updated successfully!</span>
          </div>
        )}

        {/* Read-Only Official Details */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
            <span className="text-xs text-slate-500 font-semibold block">Assigned Study Desk</span>
            <div className="text-xl font-black text-slate-900 mt-1 flex items-center gap-1.5">
              <Armchair className="w-4 h-4 text-emerald-600" />
              <span>{student.assigned_seat}</span>
            </div>
            <span className="text-[11px] text-slate-400 mt-1 block">Assigned by management</span>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
            <span className="text-xs text-slate-500 font-semibold block">Enrolment Date</span>
            <div className="text-xl font-black text-slate-900 mt-1 flex items-center gap-1.5 font-mono">
              <Calendar className="w-4 h-4 text-emerald-600" />
              <span>{student.join_date}</span>
            </div>
            <span className="text-[11px] text-slate-400 mt-1 block">Active member</span>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
            <span className="text-xs text-slate-500 font-semibold block">Monthly Plan</span>
            <div className="text-xl font-black text-slate-900 mt-1">
              ₹{LIBRARY_CONFIG.monthlyFee} <span className="text-xs font-normal">/mo</span>
            </div>
            <span className="text-[11px] text-slate-400 mt-1 block">Paid offline in person</span>
          </div>
        </div>

        {/* Editable Contact Information */}
        <form onSubmit={handleSave} className="space-y-4 pt-4 border-t border-slate-100">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Contact Information
          </h3>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Mobile Number</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="py-2.5 px-5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Save className="w-4 h-4 text-emerald-400" />
              <span>Update Profile</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
