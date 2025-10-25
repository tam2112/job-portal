import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtDecode } from 'jwt-decode';

// Paths that don't require authentication
const publicPaths = ['/sign-in', '/sign-up', '/recruiter/sign-in', '/recruiter/sign-up'];

interface DecodedToken {
    userId: string;
    role: string;
}

export async function middleware(request: NextRequest) {
    const token = request.cookies.get('token');

    // If user is logged in and trying to access public paths, redirect to home
    if (token && publicPaths.includes(request.nextUrl.pathname)) {
        try {
            const decoded = jwtDecode(token.value) as DecodedToken;

            // Redirect based on role
            if (decoded.role === 'recruiter') {
                return NextResponse.redirect(new URL('/dashboard', request.url));
            } else {
                return NextResponse.redirect(new URL('/', request.url));
            }
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            return NextResponse.redirect(new URL('/sign-in', request.url));
        }
    }

    // If no token and trying to access protected paths, redirect to sign-in
    if (!token && !publicPaths.includes(request.nextUrl.pathname)) {
        return NextResponse.redirect(new URL('/sign-in', request.url));
    }

    // If has token, check role-based access
    if (token) {
        try {
            // Decode token to get user role
            const decoded = jwtDecode(token.value) as DecodedToken;

            // Check if path starts with /dashboard
            if (request.nextUrl.pathname.startsWith('/dashboard')) {
                // Only allow recruiter role to access dashboard paths
                if (decoded.role !== 'recruiter') {
                    return NextResponse.redirect(new URL('/', request.url));
                }
            }
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            // If token is invalid, redirect to sign-in
            return NextResponse.redirect(new URL('/sign-in', request.url));
        }
    }

    return NextResponse.next();
}

// Update matcher to include admin paths
export const config = {
    matcher: [
        '/sign-in',
        '/sign-up',
        '/recruiter/sign-in',
        '/recruiter/sign-up',
        '/dashboard',
        '/dashboard/:path*', // Match all paths starting with /admin
    ],
};
