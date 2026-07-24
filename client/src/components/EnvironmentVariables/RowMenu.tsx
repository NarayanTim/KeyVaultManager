import React, { useEffect, useRef, useState } from 'react';
import { MoreVertical, Pencil, Copy, Undo2, RotateCcw, Trash2 } from 'lucide-react';
import { EnvVariableRow } from '../../@types/EnvironmentVariables.t';

interface Actions{
    row: EnvVariableRow;
    onEdit: () => void;
    onCopy: () => void;
    onDelete: () => void;
    onRestore: () => void;
    onRevert: () => void;
}

const RowMenu = ({row, onEdit, onCopy, onDelete, onRestore, onRevert}:Actions) => {
    const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

    const handleClick = (e: MouseEvent) => {
        if (ref.current && !ref.current.contains(e.target as Node)) {
            setOpen(false);
        }
    }
    
  useEffect(() => {
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);
 
  const isDeleted = row.status === 'deleted';
 
  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="rounded-md p-1.5 text-secondary-500 transition-colors hover:bg-secondary-800 hover:text-secondary-200"
        aria-label="Row actions"
      >
        <MoreVertical size={16} />
      </button>
      {open && (
        <div className="absolute right-0 top-full z-20 mt-1 w-44 overflow-hidden rounded-lg border border-secondary-800 bg-secondary-900 py-1 shadow-xl">
          {!isDeleted && (
            <button
              onClick={() => {
                onEdit();
                setOpen(false);
              }}
              className="flex w-full items-center gap-2 px-3 py-2 text-sm text-secondary-300 hover:bg-secondary-800"
            >
              <Pencil size={14} /> Edit
            </button>
          )}
          <button
            onClick={() => {
              onCopy();
              setOpen(false);
            }}
            className="flex w-full items-center gap-2 px-3 py-2 text-sm text-secondary-300 hover:bg-secondary-800"
          >
            <Copy size={14} /> Copy value
          </button>
          {row.status === 'modified' && (
            <button
              onClick={() => {
                onRevert();
                setOpen(false);
              }}
              className="flex w-full items-center gap-2 px-3 py-2 text-sm text-secondary-300 hover:bg-secondary-800"
            >
              <Undo2 size={14} /> Revert changes
            </button>
          )}
          <div className="my-1 h-px bg-secondary-800" />
          {isDeleted ? (
            <button
              onClick={() => {
                onRestore();
                setOpen(false);
              }}
              className="flex w-full items-center gap-2 px-3 py-2 text-sm text-success-400 hover:bg-secondary-800"
            >
              <RotateCcw size={14} /> Restore
            </button>
          ) : (
            <button
              onClick={() => {
                onDelete();
                setOpen(false);
              }}
              className="flex w-full items-center gap-2 px-3 py-2 text-sm text-error-400 hover:bg-secondary-800"
            >
              <Trash2 size={14} /> Delete
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default RowMenu
