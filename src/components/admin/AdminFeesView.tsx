import React, { useState } from 'react';
import { IndianRupee, Send, CheckCircle2, AlertCircle, Check, X, Copy, ExternalLink, Filter } from 'lucide-react';
import { libraryStore } from '../../services/store';
import { MonthlyFee } from '../../types';
import { formatWhatsAppMessage, generateWhatsAppDirectLink } from '../../services/whatsapp';
import { LIBRARY_CONFIG } from '../../config/libraryInfo';

export const AdminFeesView: React.FC = () => {
  const allFees = libraryStore.getState().fees;
  const currentMonth = new Date().toLocaleString('default', { month: 'long' });
  const currentYear = new Date().getFullYear();

  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [statusFilter, setStatusFilter] = useState<'all' | 'due' | 'paid'>('all');
  const [whatsAppFee, setWhatsAppFee] = useState<MonthlyFee | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const monthFees = allFees.filter(f => f.month.toLowerCase() === selectedMonth.toLowerCase() && f.year === currentYear);

  const filteredFees = monthFees.filter(f => {
    if (statusFilter === 'all') return true;
    return f.status === statusFilter;
  });

  // Calculate real totals (Strictly from real database records - Section 22 & 27)
  const totalCount = monthFees.length;
  const paidCount = monthFees.filter(f => f.status === 'paid').length;
  const dueCount = monthFees.filter(f => f.status === 'due').length;

  const expectedAmount = totalCount * LIBRARY_CONFIG.monthlyFee;
  const paidAmount = paidCount * LIBRARY_CONFIG.monthlyFee;
  const outstandingAmount = dueCount * LIBRARY_CONFIG.monthlyFee;

  const handleMarkPaid = (feeId: string, name: string) => {
    libraryStore.markFeePaid(feeId);
    setNotice(`Confirmed payment of ₹600 for ${name}.`);
    setTimeout(() => setNotice(null), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-md">
              Accounting & Dues
            </span>
            <h1 className="text-2xl font-bold text-slate-900 mt-2">Monthly Fee Management</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Confirm offline cash/UPI payments in person and dispatch WhatsApp reminders for due fees
            </p>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="text-xs border border-slate-300 rounded-xl px-3 py-2 font-bold focus:ring-2 focus:ring-indigo-600 focus:outline-none"
            >
              {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map(m => (
                <option key={m} value={m}>{m} {currentYear}</option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="text-xs border border-slate-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-indigo-600 focus:outline-none"
            >
              <option value="all">All ({monthFees.length})</option>
              <option value="due">Due ({dueCount})</option>
              <option value="paid">Paid ({paidCount})</option>
            </select>
          </div>
        </div>

        {notice && (
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{notice}</span>
          </div>
        )}

        {/* Real Dynamic Summary Cards (Section 27: Informational Only, Calculated from real DB) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
            <span className="text-xs text-slate-500 font-semibold block">Total Members</span>
            <div className="text-2xl font-black text-slate-900 mt-1 font-mono">{totalCount}</div>
            <span className="text-[10px] text-slate-400 mt-0.5 block">{selectedMonth} {currentYear}</span>
          </div>

          <div className="p-4 bg-emerald-50/70 rounded-2xl border border-emerald-200">
            <span className="text-xs text-emerald-800 font-semibold block">Paid Members</span>
            <div className="text-2xl font-black text-emerald-700 mt-1 font-mono">{paidCount}</div>
            <span className="text-[10px] text-emerald-600 mt-0.5 block">Confirmed offline</span>
          </div>

          <div className="p-4 bg-rose-50/70 rounded-2xl border border-rose-200">
            <span className="text-xs text-rose-800 font-semibold block">Due Members</span>
            <div className="text-2xl font-black text-rose-700 mt-1 font-mono">{dueCount}</div>
            <span className="text-[10px] text-rose-600 mt-0.5 block">Payment pending</span>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
            <span className="text-xs text-slate-500 font-semibold block">Expected Total</span>
            <div className="text-2xl font-black text-slate-900 mt-1 font-mono">₹{expectedAmount.toLocaleString()}</div>
            <span className="text-[10px] text-slate-400 mt-0.5 block">@ ₹600/student</span>
          </div>

          <div className="p-4 bg-emerald-50/70 rounded-2xl border border-emerald-200">
            <span className="text-xs text-emerald-800 font-semibold block">Paid Collected</span>
            <div className="text-2xl font-black text-emerald-700 mt-1 font-mono">₹{paidAmount.toLocaleString()}</div>
            <span className="text-[10px] text-emerald-600 mt-0.5 block">Received offline</span>
          </div>

          <div className="p-4 bg-rose-50/70 rounded-2xl border border-rose-200">
            <span className="text-xs text-rose-800 font-semibold block">Outstanding Due</span>
            <div className="text-2xl font-black text-rose-700 mt-1 font-mono">₹{outstandingAmount.toLocaleString()}</div>
            <span className="text-[10px] text-rose-600 mt-0.5 block">Pending receipt</span>
          </div>
        </div>

        {/* Fees Table */}
        <div className="overflow-x-auto rounded-2xl border border-slate-200">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 uppercase text-[11px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Student Name</th>
                <th className="py-3 px-4">Mobile</th>
                <th className="py-3 px-4">Month / Year</th>
                <th className="py-3 px-4">Monthly Fee</th>
                <th className="py-3 px-4">Fee Status</th>
                <th className="py-3 px-4">Reminder Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredFees.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No fee records found for {selectedMonth} {currentYear}.
                  </td>
                </tr>
              ) : (
                filteredFees.map(fee => {
                  const isDue = fee.status === 'due';
                  return (
                    <tr key={fee.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-slate-900">{fee.student_name}</td>
                      <td className="py-3.5 px-4 font-mono text-slate-600">{fee.student_phone}</td>
                      <td className="py-3.5 px-4">{fee.month} {fee.year}</td>
                      <td className="py-3.5 px-4 font-bold text-slate-900">₹{fee.amount}</td>
                      <td className="py-3.5 px-4">
                        {isDue ? (
                          <span className="text-[10px] px-2.5 py-0.5 bg-rose-100 text-rose-800 rounded-md font-black">
                            DUE
                          </span>
                        ) : (
                          <span className="text-[10px] px-2.5 py-0.5 bg-emerald-100 text-emerald-800 rounded-md font-black">
                            PAID
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-xs text-slate-500 font-mono">
                        {fee.reminder_sent_at || (fee.paid_at ? `Paid on ${fee.paid_at}` : 'None sent yet')}
                      </td>
                      <td className="py-3.5 px-4 text-right space-x-2">
                        {isDue ? (
                          <>
                            <button
                              onClick={() => setWhatsAppFee(fee)}
                              className="text-xs px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold shadow-xs inline-flex items-center gap-1 cursor-pointer"
                            >
                              <Send className="w-3.5 h-3.5" />
                              <span>Send WhatsApp Reminder</span>
                            </button>
                            <button
                              onClick={() => handleMarkPaid(fee.id, fee.student_name)}
                              className="text-xs px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-bold shadow-xs cursor-pointer"
                            >
                              Mark Paid
                            </button>
                          </>
                        ) : (
                          <span className="text-xs text-emerald-600 font-bold inline-flex items-center gap-1">
                            <Check className="w-3.5 h-3.5" /> Paid Offline
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* WhatsApp Reminder Modal (Section 12 & 22) */}
      {whatsAppFee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-emerald-700 px-6 py-4 text-white flex items-center justify-between">
              <h3 className="font-bold text-base flex items-center gap-2">
                <Send className="w-4 h-4" />
                <span>WhatsApp Fee Reminder Dispatch</span>
              </h3>
              <button onClick={() => setWhatsAppFee(null)} className="text-emerald-200 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="text-xs text-slate-600 space-y-1">
                <div>Student: <strong className="text-slate-900">{whatsAppFee.student_name}</strong></div>
                <div>Mobile: <strong className="font-mono text-slate-900">{whatsAppFee.student_phone}</strong></div>
                <div>Amount: <strong className="text-rose-600 font-bold">₹{whatsAppFee.amount} ({whatsAppFee.month} {whatsAppFee.year})</strong></div>
              </div>

              {/* Exact Section 22 Message Format */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Official WhatsApp Template:
                </span>
                <p className="text-xs text-slate-800 font-sans italic bg-white p-3 rounded-xl border border-slate-200 leading-relaxed">
                  "{formatWhatsAppMessage({
                    studentName: whatsAppFee.student_name,
                    studentPhone: whatsAppFee.student_phone,
                    month: whatsAppFee.month,
                    amount: whatsAppFee.amount
                  })}"
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() => {
                    const msg = formatWhatsAppMessage({
                      studentName: whatsAppFee.student_name,
                      studentPhone: whatsAppFee.student_phone,
                      month: whatsAppFee.month,
                      amount: whatsAppFee.amount
                    });
                    navigator.clipboard.writeText(msg);
                    libraryStore.markFeeReminderSent(whatsAppFee.id);
                    setNotice('Reminder message copied to clipboard!');
                    setTimeout(() => setNotice(null), 3000);
                    setWhatsAppFee(null);
                  }}
                  className="py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Copy className="w-4 h-4" />
                  <span>Copy Text</span>
                </button>

                <a
                  href={generateWhatsAppDirectLink(
                    whatsAppFee.student_phone,
                    formatWhatsAppMessage({
                      studentName: whatsAppFee.student_name,
                      studentPhone: whatsAppFee.student_phone,
                      month: whatsAppFee.month,
                      amount: whatsAppFee.amount
                    })
                  )}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => {
                    libraryStore.markFeeReminderSent(whatsAppFee.id);
                    setNotice(`Dispatched reminder for ${whatsAppFee.student_name}!`);
                    setTimeout(() => setNotice(null), 3000);
                    setWhatsAppFee(null);
                  }}
                  className="py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-md text-center"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Open WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
