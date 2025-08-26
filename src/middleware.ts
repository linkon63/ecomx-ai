import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyTokenEdge } from './lib/auth';

export async function middleware(request: NextRequest) {
  console.log('Middleware - request headers:', request.headers);
  const { pathname } = request.nextUrl;

  console.log('Middleware - pathname @@@@@ 00:', pathname);
  // Check if the request is for admin routes
  if (pathname.startsWith('/api/admin') || pathname.startsWith('/admin')) {
      console.log('Middleware - pathname @@@@@ 01:', pathname);
    // Skip auth check for login page and login API
    if (pathname === '/admin/login' || pathname === '/api/auth/login') {
      console.log('Middleware - pathname @@@@@ 02:', pathname);
      return NextResponse.next();
    }

    // Get token from request
    const authHeader = request.headers.get('authorization');
    const cookieToken = request.cookies.get('auth-token')?.value;
    
    console.log('Middleware - pathname @@@@@ 03:', pathname);
    console.log('Middleware - authHeader:', authHeader);
    console.log('Middleware - cookieToken:', cookieToken);
    
    let token = null;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    } else if (cookieToken) {
      token = cookieToken;
    }

    console.log('Middleware - final token:', token ? 'present' : 'missing');

    if (!token) {
      console.log('Middleware - no token, redirecting to login');
      if (pathname.startsWith('/api/')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    // Verify token
    console.log('Middleware - verifying token... @@@@@ 04', token);
    const payload = await verifyTokenEdge(token);
    console.log('Middleware - token payload:', payload);
    
    if (!payload) {
      console.log('Middleware - token verification failed, redirecting to login');
      if (pathname.startsWith('/api/')) {
        return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
      }
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    // Check if user has admin or staff role
    if (payload.role !== 'ADMIN' && payload.role !== 'STAFF') {
      if (pathname.startsWith('/api/')) {
        return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
      }
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    // Add user info to headers for API routes
    if (pathname.startsWith('/api/')) {
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set('x-user-id', payload.userId);
      requestHeaders.set('x-user-email', payload.email);
      requestHeaders.set('x-user-role', payload.role);

      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/admin/:path*',
  ],
};
