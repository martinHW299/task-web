import type { Task } from "../types/task";
import { formatDateTime } from "../utils/datetime";
import { getTaskStatusLabel } from "../constants/tasks";

type Props = {
  tasks: Task[];
  loading: boolean;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
};

export function TaskList({ tasks, loading, onEdit, onDelete }: Props) {
  return (
    <section className="taskList">
      {loading ? (
        <p>Loading…</p>
      ) : tasks.length === 0 ? (
        <p>No tasks yet.</p>
      ) : (
        <ul className="taskCards" aria-label="Task list">
          {tasks.map((t) => (
            <li key={t.id} className="taskCard">
              <div className="taskCardTop">
                <div className="taskCardTitleWrap">
                  <div className="taskCardTitleRow">
                    <h2 className="taskCardTitle">{t.title}</h2>
                    <span className={`taskStatus taskStatus--${t.status ?? "todo"}`}>{getTaskStatusLabel(t.status)}</span>
                  </div>
                  {t.description ? <p className="taskCardDesc">{t.description}</p> : null}
                </div>

                <div className="taskCardActions">
                  <button onClick={() => onEdit(t.id)} className="taskButton taskButtonSmall">
                    Edit
                  </button>
                  <button onClick={() => onDelete(t.id)} className="taskButton taskButtonDanger taskButtonSmall">
                    Delete
                  </button>
                </div>
              </div>

              <dl className="taskMeta">
                <div className="taskMetaItem">
                  <dt>Due</dt>
                  <dd>{formatDateTime(t.due_at ?? null)}</dd>
                </div>
                <div className="taskMetaItem">
                  <dt>Created</dt>
                  <dd>{formatDateTime(t.created_at)}</dd>
                </div>
                <div className="taskMetaItem">
                  <dt>Updated</dt>
                  <dd>{formatDateTime(t.updated_at)}</dd>
                </div>
              </dl>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

