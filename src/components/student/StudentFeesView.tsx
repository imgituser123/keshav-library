import React from 'react';
import { IndianRupee, AlertCircle, CheckCircle2, Info, Calendar } from 'lucide-react';
import { StudentProfile } from '../../types';
import { libraryStore } from '../../services/store';
import { LIBRARY_CONFIG } from '../../config/libraryInfo';

interface StudentFeesViewProps {
  student: StudentProfile;
}

export const StudentFeesView: React.FC<StudentFeesViewProps> = ({ student }) => {
  const fees = libraryStore.getStudentFees(student.id);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md">
            Fee Accounting
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-2">
            My Monthly Fee Status
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Flat ₹{LIBRARY_CONFIG.monthlyFee}/month • Confirmed offline in person
          </p>
        </div>

        {/* Notice Banner */}
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-700 space-y-1.5">
          <div className="font-bold flex items-center gap-1.5 text-slate-900">
            <Info className="w-4 h-4 text-emerald-600" />
            <span>Important Offline Payment Rule</span>
          </div>
          <p className="leading-relaxed">
            There is <strong>no online payment gateway</strong> on this website. Monthly fee of <strong>₹600</strong> is paid directly to the Keshav Library front desk in Shakurabad. Once paid, the manager marks your account as <strong>PAID</strong>.
          </p>
        </div>

        {/* Fees Table */}
        <div className="overflow-x-auto rounded-2xl border border-slate-200">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 uppercase text-[11px] tracking-wider">
              <tr>
                <th className="py-3 px-5">Month / Year</th>
                <th className="py-3 px-5">Monthly Amount</th>
                <th className="py-3 px-5">Fee Status</th>
                <th className="py-3 px-5">Payment / Confirmation Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {fees.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-slate-400">
                    No fee records generated yet.
                  </td>
                </tr>
              ) : (
                fees.map(fee => {
                  const isDue = fee.status === 'due';
                  return (
                    <tr key={fee.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 px-5 font-bold text-slate-900 flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        <span>{fee.month} {fee.year}</span>
                      </td>
                      <td className="py-3.5 px-5 font-bold text-slate-900">₹{fee.amount}</td>
                      <td className="py-3.5 px-5">
                        {isDue ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-100 text-amber-900 border border-amber-300 rounded-lg text-xs font-black">
                            <AlertCircle className="w-3.5 h-3.5 text-amber-700" />
                            <span>PAYMENT DUE</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-100 text-emerald-900 border border-emerald-300 rounded-lg text-xs font-black">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                            <span>PAID</span>
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-5 text-xs text-slate-500 font-mono">
                        {fee.paid_at ? `Paid on ${fee.paid_at}` : 'Awaiting offline confirmation'}
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
