/**
 * Public-facing user shape returned by the API. Deliberately excludes
 * passwordHash — this is the single source of truth for "what a user
 * object looks like outside the database layer," so it's impossible
 * to accidentally leak the hash by serializing a raw Prisma User.
 */
export interface SafeUser {
  id: string;
  name: string;
  email: string;
  profileImage: string | null;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Strips passwordHash (and any other internal-only fields) from a
 * Prisma User record before it's ever sent in an API response.
 */
export function toSafeUser(user: {
  id: string;
  name: string;
  email: string;
  profileImage: string | null;
  createdAt: Date;
  updatedAt: Date;
  passwordHash?: string;
}): SafeUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    profileImage: user.profileImage,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}
