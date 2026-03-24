import { NextRequest, NextResponse } from 'next/server';

// Protect the /history route
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the route is protected
  if (pathname.startsWith('/history')) {
    // For now, we'll allow access. When Neon Auth is fully configured,
    // check for authentication token here
    const token = request.cookies.get('auth-token')?.value;

    if (!token && process.env.NODE_ENV === 'production') {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/history/:path*'],
};
