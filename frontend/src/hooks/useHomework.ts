import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import type { Homework } from '../types/Homework';
import { filterSortHomework } from '../services/homeworkService';
import { homeworkRepository } from '../repositories/homeworkRepository';

type HomeworkStatusUi = 'todo' | 'in-progress' | 'done';
type StatusFilter = 'all' | HomeworkStatusUi;

type HomeworkStatusApi = 'todo' | 'in_progress' | 'done';

const toApiStatus = (s: HomeworkStatusUi): HomeworkStatusApi =>
    s === 'in-progress' ? 'in_progress' : s;

const toUiStatus = (s: HomeworkStatusApi): HomeworkStatusUi =>
    s === 'in_progress' ? 'in-progress' : s;

export function useHomework(
    initial: {
        courseId?: string;
        status?: StatusFilter;
        q?: string;
        sort?: 'dueDate' | 'createdAt';
    } = { status: 'all', sort: 'dueDate' },
) {
    const { isLoaded, isSignedIn } = useAuth();

    const [all, setAll] = useState<Homework[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | undefined>(undefined);

    const [courseId, setCourseId] = useState(initial.courseId);
    const [status, setStatusFilter] = useState<StatusFilter>(initial.status ?? 'all');
    const [q, setQ] = useState(initial.q ?? '');
    const [sort, setSort] = useState<'dueDate' | 'createdAt'>(initial.sort ?? 'dueDate');

    useEffect(() => {
        let cancelled = false;

        // Signed-in only behavior: wait for Clerk to be ready
        if (!isLoaded) {
            setLoading(true);
            setError(undefined);
            return () => {
                cancelled = true;
            };
        }

        if (!isSignedIn) {
            setLoading(false);
            setAll([]);
            setError('Sign in to view assignments');
            return () => {
                cancelled = true;
            };
        }

        (async () => {
            setLoading(true);
            setError(undefined);

            try {
                const items = await homeworkRepository.list();
                const uiItems = items.map((h) => ({
                    ...h,
                    status: toUiStatus(h.status as HomeworkStatusApi),
                })) as Homework[];

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
    }, [isLoaded, isSignedIn]);

    const list = useMemo(
        () => filterSortHomework(all, { courseId, status, q, sort }),
        [all, courseId, status, q, sort],
    );

    async function refresh() {
        if (!isLoaded || !isSignedIn) return;

        const items = await homeworkRepository.list();
        const uiItems = items.map((h) => ({
            ...h,
            status: toUiStatus(h.status as HomeworkStatusApi),
        })) as Homework[];
        setAll(uiItems);
    }

    async function setItemStatus(id: string, next: HomeworkStatusUi) {
        if (!isLoaded || !isSignedIn) return;

        await homeworkRepository.update(id, { status: toApiStatus(next) } as any);
        await refresh();
    }

    async function add(input: Omit<Homework, 'id' | 'createdAt'>) {
        if (!isLoaded || !isSignedIn) return;

        const payload: any = { ...input };
        if (payload.status) payload.status = toApiStatus(payload.status);
        await homeworkRepository.create(payload);
        await refresh();
    }

    async function remove(id: string) {
        if (!isLoaded || !isSignedIn) return;

        await homeworkRepository.remove(id);
        await refresh();
    }

    return {
        loading,
        error,
        list,
        total: all.length,
        courseId,
        status,
        q,
        sort,

        setCourseId,
        setStatusFilter,
        setQ,
        setSort,

        toTodo: (id: string) => setItemStatus(id, 'todo'),
        toInProgress: (id: string) => setItemStatus(id, 'in-progress'),
        toDone: (id: string) => setItemStatus(id, 'done'),

        add,
        remove,
        refresh,
    };
}

export type UseHomeworkApi = ReturnType<typeof useHomework>;