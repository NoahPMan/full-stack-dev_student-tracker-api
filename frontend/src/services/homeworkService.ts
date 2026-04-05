import type { Homework } from '../types/Homework';
import { homeworkRepository } from '../repositories/homeworkRepository';
export type UiStatus = 'all' | 'todo' | 'in-progress' | 'done';
export type SortKey = 'dueDate' | 'createdAt';

export function filterSortHomework(
  items: Homework[],
  opts: {
    courseId?: string;
    status?: UiStatus;
    q?: string;
    sort?: SortKey;
  } = { status: 'all', sort: 'dueDate' }
): Homework[] {
  const { courseId, status = 'all', q = '', sort = 'dueDate' } = opts;

  let arr = [...items];

  if (courseId) arr = arr.filter(h => h.courseId === courseId);
  if (status !== 'all') arr = arr.filter(h => h.status === status);

  const query = q.trim().toLowerCase();
  if (query) {
    arr = arr.filter(h => (h.title ?? '').toLowerCase().includes(query));
  }

  arr.sort((a, b) => {
    const aT = new Date(sort === 'createdAt' ? a.createdAt : a.dueDate).getTime();
    const bT = new Date(sort === 'createdAt' ? b.createdAt : b.dueDate).getTime();
    return aT - bT;
  });

  return arr;
}

type ApiStatus = 'todo' | 'in_progress' | 'done';
const toApiStatus = (s: UiStatus): ApiStatus =>
  s === 'in-progress' ? 'in_progress' : (s as ApiStatus);
const toUiStatus = (s: ApiStatus): UiStatus =>
  s === 'in_progress' ? 'in-progress' : s;

// Load all from API and normalize status to UI shape if needed
export async function fetchAllHomework(): Promise<Homework[]> {
  const rows = await homeworkRepository.list();
  return rows.map(h => ({ ...h, status: toUiStatus(h.status as ApiStatus) })) as Homework[];
}

// Create via API (normalize 'yyyy-mm-dd' to ISO is handled in the repository)
export async function addHomework(input: Omit<Homework, 'id' | 'createdAt'>) {
  const payload: any = { ...input };
  if (payload.status) payload.status = toApiStatus(payload.status);
  return homeworkRepository.create(payload);
}

// Update only the status via API
export async function setStatus(id: string, status: UiStatus) {
  return homeworkRepository.update(id, { status: toApiStatus(status) } as any);
}

// Delete via API
export async function removeHomework(id: string) {
  return homeworkRepository.remove(id);
}