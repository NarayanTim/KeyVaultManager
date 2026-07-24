import React, {useState, useRef} from 'react'
import Input from '../forms/input';
import { Button } from '../ui';
import { Plus } from 'lucide-react';

interface Adding{
  onAdd: (key: string, value: string) => void;
  isDuplicate: (key: string, excludeId: string | null) => boolean;
}

const AddRow = ({onAdd, isDuplicate}:Adding) => {
const [key, setKey] = useState('');
  const [value, setValue] = useState('');
  const keyRef = useRef<HTMLInputElement>(null);

  const dup = key.trim() !== '' && isDuplicate(key.trim(), null);
    
    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>)=> {
    const text = e.clipboardData.getData("text").trim();

    if (!text.includes("=")) return;

    e.preventDefault();

    const lines = text
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean);

    // Single line: API_KEY=123
    if (lines.length === 1) {
        const [k, ...rest] = lines[0].split("=");
        const key = k.trim();
        const value = rest.join("=").trim();

        if (!key || isDuplicate(key, null)) return;

        onAdd(key, value);
        return;
    }

    // Multiple lines
    lines.forEach((line) => {
        const index = line.indexOf("=");

        if (index === -1) return;

        const key = line.slice(0, index).trim();
        const value = line.slice(index + 1).trim();

        if (!key || isDuplicate(key, null)) return;

        onAdd(key, value);
    });

    setKey("");
    setValue("");
    }
    
    
  function submit() {
    const k = key.trim();
    if (!k || dup) return;
    onAdd(k, value);
    setKey('');
    setValue('');
    keyRef.current?.focus();
  }
 
  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') {
      e.preventDefault();
      submit();
    }
    if (e.key === 'Escape') {
      setKey('');
      setValue('');
    }
  }
 
  return (
    <div className="flex items-center gap-3 bg-secondary-900 px-4 py-2.5">
      <div className="w-1/3 min-w-0 shrink-0">
        <Input
                  ref={keyRef}
                  onPaste={handlePaste}
          value={key}
          onChange={(e) => setKey(e.target.value)}
          onKeyDown={handleKeyDown}
          spellCheck={false}
          placeholder="NEW_VARIABLE"
          error={dup ? 'Key already exists' : undefined}
          className="font-mono"
        />
      </div>
      <div className="min-w-0 flex-1">
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          spellCheck={false}
          placeholder="value"
          className="font-mono"
        />
      </div>
      <Button size="sm" onClick={submit} disabled={!key.trim() || dup}>
        <Plus size={14} /> Add
      </Button>
    </div>
  );
}

export default AddRow