import { useState } from "react";
import type { HomeworkItem } from "./HomeworkList";

export default function HomeworkForm({
  onAdd,
}: {
  onAdd: (item: HomeworkItem) => void;
}) {
  const [title, setTitle] = useState("");
  const [course, setCourse] = useState("");
  const [due, setDue] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !course.trim() || !due.trim()) return;

    onAdd({
      id: crypto.randomUUID(),
      title,
      course,
      due,
      status: "todo",
    });

    setTitle("");
    setCourse("");
    setDue("");
  };

  return (
    <form className="hw-form" onSubmit={submit}>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Homework title"
        required
      />
      <input
        value={course}
        onChange={(e) => setCourse(e.target.value)}
        placeholder="Course code"
        required
      />
      <input
        type="date"
        value={due}
        onChange={(e) => setDue(e.target.value)}
        required
      />

      <button type="submit">Add</button>
    </form>
  );
}