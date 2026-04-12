import { useState } from "react";
import type { FormEvent } from "react";
import { useCourse } from "../../context/CourseContext";
import type { Note } from "../../types/Note";

type Props = { onAdd: (note: Note) => void };

export default function NoteForm({ onAdd }: Props) {
  const [text, setText] = useState("");
  const { selectedCourseId } = useCourse();

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const t = text.trim();
    if (!t) return;

    if (!selectedCourseId) {
      alert("Select a course (top of page) before adding a note.");
      return;
    }

    const note: Note = {
      id: crypto.randomUUID(),
      courseId: selectedCourseId,
      title: t,
      body: t,
      pinned: false,
      createdAt: new Date().toISOString(),
    };

    onAdd(note);
    setText("");
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", gap: 8 }}>
      <input
        placeholder="Enter note"
        value={text}
        onChange={(e) => setText(e.target.value)}
        required
      />
      <button type="submit">Add</button>
    </form>
  );
}