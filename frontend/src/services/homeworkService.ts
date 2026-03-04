// I.3 Chain: Service (business) → homeworkRepository (data)
import { homeworkRepository } from "../repositories/homeworkRepository";
import type { Homework } from "../types/Homework";

export async function fetchAllHomework() {
  return homeworkRepository.list();
}

export function filterSortHomework(
  items: Homework[],
  opts: {
    courseId?: string;
    status?: "all" | "todo" | "in-progress" | "done";
    q?: string;
    sort?: "dueDate" | "createdAt";
  },
) {
  let out = [...items];

  if (opts.courseId) out = out.filter((h) => h.courseId === opts.courseId);
  if (opts.status && opts.status !== "all")
    out = out.filter((h) => h.status === opts.status);

  if (opts.q?.trim()) {
    const qi = opts.q.toLowerCase();
    out = out.filter(
      (h) =>
        h.title.toLowerCase().includes(qi) ||
        (h.description?.toLowerCase().includes(qi) ?? false),
    );
  }

  if (opts.sort === "dueDate")
    out.sort((a, b) => a.dueDate.localeCompare(b.dueDate));
  if (opts.sort === "createdAt")
    out.sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  return out;
}

export async function setStatus(id: string, status: Homework["status"]) {
  return homeworkRepository.update(id, { status });
}

export async function addHomework(input: Omit<Homework, "id" | "createdAt">) {
  return homeworkRepository.create({
    ...input,
    createdAt: new Date().toISOString(),
  });
}

export async function removeHomework(id: string) {
  return homeworkRepository.remove(id);
}