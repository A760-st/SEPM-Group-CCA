import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { COLLEGE_CONFIG, ROLES } from '../../types';
import { GraduationCap, Calendar, LogIn, UserPlus, LayoutDashboard } from 'lucide-react';
import Button from '../common/Button';

export default function PublicNavbar() {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  const getDashboardPath = () => {
    if (!user) return '/login';
    if (user.role === ROLES.STUDENT) return '/student';
    if (user.role === ROLES.ORGANIZER) return '/organizer';
    if (user.role === ROLES.ADMIN) return '/admin';
    return '/student';
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* College Logo & Portal Title */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm group-hover:bg-blue-700 transition">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="text-base font-bold text-slate-900 leading-tight tracking-tight flex items-center gap-1.5">
                <span>CampusEvent</span>
                <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                  {COLLEGE_CONFIG.shortName}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-normal">
                {COLLEGE_CONFIG.name}
              </p>
            </div>
          </Link>

          {/* Public Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <Link
              to="/"
              className={`hover:text-blue-600 transition ${
                location.pathname === '/' ? 'text-blue-600 font-semibold' : ''
              }`}
            >
              Home
            </Link>
            <Link
              to="/events"
              className={`hover:text-blue-600 transition ${
                location.pathname === '/events' ? 'text-blue-600 font-semibold' : ''
              }`}
            >
              Public Schedule
            </Link>
            <a href="/#about" className="hover:text-blue-600 transition">
              About
            </a>
            <a href="/#faq" className="hover:text-blue-600 transition">
              FAQ
            </a>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <Link to={getDashboardPath()}>
                <Button variant="primary" size="sm" icon={LayoutDashboard}>
                  Go to Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outline" size="sm" icon={LogIn}>
                    Sign In
                  </Button>
                </Link>
                <Link to="/register" className="hidden sm:inline-flex">
                  <Button variant="primary" size="sm" icon={UserPlus}>
                    Student Register
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
