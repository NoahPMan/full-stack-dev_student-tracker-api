import { prisma } from "../db/prisma";

type CreateNoteInput = {
  courseId: string;
  title: string;
  body: string;
  pinned?: boolean;
};

type UpdateNoteInput = {
  courseId?: string;
  title?: string;
  body?: string;
  pinned?: boolean;
};

export async function getAllNotes() {
  return prisma.note.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getNoteById(id: string) {
  return prisma.note.findUnique({
    where: { id },
  });
}

export async function createNote(input: CreateNoteInput) {
  return prisma.note.create({
    data: {
      courseId: input.courseId,
      title: input.title,
      body: input.body,
      pinned: input.pinned ?? false,
    },
  });
}

export async function updateNote(id: string, input: UpdateNoteInput) {
  const existingNote = await prisma.note.findUnique({
    where: { id },
  });

  if (!existingNote) {
    return undefined;
  }

  return prisma.note.update({
    where: { id },
    data: {
      ...input,
      updatedAt: new Date(),
    },
  });
}

export async function deleteNote(id: string) {
  const existingNote = await prisma.note.findUnique({
    where: { id },
  });

  if (!existingNote) {
    return false;
  }

  await prisma.note.delete({
    where: { id },
  });

  return true;
}