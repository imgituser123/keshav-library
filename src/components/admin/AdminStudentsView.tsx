import React, { useState } from 'react';
import { Users, Search, Plus, Armchair, CheckCircle2, AlertCircle, X, ShieldCheck, Sparkles, KeyRound } from 'lucide-react';
import { libraryStore } from '../../services/store';
import { StudentProfile } from '../../types';

export const AdminStudentsView: React.FC = () => {
  const students = libraryStore.getStudents();
  const seats = libraryStore.getSeats();
  const users = libraryStore.getState().users;

  const [searchTerm, setSearchTerm] = useState('');
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [seat, setSeat] = useState('Unassigned');
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Seat reassignment modal
  const [seatModalStudent, setSeatModalStudent] = useState<StudentProfile | null>(null);
  const [newSeatSelection, setNewSeatSelection] = useState('Unassigned');

  const filtered = students.filter(s => {
    const q = searchTerm.toLowerCase();
    return s.name.toLowerCase().includes(q) || s.phone.includes(q) || s.member_id.toLowerCase().includes(q) || s.assigned_seat.toLowerCase().includes(q);
  });

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !email.trim()) {
      setError('Please provide name, phone and email.');
      return;
    }

    // Section 1: Admin admits student WITHOUT password. Account created with password_set = false.
    const res = libraryStore.admitStudentByAdmin({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      seatNumber: seat === 'Unassigned' ? null : seat
    });

    if (!res.success) {
      setError(res.error || 'Failed to admit student.');
    } else {
      setNotice(`Student admitted successfully as ${res.student?.member_id}! Account created with no initial password. Student can set their password upon first login.`);
      setTimeout(() => setNotice(null), 5000);
      setAddModalOpen(false);
      setName('');
      setPhone('');
      setEmail('');
      setSeat('Unassigned');
      setError(null);
    }
  };

  const handleSaveSeat = () => {
    if (!seatModalStudent) return;
    libraryStore.updateStudentSeat(seatModalStudent.id, newSeatSelection);
    setNotice(`Updated desk for ${seatModalStudent.name} to ${newSeatSelection}`);
    setTimeout(() => setNotice(null), 3000);
    setSeatModalStudent(null);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-md">
              Directory
            </span>
            <h1 className="text-2xl font-bold text-slate-900 mt-2">Manage Students</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              View registered students, assigned study desks (1 to 100), and first-time password setup status
            </p>
          </div>

          <button
            onClick={() => setAddModalOpen(true)}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Admit New Student</span>
          </button>
        </div>

        {notice && (
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-xs font-bold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{notice}</span>
          </div>
        )}

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search student by name, phone, member ID, desk..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:outline-none"
          />
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-2xl border border-slate-200">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 uppercase text-[11px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Member ID</th>
                <th className="py-3 px-4">Student Name</th>
                <th className="py-3 px-4">Mobile</th>
                <th className="py-3 px-4">Assigned Desk</th>
                <th className="py-3 px-4">Password Status</th>
                <th className="py-3 px-4">Membership</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No students found. Admit a student to get started.
                  </td>
                </tr>
              ) : (
                filtered.map(student => {
                  const user = users.find(u => u.id === student.user_id || u.email.toLowerCase() === student.email.toLowerCase());
                  const isPasswordSet = user?.password_set === true;

                  return (
                    <tr key={student.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                        {student.member_id}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900">{student.name}</div>
                        <div className="text-[11px] text-slate-400">{student.email}</div>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-600">{student.phone}</td>
                      <td className="py-3.5 px-4">
                        <button
                          onClick={() => {
                            setSeatModalStudent(student);
                            setNewSeatSelection(student.assigned_seat);
                          }}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold cursor-pointer border border-slate-200"
                          title="Click to reassign desk"
                        >
                          <Armchair className="w-3.5 h-3.5 text-indigo-600" />
                          <span>{student.assigned_seat}</span>
                        </button>
                      </td>
                      <td className="py-3.5 px-4">
                        {isPasswordSet ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            Password Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                            <Sparkles className="w-3 h-3 text-amber-600" />
                            First-Time Setup Pending
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase ${
                          student.membership_status === 'active'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : 'bg-rose-100 text-rose-800 border border-rose-200'
                        }`}>
                          {student.membership_status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => {
                            libraryStore.toggleStudentStatus(student.id);
                            setNotice(`Toggled status for ${student.name}`);
                            setTimeout(() => setNotice(null), 3000);
                          }}
                          className="text-xs px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg cursor-pointer"
                        >
                          {student.membership_status === 'active' ? 'Deactivate' : 'Activate'}
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Enroll / Admit Student Modal */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-slate-900 px-6 py-4 text-white flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base">Admit New Student</h3>
                <p className="text-[11px] text-slate-400">Keshav Library Physical Study Space</p>
              </div>
              <button onClick={() => setAddModalOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddStudent} className="p-6 space-y-4">
              {error && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{error}</span>
                </div>
              )}

              {/* Password info callout */}
              <div className="p-3 bg-indigo-50/80 border border-indigo-100 rounded-xl text-xs text-indigo-900 space-y-1">
                <div className="font-bold flex items-center gap-1.5 text-indigo-950">
                  <ShieldCheck className="w-4 h-4 text-indigo-600" />
                  <span>Secure Student Admission</span>
                </div>
                <p className="text-[11px] text-indigo-700 leading-relaxed">
                  Admins do not create or handle student passwords. An admitted account is created without a usable password. The student will configure their password upon their first login using this email.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Anjali Gupta"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Mobile Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 83402 35780"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Study Desk (1-100)</label>
                  <select
                    value={seat}
                    onChange={(e) => setSeat(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:outline-none"
                  >
                    <option value="Unassigned">Unassigned</option>
                    {seats.filter(s => s.status === 'available').map(s => (
                      <option key={s.id} value={`Seat ${s.seat_number}`}>
                        Seat {s.seat_number}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="student@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:outline-none"
                />
              </div>

              <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-600 space-y-1 border border-slate-100">
                <div>Monthly Membership: <strong>₹600 / month</strong></div>
                <div className="text-[11px] text-slate-500">
                  Initial fee record created with status: DUE. Confirm payment once received offline.
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setAddModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer"
                >
                  Admit Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Desk Reassignment Modal */}
      {seatModalStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-slate-900 px-6 py-4 text-white flex items-center justify-between">
              <h3 className="font-bold text-sm">Assign Study Desk</h3>
              <button onClick={() => setSeatModalStudent(null)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="text-xs text-slate-600">
                Assigning desk for: <strong className="text-slate-900">{seatModalStudent.name}</strong> ({seatModalStudent.member_id})
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Select Study Desk (1 to 100)</label>
                <select
                  value={newSeatSelection}
                  onChange={(e) => setNewSeatSelection(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:outline-none"
                >
                  <option value="Unassigned">Unassigned (No Desk)</option>
                  {seats.map(s => (
                    <option key={s.id} value={`Seat ${s.seat_number}`}>
                      Seat {s.seat_number} — {s.status === 'assigned' ? (s.assigned_student_id === seatModalStudent.id ? 'Current Desk' : `Occupied by ${s.assigned_student_name}`) : 'Available'}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSeatModalStudent(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveSeat}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer"
                >
                  Save Desk
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
