import React from 'react';
import { MapPin, Phone, MessageSquare, Mail, Clock, ExternalLink, Navigation, CheckCircle2 } from 'lucide-react';
import { LIBRARY_CONFIG } from '../../config/libraryInfo';

interface ContactPageProps {
  onOpenEnquiry: () => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ onOpenEnquiry }) => {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-10">
        {/* Header */}
        <div className="text-center space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Contact & Location
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            {LIBRARY_CONFIG.name}
          </h1>
          <p className="text-base text-slate-600 max-w-2xl mx-auto">
            Visit our 24-hour study space in Shakurabad or get in touch for desk availability, silent zone bookings, and monthly membership enrolment.
          </p>
        </div>

        {/* Contact Details Card */}
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-lg space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Address */}
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <div className="flex items-center gap-2.5 text-slate-900 font-bold text-sm">
                <MapPin className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>Address</span>
              </div>
              <p className="text-sm font-semibold text-slate-800 pl-7.5">
                {LIBRARY_CONFIG.address}
              </p>
              <p className="text-xs text-slate-500 pl-7.5">
                Dedicated study environment in Shakurabad, Jehanabad, Bihar.
              </p>
            </div>

            {/* Operational Hours */}
            <div className="p-5 bg-emerald-50/60 rounded-2xl border border-emerald-200 space-y-2">
              <div className="flex items-center gap-2.5 text-emerald-900 font-bold text-sm">
                <Clock className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>Operational Hours</span>
              </div>
              <p className="text-sm font-black text-emerald-800 pl-7.5">
                {LIBRARY_CONFIG.hours}
              </p>
              <p className="text-xs text-emerald-700 pl-7.5">
                Study anytime day or night. Continuous power backup, AC, and high-speed Wi-Fi.
              </p>
            </div>

            {/* Phone & Call */}
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <div className="flex items-center gap-2.5 text-slate-900 font-bold text-sm">
                <Phone className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>Direct Phone Call</span>
              </div>
              <p className="text-base font-mono font-bold text-slate-900 pl-7.5">
                {LIBRARY_CONFIG.phone}
              </p>
              <p className="text-xs text-slate-500 pl-7.5">
                Speak directly with the desk administrator.
              </p>
            </div>

            {/* WhatsApp & Email */}
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <div className="flex items-center gap-2.5 text-slate-900 font-bold text-sm">
                <MessageSquare className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>WhatsApp & Email</span>
              </div>
              <div className="pl-7.5 space-y-1">
                <div className="text-xs text-slate-700">
                  WhatsApp: <strong className="font-mono text-slate-900">{LIBRARY_CONFIG.whatsappNumber}</strong>
                </div>
                <div className="text-xs text-slate-700">
                  Email: <strong className="text-slate-900">{LIBRARY_CONFIG.email}</strong>
                </div>
              </div>
            </div>
          </div>

          {/* 4 Required Action Buttons (Section 17) */}
          <div className="pt-2 border-t border-slate-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">
              Quick Actions
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {/* Button 1: Get Directions */}
              <a
                href={LIBRARY_CONFIG.googleMapsUrl}
                target="_blank"
                rel="noreferrer"
                className="py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md text-center"
              >
                <Navigation className="w-4 h-4 text-emerald-400" />
                <span>Get Directions</span>
              </a>

              {/* Button 2: WhatsApp Us */}
              <a
                href={LIBRARY_CONFIG.whatsappDirectUrl}
                target="_blank"
                rel="noreferrer"
                className="py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md text-center"
              >
                <MessageSquare className="w-4 h-4" />
                <span>WhatsApp Us</span>
              </a>

              {/* Button 3: Call Us */}
              <a
                href={LIBRARY_CONFIG.telUrl}
                className="py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all border border-slate-200 text-center"
              >
                <Phone className="w-4 h-4 text-slate-600" />
                <span>Call Us</span>
              </a>

              {/* Button 4: Email Us */}
              <a
                href={LIBRARY_CONFIG.mailtoUrl}
                className="py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all border border-slate-200 text-center"
              >
                <Mail className="w-4 h-4 text-slate-600" />
                <span>Email Us</span>
              </a>
            </div>
          </div>
        </div>

        {/* Google Maps Embed & Verification Card (Section 16) */}
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-lg space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md mb-2">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Verified Google Maps Location</span>
              </div>
              <h2 className="text-2xl font-bold text-slate-900">Find Us on Google Maps</h2>
              <p className="text-xs text-slate-600 mt-0.5">
                Exact geographic coordinates for Keshav Library / Ravi Library, Shakurabad, Bihar 804425
              </p>
            </div>

            <a
              href={LIBRARY_CONFIG.googleMapsUrl}
              target="_blank"
              rel="noreferrer"
              className="py-2.5 px-5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center gap-2 transition-all shadow-md shrink-0 self-start sm:self-auto"
            >
              <span>View on Google Maps</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>

          {/* Interactive Map Visual */}
          <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 h-72 sm:h-96 flex flex-col items-center justify-center p-6 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-3 shadow-inner">
              <MapPin className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              Keshav Library (Ravi Library)
            </h3>
            <p className="text-xs text-slate-600 mt-1 max-w-md">
              Shakurabad, Jehanabad, Bihar 804425
            </p>
            <p className="text-xs font-mono text-emerald-700 mt-2 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200">
              Coordinates: 25.1510562, 84.9012641
            </p>

            <a
              href={LIBRARY_CONFIG.googleMapsUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-6 px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-lg flex items-center gap-2 transition-transform hover:scale-105"
            >
              <Navigation className="w-4 h-4 text-emerald-400" />
              <span>Open in Google Maps App / Browser</span>
            </a>
          </div>
        </div>

        {/* Walk-in Enquiry Banner */}
        <div className="p-6 bg-slate-900 text-white rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-white">Interested in Monthly Study Membership?</h3>
            <p className="text-xs text-slate-300 mt-1">
              Flat ₹600/month. No online payments. In-person desk inspection and verification.
            </p>
          </div>
          <button
            onClick={onOpenEnquiry}
            className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-md shrink-0 cursor-pointer"
          >
            Enquire for Membership
          </button>
        </div>
      </div>
    </div>
  );
};
