import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';

const ACTIVE_COURSE_KEY = 'student-tracker-active-course';

type CourseUIState = {
  selectedCourseId?: string;
  setSelectedCourseId: (id?: string) => void;
};

const CourseContext = createContext<CourseUIState | undefined>(undefined);

export function CourseProvider({ children }: { children: ReactNode }) {
  const [selectedCourseId, setSelectedCourseId] = useState<string | undefined>(() => {
    try {
      const saved = localStorage.getItem(ACTIVE_COURSE_KEY);
      return saved && saved.trim().length > 0 ? saved : undefined;
    } catch {
      return undefined;
    }
  });

  useEffect(() => {
    try {
      if (selectedCourseId && selectedCourseId.length > 0) {
        localStorage.setItem(ACTIVE_COURSE_KEY, selectedCourseId);
      } else {
        localStorage.removeItem(ACTIVE_COURSE_KEY);
      }
    } catch { }
  }, [selectedCourseId]);

  return (
    <CourseContext.Provider value= {{ selectedCourseId, setSelectedCourseId }
}>
  { children }
  </CourseContext.Provider>
  );
}

export function useCourse() {
  const ctx = useContext(CourseContext);
  if (!ctx) throw new Error('useCourse must be used within a CourseProvider');
  return ctx;
}