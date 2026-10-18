/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as http from "../http.js";
import type * as lib_errors from "../lib/errors.js";
import type * as lib_functionReferences from "../lib/functionReferences.js";
import type * as modules_billing_actions from "../modules/billing/actions.js";
import type * as modules_billing_mutations from "../modules/billing/mutations.js";
import type * as modules_billing_queries from "../modules/billing/queries.js";
import type * as modules_condos_mutations from "../modules/condos/mutations.js";
import type * as modules_condos_queries from "../modules/condos/queries.js";
import type * as modules_organizations_actions from "../modules/organizations/actions.js";
import type * as modules_organizations_mutations from "../modules/organizations/mutations.js";
import type * as modules_organizations_queries from "../modules/organizations/queries.js";
import type * as modules_userSettings_mutations from "../modules/userSettings/mutations.js";
import type * as modules_userSettings_queries from "../modules/userSettings/queries.js";
import type * as modules_users_mutations from "../modules/users/mutations.js";
import type * as modules_users_queries from "../modules/users/queries.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  http: typeof http;
  "lib/errors": typeof lib_errors;
  "lib/functionReferences": typeof lib_functionReferences;
  "modules/billing/actions": typeof modules_billing_actions;
  "modules/billing/mutations": typeof modules_billing_mutations;
  "modules/billing/queries": typeof modules_billing_queries;
  "modules/condos/mutations": typeof modules_condos_mutations;
  "modules/condos/queries": typeof modules_condos_queries;
  "modules/organizations/actions": typeof modules_organizations_actions;
  "modules/organizations/mutations": typeof modules_organizations_mutations;
  "modules/organizations/queries": typeof modules_organizations_queries;
  "modules/userSettings/mutations": typeof modules_userSettings_mutations;
  "modules/userSettings/queries": typeof modules_userSettings_queries;
  "modules/users/mutations": typeof modules_users_mutations;
  "modules/users/queries": typeof modules_users_queries;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
