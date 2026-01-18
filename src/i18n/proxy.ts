import "server-only";
import Negotiator from "negotiator";
import { NextRequest, NextResponse } from "next/server";
import { Locale, locales } from "./translations";

export const cookieName = "APP_LOCALE";

export function getLocalizedResponse(req: NextRequest): NextResponse {
  const res = NextResponse.next();

  const negotiator = new Negotiator({
    headers: Object.fromEntries(req.headers),
  });

  const language = (negotiator.language(locales) as Locale | undefined) || "en";

  res.cookies.set(cookieName, language, { path: "/", httpOnly: true });
  return res;
}
