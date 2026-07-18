import React, { useRef, useState, useEffect } from 'react'
import { Button } from '../ui/index';
import { Folder, X } from 'lucide-react';
import BaseModal from './BaseModal';
import { useAddProject } from '@/hooks/projectHook';
import Input from '../forms/input';
import type { ProjectInput } from '@/@types/project.t';
import { validate } from '@/lib/helper';


interface AddProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (projectId: string) => void;
}

const NAME_MAX_LENGTH = 80;

const AddProjectModal = ({ isOpen, onClose, onSuccess }: AddProjectModalProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState<ProjectInput>({
    name: '',
    isActive: true,
  });
  const [fieldError, setFieldError] = useState<string | undefined>(undefined);
  const addProjectMutation = useAddProject();
  const isPending = addProjectMutation.isPending;


  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (fieldError) {
      setFieldError(undefined);
    }
  };

  const handleClose = () => {
    if (isPending) {
      return;
    }
    setFormData({ name: '', isActive: true });
    setFieldError(undefined);
    addProjectMutation.reset();
    onClose();
  };

  // Focus the field each time the modal opens
  useEffect(() => {
    if (isOpen) {
      // rAF ensures the modal (and input) has mounted/painted first
      const raf = requestAnimationFrame(() => inputRef.current?.focus());
      return () => cancelAnimationFrame(raf);
    }
  }, [isOpen]);
  
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const valid = validate({ value: formData.name, mainTitle: "Project", title: "Name" })
    
    if (valid.success === false) {
      setFieldError(valid.message)
      return;
    }
    const project = await addProjectMutation.mutateAsync({
      ...formData,
      name: valid.value,
    });

    onSuccess?.(project.id);
    handleClose();
  }


  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSubmit(event);
    }
  };

  return (
    <BaseModal isOpen={isOpen} onClose={handleClose} size="sm" showClose={false}>
      <form className="space-y-5" onSubmit={handleSubmit}>
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
            onClick={handleClose}
            disabled={isPending}
            className="p-1 -m-1 text-secondary-400 hover:text-secondary-600 dark:hover:text-secondary-300 transition-colors disabled:opacity-40"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ── Field ── */}
        <div>
          <Input
            ref={inputRef}
            name="name"
            label="Project name"
            placeholder="e.g. Website redesign"
            value={formData.name}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            error={fieldError}
            maxLength={NAME_MAX_LENGTH}
            disabled={isPending}
            autoFocus
          />

          {/* Character countdown — only near limit */}
          {formData.name.length > 60 && !fieldError && (
            <p className="text-xs text-secondary-400 dark:text-secondary-500 text-right mt-1">
              {NAME_MAX_LENGTH - formData.name.length} characters remaining
            </p>
          )}
        </div>

        {/* ── Server error banner ── */}
        {addProjectMutation.isError && (
          <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg">
            {addProjectMutation.error?.message || 'Something went wrong. Please try again.'}
          </p>
        )}

        {/* ── Actions ── */}
        <div className="flex gap-3 justify-end pt-1">
          <Button type="button" variant="secondary" onClick={handleClose} disabled={isPending}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isPending} disabled={!formData.name.trim()}>
            Create project
          </Button>
        </div>
      </form>
    </BaseModal>
  );
}
export default AddProjectModal