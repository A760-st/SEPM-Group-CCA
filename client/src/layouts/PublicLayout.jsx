import React from 'react';
import { Outlet } from 'react-router-dom';
import PublicNavbar from '../components/navigation/PublicNavbar';
import PublicFooter from '../components/navigation/PublicFooter';
import ToastContainer from '../components/common/ToastContainer';
import DevBanner from '../components/common/DevBanner';

export default function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      <DevBanner />
      <PublicNavbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <PublicFooter />
      <ToastContainer />
    </div>
  );
}
