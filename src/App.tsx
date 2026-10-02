import React, { useState, useEffect } from 'react';
import { PublicNavbar } from './components/public/PublicNavbar';
import { PublicFooter } from './components/public/PublicFooter';
import { LandingPage } from './components/public/LandingPage';
import { ContactPage } from './components/public/ContactPage';
import { MembershipPage } from './components/public/MembershipPage';
import { EnquiryModal } from './components/EnquiryModal';

// Student Portal Components
import { StudentLogin } from './components/student/StudentLogin';
import { StudentRegister } from './components/student/StudentRegister';
import { StudentLayout } from './components/student/StudentLayout';
import { StudentDashboardView } from './components/student/StudentDashboardView';
import { StudentProfileView } from './components/student/StudentProfileView';
import { StudentMembershipView } from './components/student/StudentMembershipView';
import { StudentAttendanceView } from './components/student/StudentAttendanceView';
import { StudentFeesView } from './components/student/StudentFeesView';
import { StudentNotificationsView } from './components/student/StudentNotificationsView';

// Admin Portal Components
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminRegister } from './components/admin/AdminRegister';
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminDashboardView } from './components/admin/AdminDashboardView';
import { AdminStudentsView } from './components/admin/AdminStudentsView';
import { AdminMembershipsView } from './components/admin/AdminMembershipsView';
import { AdminEnquiriesView } from './components/admin/AdminEnquiriesView';
import { AdminFeesView } from './components/admin/AdminFeesView';
import { AdminAttendanceView } from './components/admin/AdminAttendanceView';
import { AdminSeatsView } from './components/admin/AdminSeatsView';
import { AdminNotificationsView } from './components/admin/AdminNotificationsView';
import { AdminSettingsView } from './components/admin/AdminSettingsView';

import { libraryStore } from './services/store';

export default function App() {
  // Support both hash and pathname navigation
  const getInitialPath = () => {
    if (window.location.hash && window.location.hash.startsWith('#/')) {
      return window.location.hash.substring(1);
    }
    const path = window.location.pathname;
    if (path.startsWith('/student') || path.startsWith('/admin') || path === '/contact' || path === '/membership' || path === '/facilities' || path === '/zones') {
      return path;
    }
    return '/';
  };

  const [currentPath, setCurrentPath] = useState<string>(getInitialPath);
  const [isEnquiryModalOpen, setIsEnquiryModalOpen] = useState(false);
  const [, setRerender] = useState(0);

  useEffect(() => {
    const unsub = libraryStore.subscribe(() => {
      setRerender(n => n + 1);
    });

    const handleHashChange = () => {
      if (window.location.hash && window.location.hash.startsWith('#/')) {
        setCurrentPath(window.location.hash.substring(1));
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => {
      unsub();
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  const navigate = (path: string) => {
    setCurrentPath(path);
    window.location.hash = `#${path}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentUser = libraryStore.getCurrentUser();
  const currentStudent = libraryStore.getCurrentStudent();

  // ---------------- STUDENT ROUTES (Section 1) ----------------
  if (currentPath.startsWith('/student')) {
    if (currentPath === '/student/login' || currentPath === '/student/set-password') {
      return (
        <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
          <PublicNavbar currentPath={currentPath} onNavigate={navigate} onOpenEnquiry={() => setIsEnquiryModalOpen(true)} />
          <StudentLogin
            initialMode={currentPath === '/student/set-password' ? 'set-password' : 'login'}
            onNavigate={navigate}
            onLoginSuccess={() => navigate('/student/dashboard')}
          />
          <PublicFooter onNavigate={navigate} />
          <EnquiryModal isOpen={isEnquiryModalOpen} onClose={() => setIsEnquiryModalOpen(false)} />
        </div>
      );
    }

    if (currentPath === '/student/register') {
      return (
        <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
          <PublicNavbar currentPath={currentPath} onNavigate={navigate} onOpenEnquiry={() => setIsEnquiryModalOpen(true)} />
          <StudentRegister onNavigate={navigate} />
          <PublicFooter onNavigate={navigate} />
          <EnquiryModal isOpen={isEnquiryModalOpen} onClose={() => setIsEnquiryModalOpen(false)} />
        </div>
      );
    }

    // Protected Student Area
    return (
      <StudentLayout currentPath={currentPath} onNavigate={navigate}>
        {currentStudent ? (
          <>
            {currentPath === '/student/dashboard' && (
              <StudentDashboardView student={currentStudent} onNavigate={navigate} />
            )}
            {currentPath === '/student/profile' && (
              <StudentProfileView student={currentStudent} />
            )}
            {currentPath === '/student/membership' && (
              <StudentMembershipView student={currentStudent} />
            )}
            {currentPath === '/student/attendance' && (
              <StudentAttendanceView student={currentStudent} />
            )}
            {currentPath === '/student/fees' && (
              <StudentFeesView student={currentStudent} />
            )}
            {currentPath === '/student/notifications' && (
              <StudentNotificationsView student={currentStudent} />
            )}
          </>
        ) : (
          <div className="min-h-[50vh] flex items-center justify-center text-center p-8">
            <div className="space-y-3">
              <h2 className="text-xl font-bold text-slate-800">Student Profile Not Found</h2>
              <p className="text-xs text-slate-500">Please sign in with a registered student account.</p>
              <button
                onClick={() => navigate('/student/login')}
                className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold"
              >
                Sign In
              </button>
            </div>
          </div>
        )}
      </StudentLayout>
    );
  }

  // ---------------- ADMIN ROUTES (Section 1) ----------------
  if (currentPath.startsWith('/admin')) {
    if (currentPath === '/admin/login') {
      return (
        <div className="min-h-screen bg-slate-100 flex flex-col justify-between">
          <PublicNavbar currentPath={currentPath} onNavigate={navigate} onOpenEnquiry={() => setIsEnquiryModalOpen(true)} />
          <AdminLogin onNavigate={navigate} onLoginSuccess={() => navigate('/admin/dashboard')} />
          <PublicFooter onNavigate={navigate} />
          <EnquiryModal isOpen={isEnquiryModalOpen} onClose={() => setIsEnquiryModalOpen(false)} />
        </div>
      );
    }

    if (currentPath === '/admin/register') {
      return (
        <div className="min-h-screen bg-slate-100 flex flex-col justify-between">
          <PublicNavbar currentPath={currentPath} onNavigate={navigate} onOpenEnquiry={() => setIsEnquiryModalOpen(true)} />
          <AdminRegister onNavigate={navigate} />
          <PublicFooter onNavigate={navigate} />
          <EnquiryModal isOpen={isEnquiryModalOpen} onClose={() => setIsEnquiryModalOpen(false)} />
        </div>
      );
    }

    // Protected Admin Area
    return (
      <AdminLayout currentPath={currentPath} onNavigate={navigate}>
        {currentPath === '/admin/dashboard' && (
          <AdminDashboardView onNavigate={navigate} />
        )}
        {currentPath === '/admin/students' && (
          <AdminStudentsView />
        )}
        {currentPath === '/admin/memberships' && (
          <AdminMembershipsView />
        )}
        {currentPath === '/admin/enquiries' && (
          <AdminEnquiriesView />
        )}
        {currentPath === '/admin/fees' && (
          <AdminFeesView />
        )}
        {currentPath === '/admin/attendance' && (
          <AdminAttendanceView />
        )}
        {currentPath === '/admin/seats' && (
          <AdminSeatsView />
        )}
        {currentPath === '/admin/notifications' && (
          <AdminNotificationsView />
        )}
        {currentPath === '/admin/settings' && (
          <AdminSettingsView onNavigate={navigate} />
        )}
      </AdminLayout>
    );
  }

  // ---------------- PUBLIC ROUTES (Section 16-19) ----------------
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between font-sans text-slate-800 antialiased">
      <PublicNavbar
        currentPath={currentPath}
        onNavigate={navigate}
        onOpenEnquiry={() => setIsEnquiryModalOpen(true)}
      />

      <main className="flex-1">
        {currentPath === '/contact' && (
          <ContactPage onOpenEnquiry={() => setIsEnquiryModalOpen(true)} />
        )}

        {currentPath === '/membership' && (
          <MembershipPage
            onOpenEnquiry={() => setIsEnquiryModalOpen(true)}
            onNavigateLogin={(role) => navigate(role === 'admin' ? '/admin/login' : '/student/login')}
          />
        )}

        {(currentPath === '/' || currentPath === '/facilities' || currentPath === '/zones' || currentPath === '/home') && (
          <LandingPage
            onOpenEnquiry={() => setIsEnquiryModalOpen(true)}
            onNavigate={navigate}
          />
        )}
      </main>

      <PublicFooter onNavigate={navigate} />

      <EnquiryModal
        isOpen={isEnquiryModalOpen}
        onClose={() => setIsEnquiryModalOpen(false)}
      />
    </div>
  );
}
