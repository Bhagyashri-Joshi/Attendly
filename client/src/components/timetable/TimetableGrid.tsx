import { useMemo } from "react";
import { LectureCard } from "@/components/timetable/LectureCard";
import { TIMETABLE_DAYS, type TimetableDay, type TimetableLecture } from "@/types/timetable";
import { minutesToTime, timeToMinutes } from "@/utils/timeUtils";

const DAY_LABELS: Record<TimetableDay, string> = {
  MONDAY: "Monday",
  TUESDAY: "Tuesday",
  WEDNESDAY: "Wednesday",
  THURSDAY: "Thursday",
  FRIDAY: "Friday",
};

interface TimetableGridProps {
  lectures: TimetableLecture[];
  onEdit: (lecture: TimetableLecture) => void;
  onDelete: (lecture: TimetableLecture) => void;
}

const SLOT_MINUTES = 30;
const ROW_HEIGHT = 56;

function floorToSlot(minutes: number) {
  return Math.floor(minutes / SLOT_MINUTES) * SLOT_MINUTES;
}

function ceilToSlot(minutes: number) {
  return Math.ceil(minutes / SLOT_MINUTES) * SLOT_MINUTES;
}

export function TimetableGrid({ lectures, onEdit, onDelete }: TimetableGridProps) {
  const timeline = useMemo(() => {
    const start = floorToSlot(Math.min(...lectures.map((lecture) => timeToMinutes(lecture.startTime))));
    const end = ceilToSlot(Math.max(...lectures.map((lecture) => timeToMinutes(lecture.endTime))));
    return Array.from({ length: Math.max(1, (end - start) / SLOT_MINUTES) }, (_, index) => start + index * SLOT_MINUTES);
  }, [lectures]);

  const timelineStart = timeline[0];
  const startIndex = (time: string) => Math.floor((timeToMinutes(time) - timelineStart) / SLOT_MINUTES);
  const endIndex = (time: string) => Math.ceil((timeToMinutes(time) - timelineStart) / SLOT_MINUTES);
  const gridRows = ["auto", ...timeline.map(() => `${ROW_HEIGHT}px`)].join(" ");

  return (
    <div className="overflow-x-auto rounded-card border border-border bg-white shadow-[0_16px_40px_-30px_rgba(24,58,11,0.35)]">
      <div
        className="grid min-w-[980px]"
        style={{
          gridTemplateColumns: "80px repeat(5, minmax(160px, 1fr))",
          gridTemplateRows: gridRows,
        }}
      >
        <div className="sticky left-0 z-30 border-b border-r border-border bg-cream p-4 text-xs font-semibold uppercase tracking-wide text-muted">
          Time
        </div>
        {TIMETABLE_DAYS.map((day) => (
          <div key={day} className="border-b border-r border-border bg-light-green/60 p-4 text-center text-sm font-semibold text-forest-dark last:border-r-0">
            {DAY_LABELS[day]}
          </div>
        ))}

        {timeline.flatMap((startMinutes, slotIndex) => [
          <div
            key={`time-${startMinutes}`}
            className="sticky left-0 z-20 border-b border-r border-border bg-cream/45 px-3 py-2 text-xs font-semibold text-muted"
            style={{ gridColumn: 1, gridRow: slotIndex + 2 }}
          >
            {minutesToTime(startMinutes)}
          </div>,
          ...TIMETABLE_DAYS.map((day) => (
            <div
              key={`${day}-${startMinutes}`}
              aria-hidden="true"
              className={`border-b border-r border-border/80 ${slotIndex % 2 === 0 ? "bg-white" : "bg-[#FCFDFB]"} last:border-r-0`}
              style={{ gridColumn: TIMETABLE_DAYS.indexOf(day) + 2, gridRow: slotIndex + 2 }}
            />
          )),
        ])}

        {lectures.map((lecture) => {
          const start = startIndex(lecture.startTime);
          const end = endIndex(lecture.endTime);
          const dayColumn = TIMETABLE_DAYS.indexOf(lecture.dayOfWeek) + 2;
          if (start < 0 || end <= start || dayColumn < 2) return null;

          return (
            <div
              key={lecture.id}
              className="z-10 min-w-0 p-1.5 sm:p-2"
              style={{ gridColumn: dayColumn, gridRow: `${start + 2} / ${end + 2}` }}
            >
              <LectureCard lecture={lecture} onEdit={() => onEdit(lecture)} onDelete={() => onDelete(lecture)} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
