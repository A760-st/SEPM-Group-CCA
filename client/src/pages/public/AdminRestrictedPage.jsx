import React from 'react';
import { Link } from 'react-router-dom';
import { COLLEGE_CONFIG } from '../../types';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import {
  ShieldAlert,
  Lock,
  ArrowLeft,
  KeyRound,
  ShieldCheck,
  Building2,
  Mail,
} from 'lucide-react';

export default function AdminRestrictedPage() {
  return (
    <div className="min-h-[85vh] py-12 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto space-y-8">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-xs font-semibold uppercase tracking-wider">
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>Security Protocol 10-A</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Administrator Registration Restricted
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto leading-relaxed">
          System Administration privileges carry institutional authority over all user roles, event lifecycles, and certificate issuance across {COLLEGE_CONFIG.name}.
        </p>
      </div>

      <Card className="border-rose-200 shadow-md">
        <div className="space-y-5">
          <div className="flex items-start gap-3 p-4 rounded-xl bg-rose-50/50 border border-rose-100 text-xs text-rose-900">
            <Lock className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-bold text-sm">No Public Administrator Self-Registration</p>
              <p className="leading-relaxed">
                Under no circumstances does this platform permit public or self-service registration for the <code>ADMIN</code> role. Administrator accounts can only be provisioned internally by an existing system administrator through the User Management console.
              </p>
            </div>
          </div>

          <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
            <h4 className="font-semibold text-slate-800 uppercase tracking-wider text-[11px]">
              Administrative Responsibilities Encompass:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="p-3 rounded-lg border border-slate-200 bg-slate-50">
                <span className="font-semibold text-slate-900 block mb-1">User Role Management</span>
                Assigning and revoking Student, Organizer, and Admin roles; deactivating compromised accounts.
              </div>
              <div className="p-3 rounded-lg border border-slate-200 bg-slate-50">
                <span className="font-semibold text-slate-900 block mb-1">Venue Administration</span>
                Adding campus facilities, auditing venue capacities, and managing physical safety regulations.
              </div>
              <div className="p-3 rounded-lg border border-slate-200 bg-slate-50">
                <span className="font-semibold text-slate-900 block mb-1">Official Certificates</span>
                Auditing attended registrations, authorizing serial numbers, and issuing accredited certificates.
              </div>
              <div className="p-3 rounded-lg border border-slate-200 bg-slate-50">
                <span className="font-semibold text-slate-900 block mb-1">Institutional Oversight</span>
                Emergency event cancellation with mandatory audit reason logging.
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Mail className="w-4 h-4 text-slate-400" />
              <span>Contact: {COLLEGE_CONFIG.supportEmail}</span>
            </div>

            <Link to="/login">
              <Button variant="primary" size="md">
                Proceed to Authorized Sign In
              </Button>
            </Link>
          </div>
        </div>
      </Card>

      <div className="text-center">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to CampusEvent Portal Home</span>
        </Link>
      </div>
    </div>
  );
}
