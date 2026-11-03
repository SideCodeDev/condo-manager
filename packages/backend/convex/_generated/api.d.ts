/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as authProvider_billing_actions from "../authProvider/billing/actions.js";
import type * as authProvider_billing_mutations from "../authProvider/billing/mutations.js";
import type * as authProvider_index from "../authProvider/index.js";
import type * as authProvider_organizations_actions from "../authProvider/organizations/actions.js";
import type * as authProvider_organizations_mutations from "../authProvider/organizations/mutations.js";
import type * as authProvider_organizations_queries from "../authProvider/organizations/queries.js";
import type * as authProvider_users_currentUser from "../authProvider/users/currentUser.js";
import type * as authProvider_users_mutations from "../authProvider/users/mutations.js";
import type * as http from "../http.js";
import type * as lib_errors from "../lib/errors.js";
import type * as lib_functionReferences from "../lib/functionReferences.js";
import type * as lib_logging from "../lib/logging.js";
import type * as modules_assets_mutations from "../modules/assets/mutations.js";
import type * as modules_condoMember_actions from "../modules/condoMember/actions.js";
import type * as modules_condoMember_mutations from "../modules/condoMember/mutations.js";
import type * as modules_condoMember_queries from "../modules/condoMember/queries.js";
import type * as modules_condos_mutations from "../modules/condos/mutations.js";
import type * as modules_condos_queries from "../modules/condos/queries.js";
import type * as modules_units_mutations from "../modules/units/mutations.js";
import type * as modules_userSettings_mutations from "../modules/userSettings/mutations.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  "authProvider/billing/actions": typeof authProvider_billing_actions;
  "authProvider/billing/mutations": typeof authProvider_billing_mutations;
  "authProvider/index": typeof authProvider_index;
  "authProvider/organizations/actions": typeof authProvider_organizations_actions;
  "authProvider/organizations/mutations": typeof authProvider_organizations_mutations;
  "authProvider/organizations/queries": typeof authProvider_organizations_queries;
  "authProvider/users/currentUser": typeof authProvider_users_currentUser;
  "authProvider/users/mutations": typeof authProvider_users_mutations;
  http: typeof http;
  "lib/errors": typeof lib_errors;
  "lib/functionReferences": typeof lib_functionReferences;
  "lib/logging": typeof lib_logging;
  "modules/assets/mutations": typeof modules_assets_mutations;
  "modules/condoMember/actions": typeof modules_condoMember_actions;
  "modules/condoMember/mutations": typeof modules_condoMember_mutations;
  "modules/condoMember/queries": typeof modules_condoMember_queries;
  "modules/condos/mutations": typeof modules_condos_mutations;
  "modules/condos/queries": typeof modules_condos_queries;
  "modules/units/mutations": typeof modules_units_mutations;
  "modules/userSettings/mutations": typeof modules_userSettings_mutations;
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
