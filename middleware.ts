import { withAuth, type NextRequestWithAuth } from "next-auth/middleware";
import type { NextFetchEvent } from "next/server";

export default function middleware(request: NextRequestWithAuth, event: NextFetchEvent) {
  return withAuth(request, event);
}

export const config = {
  // Protect all routes starting with /admin, except /admin/login
  matcher: ["/admin/((?!login).*)"],
};