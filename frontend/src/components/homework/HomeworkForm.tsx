import type React from 'react';
import useFormField from '../../hooks/useFormField';

type HomeworkCreateInput = {
  title: string;
  courseId: string;
  dueDate: string; // yyyy-mm-dd is fine; backend normalizes
};

export default function HomeworkForm({ onAdd }: { onAdd: (input: HomeworkCreateInput) => void }) {
  const title = useFormField('');
  const courseId = useFormField('');
  const dueDate = useFormField('');

  const submit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!title.value.trim() || !courseId.value.trim() || !dueDate.value.trim()) return;

    onAdd({
      title: title.value.trim(),
      courseId: courseId.value.trim(),
      dueDate: dueDate.value.trim(),
    });

    title.reset();
    courseId.reset();
    dueDate.reset();
  };

  return (
    <form className= "hw-form" onSubmit = { submit } >
      <input
        value={ title.value }
  onChange = {(e) => title.onChange(e.target.value)
}
placeholder = "Homework title"
required
  />
  <input
        value={ courseId.value }
onChange = {(e) => courseId.onChange(e.target.value)}
placeholder = "Course code"
required
  />
  <input
        type="date"
value = { dueDate.value }
onChange = {(e) => dueDate.onChange(e.target.value)}
required
  />
  <button type="submit" > Add </button>
    </form>
  );
}