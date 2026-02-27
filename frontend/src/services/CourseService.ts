import type { Course, CreateCourseDto, UpdateCourseDto } from '../types/Course';
import { courseRepository } from '../repositories/CourseRepository';

class CourseService {
  async getAllCourses(): Promise<Course[]> {
    const courses = await courseRepository.getAll();
    
    return courses.sort((a, b) => a.code.localeCompare(b.code));
  }

  async getCourseById(id: string): Promise<Course | null> {
    if (!id || id.trim() === '') {
      throw new Error('Course ID is required');
    }
    
    return await courseRepository.getById(id);
  }


  async createCourse(courseData: CreateCourseDto): Promise<Course> {
    this.validateCourseData(courseData);
    
    const allCourses = await courseRepository.getAll();
    const existingCourse = allCourses.find(
      c => c.code.toLowerCase() === courseData.code.toLowerCase()
    );
    
    if (existingCourse) {
      throw new Error(`Course with code ${courseData.code} already exists`);
    }
    
    return await courseRepository.create(courseData);
  }

  async updateCourse(id: string, updates: UpdateCourseDto): Promise<Course | null> {
    if (!id || id.trim() === '') {
      throw new Error('Course ID is required');
    }
    
    if (updates.code || updates.name || updates.credits !== undefined) {
      this.validateCourseData(updates as CreateCourseDto, true);
    }
    
    return await courseRepository.update(id, updates);
  }


  async deleteCourse(id: string): Promise<boolean> {
    if (!id || id.trim() === '') {
      throw new Error('Course ID is required');
    }
    
    return await courseRepository.delete(id);
  }

  async searchCourses(query: string): Promise<Course[]> {
    if (!query || query.trim() === '') {
      return await this.getAllCourses();
    }
    
    return await courseRepository.search(query);
  }

  async getCoursesBySemester(semester: string): Promise<Course[]> {
    const allCourses = await courseRepository.getAll();
    
    return allCourses.filter(
      course => course.semester?.toLowerCase() === semester.toLowerCase()
    );
  }

  calculateTotalCredits(courses: Course[]): number {
    return courses.reduce((total, course) => total + course.credits, 0);
  }

  private validateCourseData(data: Partial<CreateCourseDto>, isUpdate = false): void {
    if (!isUpdate || data.code !== undefined) {
      if (!data.code || data.code.trim() === '') {
        throw new Error('Course code is required');
      }

      const codePattern = /^[A-Z]+-\d+$/;
      if (!codePattern.test(data.code)) {
        throw new Error('Course code must be in format: DEPT-NUMBER (e.g., COMP-4002)');
      }
    }
    
    if (!isUpdate || data.name !== undefined) {
      if (!data.name || data.name.trim() === '') {
        throw new Error('Course name is required');
      }
      
      if (data.name.length < 3) {
        throw new Error('Course name must be at least 3 characters');
      }
    }
    
    if (!isUpdate || data.credits !== undefined) {
      if (data.credits === undefined || data.credits === null) {
        throw new Error('Credits are required');
      }
      
      if (data.credits < 1 || data.credits > 6) {
        throw new Error('Credits must be between 1 and 6');
      }
    }
  }
}

export const courseService = new CourseService();