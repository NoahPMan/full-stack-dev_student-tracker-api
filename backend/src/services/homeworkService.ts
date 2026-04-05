import { prisma } from '../db/prisma';

export const list = () =>
  prisma.homework.findMany({ orderBy: { dueDate: 'asc' } });

export const create = (data: {
  title: string; courseId: string; dueDate: string; status?: 'todo'|'in_progress'|'done'
}) =>
  prisma.homework.create({
    data: { ...data, dueDate: new Date(data.dueDate) }
  });

export const update = (id: string, patch: Partial<{
  title: string; courseId: string; dueDate: string; status: 'todo'|'in_progress'|'done'
}>) =>
  prisma.homework.update({
    where: { id },
    data: { ...patch, ...(patch.dueDate ? { dueDate: new Date(patch.dueDate) } : {}) }
  });

export const remove = (id: string) =>
  prisma.homework.delete({ where: { id } });