import type { SharedCourseProps } from "../App";
import CourseSelector from "../components/CourseSelector";
import HomeworkList from "../components/homework/HomeworkList";

export default function Assignments({ activeCourse, setActiveCourse }: SharedCourseProps) {
  return (
    <>
      <h2>Assignments</h2>

      <CourseSelector
        activeCourse={activeCourse}
        setActiveCourse={setActiveCourse}
        showQuickButtons={true}
      />

      <hr />

      <HomeworkList />
    </>
  );
}