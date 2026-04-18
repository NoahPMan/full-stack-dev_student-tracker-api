import { useEffect, useMemo, useState } from "react";
import type { Note } from "../types/Note";
import {
  addNote,
  editNote,
  fetchAllNotes,
  filterAndSortNotes,
  removeNote,
  togglePin,
  type NoteCreateInput,
} from "../services/notesService";

export function useNotes(opts?: { courseId?: string }) {
  const [all, setAll] = useState<Note[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);

  const courseId = opts?.courseId;

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setLoading(true);
      setError(undefined);

      try {
        const items = await fetchAllNotes();
        if (!cancelled) setAll(items);
      } catch {
        if (!cancelled) setError("Failed to load notes");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const list = useMemo(() => {
    return filterAndSortNotes(all, { courseId });
  }, [all, courseId]);

  async function refresh() {
    setAll(await fetchAllNotes());
  }

  return {
    loading,
    error,
    list,
    total: all.length,

    async add(input: NoteCreateInput) {
      await addNote(input);
      await refresh();
    },

    async update(id: string, patch: { title?: string; body?: string }) {
      await editNote(id, patch);
      await refresh();
    },

    async remove(id: string) {
      await removeNote(id);
      await refresh();
    },

    async togglePin(id: string) {
      await togglePin(id);
      await refresh();
    },

    refresh,
  };
}

export type UseNotesApi = ReturnType<typeof useNotes>;
