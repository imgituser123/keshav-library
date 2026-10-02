import React, { useState } from 'react';
import { MessageSquare, Phone, Mail, Calendar, Check, X, Filter, CheckCircle2, UserCheck, MessageCircle } from 'lucide-react';
import { libraryStore } from '../../services/store';
import { Enquiry } from '../../types';

export const AdminEnquiriesView: React.FC = () => {
  const enquiries = libraryStore.getEnquiries();
  const seats = libraryStore.getSeats();
  const [filter, setFilter] = useState<'all' | 'new' | 'contacted' | 'converted' | 'closed'>('all');
  const [convertModalEnquiry, setConvertModalEnquiry] = useState<Enquiry | null>(null);
  const [selectedSeat, setSelectedSeat] = useState('A01');
  const [notice, setNotice] = useState<string | null>(null);

  const filtered = enquiries.filter(e => {
    if (filter === 'all') return true;
    return e.status === filter;
  });

  const handleConvert = () => {
    if (!convertModalEnquiry) return;
    const res = libraryStore.convertEnquiryToMember(convertModalEnquiry.id, selectedSeat);
    if (res.success) {
      setNotice(`Enrolled ${convertModalEnquiry.name} as member ${res.student?.member_id}! Assigned desk: ${selectedSeat}`);
      setTimeout(() => setNotice(null), 4000);
      setConvertModalEnquiry(null);
    }
  };

  const handleMarkContacted = (id: string, name: string) => {
    libraryStore.updateEnquiryStatus(id, 'contacted');
    setNotice(`Marked ${name} as contacted.`);
    setTimeout(() => setNotice(null), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-md">
              Lead Management
            </span>
            <h1 className="text-2xl font-bold text-slate-900 mt-2">Membership Enquiries</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Review and convert prospective student requests from the website into enrolled members
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="text-xs border border-slate-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-indigo-600 focus:outline-none"
            >
              <option value="all">All Enquiries ({enquiries.length})</option>
              <option value="new">New ({enquiries.filter(e => e.status === 'new').length})</option>
              <option value="contacted">Contacted ({enquiries.filter(e => e.status === 'contacted').length})</option>
              <option value="converted">Converted ({enquiries.filter(e => e.status === 'converted').length})</option>
              <option value="closed">Closed ({enquiries.filter(e => e.status === 'closed').length})</option>
            </select>
          </div>
        </div>

        {notice && (
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{notice}</span>
          </div>
        )}

        {/* Table */}
        <div className="overflow-x-auto rounded-2xl border border-slate-200">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 uppercase text-[11px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Phone / Contact</th>
                <th className="py-3 px-4">Preferred Start</th>
                <th className="py-3 px-4">Message / Target Exam</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    No enquiries found under this filter.
                  </td>
                </tr>
              ) : (
                filtered.map(enq => (
                  <tr key={enq.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900">{enq.name}</td>
                    <td className="py-3.5 px-4">
                      <div className="font-mono text-slate-800">{enq.phone}</div>
                      <div className="text-[11px] text-slate-400">{enq.email || 'No email provided'}</div>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-xs">{enq.preferred_start_date}</td>
                    <td className="py-3.5 px-4 max-w-xs truncate text-xs text-slate-600" title={enq.message}>
                      {enq.message}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase ${
                        enq.status === 'new' ? 'bg-amber-100 text-amber-800' :
                        enq.status === 'contacted' ? 'bg-sky-100 text-sky-800' :
                        enq.status === 'converted' ? 'bg-emerald-100 text-emerald-800' :
                        'bg-slate-100 text-slate-600'
                      }`}>
                        {enq.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-1.5">
                      <a
                        href={`https://wa.me/${enq.phone.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs px-2.5 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg font-bold inline-flex items-center gap-1 border border-emerald-200"
                        title="Chat on WhatsApp"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>Chat</span>
                      </a>

                      {enq.status === 'new' && (
                        <button
                          onClick={() => handleMarkContacted(enq.id, enq.name)}
                          className="text-xs px-2.5 py-1.5 bg-sky-50 text-sky-700 hover:bg-sky-100 rounded-lg font-semibold border border-sky-200 cursor-pointer"
                        >
                          Mark Contacted
                        </button>
                      )}

                      {enq.status !== 'converted' ? (
                        <button
                          onClick={() => setConvertModalEnquiry(enq)}
                          className="text-xs px-2.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-bold shadow-xs cursor-pointer inline-flex items-center gap-1"
                        >
                          <UserCheck className="w-3.5 h-3.5" />
                          <span>Convert to Member</span>
                        </button>
                      ) : (
                        <span className="text-xs text-emerald-600 font-bold inline-flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" /> Enrolled
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

      {/* Convert Modal */}
      {convertModalEnquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-slate-900 px-6 py-4 text-white flex items-center justify-between">
              <h3 className="font-bold text-sm">Convert Enquiry to Student</h3>
              <button onClick={() => setConvertModalEnquiry(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="text-xs text-slate-600 space-y-1">
                <div>Candidate: <strong className="text-slate-900">{convertModalEnquiry.name}</strong></div>
                <div>Mobile: <strong className="font-mono text-slate-900">{convertModalEnquiry.phone}</strong></div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Assign Initial Study Desk
                </label>
                <select
                  value={selectedSeat}
                  onChange={(e) => setSelectedSeat(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:outline-none"
                >
                  <option value="Unassigned">Unassigned (Assign Later)</option>
                  {seats.filter(s => s.status === 'available').map(s => (
                    <option key={s.id} value={s.seat_number}>
                      Seat {s.seat_number} (Available)
                    </option>
                  ))}
                </select>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600">
                Converting creates the student account with Member ID. The monthly fee (₹600) is marked <strong>DUE</strong> until payment is confirmed in person.
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setConvertModalEnquiry(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConvert}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer"
                >
                  Confirm Enrollment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
