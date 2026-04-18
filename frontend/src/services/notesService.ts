import type { Note } from "../types/Note";
import { notesRepository } from "../repositories/notesRepository";

export type NoteCreateInput = {
  courseId: string;
  title: string;
  body: string;
  pinned?: boolean;
};

export async function fetchAllNotes() {
  return notesRepository.list();
}

export function filterAndSortNotes(
  items: Note[],
  opts: {
    courseId?: string;
  },
) {
  let out = [...items];

  if (opts.courseId) {
    out = out.filter((n) => n.courseId === opts.courseId);
  }

  // Pinned first, then newest first
  out.sort((a, b) => {
    const ap = a.pinned ? 1 : 0;
    const bp = b.pinned ? 1 : 0;
    if (ap !== bp) return bp - ap;
    return b.createdAt.localeCompare(a.createdAt);
  });

  return out;
}

export async function addNote(input: NoteCreateInput) {
  return notesRepository.create(input as Omit<Note, "id">);
}

export async function removeNote(id: string) {
  return notesRepository.remove(id);
}

export async function editNote(
  id: string,
  patch: { title?: string; body?: string },
) {
  return notesRepository.update(id, patch);
}

export async function togglePin(id: string) {
  const current = await notesRepository.get(id);
  if (!current) return undefined;
  return notesRepository.update(id, { pinned: !current.pinned });
}
