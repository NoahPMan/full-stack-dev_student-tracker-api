import type { Note } from '../types/Note';

export const notesTestData: Note[] = [
  { id: 'n001', courseId: 'c101', title: 'Week 1 recap', body: 'Intro, syllabus, tooling', createdAt: '2026-02-10T10:00:00Z' },
  { id: 'n002', courseId: 'c101', title: 'JS closures', body: 'Examples and pitfalls', createdAt: '2026-02-10T11:00:00Z', pinned: true },
  { id: 'n003', courseId: 'c102', title: 'Array methods', body: 'map/filter/reduce', createdAt: '2026-02-11T08:00:00Z' },
  { id: 'n004', courseId: 'c103', title: 'Thesis ideas', body: 'Compare patterns', createdAt: '2026-02-12T09:00:00Z' },
  { id: 'n005', courseId: 'c101', title: 'Type basics', body: 'interfaces vs types', createdAt: '2026-02-12T12:00:00Z' },
  { id: 'n006', courseId: 'c104', title: 'Routing', body: 'Routes, Links, Outlet', createdAt: '2026-02-13T10:00:00Z' },
  { id: 'n007', courseId: 'c104', title: 'Hooks', body: 'Rules, custom hooks', createdAt: '2026-02-13T12:00:00Z' },
  { id: 'n008', courseId: 'c102', title: 'Testing', body: 'Arrange/Act/Assert', createdAt: '2026-02-14T10:00:00Z' },
  { id: 'n009', courseId: 'c103', title: 'Accessibility', body: 'Landmarks & ARIA', createdAt: '2026-02-15T09:00:00Z' },
  { id: 'n010', courseId: 'c101', title: 'State vs Props', body: 'When to lift', createdAt: '2026-02-15T11:00:00Z' }
];