import { defineSchema } from "convex/server";
import {
  billingSubscriptionItems,
  billingSubscriptions,
} from "./modules/billing/schema";
import { condoMember } from "./modules/condoMember/schema";
import { condos } from "./modules/condos/schema";
import {
  organizationMemberships,
  organizationProvisioning,
  organizations,
} from "./modules/organizations/schema";
import { userSettings } from "./modules/userSettings/schema";
import { users } from "./modules/users/schema";

export default defineSchema({
  users,
  organizations,
  organizationMemberships,
  organizationProvisioning,
  billingSubscriptions,
  billingSubscriptionItems,
  condos,
  condoMember,
  userSettings,
});
