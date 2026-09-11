-- Notes and To-Do feature. This migration is additive and preserves existing data.
CREATE TYPE "TodoPriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH');
CREATE TYPE "TodoStatus" AS ENUM ('PENDING', 'COMPLETED');
CREATE TYPE "TodoSource" AS ENUM ('ATTENDANCE', 'MANUAL');

CREATE TABLE "todos" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "priority" "TodoPriority" NOT NULL DEFAULT 'LOW',
    "status" "TodoStatus" NOT NULL DEFAULT 'PENDING',
    "subjectId" TEXT,
    "attendanceDate" DATE,
    "source" "TodoSource" NOT NULL DEFAULT 'MANUAL',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "todos_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "todos_userId_idx" ON "todos"("userId");
CREATE INDEX "todos_status_idx" ON "todos"("status");
CREATE INDEX "todos_priority_idx" ON "todos"("priority");
CREATE INDEX "todos_createdAt_idx" ON "todos"("createdAt");
CREATE INDEX "todos_userId_status_idx" ON "todos"("userId", "status");
CREATE INDEX "todos_subjectId_idx" ON "todos"("subjectId");

ALTER TABLE "todos" ADD CONSTRAINT "todos_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "todos" ADD CONSTRAINT "todos_subjectId_fkey"
FOREIGN KEY ("subjectId") REFERENCES "subjects"("id") ON DELETE SET NULL ON UPDATE CASCADE;
