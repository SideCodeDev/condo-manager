import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/onboarding",
]);

const isHomePage = createRouteMatcher(["/"]);

const apiEndpoints = createRouteMatcher(["/api(.*)", "/trpc(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  if (isPublicRoute(req) || apiEndpoints(req)) {
    return;
  }
  if (isHomePage(req)) {
    const { isAuthenticated } = await auth();
    if (isAuthenticated) {
      return NextResponse.redirect(new URL("/app", req.url));
    }
    return;
  }
  await auth.protect();

  const { orgId } = await auth();
  if (!orgId) {
    return NextResponse.redirect(new URL("/onboarding", req.url));
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
