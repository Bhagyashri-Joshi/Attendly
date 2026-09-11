import { Loader2, TriangleAlert } from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DeleteSubjectDialogProps {
  open: boolean;
  subjectName?: string;
  isDeleting: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export function DeleteSubjectDialog({
  open,
  subjectName,
  isDeleting,
  onCancel,
  onConfirm,
}: DeleteSubjectDialogProps) {
  return (
    <Dialog open={open} onClose={onCancel} title="Delete subject?">
      <div className="flex flex-col gap-4">
        <div className="flex items-start gap-3 rounded-lg border border-[#C0392B]/20 bg-[#C0392B]/5 px-3.5 py-3">
          <TriangleAlert size={18} className="mt-0.5 shrink-0 text-[#C0392B]" />
          <p className="text-sm text-forest-dark">
            Are you sure you want to delete this subject?
            {subjectName && (
              <>
                {" "}
                <strong>{subjectName}</strong> will be removed and this can't be undone.
              </>
            )}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            type="button"
            className="flex-1 bg-[#C0392B] text-white hover:bg-[#a5311f]"
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting && <Loader2 size={16} className="animate-spin" />}
            {isDeleting ? "Deleting…" : "Delete"}
          </Button>
          <Button type="button" variant="outline" onClick={onCancel} disabled={isDeleting}>
            Cancel
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
