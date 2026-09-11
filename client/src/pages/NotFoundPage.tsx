import { Link } from "react-router-dom";
import { ArrowLeft, Compass } from "lucide-react";
import { MainLayout } from "@/layouts/MainLayout";

export function NotFoundPage() {
  return (
    <MainLayout>
      <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-light-green text-forest">
          <Compass size={26} strokeWidth={1.75} />
        </div>
        <p className="font-display text-sm text-muted">404</p>
        <h1 className="mt-2 font-display text-3xl text-forest-dark sm:text-4xl">
          Page not found
        </h1>
        <p className="mt-4 max-w-sm text-muted">
          The page you're looking for doesn't exist or may have moved.
        </p>
        <Link
          to="/"
          className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-forest-dark hover:underline"
        >
          <ArrowLeft size={16} />
          Back to home
        </Link>
      </div>
    </MainLayout>
  );
}
