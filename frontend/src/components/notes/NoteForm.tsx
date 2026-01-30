import { useState } from "react";

export type Note = {
  id: string;
  text: string;
};

export default function NoteForm({
  onAdd,
}: {
  onAdd: (note: Note) => void;
}) {
  const [text, setText] = useState("");
  const [error, setError] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!text.trim()) {
      setError("Please enter a note before adding.");
      return;
    }

    onAdd({
      id: crypto.randomUUID(),
      text: text.trim(),
    });

    setText("");
    setError("");
  };

  const onChange = (value: string) => {
    setText(value);

    if (value.trim()) {
      setError("");
    }
  };

  return (
    <form onSubmit={submit}>
      <input
        value={text}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Enter note"
      />
      <button type="submit">Add</button>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
}