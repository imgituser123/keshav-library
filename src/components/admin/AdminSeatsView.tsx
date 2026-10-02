import React, { useState } from 'react';
import { Armchair, CheckCircle2, AlertCircle, X, User, Search, Filter } from 'lucide-react';
import { libraryStore } from '../../services/store';
import { SeatStatusDetail } from '../../types';

export const AdminSeatsView: React.FC = () => {
  const grid = libraryStore.getStudentStatusGrid();
  const students = libraryStore.getStudents();
  const [selectedSeat, setSelectedSeat] = useState<SeatStatusDetail | null>(null);
  const [assignStudentId, setAssignStudentId] = useState('');
  const [notice, setNotice] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'available' | 'assigned' | 'present' | 'absent'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const assignedCount = grid.filter(s => s.assigned).length;
  const availableCount = 100 - assignedCount;
  const presentCount = grid.filter(s => s.presence === 'present').length;
  const absentCount = assignedCount - presentCount;

  const filteredSeats = grid.filter(s => {
    if (filter === 'available' && s.assigned) return false;
    if (filter === 'assigned' && !s.assigned) return false;
    if (filter === 'present' && s.presence !== 'present') return false;
    if (filter === 'absent' && (s.presence !== 'absent' || !s.assigned)) return false;

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const numMatch = String(s.seat_number).includes(q);
      const studentMatch = s.student && (
        s.student.name.toLowerCase().includes(q) ||
        s.student.member_id.toLowerCase().includes(q) ||
        s.student.phone.includes(q)
      );
      return numMatch || studentMatch;
    }
    return true;
  });

  const handleAssignStudent = () => {
    if (!selectedSeat || !assignStudentId) return;

    if (assignStudentId === 'unassign') {
      if (selectedSeat.student) {
        libraryStore.updateStudentSeat(selectedSeat.student.id, 'Unassigned');
        setNotice(`Desk ${selectedSeat.seat_number} is now unassigned.`);
      }
    } else {
      const std = students.find(s => s.id === assignStudentId);
      if (std) {
        libraryStore.updateStudentSeat(std.id, selectedSeat.seat_number);
        setNotice(`Assigned Desk ${selectedSeat.seat_number} to ${std.name} (${std.member_id})!`);
      }
    }
    setTimeout(() => setNotice(null), 3000);
    setSelectedSeat(null);
    setAssignStudentId('');
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-md">
              Capacity & Allocation
            </span>
            <h1 className="text-2xl font-bold text-slate-900 mt-2">Study Desks Management (1 to 100)</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Physical study desks numbered 1 to 100 with real-time assignment and student presence tracking
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              {availableCount} Available
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
              {assignedCount} Assigned
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-800 text-xs font-bold flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse"></span>
              {presentCount} Present Inside
            </span>
          </div>
        </div>

        {notice && (
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-xs font-bold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{notice}</span>
          </div>
        )}

        {/* Filter and Search */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
            <input
              type="text"
              placeholder="Search by desk #, student name, ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold self-stretch sm:self-auto overflow-x-auto">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded-lg cursor-pointer transition-all ${filter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'}`}
            >
              All (100)
            </button>
            <button
              onClick={() => setFilter('available')}
              className={`px-3 py-1 rounded-lg cursor-pointer transition-all ${filter === 'available' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-600'}`}
            >
              Available ({availableCount})
            </button>
            <button
              onClick={() => setFilter('assigned')}
              className={`px-3 py-1 rounded-lg cursor-pointer transition-all ${filter === 'assigned' ? 'bg-white text-rose-700 shadow-xs' : 'text-slate-600'}`}
            >
              Assigned ({assignedCount})
            </button>
            <button
              onClick={() => setFilter('present')}
              className={`px-3 py-1 rounded-lg cursor-pointer transition-all ${filter === 'present' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600'}`}
            >
              Present Now ({presentCount})
            </button>
          </div>
        </div>

        {/* 100 Study Desks Grid */}
        <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-8 lg:grid-cols-10 gap-2.5">
          {filteredSeats.map(seat => {
            const isAssigned = seat.assigned;
            const isPresent = seat.presence === 'present';

            return (
              <div
                key={seat.seat_number}
                onClick={() => setSelectedSeat(seat)}
                className={`p-3 rounded-2xl border flex flex-col justify-between transition-all cursor-pointer hover:scale-105 select-none ${
                  !isAssigned
                    ? 'bg-emerald-50/50 border-emerald-200 hover:border-emerald-400 text-emerald-900'
                    : isPresent
                    ? 'bg-indigo-50 border-indigo-300 hover:border-indigo-500 text-indigo-950 shadow-xs'
                    : 'bg-rose-50/70 border-rose-200 hover:border-rose-400 text-rose-950'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-black text-sm">
                    #{seat.seat_number}
                  </span>
                  <span className={`w-2 h-2 rounded-full ${
                    !isAssigned ? 'bg-emerald-500' : isPresent ? 'bg-indigo-600 animate-pulse' : 'bg-rose-500'
                  }`} />
                </div>

                <div className="mt-2 text-[10px] leading-tight font-medium truncate">
                  {!isAssigned ? (
                    <span className="text-emerald-700 font-bold">Available</span>
                  ) : (
                    <div>
                      <span className="font-bold truncate block">{seat.student?.name}</span>
                      <span className="text-[9px] opacity-75">{isPresent ? 'Inside Now' : 'Absent'}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Seat Detail / Assign Modal */}
      {selectedSeat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-slate-900 px-6 py-4 text-white flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base">Desk #{selectedSeat.seat_number}</h3>
                <p className="text-[11px] text-slate-400">Keshav Library Study Space</p>
              </div>
              <button onClick={() => setSelectedSeat(null)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="p-3 bg-slate-50 rounded-xl space-y-2 border border-slate-200 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-semibold">Status:</span>
                  <span className={`font-bold px-2 py-0.5 rounded-full text-[10px] uppercase ${
                    !selectedSeat.assigned
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}>
                    {selectedSeat.assigned ? 'Assigned' : 'Available'}
                  </span>
                </div>

                {selectedSeat.assigned && selectedSeat.student && (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 font-semibold">Assigned Member:</span>
                      <span className="font-bold text-slate-900">{selectedSeat.student.name}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 font-semibold">Member ID:</span>
                      <span className="font-mono font-bold text-slate-900">{selectedSeat.student.member_id}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 font-semibold">Mobile:</span>
                      <span className="font-mono text-slate-700">{selectedSeat.student.phone}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 font-semibold">Presence Today:</span>
                      <span className={`font-bold ${selectedSeat.presence === 'present' ? 'text-emerald-700' : 'text-slate-500'}`}>
                        {selectedSeat.presence === 'present' ? `Present (In: ${selectedSeat.check_in})` : 'Absent'}
                      </span>
                    </div>
                  </>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Assign or Reallocate Desk #{selectedSeat.seat_number}
                </label>
                <select
                  value={assignStudentId}
                  onChange={(e) => setAssignStudentId(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:outline-none"
                >
                  <option value="">-- Choose an action --</option>
                  {selectedSeat.assigned && (
                    <option value="unassign">Unassign Desk (Make Available)</option>
                  )}
                  {students.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.member_id}) — currently {s.assigned_seat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedSeat(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAssignStudent}
                  disabled={!assignStudentId}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer disabled:opacity-50"
                >
                  Update Desk
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
