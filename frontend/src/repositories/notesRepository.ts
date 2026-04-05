import type { Repository } from "./baseRepository";
import type { Note } from "../types/Note";

const API_URL = "http://localhost:3000/api/notes";

export const notesRepository: Repository<Note> = {
  async list() {
    const res = await fetch(API_URL);
    return res.json();
  },

  async get(id) {
    const res = await fetch(`${API_URL}/${id}`);
    if (!res.ok) return undefined;
    return res.json();
  },

  async create(input) {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(input),
    });

    return res.json();
  },

  async update(id, patch) {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(patch),
    });

    if (!res.ok) return undefined;
    return res.json();
  },

  async remove(id) {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });

    return res.ok;
  },
};