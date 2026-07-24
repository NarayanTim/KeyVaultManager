/* ------------------------------------------------------------------ */
/* Public types                                                       */
/* ------------------------------------------------------------------ */
/** Shape callers pass in / get back out of <EnvVarManager />. No internal bookkeeping fields. */
export interface EnvVariableInput {
    id?: string;
    key: string;
    value: string;
    isActive?: boolean;
}


export type RowStatus = 'added' | 'modified' | 'deleted' | null;


/** Internal row shape — tracks edit/diff state on top of the public shape. */
export interface EnvVariableRow {
    id: string;
    key: string;
    value: string;
    isActive: boolean;
    status: RowStatus;
    originalKey: string | null;
    originalValue: string | null;
    originalActive: boolean | null;
}

export interface EnvVarManagerProps {
    /** Starting set of variables. Uncontrolled after mount — edit locally, commit via onSave. */
    initialVariables?: EnvVariableInput[];
    /** Called with the full, current variable list when the user clicks "Save changes". */
    onSave?: (variables: EnvVariableInput[]) => void;
    /** Called whenever the draft (unsaved) list changes, if you want to mirror state upward. */
    onChange?: (variables: EnvVariableInput[]) => void;
    title?: string;
    subtitle?: string;
    className?: string;
}
 
/* ------------------------------------------------------------------ */
/* Backend types (from your API)                                      */
/* ------------------------------------------------------------------ */
 
/**
 * Shape returned by the backend for a stored secret.
 * `encryptedValue` is opaque to the client — the server encrypts/decrypts it.
 * When you wire up the real API, your fetch layer should already have
 * decrypted `encryptedValue` into a plaintext value before it reaches the UI
 * (or you expose a dedicated "reveal" endpoint). Adjust `secretToEnvVariable`
 * below once you know which of those patterns your backend uses.
 */
export interface Secrets {
    id: string;
    projectId: string;
    key: string;
    value: string;
    isActive: boolean;
    createdAt: Date | string;
    updatedAt: Date | string;
}
