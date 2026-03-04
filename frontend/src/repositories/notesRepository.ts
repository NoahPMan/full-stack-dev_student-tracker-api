/**
 * notesRepository (data layer)
 * In memory CRUD repo backed by notesTestData for now
 */
import type { Repository } from "./baseRepository";
import type { Note } from "../types/Note";
import { notesTestData } from "../data/notes.testdata";

let data: Note[] = [...notesTestData];

const delay = <T,>(v: T, ms = 100) => new Promise<T>((r) => setTimeout(() => r(v), ms));

export const notesRepository: Repository<Note> = {
  async list() {
    return delay([...data]);
  },

  async get(id) {
    return delay(data.find((n) => n.id === id));
  },

  async create(input) {
    const now = new Date().toISOString();

    const id =
      input.id ?? `n${((Math.random() * 1e6) | 0).toString().padStart(6, "0")}`;

    const item: Note = {
      ...(input as Note),
      id,
      createdAt: (input as Note).createdAt ?? now,
      updatedAt: (input as Note).updatedAt,
      pinned: (input as Note).pinned ?? false,
      body: (input as Note).body ?? "",
      title: (input as Note).title ?? "",
      courseId: (input as Note).courseId ?? "",
    };

    data = [item, ...data];
    return delay(item);
  },

  async update(id, patch) {
    const i = data.findIndex((n) => n.id === id);
    if (i < 0) return delay(undefined);

    const updated: Note = {
      ...data[i],
      ...patch,
      updatedAt: new Date().toISOString(),
    };

    data[i] = updated;
    return delay(updated);
  },

  async remove(id) {
    const prev = data.length;
    data = data.filter((n) => n.id !== id);
    return delay(data.length < prev);
  },
};