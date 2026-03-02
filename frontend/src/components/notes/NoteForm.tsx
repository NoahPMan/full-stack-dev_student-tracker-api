import { useState } from "react";
import useFormField from "../../hooks/useFormField";

export type Note = {
  id: string;
  text: string;
  pinned?: boolean;
};

/**
 * Form component for creating notes.
 * Uses the reusable useFormField hook for input state.
 */
export default function NoteForm({ onAdd }: { onAdd: (note: Note) => void }) {
  const text = useFormField("");
  const [error, setError] = useState("");

  // Handles note submission and basic validation
  const submit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!text.value.trim()) {
      setError("Please enter a note before adding.");
      return;
    }

    onAdd({
      id: crypto.randomUUID(),
      text: text.value.trim(),
      pinned: false,
    });

    text.reset();
    setError("");
  };

  // Clears error once user starts typing valid input
  const handleChange = (value: string) => {
    text.onChange(value);

    if (value.trim()) {
      setError("");
    }
  };

  return (
    <form onSubmit={submit}>
      <input
        value={text.value}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="Enter note"
      />
      <button type="submit">Add</button>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
}