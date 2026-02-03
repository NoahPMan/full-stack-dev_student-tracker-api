import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { Course } from '../types/Course';

interface CourseContextType {
  courses: Course[];
  addCourse: (course: Omit<Course, 'id'>) => void;
  deleteCourse: (id: string) => void;
  updateCourse: (id: string, updates: Partial<Course>) => void;
}

const CourseContext = createContext<CourseContextType | undefined>(undefined);

export const useCourses = () => {
  const context = useContext(CourseContext);
  if (!context) {
    throw new Error('useCourses must be used within CourseProvider');
  }
  return context;
};

interface CourseProviderProps {
  children: ReactNode;
}

export const CourseProvider: React.FC<CourseProviderProps> = ({ children }) => {
  const [courses, setCourses] = useState<Course[]>([]);

  const addCourse = (courseData: Omit<Course, 'id'>) => {
    const newCourse: Course = {
      ...courseData,
      id: Date.now().toString()
    };
    setCourses(prev => [...prev, newCourse]);
  };

  const deleteCourse = (id: string) => {
    setCourses(prev => prev.filter(course => course.id !== id));
  };

  const updateCourse = (id: string, updates: Partial<Course>) => {
    setCourses(prev =>
      prev.map(course =>
        course.id === id ? { ...course, ...updates } : course
      )
    );
  };

  return (
    <CourseContext.Provider value={{ courses, addCourse, deleteCourse, updateCourse }}>
      {children}
    </CourseContext.Provider>
  );
};