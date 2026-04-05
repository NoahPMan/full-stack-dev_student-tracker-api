import type { Repository } from './baseRepository';
import type { Homework } from '../types/Homework';

const API = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';
const BASE = `${API}/api/v1/homework`;

function normalizeDueDate(v: string) {
    return v && v.length === 10 ? `${v}T00:00:00.000Z` : v;
}

async function http<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
    const res = await fetch(input, init);
    if (!res.ok) {
        const text = await res.text().catch(() => '');
        throw new Error(`HTTP ${res.status} ${res.statusText}${text ? ` — ${text}` : ''}`);
    }
    if (res.status === 204) return undefined as unknown as T; // DELETE 204
    return (await res.json()) as T;
}

export const homeworkRepository: Repository<Homework> = {
    async list() {
        return http<Homework[]>(BASE);
    },

    async get(id) {
        // No GET /:id route yet; fetch-and-filter
        const all = await http<Homework[]>(BASE);
        return all.find(h => h.id === id);
    },

    async create(input) {
        const payload = {
            ...input,
            dueDate: normalizeDueDate((input as any).dueDate),
        };
        return http<Homework>(BASE, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });
    },

    async update(id, patch) {
        const payload = {
            ...patch,
            ...(patch?.dueDate ? { dueDate: normalizeDueDate((patch as any).dueDate) } : {}),
        };
        try {
            return await http<Homework>(`${BASE}/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
        } catch (err: any) {
            if (String(err?.message || '').startsWith('HTTP 404')) return undefined;
            throw err;
        }
    },

    async remove(id) {
        try {
            await http<void>(`${BASE}/${id}`, { method: 'DELETE' });
            return true;
        } catch (err: any) {
            if (String(err?.message || '').startsWith('HTTP 404')) return false;
            throw err;
        }
    },
};