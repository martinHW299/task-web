import { useEffect, useMemo, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import type { Task, TaskCreateDTO, TaskUpdateDTO } from "./types/task";
import { createTask, deleteTask, getTask, listTasks, updateTask } from "./api/tasks";
import "./App.css";
import { AppHeader } from "./components/AppHeader";
import { ErrorBanner } from "./components/ErrorBanner";
import { TaskForm, type TaskFormValue } from "./components/TaskForm";
import { TaskList } from "./components/TaskList";
import { ConfirmDialog } from "./components/ConfirmDialog";
import { Modal } from "./components/Modal";
import { toDateTimeLocalValue, toIsoOrNull } from "./utils/datetime";
import { getErrorMessage, getValidationErrorMessage } from "./utils/errors";

const DEFAULT_FORM: TaskFormValue = { title: "", description: "", status: "todo", due_at: "" };

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  const [editingId, setEditingId] = useState<number | null>(null);
  const isEditing = useMemo(() => editingId !== null, [editingId]);

  const [form, setForm] = useState<TaskFormValue>(DEFAULT_FORM);

  async function refresh() {
    setError("");
    setLoading(true);
    try {
      const data = await listTasks();
      setTasks(data);
    } catch (e: unknown) {
      setError(getErrorMessage(e, "Failed to load tasks"));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  function resetForm() {
    setForm(DEFAULT_FORM);
    setEditingId(null);
  }

  function closeModal() {
    setModalOpen(false);
    resetForm();
  }

  function openCreateModal() {
    setError("");
    resetForm();
    setModalOpen(true);
  }

  function setField(name: keyof TaskFormValue, value: string) {
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function onChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    const dueAtIso = toIsoOrNull(form.due_at);

    try {
      if (isEditing && editingId !== null) {
        const payload: TaskUpdateDTO = {
          title: form.title.trim(),
          description: form.description.trim() || null,
          status: form.status,
          due_at: dueAtIso,
        };
        await updateTask(editingId, payload);
      } else {
        const payload: TaskCreateDTO = {
          title: form.title.trim(),
          description: form.description.trim() || undefined,
          status: form.status,
          due_at: dueAtIso,
        };
        await createTask(payload);
      }
      await refresh();
      closeModal();
    } catch (e: unknown) {
      const validationMsg = getValidationErrorMessage(e);
      setError(validationMsg ?? getErrorMessage(e, "Request failed"));
    }
  }

  async function onEdit(id: number) {
    setError("");
    try {
      const t = await getTask(id);
      setEditingId(id);
      setForm({
        title: t.title ?? "",
        description: t.description ?? "",
        status: t.status ?? "todo",
        due_at: toDateTimeLocalValue(t.due_at ?? null),
      });
      setModalOpen(true);
    } catch (e: unknown) {
      setError(getErrorMessage(e, "Failed to load task"));
    }
  }

  async function onDelete(id: number) {
    setError("");
    setDeleteConfirmId(id);
  }

  async function confirmDelete() {
    if (deleteConfirmId === null) return;

    try {
      const id = deleteConfirmId;
      await deleteTask(id);
      if (editingId === id) closeModal();
      await refresh();
      setDeleteConfirmId(null);
    } catch (e: unknown) {
      setError(getErrorMessage(e, "Failed to delete task"));
    }
  }

  return (
    <main className="app">
      <AppHeader
        apiBaseUrl={import.meta.env.VITE_API_BASE_URL}
        loading={loading}
        onCreate={openCreateModal}
        onRefresh={refresh}
      />
      <ErrorBanner error={error} />
      <Modal title={isEditing ? "Edit task" : "New task"} open={modalOpen} onClose={closeModal}>
        <TaskForm
          value={form}
          isEditing={isEditing}
          loading={loading}
          onChange={onChange}
          onSetField={setField}
          onSubmit={onSubmit}
          onCancel={closeModal}
        />
      </Modal>
      <ConfirmDialog
        open={deleteConfirmId !== null}
        title="Delete task?"
        description={
          deleteConfirmId !== null
            ? `This will permanently delete “${tasks.find((t) => t.id === deleteConfirmId)?.title ?? "this task"}”.`
            : undefined
        }
        confirmLabel="Delete"
        loading={loading}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteConfirmId(null)}
      />
      <TaskList tasks={tasks} loading={loading} onEdit={onEdit} onDelete={onDelete} />
    </main>
  );
}
