import React from 'react';
import { BookOpen, User, Shield, Menu, X, Clock, MapPin, Send } from 'lucide-react';
import { LIBRARY_CONFIG } from '../../config/libraryInfo';
import { libraryStore } from '../../services/store';

interface PublicNavbarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  onOpenEnquiry: () => void;
}

export const PublicNavbar: React.FC<PublicNavbarProps> = ({ currentPath, onNavigate, onOpenEnquiry }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const currentUser = libraryStore.getCurrentUser();

  const handleNav = (path: string) => {
    onNavigate(path);
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Top Banner with 24 Hours & Shakurabad Address */}
      <div className="bg-slate-950 text-slate-300 text-xs py-2 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>
              <strong>Keshav Library:</strong> Study Space in Shakurabad, Jehanabad, Bihar 804425
            </span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span className="flex items-center gap-1 text-emerald-400 font-semibold">
              <Clock className="w-3.5 h-3.5" /> {LIBRARY_CONFIG.hours}
            </span>
            <span className="hidden md:inline">|</span>
            <span className="hidden md:flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" /> Shakurabad, Bihar
            </span>
            <span className="hidden md:inline">|</span>
            <a href={LIBRARY_CONFIG.telUrl} className="hover:text-emerald-400 transition-colors">
              {LIBRARY_CONFIG.phone}
            </a>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
          {/* Brand */}
          <div
            onClick={() => handleNav('/')}
            className="flex items-center gap-3 cursor-pointer select-none group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-emerald-400 text-slate-950 flex items-center justify-center font-black shadow-md group-hover:scale-105 transition-transform">
              <BookOpen className="w-5 h-5 fill-current" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-black tracking-tight text-white">{LIBRARY_CONFIG.name}</span>
                <span className="hidden sm:inline-block text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded font-mono">
                  24h Study Space
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">
                {LIBRARY_CONFIG.tagline}
              </p>
            </div>
          </div>

          {/* Nav links */}
          <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold text-slate-300">
            <button
              onClick={() => handleNav('/')}
              className={`hover:text-emerald-400 transition-colors cursor-pointer ${currentPath === '/' ? 'text-emerald-400 font-bold' : ''}`}
            >
              Home
            </button>
            <button
              onClick={() => handleNav('/facilities')}
              className={`hover:text-emerald-400 transition-colors cursor-pointer ${currentPath === '/facilities' ? 'text-emerald-400 font-bold' : ''}`}
            >
              Facilities
            </button>
            <button
              onClick={() => handleNav('/zones')}
              className={`hover:text-emerald-400 transition-colors cursor-pointer ${currentPath === '/zones' ? 'text-emerald-400 font-bold' : ''}`}
            >
              Study Zones
            </button>
            <button
              onClick={() => handleNav('/membership')}
              className={`hover:text-emerald-400 transition-colors cursor-pointer ${currentPath === '/membership' ? 'text-emerald-400 font-bold' : ''}`}
            >
              Membership (₹600)
            </button>
            <button
              onClick={() => handleNav('/contact')}
              className={`hover:text-emerald-400 transition-colors cursor-pointer ${currentPath === '/contact' ? 'text-emerald-400 font-bold' : ''}`}
            >
              Contact & Maps
            </button>
          </nav>

          {/* Portals and CTAs */}
          <div className="hidden sm:flex items-center gap-2.5">
            {/* Direct separated login links */}
            {currentUser ? (
              <button
                onClick={() => handleNav(currentUser.role === 'admin' ? '/admin/dashboard' : '/student/dashboard')}
                className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
              >
                {currentUser.role === 'admin' ? <Shield className="w-4 h-4" /> : <User className="w-4 h-4" />}
                <span>Go to {currentUser.role === 'admin' ? 'Admin Portal' : 'Student Dashboard'}</span>
              </button>
            ) : (
              <>
                <button
                  onClick={() => handleNav('/student/login')}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs rounded-xl border border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <User className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Student Login</span>
                </button>
                <button
                  onClick={() => handleNav('/admin/login')}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs rounded-xl border border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Shield className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Admin Login</span>
                </button>
              </>
            )}

            <button
              onClick={onOpenEnquiry}
              className="px-3.5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Enquire</span>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {mobileMenuOpen && (
          <div className="sm:hidden bg-slate-950 border-b border-slate-800 p-4 space-y-3">
            <div className="flex flex-col space-y-2 text-sm font-semibold">
              <button onClick={() => handleNav('/')} className="text-left py-2 hover:text-emerald-400">Home</button>
              <button onClick={() => handleNav('/facilities')} className="text-left py-2 hover:text-emerald-400">Facilities</button>
              <button onClick={() => handleNav('/zones')} className="text-left py-2 hover:text-emerald-400">Study Zones</button>
              <button onClick={() => handleNav('/membership')} className="text-left py-2 hover:text-emerald-400">Membership (₹600)</button>
              <button onClick={() => handleNav('/contact')} className="text-left py-2 hover:text-emerald-400">Contact & Location</button>
            </div>
            <div className="pt-3 border-t border-slate-800 grid grid-cols-2 gap-2">
              <button
                onClick={() => handleNav('/student/login')}
                className="py-2.5 bg-slate-800 text-emerald-400 font-bold text-xs rounded-xl text-center border border-slate-700"
              >
                Student Login
              </button>
              <button
                onClick={() => handleNav('/admin/login')}
                className="py-2.5 bg-slate-800 text-indigo-400 font-bold text-xs rounded-xl text-center border border-slate-700"
              >
                Admin Login
              </button>
            </div>
            <button
              onClick={() => { setMobileMenuOpen(false); onOpenEnquiry(); }}
              className="w-full py-3 bg-emerald-500 text-slate-950 font-bold text-xs rounded-xl text-center"
            >
              Enquire for Membership
            </button>
          </div>
        )}
      </header>
    </>
  );
};
