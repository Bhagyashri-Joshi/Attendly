/**
 * Augments Express's Request type so `req.userId` is recognized
 * throughout the app once the `authenticate` middleware has run.
 */
declare namespace Express {
  export interface Request {
    userId?: string;
  }
}
