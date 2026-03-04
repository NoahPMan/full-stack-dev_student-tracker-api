import CourseSelector from '../components/CourseSelector';

export default function Home() {
  return (
    <>
    <h2>Welcome to Student Tracker </h2>
      < p > Manage your courses, assignments, and grades all in one place.</p>

        < CourseSelector showQuickButtons = { true} />
          </>
  );
}