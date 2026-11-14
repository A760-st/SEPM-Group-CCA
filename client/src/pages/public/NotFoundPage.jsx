import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/common/Button';
import { FileQuestion, Home, ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center space-y-5">
        <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-500 flex items-center justify-center mx-auto border border-slate-200 shadow-xs">
          <FileQuestion className="w-9 h-9" />
        </div>
        <div className="space-y-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-widest bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200">
            HTTP 404 — Not Found
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Page Does Not Exist
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-sm mx-auto">
            The requested endpoint or path was not found on the CampusEvent system server.
          </p>
        </div>

        <div className="flex items-center justify-center gap-3 pt-2">
          <Link to="/">
            <Button variant="primary" size="md" icon={Home}>
              Return to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
