// src/pages/Assignments.tsx
import CourseSelector from '../components/CourseSelector';
import HomeworkList from '../components/homework/HomeworkList';

export default function Assignments() {
  return (
    <>
    <h2>Assignments </h2>
    < CourseSelector showQuickButtons = { true} />
      <hr />
      < HomeworkList />
      </>
  );
}