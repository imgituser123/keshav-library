import React, { useState } from 'react';
import { X, CheckCircle2, Send, Calendar, User, Phone, Mail, MessageSquare } from 'lucide-react';
import { libraryStore } from '../services/store';
import { LIBRARY_CONFIG } from '../config/libraryInfo';

interface EnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultType?: 'membership' | 'general';
}

export const EnquiryModal: React.FC<EnquiryModalProps> = ({ isOpen, onClose, defaultType = 'membership' }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [enquiryType, setEnquiryType] = useState<'membership' | 'general'>(defaultType);
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      setError('Please provide your name and mobile number.');
      return;
    }
    setError('');

    libraryStore.submitEnquiry({
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      enquiry_type: enquiryType,
      preferred_start_date: startDate,
      message: message.trim() || 'Enquiry for monthly study space membership (₹600/mo) at Shakurabad.'
    });

    setSubmitted(true);
  };

  const handleClose = () => {
    setSubmitted(false);
    setName('');
    setPhone('');
    setEmail('');
    setMessage('');
    setError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-slate-900 px-6 py-5 text-white flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold tracking-wider uppercase text-emerald-400">
              Keshav Library Membership
            </span>
            <h3 className="text-xl font-bold text-white mt-0.5">Enquire / Book Study Space</h3>
          </div>
          <button
            onClick={handleClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div className="space-y-2">
              <h4 className="text-2xl font-bold text-slate-900">Enquiry Submitted!</h4>
              {/* Exact Section 10 Message */}
              <p className="text-slate-700 font-semibold text-sm leading-relaxed">
                "Your membership enquiry has been submitted successfully. The Keshav Library team will contact you shortly."
              </p>
              <div className="mt-4 p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 text-left space-y-1">
                <div><strong>📍 Location:</strong> {LIBRARY_CONFIG.address}</div>
                <div><strong>📞 Phone:</strong> {LIBRARY_CONFIG.phone}</div>
                <div><strong>🕐 Access:</strong> {LIBRARY_CONFIG.hours}</div>
                <div><strong>💰 Fee:</strong> ₹{LIBRARY_CONFIG.monthlyFee}/month (Paid in person offline)</div>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="mt-6 w-full py-3.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-all shadow-md cursor-pointer"
            >
              Close & Return to Website
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="bg-emerald-50/70 p-3 rounded-xl border border-emerald-200 flex items-center justify-between text-xs">
              <span className="text-emerald-900 font-semibold">Monthly Study Space Membership:</span>
              <span className="font-bold text-emerald-800 bg-white px-2 py-0.5 rounded-md border border-emerald-300">
                ₹{LIBRARY_CONFIG.monthlyFee} / month (In-Person Payment)
              </span>
            </div>

            {error && (
              <div className="p-3 bg-rose-50 text-rose-700 border border-rose-200 rounded-xl text-xs font-medium">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Kumar"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-slate-900 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Mobile Number <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="tel"
                    required
                    placeholder="+91 83402 35780"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-slate-900 focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    placeholder="student@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-slate-900 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Enquiry Type
                </label>
                <select
                  value={enquiryType}
                  onChange={(e) => setEnquiryType(e.target.value as any)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-slate-900 focus:outline-none"
                >
                  <option value="membership">Monthly Membership (₹600)</option>
                  <option value="general">Desk / Facility Enquiry</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Preferred Joining Date
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-slate-900 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Message / Target Exam / Preferred Zone
              </label>
              <div className="relative">
                <MessageSquare className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <textarea
                  rows={3}
                  placeholder="e.g. Preparing for BPSC / UPSC / SSC. Preferred Silent Zone desk."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-slate-900 focus:outline-none resize-none"
                />
              </div>
            </div>

            <p className="text-[11px] text-slate-500">
              * Note: Keshav Library operates completely offline payments. No card, UPI, or online payment is collected on this website.
            </p>

            <button
              type="submit"
              className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Submit Membership Enquiry</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
