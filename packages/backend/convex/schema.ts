import { defineSchema } from "convex/server";
import { authSchema } from "./authProvider";
import { condoMember } from "./modules/condoMember/schema";
import { condos } from "./modules/condos/schema";
import { userSettings } from "./modules/userSettings/schema";

export default defineSchema({
  ...authSchema,
  condos,
  condoMember,
  userSettings,
});
