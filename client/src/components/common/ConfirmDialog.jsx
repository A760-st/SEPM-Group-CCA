import React from 'react';
import Modal from './Modal';
import Button from './Button';
import { AlertTriangle, AlertCircle, Info } from 'lucide-react';

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed with this action?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmVariant = 'danger',
  loading = false,
  iconType = 'danger',
}) {
  const IconComponent =
    iconType === 'danger'
      ? AlertTriangle
      : iconType === 'warning'
      ? AlertCircle
      : Info;

  const iconColors =
    iconType === 'danger'
      ? 'text-rose-600 bg-rose-50 border-rose-100'
      : iconType === 'warning'
      ? 'text-amber-600 bg-amber-50 border-amber-100'
      : 'text-blue-600 bg-blue-50 border-blue-100';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      maxWidth="max-w-md"
      footer={
        <>
          <Button variant="outline" size="sm" onClick={onClose} disabled={loading}>
            {cancelText}
          </Button>
          <Button
            variant={confirmVariant}
            size="sm"
            onClick={onConfirm}
            loading={loading}
          >
            {confirmText}
          </Button>
        </>
      }
    >
      <div className="flex items-start gap-4">
        <div className={`p-2.5 rounded-full border shrink-0 ${iconColors}`}>
          <IconComponent className="w-5 h-5" />
        </div>
        <div className="text-sm text-slate-600 leading-relaxed pt-1">
          {message}
        </div>
      </div>
    </Modal>
  );
}
