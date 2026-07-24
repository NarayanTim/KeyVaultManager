import React from 'react'
import { Button } from '../ui';

interface Switch{
    checked: boolean;
    onChange: ()=>void;
    label: string;
    disabled?: boolean;
}

const ToggleSwitch = ({checked, onChange, label, disabled}:Switch) => {
    return (
        <Button
            type="button"
            role="switch"
            aria-checked={checked}
            aria-label={label}
            disabled={disabled}
            onClick={onChange}
            className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-secondary-900 disabled:cursor-not-allowed disabled:opacity-40 ${
                checked ? 'bg-primary-600' : 'bg-secondary-700'
            }`}
        
        >
      <span
        className={`inline-block h-3.5 w-3.5 transform rounded-full bg-secondary-950 transition-transform ${
          checked ? 'translate-x-4' : 'translate-x-1'
        }`}/>
      </Button>
  )
}

export default ToggleSwitch