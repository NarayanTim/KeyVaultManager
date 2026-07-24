import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Search, Save, ClipboardPaste } from 'lucide-react';
import { Button } from '../ui';
import { toRows, toPublic, makeId } from './utils';
import type { RowStatus, EnvVariableRow, EnvVarManagerProps } from "@/@types/EnvironmentVariables.t"
import AddRow from './AddRow';
import EnvVariablesRow from './EnvVariablesRow';
import SmartPastePanel from './SmartPastePanel';


const EnvVariablesManager = ({ initialVariables = [], onSave,onChange,title = 'Environment variables',
    subtitle,className = '',}:EnvVarManagerProps) => {
const [rows, setRows] = useState<EnvVariableRow[]>(() => toRows(initialVariables));
  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showPaste, setShowPaste] = useState(false);
 
  // Re-seed if the caller hands us a new initialVariables array (e.g. switching files/environments).
  const initialRef = useRef(initialVariables);
    useEffect(() => {
        if (initialVariables.length === 0) return;
        if (initialRef.current !== initialVariables) {
            initialRef.current = initialVariables;
            setRows(toRows(initialVariables));
            setEditingId(null);
        }
    }, [initialVariables]);
    

    useEffect(() => {
        onChange?.(toPublic(rows));
        /**
            // eslint-disable-next-line react-hooks/exhaustive-deps 
         * Remove the error add onChnage
         */
    }, [rows, onChange]);
    
  const isDuplicate = (key: string, excludeId: string | null) => {
    const k = key.trim().toLowerCase();
    return rows.some((r) => r.id !== excludeId && r.status !== 'deleted' && r.key.toLowerCase() === k);
  };
 
  const addRow = (key: string, value: string) => {
    setRows((prev) => [
      ...prev,
      {
        id: makeId(),
        key,
        value,
        active: false, // new variables start inactive until deliberately enabled
        status: 'added',
        originalKey: null,
        originalValue: null,
        originalActive: null,
      },
    ]);
  }
 
    const saveEdit = (id: string, key: string, value: string) => {
        setRows((prev) =>
        prev.map((r) => {
            if (r.id !== id) return r;
            if (r.status === 'added') return { ...r, key, value };
            const changed = key !== r.originalKey || value !== r.originalValue || r.active !== r.originalActive;
            return { ...r, key, value, status: changed ? 'modified' : (null as RowStatus) };
        })
        );
        setEditingId(null);
    }
    
    const toggleActive = (id: string) => {
        setRows((prev) =>
        prev.map((r) => {
            if (r.id !== id) return r;
            const nextActive = !r.active;
            if (r.status === 'added') return { ...r, active: nextActive };
            const changed = r.key !== r.originalKey || r.value !== r.originalValue || nextActive !== r.originalActive;
            return { ...r, active: nextActive, status: changed ? 'modified' : (null as RowStatus) };
        })
        );
    }
    
    const deleteRow = (id: string) => {
        setRows((prev) => {
        const target = prev.find((r) => r.id === id);
        if (!target) return prev;
        if (target.status === 'added') return prev.filter((r) => r.id !== id);
        return prev.map((r) => (r.id === id ? { ...r, status: 'deleted' as RowStatus } : r));
        });
        if (editingId === id) setEditingId(null);
    }
    
    const restoreRow = (id: string) => {
        setRows((prev) =>
        prev.map((r) => {
            if (r.id !== id) return r;
            const changed = r.key !== r.originalKey || r.value !== r.originalValue || r.active !== r.originalActive;
            return { ...r, status: changed ? 'modified' : (null as RowStatus) };
        })
        );
    }
    
    const revertRow = (id: string) => {
        setRows((prev) =>
        prev.map((r) =>
            r.id === id
            ? {
                ...r,
                key: r.originalKey ?? r.key,
                value: r.originalValue ?? r.value,
                active: r.originalActive ?? r.active,
                status: null,
                }
            : r
        )
        );
    }
 
  const copyValue = (value: string)=>  {
    navigator.clipboard?.writeText(value).catch(() => {
    });
  }
 
  const importPasted = (pairs: { key: string; value: string }[]) => {
    if (pairs.length === 0) return;
    setRows((prev) => {
      const next = [...prev];
      for (const { key, value } of pairs) {
        const idx = next.findIndex((r) => r.status !== 'deleted' && r.key.toLowerCase() === key.toLowerCase());
        if (idx === -1) {
          next.push({
            id: makeId(),
            key,
            value,
            active: false,
            status: 'added',
            originalKey: null,
            originalValue: null,
            originalActive: null,
          });
        } else {
          const r = next[idx];
          if (r.status === 'added') {
            next[idx] = { ...r, value };
          } else {
            const changed = value !== r.originalValue || r.key !== r.originalKey || r.active !== r.originalActive;
            next[idx] = { ...r, value, status: changed ? 'modified' : null };
          }
        }
      }
      return next;
    });
    setShowPaste(false);
  }
 
  const saveAll = () =>{
    onSave?.(toPublic(rows));
    setRows((prev) => {
      const kept = prev
        .filter((r) => r.status !== 'deleted')
        .map((r) => ({ ...r, status: null as RowStatus, originalKey: r.key, originalValue: r.value, originalActive: r.active }));
      return kept;
    });
    setEditingId(null);
  }
 
  const discardAll = ()=> {
    setRows(toRows(initialVariables));
    setEditingId(null);
  }
 
  const counts = useMemo(
    () =>
      rows.reduce(
        (acc, r) => {
          if (r.status === 'added') acc.added++;
          else if (r.status === 'modified') acc.modified++;
          else if (r.status === 'deleted') acc.deleted++;
          return acc;
        },
        { added: 0, modified: 0, deleted: 0 }
      ),
    [rows]
  );
 
  const totalChanges = counts.added + counts.modified + counts.deleted;
 
  const visibleRows = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) => r.key.toLowerCase().includes(q));
  }, [rows, search]);
 
  const activeCount = rows.filter((r) => r.status !== 'deleted' && r.active).length;
  const totalCount = rows.filter((r) => r.status !== 'deleted').length;
 
  return (
    <div className={`relative mx-auto w-full max-w-2xl overflow-hidden rounded-xl border border-secondary-800 bg-secondary-950 font-sans shadow-2xl ${className}`}>
      <div className="flex items-center justify-between gap-3 border-b border-secondary-800 px-4 py-3">
        <div>
          <h2 className="text-sm font-semibold text-secondary-100">{title}</h2>
          <p className="text-xs text-secondary-500">
            {subtitle ?? `${activeCount} of ${totalCount} active`}
          </p>
        </div>
        <Button size="sm" variant={showPaste ? 'primary' : 'ghost'} onClick={() => setShowPaste((s) => !s)}>
          <ClipboardPaste size={13} /> Smart paste
        </Button>
      </div>
 
      {showPaste && <SmartPastePanel onImport={importPasted} onClose={() => setShowPaste(false)} />}
 
      <div className="border-b border-secondary-800 px-4 py-2.5">
        <div className="flex items-center gap-2 rounded-md border border-secondary-800 bg-secondary-900 px-2.5 py-1.5">
          <Search size={14} className="text-secondary-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search variables"
            className="w-full bg-transparent font-mono text-sm text-secondary-200 placeholder-secondary-600 focus:outline-none"
          />
        </div>
      </div>
 
      <div className="max-h-96 overflow-y-auto">
        {visibleRows.length === 0 ? (
          <div className="px-4 py-10 text-center text-sm text-secondary-500">
            {search ? 'No variables match your search.' : 'No variables yet. Add one below.'}
          </div>
        ) : (
          visibleRows.map((row) => (
            <EnvVariablesRow
              key={row.id}
              row={row}
              editing={editingId === row.id}
              onStartEdit={() => setEditingId(row.id)}
              onCancelEdit={() => setEditingId(null)}
              onSave={saveEdit}
              isDuplicate={isDuplicate}
              onDelete={deleteRow}
              onRestore={restoreRow}
              onRevert={revertRow}
              onCopy={copyValue}
              onToggleActive={toggleActive}
            />
          ))
        )}
        <AddRow onAdd={addRow} isDuplicate={isDuplicate} />
      </div>
 
      {totalChanges > 0 && (
        <div className="flex items-center justify-between gap-3 border-t border-secondary-800 bg-secondary-900 px-4 py-3">
          <div className="flex items-center gap-3 text-xs">
            {counts.added > 0 && <span className="text-success-400">+{counts.added} added</span>}
            {counts.modified > 0 && <span className="text-warning-400">{counts.modified} modified</span>}
            {counts.deleted > 0 && <span className="text-error-400">-{counts.deleted} deleted</span>}
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="ghost" onClick={discardAll}>
              Discard
            </Button>
            <Button size="sm" variant="success" onClick={saveAll}>
              <Save size={13} /> Save changes
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default EnvVariablesManager