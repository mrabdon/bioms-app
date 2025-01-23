import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { routeAccessMap } from "./lib/settings";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const matchers = Object.keys(routeAccessMap).map((route) => ({
  matcher: createRouteMatcher([route]),
  allowedRoles: routeAccessMap[route],
}));

console.log(matchers);

// original code ==================================
export default clerkMiddleware((auth, req) => {
  // if (isProtectedRoute(req)) auth().protect()

  const { sessionClaims } = auth();
  console.log(sessionClaims);

  const role = (sessionClaims?.metadata as { role?: string })?.role;

  for (const { matcher, allowedRoles } of matchers) {
    if (matcher(req) && !allowedRoles.includes(role!)) {
      return NextResponse.redirect(new URL(`/${role}`, req.url));
    }
  }
});

// export function middleware(req: NextRequest) {
//   const { pathname } = req.nextUrl;

//   // Example: Redirect all unauthenticated users to the dashboard
//   const isAuthenticated = req.cookies.get("authToken"); // Example check
//   if (!isAuthenticated && pathname !== "/login") {
//     return NextResponse.redirect(new URL("/admin", req.url));
//   }

//   // Ensure /users/invitation is not redirected
//   if (pathname.startsWith("/usermanagement/invitation")) {
//     return NextResponse.next();
//   }

//   return NextResponse.next();
// }

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
