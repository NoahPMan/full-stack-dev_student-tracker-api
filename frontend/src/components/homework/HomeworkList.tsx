import { useMemo, useState } from 'react';
import useFormField from '../../hooks/useFormField';
import { useHomework } from '../../hooks/useHomework';
import './HomeworkList.css';

type HomeworkStatus = 'todo' | 'in-progress' | 'done';

function StatusBadge({ status }: { status: HomeworkStatus }) {
  return <span className={`badge badge--${status}`}>{status.replace('-', ' ')}</span>;
}

function HomeworkCard({
  item,
  isExpanded,
  onToggleExpand,
  onSetStatus,
  onRemove,
}: {
  item: {
    id: string;
    title: string;
    courseId: string;
    dueDate: string;
    status: HomeworkStatus;
    url?: string;
  };
  isExpanded: boolean;
  onToggleExpand: (id: string) => void;
  onSetStatus: (id: string, next: HomeworkStatus) => void;
  onRemove: (id: string) => void;
}) {
  const fmt = (isoOrYmd: string) => {
    // supports "YYYY-MM-DD" or ISO
    const d = isoOrYmd.length === 10 ? new Date(`${isoOrYmd}T00:00:00.000Z`) : new Date(isoOrYmd);
    return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const statusActionLabel =
    item.status === 'todo'
      ? 'Start (In progress)'
      : item.status === 'in-progress'
      ? 'Mark Done'
      : 'Reopen (To do)';

  const nextStatus: HomeworkStatus =
    item.status === 'todo' ? 'in-progress' : item.status === 'in-progress' ? 'done' : 'todo';

  return (
    <article className="homework-card">
      <div className="homework-card__top">
        <h3 className="homework-card__title">
          {item.url ? (
            <a href={item.url} className="homework-card__link">
              {item.title}
            </a>
          ) : (
            item.title
          )}
        </h3>

        <div className="homework-card__actions">
          <button
            type="button"
            className="btn btn--secondary"
            onClick={() => onSetStatus(item.id, nextStatus)}
          >
            {statusActionLabel}
          </button>

          <button
            type="button"
            className="btn btn--ghost"
            onClick={() => onToggleExpand(item.id)}
          >
            {isExpanded ? 'Hide details' : 'Show details'}
          </button>

          <button
            type="button"
            className="btn btn--danger"
            onClick={() => onRemove(item.id)}
          >
            Remove
          </button>
        </div>
      </div>

      <div className="homework-card__meta-row">
        <StatusBadge status={item.status} />
        <dl className="homework-meta">
          <div className="homework-meta__row">
            <dt>Course</dt>
            <dd>{item.courseId}</dd>
          </div>
          <div className="homework-meta__row">
            <dt>Due</dt>
            <dd>
              <time dateTime={item.dueDate}>{fmt(item.dueDate)}</time>
            </dd>
          </div>
        </dl>
      </div>

      {isExpanded && (
        <div className="homework-card__details">
          <p className="hw-note">Break this task into smaller steps for better workflow.</p>
        </div>
      )}
    </article>
  );
}

function HomeworkForm({ onAdd }: { onAdd: (input: { title: string; courseId: string; dueDate: string }) => void }) {
  const title = useFormField('');
  const courseId = useFormField('');
  const dueDate = useFormField('');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.value.trim() || !courseId.value.trim() || !dueDate.value.trim()) return;

    onAdd({
      title: title.value.trim(),
      courseId: courseId.value.trim(),
      dueDate: dueDate.value.trim(), // "yyyy-mm-dd" is fine; backend normalizes
    });

    title.reset();
    courseId.reset();
    dueDate.reset();
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
        value={courseId.value}
        onChange={(e) => courseId.onChange(e.target.value)}
        placeholder="Course code"
        required
      />
      <input
        type="date"
        value={dueDate.value}
        onChange={(e) => dueDate.onChange(e.target.value)}
        required
      />
      <button type="submit">Add</button>
    </form>
  );
}

export default function HomeworkList({ heading = 'Assignments' }: { heading?: string }) {
  const hw = useHomework(); // uses backend repo inside your hook/service
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | HomeworkStatus>('all');

  const filteredSorted = useMemo(() => {
    const out = hw.list.filter((it) => (statusFilter === 'all' ? true : it.status === statusFilter));
    // sort by due date ascending
    return [...out].sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  }, [hw.list, statusFilter]);

  async function onAdd(input: { title: string; courseId: string; dueDate: string }) {
    await hw.add(input as any);
  }

  async function onSetStatus(id: string, next: HomeworkStatus) {
    if (next === 'todo') await hw.toTodo(id);
    else if (next === 'in-progress') await hw.toInProgress(id);
    else await hw.toDone(id);
  }

  async function onRemove(id: string) {
    await hw.remove(id);
  }

  return (
    <section className="homework-list">
      <header className="homework-list__header">
        <h2>{heading}</h2>
        <p className="homework-list__summary">
          {filteredSorted.length} {filteredSorted.length === 1 ? 'item' : 'items'}
        </p>
      </header>

      {hw.loading && <p>Loading assignments...</p>}
      {hw.error && <p style={{ color: 'red' }}>{hw.error}</p>}

      <HomeworkForm onAdd={onAdd} />

      <div className="homework-list__toolbar">
        {(['all', 'todo', 'in-progress', 'done'] as const).map((opt) => (
          <button
            key={opt}
            type="button"
            className={`chip ${statusFilter === opt ? 'chip--active' : ''}`}
            onClick={() => setStatusFilter(opt)}
            aria-pressed={statusFilter === opt}
          >
            {opt === 'all' ? 'All' : opt.replace('-', ' ')}
          </button>
        ))}
      </div>

      <ol className="homework-list__items">
        {filteredSorted.map((hwItem) => (
          <li key={hwItem.id} className="homework-list__item">
            <HomeworkCard
              item={hwItem as any}
              isExpanded={expandedId === hwItem.id}
              onToggleExpand={(id) => setExpandedId((prev) => (prev === id ? null : id))}
              onSetStatus={onSetStatus}
              onRemove={onRemove}
            />
          </li>
        ))}
      </ol>
    </section>
  );
}
