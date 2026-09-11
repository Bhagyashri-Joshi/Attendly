import { CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";

export function EmptyTimetable({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-card border border-border bg-white px-6 py-16 text-center">
      <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-light-green text-forest">
        <CalendarDays size={26} strokeWidth={1.75} />
      </div>
      <h2 className="font-display text-xl text-forest-dark">No lectures scheduled yet.</h2>
      <p className="mt-2 max-w-sm text-sm text-muted">Create your weekly timetable and organize your classes.</p>
      <Button className="mt-6" onClick={onAdd}>Add Your First Lecture</Button>
    </div>
  );
}
