import { useState, useMemo } from "react";
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

function StatusBadge({ status }: { status: HomeworkStatus }) {
  return (
    <span className={`badge badge--${status}`}>
      {status.replace("-", " ")}
    </span>
  );
}

function HomeworkCard({
  item,
  isExpanded,
  onToggleExpand,
  onToggleStatus
}: {
  item: HomeworkItem;
  isExpanded: boolean;
  onToggleExpand: (id: string) => void;
  onToggleStatus: (id: string) => void;
}) {
  const fmt = (iso: string) =>
    new Date(iso).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric"
    });

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
            onClick={() => onToggleStatus(item.id)}
          >
            {item.status === "done" ? "Undo Done" : "Mark Done"}
          </button>

          <button
            type="button"
            className="btn btn--ghost"
            onClick={() => onToggleExpand(item.id)}
          >
            {isExpanded ? "Hide details" : "Show details"}
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
          <p className="hw-note">
            Break this task into smaller steps for better workflow.
          </p>
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

  const [data, setData] = useState(items ?? demoItems);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] =
    useState<"all" | HomeworkStatus>("all");

  const toggleStatus = (id: string) => {
    setData(prev =>
      prev.map(it =>
        it.id === id
          ? { ...it, status: it.status === "done" ? "todo" : "done" }
          : it
      )
    );
  };

  const toggleExpand = (id: string) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  const filteredSorted = useMemo(() => {
    const out = data.filter(it =>
      statusFilter === "all" ? true : it.status === statusFilter
    );
    return out.sort(
      (a, b) => new Date(a.due).getTime() - new Date(b.due).getTime()
    );
  }, [data, statusFilter]);

  return (
    <section className="homework-list">
      <header className="homework-list__header">
        <h2>{heading}</h2>
        <p className="homework-list__summary">
          {filteredSorted.length}{" "}
          {filteredSorted.length === 1 ? "item" : "items"}
        </p>
      </header>

      <div className="homework-list__toolbar">
        {(["all", "todo", "in-progress", "done"] as const).map(opt => (
          <button
            key={opt}
            type="button"
            className={`chip ${statusFilter === opt ? "chip--active" : ""}`}
            onClick={() => setStatusFilter(opt)}
          >
            {opt === "all" ? "All" : opt.replace("-", " ")}
          </button>
        ))}
      </div>

      <ol className="homework-list__items">
        {filteredSorted.map(hw => (
          <li key={hw.id} className="homework-list__item">
            <HomeworkCard
              item={hw}
              isExpanded={expandedId === hw.id}
              onToggleExpand={toggleExpand}
              onToggleStatus={toggleStatus}
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
