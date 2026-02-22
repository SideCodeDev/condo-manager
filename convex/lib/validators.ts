import { v } from "convex/values";

export const planSchema = v.union(
  v.literal("free"),
  v.literal("basic"),
  v.literal("pro"),
  v.literal("enterprise"),
);
