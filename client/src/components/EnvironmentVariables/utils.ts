
import { EnvVariableInput, EnvVariableRow } from './../../@types/EnvironmentVariables.t';

let idSeq = 0;

export const makeId = () => `var_${Date.now()}_${idSeq++}`;


export const toRows = (vars: EnvVariableInput[]): EnvVariableRow[]=>  {
    return vars.map((v) => ({
        id: makeId(),
        key: v.key,
        value: v.value,
        isActive: v.isActive ?? true,
        status: null,
        originalKey: v.key,
        originalValue: v.value,
        originalActive: v.isActive ?? true,
    }));
}


export const toPublic = (rows: EnvVariableRow[]): EnvVariableInput[]=>  {
  return rows
    .filter((r) => r.status !== 'deleted')
    .map((r) => ({ key: r.key, value: r.value, active: r.isActive }));
}
 
// Parses "KEY=value", "export KEY=value", quoted values, blank lines and comments.
export const parseSmartPaste = (text: string): { key: string; value: string }[] => {
  const results: { key: string; value: string }[] = [];
  for (const raw of text.split('\n')) {
    let line = raw.trim();
    if (!line || line.startsWith('#')) continue;
    if (line.startsWith('export ')) line = line.slice(7).trim();
 
    const eq = line.indexOf('=');
    if (eq === -1) continue;
 
    const key = line.slice(0, eq).trim();
    let value = line.slice(eq + 1).trim();
 
    if (
      (value.startsWith('"') && value.endsWith('"') && value.length >= 2) ||
      (value.startsWith("'") && value.endsWith("'") && value.length >= 2)
    ) {
      value = value.slice(1, -1);
    }
 
    if (!key || !/^[A-Za-z_][A-Za-z0-9_]*$/.test(key)) continue;
    results.push({ key, value });
  }
  return results;
}
 