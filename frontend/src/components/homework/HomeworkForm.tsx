import type React from "react";
import useFormField from "../../hooks/useFormField";
import type { HomeworkItem } from "./HomeworkList";

export default function HomeworkForm({ onAdd }: { onAdd: (item: HomeworkItem) => void }) {
  const title = useFormField("");
  const course = useFormField("");
  const due = useFormField("");

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!title.value.trim() || !course.value.trim() || !due.value.trim()) return;

    onAdd({
      id: crypto.randomUUID(),
      title: title.value,
      course: course.value,
      due: due.value,
      status: "todo",
    });

    title.reset();
    course.reset();
    due.reset();
  };

  return (
    <form className="hw-form" onSubmit={submit}>
      <input
        value={title.value}
        onChange={(e) => title.onChange(e.target.value)}
        placeholder="Homework title"
        required
      />
      <input
        value={course.value}
        onChange={(e) => course.onChange(e.target.value)}
        placeholder="Course code"
        required
      />
      <input
        type="date"
        value={due.value}
        onChange={(e) => due.onChange(e.target.value)}
        required
      />
      <button type="submit">Add</button>
    </form>
  );
}