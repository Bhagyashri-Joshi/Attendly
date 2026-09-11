export function SubjectsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-hidden="true">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="animate-pulse rounded-card border border-border bg-white p-5">
          <div className="flex items-start gap-3">
            <div className="mt-1.5 h-3 w-3 rounded-full bg-light-green" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-2/3 rounded bg-light-green" />
              <div className="h-3 w-1/2 rounded bg-light-green/70" />
            </div>
          </div>
          <div className="mt-4 h-8 rounded-lg bg-light-green/50" />
          <div className="mt-4 flex gap-2 border-t border-border pt-3">
            <div className="h-8 flex-1 rounded-lg bg-light-green/40" />
            <div className="h-8 flex-1 rounded-lg bg-light-green/40" />
          </div>
        </div>
      ))}
    </div>
  );
}
