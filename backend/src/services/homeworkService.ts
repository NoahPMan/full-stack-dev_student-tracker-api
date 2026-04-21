import { prisma } from '../db/prisma';

export const listPublic = () =>
  prisma.homework.findMany({
    orderBy: { dueDate: 'asc' },
  });

export const listByUser = (userId: string) =>
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
  description?: string;
}) =>
  prisma.homework.create({
    data: {
      ...data,
      dueDate: new Date(data.dueDate),
    },
  });

export const update = async (
  id: string,
  userId: string,
  patch: Partial<{
    title: string;
    courseId: string;
    dueDate: string;
    status: 'todo' | 'in_progress' | 'done';
    description?: string;
  }>,
) => {
  const data = {
    ...patch,
    ...(patch.dueDate ? { dueDate: new Date(patch.dueDate) } : {}),
  };

  const result = await prisma.homework.updateMany({
    where: { id, userId },
    data,
  });

  if (result.count === 0) return undefined;

  return prisma.homework.findUnique({ where: { id } });
};

export const remove = async (id: string, userId: string) => {
  const result = await prisma.homework.deleteMany({
    where: { id, userId },
  });

  return result.count > 0;
};