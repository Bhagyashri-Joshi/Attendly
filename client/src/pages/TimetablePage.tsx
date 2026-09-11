import { useEffect, useState } from "react";
import { TriangleAlert } from "lucide-react";
import { AppLayout } from "@/layouts/AppLayout";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/toast/useToast";
import { ApiClientError } from "@/services/apiClient";
import { useSubjectsStore } from "@/store/subjectsStore";
import { useTimetableStore } from "@/store/timetableStore";
import { TimetableGrid } from "@/components/timetable/TimetableGrid";
import { TimetableFormDialog } from "@/components/timetable/TimetableFormDialog";
import { DeleteLectureDialog } from "@/components/timetable/DeleteLectureDialog";
import { TimetableSkeleton } from "@/components/timetable/TimetableSkeleton";
import { EmptyTimetable } from "@/components/timetable/EmptyTimetable";
import type { TimetableFormValues } from "@/schemas/timetableSchemas";
import type { TimetableLecture } from "@/types/timetable";

function errorMessage(error: unknown) {
  return error instanceof ApiClientError ? error.message : "Something went wrong. Please try again.";
}

export function TimetablePage() {
  const { lectures, isLoading, error, fetchTimetable, addLecture, editLecture, removeLecture } = useTimetableStore();
  const { subjects, fetchSubjects } = useSubjectsStore();
  const { showToast } = useToast();

  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"add" | "edit">("add");
  const [activeLecture, setActiveLecture] = useState<TimetableLecture | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<TimetableLecture | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    void Promise.all([fetchTimetable(), fetchSubjects()]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function openAddDialog() {
    setFormMode("add");
    setActiveLecture(null);
    setFormOpen(true);
  }

  function openEditDialog(lecture: TimetableLecture) {
    setFormMode("edit");
    setActiveLecture(lecture);
    setFormOpen(true);
  }

  async function handleFormSubmit(values: TimetableFormValues) {
    try {
      if (formMode === "add") {
        await addLecture(values);
        showToast("Lecture added successfully.", "success");
      } else if (activeLecture) {
        await editLecture(activeLecture.id, values);
        showToast("Lecture updated successfully.", "success");
      }
      setFormOpen(false);
    } catch (error) {
      showToast(errorMessage(error), "error");
    }
  }

  async function handleDeleteConfirm() {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await removeLecture(deleteTarget.id);
      showToast("Lecture deleted.", "info");
      setDeleteTarget(null);
    } catch (error) {
      showToast(errorMessage(error), "error");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <AppLayout>
      <div className="mx-auto max-w-[1500px] px-4 py-8 sm:px-6 sm:py-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-display text-2xl text-forest-dark sm:text-3xl">Weekly Timetable</h1>
            <p className="mt-1 text-sm text-muted">Plan your week and never miss a lecture.</p>
          </div>
          <Button onClick={openAddDialog} className="self-start sm:self-auto">+ Add Lecture</Button>
        </div>

        <div className="mt-8">
          {isLoading ? (
            <TimetableSkeleton />
          ) : error ? (
            <div className="flex flex-col items-center justify-center rounded-card border border-border bg-white px-6 py-16 text-center">
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-[#C0392B]/10 text-[#C0392B]">
                <TriangleAlert size={26} strokeWidth={1.75} />
              </div>
              <h2 className="font-display text-xl text-forest-dark">Couldn't load your timetable</h2>
              <p className="mt-2 max-w-sm text-sm text-muted">{error}</p>
              <Button className="mt-6" variant="outline" onClick={() => fetchTimetable()}>Try again</Button>
            </div>
          ) : lectures.length === 0 ? (
            <EmptyTimetable onAdd={openAddDialog} />
          ) : (
            <TimetableGrid lectures={lectures} onEdit={openEditDialog} onDelete={setDeleteTarget} />
          )}
        </div>
      </div>

      <TimetableFormDialog
        open={formOpen}
        mode={formMode}
        lecture={activeLecture}
        subjects={subjects}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
      />

      <DeleteLectureDialog
        open={!!deleteTarget}
        isDeleting={isDeleting}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
      />
    </AppLayout>
  );
}
