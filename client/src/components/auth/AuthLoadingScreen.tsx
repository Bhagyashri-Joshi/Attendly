export function AuthLoadingScreen() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-cream">
      <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-forest text-cream font-display text-sm">
        A
      </span>
      <div
        className="h-5 w-5 animate-spin rounded-full border-2 border-forest/20 border-t-forest"
        role="status"
        aria-label="Checking your session"
      />
      <p className="text-sm text-muted">Checking your session…</p>
    </div>
  );
}
