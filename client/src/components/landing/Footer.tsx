const columns = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "#features" },
      { label: "How It Works", href: "#how-it-works" },
      { label: "Dashboard Preview", href: "#dashboard-preview" },
    ],
  },
  {
    title: "Account",
    links: [
      { label: "Login", href: "/login" },
      { label: "Get Started", href: "/signup" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-white">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="flex flex-col gap-10 sm:flex-row sm:justify-between">
          <div className="max-w-xs">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-forest text-cream font-display text-sm">
                A
              </span>
              <span className="font-display text-lg text-forest-dark">Attendly</span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              Track every lecture. Stay ahead of your attendance.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:flex sm:gap-16">
            {columns.map((col) => (
              <div key={col.title}>
                <p className="text-sm font-medium text-forest-dark">{col.title}</p>
                <ul className="mt-3 flex flex-col gap-2.5">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className="text-sm text-muted transition-colors hover:text-forest-dark"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-border pt-6 text-xs text-muted sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} Attendly. All rights reserved.</p>
          <p>Made for students who'd rather be in class than in spreadsheets.</p>
        </div>
      </div>
    </footer>
  );
}
