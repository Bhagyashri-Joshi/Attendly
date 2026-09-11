import { z } from "zod";

const hexColorRegex = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/;

/**
 * An optional, "clearable" string field. Blank/whitespace-only input
 * is normalized to `null` (an explicit clear), a real value is
 * trimmed and length-checked, and a wholly missing key stays
 * `undefined` (leave unchanged). This maps directly onto Prisma's
 * update semantics: `undefined` omits the field from the update,
 * `null` sets the column to NULL.
 */
function optionalClearableString(max: number, message: string) {
  return z.preprocess(
    (val) => (typeof val === "string" && val.trim() === "" ? null : val),
    z.string().trim().max(max, message).nullable().optional()
  );
}

const optionalClearableColor = z.preprocess(
  (val) => (typeof val === "string" && val.trim() === "" ? null : val),
  z
    .string()
    .trim()
    .regex(hexColorRegex, "Color must be a valid hex code, e.g. #224F10")
    .nullable()
    .optional()
);

const nameSchema = z
  .string()
  .trim()
  .min(1, "Subject name is required")
  .max(100, "Subject name is too long");

export const createSubjectSchema = z.object({
  name: nameSchema,
  code: optionalClearableString(20, "Subject code is too long"),
  faculty: optionalClearableString(100, "Faculty name is too long"),
  color: optionalClearableColor,
});

export const updateSubjectSchema = z
  .object({
    name: nameSchema.optional(),
    code: optionalClearableString(20, "Subject code is too long"),
    faculty: optionalClearableString(100, "Faculty name is too long"),
    color: optionalClearableColor,
  })
  .refine((data) => Object.values(data).some((value) => value !== undefined), {
    message: "Provide at least one field to update",
  });

export type CreateSubjectInput = z.infer<typeof createSubjectSchema>;
export type UpdateSubjectInput = z.infer<typeof updateSubjectSchema>;
