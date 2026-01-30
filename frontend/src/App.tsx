import { Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Courses from "./pages/Courses";
import Assignments from "./pages/Assignments";
import Notes from "./pages/Notes";
import "./App.css";

export type SharedCourseProps = {
  activeCourse: string;
  setActiveCourse: (value: string) => void;
};

const ACTIVE_COURSE_KEY = "student-tracker-active-course";

export default function App() {
  const [activeCourse, setActiveCourse] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(ACTIVE_COURSE_KEY);
      return saved && saved.trim().length > 0 ? saved : "None";
    } catch {
      return "None";
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(ACTIVE_COURSE_KEY, activeCourse);
    } catch {
      // ignore write errors (quota, privacy mode)
    }
  }, [activeCourse]);

  return (
    <Layout>
      <Routes>
        <Route
          path="/"
          element={<Home activeCourse={activeCourse} setActiveCourse={setActiveCourse} />}
        />
        <Route
          path="/courses"
          element={<Courses activeCourse={activeCourse} setActiveCourse={setActiveCourse} />}
        />
        <Route
          path="/assignments"
          element={<Assignments activeCourse={activeCourse} setActiveCourse={setActiveCourse} />}
        />
        <Route
          path="/notes"
          element={<Notes activeCourse={activeCourse} setActiveCourse={setActiveCourse} />}
        />
      </Routes>
    </Layout>
  );
}