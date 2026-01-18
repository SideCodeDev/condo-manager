import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getLocalizedResponse } from "./i18n/proxy";

const isPublicRoute = createRouteMatcher([
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/onboarding",
  "/",
]);

const apiEndpoints = createRouteMatcher(["/api(.*)", "/trpc(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  const res = getLocalizedResponse(req);
  if (isPublicRoute(req)) {
    return res;
  }

  await auth.protect();

  if (apiEndpoints(req)) {
    return res;
  }

  const { orgId } = await auth();
  if (!orgId) {
    return NextResponse.redirect(new URL("/onboarding", req.url));
  }
  return res;
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
