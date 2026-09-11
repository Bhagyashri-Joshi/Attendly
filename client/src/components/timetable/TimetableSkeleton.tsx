export function TimetableSkeleton() {
  return (
    <div className="overflow-hidden rounded-card border border-border bg-white">
      <div className="grid min-w-[900px] grid-cols-[90px_repeat(7,minmax(115px,1fr))]">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={`head-${index}`} className="border-b border-r border-border p-3 last:border-r-0">
            <div className="h-4 animate-pulse rounded bg-light-green" />
          </div>
        ))}
        {Array.from({ length: 40 }).map((_, index) => (
          <div key={index} className="min-h-20 border-b border-r border-border p-2">
            {index % 9 === 4 && <div className="h-14 animate-pulse rounded-lg bg-light-green/70" />}
          </div>
        ))}
      </div>
    </div>
  );
}
