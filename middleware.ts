import NextAuth from "next-auth";
import authConfig from "./auth.config";
import {
  apiAuthPrefix,
  authRoutes,
  DEFAULT_LOGIN_REDIRECT,
  publicRoutes,
} from "@/routes";

const { auth } = NextAuth(authConfig);

const isPublicorMarketingRoute = (pathname: string) => {
  return publicRoutes.includes(pathname) || pathname.startsWith("/marketing");
};

export default auth((req) => {
  const { nextUrl } = req;

  let callbackUrl: string = "";

  const isLoggedIn = !!req.auth;

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isPublicRoute = isPublicorMarketingRoute(nextUrl.pathname);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);

  // if (isApiAuthRoute) return null;
  if (isApiAuthRoute) return;

  if (isAuthRoute) {
    if (isLoggedIn) {
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
    // return null;
    return;
  }

  if (!isLoggedIn && !isPublicRoute) {
    callbackUrl = nextUrl.pathname;

    if (nextUrl.search) {
      callbackUrl += nextUrl.search;
    }

    const encodedCallbackUrl = encodeURIComponent(callbackUrl);

    return Response.redirect(
      new URL(`/auth/login?callbackUrl=${encodedCallbackUrl}`, nextUrl)
    );
  }

  // return null
  // return;
});

// Optionally, don't invoke Middleware on some paths
export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
