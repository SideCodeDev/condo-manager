import {
  billingSubscriptionItems,
  billingSubscriptions,
} from "./billing/schema";
import {
  organizationMemberships,
  organizationProvisioning,
  organizations,
} from "./organizations/schema";
import { users } from "./users/schema";

export const authSchema = {
  users,
  organizations,
  organizationMemberships,
  organizationProvisioning,
  billingSubscriptions,
  billingSubscriptionItems,
};
