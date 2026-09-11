import { Clock3, MapPin, Pencil, Trash2 } from "lucide-react";
import type { TimetableLecture } from "@/types/timetable";
import { calculateDuration, formatTime } from "@/utils/timeUtils";

interface LectureCardProps {
  lecture: TimetableLecture;
  onEdit: () => void;
  onDelete: () => void;
}

function fallbackColor(value: string) {
  const palette = ["#224F10", "#4A6B3A", "#7A5C2E", "#486581", "#7D4E57", "#526D62"];
  let hash = 0;
  for (const char of value) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return palette[hash % palette.length];
}

export function LectureCard({ lecture, onEdit, onDelete }: LectureCardProps) {
  const accent = lecture.subject.color || fallbackColor(lecture.subjectId);

  return (
    <article
      className="group h-full min-h-0 min-w-0 overflow-hidden rounded-xl border border-border bg-white p-3 shadow-[0_8px_20px_-16px_rgba(24,58,11,0.55)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_14px_28px_-18px_rgba(24,58,11,0.65)] motion-reduce:transition-none motion-reduce:hover:translate-y-0"
      style={{ borderLeft: `4px solid ${accent}` }}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="truncate text-sm font-semibold text-forest-dark" title={lecture.subject.name}>
            {lecture.subject.name}
          </h3>
          {lecture.subject.code && <p className="mt-0.5 text-xs text-muted">{lecture.subject.code}</p>}
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <button type="button" onClick={onEdit} aria-label={`Edit ${lecture.subject.name} lecture`} className="rounded-md p-1.5 text-muted transition-colors hover:bg-light-green hover:text-forest focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest/40">
            <Pencil size={14} />
          </button>
          <button type="button" onClick={onDelete} aria-label={`Delete ${lecture.subject.name} lecture`} className="rounded-md p-1.5 text-muted transition-colors hover:bg-[#C0392B]/10 hover:text-[#C0392B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C0392B]/30">
            <Trash2 size={14} />
          </button>
        </div>
      </div>
      <div className="mt-2 space-y-1 overflow-hidden text-xs text-muted">
        <div className="flex min-w-0 items-center gap-1.5 whitespace-nowrap"><Clock3 className="shrink-0" size={12} />{formatTime(lecture.startTime)} – {formatTime(lecture.endTime)}</div>
        {lecture.room && <div className="flex min-w-0 items-center gap-1.5 truncate"><MapPin className="shrink-0" size={12} />{lecture.room}</div>}
        {calculateDuration(lecture.startTime, lecture.endTime) >= 120 && <p>{calculateDuration(lecture.startTime, lecture.endTime) / 60} hr session</p>}
      </div>
    </article>
  );
}
