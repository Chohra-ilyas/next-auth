import { NextResponse } from "next/server";
import authConfig from "./auth.config";
import NextAuth from "next-auth";

const { auth: middleware } = NextAuth(authConfig);

const authRoutes = ["/login", "/register"];
const protectedRoutes = ["/profile", "/"];

export default middleware((req) => {
  const { nextUrl } = req;
  const path = nextUrl.pathname;
  const isUserAuthenticated = Boolean(req.auth);
  if (!isUserAuthenticated && protectedRoutes.includes(path)) {
    return NextResponse.redirect(new URL("/login", nextUrl));
  }
  if (isUserAuthenticated && authRoutes.includes(path)) {
    return NextResponse.redirect(new URL("/profile", nextUrl));
  }
});

export const config = {
  matcher: ["/login", "/register", "/profile"],
};
