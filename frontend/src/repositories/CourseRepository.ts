import type { Course, CreateCourseDto, UpdateCourseDto } from '../types/Course';
import { coursesTestData } from '../data/coursesTestData';

class CourseRepository {
  private courses: Course[];

  constructor() {
    this.courses = [...coursesTestData];
  }

  async getAll(): Promise<Course[]> {
    return new Promise((resolve) => {
      setTimeout(() => resolve([...this.courses]), 100);
    });
  }

  async getById(id: string): Promise<Course | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const course = this.courses.find(c => c.id === id) || null;
        resolve(course);
      }, 50);
    });
  }

  async create(courseData: CreateCourseDto): Promise<Course> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newCourse: Course = {
          ...courseData,
          id: Date.now().toString()
        };
        this.courses.push(newCourse);
        resolve(newCourse);
      }, 100);
    });
  }


  async update(id: string, updates: UpdateCourseDto): Promise<Course | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = this.courses.findIndex(c => c.id === id);
        if (index === -1) {
          resolve(null);
          return;
        }
        
        this.courses[index] = {
          ...this.courses[index],
          ...updates
        };
        resolve(this.courses[index]);
      }, 100);
    });
  }

  async delete(id: string): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = this.courses.findIndex(c => c.id === id);
        if (index === -1) {
          resolve(false);
          return;
        }
        
        this.courses.splice(index, 1);
        resolve(true);
      }, 100);
    });
  }

  async search(query: string): Promise<Course[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const lowerQuery = query.toLowerCase();
        const results = this.courses.filter(course =>
          course.code.toLowerCase().includes(lowerQuery) ||
          course.name.toLowerCase().includes(lowerQuery)
        );
        resolve(results);
      }, 100);
    });
  }
}

export const courseRepository = new CourseRepository();