import { BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptySubjectsProps {
  onAdd: () => void;
}

export function EmptySubjects({ onAdd }: EmptySubjectsProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-card border border-dashed border-border bg-white px-6 py-16 text-center">
      <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-light-green text-forest">
        <BookOpen size={26} strokeWidth={1.75} />
      </div>
      <h2 className="font-display text-xl text-forest-dark">No subjects added yet.</h2>
      <p className="mt-2 max-w-sm text-sm text-muted">Start organizing your academic journey.</p>
      <Button className="mt-6" onClick={onAdd}>
        Add Your First Subject
      </Button>
    </div>
  );
}
