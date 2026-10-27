import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const locales = ["en", "ar"];

function preferredLocale(request: NextRequest) {
  const header = request.headers.get("accept-language") ?? "";
  const languages = header.split(",").map((part) => part.split(";")[0]?.trim().toLowerCase() ?? "");
  for (const language of languages) {
    if (language.startsWith("ar")) return "ar";
    if (language.startsWith("en")) return "en";
  }
  return "en";
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasLocale = locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );
  if (hasLocale) return;

  const locale = preferredLocale(request);
  const nextPath = pathname === "/" ? `/${locale}` : `/${locale}${pathname}`;
  request.nextUrl.pathname = nextPath;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)"],
};
