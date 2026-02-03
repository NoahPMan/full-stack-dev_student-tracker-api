import type { SharedCourseProps } from "../App";
import CourseSelector from "../components/CourseSelector";

export default function Courses({ activeCourse, setActiveCourse }: SharedCourseProps) {
  return (
    <>
      <h2>Courses</h2>
      <p>Your enrolled courses will appear here.</p>

      <CourseSelector
        activeCourse={activeCourse}
        setActiveCourse={setActiveCourse}
        showQuickButtons={true}
      />
    </>
  );
}