import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { useAuth } from "@clerk/clerk-react";

const ACTIVE_COURSE_KEY_BASE = "student-tracker-active-course";

type CourseUIState = {
  selectedCourseId?: string;
  setSelectedCourseId: (id?: string) => void;
};

const CourseContext = createContext<CourseUIState | undefined>(undefined);

export function CourseProvider({ children }: { children: ReactNode }) {
  const { isLoaded, isSignedIn, userId } = useAuth();

  const storageKey = useMemo(() => {
    if (!userId) return `${ACTIVE_COURSE_KEY_BASE}:signed-out`;
    return `${ACTIVE_COURSE_KEY_BASE}:${userId}`;
  }, [userId]);

  const [selectedCourseId, setSelectedCourseId] = useState<string | undefined>(() => {
    try {
      const saved = localStorage.getItem(`${ACTIVE_COURSE_KEY_BASE}:signed-out`);
      return saved && saved.trim().length > 0 ? saved : undefined;
    } catch {
      return undefined;
    }
  });

  // When auth state changes, load the correct selection for that user (or clear on sign-out)
  useEffect(() => {
    if (!isLoaded) return;

    try {
      if (!isSignedIn || !userId) {
        setSelectedCourseId(undefined);
        return;
      }

      const saved = localStorage.getItem(storageKey);
      setSelectedCourseId(saved && saved.trim().length > 0 ? saved : undefined);
    } catch {
      setSelectedCourseId(undefined);
    }
  }, [isLoaded, isSignedIn, userId, storageKey]);

  // Persist selection per-user
  useEffect(() => {
    if (!isLoaded) return;

    try {
      // If signed out, don't persist anything
      if (!isSignedIn || !userId) {
        localStorage.removeItem(`${ACTIVE_COURSE_KEY_BASE}:signed-out`);
        return;
      }

      if (selectedCourseId && selectedCourseId.length > 0) {
        localStorage.setItem(storageKey, selectedCourseId);
      } else {
        localStorage.removeItem(storageKey);
      }
    } catch { }
  }, [isLoaded, isSignedIn, userId, selectedCourseId, storageKey]);

  return (
    <CourseContext.Provider value= {{ selectedCourseId, setSelectedCourseId }
}>
  { children }
  </CourseContext.Provider>
  );
}

export function useCourse() {
  const ctx = useContext(CourseContext);
  if (!ctx) throw new Error("useCourse must be used within a CourseProvider");
  return ctx;
}