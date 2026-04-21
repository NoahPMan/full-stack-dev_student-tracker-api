import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import type { Note } from '../types/Note';
import {
  addNote,
  editNote,
  fetchAllNotes,
  filterAndSortNotes,
  removeNote,
  togglePin,
  type NoteCreateInput,
} from '../services/notesService';

export function useNotes(opts?: { courseId?: string }) {
  const { isLoaded, isSignedIn } = useAuth();

  const [all, setAll] = useState<Note[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);

  const courseId = opts?.courseId;

  useEffect(() => {
    let cancelled = false;

    // Signed-in only: don't even attempt API calls until Clerk is ready
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
      setError('Sign in to view notes');
      return () => {
        cancelled = true;
      };
    }

    (async () => {
      setLoading(true);
      setError(undefined);

      try {
        const items = await fetchAllNotes();
        if (!cancelled) setAll(items);
      } catch {
        if (!cancelled) setError('Failed to load notes');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [isLoaded, isSignedIn]);

  const list = useMemo(() => {
    return filterAndSortNotes(all, { courseId });
  }, [all, courseId]);

  async function refresh() {
    if (!isLoaded || !isSignedIn) return;
    setAll(await fetchAllNotes());
  }

  return {
    loading,
    error,
    list,
    total: all.length,

    async add(input: NoteCreateInput) {
      if (!isLoaded || !isSignedIn) return;
      await addNote(input);
      await refresh();
    },

    async update(id: string, patch: { title?: string; body?: string }) {
      if (!isLoaded || !isSignedIn) return;
      await editNote(id, patch);
      await refresh();
    },

    async remove(id: string) {
      if (!isLoaded || !isSignedIn) return;
      await removeNote(id);
      await refresh();
    },

    async togglePin(id: string) {
      if (!isLoaded || !isSignedIn) return;
      await togglePin(id);
      await refresh();
    },

    refresh,
  };
}

export type UseNotesApi = ReturnType<typeof useNotes>;