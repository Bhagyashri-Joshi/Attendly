import { z } from "zod";

const priority = z.enum(["LOW", "MEDIUM", "HIGH"]);
const status = z.enum(["PENDING", "COMPLETED"]);

export const createTodoSchema = z.object({
  title: z.string().trim().min(1, "Task is required").max(1000, "Task is too long"),
  priority: priority.default("LOW"),
  subjectId: z.string().min(1).optional(),
});

export const updateTodoSchema = z.object({
  title: z.string().trim().min(1, "Task is required").max(1000, "Task is too long").optional(),
  priority: priority.optional(),
  status: status.optional(),
}).refine((data) => Object.values(data).some((value) => value !== undefined), "Provide at least one field");

export const updateTodoStatusSchema = z.object({ status });
export type CreateTodoInput = z.infer<typeof createTodoSchema>;
export type UpdateTodoInput = z.infer<typeof updateTodoSchema>;
