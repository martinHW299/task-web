export type TaskStatus = "todo" | "in_progress" | "done";

export interface Task {
    id: number;
    title: string;
    description: string | null;
    status?: TaskStatus;
    due_at?: string | null;
    created_at?: string;
    updated_at?: string;
}

export interface TaskCreateDTO {
    title: string;
    description?: string;
    status?: TaskStatus;
    due_at?: string | null;
}

export interface TaskUpdateDTO {
    title?: string;
    description?: string | null;
    status?: TaskStatus;
    due_at?: string | null;
}
