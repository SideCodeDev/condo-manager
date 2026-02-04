export class ApplicationError extends Error {
  constructor(readonly code: ErrorCode) {
    super(code);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export type ErrorCode =
  | "unauthenticated"
  | "unauthorized"
  | "unknown_error"
  | "max_condos_reached";
