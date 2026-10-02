import React from 'react';
import { MapPin, Phone, Mail, Clock, MessageSquare, ExternalLink, ArrowRight } from 'lucide-react';
import { LIBRARY_CONFIG } from '../../config/libraryInfo';

interface PublicFooterProps {
  onNavigate: (path: string) => void;
}

export const PublicFooter: React.FC<PublicFooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-slate-950 text-slate-400 py-14 px-4 sm:px-6 lg:px-8 border-t border-slate-900">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
        {/* Col 1: Brand & Tagline */}
        <div className="space-y-3 md:col-span-1">
          <div className="flex items-center gap-2">
            <span className="text-xl font-extrabold text-white tracking-tight">{LIBRARY_CONFIG.name}</span>
            <span className="text-[10px] bg-slate-800 text-emerald-400 px-2 py-0.5 rounded font-mono">24h Space</span>
          </div>
          <p className="text-xs font-semibold text-slate-300">
            {LIBRARY_CONFIG.tagline}
          </p>
          <p className="text-xs text-slate-500 leading-relaxed">
            {LIBRARY_CONFIG.description}
          </p>
          <div className="pt-2 text-xs text-emerald-400 font-bold">
            Monthly Membership: ₹{LIBRARY_CONFIG.monthlyFee}/month
          </div>
        </div>

        {/* Col 2: Official Contact Information */}
        <div className="space-y-2.5">
          <h4 className="text-xs font-bold uppercase tracking-wider text-white">Contact & Location</h4>
          <div className="flex items-start gap-2.5 text-xs text-slate-300">
            <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>{LIBRARY_CONFIG.address}</span>
          </div>
          <div className="flex items-center gap-2.5 text-xs text-slate-300">
            <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
            <a href={LIBRARY_CONFIG.telUrl} className="hover:text-emerald-400 transition-colors font-mono">
              {LIBRARY_CONFIG.phone}
            </a>
          </div>
          <div className="flex items-center gap-2.5 text-xs text-slate-300">
            <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
            <a href={LIBRARY_CONFIG.mailtoUrl} className="hover:text-emerald-400 transition-colors">
              {LIBRARY_CONFIG.email}
            </a>
          </div>
          <div className="flex items-center gap-2.5 text-xs text-emerald-400 font-semibold">
            <Clock className="w-4 h-4 shrink-0" />
            <span>{LIBRARY_CONFIG.hours}</span>
          </div>
        </div>

        {/* Col 3: Direct Maps & WhatsApp Links */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-white">Find & Chat</h4>
          <ul className="space-y-2 text-xs">
            <li>
              <a
                href={LIBRARY_CONFIG.googleMapsUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 text-slate-300 hover:text-emerald-400 transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
                <span>Google Maps Location</span>
              </a>
            </li>
            <li>
              <a
                href={LIBRARY_CONFIG.whatsappDirectUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 text-slate-300 hover:text-emerald-400 transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                <span>WhatsApp (+91 83402 35780)</span>
              </a>
            </li>
            <li>
              <button
                onClick={() => onNavigate('/contact')}
                className="flex items-center gap-1.5 text-slate-300 hover:text-emerald-400 transition-colors cursor-pointer"
              >
                <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
                <span>Full Contact & Directions Page</span>
              </button>
            </li>
          </ul>
        </div>

        {/* Col 4: Portals */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-white">Portals & Access</h4>
          <div className="space-y-2 text-xs">
            <div>
              <button
                onClick={() => onNavigate('/student/login')}
                className="text-slate-300 hover:text-emerald-400 font-semibold block cursor-pointer"
              >
                Student Login
              </button>
              <button
                onClick={() => onNavigate('/student/register')}
                className="text-slate-500 hover:text-slate-300 text-[11px] block cursor-pointer"
              >
                Register as Student
              </button>
            </div>
            <div className="pt-2 border-t border-slate-900">
              <button
                onClick={() => onNavigate('/admin/login')}
                className="text-slate-300 hover:text-indigo-400 font-semibold block cursor-pointer"
              >
                Admin Login
              </button>
              <button
                onClick={() => onNavigate('/admin/register')}
                className="text-slate-500 hover:text-slate-300 text-[11px] block cursor-pointer"
              >
                Register as Admin
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 text-center sm:text-left">
        <div>
          © 2026 {LIBRARY_CONFIG.name}. Shakurabad, Jehanabad, Bihar 804425. All rights reserved.
        </div>
        <div>
          Offline physical study space • Flat ₹600/month • No online payment gateway
        </div>
      </div>
    </footer>
  );
};
