import React from 'react';
import { Link } from 'react-router-dom';
import { COLLEGE_CONFIG } from '../../types';
import { GraduationCap, Mail, ShieldAlert, Award, ExternalLink } from 'lucide-react';

export default function PublicFooter() {
  return (
    <footer className="bg-slate-900 text-slate-400 text-sm border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Branding */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2.5 text-white">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="font-bold text-base tracking-tight">CampusEvent</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Official centralized event registration and certificate management portal for{' '}
              <span className="text-slate-300 font-medium">{COLLEGE_CONFIG.name}</span>.
            </p>
            <div className="text-xs text-slate-500">
              Academic Year: <span className="text-slate-400">{COLLEGE_CONFIG.academicYear}</span>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-3">
              Portals & Access
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/events" className="hover:text-white transition">
                  Browse Public Events
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-white transition">
                  Campus Member Sign In
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-white transition">
                  Student Registration
                </Link>
              </li>
              <li>
                <Link
                  to="/register/organizer-restricted"
                  className="hover:text-white transition flex items-center gap-1"
                >
                  <span>Organizer Access Policy</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </Link>
              </li>
              <li>
                <Link
                  to="/register/admin-restricted"
                  className="hover:text-white transition flex items-center gap-1"
                >
                  <span>Administrator Access Notice</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Academic Standards & Verification */}
          <div>
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-3">
              Compliance & Security
            </h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-start gap-2">
                <ShieldAlert className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
                <span>Role-based access enforced via Layered Monolithic REST API</span>
              </li>
              <li className="flex items-start gap-2">
                <Award className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
                <span>Cryptographically verifiable attendance certificates</span>
              </li>
              <li>
                <Link to="/unauthorized" className="hover:text-white transition">
                  Access Restrictions Reference
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Support */}
          <div>
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-3">
              Technical Support
            </h4>
            <p className="text-xs text-slate-400 mb-2">
              For event inquiries, organizer privilege requests, or technical support:
            </p>
            <a
              href={`mailto:${COLLEGE_CONFIG.supportEmail}`}
              className="inline-flex items-center gap-2 text-xs text-blue-400 hover:text-blue-300 transition"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>{COLLEGE_CONFIG.supportEmail}</span>
            </a>
            <div className="mt-4 pt-4 border-t border-slate-800 text-[11px] text-slate-500">
              SEPM Project — Port 5173 Frontend
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© {new Date().getFullYear()} {COLLEGE_CONFIG.name}. All rights reserved.</p>
          <p className="mt-2 sm:mt-0">College Event Management System (SEPM Project)</p>
        </div>
      </div>
    </footer>
  );
}
