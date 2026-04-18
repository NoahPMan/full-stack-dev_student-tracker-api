import { prisma } from "../db/prisma";

type CreateNoteInput = {
  courseId: string;
  title: string;
  body: string;
  pinned?: boolean;
  userId: string;
};

type UpdateNoteInput = {
  courseId?: string;
  title?: string;
  body?: string;
  pinned?: boolean;
};

export async function getAllNotes(userId: string) {
  return prisma.note.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}

export async function getNoteById(id: string, userId: string) {
  return prisma.note.findUnique({
    where: { id, userId },
  });
}

export async function createNote(input: CreateNoteInput) {
  return prisma.note.create({
    data: {
      courseId: input.courseId,
      title: input.title,
      body: input.body,
      pinned: input.pinned ?? false,
      userId: input.userId,
    },
  });
}

export async function updateNote(id: string, userId: string, input: UpdateNoteInput) {
  const existing = await prisma.note.findUnique({ where: { id, userId } });
  if (!existing) return undefined;

  return prisma.note.update({
    where: { id },
    data: { ...input, updatedAt: new Date() },
  });
}

export async function deleteNote(id: string, userId: string) {
  const existing = await prisma.note.findUnique({ where: { id, userId } });
  if (!existing) return false;

  await prisma.note.delete({ where: { id } });
  return true;
}
