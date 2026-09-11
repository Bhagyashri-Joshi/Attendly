import { PrismaClient } from "@prisma/client";
import { isProduction } from "./env";

/**
 * Single shared Prisma Client instance for the whole app.
 *
 * In development, Node's module cache is bypassed by tools like
 * `tsx watch` on every file change, which would otherwise create a
 * new PrismaClient (and a new DB connection pool) on every reload.
 * Stashing it on `globalThis` avoids exhausting Postgres connections.
 */
declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
}

export const prisma =
  globalThis.__prisma ??
  new PrismaClient({
    log: isProduction ? ["error"] : ["error", "warn"],
  });

if (!isProduction) {
  globalThis.__prisma = prisma;
}
