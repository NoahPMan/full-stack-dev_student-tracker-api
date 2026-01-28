import { useState, useMemo, useEffect } from "react";
import "./HomeworkList.css";

export type HomeworkStatus = "todo" | "in-progress" | "done";

export type HomeworkItem = {
  id: string;
  title: string;
  course: string;
  due: string;
  status: HomeworkStatus;
  estMins?: number;
  url?: string;
};

const STORAGE_KEY = "homeworkItems";

function safeParse<T>(raw: string | null): T | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function HomeworkForm({ onAdd }: { onAdd: (item: HomeworkItem) => void }) {
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
      status: "todo"
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

function StatusBadge({ status }: { status: HomeworkStatus }) {
  return <span className={`badge badge--${status}`}>{status.replace("-", " ")}</span>;
}

function HomeworkCard({
  item,
  isExpanded,
  onToggleExpand,
  onCycleStatus,
  onRemove
}: {
  item: HomeworkItem;
  isExpanded: boolean;
  onToggleExpand: (id: string) => void;
  onCycleStatus: (id: string) => void;
  onRemove: (id: string) => void;
}) {
  const fmt = (ymd: string) => {
    const [y, m, d] = ymd.split("-").map(Number);
    const local = new Date(y, (m ?? 1) - 1, d ?? 1);
    return local.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };

  const statusActionLabel =
    item.status === "todo"
      ? "Start (In progress)"
      : item.status === "in-progress"
      ? "Mark Done"
      : "Reopen (To do)";

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
            onClick={() => onCycleStatus(item.id)}
          >
            {statusActionLabel}
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
            <dd>{item.course}</dd>
          </div>
          <div className="homework-meta__row">
            <dt>Due</dt>
            <dd>
              <time dateTime={item.due}>{fmt(item.due)}</time>
            </dd>
          </div>
          {typeof item.estMins === "number" && (
            <div className="homework-meta__row">
              <dt>Estimate</dt>
              <dd>{item.estMins} mins</dd>
            </div>
          )}
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

export default function HomeworkList({
  heading = "Assignments",
  items
}: {
  heading?: string;
  items?: HomeworkItem[];
}) {
  const demoItems: HomeworkItem[] = [
    {
      id: "a1",
      title: "Read Module 1 notes",
      course: "COMP-4002",
      due: "2026-01-28",
      status: "in-progress",
      estMins: 45
    },
    {
      id: "a2",
      title: "Build HomeworkList component",
      course: "COMP-4002",
      due: "2026-01-30",
      status: "todo",
      estMins: 60
    },
    {
      id: "a3",
      title: "Run Axe DevTools on App",
      course: "COMP-4002",
      due: "2026-02-01",
      status: "todo",
      estMins: 20
    }
  ];

  // 1) Initialize from localStorage on first render (preferred), then fall back.
  const [data, setData] = useState<HomeworkItem[]>(
    () => safeParse<HomeworkItem[]>(typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null)
      ?? items
      ?? demoItems
  );

  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<"all" | HomeworkStatus>("all");

  // 2) Persist after every change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {}
  }, [data]);

  const addItem = (item: HomeworkItem) => {
    setData((prev) => [...prev, item]);
  };

  const removeItem = (id: string) => {
    setData((prev) => prev.filter((it) => it.id !== id));
  };

  const cycleStatus = (id: string) => {
    setData((prev) =>
      prev.map((it) => {
        if (it.id !== id) return it;
        const next: HomeworkStatus =
          it.status === "todo" ? "in-progress" : it.status === "in-progress" ? "done" : "todo";
        return { ...it, status: next };
      })
    );
  };

  const parseLocalTime = (ymd: string) => {
    const [y, m, d] = ymd.split("-").map(Number);
    return new Date(y, (m ?? 1) - 1, d ?? 1).getTime();
  };

  const filteredSorted = useMemo(() => {
    const out = data.filter((it) => (statusFilter === "all" ? true : it.status === statusFilter));
    return out.sort((a, b) => parseLocalTime(a.due) - parseLocalTime(b.due));
  }, [data, statusFilter]);

  return (
    <section className="homework-list">
      <header className="homework-list__header">
        <h2>{heading}</h2>
        <p className="homework-list__summary">
          {filteredSorted.length} {filteredSorted.length === 1 ? "item" : "items"}
        </p>
      </header>

      <HomeworkForm onAdd={addItem} />

      <div className="homework-list__toolbar">
        {(["all", "todo", "in-progress", "done"] as const).map((opt) => (
          <button
            key={opt}
            type="button"
            className={`chip ${statusFilter === opt ? "chip--active" : ""}`}
            onClick={() => setStatusFilter(opt)}
            aria-pressed={statusFilter === opt}
          >
            {opt === "all" ? "All" : opt.replace("-", " ")}
          </button>
        ))}
      </div>

      <ol className="homework-list__items">
        {filteredSorted.map((hw) => (
          <li key={hw.id} className="homework-list__item">
            <HomeworkCard
              item={hw}
              isExpanded={expandedId === hw.id}
              onToggleExpand={(id) => setExpandedId((prev) => (prev === id ? null : id))}
              onCycleStatus={cycleStatus}
              onRemove={removeItem}
            />
          </li>
        ))}
      </ol>

      <footer className="homework-list__footer">
        <ul className="legend">
          <li>
            <span className="badge badge--todo" /> To do
          </li>
          <li>
            <span className="badge badge--in-progress" /> In progress
          </li>
          <li>
            <span className="badge badge--done" /> Done
          </li>
        </ul>
      </footer>
    </section>
  );
}