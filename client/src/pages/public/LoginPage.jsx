import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { ROLES, COLLEGE_CONFIG } from '../../types';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Card from '../../components/common/Card';
import {
  GraduationCap,
  Mail,
  Lock,
  ArrowRight,
  AlertCircle,
  Shield,
  KeyRound,
  UserCheck,
} from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState('');

  const { login } = useAuth();
  const { showToast } = useNotifications();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectUrl = searchParams.get('redirect');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!email.trim()) {
      setFormError('Please enter your registered college email.');
      return;
    }
    if (!password) {
      setFormError('Please enter your password.');
      return;
    }

    setLoading(true);
    try {
      const response = await login(email, password);
      showToast(`Welcome back, ${response.user.name}!`, 'success');

      // Navigate based on redirect or authenticated user role
      if (redirectUrl) {
        navigate(redirectUrl);
      } else if (response.user.role === ROLES.ADMIN) {
        navigate('/admin');
      } else if (response.user.role === ROLES.ORGANIZER) {
        navigate('/organizer');
      } else {
        navigate('/student');
      }
    } catch (err) {
      setFormError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoCredentials = (role) => {
    setFormError('');
    if (role === ROLES.STUDENT) {
      setEmail('student@apex.edu');
      setPassword('student123');
    } else if (role === ROLES.ORGANIZER) {
      setEmail('organizer@apex.edu');
      setPassword('organizer123');
    } else if (role === ROLES.ADMIN) {
      setEmail('admin@apex.edu');
      setPassword('admin123');
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-2">
        <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-white mx-auto shadow-md">
          <GraduationCap className="w-7 h-7" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          Sign In to CampusEvent
        </h2>
        <p className="text-xs text-slate-500">
          Enter your institutional credentials to access your dashboard
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="shadow-lg border-slate-200">
          {formError && (
            <div className="mb-5 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" />
              <span>{formError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="College Email"
              type="email"
              icon={Mail}
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. yourname@apex.edu"
              autoComplete="email"
            />

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Password <span className="text-rose-500">*</span>
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                type="password"
                icon={Lock}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="md"
              className="w-full mt-2"
              loading={loading}
              iconRight={ArrowRight}
            >
              Sign In
            </Button>
          </form>

          {/* Quick Demo Access Pills */}
          <div className="mt-6 pt-5 border-t border-slate-100">
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider text-center mb-2.5 flex items-center justify-center gap-1">
              <KeyRound className="w-3 h-3 text-slate-400" />
              Quick Demo Fill (Instant Testing)
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => fillDemoCredentials(ROLES.STUDENT)}
                className="py-1.5 px-2 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-[11px] font-medium text-slate-700 text-center transition cursor-pointer"
              >
                Student
              </button>
              <button
                type="button"
                onClick={() => fillDemoCredentials(ROLES.ORGANIZER)}
                className="py-1.5 px-2 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-[11px] font-medium text-slate-700 text-center transition cursor-pointer"
              >
                Organizer
              </button>
              <button
                type="button"
                onClick={() => fillDemoCredentials(ROLES.ADMIN)}
                className="py-1.5 px-2 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-[11px] font-medium text-slate-700 text-center transition cursor-pointer"
              >
                Admin
              </button>
            </div>
          </div>
        </Card>

        {/* Footer Links */}
        <div className="mt-6 text-center space-y-2 text-xs text-slate-500">
          <p>
            New student?{' '}
            <Link to="/register" className="font-semibold text-blue-600 hover:text-blue-700">
              Create a Student Account
            </Link>
          </p>
          <p>
            Faculty or Administrator?{' '}
            <Link
              to="/register/organizer-restricted"
              className="text-slate-600 hover:text-slate-800 underline"
            >
              View privileged access policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
