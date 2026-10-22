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
  | "checkout_session_failed"
  | "user_settings_not_found"
  | "cannot_create_condo"
  | "cannot_update_condo"
  | "condo_not_found"
  | "condo_membership_exists"
  | "uploaded_file_not_found"
  | "asset_type_mismatch"
  | "invalid_mime_type";
