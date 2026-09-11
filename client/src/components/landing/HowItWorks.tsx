const steps = [
  { number: "01", title: "Create Account", description: "Sign up with your email in under a minute — no paperwork." },
  { number: "02", title: "Add Subjects", description: "List the courses you’re taking this semester, with colors to tell them apart." },
  { number: "03", title: "Create Timetable", description: "Slot each subject into your weekly schedule the way it actually runs." },
  { number: "04", title: "Track Attendance", description: "After each lecture, mark yourself present or absent in one tap." },
  { number: "05", title: "View Progress", description: "Check your percentage per subject and catch shortfalls before they matter." },
  { number: "06", title: "Manage Tasks", description: "Create academic tasks, organize what needs to be done, and mark them complete as you go." },
];

export function HowItWorks() {
  return <section id="how-it-works" className="bg-light-green"><div className="mx-auto max-w-6xl px-6 py-20"><div className="max-w-lg"><h2 className="font-display text-3xl text-forest-dark sm:text-4xl">How it works</h2><p className="mt-4 text-muted">Six simple steps between you and a semester you can actually stay on top of.</p></div><ol className="mt-12 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">{steps.map((step)=><li key={step.number}><span className="font-display text-2xl text-forest/50">{step.number}</span><h3 className="mt-3 font-display text-lg text-forest-dark">{step.title}</h3><p className="mt-2 text-sm leading-relaxed text-muted">{step.description}</p></li>)}</ol></div></section>;
}
