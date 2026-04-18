// I.3 Chain: Hook (presentation) → homeworkService (business) → homeworkRepository (data)
import { useEffect, useState } from 'react';
import { fetchAllHomework } from '../services/homeworkService';

type Counts = { todo: number; inProgress: number; done: number; total: number };

export function useHomeworkCounts(courseId?: string) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | undefined>(undefined);
    const [counts, setCounts] = useState<Counts>({ todo: 0, inProgress: 0, done: 0, total: 0 });

    useEffect(() => {
        let cancelled = false;

        (async () => {
            setLoading(true);
            setError(undefined);

            try {
                const all = await fetchAllHomework(); // backend-driven via repository
                const list = courseId ? all.filter(h => h.courseId === courseId) : all;

                const todo = list.filter(h => h.status === 'todo').length;
                const inProgress = list.filter(h => h.status === 'in-progress').length;
                const done = list.filter(h => h.status === 'done').length;

                if (!cancelled) setCounts({ todo, inProgress, done, total: list.length });
            } catch {
                if (!cancelled) setError('Failed to load assignment counts');
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [courseId]);

    return { loading, error, ...counts };
}