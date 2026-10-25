---
applyTo: "packages/backend/**"
---

# Convex backend

- Convex is the source of application data and local projections; Clerk remains the source of truth for identities, organizations, memberships, and billing subscriptions.
- Keep schema definitions in `convex/schema.ts` and module schemas/functions in their domain folders. Never manually edit `convex/_generated/`; generated API and data-model types are maintained by Convex tooling.
- Validate all function arguments with Convex validators. Derive the caller from the authenticated Convex context, then verify organization membership and authorization server-side; never trust a client-provided organization ID by itself.
- Prefer indexed queries over unbounded filtering. Keep public functions thin and move trusted synchronization work into internal functions.
- Normalize nullable third-party payload fields before passing them to Convex validators: use `undefined` for absent optional values rather than `null`.
- Clerk webhook handlers must be idempotent because events may be repeated or arrive out of order. Use structured logs; do not add webhook-event persistence solely for logging or deduplication.
- Never commit secrets or place server credentials in client-visible configuration. Do not run `convex dev`, `convex deploy`, code generation, migrations, webhook replays, or data cleanup unless the user explicitly requests that exact action.
- Use `pnpm` from the repository root. The backend type check is `pnpm --filter @condo-manager/backend check-types`.
