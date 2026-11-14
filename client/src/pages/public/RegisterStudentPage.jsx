import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { DEPARTMENTS, COLLEGE_CONFIG } from '../../types';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Card from '../../components/common/Card';
import {
  GraduationCap,
  User,
  Mail,
  Lock,
  Hash,
  Building2,
  AlertCircle,
  ArrowRight,
  ShieldAlert,
  Info,
} from 'lucide-react';

export default function RegisterStudentPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    student_id_number: '',
    department: DEPARTMENTS[0],
    password: '',
    confirmPassword: '',
  });
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState('');

  const { registerStudent } = useAuth();
  const { showToast } = useNotifications();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!formData.name.trim()) {
      setFormError('Please enter your full name.');
      return;
    }
    if (!formData.email.trim()) {
      setFormError('Please enter your college email.');
      return;
    }
    if (!formData.student_id_number.trim()) {
      setFormError('Please provide your official Student ID / Roll number.');
      return;
    }
    if (!formData.password || formData.password.length < 6) {
      setFormError('Password must be at least 6 characters long.');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setFormError('Passwords do not match.');
      return;
    }
    if (!agreeTerms) {
      setFormError('You must agree to the academic honor code and event attendance policy.');
      return;
    }

    setLoading(true);
    try {
      await registerStudent({
        name: formData.name,
        email: formData.email,
        student_id_number: formData.student_id_number,
        department: formData.department,
        password: formData.password,
      });

      showToast('Account registered successfully! Welcome to CampusEvent.', 'success');
      navigate('/student');
    } catch (err) {
      setFormError(err.message || 'Failed to complete registration.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-xl text-center space-y-2 mb-6">
        <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-white mx-auto shadow-md">
          <GraduationCap className="w-7 h-7" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          Student Portal Registration
        </h2>
        <p className="text-xs text-slate-500">
          Create your verified student profile to register for events and obtain certificates
        </p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-xl">
        {/* Policy Notice Box */}
        <div className="mb-6 p-4 rounded-xl bg-blue-50/70 border border-blue-200 text-xs text-blue-900 flex items-start gap-3">
          <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <span className="font-semibold">Student-Only Public Enrollment:</span> This registration form assigns the{' '}
            <code className="font-semibold text-blue-800">STUDENT</code> role. Faculty organizers and administrative staff accounts must be provisioned by the Dean’s Office.{' '}
            <Link to="/register/organizer-restricted" className="underline font-semibold hover:text-blue-950">
              Read Organizer Policy
            </Link>
          </div>
        </div>

        <Card className="shadow-lg border-slate-200">
          {formError && (
            <div className="mb-5 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" />
              <span>{formError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Full Legal Name"
                name="name"
                icon={User}
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Alex Rivera"
              />

              <Input
                label="College Email"
                name="email"
                type="email"
                icon={Mail}
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="student@apex.edu"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Student ID / Roll No"
                name="student_id_number"
                icon={Hash}
                required
                value={formData.student_id_number}
                onChange={handleChange}
                placeholder="e.g. STU-2024-001"
              />

              <Select
                label="Academic Department"
                name="department"
                required
                options={DEPARTMENTS}
                value={formData.department}
                onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Create Password"
                name="password"
                type="password"
                icon={Lock}
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="Min 6 characters"
                helperText="At least 6 characters"
              />

              <Input
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                icon={Lock}
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Re-enter password"
              />
            </div>

            <div className="pt-2">
              <label className="flex items-start gap-2 text-xs text-slate-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4 mt-0.5"
                />
                <span>
                  I confirm that I am an actively enrolled student at {COLLEGE_CONFIG.name} and agree to follow the campus event code of conduct and attendance regulations.
                </span>
              </label>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="md"
              className="w-full mt-4"
              loading={loading}
              iconRight={ArrowRight}
            >
              Complete Registration
            </Button>
          </form>
        </Card>

        <p className="mt-6 text-center text-xs text-slate-500">
          Already registered?{' '}
          <Link to="/login" className="font-semibold text-blue-600 hover:text-blue-700">
            Sign In to your Account
          </Link>
        </p>
      </div>
    </div>
  );
}
