import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/form-field";
import {
  timetableFormSchema,
  type TimetableFormValues,
} from "@/schemas/timetableSchemas";
import type { Subject } from "@/types/subject";
import type { TimetableLecture } from "@/types/timetable";

const DEFAULT_VALUES: TimetableFormValues = {
  subjectId: "",
  dayOfWeek: "MONDAY",
  startTime: "09:00",
  endTime: "10:00",
  room: "",
};

const DAYS = [
  ["MONDAY", "Monday"],
  ["TUESDAY", "Tuesday"],
  ["WEDNESDAY", "Wednesday"],
  ["THURSDAY", "Thursday"],
  ["FRIDAY", "Friday"],
] as const;

interface TimetableFormDialogProps {
  open: boolean;
  mode: "add" | "edit";
  lecture?: TimetableLecture | null;
  subjects: Subject[];
  onClose: () => void;
  onSubmit: (values: TimetableFormValues) => Promise<void>;
}

export function TimetableFormDialog({
  open,
  mode,
  lecture,
  subjects,
  onClose,
  onSubmit,
}: TimetableFormDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TimetableFormValues>({
    resolver: zodResolver(timetableFormSchema),
    defaultValues: DEFAULT_VALUES,
  });

  useEffect(() => {
    if (!open) return;
    reset(
      lecture
        ? {
            subjectId: lecture.subjectId,
            dayOfWeek: lecture.dayOfWeek,
            startTime: lecture.startTime,
            endTime: lecture.endTime,
            room: lecture.room ?? "",
          }
        : DEFAULT_VALUES
    );
  }, [lecture, open, reset]);

  const selectClassName =
    "h-10 w-full rounded-lg border border-border bg-white px-3 text-sm text-forest-dark outline-none transition focus:border-forest focus:ring-2 focus:ring-forest/15";

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={mode === "add" ? "Add Lecture" : "Edit Lecture"}
      description={
        mode === "add"
          ? "Add a class to your weekly timetable."
          : "Update this lecture's schedule or details."
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
        <FormField label="Subject" htmlFor="lecture-subject" error={errors.subjectId?.message}>
          <select id="lecture-subject" className={selectClassName} {...register("subjectId")}>
            <option value="">Select a subject</option>
            {subjects.map((subject) => (
              <option key={subject.id} value={subject.id}>
                {subject.name}{subject.code ? ` (${subject.code})` : ""}
              </option>
            ))}
          </select>
        </FormField>

        <FormField label="Day" htmlFor="lecture-day" error={errors.dayOfWeek?.message}>
          <select id="lecture-day" className={selectClassName} {...register("dayOfWeek")}>
            {DAYS.map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </FormField>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField label="Start Time" htmlFor="lecture-start" error={errors.startTime?.message}>
            <Input id="lecture-start" type="time" hasError={!!errors.startTime} {...register("startTime")} />
          </FormField>
          <FormField label="End Time" htmlFor="lecture-end" error={errors.endTime?.message}>
            <Input id="lecture-end" type="time" hasError={!!errors.endTime} {...register("endTime")} />
          </FormField>
        </div>

        <FormField label="Room (optional)" htmlFor="lecture-room" error={errors.room?.message}>
          <Input id="lecture-room" placeholder="e.g. 301 or Lab 2" hasError={!!errors.room} {...register("room")} />
        </FormField>

        {subjects.length === 0 && (
          <p className="rounded-lg border border-border bg-light-green/50 px-3 py-2 text-xs text-muted">
            Add a subject first before creating a lecture.
          </p>
        )}

        <div className="mt-2 flex items-center gap-3">
          <Button type="submit" className="flex-1" disabled={isSubmitting || subjects.length === 0}>
            {isSubmitting && <Loader2 size={16} className="animate-spin" />}
            {isSubmitting ? "Saving…" : mode === "add" ? "Add Lecture" : "Save Changes"}
          </Button>
          <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
