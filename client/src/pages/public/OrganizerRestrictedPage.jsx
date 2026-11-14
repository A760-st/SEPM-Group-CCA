import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { COLLEGE_CONFIG } from '../../types';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Textarea from '../../components/common/Textarea';
import {
  ShieldAlert,
  GraduationCap,
  Mail,
  ArrowLeft,
  CheckCircle2,
  Lock,
  Building,
  UserCheck,
} from 'lucide-react';

export default function OrganizerRestrictedPage() {
  const [requested, setRequested] = useState(false);
  const [facultyName, setFacultyName] = useState('');
  const [facultyEmail, setFacultyEmail] = useState('');
  const [department, setDepartment] = useState('');
  const [justification, setJustification] = useState('');

  const handleRequestSubmit = (e) => {
    e.preventDefault();
    setRequested(true);
  };

  return (
    <div className="min-h-[85vh] py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-xs font-semibold uppercase tracking-wider">
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>Privileged Access Policy</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Organizer Registration Restricted
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto leading-relaxed">
          In accordance with institutional security guidelines at {COLLEGE_CONFIG.name}, event organizer accounts cannot be registered publicly without verified administrative authorization.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Policy Explanations */}
        <div className="space-y-6">
          <Card className="border-amber-200/80 bg-amber-50/20">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Lock className="w-4 h-4 text-amber-600" />
              Why are organizer accounts restricted?
            </h3>
            <ul className="mt-3 space-y-3 text-xs text-slate-600">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>
                  <strong>Campus Venue Reservation:</strong> Organizers are granted permission to book college auditoriums, labs, and amphitheaters.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>
                  <strong>Student Data Privacy:</strong> Organizers can view participant rosters, student roll numbers, and academic departments.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>
                  <strong>Official Institutional Representation:</strong> Published events appear on the college official calendar and portal.
                </span>
              </li>
            </ul>
          </Card>

          <div className="p-4 rounded-xl bg-slate-100 text-xs text-slate-600 space-y-2">
            <p className="font-semibold text-slate-800">Who qualifies as an Event Organizer?</p>
            <p>
              1. Full-time and visiting college Faculty members.<br />
              2. Official Departmental Heads & Society Mentors.<br />
              3. President or Secretary of ratified Student Councils with faculty co-signatures.
            </p>
          </div>
        </div>

        {/* Verification Request Form */}
        <Card className="shadow-lg border-slate-200">
          {requested ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <UserCheck className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Organizer Request Submitted
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Thank you, <strong>{facultyName}</strong>. Your credential verification request has been queued for review by the Dean of Student Affairs. You will receive activation details via your institutional email address.
              </p>
              <div className="pt-2">
                <Link to="/">
                  <Button variant="outline" size="sm">
                    Return to Home
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleRequestSubmit} className="space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-slate-900">
                  Request Organizer Account Provisioning
                </h3>
                <p className="text-[11px] text-slate-500">
                  Submit your department verification details to the system administrator
                </p>
              </div>

              <Input
                label="Faculty / Society Lead Name"
                required
                value={facultyName}
                onChange={(e) => setFacultyName(e.target.value)}
                placeholder="e.g. Prof. Priya Sharma"
              />

              <Input
                label="Institutional Email"
                type="email"
                required
                value={facultyEmail}
                onChange={(e) => setFacultyEmail(e.target.value)}
                placeholder="priya.sharma@apex.edu"
                helperText="Must be an active @apex.edu address"
              />

              <Input
                label="Academic Department / Society"
                required
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                placeholder="e.g. Department of Information Technology"
              />

              <Textarea
                label="Role Justification / Planned Events"
                required
                rows={3}
                value={justification}
                onChange={(e) => setJustification(e.target.value)}
                placeholder="Briefly state upcoming events or student society you manage..."
              />

              <Button type="submit" variant="primary" size="md" className="w-full">
                Submit Request to Dean's Office
              </Button>
            </form>
          )}
        </Card>
      </div>

      <div className="pt-4 text-center">
        <Link
          to="/login"
          className="inline-flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900 font-medium"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Already have an authorized organizer account? Sign in here</span>
        </Link>
      </div>
    </div>
  );
}
