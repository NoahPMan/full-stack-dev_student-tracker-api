export interface Course {
  id: string;
  code: string;
  name: string;
  credits: number;
  instructor?: string;
  semester?: string;
}