import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ROLES } from '../../types';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import { ShieldAlert, ArrowLeft, LogOut, Home, LayoutDashboard } from 'lucide-react';

export default function UnauthorizedPage() {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();

  const getDashboardPath = () => {
    if (role === ROLES.ADMIN) return '/admin';
    if (role === ROLES.ORGANIZER) return '/organizer';
    return '/student';
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto border border-rose-200 shadow-sm">
          <ShieldAlert className="w-9 h-9" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold text-rose-600 uppercase tracking-widest bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200">
            HTTP 403 — Access Denied
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Unauthorized Role Access
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-sm mx-auto">
            You do not possess the required system authorization permissions to view this resource.
          </p>
        </div>

        {user && (
          <Card className="text-left bg-slate-50/70 border-slate-200">
            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Current Session:</span>
                <span className="font-semibold text-slate-900">{user.name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Assigned System Role:</span>
                <Badge variant={role} size="sm">
                  {role}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Department:</span>
                <span className="text-slate-700">{user.department}</span>
              </div>
            </div>
          </Card>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          {user ? (
            <>
              <Link to={getDashboardPath()}>
                <Button variant="primary" size="md" icon={LayoutDashboard}>
                  Return to My Workspace
                </Button>
              </Link>
              <Button variant="outline" size="md" icon={LogOut} onClick={handleLogout}>
                Sign Out
              </Button>
            </>
          ) : (
            <Link to="/login">
              <Button variant="primary" size="md">
                Sign In With Authorized Account
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
