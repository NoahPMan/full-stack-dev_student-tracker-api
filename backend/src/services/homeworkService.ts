import { prisma } from '../db/prisma';

export const list = (userId: string) =>
  prisma.homework.findMany({
    where: { userId },
    orderBy: { dueDate: 'asc' },
  });

export const create = (data: {
  title: string;
  courseId: string;
  dueDate: string;
  status?: 'todo' | 'in_progress' | 'done';
  userId: string;
}) =>
  prisma.homework.create({
    data: { ...data, dueDate: new Date(data.dueDate) },
  });

export const update = (
  id: string,
  userId: string,
  patch: Partial<{ title: string; courseId: string; dueDate: string; status: 'todo' | 'in_progress' | 'done' }>,
) =>
  prisma.homework.update({
    where: { id, userId },
    data: { ...patch, ...(patch.dueDate ? { dueDate: new Date(patch.dueDate) } : {}) },
  });

export const remove = (id: string, userId: string) =>
  prisma.homework.delete({ where: { id, userId } });
