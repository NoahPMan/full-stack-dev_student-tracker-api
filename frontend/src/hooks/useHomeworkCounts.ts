import { useEffect, useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { fetchAllHomework } from '../services/homeworkService';

type Counts = { todo: number; inProgress: number; done: number; total: number };

export function useHomeworkCounts(courseId?: string) {
    const { isLoaded, isSignedIn } = useAuth();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | undefined>(undefined);
    const [counts, setCounts] = useState<Counts>({ todo: 0, inProgress: 0, done: 0, total: 0 });

    useEffect(() => {
        let cancelled = false;

        // Signed-in only: don't fetch until Clerk is ready
        if (!isLoaded) {
            setLoading(true);
            setError(undefined);
            return () => {
                cancelled = true;
            };
        }

        // If the user is signed out, clear counts and stop
        if (!isSignedIn) {
            setLoading(false);
            setError('Sign in to view assignment counts');
            setCounts({ todo: 0, inProgress: 0, done: 0, total: 0 });
            return () => {
                cancelled = true;
            };
        }

        (async () => {
            setLoading(true);
            setError(undefined);

            try {
                const all = await fetchAllHomework(); // uses repository/authFetch under the hood
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
    }, [courseId, isLoaded, isSignedIn]);

    return { loading, error, ...counts };
}