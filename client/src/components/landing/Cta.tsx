import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function Cta() {
  return (
    <section className="mx-auto max-w-6xl px-6 pb-20">
      <div className="rounded-card bg-forest-dark px-8 py-14 text-center sm:px-16">
        <h2 className="font-display text-3xl text-cream sm:text-4xl">
          Ready to stop guessing your attendance?
        </h2>
        <p className="mx-auto mt-4 max-w-md text-cream/75">
          Set up your first timetable in a few minutes and let Attendly do
          the counting.
        </p>
        <div className="mt-8 flex justify-center">
          <Link to="/signup">
            <Button variant="secondary" size="lg">
              Get Started Free
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
