import { useState, useEffect, useCallback } from 'react';
import type { Course, CreateCourseDto, UpdateCourseDto } from '../types/Course';
import { courseService } from '../services/CourseService';

export const useCourses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadCourses = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await courseService.getAllCourses();
      setCourses(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load courses');
      console.error('Error loading courses:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Load courses on mount
   */
  useEffect(() => {
    loadCourses();
  }, [loadCourses]);

  /**
   * Create a new course
   */
  const createCourse = useCallback(async (courseData: CreateCourseDto): Promise<Course | null> => {
    try {
      setError(null);
      
      const newCourse = await courseService.createCourse(courseData);
      
      // Presentation logic: Update UI immediately
      setCourses(prev => [...prev, newCourse].sort((a, b) => a.code.localeCompare(b.code)));
      
      return newCourse;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create course');
      console.error('Error creating course:', err);
      return null;
    }
  }, []);

  /**
   * Update an existing course
   */
  const updateCourse = useCallback(async (id: string, updates: UpdateCourseDto): Promise<Course | null> => {
    try {
      setError(null);
      
      const updatedCourse = await courseService.updateCourse(id, updates);
      
      if (updatedCourse) {
        // Presentation logic: Update UI immediately
        setCourses(prev =>
          prev.map(course => course.id === id ? updatedCourse : course)
        );
      }
      
      return updatedCourse;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update course');
      console.error('Error updating course:', err);
      return null;
    }
  }, []);

  /**
   * Delete a course
   */
  const deleteCourse = useCallback(async (id: string): Promise<boolean> => {
    try {
      setError(null);
      
      const success = await courseService.deleteCourse(id);
      
      if (success) {
        // Presentation logic: Update UI immediately
        setCourses(prev => prev.filter(course => course.id !== id));
      }
      
      return success;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete course');
      console.error('Error deleting course:', err);
      return false;
    }
  }, []);

  /**
   * Search courses
   */
  const searchCourses = useCallback(async (query: string): Promise<Course[]> => {
    try {
      setError(null);
      setLoading(true);
      
      const results = await courseService.searchCourses(query);
      setCourses(results);
      
      return results;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search courses');
      console.error('Error searching courses:', err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Refresh courses (reload from service)
   */
  const refreshCourses = useCallback(async () => {
    await loadCourses();
  }, [loadCourses]);

  return {
    courses,
    loading,
    error,
    createCourse,
    updateCourse,
    deleteCourse,
    searchCourses,
    refreshCourses
  };
};