export type TodoPriority = "LOW" | "MEDIUM" | "HIGH";
export type TodoStatus = "PENDING" | "COMPLETED";
export type TodoSource = "ATTENDANCE" | "MANUAL";

export interface Todo {
  id: string;
  title: string;
  priority: TodoPriority;
  status: TodoStatus;
  subjectId: string | null;
  attendanceDate: string | null;
  source: TodoSource;
  createdAt: string;
  updatedAt: string;
  subject?: { id: string; name: string; code: string | null } | null;
}
