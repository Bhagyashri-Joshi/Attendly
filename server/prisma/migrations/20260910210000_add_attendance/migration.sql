-- Phase 5: Attendance management. Additive migration; existing data is preserved.
CREATE TYPE "AttendanceStatus" AS ENUM ('PRESENT', 'ABSENT');

CREATE TABLE "attendance_records" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "subjectId" TEXT NOT NULL,
    "timetableLectureId" TEXT,
    "date" DATE NOT NULL,
    "status" "AttendanceStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "attendance_records_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "attendance_records_userId_idx" ON "attendance_records"("userId");
CREATE INDEX "attendance_records_subjectId_idx" ON "attendance_records"("subjectId");
CREATE INDEX "attendance_records_date_idx" ON "attendance_records"("date");
CREATE UNIQUE INDEX "attendance_records_user_lecture_date_key" ON "attendance_records"("userId", "timetableLectureId", "date") WHERE "timetableLectureId" IS NOT NULL;
ALTER TABLE "attendance_records" ADD CONSTRAINT "attendance_records_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "attendance_records" ADD CONSTRAINT "attendance_records_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "subjects"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "attendance_records" ADD CONSTRAINT "attendance_records_timetableLectureId_fkey" FOREIGN KEY ("timetableLectureId") REFERENCES "timetable_lectures"("id") ON DELETE SET NULL ON UPDATE CASCADE;
