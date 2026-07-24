import React, { useMemo, useState } from 'react';
import { X, ClipboardPaste } from 'lucide-react';
import { Button } from '../ui';
import { parseSmartPaste } from './utils';

interface Panel{
    onImport: (pairs: { key: string; value: string }[]) => void;
    onClose: () => void;
}

const SmartPastePanel = ({onImport, onClose}:Panel) => {
 const [text, setText] = useState('');
  const preview = useMemo(() => parseSmartPaste(text), [text]);
 
  return (
    <div className="border-b border-secondary-800 bg-secondary-900 p-4">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-medium text-secondary-300">Smart paste</span>
        <button onClick={onClose} className="rounded-md p-1 text-secondary-500 hover:bg-secondary-800 hover:text-secondary-200" aria-label="Close">
          <X size={14} />
        </button>
      </div>
      <textarea
        autoFocus
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={'DATABASE_URL=postgres://...\nexport NODE_ENV=production\nAPI_KEY="sk_live_..."'}
        rows={5}
        spellCheck={false}
        className="w-full resize-none rounded-md border border-secondary-700 bg-secondary-950 px-3 py-2 font-mono text-sm text-secondary-100 placeholder-secondary-600 focus:border-primary-500 focus:outline-none"
      />
      <div className="mt-2 flex items-center justify-between">
        <span className="text-xs text-secondary-500">
          {preview.length > 0
            ? `${preview.length} variable${preview.length === 1 ? '' : 's'} detected`
            : 'Paste KEY=value lines, one per line'}
        </span>
        <Button
          size="sm"
          onClick={() => {
            onImport(preview);
            setText('');
          }}
          disabled={preview.length === 0}
        >
          <ClipboardPaste size={14} /> Import {preview.length > 0 ? `(${preview.length})` : ''}
        </Button>
      </div>
    </div>
  );
}

export default SmartPastePanel
