import type { Request, Response } from "express";
import { prisma } from "../config/prisma";
import { ApiError } from "../utils/ApiError";
import type { CreateTodoInput, UpdateTodoInput } from "../validators/todoValidators";

const include = { subject: { select: { id: true, name: true, code: true } } } as const;
const priorityOrder = { HIGH: 0, MEDIUM: 1, LOW: 2 } as const;

function serialize(todo: any) {
  return { ...todo, subject: todo.subject ?? null };
}

async function ownedTodo(id: string, userId: string) {
  const todo = await prisma.todo.findFirst({ where: { id, userId }, include });
  if (!todo) throw new ApiError(404, "Task not found");
  return todo;
}

export async function listTodos(req: Request, res: Response) {
  const userId = req.userId as string;
  const todos = await prisma.todo.findMany({ where: { userId }, include, orderBy: { createdAt: "desc" } });
  todos.sort((a, b) => {
    const statusA = a.status === "PENDING" ? 0 : 1;
    const statusB = b.status === "PENDING" ? 0 : 1;
    if (statusA !== statusB) return statusA - statusB;
    const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
    if (priorityDiff !== 0) return priorityDiff;
    return b.createdAt.getTime() - a.createdAt.getTime();
  });
  res.json({ success: true, todos: todos.map(serialize) });
}

export async function createTodo(req: Request, res: Response) {
  const userId = req.userId as string;
  const input = req.body as CreateTodoInput;
  if (input.subjectId) {
    const subject = await prisma.subject.findFirst({ where: { id: input.subjectId, userId } });
    if (!subject) throw new ApiError(404, "Subject not found");
  }
  const todo = await prisma.todo.create({
    data: { userId, title: input.title, priority: input.priority ?? "LOW", status: "PENDING", source: "MANUAL", subjectId: input.subjectId ?? null },
    include,
  });
  res.status(201).json({ success: true, message: "Task created successfully", todo: serialize(todo) });
}

export async function updateTodo(req: Request, res: Response) {
  const userId = req.userId as string;
  const current = await ownedTodo(req.params.id as string, userId);
  const input = req.body as UpdateTodoInput;
  const todo = await prisma.todo.update({ where: { id: current.id }, data: input, include });
  res.json({ success: true, message: "Task updated successfully", todo: serialize(todo) });
}

export async function updateTodoStatus(req: Request, res: Response) {
  const userId = req.userId as string;
  const current = await ownedTodo(req.params.id as string, userId);
  const status = req.body.status as "PENDING" | "COMPLETED";
  const todo = await prisma.todo.update({ where: { id: current.id }, data: { status }, include });
  res.json({ success: true, message: "Task status updated successfully", todo: serialize(todo) });
}

export async function deleteTodo(req: Request, res: Response) {
  const current = await ownedTodo(req.params.id as string, req.userId as string);
  await prisma.todo.delete({ where: { id: current.id } });
  res.json({ success: true, message: "Task deleted successfully" });
}
