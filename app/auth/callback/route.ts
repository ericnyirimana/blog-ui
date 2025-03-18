import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const token = requestUrl.searchParams.get("token");

  if (token) {
    // Set the token in a cookie or localStorage
    return NextResponse.redirect(`${requestUrl.origin}/posts`);
  }

  return NextResponse.redirect(`${requestUrl.origin}/login`);
}