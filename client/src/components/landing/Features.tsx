import { CalendarClock, LineChart, ListChecks, ShieldCheck, BookOpen, ListTodo } from "lucide-react";

const features = [
  { icon: ListChecks, title: "Smart Attendance Tracking", description: "Mark yourself present or absent in seconds, and let Attendly keep the running tally for every subject." },
  { icon: CalendarClock, title: "Weekly Timetable", description: "Lay out your classes once and see exactly where you need to be, day by day, at a glance." },
  { icon: LineChart, title: "Visual Analytics", description: "Clear charts show your attendance trend over time, so you know when to course-correct." },
  { icon: BookOpen, title: "Subject Management", description: "Group lectures by subject with custom colors and targets that match how your semester is structured." },
  { icon: ListTodo, title: "To-Do List", description: "Organize your academic tasks, track what needs to be done, and mark tasks as completed." },
  { icon: ShieldCheck, title: "Secure Login", description: "Your academic data stays yours, protected behind a secure account from day one." },
];

export function Features() {
  return <section id="features" className="mx-auto max-w-6xl px-6 py-20"><div className="max-w-lg"><h2 className="font-display text-3xl text-forest-dark sm:text-4xl">Everything your semester needs, nothing it doesn't.</h2><p className="mt-4 text-muted">Six tools that work together so attendance and academic planning stop being a chore.</p></div><div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">{features.map((feature)=><div key={feature.title} className="rounded-card border border-border bg-white p-6 transition-colors hover:border-forest/30"><div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-light-green text-forest"><feature.icon size={20} strokeWidth={1.75}/></div><h3 className="font-display text-lg text-forest-dark">{feature.title}</h3><p className="mt-2 text-sm leading-relaxed text-muted">{feature.description}</p></div>)}</div></section>;
}
