export interface Course {
  id: string;
  code: string;
  name: string;
  credits: number;
  instructor?: string;
  semester?: string;
  description?: string;
}

export type CreateCourseDto = Omit<Course, 'id'>;
export type UpdateCourseDto = Partial<CreateCourseDto>;