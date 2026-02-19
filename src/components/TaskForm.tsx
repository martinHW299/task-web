import type { TaskStatus } from "../types/task";
import { TASK_STATUSES } from "../constants/tasks";
import type { ChangeEvent, FormEvent } from "react";
import { toDateTimeLocalFromDate } from "../utils/datetime";

export type TaskFormValue = {
  title: string;
  description: string;
  status: TaskStatus;
  due_at: string;
};

type Props = {
  value: TaskFormValue;
  isEditing: boolean;
  loading: boolean;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onSetField: (name: keyof TaskFormValue, value: string) => void;
  onSubmit: (e: FormEvent) => void;
  onCancel: () => void;
};

export function TaskForm({ value, isEditing, loading, onChange, onSetField, onSubmit, onCancel }: Props) {
  function shiftDueAtByDays(days: number) {
    const base = value.due_at ? new Date(value.due_at) : new Date();
    if (Number.isNaN(base.getTime())) return;
    base.setDate(base.getDate() + days);
    onSetField("due_at", toDateTimeLocalFromDate(base));
  }

  return (
    <form onSubmit={onSubmit} className="taskForm">
      <input
        name="title"
        value={value.title}
        onChange={onChange}
        placeholder="Title"
        required
        className="taskField"
        autoFocus
        autoComplete="off"
      />

      <textarea
        name="description"
        value={value.description}
        onChange={onChange}
        placeholder="Description (optional)"
        rows={3}
        className="taskField"
      />

      <div className="taskFormRow">
        <label className="taskLabel">
          Status
          <select name="status" value={value.status} onChange={onChange} className="taskField">
            {TASK_STATUSES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </label>

        <label className="taskLabel">
          Due at
          <div className="dueAtRow">
            <input
              type="datetime-local"
              name="due_at"
              value={value.due_at}
              onChange={onChange}
              className="taskField"
            />
            <div className="dueAtQuick">
              <button type="button" className="taskButton taskButtonSmall" onClick={() => shiftDueAtByDays(1)}>
                +1 day
              </button>
              <button type="button" className="taskButton taskButtonSmall" onClick={() => onSetField("due_at", "")}>
                Clear
              </button>
            </div>
          </div>
        </label>
      </div>

      <div className="taskFormActions">
        <button type="submit" className="taskButton taskButtonPrimary" disabled={loading}>
          {isEditing ? "Update" : "Create"}
        </button>

        {isEditing && (
          <button type="button" onClick={onCancel} className="taskButton" disabled={loading}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
