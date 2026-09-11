import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TimetablePreview } from "./TimetablePreview";

export function Hero() {
  return (
    <section id="home" className="mx-auto max-w-6xl px-6 pb-20 pt-16 sm:pt-24">
      <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
        <div>
          <div className="mb-6 inline-flex items-center gap-2 rounded-pill border border-border bg-white px-3.5 py-1.5 text-xs font-medium text-forest-dark">
            Built for students, by students
          </div>

          <h1 className="font-display text-[2.5rem] leading-[1.08] text-forest-dark sm:text-[3.25rem]">
            Never lose track of your attendance again.
          </h1>

          <p className="mt-6 max-w-md text-base leading-relaxed text-muted sm:text-lg">
            Manage your subjects, organize your timetable, and track every
            lecture — all in one simple dashboard.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link to="/signup">
              <Button size="lg">
                Get Started Free
                <ArrowRight size={16} />
              </Button>
            </Link>
            <a href="#features">
              <Button variant="outline" size="lg">
                Explore Features
              </Button>
            </a>
          </div>
        </div>

        <TimetablePreview />
      </div>
    </section>
  );
}
