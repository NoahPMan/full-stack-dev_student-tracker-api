export type HomeworkId = string;

export interface Homework {
  id: HomeworkId;
  courseId: string;
  title: string;
  description?: string;
  dueDate: string; // ISO
  completed: boolean;
  createdAt: string; // ISO
}
