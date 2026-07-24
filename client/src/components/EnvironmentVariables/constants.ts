
import { RowStatus } from "@/@types/EnvironmentVariables.t";

export const STATUS_META: Record<Exclude<RowStatus, null>,{ badge: 'success' | 'warning' | 'error'; bar: string; label: string }
> = {
    added: { badge: 'success', bar: 'bg-success-500', label: 'Added' },
    modified: { badge: 'warning', bar: 'bg-warning-500', label: 'Modified' },
    deleted: { badge: 'error', bar: 'bg-error-500', label: 'Deleted' },
};