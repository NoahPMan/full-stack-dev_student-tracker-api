import { useAuth } from "@clerk/clerk-react";
import { useEffect, useMemo } from "react";
import CourseSelector from "../components/CourseSelector";
import HomeworkList from "../components/homework/HomeworkList";
import { useCourse } from "../context/CourseContext";
import { useHomework } from "../hooks/useHomework";
import "./Assignments.css";

export default function Assignments() {
  const { selectedCourseId } = useCourse();
  const { isLoaded, isSignedIn } = useAuth();

  // single source of truth for list + counts + status updates
  const hw = useHomework();

  // keep list filtered to the selected course (hook supports this)
  useEffect(() => {
    hw.setCourseId(selectedCourseId);
  }, [selectedCourseId]); // eslint-disable-line react-hooks/exhaustive-deps

  const counts = useMemo(() => {
    const list = hw.list;
    const todo = list.filter((h: any) => h.status === "todo").length;
    const inProgress = list.filter((h: any) => h.status === "in-progress").length;
    const done = list.filter((h: any) => h.status === "done").length;
    return { total: list.length, todo, inProgress, done };
  }, [hw.list]);

  if (!isLoaded) return <p>Loading...</p>;
  if (!isSignedIn) return <p>Sign in to view assignments.</p>;

  return (
    <section className="panel assignments-page">
      <header className="page-header">
        <div>
          <h2 className="page-title">Assignments</h2>
          <p className="page-subtitle">Track work by course and status.</p>
        </div>

        <div className="summary-row" aria-live="polite">
          <span className="summary-chip">
            Total <strong>{counts.total}</strong>
          </span>
          <span className="summary-chip">
            Todo <strong>{counts.todo}</strong>
          </span>
          <span className="summary-chip">
            In progress <strong>{counts.inProgress}</strong>
          </span>
          <span className="summary-chip">
            Done <strong>{counts.done}</strong>
          </span>
        </div>
      </header>

      <CourseSelector showQuickButtons={true} />

      <div className="divider" />

      {/* pass shared homework state + selected course */}
      <HomeworkList hw={hw} activeCourseId={selectedCourseId} />
    </section>
  );
}