/**
 * Mirrors the server's SafeUser shape — never includes a password
 * or password hash.
 */
export interface User {
  id: string;
  name: string;
  email: string;
  profileImage: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AuthPayload {
  user: User;
  token: string;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}
