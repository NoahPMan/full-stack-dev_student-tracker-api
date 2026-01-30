import { Routes, Route } from "react-router-dom";
import { useState } from "react";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Courses from "./pages/Courses";
import Assignments from "./pages/Assignments";
import "./App.css";

export type SharedCourseProps = {
  activeCourse: string;
  setActiveCourse: (value: string) => void;
};

export default function App() {
  const [activeCourse, setActiveCourse] = useState<string>("None");

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
      </Routes>
    </Layout>
  );
}