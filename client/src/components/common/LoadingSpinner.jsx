import React from 'react';
import { Loader2 } from 'lucide-react';

export default function LoadingSpinner({
  message = 'Loading data...',
  fullScreen = false,
}) {
  const content = (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-3" />
      <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
        {message}
      </p>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        {content}
      </div>
    );
  }

  return content;
}
