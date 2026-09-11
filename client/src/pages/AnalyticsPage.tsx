import { useEffect, useState } from "react";
import { AppLayout } from "@/layouts/AppLayout";
import { Button } from "@/components/ui/button";

import { OverallAnalyticsChart } from "@/components/analytics/OverallAnalyticsChart";
import { SubjectAnalyticsChart } from "@/components/analytics/SubjectAnalyticsChart";
import { SubjectComparisonChart } from "@/components/analytics/SubjectComparisonChart";
import { AnalyticsSummaryCards } from "@/components/analytics/AnalyticsSummaryCards";
import { AttendanceInsights } from "@/components/analytics/AttendanceInsights";
import { AnalyticsSkeleton } from "@/components/analytics/AnalyticsSkeleton";
import { AnalyticsEmptyState } from "@/components/analytics/AnalyticsEmptyState";

import {
  getOverallAnalytics,
  getSubjectAnalytics,
  getSubjectDetail,
} from "@/services/analyticsService";

import type {
  OverallAnalytics,
  SubjectAnalytics,
  SubjectDetail,
} from "@/types/analytics";

export function AnalyticsPage() {
  const [overall, setOverall] = useState<OverallAnalytics | null>(null);
  const [subjects, setSubjects] = useState<SubjectAnalytics[]>([]);
  const [detail, setDetail] = useState<SubjectDetail | null>(null);
  const [selected, setSelected] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = async () => {
    setLoading(true);
    setError(false);

    try {
      const [overallResponse, subjectsResponse] = await Promise.all([
        getOverallAnalytics(),
        getSubjectAnalytics(),
      ]);

      if (!overallResponse.data || !subjectsResponse.data) {
        throw new Error("Analytics data is unavailable");
      }

      setOverall(overallResponse.data);
      setSubjects(subjectsResponse.data);
    } catch (error) {
      console.error("Failed to load analytics:", error);

      setOverall(null);
      setSubjects([]);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  useEffect(() => {
    const loadSubjectDetail = async () => {
      if (!selected) {
        setDetail(null);
        return;
      }

      try {
        const response = await getSubjectDetail(selected);

        if (!response.data) {
          throw new Error("Subject analytics unavailable");
        }

        setDetail(response.data);
      } catch (error) {
        console.error("Failed to load subject analytics:", error);
        setDetail(null);
      }
    };

    void loadSubjectDetail();
  }, [selected]);

  return (
    <AppLayout>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <h1 className="font-display text-3xl text-forest-dark">
          Attendance Analytics
        </h1>

        <p className="mt-1 text-muted">
          Understand your attendance performance.
        </p>

        {loading ? (
          <div className="mt-8">
            <AnalyticsSkeleton />
          </div>
        ) : error ? (
          <div className="mt-8 text-center">
            <p>Unable to load analytics.</p>

            <Button onClick={load} className="mt-4">
              Retry
            </Button>
          </div>
        ) : overall && overall.totalLectures === 0 ? (
          <div className="mt-8">
            <AnalyticsEmptyState />
          </div>
        ) : overall ? (
          <div className="mt-8 space-y-6">
            <AnalyticsSummaryCards data={overall} />

            <div className="grid gap-6 lg:grid-cols-2">
              <OverallAnalyticsChart
                percentage={overall.overallPercentage}
                present={overall.totalPresent}
                absent={overall.totalAbsent}
                total={overall.totalLectures}
              />

              <section className="rounded-card border border-border bg-white p-6">
                <h2 className="font-display text-xl text-forest-dark">
                  Subject Attendance
                </h2>

                <select
                  value={selected}
                  onChange={(event) => setSelected(event.target.value)}
                  className="mt-4 w-full rounded-lg border border-border bg-white p-3"
                  aria-label="Select subject"
                >
                  <option value="">Select Subject</option>

                  {subjects.map((subject) => (
                    <option
                      value={subject.subjectId}
                      key={subject.subjectId}
                    >
                      {subject.name}
                    </option>
                  ))}
                </select>

                <div className="mt-4">
                  <SubjectAnalyticsChart data={detail} />
                </div>
              </section>
            </div>

            <SubjectComparisonChart subjects={subjects} />

            <AttendanceInsights
              overall={overall}
              subjects={subjects}
            />
          </div>
        ) : null}
      </div>
    </AppLayout>
  );
}