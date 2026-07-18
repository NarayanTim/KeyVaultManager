import React from 'react'
import { Button } from '../ui/index';
import { Folder, X } from 'lucide-react';
import BaseModal from './BaseModal';
import Input from '../forms/input';



interface AddProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (projectId: string) => void;
  onNavigate?: () => void;

}


const AddProjectModal = ({ isOpen, onClose }: AddProjectModalProps) => {
  const isPending = false;
  
  // const handleKeyDown = (e: React.KeyboardEvent) => {
  //   if (e.key === 'Enter') {
  //     handleSubmit();
  //   }
  // };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} size="sm" showClose={false}>
      <div className="space-y-5">

        {/* ── Header ── */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary-50 dark:bg-primary-900/30">
              <Folder className="w-5 h-5 text-primary-600 dark:text-primary-400" />
            </div>
            <h2 className="text-base font-semibold text-secondary-900 dark:text-white">
              New project
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="p-1 -m-1 text-secondary-400 hover:text-secondary-600 dark:hover:text-secondary-300 transition-colors disabled:opacity-40"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
 
        {/* ── Field ── */}
        <Input
          // ref={inputRef}
          label="Project name"
          placeholder="e.g. Website redesign"
          value={name}
          // onChange={handleChange}
          // onKeyDown={handleKeyDown}
          // error={fieldError}
          maxLength={80}
          disabled={isPending}
        />
 
        {/* Character countdown — only near limit
        {name.length > 60 && !fieldError && (
          <p className="text-xs text-secondary-400 dark:text-secondary-500 text-right -mt-3">
                      {80 - name.length} characters remaining
          </p>
        )}
 
        {/* ── Server error banner ── */}
        {/* {isError && (
          <p className="text-sm text-error-600 dark:text-error-400 bg-error-50 dark:bg-error-900/20 px-3 py-2 rounded-lg">
            {'Something went wrong. Please try again.'}
          </p>
        )}  */}
 
        {/* ── Actions ── */}
        <div className="flex gap-3 justify-end pt-1">
          <Button variant="secondary" onClick={onClose} disabled={isPending}>
            Cancel
          </Button>
          {/* <Button variant="primary" onClick={handleSubmit} isLoading={isPending}> */}
          <Button variant="primary"  isLoading={isPending}>
            Create project
          </Button>
        </div>
 
      </div>
    </BaseModal>
  );
};
 

export default AddProjectModal