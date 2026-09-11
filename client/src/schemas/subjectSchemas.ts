import { z } from "zod";

const hexColorRegex = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/;

export const subjectFormSchema = z.object({
  name: z.string().trim().min(1, "Subject name is required").max(100, "Subject name is too long"),
  code: z.string().trim().max(20, "Subject code is too long"),
  faculty: z.string().trim().max(100, "Faculty name is too long"),
  color: z
    .string()
    .trim()
    .refine((val) => val === "" || hexColorRegex.test(val), "Pick a valid color"),
});

export type SubjectFormValues = z.infer<typeof subjectFormSchema>;
