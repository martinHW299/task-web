import type { TaskStatus } from "../types/task";

export const TASK_STATUSES: ReadonlyArray<{ value: TaskStatus; label: string }> = [
  { value: "todo", label: "Todo" },
  { value: "in_progress", label: "In progress" },
  { value: "done", label: "Done" },
];

export function getTaskStatusLabel(status: TaskStatus | null | undefined): string {
  const v = status ?? "todo";
  return TASK_STATUSES.find((s) => s.value === v)?.label ?? "Todo";
}

