const subjects = [
  { name: "Data Structures", attended: 27, total: 30, percent: 90 },
  { name: "Linear Algebra", attended: 21, total: 28, percent: 75 },
  { name: "Physics Lab", attended: 15, total: 16, percent: 94 },
  { name: "Economics", attended: 18, total: 26, percent: 69 },
];

export function DashboardPreview() {
  return (
    <section id="dashboard-preview" className="mx-auto max-w-6xl px-6 py-20">
      <div className="max-w-lg">
        <h2 className="font-display text-3xl text-forest-dark sm:text-4xl">
          Your semester, at a glance.
        </h2>
        <p className="mt-4 text-muted">
          A dashboard that shows exactly where you stand in every subject —
          no spreadsheets required.
        </p>
      </div>

      <div className="mt-12 overflow-hidden rounded-card border border-border bg-white transition-transform duration-300 ease-out motion-reduce:transition-none lg:hover:scale-[1.02]">
        <div className="flex items-center justify-between border-b border-border bg-cream px-6 py-4">
          <p className="font-display text-forest-dark">Attendance overview</p>
          <span className="rounded-pill bg-light-green px-3 py-1 text-xs font-medium text-forest-dark">
            Semester 4
          </span>
        </div>

        <div className="divide-y divide-border">
          {subjects.map((subject) => (
            <div
              key={subject.name}
              className="flex flex-col gap-3 px-6 py-5 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="sm:w-48">
                <p className="text-sm font-medium text-forest-dark">{subject.name}</p>
                <p className="text-xs text-muted">
                  {subject.attended} of {subject.total} lectures
                </p>
              </div>

              <div className="flex flex-1 items-center gap-3">
                <div className="h-2 flex-1 overflow-hidden rounded-pill bg-light-green">
                  <div
                    className={`h-full rounded-pill ${
                      subject.percent >= 75 ? "bg-forest" : "bg-peach-hover"
                    }`}
                    style={{ width: `${subject.percent}%` }}
                  />
                </div>
                <span className="w-10 text-right text-sm font-medium text-forest-dark">
                  {subject.percent}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
