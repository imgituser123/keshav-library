import React from 'react';
import {
  BookOpen,
  Wifi,
  Zap,
  Sun,
  Wind,
  ShieldCheck,
  Coffee,
  CheckCircle,
  Clock,
  MapPin,
  Phone,
  ArrowRight,
  Layers,
  Sparkles,
  Headphones,
  Laptop,
  Users,
  Compass,
  FileText,
  ExternalLink
} from 'lucide-react';
import { LIBRARY_CONFIG } from '../../config/libraryInfo';

interface LandingPageProps {
  onOpenEnquiry: () => void;
  onNavigate: (path: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onOpenEnquiry, onNavigate }) => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white pt-16 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>

        <div className="relative max-w-5xl mx-auto text-center space-y-6">
          {/* Brand Tagline Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-800/80 border border-slate-700/80 text-emerald-400 text-xs sm:text-sm font-semibold tracking-wide">
            <Sparkles className="w-4 h-4" />
            <span>{LIBRARY_CONFIG.name} — {LIBRARY_CONFIG.tagline}</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-tight">
            Your Space. <span className="text-emerald-400">Your Focus.</span>
          </h1>

          {/* Section 19 Required Homepage Description */}
          <p className="max-w-3xl mx-auto text-lg sm:text-xl text-slate-300 font-normal leading-relaxed">
            {LIBRARY_CONFIG.description}
          </p>

          {/* Secondary message callout */}
          <div className="inline-block p-4 max-w-2xl mx-auto rounded-2xl bg-slate-800/60 border border-slate-700/60 backdrop-blur-xs">
            <p className="text-sm sm:text-base text-slate-200 font-medium italic">
              "Bring your books. Bring your notes. We provide the environment to study."
            </p>
          </div>

          {/* Location & 24 Hours Tag */}
          <div className="flex flex-wrap items-center justify-center gap-3 text-xs sm:text-sm text-slate-300">
            <span className="flex items-center gap-1.5 bg-slate-800 px-3.5 py-1.5 rounded-full border border-slate-700 font-semibold text-emerald-400">
              <Clock className="w-4 h-4" /> {LIBRARY_CONFIG.hours}
            </span>
            <span className="flex items-center gap-1.5 bg-slate-800 px-3.5 py-1.5 rounded-full border border-slate-700 text-slate-300">
              <MapPin className="w-4 h-4 text-emerald-400" /> {LIBRARY_CONFIG.address}
            </span>
          </div>

          {/* Single Simple Membership Highlight */}
          <div className="pt-2 flex flex-col items-center">
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl px-6 py-3 flex items-baseline gap-3">
              <span className="text-xs uppercase tracking-wider text-emerald-300 font-bold">Monthly Membership</span>
              <span className="text-3xl font-extrabold text-white">₹{LIBRARY_CONFIG.monthlyFee}</span>
              <span className="text-slate-400 text-sm">/ month</span>
            </div>
            <p className="text-xs text-slate-400 mt-2">
              * Offline in-person payment confirmation. No online payment gateway.
            </p>
          </div>

          {/* Hero CTAs */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onOpenEnquiry}
              className="w-full sm:w-auto px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-base rounded-xl transition-all shadow-xl hover:shadow-emerald-500/20 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Enquire for Membership</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate('/facilities')}
              className="w-full sm:w-auto px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-base rounded-xl border border-slate-700 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Explore Facilities</span>
            </button>
          </div>

          {/* Key Trust Highlights */}
          <div className="pt-10 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto border-t border-slate-800/80">
            <div className="p-3">
              <div className="text-2xl font-bold text-emerald-400">Open 24 Hours</div>
              <div className="text-xs text-slate-400 mt-0.5">Continuous Access</div>
            </div>
            <div className="p-3">
              <div className="text-2xl font-bold text-white">₹600</div>
              <div className="text-xs text-slate-400 mt-0.5">Flat Monthly Rate</div>
            </div>
            <div className="p-3">
              <div className="text-2xl font-bold text-white">4 Zones</div>
              <div className="text-xs text-slate-400 mt-0.5">Silent & Discussion</div>
            </div>
            <div className="p-3">
              <div className="text-2xl font-bold text-emerald-400">100% Offline</div>
              <div className="text-xs text-slate-400 mt-0.5">Safe Desk Verification</div>
            </div>
          </div>
        </div>
      </section>

      {/* Notice / Philosophy Section */}
      <section className="py-12 bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center gap-6">
            <div className="w-14 h-14 bg-slate-900 text-emerald-400 rounded-2xl flex items-center justify-center shrink-0 shadow-md">
              <BookOpen className="w-7 h-7" />
            </div>
            <div className="space-y-1 text-center md:text-left">
              <h3 className="text-lg font-bold text-slate-900">
                Not a Book Lending Library — A Dedicated Physical Study Sanctuary
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Keshav Library is designed specifically for students preparing for competitive exams (UPSC, BPSC, SSC, Railway, NEET, JEE, Banking, CA, State Board) and self-studying scholars in Shakurabad. You bring your own textbooks, notes, and study material. We provide the 24-hour climate, silence, and power backup you need.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Facilities Section */}
      <section id="facilities" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Engineered For Deep Focus
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
            Library Facilities & Amenities
          </h2>
          <p className="text-slate-600 text-base">
            Every desk, lamp, and socket is arranged to eliminate friction and support long, productive study sessions in Shakurabad.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {/* Card 1 */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-emerald-400 flex items-center justify-center mb-3">
              <Layers className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-900 mb-1">Comfortable Study Space</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Ergonomic cushioned chairs, spacious desks with partitions for privacy and posture support.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-emerald-400 flex items-center justify-center mb-3">
              <Headphones className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-900 mb-1">Silent Environment</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Strict silence protocol with acoustic damping. Pin-drop silence so you enter deep focus.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-emerald-400 flex items-center justify-center mb-3">
              <Wifi className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-900 mb-1">High-Speed Wi-Fi</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Dual high-bandwidth internet connections for video lectures, test series, and downloads.
            </p>
          </div>

          {/* Card 4 */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-emerald-400 flex items-center justify-center mb-3">
              <Zap className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-900 mb-1">Charging Points</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Individual power sockets on every desk with 24/7 continuous generator power backup.
            </p>
          </div>

          {/* Card 5 */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-emerald-400 flex items-center justify-center mb-3">
              <Clock className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-900 mb-1">Open 24 Hours</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Flexible study schedule. Attend early morning, daytime, or late night according to your plan.
            </p>
          </div>

          {/* Card 6 */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-emerald-400 flex items-center justify-center mb-3">
              <Wind className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-900 mb-1">AC / Ventilated Air</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Climate cooling with fresh air exhaust to prevent fatigue and sustain energy all day.
            </p>
          </div>

          {/* Card 7 */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-emerald-400 flex items-center justify-center mb-3">
              <Coffee className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-900 mb-1">Drinking Water</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Hygienic RO-purified drinking water station available for all students.
            </p>
          </div>

          {/* Card 8 */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-emerald-400 flex items-center justify-center mb-3">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-900 mb-1">CCTV / Security</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              24/7 CCTV surveillance across all corridors and study areas for complete safety.
            </p>
          </div>

          {/* Card 9 */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-emerald-400 flex items-center justify-center mb-3">
              <Sparkles className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-900 mb-1">Clean Washrooms</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Sanitized, hygienic restrooms cleaned regularly for convenience and comfort.
            </p>
          </div>

          {/* Card 10 */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-emerald-400 flex items-center justify-center mb-3">
              <Compass className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-900 mb-1">4 Dedicated Zones</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Silent, General, Digital, and Discussion zones for distinct concentration preferences.
            </p>
          </div>
        </div>
      </section>

      {/* Study Zones Section */}
      <section id="zones" className="py-20 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-slate-800 px-3 py-1 rounded-full border border-slate-700">
              Purpose-Built Layouts
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              The Four Keshav Study Zones
            </h2>
            <p className="text-slate-300 text-base">
              Choose the zone that matches your exam preparation style in Shakurabad.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-slate-800/80 rounded-2xl p-6 border border-slate-700/80 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold tracking-wider uppercase text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20">
                    Zone A
                  </span>
                  <Headphones className="w-5 h-5 text-emerald-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Silent Zone</h3>
                <p className="text-sm text-slate-300 leading-relaxed mb-4">
                  Maximum concentration, zero noise, no whispering. For deep textbook study and solving papers.
                </p>
              </div>
              <div className="pt-4 border-t border-slate-700/60 text-xs text-slate-400 flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span>Ideal for: UPSC, BPSC, CA prep</span>
              </div>
            </div>

            <div className="bg-slate-800/80 rounded-2xl p-6 border border-slate-700/80 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold tracking-wider uppercase text-sky-400 bg-sky-500/10 px-2.5 py-1 rounded-md border border-sky-500/20">
                    Zone B
                  </span>
                  <BookOpen className="w-5 h-5 text-sky-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">General Zone</h3>
                <p className="text-sm text-slate-300 leading-relaxed mb-4">
                  Comfortable individual study desks with natural air and warm anti-glare reading light.
                </p>
              </div>
              <div className="pt-4 border-t border-slate-700/60 text-xs text-slate-400 flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-sky-400" />
                <span>Ideal for: Daily revision, notes reading</span>
              </div>
            </div>

            <div className="bg-slate-800/80 rounded-2xl p-6 border border-slate-700/80 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold tracking-wider uppercase text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-md border border-amber-500/20">
                    Zone C
                  </span>
                  <Laptop className="w-5 h-5 text-amber-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Digital Zone</h3>
                <p className="text-sm text-slate-300 leading-relaxed mb-4">
                  Equipped with dual power sockets for laptops, tablets, headphones, and online mock tests.
                </p>
              </div>
              <div className="pt-4 border-t border-slate-700/60 text-xs text-slate-400 flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-amber-400" />
                <span>Ideal for: Online test series, video lectures</span>
              </div>
            </div>

            <div className="bg-slate-800/80 rounded-2xl p-6 border border-slate-700/80 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold tracking-wider uppercase text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-md border border-indigo-500/20">
                    Zone D
                  </span>
                  <Users className="w-5 h-5 text-indigo-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Discussion Zone</h3>
                <p className="text-sm text-slate-300 leading-relaxed mb-4">
                  Permitted small-group discussions, peer doubt clearing, and collaborative exam preparation.
                </p>
              </div>
              <div className="pt-4 border-t border-slate-700/60 text-xs text-slate-400 flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-indigo-400" />
                <span>Ideal for: Peer study, debate, group quizzes</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Location Section */}
      <section className="py-16 bg-slate-100 border-t border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-md flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Shakurabad Study Hub</span>
              <h3 className="text-2xl font-bold text-slate-900">Visit Keshav Library in Shakurabad</h3>
              <p className="text-xs sm:text-sm text-slate-600 max-w-xl">
                📍 {LIBRARY_CONFIG.address} • 📞 {LIBRARY_CONFIG.phone} • 🕐 {LIBRARY_CONFIG.hours}
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <a
                href={LIBRARY_CONFIG.googleMapsUrl}
                target="_blank"
                rel="noreferrer"
                className="px-5 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-sm transition-all"
              >
                <span>View on Google Maps</span>
                <ExternalLink className="w-4 h-4 text-emerald-400" />
              </a>
              <button
                onClick={() => onNavigate('/contact')}
                className="px-5 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-sm transition-all cursor-pointer"
              >
                All Contact Options
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
