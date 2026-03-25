import { NextRequest, NextResponse } from 'next/server';

// Protect the /history route
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the route is protected
  if (pathname.startsWith('/history')) {
    // For now, we'll allow access. When Neon Auth is fully configured,
    // check for authentication token here
    const token = request.cookies.get('auth-token')?.value;

    // In production, require an auth token only when explicitly enabled via
    // the `REQUIRE_HISTORY_AUTH` environment variable. This avoids blocking
    // access in deployments where auth isn't set up (e.g. preview deployments).
    if (!token && process.env.NODE_ENV === 'production' && process.env.REQUIRE_HISTORY_AUTH === 'true') {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/history/:path*'],
};
