import axios from "axios";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export function getErrorMessage(err: unknown, fallback: string): string {
  if (axios.isAxiosError(err)) {
    const data = err.response?.data;
    if (isRecord(data) && typeof data.message === "string" && data.message.trim()) return data.message;
    if (typeof err.message === "string" && err.message.trim()) return err.message;
    return fallback;
  }

  if (err instanceof Error && err.message.trim()) return err.message;
  return fallback;
}

export function getValidationErrorMessage(err: unknown): string | null {
  if (!axios.isAxiosError(err)) return null;
  const data = err.response?.data;
  if (!isRecord(data)) return null;

  const errors = data.errors;
  if (!isRecord(errors)) return null;

  const parts: string[] = [];
  for (const [field, value] of Object.entries(errors)) {
    if (Array.isArray(value) && value.every((v) => typeof v === "string")) {
      parts.push(`${field}: ${value.join(", ")}`);
    } else if (typeof value === "string") {
      parts.push(`${field}: ${value}`);
    }
  }

  if (parts.length === 0) return null;
  return parts.join(" | ");
}

