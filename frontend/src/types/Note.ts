export type NoteId = string;

export interface Note {
  id: NoteId;
  courseId: string;
  title: string;
  body: string;
  createdAt: string; // ISO
  updatedAt?: string; // ISO
  pinned?: boolean;
}