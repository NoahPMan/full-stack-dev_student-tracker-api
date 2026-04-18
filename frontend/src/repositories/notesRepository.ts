import type { Repository } from "./baseRepository";
import type { Note } from "../types/Note";

const API = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
const BASE = `${API}/api/v1/notes`;

async function http<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
  const res = await fetch(input, init);
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(
      `HTTP ${res.status} ${res.statusText}${text ? ` — ${text}` : ""}`,
    );
  }
  if (res.status === 204) return undefined as unknown as T;
  return (await res.json()) as T;
}

export const notesRepository: Repository<Note> = {
  async list() {
    return http<Note[]>(BASE);
  },

  async get(id) {
    return http<Note>(`${BASE}/${id}`).catch(() => undefined);
  },

  async create(input) {
    return http<Note>(BASE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
  },

  async update(id, patch) {
    try {
      return await http<Note>(`${BASE}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
    } catch (err: any) {
      if (String(err?.message || "").startsWith("HTTP 404")) return undefined;
      throw err;
    }
  },

  async remove(id) {
    try {
      await http<void>(`${BASE}/${id}`, { method: "DELETE" });
      return true;
    } catch (err: any) {
      if (String(err?.message || "").startsWith("HTTP 404")) return false;
      throw err;
    }
  },
};
