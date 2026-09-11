-- Phase 4: Weekly timetable management.
-- This migration is additive and preserves all existing users and subjects.
CREATE TABLE "timetable_lectures" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "subjectId" TEXT NOT NULL,
    "dayOfWeek" TEXT NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "room" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "timetable_lectures_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "timetable_lectures_userId_idx" ON "timetable_lectures"("userId");
CREATE INDEX "timetable_lectures_subjectId_idx" ON "timetable_lectures"("subjectId");

ALTER TABLE "timetable_lectures"
ADD CONSTRAINT "timetable_lectures_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "timetable_lectures"
ADD CONSTRAINT "timetable_lectures_subjectId_fkey"
FOREIGN KEY ("subjectId") REFERENCES "subjects"("id") ON DELETE CASCADE ON UPDATE CASCADE;
