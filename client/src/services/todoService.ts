import { apiClient } from "./apiClient";
import type { Todo, TodoPriority, TodoStatus } from "@/types/todo";

type TodoListResponse = { success: boolean; todos: Todo[] };
type TodoResponse = { success: boolean; message: string; todo: Todo };

export type TodoInput = { title: string; priority?: TodoPriority; subjectId?: string };
export type TodoUpdateInput = { title?: string; priority?: TodoPriority; status?: TodoStatus };

export const fetchTodos = () => apiClient.get<TodoListResponse>("/api/todos");
export const createTodo = (input: TodoInput) => apiClient.post<TodoResponse>("/api/todos", input);
export const updateTodo = (id: string, input: TodoUpdateInput) => apiClient.put<TodoResponse>(`/api/todos/${id}`, input);
export const updateTodoStatus = (id: string, status: TodoStatus) => apiClient.patch<TodoResponse>(`/api/todos/${id}/status`, { status });
export const deleteTodo = (id: string) => apiClient.delete<{ success: boolean; message: string }>(`/api/todos/${id}`);
