import type { Homework } from '../types/Homework';

export const homeworkTestData: Homework[] = [
  { id: 'h001', courseId: 'c101', title: 'Read Ch.1', description: 'Intro', dueDate: '2026-03-05T23:59:59Z', completed: false, createdAt: '2026-02-10T10:00:00Z' },
  { id: 'h002', courseId: 'c101', title: 'Quiz 1 Prep', dueDate: '2026-03-08T23:59:59Z', completed: false, createdAt: '2026-02-11T09:00:00Z' },
  { id: 'h003', courseId: 'c102', title: 'Lab: Arrays', dueDate: '2026-03-06T23:59:59Z', completed: false, createdAt: '2026-02-12T08:00:00Z' },
  { id: 'h004', courseId: 'c103', title: 'Essay outline', dueDate: '2026-03-09T23:59:59Z', completed: false, createdAt: '2026-02-12T12:00:00Z' },
  { id: 'h005', courseId: 'c101', title: 'Problems 1-10', dueDate: '2026-03-12T23:59:59Z', completed: false, createdAt: '2026-02-13T10:15:00Z' },
  { id: 'h006', courseId: 'c102', title: 'Debug session', dueDate: '2026-03-10T23:59:59Z', completed: true,  createdAt: '2026-02-13T15:00:00Z' },
  { id: 'h007', courseId: 'c103', title: 'Slides draft', dueDate: '2026-03-11T23:59:59Z', completed: false, createdAt: '2026-02-14T10:00:00Z' },
  { id: 'h008', courseId: 'c101', title: 'Project topic', dueDate: '2026-03-07T23:59:59Z', completed: true,  createdAt: '2026-02-14T12:30:00Z' },
  { id: 'h009', courseId: 'c104', title: 'Unit tests',   dueDate: '2026-03-15T23:59:59Z', completed: false, createdAt: '2026-02-15T10:00:00Z' },
  { id: 'h010', courseId: 'c104', title: 'Refactor utils', dueDate: '2026-03-16T23:59:59Z', completed: false, createdAt: '2026-02-15T12:00:00Z' }
];