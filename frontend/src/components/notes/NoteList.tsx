import { useState } from 'react';
import './NoteList.css';
import type { Note } from '../../types/Note';

type NotePatch = { title?: string; body?: string };

type Props = {
  notes: Note[];
  onRemove: (id: string) => void;
  onTogglePin: (id: string) => void;
  onUpdate: (id: string, patch: NotePatch) => void;
};

export default function NoteList({ notes, onRemove, onTogglePin, onUpdate }: Props) {
  if (!notes.length) {
    return (
      <div className="notes-empty">
        <div className="notes-empty__icon" aria-hidden>🗒️</div>
        <p className="notes-empty__title">No notes yet</p>
        <p className="notes-empty__hint">Add a note above to get started.</p>
      </div>
    );
  }

  const pinned = notes.filter(n => !!n.pinned);
  const others = notes.filter(n => !n.pinned);

  return (
    <section className="notes-section">
      {!!pinned.length && (
        <>
          <h3 className="notes-section__heading">Pinned</h3>
          <ul className="notes-grid" role="list">
            {pinned.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                onRemove={onRemove}
                onTogglePin={onTogglePin}
                onUpdate={onUpdate}
              />
            ))}
          </ul>
        </>
      )}

      {!!others.length && (
        <>
          {!!pinned.length && <h3 className="notes-section__heading">Others</h3>}
          <ul className="notes-grid" role="list">
            {others.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                onRemove={onRemove}
                onTogglePin={onTogglePin}
                onUpdate={onUpdate}
              />
            ))}
          </ul>
        </>
      )}
    </section>
  );
}

type NoteCardProps = {
  note: Note;
  onRemove: (id: string) => void;
  onTogglePin: (id: string) => void;
  onUpdate: (id: string, patch: NotePatch) => void;
};

function NoteCard({ note, onRemove, onTogglePin, onUpdate }: NoteCardProps) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(note.title);
  const [body, setBody] = useState(note.body);

  function handleSave() {
    const t = title.trim();
    const b = body.trim();
    if (!t || !b) return;
    onUpdate(note.id, { title: t, body: b });
    setEditing(false);
  }

  function handleCancel() {
    setTitle(note.title);
    setBody(note.body);
    setEditing(false);
  }

  if (editing) {
    return (
      <li className="note-card">
        <div className="note-card__edit">
          <input
            className="note-card__edit-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            aria-label="Note title"
          />
          <textarea
            className="note-card__edit-body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            aria-label="Note content"
          />
          <div className="note-card__edit-actions">
            <button type="button" onClick={handleSave}>Save</button>
            <button type="button" className="secondary" onClick={handleCancel}>Cancel</button>
          </div>
        </div>
      </li>
    );
  }

  return (
    <li className="note-card">
      <CardHeader
        note={note}
        onRemove={onRemove}
        onTogglePin={onTogglePin}
        onEdit={() => setEditing(true)}
      />
      <CardBody note={note} />
      <CardFooter note={note} />
    </li>
  );
}

function CardHeader({
  note,
  onRemove,
  onTogglePin,
  onEdit,
}: {
  note: Note;
  onRemove: (id: string) => void;
  onTogglePin: (id: string) => void;
  onEdit: () => void;
}) {
  return (
    <header className="note-card__header">
      <button
        type="button"
        className={`icon-btn pin ${note.pinned ? 'is-active' : ''}`}
        aria-pressed={!!note.pinned}
        aria-label={note.pinned ? 'Unpin note' : 'Pin note'}
        title={note.pinned ? 'Unpin' : 'Pin'}
        onClick={() => onTogglePin(note.id)}
      >
        <svg viewBox="0 0 24 24" className="icon" aria-hidden>
          <path d="M14 2l8 8-2 2-4-4-2 2 4 4-2 2-4-4-6 6-2-2 6-6-4-4 2-2 4 4 2-2-4-4 2-2z" />
        </svg>
      </button>

      <h4 className="note-card__title" title={note.title || 'Untitled'}>
        {note.title || 'Untitled'}
      </h4>

      <button
        type="button"
        className="icon-btn"
        aria-label="Edit note"
        title="Edit"
        onClick={onEdit}
      >
        {/* pencil icon */}
        <svg viewBox="0 0 24 24" className="icon" aria-hidden>
          <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
        </svg>
      </button>

      <button
        type="button"
        className="icon-btn danger"
        aria-label="Remove note"
        title="Remove"
        onClick={() => onRemove(note.id)}
      >
        {/* trash icon */}
        <svg viewBox="0 0 24 24" className="icon" aria-hidden>
          <path d="M9 3h6l1 2h5v2H3V5h5l1-2zm1 6h2v9h-2V9zm4 0h2v9h-2V9z" />
        </svg>
      </button>
    </header>
  );
}

function CardBody({ note }: { note: Note }) {
  if (!note.body) return null;
  return <p className="note-card__body">{note.body}</p>;
}

function CardFooter({ note }: { note: Note }) {
  const dt = new Date(note.createdAt);
  return (
    <footer className="note-card__footer">
      <time dateTime={note.createdAt} title={dt.toLocaleString()}>
        {dt.toLocaleDateString()}
      </time>
    </footer>
  );
}
