export interface Homework {
    id: string;
    courseId: string;
    title: string;
    description?: string;
    dueDate: string;
    status: 'todo' | 'in-progress' | 'done';
    createdAt: string;
}