import React, { useEffect, useRef, useState } from 'react';
import { Eye, EyeOff, Check, X } from 'lucide-react';
import RowMenu from './RowMenu';
import { Badge, Button } from '../ui';
import ToggleSwitch from './ToggleSwitch';
import Input from '../forms/input';
import { STATUS_META } from './constants';
import type { EnvVariableRow } from '@/@types/EnvironmentVariables.t';


interface EnvVariableRowType{
    row: EnvVariableRow;
    editing: boolean;
    onStartEdit: () => void;
    onCancelEdit: () => void;
    onSave: (id: string, key: string, value: string) => void;
    isDuplicate: (key: string, excludeId: string | null) => boolean;
    onDelete: (id: string) => void;
    onRestore: (id: string) => void;
    onRevert: (id: string) => void;
    onCopy: (value: string) => void;
    onToggleActive: (id: string) => void;
}


const EnvVariablesRow = ({ row, editing, onStartEdit, onCancelEdit, onSave, isDuplicate, onDelete,
    onRestore,onRevert,onCopy,onToggleActive}: EnvVariableRowType) => {
    const [draftKey, setDraftKey] = useState(row.key);
    const [draftValue, setDraftValue] = useState(row.value);
    const [visible, setVisible] = useState(false);
    const keyRef = useRef<HTMLInputElement>(null);
 
    // const onEdit = () => {
    //     setDraftKey(row.key);
    //     setDraftValue(row.value);
    //     setEditing(true);
    // };
        // Then replace every call to onStartEdit() with handleStartEdit().
    const handleStartEdit = () => {
    setDraftKey(row.key);
    setDraftValue(row.value);
    onStartEdit();
    };


    useEffect(() => {
    if (editing) {
        requestAnimationFrame(() => keyRef.current?.focus());
    }
    }, [editing]);

    
//   useEffect(() => {
//     if (editing) {
//       setDraftKey(row.key);
//       setDraftValue(row.value);
//       requestAnimationFrame(() => keyRef.current?.focus());
//     }
//   }, [editing, row.key, row.value]);
 
  const deleted = row.status === 'deleted';
  const meta = row.status ? STATUS_META[row.status] : null;
  const dupError = editing && isDuplicate(draftKey, row.id);
  const emptyKeyError = editing && draftKey.trim() === '';
 
  function commit() {
    if (dupError || emptyKeyError) return;
    onSave(row.id, draftKey.trim(), draftValue);
  }
 
  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') {
      e.preventDefault();
      commit();
    }
    if (e.key === 'Escape') {
      e.preventDefault();
      onCancelEdit();
    }
  }
 
  return (
    <div
      className={`group relative flex items-center gap-3 border-b border-secondary-800 px-4 py-2.5 ${
        deleted ? 'opacity-50' : ''
      }`}
    >
      <span className={`absolute left-0 top-0 h-full w-0.5 ${meta ? meta.bar : 'bg-transparent'}`} />
 
      {editing ? (
        <>
          <div className="w-1/3 min-w-0 shrink-0">
            <Input
              ref={keyRef}
              value={draftKey}
              onChange={(e) => setDraftKey(e.target.value)}
              onKeyDown={handleKeyDown}
              spellCheck={false}
              placeholder="KEY_NAME"
              error={dupError ? 'Key already exists' : emptyKeyError ? "Key can't be empty" : undefined}
              className="font-mono"
            />
          </div>
          <div className="min-w-0 flex-1">
            <Input
              value={draftValue}
              onChange={(e) => setDraftValue(e.target.value)}
              onKeyDown={handleKeyDown}
              spellCheck={false}
              placeholder="value"
              className="font-mono"
            />
          </div>
          <Button size="sm" variant="success" onClick={commit} aria-label="Save">
            <Check size={16} />
          </Button>
          <Button size="sm" variant="ghost" onClick={onCancelEdit} aria-label="Cancel">
            <X size={16} />
          </Button>
        </>
      ) : (
        <>
          <button
            // onClick={() => !deleted && onStartEdit()}
            onClick={() => !deleted && handleStartEdit()}
            disabled={deleted}
            title={row.key}
            className={`w-1/3 min-w-0 shrink-0 truncate text-left font-mono text-sm ${
              deleted ? 'text-secondary-500 line-through' : 'text-secondary-100 hover:text-primary-400'
            }`}
          >
            {row.key}
          </button>
          <button
            // onClick={() => !deleted && onStartEdit()}
            onClick={() => !deleted && handleStartEdit()}
            disabled={deleted}
            className={`flex min-w-0 flex-1 items-center gap-2 truncate text-left font-mono text-sm ${
              deleted ? 'text-secondary-600 line-through' : 'text-secondary-400 hover:text-secondary-200'
            }`}
          >
            <span className="truncate">
              {visible ? row.value || '—' : '•'.repeat(Math.min(row.value.length, 14)) || '—'}
            </span>
          </button>
          <button
            onClick={() => setVisible((v) => !v)}
            className="rounded-md p-1.5 text-secondary-500 hover:bg-secondary-800 hover:text-secondary-200"
            aria-label={visible ? 'Hide value' : 'Show value'}
          >
            {visible ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
          {meta && (
            <span className="hidden shrink-0 sm:inline">
              <Badge variant={meta.badge} size="sm">
                {meta.label}
              </Badge>
            </span>
          )}
          <ToggleSwitch checked={row.isActive} disabled={deleted} onChange={() => onToggleActive(row.id)} label="Active" />
          <RowMenu
            row={row}
            // onEdit={onStartEdit}
            onEdit={handleStartEdit}
            onCopy={() => onCopy(row.value)}
            onDelete={() => onDelete(row.id)}
            onRestore={() => onRestore(row.id)}
            onRevert={() => onRevert(row.id)}
          />
        </>
      )}
    </div>
  );
}

export default EnvVariablesRow