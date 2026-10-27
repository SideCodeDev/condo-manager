import { defineSchema } from "convex/server";
import { authSchema } from "./authProvider";
import { assets } from "./modules/assets/schema";
import { condoMember } from "./modules/condoMember/schema";
import { condos } from "./modules/condos/schema";
import { userSettings } from "./modules/userSettings/schema";
import { units } from "./modules/units/schema";

export default defineSchema({
  ...authSchema,
  assets,
  condos,
  condoMember,
  userSettings,
  units,
});
