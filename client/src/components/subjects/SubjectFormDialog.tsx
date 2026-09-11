import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/form-field";
import { cn } from "@/utils/cn";
import { subjectFormSchema, type SubjectFormValues } from "@/schemas/subjectSchemas";
import type { Subject } from "@/types/subject";

const COLOR_SWATCHES = [
  "#224F10",
  "#4A90D9",
  "#D9534F",
  "#F5A623",
  "#9B59B6",
  "#17A2A2",
  "#C2477A",
  "#6C7A89",
];

const DEFAULT_VALUES: SubjectFormValues = { name: "", code: "", faculty: "", color: "" };

interface SubjectFormDialogProps {
  open: boolean;
  mode: "add" | "edit";
  subject?: Subject | null;
  onClose: () => void;
  onSubmit: (values: SubjectFormValues) => Promise<void>;
}

export function SubjectFormDialog({ open, mode, subject, onClose, onSubmit }: SubjectFormDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<SubjectFormValues>({
    resolver: zodResolver(subjectFormSchema),
    defaultValues: DEFAULT_VALUES,
  });

  useEffect(() => {
    if (!open) return;
    reset({
      name: subject?.name ?? "",
      code: subject?.code ?? "",
      faculty: subject?.faculty ?? "",
      color: subject?.color ?? "",
    });
  }, [open, subject, reset]);

  const selectedColor = watch("color");

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={mode === "add" ? "Add Subject" : "Edit Subject"}
      description={
        mode === "add"
          ? "Add a subject to start tracking its attendance."
          : "Update the details for this subject."
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
        <FormField label="Subject Name" htmlFor="subject-name" error={errors.name?.message}>
          <Input
            id="subject-name"
            placeholder="e.g. Data Structures"
            hasError={!!errors.name}
            {...register("name")}
          />
        </FormField>

        <FormField label="Subject Code" htmlFor="subject-code" error={errors.code?.message}>
          <Input
            id="subject-code"
            placeholder="e.g. CS201"
            hasError={!!errors.code}
            {...register("code")}
          />
        </FormField>

        <FormField label="Faculty Name" htmlFor="subject-faculty" error={errors.faculty?.message}>
          <Input
            id="subject-faculty"
            placeholder="e.g. Dr. Sharma"
            hasError={!!errors.faculty}
            {...register("faculty")}
          />
        </FormField>

        <FormField label="Subject Color" htmlFor="subject-color" error={errors.color?.message}>
          <input type="hidden" {...register("color")} />
          <div className="flex flex-wrap items-center gap-2">
            {COLOR_SWATCHES.map((swatch) => (
              <button
                key={swatch}
                type="button"
                onClick={() => setValue("color", swatch, { shouldValidate: true })}
                aria-label={`Choose color ${swatch}`}
                aria-pressed={selectedColor === swatch}
                className={cn(
                  "h-7 w-7 rounded-full border-2 transition-transform",
                  selectedColor === swatch ? "scale-110 border-forest-dark" : "border-transparent"
                )}
                style={{ backgroundColor: swatch }}
              />
            ))}
            <input
              id="subject-color"
              type="color"
              value={selectedColor || "#224F10"}
              onChange={(event) => setValue("color", event.target.value, { shouldValidate: true })}
              aria-label="Choose a custom color"
              className="h-7 w-9 cursor-pointer rounded border border-border bg-transparent p-0.5"
            />
          </div>
        </FormField>

        <div className="mt-2 flex items-center gap-3">
          <Button type="submit" className="flex-1" disabled={isSubmitting}>
            {isSubmitting && <Loader2 size={16} className="animate-spin" />}
            {isSubmitting ? "Saving…" : mode === "add" ? "Add Subject" : "Save Changes"}
          </Button>
          <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
