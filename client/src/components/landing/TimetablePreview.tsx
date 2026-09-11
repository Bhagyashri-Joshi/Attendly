import { Check } from "lucide-react";

const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];

type Slot = {
  day: number; // index into days
  label: string;
  room: string;
  state: "attended" | "upcoming" | "empty";
};

const slots: Slot[] = [
  { day: 0, label: "Data Structures", room: "Room 204", state: "attended" },
  { day: 0, label: "Linear Algebra", room: "Room 118", state: "attended" },
  { day: 1, label: "Physics Lab", room: "Lab B", state: "attended" },
  { day: 2, label: "Data Structures", room: "Room 204", state: "upcoming" },
  { day: 3, label: "Economics", room: "Room 302", state: "empty" },
  { day: 3, label: "Physics Lab", room: "Lab B", state: "attended" },
  { day: 4, label: "Seminar", room: "Hall A", state: "upcoming" },
];

/**
 * A small, self-contained weekly-timetable illustration used as the
 * hero's visual centerpiece. Built from real UI (no external images),
 * echoing the app's core object: a student's weekly schedule.
 */
export function TimetablePreview() {
  return (
    <div className="w-full rounded-card border border-border bg-white p-5 shadow-[0_20px_50px_-25px_rgba(24,58,11,0.35)] transition-transform duration-300 ease-out motion-reduce:transition-none lg:hover:scale-[1.035] sm:p-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="font-display text-base text-forest-dark">This week</p>
          <p className="text-xs text-muted">7 lectures · 86% attendance</p>
        </div>
        <div className="flex items-center gap-1.5 rounded-pill bg-light-green px-3 py-1.5 text-xs font-medium text-forest-dark">
          <Check size={14} strokeWidth={2.5} />
          On track
        </div>
      </div>

      <div className="grid grid-cols-5 gap-2">
        {days.map((day) => (
          <div key={day} className="text-center text-xs font-medium text-muted">
            {day}
          </div>
        ))}
      </div>

      <div className="rule-line mt-2 grid grid-cols-5 gap-2 pb-1">
        {days.map((_, dayIndex) => (
          <div key={dayIndex} className="flex flex-col gap-2 pt-2">
            {slots
              .filter((s) => s.day === dayIndex)
              .map((slot, idx) => (
                <div
                  key={idx}
                  className={
                    slot.state === "attended"
                      ? "rounded-lg border border-forest/15 bg-light-green px-2 py-2"
                      : slot.state === "upcoming"
                      ? "rounded-lg border border-peach bg-peach/40 px-2 py-2"
                      : "rounded-lg border border-dashed border-border px-2 py-2"
                  }
                >
                  <p className="text-[11px] font-medium leading-tight text-forest-dark">
                    {slot.label}
                  </p>
                  <p className="text-[10px] leading-tight text-muted">{slot.room}</p>
                  {slot.state === "attended" && (
                    <Check size={12} className="mt-1 text-forest" strokeWidth={3} />
                  )}
                </div>
              ))}
          </div>
        ))}
      </div>
    </div>
  );
}
