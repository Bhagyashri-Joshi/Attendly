import { Pencil, Trash2 } from "lucide-react";
import type { Subject } from "@/types/subject";

interface SubjectCardProps {
  subject: Subject;
  onEdit: () => void;
  onDelete: () => void;
}

export function SubjectCard({ subject, onEdit, onDelete }: SubjectCardProps) {
  const color = subject.color || "#224F10";
  const details = [subject.code, subject.faculty].filter(Boolean).join(" · ");

  return (
    <div className="flex flex-col gap-4 rounded-card border border-border bg-white p-5">
      <div className="flex items-start gap-3">
        <span
          className="mt-1.5 h-3 w-3 shrink-0 rounded-full"
          style={{ backgroundColor: color }}
          aria-hidden="true"
        />
        <div className="min-w-0">
          <h3 className="truncate font-display text-lg text-forest-dark">{subject.name}</h3>
          <p className="mt-0.5 truncate text-sm text-muted">{details || "No details added"}</p>
        </div>
      </div>

      <div className="flex items-center justify-between rounded-lg bg-light-green/60 px-3 py-2">
        <span className="text-xs font-medium uppercase tracking-wide text-forest/70">Attendance</span>
        <span className="text-sm font-medium text-forest-dark">—</span>
      </div>

      <div className="flex items-center gap-2 border-t border-border pt-3">
        <button
          type="button"
          onClick={onEdit}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-sm font-medium text-forest-dark hover:bg-light-green"
        >
          <Pencil size={14} />
          Edit
        </button>
        <button
          type="button"
          onClick={onDelete}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-sm font-medium text-[#C0392B] hover:bg-[#C0392B]/10"
        >
          <Trash2 size={14} />
          Delete
        </button>
      </div>
    </div>
  );
}
