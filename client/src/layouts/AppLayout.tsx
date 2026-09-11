import { useEffect, useState, type ReactNode } from "react";
import { Menu, X } from "lucide-react";
import { Sidebar } from "@/components/layout/Sidebar";

/**
 * Shared shell for every authenticated page (Dashboard, Subjects, and
 * future Timetable/Attendance/Analytics pages). Renders a fixed
 * sidebar from the md breakpoint up, and a slide-in drawer with a
 * top bar below it.
 */
export function AppLayout({ children }: { children: ReactNode }) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    if (!drawerOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setDrawerOpen(false);
    }

    document.addEventListener("keydown", handleKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [drawerOpen]);

  return (
    <div className="min-h-screen bg-cream text-ink">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-border md:block">
        <Sidebar />
      </aside>

      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-border bg-cream/95 px-4 py-3 backdrop-blur md:hidden">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-forest text-cream font-display text-xs">
            A
          </span>
          <span className="font-display text-base text-forest-dark">Attendly</span>
        </div>
        <button
          type="button"
          onClick={() => setDrawerOpen(true)}
          aria-label="Open navigation menu"
          className="rounded-lg p-2 text-forest-dark hover:bg-light-green"
        >
          <Menu size={20} />
        </button>
      </header>

      {drawerOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="absolute inset-0 bg-ink/40"
            onClick={() => setDrawerOpen(false)}
            aria-hidden="true"
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
            className="absolute inset-y-0 left-0 w-72 max-w-[85%] bg-white shadow-xl"
          >
            <div className="flex justify-end p-3">
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                aria-label="Close navigation menu"
                className="rounded-lg p-2 text-muted hover:bg-light-green"
              >
                <X size={18} />
              </button>
            </div>
            <Sidebar onNavigate={() => setDrawerOpen(false)} />
          </div>
        </div>
      )}

      <main className="md:pl-64">{children}</main>
    </div>
  );
}
