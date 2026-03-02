import './NoteList.css';
import type { Note } from '../../types/Note';

type Props = {
  notes: Note[];
  onRemove: (id: string) => void;
  onTogglePin: (id: string) => void;
};

export default function NoteList({ notes, onRemove, onTogglePin }: Props) {
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
              <li key={note.id} className="note-card">
                <CardHeader note={note} onRemove={onRemove} onTogglePin={onTogglePin} />
                <CardBody note={note} />
                <CardFooter note={note} />
              </li>
            ))}
          </ul>
        </>
      )}

      {!!others.length && (
        <>
          {!!pinned.length && <h3 className="notes-section__heading">Others</h3>}
          <ul className="notes-grid" role="list">
            {others.map((note) => (
              <li key={note.id} className="note-card">
                <CardHeader note={note} onRemove={onRemove} onTogglePin={onTogglePin} />
                <CardBody note={note} />
                <CardFooter note={note} />
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}

function CardHeader({
  note,
  onRemove,
  onTogglePin,
}: {
  note: Note;
  onRemove: (id: string) => void;
  onTogglePin: (id: string) => void;
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
        {/* pushpin icon */}
        <svg viewBox="0 0 24 24" className="icon" aria-hidden>
          <path d="M14 2l8 8-2 2-4-4-2 2 4 4-2 2-4-4-6 6-2-2 6-6-4-4 2-2 4 4 2-2-4-4 2-2z" />
        </svg>
      </button>

      <h4 className="note-card__title" title={note.title || 'Untitled'}>
        {note.title || 'Untitled'}
      </h4>

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