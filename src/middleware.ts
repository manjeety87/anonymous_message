import { getToken } from "next-auth/jwt";
import { NextResponse, NextRequest } from "next/server";
export { default } from "next-auth/middleware";

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  console.log("token", token);

  const url = request.nextUrl;

  if (
    token &&
    (url.pathname.startsWith("/sign-in") ||
      url.pathname.startsWith("/sign-up") ||
      url.pathname.startsWith("/verify") ||
      url.pathname.startsWith("/"))
  ) {
    {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  // return NextResponse.redirect(new URL("/home", request.url));
  if (!token && url.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/sign-in", "/sign-up", "/dashboard/:path*", "/verify/:path*", "/"],
};
