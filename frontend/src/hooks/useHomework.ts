import { useEffect, useMemo, useState } from 'react';
import type { Homework } from '../types/Homework';
import { filterSortHomework } from '../services/homeworkService';
import { homeworkRepository } from '../repositories/homeworkRepository';

// Map UI ↔ API status strings
type UiStatus = 'all' | 'todo' | 'in-progress' | 'done';
type ApiStatus = 'todo' | 'in_progress' | 'done';

const toApiStatus = (s: UiStatus): ApiStatus => (s === 'in-progress' ? 'in_progress' : (s as ApiStatus));
const toUiStatus = (s: ApiStatus): UiStatus => (s === 'in_progress' ? 'in-progress' : s);

export function useHomework(
    initial: {
        courseId?: string;
        status?: UiStatus;
        q?: string;
        sort?: 'dueDate' | 'createdAt';
    } = { status: 'all', sort: 'dueDate' },
) {
    const [all, setAll] = useState<Homework[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | undefined>(undefined);
    const [courseId, setCourseId] = useState(initial.courseId);
    const [status, setStatusFilter] = useState<UiStatus>(initial.status ?? 'all');
    const [q, setQ] = useState(initial.q ?? '');
    const [sort, setSort] = useState<'dueDate' | 'createdAt'>(initial.sort ?? 'dueDate');

    // Load from API repository
    useEffect(() => {
        let cancelled = false;
        (async () => {
            setLoading(true);
            setError(undefined);
            try {
                const items = await homeworkRepository.list();
                // Convert API 'in_progress' → UI 'in-progress' if your UI expects hyphenated form
                const uiItems = items.map(h => ({ ...h, status: toUiStatus(h.status as ApiStatus) })) as Homework[];
                if (!cancelled) setAll(uiItems);
            } catch {
                if (!cancelled) setError('Failed to load assignments');
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();
        return () => {
            cancelled = true;
        };
    }, []);

    // Client-side filter/sort using your existing helper
    const list = useMemo(
        () => filterSortHomework(all, { courseId, status, q, sort }),
        [all, courseId, status, q, sort],
    );

    async function refresh() {
        const items = await homeworkRepository.list();
        const uiItems = items.map(h => ({ ...h, status: toUiStatus(h.status as ApiStatus) })) as Homework[];
        setAll(uiItems);
    }

    const actions = {
        setCourseId,
        setStatusFilter,
        setQ,
        setSort,

        async toTodo(id: string) {
            await homeworkRepository.update(id, { status: toApiStatus('todo') as any });
            await refresh();
        },
        async toInProgress(id: string) {
            await homeworkRepository.update(id, { status: toApiStatus('in-progress') as any });
            await refresh();
        },
        async toDone(id: string) {
            await homeworkRepository.update(id, { status: toApiStatus('done') as any });
            await refresh();
        },

        async add(input: Omit<Homework, 'id' | 'createdAt'>) {
            // Convert 'in-progress' → 'in_progress' if present; dueDate normalization is done in the repo
            const payload = { ...input } as any;
            if (payload.status) payload.status = toApiStatus(payload.status);
            await homeworkRepository.create(payload);
            await refresh();
        },

        async remove(id: string) {
            await homeworkRepository.remove(id);
            await refresh();
        },

        refresh,
    };

    return {
        loading,
        error,
        list,
        total: all.length,
        courseId,
        status,
        q,
        sort,
        ...actions,
    };
}

export type UseHomeworkApi = ReturnType<typeof useHomework>;