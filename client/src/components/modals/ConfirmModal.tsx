
import React from 'react'
import { Button } from '../ui';
import BaseModal from './BaseModal';




// ─────────────────────────────────────────────
// ConfirmModal — fully reusable, no assumptions
// about what is being deleted. Pass in whatever
// title, description, and labels you need.
// ─────────────────────────────────────────────
interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  /** e.g. "Delete project?" or "Remove member?" */
  title: string;
  /** e.g. "This will permanently delete 'Alpha' and all its tasks." */
  description: ReactNode;
  confirmText?: string;
  cancelText?: string;
  /** 'danger' renders the confirm button in red */
  variant?: 'default' | 'danger';
  loading?: boolean;
}
 
const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'default',
  loading = false,
}: ConfirmModalProps) => {
  return (
    <BaseModal isOpen={isOpen} onClose={onClose} size="sm" showClose={false}>
      <div className="space-y-5">
        {/* Icon + heading */}
        <div className="flex gap-4">
          {variant === 'danger' && (
            <div className="shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-error-50 dark:bg-error-900/30">
              <AlertTriangle className="w-5 h-5 text-error-600 dark:text-error-400" />
            </div>
          )}
          <div>
            <h2 className="text-base font-semibold text-secondary-900 dark:text-white">{title}</h2>
            <div className="mt-1 text-sm text-secondary-500 dark:text-secondary-400">{description}</div>
          </div>
        </div>
 
        {/* Actions */}
        <div className="flex gap-3 justify-end">
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            {cancelText}
          </Button>
          <Button
            variant={variant === 'danger' ? 'danger' : 'primary'}
            onClick={onConfirm}
            loading={loading}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </BaseModal>
  );
};

export default ConfirmModal