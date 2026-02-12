import { ConvexError } from "convex/values";

export class ApplicationError extends ConvexError<ErrorCode> {
  constructor(readonly code: ErrorCode) {
    super(code);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export type ErrorCode =
  | "unauthenticated"
  | "unauthorized"
  | "unknown_error"
  | "max_condos_reached"
  | "plan_not_found"
  | "user_has_no_orgs"
  | "org_not_found"
  | "checkout_session_failed";
