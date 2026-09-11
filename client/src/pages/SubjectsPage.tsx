import { useEffect, useState } from "react";
import { TriangleAlert } from "lucide-react";
import { AppLayout } from "@/layouts/AppLayout";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/toast/useToast";
import { useSubjectsStore } from "@/store/subjectsStore";
import { ApiClientError } from "@/services/apiClient";
import { SubjectCard } from "@/components/subjects/SubjectCard";
import { SubjectFormDialog } from "@/components/subjects/SubjectFormDialog";
import { DeleteSubjectDialog } from "@/components/subjects/DeleteSubjectDialog";
import { SubjectsSkeleton } from "@/components/subjects/SubjectsSkeleton";
import { EmptySubjects } from "@/components/subjects/EmptySubjects";
import type { Subject } from "@/types/subject";
import type { SubjectFormValues } from "@/schemas/subjectSchemas";

function errorMessage(err: unknown) {
  return err instanceof ApiClientError ? err.message : "Something went wrong. Please try again.";
}

export function SubjectsPage() {
  const { subjects, isLoading, error, fetchSubjects, addSubject, editSubject, removeSubject } =
    useSubjectsStore();
  const { showToast } = useToast();

  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"add" | "edit">("add");
  const [activeSubject, setActiveSubject] = useState<Subject | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<Subject | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchSubjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function openAddDialog() {
    setFormMode("add");
    setActiveSubject(null);
    setFormOpen(true);
  }

  function openEditDialog(subject: Subject) {
    setFormMode("edit");
    setActiveSubject(subject);
    setFormOpen(true);
  }

  async function handleFormSubmit(values: SubjectFormValues) {
    try {
      if (formMode === "add") {
        await addSubject(values);
        showToast("Subject added successfully.", "success");
      } else if (activeSubject) {
        await editSubject(activeSubject.id, values);
        showToast("Subject updated successfully.", "success");
      }
      setFormOpen(false);
    } catch (err) {
      showToast(errorMessage(err), "error");
    }
  }

  async function handleDeleteConfirm() {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await removeSubject(deleteTarget.id);
      showToast("Subject deleted.", "info");
      setDeleteTarget(null);
    } catch (err) {
      showToast(errorMessage(err), "error");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <AppLayout>
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-display text-2xl text-forest-dark sm:text-3xl">My Subjects</h1>
            <p className="mt-1 text-sm text-muted">Manage all your academic subjects.</p>
          </div>
          <Button onClick={openAddDialog} className="self-start sm:self-auto">
            + Add Subject
          </Button>
        </div>

        <div className="mt-8">
          {isLoading ? (
            <SubjectsSkeleton />
          ) : error ? (
            <div className="flex flex-col items-center justify-center rounded-card border border-border bg-white px-6 py-16 text-center">
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-[#C0392B]/10 text-[#C0392B]">
                <TriangleAlert size={26} strokeWidth={1.75} />
              </div>
              <h2 className="font-display text-xl text-forest-dark">Couldn't load your subjects</h2>
              <p className="mt-2 max-w-sm text-sm text-muted">{error}</p>
              <Button className="mt-6" variant="outline" onClick={() => fetchSubjects()}>
                Try again
              </Button>
            </div>
          ) : subjects.length === 0 ? (
            <EmptySubjects onAdd={openAddDialog} />
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {subjects.map((subject) => (
                <SubjectCard
                  key={subject.id}
                  subject={subject}
                  onEdit={() => openEditDialog(subject)}
                  onDelete={() => setDeleteTarget(subject)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <SubjectFormDialog
        open={formOpen}
        mode={formMode}
        subject={activeSubject}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
      />

      <DeleteSubjectDialog
        open={!!deleteTarget}
        subjectName={deleteTarget?.name}
        isDeleting={isDeleting}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
      />
    </AppLayout>
  );
}
