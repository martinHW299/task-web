import { api } from "./client";
import type { Task, TaskCreateDTO, TaskUpdateDTO } from "../types/task";

// Laravel responses can be either plain or Resource-wrapped.
// We'll normalize both shapes.
type Resource<T> = { data: T };

function unwrap<T>(res: T | Resource<T>): T {
    return (res as Resource<T>)?.data ?? (res as T);
}

export async function listTasks(): Promise<Task[]> {
    const { data } = await api.get<Task[] | Resource<Task[]>>("/tasks");
    return unwrap(data);
}

export async function getTask(id: number): Promise<Task> {
    const { data } = await api.get<Task | Resource<Task>>(`/tasks/${id}`);
    return unwrap(data);
}

export async function createTask(payload: TaskCreateDTO): Promise<Task> {
    const { data } = await api.post<Task | Resource<Task>>("/tasks", payload);
    return unwrap(data);
}

export async function updateTask(id: number, payload: TaskUpdateDTO): Promise<Task> {
    const { data } = await api.put<Task | Resource<Task>>(`/tasks/${id}`, payload);
    return unwrap(data);
}

export async function deleteTask(id: number): Promise<void> {
    await api.delete(`/tasks/${id}`);
}
