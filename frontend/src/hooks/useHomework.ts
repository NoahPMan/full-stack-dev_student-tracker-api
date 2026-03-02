// I.3 Chain: Hook (presentation) → homeworkService (business) → homeworkRepository (data)
import { useEffect, useMemo, useState } from 'react';
import type { Homework } from '../types/Homework';
import {
    addHomework,
    fetchAllHomework,
    filterSortHomework,
    removeHomework,
    setStatus,
} from '../services/homeworkService';

export function useHomework(
    initial: {
        courseId?: string;
        status?: 'all' | 'todo' | 'in-progress' | 'done';
        q?: string;
        sort?: 'dueDate' | 'createdAt';
    } = { status: 'all', sort: 'dueDate' },
) {
    const [all, setAll] = useState<Homework[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | undefined>(undefined);
    const [courseId, setCourseId] = useState(initial.courseId);
    const [status, setStatusFilter] = useState(initial.status ?? 'all');
    const [q, setQ] = useState(initial.q ?? '');
    const [sort, setSort] = useState(initial.sort ?? 'dueDate');

    useEffect(() => {
        let cancelled = false;
        (async () => {
            setLoading(true);
            setError(undefined);
            try {
                const items = await fetchAllHomework();
                if (!cancelled) setAll(items);
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

    const list = useMemo(
        () => filterSortHomework(all, { courseId, status, q, sort }),
        [all, courseId, status, q, sort],
    );

    async function refresh() {
        setAll(await fetchAllHomework());
    }

    const actions = {
        setCourseId,
        setStatusFilter,
        setQ,
        setSort,

        async toTodo(id: string) {
            await setStatus(id, 'todo');
            await refresh();
        },
        async toInProgress(id: string) {
            await setStatus(id, 'in-progress');
            await refresh();
        },
        async toDone(id: string) {
            await setStatus(id, 'done');
            await refresh();
        },

        async add(input: Omit<Homework, 'id' | 'createdAt'>) {
            await addHomework(input);
            await refresh();
        },

        async remove(id: string) {
            await removeHomework(id);
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