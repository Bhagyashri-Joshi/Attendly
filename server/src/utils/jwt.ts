import jwt from "jsonwebtoken";
import type { SignOptions } from "jsonwebtoken";
import { env } from "../config/env";

export interface JwtPayload {
  userId: string;
}

/**
 * Signs a JWT for the given user id. The token is the sole proof of
 * authentication for this stateless-JWT architecture — anyone holding
 * a valid, unexpired token is treated as that user.
 */
export function signToken(payload: JwtPayload): string {
  return jwt.sign(payload, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn as SignOptions["expiresIn"],
  });
}

/**
 * Verifies a JWT and returns its decoded payload, or throws if the
 * token is missing, malformed, expired, or has an invalid signature.
 */
export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, env.jwtSecret) as JwtPayload;
}
